// Re-export everything from the @reflow/template-utils package
export * from '@reflow/template-utils';
export type { TemplateUtils } from '@reflow/template-utils';

// Keep local utility functions that aren't in the package yet
/**
 * Generate defaultParams from parameter definitions
 */
export function generateDefaultParams(parameters: Record<string, any>): Record<string, any> {
  return Object.entries(parameters).reduce((acc, [key, param]) => {
    acc[key] = param.default;
    return acc;
  }, {} as Record<string, any>);
}

/**
 * Flatten nested parameter structures into a single level object
 * Ensures all parameters are available at root level
 */
export function flattenParameters(params: any) {
  const flatParams = {
    ...params,
    // Flatten core parameters
    ...(params.core || {}),
    // Flatten style parameters  
    ...(params.style || {}),
    // Flatten custom parameters
    ...(params.custom || {}),
    // Flatten content parameters
    ...(params.content || {})
  };
  
  // Legacy support: also check customParameters
  if (params.customParameters) {
    Object.keys(params.customParameters).forEach(key => {
      if (flatParams[key] === undefined) {
        flatParams[key] = params.customParameters[key];
      }
    });
  }
  
  return flatParams;
}

// TODO: Move these to the package
export function applyUniversalBackground(
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  params: any
) {
  if (!params.backgroundType || params.backgroundType === 'transparent') return;
  
  ctx.save();
  ctx.globalAlpha = params.backgroundOpacity ?? 1;
  
  if (params.backgroundType === 'solid') {
    ctx.fillStyle = params.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, width, height);
  } else if (params.backgroundType === 'gradient') {
    const direction = (params.backgroundGradientDirection || 0) * (Math.PI / 180);
    const x1 = width / 2 - Math.cos(direction) * width / 2;
    const y1 = height / 2 - Math.sin(direction) * height / 2;
    const x2 = width / 2 + Math.cos(direction) * width / 2;
    const y2 = height / 2 + Math.sin(direction) * height / 2;
    
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, params.backgroundGradientStart || '#ffffff');
    gradient.addColorStop(1, params.backgroundGradientEnd || '#f0f0f0');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
  
  ctx.restore();
}

/**
 * Helper to create color variations by adjusting lightness
 */
export function adjustColor(color: string, lightness: number) {
  // Simple hex to RGB conversion
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Adjust lightness
  const factor = lightness > 0 ? lightness : 0;
  const newR = Math.min(255, r + (255 - r) * factor);
  const newG = Math.min(255, g + (255 - g) * factor);
  const newB = Math.min(255, b + (255 - b) * factor);
  
  return `rgb(${Math.round(newR)}, ${Math.round(newG)}, ${Math.round(newB)})`;
}

/**
 * Helper to convert hex color to HSL
 */
export function hexToHsl(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0, 0, 50];
  
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;
  
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
      default: h = 0;
    }
  }
  
  return [h * 360, s * 100, l * 100];
}