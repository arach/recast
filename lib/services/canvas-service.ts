import { nanoid } from 'nanoid';
import type { Canvas, LogoInstance } from '@/app/api/_lib/types';
import type { CreateCanvasDto, UpdateCanvasDto, AddLogoDto, UpdateLogoDto } from '@/app/api/_lib/validation';
import { CanvasRepository } from '@/lib/repositories/canvas-repository';
import { TemplateRepository } from '@/lib/repositories/template-repository';
import { NotFoundError, ValidationError } from '@/app/api/_lib/errors';

export class CanvasService {
  constructor(
    private canvasRepo: CanvasRepository,
    private templateRepo: TemplateRepository
  ) {}
  
  /**
   * Create a new canvas
   */
  async createCanvas(data: CreateCanvasDto): Promise<Canvas> {
    const canvas: Canvas = {
      id: `canvas-${nanoid(8)}`,
      name: data.name,
      description: data.description,
      layout: data.layout || 'grid',
      logos: [],
      settings: data.settings || {},
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastAccessedAt: new Date().toISOString(),
        isPublic: false,
      },
    };
    
    return this.canvasRepo.create(canvas);
  }
  
  /**
   * Add a logo to a canvas
   */
  async addLogoToCanvas(canvasId: string, data: AddLogoDto): Promise<LogoInstance> {
    // Verify canvas exists
    const canvas = await this.canvasRepo.findById(canvasId);
    if (!canvas) {
      throw new NotFoundError(`Canvas '${canvasId}' not found`);
    }
    
    // Verify template exists
    const template = await this.templateRepo.findByIdWithBuiltin(data.templateId);
    if (!template) {
      throw new NotFoundError(`Template '${data.templateId}' not found`);
    }
    
    // Validate parameters against template schema
    const validatedParams = await this.validateParameters(template.parameters, data.parameters);
    
    // Calculate position for new logo
    const position = data.position || this.calculateNextPosition(canvas);
    
    const logo: LogoInstance = {
      id: `logo-${nanoid(8)}`,
      templateId: data.templateId,
      parameters: validatedParams,
      position,
      size: { width: 180, height: 180 },
      metadata: data.metadata || {},
    };
    
    // Add logo to canvas
    await this.canvasRepo.addLogo(canvasId, logo);
    
    return logo;
  }
  
  /**
   * Update a logo in a canvas
   */
  async updateLogoInCanvas(canvasId: string, logoId: string, updates: UpdateLogoDto): Promise<LogoInstance> {
    const canvas = await this.canvasRepo.findById(canvasId);
    if (!canvas) {
      throw new NotFoundError(`Canvas '${canvasId}' not found`);
    }
    
    const logo = canvas.logos.find(l => l.id === logoId);
    if (!logo) {
      throw new NotFoundError(`Logo '${logoId}' not found in canvas`);
    }
    
    // If parameters are being updated, validate them
    if (updates.parameters) {
      const template = await this.templateRepo.findByIdWithBuiltin(logo.templateId);
      if (!template) {
        throw new NotFoundError(`Template '${logo.templateId}' not found`);
      }
      
      updates.parameters = await this.validateParameters(template.parameters, {
        ...logo.parameters,
        ...updates.parameters,
      });
    }
    
    const updatedCanvas = await this.canvasRepo.updateLogo(canvasId, logoId, updates);
    if (!updatedCanvas) {
      throw new Error('Failed to update logo');
    }
    
    const updatedLogo = updatedCanvas.logos.find(l => l.id === logoId);
    if (!updatedLogo) {
      throw new Error('Updated logo not found');
    }
    
    return updatedLogo;
  }
  
  /**
   * Remove a logo from a canvas
   */
  async removeLogoFromCanvas(canvasId: string, logoId: string): Promise<void> {
    const canvas = await this.canvasRepo.findById(canvasId);
    if (!canvas) {
      throw new NotFoundError(`Canvas '${canvasId}' not found`);
    }
    
    const result = await this.canvasRepo.removeLogo(canvasId, logoId);
    if (!result) {
      throw new NotFoundError(`Logo '${logoId}' not found in canvas`);
    }
  }
  
  /**
   * Duplicate a logo within a canvas
   */
  async duplicateLogo(canvasId: string, logoId: string, parameterChanges?: Record<string, any>): Promise<LogoInstance> {
    const canvas = await this.canvasRepo.findById(canvasId);
    if (!canvas) {
      throw new NotFoundError(`Canvas '${canvasId}' not found`);
    }
    
    const originalLogo = canvas.logos.find(l => l.id === logoId);
    if (!originalLogo) {
      throw new NotFoundError(`Logo '${logoId}' not found in canvas`);
    }
    
    // Merge parameters
    const newParameters = { ...originalLogo.parameters, ...parameterChanges };
    
    // Validate parameters
    const template = await this.templateRepo.findByIdWithBuiltin(originalLogo.templateId);
    if (!template) {
      throw new NotFoundError(`Template '${originalLogo.templateId}' not found`);
    }
    
    const validatedParams = await this.validateParameters(template.parameters, newParameters);
    
    // Create new logo with offset position
    const newLogo: LogoInstance = {
      id: `logo-${nanoid(8)}`,
      templateId: originalLogo.templateId,
      parameters: validatedParams,
      position: {
        x: originalLogo.position.x + 200,
        y: originalLogo.position.y,
      },
      size: { ...originalLogo.size },
      rotation: originalLogo.rotation,
      locked: false,
      metadata: {
        name: `${originalLogo.metadata?.name || 'Logo'} (Copy)`,
        notes: `Duplicated from ${logoId}`,
      },
    };
    
    await this.canvasRepo.addLogo(canvasId, newLogo);
    
    return newLogo;
  }
  
  /**
   * Generate a shareable link for a canvas
   */
  async generateShareLink(canvasId: string): Promise<string> {
    const canvas = await this.canvasRepo.findById(canvasId);
    if (!canvas) {
      throw new NotFoundError(`Canvas '${canvasId}' not found`);
    }
    
    const token = await this.canvasRepo.generateShareToken(canvasId);
    if (!token) {
      throw new Error('Failed to generate share token');
    }
    
    return `/share/${token}`;
  }
  
  /**
   * Get canvas by share token
   */
  async getCanvasByShareToken(token: string): Promise<Canvas> {
    const canvas = await this.canvasRepo.findByShareToken(token);
    if (!canvas) {
      throw new NotFoundError('Invalid share link');
    }
    
    // Update last accessed time
    await this.canvasRepo.touchCanvas(canvas.id);
    
    return canvas;
  }
  
  /**
   * Validate parameters against template schema
   */
  private async validateParameters(
    schema: Record<string, any>,
    params: Record<string, any>
  ): Promise<Record<string, any>> {
    const validated: Record<string, any> = {};
    
    for (const [key, definition] of Object.entries(schema)) {
      const value = params[key] ?? definition.default;
      
      // Check required
      if (definition.required && value === undefined) {
        throw new ValidationError(`Parameter '${key}' is required`);
      }
      
      // Type validation
      if (value !== undefined) {
        switch (definition.type) {
          case 'number':
            if (typeof value !== 'number') {
              throw new ValidationError(`Parameter '${key}' must be a number`);
            }
            // Range validation
            if (definition.range) {
              const [min, max] = definition.range;
              if (value < min || value > max) {
                throw new ValidationError(`Parameter '${key}' must be between ${min} and ${max}`);
              }
            }
            break;
            
          case 'string':
            if (typeof value !== 'string') {
              throw new ValidationError(`Parameter '${key}' must be a string`);
            }
            break;
            
          case 'boolean':
            if (typeof value !== 'boolean') {
              throw new ValidationError(`Parameter '${key}' must be a boolean`);
            }
            break;
            
          case 'select':
            if (definition.options && !definition.options.includes(value)) {
              throw new ValidationError(`Parameter '${key}' must be one of: ${definition.options.join(', ')}`);
            }
            break;
        }
        
        validated[key] = value;
      }
    }
    
    return validated;
  }
  
  /**
   * Calculate next position for a logo based on layout
   */
  private calculateNextPosition(canvas: Canvas): { x: number; y: number } {
    if (canvas.logos.length === 0) {
      return { x: 50, y: 50 };
    }
    
    const settings = canvas.settings;
    const gridSize = settings.gridSize || 200;
    const spacing = settings.spacing || 20;
    const cellSize = gridSize + spacing;
    
    switch (canvas.layout) {
      case 'grid': {
        // Calculate next grid position
        const cols = Math.floor(800 / cellSize); // Assuming 800px width
        const index = canvas.logos.length;
        const col = index % cols;
        const row = Math.floor(index / cols);
        
        return {
          x: 50 + (col * cellSize),
          y: 50 + (row * cellSize),
        };
      }
      
      case 'row': {
        // Place in a horizontal row
        const lastLogo = canvas.logos[canvas.logos.length - 1];
        return {
          x: lastLogo.position.x + cellSize,
          y: 50,
        };
      }
      
      case 'column': {
        // Place in a vertical column
        const lastLogo = canvas.logos[canvas.logos.length - 1];
        return {
          x: 50,
          y: lastLogo.position.y + cellSize,
        };
      }
      
      case 'freeform':
      default: {
        // Place at a random position within bounds
        return {
          x: 50 + Math.random() * 700,
          y: 50 + Math.random() * 500,
        };
      }
    }
  }
}