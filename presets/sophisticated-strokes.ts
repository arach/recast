import type { ParameterDefinition, PresetMetadata } from './types';

// Sophisticated Strokes - Advanced line and fill styling
export const parameters: Record<string, ParameterDefinition> = {
  // Basic form
  frequency: { type: 'slider', min: 0.1, max: 2, step: 0.1, default: 0.8, label: 'Form Energy' },
  amplitude: { type: 'slider', min: 60, max: 180, step: 5, default: 100, label: 'Scale' },
  complexity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.6, label: 'Form Complexity' },
  
  // Stroke sophistication  
  strokeWeight: { type: 'slider', min: 0.5, max: 12, step: 0.5, default: 3, label: 'Stroke Weight' },
  strokeVariation: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.3, label: 'Weight Variation' },
  strokeTaper: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.4, label: 'Stroke Taper' },
  strokeTexture: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.2, label: 'Stroke Texture' },
  
  // Stroke style
  strokeStyle: {
    type: 'slider',
    min: 0,
    max: 4,
    step: 1,
    default: 0,
    label: 'Stroke Style (0=Solid, 1=Dashed, 2=Dotted, 3=Brush, 4=Calligraphy)'
  },
  
  // Fill sophistication
  fillType: {
    type: 'slider', 
    min: 0,
    max: 4,
    step: 1,
    default: 1,
    label: 'Fill Type (0=None, 1=Solid, 2=Gradient, 3=Pattern, 4=Texture)'
  },
  fillOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.8, label: 'Fill Opacity' },
  gradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 135, label: 'Gradient Angle' },
  gradientComplexity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.3, label: 'Gradient Stops' },
  
  // Color sophistication
  colorHarmony: {
    type: 'slider',
    min: 0,
    max: 5,
    step: 1,
    default: 0,
    label: 'Color Scheme (0=Mono, 1=Analogous, 2=Complement, 3=Triadic, 4=Split, 5=Tetradic)'
  },
  colorSaturation: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.7, label: 'Color Saturation' },
  colorContrast: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.8, label: 'Color Contrast' }
};

export function draw(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, any>,
  generator: any,
  time: number
) {
  // Clean background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Extract parameters
  const centerX = width / 2;
  const centerY = height / 2;
  const frequency = params.frequency || 0.8;
  const amplitude = params.amplitude || 100;
  const complexity = params.complexity || 0.6;
  
  const strokeWeight = params.strokeWeight || 3;
  const strokeVariation = params.strokeVariation || 0.3;
  const strokeTaper = params.strokeTaper || 0.4;
  const strokeTexture = params.strokeTexture || 0.2;
  const strokeStyleNum = Math.round(params.strokeStyle || 0);
  
  const fillTypeNum = Math.round(params.fillType || 1);
  const fillOpacity = params.fillOpacity || 0.8;
  const gradientDirection = params.gradientDirection || 135;
  const gradientComplexity = params.gradientComplexity || 0.3;
  
  const colorHarmonyNum = Math.round(params.colorHarmony || 0);
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
  const palette = generateColorHarmony(colorHarmonyNum, colorSaturation, colorContrast, time);

  // Apply sophisticated fill
  if (fillTypeNum > 0) {
    applySophisticatedFill(ctx, points, fillTypeNum, fillOpacity, gradientDirection, gradientComplexity, palette);
  }

  // Apply sophisticated stroke
  applySophisticatedStroke(ctx, points, strokeWeight, strokeVariation, strokeTaper, strokeTexture, strokeStyleNum, palette, time);

  function generateSophisticatedShape(centerX: number, centerY: number, radius: number, complexity: number, time: number, frequency: number) {
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

  function generateColorHarmony(harmonyType: number, saturation: number, contrast: number, time: number) {
    const baseHue = (time * 10) % 360; // Slowly rotating base hue
    const sat = saturation * 100;
    const lightBase = 50;
    const contrastRange = contrast * 40;
    
    switch (harmonyType) {
      case 0: // Monochromatic
        return {
          primary: `hsl(${baseHue}, ${sat}%, ${lightBase}%)`,
          secondary: `hsl(${baseHue}, ${sat * 0.7}%, ${lightBase + contrastRange * 0.3}%)`,
          accent: `hsl(${baseHue}, ${sat * 0.5}%, ${lightBase - contrastRange * 0.3}%)`
        };
      case 1: // Analogous
        return {
          primary: `hsl(${baseHue}, ${sat}%, ${lightBase}%)`,
          secondary: `hsl(${(baseHue + 30) % 360}, ${sat}%, ${lightBase + contrastRange * 0.2}%)`,
          accent: `hsl(${(baseHue - 30 + 360) % 360}, ${sat}%, ${lightBase - contrastRange * 0.2}%)`
        };
      case 2: // Complementary
        return {
          primary: `hsl(${baseHue}, ${sat}%, ${lightBase}%)`,
          secondary: `hsl(${(baseHue + 180) % 360}, ${sat}%, ${lightBase + contrastRange * 0.3}%)`,
          accent: `hsl(${baseHue}, ${sat * 0.5}%, ${lightBase - contrastRange * 0.2}%)`
        };
      case 3: // Triadic
        return {
          primary: `hsl(${baseHue}, ${sat}%, ${lightBase}%)`,
          secondary: `hsl(${(baseHue + 120) % 360}, ${sat}%, ${lightBase + contrastRange * 0.2}%)`,
          accent: `hsl(${(baseHue + 240) % 360}, ${sat}%, ${lightBase - contrastRange * 0.2}%)`
        };
      case 4: // Split Complementary
        return {
          primary: `hsl(${baseHue}, ${sat}%, ${lightBase}%)`,
          secondary: `hsl(${(baseHue + 150) % 360}, ${sat}%, ${lightBase + contrastRange * 0.2}%)`,
          accent: `hsl(${(baseHue + 210) % 360}, ${sat}%, ${lightBase - contrastRange * 0.2}%)`
        };
      case 5: // Tetradic
        return {
          primary: `hsl(${baseHue}, ${sat}%, ${lightBase}%)`,
          secondary: `hsl(${(baseHue + 90) % 360}, ${sat}%, ${lightBase + contrastRange * 0.2}%)`,
          accent: `hsl(${(baseHue + 180) % 360}, ${sat}%, ${lightBase - contrastRange * 0.2}%)`
        };
      default:
        return {
          primary: `hsl(${baseHue}, ${sat}%, ${lightBase}%)`,
          secondary: `hsl(${baseHue}, ${sat * 0.7}%, ${lightBase + contrastRange * 0.3}%)`,
          accent: `hsl(${baseHue}, ${sat * 0.5}%, ${lightBase - contrastRange * 0.3}%)`
        };
    }
  }

  function applySophisticatedFill(ctx: CanvasRenderingContext2D, points: any[], fillType: number, opacity: number, gradientAngle: number, gradientComplexity: number, palette: any) {
    ctx.save();
    ctx.globalAlpha = opacity;

    switch (fillType) {
      case 1: // Solid fill
        ctx.fillStyle = palette.primary;
        drawSmoothPath(ctx, points, true);
        ctx.fill();
        break;
        
      case 2: // Gradient fill
        const bounds = getBounds(points);
        const angleRad = (gradientAngle * Math.PI) / 180;
        const gradientLength = Math.max(bounds.width, bounds.height);
        
        const startX = bounds.centerX - Math.cos(angleRad) * gradientLength * 0.5;
        const startY = bounds.centerY - Math.sin(angleRad) * gradientLength * 0.5;
        const endX = bounds.centerX + Math.cos(angleRad) * gradientLength * 0.5;
        const endY = bounds.centerY + Math.sin(angleRad) * gradientLength * 0.5;
        
        const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
        
        if (gradientComplexity < 0.3) {
          // Simple 2-stop gradient
          gradient.addColorStop(0, palette.primary);
          gradient.addColorStop(1, palette.secondary);
        } else if (gradientComplexity < 0.7) {
          // 3-stop gradient
          gradient.addColorStop(0, palette.primary);
          gradient.addColorStop(0.5, palette.accent);
          gradient.addColorStop(1, palette.secondary);
        } else {
          // Complex 5-stop gradient
          gradient.addColorStop(0, palette.primary);
          gradient.addColorStop(0.25, palette.accent);
          gradient.addColorStop(0.5, palette.secondary);
          gradient.addColorStop(0.75, palette.accent);
          gradient.addColorStop(1, palette.primary);
        }
        
        ctx.fillStyle = gradient;
        drawSmoothPath(ctx, points, true);
        ctx.fill();
        break;
        
      case 3: // Pattern fill (simple dots)
        ctx.fillStyle = palette.primary;
        drawSmoothPath(ctx, points, true);
        ctx.fill();
        
        // Add dot pattern
        ctx.fillStyle = palette.accent;
        const bounds3 = getBounds(points);
        const dotSpacing = 8;
        for (let x = bounds3.minX; x < bounds3.maxX; x += dotSpacing) {
          for (let y = bounds3.minY; y < bounds3.maxY; y += dotSpacing) {
            if (ctx.isPointInPath(x, y)) {
              ctx.beginPath();
              ctx.arc(x, y, 1, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
        break;
        
      case 4: // Texture fill (noise)
        ctx.fillStyle = palette.primary;
        drawSmoothPath(ctx, points, true);
        ctx.fill();
        
        // Add texture noise
        const bounds4 = getBounds(points);
        const imageData = ctx.getImageData(bounds4.minX, bounds4.minY, bounds4.width, bounds4.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
          const noise = (Math.random() - 0.5) * 20;
          data[i] = Math.max(0, Math.min(255, data[i] + noise));     // Red
          data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // Green
          data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // Blue
        }
        
        ctx.putImageData(imageData, bounds4.minX, bounds4.minY);
        break;
    }

    ctx.restore();
  }

  function applySophisticatedStroke(ctx: CanvasRenderingContext2D, points: any[], weight: number, variation: number, taper: number, texture: number, style: number, palette: any, time: number) {
    ctx.save();
    
    ctx.strokeStyle = palette.accent;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    switch (style) {
      case 0: // Solid stroke
        drawVariableStroke(ctx, points, weight, variation, taper);
        break;
        
      case 1: // Dashed stroke
        const dashPattern = [weight * 3, weight * 2];
        ctx.setLineDash(dashPattern);
        ctx.lineWidth = weight;
        drawSmoothPath(ctx, points, true);
        ctx.stroke();
        break;
        
      case 2: // Dotted stroke
        const dotSpacing = weight * 4;
        drawDottedStroke(ctx, points, weight, dotSpacing);
        break;
        
      case 3: // Brush stroke
        drawBrushStroke(ctx, points, weight, variation, texture, time);
        break;
        
      case 4: // Calligraphy stroke
        drawCalligraphyStroke(ctx, points, weight, taper, variation);
        break;
    }

    ctx.restore();
  }

  function drawVariableStroke(ctx: CanvasRenderingContext2D, points: any[], baseWeight: number, variation: number, taper: number) {
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

  function drawDottedStroke(ctx: CanvasRenderingContext2D, points: any[], dotSize: number, spacing: number) {
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

  function drawBrushStroke(ctx: CanvasRenderingContext2D, points: any[], weight: number, variation: number, texture: number, time: number) {
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

  function drawCalligraphyStroke(ctx: CanvasRenderingContext2D, points: any[], weight: number, taper: number, variation: number) {
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

  function getPathLength(points: any[]) {
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

  function getPointAtT(points: any[], t: number) {
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

  function drawSmoothPath(ctx: CanvasRenderingContext2D, points: any[], close: boolean = false) {
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
}

export const metadata: PresetMetadata = {
  name: "🎨 Sophisticated Strokes",
  description: "Advanced line and fill styling with sophisticated color harmony and stroke techniques",
  defaultParams: {
    seed: "sophisticated-strokes",
    frequency: 0.8,
    amplitude: 100,
    complexity: 0.6,
    strokeWeight: 3,
    strokeVariation: 0.3,
    strokeTaper: 0.4,
    strokeTexture: 0.2,
    strokeStyle: 0,
    fillType: 1,
    fillOpacity: 0.8,
    gradientDirection: 135,
    gradientComplexity: 0.3,
    colorHarmony: 0,
    colorSaturation: 0.7,
    colorContrast: 0.8
  }
};