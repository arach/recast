'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react'
import { useCanvasControls } from '@/lib/hooks/useCanvas'
import { useUIStore } from '@/lib/stores/uiStore'

interface CanvasControlsProps {
  className?: string
}

export function CanvasControls({ className }: CanvasControlsProps) {
  const {
    zoom,
    handleZoomIn,
    handleZoomOut,
    handleCenterView,
    handleFitToView
  } = useCanvasControls()
  
  const { darkMode } = useUIStore()
  
  return (
    <div className={className}>
      <div className="flex flex-col gap-2">
        {/* Zoom Controls */}
        <div className={`flex items-center space-x-1 backdrop-blur-sm rounded-lg border shadow-lg p-1 ${
          darkMode
            ? 'bg-gray-900/90 border-gray-700'
            : 'bg-white/90 border-gray-200'
        }`}>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleZoomOut}
            className="h-7 w-7 p-0"
            title="Zoom Out"
          >
            <ZoomOut className="w-3 h-3" />
          </Button>
          <span className={`text-xs w-12 text-center font-mono ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {Math.round(zoom * 100)}%
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleZoomIn}
            className="h-7 w-7 p-0"
            title="Zoom In"
          >
            <ZoomIn className="w-3 h-3" />
          </Button>
        </div>
        
        {/* View Controls */}
        <Button
          size="sm"
          variant="outline"
          onClick={handleCenterView}
          className={`backdrop-blur-sm shadow-lg border ${
            darkMode
              ? 'bg-gray-900/90 border-gray-700 hover:bg-gray-800/90 text-white'
              : 'bg-white/90 border-gray-200 hover:bg-gray-50/90'
          }`}
          title="Center view on logos"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Center
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={handleFitToView}
          className={`backdrop-blur-sm shadow-lg border ${
            darkMode
              ? 'bg-gray-900/90 border-gray-700 hover:bg-gray-800/90 text-white'
              : 'bg-white/90 border-gray-200 hover:bg-gray-50/90'
          }`}
          title="Fit all logos in view"
        >
          <Maximize2 className="w-4 h-4 mr-2" />
          Fit All
        </Button>
      </div>
    </div>
  )
}