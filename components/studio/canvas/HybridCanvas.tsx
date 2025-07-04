'use client'

import React, { useRef, useEffect, useState } from 'react'
import { useCanvasStore } from '@/lib/stores/canvasStore'
import { useLogoStore } from '@/lib/stores/logoStore'
import { useUIStore } from '@/lib/stores/uiStore'
import { generateVisualization } from '@/lib/visualization-utils'
import { useTemplateCode } from '@/lib/hooks/useTemplateCode'

interface LogoCanvasProps {
  id: string
  templateId?: string
  parameters: any
  width: number
  height: number
  currentTime?: number
}

// Pure rendering component - no interaction logic
// Note: React.memo might prevent re-renders when templateId changes
const LogoCanvas = React.memo(function LogoCanvas({ id, templateId, parameters, width, height, currentTime = 0 }: LogoCanvasProps) {
  const { code } = useTemplateCode(templateId)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height)
    
    try {
      // Generate and render the actual logo
      if (code) {
        generateVisualization(ctx, code, parameters, currentTime, width, height)
        // Don't log during animation - too noisy!
      } else {
        console.log(`⚠️ No code for logo ${id}, showing placeholder`)
        // Fallback placeholder
        ctx.fillStyle = '#e5e7eb'
        ctx.fillRect(0, 0, width, height)
        ctx.fillStyle = '#9ca3af'
        ctx.font = '16px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('No template selected', width / 2, height / 2)
      }
    } catch (error) {
      console.error(`❌ Error rendering logo ${id}:`, error)
      console.error('Error details:', {
        errorMessage: error?.message || 'No message',
        errorString: String(error),
        templateId,
        hasCode: !!code,
        codeLength: code?.length
      })
      // Error state
      ctx.fillStyle = '#fee2e2'
      ctx.fillRect(0, 0, width, height)
      ctx.fillStyle = '#dc2626'
      ctx.font = '14px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('Render Error', width / 2, height / 2)
    }
  }, [id, code, parameters, width, height, currentTime])
  
  return (
    <canvas 
      ref={canvasRef} 
      width={width} 
      height={height}
      style={{ display: 'block' }}
    />
  )
})

interface HybridCanvasProps {
  animating?: boolean
}

export function HybridCanvas({ 
  animating: animatingProp = false
}: HybridCanvasProps) {
  const { offset, zoom, setOffset, setZoom } = useCanvasStore()
  const { logos, selectedLogoId, selectLogo, updateLogo } = useLogoStore()
  const { darkMode } = useUIStore()
  const [hoveredLogoId, setHoveredLogoId] = useState<string | null>(null)
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [isDraggingLogo, setIsDraggingLogo] = useState(false)
  const [draggedLogoId, setDraggedLogoId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [currentTime, setCurrentTime] = useState(0)
  const svgRef = useRef<SVGSVGElement>(null)
  
  // Calculate viewport for SVG
  const [viewport, setViewport] = useState({ width: 1920, height: 1080 })
  
  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    
    updateViewport()
    window.addEventListener('resize', updateViewport)
    return () => window.removeEventListener('resize', updateViewport)
  }, [])
  
  const viewBox = `${-offset.x} ${-offset.y} ${viewport.width / zoom} ${viewport.height / zoom}`
  
  // Add non-passive wheel event listener to prevent default scrolling
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    
    const handleWheelNative = (e: WheelEvent) => {
      e.preventDefault()
      // The actual zoom logic is handled by the React onWheel handler
    }
    
    svg.addEventListener('wheel', handleWheelNative, { passive: false })
    return () => svg.removeEventListener('wheel', handleWheelNative)
  }, [])
  
  // Animation loop
  useEffect(() => {
    if (!animatingProp) return
    
    const startTime = Date.now()
    let animationFrame: number
    
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000
      setCurrentTime(elapsed)
      animationFrame = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [animatingProp])
  
  // Handle logo dragging
  const handleLogoMouseDown = (e: React.MouseEvent, logoId: string) => {
    e.stopPropagation() // Prevent canvas panning
    if (e.button === 0) { // Left click only
      selectLogo(logoId)
      setIsDraggingLogo(true)
      setDraggedLogoId(logoId)
      
      const logo = logos.find(l => l.id === logoId)
      if (logo) {
        // Calculate offset from logo position to mouse position
        const rect = svgRef.current?.getBoundingClientRect()
        if (rect) {
          const mouseX = (e.clientX - rect.left) / zoom - offset.x
          const mouseY = (e.clientY - rect.top) / zoom - offset.y
          setDragOffset({
            x: mouseX - logo.position.x,
            y: mouseY - logo.position.y
          })
        }
      }
    }
  }
  
  // Handle canvas panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && !e.ctrlKey && !e.metaKey && !isDraggingLogo) { // Left click only
      setIsPanning(true)
      setPanStart({ x: e.clientX, y: e.clientY })
    }
  }
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingLogo && draggedLogoId) {
      const rect = svgRef.current?.getBoundingClientRect()
      if (rect) {
        const mouseX = (e.clientX - rect.left) / zoom - offset.x
        const mouseY = (e.clientY - rect.top) / zoom - offset.y
        
        updateLogo(draggedLogoId, {
          position: {
            x: mouseX - dragOffset.x,
            y: mouseY - dragOffset.y
          }
        })
      }
    } else if (isPanning) {
      const dx = e.clientX - panStart.x
      const dy = e.clientY - panStart.y
      setOffset({
        x: offset.x + dx / zoom,
        y: offset.y + dy / zoom
      })
      setPanStart({ x: e.clientX, y: e.clientY })
    }
  }
  
  const handleMouseUp = () => {
    setIsPanning(false)
    setIsDraggingLogo(false)
    setDraggedLogoId(null)
  }
  
  // Handle zoom
  const handleWheel = (e: React.WheelEvent) => {
    // Note: preventDefault is called but won't work in passive listeners
    // The actual prevention happens via useEffect below
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    const newZoom = Math.max(0.1, Math.min(5, zoom * delta))
    
    // Zoom towards mouse position
    const rect = svgRef.current?.getBoundingClientRect()
    if (rect) {
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top
      
      // Convert mouse position to SVG coordinates
      const svgX = -offset.x + mouseX / zoom
      const svgY = -offset.y + mouseY / zoom
      
      // Calculate new offset to keep mouse position fixed
      const newOffset = {
        x: -(svgX - mouseX / newZoom),
        y: -(svgY - mouseY / newZoom)
      }
      
      setZoom(newZoom)
      setOffset(newOffset)
    }
  }
  
  return (
    <svg 
      ref={svgRef}
      width="100%" 
      height="100%"
      viewBox={viewBox}
      className="absolute inset-0"
      style={{ 
        backgroundColor: darkMode ? '#0f172a' : '#f8fafc',
        cursor: isDraggingLogo ? 'move' : isPanning ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Grid Pattern */}
      <defs>
        <pattern 
          id="grid-pattern" 
          width="40" 
          height="40" 
          patternUnits="userSpaceOnUse"
        >
          <circle 
            cx="20" 
            cy="20" 
            r="1.5" 
            fill={darkMode ? "#4b5563" : "#64748b"}
          />
        </pattern>
      </defs>
      
      {/* Grid Background */}
      <rect 
        x={-offset.x - 10000} 
        y={-offset.y - 10000} 
        width="20000" 
        height="20000" 
        fill="url(#grid-pattern)" 
      />
      
      {/* Logos */}
      {logos.map(logo => {
        // Debug logging for templateId issues
        if (typeof logo.templateId !== 'string') {
          console.error(`🚨 Invalid templateId for logo ${logo.id}:`, {
            templateId: logo.templateId,
            type: typeof logo.templateId,
            logoData: logo
          })
        }
        
        // Simple visibility check
        const isVisible = logo.position.x >= -offset.x - 600 && 
                         logo.position.x <= -offset.x + viewport.width/zoom + 600 &&
                         logo.position.y >= -offset.y - 600 && 
                         logo.position.y <= -offset.y + viewport.height/zoom + 600
        
        return (
          <g 
            key={logo.id}
            transform={`translate(${logo.position.x}, ${logo.position.y})`}
          >
            {/* White background with rounded corners */}
            <rect
              x="-10"
              y="-10"
              width="620"
              height="620"
              rx="12"
              fill="white"
              filter="drop-shadow(0 1px 2px rgba(0, 0, 0, 0.05))"
            />
            
            {/* Border */}
            <rect
              x="-10"
              y="-10"
              width="620"
              height="620"
              rx="12"
              fill="none"
              stroke={selectedLogoId === logo.id ? '#3b82f6' : '#f3f4f6'}
              strokeWidth={selectedLogoId === logo.id ? "2" : "1"}
            />
            
            {/* Canvas in foreignObject */}
            <foreignObject 
              width="600" 
              height="600"
              style={{ pointerEvents: 'none' }}
            >
              <LogoCanvas
                key={`${logo.id}-${logo.templateId}`}
                id={logo.id}
                templateId={logo.templateId}
                parameters={logo.parameters}
                width={600}
                height={600}
                currentTime={currentTime}
              />
            </foreignObject>
            
            {/* Invisible interaction rectangle */}
            <rect
              x="-10"
              y="-10"
              width="620"
              height="620"
              fill="transparent"
              style={{ cursor: draggedLogoId === logo.id ? 'move' : 'pointer' }}
              onMouseEnter={() => setHoveredLogoId(logo.id)}
              onMouseLeave={() => setHoveredLogoId(null)}
              onMouseDown={(e) => handleLogoMouseDown(e, logo.id)}
            />
          
          {/* Selection handles */}
          {selectedLogoId === logo.id && (
            <>
              {/* Corner handles */}
              <rect x="-4" y="-4" width="8" height="8" fill="#3b82f6" />
              <rect x="596" y="-4" width="8" height="8" fill="#3b82f6" />
              <rect x="-4" y="596" width="8" height="8" fill="#3b82f6" />
              <rect x="596" y="596" width="8" height="8" fill="#3b82f6" />
            </>
          )}
        </g>
        )
      })}
    </svg>
  )
}