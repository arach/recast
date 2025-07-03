'use client'

import React, { useRef, useEffect, useCallback } from 'react'
import { useCanvasStore } from '@/lib/stores/canvasStore'
import { useLogoStore } from '@/lib/stores/logoStore'
import { useUIStore } from '@/lib/stores/uiStore'
import {
  generateWaveLines,
  executeCustomCode,
  VisualizationParams
} from '@/lib/visualization-generators'

interface CanvasRendererProps {
  canvasRef: React.RefObject<HTMLCanvasElement>
  currentTime: number
  onCodeError?: (error: string | null) => void
}

export function CanvasRenderer({ canvasRef, currentTime, onCodeError }: CanvasRendererProps) {
  const { offset, zoom } = useCanvasStore()
  const { logos, selectedLogoId } = useLogoStore()
  const { renderTrigger } = useUIStore()
  
  // Logo canvas cache for performance
  const logoCanvasCache = useRef<Map<string, { canvas: HTMLCanvasElement, paramHash: string }>>(new Map())
  
  // Generate hash for logo parameters
  const getLogoParamHash = useCallback((logo: any, time: number) => {
    const timeComponent = Math.floor(time * 10) / 10
    return JSON.stringify({
      ...logo.parameters,
      code: logo.code,
      time: timeComponent
    })
  }, [])
  
  // Clean up cache for removed logos
  useEffect(() => {
    const currentLogoIds = new Set(logos.map(logo => logo.id))
    const cachedIds = Array.from(logoCanvasCache.current.keys())
    
    cachedIds.forEach(cachedId => {
      if (!currentLogoIds.has(cachedId)) {
        logoCanvasCache.current.delete(cachedId)
      }
    })
  }, [logos])
  
  // Main rendering function
  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // DPI scaling
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.style.width = rect.width + 'px'
    canvas.style.height = rect.height + 'px'
    
    ctx.scale(dpr, dpr)
    
    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)
    
    // Save context for transformations
    ctx.save()
    
    // Apply zoom and pan
    ctx.scale(zoom, zoom)
    ctx.translate(offset.x, offset.y)
    
    // Render each logo
    logos.forEach(logo => {
      const position = logo.position || { x: 0, y: 0 }
      ctx.save()
      ctx.translate(position.x, position.y)
      
      // Get or create cached canvas
      const paramHash = getLogoParamHash(logo, currentTime)
      let logoCanvas: HTMLCanvasElement
      
      const cached = logoCanvasCache.current.get(logo.id)
      if (cached && cached.paramHash === paramHash) {
        logoCanvas = cached.canvas
      } else {
        // Create new canvas
        logoCanvas = document.createElement('canvas')
        logoCanvas.width = 600
        logoCanvas.height = 600
        const logoCtx = logoCanvas.getContext('2d')
        
        if (logoCtx) {
          // Clear with white background
          logoCtx.fillStyle = '#ffffff'
          logoCtx.fillRect(0, 0, logoCanvas.width, logoCanvas.height)
          
          // Create visualization params
          const logoParams: VisualizationParams = {
            seed: logo.id,
            frequency: logo.parameters.core.frequency,
            amplitude: logo.parameters.core.amplitude,
            complexity: logo.parameters.core.complexity,
            chaos: logo.parameters.core.chaos,
            damping: logo.parameters.core.damping,
            layers: logo.parameters.core.layers,
            barCount: logo.parameters.custom.barCount || 60,
            barSpacing: logo.parameters.custom.barSpacing || 2,
            radius: logo.parameters.core.radius,
            color: logo.parameters.style.fillColor,
            fillColor: logo.parameters.style.fillColor,
            strokeColor: logo.parameters.style.strokeColor,
            backgroundColor: logo.parameters.style.backgroundColor,
            customParameters: logo.parameters.custom,
            time: currentTime
          }
          
          // Generate content
          if (logo.code && logo.code.trim()) {
            executeCustomCode(logoCtx, logoCanvas.width, logoCanvas.height, logoParams, logo.code, onCodeError || (() => {}))
          } else {
            generateWaveLines(logoCtx, logoCanvas.width, logoCanvas.height, logoParams)
          }
        }
        
        // Cache the result
        logoCanvasCache.current.set(logo.id, { canvas: logoCanvas, paramHash })
      }
      
      // Draw selection state
      const isSelected = logo.id === selectedLogoId
      
      // White background with rounded corners
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.roundRect(-10, -10, logoCanvas.width + 20, logoCanvas.height + 20, 12)
      ctx.fill()
      
      // Border
      ctx.strokeStyle = isSelected ? '#3b82f6' : '#f3f4f6'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.roundRect(-10, -10, logoCanvas.width + 20, logoCanvas.height + 20, 12)
      ctx.stroke()
      
      // Draw the logo
      ctx.drawImage(logoCanvas, 0, 0)
      
      ctx.restore()
    })
    
    ctx.restore()
  }, [canvasRef, offset, zoom, logos, selectedLogoId, currentTime, getLogoParamHash, onCodeError, renderTrigger])
  
  // Render on dependencies change
  useEffect(() => {
    render()
  }, [render])
  
  // Handle resize
  useEffect(() => {
    const handleResize = () => render()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [render])
  
  return null // Pure renderer, no UI
}