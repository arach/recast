import { loadTemplate, templateRegistry } from './template-registry'
import { utils } from '@reflow/template-utils'

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

// Initialize utils on first use
let utilsInitialized = false

function initializeUtils() {
  if (utilsInitialized) return
  
  // Set the imported utils directly
  templateRegistry.setUtils(utils)
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