// ◯ Golden Circle
const PARAMETERS = {
  // Universal Background Controls
  backgroundColor: { type: 'color', default: "#fefefe", label: 'Background Color', category: 'Background' },
  backgroundType: { type: 'select', options: [{"value":"transparent","label":"Transparent"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "solid", label: 'Background Type', category: 'Background' },
  backgroundGradientStart: { type: 'color', default: "#ffffff", label: 'Gradient Start', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientEnd: { type: 'color', default: "#f5f5f5", label: 'Gradient End', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 45, label: 'Gradient Direction', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  
  // Universal Fill Controls
  fillType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "gradient", label: 'Fill Type', category: 'Fill' },
  fillColor: { type: 'color', default: "#d4a574", label: 'Fill Color', category: 'Fill', showIf: (params)=>params.fillType === 'solid' },
  fillGradientStart: { type: 'color', default: "#d4a574", label: 'Gradient Start', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientEnd: { type: 'color', default: "#b8935f", label: 'Gradient End', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 90, label: 'Gradient Direction', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.9, label: 'Fill Opacity', category: 'Fill', showIf: (params)=>params.fillType !== 'none' },
  
  // Universal Stroke Controls
  strokeType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid"},{"value":"dashed","label":"Dashed"},{"value":"dotted","label":"Dotted"}], default: "none", label: 'Stroke Type', category: 'Stroke' },
  strokeColor: { type: 'color', default: "#b8935f", label: 'Stroke Color', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeWidth: { type: 'slider', min: 0, max: 10, step: 0.5, default: 2, label: 'Stroke Width', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Stroke Opacity', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  
  // Template-specific parameters - Circle fundamentals (shape definition)
  circleStyle: {
    type: 'slider',
    min: 0,
    max: 4,
    step: 1,
    default: 0,
    label: 'Circle Style (0=Perfect, 1=Organic, 2=Spiral, 3=Segmented, 4=Breathing)',
    category: 'Shape'
  },
  
  // Mathematical proportions using golden ratio and fibonacci
  goldenProportion: { type: 'slider', min: 0.5, max: 2, step: 0.05, default: 1.618, label: 'Golden Ratio (φ=1.618)', category: 'Mathematics' },
  fibonacciInfluence: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.3, label: 'Fibonacci Curve Influence', category: 'Mathematics' },
  organicVariation: { type: 'slider', min: 0, max: 0.3, step: 0.01, default: 0.08, label: 'Natural Variation', category: 'Shape' },
  
  // Geometric precision vs organic flow
  mathematicalPurity: { type: 'slider', min: 0.7, max: 1, step: 0.01, default: 0.9, label: 'Geometric Precision', category: 'Mathematics' },
  concentricLayers: { type: 'slider', min: 1, max: 4, step: 1, default: 1, label: 'Concentric Rings', category: 'Shape' },
  spiralTightness: { type: 'slider', min: 0.1, max: 2, step: 0.1, default: 0.8, label: 'Spiral Tightness', category: 'Shape' },
  
  // Brand enhancement - removed duplicate border controls as they're in universal stroke
  fillStyle: {
    type: 'slider',
    min: 0,
    max: 3,
    step: 1,
    default: 2,
    label: 'Fill (0=None, 1=Solid, 2=Radial, 3=Fibonacci Gradient)',
    category: 'Effects'
  },
  
  // Professional color system
  colorMode: { 
    type: 'select', 
    options: [
      { value: 'theme', label: 'Use Theme Colors' },
      { value: 'golden', label: 'Golden Palette' },
      { value: 'custom', label: 'Custom Colors' }
    ],
    default: 'theme',
    label: 'Color Mode',
    category: 'Colors'
  },
  warmth: { type: 'slider', min: 0.3, max: 1, step: 0.05, default: 0.7, label: 'Color Warmth', category: 'Colors' },
  sophistication: { type: 'slider', min: 0.4, max: 0.9, step: 0.05, default: 0.6, label: 'Color Sophistication', category: 'Colors' },
  
  // Subtle effects for brand sophistication  
  innerGlow: { type: 'slider', min: 0, max: 0.4, step: 0.05, default: 0.15, label: 'Inner Radiance', category: 'Effects' },
  breathingMotion: { type: 'slider', min: 0, max: 0.2, step: 0.02, default: 0.05, label: 'Subtle Animation', category: 'Effects' }
};

function applyUniversalBackground(ctx, width, height, params) {
  if (!params.backgroundType || params.backgroundType === 'transparent') return;
  
  if (params.backgroundType === 'solid') {
    ctx.fillStyle = params.backgroundColor || '#fefefe';
    ctx.fillRect(0, 0, width, height);
  } else if (params.backgroundType === 'gradient') {
    const direction = (params.backgroundGradientDirection || 0) * (Math.PI / 180);
    const x1 = width / 2 - Math.cos(direction) * width / 2;
    const y1 = height / 2 - Math.sin(direction) * height / 2;
    const x2 = width / 2 + Math.cos(direction) * width / 2;
    const y2 = height / 2 + Math.sin(direction) * height / 2;
    
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, params.backgroundGradientStart || '#ffffff');
    gradient.addColorStop(1, params.backgroundGradientEnd || '#f5f5f5');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
}

function drawVisualization(ctx, width, height, params, _generator, time) {
  // Parameter compatibility layer
  if (params.customParameters) {
    params.fillColor = params.fillColor || params.customParameters.fillColor;
    params.strokeColor = params.strokeColor || params.customParameters.strokeColor;
    params.backgroundColor = params.backgroundColor || params.customParameters.backgroundColor;
    params.textColor = params.textColor || params.customParameters.textColor;
    
    Object.keys(params.customParameters).forEach(key => {
      if (params[key] === undefined) {
        params[key] = params.customParameters[key];
      }
    });
  }

  // Apply universal background
  applyUniversalBackground(ctx, width, height, params);
  
  // Get theme colors with fallbacks
  const fillColor = params.fillColor || '#d4a574'; // Golden color default
  const strokeColor = params.strokeColor || '#b8935f';

  // Extract parameters
  const centerX = width / 2;
  const centerY = height / 2;
  const circleStyleNum = Math.round(params.circleStyle || 0);
  const goldenProportion = params.goldenProportion || 1.618;
  const fibonacciInfluence = params.fibonacciInfluence || 0.3;
  const organicVariation = params.organicVariation || 0.08;
  const mathematicalPurity = params.mathematicalPurity || 0.9;
  const concentricLayers = Math.round(params.concentricLayers || 1);
  const spiralTightness = params.spiralTightness || 0.8;
  const fillStyleNum = Math.round(params.fillStyle || 2);
  const colorMode = params.colorMode || 'theme';
  const warmth = params.warmth || 0.7;
  const sophistication = params.sophistication || 0.6;
  const innerGlow = params.innerGlow || 0.15;
  const breathingMotion = params.breathingMotion || 0.05;

  // Golden ratio calculations for perfect proportions
  const phi = goldenProportion;
  const logoSize = Math.min(width, height) * 0.55; // Brand-appropriate sizing
  const baseRadius = logoSize / 2;
  
  // Breathing animation - very subtle for brand use
  const breathingPhase = time * 0.8;
  const breathingPulse = 1 + Math.sin(breathingPhase) * breathingMotion;
  const animatedRadius = baseRadius * breathingPulse;

  // Create sophisticated color palette
  const brandColors = createSophisticatedPalette(fillColor, strokeColor, colorMode, warmth, sophistication);

  // Generate circle path based on style
  const circlePath = generateGoldenCircle(
    circleStyleNum, centerX, centerY, animatedRadius,
    phi, fibonacciInfluence, organicVariation, mathematicalPurity, spiralTightness, time
  );

  // Render inner glow for sophistication (larger sizes only)
  if (innerGlow > 0.05 && Math.min(width, height) > 80) {
    renderInnerGlow(ctx, circlePath, brandColors, innerGlow, animatedRadius);
  }

  // Render concentric layers
  for (let layer = concentricLayers - 1; layer >= 0; layer--) {
    const layerRadius = animatedRadius * (1 - layer * 0.15);
    const layerAlpha = 1 - layer * 0.2;
    const layerPath = generateGoldenCircle(
      circleStyleNum, centerX, centerY, layerRadius,
      phi, fibonacciInfluence * (1 - layer * 0.3), organicVariation, mathematicalPurity, spiralTightness, time
    );
    
    renderCircleLayer(ctx, layerPath, brandColors, fillStyleNum, layerAlpha, centerX, centerY, layerRadius, phi, params);
  }

  // Render universal stroke if specified
  if (params.strokeType !== 'none') {
    renderUniversalStroke(ctx, circlePath, params);
  }

  function generateGoldenCircle(style, centerX, centerY, radius, phi, fibInfluence, organic, purity, spiralTight, time) {
    const points = [];
    
    switch (style) {
      case 0: // Perfect circle with golden ratio proportions
        const perfectPoints = Math.round(8 + phi * 4); // Golden ratio determines point count
        for (let i = 0; i < perfectPoints; i++) {
          const angle = (i / perfectPoints) * Math.PI * 2;
          const perfectRadius = radius * purity + radius * (1 - purity) * (1 + Math.sin(angle * phi) * organic);
          
          points.push({
            x: centerX + Math.cos(angle) * perfectRadius,
            y: centerY + Math.sin(angle) * perfectRadius,
            angle: angle
          });
        }
        break;
        
      case 1: // Organic circle with natural variation
        const organicPoints = Math.round(12 + organic * 20);
        for (let i = 0; i < organicPoints; i++) {
          const t = i / organicPoints;
          const angle = t * Math.PI * 2;
          
          // Natural organic variation using multiple harmonics
          const organic1 = Math.sin(angle * 3 + time * 0.5) * organic * 0.3;
          const organic2 = Math.sin(angle * 5 + time * 0.3) * organic * 0.15;
          const organic3 = Math.sin(angle * phi + time * 0.2) * organic * 0.1;
          
          const organicRadius = radius * (1 + organic1 + organic2 + organic3);
          
          points.push({
            x: centerX + Math.cos(angle) * organicRadius,
            y: centerY + Math.sin(angle) * organicRadius,
            angle: angle,
            organic: organic1 + organic2
          });
        }
        break;
        
      case 2: // Fibonacci spiral circle
        const spiralPoints = Math.round(8 + fibInfluence * 16);
        for (let i = 0; i < spiralPoints; i++) {
          const t = i / spiralPoints;
          const angle = t * Math.PI * 2;
          
          // Fibonacci spiral influence
          const spiralRadius = radius * (1 + Math.sin(angle * phi * spiralTight) * fibInfluence * 0.2);
          const spiralOffset = fibInfluence * 10 * Math.sin(angle * phi);
          
          points.push({
            x: centerX + Math.cos(angle) * spiralRadius + spiralOffset,
            y: centerY + Math.sin(angle) * spiralRadius,
            angle: angle
          });
        }
        break;
        
      case 3: // Segmented circle (modern/geometric)
        const segments = Math.round(6 + phi * 2); // Golden ratio segments
        for (let i = 0; i < segments; i++) {
          const angle = (i / segments) * Math.PI * 2;
          const segmentRadius = radius * (0.95 + Math.sin(angle * 2) * organic * 0.1);
          
          points.push({
            x: centerX + Math.cos(angle) * segmentRadius,
            y: centerY + Math.sin(angle) * segmentRadius,
            angle: angle
          });
        }
        break;
        
      case 4: // Breathing circle with subtle pulsing
        const breathingPoints = Math.round(10 + phi * 3);
        for (let i = 0; i < breathingPoints; i++) {
          const angle = (i / breathingPoints) * Math.PI * 2;
          const breathPulse = 1 + Math.sin(angle * 2 + time * 2) * organic * 0.4;
          const breathRadius = radius * breathPulse;
          
          points.push({
            x: centerX + Math.cos(angle) * breathRadius,
            y: centerY + Math.sin(angle) * breathRadius,
            angle: angle
          });
        }
        break;
    }
    
    return points;
  }

  function createSophisticatedPalette(fillColor, strokeColor, colorMode, warmth, sophistication) {
    // Helper to convert hex to HSL
    const hexToHsl = (hex) => {
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
    };
    
    if (colorMode === 'theme') {
      // Use theme colors as base
      const [fillHue, fillSat, fillLum] = hexToHsl(fillColor);
      const [strokeHue, strokeSat, strokeLum] = hexToHsl(strokeColor);
      
      const sat = fillSat * sophistication;
      const lightBase = fillLum;
      
      return {
        primary: fillColor,
        secondary: strokeColor,
        accent: `hsl(${fillHue}, ${sat * 1.2}%, ${Math.max(20, lightBase - 15)}%)`,
        warm: `hsl(${fillHue + 15}, ${sat * 0.8}%, ${Math.min(90, lightBase + warmth * 20)}%)`,
        sophisticated: `hsl(${fillHue}, ${sat * 0.6}%, ${Math.min(85, lightBase + 25)}%)`,
        depth: `hsl(${fillHue}, ${sat * 1.4}%, ${Math.max(15, lightBase - 25)}%)`
      };
    } else if (colorMode === 'golden') {
      // Classic golden palette
      const hue = 38; // Golden hue
      const sat = sophistication * 80;
      const lightBase = 45 + warmth * 20;
      
      return {
        primary: `hsl(${hue}, ${sat}%, ${lightBase}%)`,
        secondary: `hsl(${hue + 20}, ${sat * 0.8}%, ${lightBase + 15}%)`,
        accent: `hsl(${hue - 15}, ${sat * 1.2}%, ${lightBase - 10}%)`,
        warm: `hsl(${hue + 30}, ${sat * 0.6}%, ${lightBase + 25}%)`,
        sophisticated: `hsl(${hue}, ${sat * 0.4}%, ${lightBase + 35}%)`,
        depth: `hsl(${hue - 10}, ${sat * 1.4}%, ${lightBase - 20}%)`
      };
    } else {
      // Custom mode - use fill color as base hue
      const [baseHue] = hexToHsl(fillColor);
      const sat = sophistication * 80;
      const lightBase = 45 + warmth * 20;
      
      return {
        primary: `hsl(${baseHue}, ${sat}%, ${lightBase}%)`,
        secondary: `hsl(${baseHue + 20}, ${sat * 0.8}%, ${lightBase + 15}%)`,
        accent: `hsl(${baseHue - 15}, ${sat * 1.2}%, ${lightBase - 10}%)`,
        warm: `hsl(${baseHue + 30}, ${sat * 0.6}%, ${lightBase + 25}%)`,
        sophisticated: `hsl(${baseHue}, ${sat * 0.4}%, ${lightBase + 35}%)`,
        depth: `hsl(${baseHue - 10}, ${sat * 1.4}%, ${lightBase - 20}%)`
      };
    }
  }

  function renderInnerGlow(ctx, points, colors, glow, radius) {
    ctx.save();
    ctx.globalAlpha = glow;
    
    const glowGradient = ctx.createRadialGradient(
      centerX, centerY, radius * 0.3,
      centerX, centerY, radius * 1.2
    );
    glowGradient.addColorStop(0, colors.warm);
    glowGradient.addColorStop(0.7, colors.sophisticated);
    glowGradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = glowGradient;
    drawSmoothCircle(ctx, points);
    ctx.fill();
    
    ctx.restore();
  }

  function renderCircleLayer(ctx, points, colors, fillStyle, alpha, centerX, centerY, radius, phi, params) {
    ctx.save();
    ctx.globalAlpha = alpha;
    
    // Draw the path first
    drawSmoothCircle(ctx, points);
    
    // Apply universal fill or template-specific fill
    if (params.fillType !== 'none' && fillStyle !== 0) {
      if (params.fillType === 'solid') {
        ctx.fillStyle = params.fillColor || colors.primary;
        ctx.globalAlpha = (params.fillOpacity || 1) * alpha;
        ctx.fill();
      } else if (params.fillType === 'gradient') {
        const angle = (params.fillGradientDirection || 90) * Math.PI / 180;
        const gradient = ctx.createLinearGradient(
          centerX - Math.cos(angle) * radius,
          centerY - Math.sin(angle) * radius,
          centerX + Math.cos(angle) * radius,
          centerY + Math.sin(angle) * radius
        );
        gradient.addColorStop(0, params.fillGradientStart || colors.secondary);
        gradient.addColorStop(1, params.fillGradientEnd || colors.primary);
        
        ctx.fillStyle = gradient;
        ctx.globalAlpha = (params.fillOpacity || 1) * alpha;
        ctx.fill();
      }
    }
    
    // Additional template-specific fill styles
    if (fillStyle === 2 && params.fillType === 'none') {
      // Radial gradient for depth (when universal fill is none)
      const radialGradient = ctx.createRadialGradient(
        centerX - radius * 0.3, centerY - radius * 0.3, 0,
        centerX, centerY, radius * 1.1
      );
      radialGradient.addColorStop(0, colors.secondary);
      radialGradient.addColorStop(0.6, colors.primary);
      radialGradient.addColorStop(1, colors.accent);
      
      ctx.fillStyle = radialGradient;
      ctx.fill();
    } else if (fillStyle === 3) {
      // Fibonacci gradient - mathematically sophisticated
      const fibGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
      );
      
      // Fibonacci-based color stops
      const fibNumbers = [0, 0.236, 0.382, 0.618, 1]; // Based on golden ratio
      fibGradient.addColorStop(fibNumbers[0], colors.warm);
      fibGradient.addColorStop(fibNumbers[1], colors.secondary);
      fibGradient.addColorStop(fibNumbers[2], colors.primary);
      fibGradient.addColorStop(fibNumbers[3], colors.accent);
      fibGradient.addColorStop(fibNumbers[4], colors.depth);
      
      ctx.fillStyle = fibGradient;
      ctx.fill();
    }
    
    ctx.restore();
  }

  function renderUniversalStroke(ctx, points, params) {
    if (params.strokeType === 'none') return;
    
    ctx.save();
    ctx.strokeStyle = params.strokeColor;
    ctx.lineWidth = params.strokeWidth || 2;
    ctx.globalAlpha = params.strokeOpacity || 1;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Set stroke pattern
    switch (params.strokeType) {
      case 'dashed':
        ctx.setLineDash([params.strokeWidth * 3, params.strokeWidth * 2]);
        break;
      case 'dotted':
        ctx.setLineDash([params.strokeWidth, params.strokeWidth]);
        break;
      default:
        ctx.setLineDash([]);
    }
    
    drawSmoothCircle(ctx, points);
    ctx.stroke();
    
    ctx.restore();
  }

  function drawSmoothCircle(ctx, points) {
    if (points.length < 3) return;
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    // Ultra-smooth curves for perfect circles
    for (let i = 1; i < points.length; i++) {
      const current = points[i];
      const previous = points[i - 1];
      const next = points[(i + 1) % points.length];
      
      const cp1x = previous.x + (current.x - (points[i - 2] || previous).x) * 0.3;
      const cp1y = previous.y + (current.y - (points[i - 2] || previous).y) * 0.3;
      const cp2x = current.x - (next.x - previous.x) * 0.3;
      const cp2y = current.y - (next.y - previous.y) * 0.3;
      
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, current.x, current.y);
    }
    
    // Close the circle smoothly
    const first = points[0];
    const last = points[points.length - 1];
    const cp1x = last.x + (first.x - points[points.length - 2].x) * 0.3;
    const cp1y = last.y + (first.y - points[points.length - 2].y) * 0.3;
    const cp2x = first.x - (points[1].x - last.x) * 0.3;
    const cp2y = first.y - (points[1].y - last.y) * 0.3;
    
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, first.x, first.y);
    ctx.closePath();
  }
}

export { drawVisualization };

export const metadata = {
  name: "◯ Golden Circle",
  description: "Fibonacci-based proportions with theme-aware colors and organic sophistication",
  defaultParams: {
    seed: "golden-circle-brand",
    circleStyle: 0,
    goldenProportion: 1.618,
    fibonacciInfluence: 0.3,
    organicVariation: 0.08,
    mathematicalPurity: 0.9,
    concentricLayers: 1,
    spiralTightness: 0.8,
    fillStyle: 2,
    colorMode: 'theme',
    warmth: 0.7,
    sophistication: 0.6,
    innerGlow: 0.15,
    breathingMotion: 0.05
  }
};

export const id = 'golden-circle';
export const name = "◯ Golden Circle";
export const description = "Fibonacci-based proportions with theme-aware colors and organic sophistication";
export const defaultParams = {
  seed: "golden-circle-brand",
  circleStyle: 0,
  goldenProportion: 1.618,
  fibonacciInfluence: 0.3,
  organicVariation: 0.08,
  mathematicalPurity: 0.9,
  concentricLayers: 1,
  spiralTightness: 0.8,
  fillStyle: 2,
  colorMode: 'theme',
  warmth: 0.7,
  sophistication: 0.6,
  innerGlow: 0.15,
  breathingMotion: 0.05
};
export const code = `// ◯ Golden Circle
const PARAMETERS = {
  // Universal Background Controls
  backgroundColor: { type: 'color', default: "#fefefe", label: 'Background Color', category: 'Background' },
  backgroundType: { type: 'select', options: [{"value":"transparent","label":"Transparent"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "solid", label: 'Background Type', category: 'Background' },
  backgroundGradientStart: { type: 'color', default: "#ffffff", label: 'Gradient Start', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientEnd: { type: 'color', default: "#f5f5f5", label: 'Gradient End', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 45, label: 'Gradient Direction', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  
  // Universal Fill Controls
  fillType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "gradient", label: 'Fill Type', category: 'Fill' },
  fillColor: { type: 'color', default: "#d4a574", label: 'Fill Color', category: 'Fill', showIf: (params)=>params.fillType === 'solid' },
  fillGradientStart: { type: 'color', default: "#d4a574", label: 'Gradient Start', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientEnd: { type: 'color', default: "#b8935f", label: 'Gradient End', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 90, label: 'Gradient Direction', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.9, label: 'Fill Opacity', category: 'Fill', showIf: (params)=>params.fillType !== 'none' },
  
  // Universal Stroke Controls
  strokeType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid"},{"value":"dashed","label":"Dashed"},{"value":"dotted","label":"Dotted"}], default: "none", label: 'Stroke Type', category: 'Stroke' },
  strokeColor: { type: 'color', default: "#b8935f", label: 'Stroke Color', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeWidth: { type: 'slider', min: 0, max: 10, step: 0.5, default: 2, label: 'Stroke Width', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Stroke Opacity', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  
  // Template-specific parameters - Circle fundamentals (shape definition)
  circleStyle: {
    type: 'slider',
    min: 0,
    max: 4,
    step: 1,
    default: 0,
    label: 'Circle Style (0=Perfect, 1=Organic, 2=Spiral, 3=Segmented, 4=Breathing)',
    category: 'Shape'
  },
  
  // Mathematical proportions using golden ratio and fibonacci
  goldenProportion: { type: 'slider', min: 0.5, max: 2, step: 0.05, default: 1.618, label: 'Golden Ratio (φ=1.618)', category: 'Mathematics' },
  fibonacciInfluence: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.3, label: 'Fibonacci Curve Influence', category: 'Mathematics' },
  organicVariation: { type: 'slider', min: 0, max: 0.3, step: 0.01, default: 0.08, label: 'Natural Variation', category: 'Shape' },
  
  // Geometric precision vs organic flow
  mathematicalPurity: { type: 'slider', min: 0.7, max: 1, step: 0.01, default: 0.9, label: 'Geometric Precision', category: 'Mathematics' },
  concentricLayers: { type: 'slider', min: 1, max: 4, step: 1, default: 1, label: 'Concentric Rings', category: 'Shape' },
  spiralTightness: { type: 'slider', min: 0.1, max: 2, step: 0.1, default: 0.8, label: 'Spiral Tightness', category: 'Shape' },
  
  // Brand enhancement - removed duplicate border controls as they're in universal stroke
  fillStyle: {
    type: 'slider',
    min: 0,
    max: 3,
    step: 1,
    default: 2,
    label: 'Fill (0=None, 1=Solid, 2=Radial, 3=Fibonacci Gradient)',
    category: 'Effects'
  },
  
  // Professional color system
  colorMode: { 
    type: 'select', 
    options: [
      { value: 'theme', label: 'Use Theme Colors' },
      { value: 'golden', label: 'Golden Palette' },
      { value: 'custom', label: 'Custom Colors' }
    ],
    default: 'theme',
    label: 'Color Mode',
    category: 'Colors'
  },
  warmth: { type: 'slider', min: 0.3, max: 1, step: 0.05, default: 0.7, label: 'Color Warmth', category: 'Colors' },
  sophistication: { type: 'slider', min: 0.4, max: 0.9, step: 0.05, default: 0.6, label: 'Color Sophistication', category: 'Colors' },
  
  // Subtle effects for brand sophistication  
  innerGlow: { type: 'slider', min: 0, max: 0.4, step: 0.05, default: 0.15, label: 'Inner Radiance', category: 'Effects' },
  breathingMotion: { type: 'slider', min: 0, max: 0.2, step: 0.02, default: 0.05, label: 'Subtle Animation', category: 'Effects' }
};

function applyUniversalBackground(ctx, width, height, params) {
  if (!params.backgroundType || params.backgroundType === 'transparent') return;
  
  if (params.backgroundType === 'solid') {
    ctx.fillStyle = params.backgroundColor || '#fefefe';
    ctx.fillRect(0, 0, width, height);
  } else if (params.backgroundType === 'gradient') {
    const direction = (params.backgroundGradientDirection || 0) * (Math.PI / 180);
    const x1 = width / 2 - Math.cos(direction) * width / 2;
    const y1 = height / 2 - Math.sin(direction) * height / 2;
    const x2 = width / 2 + Math.cos(direction) * width / 2;
    const y2 = height / 2 + Math.sin(direction) * height / 2;
    
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, params.backgroundGradientStart || '#ffffff');
    gradient.addColorStop(1, params.backgroundGradientEnd || '#f5f5f5');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
}

${drawVisualization.toString()}`;