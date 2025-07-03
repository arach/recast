// ✨ Luxury Brand
const PARAMETERS = {
  // Universal Background Controls
  backgroundColor: { type: 'color', default: "#fafafa", label: 'Background Color', category: 'Background' },
  backgroundType: { type: 'select', options: [{"value":"transparent","label":"Transparent"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "gradient", label: 'Background Type', category: 'Background' },
  backgroundGradientStart: { type: 'color', default: "#fafafa", label: 'Gradient Start', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientEnd: { type: 'color', default: "#ffffff", label: 'Gradient End', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 135, label: 'Gradient Direction', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  
  // Universal Fill Controls
  fillType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "gradient", label: 'Fill Type', category: 'Fill' },
  fillColor: { type: 'color', default: "#1a1a2e", label: 'Fill Color', category: 'Fill', showIf: (params)=>params.fillType === 'solid' },
  fillGradientStart: { type: 'color', default: "#533483", label: 'Gradient Start', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientEnd: { type: 'color', default: "#1a1a2e", label: 'Gradient End', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 45, label: 'Gradient Direction', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.4, label: 'Fill Opacity', category: 'Fill', showIf: (params)=>params.fillType !== 'none' },
  
  // Universal Stroke Controls
  strokeType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid"},{"value":"dashed","label":"Dashed"},{"value":"dotted","label":"Dotted"}], default: "solid", label: 'Stroke Type', category: 'Stroke' },
  strokeColor: { type: 'color', default: "#1a1a2e", label: 'Stroke Color', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeWidth: { type: 'slider', min: 0, max: 10, step: 0.5, default: 2.5, label: 'Stroke Width', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Stroke Opacity', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  
  // Template-specific: Aesthetic controls
  frequency: { type: 'slider', min: 0.1, max: 1, step: 0.1, default: 0.3, label: 'Organic Pulse', category: 'Aesthetic' },
  amplitude: { type: 'slider', min: 50, max: 150, step: 5, default: 90, label: 'Logo Scale', category: 'Aesthetic' },
  
  // Template-specific: Brand shape
  shapeType: { 
    type: 'select', 
    options: [{"value":0,"label":"Organic Circle"},{"value":1,"label":"Flowing Star"},{"value":2,"label":"Elegant Shield"},{"value":3,"label":"Luxury Hex"},{"value":4,"label":"Dynamic Wave"}],
    default: 0, 
    label: 'Brand Form',
    category: 'Shape'
  },
  
  // Template-specific: Aesthetic refinements
  curvature: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.6, label: 'Curve Sophistication', category: 'Refinements' },
  tension: { type: 'slider', min: 0.1, max: 2, step: 0.1, default: 0.8, label: 'Visual Tension', category: 'Refinements' },
  elegance: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.7, label: 'Golden Ratio Balance', category: 'Refinements' },
  
  // Template-specific: Color sophistication
  colorMode: {
    type: 'select',
    options: [{"value":0,"label":"Midnight"},{"value":1,"label":"Ocean"},{"value":2,"label":"Sunset"},{"value":3,"label":"Forest"},{"value":4,"label":"Royal"}],
    default: 0,
    label: 'Color Palette',
    category: 'Colors'
  },
  gradient: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.4, label: 'Gradient Depth', category: 'Colors' },
  highlight: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.3, label: 'Subtle Highlight', category: 'Colors' },
  
  // Template-specific: Micro-refinements
  shadowDepth: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.2, label: 'Depth Shadow', category: 'Effects' }
};

function applyUniversalBackground(ctx, width, height, params) {
  if (!params.backgroundType || params.backgroundType === 'transparent') return;
  
  if (params.backgroundType === 'solid') {
    ctx.fillStyle = params.backgroundColor || '#fafafa';
    ctx.fillRect(0, 0, width, height);
  } else if (params.backgroundType === 'gradient') {
    const direction = (params.backgroundGradientDirection || 135) * (Math.PI / 180);
    const x1 = width / 2 - Math.cos(direction) * width / 2;
    const y1 = height / 2 - Math.sin(direction) * height / 2;
    const x2 = width / 2 + Math.cos(direction) * width / 2;
    const y2 = height / 2 + Math.sin(direction) * height / 2;
    
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, params.backgroundGradientStart || '#fafafa');
    gradient.addColorStop(1, params.backgroundGradientEnd || '#ffffff');
    
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
    
    Object.keys(params.customParameters).forEach(key => {
      if (params[key] === undefined) {
        params[key] = params.customParameters[key];
      }
    });
  }

  // Apply universal background
  applyUniversalBackground(ctx, width, height, params);

  // Extract aesthetic parameters
  const centerX = width / 2;
  const centerY = height / 2;
  const frequency = params.frequency || 0.3;
  const amplitude = params.amplitude || 90;
  const shapeTypeNum = Number(params.shapeType) || 0;
  const curvature = params.curvature || 0.6;
  const tension = params.tension || 0.8;
  const elegance = params.elegance || 0.7;
  const colorModeNum = Number(params.colorMode) || 0;
  const gradient = params.gradient || 0.4;
  const highlight = params.highlight || 0.3;
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
  if (params.strokeType !== 'none') {
    drawElegantStroke(ctx, controlPoints, palette, params.strokeWidth || 2.5, params.strokeOpacity || 1, params.strokeType, params.strokeColor);
  }

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
    if (params.fillType === 'none') return;
    
    ctx.save();
    
    if (params.fillType === 'solid') {
      ctx.fillStyle = params.fillColor || palette.primary;
      ctx.globalAlpha = params.fillOpacity || gradient;
    } else if (params.fillType === 'gradient') {
      const direction = (params.fillGradientDirection || 45) * (Math.PI / 180);
      const gradientRadius = scale * 1.2;
      
      if (gradient > 0.5) {
        // Radial gradient for high gradient values
        const fillGradient = ctx.createRadialGradient(
          centerX - gradientRadius * 0.3, centerY - gradientRadius * 0.3, 0,
          centerX, centerY, gradientRadius
        );
        fillGradient.addColorStop(0, params.fillGradientStart || palette.accent);
        fillGradient.addColorStop(1, params.fillGradientEnd || palette.primary);
        ctx.fillStyle = fillGradient;
      } else {
        // Linear gradient for low gradient values
        const x1 = centerX - Math.cos(direction) * scale;
        const y1 = centerY - Math.sin(direction) * scale;
        const x2 = centerX + Math.cos(direction) * scale;
        const y2 = centerY + Math.sin(direction) * scale;
        
        const fillGradient = ctx.createLinearGradient(x1, y1, x2, y2);
        fillGradient.addColorStop(0, params.fillGradientStart || palette.accent);
        fillGradient.addColorStop(1, params.fillGradientEnd || palette.primary);
        ctx.fillStyle = fillGradient;
      }
      
      ctx.globalAlpha = params.fillOpacity || gradient;
    }
    
    drawSmoothPath(ctx, points, true);
    ctx.fill();
    
    ctx.restore();
  }

  function drawElegantStroke(ctx: CanvasRenderingContext2D, points: any[], palette: any, strokeWidth: number, strokeOpacity: number, strokeType: string, strokeColor: string) {
    ctx.save();
    
    ctx.strokeStyle = strokeColor || palette.primary;
    ctx.lineWidth = strokeWidth;
    ctx.globalAlpha = strokeOpacity;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    if (strokeType === 'dashed') {
      ctx.setLineDash([strokeWidth * 3, strokeWidth * 2]);
    } else if (strokeType === 'dotted') {
      ctx.setLineDash([strokeWidth, strokeWidth * 2]);
    }
    
    drawSmoothPath(ctx, points, true);
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

export const metadata = {
  name: "✨ Luxury Brand",
  description: "Aesthetically refined logos with sophisticated curves, gradients, and golden ratio proportions",
  defaultParams: {
    seed: "luxury-brand",
    // Background
    backgroundColor: "#fafafa",
    backgroundType: "gradient",
    backgroundGradientStart: "#fafafa",
    backgroundGradientEnd: "#ffffff",
    backgroundGradientDirection: 135,
    // Fill
    fillType: "gradient",
    fillGradientStart: "#533483",
    fillGradientEnd: "#1a1a2e",
    fillGradientDirection: 45,
    fillOpacity: 0.4,
    // Stroke
    strokeType: "solid",
    strokeColor: "#1a1a2e",
    strokeWidth: 2.5,
    strokeOpacity: 1,
    // Template-specific
    frequency: 0.3,
    amplitude: 90,
    shapeType: 0,
    curvature: 0.6,
    tension: 0.8,
    elegance: 0.7,
    colorMode: 0,
    gradient: 0.4,
    highlight: 0.3,
    shadowDepth: 0.2
  }
};

export const id = 'luxury-brand';
export const name = "✨ Luxury Brand";
export const description = "Aesthetically refined logos with sophisticated curves, gradients, and golden ratio proportions";
export const defaultParams = metadata.defaultParams;

export const code = `${PARAMETERS.toString().replace('PARAMETERS', 'const PARAMETERS')}\n\n${applyUniversalBackground.toString()}\n\n${drawVisualization.toString()}`;