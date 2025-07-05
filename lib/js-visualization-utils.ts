import { loadTemplate, templateRegistry } from './template-registry'

// Flatten nested parameter structures into a single level object
function flattenParameters(params: any) {
  const flatParams = {
    ...params,
    // Flatten core parameters
    ...(params.core || {}),
    // Flatten style parameters  
    ...(params.style || {}),
    // Flatten custom parameters
    ...(params.custom || {}),
    // Flatten content parameters
    ...(params.content || {})
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

// Initialize utils if not already done
let utilsInitialized = false

async function initializeUtils() {
  if (utilsInitialized) return
  
  try {
    // Load the utils from the public directory
    const response = await fetch('/template-utils.js')
    if (!response.ok) {
      throw new Error('Failed to load template utils')
    }
    
    const utilsCode = await response.text()
    
    // Create a function that returns the utils
    const getUtils = new Function(utilsCode + '; return templateUtils;')
    const utils = getUtils()
    
    templateRegistry.setUtils(utils)
    utilsInitialized = true
  } catch (error) {
    console.error('Failed to initialize template utils:', error)
    throw error
  }
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
    await initializeUtils()
    
    const template = await loadTemplate(templateId)
    
    if (!template) {
      throw new Error(`Template '${templateId}' not found`)
    }
    
    // Flatten the parameters before passing to template
    const flattenedParams = flattenParameters(parameters)
    
    // The template registry already handles parameter merging and execution
    template.drawVisualization(ctx, width, height, flattenedParams, currentTime)
    
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