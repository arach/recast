import type { ParameterDefinition, PresetMetadata } from './types';

// Clean Triangle - Perfect geometric triangles for tech brands
export const parameters: Record<string, ParameterDefinition> = {
  // Triangle fundamentals - shape definition (70% of controls)
  triangleType: {
    type: 'slider',
    min: 0,
    max: 4,
    step: 1,
    default: 0,
    label: 'Triangle Type (0=Equilateral, 1=Isosceles, 2=Scalene, 3=Right, 4=Acute)'
  },
  
  // Proportional controls using mathematical ratios
  heightRatio: { type: 'slider', min: 0.6, max: 1.8, step: 0.05, default: 1.0, label: 'Height Ratio' },
  baseWidth: { type: 'slider', min: 0.7, max: 1.5, step: 0.05, default: 1.0, label: 'Base Width' },
  apexOffset: { type: 'slider', min: -0.3, max: 0.3, step: 0.05, default: 0, label: 'Apex Offset' },
  
  // Mathematical elegance
  goldenRatio: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.2, label: 'Golden Ratio Influence' },
  cornerRadius: { type: 'slider', min: 0, max: 20, step: 1, default: 0, label: 'Corner Softness' },
  symmetryPerfection: { type: 'slider', min: 0.8, max: 1, step: 0.01, default: 1.0, label: 'Geometric Precision' },
  
  // Brand enhancement (30% of controls) - context-aware
  strokeWeight: { type: 'slider', min: 0, max: 8, step: 0.5, default: 0, label: 'Stroke Weight' },
  fillStyle: {
    type: 'slider',
    min: 0,
    max: 3,
    step: 1,
    default: 1,
    label: 'Fill Style (0=None, 1=Solid, 2=Gradient, 3=Minimal Texture)'
  },
  
  // Color system - professional brand palette
  brandHue: { type: 'slider', min: 0, max: 360, step: 10, default: 210, label: 'Brand Hue' },
  brandSaturation: { type: 'slider', min: 0.2, max: 1, step: 0.05, default: 0.8, label: 'Brand Saturation' },
  brandLightness: { type: 'slider', min: 0.3, max: 0.7, step: 0.05, default: 0.5, label: 'Brand Lightness' },
  
  // Subtle enhancements for larger sizes
  depth: { type: 'slider', min: 0, max: 0.5, step: 0.05, default: 0.1, label: 'Subtle Depth' },
  highlight: { type: 'slider', min: 0, max: 0.4, step: 0.05, default: 0.15, label: 'Brand Highlight' }
};

export function draw(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, any>,
  generator: any,
  time: number
) {
  // Clean professional background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

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
  const strokeWeight = params.strokeWeight || 0;
  const fillStyleNum = Math.round(params.fillStyle || 1);
  const brandHue = params.brandHue || 210;
  const brandSaturation = params.brandSaturation || 0.8;
  const brandLightness = params.brandLightness || 0.5;
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
  const brandColors = createBrandColors(brandHue, brandSaturation, brandLightness);

  // Apply subtle depth first (for larger sizes)
  if (depth > 0.05 && Math.min(width, height) > 100) {
    renderSubtleDepth(ctx, trianglePoints, brandColors, depth, cornerRadius);
  }

  // Render main triangle with clean geometry
  renderCleanTriangle(ctx, trianglePoints, brandColors, fillStyleNum, cornerRadius, centerX, centerY, logoSize);

  // Add stroke if specified
  if (strokeWeight > 0) {
    renderBrandStroke(ctx, trianglePoints, brandColors, strokeWeight, cornerRadius);
  }

  // Add subtle highlight for brand sophistication (larger sizes only)
  if (highlight > 0.05 && Math.min(width, height) > 64) {
    renderBrandHighlight(ctx, trianglePoints, brandColors, highlight, centerX, centerY);
  }

  function generateCleanTriangle(type: number, centerX: number, centerY: number, width: number, height: number, apexOffset: number, precision: number) {
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

  function createBrandColors(hue: number, saturation: number, lightness: number) {
    const sat = saturation * 100;
    const light = lightness * 100;
    
    return {
      primary: `hsl(${hue}, ${sat}%, ${light}%)`,
      secondary: `hsl(${hue}, ${sat * 0.7}%, ${light + 15}%)`,
      accent: `hsl(${hue + 15}, ${sat * 0.9}%, ${light - 10}%)`,
      highlight: `hsl(${hue}, ${sat * 0.5}%, ${Math.min(light + 30, 90)}%)`,
      depth: `hsl(${hue}, ${sat * 1.2}%, ${Math.max(light - 20, 10)}%)`
    };
  }

  function renderSubtleDepth(ctx: CanvasRenderingContext2D, points: any[], colors: any, depth: number, cornerRadius: number) {
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

  function renderCleanTriangle(ctx: CanvasRenderingContext2D, points: any[], colors: any, fillStyle: number, cornerRadius: number, centerX: number, centerY: number, size: number) {
    ctx.save();
    
    // Fill the triangle based on style
    switch (fillStyle) {
      case 0: // No fill
        break;
        
      case 1: // Solid fill
        ctx.fillStyle = colors.primary;
        if (cornerRadius > 0) {
          drawRoundedTriangle(ctx, points, cornerRadius);
        } else {
          drawSharpTriangle(ctx, points);
        }
        ctx.fill();
        break;
        
      case 2: // Professional gradient
        const gradient = ctx.createLinearGradient(
          centerX, centerY - size/2,
          centerX, centerY + size/2
        );
        gradient.addColorStop(0, colors.secondary);
        gradient.addColorStop(1, colors.primary);
        
        ctx.fillStyle = gradient;
        if (cornerRadius > 0) {
          drawRoundedTriangle(ctx, points, cornerRadius);
        } else {
          drawSharpTriangle(ctx, points);
        }
        ctx.fill();
        break;
        
      case 3: // Minimal texture for sophistication
        ctx.fillStyle = colors.primary;
        if (cornerRadius > 0) {
          drawRoundedTriangle(ctx, points, cornerRadius);
        } else {
          drawSharpTriangle(ctx, points);
        }
        ctx.fill();
        
        // Add very subtle texture
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
        break;
    }
    
    ctx.restore();
  }

  function renderBrandStroke(ctx: CanvasRenderingContext2D, points: any[], colors: any, weight: number, cornerRadius: number) {
    ctx.save();
    ctx.strokeStyle = colors.accent;
    ctx.lineWidth = weight;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    if (cornerRadius > 0) {
      drawRoundedTriangle(ctx, points, cornerRadius);
    } else {
      drawSharpTriangle(ctx, points);
    }
    ctx.stroke();
    
    ctx.restore();
  }

  function renderBrandHighlight(ctx: CanvasRenderingContext2D, points: any[], colors: any, highlight: number, centerX: number, centerY: number) {
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

  function drawSharpTriangle(ctx: CanvasRenderingContext2D, points: any[]) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    ctx.lineTo(points[2].x, points[2].y);
    ctx.closePath();
  }

  function drawRoundedTriangle(ctx: CanvasRenderingContext2D, points: any[], radius: number) {
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

export const metadata: PresetMetadata = {
  name: "▲ Clean Triangle",
  description: "Perfect geometric triangles with mathematical precision - ideal for tech and modern brands",
  defaultParams: {
    seed: "clean-triangle-brand",
    triangleType: 0,
    heightRatio: 1.0,
    baseWidth: 1.0,
    apexOffset: 0,
    goldenRatio: 0.2,
    cornerRadius: 0,
    symmetryPerfection: 1.0,
    strokeWeight: 0,
    fillStyle: 1,
    brandHue: 210,
    brandSaturation: 0.8,
    brandLightness: 0.5,
    depth: 0.1,
    highlight: 0.15
  }
};