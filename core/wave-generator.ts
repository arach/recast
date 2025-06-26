/**
 * Core wave generation engine for ReCast
 * This is the mathematical heart of the identity system
 */

export interface WavePoint {
  x: number
  y: number
  intensity: number
  phase: number
}

export interface WaveParameters {
  amplitude: number          // 0-100: Height of waves
  frequency: number         // 0-20: Number of wave cycles  
  phase: number            // 0-2π: Wave offset
  complexity: number       // 0-1: How many harmonics to add
  chaos: number           // 0-1: Randomness factor
  damping: number         // 0-1: How quickly waves decay
  layers: number          // 1-5: Number of wave layers
}

export interface GenerationOptions {
  width: number
  height: number
  resolution: number      // Points per wave
  time?: number          // For animations
  seed?: string          // For reproducible randomness
}

export class WaveGenerator {
  private params: WaveParameters
  private rng: () => number

  constructor(params: WaveParameters, seed?: string) {
    this.params = params
    this.rng = seed ? this.seededRandom(seed) : Math.random
  }

  // Seeded random number generator for reproducible results
  private seededRandom(seed: string): () => number {
    let hash = 0
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    
    return () => {
      hash = (hash * 9301 + 49297) % 233280
      return hash / 233280
    }
  }

  // Generate a single wave layer
  private generateLayer(
    options: GenerationOptions,
    layerIndex: number,
    time: number = 0
  ): WavePoint[] {
    const points: WavePoint[] = []
    const { width, height, resolution } = options
    const { amplitude, frequency, phase, complexity, chaos, damping } = this.params

    // Layer-specific modifications
    const layerFreq = frequency * (1 + layerIndex * 0.3)
    const layerAmp = amplitude * Math.pow(damping, layerIndex)
    const layerPhase = phase + (layerIndex * Math.PI / 4)

    for (let i = 0; i < resolution; i++) {
      const x = (i / resolution) * width
      const t = i / resolution

      // Base wave
      let y = Math.sin((t * layerFreq * Math.PI * 2) + layerPhase + time)

      // Add harmonics for complexity
      for (let h = 2; h <= Math.ceil(complexity * 5); h++) {
        const harmonicAmp = 1 / h
        y += harmonicAmp * Math.sin((t * layerFreq * h * Math.PI * 2) + layerPhase + time)
      }

      // Add chaos
      if (chaos > 0) {
        y += (this.rng() - 0.5) * chaos
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

  // Generate all wave layers
  generate(options: GenerationOptions): WavePoint[][] {
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
    const containerWave = this.generate({
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

    return [containerWave, ...nestedWaves.flat()]
  }

  // Update parameters (for animation)
  updateParams(params: Partial<WaveParameters>) {
    this.params = { ...this.params, ...params }
  }
}