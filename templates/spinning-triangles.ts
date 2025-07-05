// 🔺 Spinning Triangles
import type { TemplateUtils } from '@reflow/template-utils';

const parameters = {
  frequency: {
    default: 3,
    range: [0.1, 10, 0.1]
  },
  amplitude: {
    default: 40,
    range: [10, 100, 5]
  },
  complexity: {
    default: 0.4,
    range: [0, 1, 0.01]
  },
  chaos: {
    default: 0.2,
    range: [0, 1, 0.01]
  },
  damping: {
    default: 0.85,
    range: [0.5, 1, 0.01]
  },
  layers: {
    default: 3,
    range: [1, 8, 1]
  },
  sides: {
    default: 3,
    range: [3, 12, 1]
  },
  rotation: {
    default: 0,
    range: [0, 360, 15]
  }
};

const metadata = {
  id: 'spinning-triangles',
  name: "🔺 Spinning Triangles",
  description: "Geometric triangular patterns with orbital motion and constellation effects",
  parameters,
  defaultParams: {
    frequency: 3,
    amplitude: 40,
    complexity: 0.4,
    chaos: 0.2,
    damping: 0.85,
    layers: 3,
    sides: 3,
    rotation: 0
  }
};

function drawVisualization(ctx: CanvasRenderingContext2D, width: number, height: number, params: any, time: number, utils: TemplateUtils) {
  utils.applyUniversalBackground(ctx, width, height, params);

  // Access universal properties
  const fillColor = params.fillColor || '#4080ff';
  const strokeColor = params.strokeColor || '#80c0ff';
  const fillOpacity = params.fillOpacity ?? 0.3;
  const strokeOpacity = params.strokeOpacity ?? 1;

  // Direct triangle generation without external requires
  const centerX = width / 2;
  const centerY = height / 2;
  const layers = params.layers || 3;
  const frequency = params.frequency || 3;
  const amplitude = params.amplitude || 40;
  const complexity = params.complexity || 0.4;
  const chaos = params.chaos || 0.2;
  const damping = params.damping || 0.85;
  const sides = params.sides || 3;
  const baseRotation = params.rotation || 0;

  // Simple seeded random function
  let seed = 1;
  const seedStr = params.seed || 'triangle';
  for (let i = 0; i < seedStr.length; i++) {
    seed = ((seed << 5) - seed) + seedStr.charCodeAt(i);
    seed = seed & seed;
  }
  
  function seededRandom() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  // Generate triangle layers
  for (let layer = 0; layer < layers; layer++) {
    const layerPhase = (layer / layers) * frequency * Math.PI * 2 + time;
    const layerSize = (amplitude * Math.min(width, height) / 400) * Math.pow(damping, layer);
    const layerRotation = baseRotation + (layerPhase * 180 / Math.PI);
    
    // Add chaos to position and rotation
    const chaosX = (seededRandom() - 0.5) * layerSize * chaos * 0.4;
    const chaosY = (seededRandom() - 0.5) * layerSize * chaos * 0.4;
    const chaosRotation = (seededRandom() - 0.5) * 90 * chaos;
    
    // Calculate final position
    const finalX = Math.max(layerSize, Math.min(width - layerSize, centerX + chaosX));
    const finalY = Math.max(layerSize, Math.min(height - layerSize, centerY + chaosY));
    
    // Color based on layer and time
    const hue = (layer / layers) * 120 + time * 20 + 240; // Blue to green spectrum
    const saturation = 70 - (layer * 5);
    const lightness = 45 + Math.sin(layerPhase) * 15;
    
    // Create triangle path
    const rotationRad = ((layerRotation + chaosRotation) * Math.PI) / 180;
    const angleStep = (Math.PI * 2) / sides;
    
    ctx.save();
    
    // Draw filled triangle
    if (params.fillType !== 'none') {
      ctx.globalAlpha = (0.8 - (layer * 0.1)) * fillOpacity;
      if (params.fillType === 'gradient') {
        const gradient = ctx.createLinearGradient(
          finalX - layerSize, finalY - layerSize,
          finalX + layerSize, finalY + layerSize
        );
        gradient.addColorStop(0, params.fillGradientStart || `hsl(${hue}, ${saturation}%, ${lightness + 20}%)`);
        gradient.addColorStop(1, params.fillGradientEnd || `hsl(${hue + 60}, ${saturation}%, ${lightness}%)`);
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = fillColor || `hsla(${hue}, ${saturation}%, ${lightness + 20}%, 0.3)`;
      }
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const angle = (i * angleStep) + rotationRad;
        const x = finalX + Math.cos(angle) * layerSize;
        const y = finalY + Math.sin(angle) * layerSize;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    }
    
    // Draw triangle stroke
    if (params.strokeType !== 'none') {
      ctx.globalAlpha = (0.8 - (layer * 0.1)) * strokeOpacity;
      ctx.strokeStyle = strokeColor || `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      ctx.lineWidth = params.strokeWidth || Math.max(1, layerSize / 30);
      if (params.strokeType === 'dashed') {
        ctx.setLineDash([5, 5]);
      } else if (params.strokeType === 'dotted') {
        ctx.setLineDash([2, 2]);
      } else {
        ctx.setLineDash([]);
      }
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const angle = (i * angleStep) + rotationRad;
        const x = finalX + Math.cos(angle) * layerSize;
        const y = finalY + Math.sin(angle) * layerSize;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    ctx.restore();
    
    // Add complexity: orbital triangles
    if (complexity > 0 && layer < layers / 2) {
      const orbitCount = Math.ceil(complexity * 5);
      
      for (let i = 0; i < orbitCount; i++) {
        const orbitPhase = (i / orbitCount) * frequency * Math.PI * 2 + time * 1.5;
        const orbitRadius = layerSize * 0.8;
        const orbitX = finalX + Math.cos(orbitPhase) * orbitRadius;
        const orbitY = finalY + Math.sin(orbitPhase) * orbitRadius;
        const orbitSize = layerSize * 0.25;
        
        // Bounds check for orbit triangles
        if (orbitX > orbitSize && orbitX < width - orbitSize && 
            orbitY > orbitSize && orbitY < height - orbitSize) {
          
          ctx.save();
          ctx.globalAlpha = 0.6;
          
          // Small orbital triangle
          if (params.fillType !== 'none') {
            ctx.fillStyle = fillColor ? fillColor + '66' : `hsla(${hue + 60}, ${saturation}%, ${lightness + 10}%, 0.4)`;
          }
          if (params.strokeType !== 'none') {
            ctx.strokeStyle = strokeColor || `hsl(${hue + 60}, ${saturation}%, ${lightness}%)`;
            ctx.lineWidth = params.strokeWidth * 0.5 || Math.max(1, orbitSize / 20);
          }
          
          const orbitRotation = orbitPhase * 180 / Math.PI;
          const orbitRotRad = (orbitRotation * Math.PI) / 180;
          
          ctx.beginPath();
          for (let j = 0; j < 3; j++) {
            const angle = (j * angleStep) + orbitRotRad;
            const x = orbitX + Math.cos(angle) * orbitSize;
            const y = orbitY + Math.sin(angle) * orbitSize;
            if (j === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          if (params.fillType !== 'none') ctx.fill();
          if (params.strokeType !== 'none') ctx.stroke();
          
          ctx.restore();
        }
      }
    }
  }

  // Add glow effect only if stroke is enabled
  if (params.strokeType !== 'none') {
    ctx.save();
    ctx.shadowColor = 'rgba(100, 150, 255, 0.3)';
    ctx.shadowBlur = 15;
    
    // Second pass for glow on main triangles only
    for (let layer = 0; layer < Math.min(layers, 2); layer++) {
      const layerPhase = (layer / layers) * frequency * Math.PI * 2 + time;
      const layerSize = (amplitude * Math.min(width, height) / 400) * Math.pow(damping, layer);
      const layerRotation = baseRotation + (layerPhase * 180 / Math.PI);
      
      const finalX = centerX;
      const finalY = centerY;
      const hue = (layer / layers) * 120 + time * 20 + 240;
      const saturation = 70 - (layer * 5);
      const lightness = 45 + Math.sin(layerPhase) * 15;
      
      const rotationRad = (layerRotation * Math.PI) / 180;
      const angleStep = (Math.PI * 2) / sides;
      
      ctx.globalAlpha = 0.3 * strokeOpacity;
      ctx.strokeStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      ctx.lineWidth = Math.max(2, layerSize / 15);
      
      ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        const angle = (i * angleStep) + rotationRad;
        const x = finalX + Math.cos(angle) * layerSize;
        const y = finalY + Math.sin(angle) * layerSize;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }
    
    ctx.restore();
  }
}

export { drawVisualization, metadata };
export const PARAMETERS = metadata.parameters; // Alias for UI system