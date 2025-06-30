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
      { value: 'minimal', label: 'Minimal' }
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
  }
};

export function draw(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, any>,
  generator: any,
  time: number
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
  }
  
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Split text into lines if it contains newlines
  const lines = displayText.split('\n');
  const totalHeight = lines.length * fontSize * lineHeight;
  const startY = height / 2 - totalHeight / 2 + fontSize / 2;
  
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
        ctx.fillStyle = fillColor;
        ctx.fillText(char, x, y);
        x += ctx.measureText(char).width + fontSize * letterSpacing;
      });
      ctx.textAlign = 'center';
    } else {
      // Normal rendering
      ctx.fillStyle = fillColor;
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
    underlineOffset: 5
  }
};