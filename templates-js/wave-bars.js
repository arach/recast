/**
 * 🌊 Wave Bars
 * 
 * Audio bars that follow wave patterns with customizable color modes
 */

function draw(ctx, width, height, params, time, utils) {
  // Apply background
  utils.background.apply(ctx, width, height, params);
  
  // Extract parameters with defaults
  const barCount = params.barCount || 40;
  const barSpacing = params.barSpacing || 2;
  const colorMode = params.colorMode || 'spectrum';
  const frequency = params.frequency || 3;
  const amplitude = params.amplitude || 50;
  const animationSpeed = params.animationSpeed || 1;
  const barStyle = params.barStyle || 'rounded';
  const waveType = params.waveType || 'sine';
  const phaseShift = (params.phaseShift || 0) * Math.PI / 180;
  const showWavePath = params.showWavePath || false;
  const pathOpacity = params.pathOpacity || 0.15;
  
  // Theme colors
  const fillColor = params.fillColor || '#3b82f6';
  const strokeColor = params.strokeColor || '#1e40af';
  const fillOpacity = params.fillOpacity ?? 1;
  const strokeOpacity = params.strokeOpacity ?? 1;
  
  // Calculate dimensions
  const totalSpacing = barSpacing * (barCount - 1);
  const availableWidth = width - totalSpacing;
  const barWidth = availableWidth / barCount;
  
  // Time with animation speed
  const animTime = time * animationSpeed;
  
  // Wave function based on type
  const waveFunction = (t) => {
    const phase = (t * frequency * Math.PI * 2) + animTime + phaseShift;
    switch (waveType) {
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
  if (showWavePath) {
    ctx.save();
    ctx.globalAlpha = pathOpacity;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    ctx.beginPath();
    for (let i = 0; i <= barCount; i++) {
      const t = i / barCount;
      const x = i * (barWidth + barSpacing) + barWidth / 2;
      const y = height / 2 + waveFunction(t) * amplitude;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }
  
  // Draw bars
  for (let i = 0; i < barCount; i++) {
    const t = i / barCount;
    const x = i * (barWidth + barSpacing);
    
    // Calculate wave position
    const waveY = height / 2 + waveFunction(t) * amplitude;
    
    // Calculate bar height with secondary animation
    const heightPhase = (t * frequency * 3 * Math.PI * 2) + animTime * 2;
    const barHeight = Math.abs(Math.sin(heightPhase) * 40) + 20;
    
    // Create gradient based on color mode
    const gradient = ctx.createLinearGradient(x, waveY - barHeight/2, x, waveY + barHeight/2);
    
    if (colorMode === 'spectrum') {
      const hue = t * 360;
      gradient.addColorStop(0, `hsla(${hue}, 70%, 60%, 0.9)`);
      gradient.addColorStop(0.5, `hsla(${hue}, 80%, 50%, 1)`);
      gradient.addColorStop(1, `hsla(${hue}, 70%, 60%, 0.9)`);
    } else if (colorMode === 'theme') {
      const phase = t * Math.PI * 2;
      const lightness = 0.3 + Math.sin(phase + animTime) * 0.2;
      const adjustedColor = utils.color.adjustBrightness(fillColor, lightness);
      gradient.addColorStop(0, adjustedColor);
      gradient.addColorStop(0.5, fillColor);
      gradient.addColorStop(1, adjustedColor);
    } else if (colorMode === 'toneShift') {
      const hsl = utils.color.hexToHsl(fillColor);
      const hueShift = t * 120 - 60; // Shift ±60 degrees
      const hue = (hsl.h + hueShift + 360) % 360;
      gradient.addColorStop(0, `hsla(${hue}, ${hsl.s}%, ${Math.min(100, hsl.l + 10)}%, 0.9)`);
      gradient.addColorStop(0.5, `hsla(${hue}, ${hsl.s}%, ${hsl.l}%, 1)`);
      gradient.addColorStop(1, `hsla(${hue}, ${hsl.s}%, ${Math.min(100, hsl.l + 10)}%, 0.9)`);
    } else if (colorMode === 'mono') {
      gradient.addColorStop(0, utils.color.withAlpha(fillColor, 0.7));
      gradient.addColorStop(0.5, fillColor);
      gradient.addColorStop(1, utils.color.withAlpha(fillColor, 0.7));
    }
    
    // Draw bar
    ctx.save();
    ctx.globalAlpha = fillOpacity;
    ctx.fillStyle = gradient;
    
    if (barStyle === 'rounded') {
      const radius = Math.min(barWidth / 3, 8);
      utils.canvas.fillRect(ctx, x, waveY - barHeight/2, barWidth, barHeight, radius);
    } else if (barStyle === 'sharp') {
      ctx.fillRect(x, waveY - barHeight/2, barWidth, barHeight);
    } else if (barStyle === 'circle') {
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
    if (barHeight > 25 && barStyle === 'rounded') {
      const circleRadius = barWidth / 2.5;
      utils.canvas.fillCircle(ctx, x + barWidth/2, waveY - barHeight/2 - 4, circleRadius);
      utils.canvas.fillCircle(ctx, x + barWidth/2, waveY + barHeight/2 + 4, circleRadius);
    }
    
    ctx.restore();
  }
  
  // Debug info in dev mode
  if (utils.debug) {
    utils.debug.log('Wave bars rendered', {
      barCount,
      colorMode,
      waveType,
      time: time.toFixed(2)
    });
  }
}