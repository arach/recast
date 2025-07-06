/**
 * Color Manipulation Utilities
 * 
 * Color conversion, interpolation, and manipulation functions
 */

/**
 * Convert hex color to HSL
 */
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse hex values
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * Convert HSL to hex color
 */
export function hslToHex(h: number, s: number, l: number): string {
  // Normalize values
  h = h / 360;
  s = s / 100;
  l = l / 100;
  
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  const toHex = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Interpolate between two colors
 */
export function interpolate(color1: string, color2: string, t: number): string {
  // Ensure t is between 0 and 1
  t = Math.max(0, Math.min(1, t));
  
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  
  const r = Math.round(c1.r + (c2.r - c1.r) * t);
  const g = Math.round(c1.g + (c2.g - c1.g) * t);
  const b = Math.round(c1.b + (c2.b - c1.b) * t);
  
  return rgbToHex(r, g, b);
}

/**
 * Adjust color brightness
 */
export function adjustBrightness(color: string, amount: number): string {
  const hsl = hexToHsl(color);
  hsl.l = Math.max(0, Math.min(100, hsl.l + amount * 100));
  return hslToHex(hsl.h, hsl.s, hsl.l);
}

/**
 * Adjust color saturation
 */
export function adjustSaturation(color: string, amount: number): string {
  const hsl = hexToHsl(color);
  hsl.s = Math.max(0, Math.min(100, hsl.s + amount * 100));
  return hslToHex(hsl.h, hsl.s, hsl.l);
}

/**
 * Rotate hue
 */
export function rotateHue(color: string, degrees: number): string {
  const hsl = hexToHsl(color);
  hsl.h = (hsl.h + degrees) % 360;
  if (hsl.h < 0) hsl.h += 360;
  return hslToHex(hsl.h, hsl.s, hsl.l);
}

/**
 * Get a color from the spectrum (rainbow) based on a 0-1 value
 */
export function spectrum(t: number): string {
  // Ensure t is between 0 and 1
  t = Math.max(0, Math.min(1, t));
  const hue = t * 360;
  return hslToHex(hue, 70, 50);
}

/**
 * Parse any color format to RGBA
 */
export function parseColor(color: string): { r: number; g: number; b: number; a: number } {
  // Handle hex
  if (color.startsWith('#')) {
    const rgb = hexToRgb(color);
    return { ...rgb, a: 1 };
  }
  
  // Handle rgb/rgba
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (match) {
    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3]),
      a: match[4] ? parseFloat(match[4]) : 1
    };
  }
  
  // Default to black
  return { r: 0, g: 0, b: 0, a: 1 };
}

/**
 * Create a color with alpha
 */
export function withAlpha(color: string, alpha: number): string {
  const { r, g, b } = parseColor(color);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Helper functions
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  hex = hex.replace('#', '');
  return {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16)
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}