import { WaveGenerator, WaveParameters, GenerationOptions } from '@/core/wave-generator'

export interface ExportConfig {
  seed: string
  mode: 'wave' | 'bars' | 'wavebars' | 'circles'
  frequency: number
  amplitude: number
  complexity: number
  chaos: number
  damping: number
  layers: number
  barCount?: number
  barSpacing?: number
  radius?: number
  colors?: string[]
}

interface LogoPackage {
  svgString: string
  animationScript: string
  config: ExportConfig
  embedCode: string
}

export function generateSVGFromCanvas(
  width: number,
  height: number,
  config: ExportConfig,
  time: number = 0
): string {
  const { mode, seed, frequency, amplitude, complexity, chaos, damping, layers, barCount = 50, barSpacing = 2 } = config
  
  if (mode === 'wavebars') {
    return generateWaveBarsSVG(width, height, config, time)
  }
  
  // For other modes, fall back to canvas-based rendering
  console.log('🎨 SVG export mode', mode, 'not implemented, falling back to canvas export')
  return ''
}

function generateWaveBarsSVG(
  width: number,
  height: number,
  config: ExportConfig,
  time: number
): string {
  const { seed, frequency, amplitude, complexity, chaos, barCount = 50, barSpacing = 2 } = config
  
  // Generate wave data
  const waveParams: WaveParameters = {
    amplitude: amplitude * 0.8,
    frequency,
    phase: 0,
    complexity,
    chaos: 0,
    damping: 0.9,
    layers: 1
  }

  const waveOptions: GenerationOptions = {
    width,
    height,
    resolution: barCount,
    time,
    seed
  }

  const waveGenerator = new WaveGenerator(waveParams, seed)
  const waveResults = waveGenerator.generate(waveOptions)
  const waveData = waveResults && waveResults.length > 0 ? waveResults[0] : []

  // Generate bar heights
  const barParams: WaveParameters = {
    amplitude: 40,
    frequency: frequency * 3,
    phase: 0,
    complexity: complexity * 1.5,
    chaos: chaos,
    damping: 1,
    layers: 1
  }

  const barGenerator = new WaveGenerator(barParams, seed + '-bars')
  const barResults = barGenerator.generate(waveOptions)
  const barData = barResults && barResults.length > 0 ? barResults[0] : []

  // Create SVG
  const bars: string[] = []
  const totalBarWidth = width / barCount
  const barWidth = totalBarWidth - barSpacing
  const centerY = height / 2

  for (let i = 0; i < barCount; i++) {
    const x = i * totalBarWidth + barSpacing / 2
    const waveHeight = (waveData.length > i ? waveData[i].y : 0) * 0.5
    const barHeight = Math.abs(barData.length > i ? barData[i].y : 20) * 0.7 + 20
    const y = centerY + waveHeight - barHeight / 2
    const hue = (i / barCount) * 360
    const radius = barWidth / 3

    // Create gradient definition
    const gradientId = `bar-gradient-${i}`
    bars.push(`
      <defs>
        <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:hsl(${hue}, 70%, 60%);stop-opacity:0.9" />
          <stop offset="50%" style="stop-color:hsl(${hue}, 80%, 50%);stop-opacity:1" />
          <stop offset="100%" style="stop-color:hsl(${hue}, 70%, 60%);stop-opacity:0.9" />
        </linearGradient>
      </defs>
    `)

    // Create bar
    bars.push(`
      <rect 
        class="wave-bar" 
        data-index="${i}"
        x="${x.toFixed(2)}" 
        y="${y.toFixed(2)}" 
        width="${barWidth.toFixed(2)}" 
        height="${barHeight.toFixed(2)}" 
        rx="${radius.toFixed(2)}"
        fill="url(#${gradientId})"
      />
    `)

    // Add circles for tall bars
    if (barHeight > 20) {
      const circleRadius = barWidth / 2.5
      bars.push(`
        <circle 
          class="wave-bar-circle" 
          data-index="${i}"
          cx="${(x + barWidth/2).toFixed(2)}" 
          cy="${(y - 5).toFixed(2)}" 
          r="${circleRadius.toFixed(2)}"
          fill="url(#${gradientId})"
        />
        <circle 
          class="wave-bar-circle" 
          data-index="${i}"
          cx="${(x + barWidth/2).toFixed(2)}" 
          cy="${(y + barHeight + 5).toFixed(2)}" 
          r="${circleRadius.toFixed(2)}"
          fill="url(#${gradientId})"
        />
      `)
    }
  }

  return `
    <svg 
      viewBox="0 0 ${width} ${height}" 
      xmlns="http://www.w3.org/2000/svg"
      class="recast-logo"
    >
      ${bars.join('')}
    </svg>
  `
}

export function generateReactComponent(config: ExportConfig): string {
  const componentName = config.seed.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join('')
  
  return `'use client'

import { useMemo, useEffect, useState, useRef } from 'react'

interface ${componentName}LogoProps {
  width?: number
  height?: number
  animated?: boolean
  className?: string
}

export default function ${componentName}Logo({ 
  width = 120, 
  height = 120, 
  animated = false,
  className = ''
}: ${componentName}LogoProps) {
  const [animationTime, setAnimationTime] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  
  // Configuration from ReCast
  const config = ${JSON.stringify(config, null, 4).split('\n').map((line, i) => i === 0 ? line : '  ' + line).join('\n')}
  
  // Generate SVG elements by rendering to canvas and extracting data
  const generateElements = useMemo(() => {
    // Create temporary canvas to generate the visual data
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = width
    tempCanvas.height = height
    const ctx = tempCanvas.getContext('2d')
    if (!ctx) return []
    
    // Clear canvas
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)
    
    // Generate based on mode
    const elements: Array<{
      type: 'rect' | 'path'
      props: Record<string, any>
    }> = []
    
    if (config.mode === 'wavebars') {
      const scaleFactor = Math.min(width, height) / 120
      const baseBarCount = config.barCount || 50
      const barCount = Math.max(20, Math.floor(baseBarCount * scaleFactor))
      const spacing = Math.max(0.5, (config.barSpacing || 2) * scaleFactor)
      
      const totalBarWidth = width / barCount
      const barWidth = Math.max(0.5, totalBarWidth - spacing)
      const centerY = height / 2
      
      for (let i = 0; i < barCount; i++) {
        const x = i * totalBarWidth + spacing / 2
        
        // Use same wave calculation as main app
        const wavePhase = (i / barCount) * config.frequency * Math.PI * 2
        const waveHeight = Math.sin(wavePhase + animationTime) * (config.amplitude * 0.3)
        
        const barPhase = (i / barCount) * config.frequency * 3 * Math.PI * 2  
        const maxBarHeight = Math.min(width, height) * 0.3
        const baseHeight = Math.abs(Math.sin(barPhase + animationTime * 0.5)) * maxBarHeight + Math.min(width, height) * 0.1
        
        const y = centerY + waveHeight - baseHeight / 2
        const hue = (i / barCount) * 360
        
        elements.push({
          type: 'rect',
          props: {
            x: Math.max(0, x),
            y: Math.max(0, y),
            width: Math.max(0.1, barWidth),
            height: Math.max(0.1, baseHeight),
            fill: \`hsl(\${hue}, 70%, 50%)\`,
            rx: Math.max(0, barWidth / 4),
            ry: Math.max(0, barWidth / 4)
          }
        })
      }
    } else if (config.mode === 'wave') {
      // Generate wave lines - simplified version
      const points = []
      const resolution = Math.min(200, width)
      
      for (let i = 0; i <= resolution; i++) {
        const x = (i / resolution) * width
        const phase = (i / resolution) * config.frequency * Math.PI * 2
        const y = height / 2 + Math.sin(phase + animationTime) * (config.amplitude * 0.3)
        points.push(\`\${x},\${y}\`)
      }
      
      elements.push({
        type: 'path',
        props: {
          d: \`M \${points.join(' L ')}\`,
          stroke: 'hsl(200, 70%, 50%)',
          strokeWidth: Math.max(1, width / 100),
          fill: 'none'
        }
      })
    } else if (config.mode === 'bars') {
      // Generate audio bars
      const barCount = Math.min(50, Math.floor(width / 4))
      const barWidth = (width / barCount) * 0.8
      const spacing = width / barCount - barWidth
      
      for (let i = 0; i < barCount; i++) {
        const x = i * (barWidth + spacing) + spacing / 2
        const phase = (i / barCount) * Math.PI * 2 + animationTime
        const barHeight = (Math.abs(Math.sin(phase)) * config.amplitude * 0.4) + 10
        const y = height - barHeight
        
        elements.push({
          type: 'rect',
          props: {
            x: Math.max(0, x),
            y: Math.max(0, y),
            width: Math.max(0.1, barWidth),
            height: Math.max(0.1, barHeight),
            fill: \`hsl(\${(i / barCount) * 360}, 70%, 50%)\`,
            rx: Math.max(0, barWidth / 4)
          }
        })
      }
    } else if (config.mode === 'circles') {
      // Generate circles using the new generator system
      const scaleFactor = Math.min(width, height) / 120
      const baseRadius = (config.radius || 50) * scaleFactor
      const centerX = width / 2
      const centerY = height / 2
      
      for (let layer = 0; layer < config.layers; layer++) {
        const layerPhase = (layer / config.layers) * config.frequency * Math.PI * 2 + animationTime
        const layerRadius = baseRadius * Math.pow(config.damping, layer)
        const radiusVariation = (config.amplitude * 0.3) * Math.sin(layerPhase)
        const finalRadius = Math.max(1, layerRadius + radiusVariation)
        
        const hue = (layer / config.layers) * 360 + animationTime * 30
        const saturation = 70 - (layer * 5)
        const lightness = 50 + Math.sin(layerPhase) * 20
        
        elements.push({
          type: 'circle',
          props: {
            cx: centerX,
            cy: centerY,
            r: finalRadius,
            fill: 'none',
            stroke: \`hsl(\${hue}, \${saturation}%, \${lightness}%)\`,
            strokeWidth: Math.max(1, finalRadius / 20),
            opacity: 0.8 - (layer * 0.1)
          }
        })
        
        // Add complexity: orbital elements
        if (config.complexity > 0 && layer < config.layers / 2) {
          const complexityCount = Math.ceil(config.complexity * 6)
          
          for (let i = 0; i < complexityCount; i++) {
            const orbitPhase = (i / complexityCount) * Math.PI * 2 + animationTime * 2
            const orbitRadius = finalRadius * 0.7
            const orbitX = centerX + Math.cos(orbitPhase) * orbitRadius
            const orbitY = centerY + Math.sin(orbitPhase) * orbitRadius
            const orbitSize = finalRadius * 0.2
            
            elements.push({
              type: 'circle',
              props: {
                cx: Math.max(orbitSize, Math.min(width - orbitSize, orbitX)),
                cy: Math.max(orbitSize, Math.min(height - orbitSize, orbitY)),
                r: orbitSize,
                fill: \`hsl(\${hue + 60}, \${saturation}%, \${lightness + 10}%)\`,
                opacity: 0.6
              }
            })
          }
        }
      }
    }
    
    return elements
  }, [width, height, animationTime])

  // Animation loop - runs when animated or hovered
  useEffect(() => {
    if (!animated && !isHovered) return

    let animationFrameId: number
    const animate = () => {
      setAnimationTime(prev => prev + 0.05)
      animationFrameId = requestAnimationFrame(animate)
    }
    
    animationFrameId = requestAnimationFrame(animate)
    
    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [animated, isHovered])

  return (
    <svg 
      ref={svgRef}
      width={width} 
      height={height} 
      viewBox={\`0 0 \${width} \${height}\`}
      className={className}
      style={{ display: 'block', cursor: 'pointer' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {generateElements.map((element, index) => {
        if (element.type === 'rect') {
          return (
            <rect
              key={index}
              {...element.props}
            />
          )
        } else if (element.type === 'path') {
          return (
            <path
              key={index}
              {...element.props}
            />
          )
        } else if (element.type === 'circle') {
          return (
            <circle
              key={index}
              {...element.props}
            />
          )
        }
        return null
      })}
    </svg>
  )
}

// Configuration used to generate this logo:
// ${JSON.stringify(config, null, 2).split('\n').map(line => `// ${line}`).join('\n')}
`
}

export function generateAnimationScript(config: ExportConfig): string {
  return `
(function() {
  const logo = document.currentScript.previousElementSibling;
  const bars = logo.querySelectorAll('.wave-bar, .wave-bar-circle');
  
  // Store original transforms
  bars.forEach((bar, i) => {
    bar.dataset.originalTransform = bar.getAttribute('transform') || '';
  });
  
  // Animation on hover
  logo.addEventListener('mouseenter', function() {
    bars.forEach((bar, i) => {
      const delay = (i % ${config.barCount || 50}) * 50; // 50ms stagger
      const index = parseInt(bar.dataset.index);
      
      bar.style.transition = 'transform 0.3s ease-out';
      bar.style.transformOrigin = 'center bottom';
      
      setTimeout(() => {
        bar.style.transform = 'scaleY(1.3) translateY(-2px)';
        bar.style.filter = 'brightness(1.2) saturate(1.2)';
        bar.style.opacity = '1';
      }, delay);
    });
  });
  
  logo.addEventListener('mouseleave', function() {
    bars.forEach((bar) => {
      bar.style.transform = bar.dataset.originalTransform;
      bar.style.filter = '';
      bar.style.opacity = '0.9';
    });
  });
  
  // Initial state
  bars.forEach((bar) => {
    bar.style.opacity = '0.9';
  });
})();
  `
}

export function generateEmbedCode(svgString: string, animationScript: string): string {
  return `
<!-- ReCast Dynamic Logo -->
<div class="recast-logo-container" style="display: inline-block;">
  ${svgString}
  <script>
  ${animationScript}
  </script>
</div>
  `
}

export function generateLogoPackage(
  width: number,
  height: number,
  config: ExportConfig,
  time: number = 0
): LogoPackage {
  const svgString = generateSVGFromCanvas(width, height, config, time)
  const animationScript = generateAnimationScript(config)
  const embedCode = generateEmbedCode(svgString, animationScript)
  
  return {
    svgString,
    animationScript,
    config,
    embedCode
  }
}