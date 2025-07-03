// ▲ Clean Triangle
const PARAMETERS = {
  // Universal Background Controls
  backgroundColor: { type: 'color', default: "#ffffff", label: 'Background Color', category: 'Background' },
  backgroundType: { type: 'select', options: [{"value":"transparent","label":"Transparent"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "solid", label: 'Background Type', category: 'Background' },
  backgroundGradientStart: { type: 'color', default: "#ffffff", label: 'Gradient Start', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientEnd: { type: 'color', default: "#f0f0f0", label: 'Gradient End', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 45, label: 'Gradient Direction', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  
  // Universal Fill Controls
  fillType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "solid", label: 'Fill Type', category: 'Fill' },
  fillColor: { type: 'color', default: "#3b82f6", label: 'Fill Color', category: 'Fill', showIf: (params)=>params.fillType === 'solid' },
  fillGradientStart: { type: 'color', default: "#3b82f6", label: 'Gradient Start', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientEnd: { type: 'color', default: "#1d4ed8", label: 'Gradient End', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 90, label: 'Gradient Direction', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.8, label: 'Fill Opacity', category: 'Fill', showIf: (params)=>params.fillType !== 'none' },
  
  // Universal Stroke Controls
  strokeType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid"},{"value":"dashed","label":"Dashed"},{"value":"dotted","label":"Dotted"}], default: "none", label: 'Stroke Type', category: 'Stroke' },
  strokeColor: { type: 'color', default: "#1e40af", label: 'Stroke Color', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeWidth: { type: 'slider', min: 0, max: 10, step: 0.5, default: 2, label: 'Stroke Width', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Stroke Opacity', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  
  // Template-specific parameters - Triangle fundamentals (shape definition)
  triangleType: {
    type: 'slider',
    min: 0,
    max: 4,
    step: 1,
    default: 0,
    label: 'Triangle Type (0=Equilateral, 1=Isosceles, 2=Scalene, 3=Right, 4=Acute)',
    category: 'Shape'
  },
  
  // Proportional controls using mathematical ratios
  heightRatio: { type: 'slider', min: 0.6, max: 1.8, step: 0.05, default: 1.0, label: 'Height Ratio', category: 'Shape' },
  baseWidth: { type: 'slider', min: 0.7, max: 1.5, step: 0.05, default: 1.0, label: 'Base Width', category: 'Shape' },
  apexOffset: { type: 'slider', min: -0.3, max: 0.3, step: 0.05, default: 0, label: 'Apex Offset', category: 'Shape' },
  
  // Mathematical elegance
  goldenRatio: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.2, label: 'Golden Ratio Influence', category: 'Mathematics' },
  cornerRadius: { type: 'slider', min: 0, max: 20, step: 1, default: 0, label: 'Corner Softness', category: 'Shape' },
  symmetryPerfection: { type: 'slider', min: 0.8, max: 1, step: 0.01, default: 1.0, label: 'Geometric Precision', category: 'Mathematics' },
  
  // Brand enhancement - context-aware (removed duplicate stroke)
  fillStyle: {
    type: 'slider',
    min: 0,
    max: 3,
    step: 1,
    default: 1,
    label: 'Fill Style (0=None, 1=Solid, 2=Gradient, 3=Minimal Texture)',
    category: 'Effects'
  },
  
  // Color system - professional brand palette
  colorIntensity: { type: 'slider', min: 0.5, max: 1, step: 0.05, default: 0.8, label: 'Color Intensity', category: 'Effects' },
  
  // Subtle enhancements for larger sizes
  depth: { type: 'slider', min: 0, max: 0.5, step: 0.05, default: 0.1, label: 'Subtle Depth', category: 'Effects' },
  highlight: { type: 'slider', min: 0, max: 0.4, step: 0.05, default: 0.15, label: 'Brand Highlight', category: 'Effects' }
};

function applyUniversalBackground(ctx, width, height, params) {
  if (!params.backgroundType || params.backgroundType === 'transparent') return;
  
  if (params.backgroundType === 'solid') {
    ctx.fillStyle = params.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, width, height);
  } else if (params.backgroundType === 'gradient') {
    const direction = (params.backgroundGradientDirection || 0) * (Math.PI / 180);
    const x1 = width / 2 - Math.cos(direction) * width / 2;
    const y1 = height / 2 - Math.sin(direction) * height / 2;
    const x2 = width / 2 + Math.cos(direction) * width / 2;
    const y2 = height / 2 + Math.sin(direction) * height / 2;
    
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, params.backgroundGradientStart || '#ffffff');
    gradient.addColorStop(1, params.backgroundGradientEnd || '#f0f0f0');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
}

function drawVisualization(ctx, width, height, params, _generator, _time) {
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
  
  // Get theme colors with fallbacks
  const fillColor = params.fillColor || '#3b82f6';
  const strokeColor = params.strokeColor || '#1e40af';

  // Extract parameters
  const centerX = width / 2;
  const centerY = height / 2;
  const triangleTypeNum = Math.round(params.triangleType || 0);
  const heightRatio = params.heightRatio || 1.0;
  const baseWidth = params.baseWidth || 1.0;
  const apexOffset = params.apexOffset || 0;
  const goldenRatio = params.goldenRatio || 0.2;
  const cornerRadius = params.cornerRadius || 0;
  const symmetryPerfection = params.symmetryPerfection || 1.0;
  const fillStyleNum = Math.round(params.fillStyle || 1);
  const colorIntensity = params.colorIntensity || 0.8;
  const depth = params.depth || 0.1;
  const highlight = params.highlight || 0.15;

  // Scale for perfect brand proportions
  const logoSize = Math.min(width, height) * 0.6; // Generous whitespace for brand use
  const baseSize = logoSize * baseWidth;
  const triangleHeight = logoSize * heightRatio;

  // Golden ratio influence for mathematical elegance
  const phi = 1.618;
  const goldenInfluence = goldenRatio;
  const goldenWidth = baseSize * (1 + (phi - 1) * goldenInfluence * 0.3);
  const goldenHeight = triangleHeight * (1 + (phi - 1) * goldenInfluence * 0.2);

  // Generate clean triangle points
  const trianglePoints = generateCleanTriangle(
    triangleTypeNum, centerX, centerY, goldenWidth, goldenHeight, 
    apexOffset, symmetryPerfection
  );

  // Brand color system
  const brandColors = createBrandColors(fillColor, strokeColor, colorIntensity);

  // Apply subtle depth first (for larger sizes)
  if (depth > 0.05 && Math.min(width, height) > 100) {
    renderSubtleDepth(ctx, trianglePoints, brandColors, depth, cornerRadius);
  }

  // Render main triangle with clean geometry
  renderCleanTriangle(ctx, trianglePoints, brandColors, fillStyleNum, cornerRadius, centerX, centerY, logoSize, params);

  // Add universal stroke if specified
  if (params.strokeType !== 'none') {
    renderUniversalStroke(ctx, trianglePoints, cornerRadius, params);
  }

  // Add subtle highlight for brand sophistication (larger sizes only)
  if (highlight > 0.05 && Math.min(width, height) > 64) {
    renderBrandHighlight(ctx, trianglePoints, brandColors, highlight, centerX, centerY);
  }

  function generateCleanTriangle(type, centerX, centerY, width, height, apexOffset, precision) {
    const points = [];
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    
    // Apply precision to reduce any mathematical irregularities
    const precisionFactor = precision;
    
    switch (type) {
      case 0: // Equilateral - perfect 60° angles
        const equilateralHeight = halfWidth * Math.sqrt(3) * precisionFactor;
        points.push(
          { x: centerX, y: centerY - equilateralHeight * 0.67 }, // Top
          { x: centerX - halfWidth * precisionFactor, y: centerY + equilateralHeight * 0.33 }, // Bottom left
          { x: centerX + halfWidth * precisionFactor, y: centerY + equilateralHeight * 0.33 }  // Bottom right
        );
        break;
        
      case 1: // Isosceles - symmetric with variable height
        points.push(
          { x: centerX + apexOffset * width * 0.3, y: centerY - halfHeight }, // Top (with offset)
          { x: centerX - halfWidth, y: centerY + halfHeight }, // Bottom left
          { x: centerX + halfWidth, y: centerY + halfHeight }  // Bottom right
        );
        break;
        
      case 2: // Scalene - asymmetric for dynamic brands
        const asymmetry = (1 - precision) * 0.3; // Less asymmetry with higher precision
        points.push(
          { x: centerX + apexOffset * width * 0.5, y: centerY - halfHeight },
          { x: centerX - halfWidth * (1 + asymmetry), y: centerY + halfHeight },
          { x: centerX + halfWidth * (1 - asymmetry), y: centerY + halfHeight }
        );
        break;
        
      case 3: // Right triangle - perfect 90° angle
        points.push(
          { x: centerX - halfWidth, y: centerY - halfHeight }, // Top left
          { x: centerX - halfWidth, y: centerY + halfHeight }, // Bottom left (90° corner)
          { x: centerX + halfWidth, y: centerY + halfHeight }  // Bottom right
        );
        break;
        
      case 4: // Acute - all angles < 90°, sharp and precise
        const acuteHeight = halfHeight * 1.2;
        points.push(
          { x: centerX + apexOffset * width * 0.2, y: centerY - acuteHeight },
          { x: centerX - halfWidth * 0.8, y: centerY + halfHeight * 0.6 },
          { x: centerX + halfWidth * 0.8, y: centerY + halfHeight * 0.6 }
        );
        break;
    }
    
    return points;
  }

  function createBrandColors(fillColor, strokeColor, intensity) {
    // Helper to convert hex to HSL
    const hexToHsl = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (!result) return [0, 0, 50];
      
      let r = parseInt(result[1], 16) / 255;
      let g = parseInt(result[2], 16) / 255;
      let b = parseInt(result[3], 16) / 255;
      
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;
      
      if (max === min) {
        h = s = 0;
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
          case g: h = ((b - r) / d + 2) / 6; break;
          case b: h = ((r - g) / d + 4) / 6; break;
          default: h = 0;
        }
      }
      
      return [h * 360, s * 100, l * 100];
    };
    
    const [hue, sat, light] = hexToHsl(fillColor);
    const adjustedSat = sat * intensity;
    
    return {
      primary: fillColor,
      secondary: strokeColor,
      accent: `hsl(${hue + 15}, ${adjustedSat * 0.9}%, ${Math.max(20, light - 10)}%)`,
      highlight: `hsl(${hue}, ${adjustedSat * 0.5}%, ${Math.min(90, light + 30)}%)`,
      depth: `hsl(${hue}, ${adjustedSat * 1.2}%, ${Math.max(10, light - 20)}%)`
    };
  }

  function renderSubtleDepth(ctx, points, colors, depth, cornerRadius) {
    ctx.save();
    ctx.globalAlpha = depth * 0.4;
    ctx.fillStyle = colors.depth;
    
    // Offset for depth
    ctx.translate(depth * 8, depth * 8);
    
    if (cornerRadius > 0) {
      drawRoundedTriangle(ctx, points, cornerRadius);
    } else {
      drawSharpTriangle(ctx, points);
    }
    ctx.fill();
    
    ctx.restore();
  }

  function renderCleanTriangle(ctx, points, colors, fillStyle, cornerRadius, centerX, centerY, size, params) {
    ctx.save();
    
    // Fill the triangle based on fill type and style
    if (params.fillType !== 'none' && fillStyle !== 0) {
      if (cornerRadius > 0) {
        drawRoundedTriangle(ctx, points, cornerRadius);
      } else {
        drawSharpTriangle(ctx, points);
      }
      
      // Apply universal fill
      if (params.fillType === 'solid') {
        ctx.fillStyle = params.fillColor || colors.primary;
        ctx.globalAlpha = params.fillOpacity || 1;
        ctx.fill();
      } else if (params.fillType === 'gradient') {
        const angle = (params.fillGradientDirection || 45) * Math.PI / 180;
        const gradient = ctx.createLinearGradient(
          centerX - Math.cos(angle) * size/2,
          centerY - Math.sin(angle) * size/2,
          centerX + Math.cos(angle) * size/2,
          centerY + Math.sin(angle) * size/2
        );
        gradient.addColorStop(0, params.fillGradientStart || colors.secondary);
        gradient.addColorStop(1, params.fillGradientEnd || colors.primary);
        
        ctx.fillStyle = gradient;
        ctx.globalAlpha = params.fillOpacity || 1;
        ctx.fill();
      }
      
      // Additional fill styles (template-specific)
      if (fillStyle === 3 && params.fillType !== 'none') {
        // Minimal texture for sophistication
        ctx.globalAlpha = 0.1;
        ctx.fillStyle = colors.accent;
        
        for (let i = 0; i < 20; i++) {
          const x = centerX + (Math.random() - 0.5) * size * 0.8;
          const y = centerY + (Math.random() - 0.5) * size * 0.8;
          if (ctx.isPointInPath(x, y)) {
            ctx.beginPath();
            ctx.arc(x, y, 0.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }
    
    ctx.restore();
  }

  function renderUniversalStroke(ctx, points, cornerRadius, params) {
    if (params.strokeType === 'none') return;
    
    ctx.save();
    ctx.strokeStyle = params.strokeColor;
    ctx.lineWidth = params.strokeWidth || 2;
    ctx.globalAlpha = params.strokeOpacity || 1;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Set stroke pattern
    switch (params.strokeType) {
      case 'dashed':
        ctx.setLineDash([params.strokeWidth * 3, params.strokeWidth * 2]);
        break;
      case 'dotted':
        ctx.setLineDash([params.strokeWidth, params.strokeWidth]);
        break;
      default:
        ctx.setLineDash([]);
    }
    
    if (cornerRadius > 0) {
      drawRoundedTriangle(ctx, points, cornerRadius);
    } else {
      drawSharpTriangle(ctx, points);
    }
    ctx.stroke();
    
    ctx.restore();
  }

  function renderBrandHighlight(ctx, points, colors, highlight, centerX, centerY) {
    ctx.save();
    ctx.globalAlpha = highlight;
    
    // Highlight the top edge for brand sophistication
    const topPoint = points[0];
    const leftPoint = points[1];
    const rightPoint = points[2];
    
    const highlightGradient = ctx.createLinearGradient(
      topPoint.x, topPoint.y,
      (leftPoint.x + rightPoint.x) / 2, (leftPoint.y + rightPoint.y) / 2
    );
    highlightGradient.addColorStop(0, colors.highlight);
    highlightGradient.addColorStop(1, 'transparent');
    
    ctx.strokeStyle = highlightGradient;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    ctx.moveTo(topPoint.x, topPoint.y);
    ctx.lineTo((leftPoint.x + rightPoint.x) / 2, (leftPoint.y + rightPoint.y) / 2);
    ctx.stroke();
    
    ctx.restore();
  }

  function drawSharpTriangle(ctx, points) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    ctx.lineTo(points[2].x, points[2].y);
    ctx.closePath();
  }

  function drawRoundedTriangle(ctx, points, radius) {
    ctx.beginPath();
    
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

export const metadata = {
  name: "▲ Clean Triangle",
  description: "Perfect geometric triangles with theme-aware colors and mathematical precision",
  defaultParams: {
    seed: "clean-triangle-brand",
    triangleType: 0,
    heightRatio: 1.0,
    baseWidth: 1.0,
    apexOffset: 0,
    goldenRatio: 0.2,
    cornerRadius: 0,
    symmetryPerfection: 1.0,
    fillStyle: 1,
    colorIntensity: 0.8,
    depth: 0.1,
    highlight: 0.15
  }
};

export const id = 'clean-triangle';
export const name = "▲ Clean Triangle";
export const description = "Perfect geometric triangles with theme-aware colors and mathematical precision";
export const defaultParams = {
  seed: "clean-triangle-brand",
  triangleType: 0,
  heightRatio: 1.0,
  baseWidth: 1.0,
  apexOffset: 0,
  goldenRatio: 0.2,
  cornerRadius: 0,
  symmetryPerfection: 1.0,
  fillStyle: 1,
  colorIntensity: 0.8,
  depth: 0.1,
  highlight: 0.15
};
export const code = `// ▲ Clean Triangle
const PARAMETERS = {
  // Universal Background Controls
  backgroundColor: { type: 'color', default: "#ffffff", label: 'Background Color', category: 'Background' },
  backgroundType: { type: 'select', options: [{"value":"transparent","label":"Transparent"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "solid", label: 'Background Type', category: 'Background' },
  backgroundGradientStart: { type: 'color', default: "#ffffff", label: 'Gradient Start', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientEnd: { type: 'color', default: "#f0f0f0", label: 'Gradient End', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 45, label: 'Gradient Direction', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  
  // Universal Fill Controls
  fillType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "solid", label: 'Fill Type', category: 'Fill' },
  fillColor: { type: 'color', default: "#3b82f6", label: 'Fill Color', category: 'Fill', showIf: (params)=>params.fillType === 'solid' },
  fillGradientStart: { type: 'color', default: "#3b82f6", label: 'Gradient Start', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientEnd: { type: 'color', default: "#1d4ed8", label: 'Gradient End', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 90, label: 'Gradient Direction', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.8, label: 'Fill Opacity', category: 'Fill', showIf: (params)=>params.fillType !== 'none' },
  
  // Universal Stroke Controls
  strokeType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid"},{"value":"dashed","label":"Dashed"},{"value":"dotted","label":"Dotted"}], default: "none", label: 'Stroke Type', category: 'Stroke' },
  strokeColor: { type: 'color', default: "#1e40af", label: 'Stroke Color', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeWidth: { type: 'slider', min: 0, max: 10, step: 0.5, default: 2, label: 'Stroke Width', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Stroke Opacity', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  
  // Template-specific parameters - Triangle fundamentals (shape definition)
  triangleType: {
    type: 'slider',
    min: 0,
    max: 4,
    step: 1,
    default: 0,
    label: 'Triangle Type (0=Equilateral, 1=Isosceles, 2=Scalene, 3=Right, 4=Acute)',
    category: 'Shape'
  },
  
  // Proportional controls using mathematical ratios
  heightRatio: { type: 'slider', min: 0.6, max: 1.8, step: 0.05, default: 1.0, label: 'Height Ratio', category: 'Shape' },
  baseWidth: { type: 'slider', min: 0.7, max: 1.5, step: 0.05, default: 1.0, label: 'Base Width', category: 'Shape' },
  apexOffset: { type: 'slider', min: -0.3, max: 0.3, step: 0.05, default: 0, label: 'Apex Offset', category: 'Shape' },
  
  // Mathematical elegance
  goldenRatio: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.2, label: 'Golden Ratio Influence', category: 'Mathematics' },
  cornerRadius: { type: 'slider', min: 0, max: 20, step: 1, default: 0, label: 'Corner Softness', category: 'Shape' },
  symmetryPerfection: { type: 'slider', min: 0.8, max: 1, step: 0.01, default: 1.0, label: 'Geometric Precision', category: 'Mathematics' },
  
  // Brand enhancement - context-aware (removed duplicate stroke)
  fillStyle: {
    type: 'slider',
    min: 0,
    max: 3,
    step: 1,
    default: 1,
    label: 'Fill Style (0=None, 1=Solid, 2=Gradient, 3=Minimal Texture)',
    category: 'Effects'
  },
  
  // Color system - professional brand palette
  colorIntensity: { type: 'slider', min: 0.5, max: 1, step: 0.05, default: 0.8, label: 'Color Intensity', category: 'Effects' },
  
  // Subtle enhancements for larger sizes
  depth: { type: 'slider', min: 0, max: 0.5, step: 0.05, default: 0.1, label: 'Subtle Depth', category: 'Effects' },
  highlight: { type: 'slider', min: 0, max: 0.4, step: 0.05, default: 0.15, label: 'Brand Highlight', category: 'Effects' }
};

function applyUniversalBackground(ctx, width, height, params) {
  if (!params.backgroundType || params.backgroundType === 'transparent') return;
  
  if (params.backgroundType === 'solid') {
    ctx.fillStyle = params.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, width, height);
  } else if (params.backgroundType === 'gradient') {
    const direction = (params.backgroundGradientDirection || 0) * (Math.PI / 180);
    const x1 = width / 2 - Math.cos(direction) * width / 2;
    const y1 = height / 2 - Math.sin(direction) * height / 2;
    const x2 = width / 2 + Math.cos(direction) * width / 2;
    const y2 = height / 2 + Math.sin(direction) * height / 2;
    
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, params.backgroundGradientStart || '#ffffff');
    gradient.addColorStop(1, params.backgroundGradientEnd || '#f0f0f0');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
}

${drawVisualization.toString()}`;