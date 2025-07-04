import type { ParameterDefinition, PresetMetadata } from './types';

// Minimal Line - Ultra-clean single-line aesthetic for sophisticated minimalist brands
const PARAMETERS = {
  // Universal Background Controls
  backgroundColor: { type: 'color', default: "#ffffff", label: 'Background Color', category: 'Background' },
  backgroundType: { type: 'select', options: [{"value":"transparent","label":"Transparent"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "solid", label: 'Background Type', category: 'Background' },
  backgroundGradientStart: { type: 'color', default: "#ffffff", label: 'Gradient Start', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientEnd: { type: 'color', default: "#f5f5f5", label: 'Gradient End', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 45, label: 'Gradient Direction', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  
  // Universal Fill Controls
  fillType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "none", label: 'Fill Type', category: 'Fill' },
  fillColor: { type: 'color', default: "#000000", label: 'Fill Color', category: 'Fill', showIf: (params)=>params.fillType === 'solid' },
  fillGradientStart: { type: 'color', default: "#333333", label: 'Gradient Start', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientEnd: { type: 'color', default: "#666666", label: 'Gradient End', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 90, label: 'Gradient Direction', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.8, label: 'Fill Opacity', category: 'Fill', showIf: (params)=>params.fillType !== 'none' },
  
  // Universal Stroke Controls
  strokeType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid"},{"value":"dashed","label":"Dashed"},{"value":"dotted","label":"Dotted"}], default: "solid", label: 'Stroke Type', category: 'Stroke' },
  strokeColor: { type: 'color', default: "#000000", label: 'Stroke Color', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeWidth: { type: 'slider', min: 0, max: 10, step: 0.5, default: 1.5, label: 'Stroke Width', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Stroke Opacity', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  
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

function applyUniversalBackground(ctx, width, height, params) {
  switch (params.backgroundType) {
    case 'transparent':
      ctx.clearRect(0, 0, width, height);
      break;
      
    case 'solid':
      ctx.fillStyle = params.backgroundColor;
      ctx.fillRect(0, 0, width, height);
      break;
      
    case 'gradient':
      const angle = (params.backgroundGradientDirection || 0) * Math.PI / 180;
      const gradientLength = Math.sqrt(width * width + height * height);
      const centerX = width / 2;
      const centerY = height / 2;
      
      const x1 = centerX - Math.cos(angle) * gradientLength / 2;
      const y1 = centerY - Math.sin(angle) * gradientLength / 2;
      const x2 = centerX + Math.cos(angle) * gradientLength / 2;
      const y2 = centerY + Math.sin(angle) * gradientLength / 2;
      
      const bgGradient = ctx.createLinearGradient(x1, y1, x2, y2);
      bgGradient.addColorStop(0, params.backgroundGradientStart);
      bgGradient.addColorStop(1, params.backgroundGradientEnd);
      
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);
      break;
  }
}

function drawVisualization(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, any>,
  _generator: any,
  time: number
) {
  // Helper function definitions first
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

  function generateMinimalistColors(philosophy: number, hue: number, sophistication: number, params: any) {
    const saturation = sophistication * 30; // Minimal saturation
    const lightness = 20 + sophistication * 40; // Sophisticated range
    
    // Base colors from philosophy
    let colors;
    switch (philosophy) {
      case 0: // Pure Black - ultimate minimalism
        colors = {
          primary: '#000000',
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
          primary: '#000000',
          secondary: '#333333',
          accent: '#666666'
        };
    }
    
    // Override with universal stroke color if set
    if (params.strokeType !== 'none' && params.strokeColor) {
      colors.primary = params.strokeColor;
    }
    
    return colors;
  }

  function renderMinimalLine(ctx: CanvasRenderingContext2D, points: any[], colors: any, lineStyle: number, weight: number, spacing: number, refinement: number, params: any) {
    ctx.save();
    
    // Ultra-refined line caps and joins
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Apply universal stroke settings
    if (params.strokeType !== 'none') {
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = params.strokeWidth || weight;
      ctx.globalAlpha = params.strokeOpacity || 1;
      
      switch (params.strokeType) {
        case 'dashed':
          ctx.setLineDash([ctx.lineWidth * 4, ctx.lineWidth * 2]);
          break;
        case 'dotted':
          ctx.setLineDash([ctx.lineWidth, ctx.lineWidth * 2]);
          break;
      }
      
      // Override line style if universal stroke type is set
      if (params.strokeType === 'dashed') {
        renderDashedLine(ctx, points, colors.primary, ctx.lineWidth, refinement);
      } else if (params.strokeType === 'dotted') {
        renderDottedLine(ctx, points, colors.primary, ctx.lineWidth, refinement);
      } else {
        // Use template-specific line style
        switch (lineStyle) {
          case 0: // Single clean line
            renderSingleLine(ctx, points, colors.primary, ctx.lineWidth, refinement);
            break;
            
          case 1: // Double line - sophisticated parallel lines
            renderDoubleLine(ctx, points, colors.primary, ctx.lineWidth, spacing, refinement);
            break;
            
          case 2: // Dashed line - minimal rhythm
            renderDashedLine(ctx, points, colors.primary, ctx.lineWidth, refinement);
            break;
            
          case 3: // Dotted line - precise points
            renderDottedLine(ctx, points, colors.primary, ctx.lineWidth, refinement);
            break;
            
          case 4: // Gradient line - subtle color transition
            renderGradientLine(ctx, points, colors, ctx.lineWidth, refinement);
            break;
        }
      }
      
      ctx.setLineDash([]);
    }
    
    ctx.restore();
  }

  function renderSingleLine(ctx: CanvasRenderingContext2D, points: any[], color: string, weight: number, refinement: number) {
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
    
    // Draw both parallel lines
    drawMinimalPath(ctx, outerPoints, refinement);
    ctx.stroke();
    
    drawMinimalPath(ctx, innerPoints, refinement);
    ctx.stroke();
  }

  function renderDashedLine(ctx: CanvasRenderingContext2D, points: any[], color: string, weight: number, refinement: number) {
    drawMinimalPath(ctx, points, refinement);
    ctx.stroke();
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
    
    return { 
      minX, maxX, minY, maxY,
      width: maxX - minX,
      height: maxY - minY,
      centerX: (minX + maxX) / 2,
      centerY: (minY + maxY) / 2
    };
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

  // Sophisticated color system - now using universal stroke parameters
  const lineColors = generateMinimalistColors(colorPhilosophyNum, accentHue, sophistication, params);

  // Apply universal fill if not none
  if (params.fillType !== 'none') {
    ctx.save();
    ctx.globalAlpha = params.fillOpacity || 0.8;
    
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
      ctx.fillStyle = params.fillColor;
    }
    
    drawMinimalPath(ctx, linePath, refinement);
    ctx.fill();
    ctx.restore();
  }

  // Render the minimal line with universal stroke
  renderMinimalLine(ctx, linePath, lineColors, lineStyleNum, strokeWeight, strokeSpacing, refinement, params);
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

export const id = 'minimal-line';
export const name = "─ Minimal Line";
export const description = "Ultra-clean single-line aesthetic with sophisticated simplicity and intentional whitespace";
export const defaultParams = metadata.defaultParams;
export const parameters: Record<string, ParameterDefinition> = PARAMETERS;
export { drawVisualization };
export const code = `// Minimal Line - Ultra-clean single-line aesthetic for sophisticated minimalist brands

// This template creates refined geometric forms with intentional simplicity,
// generous whitespace, and sophisticated line treatments.

const linePath = generateMinimalLine(
  centerX, centerY, scaledAmplitude,
  precision, simplicity, goldenRatio, proportionalHarmony, time, lineBreaks
);

// Line style options provide different minimalist expressions:
// 0 = Single - pure, unadorned line
// 1 = Double - parallel lines with precise spacing
// 2 = Dashed - rhythmic breaks for visual interest
// 3 = Dotted - discrete points along the path
// 4 = Gradient - subtle color transitions

// Color philosophy aligns with minimalist principles:
// Pure black for ultimate simplicity
// Warm/cool grays for sophisticated neutrals
// Accent colors used sparingly and intentionally

// Golden ratio and proportional harmony create mathematically elegant forms
// Breathing animation adds subtle life without disrupting the minimal aesthetic`;