import type { ParameterDefinition, PresetMetadata } from './types';

// Letter Mark - Simple, professional letter-based logos
export const parameters: Record<string, ParameterDefinition> = {
  // Core letter settings
  letter: { 
    type: 'text', 
    default: 'A', 
    label: 'Letter(s)' 
  },
  
  fontWeight: {
    type: 'select',
    options: [
      { value: '300', label: 'Light' },
      { value: '400', label: 'Regular' },
      { value: '500', label: 'Medium' },
      { value: '600', label: 'Semibold' },
      { value: '700', label: 'Bold' },
      { value: '800', label: 'Heavy' }
    ],
    default: '600',
    label: 'Font Weight'
  },
  
  style: {
    type: 'select',
    options: [
      { value: 'modern', label: 'Modern Sans' },
      { value: 'rounded', label: 'Rounded' },
      { value: 'geometric', label: 'Geometric' },
      { value: 'classic', label: 'Classic' }
    ],
    default: 'modern',
    label: 'Style'
  },
  
  // Layout
  alignment: {
    type: 'select',
    options: [
      { value: 'center', label: 'Center' },
      { value: 'left', label: 'Left' },
      { value: 'right', label: 'Right' }
    ],
    default: 'center',
    label: 'Alignment'
  },
  
  size: { 
    type: 'slider', 
    min: 0.3, 
    max: 0.9, 
    step: 0.05, 
    default: 0.7, 
    label: 'Size' 
  },
  
  letterSpacing: {
    type: 'slider',
    min: -0.1,
    max: 0.3,
    step: 0.02,
    default: 0,
    label: 'Letter Spacing'
  },
  
  // Container
  container: {
    type: 'select',
    options: [
      { value: 'none', label: 'None' },
      { value: 'circle', label: 'Circle' },
      { value: 'square', label: 'Square' },
      { value: 'rounded', label: 'Rounded Square' }
    ],
    default: 'none',
    label: 'Container'
  },
  
  containerPadding: {
    type: 'slider',
    min: 0.1,
    max: 0.4,
    step: 0.05,
    default: 0.2,
    label: 'Container Padding'
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
  const backgroundColor = params.backgroundColor || '#ffffff';
  
  // Extract parameters
  const letter = params.letter || 'A';
  const fontWeight = params.fontWeight || '600';
  const style = params.style || 'modern';
  const alignment = params.alignment || 'center';
  const size = params.size || 0.7;
  const letterSpacing = params.letterSpacing || 0;
  const container = params.container || 'none';
  const containerPadding = params.containerPadding || 0.2;
  
  // Calculate dimensions
  const minDim = Math.min(width, height);
  const fontSize = minDim * size;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Set up font
  let fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  if (style === 'rounded') {
    fontFamily = '"SF Pro Rounded", -apple-system, BlinkMacSystemFont, sans-serif';
  } else if (style === 'geometric') {
    fontFamily = 'Futura, "Century Gothic", sans-serif';
  } else if (style === 'classic') {
    fontFamily = 'Georgia, "Times New Roman", serif';
  }
  
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.textAlign = alignment as CanvasTextAlign;
  ctx.textBaseline = 'middle';
  
  // Apply letter spacing
  if (letterSpacing !== 0 && letter.length > 1) {
    ctx.letterSpacing = `${letterSpacing}em`;
  }
  
  // Calculate text position
  let textX = centerX;
  if (alignment === 'left') textX = width * 0.1;
  else if (alignment === 'right') textX = width * 0.9;
  
  // Draw container if specified
  if (container !== 'none') {
    const metrics = ctx.measureText(letter);
    const textWidth = metrics.width;
    const textHeight = fontSize;
    const padding = minDim * containerPadding;
    
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
  } else {
    // No container, use fill color for text
    ctx.fillStyle = fillColor;
  }
  
  // Draw the letter(s)
  ctx.fillText(letter, textX, centerY);
  
  // Optional: Add subtle depth with stroke
  if (params.strokeWidth && params.strokeWidth > 0) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = params.strokeWidth;
    ctx.strokeText(letter, textX, centerY);
  }
}

export const metadata: PresetMetadata = {
  name: "A Letter Mark",
  description: "Clean, professional letter-based logos perfect for modern brands",
  defaultParams: {
    seed: "letter-mark",
    letter: 'A',
    fontWeight: '600',
    style: 'modern',
    alignment: 'center',
    size: 0.7,
    letterSpacing: 0,
    container: 'none',
    containerPadding: 0.2
  }
};