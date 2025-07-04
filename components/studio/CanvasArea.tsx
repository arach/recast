'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Play, Pause, Eye, Grid3x3 } from 'lucide-react'
import { PreviewGrid } from './PreviewGrid'
import { CodeEditorPanel } from './CodeEditorPanel'
import { CanvasRenderer } from './canvas/CanvasRenderer'
import { CanvasControls } from './canvas/CanvasControls'
import { CanvasToolbar } from './canvas/CanvasToolbar'
import { LogoActions } from './canvas/LogoActions'
import { useCanvas } from '@/lib/hooks/useCanvas'
import { useCanvasAnimation } from '@/lib/hooks/useCanvasAnimation'
import { useCanvasStore } from '@/lib/stores/canvasStore'
import { useUIStore } from '@/lib/stores/uiStore'
import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo'
import { useLogoStore } from '@/lib/stores/logoStore'

export function CanvasArea() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [codeError, setCodeError] = useState<string | null>(null)
  
  // Canvas state and interactions
  const { setCodeEditorState, toolMode } = useCanvasStore()
  const { 
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  } = useCanvas(canvasRef)
  
  // Animation state
  const { animating, currentTime, toggleAnimation } = useCanvasAnimation()
  
  // UI state
  const { previewMode, togglePreviewMode, isRendering, darkMode } = useUIStore()
  const { logo: selectedLogo } = useSelectedLogo()
  
  // Initialize canvas centering on selected logo
  useEffect(() => {
    const { centerView } = useCanvasStore.getState()
    const { getSelectedLogo } = useLogoStore.getState()
    const selectedLogo = getSelectedLogo()
    
    if (selectedLogo) {
      const position = selectedLogo.position || { x: 0, y: 0 }
      setTimeout(() => centerView([position]), 100)
    }
  }, [])
  
  // Handle canvas resizing when container size changes
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout
    
    const resizeCanvas = () => {
      if (canvasRef.current && containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        canvasRef.current.width = width
        canvasRef.current.height = height
        
        // Force re-render after resize
        const { setRenderTrigger } = useUIStore.getState()
        setRenderTrigger(Date.now())
      }
    }
    
    // Debounced resize handler
    const debouncedResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(resizeCanvas, 100)
    }
    
    resizeCanvas()
    window.addEventListener('resize', debouncedResize)
    
    // Use ResizeObserver to detect container size changes
    const resizeObserver = new ResizeObserver(debouncedResize)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }
    
    return () => {
      window.removeEventListener('resize', debouncedResize)
      resizeObserver.disconnect()
      clearTimeout(resizeTimeout)
    }
  }, [])
  
  // Handle code editor state changes
  const handleCodeEditorStateChange = useCallback((collapsed: boolean, width: number) => {
    // When collapsed, the sidebar is 40px wide
    const effectiveWidth = collapsed ? 40 : width
    setCodeEditorState(collapsed, effectiveWidth)
    
    // Force canvas repaint on state change
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    }, 300) // Wait for animation to complete
  }, [setCodeEditorState])
  
  return (
    <div 
      ref={containerRef}
      className="flex-1 relative transition-all duration-300 overflow-hidden canvas-container"
      style={{
        background: darkMode 
          ? 'radial-gradient(circle, #374151 0.8px, transparent 0.8px)'
          : 'radial-gradient(circle, #d1d5db 0.8px, transparent 0.8px)',
        backgroundSize: '20px 20px',
        backgroundColor: darkMode ? '#0f172a' : '#f9fafb'
      }}
    >
      {/* Code Editor Panel */}
      <CodeEditorPanel onStateChange={handleCodeEditorStateChange} />
      
      {/* Preview Toggle */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
        <Button
          variant={previewMode ? "default" : "outline"}
          size="sm"
          onClick={togglePreviewMode}
          className={`gap-2 backdrop-blur-sm shadow-lg border ${
            darkMode 
              ? 'bg-gray-900/90 border-gray-700 hover:bg-gray-800/90' 
              : 'bg-white/90 border-gray-200 hover:bg-gray-50/90'
          }`}
        >
          {previewMode ? <Grid3x3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {previewMode ? "Back to Canvas" : "Preview Sizes"}
        </Button>
      </div>
      
      {/* Play/Pause Button */}
      {!previewMode && (
        <Button
          onClick={toggleAnimation}
          className={`absolute top-6 right-6 h-10 w-10 rounded-full shadow-lg backdrop-blur-sm border z-20 ${
            darkMode
              ? 'bg-gray-900/90 border-gray-700 hover:bg-gray-800/90 text-white'
              : 'bg-white/90 border-gray-200 hover:bg-white'
          }`}
          size="sm"
          variant="outline"
          title={animating ? "Pause Animation" : "Play Animation"}
        >
          {animating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
      )}
      
      {/* Canvas Toolbar */}
      {!previewMode && (
        <CanvasToolbar />
      )}
      
      {/* Logo Actions Toolbar */}
      {!previewMode && selectedLogo && (
        <LogoActions className="absolute top-6 right-20 z-20" />
      )}
      
      {/* Canvas or Preview */}
      {!previewMode ? (
        <>
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ 
              cursor: toolMode === 'select' 
                ? 'default' 
                : isDragging ? 'grabbing' : 'grab' 
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
          
          {/* Canvas Renderer */}
          <CanvasRenderer
            canvasRef={canvasRef}
            currentTime={currentTime}
            onCodeError={setCodeError}
          />
          
          {/* Canvas Controls */}
          <CanvasControls className="absolute bottom-6 right-6 z-20" />
          
          {/* Code Error Display */}
          {codeError && (
            <div className={`absolute top-4 left-4 right-4 z-30 p-3 rounded-lg ${
              darkMode
                ? 'bg-red-900/20 border border-red-800 backdrop-blur-sm'
                : 'bg-red-50 border border-red-200'
            }`}>
              <p className={`text-sm font-mono ${
                darkMode ? 'text-red-400' : 'text-red-800'
              }`}>{codeError}</p>
            </div>
          )}
        </>
      ) : (
        <div className={`w-full h-full flex items-center justify-center ${
          darkMode ? 'bg-gray-900 text-gray-400' : 'bg-gray-50 text-gray-500'
        }`}>
          <p className="text-lg">Preview mode temporarily disabled</p>
        </div>
      )}
    </div>
  )
}