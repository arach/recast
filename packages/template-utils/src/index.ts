/**
 * Template Utilities Library
 * 
 * Strongly-typed utilities for ReFlow templates.
 * These utilities are transpiled to JavaScript and injected into template execution.
 */

import * as canvas from './canvas';
import * as color from './color';
import * as math from './math';
import * as debug from './debug';
import * as background from './background';
import * as shape from './shape';

// For compatibility with existing templates, we need these at the root level
import { adjustBrightness } from './color';
import { apply as applyBackground } from './background';
import { hexToHsl as hexToHslObject } from './color';

// Compatibility function for templates expecting array format
function hexToHslArray(hex: string): [number, number, number] {
  const { h, s, l } = hexToHslObject(hex);
  return [h, s, l];
}

// Helper to flatten parameters (used by templates)
function flattenParameters(params: any) {
  return {
    ...params,
    ...(params.core || {}),
    ...(params.style || {}),
    ...(params.custom || {}),
    ...(params.content || {})
  };
}

// Export the complete utils object that templates will receive
export const utils = {
  // Modules
  canvas,
  color,
  math,
  debug,
  background,
  shape,
  
  // Compatibility functions at root level for existing templates
  adjustColor: adjustBrightness,
  hexToHsl: hexToHslArray,
  applyUniversalBackground: applyBackground,
  flattenParameters
};

// Type export for templates that want TypeScript definitions
export type TemplateUtils = typeof utils;

// Re-export individual modules for direct import if needed
export { canvas, color, math, debug, background, shape };

// Export specific functions that are used directly in the codebase
export { apply as applyUniversalBackground } from './background';
export { adjustBrightness as adjustColor } from './color';
export { hexToHslArray as hexToHsl };