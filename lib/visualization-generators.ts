import { WaveGenerator, WaveParameters } from '@/core/wave-generator'
import { GenerativeEngine, GenerativeParameters, GenerationOptions } from '@/core/generative-engine'
import { executePreset } from '@/lib/preset-registry'

export interface VisualizationParams {
  seed: string
  frequency: number
  amplitude: number
  complexity: number
  chaos: number
  damping: number
  layers: number
  barCount?: number
  barSpacing?: number
  radius?: number
  color: string
  customParameters?: Record<string, any>
  time: number
}

export const generateWaveLines = (
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  params: VisualizationParams
) => {
  const waveParams: WaveParameters = {
    amplitude: params.amplitude,
    frequency: params.frequency,
    phase: 0,
    complexity: params.complexity,
    chaos: params.chaos,
    damping: params.damping,
    layers: params.layers
  }

  const options: GenerationOptions = {
    width,
    height,
    resolution: 200,
    time: params.time,
    seed: params.seed
  }

  const generator = new WaveGenerator(waveParams, params.seed)
  const waveLayers = generator.generateWavePoints(options)

  waveLayers.forEach((layer, layerIndex) => {
    ctx.beginPath()
    const hslMatch = params.color.match(/hsl\((\d+)/)
    const hue = hslMatch ? Number.parseInt(hslMatch[1]) : 200
    ctx.strokeStyle = `hsla(${hue + layerIndex * 30}, 70%, 50%, ${0.8 - layerIndex * 0.2})`
    ctx.lineWidth = 3 - layerIndex * 0.5
    
    layer.forEach((point, i) => {
      if (i === 0) {
        ctx.moveTo(point.x, point.y)
      } else {
        ctx.lineTo(point.x, point.y)
      }
    })
    
    ctx.stroke()
  })
}

export const generateAudioBars = (
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  params: VisualizationParams
) => {
  const waveParams: WaveParameters = {
    amplitude: params.amplitude * 1.5,
    frequency: params.frequency,
    phase: 0,
    complexity: params.complexity,
    chaos: params.chaos * 0.3,
    damping: 0.9,
    layers: 1
  }

  const options: GenerationOptions = {
    width,
    height,
    resolution: params.barCount || 60,
    time: params.time,
    seed: params.seed
  }

  const generator = new WaveGenerator(waveParams, params.seed)
  const waveData = generator.generateWavePoints(options)[0]

  const barWidth = (width - (params.barSpacing || 2) * ((params.barCount || 60) - 1)) / (params.barCount || 60)
  const centerY = height / 2

  waveData.forEach((point, i) => {
    const barHeight = Math.abs(point.y - centerY) * 2
    const x = i * (barWidth + (params.barSpacing || 2))
    
    const hue = (i / (params.barCount || 60)) * 360
    
    const gradient = ctx.createLinearGradient(x, centerY - barHeight/2, x, centerY + barHeight/2)
    gradient.addColorStop(0, `hsla(${hue}, 70%, 60%, 0.9)`)
    gradient.addColorStop(0.5, `hsla(${hue}, 80%, 50%, 1)`)
    gradient.addColorStop(1, `hsla(${hue}, 70%, 60%, 0.9)`)
    
    ctx.fillStyle = gradient
    
    const radius = barWidth / 3
    ctx.beginPath()
    ctx.roundRect(x, centerY - barHeight/2, barWidth, barHeight, radius)
    ctx.fill()
    
    if (barHeight > 20) {
      ctx.beginPath()
      ctx.arc(x + barWidth/2, centerY - barHeight/2 - 5, barWidth/2.5, 0, Math.PI * 2)
      ctx.arc(x + barWidth/2, centerY + barHeight/2 + 5, barWidth/2.5, 0, Math.PI * 2)
      ctx.fill()
    }
  })
}

export const generateWaveBars = (
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  params: VisualizationParams
) => {
  const waveParams: WaveParameters = {
    amplitude: params.amplitude * 0.8,
    frequency: params.frequency,
    phase: 0,
    complexity: params.complexity,
    chaos: 0,
    damping: 0.9,
    layers: 1
  }

  const waveOptions: GenerationOptions = {
    width,
    height,
    resolution: params.barCount || 60,
    time: params.time,
    seed: params.seed
  }

  const generator = new WaveGenerator(waveParams, params.seed)
  const waveData = generator.generateWavePoints(waveOptions)[0]

  const barParams: WaveParameters = {
    amplitude: 40,
    frequency: params.frequency * 3,
    phase: 0,
    complexity: params.complexity * 1.5,
    chaos: params.chaos,
    damping: 1,
    layers: 1
  }

  const barOptions: GenerationOptions = {
    width,
    height,
    resolution: params.barCount || 60,
    time: params.time * 2,
    seed: params.seed + '-bars'
  }

  const barGenerator = new WaveGenerator(barParams, params.seed + '-bars')
  const barHeights = barGenerator.generateWavePoints(barOptions)[0]

  const barWidth = (width - (params.barSpacing || 2) * ((params.barCount || 60) - 1)) / (params.barCount || 60)

  for (let i = 0; i < (params.barCount || 60); i++) {
    const x = i * (barWidth + (params.barSpacing || 2))
    const waveCenterY = waveData[i].y
    const barHeight = Math.abs(barHeights[i].y - height / 2) + 20
    
    const hue = (i / (params.barCount || 60)) * 360
    
    const gradient = ctx.createLinearGradient(x, waveCenterY - barHeight/2, x, waveCenterY + barHeight/2)
    gradient.addColorStop(0, `hsla(${hue}, 70%, 60%, 0.9)`)
    gradient.addColorStop(0.5, `hsla(${hue}, 80%, 50%, 1)`)
    gradient.addColorStop(1, `hsla(${hue}, 70%, 60%, 0.9)`)
    
    ctx.fillStyle = gradient
    
    const radius = barWidth / 3
    ctx.beginPath()
    ctx.roundRect(x, waveCenterY - barHeight/2, barWidth, barHeight, radius)
    ctx.fill()
    
    if (barHeight > 25) {
      ctx.beginPath()
      ctx.arc(x + barWidth/2, waveCenterY - barHeight/2 - 4, barWidth/2.5, 0, Math.PI * 2)
      ctx.arc(x + barWidth/2, waveCenterY + barHeight/2 + 4, barWidth/2.5, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  ctx.beginPath()
  ctx.strokeStyle = 'rgba(100, 100, 100, 0.15)'
  ctx.lineWidth = 1
  ctx.setLineDash([5, 5])
  waveData.forEach((point, i) => {
    if (i === 0) {
      ctx.moveTo(point.x, point.y)
    } else {
      ctx.lineTo(point.x, point.y)
    }
  })
  ctx.stroke()
  ctx.setLineDash([])
}

export const generateCircles = (
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  params: VisualizationParams
) => {
  const generativeParams: GenerativeParameters = {
    frequency: params.frequency,
    amplitude: params.amplitude,
    complexity: params.complexity,
    chaos: params.chaos,
    damping: params.damping,
    layers: params.layers,
    radius: params.radius || 50
  }

  const options: GenerationOptions = {
    width,
    height,
    resolution: 50,
    time: params.time,
    seed: params.seed
  }

  const engine = new GenerativeEngine()
  const elements = engine.generateSingle('circle', generativeParams, options, params.seed)

  // Render the generated circle elements
  elements.forEach(element => {
    if (element.type === 'circle') {
      const { cx, cy, r, fill, stroke, strokeWidth, opacity } = element.props
      
      ctx.save()
      ctx.globalAlpha = opacity || 1
      
      if (fill && fill !== 'none') {
        ctx.fillStyle = fill
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.fill()
      }
      
      if (stroke) {
        ctx.strokeStyle = stroke
        ctx.lineWidth = strokeWidth || 1
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.stroke()
      }
      
      ctx.restore()
    }
  })
}

export const executeCustomCode = (
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  params: VisualizationParams,
  customCode: string,
  onError: (error: string) => void
) => {
  try {
    // Check if this code references a preset from the registry
    const presetIdMatch = customCode.match(/\/\/ PRESET_ID: ([\w-]+)/)
    if (presetIdMatch) {
      const presetId = presetIdMatch[1]
      const success = executePreset(presetId, ctx, width, height, params, params.time)
      if (success) {
        return // Preset executed successfully
      }
    }
    const waveParams: WaveParameters = {
      amplitude: params.amplitude,
      frequency: params.frequency,
      phase: 0,
      complexity: params.complexity,
      chaos: params.chaos,
      damping: params.damping,
      layers: params.layers
    }

    const generator = new WaveGenerator(waveParams, params.seed)

    // Merge standard parameters with custom parameters from the UI controls
    const mergedParams = {
      ...waveParams,
      seed: params.seed,
      barCount: params.barCount,
      barSpacing: params.barSpacing,
      radius: params.radius,
      ...params.customParameters // Custom parameters from PARAMETERS definition override defaults
    }

    // Create a safe execution environment with all variables defined
    const safeCode = `
      // Define all variables in scope to prevent reference errors
      const seed = params.seed;
      const barCount = params.barCount;
      const barSpacing = params.barSpacing;
      
      ${customCode}
      
      drawVisualization(ctx, width, height, params, generator, time);
    `

    const executeFunction = new Function(
      'ctx', 'width', 'height', 'params', 'generator', 'time', 'WaveGenerator',
      safeCode
    )

    executeFunction(ctx, width, height, 
      mergedParams, 
      generator, 
      params.time,
      WaveGenerator
    )
  } catch (error) {
    onError(error instanceof Error ? error.message : 'Unknown error')
    console.error('Custom code execution error:', error)
  }
}