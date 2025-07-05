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

// Export the complete utils object that templates will receive
export const utils = {
  canvas,
  color,
  math,
  debug,
  background,
  shape
};

// Type export for templates that want TypeScript definitions
export type TemplateUtils = typeof utils;

// Re-export individual modules for direct import if needed
export { canvas, color, math, debug, background, shape };