import { applyUniversalBackground, adjustColor, hexToHsl, flattenParameters } from './template-utils'
import { compileTypeScript } from './swc-compiler'

export async function generateVisualization(
  ctx: CanvasRenderingContext2D,
  code: string,
  parameters: any,
  currentTime: number,
  width: number,
  height: number
) {
  let cleanCode: string = '';
  
  try {
    // Use the shared parameter flattening utility
    const flatParams = flattenParameters(parameters)
    
    // Create a safe execution environment
    // First, check if this is old-style code with PARAMETERS object
    const isOldStyle = code.includes('const PARAMETERS = {') || code.includes('function drawVisualization(ctx, width, height, params, generator, time)');
    
    
    if (isOldStyle) {
      // Handle old-style code (from localStorage)
      cleanCode = code
        // Quote reserved keywords in object keys
        .replace(/\b(default|class|function|return|const|let|var|if|else|for|while|do|switch|case|break|continue|new|this|super|import|export|try|catch|finally|throw|typeof|instanceof|in|of|void|delete|yield|async|await)(\s*):/g, '"$1"$2:');
    } else {
      // Handle new-style TypeScript template code
      cleanCode = code
        // Remove all imports - handle both 'import type' and regular imports
        .replace(/^import\s+(?:type\s+)?.*?(?:from\s+['"].*?['"])?;?\s*$/gm, '')
        // Remove any remaining import lines
        .replace(/^.*import.*$/gm, '')
        // Remove export statements but keep the content
        .replace(/^export\s+(?:const|let|var)\s+/gm, 'const ')
        .replace(/^export\s+function\s+/gm, 'function ')
        .replace(/^export\s+\{[^}]*\};?\s*$/gm, '')
        // Remove TypeScript type annotations more carefully
        // 1. Remove interface declarations (multiline)
        .replace(/^interface\s+\w+\s*\{[\s\S]*?\n\}/gm, '')
        // 2. Remove type declarations (multiline) - TEMPORARILY DISABLED
        // .replace(/^type\s+\w+\s*=[\s\S]*?(?=\n(?:const|let|var|function|export|$))/gm, '')
        // 3. Clean function signatures - handle both multi-line and single-line
        .replace(/function\s+(\w+)\s*\(([^)]*)\)(\s*:\s*[^{]+)?/g, (match, funcName, params, returnType) => {
          // Handle parameters that may contain type annotations
          const cleanParams = params
            .split(',')
            .map(param => {
              // Extract just the parameter name (before colon)
              const trimmed = param.trim();
              const colonIndex = trimmed.indexOf(':');
              if (colonIndex > -1) {
                return trimmed.substring(0, colonIndex).trim();
              }
              return trimmed;
            })
            .filter(p => p)
            .join(', ');
          return `function ${funcName}(${cleanParams})`;
        })
        // 3b. Also handle arrow functions with type annotations
        .replace(/const\s+(\w+)\s*=\s*\(([^)]*)\)(\s*:\s*[^=]+)?\s*=>/g, (match, funcName, params, returnType) => {
          const cleanParams = params
            .split(',')
            .map(param => {
              const trimmed = param.trim();
              const colonIndex = trimmed.indexOf(':');
              if (colonIndex > -1) {
                return trimmed.substring(0, colonIndex).trim();
              }
              return trimmed;
            })
            .filter(p => p)
            .join(', ');
          return `const ${funcName} = (${cleanParams}) =>`;
        })
        // 4. Remove type annotations from variable declarations
        // Match: const/let/var <spaces> <name> <spaces> : <spaces> <type> <spaces> =
        // Keep: const/let/var <spaces> <name> <spaces> =
        .replace(/(const|let|var)(\s+)(\w+)(\s*):\s*([^=;,\n]+?)(\s*=)/g, '$1$2$3$4$6')
        // 5. Remove type annotations from object destructuring
        .replace(/(const|let|var)\s*\{([^}]+)\}\s*:\s*[^=]+\s*=/g, (match, varType, destructure) => {
          // Clean type annotations from destructured properties
          const cleanDestructure = destructure
            .split(',')
            .map(prop => prop.split(':')[0].trim())
            .join(', ');
          return `${varType} {${cleanDestructure}} =`;
        })
        // 6. Remove as type assertions
        .replace(/\s+as\s+\w+[\w<>,\s\[\]]*(?=[,;)\s])/g, '')
        // 7. Only quote reserved keywords when they're object keys (after { or ,)
        .replace(/([{,]\s*)(default|class|function|return|const|let|var|if|else|for|while|do|switch|case|break|continue|new|this|super|import|export|try|catch|finally|throw|typeof|instanceof|in|of|void|delete|yield|async|await)(\s*):/g, '$1"$2"$3:');
    }
    
    
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
    
    try {
      // Create the function and execute it with utils
      const executeTemplate = new Function('ctx', 'width', 'height', 'params', 'currentTime', 'utils', wrapperCode);
      executeTemplate(ctx, width, height, flatParams, currentTime, utils);
    } catch (syntaxError) {
      throw syntaxError;
    }
    
  } catch (error) {
    console.error('Error executing visualization:', error)
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