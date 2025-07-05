/**
 * Background Utilities
 * 
 * Functions for applying universal background styles
 */

import { parseColor } from './color';

export interface BackgroundParams {
  backgroundType?: 'transparent' | 'solid' | 'gradient';
  backgroundColor?: string;
  backgroundOpacity?: number;
  backgroundGradientStart?: string;
  backgroundGradientEnd?: string;
  backgroundGradientDirection?: number; // degrees
}

/**
 * Apply universal background based on parameters
 */
export function apply(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: BackgroundParams
): void {
  const type = params.backgroundType || 'transparent';
  
  if (type === 'transparent') {
    return; // Nothing to do
  }
  
  ctx.save();
  
  // Apply opacity if specified
  const opacity = params.backgroundOpacity ?? 1;
  ctx.globalAlpha = opacity;
  
  if (type === 'solid') {
    const color = params.backgroundColor || '#ffffff';
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
  } else if (type === 'gradient') {
    const startColor = params.backgroundGradientStart || params.backgroundColor || '#ffffff';
    const endColor = params.backgroundGradientEnd || '#f0f0f0';
    const direction = params.backgroundGradientDirection || 0;
    
    // Convert direction to radians
    const radians = (direction * Math.PI) / 180;
    
    // Calculate gradient points
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.sqrt(width * width + height * height) / 2;
    
    const x1 = centerX - Math.cos(radians) * radius;
    const y1 = centerY - Math.sin(radians) * radius;
    const x2 = centerX + Math.cos(radians) * radius;
    const y2 = centerY + Math.sin(radians) * radius;
    
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, startColor);
    gradient.addColorStop(1, endColor);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
  
  ctx.restore();
}

/**
 * Create a radial gradient background
 */
export function radialGradient(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  colors: string[],
  centerX?: number,
  centerY?: number,
  radius?: number
): void {
  ctx.save();
  
  const cx = centerX ?? width / 2;
  const cy = centerY ?? height / 2;
  const r = radius ?? Math.max(width, height) / 2;
  
  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  
  // Distribute colors evenly
  colors.forEach((color, i) => {
    const stop = i / (colors.length - 1);
    gradient.addColorStop(stop, color);
  });
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  ctx.restore();
}

/**
 * Create a pattern background
 */
export function pattern(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  patternType: 'dots' | 'lines' | 'grid',
  color: string = 'rgba(0, 0, 0, 0.1)',
  spacing: number = 20
): void {
  ctx.save();
  
  if (patternType === 'dots') {
    ctx.fillStyle = color;
    for (let x = spacing / 2; x < width; x += spacing) {
      for (let y = spacing / 2; y < height; y += spacing) {
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (patternType === 'lines') {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    
    // Diagonal lines
    for (let i = -height; i < width + height; i += spacing) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + height, height);
      ctx.stroke();
    }
  } else if (patternType === 'grid') {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = 0; x <= width; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= height; y += spacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }
  
  ctx.restore();
}

/**
 * Create a noise/texture background
 */
export function noise(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  intensity: number = 0.1,
  monochrome: boolean = true
): void {
  ctx.save();
  
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    if (monochrome) {
      const value = Math.random() * 255 * intensity;
      data[i] = value;     // R
      data[i + 1] = value; // G
      data[i + 2] = value; // B
    } else {
      data[i] = Math.random() * 255 * intensity;     // R
      data[i + 1] = Math.random() * 255 * intensity; // G
      data[i + 2] = Math.random() * 255 * intensity; // B
    }
    data[i + 3] = 255 * intensity; // A
  }
  
  ctx.putImageData(imageData, 0, 0);
  ctx.restore();
}

/**
 * Clear the canvas with a specific color
 */
export function clear(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color?: string
): void {
  if (color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  } else {
    ctx.clearRect(0, 0, width, height);
  }
}