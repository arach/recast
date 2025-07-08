/**
 * 🌊 Wave Bars
 * 
 * Audio bars that follow wave patterns with customizable color modes
 */

function draw(ctx, width, height, params, time, utils) {
  // Ensure all parameters are valid
  if (!params || !utils || !utils.params) {
    console.warn('Invalid parameters passed to wave-bars template');
    return;
  }
  
  // Ensure time is a valid number
  const safeTime = isFinite(time) ? time : 0;
  
  // Load and process all parameters - clean and deterministic
  const p = utils.params.load(params, ctx, width, height, safeTime, { parameters });
  
  // Check if viewport information is available for infinite rendering
  const viewport = params._viewport || {};
  const isInfinite = viewport && typeof viewport.offsetX === 'number' && typeof viewport.offsetY === 'number';
  
  // Calculate dimensions - either finite or infinite mode
  let barWidth, startBarIndex, visibleBarCount, worldOffsetX, worldOffsetY, safeZoom;
  
  if (isInfinite) {
    // INFINITE MODE: Calculate which bars are visible in current viewport + buffer
    const baseBarWidth = 20; // Base bar width for infinite mode
    safeZoom = Math.max(0.01, Math.min(10, viewport.zoom || 1)); // Clamp zoom to safe range
    barWidth = baseBarWidth * safeZoom; // Scale bar width with zoom
    const totalBarWidth = baseBarWidth + p.barSpacing; // Use base width for spacing calculations
    
    // Calculate world coordinates of viewport (account for zoom) with safety checks
    worldOffsetX = -viewport.offsetX / safeZoom;
    const worldOffsetY = -viewport.offsetY / safeZoom;
    const viewportWorldWidth = viewport.viewWidth / safeZoom;
    
    // Add buffer for smooth dragging - render extra content beyond viewport
    const bufferSize = 400; // 400px buffer on each side for smooth dragging
    const bufferedStartX = worldOffsetX - bufferSize;
    const bufferedWidth = viewportWorldWidth + (bufferSize * 2);
    
    // Calculate which bars are visible in the buffered area
    startBarIndex = Math.floor(bufferedStartX / totalBarWidth);
    visibleBarCount = Math.ceil(bufferedWidth / totalBarWidth) + 4; // +4 for extra safety margin
    
    console.log('🌊 Infinite wave rendering with buffer:', {
      worldOffsetX: worldOffsetX.toFixed(1),
      worldOffsetY: worldOffsetY.toFixed(1),
      bufferedStartX: bufferedStartX.toFixed(1),
      startBarIndex,
      visibleBarCount,
      bufferSize,
      zoom: viewport.zoom.toFixed(2)
    });
  } else {
    // FINITE MODE: Original behavior
    const totalSpacing = p.barSpacing * (p.barCount - 1);
    const availableWidth = width - totalSpacing;
    barWidth = availableWidth / p.barCount;
    startBarIndex = 0;
    visibleBarCount = p.barCount;
    worldOffsetX = 0;
    worldOffsetY = 0;
    safeZoom = 1; // Default zoom for finite mode
  }
  
  // Wave function based on type - now takes absolute position for infinite rendering
  const waveFunction = (barIndex) => {
    // Safety checks for parameters
    const safeFrequency = isFinite(p.frequency) ? p.frequency : 3;
    const safeAnimTime = isFinite(p.animTime) ? p.animTime : safeTime * 0.5;
    const safePhaseShift = isFinite(p.phaseShift) ? p.phaseShift : 0;
    const safeVisibleCount = isFinite(visibleBarCount) && visibleBarCount > 0 ? visibleBarCount : 1;
    
    // For infinite mode, use absolute bar index; for finite mode, normalize to 0-1
    const t = isInfinite ? barIndex * 0.01 : barIndex / safeVisibleCount; // 0.01 scales wave frequency for infinite
    const phase = (t * safeFrequency * Math.PI * 2) + safeAnimTime + safePhaseShift;
    
    // Ensure phase is finite
    if (!isFinite(phase)) {
      return 0;
    }
    
    switch (p.waveType) {
      case 'sine':
        return Math.sin(phase);
      case 'triangle':
        return 2 * Math.abs(2 * ((phase / (Math.PI * 2)) % 1 - 0.5)) - 1;
      case 'square':
        return Math.sin(phase) > 0 ? 1 : -1;
      case 'sawtooth':
        return 2 * ((phase / (Math.PI * 2)) % 1) - 1;
      default:
        return Math.sin(phase);
    }
  };
  
  // Draw wave path if enabled
  if (p.showWavePath) {
    ctx.save();
    ctx.globalAlpha = p.pathOpacity;
    ctx.strokeStyle = p.strokeColor;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    ctx.beginPath();
    for (let i = 0; i <= visibleBarCount; i++) {
      const barIndex = startBarIndex + i;
      const totalBarWidth = barWidth + p.barSpacing;
      
      // Calculate world position and convert to screen coordinates with safety checks
      const worldX = barIndex * totalBarWidth + barWidth / 2;
      const screenX = isInfinite ? (worldX * safeZoom) + viewport.offsetX : worldX;
      const baseY = height / 2 + waveFunction(barIndex) * p.amplitude;
      const y = isInfinite ? baseY + (worldOffsetY * safeZoom) : baseY;
      
      // Safety check for finite values
      if (!isFinite(screenX) || !isFinite(y) || isNaN(screenX) || isNaN(y)) {
        console.warn('Non-finite coordinates in wave path:', { screenX, y, barIndex });
        continue;
      }
      
      if (i === 0) {
        ctx.moveTo(screenX, y);
      } else {
        ctx.lineTo(screenX, y);
      }
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }
  
  // Draw bars
  for (let i = 0; i < visibleBarCount; i++) {
    const barIndex = startBarIndex + i;
    const totalBarWidth = barWidth + p.barSpacing;
    
    // Calculate world position and convert to screen coordinates with zoom
    const worldX = barIndex * totalBarWidth;
    const x = isInfinite ? (worldX * safeZoom) + viewport.offsetX : worldX;
    
    // Calculate wave position with Y-axis offset for infinite vertical scrolling
    const safeAmplitude = isFinite(p.amplitude) ? p.amplitude : 50;
    const waveValue = waveFunction(barIndex);
    const baseWaveY = height / 2 + (isFinite(waveValue) ? waveValue * safeAmplitude : 0);
    const safeWorldOffsetY = isFinite(worldOffsetY) ? worldOffsetY : 0;
    const waveY = isInfinite ? baseWaveY + (safeWorldOffsetY * safeZoom) : baseWaveY;
    
    // Calculate bar height with secondary animation
    const safeVisibleCount = isFinite(visibleBarCount) && visibleBarCount > 0 ? visibleBarCount : 1;
    const t = isInfinite ? barIndex * 0.01 : barIndex / safeVisibleCount;
    const safeFrequency = isFinite(p.frequency) ? p.frequency : 3;
    const safeAnimTime = isFinite(p.animTime) ? p.animTime : safeTime * 0.5;
    const heightPhase = (t * safeFrequency * 3 * Math.PI * 2) + safeAnimTime * 2;
    const barHeight = isFinite(heightPhase) ? Math.abs(Math.sin(heightPhase) * 40) + 20 : 20;
    
    // Safety check for finite values before drawing
    if (!isFinite(x) || !isFinite(waveY) || !isFinite(barHeight) || isNaN(x) || isNaN(waveY) || isNaN(barHeight)) {
      console.warn('Non-finite coordinates in bar rendering:', { x, waveY, barHeight, barIndex });
      continue;
    }
    
    // Create gradient based on color mode
    const gradient = ctx.createLinearGradient(x, waveY - barHeight/2, x, waveY + barHeight/2);
    
    if (p.colorMode === 'spectrum') {
      // For infinite mode, cycle through hues based on position; for finite mode, use normalized position
      const hue = isInfinite ? (barIndex * 10) % 360 : t * 360;
      gradient.addColorStop(0, `hsla(${hue}, 70%, 60%, 0.9)`);
      gradient.addColorStop(0.5, `hsla(${hue}, 80%, 50%, 1)`);
      gradient.addColorStop(1, `hsla(${hue}, 70%, 60%, 0.9)`);
    } else if (p.colorMode === 'theme') {
      const phase = t * Math.PI * 2;
      const lightness = 0.3 + Math.sin(phase + p.animTime) * 0.2;
      const adjustedColor = utils.color.adjustBrightness(p.fillColor, lightness);
      gradient.addColorStop(0, adjustedColor);
      gradient.addColorStop(0.5, p.fillColor);
      gradient.addColorStop(1, adjustedColor);
    } else if (p.colorMode === 'toneShift') {
      const hsl = utils.color.hexToHsl(p.fillColor);
      const hueShift = t * 120 - 60; // Shift ±60 degrees
      const hue = (hsl.h + hueShift + 360) % 360;
      gradient.addColorStop(0, `hsla(${hue}, ${hsl.s}%, ${Math.min(100, hsl.l + 10)}%, 0.9)`);
      gradient.addColorStop(0.5, `hsla(${hue}, ${hsl.s}%, ${hsl.l}%, 1)`);
      gradient.addColorStop(1, `hsla(${hue}, ${hsl.s}%, ${Math.min(100, hsl.l + 10)}%, 0.9)`);
    } else if (p.colorMode === 'mono') {
      gradient.addColorStop(0, utils.color.withAlpha(p.fillColor, 0.7));
      gradient.addColorStop(0.5, p.fillColor);
      gradient.addColorStop(1, utils.color.withAlpha(p.fillColor, 0.7));
    }
    
    // Draw bar
    ctx.save();
    ctx.globalAlpha = p.theme.fillOpacity;
    ctx.fillStyle = gradient;
    
    if (p.barStyle === 'rounded') {
      const radius = Math.min(barWidth / 3, 8);
      utils.canvas.fillRect(ctx, x, waveY - barHeight/2, barWidth, barHeight, radius);
    } else if (p.barStyle === 'sharp') {
      ctx.fillRect(x, waveY - barHeight/2, barWidth, barHeight);
    } else if (p.barStyle === 'circle') {
      // Bar with circular caps
      const radius = barWidth / 2;
      ctx.beginPath();
      ctx.moveTo(x + radius, waveY - barHeight/2);
      ctx.lineTo(x + radius, waveY + barHeight/2);
      ctx.arc(x + radius, waveY + barHeight/2, radius, 0, Math.PI);
      ctx.lineTo(x + radius, waveY - barHeight/2);
      ctx.arc(x + radius, waveY - barHeight/2, radius, Math.PI, Math.PI * 2);
      ctx.fill();
    }
    
    // Add decorative circles for tall bars
    if (barHeight > 25 && p.barStyle === 'rounded') {
      const circleRadius = barWidth / 2.5;
      utils.canvas.fillCircle(ctx, x + barWidth/2, waveY - barHeight/2 - 4, circleRadius);
      utils.canvas.fillCircle(ctx, x + barWidth/2, waveY + barHeight/2 + 4, circleRadius);
    }
    
    ctx.restore();
  }
  
  // Google Maps-style coordinate grid system for infinite mode
  if (isInfinite) {
    drawMapGrid(ctx, width, height, viewport, safeZoom);
  }
  
  // Helper function for Google Maps-style grid
  function drawMapGrid(ctx, width, height, viewport, safeZoom) {
    ctx.save();
    
    // Calculate grid spacing based on zoom level (like Google Maps)
    const baseGridSize = 100;
    const zoomLevel = Math.log2(safeZoom);
    const gridSize = baseGridSize * Math.pow(2, Math.floor(zoomLevel));
    const subGridSize = gridSize / 4; // Sub-grid for finer detail
    
    // Calculate world bounds
    const worldLeft = -viewport.offsetX / safeZoom;
    const worldTop = -viewport.offsetY / safeZoom;
    const worldRight = worldLeft + width / safeZoom;
    const worldBottom = worldTop + height / safeZoom;
    
    // Draw major grid lines (darker)
    ctx.strokeStyle = 'rgba(100, 150, 255, 0.3)';
    ctx.lineWidth = 1;
    
    const startGridX = Math.floor(worldLeft / gridSize) * gridSize;
    const endGridX = Math.ceil(worldRight / gridSize) * gridSize;
    const startGridY = Math.floor(worldTop / gridSize) * gridSize;
    const endGridY = Math.ceil(worldBottom / gridSize) * gridSize;
    
    // Vertical major grid lines
    for (let worldX = startGridX; worldX <= endGridX; worldX += gridSize) {
      const screenX = (worldX * safeZoom) + viewport.offsetX;
      if (screenX >= -1 && screenX <= width + 1) {
        ctx.beginPath();
        ctx.moveTo(screenX, 0);
        ctx.lineTo(screenX, height);
        ctx.stroke();
        
        // Grid coordinate labels
        if (safeZoom > 0.5) {
          ctx.fillStyle = worldX === 0 ? 'rgba(255, 100, 100, 0.8)' : 'rgba(100, 150, 255, 0.6)';
          ctx.font = `${Math.min(12, 8 + safeZoom * 2)}px monospace`;
          ctx.textAlign = 'center';
          ctx.fillText(`${worldX}`, screenX, 20);
        }
      }
    }
    
    // Horizontal major grid lines
    for (let worldY = startGridY; worldY <= endGridY; worldY += gridSize) {
      const screenY = (worldY * safeZoom) + viewport.offsetY;
      if (screenY >= -1 && screenY <= height + 1) {
        ctx.beginPath();
        ctx.moveTo(0, screenY);
        ctx.lineTo(width, screenY);
        ctx.stroke();
        
        // Grid coordinate labels
        if (safeZoom > 0.5) {
          ctx.fillStyle = worldY === 0 ? 'rgba(255, 100, 100, 0.8)' : 'rgba(100, 150, 255, 0.6)';
          ctx.font = `${Math.min(12, 8 + safeZoom * 2)}px monospace`;
          ctx.textAlign = 'left';
          ctx.fillText(`${worldY}`, 5, screenY - 5);
        }
      }
    }
    
    // Draw sub-grid lines (lighter) when zoomed in enough
    if (safeZoom > 1.0) {
      ctx.strokeStyle = 'rgba(100, 150, 255, 0.15)';
      ctx.lineWidth = 0.5;
      
      // Vertical sub-grid
      for (let worldX = startGridX; worldX <= endGridX; worldX += subGridSize) {
        if (worldX % gridSize !== 0) { // Skip major grid lines
          const screenX = (worldX * safeZoom) + viewport.offsetX;
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
          const screenY = (worldY * safeZoom) + viewport.offsetY;
          if (screenY >= -1 && screenY <= height + 1) {
            ctx.beginPath();
            ctx.moveTo(0, screenY);
            ctx.lineTo(width, screenY);
            ctx.stroke();
          }
        }
      }
    }
    
    // Origin marker (like Google Maps)
    const originScreenX = viewport.offsetX;
    const originScreenY = viewport.offsetY;
    if (originScreenX >= -20 && originScreenX <= width + 20 && 
        originScreenY >= -20 && originScreenY <= height + 20) {
      ctx.strokeStyle = 'rgba(255, 50, 50, 0.8)';
      ctx.fillStyle = 'rgba(255, 50, 50, 0.8)';
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
    
    // Mini-compass in top-right corner
    const compassSize = 40;
    const compassX = width - compassSize - 10;
    const compassY = 10 + compassSize / 2;
    
    ctx.save();
    ctx.translate(compassX, compassY);
    
    // Compass background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.arc(0, 0, compassSize / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Compass border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
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
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('N', 0, -compassSize / 2 + 5);
    
    ctx.restore();
    
    // Coordinate display (bottom-left) with safety checks
    const safeOffsetX = isFinite(viewport.offsetX) ? viewport.offsetX : 0;
    const safeOffsetY = isFinite(viewport.offsetY) ? viewport.offsetY : 0;
    const worldCenterX = (-safeOffsetX + width / 2) / safeZoom;
    const worldCenterY = (-safeOffsetY + height / 2) / safeZoom;
    
    // Additional safety checks for display values
    const displayCenterX = isFinite(worldCenterX) ? worldCenterX.toFixed(0) : '0';
    const displayCenterY = isFinite(worldCenterY) ? worldCenterY.toFixed(0) : '0';
    const displayZoom = isFinite(safeZoom) ? safeZoom.toFixed(2) : '1.00';
    const displayLevel = isFinite(safeZoom) && safeZoom > 0 ? Math.floor(Math.log2(safeZoom)) : 0;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, height - 55, 180, 45);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, height - 55, 180, 45);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = '11px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`Center: ${displayCenterX}, ${displayCenterY}`, 15, height - 40);
    ctx.fillText(`Zoom: ${displayZoom}x (Level ${displayLevel})`, 15, height - 25);
    ctx.fillText(`Grid: ${gridSize}px`, 15, height - 10);
    
    // Draw studio viewport boundary (original viewing area)
    const studioWidth = 400; // Typical studio canvas size
    const studioHeight = 400;
    const studioLeft = -studioWidth / 2;
    const studioTop = -studioHeight / 2;
    const studioRight = studioWidth / 2;
    const studioBottom = studioHeight / 2;
    
    // Safety check for viewport properties
    const safeViewportX = isFinite(viewport.offsetX) ? viewport.offsetX : 0;
    const safeViewportY = isFinite(viewport.offsetY) ? viewport.offsetY : 0;
    
    // Convert studio bounds to screen coordinates
    const studioScreenLeft = (studioLeft * safeZoom) + safeViewportX;
    const studioScreenTop = (studioTop * safeZoom) + safeViewportY;
    const studioScreenRight = (studioRight * safeZoom) + safeViewportX;
    const studioScreenBottom = (studioBottom * safeZoom) + safeViewportY;
    
    // Only draw if any part is visible
    if (studioScreenRight >= 0 && studioScreenLeft <= width && 
        studioScreenBottom >= 0 && studioScreenTop <= height) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 200, 100, 0.6)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 4]);
      ctx.lineDashOffset = -safeTime * 20;
      
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
      if (safeZoom > 0.3) {
        const labelX = Math.max(10, Math.min(width - 100, studioScreenLeft + 5));
        const labelY = Math.max(25, Math.min(height - 10, studioScreenTop + 15));
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(labelX, labelY - 12, 80, 16);
        ctx.fillStyle = 'rgba(255, 200, 100, 0.9)';
        ctx.font = '10px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('Studio View', labelX + 2, labelY);
      }
      
      ctx.restore();
    }
    
    ctx.restore();
  }
  
  // Debug info in dev mode with safety checks
  if (utils.debug) {
    utils.debug.log('Wave bars rendered', {
      barCount: isInfinite ? visibleBarCount : (p.barCount || 40),
      colorMode: p.colorMode || 'spectrum',
      waveType: p.waveType || 'sine',
      isInfinite,
      startBarIndex: isInfinite ? startBarIndex : 0,
      time: safeTime.toFixed(2)
    });
  }
  
  // Additional debug for finite mode with safety checks
  if (!isInfinite) {
    console.log('🌊 Finite wave rendering:', {
      barCount: p.barCount || 40,
      barWidth: isFinite(barWidth) ? barWidth.toFixed(1) : '20.0',
      visibleBarCount: visibleBarCount || 0,
      safeZoom: isFinite(safeZoom) ? safeZoom.toFixed(2) : '1.00',
      amplitude: p.amplitude || 50,
      centerY: height / 2
    });
  } else {
    console.log('🌊 Infinite wave rendering:', {
      worldOffsetX: isFinite(worldOffsetX) ? worldOffsetX.toFixed(1) : '0.0',
      worldOffsetY: isFinite(worldOffsetY) ? worldOffsetY.toFixed(1) : '0.0',
      startBarIndex,
      visibleBarCount,
      barWidth: isFinite(barWidth) ? barWidth.toFixed(1) : '20.0',
      amplitude: p.amplitude,
      viewport: {
        x: isFinite(viewport.offsetX) ? viewport.offsetX.toFixed(1) : '0.0',
        y: isFinite(viewport.offsetY) ? viewport.offsetY.toFixed(1) : '0.0',
        zoom: isFinite(viewport.zoom) ? viewport.zoom.toFixed(2) : '1.00'
      }
    });
  }
}

// Helper functions for concise parameter definitions
const slider = (def, min, max, step, label, unit, opts = {}) => ({ 
  type: "slider", default: def, min, max, step, label, unit, ...opts 
});
const select = (def, options, label, opts = {}) => ({ 
  type: "select", default: def, options, label, ...opts 
});
const toggle = (def, label, opts = {}) => ({ 
  type: "toggle", default: def, label, ...opts 
});

// Parameter definitions - controls and defaults
export const parameters = {
  barCount: slider(40, 20, 100, 5, "Number of Bars"),
  barSpacing: slider(2, 0, 10, 1, "Bar Spacing", "px"),
  frequency: slider(3, 0.1, 20, 0.1, "Wave Frequency"),
  amplitude: slider(50, 0, 100, 1, "Wave Amplitude", "%"),
  animationSpeed: slider(1, 0, 5, 0.1, "Animation Speed", "x"),
  phaseShift: slider(0, 0, 360, 1, "Phase Shift", "°", { when: { waveType: ["sine", "triangle"] } }),
  pathOpacity: slider(0.15, 0, 1, 0.05, "Path Opacity", null, { when: { showWavePath: true } }),
  
  colorMode: select("spectrum", [
    { value: "spectrum", label: "🌈 Rainbow Spectrum" },
    { value: "theme", label: "🎨 Theme Colors" },
    { value: "toneShift", label: "🎭 Tone Shift" },
    { value: "mono", label: "⚫ Monochrome" }
  ], "Color Mode"),
  
  barStyle: select("rounded", [
    { value: "rounded", label: "Rounded" },
    { value: "sharp", label: "Sharp" },
    { value: "circle", label: "Circular Caps" }
  ], "Bar Style"),
  
  waveType: select("sine", ["sine", "triangle", "square", "sawtooth"], "Wave Type"),
  showWavePath: toggle(false, "Show Wave Path"),
};

// Template metadata
export const metadata = {
  name: "🌊 Wave Bars",
  description: "Audio bars that follow wave patterns with customizable color modes",
  category: "animated",
  tags: ["wave", "bars", "audio", "animated", "colorful"],
  author: "ReFlow",
  version: "1.0.0"
};