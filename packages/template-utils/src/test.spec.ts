import { describe, it, expect } from 'vitest';
import { hexToHsl, adjustColor, applyUniversalBackground } from './index';

describe('template-utils', () => {
  describe('hexToHsl', () => {
    it('should convert hex to HSL array', () => {
      const result = hexToHsl('#ff0000');
      expect(result).toEqual([0, 100, 50]);
    });
  });

  describe('adjustColor', () => {
    it('should adjust color brightness', () => {
      const result = adjustColor('#808080', 0.2);
      expect(result).toBeTruthy();
      expect(result.startsWith('#')).toBe(true);
    });
  });

  describe('applyUniversalBackground', () => {
    it('should be a function', () => {
      expect(typeof applyUniversalBackground).toBe('function');
    });
  });
});