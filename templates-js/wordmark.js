/**
 * 📝 Wordmark
 * 
 * Professional text-based logos with customizable typography and optional frames
 */

function draw(ctx, width, height, params, time, utils) {
  // Load and process all parameters - clean and deterministic
  const p = utils.params.load(params, ctx, width, height, time, { parameters });
  
  // Template-specific parameters (defaults come from exported parameters)
  const { text, fontStyle, fontWeight, letterSpacing, size, lineHeight, textTransform,
          underline, underlineWeight, underlineOffset, showFrame, frameStyle, 
          frameStrokeStyle, frameStrokeWidth, framePadding, frameRadius,
          textAnimation, animationSpeed, animationIntensity } = p;
  
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
      fontFamily = p.customFont || fontFamily;
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
  const animTime = p.animTime;
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
      ctx.globalAlpha = p.fillOpacity;
      ctx.fillStyle = frameStyle === 'filled' ? p.strokeColor : p.fillColor;
      ctx.beginPath();
      drawRoundedRect(ctx, frameX, frameY, frameWidth, frameHeight, frameRadius);
      ctx.fill();
    } else {
      ctx.globalAlpha = p.strokeOpacity;
      ctx.strokeStyle = p.strokeColor;
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
    ctx.globalAlpha = p.fillOpacity;
    
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
        
        ctx.fillStyle = (showFrame && frameStyle === 'filled-inverse') ? p.strokeColor : p.fillColor;
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
      ctx.globalAlpha = p.fillOpacity;
      
      const metrics = ctx.measureText(line);
      const underlineWidth = metrics.width + (letterSpacing > 0 ? (line.length - 1) * fontSize * letterSpacing : 0);
      const underlineY = y + fontSize / 2 + underlineOffset;
      
      ctx.strokeStyle = (showFrame && frameStyle === 'filled-inverse') ? p.strokeColor : p.fillColor;
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
  if (p.strokeType !== 'none' && p.strokeWidth > 0) {
    ctx.save();
    ctx.globalAlpha = p.strokeOpacity;
    ctx.strokeStyle = p.strokeColor;
    ctx.lineWidth = p.strokeWidth;
    
    lines.forEach((line, index) => {
      const y = startY + index * fontSize * lineHeight;
      ctx.strokeText(line, width / 2, y);
    });
    
    ctx.restore();
  }
  
  ctx.restore();
  
  // Debug info in dev mode
  if (utils.debug) {
    utils.debug.log('Wordmark rendered', {
      text: displayText,
      fontStyle,
      fontSize: fontSize.toFixed(1),
      showFrame,
      animation: textAnimation
    });
  }
}

// Helper functions for concise parameter definitions
const text = (def, label, placeholder, opts = {}) => ({ 
  type: "text", default: def, label, placeholder, ...opts 
});
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
  // Typography
  text: text("BRAND", "Text", "Enter your brand name", { multiline: true }),
  fontStyle: select("modern", [
    { value: "modern", label: "Modern" },
    { value: "tech", label: "Tech (Monospace)" },
    { value: "elegant", label: "Elegant (Serif)" },
    { value: "bold", label: "Bold (Heavy)" },
    { value: "minimal", label: "Minimal" },
    { value: "silkscreen", label: "Silkscreen" },
    { value: "orbitron", label: "Orbitron" },
    { value: "doto", label: "DotGothic16" },
    { value: "custom", label: "Custom Font" }
  ], "Font Style"),
  customFont: text("Arial", "Custom Font Name", "e.g., 'Times New Roman'", { when: { fontStyle: "custom" } }),
  fontWeight: select("500", [
    { value: "300", label: "Light" },
    { value: "400", label: "Regular" },
    { value: "500", label: "Medium" },
    { value: "600", label: "Semi-Bold" },
    { value: "700", label: "Bold" },
    { value: "900", label: "Black" }
  ], "Font Weight"),
  letterSpacing: slider(0.05, -0.05, 0.3, 0.01, "Letter Spacing", "em"),
  size: slider(0.5, 0.1, 0.9, 0.05, "Text Size"),
  lineHeight: slider(1.2, 0.8, 2.0, 0.1, "Line Height", "em"),
  textTransform: select("uppercase", [
    { value: "none", label: "None" },
    { value: "uppercase", label: "UPPERCASE" },
    { value: "lowercase", label: "lowercase" },
    { value: "capitalize", label: "Capitalize" }
  ], "Text Transform"),
  underline: toggle(false, "Show Underline"),
  underlineWeight: slider(3, 1, 10, 1, "Underline Weight", "px", { when: { underline: true } }),
  underlineOffset: slider(5, 0, 20, 1, "Underline Offset", "px", { when: { underline: true } }),
  
  // Frame
  showFrame: toggle(false, "Show Frame"),
  frameStyle: select("outline", [
    { value: "outline", label: "Outline" },
    { value: "filled", label: "Filled" },
    { value: "filled-inverse", label: "Filled (Inverse)" }
  ], "Frame Style", { when: { showFrame: true } }),
  frameStrokeStyle: select("solid", [
    { value: "solid", label: "Solid" },
    { value: "dashed", label: "Dashed" },
    { value: "dotted", label: "Dotted" },
    { value: "double", label: "Double" }
  ], "Frame Stroke Style", { when: { showFrame: true, frameStyle: "outline" } }),
  frameStrokeWidth: slider(3, 1, 10, 1, "Frame Stroke Width", "px", { when: { showFrame: true, frameStyle: "outline" } }),
  framePadding: slider(40, 10, 100, 5, "Frame Padding", "px", { when: { showFrame: true } }),
  frameRadius: slider(0, 0, 50, 2, "Frame Corner Radius", "px", { when: { showFrame: true } }),
  
  // Animation
  textAnimation: select("none", [
    { value: "none", label: "None" },
    { value: "float", label: "Float" },
    { value: "wave", label: "Wave" },
    { value: "pulse", label: "Pulse" },
    { value: "rotate", label: "Rotate" },
    { value: "shake", label: "Shake" }
  ], "Text Animation"),
  animationSpeed: slider(1, 0.1, 5, 0.1, "Animation Speed", "x", { when: { textAnimation: ["float", "wave", "pulse", "rotate", "shake"] } }),
  animationIntensity: slider(0.5, 0, 1, 0.1, "Animation Intensity", null, { when: { textAnimation: ["float", "wave", "pulse", "rotate", "shake"] } })
};

// Template metadata
export const metadata = {
  name: "📝 Wordmark",
  description: "Professional text-based logos with customizable typography and optional frames",
  category: "typography",
  tags: ["text", "wordmark", "typography", "logo", "brand"],
  author: "ReFlow",
  version: "1.0.0"
};