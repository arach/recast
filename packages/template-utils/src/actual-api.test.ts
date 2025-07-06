import { describe, it, expect } from 'vitest';
import * as color from './color';
import * as math from './math';
import * as canvas from './canvas';
import * as background from './background';

describe('template-utils actual API', () => {
  describe('color module', () => {
    describe('hexToHsl', () => {
      it('should convert hex to HSL object', () => {
        const red = color.hexToHsl('#ff0000');
        expect(red).toEqual({ h: 0, s: 100, l: 50 });
        
        const green = color.hexToHsl('#00ff00');
        expect(green).toEqual({ h: 120, s: 100, l: 50 });
        
        const blue = color.hexToHsl('#0000ff');
        expect(blue).toEqual({ h: 240, s: 100, l: 50 });
        
        const gray = color.hexToHsl('#808080');
        expect(gray.s).toBe(0);
        expect(gray.l).toBeCloseTo(50, 0);
      });
    });

    describe('hslToHex', () => {
      it('should convert HSL to hex', () => {
        expect(color.hslToHex(0, 100, 50)).toBe('#ff0000');
        expect(color.hslToHex(120, 100, 50)).toBe('#00ff00');
        expect(color.hslToHex(240, 100, 50)).toBe('#0000ff');
        expect(color.hslToHex(0, 0, 50)).toBe('#808080');
      });
    });

    describe('adjustBrightness', () => {
      it('should adjust color brightness', () => {
        // Lightening black should give gray
        expect(color.adjustBrightness('#000000', 0.5)).toBe('#808080');
        
        // Darkening white should give gray
        expect(color.adjustBrightness('#ffffff', -0.5)).toBe('#808080');
        
        // No change
        expect(color.adjustBrightness('#808080', 0)).toBe('#808080');
      });
    });

    describe('interpolate', () => {
      it('should interpolate between colors', () => {
        // Halfway between red and blue
        const purple = color.interpolate('#ff0000', '#0000ff', 0.5);
        expect(purple).toMatch(/^#[0-9a-f]{6}$/i);
        
        // Start and end points
        expect(color.interpolate('#ff0000', '#0000ff', 0)).toBe('#ff0000');
        expect(color.interpolate('#ff0000', '#0000ff', 1)).toBe('#0000ff');
      });
    });

    describe('spectrum', () => {
      it('should generate spectrum color at position', () => {
        const red = color.spectrum(0);
        expect(red).toMatch(/^#[0-9a-f]{6}$/i);
        
        const green = color.spectrum(0.33);
        expect(green).toMatch(/^#[0-9a-f]{6}$/i);
        
        const blue = color.spectrum(0.67);
        expect(blue).toMatch(/^#[0-9a-f]{6}$/i);
        
        // Different from red since spectrum wraps
        const end = color.spectrum(1);
        expect(end).toMatch(/^#[0-9a-f]{6}$/i);
      });
    });

    describe('withAlpha', () => {
      it('should add alpha channel', () => {
        expect(color.withAlpha('#ff0000', 0.5)).toBe('rgba(255, 0, 0, 0.5)');
        expect(color.withAlpha('#00ff00', 0)).toBe('rgba(0, 255, 0, 0)');
        expect(color.withAlpha('#0000ff', 1)).toBe('rgba(0, 0, 255, 1)');
      });
    });
  });

  describe('math module', () => {
    describe('clamp', () => {
      it('should clamp values', () => {
        expect(math.clamp(5, 0, 10)).toBe(5);
        expect(math.clamp(-5, 0, 10)).toBe(0);
        expect(math.clamp(15, 0, 10)).toBe(10);
      });
    });

    describe('lerp', () => {
      it('should interpolate linearly', () => {
        expect(math.lerp(0, 10, 0)).toBe(0);
        expect(math.lerp(0, 10, 0.5)).toBe(5);
        expect(math.lerp(0, 10, 1)).toBe(10);
      });
    });

    describe('map', () => {
      it('should map between ranges', () => {
        expect(math.map(5, 0, 10, 0, 100)).toBe(50);
        expect(math.map(0, 0, 10, 0, 100)).toBe(0);
        expect(math.map(10, 0, 10, 0, 100)).toBe(100);
      });
    });

    describe('distance', () => {
      it('should calculate distance', () => {
        expect(math.distance(0, 0, 3, 4)).toBe(5);
        expect(math.distance(0, 0, 0, 0)).toBe(0);
      });
    });

    describe('angle', () => {
      it('should calculate angle in radians', () => {
        expect(math.angle(0, 0, 1, 0)).toBe(0);
        expect(math.angle(0, 0, 0, 1)).toBeCloseTo(Math.PI / 2);
      });
    });

    describe('toRadians & toDegrees', () => {
      it('should convert between radians and degrees', () => {
        expect(math.toRadians(180)).toBeCloseTo(Math.PI);
        expect(math.toDegrees(Math.PI)).toBeCloseTo(180);
      });
    });

    describe('smoothstep', () => {
      it('should interpolate smoothly', () => {
        expect(math.smoothstep(0, 1, -1)).toBe(0);
        expect(math.smoothstep(0, 1, 0.5)).toBe(0.5);
        expect(math.smoothstep(0, 1, 2)).toBe(1);
      });
    });

    describe('random', () => {
      it('should generate random numbers', () => {
        const r = math.random(0, 10);
        expect(r).toBeGreaterThanOrEqual(0);
        expect(r).toBeLessThanOrEqual(10);
      });
    });

    describe('randomInt', () => {
      it('should generate random integers', () => {
        const r = math.randomInt(0, 10);
        expect(Number.isInteger(r)).toBe(true);
        expect(r).toBeGreaterThanOrEqual(0);
        expect(r).toBeLessThanOrEqual(10);
      });
    });
  });

  describe('canvas module', () => {
    it('should have drawing functions', () => {
      expect(typeof canvas.clear).toBe('function');
      expect(typeof canvas.drawPath).toBe('function');
      expect(typeof canvas.drawRoundedPolygon).toBe('function');
      expect(typeof canvas.fillCircle).toBe('function');
      expect(typeof canvas.fillRect).toBe('function');
      expect(typeof canvas.fillText).toBe('function');
      expect(typeof canvas.measureText).toBe('function');
      expect(typeof canvas.strokeCircle).toBe('function');
      expect(typeof canvas.strokeRect).toBe('function');
      expect(typeof canvas.withState).toBe('function');
      expect(typeof canvas.withTransform).toBe('function');
    });
  });

  describe('background module', () => {
    it('should have background functions', () => {
      expect(typeof background.apply).toBe('function');
      expect(typeof background.clear).toBe('function');
      expect(typeof background.radialGradient).toBe('function');
      expect(typeof background.pattern).toBe('function');
      expect(typeof background.noise).toBe('function');
    });
  });
});