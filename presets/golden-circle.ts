import type { ParameterDefinition, PresetMetadata } from './types';

// Golden Circle - Fibonacci-based proportions with organic sophistication
export const parameters: Record<string, ParameterDefinition> = {
  // Circle fundamentals - shape definition (70% of controls)
  circleStyle: {
    type: 'slider',
    min: 0,
    max: 4,
    step: 1,
    default: 0,
    label: 'Circle Style (0=Perfect, 1=Organic, 2=Spiral, 3=Segmented, 4=Breathing)'
  },
  
  // Mathematical proportions using golden ratio and fibonacci
  goldenProportion: { type: 'slider', min: 0.5, max: 2, step: 0.05, default: 1.618, label: 'Golden Ratio (φ=1.618)' },
  fibonacciInfluence: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.3, label: 'Fibonacci Curve Influence' },
  organicVariation: { type: 'slider', min: 0, max: 0.3, step: 0.01, default: 0.08, label: 'Natural Variation' },
  
  // Geometric precision vs organic flow
  mathematicalPurity: { type: 'slider', min: 0.7, max: 1, step: 0.01, default: 0.9, label: 'Geometric Precision' },
  concentricLayers: { type: 'slider', min: 1, max: 4, step: 1, default: 1, label: 'Concentric Rings' },
  spiralTightness: { type: 'slider', min: 0.1, max: 2, step: 0.1, default: 0.8, label: 'Spiral Tightness' },
  
  // Brand enhancement (30% of controls)
  borderStyle: {
    type: 'slider',
    min: 0,
    max: 3,
    step: 1,
    default: 0,
    label: 'Border (0=None, 1=Clean, 2=Double, 3=Organic)'
  },
  borderWeight: { type: 'slider', min: 1, max: 8, step: 0.5, default: 2, label: 'Border Weight' },
  
  // Fill sophistication
  fillType: {
    type: 'slider',
    min: 0,
    max: 3,
    step: 1,
    default: 2,
    label: 'Fill (0=None, 1=Solid, 2=Radial, 3=Fibonacci Gradient)'
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
    label: 'Color Mode'
  },
  warmth: { type: 'slider', min: 0.3, max: 1, step: 0.05, default: 0.7, label: 'Color Warmth' },
  sophistication: { type: 'slider', min: 0.4, max: 0.9, step: 0.05, default: 0.6, label: 'Color Sophistication' },
  
  // Subtle effects for brand sophistication  
  innerGlow: { type: 'slider', min: 0, max: 0.4, step: 0.05, default: 0.15, label: 'Inner Radiance' },
  breathingMotion: { type: 'slider', min: 0, max: 0.2, step: 0.02, default: 0.05, label: 'Subtle Animation' }
};

export function draw(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, any>,
  generator: any,
  time: number
) {
  // Apply universal background
  applyUniversalBackground(ctx, width, height, params);
  
  // Get theme colors with fallbacks
  const fillColor = params.fillColor || '#d4a574'; // Golden color default
  const strokeColor = params.strokeColor || '#b8935f';
  const backgroundColor = params.backgroundColor || '#fefefe';

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
  const borderStyleNum = Math.round(params.borderStyle || 0);
  const borderWeight = params.borderWeight || 2;
  const fillTypeNum = Math.round(params.fillType || 2);
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
    
    renderCircleLayer(ctx, layerPath, brandColors, fillTypeNum, layerAlpha, centerX, centerY, layerRadius, phi);
  }

  // Render sophisticated border
  if (borderStyleNum > 0) {
    renderSophisticatedBorder(ctx, circlePath, brandColors, borderStyleNum, borderWeight, organicVariation);
  }

  function generateGoldenCircle(style: number, centerX: number, centerY: number, radius: number, phi: number, fibInfluence: number, organic: number, purity: number, spiralTight: number, time: number) {
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

  function createSophisticatedPalette(fillColor: string, strokeColor: string, colorMode: string, warmth: number, sophistication: number) {
    // Helper to convert hex to HSL
    const hexToHsl = (hex: string): [number, number, number] => {
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

  function renderInnerGlow(ctx: CanvasRenderingContext2D, points: any[], colors: any, glow: number, radius: number) {
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

  function renderCircleLayer(ctx: CanvasRenderingContext2D, points: any[], colors: any, fillType: number, alpha: number, centerX: number, centerY: number, radius: number, phi: number) {
    ctx.save();
    ctx.globalAlpha = alpha;
    
    switch (fillType) {
      case 0: // No fill
        break;
        
      case 1: // Solid sophisticated fill
        ctx.fillStyle = colors.primary;
        drawSmoothCircle(ctx, points);
        ctx.fill();
        break;
        
      case 2: // Radial gradient for depth
        const radialGradient = ctx.createRadialGradient(
          centerX - radius * 0.3, centerY - radius * 0.3, 0,
          centerX, centerY, radius * 1.1
        );
        radialGradient.addColorStop(0, colors.secondary);
        radialGradient.addColorStop(0.6, colors.primary);
        radialGradient.addColorStop(1, colors.accent);
        
        ctx.fillStyle = radialGradient;
        drawSmoothCircle(ctx, points);
        ctx.fill();
        break;
        
      case 3: // Fibonacci gradient - mathematically sophisticated
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
        drawSmoothCircle(ctx, points);
        ctx.fill();
        break;
    }
    
    ctx.restore();
  }

  function renderSophisticatedBorder(ctx: CanvasRenderingContext2D, points: any[], colors: any, borderStyle: number, weight: number, organic: number) {
    ctx.save();
    
    ctx.strokeStyle = colors.accent;
    ctx.lineWidth = weight;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    switch (borderStyle) {
      case 1: // Clean professional border
        drawSmoothCircle(ctx, points);
        ctx.stroke();
        break;
        
      case 2: // Double border for premium feel
        // Outer border
        ctx.lineWidth = weight;
        drawSmoothCircle(ctx, points);
        ctx.stroke();
        
        // Inner border
        ctx.strokeStyle = colors.sophisticated;
        ctx.lineWidth = weight * 0.5;
        const innerPoints = points.map(p => ({
          x: centerX + (p.x - centerX) * 0.85,
          y: centerY + (p.y - centerY) * 0.85,
          angle: p.angle
        }));
        drawSmoothCircle(ctx, innerPoints);
        ctx.stroke();
        break;
        
      case 3: // Organic border with natural variation
        ctx.lineWidth = weight * (1 + organic * 0.5);
        
        // Draw with organic line weight variation
        for (let i = 0; i < points.length; i++) {
          const current = points[i];
          const next = points[(i + 1) % points.length];
          const organicWeight = weight * (1 + (current.organic || 0) * organic);
          
          ctx.lineWidth = organicWeight;
          ctx.beginPath();
          ctx.moveTo(current.x, current.y);
          ctx.lineTo(next.x, next.y);
          ctx.stroke();
        }
        break;
    }
    
    ctx.restore();
  }

  function drawSmoothCircle(ctx: CanvasRenderingContext2D, points: any[]) {
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

export const metadata: PresetMetadata = {
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
    borderStyle: 0,
    borderWeight: 2,
    fillType: 2,
    colorMode: 'theme',
    warmth: 0.7,
    sophistication: 0.6,
    innerGlow: 0.15,
    breathingMotion: 0.05
  }
};