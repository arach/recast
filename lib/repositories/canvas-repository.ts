import { BaseRepository } from './base-repository';
import type { Canvas } from '@/app/api/_lib/types';

export interface CanvasFilters {
  search?: string;
  layout?: Canvas['layout'];
  isPublic?: boolean;
  limit?: number;
  offset?: number;
}

export class CanvasRepository extends BaseRepository<Canvas> {
  constructor(storage: any) {
    super(storage, 'canvas');
  }
  
  /**
   * Find canvases with filters
   */
  async findAllWithFilters(filters?: CanvasFilters): Promise<Canvas[]> {
    let canvases = await this.findAll({
      limit: filters?.limit,
      offset: filters?.offset,
    });
    
    // Apply filters
    if (filters) {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        canvases = canvases.filter(c => 
          c.name.toLowerCase().includes(searchLower) ||
          (c.description && c.description.toLowerCase().includes(searchLower))
        );
      }
      
      if (filters.layout) {
        canvases = canvases.filter(c => c.layout === filters.layout);
      }
      
      if (filters.isPublic !== undefined) {
        canvases = canvases.filter(c => c.metadata.isPublic === filters.isPublic);
      }
    }
    
    // Sort by last updated
    canvases.sort((a, b) => {
      const aDate = new Date(a.metadata.updatedAt).getTime();
      const bDate = new Date(b.metadata.updatedAt).getTime();
      return bDate - aDate; // Newest first
    });
    
    return canvases;
  }
  
  /**
   * Update last accessed time
   */
  async touchCanvas(id: string): Promise<void> {
    const canvas = await this.findById(id);
    if (canvas) {
      canvas.metadata.lastAccessedAt = new Date().toISOString();
      await this.update(id, canvas);
    }
  }
  
  /**
   * Add a logo to a canvas
   */
  async addLogo(canvasId: string, logo: Canvas['logos'][0]): Promise<Canvas | null> {
    const canvas = await this.findById(canvasId);
    if (!canvas) return null;
    
    canvas.logos.push(logo);
    canvas.metadata.updatedAt = new Date().toISOString();
    
    return this.update(canvasId, canvas);
  }
  
  /**
   * Update a logo in a canvas
   */
  async updateLogo(canvasId: string, logoId: string, updates: Partial<Canvas['logos'][0]>): Promise<Canvas | null> {
    const canvas = await this.findById(canvasId);
    if (!canvas) return null;
    
    const logoIndex = canvas.logos.findIndex(l => l.id === logoId);
    if (logoIndex === -1) return null;
    
    canvas.logos[logoIndex] = { ...canvas.logos[logoIndex], ...updates };
    canvas.metadata.updatedAt = new Date().toISOString();
    
    return this.update(canvasId, canvas);
  }
  
  /**
   * Remove a logo from a canvas
   */
  async removeLogo(canvasId: string, logoId: string): Promise<Canvas | null> {
    const canvas = await this.findById(canvasId);
    if (!canvas) return null;
    
    const originalLength = canvas.logos.length;
    canvas.logos = canvas.logos.filter(l => l.id !== logoId);
    
    if (canvas.logos.length === originalLength) return null; // Logo not found
    
    canvas.metadata.updatedAt = new Date().toISOString();
    
    return this.update(canvasId, canvas);
  }
  
  /**
   * Generate a share token for a canvas
   */
  async generateShareToken(canvasId: string): Promise<string | null> {
    const canvas = await this.findById(canvasId);
    if (!canvas) return null;
    
    const token = this.generateId(); // Reuse ID generation for tokens
    canvas.metadata.shareToken = token;
    
    await this.update(canvasId, canvas);
    return token;
  }
  
  /**
   * Find canvas by share token
   */
  async findByShareToken(token: string): Promise<Canvas | null> {
    const canvases = await this.findAll();
    return canvases.find(c => c.metadata.shareToken === token) || null;
  }
}