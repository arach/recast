'use client'

// Canvas Area Component - renamed from CanvasAreaNew
import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Play, Pause, Eye, Grid3x3 } from 'lucide-react'
import { HybridCanvas } from './canvas/HybridCanvas'
import { PreviewGrid } from './PreviewGrid'
import { CanvasControls } from './canvas/CanvasControls'
import { CanvasToolbar } from './canvas/CanvasToolbar'
import { LogoActions } from './canvas/LogoActions'
import { useCanvasStore } from '@/lib/stores/canvasStore'
import { useUIStore } from '@/lib/stores/uiStore'
import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo'
import { useLogoStore } from '@/lib/stores/logoStore'

export function CanvasArea() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [animating, setAnimating] = useState(false)
  const [codeError, setCodeError] = useState<string | null>(null)
  
  const { codeEditor, toolsPanel, setDimensions } = useCanvasStore()
  const { previewMode, togglePreviewMode, darkMode } = useUIStore()
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
  
  // Handle container resizing
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout
    
    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        setDimensions(width, height)
      }
    }
    
    // Debounced resize handler
    const debouncedResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(handleResize, 100)
    }
    
    handleResize()
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
  }, [setDimensions])
  
  // Show error overlay if there's a code error
  const showError = codeError && selectedLogo
  
  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {/* Preview Toggle */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
        <Button
          variant={previewMode ? "default" : "outline"}
          size="sm"
          onClick={togglePreviewMode}
          className={`gap-2 backdrop-blur-sm shadow-lg ${
            darkMode ? 'bg-gray-800/90 hover:bg-gray-700/90' : ''
          }`}
        >
          {previewMode ? <Grid3x3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {previewMode ? "Back to Canvas" : "Preview Sizes"}
        </Button>
      </div>
      
      {/* Canvas or Preview Grid */}
      {!previewMode ? (
        <>
          {/* Main Canvas Area with dark mode background */}
          <div className={`absolute inset-0 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <HybridCanvas 
              animating={animating}
            />
          </div>
          
          {/* Play/Pause Button */}
          <Button
            onClick={() => setAnimating(!animating)}
            className="absolute top-6 h-10 w-10 rounded-full shadow-lg z-20 transition-all duration-200"
            style={{ right: !toolsPanel.collapsed ? `${toolsPanel.width + 24}px` : '72px' }}
            size="sm"
            variant="outline"
          >
            {animating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          
          {/* Canvas Toolbar */}
          <CanvasToolbar 
            leftOffset={!codeEditor.collapsed ? codeEditor.width + 20 : 60}
          />
          
          {/* Logo Actions */}
          {selectedLogo && (
            <LogoActions 
              className="absolute top-6 z-20 transition-all duration-200" 
              style={{ right: !toolsPanel.collapsed ? `${toolsPanel.width + 84}px` : '132px' }}
            />
          )}
          
          {/* Canvas Controls */}
          <CanvasControls 
            className="absolute bottom-6 z-20 transition-all duration-200" 
            style={{ right: !toolsPanel.collapsed ? `${toolsPanel.width + 24}px` : '72px' }}
          />
          
          {/* Error Overlay */}
          {showError && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
                <h3 className="text-red-800 font-medium mb-2">Code Error</h3>
                <pre className="text-red-600 text-sm whitespace-pre-wrap">{codeError}</pre>
              </div>
            </div>
          )}
        </>
      ) : (
        // Preview Grid
        <PreviewGrid />
      )}
    </div>
  )
}