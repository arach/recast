import type { ParameterDefinition, PresetMetadata } from './types';

// Minimal Line - Ultra-clean single-line aesthetic for sophisticated minimalist brands
export const parameters: Record<string, ParameterDefinition> = {
  // Core line properties
  frequency: { type: 'slider', min: 0.1, max: 1, step: 0.05, default: 0.3, label: 'Line Rhythm' },
  amplitude: { type: 'slider', min: 40, max: 160, step: 5, default: 80, label: 'Scale' },
  
  // Line style control
  lineStyle: {
    type: 'slider',
    min: 0,
    max: 4,
    step: 1,
    default: 0,
    label: 'Line Style (0=Single, 1=Double, 2=Dashed, 3=Dotted, 4=Gradient)'
  },
  
  // Minimalist precision
  precision: { type: 'slider', min: 0.8, max: 1, step: 0.01, default: 0.95, label: 'Geometric Precision' },
  simplicity: { type: 'slider', min: 0.7, max: 1, step: 0.02, default: 0.9, label: 'Visual Simplicity' },
  refinement: { type: 'slider', min: 0.5, max: 1, step: 0.05, default: 0.8, label: 'Line Refinement' },
  
  // Line weight and spacing
  strokeWeight: { type: 'slider', min: 0.5, max: 6, step: 0.25, default: 1.5, label: 'Line Weight' },
  strokeSpacing: { type: 'slider', min: 2, max: 12, step: 1, default: 6, label: 'Double Line Spacing' },
  
  // Minimalist effects
  breathingSpace: { type: 'slider', min: 0, max: 0.1, step: 0.01, default: 0.03, label: 'Breathing Animation' },
  lineBreaks: { type: 'slider', min: 0, max: 0.3, step: 0.02, default: 0.05, label: 'Intentional Breaks' },
  
  // Sophisticated color control
  colorPhilosophy: {
    type: 'slider',
    min: 0,
    max: 3,
    step: 1,
    default: 0,
    label: 'Color (0=Pure Black, 1=Warm Gray, 2=Cool Gray, 3=Accent Color)'
  },
  accentHue: { type: 'slider', min: 0, max: 360, step: 15, default: 200, label: 'Accent Hue' },
  sophistication: { type: 'slider', min: 0.3, max: 0.8, step: 0.05, default: 0.6, label: 'Color Sophistication' },
  
  // Proportional elegance
  goldenRatio: { type: 'slider', min: 1.4, max: 1.8, step: 0.05, default: 1.618, label: 'Golden Ratio (φ)' },
  proportionalHarmony: { type: 'slider', min: 0.7, max: 1, step: 0.05, default: 0.9, label: 'Proportional Harmony' }
};

export function draw(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, any>,
  _generator: any,
  time: number
) {
  // Pure minimalist background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

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

  // Render the minimal line
  renderMinimalLine(ctx, linePath, lineColors, lineStyleNum, strokeWeight, strokeSpacing, refinement);

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
    
    switch (philosophy) {
      case 0: // Pure Black - ultimate minimalism
        return {
          primary: '#000000',
          secondary: '#1a1a1a',
          accent: '#333333'
        };
        
      case 1: // Warm Gray - sophisticated neutral
        return {
          primary: `hsl(30, ${saturation * 0.3}%, ${lightness}%)`,
          secondary: `hsl(30, ${saturation * 0.2}%, ${lightness + 20}%)`,
          accent: `hsl(30, ${saturation * 0.4}%, ${lightness - 10}%)`
        };
        
      case 2: // Cool Gray - modern neutral
        return {
          primary: `hsl(210, ${saturation * 0.3}%, ${lightness}%)`,
          secondary: `hsl(210, ${saturation * 0.2}%, ${lightness + 20}%)`,
          accent: `hsl(210, ${saturation * 0.4}%, ${lightness - 10}%)`
        };
        
      case 3: // Accent Color - minimal color statement
        return {
          primary: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
          secondary: `hsl(${hue}, ${saturation * 0.7}%, ${lightness + 15}%)`,
          accent: `hsl(${hue}, ${saturation * 1.2}%, ${lightness - 5}%)`
        };
        
      default:
        return {
          primary: '#000000',
          secondary: '#333333',
          accent: '#666666'
        };
    }
  }

  function renderMinimalLine(ctx: CanvasRenderingContext2D, points: any[], colors: any, lineStyle: number, weight: number, spacing: number, refinement: number) {
    ctx.save();
    
    // Ultra-refined line caps and joins
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    switch (lineStyle) {
      case 0: // Single clean line
        renderSingleLine(ctx, points, colors.primary, weight, refinement);
        break;
        
      case 1: // Double line - sophisticated parallel lines
        renderDoubleLine(ctx, points, colors.primary, weight, spacing, refinement);
        break;
        
      case 2: // Dashed line - minimal rhythm
        renderDashedLine(ctx, points, colors.primary, weight, refinement);
        break;
        
      case 3: // Dotted line - precise points
        renderDottedLine(ctx, points, colors.primary, weight, refinement);
        break;
        
      case 4: // Gradient line - subtle color transition
        renderGradientLine(ctx, points, colors, weight, refinement);
        break;
    }
    
    ctx.restore();
  }

  function renderSingleLine(ctx: CanvasRenderingContext2D, points: any[], color: string, weight: number, refinement: number) {
    ctx.strokeStyle = color;
    ctx.lineWidth = weight;
    
    drawMinimalPath(ctx, points, refinement);
    ctx.stroke();
  }

  function renderDoubleLine(ctx: CanvasRenderingContext2D, points: any[], color: string, weight: number, spacing: number, refinement: number) {
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
    ctx.lineWidth = weight;
    
    // Draw both parallel lines
    drawMinimalPath(ctx, outerPoints, refinement);
    ctx.stroke();
    
    drawMinimalPath(ctx, innerPoints, refinement);
    ctx.stroke();
  }

  function renderDashedLine(ctx: CanvasRenderingContext2D, points: any[], color: string, weight: number, refinement: number) {
    ctx.strokeStyle = color;
    ctx.lineWidth = weight;
    
    // Minimal dash pattern
    const dashLength = weight * 4;
    const gapLength = weight * 3;
    ctx.setLineDash([dashLength, gapLength]);
    
    drawMinimalPath(ctx, points, refinement);
    ctx.stroke();
    
    ctx.setLineDash([]);
  }

  function renderDottedLine(ctx: CanvasRenderingContext2D, points: any[], color: string, weight: number, refinement: number) {
    ctx.fillStyle = color;
    
    const pathLength = getPathLength(points);
    const dotSpacing = weight * 5;
    const numDots = Math.floor(pathLength / dotSpacing);
    
    for (let i = 0; i < numDots; i++) {
      const t = i / numDots;
      const point = getPointAtT(points, t);
      
      if (point && !point.isBreak) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, weight * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function renderGradientLine(ctx: CanvasRenderingContext2D, points: any[], colors: any, weight: number, refinement: number) {
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
    ctx.lineWidth = weight;
    
    drawMinimalPath(ctx, points, refinement);
    ctx.stroke();
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
    
    return { minX, maxX, minY, maxY };
  }

  function getPathLength(points: any[]) {
    let length = 0;
    for (let i = 0; i < points.length; i++) {
      const current = points[i];
      const next = points[(i + 1) % points.length];
      if (!current.isBreak && !next.isBreak) {
        const dx = next.x - current.x;
        const dy = next.y - current.y;
        length += Math.sqrt(dx * dx + dy * dy);
      }
    }
    return length;
  }

  function getPointAtT(points: any[], t: number) {
    const totalLength = getPathLength(points);
    const targetLength = t * totalLength;
    
    let currentLength = 0;
    for (let i = 0; i < points.length; i++) {
      const current = points[i];
      const next = points[(i + 1) % points.length];
      
      if (current.isBreak || next.isBreak) continue;
      
      const dx = next.x - current.x;
      const dy = next.y - current.y;
      const segmentLength = Math.sqrt(dx * dx + dy * dy);
      
      if (currentLength + segmentLength >= targetLength) {
        const segmentT = (targetLength - currentLength) / segmentLength;
        return {
          x: current.x + dx * segmentT,
          y: current.y + dy * segmentT,
          isBreak: false
        };
      }
      
      currentLength += segmentLength;
    }
    
    return points[0];
  }
}

export const metadata: PresetMetadata = {
  name: "─ Minimal Line",
  description: "Ultra-clean single-line aesthetic with sophisticated simplicity and intentional whitespace",
  defaultParams: {
    seed: "minimal-line-elegant",
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