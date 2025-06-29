import type { ParameterDefinition, PresetMetadata } from './types';

// Border Effects - Advanced border styling and treatments
export const parameters: Record<string, ParameterDefinition> = {
  // Basic form
  frequency: { type: 'slider', min: 0.1, max: 2, step: 0.1, default: 0.6, label: 'Form Energy' },
  amplitude: { type: 'slider', min: 60, max: 180, step: 5, default: 120, label: 'Scale' },
  complexity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.4, label: 'Form Complexity' },
  
  // Border core properties
  borderWidth: { type: 'slider', min: 1, max: 20, step: 1, default: 4, label: 'Border Width' },
  borderStyle: {
    type: 'slider',
    min: 0,
    max: 7,
    step: 1,
    default: 0,
    label: 'Border Style (0=Solid, 1=Dashed, 2=Dotted, 3=Double, 4=Groove, 5=Ridge, 6=Inset, 7=Outset)'
  },
  
  // Corner treatments
  cornerRadius: { type: 'slider', min: 0, max: 50, step: 2, default: 8, label: 'Corner Radius' },
  cornerStyle: {
    type: 'slider',
    min: 0,
    max: 3,
    step: 1,
    default: 0,
    label: 'Corner Style (0=Rounded, 1=Chamfered, 2=Notched, 3=Organic)'
  },
  
  // Border effects
  borderGlow: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.3, label: 'Border Glow' },
  borderShadow: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.4, label: 'Border Shadow' },
  borderGradient: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.5, label: 'Border Gradient' },
  
  // Multi-border system
  borderLayers: { type: 'slider', min: 1, max: 4, step: 1, default: 1, label: 'Border Layers' },
  layerSpacing: { type: 'slider', min: 2, max: 15, step: 1, default: 6, label: 'Layer Spacing' },
  
  // Animation
  borderPulse: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.2, label: 'Border Pulse' },
  borderFlow: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.3, label: 'Border Flow Animation' },
  
  // Color sophistication
  borderHue: { type: 'slider', min: 0, max: 360, step: 10, default: 200, label: 'Border Hue' },
  borderSaturation: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.7, label: 'Border Saturation' },
  borderContrast: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.8, label: 'Border Contrast' }
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
  const frequency = params.frequency || 0.6;
  const amplitude = params.amplitude || 120;
  const complexity = params.complexity || 0.4;
  
  const borderWidth = params.borderWidth || 4;
  const borderStyleNum = Math.round(params.borderStyle || 0);
  const cornerRadius = params.cornerRadius || 8;
  const cornerStyleNum = Math.round(params.cornerStyle || 0);
  
  const borderGlow = params.borderGlow || 0.3;
  const borderShadow = params.borderShadow || 0.4;
  const borderGradient = params.borderGradient || 0.5;
  
  const borderLayers = Math.round(params.borderLayers || 1);
  const layerSpacing = params.layerSpacing || 6;
  const borderPulse = params.borderPulse || 0.2;
  const borderFlow = params.borderFlow || 0.3;
  
  const borderHue = params.borderHue || 200;
  const borderSaturation = params.borderSaturation || 0.7;
  const borderContrast = params.borderContrast || 0.8;

  // Generate base form
  const baseScale = Math.min(width, height) / 300;
  const scaledAmplitude = amplitude * baseScale;
  const pulse = 1 + Math.sin(time * frequency) * borderPulse * 0.1;
  
  const points = generateBorderForm(
    centerX, centerY, scaledAmplitude * pulse, 
    complexity, time, frequency
  );

  // Generate color palette for borders
  const borderColors = generateBorderColors(borderHue, borderSaturation, borderContrast, time);

  // Apply border shadow first (behind everything)
  if (borderShadow > 0.1) {
    renderBorderShadow(ctx, points, borderShadow, borderWidth, cornerRadius, cornerStyleNum);
  }

  // Apply border glow (behind borders)
  if (borderGlow > 0.1) {
    renderBorderGlow(ctx, points, borderGlow, borderWidth, borderColors.glow, cornerRadius, cornerStyleNum);
  }

  // Render multiple border layers
  for (let layer = borderLayers - 1; layer >= 0; layer--) {
    const layerOffset = layer * layerSpacing;
    const layerAlpha = 1 - (layer * 0.2);
    renderBorderLayer(
      ctx, points, borderWidth, borderStyleNum, borderGradient,
      borderColors, layerOffset, layerAlpha, cornerRadius, cornerStyleNum,
      borderFlow, time, layer
    );
  }

  function generateBorderForm(centerX: number, centerY: number, radius: number, complexity: number, time: number, frequency: number) {
    const points = [];
    const numPoints = Math.floor(8 + complexity * 8); // 8-16 points
    
    for (let i = 0; i < numPoints; i++) {
      const t = i / numPoints;
      const angle = t * Math.PI * 2;
      
      // Layer harmonics for interesting shapes
      const harmonic1 = Math.sin(angle * 3 + time * frequency) * complexity * 0.15;
      const harmonic2 = Math.sin(angle * 5 + time * frequency * 1.2) * complexity * 0.08;
      const harmonic3 = Math.cos(angle * 7 + time * frequency * 0.8) * complexity * 0.04;
      
      const finalRadius = radius * (1 + harmonic1 + harmonic2 + harmonic3);
      
      points.push({
        x: centerX + Math.cos(angle) * finalRadius,
        y: centerY + Math.sin(angle) * finalRadius,
        angle: angle,
        t: t,
        radius: finalRadius
      });
    }
    
    return points;
  }

  function generateBorderColors(hue: number, saturation: number, contrast: number, time: number) {
    const animatedHue = (hue + time * 5) % 360; // Slow hue rotation
    const sat = saturation * 100;
    const lightBase = 50;
    const contrastRange = contrast * 30;
    
    return {
      primary: `hsl(${animatedHue}, ${sat}%, ${lightBase}%)`,
      secondary: `hsl(${(animatedHue + 30) % 360}, ${sat}%, ${lightBase + contrastRange}%)`,
      accent: `hsl(${(animatedHue - 30 + 360) % 360}, ${sat}%, ${lightBase - contrastRange}%)`,
      glow: `hsl(${animatedHue}, ${sat * 1.2}%, ${lightBase + contrastRange * 1.5}%)`
    };
  }

  function renderBorderShadow(ctx: CanvasRenderingContext2D, points: any[], shadowStrength: number, borderWidth: number, cornerRadius: number, cornerStyle: number) {
    ctx.save();
    ctx.globalAlpha = shadowStrength * 0.4;
    ctx.fillStyle = '#000000';
    
    // Offset for shadow depth
    ctx.translate(borderWidth * 0.5, borderWidth * 0.5);
    
    // Blur effect
    ctx.filter = 'blur(3px)';
    
    drawBorderPath(ctx, points, 0, cornerRadius, cornerStyle);
    ctx.fill();
    
    ctx.restore();
  }

  function renderBorderGlow(ctx: CanvasRenderingContext2D, points: any[], glowStrength: number, borderWidth: number, glowColor: string, cornerRadius: number, cornerStyle: number) {
    ctx.save();
    ctx.globalAlpha = glowStrength * 0.6;
    ctx.strokeStyle = glowColor;
    ctx.lineWidth = borderWidth * 3;
    ctx.filter = 'blur(6px)';
    
    drawBorderPath(ctx, points, 0, cornerRadius, cornerStyle);
    ctx.stroke();
    
    ctx.restore();
  }

  function renderBorderLayer(ctx: CanvasRenderingContext2D, points: any[], borderWidth: number, borderStyle: number, gradientStrength: number, colors: any, offset: number, alpha: number, cornerRadius: number, cornerStyle: number, flow: number, time: number, layer: number) {
    ctx.save();
    ctx.globalAlpha = alpha;
    
    // Create border gradient if enabled
    let strokeStyle = colors.primary;
    if (gradientStrength > 0.1) {
      const bounds = getBounds(points);
      const gradient = ctx.createLinearGradient(
        bounds.minX, bounds.minY, 
        bounds.maxX, bounds.maxY
      );
      
      gradient.addColorStop(0, colors.primary);
      gradient.addColorStop(0.5, colors.secondary);
      gradient.addColorStop(1, colors.accent);
      
      strokeStyle = gradient;
    }
    
    // Apply border style
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = borderWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    switch (borderStyle) {
      case 0: // Solid
        drawSolidBorder(ctx, points, offset, cornerRadius, cornerStyle);
        break;
      case 1: // Dashed
        drawDashedBorder(ctx, points, borderWidth, offset, cornerRadius, cornerStyle);
        break;
      case 2: // Dotted
        drawDottedBorder(ctx, points, borderWidth, offset, cornerRadius, cornerStyle);
        break;
      case 3: // Double
        drawDoubleBorder(ctx, points, borderWidth, offset, cornerRadius, cornerStyle);
        break;
      case 4: // Groove
        drawGrooveBorder(ctx, points, borderWidth, colors, offset, cornerRadius, cornerStyle);
        break;
      case 5: // Ridge
        drawRidgeBorder(ctx, points, borderWidth, colors, offset, cornerRadius, cornerStyle);
        break;
      case 6: // Inset
        drawInsetBorder(ctx, points, borderWidth, colors, offset, cornerRadius, cornerStyle);
        break;
      case 7: // Outset
        drawOutsetBorder(ctx, points, borderWidth, colors, offset, cornerRadius, cornerStyle);
        break;
    }
    
    // Apply flow animation
    if (flow > 0.1 && borderStyle <= 2) {
      drawFlowAnimation(ctx, points, borderWidth, flow, time + layer, colors.glow, offset, cornerRadius, cornerStyle);
    }
    
    ctx.restore();
  }

  function drawBorderPath(ctx: CanvasRenderingContext2D, points: any[], offset: number, cornerRadius: number, cornerStyle: number) {
    if (points.length < 3) return;
    
    ctx.beginPath();
    
    // Apply corner style
    switch (cornerStyle) {
      case 0: // Rounded
        drawRoundedPath(ctx, points, cornerRadius, offset);
        break;
      case 1: // Chamfered
        drawChamferedPath(ctx, points, cornerRadius, offset);
        break;
      case 2: // Notched
        drawNotchedPath(ctx, points, cornerRadius, offset);
        break;
      case 3: // Organic
        drawOrganicPath(ctx, points, cornerRadius, offset);
        break;
    }
    
    ctx.closePath();
  }

  function drawRoundedPath(ctx: CanvasRenderingContext2D, points: any[], radius: number, offset: number) {
    const adjustedPoints = points.map(p => ({
      x: p.x + (p.x < width/2 ? -offset : offset),
      y: p.y + (p.y < height/2 ? -offset : offset)
    }));
    
    ctx.moveTo(adjustedPoints[0].x, adjustedPoints[0].y);
    
    for (let i = 1; i < adjustedPoints.length; i++) {
      const current = adjustedPoints[i];
      const previous = adjustedPoints[i - 1];
      const next = adjustedPoints[(i + 1) % adjustedPoints.length];
      
      const cornerRadius = Math.min(radius, 
        Math.sqrt(Math.pow(current.x - previous.x, 2) + Math.pow(current.y - previous.y, 2)) / 3,
        Math.sqrt(Math.pow(next.x - current.x, 2) + Math.pow(next.y - current.y, 2)) / 3
      );
      
      if (cornerRadius > 1) {
        const cp1x = previous.x + (current.x - previous.x) * 0.7;
        const cp1y = previous.y + (current.y - previous.y) * 0.7;
        const cp2x = current.x + (next.x - current.x) * 0.3;
        const cp2y = current.y + (next.y - current.y) * 0.3;
        
        ctx.quadraticCurveTo(cp1x, cp1y, cp2x, cp2y);
      } else {
        ctx.lineTo(current.x, current.y);
      }
    }
  }

  function drawChamferedPath(ctx: CanvasRenderingContext2D, points: any[], chamfer: number, offset: number) {
    const adjustedPoints = points.map(p => ({
      x: p.x + (p.x < width/2 ? -offset : offset),
      y: p.y + (p.y < height/2 ? -offset : offset)
    }));
    
    ctx.moveTo(adjustedPoints[0].x, adjustedPoints[0].y);
    
    for (let i = 1; i < adjustedPoints.length; i++) {
      const current = adjustedPoints[i];
      const previous = adjustedPoints[i - 1];
      
      // Simple chamfer by cutting corners
      const dx = current.x - previous.x;
      const dy = current.y - previous.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const chamferDist = Math.min(chamfer, dist * 0.3);
      
      if (chamferDist > 1) {
        const cutX = previous.x + (dx / dist) * (dist - chamferDist);
        const cutY = previous.y + (dy / dist) * (dist - chamferDist);
        ctx.lineTo(cutX, cutY);
        
        const startX = current.x - (dx / dist) * chamferDist;
        const startY = current.y - (dy / dist) * chamferDist;
        ctx.lineTo(startX, startY);
      }
      
      ctx.lineTo(current.x, current.y);
    }
  }

  function drawNotchedPath(ctx: CanvasRenderingContext2D, points: any[], notchSize: number, offset: number) {
    const adjustedPoints = points.map(p => ({
      x: p.x + (p.x < width/2 ? -offset : offset),
      y: p.y + (p.y < height/2 ? -offset : offset)
    }));
    
    ctx.moveTo(adjustedPoints[0].x, adjustedPoints[0].y);
    
    for (let i = 1; i < adjustedPoints.length; i++) {
      const current = adjustedPoints[i];
      const previous = adjustedPoints[i - 1];
      
      // Add small notch at each corner
      const dx = current.x - previous.x;
      const dy = current.y - previous.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist > notchSize * 2) {
        const midX = previous.x + dx * 0.5;
        const midY = previous.y + dy * 0.5;
        const notchX = midX + (dy / dist) * notchSize * 0.5;
        const notchY = midY - (dx / dist) * notchSize * 0.5;
        
        ctx.lineTo(midX - (dx / dist) * notchSize, midY - (dy / dist) * notchSize);
        ctx.lineTo(notchX, notchY);
        ctx.lineTo(midX + (dx / dist) * notchSize, midY + (dy / dist) * notchSize);
      }
      
      ctx.lineTo(current.x, current.y);
    }
  }

  function drawOrganicPath(ctx: CanvasRenderingContext2D, points: any[], variation: number, offset: number) {
    const adjustedPoints = points.map(p => ({
      x: p.x + (p.x < width/2 ? -offset : offset),
      y: p.y + (p.y < height/2 ? -offset : offset)
    }));
    
    ctx.moveTo(adjustedPoints[0].x, adjustedPoints[0].y);
    
    for (let i = 1; i < adjustedPoints.length; i++) {
      const current = adjustedPoints[i];
      const previous = adjustedPoints[i - 1];
      const next = adjustedPoints[(i + 1) % adjustedPoints.length];
      
      // Organic curves with natural variation
      const tension = 0.8 + Math.sin(current.x + current.y) * variation * 0.2;
      const cp1x = previous.x + (current.x - (adjustedPoints[i - 2] || previous).x) * tension * 0.2;
      const cp1y = previous.y + (current.y - (adjustedPoints[i - 2] || previous).y) * tension * 0.2;
      const cp2x = current.x - (next.x - previous.x) * tension * 0.2;
      const cp2y = current.y - (next.y - previous.y) * tension * 0.2;
      
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, current.x, current.y);
    }
  }

  function drawSolidBorder(ctx: CanvasRenderingContext2D, points: any[], offset: number, cornerRadius: number, cornerStyle: number) {
    drawBorderPath(ctx, points, offset, cornerRadius, cornerStyle);
    ctx.stroke();
  }

  function drawDashedBorder(ctx: CanvasRenderingContext2D, points: any[], borderWidth: number, offset: number, cornerRadius: number, cornerStyle: number) {
    const dashPattern = [borderWidth * 2, borderWidth];
    ctx.setLineDash(dashPattern);
    drawBorderPath(ctx, points, offset, cornerRadius, cornerStyle);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function drawDottedBorder(ctx: CanvasRenderingContext2D, points: any[], borderWidth: number, offset: number, cornerRadius: number, cornerStyle: number) {
    const dotPattern = [borderWidth * 0.5, borderWidth];
    ctx.setLineDash(dotPattern);
    ctx.lineCap = 'round';
    drawBorderPath(ctx, points, offset, cornerRadius, cornerStyle);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function drawDoubleBorder(ctx: CanvasRenderingContext2D, points: any[], borderWidth: number, offset: number, cornerRadius: number, cornerStyle: number) {
    // Outer border
    ctx.lineWidth = borderWidth * 0.4;
    drawBorderPath(ctx, points, offset, cornerRadius, cornerStyle);
    ctx.stroke();
    
    // Inner border
    ctx.lineWidth = borderWidth * 0.4;
    drawBorderPath(ctx, points, offset + borderWidth, cornerRadius * 0.7, cornerStyle);
    ctx.stroke();
  }

  function drawGrooveBorder(ctx: CanvasRenderingContext2D, points: any[], borderWidth: number, colors: any, offset: number, cornerRadius: number, cornerStyle: number) {
    // Dark outer
    ctx.strokeStyle = colors.accent;
    ctx.lineWidth = borderWidth * 0.5;
    drawBorderPath(ctx, points, offset, cornerRadius, cornerStyle);
    ctx.stroke();
    
    // Light inner
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = borderWidth * 0.5;
    drawBorderPath(ctx, points, offset + borderWidth * 0.3, cornerRadius * 0.8, cornerStyle);
    ctx.stroke();
  }

  function drawRidgeBorder(ctx: CanvasRenderingContext2D, points: any[], borderWidth: number, colors: any, offset: number, cornerRadius: number, cornerStyle: number) {
    // Light outer
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = borderWidth * 0.5;
    drawBorderPath(ctx, points, offset, cornerRadius, cornerStyle);
    ctx.stroke();
    
    // Dark inner
    ctx.strokeStyle = colors.accent;
    ctx.lineWidth = borderWidth * 0.5;
    drawBorderPath(ctx, points, offset + borderWidth * 0.3, cornerRadius * 0.8, cornerStyle);
    ctx.stroke();
  }

  function drawInsetBorder(ctx: CanvasRenderingContext2D, points: any[], borderWidth: number, colors: any, offset: number, cornerRadius: number, cornerStyle: number) {
    ctx.strokeStyle = colors.accent; // Darker for inset effect
    drawBorderPath(ctx, points, offset, cornerRadius, cornerStyle);
    ctx.stroke();
  }

  function drawOutsetBorder(ctx: CanvasRenderingContext2D, points: any[], borderWidth: number, colors: any, offset: number, cornerRadius: number, cornerStyle: number) {
    ctx.strokeStyle = colors.secondary; // Lighter for outset effect
    drawBorderPath(ctx, points, offset, cornerRadius, cornerStyle);
    ctx.stroke();
  }

  function drawFlowAnimation(ctx: CanvasRenderingContext2D, points: any[], borderWidth: number, flow: number, time: number, color: string, offset: number, cornerRadius: number, cornerStyle: number) {
    ctx.save();
    ctx.globalAlpha = flow * 0.6;
    ctx.strokeStyle = color;
    ctx.lineWidth = borderWidth * 0.3;
    
    // Animated dash offset for flow effect
    const dashOffset = (time * 50) % 20;
    ctx.setLineDash([10, 10]);
    ctx.lineDashOffset = dashOffset;
    
    drawBorderPath(ctx, points, offset, cornerRadius, cornerStyle);
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
}

export const metadata: PresetMetadata = {
  name: "🔲 Border Effects",
  description: "Advanced border styling with multiple layers, corner treatments, shadows, glows, and animations",
  defaultParams: {
    seed: "border-effects",
    frequency: 0.6,
    amplitude: 120,
    complexity: 0.4,
    borderWidth: 4,
    borderStyle: 0,
    cornerRadius: 8,
    cornerStyle: 0,
    borderGlow: 0.3,
    borderShadow: 0.4,
    borderGradient: 0.5,
    borderLayers: 1,
    layerSpacing: 6,
    borderPulse: 0.2,
    borderFlow: 0.3,
    borderHue: 200,
    borderSaturation: 0.7,
    borderContrast: 0.8
  }
};