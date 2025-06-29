import type { ParameterDefinition, PresetMetadata } from './types';

// Premium Kinetic - Next-level aesthetic sophistication
export const parameters: Record<string, ParameterDefinition> = {
  // Motion & Energy
  frequency: { type: 'slider', min: 0.1, max: 3, step: 0.1, default: 1.2, label: 'Kinetic Energy' },
  amplitude: { type: 'slider', min: 60, max: 200, step: 5, default: 120, label: 'Scale Presence' },
  
  // Aesthetic Architecture
  formComplexity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.75, label: 'Form Complexity' },
  surfaceTension: { type: 'slider', min: 0.2, max: 2, step: 0.1, default: 1.3, label: 'Surface Tension' },
  opticalWeight: { type: 'slider', min: 0.3, max: 1.5, step: 0.05, default: 0.85, label: 'Optical Weight' },
  
  // Premium Materials
  materialType: {
    type: 'slider',
    min: 0,
    max: 4,
    step: 1,
    default: 2,
    label: 'Material (0=Glass, 1=Metal, 2=Carbon, 3=Ceramic, 4=Liquid)'
  },
  surfaceQuality: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.8, label: 'Surface Refinement' },
  
  // Chromatic Sophistication
  chromaticDepth: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.6, label: 'Chromatic Depth' },
  luminanceFlow: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.4, label: 'Luminance Flow' },
  specularReflection: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.3, label: 'Specular Highlights' },
  
  // Mathematical Elegance
  harmonicRatio: { type: 'slider', min: 1, max: 3, step: 0.1, default: 1.618, label: 'Harmonic Ratio (φ=1.618)' },
  geometricPurity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.7, label: 'Geometric Purity' },
  organicDeviation: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.25, label: 'Organic Deviation' }
};

export function draw(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, any>,
  generator: any,
  time: number
) {
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
  const materialType = Math.round(params.materialType || 2);
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
    // Sophisticated environmental lighting
    const envGradient = ctx.createRadialGradient(
      width * 0.3, height * 0.2, 0,
      width * 0.7, height * 0.8, Math.max(width, height) * 0.8
    );
    
    // Material-aware environment colors
    if (params.materialType <= 1) {
      // Glass/Metal - cool environment
      envGradient.addColorStop(0, '#f8fafc');
      envGradient.addColorStop(0.4, '#f1f5f9');
      envGradient.addColorStop(1, '#e2e8f0');
    } else if (params.materialType <= 3) {
      // Carbon/Ceramic - neutral luxury
      envGradient.addColorStop(0, '#fafaf9');
      envGradient.addColorStop(0.4, '#f5f5f4');
      envGradient.addColorStop(1, '#e7e5e4');
    } else {
      // Liquid - warm environment
      envGradient.addColorStop(0, '#fef7f0');
      envGradient.addColorStop(0.4, '#fef2e2');
      envGradient.addColorStop(1, '#fed7aa');
    }
    
    ctx.fillStyle = envGradient;
    ctx.fillRect(0, 0, width, height);

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
    renderMainSurface(ctx, points, material, surfaceTension, opticalWeight, luminanceFlow, primaryPhase);

    // 3. Specular highlights
    if (specularReflection > 0.1) {
      renderSpecularHighlights(ctx, points, material, specularReflection, centerX, centerY);
    }

    // 4. Edge refinement
    renderEdgeRefinement(ctx, points, material, opticalWeight);
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

  function renderMainSurface(ctx: CanvasRenderingContext2D, points: any[], material: any, tension: number, weight: number, luminance: number, phase: number) {
    ctx.save();

    // Create sophisticated surface gradient
    const bounds = getBounds(points);
    const surfaceGradient = ctx.createRadialGradient(
      bounds.centerX - bounds.width * 0.2, 
      bounds.centerY - bounds.height * 0.2, 
      0,
      bounds.centerX, 
      bounds.centerY, 
      Math.max(bounds.width, bounds.height) * 0.7
    );

    // Material-aware gradient stops
    const primaryAlpha = weight;
    const secondaryAlpha = weight * 0.7;
    
    surfaceGradient.addColorStop(0, `rgba(${material.accent.join(',')}, ${primaryAlpha})`);
    surfaceGradient.addColorStop(0.4, `rgba(${material.secondary.join(',')}, ${secondaryAlpha})`);
    surfaceGradient.addColorStop(1, `rgba(${material.primary.join(',')}, ${primaryAlpha})`);

    ctx.fillStyle = surfaceGradient;
    
    drawSmoothPath(ctx, points, true);
    ctx.fill();

    // Surface stroke with variable weight
    const strokeColor = `rgba(${material.primary.join(',')}, ${weight})`;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2 + weight * 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

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

  function renderEdgeRefinement(ctx: CanvasRenderingContext2D, points: any[], material: any, weight: number) {
    // Subtle edge enhancement for premium quality
    ctx.save();
    ctx.globalAlpha = weight * 0.3;
    ctx.strokeStyle = `rgba(${material.primary.join(',')}, 0.6)`;
    ctx.lineWidth = 0.5;
    ctx.lineCap = 'round';
    
    drawSmoothPath(ctx, points, true);
    ctx.stroke();
    
    ctx.restore();
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

export const metadata: PresetMetadata = {
  name: "✨ Premium Kinetic",
  description: "Next-level aesthetic sophistication with advanced materials, lighting, and mathematical elegance",
  defaultParams: {
    seed: "premium-kinetic",
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