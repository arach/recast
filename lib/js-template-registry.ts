/**
 * JavaScript Template Registry
 * 
 * This registry only handles the new pure JavaScript templates
 */

export interface JSTemplateInfo {
  id: string
  name: string
  description: string
  category?: string
  parameters?: any
}

// Template files list - this could be auto-discovered in the future
const templateFiles = [
  'wave-bars', 'audio-bars', 'liquid-flow', 'network-constellation', 'pulse-spotify', 'quantum-field',
  'wordmark', 'letter-mark',
  'prism', 'circles', 'triangles', 'golden-circle', 'minimal-shape', 'crystal-lattice',
  'neon-glow', 'organic-bark', 'sophisticated-strokes',
  'tech-tower', 'exploded-tech-stack', 'data-platform-stack', 'data-platform-test', 'isometric-wordmark',
  'simple-test'
];

// Auto-discover templates from the templates-js directory
async function discoverTemplates(): Promise<JSTemplateInfo[]> {
  const templates: JSTemplateInfo[] = [];
  
  for (const templateId of templateFiles) {
    try {
      const template = await loadJSTemplate(templateId);
      if (template?.metadata) {
        templates.push({
          id: templateId,
          name: template.metadata.name || templateId,
          description: template.metadata.description || 'No description available',
          category: template.metadata.category || 'uncategorized',
          parameters: template.parameters
        });
      }
    } catch (error) {
      console.warn(`Failed to load template ${templateId}:`, error);
      // Still add the template with basic info so it doesn't disappear
      templates.push({
        id: templateId,
        name: templateId,
        description: 'Error loading template metadata',
        category: 'error',
        parameters: {}
      });
    }
  }
  
  return templates;
}

// Cached templates - cleared when templates change
let cachedTemplates: JSTemplateInfo[] | null = null;

// Clear cache when needed (for development)
export function clearTemplateCache() {
  cachedTemplates = null;
}

export async function getAllJSTemplates(): Promise<JSTemplateInfo[]> {
  // Use cached templates if available
  if (cachedTemplates) {
    return cachedTemplates;
  }
  
  // For server-side, load parameters from template modules
  if (typeof window === 'undefined') {
    const templatesWithParams = await Promise.all(
      templateFiles.map(async (templateId) => {
        try {
          const path = await import('path');
          const templatePath = path.default.join(process.cwd(), 'templates-js', `${templateId}.js`);
          // Dynamic import the template module to get parameters and metadata
          const templateModule = await import(templatePath);
          return {
            id: templateId,
            name: templateModule.metadata?.name || templateId,
            description: templateModule.metadata?.description || 'No description available',
            category: templateModule.metadata?.category || 'uncategorized',
            parameters: templateModule.parameters || {}
          };
        } catch (error) {
          console.warn(`Failed to load template module for ${templateId}:`, error);
          return {
            id: templateId,
            name: templateId,
            description: 'Error loading template',
            category: 'error',
            parameters: {}
          };
        }
      })
    );
    
    // Cache the results
    cachedTemplates = templatesWithParams;
    return templatesWithParams;
  }
  
  // For client-side, discover templates dynamically
  cachedTemplates = await discoverTemplates();
  return cachedTemplates;
}

export async function loadJSTemplate(templateId: string) {
  try {
    // Fetch the template code
    const codeResponse = await fetch(`/api/templates-js/${templateId}.js`)
    if (!codeResponse.ok) {
      throw new Error(`Failed to load template code: ${templateId}`)
    }
    const code = await codeResponse.text()
    
    // Parse the code to extract parameters and metadata using regex
    // This is a client-side approach since we can't use dynamic imports in the browser
    
    // Try multiple patterns for parameters
    let parametersMatch = code.match(/export const parameters = ([\s\S]*?);\s*(?=\/\/|export|$)/)
    
    // If not found, try non-exported parameters (like prism.js)
    if (!parametersMatch) {
      parametersMatch = code.match(/const parameters = ([\s\S]*?);\s*(?=\/\/|export|$)/)
    }
    
    const metadataMatch = code.match(/export const metadata = ([\s\S]*?);\s*(?=\/\/|export|$)/)
    
    let parameters = {}
    let metadata = {}
    
    try {
      if (parametersMatch) {
        const paramText = parametersMatch[1]
        
        // Try to parse as JavaScript object literal first (most robust approach)
        try {
          // Create a safe evaluation context
          const helperFunctions = {
            slider: (def: any, min: any, max: any, step: any, label?: string, unit?: string, opts = {}) => ({ 
              type: "slider", default: def, min, max, step, label, unit, ...opts 
            }),
            select: (def: any, options: any, label?: string, opts = {}) => ({ 
              type: "select", default: def, options, label, ...opts 
            }),
            toggle: (def: any, label?: string, opts = {}) => ({ 
              type: "toggle", default: def, label, ...opts 
            }),
            text: (def: any, label?: string, opts = {}) => ({ 
              type: "text", default: def, label, ...opts 
            })
          }
          
          // Create function to evaluate the parameters object
          const evalFunction = new Function(
            'slider', 'select', 'toggle', 'text',
            `return ${paramText}`
          )
          
          parameters = evalFunction(
            helperFunctions.slider,
            helperFunctions.select, 
            helperFunctions.toggle,
            helperFunctions.text
          )
          
        } catch (evalError) {
          console.warn(`Failed to evaluate parameters object for ${templateId}, falling back to regex parsing:`, evalError)
          
          // Fallback: regex-based parsing for different formats
          
          // Format 1: Helper functions (slider, select, toggle)
          const helperMatches = paramText.match(/(\w+):\s*(\w+)\([^)]+\)/g)
          if (helperMatches && helperMatches.length > 0) {
            parameters = helperMatches.reduce((acc, match) => {
              const keyMatch = match.match(/(\w+):/)
              if (keyMatch) {
                // Extract just the default value for now
                const defaultMatch = match.match(/\w+\([^,]*,\s*([^,)]+)/)
                if (defaultMatch) {
                  try {
                    acc[keyMatch[1]] = { default: JSON.parse(defaultMatch[1].trim()) }
                  } catch {
                    acc[keyMatch[1]] = { default: defaultMatch[1].trim().replace(/["']/g, '') }
                  }
                }
              }
              return acc
            }, {} as any)
          }
          
          // Format 2: Object literal with default ({ default: value, ... })
          const objectMatches = paramText.match(/(\w+):\s*\{[^}]+\}/g)
          if (objectMatches && objectMatches.length > 0) {
            objectMatches.forEach(match => {
              const keyMatch = match.match(/(\w+):/)
              const defaultMatch = match.match(/default:\s*([^,}]+)/)
              if (keyMatch && defaultMatch) {
                try {
                  parameters[keyMatch[1]] = { default: JSON.parse(defaultMatch[1].trim()) }
                } catch {
                  parameters[keyMatch[1]] = { default: defaultMatch[1].trim().replace(/["']/g, '') }
                }
              }
            })
          }
        }
      }
      
      if (metadataMatch) {
        try {
          // Try to evaluate metadata object as JavaScript first
          const metadataFunction = new Function(`return ${metadataMatch[1]}`)
          metadata = metadataFunction()
        } catch (evalError) {
          console.warn(`Failed to evaluate metadata for ${templateId}, extracting basic info:`, evalError.message)
          // Extract basic metadata fields manually
          const metadataText = metadataMatch[1]
          
          const nameMatch = metadataText.match(/name:\s*["']([^"']+)["']/)
          const descMatch = metadataText.match(/description:\s*["']([^"']+)["']/)
          const categoryMatch = metadataText.match(/category:\s*["']([^"']+)["']/)
          
          metadata = {
            name: nameMatch ? nameMatch[1] : templateId,
            description: descMatch ? descMatch[1] : '',
            category: categoryMatch ? categoryMatch[1] : 'other'
          }
        }
      }
    } catch (parseError) {
      console.warn(`Failed to parse template exports for ${templateId}:`, parseError)
    }
    
    // Create template object
    const template = {
      id: templateId,
      name: metadata.name || templateId,
      description: metadata.description || '',
      code,
      parameters,
      defaultParams: Object.entries(parameters).reduce((acc, [key, param]: [string, any]) => {
        acc[key] = param.default
        return acc
      }, {} as Record<string, any>),
      metadata,
      execute: async (ctx: CanvasRenderingContext2D, width: number, height: number, params: any, time: number) => {
        // This will be handled by the visualization system
        console.log('Template execution should be handled by visualization system')
      }
    }
    
    return template
  } catch (error) {
    console.error(`Failed to load template ${templateId}:`, error)
    return null
  }
}

export async function getJSTemplateDefaultParams(templateId: string): Promise<any> {
  const template = await loadJSTemplate(templateId)
  return template?.defaultParams || {}
}