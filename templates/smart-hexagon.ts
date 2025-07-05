// ⬢ Smart Hexagon
import type { TemplateUtils } from '@/lib/template-utils';

const parameters = {
  hexagonStyle: {
    default: 0,
    range: [0, 4, 1]  // 0=Regular, 1=Stretched, 2=Rotated, 3=Beveled, 4=Nested
  },
  cornerRadius: {
    default: 8,
    range: [0, 30, 1]
  },
  aspectRatio: {
    default: 1.0,
    range: [0.7, 1.5, 0.05]
  },
  rotationAngle: {
    default: 0,
    range: [0, 60, 5]
  },
  edgeVariation: {
    default: 0.05,
    range: [0, 0.2, 0.01]
  },
  centerOffset: {
    default: 0,
    range: [0, 0.3, 0.02]
  },
  symmetryBreak: {
    default: 0,
    range: [0, 0.15, 0.01]
  },
  layerCount: {
    default: 1,
    range: [1, 3, 1]
  },
  layerSpacing: {
    default: 12,
    range: [5, 20, 1]
  },
  strokeStyle: {
    default: 1,
    range: [0, 4, 1]  // 0=None, 1=Clean, 2=Double, 3=Gradient, 4=Animated
  },
  strokeWeight: {
    default: 3,
    range: [1, 10, 0.5]
  },
  fillStyle: {
    default: 2,
    range: [0, 4, 1]  // 0=None, 1=Solid, 2=Linear, 3=Radial, 4=Geometric
  },
  brandHue: {
    default: 220,
    range: [0, 360, 10]
  },
  brandSaturation: {
    default: 80,
    range: [20, 100, 5]
  },
  brandLightness: {
    default: 50,
    range: [20, 80, 5]
  },
  shadowDepth: {
    default: 0,
    range: [0, 20, 1]
  },
  shadowAngle: {
    default: 45,
    range: [0, 360, 15]
  },
  glowStrength: {
    default: 0,
    range: [0, 0.3, 0.02]
  },
  patternDensity: {
    default: 0,
    range: [0, 1, 0.05]
  },
  noiseTexture: {
    default: 0,
    range: [0, 0.1, 0.01]
  }
};

const metadata = {
  id: 'smart-hexagon',
  name: "⬢ Smart Hexagon",
  description: "Modern hexagonal design with precise geometric control and professional styling",
  parameters,
  defaultParams: {
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
    brandSaturation: 80,
    brandLightness: 50,
    shadowDepth: 0,
    shadowAngle: 45,
    glowStrength: 0,
    patternDensity: 0,
    noiseTexture: 0
  }
};

function drawVisualization(ctx: CanvasRenderingContext2D, width: number, height: number, params: any, time: number, utils: TemplateUtils) {
  utils.applyUniversalBackground(ctx, width, height, params);
  
  const fillColor = params.fillColor || '#2563eb';
  const strokeColor = params.strokeColor || '#1e3a8a';
  const fillOpacity = params.fillOpacity ?? 0.8;
  const strokeOpacity = params.strokeOpacity ?? 1;
  
  // Extract all parameters
  const centerX = width / 2;
  const centerY = height / 2;
  const size = Math.min(width, height) * 0.35;
  
  // Hexagon fundamentals
  const hexagonStyleIndex = Math.round(params.hexagonStyle || 0);
  const cornerRadius = params.cornerRadius || 8;
  const aspectRatio = params.aspectRatio || 1.0;
  const rotationAngle = (params.rotationAngle || 0) * Math.PI / 180;
  
  // Professional proportions
  const edgeVariation = params.edgeVariation || 0.05;
  const centerOffset = params.centerOffset || 0;
  const symmetryBreak = params.symmetryBreak || 0;
  
  // Layers
  const layerCount = Math.round(params.layerCount || 1);
  const layerSpacing = params.layerSpacing || 12;
  
  // Brand enhancement
  const strokeStyleIndex = Math.round(params.strokeStyle || 1);
  const strokeWeight = params.strokeWeight || 3;
  const fillStyleIndex = Math.round(params.fillStyle || 2);
  
  // Color system
  const brandHue = params.brandHue || 220;
  const brandSaturation = params.brandSaturation || 80;
  const brandLightness = params.brandLightness || 50;
  
  // Effects
  const shadowDepth = params.shadowDepth || 0;
  const shadowAngle = (params.shadowAngle || 45) * Math.PI / 180;
  const glowStrength = params.glowStrength || 0;
  const patternDensity = params.patternDensity || 0;
  const noiseTexture = params.noiseTexture || 0;
  
  // Hexagon styles definition
  const hexagonStyles = [
    { name: 'Regular', stretch: 1, rotation: 0, bevel: 0, nested: false },
    { name: 'Stretched', stretch: 1.3, rotation: 0, bevel: 0, nested: false },
    { name: 'Rotated', stretch: 1, rotation: 30, bevel: 0, nested: false },
    { name: 'Beveled', stretch: 1, rotation: 0, bevel: 0.3, nested: false },
    { name: 'Nested', stretch: 1, rotation: 0, bevel: 0, nested: true }
  ];
  
  const hexagonStyle = hexagonStyles[Math.min(hexagonStyleIndex, hexagonStyles.length - 1)];

  // Helper function to create hexagon path
  function createHexagonPath(cx: number, cy: number, radius: number, options: any = {}) {
    const points = 6;
    const rotation = (options.rotation || 0) + rotationAngle + (hexagonStyle.rotation * Math.PI / 180);
    const stretch = (options.stretch || 1) * hexagonStyle.stretch * aspectRatio;
    const offset = options.offset || 0;
    const variation = options.variation || 0;
    const asymmetry = options.asymmetry || 0;
    
    const vertices = [];
    
    for (let i = 0; i < points; i++) {
      const angle = (i / points) * Math.PI * 2 + rotation;
      const radiusVariation = 1 + (Math.sin(i * 1.5 + time * 0.5) * variation);
      const asymmetricOffset = i % 2 === 0 ? asymmetry : -asymmetry;
      
      const r = radius * radiusVariation * (1 + asymmetricOffset);
      const x = cx + Math.cos(angle) * r * stretch + offset * Math.cos(angle + Math.PI / 2);
      const y = cy + Math.sin(angle) * r + offset * Math.sin(angle + Math.PI / 2);
      
      vertices.push({ x, y });
    }
    
    // Create path with optional corner radius
    ctx.beginPath();
    
    if (cornerRadius > 0 && !hexagonStyle.bevel) {
      // Rounded corners
      for (let i = 0; i < points; i++) {
        const p1 = vertices[i];
        const p2 = vertices[(i + 1) % points];
        const p0 = vertices[(i - 1 + points) % points];
        
        // Calculate control points for rounded corners
        const cp1x = p1.x + (p0.x - p1.x) * 0.2;
        const cp1y = p1.y + (p0.y - p1.y) * 0.2;
        const cp2x = p1.x + (p2.x - p1.x) * 0.2;
        const cp2y = p1.y + (p2.y - p1.y) * 0.2;
        
        if (i === 0) {
          ctx.moveTo(cp2x, cp2y);
        }
        
        ctx.lineTo(p2.x + (p1.x - p2.x) * 0.2, p2.y + (p1.y - p2.y) * 0.2);
        ctx.quadraticCurveTo(p2.x, p2.y, 
          p2.x + (vertices[(i + 2) % points].x - p2.x) * 0.2,
          p2.y + (vertices[(i + 2) % points].y - p2.y) * 0.2
        );
      }
    } else if (hexagonStyle.bevel > 0) {
      // Beveled edges
      for (let i = 0; i < points; i++) {
        const p1 = vertices[i];
        const p2 = vertices[(i + 1) % points];
        const bevelSize = hexagonStyle.bevel * 0.2;
        
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        
        if (i === 0) {
          ctx.moveTo(p1.x + dx * bevelSize, p1.y + dy * bevelSize);
        }
        
        ctx.lineTo(p2.x - dx * bevelSize, p2.y - dy * bevelSize);
        ctx.lineTo(p2.x + (vertices[(i + 2) % points].x - p2.x) * bevelSize,
                   p2.y + (vertices[(i + 2) % points].y - p2.y) * bevelSize);
      }
    } else {
      // Sharp corners
      ctx.moveTo(vertices[0].x, vertices[0].y);
      for (let i = 1; i < points; i++) {
        ctx.lineTo(vertices[i].x, vertices[i].y);
      }
    }
    
    ctx.closePath();
    
    return vertices;
  }
  
  // Draw shadow if enabled
  if (shadowDepth > 0) {
    ctx.save();
    ctx.globalAlpha = 0.2 * fillOpacity;
    
    const shadowX = Math.cos(shadowAngle) * shadowDepth;
    const shadowY = Math.sin(shadowAngle) * shadowDepth;
    
    for (let layer = layerCount - 1; layer >= 0; layer--) {
      const layerScale = 1 - (layer * layerSpacing / size) * 0.3;
      
      createHexagonPath(
        centerX + shadowX + centerOffset * size * Math.cos(time * 0.3),
        centerY + shadowY + centerOffset * size * Math.sin(time * 0.3),
        size * layerScale,
        {
          variation: edgeVariation,
          asymmetry: symmetryBreak,
          offset: centerOffset * size
        }
      );
      
      ctx.fillStyle = '#000000';
      ctx.fill();
    }
    
    ctx.restore();
  }
  
  // Draw glow effect if enabled
  if (glowStrength > 0) {
    ctx.save();
    ctx.globalAlpha = glowStrength * fillOpacity;
    
    const glowGradient = ctx.createRadialGradient(
      centerX, centerY, size * 0.8,
      centerX, centerY, size * 1.5
    );
    glowGradient.addColorStop(0, `hsla(${brandHue}, ${brandSaturation}%, ${brandLightness + 20}%, ${glowStrength})`);
    glowGradient.addColorStop(0.5, `hsla(${brandHue}, ${brandSaturation}%, ${brandLightness + 10}%, ${glowStrength * 0.5})`);
    glowGradient.addColorStop(1, `hsla(${brandHue}, ${brandSaturation}%, ${brandLightness}%, 0)`);
    
    ctx.fillStyle = glowGradient;
    ctx.fillRect(0, 0, width, height);
    
    ctx.restore();
  }
  
  // Draw main hexagon layers
  for (let layer = layerCount - 1; layer >= 0; layer--) {
    ctx.save();
    
    const layerScale = 1 - (layer * layerSpacing / size) * 0.3;
    const layerAlpha = 1 - layer * 0.2;
    
    // Create hexagon path
    const vertices = createHexagonPath(
      centerX + centerOffset * size * Math.cos(time * 0.3),
      centerY + centerOffset * size * Math.sin(time * 0.3),
      size * layerScale,
      {
        variation: edgeVariation,
        asymmetry: symmetryBreak,
        offset: centerOffset * size
      }
    );
    
    // Apply fill based on fillStyle
    if (fillStyleIndex > 0 && params.fillType !== 'none') {
      ctx.save();
      ctx.globalAlpha = fillOpacity * layerAlpha;
      
      switch (fillStyleIndex) {
        case 1: // Solid
          ctx.fillStyle = fillColor;
          break;
          
        case 2: // Linear gradient
          const linearGradient = ctx.createLinearGradient(
            centerX - size, centerY - size,
            centerX + size, centerY + size
          );
          linearGradient.addColorStop(0, `hsl(${brandHue}, ${brandSaturation}%, ${brandLightness + 10}%)`);
          linearGradient.addColorStop(0.5, `hsl(${brandHue}, ${brandSaturation}%, ${brandLightness}%)`);
          linearGradient.addColorStop(1, `hsl(${brandHue}, ${brandSaturation}%, ${brandLightness - 10}%)`);
          ctx.fillStyle = linearGradient;
          break;
          
        case 3: // Radial gradient
          const radialGradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, size * layerScale
          );
          radialGradient.addColorStop(0, `hsl(${brandHue}, ${brandSaturation}%, ${brandLightness + 20}%)`);
          radialGradient.addColorStop(0.7, `hsl(${brandHue}, ${brandSaturation}%, ${brandLightness}%)`);
          radialGradient.addColorStop(1, `hsl(${brandHue}, ${brandSaturation}%, ${brandLightness - 15}%)`);
          ctx.fillStyle = radialGradient;
          break;
          
        case 4: // Geometric pattern
          const patternCanvas = document.createElement('canvas');
          patternCanvas.width = 20;
          patternCanvas.height = 20;
          const patternCtx = patternCanvas.getContext('2d')!;
          
          patternCtx.fillStyle = `hsl(${brandHue}, ${brandSaturation}%, ${brandLightness}%)`;
          patternCtx.fillRect(0, 0, 20, 20);
          
          if (patternDensity > 0) {
            patternCtx.strokeStyle = `hsl(${brandHue}, ${brandSaturation}%, ${brandLightness - 10}%)`;
            patternCtx.lineWidth = 1;
            patternCtx.beginPath();
            patternCtx.moveTo(0, 0);
            patternCtx.lineTo(20, 20);
            patternCtx.moveTo(20, 0);
            patternCtx.lineTo(0, 20);
            patternCtx.stroke();
          }
          
          const pattern = ctx.createPattern(patternCanvas, 'repeat')!;
          ctx.fillStyle = pattern;
          break;
      }
      
      ctx.fill();
      
      // Add noise texture if enabled
      if (noiseTexture > 0) {
        ctx.globalAlpha = noiseTexture * fillOpacity * layerAlpha;
        
        // Create noise by drawing many small dots
        for (let i = 0; i < 500 * noiseTexture; i++) {
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * size * layerScale;
          const x = centerX + Math.cos(angle) * distance;
          const y = centerY + Math.sin(angle) * distance;
          
          // Check if point is inside hexagon (simplified)
          if (ctx.isPointInPath(x, y)) {
            ctx.fillStyle = Math.random() > 0.5 
              ? `hsla(${brandHue}, ${brandSaturation}%, ${brandLightness + 10}%, ${noiseTexture * 0.5})`
              : `hsla(${brandHue}, ${brandSaturation}%, ${brandLightness - 10}%, ${noiseTexture * 0.5})`;
            ctx.fillRect(x, y, 1, 1);
          }
        }
      }
      
      ctx.restore();
    }
    
    // Apply stroke based on strokeStyle
    if (strokeStyleIndex > 0 && params.strokeType !== 'none') {
      ctx.save();
      ctx.globalAlpha = strokeOpacity * layerAlpha;
      
      ctx.lineWidth = strokeWeight || params.strokeWidth || 3;
      
      if (params.strokeType === 'dashed') {
        ctx.setLineDash([10, 5]);
      } else if (params.strokeType === 'dotted') {
        ctx.setLineDash([2, 3]);
      }
      
      switch (strokeStyleIndex) {
        case 1: // Clean
          ctx.strokeStyle = strokeColor;
          ctx.stroke();
          break;
          
        case 2: // Double
          ctx.strokeStyle = strokeColor;
          ctx.stroke();
          
          // Inner stroke
          ctx.save();
          ctx.scale(0.9, 0.9);
          ctx.translate(centerX * 0.1, centerY * 0.1);
          createHexagonPath(
            centerX * 0.9 + centerOffset * size * Math.cos(time * 0.3) * 0.9,
            centerY * 0.9 + centerOffset * size * Math.sin(time * 0.3) * 0.9,
            size * layerScale * 0.9,
            {
              variation: edgeVariation,
              asymmetry: symmetryBreak,
              offset: centerOffset * size * 0.9
            }
          );
          ctx.strokeStyle = `hsla(${brandHue}, ${brandSaturation}%, ${brandLightness - 20}%, 0.5)`;
          ctx.lineWidth = strokeWeight * 0.5;
          ctx.stroke();
          ctx.restore();
          break;
          
        case 3: // Gradient
          const strokeGradient = ctx.createLinearGradient(
            centerX - size, centerY - size,
            centerX + size, centerY + size
          );
          strokeGradient.addColorStop(0, `hsl(${brandHue}, ${brandSaturation}%, ${brandLightness - 10}%)`);
          strokeGradient.addColorStop(0.5, strokeColor);
          strokeGradient.addColorStop(1, `hsl(${brandHue}, ${brandSaturation}%, ${brandLightness - 30}%)`);
          ctx.strokeStyle = strokeGradient;
          ctx.stroke();
          break;
          
        case 4: // Animated
          const animPhase = time * 2;
          const dashOffset = animPhase * 10 % 20;
          ctx.setLineDash([10, 10]);
          ctx.lineDashOffset = dashOffset;
          
          const animGradient = ctx.createLinearGradient(
            centerX + Math.cos(animPhase) * size,
            centerY + Math.sin(animPhase) * size,
            centerX - Math.cos(animPhase) * size,
            centerY - Math.sin(animPhase) * size
          );
          animGradient.addColorStop(0, `hsla(${brandHue}, ${brandSaturation}%, ${brandLightness}%, 0.2)`);
          animGradient.addColorStop(0.5, strokeColor);
          animGradient.addColorStop(1, `hsla(${brandHue}, ${brandSaturation}%, ${brandLightness}%, 0.2)`);
          
          ctx.strokeStyle = animGradient;
          ctx.stroke();
          ctx.setLineDash([]);
          break;
      }
      
      ctx.restore();
    }
    
    // Add pattern overlay if enabled
    if (patternDensity > 0 && layer === 0) {
      ctx.save();
      ctx.globalAlpha = patternDensity * 0.2 * fillOpacity;
      
      // Create internal pattern
      const internalLines = 6;
      for (let i = 0; i < internalLines; i++) {
        const angle = (i / internalLines) * Math.PI;
        const x1 = centerX + Math.cos(angle) * size * layerScale;
        const y1 = centerY + Math.sin(angle) * size * layerScale;
        const x2 = centerX - Math.cos(angle) * size * layerScale;
        const y2 = centerY - Math.sin(angle) * size * layerScale;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `hsla(${brandHue}, ${brandSaturation}%, ${brandLightness - 20}%, ${patternDensity * 0.3})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      
      ctx.restore();
    }
    
    // Add nested details for nested style
    if (hexagonStyle.nested && layer === 0) {
      ctx.save();
      ctx.globalAlpha = fillOpacity * 0.5;
      
      // Inner hexagon
      createHexagonPath(
        centerX + centerOffset * size * Math.cos(time * 0.3) * 0.5,
        centerY + centerOffset * size * Math.sin(time * 0.3) * 0.5,
        size * 0.4,
        {
          variation: edgeVariation * 0.5,
          asymmetry: symmetryBreak * 0.5,
          offset: 0
        }
      );
      
      if (fillStyleIndex === 2) {
        const innerGradient = ctx.createLinearGradient(
          centerX - size * 0.4, centerY - size * 0.4,
          centerX + size * 0.4, centerY + size * 0.4
        );
        innerGradient.addColorStop(0, `hsl(${brandHue + 20}, ${brandSaturation}%, ${brandLightness + 15}%)`);
        innerGradient.addColorStop(1, `hsl(${brandHue + 20}, ${brandSaturation}%, ${brandLightness - 5}%)`);
        ctx.fillStyle = innerGradient;
      } else {
        ctx.fillStyle = `hsl(${brandHue + 20}, ${brandSaturation}%, ${brandLightness}%)`;
      }
      
      ctx.fill();
      
      if (strokeStyleIndex > 0) {
        ctx.strokeStyle = `hsl(${brandHue}, ${brandSaturation}%, ${brandLightness - 20}%)`;
        ctx.lineWidth = strokeWeight * 0.7;
        ctx.stroke();
      }
      
      ctx.restore();
    }
    
    ctx.restore();
  }
}

export { parameters, metadata, drawVisualization };