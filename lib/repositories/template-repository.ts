import { BaseRepository } from './base-repository';
import type { Template } from '@/app/api/_lib/types';
import type { TemplateFilters } from '@/app/api/_lib/validation';
import { getAllJSTemplates } from '@/lib/js-template-registry';

export class TemplateRepository extends BaseRepository<Template> {
  constructor(storage: any) {
    super(storage, 'template');
  }
  
  /**
   * Find templates with filters, including built-in templates
   */
  async findAllWithFilters(filters?: TemplateFilters): Promise<Template[]> {
    // Get custom templates from storage
    const customTemplates = await this.findAll();
    
    // Get built-in templates
    const builtinTemplates = await this.getBuiltinTemplates();
    
    // Combine all templates
    let allTemplates = [...builtinTemplates, ...customTemplates];
    
    // Apply filters
    if (filters) {
      if (filters.category) {
        allTemplates = allTemplates.filter(t => t.category === filters.category);
      }
      
      if (filters.builtin !== undefined) {
        allTemplates = allTemplates.filter(t => t.builtin === filters.builtin);
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        allTemplates = allTemplates.filter(t => 
          t.name.toLowerCase().includes(searchLower) ||
          t.description.toLowerCase().includes(searchLower) ||
          t.metadata.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
      
      if (filters.tags && filters.tags.length > 0) {
        allTemplates = allTemplates.filter(t =>
          filters.tags!.some(tag => t.metadata.tags.includes(tag))
        );
      }
    }
    
    // Sort
    allTemplates.sort((a, b) => {
      const aDate = new Date(a.metadata.updatedAt).getTime();
      const bDate = new Date(b.metadata.updatedAt).getTime();
      return bDate - aDate; // Newest first
    });
    
    // Pagination
    const page = filters?.page || 1;
    const perPage = filters?.perPage || 20;
    const start = (page - 1) * perPage;
    const end = start + perPage;
    
    return allTemplates.slice(start, end);
  }
  
  /**
   * Get total count with filters
   */
  async countWithFilters(filters?: TemplateFilters): Promise<number> {
    const all = await this.findAllWithFilters({ ...filters, page: 1, perPage: 1000 });
    return all.length;
  }
  
  /**
   * Find by ID, including built-in templates
   */
  async findByIdWithBuiltin(id: string): Promise<Template | null> {
    // Check custom templates first
    const custom = await this.findById(id);
    if (custom) return custom;
    
    // Check built-in templates
    const builtinTemplates = await this.getBuiltinTemplates();
    return builtinTemplates.find(t => t.id === id) || null;
  }
  
  /**
   * Get all built-in templates
   */
  private async getBuiltinTemplates(): Promise<Template[]> {
    const jsTemplates = await getAllJSTemplates();
    
    return jsTemplates.map(jsTemplate => {
      // Convert parameters to API format
      const parameters: Record<string, any> = {};
      if (jsTemplate.parameters) {
        Object.entries(jsTemplate.parameters).forEach(([key, param]: [string, any]) => {
          parameters[key] = {
            type: this.mapParameterType(param.type),
            default: param.default,
            required: param.required || false,
            range: param.type === 'slider' ? [param.min || 0, param.max || 100, param.step || 1] : undefined,
            options: param.options?.map((opt: any) => typeof opt === 'string' ? opt : opt.value),
            description: param.label || key,
          };
        });
      }
      
      return {
        id: jsTemplate.id,
        name: jsTemplate.name,
        description: jsTemplate.description || '',
        category: this.inferCategory(jsTemplate.id),
        builtin: true,
        code: undefined, // Built-in templates don't expose code
        parameters,
        metadata: {
          version: '1.0.0',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
          tags: this.inferTags(jsTemplate.id),
        },
      };
    });
  }
  
  /**
   * Map parameter types from template format to API format
   */
  private mapParameterType(type: string): 'number' | 'string' | 'boolean' | 'color' | 'select' {
    switch (type) {
      case 'slider':
        return 'number';
      case 'text':
        return 'string';
      case 'toggle':
        return 'boolean';
      case 'color':
        return 'color';
      case 'select':
        return 'select';
      default:
        return 'string';
    }
  }
  
  /**
   * Infer category from template ID
   */
  private inferCategory(templateId: string): Template['category'] {
    if (templateId.includes('letter') || templateId.includes('word')) {
      return 'typography';
    }
    if (templateId.includes('organic') || templateId.includes('liquid') || templateId.includes('bark')) {
      return 'organic';
    }
    if (templateId.includes('crystal') || templateId.includes('prism') || templateId.includes('minimal')) {
      return 'geometric';
    }
    return 'abstract';
  }
  
  /**
   * Infer tags from template ID
   */
  private inferTags(templateId: string): string[] {
    const tags: string[] = [];
    
    if (templateId.includes('animated')) tags.push('animated');
    if (templateId.includes('3d')) tags.push('3d');
    if (templateId.includes('minimal')) tags.push('minimal');
    if (templateId.includes('colorful')) tags.push('colorful');
    if (templateId.includes('gradient')) tags.push('gradient');
    if (templateId.includes('neon')) tags.push('neon');
    
    return tags;
  }
}