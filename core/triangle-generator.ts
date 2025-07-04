/**
 * Triangle-based generator for ReFlow
 * Creates spinning triangles, constellation patterns, and geometric formations
 */

import { GeneratorBase, GeneratedElement, GenerativeParameters, GenerationOptions, GeneratorMetadata, GeneratorRegistry } from './generative-engine'

export class TriangleGenerator extends GeneratorBase {
  constructor(params: GenerativeParameters, seed?: string) {
    super(params, seed)
    
    this.metadata = {
      name: 'Triangle Generator',
      description: 'Creates spinning triangles, constellation patterns, and geometric formations',
      category: 'geometric',
      supportedModes: ['triangles', 'constellation', 'fractal'],
      defaultParameters: {
        frequency: 3,
        amplitude: 40,
        complexity: 0.4,
        chaos: 0.2,
        damping: 0.85,
        layers: 3,
        sides: 3,
        rotation: 0
      },
      parameterRanges: {
        frequency: { min: 0.1, max: 10, step: 0.1 },
        amplitude: { min: 0, max: 100, step: 1 },
        complexity: { min: 0, max: 1, step: 0.01 },
        chaos: { min: 0, max: 1, step: 0.01 },
        damping: { min: 0, max: 1, step: 0.01 },
        layers: { min: 1, max: 8, step: 1 },
        sides: { min: 3, max: 12, step: 1 },
        rotation: { min: 0, max: 360, step: 1 }
      }
    }
  }

  generate(options: GenerationOptions): GeneratedElement[] {
    const elements: GeneratedElement[] = []
    const { width, height, time = 0 } = options
    const centerX = options.centerX || width / 2
    const centerY = options.centerY || height / 2
    
    const { frequency, amplitude, complexity, chaos, damping, layers, sides, rotation } = this.params
    const baseSize = this.scaleToCanvas(amplitude, Math.min(width, height))

    for (let layer = 0; layer < layers; layer++) {
      // Calculate layer-specific parameters
      const layerPhase = this.calculatePhase(layer, layers, time)
      const layerSize = baseSize * Math.pow(damping, layer)
      const layerRotation = (rotation || 0) + (layerPhase * 180 / Math.PI)
      
      // Add chaos to position and rotation
      const chaosX = this.addChaos(0, layerSize * 0.2)
      const chaosY = this.addChaos(0, layerSize * 0.2) 
      const chaosRotation = this.addChaos(0, 45)
      
      // Calculate final position
      const finalX = Math.max(layerSize, Math.min(width - layerSize, centerX + chaosX))
      const finalY = Math.max(layerSize, Math.min(height - layerSize, centerY + chaosY))
      
      // Color based on layer and time
      const hue = (layer / layers) * 120 + time * 20 // Blue to green spectrum
      const saturation = 70 - (layer * 5)
      const lightness = 45 + Math.sin(layerPhase) * 15
      const strokeColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`
      const fillColor = `hsla(${hue}, ${saturation}%, ${lightness + 20}%, 0.3)`
      
      // Create triangle path
      const trianglePath = this.createTrianglePath(finalX, finalY, layerSize, layerRotation + chaosRotation, sides || 3)
      
      // Main triangle
      elements.push({
        type: 'polygon',
        props: {
          points: trianglePath,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: Math.max(1, layerSize / 30),
          opacity: 0.8 - (layer * 0.1)
        },
        animationHints: {
          transformOrigin: `${finalX}px ${finalY}px`,
          easingFunction: 'ease-in-out',
          duration: 1000 / frequency
        }
      })
      
      // Add complexity: constellation or smaller triangles
      if (complexity > 0 && layer < layers / 2) {
        const complexityCount = Math.ceil(complexity * 5)
        
        for (let i = 0; i < complexityCount; i++) {
          const orbitPhase = this.calculatePhase(i, complexityCount, time * 1.5)
          const orbitRadius = layerSize * 0.8
          const orbitX = finalX + Math.cos(orbitPhase) * orbitRadius
          const orbitY = finalY + Math.sin(orbitPhase) * orbitRadius
          const orbitSize = layerSize * 0.25
          
          // Bounds check for orbit triangles
          if (orbitX > orbitSize && orbitX < width - orbitSize && 
              orbitY > orbitSize && orbitY < height - orbitSize) {
            
            const orbitPath = this.createTrianglePath(orbitX, orbitY, orbitSize, orbitPhase * 180 / Math.PI, 3)
            
            elements.push({
              type: 'polygon',
              props: {
                points: orbitPath,
                fill: `hsla(${hue + 60}, ${saturation}%, ${lightness + 10}%, 0.4)`,
                stroke: `hsl(${hue + 60}, ${saturation}%, ${lightness}%)`,
                strokeWidth: Math.max(1, orbitSize / 20),
                opacity: 0.6
              },
              animationHints: {
                transformOrigin: `${finalX}px ${finalY}px`,
                easingFunction: 'linear',
                duration: 2000 / frequency
              }
            })
          }
        }
      }
    }

    return elements
  }

  // Create triangle path points
  private createTrianglePath(centerX: number, centerY: number, size: number, rotation: number, sides: number): string {
    const points: string[] = []
    const angleStep = (Math.PI * 2) / sides
    const rotationRad = (rotation * Math.PI) / 180
    
    for (let i = 0; i < sides; i++) {
      const angle = (i * angleStep) + rotationRad
      const x = centerX + Math.cos(angle) * size
      const y = centerY + Math.sin(angle) * size
      points.push(`${x.toFixed(2)},${y.toFixed(2)}`)
    }
    
    return points.join(' ')
  }

  // Generate spinning constellation mode
  generateConstellation(options: GenerationOptions): GeneratedElement[] {
    const elements: GeneratedElement[] = []
    const { width, height, time = 0 } = options
    const { frequency, amplitude, layers } = this.params
    
    const constellationCount = layers * 2
    const baseSize = this.scaleToCanvas(amplitude * 0.3, Math.min(width, height))
    
    for (let i = 0; i < constellationCount; i++) {
      const phase = this.calculatePhase(i, constellationCount, time)
      const radius = Math.min(width, height) * 0.3
      
      const x = (width / 2) + Math.cos(phase) * radius
      const y = (height / 2) + Math.sin(phase) * radius
      const size = baseSize * (0.5 + Math.sin(phase * 2) * 0.5)
      const rotation = phase * 180 / Math.PI
      
      // Bounds check
      if (x > size && x < width - size && y > size && y < height - size) {
        const hue = (i / constellationCount) * 360 + time * 30
        const trianglePath = this.createTrianglePath(x, y, size, rotation, 3)
        
        elements.push({
          type: 'polygon',
          props: {
            points: trianglePath,
            fill: `hsla(${hue}, 70%, 50%, 0.4)`,
            stroke: `hsl(${hue}, 70%, 40%)`,
            strokeWidth: Math.max(1, size / 15),
            opacity: 0.7 + Math.sin(phase) * 0.3
          },
          animationHints: {
            transformOrigin: `${x}px ${y}px`,
            easingFunction: 'ease-in-out',
            duration: 3000 / frequency
          }
        })
      }
    }

    return elements
  }

  // Generate fractal-like pattern
  generateFractal(options: GenerationOptions): GeneratedElement[] {
    const elements: GeneratedElement[] = []
    const { width, height, time = 0 } = options
    const centerX = width / 2
    const centerY = height / 2
    
    const { amplitude, complexity, layers } = this.params
    const baseSize = this.scaleToCanvas(amplitude, Math.min(width, height))
    
    // Recursive triangle subdivision
    const subdivisions = Math.min(3, Math.ceil(complexity * 4))
    
    for (let level = 0; level < subdivisions; level++) {
      const levelSize = baseSize * Math.pow(0.6, level)
      const levelCount = Math.pow(3, level)
      
      for (let i = 0; i < levelCount; i++) {
        const angle = (i / levelCount) * Math.PI * 2 + time * 0.5
        const distance = level * levelSize * 0.8
        
        const x = centerX + Math.cos(angle) * distance
        const y = centerY + Math.sin(angle) * distance
        
        if (x > levelSize && x < width - levelSize && y > levelSize && y < height - levelSize) {
          const hue = (level * 60 + i * 30) % 360
          const trianglePath = this.createTrianglePath(x, y, levelSize, angle * 180 / Math.PI, 3)
          
          elements.push({
            type: 'polygon',
            props: {
              points: trianglePath,
              fill: `hsla(${hue}, 60%, 50%, ${0.3 + level * 0.2})`,
              stroke: `hsl(${hue}, 60%, 35%)`,
              strokeWidth: Math.max(1, levelSize / 25),
              opacity: 0.8 - (level * 0.2)
            }
          })
        }
      }
    }

    return elements
  }
}

// Register the TriangleGenerator with the GenerativeEngine
GeneratorRegistry.register('triangle', TriangleGenerator)