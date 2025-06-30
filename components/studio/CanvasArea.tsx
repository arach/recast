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
  Copy,
  Trash2,
  Download,
  RotateCw,
  Clipboard,
  CopyPlus,
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

interface LogoInstance {
  id: string
  x: number
  y: number
  params: {
    seed: string
    frequency: number
    amplitude: number
    complexity: number
    chaos: number
    damping: number
    layers: number
    barCount: number
    barSpacing: number
    radius: number
    color: string
    customParameters: Record<string, any>
  }
  code: string
  presetId?: string
  presetName?: string
}

interface CanvasAreaProps {
  logos: LogoInstance[]
  selectedLogoId: string
  onSelectLogo: (id: string) => void
  onDuplicateLogo: (logoId: string) => void
  onDeleteLogo: (logoId: string) => void
  animating: boolean
  zoom: number
  previewMode: boolean
  isRendering: boolean
  currentTime: number
  onToggleAnimation: () => void
  onSetZoom: (zoom: number) => void
  onTogglePreview: () => void
  onCodeError: (error: string | null) => void
  forceRender: number
}

export function CanvasArea({
  logos,
  selectedLogoId,
  onSelectLogo,
  onDuplicateLogo,
  onDeleteLogo,
  animating,
  zoom,
  previewMode,
  isRendering,
  currentTime,
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
  
  // Copy feedback state
  const [showCopyFeedback, setShowCopyFeedback] = useState(false)
  
  // Logo canvas cache - CRITICAL FOR PERFORMANCE
  const logoCanvasCache = useRef<Map<string, { canvas: HTMLCanvasElement, paramHash: string }>>(new Map())
  
  // Generate hash for logo parameters to detect changes
  const getLogoParamHash = useCallback((logo: LogoInstance, time: number) => {
    // Only include time in hash if animating, otherwise cache static version
    const timeComponent = animating ? Math.floor(time * 10) / 10 : 0 // Reduce time precision for better caching
    return JSON.stringify({
      ...logo.params,
      code: logo.code,
      time: timeComponent
    })
  }, [animating])

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
  
  // Clean up all cached canvases on unmount
  useEffect(() => {
    return () => {
      logoCanvasCache.current.clear()
    }
  }, [])

  // Logo click detection
  const isPointInLogo = (x: number, y: number, logo: LogoInstance) => {
    const logoSize = 600
    return x >= logo.x && x <= logo.x + logoSize && 
           y >= logo.y && y <= logo.y + logoSize
  }

  // Center view to fit all logos
  const centerView = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || logos.length === 0) return

    const rect = canvas.getBoundingClientRect()
    const logoSize = 600
    
    // Calculate bounding box of all logos
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
    
    logos.forEach(logo => {
      minX = Math.min(minX, logo.x)
      maxX = Math.max(maxX, logo.x + logoSize)
      minY = Math.min(minY, logo.y)
      maxY = Math.max(maxY, logo.y + logoSize)
    })
    
    const contentWidth = maxX - minX
    const contentHeight = maxY - minY
    const centerX = (minX + maxX) / 2
    const centerY = (minY + maxY) / 2
    
    // Calculate zoom to fit all logos at 70% coverage
    const targetCoverage = 0.7
    const zoomX = (rect.width * targetCoverage) / contentWidth
    const zoomY = (rect.height * targetCoverage) / contentHeight
    const idealZoom = Math.min(zoomX, zoomY)
    
    const clampedZoom = Math.max(0.2, Math.min(idealZoom, 1.5))
    
    onSetZoom(clampedZoom)
    
    // Center all logos in view
    setCanvasOffset({
      x: (rect.width / 2) / clampedZoom - centerX,
      y: (rect.height / 2) / clampedZoom - centerY
    })
  }, [onSetZoom, logos])

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

    // Simple DPI scaling
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.style.width = rect.width + 'px'
    canvas.style.height = rect.height + 'px'
    
    ctx.scale(dpr, dpr)
    
    // Clear canvas (use actual canvas dimensions)
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Save context for transformations
    ctx.save()

    // Apply zoom and pan
    ctx.scale(zoom, zoom)
    ctx.translate(canvasOffset.x, canvasOffset.y)

    // Draw each logo at its position
    logos.forEach((logo) => {
      ctx.save()
      ctx.translate(logo.x, logo.y)
      
      // PERFORMANCE OPTIMIZATION: Use cached canvas instead of creating new one every frame
      const paramHash = getLogoParamHash(logo, currentTime)
      let logoCanvas: HTMLCanvasElement
      
      const cached = logoCanvasCache.current.get(logo.id)
      if (cached && cached.paramHash === paramHash) {
        // Use cached canvas - no regeneration needed!
        logoCanvas = cached.canvas
      } else {
        // Parameters changed - create new canvas and cache it
        logoCanvas = document.createElement('canvas')
        logoCanvas.width = 600
        logoCanvas.height = 600
        const logoCtx = logoCanvas.getContext('2d')
        
        if (logoCtx) {
          // Clear canvas
          logoCtx.fillStyle = '#ffffff'
          logoCtx.fillRect(0, 0, logoCanvas.width, logoCanvas.height)
          
          // Add subtle background for ReCast logo
          if (logo.params.seed === 'recast-identity') {
            const gradient = logoCtx.createRadialGradient(
              logoCanvas.width / 2, logoCanvas.height / 2, 0,
              logoCanvas.width / 2, logoCanvas.height / 2, logoCanvas.width / 2
            )
            gradient.addColorStop(0, 'rgba(250, 250, 250, 1)')
            gradient.addColorStop(1, 'rgba(245, 245, 245, 1)')
            logoCtx.fillStyle = gradient
            logoCtx.fillRect(0, 0, logoCanvas.width, logoCanvas.height)
          }

          // Create VisualizationParams for this logo
          const logoParams: VisualizationParams = {
            seed: logo.params.seed,
            frequency: logo.params.frequency,
            amplitude: logo.params.amplitude,
            complexity: logo.params.complexity,
            chaos: logo.params.chaos,
            damping: logo.params.damping,
            layers: logo.params.layers,
            barCount: logo.params.barCount,
            barSpacing: logo.params.barSpacing,
            radius: logo.params.radius,
            color: logo.params.color,
            // Include color params at root level if they exist in customParameters
            fillColor: logo.params.fillColor || logo.params.customParameters?.fillColor,
            strokeColor: logo.params.strokeColor || logo.params.customParameters?.strokeColor,
            backgroundColor: logo.params.backgroundColor || logo.params.customParameters?.backgroundColor,
            customParameters: logo.params.customParameters,
            time: currentTime
          }
          

          // Generate logo content using the code
          if (logo.code && logo.code.trim()) {
            executeCustomCode(logoCtx, logoCanvas.width, logoCanvas.height, logoParams, logo.code, onCodeError)
          } else {
            // Fallback to default wave visualization
            generateWaveLines(logoCtx, logoCanvas.width, logoCanvas.height, logoParams)
          }
        }
        
        // Cache the new canvas
        logoCanvasCache.current.set(logo.id, { canvas: logoCanvas, paramHash })
      }

      // Draw selection highlight for selected logo
      const isSelected = logo.id === selectedLogoId
      
      // Draw white background with rounded corners (no shadow for performance)
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.roundRect(-10, -10, logoCanvas.width + 20, logoCanvas.height + 20, 12)
      ctx.fill()
      
      // Draw refined border (very subtle highlight for selected logo)
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
  }, [logos, selectedLogoId, zoom, onCodeError, forceRender, canvasOffset, animating, currentTime])

  // Handle mouse events for dragging and selection
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (previewMode) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    
    // Convert screen coordinates to canvas coordinates
    const canvasX = (mouseX / zoom) - canvasOffset.x
    const canvasY = (mouseY / zoom) - canvasOffset.y
    
    // Check if click is on any logo (check in reverse order so top logos are selected first)
    let clickedLogo = null
    for (let i = logos.length - 1; i >= 0; i--) {
      if (isPointInLogo(canvasX, canvasY, logos[i])) {
        clickedLogo = logos[i]
        break
      }
    }
    
    if (clickedLogo) {
      // Select the clicked logo
      onSelectLogo(clickedLogo.id)
    }
    
    // Always start dragging (either logo or canvas)
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
    setLastPanPoint({ x: canvasOffset.x, y: canvasOffset.y })
  }, [previewMode, canvasOffset, zoom, logos, onSelectLogo])

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
  const handleWheel = useCallback((e: WheelEvent) => {
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

  // Generate logo canvas (shared function)
  const generateLogoCanvas = useCallback((selectedLogo: any) => {
    const paramHash = getLogoParamHash(selectedLogo, currentTime)
    const cached = logoCanvasCache.current.get(selectedLogo.id)
    
    if (cached && cached.paramHash === paramHash) {
      return cached.canvas
    }

    // Generate new canvas
    const logoCanvas = document.createElement('canvas')
    logoCanvas.width = 600
    logoCanvas.height = 600
    const logoCtx = logoCanvas.getContext('2d')
    
    if (logoCtx) {
      logoCtx.fillStyle = '#ffffff'
      logoCtx.fillRect(0, 0, logoCanvas.width, logoCanvas.height)
      
      const logoParams: VisualizationParams = {
        seed: selectedLogo.params.seed,
        frequency: selectedLogo.params.frequency,
        amplitude: selectedLogo.params.amplitude,
        complexity: selectedLogo.params.complexity,
        chaos: selectedLogo.params.chaos,
        damping: selectedLogo.params.damping,
        layers: selectedLogo.params.layers,
        barCount: selectedLogo.params.barCount,
        barSpacing: selectedLogo.params.barSpacing,
        radius: selectedLogo.params.radius,
        color: selectedLogo.params.color,
        customParameters: selectedLogo.params.customParameters,
        time: currentTime
      }

      if (selectedLogo.code && selectedLogo.code.trim()) {
        executeCustomCode(logoCtx, logoCanvas.width, logoCanvas.height, logoParams, selectedLogo.code, onCodeError)
      } else {
        generateWaveLines(logoCtx, logoCanvas.width, logoCanvas.height, logoParams)
      }
    }
    
    return logoCanvas
  }, [getLogoParamHash, currentTime, onCodeError])

  // Download logo as PNG
  const downloadLogoImage = useCallback(() => {
    const selectedLogo = logos.find(logo => logo.id === selectedLogoId)
    if (!selectedLogo) return

    const logoCanvas = generateLogoCanvas(selectedLogo)
    
    logoCanvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${selectedLogo.params.seed || 'logo'}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    }, 'image/png')
  }, [selectedLogoId, logos, generateLogoCanvas])

  // Copy logo as image to clipboard
  const copyLogoImage = useCallback(async () => {
    const selectedLogo = logos.find(logo => logo.id === selectedLogoId)
    if (!selectedLogo) return

    try {
      const logoCanvas = generateLogoCanvas(selectedLogo)

      // Convert canvas to blob and copy to clipboard
      logoCanvas.toBlob(async (blob) => {
        if (blob) {
          try {
            // Check if clipboard API is supported
            if (navigator.clipboard && navigator.clipboard.write) {
              await navigator.clipboard.write([
                new ClipboardItem({
                  'image/png': blob
                })
              ])
              console.log('✅ Logo copied to clipboard!')
              
              // Show visual feedback
              setShowCopyFeedback(true)
              setTimeout(() => setShowCopyFeedback(false), 2000)
            } else {
              console.log('📋 Clipboard not supported, downloading instead...')
              downloadLogoImage()
            }
          } catch (err) {
            console.error('❌ Failed to copy to clipboard:', err)
            console.log('📥 Falling back to download...')
            downloadLogoImage()
          }
        }
      }, 'image/png')
    } catch (error) {
      console.error('❌ Failed to copy logo:', error)
      downloadLogoImage()
    }
  }, [selectedLogoId, logos, generateLogoCanvas, downloadLogoImage])

  // Simple redraw trigger
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

  // Handle wheel events with non-passive listener
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.addEventListener('wheel', handleWheel, { passive: false })
    return () => canvas.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

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

      {/* Floating Logo Toolbar */}
      {!previewMode && selectedLogoId && (
        <div className="absolute top-6 right-20 z-20">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg border shadow-lg p-1 flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={copyLogoImage}
              className="h-8 w-8 p-0"
              title="Copy image to clipboard"
            >
              <Clipboard className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={downloadLogoImage}
              className="h-8 w-8 p-0"
              title="Download as PNG"
            >
              <Download className="w-4 h-4" />
            </Button>
            <div className="h-4 w-px bg-gray-200 mx-1" />
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDuplicateLogo(selectedLogoId)}
              className="h-8 w-8 p-0"
              title="Duplicate this logo"
            >
              <CopyPlus className="w-4 h-4" />
            </Button>
            {logos.length > 1 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  if (confirm('Delete this logo?')) {
                    onDeleteLogo(selectedLogoId)
                  }
                }}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                title="Delete this logo"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Copy Feedback */}
      {showCopyFeedback && (
        <div className="absolute top-20 right-20 z-30 animate-in fade-in-0 duration-200">
          <div className="bg-green-50 border border-green-200 text-green-800 px-3 py-2 rounded-lg shadow-lg text-sm font-medium">
            📋 Copied to clipboard!
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
        />
      ) : (
        <div className="h-full flex items-center justify-center p-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200/50 overflow-hidden">
            <PreviewGrid canvas={canvasRef.current} seed={logos.find(l => l.id === selectedLogoId)?.params.seed || 'preview'} />
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