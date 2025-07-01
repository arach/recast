import type { ParameterDefinition, PresetMetadata } from './types';

// Luxury Brand - Aesthetically refined programmatic logos
export const parameters: Record<string, ParameterDefinition> = {
  // Aesthetic controls for beautiful logos
  frequency: { type: 'slider', min: 0.1, max: 1, step: 0.1, default: 0.3, label: 'Organic Pulse' },
  amplitude: { type: 'slider', min: 50, max: 150, step: 5, default: 90, label: 'Logo Scale' },
  
  // Brand shape with refined options
  shapeType: { 
    type: 'slider', 
    min: 0, 
    max: 4, 
    step: 1, 
    default: 0, 
    label: 'Brand Form (0=Organic Circle, 1=Flowing Star, 2=Elegant Shield, 3=Luxury Hex, 4=Dynamic Wave)' 
  },
  
  // Aesthetic refinements
  curvature: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.6, label: 'Curve Sophistication' },
  tension: { type: 'slider', min: 0.1, max: 2, step: 0.1, default: 0.8, label: 'Visual Tension' },
  elegance: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.7, label: 'Golden Ratio Balance' },
  
  // Color sophistication
  colorMode: {
    type: 'slider',
    min: 0,
    max: 4,
    step: 1,
    default: 0,
    label: 'Color Palette (0=Midnight, 1=Ocean, 2=Sunset, 3=Forest, 4=Royal)'
  },
  gradient: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.4, label: 'Gradient Depth' },
  highlight: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.3, label: 'Subtle Highlight' },
  
  // Micro-refinements
  strokeFlow: { type: 'slider', min: 1, max: 6, step: 0.5, default: 2.5, label: 'Stroke Elegance' },
  shadowDepth: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.2, label: 'Depth Shadow' }
};

export function draw(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, any>,
  _generator: any,
  time: number
) {
  // Sophisticated background - subtle gradient instead of flat white
  const bgGradient = ctx.createLinearGradient(0, 0, width, height);
  bgGradient.addColorStop(0, '#fafafa');
  bgGradient.addColorStop(1, '#ffffff');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  // Extract aesthetic parameters
  const centerX = width / 2;
  const centerY = height / 2;
  const frequency = params.frequency || 0.3;
  const amplitude = params.amplitude || 90;
  const shapeTypeNum = Math.round(params.shapeType || 0);
  const curvature = params.curvature || 0.6;
  const tension = params.tension || 0.8;
  const elegance = params.elegance || 0.7;
  const colorModeNum = Math.round(params.colorMode || 0);
  const gradient = params.gradient || 0.4;
  const highlight = params.highlight || 0.3;
  const strokeFlow = params.strokeFlow || 2.5;
  const shadowDepth = params.shadowDepth || 0.2;

  // Golden ratio and aesthetic scaling
  const phi = 1.618034; // Golden ratio
  const baseScale = Math.min(width, height) / 300;
  const scaledAmplitude = amplitude * baseScale;
  
  // Organic pulse using golden ratio proportions
  const pulsePhase = time * frequency;
  const organicPulse = 1 + Math.sin(pulsePhase) * 0.08 + Math.sin(pulsePhase * phi) * 0.03;

  // Sophisticated color palettes
  const colorPalettes = [
    { primary: '#1a1a2e', secondary: '#16213e', accent: '#533483' }, // Midnight
    { primary: '#0f4c75', secondary: '#3282b8', accent: '#bbe1fa' }, // Ocean  
    { primary: '#ff6b6b', secondary: '#feca57', accent: '#ff9ff3' }, // Sunset
    { primary: '#00d2d3', secondary: '#54a0ff', accent: '#5f27cd' }, // Forest
    { primary: '#2c2c54', secondary: '#6c5ce7', accent: '#a29bfe' }  // Royal
  ];
  const palette = colorPalettes[colorModeNum] || colorPalettes[0];

  // Refined shape types with aesthetic considerations
  const shapeTypes = ['organic-circle', 'flowing-star', 'elegant-shield', 'luxury-hex', 'dynamic-wave'];
  const shapeType = shapeTypes[shapeTypeNum] || 'organic-circle';

  // Generate aesthetically refined control points
  const controlPoints = generateRefinedShape(
    shapeType, 
    centerX, 
    centerY, 
    scaledAmplitude * organicPulse, 
    curvature,
    tension,
    elegance,
    pulsePhase
  );

  // Draw shadow first (for depth)
  if (shadowDepth > 0.1) {
    drawSophisticatedShadow(ctx, controlPoints, shadowDepth, scaledAmplitude);
  }

  // Draw gradient fill
  drawGradientFill(ctx, controlPoints, palette, gradient, centerX, centerY, scaledAmplitude);

  // Draw refined stroke
  drawElegantStroke(ctx, controlPoints, palette, strokeFlow, curvature);

  // Add subtle highlight
  if (highlight > 0.1) {
    drawSubtleHighlight(ctx, controlPoints, palette, highlight, centerX, centerY);
  }

  function generateRefinedShape(shapeType: string, centerX: number, centerY: number, radius: number, curvature: number, tension: number, elegance: number, phase: number) {
    const points = [];
    
    switch (shapeType) {
      case 'organic-circle':
        // Not a perfect circle - subtle organic variation using golden ratio
        const circlePoints = 8;
        for (let i = 0; i < circlePoints; i++) {
          const angle = (i / circlePoints) * Math.PI * 2;
          const organic = 1 + Math.sin(angle * 3 + phase) * curvature * 0.1;
          const goldenVariation = 1 + Math.sin(angle * phi + phase * 0.5) * elegance * 0.05;
          const finalRadius = radius * organic * goldenVariation;
          
          points.push({
            x: centerX + Math.cos(angle) * finalRadius,
            y: centerY + Math.sin(angle) * finalRadius,
            tension: tension * (0.8 + Math.sin(angle + phase) * 0.2)
          });
        }
        break;
        
      case 'flowing-star':
        // Star with flowing, curved points (not sharp)
        const starPoints = 5;
        for (let i = 0; i < starPoints * 2; i++) {
          const angle = (i / (starPoints * 2)) * Math.PI * 2 - Math.PI / 2;
          const isOuter = i % 2 === 0;
          const starRadius = isOuter ? radius : radius * (0.4 + curvature * 0.3);
          const flow = 1 + Math.sin(angle * 2 + phase) * curvature * 0.15;
          
          points.push({
            x: centerX + Math.cos(angle) * starRadius * flow,
            y: centerY + Math.sin(angle) * starRadius * flow,
            tension: tension * (isOuter ? 1.2 : 0.6)
          });
        }
        break;
        
      case 'elegant-shield':
        // Shield with elegant curves, not geometric
        const shieldHeight = radius * 1.3;
        const shieldWidth = radius * 0.8;
        const curve = curvature * 0.3;
        
        points.push(
          { x: centerX, y: centerY - shieldHeight + curve * 20, tension: tension * 1.5 }, // Top
          { x: centerX + shieldWidth - curve * 15, y: centerY - shieldHeight * 0.3, tension: tension },
          { x: centerX + shieldWidth, y: centerY + curve * 10, tension: tension * 0.7 },
          { x: centerX + shieldWidth * 0.7, y: centerY + shieldHeight * 0.7, tension: tension },
          { x: centerX, y: centerY + shieldHeight, tension: tension * 1.2 }, // Bottom point
          { x: centerX - shieldWidth * 0.7, y: centerY + shieldHeight * 0.7, tension: tension },
          { x: centerX - shieldWidth, y: centerY + curve * 10, tension: tension * 0.7 },
          { x: centerX - shieldWidth + curve * 15, y: centerY - shieldHeight * 0.3, tension: tension }
        );
        break;
        
      case 'luxury-hex':
        // Hexagon with luxury proportions and subtle curves
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          const luxuryRatio = 1 + Math.sin(angle * 2) * elegance * 0.1;
          const curveEffect = 1 + Math.sin(angle + phase) * curvature * 0.08;
          
          points.push({
            x: centerX + Math.cos(angle) * radius * luxuryRatio * curveEffect,
            y: centerY + Math.sin(angle) * radius * luxuryRatio * curveEffect,
            tension: tension * (0.9 + Math.sin(angle * 3) * 0.2)
          });
        }
        break;
        
      case 'dynamic-wave':
        // Flowing wave form with sophisticated curves
        const wavePoints = 12;
        for (let i = 0; i < wavePoints; i++) {
          const t = i / wavePoints;
          const angle = t * Math.PI * 2;
          const wave1 = Math.sin(angle * 2 + phase) * curvature;
          const wave2 = Math.sin(angle * 3 + phase * 1.5) * curvature * 0.5;
          const dynamicRadius = radius * (0.7 + wave1 * 0.3 + wave2 * 0.2);
          
          points.push({
            x: centerX + Math.cos(angle) * dynamicRadius,
            y: centerY + Math.sin(angle) * dynamicRadius,
            tension: tension * (0.6 + wave1 * 0.4)
          });
        }
        break;
    }
    
    return points;
  }

  function drawSophisticatedShadow(ctx: CanvasRenderingContext2D, points: any[], depth: number, scale: number) {
    ctx.save();
    ctx.globalAlpha = depth * 0.3;
    ctx.fillStyle = '#000000';
    
    // Offset shadow
    ctx.translate(scale * 0.03, scale * 0.03);
    
    // Blur effect (simplified)
    ctx.filter = 'blur(2px)';
    
    drawSmoothPath(ctx, points, true);
    ctx.fill();
    
    ctx.restore();
  }

  function drawGradientFill(ctx: CanvasRenderingContext2D, points: any[], palette: any, gradient: number, centerX: number, centerY: number, scale: number) {
    if (gradient < 0.1) return;
    
    ctx.save();
    
    // Create sophisticated gradient
    const gradientRadius = scale * 1.2;
    const fillGradient = ctx.createRadialGradient(
      centerX - gradientRadius * 0.3, centerY - gradientRadius * 0.3, 0,
      centerX, centerY, gradientRadius
    );
    
    function hexToRgba(hex: string, alpha: number) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    
    fillGradient.addColorStop(0, hexToRgba(palette.accent, gradient));
    fillGradient.addColorStop(0.6, hexToRgba(palette.secondary, gradient * 0.7));
    fillGradient.addColorStop(1, hexToRgba(palette.primary, gradient * 0.3));
    
    ctx.fillStyle = fillGradient;
    
    drawSmoothPath(ctx, points, true);
    ctx.fill();
    
    ctx.restore();
  }

  function drawElegantStroke(ctx: CanvasRenderingContext2D, points: any[], palette: any, strokeFlow: number, curvature: number) {
    ctx.save();
    
    ctx.strokeStyle = palette.primary;
    ctx.lineWidth = strokeFlow;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Variable line width for elegance
    drawSmoothPath(ctx, points, false);
    ctx.stroke();
    
    ctx.restore();
  }

  function drawSubtleHighlight(ctx: CanvasRenderingContext2D, points: any[], palette: any, highlight: number, centerX: number, centerY: number) {
    ctx.save();
    ctx.globalAlpha = highlight;
    
    // Create highlight gradient
    const highlightGradient = ctx.createLinearGradient(
      centerX - 50, centerY - 50,
      centerX + 50, centerY + 50
    );
    highlightGradient.addColorStop(0, palette.accent);
    highlightGradient.addColorStop(1, 'transparent');
    
    ctx.strokeStyle = highlightGradient;
    ctx.lineWidth = 1;
    
    // Draw highlight on top edge
    const topPoints = points.slice(0, Math.ceil(points.length / 3));
    drawSmoothPath(ctx, topPoints, false);
    ctx.stroke();
    
    ctx.restore();
  }

  function drawSmoothPath(ctx: CanvasRenderingContext2D, points: any[], close: boolean = false) {
    if (points.length < 2) return;
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    // Use quadratic curves for smooth, elegant lines
    for (let i = 1; i < points.length; i++) {
      const current = points[i];
      const previous = points[i - 1];
      const tension = current.tension || 1;
      
      // Calculate control point for smooth curve
      const controlX = (previous.x + current.x) / 2;
      const controlY = (previous.y + current.y) / 2;
      
      ctx.quadraticCurveTo(
        previous.x + (controlX - previous.x) * tension,
        previous.y + (controlY - previous.y) * tension,
        current.x,
        current.y
      );
    }
    
    if (close && points.length > 2) {
      const first = points[0];
      const last = points[points.length - 1];
      const controlX = (last.x + first.x) / 2;
      const controlY = (last.y + first.y) / 2;
      
      ctx.quadraticCurveTo(
        last.x + (controlX - last.x) * (first.tension || 1),
        last.y + (controlY - last.y) * (first.tension || 1),
        first.x,
        first.y
      );
    }
  }
}

export const metadata: PresetMetadata = {
  name: "✨ Luxury Brand",
  description: "Aesthetically refined logos with sophisticated curves, gradients, and golden ratio proportions",
  defaultParams: {
    seed: "luxury-brand",
    frequency: 0.3,
    amplitude: 90,
    shapeType: 0,
    curvature: 0.6,
    tension: 0.8,
    elegance: 0.7,
    colorMode: 0,
    gradient: 0.4,
    highlight: 0.3,
    strokeFlow: 2.5,
    shadowDepth: 0.2
  }
};