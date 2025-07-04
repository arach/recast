// ▲ Clean Triangle
import type { TemplateUtils } from '@/lib/template-utils';

const parameters = {
  triangleType: {
    default: 0,
    range: [0, 4, 1]
  },
  heightRatio: {
    default: 1.0,
    range: [0.6, 1.8, 0.05]
  },
  baseWidth: {
    default: 1.0,
    range: [0.7, 1.5, 0.05]
  },
  apexOffset: {
    default: 0,
    range: [-0.3, 0.3, 0.05]
  },
  goldenRatio: {
    default: 0.2,
    range: [0, 1, 0.05]
  },
  cornerRadius: {
    default: 0,
    range: [0, 20, 1]
  },
  symmetryPerfection: {
    default: 1.0,
    range: [0.8, 1, 0.01]
  },
  fillStyle: {
    default: 'solid',
    options: ['none', 'solid', 'gradient', 'texture']
  },
  colorIntensity: {
    default: 0.8,
    range: [0.5, 1, 0.05]
  },
  depth: {
    default: 0.1,
    range: [0, 0.5, 0.05]
  },
  highlight: {
    default: 0.15,
    range: [0, 0.4, 0.05]
  }
};

const metadata = {
  id: 'clean-triangle',
  name: "▲ Clean Triangle",
  description: "Perfect geometric triangles with mathematical precision and brand-aware styling",
  parameters,
  defaultParams: {
    triangleType: 0,
    heightRatio: 1.0,
    baseWidth: 1.0,
    apexOffset: 0,
    goldenRatio: 0.2,
    cornerRadius: 0,
    symmetryPerfection: 1.0,
    fillStyle: 'solid',
    colorIntensity: 0.8,
    depth: 0.1,
    highlight: 0.15
  }
};

function drawVisualization(ctx: CanvasRenderingContext2D, width: number, height: number, params: any, time: number, utils: TemplateUtils) {
  // Universal background handling
  utils.applyUniversalBackground(ctx, width, height, params);
  
  // Access universal properties via utils
  const fillColor = params.fillColor || '#3b82f6';
  const strokeColor = params.strokeColor || '#1e40af';
  const fillOpacity = params.fillOpacity ?? 1;
  const strokeOpacity = params.strokeOpacity ?? 1;

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
  const fillStyle = params.fillStyle || 'solid';
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
  renderCleanTriangle(ctx, trianglePoints, brandColors, fillStyle, cornerRadius, centerX, centerY, logoSize, params, utils);

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

  function createBrandColors(fillColor: string, strokeColor: string, intensity: number) {
    // Helper to convert hex to HSL
    const hexToHsl = (hex: string) => {
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

  function renderCleanTriangle(ctx: CanvasRenderingContext2D, points: any[], colors: any, fillStyle: string, cornerRadius: number, centerX: number, centerY: number, size: number, params: any, utils: TemplateUtils) {
    ctx.save();
    
    // Draw the triangle path
    if (cornerRadius > 0) {
      drawRoundedTriangle(ctx, points, cornerRadius);
    } else {
      drawSharpTriangle(ctx, points);
    }
    
    // Apply fill based on fillStyle
    if (fillStyle !== 'none') {
      if (fillStyle === 'solid') {
        ctx.fillStyle = fillColor;
        ctx.globalAlpha = fillOpacity;
        ctx.fill();
      } else if (fillStyle === 'gradient') {
        const gradient = ctx.createLinearGradient(
          centerX - size/2, centerY - size/2,
          centerX + size/2, centerY + size/2
        );
        gradient.addColorStop(0, colors.secondary);
        gradient.addColorStop(1, colors.primary);
        
        ctx.fillStyle = gradient;
        ctx.globalAlpha = fillOpacity;
        ctx.fill();
      } else if (fillStyle === 'texture') {
        // Minimal texture for sophistication
        ctx.fillStyle = colors.primary;
        ctx.globalAlpha = fillOpacity;
        ctx.fill();
        
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
    
    // Apply universal stroke if specified
    if (params.strokeType !== 'none') {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = params.strokeWidth || 2;
      ctx.globalAlpha = strokeOpacity;
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
      
      ctx.stroke();
    }
    
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

export { parameters, metadata, drawVisualization };