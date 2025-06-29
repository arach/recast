/**
 * Universal Controls System
 * 
 * These are the baseline controls that every template should support.
 * They provide familiar, intuitive parameters that work regardless of
 * the template's specific complexity.
 */

export interface UniversalControls {
  // Background
  backgroundColor: string;
  backgroundType: 'solid' | 'transparent' | 'gradient';
  backgroundGradientStart?: string;
  backgroundGradientEnd?: string;
  backgroundGradientDirection?: number; // degrees
  
  // Fill
  fillType: 'none' | 'solid' | 'gradient';
  fillColor: string;
  fillGradientStart?: string;
  fillGradientEnd?: string;
  fillGradientDirection?: number; // degrees
  fillOpacity: number;
  
  // Stroke
  strokeType: 'none' | 'solid' | 'dashed' | 'dotted';
  strokeColor: string;
  strokeWidth: number;
  strokeOpacity: number;
  strokeDashPattern?: number[]; // for custom dash patterns
  
  // Typography (future)
  // fontFamily?: string;
  // fontSize?: number;
  // fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  // textColor?: string;
  // textAlign?: 'left' | 'center' | 'right';
}

export const DEFAULT_UNIVERSAL_CONTROLS: UniversalControls = {
  // Background
  backgroundColor: '#ffffff',
  backgroundType: 'solid',
  backgroundGradientStart: '#ffffff',
  backgroundGradientEnd: '#f0f0f0',
  backgroundGradientDirection: 0,
  
  // Fill
  fillType: 'solid',
  fillColor: '#3b82f6',
  fillGradientStart: '#3b82f6',
  fillGradientEnd: '#1d4ed8',
  fillGradientDirection: 45,
  fillOpacity: 1,
  
  // Stroke
  strokeType: 'solid',
  strokeColor: '#1e40af',
  strokeWidth: 2,
  strokeOpacity: 1,
  strokeDashPattern: [5, 5],
};

/**
 * Universal parameter definitions that will be added to every template
 */
export const UNIVERSAL_PARAMETER_DEFINITIONS = {
  // Background Section
  backgroundColor: {
    type: 'color' as const,
    default: DEFAULT_UNIVERSAL_CONTROLS.backgroundColor,
    label: 'Background Color',
    category: 'Background'
  },
  backgroundType: {
    type: 'select' as const,
    options: [
      { value: 'transparent', label: 'Transparent' },
      { value: 'solid', label: 'Solid Color' },
      { value: 'gradient', label: 'Gradient' }
    ],
    default: DEFAULT_UNIVERSAL_CONTROLS.backgroundType,
    label: 'Background Type',
    category: 'Background'
  },
  backgroundGradientStart: {
    type: 'color' as const,
    default: DEFAULT_UNIVERSAL_CONTROLS.backgroundGradientStart,
    label: 'Gradient Start',
    category: 'Background',
    showIf: (params: any) => params.backgroundType === 'gradient'
  },
  backgroundGradientEnd: {
    type: 'color' as const,
    default: DEFAULT_UNIVERSAL_CONTROLS.backgroundGradientEnd,
    label: 'Gradient End',
    category: 'Background',
    showIf: (params: any) => params.backgroundType === 'gradient'
  },
  backgroundGradientDirection: {
    type: 'slider' as const,
    min: 0,
    max: 360,
    step: 15,
    default: DEFAULT_UNIVERSAL_CONTROLS.backgroundGradientDirection,
    label: 'Gradient Direction',
    category: 'Background',
    showIf: (params: any) => params.backgroundType === 'gradient'
  },
  
  // Fill Section
  fillType: {
    type: 'select' as const,
    options: [
      { value: 'none', label: 'None' },
      { value: 'solid', label: 'Solid Color' },
      { value: 'gradient', label: 'Gradient' }
    ],
    default: DEFAULT_UNIVERSAL_CONTROLS.fillType,
    label: 'Fill Type',
    category: 'Fill'
  },
  fillColor: {
    type: 'color' as const,
    default: DEFAULT_UNIVERSAL_CONTROLS.fillColor,
    label: 'Fill Color',
    category: 'Fill',
    showIf: (params: any) => params.fillType === 'solid'
  },
  fillGradientStart: {
    type: 'color' as const,
    default: DEFAULT_UNIVERSAL_CONTROLS.fillGradientStart,
    label: 'Gradient Start',
    category: 'Fill',
    showIf: (params: any) => params.fillType === 'gradient'
  },
  fillGradientEnd: {
    type: 'color' as const,
    default: DEFAULT_UNIVERSAL_CONTROLS.fillGradientEnd,
    label: 'Gradient End',
    category: 'Fill',
    showIf: (params: any) => params.fillType === 'gradient'
  },
  fillGradientDirection: {
    type: 'slider' as const,
    min: 0,
    max: 360,
    step: 15,
    default: DEFAULT_UNIVERSAL_CONTROLS.fillGradientDirection,
    label: 'Gradient Direction',
    category: 'Fill',
    showIf: (params: any) => params.fillType === 'gradient'
  },
  fillOpacity: {
    type: 'slider' as const,
    min: 0,
    max: 1,
    step: 0.05,
    default: DEFAULT_UNIVERSAL_CONTROLS.fillOpacity,
    label: 'Fill Opacity',
    category: 'Fill',
    showIf: (params: any) => params.fillType !== 'none'
  },
  
  // Stroke Section
  strokeType: {
    type: 'select' as const,
    options: [
      { value: 'none', label: 'None' },
      { value: 'solid', label: 'Solid' },
      { value: 'dashed', label: 'Dashed' },
      { value: 'dotted', label: 'Dotted' }
    ],
    default: DEFAULT_UNIVERSAL_CONTROLS.strokeType,
    label: 'Stroke Type',
    category: 'Stroke'
  },
  strokeColor: {
    type: 'color' as const,
    default: DEFAULT_UNIVERSAL_CONTROLS.strokeColor,
    label: 'Stroke Color',
    category: 'Stroke',
    showIf: (params: any) => params.strokeType !== 'none'
  },
  strokeWidth: {
    type: 'slider' as const,
    min: 0,
    max: 10,
    step: 0.5,
    default: DEFAULT_UNIVERSAL_CONTROLS.strokeWidth,
    label: 'Stroke Width',
    category: 'Stroke',
    showIf: (params: any) => params.strokeType !== 'none'
  },
  strokeOpacity: {
    type: 'slider' as const,
    min: 0,
    max: 1,
    step: 0.05,
    default: DEFAULT_UNIVERSAL_CONTROLS.strokeOpacity,
    label: 'Stroke Opacity',
    category: 'Stroke',
    showIf: (params: any) => params.strokeType !== 'none'
  }
};

/**
 * Apply universal controls to a canvas context
 */
export function applyUniversalBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  controls: Partial<UniversalControls>
): void {
  const {
    backgroundColor = DEFAULT_UNIVERSAL_CONTROLS.backgroundColor,
    backgroundType = DEFAULT_UNIVERSAL_CONTROLS.backgroundType,
    backgroundGradientStart = DEFAULT_UNIVERSAL_CONTROLS.backgroundGradientStart,
    backgroundGradientEnd = DEFAULT_UNIVERSAL_CONTROLS.backgroundGradientEnd,
    backgroundGradientDirection = DEFAULT_UNIVERSAL_CONTROLS.backgroundGradientDirection
  } = controls;

  ctx.save();

  switch (backgroundType) {
    case 'transparent':
      // Do nothing - leave transparent
      break;
      
    case 'solid':
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
      break;
      
    case 'gradient':
      const angle = (backgroundGradientDirection * Math.PI) / 180;
      const gradient = ctx.createLinearGradient(
        0, 0,
        Math.cos(angle) * width,
        Math.sin(angle) * height
      );
      gradient.addColorStop(0, backgroundGradientStart);
      gradient.addColorStop(1, backgroundGradientEnd);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      break;
  }

  ctx.restore();
}

/**
 * Apply universal fill styles to a path
 */
export function applyUniversalFill(
  ctx: CanvasRenderingContext2D,
  bounds: { width: number; height: number; centerX: number; centerY: number },
  controls: Partial<UniversalControls>
): void {
  const {
    fillType = DEFAULT_UNIVERSAL_CONTROLS.fillType,
    fillColor = DEFAULT_UNIVERSAL_CONTROLS.fillColor,
    fillGradientStart = DEFAULT_UNIVERSAL_CONTROLS.fillGradientStart,
    fillGradientEnd = DEFAULT_UNIVERSAL_CONTROLS.fillGradientEnd,
    fillGradientDirection = DEFAULT_UNIVERSAL_CONTROLS.fillGradientDirection,
    fillOpacity = DEFAULT_UNIVERSAL_CONTROLS.fillOpacity
  } = controls;

  if (fillType === 'none') return;

  ctx.save();
  ctx.globalAlpha = fillOpacity;

  switch (fillType) {
    case 'solid':
      ctx.fillStyle = fillColor;
      break;
      
    case 'gradient':
      const angle = (fillGradientDirection * Math.PI) / 180;
      const gradient = ctx.createLinearGradient(
        bounds.centerX - Math.cos(angle) * bounds.width / 2,
        bounds.centerY - Math.sin(angle) * bounds.height / 2,
        bounds.centerX + Math.cos(angle) * bounds.width / 2,
        bounds.centerY + Math.sin(angle) * bounds.height / 2
      );
      gradient.addColorStop(0, fillGradientStart);
      gradient.addColorStop(1, fillGradientEnd);
      ctx.fillStyle = gradient;
      break;
  }

  ctx.fill();
  ctx.restore();
}

/**
 * Apply universal stroke styles to a path
 */
export function applyUniversalStroke(
  ctx: CanvasRenderingContext2D,
  controls: Partial<UniversalControls>
): void {
  const {
    strokeType = DEFAULT_UNIVERSAL_CONTROLS.strokeType,
    strokeColor = DEFAULT_UNIVERSAL_CONTROLS.strokeColor,
    strokeWidth = DEFAULT_UNIVERSAL_CONTROLS.strokeWidth,
    strokeOpacity = DEFAULT_UNIVERSAL_CONTROLS.strokeOpacity,
    strokeDashPattern = DEFAULT_UNIVERSAL_CONTROLS.strokeDashPattern
  } = controls;

  if (strokeType === 'none') return;

  ctx.save();
  ctx.globalAlpha = strokeOpacity;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  switch (strokeType) {
    case 'solid':
      ctx.setLineDash([]);
      break;
    case 'dashed':
      ctx.setLineDash([strokeWidth * 3, strokeWidth * 2]);
      break;
    case 'dotted':
      ctx.setLineDash([strokeWidth, strokeWidth]);
      break;
  }

  ctx.stroke();
  ctx.restore();
}

/**
 * Get bounds from a list of points
 */
export function getBoundsFromPoints(points: Array<{ x: number; y: number }>): {
  width: number;
  height: number;
  centerX: number;
  centerY: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
} {
  if (points.length === 0) {
    return { width: 0, height: 0, centerX: 0, centerY: 0, minX: 0, maxX: 0, minY: 0, maxY: 0 };
  }

  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  return {
    minX,
    maxX,
    minY,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2
  };
}