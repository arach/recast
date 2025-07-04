import type { ParameterDefinition, PresetMetadata } from './types';

// Dynamic Diamond
const PARAMETERS = {
  // Universal Background Controls
  backgroundColor: { type: 'color', default: "#f8f8f8", label: 'Background Color', category: 'Background' },
  backgroundType: { type: 'select', options: [{"value":"transparent","label":"Transparent"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "gradient", label: 'Background Type', category: 'Background' },
  backgroundGradientStart: { type: 'color', default: "#fefefe", label: 'Gradient Start', category: 'Background', showIf: (params) => params.backgroundType === 'gradient' },
  backgroundGradientEnd: { type: 'color', default: "#f0f0f0", label: 'Gradient End', category: 'Background', showIf: (params) => params.backgroundType === 'gradient' },
  backgroundGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 135, label: 'Gradient Direction', category: 'Background', showIf: (params) => params.backgroundType === 'gradient' },
  
  // Universal Fill Controls
  fillType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "gradient", label: 'Fill Type', category: 'Fill' },
  fillColor: { type: 'color', default: "#3A3A3A", label: 'Fill Color', category: 'Fill', showIf: (params) => params.fillType === 'solid' },
  fillGradientStart: { type: 'color', default: "#606060", label: 'Gradient Start', category: 'Fill', showIf: (params) => params.fillType === 'gradient' },
  fillGradientEnd: { type: 'color', default: "#2A2A2A", label: 'Gradient End', category: 'Fill', showIf: (params) => params.fillType === 'gradient' },
  fillGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 90, label: 'Gradient Direction', category: 'Fill', showIf: (params) => params.fillType === 'gradient' },
  fillOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.8, label: 'Fill Opacity', category: 'Fill', showIf: (params) => params.fillType !== 'none' },
  
  // Universal Stroke Controls
  strokeType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid"},{"value":"dashed","label":"Dashed"},{"value":"dotted","label":"Dotted"}], default: "solid", label: 'Stroke Type', category: 'Stroke' },
  strokeColor: { type: 'color', default: "#4A4A4A", label: 'Stroke Color', category: 'Stroke', showIf: (params) => params.strokeType !== 'none' },
  strokeWidth: { type: 'slider', min: 0, max: 10, step: 0.5, default: 2, label: 'Stroke Width', category: 'Stroke', showIf: (params) => params.strokeType !== 'none' },
  strokeOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Stroke Opacity', category: 'Stroke', showIf: (params) => params.strokeType !== 'none' },
  
  // Diamond fundamentals - shape definition (70% of controls)
  diamondStyle: {
    type: 'slider',
    min: 0,
    max: 4,
    step: 1,
    default: 0,
    label: 'Diamond Style (0=Classic, 1=Elongated, 2=Brilliant, 3=Marquise, 4=Emerald)',
    category: 'Shape'
  },
  
  // Luxury proportions with mathematical precision
  carat: { type: 'slider', min: 0.5, max: 2, step: 0.1, default: 1.0, label: 'Carat (Size Multiplier)', category: 'Shape' },
  tableRatio: { type: 'slider', min: 0.5, max: 0.8, step: 0.02, default: 0.65, label: 'Table Ratio', category: 'Shape' },
  depthRatio: { type: 'slider', min: 0.6, max: 1.2, step: 0.05, default: 0.8, label: 'Depth Ratio', category: 'Shape' },
  
  // Cut quality and proportions
  cutPrecision: { type: 'slider', min: 0.7, max: 1, step: 0.01, default: 0.95, label: 'Cut Precision', category: 'Quality' },
  symmetryGrade: { type: 'slider', min: 0.8, max: 1, step: 0.01, default: 0.92, label: 'Symmetry Grade', category: 'Quality' },
  facetAngle: { type: 'slider', min: 25, max: 45, step: 1, default: 35, label: 'Crown Angle (degrees)', category: 'Quality' },
  
  // Luxury features
  pavilionDepth: { type: 'slider', min: 0.4, max: 0.8, step: 0.02, default: 0.6, label: 'Pavilion Depth', category: 'Quality' },
  girdleThickness: { type: 'slider', min: 0.01, max: 0.05, step: 0.005, default: 0.02, label: 'Girdle Thickness', category: 'Quality' },
  
  // Brand enhancement (30% of controls)
  facetStyle: {
    type: 'slider',
    min: 0,
    max: 3,
    step: 1,
    default: 1,
    label: 'Facets (0=None, 1=Minimal, 2=Classic, 3=Brilliant)',
    category: 'Effects'
  },
  
  // Luxury materials and finish
  materialType: {
    type: 'slider',
    min: 0,
    max: 4,
    step: 1,
    default: 2,
    label: 'Material (0=Crystal, 1=Platinum, 2=Gold, 3=Carbon, 4=Prismatic)',
    category: 'Material'
  },
  
  // Premium color palette
  brandHue: { type: 'slider', min: 0, max: 360, step: 10, default: 45, label: 'Brand Hue', category: 'Material' },
  luxury: { type: 'slider', min: 0.6, max: 1, step: 0.05, default: 0.85, label: 'Luxury Factor', category: 'Material' },
  exclusivity: { type: 'slider', min: 0.5, max: 1, step: 0.05, default: 0.8, label: 'Exclusivity', category: 'Material' },
  
  // Premium effects
  brilliance: { type: 'slider', min: 0.3, max: 1, step: 0.05, default: 0.7, label: 'Brilliance', category: 'Effects' },
  fireDispersion: { type: 'slider', min: 0, max: 0.4, step: 0.02, default: 0.2, label: 'Fire Dispersion', category: 'Effects' },
  scintillation: { type: 'slider', min: 0, max: 0.6, step: 0.05, default: 0.3, label: 'Scintillation', category: 'Effects' }
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

  // Extract parameters
  const centerX = width / 2;
  const centerY = height / 2;
  const diamondStyleNum = Math.round(params.diamondStyle || 0);
  const carat = params.carat || 1.0;
  const tableRatio = params.tableRatio || 0.65;
  const depthRatio = params.depthRatio || 0.8;
  const cutPrecision = params.cutPrecision || 0.95;
  const symmetryGrade = params.symmetryGrade || 0.92;
  const facetAngle = (params.facetAngle || 35) * Math.PI / 180;
  const pavilionDepth = params.pavilionDepth || 0.6;
  const girdleThickness = params.girdleThickness || 0.02;
  const facetStyleNum = Math.round(params.facetStyle || 1);
  const materialTypeNum = Math.round(params.materialType || 2);
  const brandHue = params.brandHue || 45;
  const luxury = params.luxury || 0.85;
  const exclusivity = params.exclusivity || 0.8;
  const brilliance = params.brilliance || 0.7;
  const fireDispersion = params.fireDispersion || 0.2;
  const scintillation = params.scintillation || 0.3;

  // Luxury sizing with carat influence
  const logoSize = Math.min(width, height) * 0.5 * carat;
  const diamondWidth = logoSize * tableRatio;
  const diamondHeight = logoSize * depthRatio;

  // Premium color system
  const luxuryColors = createLuxuryPalette(brandHue, luxury, exclusivity, materialTypeNum);

  // Generate diamond geometry
  const diamondGeometry = generateDynamicDiamond(
    diamondStyleNum, centerX, centerY, diamondWidth, diamondHeight,
    cutPrecision, symmetryGrade, facetAngle, pavilionDepth, girdleThickness
  );

  // Render fire dispersion effect (subtle rainbow)
  if (fireDispersion > 0.05 && Math.min(width, height) > 120) {
    renderFireDispersion(ctx, diamondGeometry, fireDispersion, logoSize);
  }

  // Render diamond base with luxury materials
  renderLuxuryDiamond(ctx, diamondGeometry, luxuryColors, materialTypeNum, centerX, centerY, logoSize, params);

  // Render facets for brilliance
  if (facetStyleNum > 0) {
    renderDiamondFacets(ctx, diamondGeometry, luxuryColors, facetStyleNum, brilliance, cutPrecision);
  }

  // Render scintillation sparkles
  if (scintillation > 0.1) {
    renderScintillation(ctx, diamondGeometry, luxuryColors, scintillation, time, logoSize);
  }

  // Premium highlight and brilliance
  renderLuxuryBrilliance(ctx, diamondGeometry, luxuryColors, brilliance, centerX, centerY, logoSize);

  function generateDynamicDiamond(style: number, centerX: number, centerY: number, width: number, height: number, precision: number, symmetry: number, facetAngle: number, pavilionDepth: number, girdleThickness: number) {
    const points = [];
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    
    // Girdle (middle section)
    const girdleY = centerY;
    const girdleHeight = height * girdleThickness;
    
    // Crown (top section)
    const crownHeight = halfHeight * (1 - pavilionDepth);
    const tableWidth = halfWidth * precision; // Precision affects table size
    
    // Pavilion (bottom section)  
    const pavilionHeight = halfHeight * pavilionDepth;
    
    switch (style) {
      case 0: // Classic round brilliant
        // Table (top flat surface)
        points.push(
          { x: centerX - tableWidth * 0.3, y: centerY - crownHeight, type: 'table' },
          { x: centerX + tableWidth * 0.3, y: centerY - crownHeight, type: 'table' }
        );
        
        // Crown facets
        points.push(
          { x: centerX - halfWidth * symmetry, y: girdleY - girdleHeight, type: 'crown' },
          { x: centerX + halfWidth * symmetry, y: girdleY - girdleHeight, type: 'crown' }
        );
        
        // Girdle
        points.push(
          { x: centerX + halfWidth, y: girdleY, type: 'girdle' },
          { x: centerX + halfWidth * symmetry, y: girdleY + girdleHeight, type: 'girdle' },
          { x: centerX - halfWidth * symmetry, y: girdleY + girdleHeight, type: 'girdle' },
          { x: centerX - halfWidth, y: girdleY, type: 'girdle' }
        );
        
        // Pavilion to culet
        points.push(
          { x: centerX, y: centerY + pavilionHeight, type: 'culet' }
        );
        break;
        
      case 1: // Elongated (marquise-style)
        const elongation = 1.5;
        points.push(
          { x: centerX, y: centerY - crownHeight * elongation, type: 'table' },
          { x: centerX - halfWidth * 0.7, y: centerY - crownHeight * 0.3, type: 'crown' },
          { x: centerX - halfWidth, y: girdleY, type: 'girdle' },
          { x: centerX - halfWidth * 0.7, y: centerY + pavilionHeight * 0.3, type: 'girdle' },
          { x: centerX, y: centerY + pavilionHeight * elongation, type: 'culet' },
          { x: centerX + halfWidth * 0.7, y: centerY + pavilionHeight * 0.3, type: 'girdle' },
          { x: centerX + halfWidth, y: girdleY, type: 'girdle' },
          { x: centerX + halfWidth * 0.7, y: centerY - crownHeight * 0.3, type: 'crown' }
        );
        break;
        
      case 2: // Brilliant cut with precise facets
        const brilliantPrecision = precision * 1.1;
        // More complex facet structure
        points.push(
          { x: centerX - tableWidth * 0.4, y: centerY - crownHeight, type: 'table' },
          { x: centerX + tableWidth * 0.4, y: centerY - crownHeight, type: 'table' },
          { x: centerX - halfWidth * 0.8 * brilliantPrecision, y: centerY - crownHeight * 0.6, type: 'crown' },
          { x: centerX + halfWidth * 0.8 * brilliantPrecision, y: centerY - crownHeight * 0.6, type: 'crown' },
          { x: centerX - halfWidth * brilliantPrecision, y: girdleY, type: 'girdle' },
          { x: centerX + halfWidth * brilliantPrecision, y: girdleY, type: 'girdle' },
          { x: centerX - halfWidth * 0.6, y: centerY + pavilionHeight * 0.5, type: 'pavilion' },
          { x: centerX + halfWidth * 0.6, y: centerY + pavilionHeight * 0.5, type: 'pavilion' },
          { x: centerX, y: centerY + pavilionHeight, type: 'culet' }
        );
        break;
        
      case 3: // Marquise shape
        points.push(
          { x: centerX, y: centerY - crownHeight * 1.3, type: 'table' },
          { x: centerX - halfWidth * 0.9, y: centerY - crownHeight * 0.5, type: 'crown' },
          { x: centerX - halfWidth * 1.1, y: girdleY, type: 'girdle' },
          { x: centerX - halfWidth * 0.9, y: centerY + pavilionHeight * 0.5, type: 'pavilion' },
          { x: centerX, y: centerY + pavilionHeight * 1.3, type: 'culet' },
          { x: centerX + halfWidth * 0.9, y: centerY + pavilionHeight * 0.5, type: 'pavilion' },
          { x: centerX + halfWidth * 1.1, y: girdleY, type: 'girdle' },
          { x: centerX + halfWidth * 0.9, y: centerY - crownHeight * 0.5, type: 'crown' }
        );
        break;
        
      case 4: // Emerald cut (step cut)
        const stepWidth = halfWidth * 0.8;
        points.push(
          { x: centerX - stepWidth * 0.6, y: centerY - crownHeight, type: 'table' },
          { x: centerX + stepWidth * 0.6, y: centerY - crownHeight, type: 'table' },
          { x: centerX + stepWidth * 0.8, y: centerY - crownHeight * 0.8, type: 'table' },
          { x: centerX + stepWidth, y: centerY - crownHeight * 0.3, type: 'crown' },
          { x: centerX + halfWidth, y: girdleY, type: 'girdle' },
          { x: centerX + stepWidth, y: centerY + pavilionHeight * 0.3, type: 'pavilion' },
          { x: centerX + stepWidth * 0.6, y: centerY + pavilionHeight, type: 'culet' },
          { x: centerX - stepWidth * 0.6, y: centerY + pavilionHeight, type: 'culet' },
          { x: centerX - stepWidth, y: centerY + pavilionHeight * 0.3, type: 'pavilion' },
          { x: centerX - halfWidth, y: girdleY, type: 'girdle' },
          { x: centerX - stepWidth, y: centerY - crownHeight * 0.3, type: 'crown' },
          { x: centerX - stepWidth * 0.8, y: centerY - crownHeight * 0.8, type: 'table' }
        );
        break;
    }
    
    return {
      points: points,
      center: { x: centerX, y: centerY },
      width: width,
      height: height
    };
  }

  function createLuxuryPalette(hue: number, luxury: number, exclusivity: number, material: number) {
    const baseSaturation = 70 + luxury * 25;
    const baseLightness = 45 + exclusivity * 15;
    
    // Material-specific color adjustments
    const materialAdjustments = [
      { hueShift: 0, satMult: 0.3, lightMult: 1.4 },   // Crystal - clear/bright
      { hueShift: -20, satMult: 0.2, lightMult: 1.2 }, // Platinum - cool/metallic  
      { hueShift: 15, satMult: 0.8, lightMult: 1.1 },  // Gold - warm/rich
      { hueShift: -40, satMult: 1.2, lightMult: 0.8 }, // Carbon - dark/sophisticated
      { hueShift: 30, satMult: 1.5, lightMult: 1.0 }   // Prismatic - vibrant
    ];
    
    const adjustment = materialAdjustments[material] || materialAdjustments[0];
    const adjustedHue = hue + adjustment.hueShift;
    const adjustedSat = baseSaturation * adjustment.satMult;
    const adjustedLight = baseLightness * adjustment.lightMult;
    
    return {
      primary: `hsl(${adjustedHue}, ${adjustedSat}%, ${adjustedLight}%)`,
      accent: `hsl(${adjustedHue + 20}, ${adjustedSat * 1.2}%, ${adjustedLight + 10}%)`,
      luxury: `hsl(${adjustedHue - 10}, ${adjustedSat * 0.8}%, ${adjustedLight + 25}%)`,
      premium: `hsl(${adjustedHue + 10}, ${adjustedSat * 0.6}%, ${adjustedLight + 35}%)`,
      brilliance: `hsl(${adjustedHue}, ${adjustedSat * 0.4}%, ${Math.min(adjustedLight + 45, 95)}%)`,
      fire: `hsl(${adjustedHue + 40}, ${adjustedSat * 1.8}%, ${adjustedLight + 20}%)`
    };
  }

  function renderFireDispersion(ctx: CanvasRenderingContext2D, geometry: any, fire: number, size: number) {
    ctx.save();
    ctx.globalAlpha = fire * 0.3;
    
    // Prismatic dispersion effect
    const dispersions = [
      { hue: 0, offset: 0.1 },    // Red
      { hue: 60, offset: 0.05 },  // Yellow  
      { hue: 120, offset: 0 },    // Green
      { hue: 240, offset: -0.05 }, // Blue
      { hue: 300, offset: -0.1 }   // Violet
    ];
    
    dispersions.forEach(dispersion => {
      ctx.fillStyle = `hsl(${dispersion.hue}, 100%, 70%)`;
      
      const offsetGeometry = {
        ...geometry,
        points: geometry.points.map((p: any) => ({
          ...p,
          x: p.x + dispersion.offset * size * 0.1,
          y: p.y + dispersion.offset * size * 0.05
        }))
      };
      
      drawDiamondShape(ctx, offsetGeometry.points);
      ctx.fill();
    });
    
    ctx.restore();
  }

  function renderLuxuryDiamond(ctx: CanvasRenderingContext2D, geometry: any, colors: any, material: number, centerX: number, centerY: number, size: number, params: any) {
    ctx.save();
    
    // Apply universal fill
    if (params.fillType !== 'none') {
      ctx.globalAlpha = params.fillOpacity || 0.8;
      
      if (params.fillType === 'solid') {
        ctx.fillStyle = params.fillColor;
      } else if (params.fillType === 'gradient') {
        const luxuryGradient = ctx.createRadialGradient(
          centerX - size * 0.2, centerY - size * 0.3, 0,
          centerX, centerY, size * 0.8
        );
        
        luxuryGradient.addColorStop(0, params.fillGradientStart || colors.brilliance);
        luxuryGradient.addColorStop(0.3, colors.premium);
        luxuryGradient.addColorStop(0.7, colors.luxury);
        luxuryGradient.addColorStop(1, params.fillGradientEnd || colors.primary);
        
        ctx.fillStyle = luxuryGradient;
      } else {
        // Default luxury gradient
        const luxuryGradient = ctx.createRadialGradient(
          centerX - size * 0.2, centerY - size * 0.3, 0,
          centerX, centerY, size * 0.8
        );
        
        luxuryGradient.addColorStop(0, colors.brilliance);
        luxuryGradient.addColorStop(0.3, colors.premium);
        luxuryGradient.addColorStop(0.7, colors.luxury);
        luxuryGradient.addColorStop(1, colors.primary);
        
        ctx.fillStyle = luxuryGradient;
      }
      
      drawDiamondShape(ctx, geometry.points);
      ctx.fill();
    }
    
    // Apply universal stroke
    ctx.globalAlpha = params.strokeOpacity || 1;
    if (params.strokeType !== 'none') {
      ctx.strokeStyle = params.strokeColor || colors.accent;
      ctx.lineWidth = params.strokeWidth || 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      if (params.strokeType === 'dashed') {
        ctx.setLineDash([5, 5]);
      } else if (params.strokeType === 'dotted') {
        ctx.setLineDash([2, 3]);
      }
      
      drawDiamondShape(ctx, geometry.points);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    ctx.restore();
  }

  function renderDiamondFacets(ctx: CanvasRenderingContext2D, geometry: any, colors: any, facetStyle: number, brilliance: number, precision: number) {
    if (facetStyle === 0) return;
    
    ctx.save();
    ctx.globalAlpha = brilliance * 0.6;
    ctx.strokeStyle = colors.premium;
    ctx.lineWidth = 1;
    
    const points = geometry.points;
    const center = geometry.center;
    
    switch (facetStyle) {
      case 1: // Minimal facets
        // Just main division lines
        ctx.beginPath();
        ctx.moveTo(center.x, center.y - geometry.height/2);
        ctx.lineTo(center.x, center.y + geometry.height/2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(center.x - geometry.width/2, center.y);
        ctx.lineTo(center.x + geometry.width/2, center.y);
        ctx.stroke();
        break;
        
      case 2: // Classic facets
        // Radial facet lines
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          const endX = center.x + Math.cos(angle) * geometry.width * 0.3;
          const endY = center.y + Math.sin(angle) * geometry.height * 0.3;
          
          ctx.beginPath();
          ctx.moveTo(center.x, center.y);
          ctx.lineTo(endX, endY);
          ctx.stroke();
        }
        break;
        
      case 3: // Brilliant cut facets
        // Complex facet structure
        const facetCount = Math.round(8 + precision * 8);
        
        for (let i = 0; i < facetCount; i++) {
          const angle = (i / facetCount) * Math.PI * 2;
          const radius1 = geometry.width * 0.2;
          const radius2 = geometry.width * 0.4;
          
          const x1 = center.x + Math.cos(angle) * radius1;
          const y1 = center.y + Math.sin(angle) * radius1;
          const x2 = center.x + Math.cos(angle) * radius2;
          const y2 = center.y + Math.sin(angle) * radius2;
          
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
          
          // Star facets
          if (i % 2 === 0) {
            const starAngle = angle + Math.PI / facetCount;
            const starX = center.x + Math.cos(starAngle) * radius1 * 0.7;
            const starY = center.y + Math.sin(starAngle) * radius1 * 0.7;
            
            ctx.beginPath();
            ctx.moveTo(center.x, center.y);
            ctx.lineTo(starX, starY);
            ctx.stroke();
          }
        }
        break;
    }
    
    ctx.restore();
  }

  function renderScintillation(ctx: CanvasRenderingContext2D, geometry: any, colors: any, scintillation: number, time: number, size: number) {
    ctx.save();
    
    const sparkleCount = Math.round(scintillation * 12);
    
    for (let i = 0; i < sparkleCount; i++) {
      const sparklePhase = time * 4 + i * 1.3;
      const sparkleIntensity = Math.sin(sparklePhase) * 0.5 + 0.5;
      
      if (sparkleIntensity > 0.7) {
        ctx.globalAlpha = (sparkleIntensity - 0.7) * scintillation;
        
        // Random position within diamond
        const angle = (i / sparkleCount) * Math.PI * 2 + time * 0.5;
        const distance = (Math.sin(sparklePhase * 0.7) * 0.5 + 0.5) * size * 0.3;
        const sparkleX = geometry.center.x + Math.cos(angle) * distance;
        const sparkleY = geometry.center.y + Math.sin(angle) * distance;
        
        // Sparkle gradient
        const sparkleGradient = ctx.createRadialGradient(
          sparkleX, sparkleY, 0,
          sparkleX, sparkleY, 4
        );
        sparkleGradient.addColorStop(0, colors.brilliance);
        sparkleGradient.addColorStop(0.5, colors.fire);
        sparkleGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = sparkleGradient;
        ctx.beginPath();
        ctx.arc(sparkleX, sparkleY, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    ctx.restore();
  }

  function renderLuxuryBrilliance(ctx: CanvasRenderingContext2D, geometry: any, colors: any, brilliance: number, centerX: number, centerY: number, size: number) {
    ctx.save();
    ctx.globalAlpha = brilliance * 0.5;
    
    // Top brilliance highlight
    const brillianceGradient = ctx.createLinearGradient(
      centerX - size * 0.3, centerY - size * 0.5,
      centerX + size * 0.1, centerY - size * 0.2
    );
    brillianceGradient.addColorStop(0, colors.brilliance);
    brillianceGradient.addColorStop(0.6, colors.premium);
    brillianceGradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = brillianceGradient;
    
    // Apply to top portion of diamond
    const topPoints = geometry.points.filter((p: any) => p.y < centerY);
    if (topPoints.length > 0) {
      ctx.beginPath();
      ctx.moveTo(topPoints[0].x, topPoints[0].y);
      topPoints.forEach((p: any) => ctx.lineTo(p.x, p.y));
      ctx.lineTo(centerX, centerY);
      ctx.closePath();
      ctx.fill();
    }
    
    ctx.restore();
  }

  function drawDiamondShape(ctx: CanvasRenderingContext2D, points: any[]) {
    if (points.length < 3) return;
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    
    ctx.closePath();
  }
}

export const metadata: PresetMetadata = {
  name: "◆ Dynamic Diamond",
  description: "Luxury diamond cuts with proportional control and premium brilliance effects",
  defaultParams: {
    seed: "dynamic-diamond-luxury",
    backgroundColor: "#f8f8f8",
    backgroundType: "gradient",
    backgroundGradientStart: "#fefefe",
    backgroundGradientEnd: "#f0f0f0",
    backgroundGradientDirection: 135,
    fillType: "gradient",
    fillColor: "#3A3A3A",
    fillGradientStart: "#606060",
    fillGradientEnd: "#2A2A2A",
    fillGradientDirection: 90,
    fillOpacity: 0.8,
    strokeType: "solid",
    strokeColor: "#4A4A4A",
    strokeWidth: 2,
    strokeOpacity: 1,
    diamondStyle: 0,
    carat: 1.0,
    tableRatio: 0.65,
    depthRatio: 0.8,
    cutPrecision: 0.95,
    symmetryGrade: 0.92,
    facetAngle: 35,
    pavilionDepth: 0.6,
    girdleThickness: 0.02,
    facetStyle: 1,
    materialType: 2,
    brandHue: 45,
    luxury: 0.85,
    exclusivity: 0.8,
    brilliance: 0.7,
    fireDispersion: 0.2,
    scintillation: 0.3
  }
};

export const id = 'dynamic-diamond';
export const name = "◆ Dynamic Diamond";
export const description = "Luxury diamond cuts with proportional control and premium brilliance effects";
export const defaultParams = metadata.defaultParams;
export const parameters = PARAMETERS;
export { drawVisualization };

export const code = `// Dynamic Diamond
const PARAMETERS = ${JSON.stringify(PARAMETERS, null, 2)};

${applyUniversalBackground.toString()}

${drawVisualization.toString()}`;