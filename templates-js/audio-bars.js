/**
 * 🎵 Audio Bars
 * 
 * Dynamic audio visualizer bars with customizable color modes
 * Exact conversion from TypeScript original
 */

function draw(ctx, width, height, params, time, utils) {
  // Apply universal background - exact match to TypeScript version
  utils.background.apply(ctx, width, height, params);
  
  // Theme colors - exact match to TypeScript version
  const fillColor = params.fillColor || '#3b82f6';
  const strokeColor = params.strokeColor || '#1e40af';
  const colorMode = params.colorMode || 'spectrum';
  const fillOpacity = params.fillOpacity ?? 1;
  const strokeOpacity = params.strokeOpacity ?? 1;
  
  // Calculate dimensions - exact match to TypeScript version
  const barWidth = (width - params.barSpacing * (params.barCount - 1)) / params.barCount;
  const centerY = height / 2;

  for (let i = 0; i < params.barCount; i++) {
    const x = i * (barWidth + params.barSpacing);
    const t = i / params.barCount;
    
    // Generate wave-based bar heights using the parameters - exact match to TypeScript version
    const waveY = Math.sin((t * params.frequency * Math.PI * 2) + time) * params.amplitude;
    const harmonics = Math.sin((t * params.frequency * 3 * Math.PI * 2) + time * 2) * params.amplitude * params.complexity;
    const chaos = (Math.random() - 0.5) * params.chaos * params.amplitude;
    const dampedValue = waveY + harmonics + chaos;
    const barHeight = Math.abs(dampedValue) + 10;
    
    // Create gradient based on color mode - exact match to TypeScript version
    const gradient = ctx.createLinearGradient(x, centerY - barHeight/2, x, centerY + barHeight/2);
    
    if (colorMode === 'spectrum') {
      // Original rainbow spectrum - exact match to TypeScript version
      const hue = (i / params.barCount) * 360;
      gradient.addColorStop(0, `hsla(${hue}, 70%, 60%, 0.9)`);
      gradient.addColorStop(0.5, `hsla(${hue}, 80%, 50%, 1)`);
      gradient.addColorStop(1, `hsla(${hue}, 70%, 60%, 0.9)`);
    } else if (colorMode === 'theme') {
      // Use theme colors with intensity variations based on bar height - exact match to TypeScript version
      const intensity = barHeight / (params.amplitude * 2);
      const lightness = 0.2 + intensity * 0.3;
      // Use theme colors with intensity variations based on bar height - exact match to TypeScript version
      gradient.addColorStop(0, utils.adjustColor(fillColor, lightness + 0.2));
      gradient.addColorStop(0.5, fillColor);
      gradient.addColorStop(1, utils.adjustColor(fillColor, lightness + 0.2));
    } else if (colorMode === 'toneShift') {
      // Shift hue based on theme color - exact match to TypeScript version  
      const [baseHue, baseSat, baseLum] = utils.hexToHsl(fillColor);
      const hueShift = (i / params.barCount) * 180 - 90; // Shift ±90 degrees
      const hue = (baseHue + hueShift + 360) % 360;
      gradient.addColorStop(0, `hsla(${hue}, ${baseSat}%, ${baseLum + 10}%, 0.9)`);
      gradient.addColorStop(0.5, `hsla(${hue}, ${baseSat}%, ${baseLum}%, 1)`);
      gradient.addColorStop(1, `hsla(${hue}, ${baseSat}%, ${baseLum + 10}%, 0.9)`);
    }
    
    // Apply fill opacity if there's a fill - exact match to TypeScript version
    if (params.fillType !== 'none' && fillOpacity < 1) {
      ctx.save();
      ctx.globalAlpha = fillOpacity;
    }
    
    ctx.fillStyle = gradient;
    
    // Draw rounded rectangles - exact match to TypeScript version
    const radius = barWidth / 3;
    ctx.beginPath();
    ctx.roundRect(x, centerY - barHeight/2, barWidth, barHeight, radius);
    ctx.fill();
    
    // Add small dots at the ends - exact match to TypeScript version
    if (barHeight > 20) {
      ctx.beginPath();
      ctx.arc(x + barWidth/2, centerY - barHeight/2 - 5, barWidth/2.5, 0, Math.PI * 2);
      ctx.arc(x + barWidth/2, centerY + barHeight/2 + 5, barWidth/2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Restore opacity if it was changed - exact match to TypeScript version
    if (params.fillType !== 'none' && fillOpacity < 1) {
      ctx.restore();
    }
    
    // Apply stroke if enabled - exact match to TypeScript version
    if (params.strokeType !== 'none') {
      ctx.save();
      ctx.globalAlpha = strokeOpacity;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = params.strokeWidth || 2;
      
      // Set stroke dash pattern
      if (params.strokeType === 'dashed') {
        ctx.setLineDash([5, 5]);
      } else if (params.strokeType === 'dotted') {
        ctx.setLineDash([2, 3]);
      }
      
      // Stroke the rounded rectangle
      ctx.beginPath();
      ctx.roundRect(x, centerY - barHeight/2, barWidth, barHeight, radius);
      ctx.stroke();
      
      // Stroke the dots if present
      if (barHeight > 20) {
        ctx.beginPath();
        ctx.arc(x + barWidth/2, centerY - barHeight/2 - 5, barWidth/2.5, 0, Math.PI * 2);
        ctx.arc(x + barWidth/2, centerY + barHeight/2 + 5, barWidth/2.5, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      ctx.restore();
    }
  }
}