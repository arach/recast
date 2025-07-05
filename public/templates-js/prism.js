function draw(ctx, width, height, params, time, utils) {
  // Apply universal background
  utils.background.apply(ctx, width, height, params);
  
  // Get parameters with defaults
  const faces = params.faces || 6;
  const size = params.size || 120;
  const depth = params.depth || 60;
  const rotationSpeed = params.rotationSpeed || 0.5;
  const colorScheme = params.colorScheme || 'rainbow';
  const lightness = params.lightness || 0.8;
  
  // Calculate center and rotation
  const centerX = width / 2;
  const centerY = height / 2;
  const rotation = time * rotationSpeed;
  
  // Save context
  ctx.save();
  
  // Move to center and rotate
  ctx.translate(centerX, centerY);
  ctx.rotate(rotation);
  
  // Draw prism faces
  for (let i = 0; i < faces; i++) {
    const angle = (i / faces) * Math.PI * 2;
    const nextAngle = ((i + 1) / faces) * Math.PI * 2;
    
    // Calculate face vertices
    const x1 = Math.cos(angle) * size;
    const y1 = Math.sin(angle) * size;
    const x2 = Math.cos(nextAngle) * size;
    const y2 = Math.sin(nextAngle) * size;
    
    // Get face color
    let faceColor;
    if (colorScheme === 'rainbow') {
      const hue = (i / faces) * 360;
      faceColor = `hsl(${hue}, 70%, ${lightness * 100}%)`;
    } else if (colorScheme === 'monochrome') {
      const gray = 50 + (i / faces) * 50;
      faceColor = `hsl(0, 0%, ${gray}%)`;
    } else {
      // Use fill color with variations
      const baseColor = params.fillColor || '#3b82f6';
      const variation = (i / faces) * 0.3;
      faceColor = utils.color.adjustBrightness(baseColor, variation);
    }
    
    // Draw top face
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    ctx.fillStyle = faceColor;
    ctx.fill();
    
    // Draw side face (3D effect)
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 + depth * 0.5, y1 + depth * 0.3);
    ctx.lineTo(x2 + depth * 0.5, y2 + depth * 0.3);
    ctx.lineTo(x2, y2);
    ctx.closePath();
    
    // Darker color for side face
    ctx.fillStyle = utils.color.adjustBrightness(faceColor, -0.3);
    ctx.fill();
    
    // Stroke if enabled
    if (params.strokeWidth > 0) {
      ctx.strokeStyle = params.strokeColor || '#000000';
      ctx.lineWidth = params.strokeWidth;
      ctx.stroke();
    }
  }
  
  ctx.restore();
}