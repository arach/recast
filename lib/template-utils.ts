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

/**
 * Extract common template parameters with defaults
 * Eliminates boilerplate parameter extraction in templates
 */
export function extractTemplateParams(params: any) {
  // Universal theme colors
  const theme = {
    fillColor: params.fillColor || '#000000',
    strokeColor: params.strokeColor || '#000000', 
    fillOpacity: params.fillOpacity ?? 1,
    strokeOpacity: params.strokeOpacity ?? 1,
  };

  // Common animation parameters
  const animation = {
    animationSpeed: params.animationSpeed || 1,
    animationIntensity: params.animationIntensity || 0.5,
  };

  // Return flattened params with organized groups
  return {
    ...flattenParameters(params),
    theme,
    animation,
  };
}

/**
 * Nuclear parameter utility system - eliminates all template boilerplate
 */

// Core wave parameters with intelligent defaults
const extractCoreParams = (params: any) => ({
  frequency: params.frequency ?? 1.0,
  amplitude: params.amplitude ?? 100,
  complexity: params.complexity ?? 0.5,
  chaos: params.chaos ?? 0.2,
  damping: params.damping ?? 0.8,
  layers: params.layers ?? 3,
  radius: params.radius ?? 50,
});

// Theme colors with universal consistency
const extractThemeParams = (params: any) => ({
  fillColor: params.fillColor ?? '#000000',
  strokeColor: params.strokeColor ?? '#000000', 
  backgroundColor: params.backgroundColor ?? '#ffffff',
  fillOpacity: params.fillOpacity ?? 1,
  strokeOpacity: params.strokeOpacity ?? 1,
});

// Animation parameters with time helpers
const extractAnimationParams = (params: any, time: number) => {
  const animationSpeed = params.animationSpeed ?? 1;
  const pulseSpeed = params.pulseSpeed ?? 1.5;
  
  return {
    animationSpeed,
    pulseSpeed,
    animTime: time * animationSpeed,
    animationPhase: time * (params.frequency ?? 1.0),
    breathingPhase: time * 0.8,
    pulsePhase: time * pulseSpeed,
  };
};

// Standard positioning calculations
const extractPositionParams = (width: number, height: number, params: any) => {
  const minDim = Math.min(width, height);
  const baseScale = minDim / 350; // Standard scaling
  
  return {
    centerX: width / 2,
    centerY: height / 2,
    minDim,
    baseScale,
    scaledAmplitude: (params.amplitude ?? 100) * baseScale,
  };
};

// Math conversion utilities
const extractMathParams = (params: any) => ({
  // Degrees to radians conversions
  phaseShift: (params.phaseShift ?? 0) * Math.PI / 180,
  shapeRotation: (params.shapeRotation ?? 0) * Math.PI / 180,
  perspectiveAngle: (params.perspectiveAngle ?? 30) * Math.PI / 180,
  rotationX: (params.rotationX ?? 0) * Math.PI / 180,
  rotationY: (params.rotationY ?? 0) * Math.PI / 180,
  
  // Utility functions
  toRadians: (degrees: number) => degrees * Math.PI / 180,
  scaleToCanvas: (value: number, canvasSize: number) => (value / 100) * canvasSize,
});

// Layer rendering helper
const createLayerRenderer = (layers: number, damping: number = 0.8) => ({
  layers,
  damping,
  
  // Iterator for layer-based rendering
  forEach: (callback: (layer: number, alpha: number, size: number) => void, baseSize: number = 1) => {
    for (let layer = 0; layer < layers; layer++) {
      const layerAlpha = 1 - layer * 0.2;
      const layerSize = baseSize * Math.pow(damping, layer);
      callback(layer, layerAlpha, layerSize);
    }
  }
});

// Effects parameters
const extractEffectParams = (params: any) => ({
  glowIntensity: params.glowIntensity ?? 0.8,
  innerGlow: params.innerGlow ?? 0.15,
  turbulence: params.turbulence ?? 0.3,
  flicker: params.flicker ?? 0.15,
  electricSpark: params.electricSpark ?? 0.4,
  organicVariation: params.organicVariation ?? 0.08,
  surfaceTension: params.surfaceTension ?? 0.7,
  viscosity: params.viscosity ?? 0.4,
});

/**
 * Parameter loader utility - reads template's parameter exports and processes them
 * 
 * @param params Raw parameters from user input
 * @param ctx Canvas context for background application
 * @param width Canvas width for positioning calculations
 * @param height Canvas height for positioning calculations  
 * @param time Animation time for time-based calculations
 * @param templateModule Optional template module with parameter exports
 */
function loadParams(
  params: any,
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  time: number = 0,
  templateModule?: any
) {
  // Apply background first
  applyUniversalBackground(ctx, width, height, params);
  
  // Extract defaults from template's parameter exports
  let defaults = {};
  if (templateModule?.parameters) {
    defaults = Object.entries(templateModule.parameters).reduce((acc, [key, paramDef]: [string, any]) => {
      acc[key] = paramDef.default;
      return acc;
    }, {} as Record<string, any>);
  }
  
  // Process type conversions based on parameter definitions
  const processedParams = { ...defaults };
  
  if (templateModule?.parameters && params) {
    Object.entries(templateModule.parameters).forEach(([key, paramDef]: [string, any]) => {
      if (params[key] !== undefined) {
        let value = params[key];
        
        // Type conversions based on parameter definition
        if (paramDef.unit === '°') {
          // Convert degrees to radians
          value = value * Math.PI / 180;
        } else if (paramDef.unit === '%' && paramDef.type === 'slider') {
          // Convert percentage to 0-1 range if needed (context dependent)
          // For now, keep as-is since amplitude: 50% might mean 50 pixels
        }
        
        // Range validation
        if (paramDef.type === 'slider' && paramDef.min !== undefined && paramDef.max !== undefined) {
          value = Math.max(paramDef.min, Math.min(paramDef.max, value));
        }
        
        processedParams[key] = value;
      }
    });
  }
  
  // Merge with any additional user params not defined in template
  const mergedParams = {
    ...processedParams,
    ...Object.fromEntries(
      Object.entries(params || {}).filter(([key]) => 
        !templateModule?.parameters || !templateModule.parameters[key]
      )
    )
  };
  
  // Add universal theme colors
  const finalParams = {
    ...mergedParams,
    fillColor: params?.fillColor || mergedParams.fillColor || '#000000',
    strokeColor: params?.strokeColor || mergedParams.strokeColor || '#000000',
    fillOpacity: params?.fillOpacity ?? mergedParams.fillOpacity ?? 1,
    strokeOpacity: params?.strokeOpacity ?? mergedParams.strokeOpacity ?? 1,
  };
  
  // Add positioning helpers
  const centerX = width / 2;
  const centerY = height / 2;
  const baseScale = Math.min(width, height) / 350;
  
  // Add animation helpers
  const animTime = time * (finalParams.animationSpeed || 1);
  
  return {
    ...finalParams,
    
    // Positioning helpers
    centerX,
    centerY,
    baseScale,
    
    // Animation helpers  
    animTime,
    breathingPhase: time * 0.8,
    
    // Theme organization
    theme: {
      fillColor: finalParams.fillColor,
      strokeColor: finalParams.strokeColor,
      fillOpacity: finalParams.fillOpacity,
      strokeOpacity: finalParams.strokeOpacity,
    }
  };
}

/**
 * Parameter utilities namespace for templates
 */
export const params = {
  /**
   * Load and process template parameters
   * 
   * @example
   * const P = utils.params.load(params, ctx, width, height, time, 'wave-bars');
   * const { barCount, frequency } = P;
   */
  load: loadParams
};

/**
 * LEGACY: setupTemplate - backward compatibility
 * Use utils.params.load() instead
 */
export function setupTemplate(
  ctx: CanvasRenderingContext2D, 
  width: number, 
  height: number, 
  params: any, 
  time: number = 0,
  templateId?: string
) {
  return loadParams(params, ctx, width, height, time, templateId);
}

/**
 * Legacy setupTemplate without time parameter
 */
export function setupTemplateStatic(ctx: CanvasRenderingContext2D, width: number, height: number, params: any) {
  return setupTemplate(ctx, width, height, params, 0);
}