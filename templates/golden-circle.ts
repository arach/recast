// ◯ Golden Circle
import type { TemplateUtils } from '@/lib/template-utils';

const parameters = {
  circleStyle: {
    default: 0,
    range: [0, 4, 1]
  },
  goldenProportion: {
    default: 1.618,
    range: [0.5, 2, 0.05]
  },
  fibonacciInfluence: {
    default: 0.3,
    range: [0, 1, 0.05]
  },
  organicVariation: {
    default: 0.08,
    range: [0, 0.3, 0.01]
  },
  mathematicalPurity: {
    default: 0.9,
    range: [0.7, 1, 0.01]
  },
  concentricLayers: {
    default: 1,
    range: [1, 4, 1]
  },
  spiralTightness: {
    default: 0.8,
    range: [0.1, 2, 0.1]
  },
  fillStyle: {
    default: 'radial',
    options: ['none', 'solid', 'radial', 'fibonacci']
  },
  colorMode: {
    default: 'theme',
    options: ['theme', 'golden', 'custom']
  },
  warmth: {
    default: 0.7,
    range: [0.3, 1, 0.05]
  },
  sophistication: {
    default: 0.6,
    range: [0.4, 0.9, 0.05]
  },
  innerGlow: {
    default: 0.15,
    range: [0, 0.4, 0.05]
  },
  breathingMotion: {
    default: 0.05,
    range: [0, 0.2, 0.02]
  }
};

const metadata = {
  id: 'golden-circle',
  name: "◯ Golden Circle",
  description: "Fibonacci-based proportions with sophisticated organic elegance and mathematical harmony",
  parameters,
  defaultParams: {
    circleStyle: 0,
    goldenProportion: 1.618,
    fibonacciInfluence: 0.3,
    organicVariation: 0.08,
    mathematicalPurity: 0.9,
    concentricLayers: 1,
    spiralTightness: 0.8,
    fillStyle: 'radial',
    colorMode: 'theme',
    warmth: 0.7,
    sophistication: 0.6,
    innerGlow: 0.15,
    breathingMotion: 0.05
  }
};

function drawVisualization(ctx: CanvasRenderingContext2D, width: number, height: number, params: any, time: number, utils: TemplateUtils) {
  // Universal background handling
  utils.applyUniversalBackground(ctx, width, height, params);
  
  // Access universal properties via utils
  const fillColor = params.fillColor || '#d4a574';
  const strokeColor = params.strokeColor || '#b8935f';
  const fillOpacity = params.fillOpacity ?? 1;
  const strokeOpacity = params.strokeOpacity ?? 1;

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
  const fillStyle = params.fillStyle || 'radial';
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
    renderInnerGlow(ctx, circlePath, brandColors, innerGlow, animatedRadius, centerX, centerY);
  }

  // Render concentric layers
  for (let layer = concentricLayers - 1; layer >= 0; layer--) {
    const layerRadius = animatedRadius * (1 - layer * 0.15);
    const layerAlpha = 1 - layer * 0.2;
    const layerPath = generateGoldenCircle(
      circleStyleNum, centerX, centerY, layerRadius,
      phi, fibonacciInfluence * (1 - layer * 0.3), organicVariation, mathematicalPurity, spiralTightness, time
    );
    
    renderCircleLayer(ctx, layerPath, brandColors, fillStyle, layerAlpha, centerX, centerY, layerRadius, phi, params);
  }

  // Render universal stroke if specified
  if (params.strokeType !== 'none') {
    renderUniversalStroke(ctx, circlePath, params, strokeColor, strokeOpacity);
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
    const hexToHsl = (hex: string) => {
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

  function renderInnerGlow(ctx: CanvasRenderingContext2D, points: any[], colors: any, glow: number, radius: number, centerX: number, centerY: number) {
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

  function renderCircleLayer(ctx: CanvasRenderingContext2D, points: any[], colors: any, fillStyle: string, alpha: number, centerX: number, centerY: number, radius: number, phi: number, params: any) {
    ctx.save();
    ctx.globalAlpha = alpha;
    
    // Draw the path first
    drawSmoothCircle(ctx, points);
    
    // Apply fill based on fillStyle
    if (fillStyle !== 'none') {
      if (fillStyle === 'solid') {
        ctx.fillStyle = fillColor;
        ctx.globalAlpha = fillOpacity * alpha;
        ctx.fill();
      } else if (fillStyle === 'radial') {
        // Radial gradient for depth
        const radialGradient = ctx.createRadialGradient(
          centerX - radius * 0.3, centerY - radius * 0.3, 0,
          centerX, centerY, radius * 1.1
        );
        radialGradient.addColorStop(0, colors.secondary);
        radialGradient.addColorStop(0.6, colors.primary);
        radialGradient.addColorStop(1, colors.accent);
        
        ctx.fillStyle = radialGradient;
        ctx.globalAlpha = fillOpacity * alpha;
        ctx.fill();
      } else if (fillStyle === 'fibonacci') {
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
        ctx.globalAlpha = fillOpacity * alpha;
        ctx.fill();
      }
    }
    
    ctx.restore();
  }

  function renderUniversalStroke(ctx: CanvasRenderingContext2D, points: any[], params: any, strokeColor: string, strokeOpacity: number) {
    if (params.strokeType === 'none') return;
    
    ctx.save();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = params.strokeWidth || 2;
    ctx.globalAlpha = strokeOpacity;
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

export { parameters, metadata, drawVisualization };