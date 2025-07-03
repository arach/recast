import type { ParameterDefinition, PresetMetadata } from './types';

// Hand Sketch
const PARAMETERS = {
  // Universal Background Controls
  backgroundColor: { type: 'color', default: "#fcfcfc", label: 'Background Color', category: 'Background' },
  backgroundType: { type: 'select', options: [{"value":"transparent","label":"Transparent"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "gradient", label: 'Background Type', category: 'Background' },
  backgroundGradientStart: { type: 'color', default: "#fefefe", label: 'Gradient Start', category: 'Background', showIf: (params) => params.backgroundType === 'gradient' },
  backgroundGradientEnd: { type: 'color', default: "#fafafa", label: 'Gradient End', category: 'Background', showIf: (params) => params.backgroundType === 'gradient' },
  backgroundGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 135, label: 'Gradient Direction', category: 'Background', showIf: (params) => params.backgroundType === 'gradient' },
  
  // Universal Fill Controls
  fillType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "none", label: 'Fill Type', category: 'Fill' },
  fillColor: { type: 'color', default: "#E0E0E0", label: 'Fill Color', category: 'Fill', showIf: (params) => params.fillType === 'solid' },
  fillGradientStart: { type: 'color', default: "#F0F0F0", label: 'Gradient Start', category: 'Fill', showIf: (params) => params.fillType === 'gradient' },
  fillGradientEnd: { type: 'color', default: "#D0D0D0", label: 'Gradient End', category: 'Fill', showIf: (params) => params.fillType === 'gradient' },
  fillGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 90, label: 'Gradient Direction', category: 'Fill', showIf: (params) => params.fillType === 'gradient' },
  fillOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.2, label: 'Fill Opacity', category: 'Fill', showIf: (params) => params.fillType !== 'none' },
  
  // Universal Stroke Controls
  strokeType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid"},{"value":"dashed","label":"Dashed"},{"value":"dotted","label":"Dotted"}], default: "solid", label: 'Stroke Type', category: 'Stroke' },
  strokeColor: { type: 'color', default: "#4169E1", label: 'Stroke Color', category: 'Stroke', showIf: (params) => params.strokeType !== 'none' },
  strokeWidth: { type: 'slider', min: 0, max: 10, step: 0.5, default: 1.5, label: 'Stroke Width', category: 'Stroke', showIf: (params) => params.strokeType !== 'none' },
  strokeOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.8, label: 'Stroke Opacity', category: 'Stroke', showIf: (params) => params.strokeType !== 'none' },
  
  // Core sketch properties
  frequency: { type: 'slider', min: 0.2, max: 1.5, step: 0.1, default: 0.8, label: 'Drawing Energy', category: 'Sketch' },
  amplitude: { type: 'slider', min: 60, max: 180, step: 5, default: 110, label: 'Sketch Size', category: 'Sketch' },
  
  // Hand-drawn characteristics
  sketchStyle: {
    type: 'slider',
    min: 0,
    max: 4,
    step: 1,
    default: 1,
    label: 'Sketch Style (0=Pencil, 1=Pen, 2=Charcoal, 3=Marker, 4=Brush)',
    category: 'Medium'
  },
  
  // Human imperfection controls
  handTremor: { type: 'slider', min: 0.05, max: 0.4, step: 0.02, default: 0.15, label: 'Hand Tremor', category: 'Character' },
  lineWobble: { type: 'slider', min: 0.1, max: 0.8, step: 0.05, default: 0.3, label: 'Line Wobble', category: 'Character' },
  pressureVariation: { type: 'slider', min: 0.2, max: 1, step: 0.05, default: 0.6, label: 'Pressure Variation', category: 'Character' },
  
  // Artistic expression
  gestureSpeed: { type: 'slider', min: 0.3, max: 2, step: 0.1, default: 1.0, label: 'Drawing Speed', category: 'Style' },
  artisticFlow: { type: 'slider', min: 0.4, max: 1, step: 0.05, default: 0.7, label: 'Artistic Flow', category: 'Style' },
  spontaneity: { type: 'slider', min: 0.2, max: 1, step: 0.05, default: 0.5, label: 'Spontaneous Marks', category: 'Style' },
  
  // Sketch construction
  constructionLines: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.3, label: 'Construction Lines', category: 'Details' },
  multipleStrokes: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.4, label: 'Multiple Stroke Passes', category: 'Details' },
  crossHatching: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.2, label: 'Cross Hatching', category: 'Details' },
  
  // Paper and texture
  paperTexture: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.3, label: 'Paper Texture', category: 'Texture' },
  inkBleed: { type: 'slider', min: 0, max: 0.5, step: 0.02, default: 0.1, label: 'Ink Bleed', category: 'Texture' },
  
  // Color and medium
  mediumHue: { type: 'slider', min: 0, max: 360, step: 15, default: 220, label: 'Medium Color', category: 'Medium' },
  mediumSaturation: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.3, label: 'Color Intensity', category: 'Medium' },
  mediumOpacity: { type: 'slider', min: 0.4, max: 1, step: 0.05, default: 0.8, label: 'Medium Opacity', category: 'Medium' }
};

function applyUniversalBackground(ctx: CanvasRenderingContext2D, width: number, height: number, params: any) {
  if (params.backgroundType === 'transparent') {
    ctx.clearRect(0, 0, width, height);
  } else if (params.backgroundType === 'solid') {
    ctx.fillStyle = params.backgroundColor;
    ctx.fillRect(0, 0, width, height);
  } else if (params.backgroundType === 'gradient') {
    const angle = (params.backgroundGradientDirection || 45) * Math.PI / 180;
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    const length = Math.sqrt(width * width + height * height);
    const centerX = width / 2;
    const centerY = height / 2;
    
    const gradient = ctx.createLinearGradient(
      centerX - dx * length / 2,
      centerY - dy * length / 2,
      centerX + dx * length / 2,
      centerY + dy * length / 2
    );
    
    gradient.addColorStop(0, params.backgroundGradientStart);
    gradient.addColorStop(1, params.backgroundGradientEnd);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
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

  // Add paper texture
  if (params.paperTexture > 0.1) {
    addPaperTexture(ctx, width, height, params.paperTexture);
  }

  // Extract parameters
  const centerX = width / 2;
  const centerY = height / 2;
  const frequency = params.frequency || 0.8;
  const amplitude = params.amplitude || 110;
  const sketchStyleNum = Math.round(params.sketchStyle || 1);
  const handTremor = params.handTremor || 0.15;
  const lineWobble = params.lineWobble || 0.3;
  const pressureVariation = params.pressureVariation || 0.6;
  const gestureSpeed = params.gestureSpeed || 1.0;
  const artisticFlow = params.artisticFlow || 0.7;
  const spontaneity = params.spontaneity || 0.5;
  const constructionLines = params.constructionLines || 0.3;
  const multipleStrokes = params.multipleStrokes || 0.4;
  const crossHatching = params.crossHatching || 0.2;
  const inkBleed = params.inkBleed || 0.1;
  const mediumHue = params.mediumHue || 220;
  const mediumSaturation = params.mediumSaturation || 0.3;
  const mediumOpacity = params.mediumOpacity || 0.8;

  // Sketch scaling with natural proportions
  const baseScale = Math.min(width, height) / 320;
  const scaledAmplitude = amplitude * baseScale;
  
  // Organic drawing rhythm
  const drawingPhase = time * frequency * gestureSpeed;
  const organicPulse = 1 + Math.sin(drawingPhase) * 0.05; // Very subtle

  // Generate hand-drawn path
  const sketchPath = generateHandDrawnPath(
    centerX, centerY, scaledAmplitude * organicPulse,
    handTremor, lineWobble, artisticFlow, drawingPhase, spontaneity
  );

  // Medium color system - use universal stroke color if available
  const mediumColors = generateMediumColors(mediumHue, mediumSaturation, mediumOpacity, params.strokeColor);

  // Draw construction lines first (if enabled)
  if (constructionLines > 0.1) {
    renderConstructionLines(ctx, sketchPath, mediumColors, constructionLines, handTremor);
  }

  // Apply universal fill if enabled
  if (params.fillType !== 'none' && sketchPath.length > 0) {
    ctx.save();
    ctx.globalAlpha = params.fillOpacity || 0.2;
    
    if (params.fillType === 'solid') {
      ctx.fillStyle = params.fillColor;
    } else if (params.fillType === 'gradient') {
      const angle = (params.fillGradientDirection || 90) * Math.PI / 180;
      const dx = Math.cos(angle);
      const dy = Math.sin(angle);
      const bounds = getBounds(sketchPath);
      const size = Math.max(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY);
      
      const gradient = ctx.createLinearGradient(
        bounds.centerX - dx * size / 2,
        bounds.centerY - dy * size / 2,
        bounds.centerX + dx * size / 2,
        bounds.centerY + dy * size / 2
      );
      
      gradient.addColorStop(0, params.fillGradientStart);
      gradient.addColorStop(1, params.fillGradientEnd);
      ctx.fillStyle = gradient;
    }
    
    drawHandDrawnPath(ctx, sketchPath, 0);
    ctx.fill();
    ctx.restore();
  }

  // Draw multiple stroke passes for authentic feel
  const strokePasses = Math.floor(1 + multipleStrokes * 3);
  for (let pass = 0; pass < strokePasses; pass++) {
    renderSketchStroke(ctx, sketchPath, mediumColors, sketchStyleNum, pressureVariation, lineWobble, handTremor, pass, inkBleed, params);
  }

  // Add cross hatching for shading (if enabled)
  if (crossHatching > 0.1) {
    renderCrossHatching(ctx, sketchPath, mediumColors, crossHatching, handTremor, scaledAmplitude);
  }

  function addPaperTexture(ctx: CanvasRenderingContext2D, width: number, height: number, texture: number) {
    ctx.save();
    ctx.globalAlpha = texture * 0.1;
    
    // Create subtle paper grain
    for (let i = 0; i < width * height * texture * 0.0001; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 2;
      const shade = Math.random() > 0.5 ? '#f0f0f0' : '#e8e8e8';
      
      ctx.fillStyle = shade;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }

  function generateHandDrawnPath(centerX: number, centerY: number, radius: number, tremor: number, wobble: number, flow: number, phase: number, spontaneity: number) {
    const points = [];
    const basePoints = Math.floor(12 + flow * 16); // 12-28 points for organic feel
    
    for (let i = 0; i < basePoints; i++) {
      const t = i / basePoints;
      const angle = t * Math.PI * 2;
      
      // Hand tremor effect
      const tremorX = (Math.random() - 0.5) * tremor * radius * 0.1;
      const tremorY = (Math.random() - 0.5) * tremor * radius * 0.1;
      
      // Line wobble from imperfect hand control
      const wobbleEffect = Math.sin(angle * 7 + phase) * wobble * 0.1;
      const flowEffect = Math.sin(angle * 3 + phase * flow) * flow * 0.15;
      
      // Artistic variation in radius
      const artisticRadius = radius * (0.8 + Math.sin(angle * 2 + phase) * 0.2 + wobbleEffect + flowEffect);
      
      // Spontaneous deviations
      const spontaneousOffset = Math.random() < spontaneity * 0.1 ? (Math.random() - 0.5) * radius * 0.2 : 0;
      
      const finalX = centerX + Math.cos(angle) * artisticRadius + tremorX + spontaneousOffset;
      const finalY = centerY + Math.sin(angle) * artisticRadius + tremorY;
      
      points.push({
        x: finalX,
        y: finalY,
        angle: angle,
        pressure: 0.3 + Math.random() * 0.7, // Random pressure variation
        speed: 0.5 + Math.sin(angle * 4) * 0.5, // Varying drawing speed
        tremor: { x: tremorX, y: tremorY }
      });
    }
    
    return points;
  }

  function generateMediumColors(hue: number, saturation: number, opacity: number, strokeColor?: string) {
    const sat = saturation * 100;
    const lightBase = 20 + saturation * 40; // Darker for drawing media
    
    // Use universal stroke color if available
    const primaryColor = strokeColor || `hsla(${hue}, ${sat}%, ${lightBase}%, ${opacity})`;
    
    return {
      primary: primaryColor,
      light: `hsla(${hue}, ${sat * 0.7}%, ${lightBase + 30}%, ${opacity * 0.6})`,
      dark: `hsla(${hue}, ${sat * 1.2}%, ${lightBase - 10}%, ${opacity})`,
      construction: `hsla(${hue}, ${sat * 0.5}%, ${lightBase + 40}%, ${opacity * 0.3})`
    };
  }

  function renderConstructionLines(ctx: CanvasRenderingContext2D, points: any[], colors: any, strength: number, tremor: number) {
    ctx.save();
    ctx.globalAlpha = strength * 0.4;
    ctx.strokeStyle = colors.construction;
    ctx.lineWidth = 0.5;
    ctx.setLineDash([3, 2]);
    
    // Draw light construction guidelines
    const bounds = getBounds(points);
    
    // Horizontal and vertical guides
    const guideTremor = tremor * 5;
    ctx.beginPath();
    ctx.moveTo(bounds.minX, bounds.centerY + (Math.random() - 0.5) * guideTremor);
    ctx.lineTo(bounds.maxX, bounds.centerY + (Math.random() - 0.5) * guideTremor);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(bounds.centerX + (Math.random() - 0.5) * guideTremor, bounds.minY);
    ctx.lineTo(bounds.centerX + (Math.random() - 0.5) * guideTremor, bounds.maxY);
    ctx.stroke();
    
    ctx.setLineDash([]);
    ctx.restore();
  }

  function renderSketchStroke(ctx: CanvasRenderingContext2D, points: any[], colors: any, style: number, pressureVar: number, wobble: number, tremor: number, pass: number, bleed: number, params: any) {
    ctx.save();
    
    // Adjust opacity for multiple passes
    const baseOpacity = params.strokeOpacity || 0.8;
    ctx.globalAlpha = pass === 0 ? baseOpacity : baseOpacity * 0.3;
    
    // Apply universal stroke settings
    if (params.strokeType === 'dashed') {
      ctx.setLineDash([5, 3]);
    } else if (params.strokeType === 'dotted') {
      ctx.setLineDash([2, 2]);
    }
    
    switch (style) {
      case 0: // Pencil
        renderPencilStroke(ctx, points, colors, pressureVar, wobble, tremor, pass, params);
        break;
      case 1: // Pen
        renderPenStroke(ctx, points, colors, pressureVar, tremor, pass, bleed, params);
        break;
      case 2: // Charcoal
        renderCharcoalStroke(ctx, points, colors, pressureVar, wobble, pass, params);
        break;
      case 3: // Marker
        renderMarkerStroke(ctx, points, colors, pressureVar, pass, bleed, params);
        break;
      case 4: // Brush
        renderBrushStroke(ctx, points, colors, pressureVar, wobble, pass, params);
        break;
    }
    
    ctx.setLineDash([]);
    ctx.restore();
  }

  function renderPencilStroke(ctx: CanvasRenderingContext2D, points: any[], colors: any, pressureVar: number, wobble: number, tremor: number, pass: number, params: any) {
    ctx.strokeStyle = colors.primary;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    const baseWidth = params.strokeWidth || 1.5;
    
    // Variable pencil pressure
    for (let i = 0; i < points.length; i++) {
      const current = points[i];
      const next = points[(i + 1) % points.length];
      
      const pressure = current.pressure * pressureVar + (1 - pressureVar) * 0.5;
      const lineWidth = baseWidth * 0.3 + pressure * baseWidth * 0.7 + pass * 0.3;
      
      ctx.lineWidth = lineWidth;
      ctx.globalAlpha = (0.7 + pressure * 0.3) * (params.strokeOpacity || 0.8);
      
      ctx.beginPath();
      ctx.moveTo(current.x, current.y);
      ctx.lineTo(next.x, next.y);
      ctx.stroke();
    }
  }

  function renderPenStroke(ctx: CanvasRenderingContext2D, points: any[], colors: any, pressureVar: number, tremor: number, pass: number, bleed: number, params: any) {
    ctx.strokeStyle = colors.dark;
    ctx.lineWidth = (params.strokeWidth || 1.5) + pass * 0.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Clean pen line with slight pressure variation
    drawHandDrawnPath(ctx, points, tremor * 0.5);
    ctx.stroke();
    
    // Ink bleed effect
    if (bleed > 0.05) {
      ctx.save();
      ctx.globalAlpha = bleed * 0.3;
      ctx.filter = 'blur(1px)';
      ctx.lineWidth = ((params.strokeWidth || 1.5) + pass * 0.2) * 1.5;
      drawHandDrawnPath(ctx, points, tremor * 0.5);
      ctx.stroke();
      ctx.restore();
    }
  }

  function renderCharcoalStroke(ctx: CanvasRenderingContext2D, points: any[], colors: any, pressureVar: number, wobble: number, pass: number, params: any) {
    const baseWidth = params.strokeWidth || 1.5;
    
    // Charcoal has texture and variation
    for (let i = 0; i < points.length; i++) {
      const current = points[i];
      const next = points[(i + 1) % points.length];
      
      const pressure = current.pressure * pressureVar + (1 - pressureVar) * 0.3;
      const charcoalWidth = baseWidth + pressure * baseWidth * 2 + pass * 0.5;
      
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = charcoalWidth;
      ctx.globalAlpha = (0.4 + pressure * 0.4) * (params.strokeOpacity || 0.8);
      
      // Add charcoal texture
      ctx.filter = 'blur(0.5px)';
      
      ctx.beginPath();
      ctx.moveTo(current.x, current.y);
      ctx.lineTo(next.x, next.y);
      ctx.stroke();
      
      // Add texture particles
      if (Math.random() < pressure * 0.3) {
        ctx.filter = 'none';
        ctx.fillStyle = colors.dark;
        ctx.globalAlpha = pressure * 0.5 * (params.strokeOpacity || 0.8);
        ctx.beginPath();
        ctx.arc(current.x + (Math.random() - 0.5) * 3, current.y + (Math.random() - 0.5) * 3, Math.random() * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    ctx.filter = 'none';
  }

  function renderMarkerStroke(ctx: CanvasRenderingContext2D, points: any[], colors: any, pressureVar: number, pass: number, bleed: number, params: any) {
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = (params.strokeWidth || 1.5) * 2 + pass * 0.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Marker has consistent width but can have streaks
    drawHandDrawnPath(ctx, points, 0.1);
    ctx.stroke();
    
    // Marker bleed and transparency layers
    ctx.save();
    ctx.globalAlpha = 0.2 * (params.strokeOpacity || 0.8);
    ctx.lineWidth = ((params.strokeWidth || 1.5) * 2 + pass * 0.5) * 1.3;
    drawHandDrawnPath(ctx, points, 0.2);
    ctx.stroke();
    ctx.restore();
  }

  function renderBrushStroke(ctx: CanvasRenderingContext2D, points: any[], colors: any, pressureVar: number, wobble: number, pass: number, params: any) {
    const baseWidth = params.strokeWidth || 1.5;
    
    // Brush has very variable width based on pressure
    for (let i = 0; i < points.length; i++) {
      const current = points[i];
      const next = points[(i + 1) % points.length];
      
      const pressure = current.pressure * pressureVar + (1 - pressureVar) * 0.2;
      const speed = current.speed || 0.5;
      
      // Brush width varies dramatically with pressure and speed
      const brushWidth = baseWidth * 0.5 + pressure * baseWidth * 3 - speed * baseWidth + pass * 0.3;
      
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = Math.max(0.5, brushWidth);
      ctx.globalAlpha = (0.6 + pressure * 0.4) * (params.strokeOpacity || 0.8);
      ctx.lineCap = 'round';
      
      ctx.beginPath();
      ctx.moveTo(current.x, current.y);
      ctx.lineTo(next.x, next.y);
      ctx.stroke();
    }
  }

  function renderCrossHatching(ctx: CanvasRenderingContext2D, points: any[], colors: any, strength: number, tremor: number, scale: number) {
    ctx.save();
    ctx.globalAlpha = strength * 0.4;
    ctx.strokeStyle = colors.light;
    ctx.lineWidth = 0.8;
    
    const bounds = getBounds(points);
    const hatchSpacing = scale * 0.15;
    
    // Create cross-hatch pattern
    for (let angle of [45, -45]) {
      const angleRad = angle * Math.PI / 180;
      const cosA = Math.cos(angleRad);
      const sinA = Math.sin(angleRad);
      
      for (let offset = -scale; offset < scale; offset += hatchSpacing) {
        ctx.beginPath();
        
        const startX = bounds.centerX + offset * cosA - scale * sinA + (Math.random() - 0.5) * tremor * 5;
        const startY = bounds.centerY + offset * sinA + scale * cosA + (Math.random() - 0.5) * tremor * 5;
        const endX = bounds.centerX + offset * cosA + scale * sinA + (Math.random() - 0.5) * tremor * 5;
        const endY = bounds.centerY + offset * sinA - scale * cosA + (Math.random() - 0.5) * tremor * 5;
        
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }
    }
    
    ctx.restore();
  }

  function drawHandDrawnPath(ctx: CanvasRenderingContext2D, points: any[], additionalTremor: number) {
    if (points.length < 2) return;
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 1; i < points.length; i++) {
      const current = points[i];
      const previous = points[i - 1];
      const next = points[(i + 1) % points.length];
      
      // Hand-drawn curves with imperfection
      const tremor = additionalTremor * 10;
      const cp1x = previous.x + (current.x - (points[i - 2] || previous).x) * 0.25 + (Math.random() - 0.5) * tremor;
      const cp1y = previous.y + (current.y - (points[i - 2] || previous).y) * 0.25 + (Math.random() - 0.5) * tremor;
      const cp2x = current.x - (next.x - previous.x) * 0.25 + (Math.random() - 0.5) * tremor;
      const cp2y = current.y - (next.y - previous.y) * 0.25 + (Math.random() - 0.5) * tremor;
      
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, current.x, current.y);
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
      centerX: (minX + maxX) / 2,
      centerY: (minY + maxY) / 2
    };
  }
}

export const metadata: PresetMetadata = {
  name: "✏️ Hand Sketch",
  description: "Organic hand-drawn aesthetic with tremor, pressure variation, and artistic imperfection",
  defaultParams: {
    seed: "hand-sketch-artistic",
    backgroundColor: "#fcfcfc",
    backgroundType: "gradient",
    backgroundGradientStart: "#fefefe",
    backgroundGradientEnd: "#fafafa",
    backgroundGradientDirection: 135,
    fillType: "none",
    fillColor: "#E0E0E0",
    fillGradientStart: "#F0F0F0",
    fillGradientEnd: "#D0D0D0",
    fillGradientDirection: 90,
    fillOpacity: 0.2,
    strokeType: "solid",
    strokeColor: "#4169E1",
    strokeWidth: 1.5,
    strokeOpacity: 0.8,
    frequency: 0.8,
    amplitude: 110,
    sketchStyle: 1,
    handTremor: 0.15,
    lineWobble: 0.3,
    pressureVariation: 0.6,
    gestureSpeed: 1.0,
    artisticFlow: 0.7,
    spontaneity: 0.5,
    constructionLines: 0.3,
    multipleStrokes: 0.4,
    crossHatching: 0.2,
    paperTexture: 0.3,
    inkBleed: 0.1,
    mediumHue: 220,
    mediumSaturation: 0.3,
    mediumOpacity: 0.8
  }
};

export const id = 'hand-sketch';
export const name = "✏️ Hand Sketch";
export const description = "Organic hand-drawn aesthetic with tremor, pressure variation, and artistic imperfection";
export const defaultParams = metadata.defaultParams;
export const parameters = PARAMETERS;
export const draw = drawVisualization;

export const code = `// Hand Sketch
const PARAMETERS = ${JSON.stringify(PARAMETERS, null, 2)};

${applyUniversalBackground.toString()}

${drawVisualization.toString()}`;