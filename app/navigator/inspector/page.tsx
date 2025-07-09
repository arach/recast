'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLogoStore } from '@/lib/stores/logoStore';
import { generateSpecificationSheet, type SpecSheetOptions } from '@/lib/debug/specification-sheet-generator';
import html2canvas from 'html2canvas';
import { generateJSVisualization } from '@/lib/js-visualization-utils';
import { getAllJSTemplates } from '@/lib/js-template-registry';
import TargetOverlay from '@/components/TargetOverlay';
import TemplateParameterControls from '@/components/TemplateParameterControls';
import { ZoomIn, ZoomOut, Home, Search } from 'lucide-react';

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
      generateJSVisualization(ctx, logo.templateId, enhancedParams, Date.now() * 0.001, width, height);
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
  
  // Single render for most cases, with optional animation toggle
  useEffect(() => {
    // Just do a single render for now - user can enable animation later if needed
    performRender();
  }, [performRender, logo.templateId]);
  
  // Optional animation loop (disabled by default to prevent exploding)
  // Uncomment when we want smooth animations:
  /*
  useEffect(() => {
    let animationId: number;
    let lastFrameTime = 0;
    const targetFPS = 30;
    const frameInterval = 1000 / targetFPS;
    
    const animate = (currentTime: number) => {
      if (currentTime - lastFrameTime >= frameInterval) {
        performRender();
        lastFrameTime = currentTime;
      }
      animationId = requestAnimationFrame(animate);
    };
    
    const needsAnimation = logo.templateId?.includes('exploded');
    if (needsAnimation) {
      animationId = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [performRender, logo.templateId]);
  */
  
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
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Get mouse position relative to canvas
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    console.log('🎢 Wheel event - deltaY:', e.deltaY, 'mouse:', mouseX, mouseY);
    
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    
    setViewport(prev => {
      const newZoom = Math.max(0.1, Math.min(5, prev.zoom * zoomFactor));
      
      // Zoom towards mouse position (Google Maps style)
      const zoomRatio = newZoom / prev.zoom;
      const newX = mouseX + (prev.x - mouseX) * zoomRatio;
      const newY = mouseY + (prev.y - mouseY) * zoomRatio;
      
      console.log('🔍 Zoom towards mouse - old zoom:', prev.zoom.toFixed(2), 'new:', newZoom.toFixed(2));
      
      return {
        x: newX,
        y: newY,
        zoom: newZoom
      };
    });
  };

  const resetViewport = () => {
    // Reset to centered position in tile grid (same as initial position)
    setViewport({ x: TILE_SIZE * 1.5, y: TILE_SIZE * 1.5, zoom: 1 });
  };
  
  // Listen for custom resetViewport events from keyboard shortcuts
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const handleResetEvent = () => {
      resetViewport();
    };
    
    canvas.addEventListener('resetViewport', handleResetEvent);
    return () => canvas.removeEventListener('resetViewport', handleResetEvent);
  }, [resetViewport]);
  
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
      
      {/* Viewport controls - subtle and less prominent */}
      <div className="absolute top-2 right-2">
        <div className="flex gap-1 bg-black/20 backdrop-blur-sm rounded-md p-1 border border-white/10">
          <button
            onClick={() => {
              setViewport(prev => ({ ...prev, zoom: prev.zoom * 1.2 }));
            }}
            className="w-7 h-7 bg-white/10 text-white/70 hover:bg-white/20 hover:text-white/90 rounded text-sm flex items-center justify-center transition-all border border-white/20"
            title="Zoom In"
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={() => {
              setViewport(prev => ({ ...prev, zoom: prev.zoom * 0.8 }));
            }}
            className="w-7 h-7 bg-white/10 text-white/70 hover:bg-white/20 hover:text-white/90 rounded text-sm flex items-center justify-center transition-all border border-white/20"
            title="Zoom Out"
          >
            <ZoomOut size={14} />
          </button>
          <button
            onClick={() => {
              resetViewport();
            }}
            className="w-7 h-7 bg-white/10 text-white/70 hover:bg-white/20 hover:text-white/90 rounded text-sm flex items-center justify-center transition-all border border-white/20"
            title="Center View"
          >
            <Home size={14} />
          </button>
          <button
            onClick={() => {
              setViewport({ x: width/2, y: height/2, zoom: 1.0 });
            }}
            className="w-7 h-7 bg-white/10 text-white/70 hover:bg-white/20 hover:text-white/90 rounded text-sm flex items-center justify-center transition-all border border-white/20"
            title="Find Drawing"
          >
            <Search size={14} />
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
        <div className="bg-black/70 text-white/90 px-3 py-2 rounded-lg shadow-lg border border-white/10 font-mono">
          <div className="text-[10px]">
            <span className="text-white/60 font-semibold">Center:</span> 
            <span className="text-white text-[11px] ml-1">{((-viewport.x + width / 2) / viewport.zoom).toFixed(0)}, {((-viewport.y + height / 2) / viewport.zoom).toFixed(0)}</span>
          </div>
          <div className="text-[10px]">
            <span className="text-white/60 font-semibold">Zoom:</span> 
            <span className="text-white text-[11px] ml-1">{viewport.zoom.toFixed(2)}x (Level {Math.floor(Math.log2(viewport.zoom))})</span>
          </div>
          <div className="text-[10px]">
            <span className="text-white/60 font-semibold">Grid:</span> 
            <span className="text-white text-[11px] ml-1">{(() => {
              const baseGridSize = 100;
              const zoomLevel = Math.log2(viewport.zoom);
              const gridSize = baseGridSize * Math.pow(2, Math.round(zoomLevel * 8) / 8);
              return gridSize;
            })()}px</span>
          </div>
          {isDragging && (
            <div className="text-blue-400 mt-1 text-[10px] font-semibold">• Dragging</div>
          )}
          {isSnapping && (
            <div className="text-green-400 mt-1 text-[10px] font-semibold">• Snapping to grid</div>
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
  
  // Parameter editing state
  const [currentParameters, setCurrentParameters] = useState<any>({
    frequency: 3,
    amplitude: 50,
    colorMode: "spectrum",
    waveType: "sine",
    animationSpeed: 1.2,
    barCount: 40,
    barSpacing: 2
  });
  
  // UI enhancement states
  const [justDownloaded, setJustDownloaded] = useState(false);
  const [justCopied, setJustCopied] = useState(false);
  const [keyPressed, setKeyPressed] = useState<string | null>(null);
  
  // Load available templates
  useEffect(() => {
    getAllJSTemplates().then(setAvailableTemplates);
  }, []);

  // Load template-specific default parameters when template changes
  useEffect(() => {
    const loadTemplateDefaults = async () => {
      if (!selectedTemplateId) return;
      
      try {
        const templates = await getAllJSTemplates();
        const template = templates.find(t => t.id === selectedTemplateId);
        
        if (template?.parameters) {
          // Extract default values from parameter definitions
          const defaults: any = {};
          Object.entries(template.parameters).forEach(([key, param]: [string, any]) => {
            if (param.default !== undefined) {
              defaults[key] = param.default;
            }
          });
          
          // Set template-specific defaults
          setCurrentParameters(defaults);
        }
      } catch (error) {
        console.error('Failed to load template defaults:', error);
      }
    };
    
    loadTemplateDefaults();
  }, [selectedTemplateId]);


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
      // Simulate generation delay with smoother animation
      await new Promise(resolve => setTimeout(resolve, 800));
      setLastGenerated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error generating spec sheet:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadSheet = async () => {
    console.log('📥 Download button clicked');
    
    try {
      // Get the main canvas
      const mainCanvas = document.querySelector('canvas') as HTMLCanvasElement;
      if (!mainCanvas) {
        console.log('❌ No main canvas found');
        alert('No canvas content to export');
        return;
      }
      
      console.log('🎨 Step 1: Capturing main canvas...');
      // Convert main canvas to image
      const canvasDataURL = mainCanvas.toDataURL('image/png');
      
      console.log('🎨 Step 2: Capturing HTML UI elements...');
      // Capture the spec sheet div with html2canvas
      const specDiv = specSheetRef.current;
      if (!specDiv) {
        console.log('❌ No spec div found');
        alert('No UI content to export');
        return;
      }
      
      // Get precise coordinates of the LogoCanvas container
      const logoCanvasContainer = document.querySelector('[data-testid="logo-canvas-container"]') || 
                                 document.querySelector('.logo-preview') ||
                                 document.querySelector('canvas')?.parentElement;
      
      let previewBounds = { x: 0, y: 0, width: 400, height: 400 }; // fallback
      
      if (logoCanvasContainer) {
        const containerRect = logoCanvasContainer.getBoundingClientRect();
        const specRect = specDiv.getBoundingClientRect();
        
        // Calculate precise position relative to the spec div
        previewBounds = {
          x: containerRect.left - specRect.left,
          y: containerRect.top - specRect.top,
          width: containerRect.width,
          height: containerRect.height
        };
        
        console.log('🎯 Precise preview bounds:', previewBounds);
      }
      
      // Use html2canvas to capture the UI elements
      const htmlCanvas = await html2canvas(specDiv, {
        backgroundColor: '#0f0f23',
        scale: 1,
        useCORS: true,
        allowTaint: true,
        logging: false,
        // Only capture specific elements, not the main canvas
        ignoreElements: (element) => element.tagName === 'CANVAS'
      });
      
      console.log('🎨 Step 3: Creating composite canvas...');
      // Create off-screen canvas for stitching
      const compositeCanvas = document.createElement('canvas');
      const ctx = compositeCanvas.getContext('2d');
      if (!ctx) return;
      
      // Set composite canvas to match HTML canvas size (since we're overlaying)
      compositeCanvas.width = htmlCanvas.width;
      compositeCanvas.height = htmlCanvas.height;
      
      console.log('🎨 Step 4: Loading and stitching images...');
      
      // Prepare filename outside the callback
      const templateId = selectedLogo.templateId || 'export';
      
      // Load canvas image
      const canvasImg = new Image();
      canvasImg.onload = () => {
        // First, draw the HTML UI as the base
        ctx.drawImage(htmlCanvas, 0, 0);
        
        // Use precise coordinates instead of percentages
        const previewX = previewBounds.x;
        const previewY = previewBounds.y;
        const previewWidth = previewBounds.width;
        const previewHeight = previewBounds.height;
        
        // Scale and center the canvas content within the preview area
        const canvasAspect = mainCanvas.width / mainCanvas.height;
        const previewAspect = previewWidth / previewHeight;
        
        let drawWidth, drawHeight, drawX, drawY;
        
        if (canvasAspect > previewAspect) {
          // Canvas is wider - fit to width
          drawWidth = previewWidth * 0.9; // Leave some margin
          drawHeight = drawWidth / canvasAspect;
          drawX = previewX + (previewWidth - drawWidth) / 2;
          drawY = previewY + (previewHeight - drawHeight) / 2;
        } else {
          // Canvas is taller - fit to height  
          drawHeight = previewHeight * 0.9; // Leave some margin
          drawWidth = drawHeight * canvasAspect;
          drawX = previewX + (previewWidth - drawWidth) / 2;
          drawY = previewY + (previewHeight - drawHeight) / 2;
        }
        
        // Draw the canvas content scaled and positioned correctly
        ctx.drawImage(canvasImg, drawX, drawY, drawWidth, drawHeight);
        
        console.log('🎨 Step 5: Exporting composite...');
        // Export the final composite
        const link = document.createElement('a');
        link.download = `reflow-composite-${templateId}-${Date.now()}.png`;
        link.href = compositeCanvas.toDataURL('image/png');
        link.click();
        
        console.log('✅ Composite export successful');
        setJustDownloaded(true);
        setTimeout(() => setJustDownloaded(false), 2000);
      };
      
      canvasImg.src = canvasDataURL;
      
    } catch (error) {
      console.error('Failed to create composite export:', error);
      alert('Failed to export canvas. Please try again.');
    }
  };

  const copyToClipboard = async () => {
    console.log('📋 Copy button clicked');
    
    try {
      // Ensure document has focus
      if (!document.hasFocus()) {
        window.focus();
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Get the main canvas
      const mainCanvas = document.querySelector('canvas') as HTMLCanvasElement;
      if (!mainCanvas) {
        console.log('❌ No main canvas found');
        alert('No canvas content to copy');
        return;
      }
      
      console.log('🎨 Step 1: Capturing main canvas for clipboard...');
      // Convert main canvas to image
      const canvasDataURL = mainCanvas.toDataURL('image/png');
      
      console.log('🎨 Step 2: Capturing HTML UI elements...');
      // Capture the spec sheet div with html2canvas
      const specDiv = specSheetRef.current;
      if (!specDiv) {
        console.log('❌ No spec div found');
        alert('No UI content to copy');
        return;
      }
      
      // Get precise coordinates of the LogoCanvas container
      const logoCanvasContainer = document.querySelector('[data-testid="logo-canvas-container"]') || 
                                 document.querySelector('.logo-preview') ||
                                 document.querySelector('canvas')?.parentElement;
      
      let previewBounds = { x: 0, y: 0, width: 400, height: 400 }; // fallback
      
      if (logoCanvasContainer) {
        const containerRect = logoCanvasContainer.getBoundingClientRect();
        const specRect = specDiv.getBoundingClientRect();
        
        // Calculate precise position relative to the spec div
        previewBounds = {
          x: containerRect.left - specRect.left,
          y: containerRect.top - specRect.top,
          width: containerRect.width,
          height: containerRect.height
        };
        
        console.log('🎯 Precise preview bounds:', previewBounds);
      }
      
      // Use html2canvas to capture the UI elements
      const htmlCanvas = await html2canvas(specDiv, {
        backgroundColor: '#0f0f23',
        scale: 1,
        useCORS: true,
        allowTaint: true,
        logging: false,
        // Only capture specific elements, not the main canvas
        ignoreElements: (element) => element.tagName === 'CANVAS'
      });
      
      console.log('🎨 Step 3: Creating composite canvas...');
      // Create off-screen canvas for stitching
      const compositeCanvas = document.createElement('canvas');
      const ctx = compositeCanvas.getContext('2d');
      if (!ctx) return;
      
      // Set composite canvas to match HTML canvas size (since we're overlaying)
      compositeCanvas.width = htmlCanvas.width;
      compositeCanvas.height = htmlCanvas.height;
      
      console.log('🎨 Step 4: Loading and stitching images...');
      
      // Load canvas image
      const canvasImg = new Image();
      canvasImg.onload = () => {
        // First, draw the HTML UI as the base
        ctx.drawImage(htmlCanvas, 0, 0);
        
        // Use precise coordinates instead of percentages
        const previewX = previewBounds.x;
        const previewY = previewBounds.y;
        const previewWidth = previewBounds.width;
        const previewHeight = previewBounds.height;
        
        // Scale and center the canvas content within the preview area
        const canvasAspect = mainCanvas.width / mainCanvas.height;
        const previewAspect = previewWidth / previewHeight;
        
        let drawWidth, drawHeight, drawX, drawY;
        
        if (canvasAspect > previewAspect) {
          // Canvas is wider - fit to width
          drawWidth = previewWidth * 0.9; // Leave some margin
          drawHeight = drawWidth / canvasAspect;
          drawX = previewX + (previewWidth - drawWidth) / 2;
          drawY = previewY + (previewHeight - drawHeight) / 2;
        } else {
          // Canvas is taller - fit to height  
          drawHeight = previewHeight * 0.9; // Leave some margin
          drawWidth = drawHeight * canvasAspect;
          drawX = previewX + (previewWidth - drawWidth) / 2;
          drawY = previewY + (previewHeight - drawHeight) / 2;
        }
        
        // Draw the canvas content scaled and positioned correctly
        ctx.drawImage(canvasImg, drawX, drawY, drawWidth, drawHeight);
        
        console.log('🎨 Step 5: Copying composite to clipboard...');
        // Copy to clipboard
        compositeCanvas.toBlob(async (blob) => {
          if (!blob) {
            console.log('❌ Failed to create blob from composite canvas');
            return;
          }
          
          try {
            const item = new ClipboardItem({ 'image/png': blob });
            await navigator.clipboard.write([item]);
            
            console.log('✅ Composite canvas copied to clipboard');
            setJustCopied(true);
            setTimeout(() => setJustCopied(false), 2000);
          } catch (clipboardError) {
            console.error('Clipboard write failed:', clipboardError);
            alert('Could not copy to clipboard. Please ensure the window is focused and try again.');
          }
        });
      };
      
      canvasImg.src = canvasDataURL;
      
    } catch (error) {
      console.error('Failed to copy composite canvas:', error);
      alert('Failed to copy canvas. Please try again.');
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
      // Ensure document has focus before clipboard operation
      if (!document.hasFocus()) {
        window.focus();
        // Give a moment for focus to take effect
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      await navigator.clipboard.writeText(terminalCommand);
      alert('Command copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy command:', error);
      alert('Could not copy to clipboard. Please ensure the window is focused and try again.');
    }
  };

  // Keyboard shortcuts - moved after function definitions
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      // Visual feedback for key press
      setKeyPressed(e.key.toLowerCase());
      setTimeout(() => setKeyPressed(null), 200);
      
      switch (e.key.toLowerCase()) {
        case ' ': // Space - center view
          e.preventDefault();
          // Find the LogoCanvas resetViewport function (we'll need to expose this)
          const canvas = document.querySelector('canvas');
          if (canvas) {
            // For now, we'll create a custom event to trigger reset
            const resetEvent = new CustomEvent('resetViewport');
            canvas.dispatchEvent(resetEvent);
          }
          break;
        
        case 'r': // R - regenerate
          e.preventDefault();
          if (!isGenerating) {
            generateSheet();
          }
          break;
        
        case 'd': // D - download
          e.preventDefault();
          if (!isGenerating) {
            downloadSheet();
          }
          break;
          
        case 'c': // C - copy (with Ctrl/Cmd)
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            if (!isGenerating) {
              copyToClipboard();
            }
          }
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isGenerating]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-950 to-black p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white/90 mb-2 relative group" style={{ textShadow: '0 2px 16px rgba(80,180,255,0.12)' }}>
            🔍 ReFlow Logo Inspector
            <span className="block absolute left-0 -bottom-1 w-full h-0.5 bg-gradient-to-r from-blue-400/40 via-purple-400/60 to-blue-400/40 scale-x-0 group-hover:scale-x-100 transition-all duration-500 origin-left" />
          </h1>
          <p className="text-white/60 font-semibold text-sm">
            Infinite canvas exploration and spec sheet generation • Last generated: <span className="text-white text-[11px] font-mono ml-1">{lastGenerated}</span>
          </p>
          <div className="mt-2 text-white/40 text-xs">
            <span className="inline-flex items-center gap-4">
              <span><kbd className="px-1 py-0.5 bg-white/10 rounded text-[10px] font-mono">Space</kbd> Center</span>
              <span><kbd className="px-1 py-0.5 bg-white/10 rounded text-[10px] font-mono">R</kbd> Regenerate</span>
              <span><kbd className="px-1 py-0.5 bg-white/10 rounded text-[10px] font-mono">D</kbd> Download</span>
              <span><kbd className="px-1 py-0.5 bg-white/10 rounded text-[10px] font-mono">Ctrl+C</kbd> Copy</span>
            </span>
          </div>
        </div>

        {/* Template Selection */}
        <div className="mb-6 p-4 bg-white/[0.015] border border-white/[0.04] rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
          <h2 className="font-bold text-white/80 text-base mb-3">Template Selection</h2>
          <div className="flex flex-wrap gap-2">
            {availableTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => setSelectedTemplateId(template.id)}
                className={`px-3 py-1 rounded text-xs font-mono transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                  selectedTemplateId === template.id
                    ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-white font-extralight border border-blue-400/40 shadow-md transform scale-[1.02]'
                    : 'bg-white/[0.025] text-white/60 font-semibold border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] hover:text-white/80 hover:shadow-md'
                }`}
              >
                {template.name}
              </button>
            ))}
          </div>
          {selectedTemplateId && (
            <div className="mt-3 text-xs">
              <span className="text-white/60 font-semibold">Selected:</span> <span className="text-white text-[11px] font-mono ml-1">{selectedTemplateId}</span>
            </div>
          )}
        </div>


        {/* Specification Sheet */}
        <div className="relative mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <TargetOverlay inset={0} length={6} />
          {/* Preview section */}
          <div 
            ref={specSheetRef}
            className="bg-gradient-to-br from-slate-950 via-gray-950 to-black p-4 w-full relative z-10 border border-white/10 shadow-xl"
            style={{ minHeight: '600px' }}
          >
            <div className="flex h-full gap-6">
              {/* Left: Logo Preview */}
              <div className="flex-1 min-w-0 flex flex-col items-start justify-start">
                <h3 className="font-bold text-white/80 text-base mb-4 relative group">
                  Logo Preview
                  <span className="block absolute left-0 -bottom-1 w-8 h-0.5 bg-gradient-to-r from-blue-400/60 to-purple-400/60 scale-x-0 group-hover:scale-x-100 transition-all duration-300 origin-left" />
                </h3>
                <div
                  className="bg-white rounded-lg border border-white/10 p-0 w-full aspect-square flex items-center justify-center transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:border-white/20 group"
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
                          <div className="animate-in fade-in duration-700">
                            <LogoCanvas
                              logo={{
                                templateId: selectedTemplateId,
                                parameters: {
                                  core: {},
                                  style: {},
                                  custom: currentParameters
                                },
                                id: 'spec-sheet-preview',
                                name: 'Preview'
                              }}
                              width={canvasSize}
                              height={canvasSize}
                            />
                          </div>
                        ) : (
                          <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center animate-pulse">
                            <div className="text-center">
                              <div className="w-8 h-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                              <span className="text-gray-600 font-mono text-sm">
                                Loading logo...
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Right: Specification Details */}
              <div className="flex-1 min-w-0">
                <h2 className="font-bold text-white/80 text-lg mb-6 relative group">
                  Logo Specification
                  <span className="block absolute left-0 -bottom-1 w-12 h-0.5 bg-gradient-to-r from-blue-400/60 to-purple-400/60 scale-x-0 group-hover:scale-x-100 transition-all duration-300 origin-left" />
                </h2>
                
                {/* Configuration */}
                <div className="mb-6">
                  <h3 className="font-bold text-white/80 text-base mb-3">Configuration</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex">
                      <span className="text-white/60 font-semibold w-24">Template:</span>
                      <span className="text-white text-[11px] font-mono ml-1">
                        {selectedTemplateId}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-white/60 font-semibold w-24">Name:</span>
                      <span className="text-white text-[11px] font-mono ml-1">
                        {availableTemplates.find(t => t.id === selectedTemplateId)?.name || selectedTemplateId}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-white/60 font-semibold w-24">Category:</span>
                      <span className="text-white text-[11px] font-mono ml-1">
                        {availableTemplates.find(t => t.id === selectedTemplateId)?.category || 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Parameters */}
                <div className="my-6">
                  <TemplateParameterControls
                    templateId={selectedTemplateId}
                    parameters={logo.jsParameters || {}}
                    onChange={(newParams) => {
                      setLogo({
                        ...logo,
                        jsParameters: newParams
                      });
                    }}
                  />
                </div>

                {/* Metadata */}
                <div>
                  <h3 className="font-bold text-white/80 text-base mb-3">Metadata</h3>
                  <div className="space-y-1 text-xs">
                    <div className="flex">
                      <span className="text-white/60 font-semibold w-20">Generated:</span>
                      <span className="text-white text-[11px] font-mono ml-1">
                        {hasHydrated ? new Date().toLocaleString() : 'Loading...'}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-white/60 font-semibold w-20">Environment:</span>
                      <span className="text-white text-[11px] font-mono ml-1">development</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Floating Action Buttons - Bottom Right */}
          <div className="absolute bottom-4 right-4 z-20">
            <div className="flex gap-2">
              <button
                onClick={generateSheet}
                disabled={isGenerating}
                className={`px-3 py-1.5 bg-white/[0.015] border border-white/[0.04] text-white/80 font-light text-[11px] rounded-lg shadow-lg backdrop-blur-sm hover:bg-white/[0.03] hover:ring-1 hover:ring-white/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-blue-400/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  keyPressed === 'r' ? 'ring-2 ring-blue-400/50 scale-[1.02]' : ''
                }`}
                title="Regenerate specification sheet (R)"
              >
                {isGenerating ? (
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 border border-white/60 border-t-transparent rounded-full animate-spin"></div>
                    Generating...
                  </span>
                ) : 'Regenerate'}
              </button>
              
              <button
                onClick={downloadSheet}
                disabled={isGenerating}
                className={`px-3 py-1.5 border font-light text-[11px] rounded-lg shadow-lg backdrop-blur-sm hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-blue-400/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  justDownloaded 
                    ? 'bg-green-500/20 border-green-400/40 text-green-300 ring-2 ring-green-400/50'
                    : 'bg-blue-500/10 border-blue-400/20 text-blue-300 hover:bg-blue-500/20 hover:ring-1 hover:ring-blue-400/30'
                } ${
                  keyPressed === 'd' ? 'ring-2 ring-blue-400/50 scale-[1.02]' : ''
                }`}
                title="Download as PNG image (D)"
              >
                {justDownloaded ? (
                  <span className="flex items-center gap-1">
                    <span className="text-green-400">✓</span>
                    Downloaded!
                  </span>
                ) : 'Download PNG'}
              </button>
              
              <button
                onClick={copyToClipboard}
                disabled={isGenerating}
                className={`px-3 py-1.5 border font-light text-[11px] rounded-lg shadow-lg backdrop-blur-sm hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] focus:ring-2 focus:ring-green-400/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  justCopied 
                    ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300 ring-2 ring-emerald-400/50'
                    : 'bg-green-500/10 border-green-400/20 text-green-300 hover:bg-green-500/20 hover:ring-1 hover:ring-green-400/30'
                } ${
                  keyPressed === 'c' ? 'ring-2 ring-green-400/50 scale-[1.02]' : ''
                }`}
                title="Copy image to clipboard (Ctrl+C)"
              >
                {justCopied ? (
                  <span className="flex items-center gap-1">
                    <span className="text-emerald-400">✓</span>
                    Copied!
                  </span>
                ) : 'Copy to Clipboard'}
              </button>
            </div>
          </div>

          {isGenerating && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-500/10 border border-blue-400/20 rounded-lg">
                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-blue-300 font-light text-sm animate-pulse">
                  Generating specification sheet...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Interactive Terminal */}
        <div className="mb-8 bg-black/20 border border-white/[0.04] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
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



        {/* Keyboard Shortcuts Indicator */}
        {keyPressed && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-black/80 text-white px-4 py-2 rounded-lg border border-white/20 shadow-xl backdrop-blur-sm">
              <div className="text-center">
                <div className="text-white/60 text-xs mb-1">Key Pressed</div>
                <div className="text-white font-bold text-lg">{keyPressed.toUpperCase()}</div>
              </div>
            </div>
          </div>
        )}

        {/* Debug Logs */}
        <div className="mt-8 p-3 bg-black/40 border border-white/[0.02] rounded text-[10px] font-mono hover:bg-black/50 transition-colors duration-300">
          <div className="text-white/30 mb-1">// debug logs</div>
          <div className="space-y-0.5 text-white/40">
            <div className="flex gap-2">
              <span className="text-green-400/60">[INFO]</span>
              <span>logo_inspector: template={hasHydrated ? (selectedTemplateId || "none") : "loading"} params={hasHydrated && selectedLogo ? Object.keys(selectedLogo?.parameters.custom || {}).length : 0}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-blue-400/60">[DATA]</span>
              <span>selected_logo_id={hasHydrated ? (selectedLogoId || "none") : "loading"} last_gen={hasHydrated ? (lastGenerated || "none") : "loading"}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-yellow-400/60">[OPTS]</span>
              <span>sheet_size={sheetOptions.logoSize} grid={sheetOptions.showGrid ? "on" : "off"} terminal={sheetOptions.terminalStyle ? "on" : "off"}</span>
            </div>
            <div className="flex gap-2">
              <span className="text-purple-400/60">[SECT]</span>
              <span>metadata={sheetOptions.sections.showMetadata ? "✓" : "✗"} params={sheetOptions.sections.showParameters ? "✓" : "✗"} env={sheetOptions.sections.showEnvironment ? "✓" : "✗"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}