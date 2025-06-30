import type { ParameterDefinition, PresetMetadata } from './types';

// Wordmark - Clean text-based logos
export const parameters: Record<string, ParameterDefinition> = {
  // Text content
  text: { 
    type: 'text', 
    default: 'BRAND', 
    label: 'Brand Name' 
  },
  
  // Typography
  fontStyle: {
    type: 'select',
    options: [
      { value: 'modern', label: 'Modern Sans' },
      { value: 'tech', label: 'Tech/Mono' },
      { value: 'elegant', label: 'Elegant' },
      { value: 'bold', label: 'Bold Display' },
      { value: 'minimal', label: 'Minimal' },
      { value: 'silkscreen', label: 'Silkscreen' },
      { value: 'orbitron', label: 'Orbitron' },
      { value: 'doto', label: 'DOTO' }
    ],
    default: 'modern',
    label: 'Font Style'
  },
  
  fontWeight: {
    type: 'select',
    options: [
      { value: '300', label: 'Light' },
      { value: '400', label: 'Regular' },
      { value: '500', label: 'Medium' },
      { value: '600', label: 'Semibold' },
      { value: '700', label: 'Bold' },
      { value: '900', label: 'Black' }
    ],
    default: '500',
    label: 'Weight'
  },
  
  letterSpacing: {
    type: 'slider',
    min: -0.05,
    max: 0.3,
    step: 0.01,
    default: 0.05,
    label: 'Letter Spacing'
  },
  
  // Layout
  size: { 
    type: 'slider', 
    min: 0.1, 
    max: 0.9, 
    step: 0.05, 
    default: 0.5, 
    label: 'Size' 
  },
  
  lineHeight: {
    type: 'slider',
    min: 0.8,
    max: 1.5,
    step: 0.1,
    default: 1.2,
    label: 'Line Height'
  },
  
  // Style variations
  textTransform: {
    type: 'select',
    options: [
      { value: 'none', label: 'As Typed' },
      { value: 'uppercase', label: 'UPPERCASE' },
      { value: 'lowercase', label: 'lowercase' },
      { value: 'capitalize', label: 'Capitalize' }
    ],
    default: 'uppercase',
    label: 'Case'
  },
  
  // Effects
  underline: {
    type: 'toggle',
    default: false,
    label: 'Underline'
  },
  
  underlineWeight: {
    type: 'slider',
    min: 1,
    max: 10,
    step: 1,
    default: 3,
    label: 'Underline Weight',
    showIf: (params) => params.underline
  },
  
  underlineOffset: {
    type: 'slider',
    min: 0,
    max: 20,
    step: 1,
    default: 5,
    label: 'Underline Offset',
    showIf: (params) => params.underline
  },
  
  // Frame/Box options
  showFrame: {
    type: 'toggle',
    default: false,
    label: 'Show Frame'
  },
  
  frameStyle: {
    type: 'select',
    options: [
      { value: 'outline', label: 'Outline' },
      { value: 'filled', label: 'Filled' },
      { value: 'filled-inverse', label: 'Filled (Inverse)' }
    ],
    default: 'outline',
    label: 'Frame Style',
    showIf: (params) => params.showFrame
  },
  
  frameStrokeStyle: {
    type: 'select',
    options: [
      { value: 'solid', label: 'Solid' },
      { value: 'dashed', label: 'Dashed' },
      { value: 'dotted', label: 'Dotted' },
      { value: 'double', label: 'Double' }
    ],
    default: 'solid',
    label: 'Frame Border Style',
    showIf: (params) => params.showFrame && params.frameStyle === 'outline'
  },
  
  frameStrokeWidth: {
    type: 'slider',
    min: 1,
    max: 10,
    step: 1,
    default: 3,
    label: 'Frame Border Width',
    showIf: (params) => params.showFrame && params.frameStyle === 'outline'
  },
  
  framePadding: {
    type: 'slider',
    min: 10,
    max: 100,
    step: 5,
    default: 40,
    label: 'Frame Padding',
    showIf: (params) => params.showFrame
  },
  
  frameRadius: {
    type: 'slider',
    min: 0,
    max: 50,
    step: 2,
    default: 0,
    label: 'Frame Corner Radius',
    showIf: (params) => params.showFrame
  }
};

export function draw(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, any>,
  _generator: any,
  _time: number
) {
  // Apply universal background
  applyUniversalBackground(ctx, width, height, params);
  
  // Get theme colors
  const fillColor = params.fillColor || '#000000';
  const strokeColor = params.strokeColor || '#000000';
  
  // Extract parameters
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
  
  // Helper function for text transform
  function applyTextTransform(text: string, transform: string): string {
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
  
  // Apply text transform
  const displayText = applyTextTransform(text, textTransform);
  
  // Calculate dimensions
  const minDim = Math.min(width, height);
  const fontSize = minDim * size * 0.2; // Scale down for better proportions
  
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
  }
  
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Split text into lines if it contains newlines
  const lines = displayText.split('\n');
  const totalHeight = lines.length * fontSize * lineHeight;
  const startY = height / 2 - totalHeight / 2 + fontSize / 2;
  
  // Draw frame/box if enabled - BEFORE drawing the text
  if (showFrame) {
    // Save context state
    ctx.save();
    
    // Pre-calculate text bounds to draw frame first
    let maxWidth = 0;
    lines.forEach(line => {
      const metrics = ctx.measureText(line);
      maxWidth = Math.max(maxWidth, metrics.width);
    });
    
    // Calculate frame dimensions
    const frameX = width / 2 - maxWidth / 2 - framePadding;
    const frameY = startY - fontSize / 2 - framePadding;
    const frameWidth = maxWidth + framePadding * 2;
    const frameHeight = totalHeight + framePadding * 2;
    
    // Draw based on frame style
    if (frameStyle === 'filled' || frameStyle === 'filled-inverse') {
      // Filled rectangle
      ctx.fillStyle = frameStyle === 'filled' ? strokeColor : fillColor;
      if (frameRadius > 0) {
        ctx.beginPath();
        ctx.roundRect(frameX, frameY, frameWidth, frameHeight, frameRadius);
        ctx.fill();
      } else {
        ctx.fillRect(frameX, frameY, frameWidth, frameHeight);
      }
      
      // Swap text color for filled-inverse
      if (frameStyle === 'filled-inverse') {
        // Text will be drawn in strokeColor (usually lighter) on dark background
        // Don't restore yet - we need to keep this color for text drawing
      } else {
        ctx.restore();
      }
    } else {
      // Outline rectangle
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = frameStrokeWidth;
      
      // Apply stroke style patterns
      switch (frameStrokeStyle) {
        case 'dashed':
          ctx.setLineDash([frameStrokeWidth * 3, frameStrokeWidth * 2]);
          break;
        case 'dotted':
          ctx.setLineDash([frameStrokeWidth, frameStrokeWidth * 1.5]);
          break;
        case 'double':
          // Draw double border
          const gap = frameStrokeWidth * 1.5;
          if (frameRadius > 0) {
            ctx.beginPath();
            ctx.roundRect(frameX - gap, frameY - gap, frameWidth + gap * 2, frameHeight + gap * 2, frameRadius);
            ctx.stroke();
            ctx.beginPath();
            ctx.roundRect(frameX, frameY, frameWidth, frameHeight, frameRadius);
            ctx.stroke();
          } else {
            ctx.strokeRect(frameX - gap, frameY - gap, frameWidth + gap * 2, frameHeight + gap * 2);
            ctx.strokeRect(frameX, frameY, frameWidth, frameHeight);
          }
          break;
        default:
          // Solid
          if (frameRadius > 0) {
            ctx.beginPath();
            ctx.roundRect(frameX, frameY, frameWidth, frameHeight, frameRadius);
            ctx.stroke();
          } else {
            ctx.strokeRect(frameX, frameY, frameWidth, frameHeight);
          }
      }
      
      // Reset line dash and restore
      ctx.setLineDash([]);
      ctx.restore();
    }
  }
  
  // Draw each line
  lines.forEach((line, index) => {
    const y = startY + index * fontSize * lineHeight;
    
    // Apply letter spacing manually for better control
    if (letterSpacing > 0) {
      const chars = line.split('');
      const metrics = ctx.measureText(line);
      const totalWidth = metrics.width + (chars.length - 1) * fontSize * letterSpacing;
      let x = width / 2 - totalWidth / 2;
      
      ctx.textAlign = 'left';
      chars.forEach((char) => {
        ctx.fillStyle = (showFrame && frameStyle === 'filled-inverse') ? strokeColor : fillColor;
        ctx.fillText(char, x, y);
        x += ctx.measureText(char).width + fontSize * letterSpacing;
      });
      ctx.textAlign = 'center';
    } else {
      // Normal rendering
      ctx.fillStyle = (showFrame && frameStyle === 'filled-inverse') ? strokeColor : fillColor;
      ctx.fillText(line, width / 2, y);
    }
    
    // Draw underline if enabled
    if (underline && index === lines.length - 1) {
      const metrics = ctx.measureText(line);
      const underlineY = y + fontSize / 2 + underlineOffset;
      const underlineWidth = metrics.width;
      
      ctx.strokeStyle = fillColor;
      ctx.lineWidth = underlineWeight;
      ctx.lineCap = 'round';
      
      ctx.beginPath();
      ctx.moveTo(width / 2 - underlineWidth / 2, underlineY);
      ctx.lineTo(width / 2 + underlineWidth / 2, underlineY);
      ctx.stroke();
    }
  });
  
  // Optional stroke effect
  if (params.strokeWidth && params.strokeWidth > 0) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = params.strokeWidth;
    
    lines.forEach((line, index) => {
      const y = startY + index * fontSize * lineHeight;
      ctx.strokeText(line, width / 2, y);
    });
  }
  
  // Restore context if we were in filled-inverse mode
  if (showFrame && frameStyle === 'filled-inverse') {
    ctx.restore();
  }
}

export const metadata: PresetMetadata = {
  name: "Aa Wordmark",
  description: "Professional text-based logos with customizable typography",
  defaultParams: {
    seed: "wordmark",
    text: 'BRAND',
    fontStyle: 'modern',
    fontWeight: '500',
    letterSpacing: 0.05,
    size: 0.5,
    lineHeight: 1.2,
    textTransform: 'uppercase',
    underline: false,
    underlineWeight: 3,
    underlineOffset: 5,
    showFrame: false,
    frameStyle: 'outline',
    frameStrokeStyle: 'solid',
    frameStrokeWidth: 3,
    framePadding: 40,
    frameRadius: 0
  }
};