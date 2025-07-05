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
}

// Our 5 core JS templates
const JS_TEMPLATES: JSTemplateInfo[] = [
  { id: 'wave-bars', name: '🌊 Wave Bars', description: 'Dynamic wave patterns with customizable bar styles', category: 'generative' },
  { id: 'audio-bars', name: '🎵 Audio Bars', description: 'Animated equalizer-style bars', category: 'generative' },
  { id: 'wordmark', name: '✏️ Wordmark', description: 'Text-based logo with animations', category: 'typography' },
  { id: 'letter-mark', name: '🔤 Letter Mark', description: 'Single or multi-letter logos with containers', category: 'typography' },
  { id: 'prism', name: '💎 Prism', description: '3D isometric geometric shapes', category: 'geometric' }
]

export async function getAllJSTemplates(): Promise<JSTemplateInfo[]> {
  return JS_TEMPLATES
}

export async function loadJSTemplate(templateId: string) {
  // This will be handled by the existing template-registry.js
  // We're just providing the list of available templates
  const { loadTemplate } = await import('./template-registry.js')
  return loadTemplate(templateId)
}

export async function getJSTemplateDefaultParams(templateId: string): Promise<any> {
  const template = await loadJSTemplate(templateId)
  return template?.defaultParams || {}
}