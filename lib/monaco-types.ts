// Type definitions for the visualization context
export const visualizationTypes = `
declare interface VisualizationParams {
  seed: string;
  frequency: number;
  amplitude: number;
  complexity: number;
  chaos: number;
  damping: number;
  layers: number;
  barCount?: number;
  barSpacing?: number;
  radius?: number;
  color?: string;
  sides?: number;
  rotation?: number;
  scale?: number;
  customParameters: Record<string, any>;
  [key: string]: any;
}

declare interface WaveGenerator {
  getValue(x: number, y: number): number;
  getComplexValue(x: number, y: number, harmonics: number): number;
  reset(): void;
}

declare interface DrawContext extends CanvasRenderingContext2D {}

/**
 * Main visualization function that gets called to render the logo
 * @param ctx - Canvas 2D rendering context
 * @param width - Canvas width in pixels
 * @param height - Canvas height in pixels
 * @param params - Visualization parameters including colors and custom values
 * @param generator - Wave generator instance for mathematical patterns
 * @param time - Animation time in seconds (0 for static)
 */
declare function drawVisualization(
  ctx: DrawContext,
  width: number,
  height: number,
  params: VisualizationParams,
  generator: WaveGenerator,
  time: number
): void;

// Helper functions available in the visualization context
declare function applyUniversalBackground(ctx: DrawContext, width: number, height: number, params: any): void;
declare function applyUniversalFill(ctx: DrawContext, params: any): void;
declare function applyUniversalStroke(ctx: DrawContext, params: any): void;
declare function getBoundsFromPoints(points: Array<{x: number, y: number}>): {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
};
declare function getColor(params: any, colorName: string, defaultValue: string): string;

// Common parameter definitions
declare const PARAMETERS: Record<string, {
  type: 'slider' | 'color' | 'text' | 'toggle' | 'select';
  min?: number;
  max?: number;
  step?: number;
  default: any;
  label: string;
  options?: Array<{value: string, label: string}>;
  showIf?: (params: any) => boolean;
  category?: string;
}>;
`;