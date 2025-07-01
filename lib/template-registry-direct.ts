/**
 * Direct Template Registry
 * 
 * Simple registry of available templates without conversion overhead.
 * This replaces the theme-converter for basic template discovery.
 */

// List of all available template IDs
export const AVAILABLE_TEMPLATES = [
  'wave-bars',
  'audio-bars', 
  'apex-vercel',
  'prism-google',
  'pulse-spotify',
  'spinning-triangles',
  'infinity-loops',
  'network-constellation',
  'brand-network',
  'luxury-brand',
  'premium-kinetic',
  'sophisticated-strokes',
  'border-effects',
  'nexus-ai-brand',
  'terra-eco-brand',
  'volt-electric-brand',
  'clean-triangle',
  'golden-circle',
  'smart-hexagon',
  'organic-bark',
  'crystal-blocks',
  'crystal-lattice',
  'dynamic-diamond',
  'hand-sketch',
  'letter-mark',
  'liquid-flow',
  'minimal-line',
  'minimal-shape',
  'neon-glow',
  'quantum-field',
  'simple-prism',
  'wordmark',
  'architectural-grid'
] as const;

export type TemplateId = typeof AVAILABLE_TEMPLATES[number];

export interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  defaultParams: Record<string, any>;
  code: string;
}

/**
 * Load a single template directly
 */
export async function loadTemplate(templateId: string): Promise<TemplateInfo | null> {
  try {
    const template = await import(`@/templates/${templateId}`);
    
    if (!template || !template.code) {
      console.error('❌ Template not found or missing code:', templateId);
      return null;
    }
    
    return {
      id: template.id || templateId,
      name: template.name || template.metadata?.name || templateId,
      description: template.description || template.metadata?.description || '',
      defaultParams: template.defaultParams || template.metadata?.defaultParams || {},
      code: template.code
    };
  } catch (error) {
    console.error('❌ Error loading template:', templateId, error);
    return null;
  }
}

/**
 * Get basic info for all templates (without loading full code)
 */
export async function getAllTemplateInfo(): Promise<TemplateInfo[]> {
  const templateInfos: TemplateInfo[] = [];
  
  // For now, load templates that we know are converted
  const convertedTemplates = ['wave-bars'];
  
  for (const templateId of convertedTemplates) {
    try {
      const info = await loadTemplate(templateId);
      if (info) {
        templateInfos.push(info);
      }
    } catch (error) {
      console.error('❌ Failed to load template info for:', templateId, error);
    }
  }
  
  // For templates not yet converted, provide basic info
  const remainingTemplates = AVAILABLE_TEMPLATES.filter(id => !convertedTemplates.includes(id));
  
  for (const templateId of remainingTemplates) {
    templateInfos.push({
      id: templateId,
      name: templateId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: `${templateId} template (not yet converted)`,
      defaultParams: {},
      code: '' // Empty until converted
    });
  }
  
  return templateInfos;
}