import type { TemplateUtils } from '@reflow/template-utils';

// Sophisticated Strokes - Advanced line and fill styling
const parameters = {
  // Basic form
  frequency: {
    default: 0.8,
    range: [0.1, 2, 0.1]
  },
  amplitude: {
    default: 100,
    range: [60, 180, 5]
  },
  complexity: {
    default: 0.6,
    range: [0, 1, 0.05]
  },
  
  // Advanced stroke sophistication  
  strokeVariation: {
    default: 0.3,
    range: [0, 1, 0.05]
  },
  strokeTaper: {
    default: 0.4,
    range: [0, 1, 0.05]
  },
  strokeTexture: {
    default: 0.2,
    range: [0, 1, 0.05]
  },
  
  // Advanced stroke style
  advancedStrokeStyle: {
    default: 0,
    options: ['Basic', 'Brush', 'Calligraphy', 'Textured', 'Variable']
  },
  
  // Advanced fill sophistication
  advancedFillType: {
    default: 0,
    options: ['Basic', 'Pattern', 'Texture']
  },
  gradientComplexity: {
    default: 0.3,
    range: [0, 1, 0.05]
  },
  
  // Color sophistication
  colorHarmony: {
    default: 0,
    options: ['Monochromatic', 'Analogous', 'Complementary', 'Triadic', 'Split Complementary', 'Tetradic']
  },
  colorSaturation: {
    default: 0.7,
    range: [0, 1, 0.05]
  },
  colorContrast: {
    default: 0.8,
    range: [0, 1, 0.05]
  }
};

function drawVisualization(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: any,
  time: number,
  utils: TemplateUtils
) {
  // Apply universal background
  utils.applyUniversalBackground(ctx, width, height, params);
  
  // Access universal properties
  const fillColor = params.fillColor || '#3b82f6';
  const strokeColor = params.strokeColor || '#1e293b';
  const fillOpacity = params.fillOpacity ?? 0.8;
  const strokeOpacity = params.strokeOpacity ?? 1;

  // Extract parameters
  const centerX = width / 2;
  const centerY = height / 2;
  const frequency = params.frequency || 0.8;
  const amplitude = params.amplitude || 100;
  const complexity = params.complexity || 0.6;
  
  const strokeVariation = params.strokeVariation || 0.3;
  const strokeTaper = params.strokeTaper || 0.4;
  const strokeTexture = params.strokeTexture || 0.2;
  const advancedStrokeStyleNum = typeof params.advancedStrokeStyle === 'string' ? 
    ['Basic', 'Brush', 'Calligraphy', 'Textured', 'Variable'].indexOf(params.advancedStrokeStyle) : 
    Math.round(params.advancedStrokeStyle || 0);
  
  const advancedFillTypeNum = typeof params.advancedFillType === 'string' ? 
    ['Basic', 'Pattern', 'Texture'].indexOf(params.advancedFillType) : 
    Math.round(params.advancedFillType || 0);
  const gradientComplexity = params.gradientComplexity || 0.3;
  
  const colorHarmonyNum = typeof params.colorHarmony === 'string' ? 
    ['Monochromatic', 'Analogous', 'Complementary', 'Triadic', 'Split Complementary', 'Tetradic'].indexOf(params.colorHarmony) : 
    Math.round(params.colorHarmony || 0);
  const colorSaturation = params.colorSaturation || 0.7;
  const colorContrast = params.colorContrast || 0.8;

  // Generate base form
  const baseScale = Math.min(width, height) / 300;
  const scaledAmplitude = amplitude * baseScale;
  const pulse = 1 + Math.sin(time * frequency) * 0.1;
  
  const points = generateSophisticatedShape(
    centerX, centerY, scaledAmplitude * pulse, 
    complexity, time, frequency
  );

  // Generate color palette
  const palette = generateColorHarmony(colorHarmonyNum, colorSaturation, colorContrast, time, params);

  // Apply sophisticated fill
  if (params.fillType !== 'none') {
    applySophisticatedFill(ctx, points, params, palette, advancedFillTypeNum, gradientComplexity);
  }

  // Apply sophisticated stroke
  if (params.strokeType !== 'none') {
    applySophisticatedStroke(ctx, points, params, palette, advancedStrokeStyleNum, strokeVariation, strokeTaper, strokeTexture, time);
  }

  function generateSophisticatedShape(centerX, centerY, radius, complexity, time, frequency) {
    const points = [];
    const numPoints = Math.floor(6 + complexity * 10); // 6-16 points
    
    for (let i = 0; i < numPoints; i++) {
      const t = i / numPoints;
      const angle = t * Math.PI * 2;
      
      // Layer multiple harmonics for complexity
      const harmonic1 = Math.sin(angle * 3 + time * frequency) * complexity * 0.2;
      const harmonic2 = Math.sin(angle * 5 + time * frequency * 1.5) * complexity * 0.1;
      const harmonic3 = Math.sin(angle * 7 + time * frequency * 0.7) * complexity * 0.05;
      
      const finalRadius = radius * (1 + harmonic1 + harmonic2 + harmonic3);
      
      points.push({
        x: centerX + Math.cos(angle) * finalRadius,
        y: centerY + Math.sin(angle) * finalRadius,
        angle: angle,
        t: t,
        curvature: harmonic1 + harmonic2
      });
    }
    
    return points;
  }

  function generateColorHarmony(harmonyType, saturation, contrast, time, params) {
    // Extract base hue from fill color if solid
    let baseHue = (time * 10) % 360;
    if (params.fillType === 'solid' && params.fillColor) {
      baseHue = extractHueFromHex(params.fillColor);
    }
    
    const sat = saturation * 100;
    const lightBase = 50;
    const contrastRange = contrast * 40;
    
    switch (harmonyType) {
      case 0: // Monochromatic
        return {
          primary: params.fillColor || `hsl(${baseHue}, ${sat}%, ${lightBase}%)`,
          secondary: `hsl(${baseHue}, ${sat * 0.7}%, ${lightBase + contrastRange * 0.3}%)`,
          accent: params.strokeColor || `hsl(${baseHue}, ${sat * 0.5}%, ${lightBase - contrastRange * 0.3}%)`
        };
      case 1: // Analogous
        return {
          primary: params.fillColor || `hsl(${baseHue}, ${sat}%, ${lightBase}%)`,
          secondary: `hsl(${(baseHue + 30) % 360}, ${sat}%, ${lightBase + contrastRange * 0.2}%)`,
          accent: params.strokeColor || `hsl(${(baseHue - 30 + 360) % 360}, ${sat}%, ${lightBase - contrastRange * 0.2}%)`
        };
      case 2: // Complementary
        return {
          primary: params.fillColor || `hsl(${baseHue}, ${sat}%, ${lightBase}%)`,
          secondary: `hsl(${(baseHue + 180) % 360}, ${sat}%, ${lightBase + contrastRange * 0.3}%)`,
          accent: params.strokeColor || `hsl(${baseHue}, ${sat * 0.5}%, ${lightBase - contrastRange * 0.2}%)`
        };
      case 3: // Triadic
        return {
          primary: params.fillColor || `hsl(${baseHue}, ${sat}%, ${lightBase}%)`,
          secondary: `hsl(${(baseHue + 120) % 360}, ${sat}%, ${lightBase + contrastRange * 0.2}%)`,
          accent: params.strokeColor || `hsl(${(baseHue + 240) % 360}, ${sat}%, ${lightBase - contrastRange * 0.2}%)`
        };
      case 4: // Split Complementary
        return {
          primary: params.fillColor || `hsl(${baseHue}, ${sat}%, ${lightBase}%)`,
          secondary: `hsl(${(baseHue + 150) % 360}, ${sat}%, ${lightBase + contrastRange * 0.2}%)`,
          accent: params.strokeColor || `hsl(${(baseHue + 210) % 360}, ${sat}%, ${lightBase - contrastRange * 0.2}%)`
        };
      case 5: // Tetradic
        return {
          primary: params.fillColor || `hsl(${baseHue}, ${sat}%, ${lightBase}%)`,
          secondary: `hsl(${(baseHue + 90) % 360}, ${sat}%, ${lightBase + contrastRange * 0.2}%)`,
          accent: params.strokeColor || `hsl(${(baseHue + 180) % 360}, ${sat}%, ${lightBase - contrastRange * 0.2}%)`
        };
      default:
        return {
          primary: params.fillColor || `hsl(${baseHue}, ${sat}%, ${lightBase}%)`,
          secondary: `hsl(${baseHue}, ${sat * 0.7}%, ${lightBase + contrastRange * 0.3}%)`,
          accent: params.strokeColor || `hsl(${baseHue}, ${sat * 0.5}%, ${lightBase - contrastRange * 0.3}%)`
        };
    }
  }

  function applySophisticatedFill(ctx, points, params, palette, advancedFillType, gradientComplexity) {
    ctx.save();
    ctx.globalAlpha = params.fillOpacity || 0.8;

    // First apply basic fill
    if (params.fillType === 'solid') {
      ctx.fillStyle = params.fillColor || palette.primary;
      drawSmoothPath(ctx, points, true);
      ctx.fill();
    } else if (params.fillType === 'gradient') {
      const bounds = getBounds(points);
      const angleRad = ((params.fillGradientDirection || 90) * Math.PI) / 180;
      const gradientLength = Math.max(bounds.width, bounds.height);
      
      const startX = bounds.centerX - Math.cos(angleRad) * gradientLength * 0.5;
      const startY = bounds.centerY - Math.sin(angleRad) * gradientLength * 0.5;
      const endX = bounds.centerX + Math.cos(angleRad) * gradientLength * 0.5;
      const endY = bounds.centerY + Math.sin(angleRad) * gradientLength * 0.5;
      
      const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
      
      if (gradientComplexity < 0.3) {
        // Simple 2-stop gradient
        gradient.addColorStop(0, params.fillGradientStart || palette.primary);
        gradient.addColorStop(1, params.fillGradientEnd || palette.secondary);
      } else if (gradientComplexity < 0.7) {
        // 3-stop gradient
        gradient.addColorStop(0, params.fillGradientStart || palette.primary);
        gradient.addColorStop(0.5, palette.accent);
        gradient.addColorStop(1, params.fillGradientEnd || palette.secondary);
      } else {
        // Complex 5-stop gradient
        gradient.addColorStop(0, params.fillGradientStart || palette.primary);
        gradient.addColorStop(0.25, palette.accent);
        gradient.addColorStop(0.5, params.fillGradientEnd || palette.secondary);
        gradient.addColorStop(0.75, palette.accent);
        gradient.addColorStop(1, params.fillGradientStart || palette.primary);
      }
      
      ctx.fillStyle = gradient;
      drawSmoothPath(ctx, points, true);
      ctx.fill();
    }

    // Apply advanced fill effects on top
    if (advancedFillType === 1) { // Pattern
      ctx.save();
      ctx.clip();
      ctx.fillStyle = palette.accent;
      ctx.globalAlpha = 0.2;
      const bounds = getBounds(points);
      const dotSpacing = 8;
      for (let x = bounds.minX; x < bounds.maxX; x += dotSpacing) {
        for (let y = bounds.minY; y < bounds.maxY; y += dotSpacing) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    } else if (advancedFillType === 2) { // Texture
      ctx.save();
      drawSmoothPath(ctx, points, true);
      ctx.clip();
      const bounds = getBounds(points);
      const imageData = ctx.getImageData(bounds.minX, bounds.minY, bounds.width, bounds.height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * 20;
        data[i] = Math.max(0, Math.min(255, data[i] + noise));     // Red
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // Green
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // Blue
      }
      
      ctx.putImageData(imageData, bounds.minX, bounds.minY);
      ctx.restore();
    }

    ctx.restore();
  }

  function applySophisticatedStroke(ctx, points, params, palette, advancedStyle, variation, taper, texture, time) {
    ctx.save();
    
    ctx.strokeStyle = params.strokeColor || palette.accent;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = params.strokeOpacity || 1;

    // Apply basic stroke style first
    if (params.strokeType === 'dashed') {
      const dashPattern = [params.strokeWidth * 3, params.strokeWidth * 2];
      ctx.setLineDash(dashPattern);
      ctx.lineWidth = params.strokeWidth || 3;
      drawSmoothPath(ctx, points, true);
      ctx.stroke();
    } else if (params.strokeType === 'dotted') {
      const dotSpacing = params.strokeWidth * 4;
      drawDottedStroke(ctx, points, params.strokeWidth || 3, dotSpacing);
    } else if (params.strokeType === 'solid') {
      // Apply advanced styles for solid strokes
      switch (advancedStyle) {
        case 0: // Basic
          ctx.lineWidth = params.strokeWidth || 3;
          drawSmoothPath(ctx, points, true);
          ctx.stroke();
          break;
          
        case 1: // Brush stroke
          drawBrushStroke(ctx, points, params.strokeWidth || 3, variation, texture, time);
          break;
          
        case 2: // Calligraphy stroke
          drawCalligraphyStroke(ctx, points, params.strokeWidth || 3, taper, variation);
          break;
          
        case 3: // Textured stroke
          drawTexturedStroke(ctx, points, params.strokeWidth || 3, texture);
          break;
          
        case 4: // Variable stroke
          drawVariableStroke(ctx, points, params.strokeWidth || 3, variation, taper);
          break;
      }
    }

    ctx.restore();
  }

  function drawVariableStroke(ctx, points, baseWeight, variation, taper) {
    if (points.length < 2) return;
    
    for (let i = 0; i < points.length; i++) {
      const current = points[i];
      const next = points[(i + 1) % points.length];
      
      // Calculate variable weight
      const progress = i / points.length;
      const taperEffect = taper > 0 ? Math.sin(progress * Math.PI) : 1;
      const variationEffect = 1 + (current.curvature || 0) * variation;
      const lineWidth = baseWeight * taperEffect * variationEffect;
      
      ctx.lineWidth = Math.max(0.5, lineWidth);
      ctx.beginPath();
      ctx.moveTo(current.x, current.y);
      ctx.lineTo(next.x, next.y);
      ctx.stroke();
    }
  }

  function drawDottedStroke(ctx, points, dotSize, spacing) {
    const pathLength = getPathLength(points);
    const numDots = Math.floor(pathLength / spacing);
    
    for (let i = 0; i < numDots; i++) {
      const t = i / numDots;
      const point = getPointAtT(points, t);
      
      ctx.beginPath();
      ctx.arc(point.x, point.y, dotSize * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawBrushStroke(ctx, points, weight, variation, texture, time) {
    ctx.globalAlpha = 0.8;
    
    for (let i = 0; i < points.length; i++) {
      const current = points[i];
      const next = points[(i + 1) % points.length];
      
      // Multiple brush strokes for texture
      const numStrokes = Math.floor(1 + texture * 3);
      
      for (let j = 0; j < numStrokes; j++) {
        const offset = (j - numStrokes/2) * weight * 0.3;
        const alpha = 1 - j * 0.2;
        
        ctx.globalAlpha = alpha * 0.6;
        ctx.lineWidth = weight * (1 - j * 0.2);
        
        ctx.beginPath();
        ctx.moveTo(current.x + offset, current.y);
        ctx.lineTo(next.x + offset, next.y);
        ctx.stroke();
      }
    }
  }

  function drawCalligraphyStroke(ctx, points, weight, taper, variation) {
    if (points.length < 2) return;
    
    for (let i = 0; i < points.length; i++) {
      const current = points[i];
      const next = points[(i + 1) % points.length];
      
      // Calculate angle for calligraphy effect
      const angle = Math.atan2(next.y - current.y, next.x - current.x);
      const calligraphyWidth = weight * (1 + Math.sin(angle * 2) * variation * 0.5);
      
      // Progress-based tapering
      const progress = i / points.length;
      const taperEffect = taper > 0 ? Math.sin(progress * Math.PI) : 1;
      
      ctx.lineWidth = calligraphyWidth * taperEffect;
      ctx.beginPath();
      ctx.moveTo(current.x, current.y);
      ctx.lineTo(next.x, next.y);
      ctx.stroke();
    }
  }

  function drawTexturedStroke(ctx, points, weight, texture) {
    // Draw main stroke
    ctx.lineWidth = weight;
    drawSmoothPath(ctx, points, true);
    ctx.stroke();
    
    // Add texture
    if (texture > 0.1) {
      ctx.save();
      ctx.globalAlpha = texture * 0.3;
      
      for (let i = 0; i < points.length; i++) {
        const current = points[i];
        const next = points[(i + 1) % points.length];
        
        // Add random offsets for texture
        for (let j = 0; j < 3; j++) {
          const offsetX = (Math.random() - 0.5) * weight;
          const offsetY = (Math.random() - 0.5) * weight;
          
          ctx.beginPath();
          ctx.moveTo(current.x + offsetX, current.y + offsetY);
          ctx.lineTo(next.x + offsetX, next.y + offsetY);
          ctx.stroke();
        }
      }
      
      ctx.restore();
    }
  }

  function getBounds(points) {
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

  function getPathLength(points) {
    let length = 0;
    for (let i = 0; i < points.length; i++) {
      const current = points[i];
      const next = points[(i + 1) % points.length];
      const dx = next.x - current.x;
      const dy = next.y - current.y;
      length += Math.sqrt(dx * dx + dy * dy);
    }
    return length;
  }

  function getPointAtT(points, t) {
    const totalLength = getPathLength(points);
    const targetLength = t * totalLength;
    
    let currentLength = 0;
    for (let i = 0; i < points.length; i++) {
      const current = points[i];
      const next = points[(i + 1) % points.length];
      const dx = next.x - current.x;
      const dy = next.y - current.y;
      const segmentLength = Math.sqrt(dx * dx + dy * dy);
      
      if (currentLength + segmentLength >= targetLength) {
        const segmentT = (targetLength - currentLength) / segmentLength;
        return {
          x: current.x + dx * segmentT,
          y: current.y + dy * segmentT
        };
      }
      
      currentLength += segmentLength;
    }
    
    return points[0];
  }

  function drawSmoothPath(ctx, points, close = false) {
    if (points.length < 2) return;
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 1; i < points.length; i++) {
      const current = points[i];
      const previous = points[i - 1];
      const next = points[(i + 1) % points.length];
      
      const cp1x = previous.x + (current.x - (points[i - 2] || previous).x) * 0.2;
      const cp1y = previous.y + (current.y - (points[i - 2] || previous).y) * 0.2;
      const cp2x = current.x - (next.x - previous.x) * 0.2;
      const cp2y = current.y - (next.y - previous.y) * 0.2;
      
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, current.x, current.y);
    }
    
    if (close && points.length > 2) {
      const first = points[0];
      const last = points[points.length - 1];
      const cp1x = last.x + (first.x - points[points.length - 2].x) * 0.2;
      const cp1y = last.y + (first.y - points[points.length - 2].y) * 0.2;
      const cp2x = first.x - (points[1].x - last.x) * 0.2;
      const cp2y = first.y - (points[1].y - last.y) * 0.2;
      
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, first.x, first.y);
    }
  }
  
  function extractHueFromHex(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return 0;
    
    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;
    
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0;
    
    if (max !== min) {
      const d = max - min;
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    
    return h * 360;
  }
}

const metadata = {
  id: 'sophisticated-strokes',
  name: "🎨 Sophisticated Strokes",
  description: "Advanced line and fill styling with sophisticated color harmony and stroke techniques",
  parameters,
  defaultParams: {
    frequency: 0.8,
    amplitude: 100,
    complexity: 0.6,
    strokeVariation: 0.3,
    strokeTaper: 0.4,
    strokeTexture: 0.2,
    advancedStrokeStyle: 0,
    advancedFillType: 0,
    gradientComplexity: 0.3,
    colorHarmony: 0,
    colorSaturation: 0.7,
    colorContrast: 0.8
  }
};

export { parameters, metadata, drawVisualization };