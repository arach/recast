// ● Pulse (Spotify-style)
import type { TemplateUtils } from '@/lib/template-utils';

const parameters = {
  frequency: {
    default: 3,
    range: [0.1, 20, 0.1]
  },
  amplitude: {
    default: 50,
    range: [0, 100, 1]
  },
  complexity: {
    default: 0.3,
    range: [0, 1, 0.01]
  },
  chaos: {
    default: 0.1,
    range: [0, 1, 0.01]
  },
  damping: {
    default: 0.9,
    range: [0, 1, 0.01]
  },
  layers: {
    default: 2,
    range: [1, 8, 1]
  },
  radius: {
    default: 50,
    range: [10, 200, 1]
  },
  colorVariation: {
    default: 0.5,
    range: [0, 1, 0.01]
  },
  colorMode: {
    default: 'theme',
    options: ['spotify', 'theme']
  }
};

const metadata = {
  id: 'pulse-spotify',
  name: "● Pulse (Spotify-style)",
  description: "Pulsing concentric circles with theme colors or Spotify's signature green palette",
  parameters,
  defaultParams: {
    frequency: 3,
    amplitude: 50,
    complexity: 0.3,
    chaos: 0.1,
    damping: 0.9,
    layers: 2,
    radius: 50,
    colorVariation: 0.5,
    colorMode: 'theme'
  }
};

function drawVisualization(ctx: CanvasRenderingContext2D, width: number, height: number, params: any, time: number, utils: TemplateUtils) {
  utils.applyUniversalBackground(ctx, width, height, params);
  
  // Access universal properties
  const fillColor = params.fillColor || '#1DB954'; // Spotify green
  const strokeColor = params.strokeColor || '#1ED760'; // Lighter Spotify green
  const fillOpacity = params.fillOpacity ?? 1;
  const strokeOpacity = params.strokeOpacity ?? 0.8;
  const colorMode = params.colorMode || 'theme';
  
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

  const centerX = width / 2;
  const centerY = height / 2;
  const baseRadius = params.radius || 50;
  const layers = params.layers || 4;
  
  // Generate multiple layers of circles
  for (let layer = 0; layer < layers; layer++) {
    const layerPhase = (layer / layers) * Math.PI * 2 + time * 0.5;
    const layerRadius = baseRadius * (1 + layer * 0.3);
    const radiusVariation = (params.amplitude || 25) * Math.sin(layerPhase + time);
    const finalRadius = Math.max(10, layerRadius + radiusVariation);
    
    // Color based on mode
    let hue, saturation, lightness;
    
    if (colorMode === 'spotify') {
      // Spotify-inspired green color palette
      hue = 140 + (layer / layers) * 20 + (params.colorVariation || 0.5) * 15 * Math.sin(time + layer);
      saturation = 70 - layer * 5;
      lightness = 50 + layer * 5;
    } else {
      // Theme colors with layer variations
      const [baseHue, baseSat, baseLum] = hexToHsl(layer % 2 === 0 ? fillColor : strokeColor);
      hue = baseHue + (layer / layers) * 30 + (params.colorVariation || 0.5) * 20 * Math.sin(time + layer);
      saturation = baseSat - layer * 5;
      lightness = baseLum + layer * 10;
    }
    
    // Draw main circles with stroke
    if (params.strokeType !== 'none') {
      ctx.save();
      ctx.strokeStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      ctx.lineWidth = params.strokeWidth || 3;
      ctx.globalAlpha = (0.8 - layer * 0.1) * strokeOpacity;
      
      if (params.strokeType === 'dashed') {
        ctx.setLineDash([5, 5]);
      } else if (params.strokeType === 'dotted') {
        ctx.setLineDash([2, 2]);
      }
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, finalRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }
    
    // Add complexity with orbital elements
    if (params.complexity > 0.3 && params.fillType !== 'none') {
      const orbitCount = Math.floor(params.complexity * 8);
      for (let i = 0; i < orbitCount; i++) {
        const orbitAngle = (i / orbitCount) * Math.PI * 2 + layerPhase;
        const orbitX = centerX + Math.cos(orbitAngle) * finalRadius * 0.7;
        const orbitY = centerY + Math.sin(orbitAngle) * finalRadius * 0.7;
        const orbitRadius = 5 + layer * 2;
        
        ctx.save();
        ctx.fillStyle = `hsl(${(hue + 10) % 360}, ${Math.min(100, saturation + 10)}%, ${Math.min(90, lightness + 20)}%)`;
        ctx.globalAlpha = 0.6 * fillOpacity;
        
        ctx.beginPath();
        ctx.arc(orbitX, orbitY, orbitRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }
}

export { drawVisualization, metadata };
export const PARAMETERS = metadata.parameters; // Alias for UI system