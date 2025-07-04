// 📝 Wordmark
import type { TemplateUtils } from '@/lib/template-utils';

const parameters = {
  text: {
    default: 'BRAND'
  },
  fontStyle: {
    default: 'modern',
    options: ['modern', 'tech', 'elegant', 'bold', 'minimal', 'silkscreen', 'orbitron', 'doto']
  },
  fontWeight: {
    default: '500',
    options: ['300', '400', '500', '600', '700', '900']
  },
  letterSpacing: {
    default: 0.05,
    range: [-0.05, 0.3, 0.01]
  },
  size: {
    default: 0.5,
    range: [0.1, 0.9, 0.05]
  },
  lineHeight: {
    default: 1.2,
    range: [0.8, 1.5, 0.1]
  },
  textTransform: {
    default: 'uppercase',
    options: ['none', 'uppercase', 'lowercase', 'capitalize']
  },
  underline: {
    default: false
  },
  underlineWeight: {
    default: 3,
    range: [1, 10, 1]
  },
  underlineOffset: {
    default: 5,
    range: [0, 20, 1]
  },
  showFrame: {
    default: false
  },
  frameStyle: {
    default: 'outline',
    options: ['outline', 'filled', 'filled-inverse']
  },
  frameStrokeStyle: {
    default: 'solid',
    options: ['solid', 'dashed', 'dotted', 'double']
  },
  frameStrokeWidth: {
    default: 3,
    range: [1, 10, 1]
  },
  framePadding: {
    default: 40,
    range: [10, 100, 5]
  },
  frameRadius: {
    default: 0,
    range: [0, 50, 2]
  }
};

const metadata = {
  id: 'wordmark',
  name: "📝 Wordmark",
  description: "Professional text-based logos with customizable typography and optional frames",
  parameters,
  defaultParams: {
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

function drawVisualization(ctx: CanvasRenderingContext2D, width: number, height: number, params: any, time: number, utils: TemplateUtils) {
  // Apply universal background
  utils.applyUniversalBackground(ctx, width, height, params);
  
  // Get theme colors and opacity
  const fillColor = params.fillColor || '#000000';
  const strokeColor = params.strokeColor || '#000000';
  const fillOpacity = params.fillOpacity ?? 1;
  const strokeOpacity = params.strokeOpacity ?? 1;
  
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
  function applyTextTransform(text: string, transform: string) {
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
      // Filled rectangle with opacity
      ctx.globalAlpha = fillOpacity;
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
      // Outline rectangle with opacity
      ctx.globalAlpha = strokeOpacity;
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
  
  // Draw each line with proper opacity
  lines.forEach((line, index) => {
    const y = startY + index * fontSize * lineHeight;
    
    // Save context for opacity
    ctx.save();
    ctx.globalAlpha = fillOpacity;
    
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
    
    // Restore opacity
    ctx.restore();
    
    // Draw underline if enabled
    if (underline && index === lines.length - 1) {
      ctx.save();
      ctx.globalAlpha = fillOpacity;
      
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
      
      ctx.restore();
    }
  });
  
  // Optional stroke effect with opacity
  if (params.strokeWidth && params.strokeWidth > 0) {
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
  
  // Restore context if we were in filled-inverse mode
  if (showFrame && frameStyle === 'filled-inverse') {
    ctx.restore();
  }
}

export { parameters, metadata, drawVisualization };
export const PARAMETERS = metadata.parameters; // Alias for UI system