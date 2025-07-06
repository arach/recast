/**
 * Modern Color Module
 * 
 * A chainable, intuitive API for color manipulation in templates
 */

export interface ColorObject {
  r: number;
  g: number;
  b: number;
  a: number;
  
  // Chainable methods
  lighten(amount: number): ColorObject;
  darken(amount: number): ColorObject;
  saturate(amount: number): ColorObject;
  desaturate(amount: number): ColorObject;
  rotate(degrees: number): ColorObject;
  alpha(value: number): ColorObject;
  mix(color: ColorInput, amount?: number): ColorObject;
  
  // Output methods
  toString(format?: 'hex' | 'rgb' | 'hsl' | 'rgba' | 'hsla'): string;
  toHex(): string;
  toRgb(): { r: number; g: number; b: number; a: number };
  toHsl(): { h: number; s: number; l: number; a: number };
  toArray(): [number, number, number, number];
  
  // Analysis methods
  isDark(): boolean;
  isLight(): boolean;
  contrast(background: ColorInput): number;
  luminance(): number;
}

export type ColorInput = string | ColorObject | { r: number; g: number; b: number } | [number, number, number];

class Color implements ColorObject {
  r: number;
  g: number;
  b: number;
  a: number;
  
  constructor(r: number, g: number, b: number, a: number = 1) {
    this.r = Math.round(clamp(r, 0, 255));
    this.g = Math.round(clamp(g, 0, 255));
    this.b = Math.round(clamp(b, 0, 255));
    this.a = clamp(a, 0, 1);
  }
  
  lighten(amount: number): ColorObject {
    const { h, s, l } = rgbToHsl(this.r, this.g, this.b);
    const newL = clamp(l + amount, 0, 1);
    const { r, g, b } = hslToRgb(h, s, newL);
    return new Color(r, g, b, this.a);
  }
  
  darken(amount: number): ColorObject {
    return this.lighten(-amount);
  }
  
  saturate(amount: number): ColorObject {
    const { h, s, l } = rgbToHsl(this.r, this.g, this.b);
    const newS = clamp(s + amount, 0, 1);
    const { r, g, b } = hslToRgb(h, newS, l);
    return new Color(r, g, b, this.a);
  }
  
  desaturate(amount: number): ColorObject {
    return this.saturate(-amount);
  }
  
  rotate(degrees: number): ColorObject {
    const { h, s, l } = rgbToHsl(this.r, this.g, this.b);
    const newH = (h + degrees / 360) % 1;
    const { r, g, b } = hslToRgb(newH, s, l);
    return new Color(r, g, b, this.a);
  }
  
  alpha(value: number): ColorObject {
    return new Color(this.r, this.g, this.b, value);
  }
  
  mix(color: ColorInput, amount: number = 0.5): ColorObject {
    const other = parse(color);
    const r = lerp(this.r, other.r, amount);
    const g = lerp(this.g, other.g, amount);
    const b = lerp(this.b, other.b, amount);
    const a = lerp(this.a, other.a, amount);
    return new Color(r, g, b, a);
  }
  
  toString(format: 'hex' | 'rgb' | 'hsl' | 'rgba' | 'hsla' = 'hex'): string {
    switch (format) {
      case 'hex':
        return this.toHex();
      case 'rgb':
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
      case 'rgba':
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
      case 'hsl': {
        const { h, s, l } = this.toHsl();
        return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
      }
      case 'hsla': {
        const { h, s, l } = this.toHsl();
        return `hsla(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%, ${this.a})`;
      }
    }
  }
  
  toHex(): string {
    const toHex = (n: number) => {
      const hex = n.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(this.r)}${toHex(this.g)}${toHex(this.b)}`;
  }
  
  toRgb(): { r: number; g: number; b: number; a: number } {
    return { r: this.r, g: this.g, b: this.b, a: this.a };
  }
  
  toHsl(): { h: number; s: number; l: number; a: number } {
    const { h, s, l } = rgbToHsl(this.r, this.g, this.b);
    return { h, s, l, a: this.a };
  }
  
  toArray(): [number, number, number, number] {
    return [this.r, this.g, this.b, this.a];
  }
  
  isDark(): boolean {
    return this.luminance() < 0.5;
  }
  
  isLight(): boolean {
    return !this.isDark();
  }
  
  luminance(): number {
    // Using relative luminance formula
    const r = this.r / 255;
    const g = this.g / 255;
    const b = this.b / 255;
    
    const gammaCorrect = (c: number) => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    
    return 0.2126 * gammaCorrect(r) + 0.7152 * gammaCorrect(g) + 0.0722 * gammaCorrect(b);
  }
  
  contrast(background: ColorInput): number {
    const bg = parse(background);
    const l1 = this.luminance();
    const l2 = bg.luminance();
    const lmax = Math.max(l1, l2);
    const lmin = Math.min(l1, l2);
    return (lmax + 0.05) / (lmin + 0.05);
  }
}

// Module API
export const color = {
  /**
   * Parse any color format into a Color object
   */
  parse(input: ColorInput): ColorObject {
    return parse(input);
  },
  
  /**
   * Create color from RGB values
   */
  rgb(r: number, g: number, b: number, a?: number): ColorObject {
    return new Color(r, g, b, a);
  },
  
  /**
   * Create color from HSL values
   */
  hsl(h: number, s: number, l: number, a?: number): ColorObject {
    const { r, g, b } = hslToRgb(h / 360, s / 100, l / 100);
    return new Color(r, g, b, a);
  },
  
  /**
   * Generate a random color
   */
  random(options?: {
    hue?: number | [number, number];
    saturation?: number | [number, number];
    lightness?: number | [number, number];
  }): ColorObject {
    const h = options?.hue !== undefined
      ? Array.isArray(options.hue)
        ? lerp(options.hue[0], options.hue[1], Math.random())
        : options.hue
      : Math.random() * 360;
      
    const s = options?.saturation !== undefined
      ? Array.isArray(options.saturation)
        ? lerp(options.saturation[0], options.saturation[1], Math.random())
        : options.saturation
      : 50 + Math.random() * 50;
      
    const l = options?.lightness !== undefined
      ? Array.isArray(options.lightness)
        ? lerp(options.lightness[0], options.lightness[1], Math.random())
        : options.lightness
      : 40 + Math.random() * 20;
      
    return this.hsl(h, s, l);
  },
  
  /**
   * Generate a color palette
   */
  palette(options: {
    base: ColorInput;
    scheme: 'monochromatic' | 'complementary' | 'triadic' | 'tetradic' | 'analogous' | 'split-complementary';
    count?: number;
  }): ColorObject[] {
    const base = parse(options.base);
    const { h, s, l } = base.toHsl();
    const results: ColorObject[] = [base];
    
    switch (options.scheme) {
      case 'monochromatic':
        const count = options.count || 5;
        for (let i = 1; i < count; i++) {
          const lightness = l + (i / count) * (i % 2 === 0 ? 0.3 : -0.3);
          results.push(this.hsl(h * 360, s * 100, lightness * 100));
        }
        break;
        
      case 'complementary':
        results.push(base.rotate(180));
        break;
        
      case 'triadic':
        results.push(base.rotate(120));
        results.push(base.rotate(240));
        break;
        
      case 'tetradic':
        results.push(base.rotate(90));
        results.push(base.rotate(180));
        results.push(base.rotate(270));
        break;
        
      case 'analogous':
        results.push(base.rotate(-30));
        results.push(base.rotate(30));
        break;
        
      case 'split-complementary':
        results.push(base.rotate(150));
        results.push(base.rotate(210));
        break;
    }
    
    return results;
  },
  
  /**
   * Create a gradient between colors
   */
  gradient(colors: ColorInput[], options?: {
    stops?: number;
    curve?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  }): {
    stops: ColorObject[];
    at(position: number): ColorObject;
  } {
    const parsed = colors.map(c => parse(c));
    const stops = options?.stops || colors.length;
    const curve = options?.curve || 'linear';
    
    const easingFunctions = {
      linear: (t: number) => t,
      'ease-in': (t: number) => t * t,
      'ease-out': (t: number) => t * (2 - t),
      'ease-in-out': (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    };
    
    const ease = easingFunctions[curve];
    
    const result: ColorObject[] = [];
    for (let i = 0; i < stops; i++) {
      const t = i / (stops - 1);
      const eased = ease(t);
      const position = eased * (parsed.length - 1);
      const index = Math.floor(position);
      const remainder = position - index;
      
      if (index >= parsed.length - 1) {
        result.push(parsed[parsed.length - 1]);
      } else {
        result.push(parsed[index].mix(parsed[index + 1], remainder));
      }
    }
    
    return {
      stops: result,
      at(position: number): ColorObject {
        const clampedPos = clamp(position, 0, 1);
        const eased = ease(clampedPos);
        const scaledPos = eased * (parsed.length - 1);
        const index = Math.floor(scaledPos);
        const remainder = scaledPos - index;
        
        if (index >= parsed.length - 1) {
          return parsed[parsed.length - 1];
        }
        return parsed[index].mix(parsed[index + 1], remainder);
      }
    };
  }
};

// Helper functions
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function parse(input: ColorInput): ColorObject {
  if (input instanceof Color) {
    return input;
  }
  
  if (typeof input === 'string') {
    // Handle hex colors
    if (input.startsWith('#')) {
      const hex = input.slice(1);
      if (hex.length === 3) {
        const r = parseInt(hex[0] + hex[0], 16);
        const g = parseInt(hex[1] + hex[1], 16);
        const b = parseInt(hex[2] + hex[2], 16);
        return new Color(r, g, b);
      } else if (hex.length === 6) {
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        return new Color(r, g, b);
      }
    }
    
    // Handle rgb/rgba
    const rgbMatch = input.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)/);
    if (rgbMatch) {
      return new Color(
        parseInt(rgbMatch[1]),
        parseInt(rgbMatch[2]),
        parseInt(rgbMatch[3]),
        rgbMatch[4] ? parseFloat(rgbMatch[4]) : 1
      );
    }
    
    // Add more format support as needed
  }
  
  if (Array.isArray(input)) {
    return new Color(input[0], input[1], input[2], input[3] || 1);
  }
  
  if ('r' in input && 'g' in input && 'b' in input) {
    return new Color(input.r, input.g, input.b, 'a' in input ? input.a : 1);
  }
  
  throw new Error(`Invalid color input: ${input}`);
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  
  if (max === min) {
    return { h: 0, s: 0, l };
  }
  
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  
  let h;
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
    default:
      h = 0;
  }
  
  return { h, s, l };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l;
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
  
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}