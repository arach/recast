import {
  generateWaveLines,
  executeCustomCode,
  VisualizationParams
} from '@/lib/visualization-generators'

export function generateLogoCanvas(logo: any, time: number = 0): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = 600
  canvas.height = 600
  const ctx = canvas.getContext('2d')
  
  if (!ctx) return canvas
  
  // Clear with white background
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // Add subtle gradient for ReFlow identity
  if (logo.parameters.core.frequency === 4) {
    const gradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, canvas.width / 2
    )
    gradient.addColorStop(0, 'rgba(250, 250, 250, 1)')
    gradient.addColorStop(1, 'rgba(245, 245, 245, 1)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }
  
  // Create visualization parameters
  const params: VisualizationParams = {
    seed: logo.id,
    frequency: logo.parameters.core.frequency,
    amplitude: logo.parameters.core.amplitude,
    complexity: logo.parameters.core.complexity,
    chaos: logo.parameters.core.chaos,
    damping: logo.parameters.core.damping,
    layers: logo.parameters.core.layers,
    barCount: logo.parameters.custom.barCount || 60,
    barSpacing: logo.parameters.custom.barSpacing || 2,
    radius: logo.parameters.core.radius,
    color: logo.parameters.style.fillColor,
    fillColor: logo.parameters.style.fillColor,
    strokeColor: logo.parameters.style.strokeColor,
    backgroundColor: logo.parameters.style.backgroundColor,
    customParameters: logo.parameters.custom,
    time
  }
  
  // Generate content
  if (logo.code && logo.code.trim()) {
    executeCustomCode(ctx, canvas.width, canvas.height, params, logo.code, () => {})
  } else {
    generateWaveLines(ctx, canvas.width, canvas.height, params)
  }
  
  return canvas
}