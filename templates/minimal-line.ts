// ─ Minimal Line
import type { TemplateUtils } from '@reflow/template-utils';

const parameters = {
  frequency: {
    default: 0.3,
    range: [0.1, 1, 0.05]
  },
  amplitude: {
    default: 80,
    range: [40, 160, 5]
  },
  lineStyle: {
    default: 0,
    range: [0, 4, 1]
  },
  precision: {
    default: 0.95,
    range: [0.8, 1, 0.01]
  },
  simplicity: {
    default: 0.9,
    range: [0.7, 1, 0.02]
  },
  refinement: {
    default: 0.8,
    range: [0.5, 1, 0.05]
  },
  strokeWeight: {
    default: 1.5,
    range: [0.5, 6, 0.25]
  },
  strokeSpacing: {
    default: 6,
    range: [2, 12, 1]
  },
  breathingSpace: {
    default: 0.03,
    range: [0, 0.1, 0.01]
  },
  lineBreaks: {
    default: 0.05,
    range: [0, 0.3, 0.02]
  },
  colorPhilosophy: {
    default: 0,
    range: [0, 3, 1]
  },
  accentHue: {
    default: 200,
    range: [0, 360, 15]
  },
  sophistication: {
    default: 0.6,
    range: [0.3, 0.8, 0.05]
  },
  goldenRatio: {
    default: 1.618,
    range: [1.4, 1.8, 0.05]
  },
  proportionalHarmony: {
    default: 0.9,
    range: [0.7, 1, 0.05]
  }
};

const metadata = {
  id: 'minimal-line',
  name: "─ Minimal Line",
  description: "Ultra-clean single-line aesthetic with sophisticated simplicity and intentional whitespace",
  parameters,
  defaultParams: {
    frequency: 0.3,
    amplitude: 80,
    lineStyle: 0,
    precision: 0.95,
    simplicity: 0.9,
    refinement: 0.8,
    strokeWeight: 1.5,
    strokeSpacing: 6,
    breathingSpace: 0.03,
    lineBreaks: 0.05,
    colorPhilosophy: 0,
    accentHue: 200,
    sophistication: 0.6,
    goldenRatio: 1.618,
    proportionalHarmony: 0.9
  }
};

function drawVisualization(ctx: CanvasRenderingContext2D, width: number, height: number, params: any, time: number, utils: TemplateUtils) {
  // Apply universal background
  utils.applyUniversalBackground(ctx, width, height, params);

  // Get theme colors and opacity
  const fillColor = params.fillColor || '#000000';
  const strokeColor = params.strokeColor || '#000000';
  const fillOpacity = params.fillOpacity ?? 1;
  const strokeOpacity = params.strokeOpacity ?? 1;

  // Helper functions
  function generateMinimalLine(centerX: number, centerY: number, radius: number, precision: number, simplicity: number, phi: number, harmony: number, time: number, breaks: number) {
    const points = [];
    
    // Minimal point count for clean geometry
    const basePoints = Math.floor(4 + (1 - simplicity) * 8); // 4-12 points (fewer = more minimal)
    
    for (let i = 0; i < basePoints; i++) {
      const t = i / basePoints;
      const angle = t * Math.PI * 2;
      
      // Golden ratio proportional influence
      const goldenHarmonic = Math.sin(angle * phi) * (1 - simplicity) * 0.1;
      const proportionalRadius = radius * (0.85 + goldenHarmonic) * harmony;
      
      // Minimal geometric precision (very subtle variation)
      const minimalVariation = Math.sin(angle * 2 + time * 0.2) * (1 - precision) * 0.05;
      const finalRadius = proportionalRadius * (1 + minimalVariation);
      
      // Intentional line breaks for minimal aesthetic
      const isBreak = Math.sin(angle * 7 + time * 0.1) < -0.8 && Math.random() < breaks;
      
      points.push({
        x: centerX + Math.cos(angle) * finalRadius,
        y: centerY + Math.sin(angle) * finalRadius,
        angle: angle,
        radius: finalRadius,
        isBreak: isBreak,
        precision: precision + Math.sin(angle) * 0.02
      });
    }
    
    return points;
  }

  function generateMinimalistColors(philosophy: number, hue: number, sophistication: number) {
    const saturation = sophistication * 30; // Minimal saturation
    const lightness = 20 + sophistication * 40; // Sophisticated range
    
    // Base colors from philosophy
    let colors;
    switch (philosophy) {
      case 0: // Pure Black - ultimate minimalism
        colors = {
          primary: strokeColor,
          secondary: '#1a1a1a',
          accent: '#333333'
        };
        break;
        
      case 1: // Warm Gray - sophisticated neutral
        colors = {
          primary: `hsl(30, ${saturation * 0.3}%, ${lightness}%)`,
          secondary: `hsl(30, ${saturation * 0.2}%, ${lightness + 20}%)`,
          accent: `hsl(30, ${saturation * 0.4}%, ${lightness - 10}%)`
        };
        break;
        
      case 2: // Cool Gray - modern neutral
        colors = {
          primary: `hsl(210, ${saturation * 0.3}%, ${lightness}%)`,
          secondary: `hsl(210, ${saturation * 0.2}%, ${lightness + 20}%)`,
          accent: `hsl(210, ${saturation * 0.4}%, ${lightness - 10}%)`
        };
        break;
        
      case 3: // Accent Color - minimal color statement
        colors = {
          primary: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
          secondary: `hsl(${hue}, ${saturation * 0.7}%, ${lightness + 15}%)`,
          accent: `hsl(${hue}, ${saturation * 1.2}%, ${lightness - 5}%)`
        };
        break;
        
      default:
        colors = {
          primary: strokeColor,
          secondary: '#333333',
          accent: '#666666'
        };
    }
    
    return colors;
  }

  function drawMinimalPath(ctx: CanvasRenderingContext2D, points: any[], refinement: number) {
    if (points.length < 2) return;
    
    ctx.beginPath();
    
    let lastPoint = null;
    for (let i = 0; i < points.length; i++) {
      const current = points[i];
      const next = points[(i + 1) % points.length];
      
      if (current.isBreak) {
        lastPoint = null;
        continue;
      }
      
      if (lastPoint === null) {
        ctx.moveTo(current.x, current.y);
        lastPoint = current;
      } else {
        // Ultra-refined curves for minimalist aesthetic
        const precision = current.precision || refinement;
        const cp1x = lastPoint.x + (current.x - lastPoint.x) * precision * 0.3;
        const cp1y = lastPoint.y + (current.y - lastPoint.y) * precision * 0.3;
        const cp2x = current.x - (next.x - lastPoint.x) * precision * 0.3;
        const cp2y = current.y - (next.y - lastPoint.y) * precision * 0.3;
        
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, current.x, current.y);
        lastPoint = current;
      }
    }
  }

  function getBounds(points: any[]) {
    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    
    return { 
      minX, maxX, minY, maxY,
      width: maxX - minX,
      height: maxY - minY,
      centerX: (minX + maxX) / 2,
      centerY: (minY + maxY) / 2
    };
  }

  function renderSingleLine(ctx: CanvasRenderingContext2D, points: any[], color: string, refinement: number) {
    ctx.strokeStyle = color;
    drawMinimalPath(ctx, points, refinement);
    ctx.stroke();
  }

  function renderDoubleLine(ctx: CanvasRenderingContext2D, points: any[], color: string, spacing: number, refinement: number) {
    // Calculate parallel paths
    const outerPoints = points.map(p => {
      const offset = spacing / 2;
      return {
        ...p,
        x: p.x + Math.cos(p.angle + Math.PI/2) * offset,
        y: p.y + Math.sin(p.angle + Math.PI/2) * offset
      };
    });
    
    const innerPoints = points.map(p => {
      const offset = spacing / 2;
      return {
        ...p,
        x: p.x + Math.cos(p.angle - Math.PI/2) * offset,
        y: p.y + Math.sin(p.angle - Math.PI/2) * offset
      };
    });
    
    ctx.strokeStyle = color;
    
    // Draw both parallel lines
    drawMinimalPath(ctx, outerPoints, refinement);
    ctx.stroke();
    
    drawMinimalPath(ctx, innerPoints, refinement);
    ctx.stroke();
  }

  function renderGradientLine(ctx: CanvasRenderingContext2D, points: any[], colors: any, refinement: number) {
    if (points.length < 2) return;
    
    const bounds = getBounds(points);
    const gradient = ctx.createLinearGradient(
      bounds.minX, bounds.minY,
      bounds.maxX, bounds.maxY
    );
    
    gradient.addColorStop(0, colors.primary);
    gradient.addColorStop(0.5, colors.accent);
    gradient.addColorStop(1, colors.secondary);
    
    ctx.strokeStyle = gradient;
    drawMinimalPath(ctx, points, refinement);
    ctx.stroke();
  }

  // Extract parameters
  const centerX = width / 2;
  const centerY = height / 2;
  const frequency = params.frequency || 0.3;
  const amplitude = params.amplitude || 80;
  const lineStyleNum = Math.round(params.lineStyle || 0);
  const precision = params.precision || 0.95;
  const simplicity = params.simplicity || 0.9;
  const refinement = params.refinement || 0.8;
  const strokeWeight = params.strokeWeight || 1.5;
  const strokeSpacing = params.strokeSpacing || 6;
  const breathingSpace = params.breathingSpace || 0.03;
  const lineBreaks = params.lineBreaks || 0.05;
  const colorPhilosophyNum = Math.round(params.colorPhilosophy || 0);
  const accentHue = params.accentHue || 200;
  const sophistication = params.sophistication || 0.6;
  const goldenRatio = params.goldenRatio || 1.618;
  const proportionalHarmony = params.proportionalHarmony || 0.9;

  // Minimalist scaling with generous whitespace
  const baseScale = Math.min(width, height) / 400; // Extra whitespace for elegance
  const scaledAmplitude = amplitude * baseScale;
  
  // Subtle breathing animation
  const breathingPhase = time * frequency * 0.5;
  const breathingPulse = 1 + Math.sin(breathingPhase) * breathingSpace;

  // Generate minimal line path
  const linePath = generateMinimalLine(
    centerX, centerY, scaledAmplitude * breathingPulse,
    precision, simplicity, goldenRatio, proportionalHarmony, time, lineBreaks
  );

  // Sophisticated color system
  const lineColors = generateMinimalistColors(colorPhilosophyNum, accentHue, sophistication);

  // Apply universal fill if not none
  if (params.fillType !== 'none') {
    ctx.save();
    ctx.globalAlpha = fillOpacity;
    
    if (params.fillType === 'gradient') {
      const bounds = getBounds(linePath);
      const angle = (params.fillGradientDirection || 90) * Math.PI / 180;
      const gradientLength = Math.sqrt(bounds.width * bounds.width + bounds.height * bounds.height);
      
      const x1 = bounds.centerX - Math.cos(angle) * gradientLength / 2;
      const y1 = bounds.centerY - Math.sin(angle) * gradientLength / 2;
      const x2 = bounds.centerX + Math.cos(angle) * gradientLength / 2;
      const y2 = bounds.centerY + Math.sin(angle) * gradientLength / 2;
      
      const fillGradient = ctx.createLinearGradient(x1, y1, x2, y2);
      fillGradient.addColorStop(0, params.fillGradientStart);
      fillGradient.addColorStop(1, params.fillGradientEnd);
      
      ctx.fillStyle = fillGradient;
    } else {
      ctx.fillStyle = fillColor;
    }
    
    drawMinimalPath(ctx, linePath, refinement);
    ctx.fill();
    ctx.restore();
  }

  // Render the minimal line
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = strokeWeight;
  ctx.globalAlpha = strokeOpacity;

  // Set dash pattern based on line style
  switch (lineStyleNum) {
    case 2: // Dashed
      ctx.setLineDash([strokeWeight * 4, strokeWeight * 2]);
      break;
    case 3: // Dotted
      ctx.setLineDash([strokeWeight, strokeWeight * 2]);
      break;
    default:
      ctx.setLineDash([]);
  }

  switch (lineStyleNum) {
    case 0: // Single clean line
      renderSingleLine(ctx, linePath, lineColors.primary, refinement);
      break;
      
    case 1: // Double line - sophisticated parallel lines
      renderDoubleLine(ctx, linePath, lineColors.primary, strokeSpacing, refinement);
      break;
      
    case 2: // Dashed line - minimal rhythm
      renderSingleLine(ctx, linePath, lineColors.primary, refinement);
      break;
      
    case 3: // Dotted line - precise points
      renderSingleLine(ctx, linePath, lineColors.primary, refinement);
      break;
      
    case 4: // Gradient line - subtle color transition
      renderGradientLine(ctx, linePath, lineColors, refinement);
      break;
  }

  ctx.restore();
}

export { parameters, metadata, drawVisualization };
export const PARAMETERS = metadata.parameters; // Alias for UI system