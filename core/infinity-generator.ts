/**
 * Infinity-based generator for ReFlow
 * Creates figure-8 loops, lemniscate curves, and flowing path patterns
 */

import { GeneratorBase, GeneratedElement, GenerativeParameters, GenerationOptions, GeneratorMetadata, GeneratorRegistry } from './generative-engine'

export class InfinityGenerator extends GeneratorBase {
  constructor(params: GenerativeParameters, seed?: string) {
    super(params, seed)
    
    this.metadata = {
      name: 'Infinity Generator',
      description: 'Creates figure-8 loops, lemniscate curves, and flowing path patterns',
      category: 'organic',
      supportedModes: ['infinity', 'lemniscate', 'flow'],
      defaultParameters: {
        frequency: 2,
        amplitude: 60,
        complexity: 0.3,
        chaos: 0.1,
        damping: 0.9,
        layers: 2,
        scale: 1.0
      },
      parameterRanges: {
        frequency: { min: 0.1, max: 8, step: 0.1 },
        amplitude: { min: 10, max: 150, step: 5 },
        complexity: { min: 0, max: 1, step: 0.01 },
        chaos: { min: 0, max: 1, step: 0.01 },
        damping: { min: 0.3, max: 1, step: 0.01 },
        layers: { min: 1, max: 6, step: 1 },
        scale: { min: 0.3, max: 3, step: 0.1 }
      }
    }
  }

  generate(options: GenerationOptions): GeneratedElement[] {
    const elements: GeneratedElement[] = []
    const { width, height, time = 0 } = options
    const centerX = options.centerX || width / 2
    const centerY = options.centerY || height / 2
    
    const { frequency, amplitude, complexity, chaos, damping, layers, scale } = this.params
    const baseScale = (scale || 1.0) * Math.min(width, height) / 400

    for (let layer = 0; layer < layers; layer++) {
      // Calculate layer-specific parameters
      const layerPhase = this.calculatePhase(layer, layers, time)
      const layerScale = baseScale * Math.pow(damping, layer)
      const layerAmplitude = this.scaleToCanvas(amplitude, Math.min(width, height)) * layerScale
      
      // Color progression through spectrum
      const hue = (layer / layers) * 180 + time * 15 + 240 // Purple to blue spectrum
      const saturation = 80 - (layer * 10)
      const lightness = 50 + Math.sin(layerPhase) * 20
      const strokeColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`
      
      // Generate infinity loop path
      const pathData = this.createInfinityPath(
        centerX, centerY, 
        layerAmplitude, 
        frequency, 
        time + layer * 0.5,
        chaos
      )
      
      // Main infinity curve
      elements.push({
        type: 'path',
        props: {
          d: pathData,
          stroke: strokeColor,
          strokeWidth: Math.max(1, layerAmplitude / 25),
          fill: 'none',
          opacity: 0.8 - (layer * 0.15),
          strokeLinecap: 'round',
          strokeLinejoin: 'round'
        },
        animationHints: {
          transformOrigin: `${centerX}px ${centerY}px`,
          easingFunction: 'ease-in-out',
          duration: 4000 / frequency
        }
      })
      
      // Add complexity: flowing particles or additional curves
      if (complexity > 0) {
        const particleCount = Math.ceil(complexity * 8)
        
        for (let p = 0; p < particleCount; p++) {
          const particlePhase = this.calculatePhase(p, particleCount, time * 2 + layer)
          const t = (particlePhase / (Math.PI * 2)) % 1
          
          // Calculate position along infinity curve
          const pos = this.getInfinityPosition(t, centerX, centerY, layerAmplitude)
          const particleX = pos.x + this.addChaos(0, layerAmplitude * 0.1)
          const particleY = pos.y + this.addChaos(0, layerAmplitude * 0.1)
          
          // Bounds check for particles
          const particleSize = layerAmplitude * 0.05
          if (particleX > particleSize && particleX < width - particleSize && 
              particleY > particleSize && particleY < height - particleSize) {
            
            elements.push({
              type: 'circle',
              props: {
                cx: particleX,
                cy: particleY,
                r: particleSize,
                fill: `hsla(${hue + 30}, ${saturation}%, ${lightness + 20}%, 0.7)`,
                opacity: 0.6 + Math.sin(particlePhase) * 0.3
              },
              animationHints: {
                transformOrigin: `${centerX}px ${centerY}px`,
                easingFunction: 'linear',
                duration: 6000 / frequency
              }
            })
          }
        }
      }
    }

    return elements
  }

  // Create SVG path for infinity loop (lemniscate)
  private createInfinityPath(
    centerX: number, 
    centerY: number, 
    amplitude: number, 
    frequency: number, 
    timeOffset: number,
    chaos: number
  ): string {
    const points: string[] = []
    const resolution = 120 // High resolution for smooth curves
    
    for (let i = 0; i <= resolution; i++) {
      const t = (i / resolution) * Math.PI * 2
      const animatedT = t + timeOffset * frequency
      
      // Lemniscate equation: x = a*cos(t)/(1+sin²(t)), y = a*sin(t)*cos(t)/(1+sin²(t))
      const sinT = Math.sin(animatedT)
      const cosT = Math.cos(animatedT)
      const denominator = 1 + sinT * sinT
      
      let x = amplitude * cosT / denominator
      let y = amplitude * sinT * cosT / denominator
      
      // Add chaos for organic feel
      if (chaos > 0) {
        x += this.addChaos(0, amplitude * chaos * 0.1)
        y += this.addChaos(0, amplitude * chaos * 0.1)
      }
      
      // Translate to center
      x += centerX
      y += centerY
      
      if (i === 0) {
        points.push(`M ${x.toFixed(2)} ${y.toFixed(2)}`)
      } else {
        // Use smooth curves for flowing appearance
        const prevT = ((i - 1) / resolution) * Math.PI * 2 + timeOffset * frequency
        const prevSinT = Math.sin(prevT)
        const prevCosT = Math.cos(prevT)
        const prevDenom = 1 + prevSinT * prevSinT
        
        let prevX = amplitude * prevCosT / prevDenom + centerX
        let prevY = amplitude * prevSinT * prevCosT / prevDenom + centerY
        
        // Control points for smooth bezier curves
        const cp1x = prevX + (x - prevX) * 0.3
        const cp1y = prevY + (y - prevY) * 0.3
        const cp2x = x - (x - prevX) * 0.3
        const cp2y = y - (y - prevY) * 0.3
        
        points.push(`C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)} ${cp2x.toFixed(2)} ${cp2y.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)}`)
      }
    }
    
    return points.join(' ')
  }

  // Get position along infinity curve for particle placement
  private getInfinityPosition(t: number, centerX: number, centerY: number, amplitude: number): { x: number, y: number } {
    const angle = t * Math.PI * 2
    const sinT = Math.sin(angle)
    const cosT = Math.cos(angle)
    const denominator = 1 + sinT * sinT
    
    const x = centerX + amplitude * cosT / denominator
    const y = centerY + amplitude * sinT * cosT / denominator
    
    return { x, y }
  }

  // Generate flowing ribbon pattern (alternative mode)
  generateFlow(options: GenerationOptions): GeneratedElement[] {
    const elements: GeneratedElement[] = []
    const { width, height, time = 0 } = options
    const { frequency, amplitude, layers, complexity } = this.params
    
    const flowCount = layers * 2
    
    for (let i = 0; i < flowCount; i++) {
      const phase = this.calculatePhase(i, flowCount, time * 0.5)
      const startX = width * 0.1 + (i / flowCount) * width * 0.8
      const flowAmplitude = this.scaleToCanvas(amplitude * 0.5, height)
      
      // Create flowing sine wave
      const pathPoints: string[] = []
      const resolution = 50
      
      for (let j = 0; j <= resolution; j++) {
        const t = j / resolution
        const x = startX + t * width * 0.6
        const waveOffset = Math.sin(t * Math.PI * 4 + phase) * flowAmplitude
        const complexityOffset = complexity > 0 ? Math.sin(t * Math.PI * 8 + phase * 2) * flowAmplitude * complexity * 0.3 : 0
        const y = height / 2 + waveOffset + complexityOffset
        
        if (j === 0) {
          pathPoints.push(`M ${x.toFixed(2)} ${y.toFixed(2)}`)
        } else {
          pathPoints.push(`L ${x.toFixed(2)} ${y.toFixed(2)}`)
        }
      }
      
      const hue = (i / flowCount) * 300 + time * 20
      
      elements.push({
        type: 'path',
        props: {
          d: pathPoints.join(' '),
          stroke: `hsl(${hue}, 70%, 55%)`,
          strokeWidth: Math.max(1, flowAmplitude / 15),
          fill: 'none',
          opacity: 0.7,
          strokeLinecap: 'round'
        }
      })
    }

    return elements
  }

  // Generate lemniscate variations (figure-8 with different orientations)
  generateLemniscate(options: GenerationOptions): GeneratedElement[] {
    const elements: GeneratedElement[] = []
    const { width, height, time = 0 } = options
    const centerX = width / 2
    const centerY = height / 2
    
    const { amplitude, frequency, layers } = this.params
    const baseAmplitude = this.scaleToCanvas(amplitude, Math.min(width, height))
    
    for (let layer = 0; layer < layers; layer++) {
      const layerAmplitude = baseAmplitude * Math.pow(0.8, layer)
      const rotation = (layer * 45) + time * frequency * 10 // Different orientations
      
      const pathData = this.createRotatedInfinityPath(
        centerX, centerY, 
        layerAmplitude, 
        rotation,
        time
      )
      
      const hue = (layer * 60 + time * 30) % 360
      
      elements.push({
        type: 'path',
        props: {
          d: pathData,
          stroke: `hsl(${hue}, 70%, 50%)`,
          strokeWidth: Math.max(1, layerAmplitude / 20),
          fill: 'none',
          opacity: 0.8 - (layer * 0.15)
        }
      })
    }

    return elements
  }

  // Create rotated infinity path
  private createRotatedInfinityPath(
    centerX: number, 
    centerY: number, 
    amplitude: number, 
    rotation: number,
    time: number
  ): string {
    const points: string[] = []
    const resolution = 100
    const rotRad = (rotation * Math.PI) / 180
    
    for (let i = 0; i <= resolution; i++) {
      const t = (i / resolution) * Math.PI * 2 + time * 0.5
      const sinT = Math.sin(t)
      const cosT = Math.cos(t)
      const denominator = 1 + sinT * sinT
      
      // Base lemniscate coordinates
      let x = amplitude * cosT / denominator
      let y = amplitude * sinT * cosT / denominator
      
      // Apply rotation
      const rotatedX = x * Math.cos(rotRad) - y * Math.sin(rotRad)
      const rotatedY = x * Math.sin(rotRad) + y * Math.cos(rotRad)
      
      // Translate to center
      const finalX = centerX + rotatedX
      const finalY = centerY + rotatedY
      
      if (i === 0) {
        points.push(`M ${finalX.toFixed(2)} ${finalY.toFixed(2)}`)
      } else {
        points.push(`L ${finalX.toFixed(2)} ${finalY.toFixed(2)}`)
      }
    }
    
    return points.join(' ')
  }
}

// Register the InfinityGenerator with the GenerativeEngine
GeneratorRegistry.register('infinity', InfinityGenerator)