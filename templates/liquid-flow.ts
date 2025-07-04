import type { ParameterDefinition, PresetMetadata } from './types';

// Liquid Flow - Fluid, organic shapes with surface tension for beauty/wellness brands
const PARAMETERS = {
  // Universal Background Controls
  backgroundColor: { type: 'color', default: "#f8fafe", label: 'Background Color', category: 'Background' },
  backgroundType: { type: 'select', options: [{"value":"transparent","label":"Transparent"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "gradient", label: 'Background Type', category: 'Background' },
  backgroundGradientStart: { type: 'color', default: "#f8fafe", label: 'Gradient Start', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientEnd: { type: 'color', default: "#e8f0f8", label: 'Gradient End', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 135, label: 'Gradient Direction', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  
  // Universal Fill Controls
  fillType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "gradient", label: 'Fill Type', category: 'Fill' },
  fillColor: { type: 'color', default: "#66b3ff", label: 'Fill Color', category: 'Fill', showIf: (params)=>params.fillType === 'solid' },
  fillGradientStart: { type: 'color', default: "#a8d8ff", label: 'Gradient Start', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientEnd: { type: 'color', default: "#3399ff", label: 'Gradient End', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 45, label: 'Gradient Direction', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.6, label: 'Fill Opacity', category: 'Fill', showIf: (params)=>params.fillType !== 'none' },
  
  // Universal Stroke Controls
  strokeType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid"},{"value":"dashed","label":"Dashed"},{"value":"dotted","label":"Dotted"}], default: "solid", label: 'Stroke Type', category: 'Stroke' },
  strokeColor: { type: 'color', default: "#2288ee", label: 'Stroke Color', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeWidth: { type: 'slider', min: 0, max: 10, step: 0.5, default: 2, label: 'Stroke Width', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Stroke Opacity', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  
  // Core fluid properties
  frequency: { type: 'slider', min: 0.2, max: 1.2, step: 0.05, default: 0.6, label: 'Flow Rhythm' },
  amplitude: { type: 'slider', min: 70, max: 200, step: 5, default: 130, label: 'Fluid Scale' },
  
  // Liquid dynamics
  liquidType: {
    type: 'slider',
    min: 0,
    max: 4,
    step: 1,
    default: 1,
    label: 'Liquid (0=Water, 1=Oil, 2=Honey, 3=Mercury, 4=Plasma)'
  },
  
  // Fluid behavior
  viscosity: { type: 'slider', min: 0.1, max: 1, step: 0.05, default: 0.4, label: 'Viscosity' },
  surfaceTension: { type: 'slider', min: 0.3, max: 1, step: 0.05, default: 0.7, label: 'Surface Tension' },
  flowSpeed: { type: 'slider', min: 0.5, max: 2.5, step: 0.1, default: 1.2, label: 'Flow Speed' },
  
  // Organic variation
  organicComplexity: { type: 'slider', min: 0.3, max: 1, step: 0.05, default: 0.6, label: 'Organic Complexity' },
  turbulence: { type: 'slider', min: 0, max: 0.8, step: 0.05, default: 0.3, label: 'Fluid Turbulence' },
  eddies: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.4, label: 'Eddy Currents' },
  
  // Surface effects
  meniscus: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.5, label: 'Meniscus Effect' },
  droplets: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.3, label: 'Surface Droplets' },
  ripples: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.4, label: 'Surface Ripples' },
  
  // Fluid appearance
  transparency: { type: 'slider', min: 0.2, max: 0.9, step: 0.05, default: 0.6, label: 'Transparency' },
  refraction: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.3, label: 'Light Refraction' },
  caustics: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.4, label: 'Caustic Patterns' },
  
  // Color and material
  fluidHue: { type: 'slider', min: 0, max: 360, step: 10, default: 200, label: 'Fluid Hue' },
  purity: { type: 'slider', min: 0.3, max: 1, step: 0.05, default: 0.8, label: 'Color Purity' },
  luminosity: { type: 'slider', min: 0.4, max: 1, step: 0.05, default: 0.7, label: 'Luminosity' }
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
  const frequency = params.frequency || 0.6;
  const amplitude = params.amplitude || 130;
  const liquidTypeNum = Math.round(params.liquidType || 1);
  const viscosity = params.viscosity || 0.4;
  const surfaceTension = params.surfaceTension || 0.7;
  const flowSpeed = params.flowSpeed || 1.2;
  const organicComplexity = params.organicComplexity || 0.6;
  const turbulence = params.turbulence || 0.3;
  const eddies = params.eddies || 0.4;
  const meniscus = params.meniscus || 0.5;
  const droplets = params.droplets || 0.3;
  const ripples = params.ripples || 0.4;
  const transparency = params.transparency || 0.6;
  const refraction = params.refraction || 0.3;
  const caustics = params.caustics || 0.4;
  const fluidHue = params.fluidHue || 200;
  const purity = params.purity || 0.8;
  const luminosity = params.luminosity || 0.7;

  // Fluid scaling
  const baseScale = Math.min(width, height) / 350;
  const scaledAmplitude = amplitude * baseScale;
  
  // Fluid flow timing
  const flowPhase = time * frequency * flowSpeed;
  const liquidPulse = 1 + Math.sin(flowPhase * 0.3) * (1 - viscosity) * 0.1;

  // Generate liquid form
  const liquidForm = generateFluidShape(
    liquidTypeNum, centerX, centerY, scaledAmplitude * liquidPulse,
    viscosity, surfaceTension, organicComplexity, turbulence, eddies, flowPhase
  );

  // Fluid color system - now using universal fill parameters
  const fluidColors = generateFluidColors(fluidHue, purity, luminosity, transparency, liquidTypeNum, params);

  // Render caustic patterns (background effect)
  if (caustics > 0.1) {
    renderCausticPatterns(ctx, liquidForm, fluidColors, caustics, time, scaledAmplitude);
  }

  // Render main liquid body with universal fill
  renderLiquidBody(ctx, liquidForm, fluidColors, viscosity, surfaceTension, transparency, params);

  // Render surface effects
  renderSurfaceEffects(ctx, liquidForm, fluidColors, meniscus, ripples, time, scaledAmplitude);

  // Render light refraction
  if (refraction > 0.1) {
    renderRefraction(ctx, liquidForm, fluidColors, refraction, centerX, centerY);
  }

  // Render surface droplets
  if (droplets > 0.1) {
    renderSurfaceDroplets(ctx, liquidForm, fluidColors, droplets, time, scaledAmplitude);
  }

  function generateFluidShape(liquidType: number, centerX: number, centerY: number, radius: number, viscosity: number, tension: number, complexity: number, turbulence: number, eddies: number, phase: number) {
    const points = [];
    const basePoints = Math.floor(16 + complexity * 16); // 16-32 points for smooth fluid
    
    for (let i = 0; i < basePoints; i++) {
      const t = i / basePoints;
      const angle = t * Math.PI * 2;
      
      let fluidRadius = radius;
      
      // Liquid type affects shape characteristics
      switch (liquidType) {
        case 0: // Water - natural surface tension
          const water1 = Math.sin(angle * 3 + phase) * complexity * 0.15;
          const water2 = Math.sin(angle * 7 + phase * 1.5) * complexity * 0.08;
          fluidRadius = radius * (0.85 + water1 + water2);
          break;
          
        case 1: // Oil - smooth, viscous flow
          const oil1 = Math.sin(angle * 2 + phase * viscosity) * complexity * 0.2;
          const oil2 = Math.sin(angle * 5 + phase * 0.7) * complexity * 0.1;
          fluidRadius = radius * (0.9 + oil1 + oil2) * (1 + viscosity * 0.1);
          break;
          
        case 2: // Honey - very viscous, slow changes
          const honey1 = Math.sin(angle * 1.5 + phase * 0.3) * complexity * 0.25;
          const honey2 = Math.sin(angle * 3 + phase * 0.5) * complexity * 0.12;
          fluidRadius = radius * (0.95 + honey1 + honey2) * (1 + viscosity * 0.2);
          break;
          
        case 3: // Mercury - high surface tension, beading
          const mercury1 = Math.sin(angle * 4 + phase) * complexity * tension * 0.1;
          const mercury2 = Math.sin(angle * 8 + phase * 2) * complexity * 0.05;
          fluidRadius = radius * (0.92 + mercury1 + mercury2) * (1 + tension * 0.15);
          break;
          
        case 4: // Plasma - energetic, turbulent
          const plasma1 = Math.sin(angle * 6 + phase * 2) * complexity * 0.3;
          const plasma2 = Math.sin(angle * 11 + phase * 3) * complexity * 0.15;
          const plasma3 = Math.sin(angle * 13 + phase * 1.7) * turbulence * 0.2;
          fluidRadius = radius * (0.8 + plasma1 + plasma2 + plasma3);
          break;
      }
      
      // Add turbulence and eddy effects
      const turbulentEffect = Math.sin(angle * 9 + phase * 2.5) * turbulence * 0.15;
      const eddyEffect = Math.sin(angle * 12 + phase * 1.8) * eddies * 0.1;
      
      // Surface tension creates smooth, curved boundaries
      const tensionEffect = 1 + Math.sin(angle * 2 + phase) * tension * 0.05;
      
      const finalRadius = (fluidRadius + turbulentEffect + eddyEffect) * tensionEffect;
      
      points.push({
        x: centerX + Math.cos(angle) * finalRadius,
        y: centerY + Math.sin(angle) * finalRadius,
        angle: angle,
        radius: finalRadius,
        tension: tensionEffect,
        turbulence: turbulentEffect,
        flow: Math.sin(angle * 4 + phase) * 0.5 + 0.5
      });
    }
    
    return points;
  }

  function generateFluidColors(hue: number, purity: number, luminosity: number, transparency: number, liquidType: number, params: any) {
    const baseSaturation = purity * 60;
    const baseLightness = 40 + luminosity * 40;
    const alpha = transparency;
    
    // Liquid type affects color characteristics
    const liquidAdjustments = [
      { hueShift: 0, satMult: 0.8, lightMult: 1.2 },   // Water - clear, bright
      { hueShift: 10, satMult: 1.0, lightMult: 0.9 },  // Oil - slightly warm
      { hueShift: 25, satMult: 1.2, lightMult: 0.8 },  // Honey - warm, rich
      { hueShift: -20, satMult: 0.3, lightMult: 1.5 }, // Mercury - metallic
      { hueShift: 40, satMult: 1.8, lightMult: 1.0 }   // Plasma - vibrant
    ];
    
    const adjustment = liquidAdjustments[liquidType] || liquidAdjustments[0];
    const adjustedHue = hue + adjustment.hueShift;
    const adjustedSat = baseSaturation * adjustment.satMult;
    const adjustedLight = baseLightness * adjustment.lightMult;
    
    return {
      primary: `hsla(${adjustedHue}, ${adjustedSat}%, ${adjustedLight}%, ${alpha})`,
      light: `hsla(${adjustedHue}, ${adjustedSat * 0.7}%, ${adjustedLight + 20}%, ${alpha * 0.8})`,
      dark: `hsla(${adjustedHue}, ${adjustedSat * 1.2}%, ${adjustedLight - 15}%, ${alpha})`,
      highlight: `hsla(${adjustedHue + 10}, ${adjustedSat * 0.5}%, ${Math.min(adjustedLight + 35, 95)}%, ${alpha * 0.6})`,
      caustic: `hsla(${adjustedHue + 20}, ${adjustedSat * 1.5}%, ${adjustedLight + 25}%, 0.3)`,
      // Add universal fill colors
      fillColor: params.fillColor,
      fillGradientStart: params.fillGradientStart,
      fillGradientEnd: params.fillGradientEnd,
      fillGradientDirection: params.fillGradientDirection,
      fillType: params.fillType,
      fillOpacity: params.fillOpacity
    };
  }

  function renderCausticPatterns(ctx: CanvasRenderingContext2D, form: any[], colors: any, caustics: number, time: number, scale: number) {
    ctx.save();
    ctx.globalAlpha = caustics * 0.4;
    
    const bounds = getBounds(form);
    const causticCount = Math.floor(caustics * 8);
    
    for (let i = 0; i < causticCount; i++) {
      const causticPhase = time * 2 + i * 1.2;
      const causticX = bounds.centerX + Math.sin(causticPhase) * scale * 0.3;
      const causticY = bounds.centerY + Math.cos(causticPhase * 1.3) * scale * 0.2;
      const causticSize = scale * (0.1 + Math.sin(causticPhase * 2) * 0.1);
      
      const causticGradient = ctx.createRadialGradient(
        causticX, causticY, 0,
        causticX, causticY, causticSize
      );
      causticGradient.addColorStop(0, colors.caustic);
      causticGradient.addColorStop(0.7, colors.highlight);
      causticGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = causticGradient;
      ctx.beginPath();
      ctx.arc(causticX, causticY, causticSize, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }

  function renderLiquidBody(ctx: CanvasRenderingContext2D, form: any[], colors: any, viscosity: number, tension: number, transparency: number, params: any) {
    ctx.save();
    
    // Apply universal fill
    const bounds = getBounds(form);
    
    if (colors.fillType === 'gradient') {
      const angle = (colors.fillGradientDirection || 90) * Math.PI / 180;
      const gradientLength = Math.sqrt(bounds.width * bounds.width + bounds.height * bounds.height);
      
      const x1 = bounds.centerX - Math.cos(angle) * gradientLength / 2;
      const y1 = bounds.centerY - Math.sin(angle) * gradientLength / 2;
      const x2 = bounds.centerX + Math.cos(angle) * gradientLength / 2;
      const y2 = bounds.centerY + Math.sin(angle) * gradientLength / 2;
      
      const fillGradient = ctx.createLinearGradient(x1, y1, x2, y2);
      fillGradient.addColorStop(0, colors.fillGradientStart || colors.light);
      fillGradient.addColorStop(1, colors.fillGradientEnd || colors.dark);
      
      ctx.fillStyle = fillGradient;
      ctx.globalAlpha = colors.fillOpacity || transparency;
    } else if (colors.fillType === 'solid') {
      ctx.fillStyle = colors.fillColor || colors.primary;
      ctx.globalAlpha = colors.fillOpacity || transparency;
    } else {
      // Original gradient for compatibility
      const fluidGradient = ctx.createRadialGradient(
        bounds.centerX - bounds.width * 0.2, bounds.centerY - bounds.height * 0.3, 0,
        bounds.centerX, bounds.centerY, Math.max(bounds.width, bounds.height) * 0.8
      );
      
      fluidGradient.addColorStop(0, colors.highlight);
      fluidGradient.addColorStop(0.3, colors.light);
      fluidGradient.addColorStop(0.7, colors.primary);
      fluidGradient.addColorStop(1, colors.dark);
      
      ctx.fillStyle = fluidGradient;
    }
    
    drawFluidPath(ctx, form, tension);
    ctx.fill();
    
    // Apply universal stroke
    if (params.strokeType !== 'none') {
      ctx.strokeStyle = params.strokeColor || colors.dark;
      ctx.lineWidth = params.strokeWidth || (2 * (1 + tension * 0.5));
      ctx.globalAlpha = params.strokeOpacity || 1;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      if (params.strokeType === 'dashed') {
        ctx.setLineDash([ctx.lineWidth * 4, ctx.lineWidth * 2]);
      } else if (params.strokeType === 'dotted') {
        ctx.setLineDash([ctx.lineWidth, ctx.lineWidth * 2]);
      }
      
      drawFluidPath(ctx, form, tension);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    ctx.restore();
  }

  function renderSurfaceEffects(ctx: CanvasRenderingContext2D, form: any[], colors: any, meniscus: number, ripples: number, time: number, scale: number) {
    // Meniscus effect (curved surface at edges)
    if (meniscus > 0.1) {
      ctx.save();
      ctx.globalAlpha = meniscus * 0.5;
      ctx.strokeStyle = colors.light;
      ctx.lineWidth = 1;
      
      // Draw meniscus curves
      for (let i = 0; i < form.length; i++) {
        const point = form[i];
        const next = form[(i + 1) % form.length];
        
        if (point.tension > 0.7) {
          const midX = (point.x + next.x) / 2;
          const midY = (point.y + next.y) / 2;
          const curveOffset = meniscus * 5;
          
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.quadraticCurveTo(
            midX + curveOffset * Math.cos(point.angle + Math.PI/2),
            midY + curveOffset * Math.sin(point.angle + Math.PI/2),
            next.x, next.y
          );
          ctx.stroke();
        }
      }
      
      ctx.restore();
    }
    
    // Surface ripples
    if (ripples > 0.1) {
      ctx.save();
      ctx.globalAlpha = ripples * 0.3;
      ctx.strokeStyle = colors.highlight;
      ctx.lineWidth = 0.5;
      
      const bounds = getBounds(form);
      const rippleCount = Math.floor(ripples * 6);
      
      for (let r = 0; r < rippleCount; r++) {
        const ripplePhase = time * 3 + r * 0.8;
        const rippleRadius = scale * (0.2 + r * 0.15) * (1 + Math.sin(ripplePhase) * 0.2);
        
        ctx.beginPath();
        ctx.arc(bounds.centerX, bounds.centerY, rippleRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      ctx.restore();
    }
  }

  function renderRefraction(ctx: CanvasRenderingContext2D, form: any[], colors: any, refraction: number, centerX: number, centerY: number) {
    ctx.save();
    ctx.globalAlpha = refraction * 0.6;
    
    // Light refraction highlights
    const refractionGradient = ctx.createLinearGradient(
      centerX - 50, centerY - 50,
      centerX + 30, centerY + 30
    );
    refractionGradient.addColorStop(0, colors.highlight);
    refractionGradient.addColorStop(0.7, 'transparent');
    
    ctx.fillStyle = refractionGradient;
    
    // Apply refraction to top portion
    const topPoints = form.filter(p => p.y < centerY + 20);
    if (topPoints.length > 2) {
      ctx.beginPath();
      ctx.moveTo(topPoints[0].x, topPoints[0].y);
      topPoints.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(centerX, centerY);
      ctx.closePath();
      ctx.fill();
    }
    
    ctx.restore();
  }

  function renderSurfaceDroplets(ctx: CanvasRenderingContext2D, form: any[], colors: any, droplets: number, time: number, scale: number) {
    ctx.save();
    
    const dropletCount = Math.floor(droplets * 8);
    
    for (let d = 0; d < dropletCount; d++) {
      const dropletPhase = time * 1.5 + d * 2;
      const dropletLife = (Math.sin(dropletPhase) + 1) / 2;
      
      if (dropletLife > 0.3) {
        const angle = (d / dropletCount) * Math.PI * 2 + time * 0.5;
        const distance = scale * (0.8 + Math.sin(dropletPhase * 2) * 0.3);
        const dropletX = form[0].x + Math.cos(angle) * distance;
        const dropletY = form[0].y + Math.sin(angle) * distance;
        const dropletSize = scale * 0.03 * dropletLife;
        
        ctx.globalAlpha = droplets * dropletLife * 0.8;
        
        // Droplet gradient
        const dropletGradient = ctx.createRadialGradient(
          dropletX - dropletSize * 0.3, dropletY - dropletSize * 0.3, 0,
          dropletX, dropletY, dropletSize * 2
        );
        dropletGradient.addColorStop(0, colors.highlight);
        dropletGradient.addColorStop(0.6, colors.light);
        dropletGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = dropletGradient;
        ctx.beginPath();
        ctx.arc(dropletX, dropletY, dropletSize * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Droplet core
        ctx.fillStyle = colors.primary;
        ctx.globalAlpha = droplets * dropletLife;
        ctx.beginPath();
        ctx.arc(dropletX, dropletY, dropletSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    ctx.restore();
  }

  function drawFluidPath(ctx: CanvasRenderingContext2D, points: any[], tension: number) {
    if (points.length < 3) return;
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    // Ultra-smooth curves for fluid surface tension
    for (let i = 1; i < points.length; i++) {
      const current = points[i];
      const previous = points[i - 1];
      const next = points[(i + 1) % points.length];
      
      // Surface tension affects curve smoothness
      const fluidTension = 0.7 + tension * 0.3;
      const cp1x = previous.x + (current.x - (points[i - 2] || previous).x) * fluidTension * 0.25;
      const cp1y = previous.y + (current.y - (points[i - 2] || previous).y) * fluidTension * 0.25;
      const cp2x = current.x - (next.x - previous.x) * fluidTension * 0.25;
      const cp2y = current.y - (next.y - previous.y) * fluidTension * 0.25;
      
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, current.x, current.y);
    }
    
    // Close the fluid shape smoothly
    const first = points[0];
    const last = points[points.length - 1];
    const secondLast = points[points.length - 2];
    const second = points[1];
    
    const fluidTension = 0.7 + tension * 0.3;
    const cp1x = last.x + (first.x - secondLast.x) * fluidTension * 0.25;
    const cp1y = last.y + (first.y - secondLast.y) * fluidTension * 0.25;
    const cp2x = first.x - (second.x - last.x) * fluidTension * 0.25;
    const cp2y = first.y - (second.y - last.y) * fluidTension * 0.25;
    
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, first.x, first.y);
    ctx.closePath();
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
  name: "💧 Liquid Flow",
  description: "Fluid organic shapes with surface tension, caustics, and realistic liquid behavior",
  defaultParams: {
    seed: "liquid-flow-organic",
    frequency: 0.6,
    amplitude: 130,
    liquidType: 1,
    viscosity: 0.4,
    surfaceTension: 0.7,
    flowSpeed: 1.2,
    organicComplexity: 0.6,
    turbulence: 0.3,
    eddies: 0.4,
    meniscus: 0.5,
    droplets: 0.3,
    ripples: 0.4,
    transparency: 0.6,
    refraction: 0.3,
    caustics: 0.4,
    fluidHue: 200,
    purity: 0.8,
    luminosity: 0.7
  }
};

export const id = 'liquid-flow';
export const name = "💧 Liquid Flow";
export const description = "Fluid organic shapes with surface tension, caustics, and realistic liquid behavior";
export const defaultParams = metadata.defaultParams;
export const parameters: Record<string, ParameterDefinition> = PARAMETERS;
export { drawVisualization };
export const code = `// Liquid Flow - Fluid, organic shapes with surface tension for beauty/wellness brands

// This template creates fluid, organic shapes with realistic liquid behavior including
// surface tension, caustics, light refraction, and dynamic flow patterns.

const liquidForm = generateFluidShape(
  liquidType, centerX, centerY, scaledAmplitude,
  viscosity, surfaceTension, organicComplexity, turbulence, eddies, flowPhase
);

// The liquid type parameter offers 5 distinct behaviors:
// 0 = Water - natural surface tension with subtle waves
// 1 = Oil - smooth, viscous flow with slow movements
// 2 = Honey - very viscous with minimal turbulence
// 3 = Mercury - high surface tension with beading effects
// 4 = Plasma - energetic and turbulent with rapid changes

// Surface effects include meniscus curves, ripples, and droplets
// Light effects include caustic patterns and refraction for realism
// Color system adapts based on liquid type for authentic appearance`;