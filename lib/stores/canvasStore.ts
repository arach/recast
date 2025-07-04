import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { subscribeWithSelector } from 'zustand/middleware'

interface CanvasOffset {
  x: number
  y: number
}

interface CanvasState {
  // Canvas viewport state
  offset: CanvasOffset
  zoom: number
  isDragging: boolean
  
  // Tool mode
  toolMode: 'select' | 'pan'
  draggedLogoId: string | null
  dragOffset: CanvasOffset
  
  // Canvas dimensions
  dimensions: {
    width: number
    height: number
  }
  
  // Code editor state (affects canvas layout)
  codeEditor: {
    collapsed: boolean
    width: number
  }
  
  // Tools panel state (affects canvas layout)
  toolsPanel: {
    collapsed: boolean
    width: number
  }
  
  // Actions
  setOffset: (offset: CanvasOffset) => void
  setZoom: (zoom: number) => void
  setIsDragging: (isDragging: boolean) => void
  setToolMode: (mode: 'select' | 'pan') => void
  setDraggedLogoId: (id: string | null) => void
  setDragOffset: (offset: CanvasOffset) => void
  setDimensions: (width: number, height: number) => void
  setCodeEditorState: (collapsed: boolean, width: number) => void
  setToolsPanelState: (collapsed: boolean, width: number) => void
  
  // Computed actions
  centerView: (logoPositions: Array<{ x: number; y: number }>) => void
  fitToView: (logoPositions: Array<{ x: number; y: number }>) => void
  resetView: () => void
  
  // Mouse-centered zoom
  zoomAtPoint: (delta: number, mouseX: number, mouseY: number) => void
}

export const useCanvasStore = create<CanvasState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // Initial state
        offset: { x: 0, y: 0 },
        zoom: 1,
        isDragging: false,
        toolMode: 'pan' as const,
        draggedLogoId: null,
        dragOffset: { x: 0, y: 0 },
        dimensions: { width: 0, height: 0 },
        codeEditor: { collapsed: true, width: 500 },
        toolsPanel: { collapsed: false, width: 380 },
        
        // Basic setters
        setOffset: (offset) => set({ offset }),
        setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(5, zoom)) }),
        setIsDragging: (isDragging) => set({ isDragging }),
        setToolMode: (mode) => set({ toolMode: mode }),
        setDraggedLogoId: (id) => set({ draggedLogoId: id }),
        setDragOffset: (offset) => set({ dragOffset: offset }),
        setDimensions: (width, height) => set({ dimensions: { width, height } }),
        setCodeEditorState: (collapsed, width) => set({ codeEditor: { collapsed, width } }),
        setToolsPanelState: (collapsed, width) => set({ toolsPanel: { collapsed, width } }),
        
        // Center view on logos without changing zoom
        centerView: (logoPositions) => {
          const { zoom, dimensions, codeEditor } = get()
          if (logoPositions.length === 0) return
          
          const logoSize = 600
          
          // Calculate available canvas space
          const availableWidth = codeEditor.collapsed 
            ? dimensions.width 
            : dimensions.width - codeEditor.width
          const availableHeight = dimensions.height
          const effectiveCenterX = codeEditor.collapsed 
            ? availableWidth / 2 
            : codeEditor.width + availableWidth / 2
          const effectiveCenterY = availableHeight / 2
          
          // Calculate bounding box
          let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
          logoPositions.forEach(pos => {
            minX = Math.min(minX, pos.x)
            maxX = Math.max(maxX, pos.x + logoSize)
            minY = Math.min(minY, pos.y)
            maxY = Math.max(maxY, pos.y + logoSize)
          })
          
          const centerX = (minX + maxX) / 2
          const centerY = (minY + maxY) / 2
          
          set({
            offset: {
              x: effectiveCenterX / zoom - centerX,
              y: effectiveCenterY / zoom - centerY
            }
          })
        },
        
        // Fit all logos in view with appropriate zoom
        fitToView: (logoPositions) => {
          const { dimensions, codeEditor } = get()
          if (logoPositions.length === 0) return
          
          const logoSize = 600
          
          // Calculate available canvas space
          const availableWidth = codeEditor.collapsed 
            ? dimensions.width 
            : dimensions.width - codeEditor.width
          const availableHeight = dimensions.height
          const effectiveCenterX = codeEditor.collapsed 
            ? availableWidth / 2 
            : codeEditor.width + availableWidth / 2
          const effectiveCenterY = availableHeight / 2
          
          // Calculate bounding box
          let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
          logoPositions.forEach(pos => {
            minX = Math.min(minX, pos.x)
            maxX = Math.max(maxX, pos.x + logoSize)
            minY = Math.min(minY, pos.y)
            maxY = Math.max(maxY, pos.y + logoSize)
          })
          
          const contentWidth = maxX - minX
          const contentHeight = maxY - minY
          const centerX = (minX + maxX) / 2
          const centerY = (minY + maxY) / 2
          
          // Calculate zoom to fit at 70% coverage
          const targetCoverage = 0.7
          const zoomX = (availableWidth * targetCoverage) / contentWidth
          const zoomY = (availableHeight * targetCoverage) / contentHeight
          const idealZoom = Math.min(zoomX, zoomY)
          const clampedZoom = Math.max(0.2, Math.min(idealZoom, 1.5))
          
          set({
            zoom: clampedZoom,
            offset: {
              x: effectiveCenterX / clampedZoom - centerX,
              y: effectiveCenterY / clampedZoom - centerY
            }
          })
        },
        
        // Reset to initial centered view
        resetView: () => {
          const { dimensions, codeEditor } = get()
          
          const availableWidth = codeEditor.collapsed 
            ? dimensions.width 
            : dimensions.width - codeEditor.width
          const availableHeight = dimensions.height
          const effectiveCenterX = codeEditor.collapsed 
            ? availableWidth / 2 
            : codeEditor.width + availableWidth / 2
          const effectiveCenterY = availableHeight / 2
          
          set({
            zoom: 1,
            offset: {
              x: effectiveCenterX,
              y: effectiveCenterY
            }
          })
        },
        
        // Zoom centered on mouse position
        zoomAtPoint: (delta, mouseX, mouseY) => {
          const { zoom, offset } = get()
          const newZoom = Math.max(0.1, Math.min(5, zoom * delta))
          const zoomRatio = newZoom / zoom
          
          set({
            zoom: newZoom,
            offset: {
              x: offset.x + (mouseX / newZoom) - (mouseX / zoom),
              y: offset.y + (mouseY / newZoom) - (mouseY / zoom)
            }
          })
        }
      }),
      {
        name: 'reflow-canvas',
        partialize: (state) => ({
          offset: state.offset,
          zoom: state.zoom,
          codeEditor: state.codeEditor
        })
      }
    )
  )
)

// Selectors for common derived state
export const selectAvailableCanvasArea = (state: CanvasState) => {
  const { dimensions, codeEditor } = state
  const availableWidth = codeEditor.collapsed 
    ? dimensions.width 
    : dimensions.width - codeEditor.width
  return {
    width: availableWidth,
    height: dimensions.height,
    centerX: codeEditor.collapsed 
      ? availableWidth / 2 
      : codeEditor.width + availableWidth / 2,
    centerY: dimensions.height / 2
  }
}

// Debug helpers
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).canvasStore = useCanvasStore
}