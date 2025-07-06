/**
 * 🔤 Letter Mark
 * 
 * Clean, professional letter-based logos perfect for modern brands
 * Exact line-by-line conversion from TypeScript original
 */

function draw(ctx, width, height, params, time, utils) {
  // Debug logging to see what's actually happening
  console.log('=== LETTER-MARK DEBUG ===');
  console.log('Canvas size:', width, 'x', height);
  console.log('Parameters received:', params);
  console.log('Letter param:', params.letter);
  console.log('FillColor param:', params.fillColor);
  console.log('Style param:', params.style);
  console.log('Utils available:', Object.keys(utils));
  
  // Apply universal background - exact match to TypeScript version
  utils.background.apply(ctx, width, height, params);
  
  // Get theme colors - exact match to TypeScript version
  const fillColor = params.fillColor || '#000000';
  const strokeColor = params.strokeColor || '#000000';
  const backgroundColor = params.backgroundColor || '#ffffff';
  const fillOpacity = params.fillOpacity ?? 1;
  const strokeOpacity = params.strokeOpacity ?? 1;
  
  // Extract parameters - exact match to TypeScript version
  const letter = params.letter || 'A';
  const fontWeight = params.fontWeight || '600';
  const style = params.style || 'modern';
  const alignment = params.alignment || 'center';
  const size = params.size || 0.7;
  const letterSpacing = params.letterSpacing || 0;
  const container = params.container || 'none';
  const containerPadding = params.containerPadding || 0.2;
  
  // Calculate dimensions - exact match to TypeScript version
  const minDim = Math.min(width, height);
  const fontSize = minDim * size;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Set up font - exact match to TypeScript version
  let fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  if (style === 'rounded') {
    fontFamily = '"SF Pro Rounded", -apple-system, BlinkMacSystemFont, sans-serif';
  } else if (style === 'geometric') {
    fontFamily = 'Futura, "Century Gothic", sans-serif';
  } else if (style === 'classic') {
    fontFamily = 'Georgia, "Times New Roman", serif';
  }
  
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.textAlign = alignment;
  ctx.textBaseline = 'middle';
  
  // Apply letter spacing - exact match to TypeScript version
  if (letterSpacing !== 0 && letter.length > 1) {
    ctx.letterSpacing = `${letterSpacing}em`;
  }
  
  // Calculate text position - exact match to TypeScript version
  let textX = centerX;
  if (alignment === 'left') textX = width * 0.1;
  else if (alignment === 'right') textX = width * 0.9;
  
  // Draw container if specified - exact match to TypeScript version
  if (container !== 'none') {
    const metrics = ctx.measureText(letter);
    const textWidth = metrics.width;
    const textHeight = fontSize;
    const padding = minDim * containerPadding;
    
    ctx.save();
    ctx.globalAlpha = fillOpacity;
    ctx.fillStyle = fillColor;
    
    if (container === 'circle') {
      const radius = Math.max(textWidth, textHeight) / 2 + padding;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Invert text color for contrast
      ctx.fillStyle = backgroundColor;
    } else if (container === 'square' || container === 'rounded') {
      const boxSize = Math.max(textWidth, textHeight) + padding * 2;
      const boxX = centerX - boxSize / 2;
      const boxY = centerY - boxSize / 2;
      
      ctx.beginPath();
      if (container === 'rounded') {
        const radius = boxSize * 0.1;
        ctx.roundRect(boxX, boxY, boxSize, boxSize, radius);
      } else {
        ctx.rect(boxX, boxY, boxSize, boxSize);
      }
      ctx.fill();
      
      // Invert text color for contrast
      ctx.fillStyle = backgroundColor;
    }
    ctx.restore();
  } else {
    // No container, use fill color for text
    ctx.fillStyle = fillColor;
  }
  
  // Draw the letter(s) - exact match to TypeScript version
  ctx.save();
  ctx.globalAlpha = fillOpacity;
  ctx.fillText(letter, textX, centerY);
  ctx.restore();
  
  // Optional: Add subtle depth with stroke - exact match to TypeScript version
  if (params.strokeWidth && params.strokeWidth > 0) {
    ctx.save();
    ctx.globalAlpha = strokeOpacity;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = params.strokeWidth;
    ctx.strokeText(letter, textX, centerY);
    ctx.restore();
  }
}