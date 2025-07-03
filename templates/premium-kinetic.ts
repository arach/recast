// ✨ Premium Kinetic
const PARAMETERS = {
  // Universal Background Controls
  backgroundColor: { type: 'color', default: "#f8fafc", label: 'Background Color', category: 'Background' },
  backgroundType: { type: 'select', options: [{"value":"transparent","label":"Transparent"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "gradient", label: 'Background Type', category: 'Background' },
  backgroundGradientStart: { type: 'color', default: "#f8fafc", label: 'Gradient Start', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientEnd: { type: 'color', default: "#e2e8f0", label: 'Gradient End', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 225, label: 'Gradient Direction', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  
  // Universal Fill Controls
  fillType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "gradient", label: 'Fill Type', category: 'Fill' },
  fillColor: { type: 'color', default: "#0f172a", label: 'Fill Color', category: 'Fill', showIf: (params)=>params.fillType === 'solid' },
  fillGradientStart: { type: 'color', default: "#6484a3", label: 'Gradient Start', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientEnd: { type: 'color', default: "#0f172a", label: 'Gradient End', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 45, label: 'Gradient Direction', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.85, label: 'Fill Opacity', category: 'Fill', showIf: (params)=>params.fillType !== 'none' },
  
  // Universal Stroke Controls
  strokeType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid"},{"value":"dashed","label":"Dashed"},{"value":"dotted","label":"Dotted"}], default: "solid", label: 'Stroke Type', category: 'Stroke' },
  strokeColor: { type: 'color', default: "#0f172a", label: 'Stroke Color', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeWidth: { type: 'slider', min: 0, max: 10, step: 0.5, default: 3, label: 'Stroke Width', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.85, label: 'Stroke Opacity', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  
  // Template-specific: Motion & Energy
  frequency: { type: 'slider', min: 0.1, max: 3, step: 0.1, default: 1.2, label: 'Kinetic Energy', category: 'Motion' },
  amplitude: { type: 'slider', min: 60, max: 200, step: 5, default: 120, label: 'Scale Presence', category: 'Motion' },
  
  // Template-specific: Aesthetic Architecture
  formComplexity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.75, label: 'Form Complexity', category: 'Form' },
  surfaceTension: { type: 'slider', min: 0.2, max: 2, step: 0.1, default: 1.3, label: 'Surface Tension', category: 'Form' },
  opticalWeight: { type: 'slider', min: 0.3, max: 1.5, step: 0.05, default: 0.85, label: 'Optical Weight', category: 'Form' },
  
  // Template-specific: Premium Materials
  materialType: {
    type: 'select',
    options: [{"value":0,"label":"Glass"},{"value":1,"label":"Metal"},{"value":2,"label":"Carbon"},{"value":3,"label":"Ceramic"},{"value":4,"label":"Liquid"}],
    default: 2,
    label: 'Material',
    category: 'Material'
  },
  surfaceQuality: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.8, label: 'Surface Refinement', category: 'Material' },
  
  // Template-specific: Chromatic Sophistication
  chromaticDepth: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.6, label: 'Chromatic Depth', category: 'Effects' },
  luminanceFlow: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.4, label: 'Luminance Flow', category: 'Effects' },
  specularReflection: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.3, label: 'Specular Highlights', category: 'Effects' },
  
  // Template-specific: Mathematical Elegance
  harmonicRatio: { type: 'slider', min: 1, max: 3, step: 0.1, default: 1.618, label: 'Harmonic Ratio (φ=1.618)', category: 'Mathematics' },
  geometricPurity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.7, label: 'Geometric Purity', category: 'Mathematics' },
  organicDeviation: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.25, label: 'Organic Deviation', category: 'Mathematics' }
};

function applyUniversalBackground(ctx, width, height, params) {
  if (!params.backgroundType || params.backgroundType === 'transparent') return;
  
  if (params.backgroundType === 'solid') {
    ctx.fillStyle = params.backgroundColor || '#f8fafc';
    ctx.fillRect(0, 0, width, height);
  } else if (params.backgroundType === 'gradient') {
    const direction = (params.backgroundGradientDirection || 225) * (Math.PI / 180);
    const x1 = width / 2 - Math.cos(direction) * width / 2;
    const y1 = height / 2 - Math.sin(direction) * height / 2;
    const x2 = width / 2 + Math.cos(direction) * width / 2;
    const y2 = height / 2 + Math.sin(direction) * height / 2;
    
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, params.backgroundGradientStart || '#f8fafc');
    gradient.addColorStop(1, params.backgroundGradientEnd || '#e2e8f0');
    
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

  // Premium background with subtle environmental lighting
  drawPremiumEnvironment(ctx, width, height, params);

  // Extract sophisticated parameters
  const centerX = width / 2;
  const centerY = height / 2;
  const frequency = params.frequency || 1.2;
  const amplitude = params.amplitude || 120;
  const formComplexity = params.formComplexity || 0.75;
  const surfaceTension = params.surfaceTension || 1.3;
  const opticalWeight = params.opticalWeight || 0.85;
  const materialType = Number(params.materialType) || 2;
  const surfaceQuality = params.surfaceQuality || 0.8;
  const chromaticDepth = params.chromaticDepth || 0.6;
  const luminanceFlow = params.luminanceFlow || 0.4;
  const specularReflection = params.specularReflection || 0.3;
  const harmonicRatio = params.harmonicRatio || 1.618;
  const geometricPurity = params.geometricPurity || 0.7;
  const organicDeviation = params.organicDeviation || 0.25;

  // Kinetic timing with multiple harmonic layers
  const primaryPhase = time * frequency;
  const secondaryPhase = time * frequency * harmonicRatio;
  const tertiaryPhase = time * frequency / harmonicRatio;

  // Scale with premium proportions
  const baseScale = Math.min(width, height) / 350;
  const scaledAmplitude = amplitude * baseScale;

  // Generate premium form with sophisticated mathematics
  const primaryForm = generateSophisticatedForm(
    centerX, centerY, scaledAmplitude,
    formComplexity, geometricPurity, organicDeviation,
    primaryPhase, harmonicRatio
  );

  // Material system
  const material = getMaterialProperties(materialType, surfaceQuality, chromaticDepth);

  // Render with premium techniques
  renderAdvancedGeometry(ctx, primaryForm, material, {
    surfaceTension,
    opticalWeight,
    luminanceFlow,
    specularReflection,
    primaryPhase,
    secondaryPhase,
    centerX,
    centerY,
    scale: scaledAmplitude
  });

  function drawPremiumEnvironment(ctx: CanvasRenderingContext2D, width: number, height: number, params: any) {
    // Apply universal background first
    applyUniversalBackground(ctx, width, height, params);

    // Subtle environmental reflections
    if (params.specularReflection > 0.2) {
      const reflectionGradient = ctx.createLinearGradient(0, 0, width, height);
      reflectionGradient.addColorStop(0, `rgba(255, 255, 255, ${params.specularReflection * 0.1})`);
      reflectionGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = reflectionGradient;
      ctx.fillRect(0, 0, width, height);
    }
  }

  function generateSophisticatedForm(centerX: number, centerY: number, radius: number, complexity: number, purity: number, organic: number, phase: number, ratio: number) {
    const points = [];
    const basePoints = Math.floor(6 + complexity * 12); // 6-18 points
    
    for (let i = 0; i < basePoints; i++) {
      const t = i / basePoints;
      const angle = t * Math.PI * 2;
      
      // Golden ratio harmonics for natural proportions
      const harmonic1 = Math.sin(angle * 3 + phase) * complexity * 0.15;
      const harmonic2 = Math.sin(angle * 5 + phase * ratio) * complexity * 0.08;
      const harmonic3 = Math.sin(angle * 8 + phase / ratio) * complexity * 0.04;
      
      // Geometric purity vs organic deviation
      const geometricRadius = radius * (1 + harmonic1 + harmonic2 + harmonic3);
      const organicNoise = (Math.sin(angle * 7 + phase * 2) + Math.sin(angle * 11 + phase * 3)) * organic * 0.1;
      const finalRadius = geometricRadius * (1 + organicNoise);
      
      // Surface tension affects point positioning
      const tensionEffect = 1 + Math.sin(angle * 2 + phase) * 0.05;
      
      points.push({
        x: centerX + Math.cos(angle) * finalRadius * tensionEffect,
        y: centerY + Math.sin(angle) * finalRadius * tensionEffect,
        normal: { x: Math.cos(angle), y: Math.sin(angle) },
        curvature: harmonic1 + harmonic2,
        tension: tensionEffect
      });
    }
    
    return points;
  }

  function getMaterialProperties(type: number, quality: number, chromatic: number) {
    const materials = [
      // Glass
      {
        primary: [72, 162, 255],
        secondary: [147, 197, 253],
        accent: [255, 255, 255],
        roughness: 0.05,
        metallic: 0.1,
        transparency: 0.3
      },
      // Metal
      {
        primary: [100, 116, 139],
        secondary: [148, 163, 184],
        accent: [241, 245, 249],
        roughness: 0.15,
        metallic: 0.9,
        transparency: 0.0
      },
      // Carbon
      {
        primary: [15, 23, 42],
        secondary: [51, 65, 85],
        accent: [100, 116, 139],
        roughness: 0.25,
        metallic: 0.3,
        transparency: 0.0
      },
      // Ceramic
      {
        primary: [245, 245, 244],
        secondary: [231, 229, 228],
        accent: [168, 162, 158],
        roughness: 0.1,
        metallic: 0.0,
        transparency: 0.0
      },
      // Liquid
      {
        primary: [59, 130, 246],
        secondary: [99, 102, 241],
        accent: [139, 92, 246],
        roughness: 0.0,
        metallic: 0.0,
        transparency: 0.4
      }
    ];

    const baseMaterial = materials[Math.min(type, materials.length - 1)];
    
    return {
      ...baseMaterial,
      quality: quality,
      chromaticDepth: chromatic
    };
  }

  function renderAdvancedGeometry(ctx: CanvasRenderingContext2D, points: any[], material: any, renderParams: any) {
    const { surfaceTension, opticalWeight, luminanceFlow, specularReflection, primaryPhase, centerX, centerY, scale } = renderParams;

    // Multiple rendering passes for premium quality
    
    // 1. Subsurface scattering (soft depth)
    if (material.transparency > 0.1) {
      renderSubsurfaceScattering(ctx, points, material, scale);
    }

    // 2. Main surface with sophisticated shading
    renderMainSurface(ctx, points, material, surfaceTension, opticalWeight, luminanceFlow, primaryPhase, params);

    // 3. Specular highlights
    if (specularReflection > 0.1) {
      renderSpecularHighlights(ctx, points, material, specularReflection, centerX, centerY);
    }

    // 4. Edge refinement
    renderEdgeRefinement(ctx, points, material, opticalWeight, params);
  }

  function renderSubsurfaceScattering(ctx: CanvasRenderingContext2D, points: any[], material: any, scale: number) {
    ctx.save();
    ctx.globalAlpha = material.transparency * 0.6;
    
    // Offset for depth
    ctx.translate(scale * 0.02, scale * 0.02);
    
    // Soft blur effect
    ctx.filter = 'blur(3px)';
    
    const subsurfaceColor = `rgba(${material.secondary.join(',')}, 0.4)`;
    ctx.fillStyle = subsurfaceColor;
    
    drawSmoothPath(ctx, points, true);
    ctx.fill();
    
    ctx.restore();
  }

  function renderMainSurface(ctx: CanvasRenderingContext2D, points: any[], material: any, tension: number, weight: number, luminance: number, phase: number, params: any) {
    ctx.save();

    // Apply fill based on universal fill settings
    if (params.fillType !== 'none') {
      if (params.fillType === 'solid') {
        ctx.fillStyle = params.fillColor || `rgb(${material.primary.join(',')})`;
        ctx.globalAlpha = params.fillOpacity || weight;
      } else if (params.fillType === 'gradient') {
        const bounds = getBounds(points);
        const direction = (params.fillGradientDirection || 45) * (Math.PI / 180);
        
        // Create gradient based on material properties
        const gradientLength = Math.max(bounds.width, bounds.height);
        const x1 = bounds.centerX - Math.cos(direction) * gradientLength * 0.5;
        const y1 = bounds.centerY - Math.sin(direction) * gradientLength * 0.5;
        const x2 = bounds.centerX + Math.cos(direction) * gradientLength * 0.5;
        const y2 = bounds.centerY + Math.sin(direction) * gradientLength * 0.5;
        
        const surfaceGradient = ctx.createLinearGradient(x1, y1, x2, y2);
        surfaceGradient.addColorStop(0, params.fillGradientStart || `rgb(${material.accent.join(',')})`);
        surfaceGradient.addColorStop(0.5, `rgba(${material.secondary.join(',')}, 0.8)`);
        surfaceGradient.addColorStop(1, params.fillGradientEnd || `rgb(${material.primary.join(',')})`);
        
        ctx.fillStyle = surfaceGradient;
        ctx.globalAlpha = params.fillOpacity || weight;
      }
      
      drawSmoothPath(ctx, points, true);
      ctx.fill();
    }

    // Apply stroke based on universal stroke settings
    if (params.strokeType !== 'none') {
      ctx.strokeStyle = params.strokeColor || `rgb(${material.primary.join(',')})`;
      ctx.lineWidth = params.strokeWidth || (2 + weight * 2);
      ctx.globalAlpha = params.strokeOpacity || weight;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      if (params.strokeType === 'dashed') {
        ctx.setLineDash([ctx.lineWidth * 3, ctx.lineWidth * 2]);
      } else if (params.strokeType === 'dotted') {
        ctx.setLineDash([ctx.lineWidth, ctx.lineWidth * 2]);
      }
      
      drawSmoothPath(ctx, points, true);
      ctx.stroke();
    }

    ctx.restore();
  }

  function renderSpecularHighlights(ctx: CanvasRenderingContext2D, points: any[], material: any, reflection: number, centerX: number, centerY: number) {
    ctx.save();
    ctx.globalAlpha = reflection;
    
    // Find highlight regions (top 30% of form)
    const highlightPoints = points.filter((p, i) => {
      const angle = Math.atan2(p.y - centerY, p.x - centerX);
      return angle > -Math.PI * 0.65 && angle < -Math.PI * 0.35; // Top arc
    });

    if (highlightPoints.length > 2) {
      const highlightGradient = ctx.createLinearGradient(
        highlightPoints[0].x, highlightPoints[0].y,
        highlightPoints[Math.floor(highlightPoints.length/2)].x, highlightPoints[Math.floor(highlightPoints.length/2)].y
      );
      
      highlightGradient.addColorStop(0, `rgba(${material.accent.join(',')}, 0.8)`);
      highlightGradient.addColorStop(1, 'transparent');
      
      ctx.strokeStyle = highlightGradient;
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      
      drawSmoothPath(ctx, highlightPoints, false);
      ctx.stroke();
    }

    ctx.restore();
  }

  function renderEdgeRefinement(ctx: CanvasRenderingContext2D, points: any[], material: any, weight: number, params: any) {
    // Subtle edge enhancement for premium quality
    if (params.strokeType !== 'none' && weight > 0.5) {
      ctx.save();
      ctx.globalAlpha = weight * 0.3;
      ctx.strokeStyle = params.strokeColor || `rgba(${material.primary.join(',')}, 0.6)`;
      ctx.lineWidth = 0.5;
      ctx.lineCap = 'round';
      
      drawSmoothPath(ctx, points, true);
      ctx.stroke();
      
      ctx.restore();
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

  function drawSmoothPath(ctx: CanvasRenderingContext2D, points: any[], close: boolean = false) {
    if (points.length < 2) return;
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    // Use cubic bezier curves for ultra-smooth premium curves
    for (let i = 1; i < points.length; i++) {
      const current = points[i];
      const previous = points[i - 1];
      const next = points[(i + 1) % points.length];
      
      // Calculate smooth control points
      const tension = current.tension || 0.8;
      const cp1x = previous.x + (current.x - (points[i - 2] || previous).x) * tension * 0.2;
      const cp1y = previous.y + (current.y - (points[i - 2] || previous).y) * tension * 0.2;
      const cp2x = current.x - (next.x - previous.x) * tension * 0.2;
      const cp2y = current.y - (next.y - previous.y) * tension * 0.2;
      
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, current.x, current.y);
    }
    
    if (close && points.length > 2) {
      const first = points[0];
      const last = points[points.length - 1];
      const secondLast = points[points.length - 2];
      const second = points[1];
      
      const tension = first.tension || 0.8;
      const cp1x = last.x + (first.x - secondLast.x) * tension * 0.2;
      const cp1y = last.y + (first.y - secondLast.y) * tension * 0.2;
      const cp2x = first.x - (second.x - last.x) * tension * 0.2;
      const cp2y = first.y - (second.y - last.y) * tension * 0.2;
      
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, first.x, first.y);
    }
  }
}

export const metadata = {
  name: "✨ Premium Kinetic",
  description: "Next-level aesthetic sophistication with advanced materials, lighting, and mathematical elegance",
  defaultParams: {
    seed: "premium-kinetic",
    // Background
    backgroundColor: "#f8fafc",
    backgroundType: "gradient",
    backgroundGradientStart: "#f8fafc",
    backgroundGradientEnd: "#e2e8f0",
    backgroundGradientDirection: 225,
    // Fill
    fillType: "gradient",
    fillGradientStart: "#6484a3",
    fillGradientEnd: "#0f172a",
    fillGradientDirection: 45,
    fillOpacity: 0.85,
    // Stroke
    strokeType: "solid",
    strokeColor: "#0f172a",
    strokeWidth: 3,
    strokeOpacity: 0.85,
    // Template-specific
    frequency: 1.2,
    amplitude: 120,
    formComplexity: 0.75,
    surfaceTension: 1.3,
    opticalWeight: 0.85,
    materialType: 2,
    surfaceQuality: 0.8,
    chromaticDepth: 0.6,
    luminanceFlow: 0.4,
    specularReflection: 0.3,
    harmonicRatio: 1.618,
    geometricPurity: 0.7,
    organicDeviation: 0.25
  }
};

export const id = 'premium-kinetic';
export const name = "✨ Premium Kinetic";
export const description = "Next-level aesthetic sophistication with advanced materials, lighting, and mathematical elegance";
export const defaultParams = metadata.defaultParams;

export const code = `${PARAMETERS.toString().replace('PARAMETERS', 'const PARAMETERS')}\n\n${applyUniversalBackground.toString()}\n\n${drawVisualization.toString()}`;