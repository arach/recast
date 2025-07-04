'use client'

import React, { useRef, useEffect } from 'react'

export default function MinimalDebug() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Clear with white background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, 400, 400)
    
    // Manual implementation of wave bars (simplified from template)
    const params = {
      frequency: 3,
      amplitude: 50,
      barCount: 40,
      barSpacing: 2,
      colorMode: 'spectrum',
      fillOpacity: 1,
      strokeOpacity: 1
    }
    
    const width = 400
    const height = 400
    const time = 0
    
    console.log('Drawing wave bars manually...')
    
    // Draw wave bars manually
    const barWidth = (width - params.barSpacing * (params.barCount - 1)) / params.barCount
    
    for (let i = 0; i < params.barCount; i++) {
      const x = i * (barWidth + params.barSpacing)
      
      // Simple sine wave for center line
      const t = i / params.barCount
      const waveY = height / 2 + Math.sin((t * params.frequency * Math.PI * 2) + time) * params.amplitude
      
      // Simple sine wave for bar height
      const barHeight = Math.abs(Math.sin((t * params.frequency * 3 * Math.PI * 2) + time * 2) * 40) + 20
      
      // Create gradient
      const gradient = ctx.createLinearGradient(x, waveY - barHeight/2, x, waveY + barHeight/2)
      
      // Rainbow spectrum
      const hue = (i / params.barCount) * 360
      gradient.addColorStop(0, `hsla(${hue}, 70%, 60%, 0.9)`)
      gradient.addColorStop(0.5, `hsla(${hue}, 80%, 50%, 1)`)
      gradient.addColorStop(1, `hsla(${hue}, 70%, 60%, 0.9)`)
      
      // Draw bar
      ctx.save()
      ctx.globalAlpha = params.fillOpacity
      ctx.fillStyle = gradient
      
      const radius = barWidth / 3
      ctx.beginPath()
      // Check if roundRect is available
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(x, waveY - barHeight/2, barWidth, barHeight, radius)
        console.log(`Using roundRect for bar ${i}`)
      } else {
        console.log(`roundRect not available, using fillRect for bar ${i}`)
        ctx.rect(x, waveY - barHeight/2, barWidth, barHeight)
      }
      ctx.fill()
      
      ctx.restore()
    }
    
    console.log('Wave bars drawn!')
    
  }, [])
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Minimal Debug</h1>
      <p className="mb-4">Manual wave bars implementation:</p>
      <canvas 
        ref={canvasRef}
        width={400}
        height={400}
        style={{ border: '2px solid #000', display: 'block' }}
      />
    </div>
  )
}