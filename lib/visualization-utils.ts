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
    // Look for the export const code = ` ... ` pattern
    const codeMatch = code.match(/export\s+const\s+code\s*=\s*`([^`]+)`/s)
    if (!codeMatch || !codeMatch[1]) {
      throw new Error('Could not extract code from template')
    }
    
    const functionBody = codeMatch[1]
    
    // Create a function from the template code
    const func = new Function('ctx', 'parameters', 'currentTime', 'width', 'height', functionBody)
    
    // Execute the visualization function
    func(ctx, parameters, currentTime, width, height)
  } catch (error) {
    console.error('Error executing visualization:', error)
    throw error
  }
}