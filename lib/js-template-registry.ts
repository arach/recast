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
  { id: 'sophisticated-strokes', name: '🎨 Sophisticated Strokes', description: 'Artistic brush strokes with calligraphy effects', category: 'artistic' }
]

export async function getAllJSTemplates(): Promise<JSTemplateInfo[]> {
  // For server-side, load parameters from files
  if (typeof window === 'undefined') {
    const templatesWithParams = await Promise.all(
      JS_TEMPLATES.map(async (template) => {
        try {
          const fs = await import('fs/promises');
          const path = await import('path');
          const paramsPath = path.default.join(process.cwd(), 'templates-js', `${template.id}.params.json`);
          const paramsData = await fs.default.readFile(paramsPath, 'utf-8');
          const parsed = JSON.parse(paramsData);
          return {
            ...template,
            parameters: parsed.parameters || {}
          };
        } catch (error) {
          console.warn(`Failed to load parameters for ${template.id}:`, error);
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
    // Fetch the template parameters
    const paramsResponse = await fetch(`/api/templates-js/${templateId}.params.json`)
    if (!paramsResponse.ok) {
      throw new Error(`Failed to load template parameters: ${templateId}`)
    }
    const paramsData = await paramsResponse.json()
    
    // Fetch the template code
    const codeResponse = await fetch(`/api/templates-js/${templateId}.js`)
    if (!codeResponse.ok) {
      throw new Error(`Failed to load template code: ${templateId}`)
    }
    const code = await codeResponse.text()
    
    // Create template object
    const template = {
      id: templateId,
      name: paramsData.metadata?.name || templateId,
      description: paramsData.metadata?.description || '',
      code,
      parameters: paramsData.parameters || {},
      defaultParams: Object.entries(paramsData.parameters || {}).reduce((acc, [key, param]: [string, any]) => {
        acc[key] = param.default
        return acc
      }, {} as Record<string, any>),
      metadata: paramsData.metadata || {},
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