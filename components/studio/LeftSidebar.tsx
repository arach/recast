'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react'
import { useUIStore } from '@/lib/stores/uiStore'
import { useCanvasStore } from '@/lib/stores/canvasStore'
import { LogoTreeModule } from './modules/LogoTreeModule'
import { LogoDetailsModule } from './modules/LogoDetailsModule'

const STORAGE_KEY_WIDTH = 'recast-left-sidebar-width'
const STORAGE_KEY_COLLAPSED = 'recast-left-sidebar-collapsed'

export function LeftSidebar() {
  const { darkMode } = useUIStore()
  const { setCodeEditorState } = useCanvasStore()
  
  // Add CSS animations
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes slideInLeft {
        from {
          transform: translateX(-100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      .animate-slideInLeft {
        animation: slideInLeft 200ms ease-out;
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])
  
  const [width, setWidth] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY_WIDTH)
      return stored ? parseInt(stored, 10) : 280
    }
    return 280
  })
  
  const [isResizing, setIsResizing] = useState(false)
  
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY_COLLAPSED)
      return stored === 'true'
    }
    return false
  })
  
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      
      const newWidth = e.clientX
      setWidth(Math.max(240, Math.min(400, newWidth)))
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.body.style.cursor = ''
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'ew-resize'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing])

  // Persist width changes
  useEffect(() => {
    if (typeof window !== 'undefined' && !isResizing) {
      localStorage.setItem(STORAGE_KEY_WIDTH, width.toString())
    }
  }, [width, isResizing])

  // Persist collapsed state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_COLLAPSED, String(isCollapsed))
    }
  }, [isCollapsed])
  
  // Update store when state changes
  useEffect(() => {
    setCodeEditorState(isCollapsed, width)
  }, [isCollapsed, width, setCodeEditorState])

  return (
    <div 
      ref={containerRef}
      className="absolute left-0 top-0 h-full flex transition-all duration-200 ease-out z-30"
      style={{ width: isCollapsed ? '48px' : `${width}px` }}
    >
      {/* Collapsed state - narrow sidebar */}
      {isCollapsed && (
        <div 
          className={cn(
            "flex-1 border-r flex flex-col cursor-pointer transition-all duration-300 shadow-2xl",
            darkMode 
              ? "bg-zinc-900/95 border-white/10 hover:bg-zinc-800/95" 
              : "bg-white/95 border-gray-200 hover:bg-gray-50/95",
            "backdrop-blur-sm"
          )}
          onClick={() => setIsCollapsed(false)}
          title="Expand sidebar"
        >
          {/* Expand chevron tab */}
          <button
            className={cn(
              "absolute -right-5 top-1/2 -translate-y-1/2 w-5 h-12 rounded-r-lg flex items-center justify-center transition-all duration-200 hover:h-20 hover:translate-x-1 shadow-md",
              darkMode 
                ? "bg-zinc-800 hover:bg-zinc-700 text-gray-400 hover:text-white" 
                : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900"
            )}
            title="Expand sidebar"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          
          {/* Minimal content */}
          <div className="flex flex-col items-center pt-6 pb-4">
            <div className={cn(
              "p-2 rounded-lg transition-transform duration-200 hover:scale-110",
              darkMode ? "text-gray-400" : "text-gray-600"
            )}>
              <Layers className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}

      {/* Expanded state - full panel */}
      {!isCollapsed && (
        <div className={cn(
          "flex-1 border-r overflow-hidden shadow-2xl",
          darkMode 
            ? "bg-zinc-900 border-white/10" 
            : "bg-white border-gray-200",
          "animate-slideInLeft"
        )}>
          {/* Resize Handle */}
          <div
            className={cn(
              "absolute right-0 top-0 bottom-0 w-3 cursor-ew-resize z-10 group",
              "-translate-x-1/2"
            )}
            onMouseDown={() => setIsResizing(true)}
          >
            <div className={cn(
              "absolute inset-x-0 inset-y-0 bg-blue-500 opacity-0 transition-opacity",
              "group-hover:opacity-20",
              isResizing && "opacity-30"
            )} />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-1 rounded-full bg-gray-600 opacity-0 group-hover:opacity-50 transition-opacity" />
          </div>

          {/* Collapse chevron tab */}
          <button
            onClick={() => setIsCollapsed(true)}
            className={cn(
              "absolute -right-5 top-1/2 -translate-y-1/2 w-5 h-12 rounded-r-lg flex items-center justify-center transition-all duration-200 hover:h-20 hover:translate-x-1 z-50 shadow-md",
              darkMode 
                ? "bg-zinc-800 hover:bg-zinc-700 text-gray-400 hover:text-white" 
                : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900"
            )}
            title="Collapse sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="h-full flex flex-col">
            {/* Header */}
            <div className={cn(
              "px-4 py-3 border-b",
              darkMode ? "border-white/10" : "border-gray-200"
            )}>
              <h2 className={cn(
                "text-sm font-medium",
                darkMode ? "text-gray-400" : "text-gray-600"
              )}>Logos</h2>
            </div>

            {/* Content */}
            <div className={cn(
              "flex-1 overflow-y-auto p-4 space-y-4",
              darkMode ? "bg-zinc-950/50" : "bg-gray-50"
            )}>
              {/* Logo Tree */}
              <LogoTreeModule />
              
              {/* Logo Details */}
              <LogoDetailsModule />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}