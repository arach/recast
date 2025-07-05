function draw(ctx, width, height, params, time, utils) {
  // Apply universal background
  utils.background.apply(ctx, width, height, params);
  
  // Get parameters with defaults
  const barCount = params.barCount || 24;
  const animationSpeed = params.animationSpeed || 2.0;
  const maxHeight = params.maxHeight || 0.9;
  const barSpacing = params.barSpacing || 0.1;
  const cornerRadius = params.cornerRadius || 3;
  
  // Calculate bar dimensions
  const totalWidth = width * 0.8; // Leave some margin
  const startX = (width - totalWidth) / 2;
  const barWidth = (totalWidth - (barCount - 1) * barSpacing * totalWidth / barCount) / barCount;
  
  // Draw bars
  for (let i = 0; i < barCount; i++) {
    const x = startX + i * (barWidth + barSpacing * totalWidth / barCount);
    
    // Generate audio-like random heights with some coherence
    const seed1 = Math.sin(time * animationSpeed + i * 0.5) * 0.7;
    const seed2 = Math.sin(time * animationSpeed * 1.3 + i * 0.3) * 0.3;
    const randomHeight = Math.abs(seed1 + seed2);
    const barHeight = randomHeight * maxHeight * height;
    
    const y = height - barHeight;
    
    // Color based on height (like audio visualization)
    let barColor;
    const intensity = randomHeight;
    if (intensity > 0.7) {
      barColor = '#ff4444'; // Red for high
    } else if (intensity > 0.4) {
      barColor = '#ffaa00'; // Orange for medium
    } else {
      barColor = '#44ff44'; // Green for low
    }
    
    // Override with fill color if specified
    if (params.fillColor && params.useCustomColor) {
      barColor = params.fillColor;
    }
    
    // Draw rounded rectangle
    ctx.fillStyle = barColor;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barHeight, [cornerRadius, cornerRadius, 0, 0]);
    ctx.fill();
    
    // Add glow effect
    if (params.glowEffect) {
      ctx.shadowColor = barColor;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, [cornerRadius, cornerRadius, 0, 0]);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    
    // Add stroke if enabled
    if (params.strokeWidth > 0) {
      ctx.strokeStyle = params.strokeColor || '#000000';
      ctx.lineWidth = params.strokeWidth;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, [cornerRadius, cornerRadius, 0, 0]);
      ctx.stroke();
    }
  }
}