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

// Our JS templates
const JS_TEMPLATES: JSTemplateInfo[] = [
  // Generative
  { id: 'wave-bars', name: '🌊 Wave Bars', description: 'Dynamic wave patterns with customizable bar styles', category: 'generative' },
  { id: 'audio-bars', name: '🎵 Audio Bars', description: 'Animated equalizer-style bars', category: 'generative' },
  { id: 'liquid-flow', name: '💧 Liquid Flow', description: 'Fluid dynamics simulation with color gradients', category: 'generative' },
  { id: 'network-constellation', name: '🌐 Network Constellation', description: 'Connected nodes with dynamic particles', category: 'generative' },
  { id: 'pulse-spotify', name: '🎧 Pulse Spotify', description: 'Pulsing circles with orbital elements', category: 'generative' },
  { id: 'quantum-field', name: '⚛️ Quantum Field', description: 'Quantum mechanics visualization with wave functions', category: 'generative' },
  
  // Typography
  { id: 'wordmark', name: '✏️ Wordmark', description: 'Text-based logo with animations', category: 'typography' },
  { id: 'letter-mark', name: '🔤 Letter Mark', description: 'Single or multi-letter logos with containers', category: 'typography' },
  
  // Geometric
  { id: 'prism', name: '💎 Prism', description: '3D isometric geometric shapes', category: 'geometric' },
  { id: 'circles', name: '⭕ Circles', description: 'Pulsing circles, orbital patterns, and nested rings', category: 'geometric' },
  { id: 'triangles', name: '🔺 Triangles', description: 'Spinning triangles, constellation patterns, and geometric formations', category: 'geometric' },
  { id: 'golden-circle', name: '🟡 Golden Circle', description: 'Golden ratio based circular designs', category: 'geometric' },
  { id: 'minimal-shape', name: '⬜ Minimal Shape', description: 'Simple geometric shapes with clean aesthetics', category: 'geometric' },
  { id: 'crystal-lattice', name: '💠 Crystal Lattice', description: 'Crystalline structures with light refraction', category: 'geometric' },
  
  // Artistic
  { id: 'neon-glow', name: '✨ Neon Glow', description: 'Glowing neon effects with electric pulses', category: 'artistic' },
  { id: 'organic-bark', name: '🌳 Organic Bark', description: 'Natural wood textures with growth patterns', category: 'artistic' },
  { id: 'sophisticated-strokes', name: '🎨 Sophisticated Strokes', description: 'Artistic brush strokes with calligraphy effects', category: 'artistic' },
  
  // Isometric
  { id: 'tech-tower', name: '🏢 Tech Tower', description: 'Isometric tech building with animated glowing windows', category: 'isometric' },
  { id: 'exploded-tech-stack', name: '🏗️ Exploded Tech Stack', description: 'Multi-layer architecture visualization with animated layer separation', category: 'isometric' },
  { id: 'data-platform-stack', name: '📊 Data Platform Stack', description: 'Animated data platform architecture inspired by modern analytics stacks', category: 'isometric' },
  { id: 'data-platform-test', name: '📊 Data Platform Test', description: 'Simple test template to debug isometric utilities', category: 'isometric' },
  { id: 'simple-test', name: '⚡ Simple Test', description: 'Minimal test template with no parameters', category: 'test' }
]

export async function getAllJSTemplates(): Promise<JSTemplateInfo[]> {
  // For server-side, load parameters from template modules
  if (typeof window === 'undefined') {
    const templatesWithParams = await Promise.all(
      JS_TEMPLATES.map(async (template) => {
        try {
          const path = await import('path');
          const templatePath = path.default.join(process.cwd(), 'templates-js', `${template.id}.js`);
          // Dynamic import the template module to get parameters and metadata
          const templateModule = await import(templatePath);
          return {
            ...template,
            parameters: templateModule.parameters || {},
            name: templateModule.metadata?.name || template.name,
            description: templateModule.metadata?.description || template.description,
            category: templateModule.metadata?.category || template.category
          };
        } catch (error) {
          console.warn(`Failed to load template module for ${template.id}:`, error);
          return template;
        }
      })
    );
    return templatesWithParams;
  }
  
  // For client-side, return basic info
  return JS_TEMPLATES;
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
            })
          }
          
          // Create function to evaluate the parameters object
          const evalFunction = new Function(
            'slider', 'select', 'toggle',
            `return ${paramText}`
          )
          
          parameters = evalFunction(
            helperFunctions.slider,
            helperFunctions.select, 
            helperFunctions.toggle
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