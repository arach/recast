'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Play, Pause, Eye, Grid3x3 } from 'lucide-react'
import { PreviewGrid } from './PreviewGrid'
import { CodeEditorPanel } from './CodeEditorPanel'
import { CanvasRenderer } from './canvas/CanvasRenderer'
import { CanvasControls } from './canvas/CanvasControls'
import { LogoActions } from './canvas/LogoActions'
import { useCanvas } from '@/lib/hooks/useCanvas'
import { useCanvasAnimation } from '@/lib/hooks/useCanvasAnimation'
import { useCanvasStore } from '@/lib/stores/canvasStore'
import { useUIStore } from '@/lib/stores/uiStore'
import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo'

export function CanvasAreaRefactored() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [codeError, setCodeError] = useState<string | null>(null)
  
  // Canvas state and interactions
  const { setCodeEditorState } = useCanvasStore()
  const { 
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  } = useCanvas(canvasRef)
  
  // Animation state
  const { animating, currentTime, toggleAnimation } = useCanvasAnimation()
  
  // UI state
  const { previewMode, togglePreviewMode, isRendering } = useUIStore()
  const { logo: selectedLogo } = useSelectedLogo()
  
  // Initialize canvas centering
  useEffect(() => {
    const { centerView } = useCanvasStore.getState()
    const { logos } = useLogoStore.getState()
    
    if (logos.length > 0) {
      const positions = logos.map(logo => logo.position || { x: 0, y: 0 })
      setTimeout(() => centerView(positions), 100)
    }
  }, [])
  
  // Handle code editor state changes
  const handleCodeEditorStateChange = useCallback((collapsed: boolean, width: number) => {
    setCodeEditorState(collapsed, width)
  }, [setCodeEditorState])
  
  return (
    <div 
      className="flex-1 relative transition-all duration-300 overflow-hidden canvas-container"
      style={{
        background: 'radial-gradient(circle, #d1d5db 0.8px, transparent 0.8px)',
        backgroundSize: '20px 20px',
        backgroundColor: '#f9fafb'
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
          className="gap-2 bg-white/90 backdrop-blur-sm shadow-lg border"
        >
          {previewMode ? <Grid3x3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {previewMode ? "Back to Canvas" : "Preview Sizes"}
        </Button>
      </div>
      
      {/* Play/Pause Button */}
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
      
      {/* Logo Actions Toolbar */}
      {!previewMode && selectedLogo && (
        <LogoActions className="absolute top-6 right-20 z-20" />
      )}
      
      {/* Canvas or Preview */}
      {!previewMode ? (
        <>
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
          <CanvasRenderer 
            canvasRef={canvasRef}
            currentTime={currentTime}
            onCodeError={setCodeError}
          />
        </>
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
      
      {/* Canvas Controls */}
      {!previewMode && (
        <CanvasControls className="absolute bottom-6 right-6 z-20" />
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
      
      {/* Code Error Display */}
      {codeError && (
        <div className="absolute top-20 left-6 right-6 z-30">
          <div className="bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded-lg shadow-lg text-sm">
            <strong>Code Error:</strong> {codeError}
          </div>
        </div>
      )}
    </div>
  )
}

// Import stores for initialization
import { useLogoStore } from '@/lib/stores/logoStore'