import type { ParameterDefinition, PresetMetadata } from './types';

// Crystal Lattice
const PARAMETERS = {
  // Universal Background Controls
  backgroundColor: { type: 'color', default: "#fafafa", label: 'Background Color', category: 'Background' },
  backgroundType: { type: 'select', options: [{"value":"transparent","label":"Transparent"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "gradient", label: 'Background Type', category: 'Background' },
  backgroundGradientStart: { type: 'color', default: "#fafafa", label: 'Gradient Start', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientEnd: { type: 'color', default: "#f0f0f0", label: 'Gradient End', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 45, label: 'Gradient Direction', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  
  // Universal Fill Controls
  fillType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "gradient", label: 'Fill Type', category: 'Fill' },
  fillColor: { type: 'color', default: "#87ceeb", label: 'Fill Color', category: 'Fill', showIf: (params)=>params.fillType === 'solid' },
  fillGradientStart: { type: 'color', default: "#e0f2fe", label: 'Gradient Start', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientEnd: { type: 'color', default: "#60a5fa", label: 'Gradient End', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 135, label: 'Gradient Direction', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.7, label: 'Fill Opacity', category: 'Fill', showIf: (params)=>params.fillType !== 'none' },
  
  // Universal Stroke Controls
  strokeType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid"},{"value":"dashed","label":"Dashed"},{"value":"dotted","label":"Dotted"}], default: "solid", label: 'Stroke Type', category: 'Stroke' },
  strokeColor: { type: 'color', default: "#2563eb", label: 'Stroke Color', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeWidth: { type: 'slider', min: 0, max: 10, step: 0.5, default: 1, label: 'Stroke Width', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Stroke Opacity', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  
  // Core crystal properties
  frequency: { type: 'slider', min: 0.3, max: 1.5, step: 0.05, default: 0.8, label: 'Crystal Frequency', category: 'Wave' },
  amplitude: { type: 'slider', min: 70, max: 180, step: 5, default: 120, label: 'Crystal Scale', category: 'Wave' },
  
  // Crystal structure
  latticeType: {
    type: 'slider',
    min: 0,
    max: 4,
    step: 1,
    default: 2,
    label: 'Lattice (0=Cubic, 1=Hexagonal, 2=Diamond, 3=Prismatic, 4=Fractal)',
    category: 'Crystal'
  },
  
  // Geometric precision
  crystallineOrder: { type: 'slider', min: 0.7, max: 1, step: 0.02, default: 0.9, label: 'Crystalline Order', category: 'Crystal' },
  facetPrecision: { type: 'slider', min: 0.8, max: 1, step: 0.01, default: 0.95, label: 'Facet Precision', category: 'Crystal' },
  symmetryLevel: { type: 'slider', min: 2, max: 8, step: 1, default: 6, label: 'Symmetry Order', category: 'Crystal' },
  
  // Crystal effects
  lightRefraction: { type: 'slider', min: 0.3, max: 1, step: 0.05, default: 0.7, label: 'Light Refraction', category: 'Effects' },
  internalReflection: { type: 'slider', min: 0.2, max: 0.8, step: 0.05, default: 0.5, label: 'Internal Reflection', category: 'Effects' },
  dispersion: { type: 'slider', min: 0, max: 0.6, step: 0.05, default: 0.3, label: 'Spectral Dispersion', category: 'Effects' },
  
  // Surface characteristics
  facetCount: { type: 'slider', min: 6, max: 24, step: 2, default: 12, label: 'Facet Count', category: 'Surface' },
  surfaceRoughness: { type: 'slider', min: 0, max: 0.3, step: 0.02, default: 0.05, label: 'Surface Roughness', category: 'Surface' },
  crystallineFlaws: { type: 'slider', min: 0, max: 0.2, step: 0.01, default: 0.03, label: 'Natural Inclusions', category: 'Surface' },
  
  // Optical properties
  transparency: { type: 'slider', min: 0.4, max: 0.9, step: 0.05, default: 0.7, label: 'Crystal Transparency', category: 'Optical' },
  brilliance: { type: 'slider', min: 0.5, max: 1, step: 0.05, default: 0.8, label: 'Optical Brilliance', category: 'Optical' },
  fire: { type: 'slider', min: 0.2, max: 0.8, step: 0.05, default: 0.4, label: 'Spectral Fire', category: 'Optical' },
  
  // Color and material
  crystalHue: { type: 'slider', min: 0, max: 360, step: 10, default: 210, label: 'Crystal Hue', category: 'Material' },
  purity: { type: 'slider', min: 0.6, max: 1, step: 0.02, default: 0.9, label: 'Color Purity', category: 'Material' },
  materialType: { type: 'slider', min: 0, max: 4, step: 1, default: 1, label: 'Material (0=Quartz, 1=Diamond, 2=Sapphire, 3=Emerald, 4=Opal)', category: 'Material' }
};

function applyUniversalBackground(ctx: CanvasRenderingContext2D, width: number, height: number, params: Record<string, any>) {
  if (params.backgroundType === 'transparent') {
    ctx.clearRect(0, 0, width, height);
  } else if (params.backgroundType === 'gradient') {
    const angle = (params.backgroundGradientDirection || 45) * Math.PI / 180;
    const x1 = width / 2 - Math.cos(angle) * Math.max(width, height) / 2;
    const y1 = height / 2 - Math.sin(angle) * Math.max(width, height) / 2;
    const x2 = width / 2 + Math.cos(angle) * Math.max(width, height) / 2;
    const y2 = height / 2 + Math.sin(angle) * Math.max(width, height) / 2;
    
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, params.backgroundGradientStart || '#fafafa');
    gradient.addColorStop(1, params.backgroundGradientEnd || '#f0f0f0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  } else {
    ctx.fillStyle = params.backgroundColor || '#fafafa';
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

  // Extract parameters
  const centerX = width / 2;
  const centerY = height / 2;
  const frequency = params.frequency || 0.8;
  const amplitude = params.amplitude || 120;
  const latticeTypeNum = Math.round(params.latticeType || 2);
  const crystallineOrder = params.crystallineOrder || 0.9;
  const facetPrecision = params.facetPrecision || 0.95;
  const symmetryLevel = Math.round(params.symmetryLevel || 6);
  const lightRefraction = params.lightRefraction || 0.7;
  const internalReflection = params.internalReflection || 0.5;
  const dispersion = params.dispersion || 0.3;
  const facetCount = Math.round(params.facetCount || 12);
  const surfaceRoughness = params.surfaceRoughness || 0.05;
  const crystallineFlaws = params.crystallineFlaws || 0.03;
  const transparency = params.transparency || 0.7;
  const brilliance = params.brilliance || 0.8;
  const fire = params.fire || 0.4;
  const crystalHue = params.crystalHue || 210;
  const purity = params.purity || 0.9;
  const materialTypeNum = Math.round(params.materialType || 1);

  // Crystal scaling with precision
  const baseScale = Math.min(width, height) / 340;
  const scaledAmplitude = amplitude * baseScale;
  
  // Crystalline growth with precise timing
  const crystalPhase = time * frequency * 0.7;
  const geometricPulse = 1 + Math.sin(crystalPhase) * 0.03; // Very subtle, precise

  // Generate crystal lattice structure
  const crystalStructure = generateCrystalLattice(
    latticeTypeNum, centerX, centerY, scaledAmplitude * geometricPulse,
    crystallineOrder, facetPrecision, symmetryLevel, facetCount, crystalPhase
  );

  // Crystal color system
  const crystalColors = generateCrystalColors(crystalHue, purity, transparency, materialTypeNum);

  // Render light dispersion (background effect)
  if (dispersion > 0.1) {
    renderSpectralDispersion(ctx, crystalStructure, crystalColors, dispersion, time, scaledAmplitude);
  }

  // Render internal reflections
  if (internalReflection > 0.1) {
    renderInternalReflections(ctx, crystalStructure, crystalColors, internalReflection, brilliance);
  }

  // Render main crystal body with universal controls
  renderCrystalBody(ctx, crystalStructure, crystalColors, transparency, surfaceRoughness, params);

  // Render crystal facets
  renderCrystalFacets(ctx, crystalStructure, crystalColors, facetPrecision, brilliance);

  // Render light refraction
  if (lightRefraction > 0.1) {
    renderLightRefraction(ctx, crystalStructure, crystalColors, lightRefraction, centerX, centerY);
  }

  // Render spectral fire
  if (fire > 0.1) {
    renderSpectralFire(ctx, crystalStructure, crystalColors, fire, time, scaledAmplitude);
  }

  // Render crystalline flaws and inclusions
  if (crystallineFlaws > 0.01) {
    renderCrystallineFlaws(ctx, crystalStructure, crystalColors, crystallineFlaws, time);
  }

  function generateCrystalLattice(latticeType: number, centerX: number, centerY: number, radius: number, order: number, precision: number, symmetry: number, facets: number, phase: number) {
    const points = [];
    const basePoints = facets;
    
    for (let i = 0; i < basePoints; i++) {
      const t = i / basePoints;
      const angle = t * Math.PI * 2;
      
      let crystallineRadius = radius;
      
      // Generate lattice-specific geometry
      switch (latticeType) {
        case 0: // Cubic - regular polygonal structure
          const cubicSegments = 8;
          const cubicAngle = Math.floor(angle / (Math.PI * 2 / cubicSegments)) * (Math.PI * 2 / cubicSegments);
          const cubic1 = Math.sin(cubicAngle * 2 + phase) * (1 - order) * 0.1;
          crystallineRadius = radius * (0.9 + cubic1);
          break;
          
        case 1: // Hexagonal - six-fold symmetry
          const hexagonal1 = Math.sin(angle * 6 + phase) * (1 - order) * 0.15;
          const hexagonal2 = Math.sin(angle * symmetry + phase * 0.7) * precision * 0.08;
          crystallineRadius = radius * (0.85 + hexagonal1 + hexagonal2);
          break;
          
        case 2: // Diamond - brilliant cut inspired
          const diamond1 = Math.sin(angle * 8 + phase) * (1 - order) * 0.12;
          const diamond2 = Math.sin(angle * 16 + phase * 1.5) * precision * 0.06;
          const diamond3 = Math.sin(angle * symmetry + phase) * order * 0.05;
          crystallineRadius = radius * (0.88 + diamond1 + diamond2 + diamond3);
          break;
          
        case 3: // Prismatic - elongated crystal form
          const prismatic1 = Math.sin(angle * 3 + phase) * (1 - order) * 0.2;
          const prismatic2 = Math.sin(angle * symmetry + phase * 0.5) * precision * 0.1;
          crystallineRadius = radius * (0.8 + prismatic1 + prismatic2);
          break;
          
        case 4: // Fractal - self-similar crystal growth
          const fractal1 = Math.sin(angle * 7 + phase) * (1 - order) * 0.25;
          const fractal2 = Math.sin(angle * 13 + phase * 2) * precision * 0.12;
          const fractal3 = Math.sin(angle * 19 + phase * 1.3) * order * 0.08;
          crystallineRadius = radius * (0.75 + fractal1 + fractal2 + fractal3);
          break;
      }
      
      // Add crystalline precision
      const orderEffect = 1 + Math.sin(angle * symmetry + phase) * (1 - order) * 0.03;
      const precisionEffect = 1 + Math.sin(angle * facets + phase * precision) * (1 - precision) * 0.02;
      
      const finalRadius = crystallineRadius * orderEffect * precisionEffect;
      
      points.push({
        x: centerX + Math.cos(angle) * finalRadius,
        y: centerY + Math.sin(angle) * finalRadius,
        angle: angle,
        radius: finalRadius,
        facetIntensity: 0.3 + Math.sin(angle * symmetry + phase) * 0.7,
        orderLevel: order + Math.sin(angle * 2) * 0.1,
        lightDirection: Math.sin(angle * 3 + phase * 0.3)
      });
    }
    
    return points;
  }

  function generateCrystalColors(hue: number, purity: number, transparency: number, materialType: number) {
    const baseSaturation = purity * 60;
    const baseLightness = 70 + purity * 20;
    const alpha = transparency;
    
    // Material type affects color characteristics
    const materialAdjustments = [
      { hueShift: 0, satMult: 0.5, lightMult: 1.1 },   // Quartz - clear, neutral
      { hueShift: -10, satMult: 0.3, lightMult: 1.3 }, // Diamond - brilliant, cool
      { hueShift: 15, satMult: 1.2, lightMult: 0.9 },  // Sapphire - rich, deep
      { hueShift: 25, satMult: 1.5, lightMult: 0.8 },  // Emerald - vivid, natural
      { hueShift: 45, satMult: 1.8, lightMult: 1.0 }   // Opal - iridescent, varied
    ];
    
    const adjustment = materialAdjustments[materialType] || materialAdjustments[0];
    const adjustedHue = hue + adjustment.hueShift;
    const adjustedSat = baseSaturation * adjustment.satMult;
    const adjustedLight = baseLightness * adjustment.lightMult;
    
    return {
      primary: `hsla(${adjustedHue}, ${adjustedSat}%, ${adjustedLight}%, ${alpha})`,
      light: `hsla(${adjustedHue}, ${adjustedSat * 0.6}%, ${Math.min(adjustedLight + 25, 95)}%, ${alpha * 0.8})`,
      dark: `hsla(${adjustedHue}, ${adjustedSat * 1.3}%, ${adjustedLight - 20}%, ${alpha})`,
      brilliant: `hsla(${adjustedHue + 10}, ${adjustedSat * 0.4}%, 98%, ${alpha * 0.9})`,
      fire: `hsla(${adjustedHue + 60}, ${adjustedSat * 1.8}%, ${adjustedLight + 15}%, 0.4)`,
      dispersion: `hsla(${adjustedHue - 30}, ${adjustedSat * 2}%, ${adjustedLight + 10}%, 0.3)`
    };
  }

  function renderSpectralDispersion(ctx: CanvasRenderingContext2D, structure: any[], colors: any, dispersion: number, time: number, scale: number) {
    ctx.save();
    ctx.globalAlpha = dispersion * 0.3;
    
    const bounds = getBounds(structure);
    const dispersionCount = Math.floor(dispersion * 8);
    
    for (let i = 0; i < dispersionCount; i++) {
      const dispersionPhase = time * 1.5 + i * 0.8;
      const dispersionX = bounds.centerX + Math.sin(dispersionPhase) * scale * 0.4;
      const dispersionY = bounds.centerY + Math.cos(dispersionPhase * 1.2) * scale * 0.3;
      const dispersionSize = scale * (0.08 + Math.sin(dispersionPhase * 2) * 0.05);
      
      const dispersionGradient = ctx.createRadialGradient(
        dispersionX, dispersionY, 0,
        dispersionX, dispersionY, dispersionSize
      );
      dispersionGradient.addColorStop(0, colors.dispersion);
      dispersionGradient.addColorStop(0.6, colors.fire);
      dispersionGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = dispersionGradient;
      ctx.beginPath();
      ctx.arc(dispersionX, dispersionY, dispersionSize, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }

  function renderInternalReflections(ctx: CanvasRenderingContext2D, structure: any[], colors: any, reflection: number, brilliance: number) {
    ctx.save();
    ctx.globalAlpha = reflection * brilliance * 0.6;
    
    for (let i = 0; i < structure.length; i++) {
      const point = structure[i];
      const next = structure[(i + 1) % structure.length];
      
      if (point.facetIntensity > 0.5) {
        // Internal reflection line
        const midX = (point.x + next.x) / 2;
        const midY = (point.y + next.y) / 2;
        const reflectionLength = brilliance * 15;
        
        ctx.strokeStyle = colors.brilliant;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(midX, midY);
        ctx.lineTo(
          midX + Math.cos(point.angle + Math.PI/2) * reflectionLength,
          midY + Math.sin(point.angle + Math.PI/2) * reflectionLength
        );
        ctx.stroke();
      }
    }
    
    ctx.restore();
  }

  function renderCrystalBody(ctx: CanvasRenderingContext2D, structure: any[], colors: any, transparency: number, roughness: number, params: Record<string, any>) {
    ctx.save();
    
    // Main crystal body with sophisticated gradient
    const bounds = getBounds(structure);
    
    // Apply universal fill settings
    if (params.fillType === 'gradient') {
      const angle = (params.fillGradientDirection || 135) * Math.PI / 180;
      const x1 = bounds.centerX - Math.cos(angle) * Math.max(bounds.width, bounds.height) / 2;
      const y1 = bounds.centerY - Math.sin(angle) * Math.max(bounds.width, bounds.height) / 2;
      const x2 = bounds.centerX + Math.cos(angle) * Math.max(bounds.width, bounds.height) / 2;
      const y2 = bounds.centerY + Math.sin(angle) * Math.max(bounds.width, bounds.height) / 2;
      
      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, params.fillGradientStart || colors.light);
      gradient.addColorStop(0.3, colors.light);
      gradient.addColorStop(0.7, colors.primary);
      gradient.addColorStop(1, params.fillGradientEnd || colors.dark);
      ctx.fillStyle = gradient;
    } else if (params.fillType === 'solid') {
      ctx.fillStyle = params.fillColor || colors.primary;
    } else {
      const crystalGradient = ctx.createRadialGradient(
        bounds.centerX - bounds.width * 0.3, bounds.centerY - bounds.height * 0.3, 0,
        bounds.centerX, bounds.centerY, Math.max(bounds.width, bounds.height) * 0.6
      );
      
      crystalGradient.addColorStop(0, colors.brilliant);
      crystalGradient.addColorStop(0.3, colors.light);
      crystalGradient.addColorStop(0.7, colors.primary);
      crystalGradient.addColorStop(1, colors.dark);
      ctx.fillStyle = crystalGradient;
    }
    
    if (params.fillType !== 'none') {
      ctx.globalAlpha = params.fillOpacity || transparency;
      drawCrystalPath(ctx, structure);
      ctx.fill();
    }
    
    // Crystal edge with precision
    if (params.strokeType !== 'none') {
      ctx.strokeStyle = params.strokeColor || colors.dark;
      ctx.lineWidth = params.strokeWidth || (1 + roughness * 2);
      ctx.globalAlpha = params.strokeOpacity || 1;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      if (params.strokeType === 'dashed') {
        ctx.setLineDash([5, 5]);
      } else if (params.strokeType === 'dotted') {
        ctx.setLineDash([2, 2]);
      }
      
      drawCrystalPath(ctx, structure);
      ctx.stroke();
    }
    
    ctx.restore();
  }

  function renderCrystalFacets(ctx: CanvasRenderingContext2D, structure: any[], colors: any, precision: number, brilliance: number) {
    ctx.save();
    
    for (let i = 0; i < structure.length; i++) {
      const current = structure[i];
      const next = structure[(i + 1) % structure.length];
      
      if (current.facetIntensity > 0.4) {
        ctx.globalAlpha = current.facetIntensity * brilliance * 0.4;
        
        // Facet highlight
        const facetGradient = ctx.createLinearGradient(
          current.x, current.y, next.x, next.y
        );
        facetGradient.addColorStop(0, colors.brilliant);
        facetGradient.addColorStop(0.5, colors.light);
        facetGradient.addColorStop(1, 'transparent');
        
        ctx.strokeStyle = facetGradient;
        ctx.lineWidth = precision * 2;
        ctx.beginPath();
        ctx.moveTo(current.x, current.y);
        ctx.lineTo(next.x, next.y);
        ctx.stroke();
      }
    }
    
    ctx.restore();
  }

  function renderLightRefraction(ctx: CanvasRenderingContext2D, structure: any[], colors: any, refraction: number, centerX: number, centerY: number) {
    ctx.save();
    ctx.globalAlpha = refraction * 0.5;
    
    // Light refraction highlights
    const refractionGradient = ctx.createLinearGradient(
      centerX - 40, centerY - 40,
      centerX + 25, centerY + 25
    );
    refractionGradient.addColorStop(0, colors.brilliant);
    refractionGradient.addColorStop(0.8, 'transparent');
    
    ctx.fillStyle = refractionGradient;
    
    // Apply refraction to top portion
    const topPoints = structure.filter(p => p.y < centerY + 15);
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

  function renderSpectralFire(ctx: CanvasRenderingContext2D, structure: any[], colors: any, fire: number, time: number, scale: number) {
    ctx.save();
    
    const fireCount = Math.floor(fire * 6);
    
    for (let f = 0; f < fireCount; f++) {
      const firePhase = time * 2 + f * 1.2;
      const fireLife = (Math.sin(firePhase) + 1) / 2;
      
      if (fireLife > 0.3) {
        const angle = (f / fireCount) * Math.PI * 2 + time * 0.3;
        const distance = scale * (0.7 + Math.sin(firePhase * 1.5) * 0.2);
        const fireX = structure[0].x + Math.cos(angle) * distance;
        const fireY = structure[0].y + Math.sin(angle) * distance;
        const fireSize = scale * 0.04 * fireLife;
        
        ctx.globalAlpha = fire * fireLife * 0.8;
        
        // Fire gradient
        const fireGradient = ctx.createRadialGradient(
          fireX - fireSize * 0.3, fireY - fireSize * 0.3, 0,
          fireX, fireY, fireSize * 2
        );
        fireGradient.addColorStop(0, colors.brilliant);
        fireGradient.addColorStop(0.5, colors.fire);
        fireGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = fireGradient;
        ctx.beginPath();
        ctx.arc(fireX, fireY, fireSize * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Fire core
        ctx.fillStyle = colors.light;
        ctx.globalAlpha = fire * fireLife;
        ctx.beginPath();
        ctx.arc(fireX, fireY, fireSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    ctx.restore();
  }

  function renderCrystallineFlaws(ctx: CanvasRenderingContext2D, structure: any[], colors: any, flaws: number, time: number) {
    ctx.save();
    ctx.globalAlpha = flaws * 0.6;
    
    const bounds = getBounds(structure);
    const flawCount = Math.floor(flaws * 20);
    
    for (let i = 0; i < flawCount; i++) {
      const flawPhase = time * 0.5 + i * 0.7;
      const flawX = bounds.centerX + (Math.random() - 0.5) * bounds.width * 0.6;
      const flawY = bounds.centerY + (Math.random() - 0.5) * bounds.height * 0.6;
      const flawSize = Math.random() * 2 + 0.5;
      
      // Natural inclusion
      ctx.fillStyle = colors.dark;
      ctx.globalAlpha = flaws * 0.3;
      ctx.beginPath();
      ctx.arc(flawX, flawY, flawSize, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }

  function drawCrystalPath(ctx: CanvasRenderingContext2D, points: any[]) {
    if (points.length < 3) return;
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    // Ultra-precise crystal edges
    for (let i = 1; i < points.length; i++) {
      const current = points[i];
      const previous = points[i - 1];
      const next = points[(i + 1) % points.length];
      
      // Crystalline precision with minimal smoothing
      const precision = current.orderLevel || 0.9;
      const cp1x = previous.x + (current.x - (points[i - 2] || previous).x) * precision * 0.1;
      const cp1y = previous.y + (current.y - (points[i - 2] || previous).y) * precision * 0.1;
      const cp2x = current.x - (next.x - previous.x) * precision * 0.1;
      const cp2y = current.y - (next.y - previous.y) * precision * 0.1;
      
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, current.x, current.y);
    }
    
    // Close the crystal shape with precision
    const first = points[0];
    const last = points[points.length - 1];
    const secondLast = points[points.length - 2];
    const second = points[1];
    
    const precision = 0.9;
    const cp1x = last.x + (first.x - secondLast.x) * precision * 0.1;
    const cp1y = last.y + (first.y - secondLast.y) * precision * 0.1;
    const cp2x = first.x - (second.x - last.x) * precision * 0.1;
    const cp2y = first.y - (second.y - last.y) * precision * 0.1;
    
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
  name: "💎 Crystal Lattice",
  description: "Geometric crystal structures with light refraction, spectral dispersion, and optical brilliance",
  defaultParams: {
    seed: "crystal-lattice-precision",
    // Universal controls
    backgroundColor: "#fafafa",
    backgroundType: "gradient",
    backgroundGradientStart: "#fafafa",
    backgroundGradientEnd: "#f0f0f0",
    backgroundGradientDirection: 45,
    fillType: "gradient",
    fillColor: "#87ceeb",
    fillGradientStart: "#e0f2fe",
    fillGradientEnd: "#60a5fa",
    fillGradientDirection: 135,
    fillOpacity: 0.7,
    strokeType: "solid",
    strokeColor: "#2563eb",
    strokeWidth: 1,
    strokeOpacity: 1,
    // Template-specific
    frequency: 0.8,
    amplitude: 120,
    latticeType: 2,
    crystallineOrder: 0.9,
    facetPrecision: 0.95,
    symmetryLevel: 6,
    lightRefraction: 0.7,
    internalReflection: 0.5,
    dispersion: 0.3,
    facetCount: 12,
    surfaceRoughness: 0.05,
    crystallineFlaws: 0.03,
    transparency: 0.7,
    brilliance: 0.8,
    fire: 0.4,
    crystalHue: 210,
    purity: 0.9,
    materialType: 1
  }
};

export const id = 'crystal-lattice';
export const name = "Crystal Lattice";
export const description = "Geometric crystal structures with light refraction, spectral dispersion, and optical brilliance";

export const defaultParams = metadata.defaultParams;

export const code = `${applyUniversalBackground.toString()}

${drawVisualization.toString()}`;

// Re-export for compatibility
export const parameters = PARAMETERS;
export const draw = drawVisualization;