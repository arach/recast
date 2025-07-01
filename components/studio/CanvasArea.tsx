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
import { useLogoStore } from '@/lib/stores/logoStore'
import { useUIStore } from '@/lib/stores/uiStore'
import { exportCanvasAsPNG } from '@/lib/export-utils'
import { CodeEditorPanel } from './CodeEditorPanel'

export function CanvasArea() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Get state from Zustand stores
  const { logos, selectedLogoId, selectLogo, duplicateLogo, deleteLogo } = useLogoStore()
  const { 
    zoom, 
    setZoom, 
    animating, 
    toggleAnimation, 
    previewMode, 
    togglePreviewMode,
    isRendering,
    renderTrigger
  } = useUIStore()
  
  // Time management for animation
  const animationRef = useRef<number>()
  const timeRef = useRef(0)
  const [currentTime, setCurrentTime] = useState(0)
  
  // Canvas state
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 })
  const [codeError, setCodeError] = useState<string | null>(null)
  
  // Copy feedback state
  const [showCopyFeedback, setShowCopyFeedback] = useState(false)
  
  // Hover state for "Make it yours" CTA
  const [hoveredLogoId, setHoveredLogoId] = useState<string | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  // Code editor state for adjusting canvas controls
  const [codeEditorCollapsed, setCodeEditorCollapsed] = useState(true)
  const [codeEditorWidth, setCodeEditorWidth] = useState(500)
  
  // Logo canvas cache - CRITICAL FOR PERFORMANCE
  const logoCanvasCache = useRef<Map<string, { canvas: HTMLCanvasElement, paramHash: string }>>(new Map())
  
  // Force render trigger
  const [forceRender, setForceRender] = useState(0)
  
  // Generate hash for logo parameters to detect changes
  const getLogoParamHash = useCallback((logo: any, time: number) => {
    // Only include time in hash if animating, otherwise cache static version
    const timeComponent = animating ? Math.floor(time * 10) / 10 : 0 // Reduce time precision for better caching
    return JSON.stringify({
      ...logo.parameters,
      code: logo.code,
      time: timeComponent
    })
  }, [animating])

  // Animation loop
  useEffect(() => {
    if (animating) {
      const animate = () => {
        timeRef.current += 0.05
        setCurrentTime(timeRef.current)
        setForceRender(prev => prev + 1)
        animationRef.current = requestAnimationFrame(animate)
      }
      animate()
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
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
  const isPointInLogo = (x: number, y: number, logo: any) => {
    const logoSize = 600
    const position = logo.position || { x: 0, y: 0 }
    return x >= position.x && x <= position.x + logoSize && 
           y >= position.y && y <= position.y + logoSize
  }

  // Center view without changing zoom
  const centerView = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || logos.length === 0) return

    const rect = canvas.getBoundingClientRect()
    const logoSize = 600
    
    // Calculate bounding box of all logos
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
    
    logos.forEach(logo => {
      const position = logo.position || { x: 0, y: 0 }
      minX = Math.min(minX, position.x)
      maxX = Math.max(maxX, position.x + logoSize)
      minY = Math.min(minY, position.y)
      maxY = Math.max(maxY, position.y + logoSize)
    })
    
    const centerX = (minX + maxX) / 2
    const centerY = (minY + maxY) / 2
    
    // Center all logos in view without changing zoom
    setCanvasOffset({
      x: (rect.width / 2) / zoom - centerX,
      y: (rect.height / 2) / zoom - centerY
    })
  }, [zoom, logos])

  // Fit view to show all logos
  const fitToView = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || logos.length === 0) return

    const rect = canvas.getBoundingClientRect()
    const logoSize = 600
    
    // Calculate bounding box of all logos
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
    
    logos.forEach(logo => {
      const position = logo.position || { x: 0, y: 0 }
      minX = Math.min(minX, position.x)
      maxX = Math.max(maxX, position.x + logoSize)
      minY = Math.min(minY, position.y)
      maxY = Math.max(maxY, position.y + logoSize)
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
    
    setZoom(clampedZoom)
    
    // Center all logos in view
    setCanvasOffset({
      x: (rect.width / 2) / clampedZoom - centerX,
      y: (rect.height / 2) / clampedZoom - centerY
    })
  }, [setZoom, logos])

  // Center view on initial load at 100% zoom - only once
  useEffect(() => {
    const timer = setTimeout(() => {
      setZoom(1) // Ensure 100% zoom
      centerView()
    }, 100) // Small delay to ensure canvas is ready
    return () => clearTimeout(timer)
  }, []) // Empty deps - only run once on mount

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
    
    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Save context for transformations
    ctx.save()

    // Apply zoom and pan
    ctx.scale(zoom, zoom)
    ctx.translate(canvasOffset.x, canvasOffset.y)

    // Draw each logo at its position
    logos.forEach((logo) => {
      const position = logo.position || { x: 0, y: 0 }
      ctx.save()
      ctx.translate(position.x, position.y)
      
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
          if (logo.parameters.core.frequency === 4) { // Default ReCast identity
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

          // Generate logo content using the code
          if (logo.code && logo.code.trim()) {
            executeCustomCode(logoCtx, logoCanvas.width, logoCanvas.height, logoParams, logo.code, setCodeError)
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
      
      // Draw white background with rounded corners
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.roundRect(-10, -10, logoCanvas.width + 20, logoCanvas.height + 20, 12)
      ctx.fill()
      
      // Draw refined border
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
  }, [logos, selectedLogoId, zoom, setCodeError, forceRender, canvasOffset, animating, currentTime, getLogoParamHash, renderTrigger])

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
    
    // Debug: log click coordinates and logo positions
    console.log('🖱️ Mouse click at canvas coords:', { canvasX, canvasY })
    console.log('📍 Logos:', logos.map(l => ({ 
      id: l.id, 
      position: l.position || { x: 0, y: 0 },
      bounds: {
        x1: (l.position?.x || 0),
        y1: (l.position?.y || 0),
        x2: (l.position?.x || 0) + 600,
        y2: (l.position?.y || 0) + 600
      }
    })))
    
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
      console.log('🎯 Clicked on logo:', clickedLogo.id)
      selectLogo(clickedLogo.id)
      // Verify selection worked
      setTimeout(() => {
        const currentSelection = useLogoStore.getState().selectedLogoId
        console.log('✅ After selectLogo, selectedLogoId is:', currentSelection)
      }, 100)
    } else {
      console.log('🎯 Clicked on empty canvas at:', canvasX, canvasY)
    }
    
    // Always start dragging (either logo or canvas)
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
    setLastPanPoint({ x: canvasOffset.x, y: canvasOffset.y })
  }, [previewMode, canvasOffset, zoom, logos, selectLogo])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    
    // Update mouse position
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    setMousePosition({ x: mouseX, y: mouseY })
    
    // Check for hover over logos
    if (!isDragging && !previewMode) {
      const canvasX = (mouseX / zoom) - canvasOffset.x
      const canvasY = (mouseY / zoom) - canvasOffset.y
      
      let hoveredLogo = null
      for (let i = logos.length - 1; i >= 0; i--) {
        if (isPointInLogo(canvasX, canvasY, logos[i])) {
          hoveredLogo = logos[i]
          break
        }
      }
      
      setHoveredLogoId(hoveredLogo?.id || null)
    }
    
    // Handle dragging
    if (isDragging && !previewMode) {
      const deltaX = (e.clientX - dragStart.x) / zoom
      const deltaY = (e.clientY - dragStart.y) / zoom
      
      setCanvasOffset({
        x: lastPanPoint.x + deltaX,
        y: lastPanPoint.y + deltaY
      })
    }
  }, [isDragging, dragStart, lastPanPoint, zoom, previewMode, canvasOffset, logos])

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
    const zoomRatio = newZoom / zoom
    const newOffsetX = canvasOffset.x + (mouseX / newZoom) - (mouseX / zoom)
    const newOffsetY = canvasOffset.y + (mouseY / newZoom) - (mouseY / zoom)
    
    setZoom(newZoom)
    setCanvasOffset({
      x: newOffsetX,
      y: newOffsetY
    })
  }, [zoom, setZoom, previewMode, canvasOffset])

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
        seed: selectedLogo.id,
        frequency: selectedLogo.parameters.core.frequency,
        amplitude: selectedLogo.parameters.core.amplitude,
        complexity: selectedLogo.parameters.core.complexity,
        chaos: selectedLogo.parameters.core.chaos,
        damping: selectedLogo.parameters.core.damping,
        layers: selectedLogo.parameters.core.layers,
        barCount: selectedLogo.parameters.custom.barCount || 60,
        barSpacing: selectedLogo.parameters.custom.barSpacing || 2,
        radius: selectedLogo.parameters.core.radius,
        color: selectedLogo.parameters.style.fillColor,
        fillColor: selectedLogo.parameters.style.fillColor,
        strokeColor: selectedLogo.parameters.style.strokeColor,
        backgroundColor: selectedLogo.parameters.style.backgroundColor,
        customParameters: selectedLogo.parameters.custom,
        time: currentTime
      }

      if (selectedLogo.code && selectedLogo.code.trim()) {
        executeCustomCode(logoCtx, logoCanvas.width, logoCanvas.height, logoParams, selectedLogo.code, setCodeError)
      } else {
        generateWaveLines(logoCtx, logoCanvas.width, logoCanvas.height, logoParams)
      }
    }
    
    return logoCanvas
  }, [getLogoParamHash, currentTime, setCodeError])

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
        a.download = `${selectedLogo.templateName || 'logo'}.png`
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

  // Find selected logo
  const selectedLogo = logos.find(logo => logo.id === selectedLogoId)

  return (
    <div 
      ref={containerRef}
      className="flex-1 relative transition-all duration-300 overflow-hidden canvas-container"
      style={{
        background: `
          radial-gradient(circle, #d1d5db 0.8px, transparent 0.8px)
        `,
        backgroundSize: '20px 20px',
        backgroundColor: '#f9fafb'
      }}
    >
      {/* Code Editor Panel - positioned relative to canvas container */}
      <CodeEditorPanel 
        onStateChange={(collapsed, width) => {
          setCodeEditorCollapsed(collapsed)
          setCodeEditorWidth(width)
        }}
      />
      
      {/* Preview Toggle - adjust position based on code editor */}
      <div 
        className="absolute bottom-6 z-20"
        style={{
          left: codeEditorCollapsed ? '50%' : `calc(${codeEditorWidth}px + (100% - ${codeEditorWidth}px) / 2)`,
          transform: 'translateX(-50%)'
        }}
      >
        <Button
          variant={previewMode ? "default" : "outline"}
          size="sm"
          onClick={() => {
            togglePreviewMode()
            // Re-center canvas when exiting preview mode
            if (previewMode) {
              setTimeout(centerView, 100)
            }
          }}
          className="gap-2 bg-white/90 backdrop-blur-sm shadow-lg border"
        >
          {previewMode ? <Grid3x3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {previewMode ? "Back to Canvas" : "Preview Sizes"}
        </Button>
      </div>

      {/* Play/Pause Button - Separate circular button */}
      {!previewMode && (
        <Button
          onClick={toggleAnimation}
          className="absolute top-6 right-6 h-10 w-10 rounded-full shadow-lg bg-white/90 backdrop-blur-sm border hover:bg-white z-20"
          size="sm"
          variant="outline"
          title={animating ? "Pause Animation" : "Play Animation"}
        >
          {animating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
      )}
      
      {/* Logo Action Toolbar */}
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
                  onClick={() => duplicateLogo(selectedLogoId)}
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
                        deleteLogo(selectedLogoId)
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
        <div className="absolute top-20 right-6 z-30 animate-in fade-in-0 duration-200">
          <div className="bg-green-50 border border-green-200 text-green-800 px-3 py-2 rounded-lg shadow-lg text-sm font-medium">
            📋 Copied to clipboard!
          </div>
        </div>
      )}
      
      {/* Make it yours CTA */}
      {hoveredLogoId && !isDragging && !previewMode && (
        <div 
          className="absolute z-30 pointer-events-none animate-in fade-in-0 duration-200"
          style={{
            left: `${mousePosition.x}px`,
            top: `${mousePosition.y - 60}px`,
          }}
        >
          <div className="bg-gray-900 text-white px-4 py-2 rounded-lg shadow-xl text-sm font-medium relative">
            <span className="flex items-center gap-2">
              ✨ Make it yours
            </span>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-gray-900"></div>
            </div>
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
          onMouseLeave={() => {
            handleMouseUp()
            setHoveredLogoId(null)
          }}
        />
      ) : (
        <div className="h-full flex items-center justify-center p-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200/50 overflow-hidden">
            <PreviewGrid 
              canvas={canvasRef.current} 
              seed={selectedLogo?.templateName || 'preview'} 
            />
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
              onClick={() => setZoom(Math.max(0.1, zoom * 0.8))}
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
              onClick={() => setZoom(Math.min(5, zoom * 1.25))}
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
            onClick={centerView}
            className="bg-white/90 backdrop-blur-sm shadow-lg border"
            title="Center view"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Center
          </Button>
        </div>
      )}


      {/* Help Text - adjust position based on code editor */}
      {!previewMode && (
        <div 
          className="absolute bottom-6 z-20"
          style={{
            left: codeEditorCollapsed ? '24px' : `${codeEditorWidth + 24}px`
          }}
        >
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