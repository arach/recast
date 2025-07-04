'use client'

import { useMemo, useEffect, useState } from 'react'

interface ReFlowIdentityLogoProps {
  width?: number
  height?: number
  animated?: boolean
  className?: string
}

export default function ReFlowIdentityLogo({ 
  width = 120, 
  height = 120, 
  animated = false,
  className = ''
}: ReFlowIdentityLogoProps) {
  const [mounted, setMounted] = useState(false)
  const [animationTime, setAnimationTime] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Generate wave data based on ReFlow parameters
  const bars = useMemo(() => {
    // Scale parameters based on logo size
    const baseBarCount = 80
    const scaleFactor = Math.min(width, height) / 120 // Normalize to 120px base size
    const barCount = Math.max(20, Math.floor(baseBarCount * scaleFactor)) // Minimum 20 bars
    const spacing = Math.max(0.5, 2 * scaleFactor) // Minimum 0.5px spacing
    
    const frequency = 3
    const amplitude = Math.min(width, height) * 0.4 // Scale amplitude to logo size
    
    const bars = []
    const totalBarWidth = width / barCount
    const barWidth = Math.max(0.5, totalBarWidth - spacing) // Ensure positive width
    const centerY = height / 2
    
    for (let i = 0; i < barCount; i++) {
      const x = i * totalBarWidth + spacing / 2
      
      // Wave calculation (simplified from ReFlow WaveGenerator)
      const wavePhase = (i / barCount) * frequency * Math.PI * 2
      const waveHeight = Math.sin(wavePhase + animationTime) * amplitude * 0.15
      
      // Bar height calculation
      const barPhase = (i / barCount) * frequency * 3 * Math.PI * 2
      const maxBarHeight = Math.min(width, height) * 0.3
      const baseHeight = Math.abs(Math.sin(barPhase + animationTime * 0.5)) * maxBarHeight + Math.min(width, height) * 0.1
      
      const y = centerY + waveHeight - baseHeight / 2
      const hue = (i / barCount) * 360
      
      bars.push({
        x: x,
        y: y,
        width: barWidth,
        height: baseHeight,
        color: `hsl(${hue}, 70%, 50%)`
      })
    }
    
    return bars
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

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <div style={{ width, height, display: 'block' }} />
  }

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ display: 'block', cursor: 'pointer' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {bars.map((bar, index) => (
        <rect
          key={index}
          x={Math.max(0, bar.x)}
          y={Math.max(0, bar.y)}
          width={Math.max(0.1, bar.width)}
          height={Math.max(0.1, bar.height)}
          fill={bar.color}
          rx={Math.max(0, bar.width / 4)}
          ry={Math.max(0, bar.width / 4)}
        />
      ))}
    </svg>
  )
}

// Configuration used to generate this logo:
// // {
//   "seed": "reflow-identity",
//   "mode": "wavebars",
//   "frequency": 3,
//   "amplitude": 80,
//   "complexity": 0.2,
//   "chaos": 0.15,
//   "damping": 0.85,
//   "layers": 1,
//   "barCount": 80,
//   "barSpacing": 2
// }
