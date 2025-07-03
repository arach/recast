'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react'
import { useCanvasControls } from '@/lib/hooks/useCanvas'

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
  
  return (
    <div className={className}>
      <div className="flex flex-col gap-2">
        {/* Zoom Controls */}
        <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-lg border shadow-lg p-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleZoomOut}
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
          className="bg-white/90 backdrop-blur-sm shadow-lg border"
          title="Center view on logos"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Center
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={handleFitToView}
          className="bg-white/90 backdrop-blur-sm shadow-lg border"
          title="Fit all logos in view"
        >
          <Maximize2 className="w-4 h-4 mr-2" />
          Fit All
        </Button>
      </div>
    </div>
  )
}