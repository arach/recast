import { loadJSTemplate } from './js-template-registry'
// Import all utilities from the package
import * as templateUtils from '@reflow/template-utils'
// Import local parameter utilities
import { params, iso } from './template-utils'

// Font utility function that templates expect
const fontUtils = {
  get: (fontStyle: string, customFont?: string) => {
    const fontMap: Record<string, string> = {
      'modern': 'Inter, system-ui, sans-serif',
      'tech': 'JetBrains Mono, Consolas, monospace',
      'elegant': 'Playfair Display, serif',
      'bold': 'Montserrat, sans-serif',
      'minimal': 'Inter, system-ui, sans-serif',
      'silkscreen': 'Silkscreen, monospace',
      'orbitron': 'Orbitron, sans-serif',
      'doto': 'DotGothic16, monospace',
      'custom': customFont || 'Arial, sans-serif'
    };
    
    return fontMap[fontStyle] || fontMap['modern'];
  }
};

// Create utils object using only package exports with modern namespaced functions
const utils = {
  // All utilities from the package
  background: templateUtils.background,
  color: templateUtils.color,
  canvas: templateUtils.canvas,
  math: templateUtils.math,
  shape: templateUtils.shape,
  debug: templateUtils.debug,
  font: fontUtils,
  // Local parameter utilities
  params,
  // Isometric utilities
  iso
}

// Flatten nested parameter structures into a single level object
function flattenParameters(params: any) {
  const flatParams = {
    ...params,
    // Flatten custom parameters first (lowest priority)
    ...(params.custom || {}),
    // Flatten content parameters
    ...(params.content || {}),
    // Flatten style parameters  
    ...(params.style || {}),
    // Flatten core parameters last (highest priority)
    ...(params.core || {})
  };
  
  // Legacy support: also check customParameters
  if (params.customParameters) {
    Object.keys(params.customParameters).forEach(key => {
      if (flatParams[key] === undefined) {
        flatParams[key] = params.customParameters[key];
      }
    });
  }
  
  return flatParams;
}

// Initialize utils on first use
let utilsInitialized = false

function initializeUtils() {
  if (utilsInitialized) return
  
  // Utils are now directly available, no need to set them
  utilsInitialized = true
}

/**
 * Generate visualization using JavaScript templates
 */
export async function generateJSVisualization(
  ctx: CanvasRenderingContext2D,
  templateId: string,
  parameters: any,
  currentTime: number,
  width: number,
  height: number
) {
  try {
    // Ensure utils are initialized
    initializeUtils()
    
    // Remove excessive logging
    // console.log(`generateJSVisualization called for template: ${templateId}`)
    
    const template = await loadJSTemplate(templateId)
    
    if (!template) {
      throw new Error(`Template '${templateId}' not found`)
    }
    
    // Flatten the parameters before passing to template
    const flattenedParams = flattenParameters(parameters)
    
    // Execute the template code
    // Strip export statements from template code as Function constructor doesn't support ES modules
    let codeToExecute = template.code
    
    // Remove all export statements
    codeToExecute = codeToExecute.replace(/export\s+(const|function)\s+/g, '')
    codeToExecute = codeToExecute.replace(/export\s*\{[^}]*\}\s*;?/g, '')
    
    // Create a function from the cleaned template code and execute it
    const executeTemplate = new Function(
      'ctx', 'width', 'height', 'params', 'time', 'utils',
      codeToExecute + '\n\n' +
      '// Try both function names for compatibility\n' +
      'if (typeof drawVisualization === "function") {\n' +
      '  drawVisualization(ctx, width, height, params, time, utils);\n' +
      '} else if (typeof draw === "function") {\n' +
      '  draw(ctx, width, height, params, time, utils);\n' +
      '} else {\n' +
      '  console.error("No draw function found in template");\n' +
      '}'
    )
    
    executeTemplate(ctx, width, height, flattenedParams, currentTime, utils)
    
  } catch (error) {
    console.error('Error executing JS visualization:', error)
    // Draw error indicator
    ctx.fillStyle = '#fee2e2'
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = '#dc2626'
    ctx.font = '14px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('Template Error', width / 2, height / 2)
    ctx.font = '12px sans-serif'
    ctx.fillText(error.message, width / 2, height / 2 + 20)
  }
}