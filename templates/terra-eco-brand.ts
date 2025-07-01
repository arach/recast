import type { ParameterDefinition, PresetMetadata } from './types';

// TERRA Eco Brand - Organic luxury with sustainable sophistication
export const parameters: Record<string, ParameterDefinition> = {
  // Core TERRA identity - gentle organic rhythm
  frequency: { type: 'slider', min: 0.2, max: 0.6, step: 0.1, default: 0.4, label: 'Organic Rhythm' },
  amplitude: { type: 'slider', min: 80, max: 110, step: 5, default: 95, label: 'Natural Scale' },
  
  // Organic form sophistication
  organicComplexity: { type: 'slider', min: 0.6, max: 1, step: 0.05, default: 0.8, label: 'Organic Curves' },
  growthPattern: { type: 'slider', min: 0.5, max: 1, step: 0.05, default: 0.7, label: 'Growth Variation' },
  natureBreathe: { type: 'slider', min: 0.1, max: 0.5, step: 0.05, default: 0.3, label: 'Living Breath' },
  
  // Sustainable materials
  earthTexture: { type: 'slider', min: 0.3, max: 0.8, step: 0.05, default: 0.6, label: 'Earth Texture' },
  handCrafted: { type: 'slider', min: 0.5, max: 1, step: 0.05, default: 0.8, label: 'Hand-crafted Feel' },
  naturalGrain: { type: 'slider', min: 0.2, max: 0.7, step: 0.05, default: 0.4, label: 'Natural Grain' },
  
  // TERRA color harmony (earth tones)
  forestDepth: { type: 'slider', min: 0.4, max: 0.9, step: 0.05, default: 0.7, label: 'Forest Depth' },
  earthWarmth: { type: 'slider', min: 0.5, max: 1, step: 0.05, default: 0.8, label: 'Earth Warmth' },
  seasonalShift: { type: 'slider', min: 0, max: 40, step: 5, default: 15, label: 'Seasonal Variation' },
  
  // Luxury refinement
  goldenBalance: { type: 'slider', min: 0.7, max: 1, step: 0.05, default: 0.9, label: 'Golden Ratio Balance' },
  silkFinish: { type: 'slider', min: 0.6, max: 1, step: 0.05, default: 0.8, label: 'Silk Finish' }
};

export function draw(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, any>,
  _generator: any,
  time: number
) {
  // TERRA sustainable background - natural paper texture
  const bgGradient = ctx.createLinearGradient(0, 0, width, height);
  bgGradient.addColorStop(0, '#fefcf8');
  bgGradient.addColorStop(0.5, '#faf8f3');
  bgGradient.addColorStop(1, '#f5f2eb');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  // Add subtle paper texture
  addNaturalTexture(ctx, width, height, params.naturalGrain || 0.4);

  // Extract TERRA parameters
  const centerX = width / 2;
  const centerY = height / 2;
  const frequency = params.frequency || 0.4;
  const amplitude = params.amplitude || 95;
  const organicComplexity = params.organicComplexity || 0.8;
  const growthPattern = params.growthPattern || 0.7;
  const natureBreathe = params.natureBreathe || 0.3;
  const earthTexture = params.earthTexture || 0.6;
  const handCrafted = params.handCrafted || 0.8;
  const forestDepth = params.forestDepth || 0.7;
  const earthWarmth = params.earthWarmth || 0.8;
  const seasonalShift = params.seasonalShift || 15;
  const goldenBalance = params.goldenBalance || 0.9;

  // TERRA earth-tone palette - seasonal forest colors
  const baseHue = 120 + seasonalShift; // Forest green shifted by season
  const terraColors = {
    primary: `hsl(${baseHue}, ${60 * forestDepth}%, ${25 + earthWarmth * 15}%)`,
    forest: `hsl(${baseHue + 20}, ${70 * forestDepth}%, ${35 + earthWarmth * 10}%)`,
    earth: `hsl(${baseHue - 40}, ${45 * forestDepth}%, ${45 + earthWarmth * 20}%)`,
    bark: `hsl(${baseHue - 60}, ${35 * forestDepth}%, ${30 + earthWarmth * 25}%)`,
    moss: `hsl(${baseHue + 40}, ${50 * forestDepth}%, ${50 + earthWarmth * 15}%)`,
    highlight: `hsl(${baseHue + 10}, ${30 * forestDepth}%, ${70 + earthWarmth * 15}%)`
  };

  // Scale and natural breathing
  const baseScale = Math.min(width, height) / 300;
  const scaledAmplitude = amplitude * baseScale;
  
  // TERRA organic pulse - like a living plant breathing
  const organicPhase = time * frequency;
  const breathingPulse = 1 + Math.sin(organicPhase) * natureBreathe;
  const growthPhase = time * frequency * 0.618; // Golden ratio growth

  // Generate TERRA organic form
  const organicForm = generateOrganicForm(
    centerX, centerY, scaledAmplitude * breathingPulse,
    organicComplexity, growthPattern, organicPhase, growthPhase, goldenBalance
  );

  // Render TERRA earth shadow (grounding)
  renderEarthShadow(ctx, organicForm, terraColors, earthTexture, scaledAmplitude);

  // Render natural gradient fill
  renderNaturalFill(ctx, organicForm, terraColors, forestDepth, centerX, centerY);

  // Render hand-crafted calligraphy stroke
  renderCalligraphyStroke(ctx, organicForm, terraColors, handCrafted, earthTexture, time);

  // Add natural highlights (sun through leaves)
  renderNaturalHighlights(ctx, organicForm, terraColors, centerX, centerY, scaledAmplitude);

  function addNaturalTexture(ctx: CanvasRenderingContext2D, width: number, height: number, grain: number) {
    if (grain < 0.1) return;
    
    ctx.save();
    ctx.globalAlpha = grain * 0.03;
    
    // Create natural paper texture
    for (let i = 0; i < width * height * grain * 0.001; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 2;
      
      ctx.fillStyle = Math.random() > 0.5 ? '#e8e2d4' : '#f2ede0';
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }

  function generateOrganicForm(centerX: number, centerY: number, radius: number, complexity: number, growth: number, phase: number, growthPhase: number, golden: number) {
    const points = [];
    const basePoints = Math.floor(8 + complexity * 6); // 8-14 points for organic flow
    
    for (let i = 0; i < basePoints; i++) {
      const t = i / basePoints;
      const angle = t * Math.PI * 2;
      
      // Golden ratio organic harmonics
      const phi = 1.618;
      const organic1 = Math.sin(angle * 3 + phase) * complexity * 0.2;
      const organic2 = Math.sin(angle * 5 + growthPhase) * complexity * growth * 0.15;
      const organic3 = Math.sin(angle * phi * 2 + phase * phi) * complexity * golden * 0.1;
      
      // Natural growth variation
      const growthVariation = 1 + Math.sin(angle * 7 + growthPhase * 2) * growth * 0.1;
      const finalRadius = radius * (0.85 + organic1 + organic2 + organic3) * growthVariation;
      
      points.push({
        x: centerX + Math.cos(angle) * finalRadius,
        y: centerY + Math.sin(angle) * finalRadius,
        angle: angle,
        natural: organic1 + organic2,
        growth: growthVariation,
        tension: 0.6 + Math.sin(angle + phase) * 0.3 // Organic curve tension
      });
    }
    
    return points;
  }

  function renderEarthShadow(ctx: CanvasRenderingContext2D, points: any[], colors: any, texture: number, scale: number) {
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = colors.bark;
    
    // Offset for earth grounding
    ctx.translate(scale * 0.02, scale * 0.04);
    
    // Soft natural blur
    ctx.filter = 'blur(4px)';
    
    drawOrganicPath(ctx, points, true);
    ctx.fill();
    
    ctx.restore();
  }

  function renderNaturalFill(ctx: CanvasRenderingContext2D, points: any[], colors: any, depth: number, centerX: number, centerY: number) {
    ctx.save();
    
    const bounds = getBounds(points);
    
    // Natural radial gradient like sunlight through forest
    const naturalGradient = ctx.createRadialGradient(
      centerX - bounds.width * 0.2, centerY - bounds.height * 0.3, 0,
      centerX, centerY, Math.max(bounds.width, bounds.height) * 0.6
    );
    
    function hslToHsla(hsl: string, alpha: number) {
      return hsl.replace('hsl(', 'hsla(').replace(')', `, ${alpha})`);
    }
    
    naturalGradient.addColorStop(0, hslToHsla(colors.highlight, 0.8));
    naturalGradient.addColorStop(0.4, hslToHsla(colors.moss, 0.87));
    naturalGradient.addColorStop(0.7, hslToHsla(colors.forest, 0.73));
    naturalGradient.addColorStop(1, hslToHsla(colors.primary, 0.67));
    
    ctx.fillStyle = naturalGradient;
    drawOrganicPath(ctx, points, true);
    ctx.fill();
    
    ctx.restore();
  }

  function renderCalligraphyStroke(ctx: CanvasRenderingContext2D, points: any[], colors: any, handCrafted: number, texture: number, time: number) {
    ctx.save();
    
    ctx.strokeStyle = colors.primary;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Hand-crafted variable stroke
    for (let i = 0; i < points.length; i++) {
      const current = points[i];
      const next = points[(i + 1) % points.length];
      
      // Calligraphic weight variation
      const angle = Math.atan2(next.y - current.y, next.x - current.x);
      const calligraphyWeight = 2 + Math.sin(angle * 2) * handCrafted * 2;
      const naturalVariation = 1 + (current.natural || 0) * texture * 0.3;
      
      ctx.lineWidth = calligraphyWeight * naturalVariation;
      ctx.beginPath();
      ctx.moveTo(current.x, current.y);
      ctx.lineTo(next.x, next.y);
      ctx.stroke();
    }
    
    ctx.restore();
  }

  function renderNaturalHighlights(ctx: CanvasRenderingContext2D, points: any[], colors: any, centerX: number, centerY: number, scale: number) {
    ctx.save();
    ctx.globalAlpha = 0.4;
    
    // Natural sunlight highlighting
    const highlightGradient = ctx.createLinearGradient(
      centerX - scale * 0.4, centerY - scale * 0.4,
      centerX + scale * 0.2, centerY + scale * 0.2
    );
    highlightGradient.addColorStop(0, colors.highlight);
    highlightGradient.addColorStop(1, 'transparent');
    
    ctx.strokeStyle = highlightGradient;
    ctx.lineWidth = 1.5;
    
    // Highlight the top curve (like sun hitting the top of leaves)
    const topPoints = points.slice(0, Math.ceil(points.length / 3));
    drawOrganicPath(ctx, topPoints, false);
    ctx.stroke();
    
    ctx.restore();
  }

  function drawOrganicPath(ctx: CanvasRenderingContext2D, points: any[], close: boolean = false) {
    if (points.length < 2) return;
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    // Ultra-smooth organic curves using natural tension
    for (let i = 1; i < points.length; i++) {
      const current = points[i];
      const previous = points[i - 1];
      const next = points[(i + 1) % points.length];
      
      // Natural curve tension
      const tension = current.tension || 0.8;
      const cp1x = previous.x + (current.x - (points[i - 2] || previous).x) * tension * 0.25;
      const cp1y = previous.y + (current.y - (points[i - 2] || previous).y) * tension * 0.25;
      const cp2x = current.x - (next.x - previous.x) * tension * 0.25;
      const cp2y = current.y - (next.y - previous.y) * tension * 0.25;
      
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, current.x, current.y);
    }
    
    if (close && points.length > 2) {
      const first = points[0];
      const last = points[points.length - 1];
      const secondLast = points[points.length - 2];
      const second = points[1];
      
      const tension = first.tension || 0.8;
      const cp1x = last.x + (first.x - secondLast.x) * tension * 0.25;
      const cp1y = last.y + (first.y - secondLast.y) * tension * 0.25;
      const cp2x = first.x - (second.x - last.x) * tension * 0.25;
      const cp2y = first.y - (second.y - last.y) * tension * 0.25;
      
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, first.x, first.y);
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
}

export const metadata: PresetMetadata = {
  name: "🌿 TERRA Eco",
  description: "Organic luxury brand with sustainable sophistication, earth tones, and hand-crafted calligraphy feel",
  defaultParams: {
    seed: "terra-sustainable-organic-luxury",
    frequency: 0.4,
    amplitude: 95,
    organicComplexity: 0.8,
    growthPattern: 0.7,
    natureBreathe: 0.3,
    earthTexture: 0.6,
    handCrafted: 0.8,
    naturalGrain: 0.4,
    forestDepth: 0.7,
    earthWarmth: 0.8,
    seasonalShift: 15,
    goldenBalance: 0.9,
    silkFinish: 0.8
  }
};