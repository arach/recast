/**
 * Universal Parameters Definition
 * 
 * These parameters are automatically available to all templates
 */

import { ParameterDefinitions, PARAMETER_CATEGORIES } from './parameter-schema';

export const UNIVERSAL_PARAMETERS: ParameterDefinitions = {
  // Background Parameters
  backgroundType: {
    type: 'select',
    default: 'transparent',
    options: [
      { value: 'transparent', label: 'Transparent' },
      { value: 'solid', label: 'Solid Color' },
      { value: 'gradient', label: 'Gradient' }
    ],
    label: 'Background Type',
    category: PARAMETER_CATEGORIES.BACKGROUND
  },
  
  backgroundColor: {
    type: 'color',
    default: '#ffffff',
    label: 'Background Color',
    category: PARAMETER_CATEGORIES.BACKGROUND,
    when: { backgroundType: ['solid', 'gradient'] }
  },
  
  backgroundOpacity: {
    type: 'slider',
    default: 1,
    min: 0,
    max: 1,
    step: 0.05,
    label: 'Background Opacity',
    category: PARAMETER_CATEGORIES.BACKGROUND,
    when: { backgroundType: ['solid', 'gradient'] }
  },
  
  backgroundGradientStart: {
    type: 'color',
    default: '#ffffff',
    label: 'Gradient Start',
    category: PARAMETER_CATEGORIES.BACKGROUND,
    when: { backgroundType: 'gradient' }
  },
  
  backgroundGradientEnd: {
    type: 'color',
    default: '#f0f0f0',
    label: 'Gradient End',
    category: PARAMETER_CATEGORIES.BACKGROUND,
    when: { backgroundType: 'gradient' }
  },
  
  backgroundGradientDirection: {
    type: 'slider',
    default: 0,
    min: 0,
    max: 360,
    step: 15,
    label: 'Gradient Direction',
    category: PARAMETER_CATEGORIES.BACKGROUND,
    unit: '°',
    when: { backgroundType: 'gradient' }
  },
  
  // Fill Parameters
  fillType: {
    type: 'select',
    default: 'solid',
    options: [
      { value: 'none', label: 'None' },
      { value: 'solid', label: 'Solid Color' },
      { value: 'gradient', label: 'Gradient' }
    ],
    label: 'Fill Type',
    category: PARAMETER_CATEGORIES.FILL
  },
  
  fillColor: {
    type: 'color',
    default: '#3b82f6',
    label: 'Fill Color',
    category: PARAMETER_CATEGORIES.FILL,
    when: { fillType: ['solid', 'gradient'] }
  },
  
  fillOpacity: {
    type: 'slider',
    default: 1,
    min: 0,
    max: 1,
    step: 0.05,
    label: 'Fill Opacity',
    category: PARAMETER_CATEGORIES.FILL,
    when: { fillType: ['solid', 'gradient'] }
  },
  
  fillGradientStart: {
    type: 'color',
    default: '#3b82f6',
    label: 'Fill Gradient Start',
    category: PARAMETER_CATEGORIES.FILL,
    when: { fillType: 'gradient' }
  },
  
  fillGradientEnd: {
    type: 'color',
    default: '#1e40af',
    label: 'Fill Gradient End',
    category: PARAMETER_CATEGORIES.FILL,
    when: { fillType: 'gradient' }
  },
  
  fillGradientDirection: {
    type: 'slider',
    default: 0,
    min: 0,
    max: 360,
    step: 15,
    label: 'Fill Gradient Direction',
    category: PARAMETER_CATEGORIES.FILL,
    unit: '°',
    when: { fillType: 'gradient' }
  },
  
  // Stroke Parameters
  strokeType: {
    type: 'select',
    default: 'none',
    options: [
      { value: 'none', label: 'None' },
      { value: 'solid', label: 'Solid' },
      { value: 'dashed', label: 'Dashed' },
      { value: 'dotted', label: 'Dotted' }
    ],
    label: 'Stroke Type',
    category: PARAMETER_CATEGORIES.STROKE
  },
  
  strokeColor: {
    type: 'color',
    default: '#1e40af',
    label: 'Stroke Color',
    category: PARAMETER_CATEGORIES.STROKE,
    when: { strokeType: ['solid', 'dashed', 'dotted'] }
  },
  
  strokeWidth: {
    type: 'slider',
    default: 2,
    min: 0,
    max: 20,
    step: 0.5,
    label: 'Stroke Width',
    category: PARAMETER_CATEGORIES.STROKE,
    unit: 'px',
    when: { strokeType: ['solid', 'dashed', 'dotted'] }
  },
  
  strokeOpacity: {
    type: 'slider',
    default: 1,
    min: 0,
    max: 1,
    step: 0.05,
    label: 'Stroke Opacity',
    category: PARAMETER_CATEGORIES.STROKE,
    when: { strokeType: ['solid', 'dashed', 'dotted'] }
  },
  
  strokeDashSize: {
    type: 'slider',
    default: 5,
    min: 1,
    max: 20,
    step: 1,
    label: 'Dash Size',
    category: PARAMETER_CATEGORIES.STROKE,
    unit: 'px',
    when: { strokeType: ['dashed', 'dotted'] }
  },
  
  strokeGapSize: {
    type: 'slider',
    default: 5,
    min: 1,
    max: 20,
    step: 1,
    label: 'Gap Size',
    category: PARAMETER_CATEGORIES.STROKE,
    unit: 'px',
    when: { strokeType: ['dashed', 'dotted'] }
  }
};

// Helper to apply universal styles
export function applyUniversalStyles(
  ctx: CanvasRenderingContext2D,
  params: Record<string, any>
): void {
  // Apply fill styles
  if (params.fillType !== 'none') {
    ctx.globalAlpha = params.fillOpacity ?? 1;
    
    if (params.fillType === 'gradient' && params.fillGradientStart && params.fillGradientEnd) {
      // Will be handled by template with gradient creation
      // This is just to set the alpha
    } else if (params.fillColor) {
      ctx.fillStyle = params.fillColor;
    }
  }
  
  // Apply stroke styles
  if (params.strokeType !== 'none') {
    ctx.globalAlpha = params.strokeOpacity ?? 1;
    ctx.strokeStyle = params.strokeColor || '#000000';
    ctx.lineWidth = params.strokeWidth || 1;
    
    if (params.strokeType === 'dashed') {
      ctx.setLineDash([params.strokeDashSize || 5, params.strokeGapSize || 5]);
    } else if (params.strokeType === 'dotted') {
      ctx.setLineDash([params.strokeDashSize || 2, params.strokeGapSize || 3]);
    } else {
      ctx.setLineDash([]);
    }
  }
}