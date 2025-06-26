/**
 * Core Generative Engine for ReCast
 * Mathematical foundation for creating parametric visual identities
 */

export interface GeneratedElement {
  type: 'rect' | 'circle' | 'path' | 'polygon' | 'ellipse' | 'line'
  props: Record<string, any>
  style?: Record<string, any>
  animationHints?: {
    transformOrigin?: string
    easingFunction?: string
    duration?: number
  }
}

export interface GenerativeParameters {
  // Core parameters shared by all generators
  frequency: number      // 0-20: Speed/cycles of change
  amplitude: number      // 0-100: Magnitude of change
  complexity: number     // 0-1: Layers/harmonics/subdivisions
  chaos: number         // 0-1: Randomness factor
  damping: number       // 0-1: Decay/softening
  layers: number        // 1-5: Number of overlapping elements
  
  // Shape-specific parameters (optional)
  radius?: number       // For circles, spirals
  sides?: number        // For polygons
  barCount?: number     // For bars, waves
  barSpacing?: number   // For discrete elements
  rotation?: number     // Base rotation angle
  scale?: number        // Size multiplier
  
  // Color parameters
  hue?: number         // Base hue (0-360)
  saturation?: number  // Color intensity (0-100)
  lightness?: number   // Color brightness (0-100)
  colorMode?: 'spectrum' | 'monochrome' | 'dual' | 'custom'
  
  // Animation parameters
  animationSpeed?: number    // Speed multiplier for time-based changes
  phaseOffset?: number      // Starting phase offset
  
  // Extensible for new parameters
  [key: string]: any
}

export interface GenerationOptions {
  width: number
  height: number
  resolution: number      // Detail level/point count
  time?: number          // Current animation time
  seed?: string          // For reproducible randomness
  centerX?: number       // Center point X (defaults to width/2)
  centerY?: number       // Center point Y (defaults to height/2)
  pixelRatio?: number    // For high-DPI displays
}

export interface GeneratorMetadata {
  name: string
  description: string
  category: 'geometric' | 'organic' | 'mathematical' | 'abstract'
  supportedModes: string[]
  defaultParameters: Partial<GenerativeParameters>
  parameterRanges: Record<string, { min: number, max: number, step?: number }>
}

export abstract class GeneratorBase {
  protected params: GenerativeParameters
  protected metadata: GeneratorMetadata
  protected rng: () => number

  constructor(params: GenerativeParameters, seed?: string) {
    this.params = params
    this.rng = seed ? this.createSeededRandom(seed) : Math.random
  }

  // Main generation method - must be implemented by subclasses
  abstract generate(options: GenerationOptions): GeneratedElement[]

  // Get metadata about this generator
  getMetadata(): GeneratorMetadata {
    return this.metadata
  }

  // Update parameters without recreating generator
  updateParameters(newParams: Partial<GenerativeParameters>): void {
    this.params = { ...this.params, ...newParams }
  }

  // Get current parameters
  getParameters(): GenerativeParameters {
    return { ...this.params }
  }

  // Seeded random number generator for reproducible results
  private createSeededRandom(seed: string): () => number {
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

  // Utility methods for common calculations
  protected calculatePhase(index: number, total: number, time: number = 0): number {
    return (index / total) * this.params.frequency * Math.PI * 2 + time + (this.params.phaseOffset || 0)
  }

  protected applyDamping(value: number, distance: number): number {
    return value * Math.pow(this.params.damping, distance)
  }

  protected addChaos(value: number, intensity: number = 1): number {
    const chaosAmount = (this.rng() - 0.5) * this.params.chaos * intensity
    return value + chaosAmount
  }

  protected scaleToCanvas(value: number, canvasSize: number): number {
    return (value / 100) * canvasSize
  }
}

// Registry for all available generators
export class GeneratorRegistry {
  private static generators = new Map<string, typeof GeneratorBase>()

  static register(name: string, generatorClass: typeof GeneratorBase): void {
    this.generators.set(name, generatorClass)
  }

  static get(name: string): typeof GeneratorBase | undefined {
    return this.generators.get(name)
  }

  static getAll(): string[] {
    return Array.from(this.generators.keys())
  }

  static createGenerator(name: string, params: GenerativeParameters, seed?: string): GeneratorBase | null {
    const GeneratorClass = this.generators.get(name)
    if (!GeneratorClass) return null
    
    return new GeneratorClass(params, seed) as GeneratorBase
  }
}

// Main engine that orchestrates multiple generators
export class GenerativeEngine {
  private generators: Map<string, GeneratorBase> = new Map()

  addGenerator(id: string, generator: GeneratorBase): void {
    this.generators.set(id, generator)
  }

  removeGenerator(id: string): void {
    this.generators.delete(id)
  }

  generate(options: GenerationOptions): Map<string, GeneratedElement[]> {
    const results = new Map<string, GeneratedElement[]>()
    
    for (const [id, generator] of this.generators) {
      try {
        const elements = generator.generate(options)
        results.set(id, elements)
      } catch (error) {
        console.warn(`Generator ${id} failed:`, error)
        results.set(id, [])
      }
    }
    
    return results
  }

  // Generate with a single generator by name
  generateSingle(generatorName: string, params: GenerativeParameters, options: GenerationOptions, seed?: string): GeneratedElement[] {
    const generator = GeneratorRegistry.createGenerator(generatorName, params, seed)
    if (!generator) {
      throw new Error(`Unknown generator: ${generatorName}`)
    }
    
    return generator.generate(options)
  }
}