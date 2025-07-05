/**
 * 📝 Wordmark
 * 
 * Professional text-based logos with customizable typography and optional frames
 */

function draw(ctx, width, height, params, time, utils) {
  // Apply background
  utils.applyUniversalBackground(ctx, width, height, params);
  
  // Extract parameters with defaults
  const text = params.text || 'BRAND';
  const fontStyle = params.fontStyle || 'modern';
  const fontWeight = params.fontWeight || '500';
  const letterSpacing = params.letterSpacing || 0.05;
  const size = params.size || 0.5;
  const lineHeight = params.lineHeight || 1.2;
  const textTransform = params.textTransform || 'uppercase';
  const underline = params.underline || false;
  const underlineWeight = params.underlineWeight || 3;
  const underlineOffset = params.underlineOffset || 5;
  
  // Frame parameters
  const showFrame = params.showFrame || false;
  const frameStyle = params.frameStyle || 'outline';
  const frameStrokeStyle = params.frameStrokeStyle || 'solid';
  const frameStrokeWidth = params.frameStrokeWidth || 3;
  const framePadding = params.framePadding || 40;
  const frameRadius = params.frameRadius || 0;
  
  // Animation parameters
  const textAnimation = params.textAnimation || 'none';
  const animationSpeed = params.animationSpeed || 1;
  const animationIntensity = params.animationIntensity || 0.5;
  
  // Theme colors
  const fillColor = params.fillColor || '#000000';
  const strokeColor = params.strokeColor || '#000000';
  const fillOpacity = params.fillOpacity ?? 1;
  const strokeOpacity = params.strokeOpacity ?? 1;
  
  // Helper function to draw rounded rectangle
  function drawRoundedRect(ctx, x, y, width, height, radius) {
    if (radius === 0) {
      ctx.rect(x, y, width, height);
    } else {
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
    }
  }
  
  // Apply text transform
  function applyTextTransform(text, transform) {
    switch (transform) {
      case 'uppercase':
        return text.toUpperCase();
      case 'lowercase':
        return text.toLowerCase();
      case 'capitalize':
        return text.split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
      default:
        return text;
    }
  }
  
  const displayText = applyTextTransform(text, textTransform);
  
  // Calculate dimensions
  const minDim = Math.min(width, height);
  const fontSize = minDim * size * 0.2;
  
  // Set up font
  let fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  switch (fontStyle) {
    case 'tech':
      fontFamily = '"SF Mono", Monaco, "Courier New", monospace';
      break;
    case 'elegant':
      fontFamily = '"Playfair Display", Georgia, serif';
      break;
    case 'bold':
      fontFamily = '"Arial Black", "Helvetica Neue", sans-serif';
      break;
    case 'minimal':
      fontFamily = 'Helvetica, Arial, sans-serif';
      break;
    case 'silkscreen':
      fontFamily = 'Silkscreen, monospace';
      break;
    case 'orbitron':
      fontFamily = 'Orbitron, sans-serif';
      break;
    case 'doto':
      fontFamily = '"DotGothic16", monospace';
      break;
    case 'custom':
      fontFamily = params.customFont || fontFamily;
      break;
  }
  
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Split text into lines
  const lines = displayText.split('\n');
  const totalHeight = lines.length * fontSize * lineHeight;
  const startY = height / 2 - totalHeight / 2 + fontSize / 2;
  
  // Calculate animation offsets
  const animTime = time * animationSpeed;
  let animOffsetX = 0;
  let animOffsetY = 0;
  let animRotation = 0;
  let animScale = 1;
  
  switch (textAnimation) {
    case 'float':
      animOffsetY = Math.sin(animTime) * 10 * animationIntensity;
      break;
    case 'wave':
      // Applied per character
      break;
    case 'pulse':
      animScale = 1 + Math.sin(animTime * 2) * 0.1 * animationIntensity;
      break;
    case 'rotate':
      animRotation = Math.sin(animTime) * 0.1 * animationIntensity;
      break;
    case 'shake':
      animOffsetX = (Math.random() - 0.5) * 5 * animationIntensity;
      animOffsetY = (Math.random() - 0.5) * 5 * animationIntensity;
      break;
  }
  
  // Draw frame if enabled
  if (showFrame) {
    ctx.save();
    
    // Pre-calculate text bounds
    let maxWidth = 0;
    lines.forEach(line => {
      const metrics = ctx.measureText(line);
      maxWidth = Math.max(maxWidth, metrics.width);
    });
    
    // Add letter spacing to width calculation
    if (letterSpacing > 0) {
      maxWidth += (Math.max(...lines.map(l => l.length)) - 1) * fontSize * letterSpacing;
    }
    
    // Calculate frame dimensions
    const frameX = width / 2 - maxWidth / 2 - framePadding;
    const frameY = startY - fontSize / 2 - framePadding;
    const frameWidth = maxWidth + framePadding * 2;
    const frameHeight = totalHeight + framePadding * 2;
    
    // Apply frame animation
    ctx.translate(width / 2 + animOffsetX, height / 2 + animOffsetY);
    ctx.rotate(animRotation);
    ctx.scale(animScale, animScale);
    ctx.translate(-width / 2, -height / 2);
    
    // Draw based on frame style
    if (frameStyle === 'filled' || frameStyle === 'filled-inverse') {
      ctx.globalAlpha = fillOpacity;
      ctx.fillStyle = frameStyle === 'filled' ? strokeColor : fillColor;
      ctx.beginPath();
      drawRoundedRect(ctx, frameX, frameY, frameWidth, frameHeight, frameRadius);
      ctx.fill();
    } else {
      ctx.globalAlpha = strokeOpacity;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = frameStrokeWidth;
      
      switch (frameStrokeStyle) {
        case 'dashed':
          ctx.setLineDash([frameStrokeWidth * 3, frameStrokeWidth * 2]);
          break;
        case 'dotted':
          ctx.setLineDash([frameStrokeWidth, frameStrokeWidth * 1.5]);
          break;
        case 'double':
          const gap = frameStrokeWidth * 1.5;
          ctx.beginPath();
          drawRoundedRect(ctx, frameX - gap, frameY - gap, frameWidth + gap * 2, frameHeight + gap * 2, frameRadius);
          ctx.stroke();
          ctx.beginPath();
          drawRoundedRect(ctx, frameX, frameY, frameWidth, frameHeight, frameRadius);
          ctx.stroke();
          break;
        default:
          ctx.beginPath();
          drawRoundedRect(ctx, frameX, frameY, frameWidth, frameHeight, frameRadius);
          ctx.stroke();
      }
      
      ctx.setLineDash([]);
    }
    
    ctx.restore();
  }
  
  // Draw text with animations
  ctx.save();
  
  // Apply global text animation transforms
  if (textAnimation !== 'wave' && textAnimation !== 'none') {
    ctx.translate(width / 2 + animOffsetX, height / 2 + animOffsetY);
    ctx.rotate(animRotation);
    ctx.scale(animScale, animScale);
    ctx.translate(-width / 2, -height / 2);
  }
  
  // Draw each line
  lines.forEach((line, lineIndex) => {
    const y = startY + lineIndex * fontSize * lineHeight;
    
    ctx.save();
    ctx.globalAlpha = fillOpacity;
    
    // Apply letter spacing and per-character animations
    if (letterSpacing > 0 || textAnimation === 'wave') {
      const chars = line.split('');
      const metrics = ctx.measureText(line);
      const totalWidth = metrics.width + (chars.length - 1) * fontSize * letterSpacing;
      let x = width / 2 - totalWidth / 2;
      
      ctx.textAlign = 'left';
      chars.forEach((char, charIndex) => {
        let charY = y;
        let charX = x;
        
        if (textAnimation === 'wave') {
          const wavePhase = (charIndex / chars.length) * Math.PI * 2;
          charY += Math.sin(animTime * 3 + wavePhase) * 10 * animationIntensity;
        }
        
        ctx.fillStyle = (showFrame && frameStyle === 'filled-inverse') ? strokeColor : fillColor;
        ctx.fillText(char, charX, charY);
        x += ctx.measureText(char).width + fontSize * letterSpacing;
      });
      ctx.textAlign = 'center';
    } else {
      ctx.fillStyle = (showFrame && frameStyle === 'filled-inverse') ? strokeColor : fillColor;
      ctx.fillText(line, width / 2, y);
    }
    
    ctx.restore();
    
    // Draw underline if enabled
    if (underline && lineIndex === lines.length - 1) {
      ctx.save();
      ctx.globalAlpha = fillOpacity;
      
      const metrics = ctx.measureText(line);
      const underlineWidth = metrics.width + (letterSpacing > 0 ? (line.length - 1) * fontSize * letterSpacing : 0);
      const underlineY = y + fontSize / 2 + underlineOffset;
      
      ctx.strokeStyle = (showFrame && frameStyle === 'filled-inverse') ? strokeColor : fillColor;
      ctx.lineWidth = underlineWeight;
      ctx.lineCap = 'round';
      
      ctx.beginPath();
      ctx.moveTo(width / 2 - underlineWidth / 2, underlineY);
      ctx.lineTo(width / 2 + underlineWidth / 2, underlineY);
      ctx.stroke();
      
      ctx.restore();
    }
  });
  
  // Apply text stroke if enabled
  if (params.strokeType !== 'none' && params.strokeWidth > 0) {
    ctx.save();
    ctx.globalAlpha = strokeOpacity;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = params.strokeWidth;
    
    lines.forEach((line, index) => {
      const y = startY + index * fontSize * lineHeight;
      ctx.strokeText(line, width / 2, y);
    });
    
    ctx.restore();
  }
  
  ctx.restore();
  
  // Debug info
  // if (utils.debug) {
  //   utils.debug.log('Wordmark rendered', {
  //     text: displayText,
  //     fontStyle,
  //     fontSize: fontSize.toFixed(1),
  //     showFrame,
  //     animation: textAnimation
  //   });
  // }
}