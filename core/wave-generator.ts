/**
 * Wave-based generator for ReFlow
 * Implements mathematical wave functions within the generative engine framework
 */

import { GeneratorBase, GeneratedElement, GenerativeParameters, GenerationOptions, GeneratorMetadata, GeneratorRegistry } from './generative-engine'

export interface WavePoint {
  x: number
  y: number
  intensity: number
  phase: number
}

// Legacy interface for backward compatibility
export interface WaveParameters {
  amplitude: number          // 0-100: Height of waves
  frequency: number         // 0-20: Number of wave cycles  
  phase: number            // 0-2π: Wave offset
  complexity: number       // 0-1: How many harmonics to add
  chaos: number           // 0-1: Randomness factor
  damping: number         // 0-1: How quickly waves decay
  layers: number          // 1-5: Number of wave layers
}

export class WaveGenerator extends GeneratorBase {
  constructor(params: GenerativeParameters | WaveParameters, seed?: string) {
    // Convert legacy WaveParameters to GenerativeParameters if needed
    const generativeParams: GenerativeParameters = 'barCount' in params ? params as GenerativeParameters : {
      frequency: params.frequency,
      amplitude: params.amplitude,
      complexity: params.complexity,
      chaos: params.chaos,
      damping: params.damping,
      layers: params.layers,
      phaseOffset: 'phase' in params ? params.phase : 0
    }
    
    super(generativeParams, seed)
    
    this.metadata = {
      name: 'Wave Generator',
      description: 'Creates smooth mathematical wave patterns with harmonics and complexity',
      category: 'mathematical',
      supportedModes: ['wave', 'wavebars'],
      defaultParameters: {
        frequency: 3,
        amplitude: 50,
        complexity: 0.3,
        chaos: 0.1,
        damping: 0.9,
        layers: 2
      },
      parameterRanges: {
        frequency: { min: 0.1, max: 20, step: 0.1 },
        amplitude: { min: 0, max: 100, step: 1 },
        complexity: { min: 0, max: 1, step: 0.01 },
        chaos: { min: 0, max: 1, step: 0.01 },
        damping: { min: 0, max: 1, step: 0.01 },
        layers: { min: 1, max: 5, step: 1 }
      }
    }
  }

  // New unified generate method for GenerativeEngine compatibility
  generate(options: GenerationOptions): GeneratedElement[] {
    const layers = this.generateWavePoints(options)
    const elements: GeneratedElement[] = []
    
    // Convert wave points to GeneratedElement format
    layers.forEach((layer, layerIndex) => {
      // For wave mode, create path elements
      if (layer.length > 1) {
        const pathData = layer.map((point, i) => 
          i === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`
        ).join(' ')
        
        elements.push({
          type: 'path',
          props: {
            d: pathData,
            stroke: `hsl(${200 + layerIndex * 30}, 70%, 50%)`,
            strokeWidth: Math.max(1, options.width / 200),
            fill: 'none',
            opacity: 0.8 - (layerIndex * 0.1)
          }
        })
      }
    })
    
    return elements
  }


  // Generate a single wave layer
  private generateLayer(
    options: GenerationOptions,
    layerIndex: number,
    time: number = 0
  ): WavePoint[] {
    const points: WavePoint[] = []
    const { width, height, resolution } = options
    const { amplitude, frequency, complexity, chaos, damping, phaseOffset } = this.params

    // Performance optimization: Detect if we're likely animating
    const isAnimating = time !== undefined && Math.abs(time % 1) > 0.001

    // Adaptive complexity for performance during animation
    const activeComplexity = isAnimating ? Math.min(complexity * 0.3, 0.1) : complexity
    const maxHarmonics = isAnimating ? 2 : Math.ceil(activeComplexity * 5)

    // Layer-specific modifications
    const layerFreq = frequency * (1 + layerIndex * 0.3)
    const layerAmp = amplitude * Math.pow(damping, layerIndex)
    const layerPhase = (phaseOffset || 0) + (layerIndex * Math.PI / 4)

    for (let i = 0; i < resolution; i++) {
      const x = (i / resolution) * width
      const t = i / resolution

      // Base wave
      let y = Math.sin((t * layerFreq * Math.PI * 2) + layerPhase + time)

      // Add harmonics for complexity (optimized count during animation)
      for (let h = 2; h <= maxHarmonics; h++) {
        const harmonicAmp = 1 / h
        y += harmonicAmp * Math.sin((t * layerFreq * h * Math.PI * 2) + layerPhase + time)
      }

      // Add chaos (reduced during animation for performance)
      if (chaos > 0) {
        const activeChaos = isAnimating ? chaos * 0.5 : chaos
        y += (this.rng() - 0.5) * activeChaos
      }

      // Scale to amplitude
      y = y * layerAmp

      // Center vertically
      y = height / 2 + y

      // Calculate intensity (for visual effects like opacity/color)
      const intensity = Math.abs(y - height / 2) / (height / 2)

      points.push({
        x,
        y,
        intensity,
        phase: (t * layerFreq * Math.PI * 2) + layerPhase
      })
    }

    return points
  }

  // Legacy method - generates raw wave points (DEPRECATED: use generate() for new code)
  generateWavePoints(options: GenerationOptions): WavePoint[][] {
    const { layers } = this.params
    const { time = 0 } = options
    
    const allLayers: WavePoint[][] = []

    for (let i = 0; i < layers; i++) {
      const layer = this.generateLayer(options, i, time)
      allLayers.push(layer)
    }

    return allLayers
  }

  // Generate a wave-within-wave effect
  generateNested(options: GenerationOptions): WavePoint[][] {
    const containerWave = this.generateWavePoints({
      ...options,
      resolution: Math.floor(options.resolution / 4)
    })[0]

    const nestedWaves: WavePoint[][] = []

    // For each segment of the container wave
    for (let i = 0; i < containerWave.length - 1; i++) {
      const start = containerWave[i]
      const end = containerWave[i + 1]

      // Generate mini-waves between these points
      const miniParams: WaveParameters = {
        ...this.params,
        amplitude: this.params.amplitude * 0.3,
        frequency: this.params.frequency * 4
      }

      const miniGen = new WaveGenerator(miniParams)
      const miniWave = miniGen.generateLayer({
        width: end.x - start.x,
        height: options.height,
        resolution: 20
      }, 0)

      // Transform mini-wave to fit between container points
      const transformed = miniWave.map(point => ({
        ...point,
        x: start.x + point.x,
        y: start.y + (point.y - options.height / 2) * 0.3
      }))

      nestedWaves.push(transformed)
    }

    return [containerWave, ...nestedWaves.flat()] as WavePoint[][]
  }

  // Legacy parameter update method (DEPRECATED: use updateParameters() for new code)
  updateParams(params: Partial<WaveParameters>) {
    const generativeParams: Partial<GenerativeParameters> = {
      frequency: params.frequency,
      amplitude: params.amplitude,
      complexity: params.complexity,
      chaos: params.chaos,
      damping: params.damping,
      layers: params.layers,
      phaseOffset: 'phase' in params ? params.phase : undefined
    }
    this.updateParameters(generativeParams)
  }
}

// Register the WaveGenerator with the GenerativeEngine
GeneratorRegistry.register('wave', WaveGenerator)