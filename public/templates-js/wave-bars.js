function draw(ctx, width, height, params, time, utils) {
  // Apply universal background
  utils.background.apply(ctx, width, height, params);
  
  // Get parameters with defaults
  const barCount = params.barCount || 40;
  const barSpacing = params.barSpacing || 2;
  const colorMode = params.colorMode || 'spectrum';
  const frequency = params.frequency || 3;
  const amplitude = params.amplitude || 50;
  const fillColor = params.fillColor || '#3b82f6';
  const strokeColor = params.strokeColor || '#1e40af';
  const fillOpacity = params.fillOpacity ?? 1;
  const strokeOpacity = params.strokeOpacity ?? 1;
  
  // Calculate bar dimensions
  const barWidth = (width - barSpacing * (barCount - 1)) / barCount;
  
  // Draw bars with wave motion
  for (let i = 0; i < barCount; i++) {
    const x = i * (barWidth + barSpacing);
    const t = i / barCount;
    const waveY = height / 2 + Math.sin((t * frequency * Math.PI * 2) + time) * amplitude;
    
    const barHeight = Math.abs(Math.sin((t * frequency * 3 * Math.PI * 2) + time * 2) * 40) + 20;
    const gradient = ctx.createLinearGradient(x, waveY - barHeight/2, x, waveY + barHeight/2);
    
    if (colorMode === 'spectrum') {
      const hue = (i / barCount) * 360;
      gradient.addColorStop(0, `hsla(${hue}, 70%, 60%, 0.9)`);
      gradient.addColorStop(0.5, `hsla(${hue}, 80%, 50%, 1)`);
      gradient.addColorStop(1, `hsla(${hue}, 70%, 60%, 0.9)`);
    } else if (colorMode === 'theme') {
      const phase = (i / barCount) * Math.PI * 2;
      const lightness = 0.3 + Math.sin(phase + time) * 0.2;
      gradient.addColorStop(0, utils.color.adjustBrightness(fillColor, lightness));
      gradient.addColorStop(0.5, fillColor);
      gradient.addColorStop(1, utils.color.adjustBrightness(fillColor, lightness));
    } else if (colorMode === 'toneShift') {
      const hsl = utils.color.hexToHsl(fillColor);
      const hueShift = (i / barCount) * 120 - 60; // Shift ±60 degrees
      const hue = (hsl.h + hueShift + 360) % 360;
      gradient.addColorStop(0, `hsla(${hue}, ${hsl.s}%, ${hsl.l + 10}%, 0.9)`);
      gradient.addColorStop(0.5, `hsla(${hue}, ${hsl.s}%, ${hsl.l}%, 1)`);
      gradient.addColorStop(1, `hsla(${hue}, ${hsl.s}%, ${hsl.l + 10}%, 0.9)`);
    }
    
    ctx.save();
    ctx.globalAlpha = fillOpacity;
    ctx.fillStyle = gradient;
    
    const radius = barWidth / 3;
    ctx.beginPath();
    ctx.roundRect(x, waveY - barHeight/2, barWidth, barHeight, radius);
    ctx.fill();
    
    // Add decorative circles for taller bars
    if (barHeight > 25) {
      ctx.beginPath();
      ctx.arc(x + barWidth/2, waveY - barHeight/2 - 4, barWidth/2.5, 0, Math.PI * 2);
      ctx.arc(x + barWidth/2, waveY + barHeight/2 + 4, barWidth/2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }
  
  // Draw connecting wave line
  ctx.save();
  ctx.globalAlpha = strokeOpacity * 0.15;
  ctx.beginPath();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  for (let i = 0; i < barCount; i++) {
    const x = i * (barWidth + barSpacing);
    const t = i / barCount;
    const y = height / 2 + Math.sin((t * frequency * Math.PI * 2) + time) * amplitude;
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