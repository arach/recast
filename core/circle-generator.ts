/**
 * Circle-based generator for ReCast
 * Creates pulsing circles, orbital motion, and nested ring patterns
 */

import { GeneratorBase, GeneratedElement, GenerativeParameters, GenerationOptions, GeneratorMetadata, GeneratorRegistry } from './generative-engine'

export class CircleGenerator extends GeneratorBase {
  constructor(params: GenerativeParameters, seed?: string) {
    super(params, seed)
    
    this.metadata = {
      name: 'Circle Generator',
      description: 'Creates pulsing circles, orbital patterns, and nested ring systems',
      category: 'geometric',
      supportedModes: ['circles', 'orbital', 'ripples'],
      defaultParameters: {
        frequency: 2,
        amplitude: 30,
        complexity: 0.5,
        chaos: 0.1,
        damping: 0.8,
        layers: 3,
        radius: 50
      },
      parameterRanges: {
        frequency: { min: 0.1, max: 10, step: 0.1 },
        amplitude: { min: 0, max: 100, step: 1 },
        complexity: { min: 0, max: 1, step: 0.01 },
        chaos: { min: 0, max: 1, step: 0.01 },
        damping: { min: 0, max: 1, step: 0.01 },
        layers: { min: 1, max: 8, step: 1 },
        radius: { min: 10, max: 200, step: 1 }
      }
    }
  }

  generate(options: GenerationOptions): GeneratedElement[] {
    const elements: GeneratedElement[] = []
    const { width, height, time = 0 } = options
    const centerX = options.centerX || width / 2
    const centerY = options.centerY || height / 2
    
    const { frequency, amplitude, complexity, chaos, damping, layers, radius } = this.params
    const baseRadius = radius || 50

    for (let layer = 0; layer < layers; layer++) {
      // Calculate layer-specific parameters
      const layerPhase = this.calculatePhase(layer, layers, time)
      const layerRadius = this.scaleToCanvas(baseRadius, Math.min(width, height)) * Math.pow(damping, layer)
      const radiusVariation = this.scaleToCanvas(amplitude, Math.min(width, height)) * Math.sin(layerPhase)
      const finalRadius = Math.max(1, layerRadius + radiusVariation)
      
      // Add chaos to position
      const chaosX = this.addChaos(0, finalRadius * 0.1)
      const chaosY = this.addChaos(0, finalRadius * 0.1)
      
      // Color based on layer and time
      const hue = (layer / layers) * 360 + time * 30
      const saturation = 70 - (layer * 5)
      const lightness = 50 + Math.sin(layerPhase) * 20
      
      // Create main circle
      elements.push({
        type: 'circle',
        props: {
          cx: Math.max(finalRadius, Math.min(width - finalRadius, centerX + chaosX)),
          cy: Math.max(finalRadius, Math.min(height - finalRadius, centerY + chaosY)),
          r: finalRadius,
          fill: 'none',
          stroke: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
          strokeWidth: Math.max(1, finalRadius / 20),
          opacity: 0.8 - (layer * 0.1)
        },
        animationHints: {
          transformOrigin: 'center',
          easingFunction: 'ease-in-out',
          duration: 1000 / frequency
        }
      })
      
      // Add complexity: nested circles or orbital elements
      if (complexity > 0 && layer < layers / 2) {
        const complexityCount = Math.ceil(complexity * 6)
        
        for (let i = 0; i < complexityCount; i++) {
          const orbitPhase = this.calculatePhase(i, complexityCount, time * 2)
          const orbitRadius = finalRadius * 0.7
          const orbitX = centerX + chaosX + Math.cos(orbitPhase) * orbitRadius
          const orbitY = centerY + chaosY + Math.sin(orbitPhase) * orbitRadius
          const orbitSize = finalRadius * 0.2
          
          elements.push({
            type: 'circle',
            props: {
              cx: Math.max(orbitSize, Math.min(width - orbitSize, orbitX)),
              cy: Math.max(orbitSize, Math.min(height - orbitSize, orbitY)),
              r: orbitSize,
              fill: `hsl(${hue + 60}, ${saturation}%, ${lightness + 10}%)`,
              opacity: 0.6
            },
            animationHints: {
              transformOrigin: `${centerX + chaosX}px ${centerY + chaosY}px`,
              easingFunction: 'linear',
              duration: 2000 / frequency
            }
          })
        }
      }
    }

    return elements
  }

  // Generate ripple effect (alternative mode)
  generateRipples(options: GenerationOptions): GeneratedElement[] {
    const elements: GeneratedElement[] = []
    const { width, height, time = 0 } = options
    const centerX = options.centerX || width / 2
    const centerY = options.centerY || height / 2
    
    const { frequency, amplitude, layers } = this.params
    const maxRadius = Math.max(width, height) * 0.6

    for (let i = 0; i < layers * 2; i++) {
      const phase = time * frequency + (i * Math.PI / 4)
      const radius = (Math.sin(phase) * 0.5 + 0.5) * maxRadius
      const opacity = Math.max(0, Math.sin(phase) * 0.8)
      
      if (radius > 10 && opacity > 0.1) {
        elements.push({
          type: 'circle',
          props: {
            cx: centerX,
            cy: centerY,
            r: radius,
            fill: 'none',
            stroke: `hsl(${200 + i * 20}, 70%, 50%)`,
            strokeWidth: Math.max(1, radius / 100),
            opacity: opacity
          }
        })
      }
    }

    return elements
  }
}

// Register the CircleGenerator with the GenerativeEngine
GeneratorRegistry.register('circle', CircleGenerator)