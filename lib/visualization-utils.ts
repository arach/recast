export function generateVisualization(
  ctx: CanvasRenderingContext2D,
  code: string,
  parameters: any,
  currentTime: number,
  width: number,
  height: number
) {
  try {
    // Extract the function body from the template code
    // Look for the export const code = ` ... ` pattern with proper backtick handling
    const exportMatch = code.match(/export\s+const\s+code\s*=\s*`/s)
    if (!exportMatch) {
      throw new Error('Could not find code export in template')
    }
    
    // Find the start position after the opening backtick
    const startPos = exportMatch.index! + exportMatch[0].length
    
    // Find the matching closing backtick by counting backticks
    let backtickCount = 1
    let endPos = startPos
    
    while (endPos < code.length && backtickCount > 0) {
      if (code[endPos] === '`') {
        // Check if it's escaped
        let isEscaped = false
        let checkPos = endPos - 1
        while (checkPos >= 0 && code[checkPos] === '\\') {
          isEscaped = !isEscaped
          checkPos--
        }
        
        if (!isEscaped) {
          backtickCount--
        }
      }
      if (backtickCount > 0) endPos++
    }
    
    if (backtickCount > 0) {
      throw new Error('Could not find matching closing backtick in template code')
    }
    
    let functionBody = code.substring(startPos, endPos)
    
    // Unescape template literals and other escaped sequences
    functionBody = functionBody
      .replace(/\\`/g, '`')           // Unescape backticks
      .replace(/\\\$/g, '$')          // Unescape dollar signs
      .replace(/\\\\/g, '\\')         // Unescape backslashes (do this last)
    
    // Create a function from the template code
    const func = new Function('ctx', 'parameters', 'currentTime', 'width', 'height', functionBody)
    
    // Execute the visualization function
    func(ctx, parameters, currentTime, width, height)
  } catch (error) {
    console.error('Error executing visualization:', error)
    throw error
  }
}