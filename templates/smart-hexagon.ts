// ⬢ Smart Hexagon
const PARAMETERS = {
  // Universal Background Controls
  backgroundColor: { type: 'color', default: "#f8f9fa", label: 'Background Color', category: 'Background' },
  backgroundType: { type: 'select', options: [{"value":"transparent","label":"Transparent"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "gradient", label: 'Background Type', category: 'Background' },
  backgroundGradientStart: { type: 'color', default: "#f8f9fa", label: 'Gradient Start', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientEnd: { type: 'color', default: "#ffffff", label: 'Gradient End', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 45, label: 'Gradient Direction', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  
  // Universal Fill Controls
  fillType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "gradient", label: 'Fill Type', category: 'Fill' },
  fillColor: { type: 'color', default: "#2563eb", label: 'Fill Color', category: 'Fill', showIf: (params)=>params.fillType === 'solid' },
  fillGradientStart: { type: 'color', default: "#60a5fa", label: 'Gradient Start', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientEnd: { type: 'color', default: "#1e3a8a", label: 'Gradient End', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 90, label: 'Gradient Direction', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.8, label: 'Fill Opacity', category: 'Fill', showIf: (params)=>params.fillType !== 'none' },
  
  // Universal Stroke Controls
  strokeType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid"},{"value":"dashed","label":"Dashed"},{"value":"dotted","label":"Dotted"}], default: "solid", label: 'Stroke Type', category: 'Stroke' },
  strokeColor: { type: 'color', default: "#1e3a8a", label: 'Stroke Color', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeWidth: { type: 'slider', min: 0, max: 10, step: 0.5, default: 3, label: 'Stroke Width', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Stroke Opacity', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  
  // Hexagon fundamentals - shape definition (70% of controls)
  hexagonStyle: {
    type: 'slider',
    min: 0,
    max: 4,
    step: 1,
    default: 0,
    label: 'Hexagon Style (0=Regular, 1=Stretched, 2=Rotated, 3=Beveled, 4=Nested)'
  },
  
  // Geometric precision with mathematical control
  cornerRadius: { type: 'slider', min: 0, max: 30, step: 1, default: 8, label: 'Corner Radius' },
  aspectRatio: { type: 'slider', min: 0.7, max: 1.5, step: 0.05, default: 1.0, label: 'Width/Height Ratio' },
  rotationAngle: { type: 'slider', min: 0, max: 60, step: 5, default: 0, label: 'Rotation (degrees)' },
  
  // Professional proportions
  edgeVariation: { type: 'slider', min: 0, max: 0.2, step: 0.01, default: 0.05, label: 'Edge Variation' },
  centerOffset: { type: 'slider', min: 0, max: 0.3, step: 0.02, default: 0, label: 'Center Offset' },
  symmetryBreak: { type: 'slider', min: 0, max: 0.15, step: 0.01, default: 0, label: 'Asymmetry Factor' },
  
  // Modern brand sophistication
  layerCount: { type: 'slider', min: 1, max: 3, step: 1, default: 1, label: 'Nested Layers' },
  layerSpacing: { type: 'slider', min: 5, max: 20, step: 1, default: 12, label: 'Layer Spacing' },
  
  // Brand enhancement (30% of controls)
  strokeStyle: {
    type: 'slider',
    min: 0,
    max: 4,
    step: 1,
    default: 1,
    label: 'Stroke Style (0=None, 1=Clean, 2=Double, 3=Gradient, 4=Animated)'
  },
  strokeWeight: { type: 'slider', min: 1, max: 10, step: 0.5, default: 3, label: 'Stroke Weight' },
  
  // Fill sophistication
  fillStyle: {
    type: 'slider',
    min: 0,
    max: 4,
    step: 1,
    default: 2,
    label: 'Fill Style (0=None, 1=Solid, 2=Linear, 3=Radial, 4=Geometric)'
  },
  
  // Corporate color system
  brandHue: { type: 'slider', min: 0, max: 360, step: 10, default: 220, label: 'Brand Hue' },
  corporate: { type: 'slider', min: 0.4, max: 1, step: 0.05, default: 0.7, label: 'Corporate Feel' },
  modernity: { type: 'slider', min: 0.3, max: 1, step: 0.05, default: 0.8, label: 'Modern Edge' },
  
  // Professional effects
  innerShadow: { type: 'slider', min: 0, max: 0.3, step: 0.02, default: 0.1, label: 'Inner Shadow' },
  surfaceSheen: { type: 'slider', min: 0, max: 0.4, step: 0.05, default: 0.2, label: 'Surface Highlight' }
};

function applyUniversalBackground(ctx, width, height, params) {
  if (!params.backgroundType || params.backgroundType === 'transparent') return;
  
  if (params.backgroundType === 'solid') {
    ctx.fillStyle = params.backgroundColor || '#f8f9fa';
    ctx.fillRect(0, 0, width, height);
  } else if (params.backgroundType === 'gradient') {
    const direction = (params.backgroundGradientDirection || 45) * (Math.PI / 180);
    const x1 = width / 2 - Math.cos(direction) * width / 2;
    const y1 = height / 2 - Math.sin(direction) * height / 2;
    const x2 = width / 2 + Math.cos(direction) * width / 2;
    const y2 = height / 2 + Math.sin(direction) * height / 2;
    
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, params.backgroundGradientStart || '#f8f9fa');
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
  const hexagonStyleNum = Math.round(params.hexagonStyle || 0);
  const cornerRadius = params.cornerRadius || 8;
  const aspectRatio = params.aspectRatio || 1.0;
  const rotationAngle = (params.rotationAngle || 0) * Math.PI / 180;
  const edgeVariation = params.edgeVariation || 0.05;
  const centerOffset = params.centerOffset || 0;
  const symmetryBreak = params.symmetryBreak || 0;
  const layerCount = Math.round(params.layerCount || 1);
  const layerSpacing = params.layerSpacing || 12;
  const strokeStyleNum = Math.round(params.strokeStyle || 1);
  const strokeWeight = params.strokeWeight || 3;
  const fillStyleNum = Math.round(params.fillStyle || 2);
  const brandHue = params.brandHue || 220;
  const corporate = params.corporate || 0.7;
  const modernity = params.modernity || 0.8;
  const innerShadow = params.innerShadow || 0.1;
  const surfaceSheen = params.surfaceSheen || 0.2;

  // Professional sizing for brand applications
  const logoSize = Math.min(width, height) * 0.6;
  const baseRadius = logoSize / 2;

  // Corporate color palette
  const brandColors = createCorporatePalette(brandHue, corporate, modernity);

  // Center offset for dynamic positioning
  const offsetX = centerX + centerOffset * logoSize * 0.3;
  const offsetY = centerY + centerOffset * logoSize * 0.2;

  // Render multiple layers for sophistication
  for (let layer = layerCount - 1; layer >= 0; layer--) {
    const layerRadius = baseRadius - (layer * layerSpacing);
    const layerAlpha = 1 - (layer * 0.15);
    
    if (layerRadius > 10) { // Ensure minimum viable size
      const hexagonPoints = generateSmartHexagon(
        hexagonStyleNum, offsetX, offsetY, layerRadius,
        aspectRatio, rotationAngle, edgeVariation, symmetryBreak, time, layer
      );

      // Inner shadow for depth (main layer only)
      if (layer === 0 && innerShadow > 0.05) {
        renderInnerShadow(ctx, hexagonPoints, brandColors, innerShadow, cornerRadius);
      }

      // Fill the hexagon
      renderHexagonFill(ctx, hexagonPoints, brandColors, fillStyleNum, layerAlpha, offsetX, offsetY, layerRadius);

      // Professional stroke
      if (strokeStyleNum > 0) {
        renderProfessionalStroke(ctx, hexagonPoints, brandColors, strokeStyleNum, strokeWeight, cornerRadius, time, layer);
      }

      // Surface highlight for premium feel (main layer only)
      if (layer === 0 && surfaceSheen > 0.05 && Math.min(width, height) > 100) {
        renderSurfaceHighlight(ctx, hexagonPoints, brandColors, surfaceSheen, offsetX, offsetY);
      }
    }
  }

  function generateSmartHexagon(style, centerX, centerY, radius, aspectRatio, rotation, edgeVar, symmetryBreak, time, layer) {
    const points = [];
    const baseAngles = 6;
    
    for (let i = 0; i < baseAngles; i++) {
      const baseAngle = (i / baseAngles) * Math.PI * 2 + rotation;
      let hexRadius = radius;
      let angle = baseAngle;
      
      // Apply style modifications
      switch (style) {
        case 0: // Regular hexagon
          break;
          
        case 1: // Stretched hexagon
          const stretchFactor = i % 2 === 0 ? aspectRatio : 1 / aspectRatio;
          hexRadius *= stretchFactor;
          break;
          
        case 2: // Rotated dynamic
          angle += Math.sin(time * 0.5 + i) * 0.1;
          hexRadius *= 1 + Math.sin(time * 0.3 + i * 2) * edgeVar;
          break;
          
        case 3: // Beveled corners
          const bevelFactor = i % 2 === 0 ? 0.9 : 1.1;
          hexRadius *= bevelFactor;
          break;
          
        case 4: // Nested with offset
          const nestOffset = layer * 0.1;
          angle += nestOffset;
          hexRadius *= 1 + Math.sin(angle * 3) * edgeVar * 2;
          break;
      }
      
      // Apply edge variation for organic feel
      const edgeVariationFactor = 1 + Math.sin(angle * 7 + time * 0.2) * edgeVar;
      hexRadius *= edgeVariationFactor;
      
      // Apply symmetry breaking for dynamic brands
      if (symmetryBreak > 0) {
        const asymmetryFactor = 1 + Math.sin(angle * 3) * symmetryBreak;
        hexRadius *= asymmetryFactor;
      }
      
      // Apply aspect ratio
      const x = centerX + Math.cos(angle) * hexRadius * (i % 2 === 0 ? 1 : aspectRatio);
      const y = centerY + Math.sin(angle) * hexRadius;
      
      points.push({
        x: x,
        y: y,
        angle: angle,
        radius: hexRadius,
        edgeVar: edgeVariationFactor
      });
    }
    
    return points;
  }

  function createCorporatePalette(hue, corporate, modernity) {
    const saturation = 60 + corporate * 30;
    const lightness = 40 + modernity * 20;
    
    return {
      primary: "hsl(" + hue + ", " + saturation + "%, " + lightness + "%)",
      secondary: "hsl(" + (hue + 20) + ", " + (saturation * 0.8) + "%, " + (lightness + 20) + "%)",
      accent: "hsl(" + (hue - 30) + ", " + (saturation * 1.2) + "%, " + (lightness - 15) + "%)",
      modern: "hsl(" + (hue + 10) + ", " + (saturation * 0.6) + "%, " + (lightness + 30) + "%)",
      corporate: "hsl(" + (hue - 10) + ", " + (saturation * 0.9) + "%, " + (lightness + 10) + "%)",
      professional: "hsl(" + hue + ", " + (saturation * 0.4) + "%, " + (lightness + 40) + "%)"
    };
  }

  function renderInnerShadow(ctx, points, colors, shadow, cornerRadius) {
    ctx.save();
    ctx.globalAlpha = shadow * 0.6;
    
    // Create inner shadow effect
    ctx.fillStyle = colors.accent;
    drawRoundedHexagon(ctx, points, cornerRadius * 0.7);
    ctx.fill();
    
    // Lighter overlay to create inset effect
    ctx.globalAlpha = shadow * 0.4;
    ctx.fillStyle = colors.professional;
    const innerPoints = points.map(p => ({
      x: centerX + (p.x - centerX) * 0.95,
      y: centerY + (p.y - centerY) * 0.95,
      angle: p.angle
    }));
    drawRoundedHexagon(ctx, innerPoints, cornerRadius * 0.5);
    ctx.fill();
    
    ctx.restore();
  }

  function renderHexagonFill(ctx, points, colors, fillStyle, alpha, centerX, centerY, radius) {
    ctx.save();
    ctx.globalAlpha = alpha;
    
    switch (fillStyle) {
      case 0: // No fill
        break;
        
      case 1: // Solid corporate fill
        ctx.fillStyle = colors.primary;
        drawRoundedHexagon(ctx, points, cornerRadius);
        ctx.fill();
        break;
        
      case 2: // Linear gradient - professional
        const linearGradient = ctx.createLinearGradient(
          centerX, centerY - radius,
          centerX, centerY + radius
        );
        linearGradient.addColorStop(0, colors.secondary);
        linearGradient.addColorStop(0.5, colors.primary);
        linearGradient.addColorStop(1, colors.accent);
        
        ctx.fillStyle = linearGradient;
        drawRoundedHexagon(ctx, points, cornerRadius);
        ctx.fill();
        break;
        
      case 3: // Radial gradient - modern depth
        const radialGradient = ctx.createRadialGradient(
          centerX - radius * 0.3, centerY - radius * 0.3, 0,
          centerX, centerY, radius * 1.2
        );
        radialGradient.addColorStop(0, colors.modern);
        radialGradient.addColorStop(0.4, colors.secondary);
        radialGradient.addColorStop(1, colors.primary);
        
        ctx.fillStyle = radialGradient;
        drawRoundedHexagon(ctx, points, cornerRadius);
        ctx.fill();
        break;
        
      case 4: // Geometric pattern fill
        ctx.fillStyle = colors.primary;
        drawRoundedHexagon(ctx, points, cornerRadius);
        ctx.fill();
        
        // Add geometric pattern overlay
        ctx.globalAlpha = alpha * 0.3;
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 1;
        
        // Create hexagonal grid pattern
        const patternSize = radius * 0.15;
        for (let i = -2; i <= 2; i++) {
          for (let j = -2; j <= 2; j++) {
            const patternX = centerX + i * patternSize * 1.5;
            const patternY = centerY + j * patternSize * Math.sqrt(3);
            
            if (ctx.isPointInPath(patternX, patternY)) {
              ctx.beginPath();
              for (let k = 0; k < 6; k++) {
                const angle = (k / 6) * Math.PI * 2;
                const x = patternX + Math.cos(angle) * patternSize * 0.3;
                const y = patternY + Math.sin(angle) * patternSize * 0.3;
                if (k === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
              }
              ctx.closePath();
              ctx.stroke();
            }
          }
        }
        break;
    }
    
    ctx.restore();
  }

  function renderProfessionalStroke(ctx, points, colors, strokeStyle, weight, cornerRadius, time, layer) {
    ctx.save();
    
    switch (strokeStyle) {
      case 1: // Clean professional stroke
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = weight;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        drawRoundedHexagon(ctx, points, cornerRadius);
        ctx.stroke();
        break;
        
      case 2: // Double stroke for premium feel
        // Outer stroke
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = weight;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        drawRoundedHexagon(ctx, points, cornerRadius);
        ctx.stroke();
        
        // Inner stroke
        ctx.strokeStyle = colors.modern;
        ctx.lineWidth = weight * 0.4;
        const innerPoints = points.map(p => ({
          x: centerX + (p.x - centerX) * 0.8,
          y: centerY + (p.y - centerY) * 0.8,
          angle: p.angle
        }));
        drawRoundedHexagon(ctx, innerPoints, cornerRadius * 0.6);
        ctx.stroke();
        break;
        
      case 3: // Gradient stroke
        const strokeGradient = ctx.createLinearGradient(
          points[0].x, points[0].y,
          points[3].x, points[3].y
        );
        strokeGradient.addColorStop(0, colors.secondary);
        strokeGradient.addColorStop(0.5, colors.primary);
        strokeGradient.addColorStop(1, colors.accent);
        
        ctx.strokeStyle = strokeGradient;
        ctx.lineWidth = weight;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        drawRoundedHexagon(ctx, points, cornerRadius);
        ctx.stroke();
        break;
        
      case 4: // Animated stroke for dynamic brands
        const animationPhase = time * 2 + layer;
        const animatedWeight = weight * (1 + Math.sin(animationPhase) * 0.2);
        
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = animatedWeight;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Animated dash pattern
        const dashOffset = (time * 20) % 40;
        ctx.setLineDash([10, 10]);
        ctx.lineDashOffset = dashOffset;
        
        drawRoundedHexagon(ctx, points, cornerRadius);
        ctx.stroke();
        
        ctx.setLineDash([]);
        break;
    }
    
    ctx.restore();
  }

  function renderSurfaceHighlight(ctx, points, colors, sheen, centerX, centerY) {
    ctx.save();
    ctx.globalAlpha = sheen;
    
    // Create surface highlight gradient
    const highlightGradient = ctx.createLinearGradient(
      centerX - logoSize * 0.4, centerY - logoSize * 0.4,
      centerX + logoSize * 0.2, centerY + logoSize * 0.2
    );
    highlightGradient.addColorStop(0, colors.professional);
    highlightGradient.addColorStop(0.3, colors.modern);
    highlightGradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = highlightGradient;
    
    // Apply highlight to top portion of hexagon
    const topPoints = points.slice(0, 3); // Top half of hexagon
    ctx.beginPath();
    ctx.moveTo(topPoints[0].x, topPoints[0].y);
    for (let i = 1; i < topPoints.length; i++) {
      ctx.lineTo(topPoints[i].x, topPoints[i].y);
    }
    ctx.lineTo(centerX, centerY);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  }

  function drawRoundedHexagon(ctx, points, radius) {
    if (points.length < 3) return;
    
    ctx.beginPath();
    
    if (radius <= 1) {
      // Sharp hexagon
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.closePath();
    } else {
      // Rounded hexagon
      for (let i = 0; i < points.length; i++) {
        const current = points[i];
        const next = points[(i + 1) % points.length];
        const prev = points[(i - 1 + points.length) % points.length];
        
        // Calculate vectors for corner rounding
        const v1x = prev.x - current.x;
        const v1y = prev.y - current.y;
        const v2x = next.x - current.x;
        const v2y = next.y - current.y;
        
        const len1 = Math.sqrt(v1x * v1x + v1y * v1y);
        const len2 = Math.sqrt(v2x * v2x + v2y * v2y);
        
        const cornerRadius = Math.min(radius, len1 / 3, len2 / 3);
        
        if (cornerRadius > 1) {
          const u1x = v1x / len1;
          const u1y = v1y / len1;
          const u2x = v2x / len2;
          const u2y = v2y / len2;
          
          const cp1x = current.x + u1x * cornerRadius;
          const cp1y = current.y + u1y * cornerRadius;
          const cp2x = current.x + u2x * cornerRadius;
          const cp2y = current.y + u2y * cornerRadius;
          
          if (i === 0) {
            ctx.moveTo(cp1x, cp1y);
          } else {
            ctx.lineTo(cp1x, cp1y);
          }
          
          ctx.quadraticCurveTo(current.x, current.y, cp2x, cp2y);
        } else {
          if (i === 0) {
            ctx.moveTo(current.x, current.y);
          } else {
            ctx.lineTo(current.x, current.y);
          }
        }
      }
      ctx.closePath();
    }
  }
}

export { drawVisualization };

export const metadata = {
  name: "⬢ Smart Hexagon",
  description: "Modern structured brands with variable corner radius and professional sophistication",
  defaultParams: {
    seed: "smart-hexagon-brand",
    hexagonStyle: 0,
    cornerRadius: 8,
    aspectRatio: 1.0,
    rotationAngle: 0,
    edgeVariation: 0.05,
    centerOffset: 0,
    symmetryBreak: 0,
    layerCount: 1,
    layerSpacing: 12,
    strokeStyle: 1,
    strokeWeight: 3,
    fillStyle: 2,
    brandHue: 220,
    corporate: 0.7,
    modernity: 0.8,
    innerShadow: 0.1,
    surfaceSheen: 0.2
  }
};

export const id = 'smart-hexagon';
export const name = "⬢ Smart Hexagon";
export const description = "Modern structured brands with variable corner radius and professional sophistication";
export const defaultParams = {
  seed: "smart-hexagon-brand",
  hexagonStyle: 0,
  cornerRadius: 8,
  aspectRatio: 1.0,
  rotationAngle: 0,
  edgeVariation: 0.05,
  centerOffset: 0,
  symmetryBreak: 0,
  layerCount: 1,
  layerSpacing: 12,
  strokeStyle: 1,
  strokeWeight: 3,
  fillStyle: 2,
  brandHue: 220,
  corporate: 0.7,
  modernity: 0.8,
  innerShadow: 0.1,
  surfaceSheen: 0.2
};

export const code = `// ⬢ Smart Hexagon
const PARAMETERS = {
  // Universal Background Controls
  backgroundColor: { type: 'color', default: "#f8f9fa", label: 'Background Color', category: 'Background' },
  backgroundType: { type: 'select', options: [{"value":"transparent","label":"Transparent"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "gradient", label: 'Background Type', category: 'Background' },
  backgroundGradientStart: { type: 'color', default: "#f8f9fa", label: 'Gradient Start', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientEnd: { type: 'color', default: "#ffffff", label: 'Gradient End', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 45, label: 'Gradient Direction', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  
  // Universal Fill Controls
  fillType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "gradient", label: 'Fill Type', category: 'Fill' },
  fillColor: { type: 'color', default: "#2563eb", label: 'Fill Color', category: 'Fill', showIf: (params)=>params.fillType === 'solid' },
  fillGradientStart: { type: 'color', default: "#60a5fa", label: 'Gradient Start', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientEnd: { type: 'color', default: "#1e3a8a", label: 'Gradient End', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 90, label: 'Gradient Direction', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.8, label: 'Fill Opacity', category: 'Fill', showIf: (params)=>params.fillType !== 'none' },
  
  // Universal Stroke Controls
  strokeType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid"},{"value":"dashed","label":"Dashed"},{"value":"dotted","label":"Dotted"}], default: "solid", label: 'Stroke Type', category: 'Stroke' },
  strokeColor: { type: 'color', default: "#1e3a8a", label: 'Stroke Color', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeWidth: { type: 'slider', min: 0, max: 10, step: 0.5, default: 3, label: 'Stroke Width', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Stroke Opacity', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  
  // Hexagon fundamentals - shape definition (70% of controls)
  hexagonStyle: {
    type: 'slider',
    min: 0,
    max: 4,
    step: 1,
    default: 0,
    label: 'Hexagon Style (0=Regular, 1=Stretched, 2=Rotated, 3=Beveled, 4=Nested)'
  },
  
  // Geometric precision with mathematical control
  cornerRadius: { type: 'slider', min: 0, max: 30, step: 1, default: 8, label: 'Corner Radius' },
  aspectRatio: { type: 'slider', min: 0.7, max: 1.5, step: 0.05, default: 1.0, label: 'Width/Height Ratio' },
  rotationAngle: { type: 'slider', min: 0, max: 60, step: 5, default: 0, label: 'Rotation (degrees)' },
  
  // Professional proportions
  edgeVariation: { type: 'slider', min: 0, max: 0.2, step: 0.01, default: 0.05, label: 'Edge Variation' },
  centerOffset: { type: 'slider', min: 0, max: 0.3, step: 0.02, default: 0, label: 'Center Offset' },
  symmetryBreak: { type: 'slider', min: 0, max: 0.15, step: 0.01, default: 0, label: 'Asymmetry Factor' },
  
  // Modern brand sophistication
  layerCount: { type: 'slider', min: 1, max: 3, step: 1, default: 1, label: 'Nested Layers' },
  layerSpacing: { type: 'slider', min: 5, max: 20, step: 1, default: 12, label: 'Layer Spacing' },
  
  // Brand enhancement (30% of controls)
  strokeStyle: {
    type: 'slider',
    min: 0,
    max: 4,
    step: 1,
    default: 1,
    label: 'Stroke Style (0=None, 1=Clean, 2=Double, 3=Gradient, 4=Animated)'
  },
  strokeWeight: { type: 'slider', min: 1, max: 10, step: 0.5, default: 3, label: 'Stroke Weight' },
  
  // Fill sophistication
  fillStyle: {
    type: 'slider',
    min: 0,
    max: 4,
    step: 1,
    default: 2,
    label: 'Fill Style (0=None, 1=Solid, 2=Linear, 3=Radial, 4=Geometric)'
  },
  
  // Corporate color system
  brandHue: { type: 'slider', min: 0, max: 360, step: 10, default: 220, label: 'Brand Hue' },
  corporate: { type: 'slider', min: 0.4, max: 1, step: 0.05, default: 0.7, label: 'Corporate Feel' },
  modernity: { type: 'slider', min: 0.3, max: 1, step: 0.05, default: 0.8, label: 'Modern Edge' },
  
  // Professional effects
  innerShadow: { type: 'slider', min: 0, max: 0.3, step: 0.02, default: 0.1, label: 'Inner Shadow' },
  surfaceSheen: { type: 'slider', min: 0, max: 0.4, step: 0.05, default: 0.2, label: 'Surface Highlight' }
};

function applyUniversalBackground(ctx, width, height, params) {
  if (!params.backgroundType || params.backgroundType === 'transparent') return;
  
  if (params.backgroundType === 'solid') {
    ctx.fillStyle = params.backgroundColor || '#f8f9fa';
    ctx.fillRect(0, 0, width, height);
  } else if (params.backgroundType === 'gradient') {
    const direction = (params.backgroundGradientDirection || 45) * (Math.PI / 180);
    const x1 = width / 2 - Math.cos(direction) * width / 2;
    const y1 = height / 2 - Math.sin(direction) * height / 2;
    const x2 = width / 2 + Math.cos(direction) * width / 2;
    const y2 = height / 2 + Math.sin(direction) * height / 2;
    
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, params.backgroundGradientStart || '#f8f9fa');
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
  const hexagonStyleNum = Math.round(params.hexagonStyle || 0);
  const cornerRadius = params.cornerRadius || 8;
  const aspectRatio = params.aspectRatio || 1.0;
  const rotationAngle = (params.rotationAngle || 0) * Math.PI / 180;
  const edgeVariation = params.edgeVariation || 0.05;
  const centerOffset = params.centerOffset || 0;
  const symmetryBreak = params.symmetryBreak || 0;
  const layerCount = Math.round(params.layerCount || 1);
  const layerSpacing = params.layerSpacing || 12;
  const strokeStyleNum = Math.round(params.strokeStyle || 1);
  const strokeWeight = params.strokeWeight || 3;
  const fillStyleNum = Math.round(params.fillStyle || 2);
  const brandHue = params.brandHue || 220;
  const corporate = params.corporate || 0.7;
  const modernity = params.modernity || 0.8;
  const innerShadow = params.innerShadow || 0.1;
  const surfaceSheen = params.surfaceSheen || 0.2;

  // Professional sizing for brand applications
  const logoSize = Math.min(width, height) * 0.6;
  const baseRadius = logoSize / 2;

  // Corporate color palette
  const brandColors = createCorporatePalette(brandHue, corporate, modernity);

  // Center offset for dynamic positioning
  const offsetX = centerX + centerOffset * logoSize * 0.3;
  const offsetY = centerY + centerOffset * logoSize * 0.2;

  // Render multiple layers for sophistication
  for (let layer = layerCount - 1; layer >= 0; layer--) {
    const layerRadius = baseRadius - (layer * layerSpacing);
    const layerAlpha = 1 - (layer * 0.15);
    
    if (layerRadius > 10) { // Ensure minimum viable size
      const hexagonPoints = generateSmartHexagon(
        hexagonStyleNum, offsetX, offsetY, layerRadius,
        aspectRatio, rotationAngle, edgeVariation, symmetryBreak, time, layer
      );

      // Inner shadow for depth (main layer only)
      if (layer === 0 && innerShadow > 0.05) {
        renderInnerShadow(ctx, hexagonPoints, brandColors, innerShadow, cornerRadius);
      }

      // Fill the hexagon
      renderHexagonFill(ctx, hexagonPoints, brandColors, fillStyleNum, layerAlpha, offsetX, offsetY, layerRadius);

      // Professional stroke
      if (strokeStyleNum > 0) {
        renderProfessionalStroke(ctx, hexagonPoints, brandColors, strokeStyleNum, strokeWeight, cornerRadius, time, layer);
      }

      // Surface highlight for premium feel (main layer only)
      if (layer === 0 && surfaceSheen > 0.05 && Math.min(width, height) > 100) {
        renderSurfaceHighlight(ctx, hexagonPoints, brandColors, surfaceSheen, offsetX, offsetY);
      }
    }
  }

  function generateSmartHexagon(style, centerX, centerY, radius, aspectRatio, rotation, edgeVar, symmetryBreak, time, layer) {
    const points = [];
    const baseAngles = 6;
    
    for (let i = 0; i < baseAngles; i++) {
      const baseAngle = (i / baseAngles) * Math.PI * 2 + rotation;
      let hexRadius = radius;
      let angle = baseAngle;
      
      // Apply style modifications
      switch (style) {
        case 0: // Regular hexagon
          break;
          
        case 1: // Stretched hexagon
          const stretchFactor = i % 2 === 0 ? aspectRatio : 1 / aspectRatio;
          hexRadius *= stretchFactor;
          break;
          
        case 2: // Rotated dynamic
          angle += Math.sin(time * 0.5 + i) * 0.1;
          hexRadius *= 1 + Math.sin(time * 0.3 + i * 2) * edgeVar;
          break;
          
        case 3: // Beveled corners
          const bevelFactor = i % 2 === 0 ? 0.9 : 1.1;
          hexRadius *= bevelFactor;
          break;
          
        case 4: // Nested with offset
          const nestOffset = layer * 0.1;
          angle += nestOffset;
          hexRadius *= 1 + Math.sin(angle * 3) * edgeVar * 2;
          break;
      }
      
      // Apply edge variation for organic feel
      const edgeVariationFactor = 1 + Math.sin(angle * 7 + time * 0.2) * edgeVar;
      hexRadius *= edgeVariationFactor;
      
      // Apply symmetry breaking for dynamic brands
      if (symmetryBreak > 0) {
        const asymmetryFactor = 1 + Math.sin(angle * 3) * symmetryBreak;
        hexRadius *= asymmetryFactor;
      }
      
      // Apply aspect ratio
      const x = centerX + Math.cos(angle) * hexRadius * (i % 2 === 0 ? 1 : aspectRatio);
      const y = centerY + Math.sin(angle) * hexRadius;
      
      points.push({
        x: x,
        y: y,
        angle: angle,
        radius: hexRadius,
        edgeVar: edgeVariationFactor
      });
    }
    
    return points;
  }

  function createCorporatePalette(hue, corporate, modernity) {
    const saturation = 60 + corporate * 30;
    const lightness = 40 + modernity * 20;
    
    return {
      primary: "hsl(" + hue + ", " + saturation + "%, " + lightness + "%)",
      secondary: "hsl(" + (hue + 20) + ", " + (saturation * 0.8) + "%, " + (lightness + 20) + "%)",
      accent: "hsl(" + (hue - 30) + ", " + (saturation * 1.2) + "%, " + (lightness - 15) + "%)",
      modern: "hsl(" + (hue + 10) + ", " + (saturation * 0.6) + "%, " + (lightness + 30) + "%)",
      corporate: "hsl(" + (hue - 10) + ", " + (saturation * 0.9) + "%, " + (lightness + 10) + "%)",
      professional: "hsl(" + hue + ", " + (saturation * 0.4) + "%, " + (lightness + 40) + "%)"
    };
  }

  function renderInnerShadow(ctx, points, colors, shadow, cornerRadius) {
    ctx.save();
    ctx.globalAlpha = shadow * 0.6;
    
    // Create inner shadow effect
    ctx.fillStyle = colors.accent;
    drawRoundedHexagon(ctx, points, cornerRadius * 0.7);
    ctx.fill();
    
    // Lighter overlay to create inset effect
    ctx.globalAlpha = shadow * 0.4;
    ctx.fillStyle = colors.professional;
    const innerPoints = points.map(p => ({
      x: centerX + (p.x - centerX) * 0.95,
      y: centerY + (p.y - centerY) * 0.95,
      angle: p.angle
    }));
    drawRoundedHexagon(ctx, innerPoints, cornerRadius * 0.5);
    ctx.fill();
    
    ctx.restore();
  }

  function renderHexagonFill(ctx, points, colors, fillStyle, alpha, centerX, centerY, radius) {
    ctx.save();
    ctx.globalAlpha = alpha;
    
    switch (fillStyle) {
      case 0: // No fill
        break;
        
      case 1: // Solid corporate fill
        ctx.fillStyle = colors.primary;
        drawRoundedHexagon(ctx, points, cornerRadius);
        ctx.fill();
        break;
        
      case 2: // Linear gradient - professional
        const linearGradient = ctx.createLinearGradient(
          centerX, centerY - radius,
          centerX, centerY + radius
        );
        linearGradient.addColorStop(0, colors.secondary);
        linearGradient.addColorStop(0.5, colors.primary);
        linearGradient.addColorStop(1, colors.accent);
        
        ctx.fillStyle = linearGradient;
        drawRoundedHexagon(ctx, points, cornerRadius);
        ctx.fill();
        break;
        
      case 3: // Radial gradient - modern depth
        const radialGradient = ctx.createRadialGradient(
          centerX - radius * 0.3, centerY - radius * 0.3, 0,
          centerX, centerY, radius * 1.2
        );
        radialGradient.addColorStop(0, colors.modern);
        radialGradient.addColorStop(0.4, colors.secondary);
        radialGradient.addColorStop(1, colors.primary);
        
        ctx.fillStyle = radialGradient;
        drawRoundedHexagon(ctx, points, cornerRadius);
        ctx.fill();
        break;
        
      case 4: // Geometric pattern fill
        ctx.fillStyle = colors.primary;
        drawRoundedHexagon(ctx, points, cornerRadius);
        ctx.fill();
        
        // Add geometric pattern overlay
        ctx.globalAlpha = alpha * 0.3;
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = 1;
        
        // Create hexagonal grid pattern
        const patternSize = radius * 0.15;
        for (let i = -2; i <= 2; i++) {
          for (let j = -2; j <= 2; j++) {
            const patternX = centerX + i * patternSize * 1.5;
            const patternY = centerY + j * patternSize * Math.sqrt(3);
            
            if (ctx.isPointInPath(patternX, patternY)) {
              ctx.beginPath();
              for (let k = 0; k < 6; k++) {
                const angle = (k / 6) * Math.PI * 2;
                const x = patternX + Math.cos(angle) * patternSize * 0.3;
                const y = patternY + Math.sin(angle) * patternSize * 0.3;
                if (k === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
              }
              ctx.closePath();
              ctx.stroke();
            }
          }
        }
        break;
    }
    
    ctx.restore();
  }

  function renderProfessionalStroke(ctx, points, colors, strokeStyle, weight, cornerRadius, time, layer) {
    ctx.save();
    
    switch (strokeStyle) {
      case 1: // Clean professional stroke
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = weight;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        drawRoundedHexagon(ctx, points, cornerRadius);
        ctx.stroke();
        break;
        
      case 2: // Double stroke for premium feel
        // Outer stroke
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = weight;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        drawRoundedHexagon(ctx, points, cornerRadius);
        ctx.stroke();
        
        // Inner stroke
        ctx.strokeStyle = colors.modern;
        ctx.lineWidth = weight * 0.4;
        const innerPoints = points.map(p => ({
          x: centerX + (p.x - centerX) * 0.8,
          y: centerY + (p.y - centerY) * 0.8,
          angle: p.angle
        }));
        drawRoundedHexagon(ctx, innerPoints, cornerRadius * 0.6);
        ctx.stroke();
        break;
        
      case 3: // Gradient stroke
        const strokeGradient = ctx.createLinearGradient(
          points[0].x, points[0].y,
          points[3].x, points[3].y
        );
        strokeGradient.addColorStop(0, colors.secondary);
        strokeGradient.addColorStop(0.5, colors.primary);
        strokeGradient.addColorStop(1, colors.accent);
        
        ctx.strokeStyle = strokeGradient;
        ctx.lineWidth = weight;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        drawRoundedHexagon(ctx, points, cornerRadius);
        ctx.stroke();
        break;
        
      case 4: // Animated stroke for dynamic brands
        const animationPhase = time * 2 + layer;
        const animatedWeight = weight * (1 + Math.sin(animationPhase) * 0.2);
        
        ctx.strokeStyle = colors.accent;
        ctx.lineWidth = animatedWeight;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Animated dash pattern
        const dashOffset = (time * 20) % 40;
        ctx.setLineDash([10, 10]);
        ctx.lineDashOffset = dashOffset;
        
        drawRoundedHexagon(ctx, points, cornerRadius);
        ctx.stroke();
        
        ctx.setLineDash([]);
        break;
    }
    
    ctx.restore();
  }

  function renderSurfaceHighlight(ctx, points, colors, sheen, centerX, centerY) {
    ctx.save();
    ctx.globalAlpha = sheen;
    
    // Create surface highlight gradient
    const highlightGradient = ctx.createLinearGradient(
      centerX - logoSize * 0.4, centerY - logoSize * 0.4,
      centerX + logoSize * 0.2, centerY + logoSize * 0.2
    );
    highlightGradient.addColorStop(0, colors.professional);
    highlightGradient.addColorStop(0.3, colors.modern);
    highlightGradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = highlightGradient;
    
    // Apply highlight to top portion of hexagon
    const topPoints = points.slice(0, 3); // Top half of hexagon
    ctx.beginPath();
    ctx.moveTo(topPoints[0].x, topPoints[0].y);
    for (let i = 1; i < topPoints.length; i++) {
      ctx.lineTo(topPoints[i].x, topPoints[i].y);
    }
    ctx.lineTo(centerX, centerY);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  }

  function drawRoundedHexagon(ctx, points, radius) {
    if (points.length < 3) return;
    
    ctx.beginPath();
    
    if (radius <= 1) {
      // Sharp hexagon
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.closePath();
    } else {
      // Rounded hexagon
      for (let i = 0; i < points.length; i++) {
        const current = points[i];
        const next = points[(i + 1) % points.length];
        const prev = points[(i - 1 + points.length) % points.length];
        
        // Calculate vectors for corner rounding
        const v1x = prev.x - current.x;
        const v1y = prev.y - current.y;
        const v2x = next.x - current.x;
        const v2y = next.y - current.y;
        
        const len1 = Math.sqrt(v1x * v1x + v1y * v1y);
        const len2 = Math.sqrt(v2x * v2x + v2y * v2y);
        
        const cornerRadius = Math.min(radius, len1 / 3, len2 / 3);
        
        if (cornerRadius > 1) {
          const u1x = v1x / len1;
          const u1y = v1y / len1;
          const u2x = v2x / len2;
          const u2y = v2y / len2;
          
          const cp1x = current.x + u1x * cornerRadius;
          const cp1y = current.y + u1y * cornerRadius;
          const cp2x = current.x + u2x * cornerRadius;
          const cp2y = current.y + u2y * cornerRadius;
          
          if (i === 0) {
            ctx.moveTo(cp1x, cp1y);
          } else {
            ctx.lineTo(cp1x, cp1y);
          }
          
          ctx.quadraticCurveTo(current.x, current.y, cp2x, cp2y);
        } else {
          if (i === 0) {
            ctx.moveTo(current.x, current.y);
          } else {
            ctx.lineTo(current.x, current.y);
          }
        }
      }
      ctx.closePath();
    }
  }
}`;