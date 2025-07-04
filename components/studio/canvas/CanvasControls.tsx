'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react'
import { useCanvasControls } from '@/lib/hooks/useCanvas'
import { useUIStore } from '@/lib/stores/uiStore'
import { useCanvasStore } from '@/lib/stores/canvasStore'

interface CanvasControlsProps {
  className?: string
  style?: React.CSSProperties
}

export function CanvasControls({ className, style }: CanvasControlsProps) {
  const {
    zoom,
    handleZoomIn,
    handleZoomOut,
    handleCenterView,
    handleFitToView
  } = useCanvasControls()
  
  const { darkMode } = useUIStore()
  const { setZoom } = useCanvasStore()
  
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Auto-focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])
  
  return (
    <div className={className} style={style}>
      {/* All controls in one horizontal row */}
      <div className={`flex items-center backdrop-blur-sm rounded-lg border shadow-lg p-1 ${
        darkMode
          ? 'bg-gray-900/90 border-gray-700'
          : 'bg-white/90 border-gray-200'
      }`}>
        {/* View Controls - leftmost */}
        <div className="flex items-center pr-1 border-r border-gray-200 dark:border-gray-700 space-x-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleFitToView}
            className="h-7 w-7 p-0"
            title="Fit all logos in view"
          >
            <Maximize2 className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCenterView}
            className="h-7 w-7 p-0"
            title="Center view on logos"
          >
            <RotateCcw className="w-3 h-3" />
          </Button>
        </div>
        
        {/* Zoom Controls - rightmost anchor */}
        <div className="flex items-center pl-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleZoomOut}
            className="h-7 w-7 p-0"
            title="Zoom Out"
          >
            <ZoomOut className="w-3 h-3" />
          </Button>
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={(e) => {
                // Only allow numbers
                const value = e.target.value.replace(/[^0-9]/g, '')
                if (value === '' || (parseInt(value) <= 999)) {
                  setEditValue(value)
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const newZoom = parseInt(editValue)
                  if (newZoom >= 10 && newZoom <= 999) {
                    setZoom(newZoom / 100)
                  }
                  setIsEditing(false)
                } else if (e.key === 'Escape') {
                  setIsEditing(false)
                  setEditValue(Math.round(zoom * 100).toString())
                }
              }}
              onBlur={() => {
                const newZoom = parseInt(editValue)
                if (newZoom >= 10 && newZoom <= 999) {
                  setZoom(newZoom / 100)
                }
                setIsEditing(false)
              }}
              className={`text-xs w-10 text-center font-mono bg-transparent outline-none ${
                darkMode 
                  ? 'text-white selection:bg-blue-500/30' 
                  : 'text-gray-900 selection:bg-blue-200'
              }`}
              autoFocus
              onFocus={(e) => e.target.select()}
            />
          ) : (
            <button
              onClick={() => {
                setEditValue(Math.round(zoom * 100).toString())
                setIsEditing(true)
              }}
              className={`text-xs w-10 text-center font-mono cursor-text hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-1 transition-colors ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}
              title="Click to edit zoom level"
            >
              {Math.round(zoom * 100)}%
            </button>
          )}
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
      </div>
    </div>
  )
}