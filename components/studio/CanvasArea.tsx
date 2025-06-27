'use client'

import React, { useRef, useEffect, useCallback, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
  Grid3x3,
  Move,
} from 'lucide-react'
import { PreviewGrid } from './PreviewGrid'
import {
  generateWaveLines,
  generateAudioBars,
  generateWaveBars,
  generateCircles,
  executeCustomCode,
  VisualizationParams
} from '@/lib/visualization-generators'

interface CanvasAreaProps {
  visualMode: 'wave' | 'bars' | 'wavebars' | 'circles' | 'custom'
  params: VisualizationParams
  customCode?: string
  animating: boolean
  zoom: number
  previewMode: boolean
  isRendering: boolean
  onToggleAnimation: () => void
  onSetZoom: (zoom: number) => void
  onTogglePreview: () => void
  onCodeError: (error: string | null) => void
  forceRender: number
}

export function CanvasArea({
  visualMode,
  params,
  customCode,
  animating,
  zoom,
  previewMode,
  isRendering,
  onToggleAnimation,
  onSetZoom,
  onTogglePreview,
  onCodeError,
  forceRender
}: CanvasAreaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Canvas state
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 })

  // Logo positions on the infinite canvas (positions represent logo centers)
  const [logoPositions] = useState([
    { x: -300, y: -300, id: 'main' }, // Main logo centered at origin (600px logo, so offset by half)
    // Add more logo positions as needed
  ])

  // Center view with balanced spacing around logo
  const centerView = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const logoSize = 600 // Logo is 600x600
    
    // Calculate zoom so logo takes up about 70% of the smaller screen dimension
    // More prominent while still having breathing room
    const targetCoverage = 0.7
    const screenSize = Math.min(rect.width, rect.height)
    const idealZoom = (screenSize * targetCoverage) / logoSize
    
    // Allow larger zoom range for better presentation
    const clampedZoom = Math.max(0.4, Math.min(idealZoom, 1.5))
    
    onSetZoom(clampedZoom)
    
    // To center the logo at (0,0), we need to translate the canvas
    // so that point (0,0) appears at screen center
    // Canvas transform: scale then translate
    // Screen position = (canvas_pos + offset) * zoom
    // We want: (0 + offset) * zoom = screen_center
    // So: offset = screen_center / zoom
    setCanvasOffset({
      x: (rect.width / 2) / clampedZoom,
      y: (rect.height / 2) / clampedZoom
    })
  }, [onSetZoom])

  // Center view on initial load
  useEffect(() => {
    const timer = setTimeout(centerView, 100) // Small delay to ensure canvas is ready
    return () => clearTimeout(timer)
  }, [])

  const drawInfiniteCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Get canvas dimensions
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Clear canvas (transparent so CSS background shows through)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Save context for transformations
    ctx.save()

    // Apply zoom and pan
    ctx.scale(zoom, zoom)
    ctx.translate(canvasOffset.x, canvasOffset.y)

    // Draw each logo at its position
    logoPositions.forEach((logoPos) => {
      ctx.save()
      ctx.translate(logoPos.x, logoPos.y)
      
      // Create a temporary canvas for the logo
      const logoCanvas = document.createElement('canvas')
      logoCanvas.width = 600
      logoCanvas.height = 600
      const logoCtx = logoCanvas.getContext('2d')
      
      if (logoCtx) {
        // Clear logo canvas
        logoCtx.fillStyle = '#ffffff'
        logoCtx.fillRect(0, 0, logoCanvas.width, logoCanvas.height)
        
        // Add subtle background for ReCast logo
        if (params.seed === 'recast-identity') {
          const gradient = logoCtx.createRadialGradient(
            logoCanvas.width / 2, logoCanvas.height / 2, 0,
            logoCanvas.width / 2, logoCanvas.height / 2, logoCanvas.width / 2
          )
          gradient.addColorStop(0, 'rgba(250, 250, 250, 1)')
          gradient.addColorStop(1, 'rgba(245, 245, 245, 1)')
          logoCtx.fillStyle = gradient
          logoCtx.fillRect(0, 0, logoCanvas.width, logoCanvas.height)
        }

        // Generate logo content
        if (visualMode === 'custom' && customCode && customCode.trim()) {
          executeCustomCode(logoCtx, logoCanvas.width, logoCanvas.height, params, customCode, onCodeError)
        } else if (visualMode === 'bars') {
          generateAudioBars(logoCtx, logoCanvas.width, logoCanvas.height, params)
        } else if (visualMode === 'wavebars') {
          generateWaveBars(logoCtx, logoCanvas.width, logoCanvas.height, params)
        } else if (visualMode === 'circles') {
          generateCircles(logoCtx, logoCanvas.width, logoCanvas.height, params)
        } else {
          generateWaveLines(logoCtx, logoCanvas.width, logoCanvas.height, params)
        }

        // Draw the logo with a border
        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)'
        ctx.shadowBlur = 20
        ctx.shadowOffsetY = 10
        
        // Draw white background with rounded corners
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.roundRect(-10, -10, logoCanvas.width + 20, logoCanvas.height + 20, 12)
        ctx.fill()
        
        ctx.shadowColor = 'transparent'
        
        // Draw border
        ctx.strokeStyle = '#e5e7eb'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.roundRect(-10, -10, logoCanvas.width + 20, logoCanvas.height + 20, 12)
        ctx.stroke()
        
        // Draw the logo
        ctx.drawImage(logoCanvas, 0, 0)
      }
      
      ctx.restore()
    })

    ctx.restore()
  }, [visualMode, params, zoom, customCode, onCodeError, forceRender, canvasOffset, logoPositions])

  // Handle mouse events for dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (previewMode) return
    
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
    setLastPanPoint({ x: canvasOffset.x, y: canvasOffset.y })
  }, [previewMode, canvasOffset])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || previewMode) return

    const deltaX = (e.clientX - dragStart.x) / zoom
    const deltaY = (e.clientY - dragStart.y) / zoom
    
    setCanvasOffset({
      x: lastPanPoint.x + deltaX,
      y: lastPanPoint.y + deltaY
    })
  }, [isDragging, dragStart, lastPanPoint, zoom, previewMode])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Handle wheel events for mouse-centered zooming
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (previewMode) return
    
    e.preventDefault()
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    
    // Get mouse position relative to canvas
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    
    // Calculate zoom change
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    const newZoom = Math.min(Math.max(zoom * delta, 0.1), 5)
    
    // Calculate new offset to keep mouse position fixed
    // The point under the mouse should stay under the mouse after zoom
    const zoomRatio = newZoom / zoom
    const newOffsetX = canvasOffset.x + (mouseX / newZoom) - (mouseX / zoom)
    const newOffsetY = canvasOffset.y + (mouseY / newZoom) - (mouseY / zoom)
    
    onSetZoom(newZoom)
    setCanvasOffset({
      x: newOffsetX,
      y: newOffsetY
    })
  }, [zoom, onSetZoom, previewMode, canvasOffset])

  // Reset view to center
  const resetView = useCallback(() => {
    centerView()
  }, [centerView])

  useEffect(() => {
    drawInfiniteCanvas()
  }, [drawInfiniteCanvas])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      drawInfiniteCanvas()
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [drawInfiniteCanvas])

  return (
    <div 
      ref={containerRef}
      className="flex-1 relative transition-all duration-300 overflow-hidden"
      style={{
        background: `
          radial-gradient(circle, #d1d5db 0.8px, transparent 0.8px)
        `,
        backgroundSize: '20px 20px',
        backgroundColor: '#f9fafb'
      }}
    >
      {/* Preview Toggle */}
      <div className="absolute top-6 left-6 z-20">
        <Button
          variant={previewMode ? "default" : "outline"}
          size="sm"
          onClick={onTogglePreview}
          className="gap-2 bg-white/90 backdrop-blur-sm shadow-lg border"
        >
          {previewMode ? <Grid3x3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {previewMode ? "Canvas" : "Preview"}
        </Button>
      </div>

      {/* Canvas Coordinates Display */}
      {!previewMode && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg border shadow-lg px-3 py-1">
            <span className="text-xs font-mono text-gray-600">
              x: {Math.round(-canvasOffset.x)} y: {Math.round(-canvasOffset.y)} zoom: {Math.round(zoom * 100)}%
            </span>
          </div>
        </div>
      )}

      {/* Infinite Canvas */}
      {!previewMode ? (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        />
      ) : (
        <div className="h-full flex items-center justify-center p-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200/50 overflow-hidden">
            <PreviewGrid canvas={canvasRef.current} seed={params.seed} />
          </div>
        </div>
      )}

      {/* Rendering Overlay */}
      {isRendering && !previewMode && (
        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center shadow-lg">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            Rendering...
          </div>
        </div>
      )}

      {/* Control Panel */}
      {!previewMode && (
        <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-20">
          {/* Zoom Controls */}
          <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-lg border shadow-lg p-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onSetZoom(Math.max(0.1, zoom * 0.8))}
              className="h-7 w-7 p-0"
              title="Zoom Out"
            >
              <ZoomOut className="w-3 h-3" />
            </Button>
            <span className="text-xs text-gray-500 w-12 text-center font-mono">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onSetZoom(Math.min(5, zoom * 1.25))}
              className="h-7 w-7 p-0"
              title="Zoom In"
            >
              <ZoomIn className="w-3 h-3" />
            </Button>
          </div>
          
          {/* Center View */}
          <Button
            size="sm"
            variant="outline"
            onClick={resetView}
            className="bg-white/90 backdrop-blur-sm shadow-lg border"
            title="Center view"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Center
          </Button>
        </div>
      )}

      {/* Play/Pause Button */}
      {!previewMode && (
        <Button
          onClick={onToggleAnimation}
          className="absolute top-6 right-6 h-10 w-10 rounded-full shadow-lg bg-white/90 backdrop-blur-sm border hover:bg-white z-20"
          size="sm"
          variant="outline"
          title={animating ? "Pause Animation" : "Play Animation"}
        >
          {animating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
      )}

      {/* Help Text */}
      {!previewMode && (
        <div className="absolute bottom-6 left-6 z-20">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg border shadow-lg px-3 py-2">
            <div className="text-xs text-gray-600 space-y-1">
              <div><kbd className="bg-gray-100 px-1 rounded text-xs">Drag</kbd> to pan</div>
              <div><kbd className="bg-gray-100 px-1 rounded text-xs">Scroll</kbd> to zoom</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}