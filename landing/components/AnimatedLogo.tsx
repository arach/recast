'use client'

import { useEffect, useRef } from 'react'

export default function AnimatedLogo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    let animationId: number
    let time = 0
    
    const animate = () => {
      ctx.clearRect(0, 0, 600, 600)
      
      // Background
      ctx.fillStyle = '#f8fafc'
      ctx.fillRect(0, 0, 600, 600)
      
      // Wave bars visualization
      const barCount = 40
      const centerX = 300
      const centerY = 300
      
      for (let i = 0; i < barCount; i++) {
        const angle = (i / barCount) * Math.PI * 2
        const baseRadius = 100
        const waveAmplitude = 50
        const frequency = 3
        
        // Create wave effect
        const waveOffset = Math.sin(time * frequency + i * 0.3) * waveAmplitude
        const radius = baseRadius + waveOffset
        
        // Calculate bar position
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius
        
        // Draw bar
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(angle + Math.PI / 2)
        
        // Gradient color based on position
        const hue = (i / barCount) * 360
        ctx.fillStyle = `hsla(${hue}, 70%, 50%, 0.8)`
        
        const barHeight = 20 + waveOffset * 0.5
        const barWidth = 4
        
        ctx.fillRect(-barWidth / 2, -barHeight / 2, barWidth, barHeight)
        ctx.restore()
      }
      
      time += 0.016 // 60fps
      animationId = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [])
  
  return (
    <div className="gradient-border">
      <canvas 
        ref={canvasRef} 
        width={600} 
        height={600} 
        className="w-full h-full rounded-lg"
        style={{ maxWidth: '500px', height: 'auto' }}
      />
    </div>
  )
}