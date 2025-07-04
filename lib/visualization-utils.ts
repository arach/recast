import { applyUniversalBackground, adjustColor, hexToHsl, flattenParameters } from './template-utils'

export function generateVisualization(
  ctx: CanvasRenderingContext2D,
  code: string,
  parameters: any,
  currentTime: number,
  width: number,
  height: number
) {
  try {
    // Use the shared parameter flattening utility
    const flatParams = flattenParameters(parameters)
    
    // Remove export and import statements - they can't be used in Function constructor
    let cleanCode = code
      // Remove ALL import statements (including type imports)
      .replace(/import\s+.*?from\s+['"].*?['"];?\s*/g, '')
      // Remove simple export { ... } statements
      .replace(/export\s*{\s*[^}]+\s*};?/g, '')
      // Remove export const { ... } = metadata (destructuring)
      .replace(/export\s+const\s*{\s*[^}]+\s*}\s*=\s*metadata\s*;?/g, '')
      // Convert export const/function to just const/function
      .replace(/export\s+const\s+/g, 'const ')
      .replace(/export\s+function\s+/g, 'function ')
      .replace(/export\s+default\s+/g, '')
      // Remove TypeScript type annotations from function parameters
      // This handles: (ctx: CanvasRenderingContext2D, width: number, ...) => (ctx, width, ...)
      .replace(/(\w+)\s*:\s*[A-Za-z_]\w*(?:<[^>]+>)?(?:\[\])?/g, '$1')
      // Remove interface/type declarations
      .replace(/^(interface|type)\s+\w+\s*=?\s*{[^}]*}\s*;?\s*$/gm, '');
    
    // Create utilities object for dependency injection
    const utils = {
      applyUniversalBackground,
      adjustColor,
      hexToHsl
    };
    
    // Create a wrapper function that includes the template code
    const wrapperCode = `
      ${cleanCode}
      
      // Call the drawVisualization function with utils
      if (typeof drawVisualization === 'function') {
        drawVisualization(ctx, width, height, params, currentTime, utils);
      } else {
        throw new Error('drawVisualization function not found in template');
      }
    `;
    
    // Create the function and execute it with utils
    const executeTemplate = new Function('ctx', 'width', 'height', 'params', 'currentTime', 'utils', wrapperCode);
    executeTemplate(ctx, width, height, flatParams, currentTime, utils);
    
  } catch (error) {
    console.error('Error executing visualization:', error)
    console.error('Full error:', error.message)
    console.error('Code that failed:', code.substring(0, 500) + '...');
    console.error('Clean code preview:', cleanCode.substring(0, 500) + '...');
    console.error('Wrapper code:', wrapperCode.substring(0, 1000) + '...');
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