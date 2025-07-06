'use client'

import React, { useRef, useEffect, useState } from 'react'
import { useCanvasStore } from '@/lib/stores/canvasStore'
import { useLogoStore } from '@/lib/stores/logoStore'
import { useUIStore } from '@/lib/stores/uiStore'
import { generateJSVisualization } from '@/lib/js-visualization-utils'

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
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height)
    
    // Generate and render the actual logo
    if (templateId) {
      generateJSVisualization(ctx, templateId, parameters, currentTime, width, height)
    } else {
      console.log(`⚠️ No template selected for logo ${id}, showing placeholder`)
      // Fallback placeholder
      ctx.fillStyle = '#e5e7eb'
      ctx.fillRect(0, 0, width, height)
      ctx.fillStyle = '#9ca3af'
      ctx.font = '16px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('No template selected', width / 2, height / 2)
    }
  }, [id, templateId, parameters, width, height, currentTime])
  
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
  
  // Local offset state during panning to avoid constant store updates
  const [localOffset, setLocalOffset] = useState(offset)
  const [panStartOffset, setPanStartOffset] = useState(offset)
  
  // Calculate viewport for SVG
  const [viewport, setViewport] = useState({ width: 1920, height: 1080 })
  
  // Sync local offset with store offset when it changes externally
  useEffect(() => {
    if (!isPanning) {
      setLocalOffset(offset)
    }
  }, [offset, isPanning])
  
  // Remove throttled functions - we now only update store on mouse up
  
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
  
  // Use localOffset for immediate visual feedback during panning
  const viewBox = `${-localOffset.x} ${-localOffset.y} ${viewport.width / zoom} ${viewport.height / zoom}`
  
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
      setPanStartOffset(localOffset) // Capture the offset at start of pan
    }
  }
  
  // Track logo position during dragging without updating store
  const [draggingLogoPosition, setDraggingLogoPosition] = useState<{ x: number, y: number } | null>(null)
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingLogo && draggedLogoId) {
      const rect = svgRef.current?.getBoundingClientRect()
      if (rect) {
        const mouseX = (e.clientX - rect.left) / zoom - localOffset.x
        const mouseY = (e.clientY - rect.top) / zoom - localOffset.y
        
        // Update local state only for smooth dragging
        const newPosition = {
          x: mouseX - dragOffset.x,
          y: mouseY - dragOffset.y
        }
        setDraggingLogoPosition(newPosition)
        
        // Remove store updates during drag - only update on mouse up
      }
    } else if (isPanning) {
      const dx = e.clientX - panStart.x
      const dy = e.clientY - panStart.y
      const newOffset = {
        x: panStartOffset.x + dx / zoom,
        y: panStartOffset.y + dy / zoom
      }
      // Update local offset only - no store updates during pan
      setLocalOffset(newOffset)
    }
  }
  
  const handleMouseUp = () => {
    if (isPanning) {
      // Commit final offset to store
      setOffset(localOffset)
    }
    if (isDraggingLogo && draggedLogoId && draggingLogoPosition) {
      // Commit final logo position to store
      updateLogo(draggedLogoId, {
        position: draggingLogoPosition
      })
    }
    setIsPanning(false)
    setIsDraggingLogo(false)
    setDraggedLogoId(null)
    setDraggingLogoPosition(null)
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
      const svgX = -localOffset.x + mouseX / zoom
      const svgY = -localOffset.y + mouseY / zoom
      
      // Calculate new offset to keep mouse position fixed
      const newOffset = {
        x: -(svgX - mouseX / newZoom),
        y: -(svgY - mouseY / newZoom)
      }
      
      // Update local state immediately for smooth zooming
      setLocalOffset(newOffset)
      
      // Only update zoom in store, not offset (less critical)
      setZoom(newZoom)
      // Commit offset less frequently or not at all during zoom
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
            r="1.0" 
            fill={darkMode ? "#3f4652" : "#8394a8"}
            opacity="0.7"
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
        // Skip hidden logos
        if (logo.visible === false) {
          return null
        }
        
        // Use dragging position if this logo is being dragged
        const position = (isDraggingLogo && draggedLogoId === logo.id && draggingLogoPosition) 
          ? draggingLogoPosition 
          : logo.position
        
        // Simple viewport check for performance
        const isInViewport = position.x >= -localOffset.x - 600 && 
                            position.x <= -localOffset.x + viewport.width/zoom + 600 &&
                            position.y >= -localOffset.y - 600 && 
                            position.y <= -localOffset.y + viewport.height/zoom + 600
        
        return (
          <g 
            key={logo.id}
            transform={`translate(${position.x}, ${position.y})`}
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
            
            {/* Canvas in foreignObject - only render if in viewport */}
            {isInViewport && (
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
            )}
            
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
        </g>
      )
      })}
    </svg>
  )
}