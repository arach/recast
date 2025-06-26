/**
 * Examples demonstrating the GenerativeEngine system
 */

import { GenerativeEngine, GenerativeParameters, GenerationOptions, GeneratorRegistry } from './generative-engine'
import './wave-generator' // Import to register
import './circle-generator' // Import to register

// Example 1: Create a wave generator using the new system
export function createWaveLogo() {
  const params: GenerativeParameters = {
    frequency: 3,
    amplitude: 50,
    complexity: 0.4,
    chaos: 0.1,
    damping: 0.9,
    layers: 2
  }
  
  const options: GenerationOptions = {
    width: 400,
    height: 200,
    resolution: 100,
    time: 0
  }
  
  const engine = new GenerativeEngine()
  const elements = engine.generateSingle('wave', params, options, 'wave-logo-seed')
  
  console.log('Generated wave elements:', elements)
  return elements
}

// Example 2: Create a circle logo using the new system
export function createCircleLogo() {
  const params: GenerativeParameters = {
    frequency: 1.5,
    amplitude: 20,
    complexity: 0.6,
    chaos: 0.05,
    damping: 0.8,
    layers: 4,
    radius: 60
  }
  
  const options: GenerationOptions = {
    width: 200,
    height: 200,
    resolution: 50,
    time: 0,
    centerX: 100,
    centerY: 100
  }
  
  const engine = new GenerativeEngine()
  const elements = engine.generateSingle('circle', params, options, 'circle-logo-seed')
  
  console.log('Generated circle elements:', elements)
  return elements
}

// Example 3: Multi-generator composition
export function createCompositeeLogo() {
  const engine = new GenerativeEngine()
  
  // Add wave generator
  const waveGenerator = GeneratorRegistry.createGenerator('wave', {
    frequency: 2,
    amplitude: 30,
    complexity: 0.2,
    chaos: 0.05,
    damping: 0.9,
    layers: 1
  }, 'composite-seed')
  
  if (waveGenerator) {
    engine.addGenerator('background-wave', waveGenerator)
  }
  
  // Add circle generator
  const circleGenerator = GeneratorRegistry.createGenerator('circle', {
    frequency: 1,
    amplitude: 10,
    complexity: 0.3,
    chaos: 0.02,
    damping: 0.85,
    layers: 3,
    radius: 40
  }, 'composite-seed')
  
  if (circleGenerator) {
    engine.addGenerator('center-circles', circleGenerator)
  }
  
  const options: GenerationOptions = {
    width: 300,
    height: 150,
    resolution: 80,
    time: 0
  }
  
  const allElements = engine.generate(options)
  console.log('Generated composite elements:', allElements)
  return allElements
}

// Example 4: Animation over time
export function animateWaveLogo(duration: number = 5000) {
  const params: GenerativeParameters = {
    frequency: 4,
    amplitude: 60,
    complexity: 0.5,
    chaos: 0.15,
    damping: 0.8,
    layers: 3
  }
  
  const options: GenerationOptions = {
    width: 400,
    height: 200,
    resolution: 120
  }
  
  const engine = new GenerativeEngine()
  const frames: any[] = []
  
  // Generate frames over time
  for (let t = 0; t <= duration; t += 100) {
    const timeValue = (t / 1000) * Math.PI * 2 // Convert to radians
    const elements = engine.generateSingle('wave', params, { ...options, time: timeValue }, 'animated-seed')
    
    frames.push({
      timestamp: t,
      elements: elements
    })
  }
  
  console.log(`Generated ${frames.length} animation frames`)
  return frames
}

// Example 5: Parameter exploration
export function exploreParameters() {
  const baseParams: GenerativeParameters = {
    frequency: 3,
    amplitude: 50,
    complexity: 0.3,
    chaos: 0.1,
    damping: 0.9,
    layers: 2
  }
  
  const options: GenerationOptions = {
    width: 200,
    height: 100,
    resolution: 50,
    time: 0
  }
  
  const variations = []
  
  // Vary frequency
  for (let freq = 1; freq <= 5; freq++) {
    const params = { ...baseParams, frequency: freq }
    const elements = new GenerativeEngine().generateSingle('wave', params, options, `freq-${freq}`)
    variations.push({ parameter: 'frequency', value: freq, elements })
  }
  
  // Vary complexity
  for (let complexity = 0; complexity <= 1; complexity += 0.25) {
    const params = { ...baseParams, complexity }
    const elements = new GenerativeEngine().generateSingle('wave', params, options, `complexity-${complexity}`)
    variations.push({ parameter: 'complexity', value: complexity, elements })
  }
  
  console.log('Parameter exploration complete:', variations.length, 'variations')
  return variations
}

// Utility: Convert GeneratedElements to SVG string
export function elementsToSVG(elements: any[], width: number, height: number): string {
  const svgElements = elements.map(element => {
    const { type, props } = element
    const attributes = Object.entries(props)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ')
    
    return `<${type} ${attributes} />`
  }).join('\n  ')
  
  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  ${svgElements}
</svg>
  `.trim()
}