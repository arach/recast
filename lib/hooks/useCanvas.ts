import { useRef, useEffect, useCallback } from 'react'
import { useCanvasStore } from '@/lib/stores/canvasStore'
import { useLogoStore } from '@/lib/stores/logoStore'

interface UseCanvasOptions {
  onLogoClick?: (logoId: string) => void
  animating?: boolean
}

export function useCanvas(canvasRef: React.RefObject<HTMLCanvasElement>, options: UseCanvasOptions = {}) {
  const { 
    offset, zoom, isDragging, toolMode, draggedLogoId, dragOffset,
    setOffset, setZoom, setIsDragging, setDimensions, zoomAtPoint,
    setDraggedLogoId, setDragOffset
  } = useCanvasStore()
  const { logos, selectedLogoId, selectLogo, updateLogoPosition } = useLogoStore()
  
  const dragStartRef = useRef({ x: 0, y: 0 })
  const lastPanPointRef = useRef({ x: 0, y: 0 })
  const logoStartPosRef = useRef({ x: 0, y: 0 })
  
  // Update canvas dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect()
        setDimensions(rect.width, rect.height)
      }
    }
    
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [canvasRef, setDimensions])
  
  // Convert screen coordinates to canvas coordinates
  const screenToCanvas = useCallback((screenX: number, screenY: number) => {
    return {
      x: (screenX / zoom) - offset.x,
      y: (screenY / zoom) - offset.y
    }
  }, [zoom, offset])
  
  // Check if a point is inside a logo
  const isPointInLogo = useCallback((x: number, y: number, logo: any) => {
    const logoSize = 600
    const position = logo.position || { x: 0, y: 0 }
    return x >= position.x && x <= position.x + logoSize && 
           y >= position.y && y <= position.y + logoSize
  }, [])
  
  // Handle mouse down - selection and drag start
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const canvasCoords = screenToCanvas(mouseX, mouseY)
    
    if (toolMode === 'select') {
      // Check for logo click (reverse order for top-most)
      let clickedLogo = null
      for (let i = logos.length - 1; i >= 0; i--) {
        if (isPointInLogo(canvasCoords.x, canvasCoords.y, logos[i])) {
          clickedLogo = logos[i]
          break
        }
      }
      
      if (clickedLogo) {
        selectLogo(clickedLogo.id)
        options.onLogoClick?.(clickedLogo.id)
        
        // Start dragging the logo
        setDraggedLogoId(clickedLogo.id)
        const logoPos = clickedLogo.position || { x: 0, y: 0 }
        logoStartPosRef.current = { x: logoPos.x, y: logoPos.y }
        setDragOffset({ 
          x: canvasCoords.x - logoPos.x, 
          y: canvasCoords.y - logoPos.y 
        })
      }
    } else {
      // Pan mode - start panning
      setIsDragging(true)
      dragStartRef.current = { x: e.clientX, y: e.clientY }
      lastPanPointRef.current = { x: offset.x, y: offset.y }
    }
  }, [canvasRef, screenToCanvas, logos, isPointInLogo, selectLogo, options, setIsDragging, offset, toolMode, setDraggedLogoId, setDragOffset])
  
  // Handle mouse move - dragging
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    if (draggedLogoId) {
      // Logo dragging
      const rect = canvas.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top
      const canvasCoords = screenToCanvas(mouseX, mouseY)
      
      // Update logo position
      const newX = canvasCoords.x - dragOffset.x
      const newY = canvasCoords.y - dragOffset.y
      updateLogoPosition(draggedLogoId, { x: newX, y: newY })
    } else if (isDragging && toolMode === 'pan') {
      // Canvas panning
      const deltaX = (e.clientX - dragStartRef.current.x) / zoom
      const deltaY = (e.clientY - dragStartRef.current.y) / zoom
      
      setOffset({
        x: lastPanPointRef.current.x + deltaX,
        y: lastPanPointRef.current.y + deltaY
      })
    }
  }, [isDragging, draggedLogoId, dragOffset, zoom, setOffset, toolMode, canvasRef, screenToCanvas, updateLogoPosition])
  
  // Handle mouse up - stop dragging
  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setDraggedLogoId(null)
  }, [setIsDragging, setDraggedLogoId])
  
  // Handle wheel - zooming
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    zoomAtPoint(delta, mouseX, mouseY)
  }, [canvasRef, zoomAtPoint])
  
  // Add wheel event listener
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    canvas.addEventListener('wheel', handleWheel, { passive: false })
    return () => canvas.removeEventListener('wheel', handleWheel)
  }, [canvasRef, handleWheel])
  
  return {
    // State
    offset,
    zoom,
    isDragging,
    
    // Handlers
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    
    // Utilities
    screenToCanvas,
    isPointInLogo
  }
}

// Hook for canvas controls
export function useCanvasControls() {
  const { zoom, setZoom, centerView, fitToView, resetView } = useCanvasStore()
  const { logos } = useLogoStore()
  
  const handleZoomIn = useCallback(() => {
    setZoom(zoom * 1.25)
  }, [zoom, setZoom])
  
  const handleZoomOut = useCallback(() => {
    setZoom(zoom * 0.8)
  }, [zoom, setZoom])
  
  const handleCenterView = useCallback(() => {
    const positions = logos.map(logo => logo.position || { x: 0, y: 0 })
    centerView(positions)
  }, [logos, centerView])
  
  const handleFitToView = useCallback(() => {
    const positions = logos.map(logo => logo.position || { x: 0, y: 0 })
    fitToView(positions)
  }, [logos, fitToView])
  
  return {
    zoom,
    handleZoomIn,
    handleZoomOut,
    handleCenterView,
    handleFitToView,
    handleResetView: resetView
  }
}