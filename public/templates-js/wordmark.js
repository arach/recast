function draw(ctx, width, height, params, time, utils) {
  // Apply universal background
  utils.background.apply(ctx, width, height, params);
  
  // Get parameters with defaults
  const text = params.text || 'BRAND';
  const fontSize = params.fontSize || 48;
  const fontFamily = params.fontFamily || 'Arial Black';
  const letterSpacing = params.letterSpacing || 0;
  const animationType = params.animationType || 'none';
  const animationSpeed = params.animationSpeed || 1.0;
  
  // Set font
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Calculate text position
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Apply animations
  ctx.save();
  
  if (animationType === 'wave') {
    // Draw each letter with wave effect
    const letters = text.split('');
    const totalWidth = ctx.measureText(text).width + letterSpacing * (letters.length - 1);
    let currentX = centerX - totalWidth / 2;
    
    letters.forEach((letter, i) => {
      ctx.save();
      
      const letterWidth = ctx.measureText(letter).width;
      const letterCenterX = currentX + letterWidth / 2;
      
      // Wave animation
      const waveOffset = Math.sin(time * animationSpeed + i * 0.5) * 10;
      
      ctx.translate(letterCenterX, centerY + waveOffset);
      
      // Set fill color
      ctx.fillStyle = params.fillColor || '#000000';
      ctx.fillText(letter, 0, 0);
      
      // Add stroke if enabled
      if (params.strokeWidth > 0) {
        ctx.strokeStyle = params.strokeColor || '#ffffff';
        ctx.lineWidth = params.strokeWidth;
        ctx.strokeText(letter, 0, 0);
      }
      
      ctx.restore();
      currentX += letterWidth + letterSpacing;
    });
  } else if (animationType === 'scale') {
    // Pulsing scale animation
    const scale = 1 + Math.sin(time * animationSpeed) * 0.1;
    ctx.translate(centerX, centerY);
    ctx.scale(scale, scale);
    
    // Set fill color
    ctx.fillStyle = params.fillColor || '#000000';
    ctx.fillText(text, 0, 0);
    
    // Add stroke if enabled
    if (params.strokeWidth > 0) {
      ctx.strokeStyle = params.strokeColor || '#ffffff';
      ctx.lineWidth = params.strokeWidth;
      ctx.strokeText(text, 0, 0);
    }
  } else {
    // Static text
    ctx.translate(centerX, centerY);
    
    // Set fill color
    ctx.fillStyle = params.fillColor || '#000000';
    ctx.fillText(text, 0, 0);
    
    // Add stroke if enabled
    if (params.strokeWidth > 0) {
      ctx.strokeStyle = params.strokeColor || '#ffffff';
      ctx.lineWidth = params.strokeWidth;
      ctx.strokeText(text, 0, 0);
    }
  }
  
  ctx.restore();
}