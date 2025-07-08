'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLogoStore } from '@/lib/stores/logoStore';
import { generateSpecificationSheet, type SpecSheetOptions } from '@/lib/debug/specification-sheet-generator';
import html2canvas from 'html2canvas';
import { generateJSVisualization } from '@/lib/js-visualization-utils';
import { getAllJSTemplates } from '@/lib/js-template-registry';
import TargetOverlay from '@/components/TargetOverlay';

// Logo rendering component with pan/zoom for the spec sheet
interface LogoCanvasProps {
  logo: any;
  width: number;
  height: number;
}

function LogoCanvas({ logo, width, height }: LogoCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Tile system configuration
  const TILE_SIZE = 200; // Pixels per tile
  const TILE_THRESHOLD = 100; // When to trigger new tile load
  
  // Initialize viewport centered in tile grid (middle of 6x6 tiles)
  const [viewport, setViewport] = useState({ 
    x: TILE_SIZE * 1.5, // Center in middle 4 tiles of 6x6 grid
    y: TILE_SIZE * 1.5, 
    zoom: 1 
  });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [renderPending, setRenderPending] = useState(false);
  const debounceTimerRef = useRef<number | null>(null);
  const lastRenderTimeRef = useRef(0);
  
  // Tile-based rendering state
  const [currentTile, setCurrentTile] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoadingTile, setIsLoadingTile] = useState(false);
  const [lastRenderedViewport, setLastRenderedViewport] = useState({ x: TILE_SIZE * 1.5, y: TILE_SIZE * 1.5, zoom: 1 });
  const dragRenderTimeoutRef = useRef<number | null>(null);
  
  // Snap animation state
  const [isSnapping, setIsSnapping] = useState(false);
  const [snapOffset, setSnapOffset] = useState({ x: 0, y: 0 });
  
  // Calculate optimal snap position for smooth grid alignment
  const calculateSnapPosition = useCallback((currentViewport: typeof viewport) => {
    const baseGridSize = 100;
    const zoomLevel = Math.log2(currentViewport.zoom);
    const gridSize = baseGridSize * Math.pow(2, Math.round(zoomLevel * 8) / 8);
    
    // Snap to nearest grid intersection for clean alignment
    const snappedX = Math.round(currentViewport.x / (gridSize * 0.25)) * (gridSize * 0.25);
    const snappedY = Math.round(currentViewport.y / (gridSize * 0.25)) * (gridSize * 0.25);
    
    return { x: snappedX, y: snappedY, zoom: currentViewport.zoom };
  }, []);
  
  // Utility functions for tile system
  const getTileCoordinates = (x: number, y: number) => ({
    x: Math.floor(x / TILE_SIZE),
    y: Math.floor(y / TILE_SIZE)
  });
  
  const shouldLoadNewTile = (currentPos: {x: number, y: number}, tilePos: {x: number, y: number}) => {
    const newTilePos = getTileCoordinates(currentPos.x, currentPos.y);
    return newTilePos.x !== tilePos.x || newTilePos.y !== tilePos.y;
  };
  
  
  // Draw preview grid on overlay canvas during drag
  const drawPreviewGrid = useCallback((currentViewport: typeof viewport) => {
    const canvas = previewCanvasRef.current;
    if (!canvas || !isDragging) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear preview canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid with current viewport position for immediate feedback
    drawMapStyleGrid(ctx, width, height, currentViewport, 0.7); // 70% opacity for preview
  }, [isDragging, width, height]);

  // Google Maps-style grid drawing function
  const drawMapStyleGrid = (ctx: CanvasRenderingContext2D, width: number, height: number, viewport: { x: number, y: number, zoom: number }, opacity: number = 1) => {
    ctx.save();
    
    // Calculate grid spacing based on zoom level (smoother, less snappy)
    const baseGridSize = 100;
    const zoomLevel = Math.log2(viewport.zoom);
    // Much more granular scaling for minimal snapping
    const gridSize = baseGridSize * Math.pow(2, Math.round(zoomLevel * 8) / 8); // Eighth-step increments
    const subGridSize = gridSize / 4; // Sub-grid for finer detail
    
    // Calculate world bounds
    const worldLeft = -viewport.x / viewport.zoom;
    const worldTop = -viewport.y / viewport.zoom;
    const worldRight = worldLeft + width / viewport.zoom;
    const worldBottom = worldTop + height / viewport.zoom;
    
    // Draw major grid lines (darker) - with opacity
    ctx.strokeStyle = `rgba(150, 150, 150, ${0.3 * opacity})`;
    ctx.lineWidth = 1;
    
    const startGridX = Math.floor(worldLeft / gridSize) * gridSize;
    const endGridX = Math.ceil(worldRight / gridSize) * gridSize;
    const startGridY = Math.floor(worldTop / gridSize) * gridSize;
    const endGridY = Math.ceil(worldBottom / gridSize) * gridSize;
    
    // Vertical major grid lines
    for (let worldX = startGridX; worldX <= endGridX; worldX += gridSize) {
      const screenX = (worldX * viewport.zoom) + viewport.x;
      if (screenX >= -1 && screenX <= width + 1) {
        ctx.beginPath();
        ctx.moveTo(screenX, 0);
        ctx.lineTo(screenX, height);
        ctx.stroke();
        
        // Grid coordinate labels
        if (viewport.zoom > 0.5 && opacity > 0.5) { // Only show labels on main grid, not preview
          ctx.fillStyle = worldX === 0 ? `rgba(255, 100, 100, ${0.8 * opacity})` : `rgba(120, 120, 120, ${0.6 * opacity})`;
          ctx.font = `${Math.min(12, 8 + viewport.zoom * 2)}px monospace`;
          ctx.textAlign = 'center';
          ctx.fillText(`${worldX}`, screenX, 20);
        }
      }
    }
    
    // Horizontal major grid lines
    for (let worldY = startGridY; worldY <= endGridY; worldY += gridSize) {
      const screenY = (worldY * viewport.zoom) + viewport.y;
      if (screenY >= -1 && screenY <= height + 1) {
        ctx.beginPath();
        ctx.moveTo(0, screenY);
        ctx.lineTo(width, screenY);
        ctx.stroke();
        
        // Grid coordinate labels
        if (viewport.zoom > 0.5 && opacity > 0.5) { // Only show labels on main grid, not preview
          ctx.fillStyle = worldY === 0 ? `rgba(255, 100, 100, ${0.8 * opacity})` : `rgba(120, 120, 120, ${0.6 * opacity})`;
          ctx.font = `${Math.min(12, 8 + viewport.zoom * 2)}px monospace`;
          ctx.textAlign = 'left';
          ctx.fillText(`${worldY}`, 5, screenY - 5);
        }
      }
    }
    
    // Draw sub-grid lines (lighter) when zoomed in enough
    if (viewport.zoom > 1.0) {
      ctx.strokeStyle = `rgba(150, 150, 150, ${0.15 * opacity})`;
      ctx.lineWidth = 0.5;
      
      // Vertical sub-grid
      for (let worldX = startGridX; worldX <= endGridX; worldX += subGridSize) {
        if (worldX % gridSize !== 0) { // Skip major grid lines
          const screenX = (worldX * viewport.zoom) + viewport.x;
          if (screenX >= -1 && screenX <= width + 1) {
            ctx.beginPath();
            ctx.moveTo(screenX, 0);
            ctx.lineTo(screenX, height);
            ctx.stroke();
          }
        }
      }
      
      // Horizontal sub-grid
      for (let worldY = startGridY; worldY <= endGridY; worldY += subGridSize) {
        if (worldY % gridSize !== 0) { // Skip major grid lines
          const screenY = (worldY * viewport.zoom) + viewport.y;
          if (screenY >= -1 && screenY <= height + 1) {
            ctx.beginPath();
            ctx.moveTo(0, screenY);
            ctx.lineTo(width, screenY);
            ctx.stroke();
          }
        }
      }
    }
    
    // Origin marker (like Google Maps) - skip on preview grid
    if (opacity > 0.5) {
      const originScreenX = viewport.x;
      const originScreenY = viewport.y;
      if (originScreenX >= -20 && originScreenX <= width + 20 && 
          originScreenY >= -20 && originScreenY <= height + 20) {
        ctx.strokeStyle = `rgba(255, 50, 50, ${0.8 * opacity})`;
        ctx.fillStyle = `rgba(255, 50, 50, ${0.8 * opacity})`;
        ctx.lineWidth = 3;
      
      // Draw crosshair at origin
      ctx.beginPath();
      ctx.moveTo(originScreenX - 10, originScreenY);
      ctx.lineTo(originScreenX + 10, originScreenY);
      ctx.moveTo(originScreenX, originScreenY - 10);
      ctx.lineTo(originScreenX, originScreenY + 10);
      ctx.stroke();
      
        // Origin point
        ctx.beginPath();
        ctx.arc(originScreenX, originScreenY, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Mini-compass in top-right corner - skip on preview grid
    if (opacity > 0.5) {
      const compassSize = 40;
      const compassX = width - compassSize - 10;
      const compassY = 10 + compassSize / 2;
      
      ctx.save();
      ctx.translate(compassX, compassY);
    
    // Compass background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.arc(0, 0, compassSize / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Compass border
    ctx.strokeStyle = 'rgba(120, 120, 120, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // North arrow
    ctx.fillStyle = 'rgba(255, 100, 100, 0.8)';
    ctx.beginPath();
    ctx.moveTo(0, -compassSize / 3);
    ctx.lineTo(-5, -5);
    ctx.lineTo(5, -5);
    ctx.closePath();
    ctx.fill();
    
    // N label
    ctx.fillStyle = 'rgba(100, 100, 100, 0.8)';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('N', 0, -compassSize / 2 + 5);
    
    ctx.restore();
    }
    
    // Remove canvas-drawn coordinate display (handled by React component)
    
    // Draw studio viewport boundary (original viewing area)
    const studioWidth = 400; // Typical studio canvas size
    const studioHeight = 400;
    const studioLeft = -studioWidth / 2;
    const studioTop = -studioHeight / 2;
    const studioRight = studioWidth / 2;
    const studioBottom = studioHeight / 2;
    
    // Convert studio bounds to screen coordinates
    const studioScreenLeft = (studioLeft * viewport.zoom) + viewport.x;
    const studioScreenTop = (studioTop * viewport.zoom) + viewport.y;
    const studioScreenRight = (studioRight * viewport.zoom) + viewport.x;
    const studioScreenBottom = (studioBottom * viewport.zoom) + viewport.y;
    
    // Only draw if any part is visible
    if (studioScreenRight >= 0 && studioScreenLeft <= width && 
        studioScreenBottom >= 0 && studioScreenTop <= height) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 200, 100, 0.6)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 4]);
      
      // Draw studio viewport rectangle
      ctx.beginPath();
      ctx.rect(studioScreenLeft, studioScreenTop, 
               studioScreenRight - studioScreenLeft, 
               studioScreenBottom - studioScreenTop);
      ctx.stroke();
      
      // Add corner markers
      const cornerSize = 8;
      const corners = [
        [studioScreenLeft, studioScreenTop],
        [studioScreenRight, studioScreenTop],
        [studioScreenLeft, studioScreenBottom],
        [studioScreenRight, studioScreenBottom]
      ];
      
      ctx.setLineDash([]);
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255, 200, 100, 0.8)';
      
      corners.forEach(([x, y]) => {
        if (x >= -cornerSize && x <= width + cornerSize && 
            y >= -cornerSize && y <= height + cornerSize) {
          ctx.beginPath();
          ctx.moveTo(x - cornerSize, y);
          ctx.lineTo(x + cornerSize, y);
          ctx.moveTo(x, y - cornerSize);
          ctx.lineTo(x, y + cornerSize);
          ctx.stroke();
        }
      });
      
      // Studio viewport label
      if (viewport.zoom > 0.3) {
        const labelX = Math.max(10, Math.min(width - 100, studioScreenLeft + 5));
        const labelY = Math.max(25, Math.min(height - 10, studioScreenTop + 15));
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(labelX, labelY - 12, 80, 16);
        ctx.strokeStyle = 'rgba(255, 200, 100, 0.5)';
        ctx.lineWidth = 1;
        ctx.strokeRect(labelX, labelY - 12, 80, 16);
        
        ctx.fillStyle = 'rgba(200, 120, 0, 0.9)';
        ctx.font = '10px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('Studio View', labelX + 2, labelY);
      }
      
      ctx.restore();
    }
    
    ctx.restore();
  };
  
  // Throttled render function using requestAnimationFrame
  const performRender = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !logo) {
      console.log('⚠️ Canvas render skipped - missing canvas or logo');
      setRenderPending(false);
      return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.log('⚠️ Canvas render skipped - no context');
      setRenderPending(false);
      return;
    }
    
    console.log('🎨 Performing throttled render - viewport:', viewport);
    
    // Clear entire canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set up viewport clipping
    ctx.save();
    
    // Draw Google Maps-style background grid system
    drawMapStyleGrid(ctx, width, height, viewport);
    ctx.restore(); // Restore to original coordinate system for template rendering
    
    // Render the actual logo content with viewport information for infinite rendering
    if (logo.templateId) {
      console.log('🎨 Rendering template:', logo.templateId, 'at viewport:', viewport);
      // Pass viewport information so templates can render for infinite coordinate space
      const enhancedParams = {
        ...logo.parameters,
        // Viewport information for infinite rendering
        _viewport: {
          offsetX: viewport.x,
          offsetY: viewport.y,
          zoom: viewport.zoom,
          viewWidth: width,
          viewHeight: height
        }
      };
      generateJSVisualization(ctx, logo.templateId, enhancedParams, 0, width, height);
    } else {
      console.log('🎨 Rendering placeholder');
      // Fallback placeholder
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#6b7280';
      ctx.font = `${14 / viewport.zoom}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('No template selected', width / 2, height / 2);
    }
    
    ctx.restore();
    console.log('✅ Throttled canvas render complete');
    setRenderPending(false);
  }, [logo, width, height, viewport]);
  
  // Tile render function - depends on performRender
  const performTileRender = useCallback(async () => {
    if (isLoadingTile) return;
    
    setIsLoadingTile(true);
    console.log('🗺️ Loading new tile...');
    
    // Single render with current viewport
    requestAnimationFrame(() => {
      performRender();
      setLastRenderedViewport({ ...viewport });
      setDragOffset({ x: 0, y: 0 }); // Reset drag offset after render
      
      setTimeout(() => {
        setIsLoadingTile(false);
        console.log('✅ Tile loaded');
      }, 50); // Shorter feedback duration
    });
  }, [isLoadingTile, viewport, performRender]);
  
  // Tile-based rendering - only render on zoom changes or initial load
  useEffect(() => {
    if (renderPending) return;
    
    // Only auto-render on zoom changes or initial load (not during dragging)
    const zoomChanged = Math.abs(viewport.zoom - lastRenderedViewport.zoom) > 0.01;
    const isInitialRender = lastRenderTimeRef.current === 0;
    
    if (!isDragging && (zoomChanged || isInitialRender)) {
      console.log('🎨 Auto-render triggered:', { zoomChanged, isInitialRender });
      performTileRender();
    }
  }, [viewport.zoom, logo, width, height, isDragging]);

  // Handle mouse interactions
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('🖱️ Mouse down at:', e.clientX, e.clientY);
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
    
    // Initialize preview grid
    requestAnimationFrame(() => drawPreviewGrid());
    
    // Initialize tile tracking
    const tilePos = getTileCoordinates(-viewport.x, -viewport.y);
    setCurrentTile(tilePos);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    // Local mouse handler is now passive - all viewport updates handled by global handler
    // This prevents double movement that was causing the grid to jump outside canvas area
  };

  const handleMouseUp = () => {
    console.log('🖱️ Mouse up - stopping drag');
    setIsDragging(false);
  };

  // Add global mouse event listeners for tile-based dragging
  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      
      const deltaX = e.clientX - lastMousePos.x;
      const deltaY = e.clientY - lastMousePos.y;
      
      // Update viewport immediately for smooth live rendering
      setViewport(prev => {
        const newViewport = {
          ...prev,
          x: prev.x + deltaX,
          y: prev.y + deltaY
        };
        
        // Update preview grid to match exactly
        requestAnimationFrame(() => drawPreviewGrid(newViewport));
        
        return newViewport;
      });
      
      // Throttle canvas renders to reduce flicker (but still responsive)
      if (dragRenderTimeoutRef.current) {
        clearTimeout(dragRenderTimeoutRef.current);
      }
      dragRenderTimeoutRef.current = setTimeout(() => {
        performRender();
        dragRenderTimeoutRef.current = null;
      }, 50); // Moderate throttling for smooth experience
      
      setLastMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleGlobalMouseUp = () => {
      console.log('🌍 Global mouse up - stopping drag');
      setIsDragging(false);
      
      // Cancel any pending drag renders
      if (dragRenderTimeoutRef.current) {
        clearTimeout(dragRenderTimeoutRef.current);
        dragRenderTimeoutRef.current = null;
      }
      
      // Clear preview grid
      const previewCanvas = previewCanvasRef.current;
      if (previewCanvas) {
        const previewCtx = previewCanvas.getContext('2d');
        if (previewCtx) {
          previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        }
      }
      
      // Calculate optimal snap position
      const snapPosition = calculateSnapPosition(viewport);
      const snapDeltaX = snapPosition.x - viewport.x;
      const snapDeltaY = snapPosition.y - viewport.y;
      
      // If snap is minimal, just render directly
      if (Math.abs(snapDeltaX) < 2 && Math.abs(snapDeltaY) < 2) {
        setDragOffset({ x: 0, y: 0 });
        requestAnimationFrame(() => performRender());
        return;
      }
      
      // Animate the snap with CSS transform
      console.log('🎯 Animating snap:', { snapDeltaX, snapDeltaY });
      setIsSnapping(true);
      setSnapOffset({ x: snapDeltaX, y: snapDeltaY });
      
      // Update viewport to final position and clean up after animation
      setTimeout(() => {
        setViewport(snapPosition);
        setDragOffset({ x: 0, y: 0 });
        setSnapOffset({ x: 0, y: 0 });
        setIsSnapping(false);
        requestAnimationFrame(() => performRender());
      }, 200); // Match CSS animation duration
    };

    // Add global listeners when dragging starts
    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
    
    // Cleanup when dragging stops or effect cleanup
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      
      // Cancel any pending renders
      if (dragRenderTimeoutRef.current) {
        clearTimeout(dragRenderTimeoutRef.current);
        dragRenderTimeoutRef.current = null;
      }
    };
  }, [isDragging, lastMousePos]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    console.log('🎢 Wheel event - deltaY:', e.deltaY, 'current zoom:', viewport.zoom);
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    setViewport(prev => {
      const newZoom = Math.max(0.1, Math.min(5, prev.zoom * zoomFactor));
      console.log('🔍 Zoom update - old:', prev.zoom, 'new:', newZoom);
      return { ...prev, zoom: newZoom };
    });
  };

  const resetViewport = () => {
    // Reset to centered position in tile grid (same as initial position)
    setViewport({ x: TILE_SIZE * 1.5, y: TILE_SIZE * 1.5, zoom: 1 });
  };
  
  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full group"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <canvas 
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-full rounded"
        style={{ 
          width: '100%', 
          height: '100%',
          transform: isSnapping 
            ? `translate(${snapOffset.x}px, ${snapOffset.y}px)`
            : 'none',
          transition: isSnapping ? 'transform 0.2s cubic-bezier(0.4, 0.0, 0.2, 1)' : 'none'
        }}
      />
      
      {/* Preview grid overlay - shows immediate drag feedback with synchronized transform */}
      <canvas 
        ref={previewCanvasRef}
        width={width}
        height={height}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ 
          width: '100%', 
          height: '100%',
          opacity: isDragging ? 1 : 0,
          transition: 'opacity 0.1s ease',
          // Apply the same transform as main canvas for perfect sync
          transform: isDragging 
            ? `translate(${dragOffset.x}px, ${dragOffset.y}px)` 
            : isSnapping 
              ? `translate(${snapOffset.x}px, ${snapOffset.y}px)`
              : 'none'
        }}
      />
      
      {/* Viewport controls - always visible for testing */}
      <div className="absolute top-2 right-2">
        <div className="flex gap-1">
          <button
            onClick={() => {
              console.log('🔍 Zoom in clicked');
              setViewport(prev => {
                const newViewport = { ...prev, zoom: prev.zoom * 1.2 };
                console.log('🔍 New zoom:', newViewport.zoom);
                return newViewport;
              });
            }}
            className="w-8 h-8 bg-black/70 text-white hover:bg-black/90 rounded text-sm flex items-center justify-center font-bold"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={() => {
              console.log('🔍 Zoom out clicked');
              setViewport(prev => {
                const newViewport = { ...prev, zoom: prev.zoom * 0.8 };
                console.log('🔍 New zoom:', newViewport.zoom);
                return newViewport;
              });
            }}
            className="w-8 h-8 bg-black/70 text-white hover:bg-black/90 rounded text-sm flex items-center justify-center font-bold"
            title="Zoom Out"
          >
            −
          </button>
          <button
            onClick={() => {
              console.log('🔄 Reset clicked');
              resetViewport();
            }}
            className="w-8 h-8 bg-black/70 text-white hover:bg-black/90 rounded text-sm flex items-center justify-center font-bold"
            title="Reset View"
          >
            ⌂
          </button>
          <button
            onClick={() => {
              console.log('🎯 Go to origin clicked');
              setViewport(prev => ({ ...prev, x: 0, y: 0 }));
            }}
            className="w-8 h-8 bg-red-600/70 text-white hover:bg-red-600/90 rounded text-sm flex items-center justify-center font-bold"
            title="Go to Origin (0,0)"
          >
            ✛
          </button>
          <button
            onClick={() => {
              console.log('🔍 Find drawing clicked');
              // Set a good view for wave bars - they start at x=0 and extend right
              setViewport({ x: width/2, y: height/2, zoom: 1.0 });
            }}
            className="w-8 h-8 bg-blue-600/70 text-white hover:bg-blue-600/90 rounded text-sm flex items-center justify-center font-bold"
            title="Find Drawing"
          >
            🔍
          </button>
        </div>
      </div>
      
      {/* Tile loading indicator */}
      {isLoadingTile && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="bg-black/80 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-mono">Loading area...</span>
          </div>
        </div>
      )}
      
      {/* Viewport info - always visible and properly styled */}
      <div className="absolute bottom-2 left-2">
        <div className="bg-black/70 text-white/90 px-3 py-2 rounded-lg shadow-lg border border-white/10 text-xs font-mono">
          <div>Center: {((-viewport.x + width / 2) / viewport.zoom).toFixed(0)}, {((-viewport.y + height / 2) / viewport.zoom).toFixed(0)}</div>
          <div>Zoom: {viewport.zoom.toFixed(2)}x (Level {Math.floor(Math.log2(viewport.zoom))})</div>
          <div>Grid: {(() => {
            const baseGridSize = 100;
            const zoomLevel = Math.log2(viewport.zoom);
            // Use same calculation as grid rendering for consistency
            const gridSize = baseGridSize * Math.pow(2, Math.round(zoomLevel * 8) / 8);
            return gridSize;
          })()}px</div>
          {isDragging && (
            <div className="text-blue-400 mt-1">• Dragging</div>
          )}
          {isSnapping && (
            <div className="text-green-400 mt-1">• Snapping to grid</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SpecSheetPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const specSheetRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string>('');
  const [hasHydrated, setHasHydrated] = useState(false);
  
  // Get current logo data from store
  const selectedLogoId = useLogoStore(state => state.selectedLogoId);
  const selectedLogo = useLogoStore(state => state.getSelectedLogo());
  const logos = useLogoStore(state => state.logos);
  
  // Wait for Zustand persistence to hydrate
  useEffect(() => {
    const unsubHydrate = useLogoStore.persist.onHydrate(() => {
      setHasHydrated(true);
    });
    
    // If already hydrated, set immediately
    if (useLogoStore.persist.hasHydrated()) {
      setHasHydrated(true);
    }
    
    return unsubHydrate;
  }, []);
  
  // Template selection state
  const [availableTemplates, setAvailableTemplates] = useState<any[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('wave-bars');
  
  // Load available templates
  useEffect(() => {
    getAllJSTemplates().then(setAvailableTemplates);
  }, []);

  // Real-time controls state
  const [sheetOptions, setSheetOptions] = useState<SpecSheetOptions>({
    logoSize: 350,
    showGrid: true,
    terminalStyle: true,
    sections: {
      showMetadata: true,
      showParameters: true,
      showEnvironment: true
    }
  });

  // Interactive terminal state
  const [terminalCommand, setTerminalCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);

  // Generate the current command based on logo data
  const generateCurrentCommand = () => {
    if (!selectedLogo) return 'reflow generate --help';
    
    const templateParam = selectedLogo.templateId ? `--template=${selectedLogo.templateId}` : '';
    const logoIdParam = selectedLogo.id ? `--logo-id=${selectedLogo.id}` : '--logo-id=main';
    const sizeParam = sheetOptions.logoSize ? `--size=${sheetOptions.logoSize}` : '';
    const formatParam = '--format=png';
    const outputParam = '--output=reflow-spec-sheet.png';
    
    return `reflow generate ${templateParam} ${logoIdParam} ${formatParam} ${sizeParam} ${outputParam}`.replace(/\s+/g, ' ').trim();
  };

  // Update terminal command when logo or options change
  useEffect(() => {
    setTerminalCommand(generateCurrentCommand());
  }, [selectedLogo, sheetOptions]);

  // Update last generated timestamp when logo changes
  useEffect(() => {
    if (selectedLogo) {
      setLastGenerated(new Date().toLocaleTimeString());
    }
  }, [selectedLogoId, selectedLogo]);

  const generateSheet = async () => {
    // This now just updates the timestamp since we're using HTML layout
    setIsGenerating(true);
    
    try {
      // Simulate generation delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setLastGenerated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error generating spec sheet:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadSheet = async () => {
    if (!specSheetRef.current) return;
    
    try {
      const canvas = await html2canvas(specSheetRef.current, {
        backgroundColor: '#0f0f23',
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true
      });
      
      const link = document.createElement('a');
      link.download = `reflow-spec-${selectedLogo?.templateId || 'logo'}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Failed to download spec sheet:', error);
    }
  };

  const copyToClipboard = async () => {
    if (!specSheetRef.current) return;
    
    try {
      const canvas = await html2canvas(specSheetRef.current, {
        backgroundColor: '#0f0f23',
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        alert('Spec sheet copied to clipboard!');
      });
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const executeCommand = () => {
    console.log('🔧 executeCommand called with:', terminalCommand);
    if (!terminalCommand.trim()) {
      console.log('❌ Command is empty, returning');
      return;
    }
    
    // Add to command history
    setCommandHistory(prev => [...prev, `$ ${terminalCommand}`]);
    console.log('✅ Added command to history:', terminalCommand);
    
    // Simulate command execution
    if (terminalCommand.includes('--help')) {
      setCommandHistory(prev => [...prev,
        'ReFlow CLI - Programmatic Logo Generator',
        '',
        'Commands:',
        '  generate    Generate logo and specification sheet',
        '  config      Configure specification sheet options',
        '  viewport    Control logo viewport (pan/zoom)',
        '  --template  Specify template ID',
        '  --logo-id   Set logo identifier', 
        '  --size      Set logo dimensions (200-500)',
        '  --format    Output format (png, svg, pdf)',
        '  --output    Output filename',
        '  --grid      Enable/disable grid (true/false)',
        '  --style     Terminal styling (true/false)',
        '  --zoom      Set viewport zoom (0.1-5.0)',
        '  --pan       Set viewport position (x,y)',
        '  --origin    Go to origin (0,0)',
        '  --find      Position to find drawing content',
        '  --reset     Reset viewport to default',
        '',
        'Examples:',
        '  reflow generate --template=wave-bars --size=400',
        '  reflow config --size=450 --grid=false',
        '  reflow viewport --zoom=2.0 --pan=100,-50',
        '  reflow viewport --origin',
        '  reflow viewport --reset',
        ''
      ]);
    } else if (terminalCommand.includes('reflow generate')) {
      setCommandHistory(prev => [...prev, 
        '🔄 Executing command...',
        '✓ Generating specification sheet...',
        ''
      ]);
      
      // Trigger a regeneration
      generateSheet().then(() => {
        setCommandHistory(prev => [...prev,
          '✓ Logo rendered successfully',
          '✓ Parameters exported', 
          '✓ Output saved to reflow-spec-sheet.png',
          '✓ Command completed successfully',
          ''
        ]);
      }).catch((error) => {
        setCommandHistory(prev => [...prev,
          `❌ Error: ${error.message}`,
          ''
        ]);
      });
    } else if (terminalCommand.includes('download') || terminalCommand.includes('save')) {
      setCommandHistory(prev => [...prev, 
        '📥 Downloading specification sheet...',
        ''
      ]);
      downloadSheet();
      setCommandHistory(prev => [...prev,
        '✓ Downloaded to reflow-spec-sheet.png',
        ''
      ]);
    } else if (terminalCommand.includes('copy') || terminalCommand.includes('clipboard')) {
      setCommandHistory(prev => [...prev, 
        '📋 Copying to clipboard...',
        ''
      ]);
      copyToClipboard().then(() => {
        setCommandHistory(prev => [...prev,
          '✓ Copied to clipboard',
          ''
        ]);
      }).catch(() => {
        setCommandHistory(prev => [...prev,
          '❌ Failed to copy to clipboard',
          ''
        ]);
      });
    } else if (terminalCommand.includes('clear') || terminalCommand.includes('reset')) {
      setCommandHistory([]);
    } else if (terminalCommand.includes('reflow config') || terminalCommand.includes('config ')) {
      // Parse configuration commands
      const configUpdates: Partial<SpecSheetOptions> = {};
      let configMessages: string[] = ['⚙️ Updating configuration...'];
      
      // Parse --size parameter
      const sizeMatch = terminalCommand.match(/--size[=\s](\d+)/);
      if (sizeMatch) {
        const size = parseInt(sizeMatch[1]);
        if (size >= 200 && size <= 500) {
          configUpdates.logoSize = size;
          configMessages.push(`✓ Logo size set to ${size}px`);
        } else {
          configMessages.push(`❌ Invalid size: ${size} (must be 200-500)`);
        }
      }
      
      // Parse --grid parameter
      const gridMatch = terminalCommand.match(/--grid[=\s](true|false|on|off)/);
      if (gridMatch) {
        const gridValue = gridMatch[1] === 'true' || gridMatch[1] === 'on';
        configUpdates.showGrid = gridValue;
        configMessages.push(`✓ Grid ${gridValue ? 'enabled' : 'disabled'}`);
      }
      
      // Parse --style parameter
      const styleMatch = terminalCommand.match(/--style[=\s](true|false|on|off)/);
      if (styleMatch) {
        const styleValue = styleMatch[1] === 'true' || styleMatch[1] === 'on';
        configUpdates.terminalStyle = styleValue;
        configMessages.push(`✓ Terminal style ${styleValue ? 'enabled' : 'disabled'}`);
      }
      
      // Parse section toggles
      const sectionsMatch = terminalCommand.match(/--sections[=\s]([a-zA-Z,]+)/);
      if (sectionsMatch) {
        const sections = sectionsMatch[1].split(',');
        const sectionsUpdate: any = {};
        sections.forEach(section => {
          switch(section.trim().toLowerCase()) {
            case 'metadata':
              sectionsUpdate.showMetadata = true;
              configMessages.push(`✓ Metadata section enabled`);
              break;
            case 'parameters':
              sectionsUpdate.showParameters = true;
              configMessages.push(`✓ Parameters section enabled`);
              break;
            case 'environment':
              sectionsUpdate.showEnvironment = true;
              configMessages.push(`✓ Environment section enabled`);
              break;
          }
        });
        if (Object.keys(sectionsUpdate).length > 0) {
          configUpdates.sections = { ...sheetOptions.sections, ...sectionsUpdate };
        }
      }
      
      // Apply updates if any
      if (Object.keys(configUpdates).length > 0) {
        setSheetOptions(prev => ({ ...prev, ...configUpdates }));
        configMessages.push('✓ Configuration updated successfully');
        
        // Trigger regeneration after config change
        setTimeout(() => {
          generateSheet();
        }, 500);
      } else {
        configMessages.push('❌ No valid configuration parameters found');
        configMessages.push('Use: reflow config --size=400 --grid=true --style=false');
      }
      
      setCommandHistory(prev => [...prev, ...configMessages, '']);
    } else if (terminalCommand.includes('reflow viewport') || terminalCommand.includes('viewport ')) {
      // Parse viewport commands
      let viewportMessages: string[] = ['🗺️ Updating viewport...'];
      let viewportUpdates: Partial<{ x: number, y: number, zoom: number }> = {};
      
      // Parse --zoom parameter
      const zoomMatch = terminalCommand.match(/--zoom[=\s]([\d.]+)/);
      if (zoomMatch) {
        const zoom = parseFloat(zoomMatch[1]);
        if (zoom >= 0.1 && zoom <= 5.0) {
          viewportUpdates.zoom = zoom;
          viewportMessages.push(`✓ Zoom set to ${zoom.toFixed(2)}x`);
        } else {
          viewportMessages.push(`❌ Invalid zoom: ${zoom} (must be 0.1-5.0)`);
        }
      }
      
      // Parse --pan parameter
      const panMatch = terminalCommand.match(/--pan[=\s]([-\d.]+),([-\d.]+)/);
      if (panMatch) {
        const x = parseFloat(panMatch[1]);
        const y = parseFloat(panMatch[2]);
        viewportUpdates.x = x;
        viewportUpdates.y = y;
        viewportMessages.push(`✓ Position set to (${x}, ${y})`);
      }
      
      // Parse --origin flag
      if (terminalCommand.includes('--origin')) {
        viewportUpdates.x = 0;
        viewportUpdates.y = 0;
        viewportMessages.push(`✓ Moved to origin (0, 0)`);
      }
      
      // Parse --find flag
      if (terminalCommand.includes('--find')) {
        // Position viewport to show drawing content
        viewportUpdates.x = width / 2;
        viewportUpdates.y = height / 2;
        viewportUpdates.zoom = 1.0;
        viewportMessages.push(`✓ Positioned to find drawing content`);
      }
      
      // Parse --reset flag
      if (terminalCommand.includes('--reset')) {
        viewportUpdates = { x: 0, y: 0, zoom: 1 };
        viewportMessages.push(`✓ Viewport reset to default`);
      }
      
      // Apply updates if any
      if (Object.keys(viewportUpdates).length > 0) {
        setViewport(prev => ({ ...prev, ...viewportUpdates }));
        viewportMessages.push('✓ Viewport updated successfully');
      } else {
        viewportMessages.push('❌ No valid viewport parameters found');
        viewportMessages.push('Use: reflow viewport --zoom=2.0 --pan=100,-50');
      }
      
      setCommandHistory(prev => [...prev, ...viewportMessages, '']);
    } else {
      setCommandHistory(prev => [...prev, `Command not found: ${terminalCommand}`, '']);
    }
    
    // Clear current command
    setTerminalCommand('');
  };

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText(terminalCommand);
      alert('Command copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy command:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-extralight text-white/90 mb-2 relative group" style={{ fontFamily: "'Geist Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace", textShadow: '0 2px 16px rgba(80,180,255,0.08)' }}>
            🔍 ReFlow Logo Inspector
            <span className="block absolute left-0 -bottom-1 w-full h-0.5 bg-gradient-to-r from-white/10 via-blue-400/20 to-white/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </h1>
          <p className="text-white/60 font-light text-sm" style={{ fontFamily: "'Geist Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace" }}>
            Infinite canvas exploration and spec sheet generation • Last generated: {lastGenerated}
          </p>
        </div>

        {/* Template Selection */}
        <div className="mb-6 p-4 bg-white/[0.015] border border-white/[0.04] rounded-lg">
          <h2 className="font-light text-white/80 text-sm mb-3" style={{ fontFamily: "'Geist Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace" }}>Template Selection</h2>
          <div className="flex flex-wrap gap-2">
            {availableTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplateId(template.id)}
                className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                  selectedTemplateId === template.id
                    ? 'bg-blue-500/30 text-blue-300 border border-blue-400/30'
                    : 'bg-white/[0.025] text-white/60 border border-white/[0.04] hover:bg-white/[0.035]'
                }`}
              >
                {template.name}
              </button>
            ))}
          </div>
          {selectedTemplateId && (
            <div className="mt-3 text-xs text-white/50">
              Selected: <span className="text-white/80 font-mono">{selectedTemplateId}</span>
            </div>
          )}
        </div>

        {/* Logo Info */}
        <div className="mb-6 p-4 bg-white/[0.015] border border-white/[0.04] rounded-lg">
          <h2 className="font-light text-white/80 text-sm mb-2" style={{ fontFamily: "'Geist Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace" }}>Preview Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-white/60 font-light w-24" style={{ fontFamily: "'Geist Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace" }}>Template:</span>
              <span className="text-white/80 font-mono">
                {selectedTemplateId}
              </span>
            </div>
            <div>
              <span className="text-white/60 font-light w-24" style={{ fontFamily: "'Geist Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace" }}>Name:</span>
              <span className="text-white/80 font-mono">
                {availableTemplates.find(t => t.id === selectedTemplateId)?.name || selectedTemplateId}
              </span>
            </div>
            <div>
              <span className="text-white/60 font-light w-24" style={{ fontFamily: "'Geist Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace" }}>Category:</span>
              <span className="text-white/80 font-mono">
                {availableTemplates.find(t => t.id === selectedTemplateId)?.category || 'Unknown'}
              </span>
            </div>
          </div>
        </div>

        {/* Specification Sheet */}
        <div className="relative mb-6">
          <TargetOverlay inset={0} length={6} />
          {/* Preview section */}
          <div 
            ref={specSheetRef}
            className="bg-gradient-to-br from-slate-950 via-gray-950 to-black p-8 w-full relative z-10 border border-white/10"
            style={{ minHeight: '600px' }}
          >
            <div className="flex h-full gap-6">
              {/* Left: Logo Preview */}
              <div className="flex-1 min-w-0 flex flex-col items-start justify-start">
                <h3 className="text-white/80 font-light text-sm mb-4 relative group" style={{ fontFamily: "'Geist Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace" }}>
                  Logo Preview
                  <span className="block absolute left-0 -bottom-1 w-8 h-0.5 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </h3>
                <div
                  className="bg-white rounded border border-white/10 p-0 w-full aspect-square flex items-center justify-center transition-transform duration-200 hover:shadow-lg hover:scale-[1.015]"
                >
                  {(() => {
                    const [canvasSize, setCanvasSize] = React.useState(350);
                    const containerRef = React.useRef<HTMLDivElement>(null);
                    React.useLayoutEffect(() => {
                      if (containerRef.current) {
                        const rect = containerRef.current.getBoundingClientRect();
                        setCanvasSize(Math.floor(rect.width));
                      }
                    }, []);
                    return (
                      <div ref={containerRef} className="w-full h-full">
                        {hasHydrated ? (
                          <LogoCanvas
                            logo={{
                              templateId: selectedTemplateId,
                              parameters: {
                                // Default parameters - templates will use their own defaults
                                core: {},
                                style: {},
                                custom: {}
                              },
                              id: 'spec-sheet-preview',
                              name: 'Preview'
                            }}
                            width={canvasSize}
                            height={canvasSize}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                            <span className="text-gray-600 font-mono text-sm">
                              {hasHydrated ? 'No logo selected' : 'Loading logo...'}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Right: Specification Details */}
              <div className="flex-1 min-w-0">
                <h2 className="text-white/90 font-light text-xl mb-6 relative group" style={{ fontFamily: "'Geist Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace" }}>
                  Logo Specification
                  <span className="block absolute left-0 -bottom-1 w-12 h-0.5 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </h2>
                
                {/* Configuration */}
                <div className="mb-6">
                  <h3 className="text-white/80 font-light text-sm mb-3" style={{ fontFamily: "'Geist Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace" }}>Configuration</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex">
                      <span className="text-white/60 font-light w-24" style={{ fontFamily: "'Geist Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace" }}>Template:</span>
                      <span className="text-white/90 font-mono">
                        {selectedTemplateId}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-white/60 font-light w-24" style={{ fontFamily: "'Geist Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace" }}>Name:</span>
                      <span className="text-white/90 font-mono">
                        {availableTemplates.find(t => t.id === selectedTemplateId)?.name || selectedTemplateId}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-white/60 font-light w-24" style={{ fontFamily: "'Geist Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace" }}>Category:</span>
                      <span className="text-white/90 font-mono">
                        {availableTemplates.find(t => t.id === selectedTemplateId)?.category || 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Parameters */}
                <div className="relative bg-white/5 rounded p-3 my-6">

                  {/* Content */}
                  <pre className="text-white/70 font-extralight text-[11px] leading-tight relative z-10" style={{ fontFamily: "'Geist Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace" }}>
                    {selectedTemplateId ? `Template: ${selectedTemplateId}\nUsing default parameters\n(parameters auto-loaded by template)` : 'No template selected'}
                  </pre>
                </div>

                {/* Metadata */}
                <div>
                  <h3 className="text-white/80 font-light text-sm mb-3" style={{ fontFamily: "'Geist Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace" }}>Metadata</h3>
                  <div className="space-y-1 text-xs">
                    <div className="flex">
                      <span className="text-white/50 font-light w-20" style={{ fontFamily: "'Geist Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace" }}>Generated:</span>
                      <span className="text-white/70 font-mono">
                        {hasHydrated ? new Date().toLocaleString() : 'Loading...'}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-white/50 font-light w-20" style={{ fontFamily: "'Geist Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace" }}>Environment:</span>
                      <span className="text-white/70 font-mono">development</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {isGenerating && (
            <div className="mt-4 text-center text-white/60 font-mono text-sm">
              Generating specification sheet...
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-6 flex gap-4 flex-wrap">
          <button
            onClick={generateSheet}
            disabled={isGenerating}
            className="px-3 py-1.5 bg-white/[0.015] border border-white/[0.04] text-white/80 font-light text-[11px] rounded-sm shadow-sm hover:bg-white/[0.03] hover:ring-1 hover:ring-white/20 focus:ring-2 focus:ring-blue-400/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? 'Generating...' : 'Regenerate'}
          </button>
          
          <button
            onClick={downloadSheet}
            disabled={isGenerating}
            className="px-3 py-1.5 bg-blue-500/10 border border-blue-400/20 text-blue-300 font-light text-[11px] rounded-sm shadow-sm hover:bg-blue-500/20 hover:ring-1 hover:ring-blue-400/30 focus:ring-2 focus:ring-blue-400/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Download PNG
          </button>
          
          <button
            onClick={copyToClipboard}
            disabled={isGenerating}
            className="px-3 py-1.5 bg-green-500/10 border border-green-400/20 text-green-300 font-light text-[11px] rounded-sm shadow-sm hover:bg-green-500/20 hover:ring-1 hover:ring-green-400/30 focus:ring-2 focus:ring-green-400/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Copy to Clipboard
          </button>
        </div>

        {/* Interactive Terminal */}
        <div className="mb-8 bg-black/20 border border-white/[0.04] rounded-lg overflow-hidden">
          {/* Terminal Header */}
          <div className="bg-white/[0.005] border-b border-white/[0.03] px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
              </div>
              <span className="font-light text-white/60 text-[11px]" style={{ fontFamily: "'Geist Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace" }}>reflow-terminal</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={copyCommand}
                className="px-1.5 py-0.5 bg-white/[0.015] border border-white/[0.04] text-white/60 hover:bg-white/[0.035] transition-colors font-light text-[11px] rounded-sm" style={{ fontFamily: "'Geist Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace" }}>
                Copy
              </button>
              <button
                onClick={() => setCommandHistory([])}
                className="px-1.5 py-0.5 bg-white/[0.015] border border-white/[0.04] text-white/60 hover:bg-white/[0.035] transition-colors font-light text-[11px] rounded-sm" style={{ fontFamily: "'Geist Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace" }}>
                Clear
              </button>
            </div>
          </div>

          {/* Terminal Content */}
          <div className="p-4">
            {/* Command History */}
            {commandHistory.length > 0 && (
              <div className="mb-4 space-y-1">
                {commandHistory.map((line, index) => (
                  <div 
                    key={index}
                    className={`font-extralight text-[11px] leading-tight ${
                      line.startsWith('$') 
                        ? 'text-white/80' 
                        : line.startsWith('✓') 
                          ? 'text-green-400/80'
                          : line.includes('Command not found')
                            ? 'text-red-400/80'
                            : 'text-white/60'
                    }`}
                    style={{ fontFamily: "'Geist Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace" }}
                  >
                    {line}
                  </div>
                ))}
              </div>
            )}

            {/* Current Command Input */}
            <div className="flex items-center gap-2">
              <span className="font-light text-white/60 text-[11px]" style={{ fontFamily: "'Geist Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace" }}>reflow@studio:~$</span>
              <input
                type="text"
                value={terminalCommand}
                onChange={(e) => setTerminalCommand(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    executeCommand();
                  }
                }}
                placeholder="Enter command..."
                className="flex-1 bg-transparent border-none outline-none text-white/80 font-extralight text-[11px] leading-tight placeholder-white/30 caret-white/80 focus:ring-2 focus:ring-blue-400/40 focus:bg-white/5 transition-all"
                style={{ fontFamily: "'Geist Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace" }}
              />
              <button
                onClick={() => {
                  console.log('🎯 Execute button clicked!');
                  executeCommand();
                }}
                disabled={!terminalCommand.trim()}
                className="px-1.5 py-0.5 bg-blue-500/10 border border-blue-400/20 text-blue-300 hover:bg-blue-500/20 transition-colors font-light text-[11px] rounded-sm disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ fontFamily: "'Geist Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace" }}
              >
                Run
              </button>
            </div>

            {/* Command Suggestions */}
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => setTerminalCommand('reflow generate --help')}
                className="px-1.5 py-0.5 bg-white/[0.015] border border-white/[0.04] text-white/50 hover:bg-white/[0.025] transition-colors font-light text-[11px] rounded-sm"
                style={{ fontFamily: "'Geist Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace" }}>
                --help
              </button>
              <button
                onClick={() => setTerminalCommand(generateCurrentCommand())}
                className="px-1.5 py-0.5 bg-white/[0.015] border border-white/[0.04] text-white/50 hover:bg-white/[0.025] transition-colors font-light text-[11px] rounded-sm"
                style={{ fontFamily: "'Geist Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace" }}>
                Generate
              </button>
              <button
                onClick={() => setTerminalCommand('reflow config --size=450')}
                className="px-1.5 py-0.5 bg-white/[0.015] border border-white/[0.04] text-white/50 hover:bg-white/[0.025] transition-colors font-light text-[11px] rounded-sm"
                style={{ fontFamily: "'Geist Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace" }}>
                Config
              </button>
              <button
                onClick={() => setTerminalCommand('reflow viewport --origin')}
                className="px-1.5 py-0.5 bg-red-500/15 border border-red-400/25 text-red-300/80 hover:bg-red-500/25 transition-colors font-light text-[11px] rounded-sm"
                style={{ fontFamily: "'Geist Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace" }}>
                Origin
              </button>
              <button
                onClick={() => setTerminalCommand('reflow viewport --find')}
                className="px-1.5 py-0.5 bg-blue-500/15 border border-blue-400/25 text-blue-300/80 hover:bg-blue-500/25 transition-colors font-light text-[11px] rounded-sm"
                style={{ fontFamily: "'Geist Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace" }}>
                Find
              </button>
              <button
                onClick={() => setTerminalCommand('download')}
                className="px-1.5 py-0.5 bg-white/[0.015] border border-white/[0.04] text-white/50 hover:bg-white/[0.025] transition-colors font-light text-[11px] rounded-sm"
                style={{ fontFamily: "'Geist Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace" }}>
                Download
              </button>
              <button
                onClick={() => setTerminalCommand('copy')}
                className="px-1.5 py-0.5 bg-white/[0.015] border border-white/[0.04] text-white/50 hover:bg-white/[0.025] transition-colors font-light text-[11px] rounded-sm"
                style={{ fontFamily: "'Geist Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace" }}>
                Copy
              </button>
              <button
                onClick={() => setTerminalCommand('clear')}
                className="px-1.5 py-0.5 bg-white/[0.015] border border-white/[0.04] text-white/50 hover:bg-white/[0.025] transition-colors font-light text-[11px] rounded-sm"
                style={{ fontFamily: "'Geist Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace" }}>
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Controls (for tweaking) */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Style Controls */}
          <div className="bg-white/[0.015] border border-white/[0.04] rounded-lg p-4">
            <h3 className="font-mono text-white/80 text-sm mb-3">Style Controls</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-white/60 font-mono text-xs mb-1">
                  Logo Size: {sheetOptions.logoSize}px
                </label>
                <input
                  type="range"
                  min="200"
                  max="500"
                  value={sheetOptions.logoSize}
                  className="w-full accent-blue-400"
                  onChange={(e) => {
                    setSheetOptions(prev => ({
                      ...prev,
                      logoSize: parseInt(e.target.value)
                    }));
                  }}
                />
              </div>
              
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={sheetOptions.showGrid}
                    className="text-blue-400"
                    onChange={(e) => {
                      setSheetOptions(prev => ({
                        ...prev,
                        showGrid: e.target.checked
                      }));
                    }}
                  />
                  <span className="text-white/60 font-mono text-xs">Show Grid</span>
                </label>
              </div>
              
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={sheetOptions.terminalStyle}
                    className="text-blue-400"
                    onChange={(e) => {
                      setSheetOptions(prev => ({
                        ...prev,
                        terminalStyle: e.target.checked
                      }));
                    }}
                  />
                  <span className="text-white/60 font-mono text-xs">Terminal Style</span>
                </label>
              </div>
            </div>
          </div>

          {/* Section Controls */}
          <div className="bg-white/[0.015] border border-white/[0.04] rounded-lg p-4">
            <h3 className="font-mono text-white/80 text-sm mb-3">Sections</h3>
            <div className="space-y-3">
              <div>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={sheetOptions.sections?.showParameters ?? true}
                    className="text-blue-400" 
                    onChange={(e) => {
                      setSheetOptions(prev => ({
                        ...prev,
                        sections: {
                          ...prev.sections,
                          showParameters: e.target.checked
                        }
                      }));
                    }}
                  />
                  <span className="text-white/60 font-mono text-xs">Parameters</span>
                </label>
              </div>
              <div>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={sheetOptions.sections?.showMetadata ?? true}
                    className="text-blue-400" 
                    onChange={(e) => {
                      setSheetOptions(prev => ({
                        ...prev,
                        sections: {
                          ...prev.sections,
                          showMetadata: e.target.checked
                        }
                      }));
                    }}
                  />
                  <span className="text-white/60 font-mono text-xs">Metadata</span>
                </label>
              </div>
              <div>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={sheetOptions.sections?.showEnvironment ?? true}
                    className="text-blue-400" 
                    onChange={(e) => {
                      setSheetOptions(prev => ({
                        ...prev,
                        sections: {
                          ...prev.sections,
                          showEnvironment: e.target.checked
                        }
                      }));
                    }}
                  />
                  <span className="text-white/60 font-mono text-xs">Environment</span>
                </label>
              </div>
            </div>
          </div>

          {/* Presets */}
          <div className="bg-white/[0.015] border border-white/[0.04] rounded-lg p-4">
            <h3 className="font-mono text-white/80 text-sm mb-3">Presets</h3>
            <div className="space-y-2">
              <button
                onClick={() => setSheetOptions({
                  logoSize: 350,
                  showGrid: true,
                  terminalStyle: true,
                  sections: { showMetadata: true, showParameters: true, showEnvironment: true }
                })}
                className="w-full px-3 py-2 bg-white/[0.025] border border-white/[0.04] text-white/70 
                         hover:bg-white/[0.035] transition-colors font-mono text-xs rounded"
              >
                Default
              </button>
              <button
                onClick={() => setSheetOptions({
                  logoSize: 450,
                  showGrid: false,
                  terminalStyle: true,
                  sections: { showMetadata: false, showParameters: true, showEnvironment: false }
                })}
                className="w-full px-3 py-2 bg-blue-500/20 border border-blue-400/20 text-blue-300 
                         hover:bg-blue-500/30 transition-colors font-mono text-xs rounded"
              >
                Clean
              </button>
              <button
                onClick={() => setSheetOptions({
                  logoSize: 300,
                  showGrid: true,
                  terminalStyle: true,
                  sections: { showMetadata: true, showParameters: true, showEnvironment: true }
                })}
                className="w-full px-3 py-2 bg-green-500/20 border border-green-400/20 text-green-300 
                         hover:bg-green-500/30 transition-colors font-mono text-xs rounded"
              >
                Technical
              </button>
              <button
                onClick={() => window.open('/', '_blank')}
                className="w-full px-3 py-2 bg-white/[0.025] border border-white/[0.04] text-white/70 
                         hover:bg-white/[0.035] transition-colors font-mono text-xs rounded mt-4"
              >
                Back to ReFlow Studio
              </button>
            </div>
          </div>
        </div>


        {/* Debug Info */}
        <div className="mt-8 p-4 bg-black/20 border border-white/[0.04] rounded-lg">
          <h3 className="font-mono text-white/60 text-xs mb-2">Debug Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-mono text-white/50 text-xs mb-1">Logo Data</h4>
              <pre className="text-white/40 font-mono text-xs overflow-auto">
                {hasHydrated ? JSON.stringify({
                  selectedLogoId: selectedLogoId || "none",
                  templateId: selectedLogo?.templateId || "none",
                  parameterCount: selectedLogo ? Object.keys(selectedLogo?.parameters.custom || {}).length : 0,
                  lastGenerated: lastGenerated || "none"
                }, null, 2) : JSON.stringify({
                  selectedLogoId: "loading...",
                  templateId: "loading...",
                  parameterCount: "loading...",
                  lastGenerated: "loading..."
                }, null, 2)}
              </pre>
            </div>
            <div>
              <h4 className="font-mono text-white/50 text-xs mb-1">Sheet Options</h4>
              <pre className="text-white/40 font-mono text-xs overflow-auto">
                {JSON.stringify(sheetOptions, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}