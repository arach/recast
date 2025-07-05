// ● Pulse (Spotify-style) - Pulsing concentric circles with theme colors or Spotify's signature green palette

const parameters = {
  colorMode: {
    type: 'select',
    default: 'theme',
    options: [
      { value: 'spotify', label: '🟢 Spotify' },
      { value: 'theme', label: '🎨 Theme' }
    ],
    label: 'Color Mode',
    category: 'Style'
  },
  frequency: {
    type: 'slider',
    default: 3,
    min: 0.1,
    max: 20,
    step: 0.1,
    label: 'Pulse Frequency',
    category: 'Animation'
  },
  amplitude: {
    type: 'slider',
    default: 50,
    min: 0,
    max: 100,
    step: 1,
    label: 'Pulse Amplitude',
    category: 'Animation'
  },
  radius: {
    type: 'slider',
    default: 50,
    min: 10,
    max: 200,
    step: 1,
    label: 'Base Radius',
    category: 'Geometry'
  },
  layers: {
    type: 'slider',
    default: 2,
    min: 1,
    max: 8,
    step: 1,
    label: 'Circle Layers',
    category: 'Geometry'
  },
  complexity: {
    type: 'slider',
    default: 0.3,
    min: 0,
    max: 1,
    step: 0.01,
    label: 'Orbital Complexity',
    category: 'Effects'
  },
  chaos: {
    type: 'slider',
    default: 0.1,
    min: 0,
    max: 1,
    step: 0.01,
    label: 'Chaos Factor',
    category: 'Effects'
  },
  damping: {
    type: 'slider',
    default: 0.9,
    min: 0,
    max: 1,
    step: 0.01,
    label: 'Motion Damping',
    category: 'Animation'
  },
  colorVariation: {
    type: 'slider',
    default: 0.5,
    min: 0,
    max: 1,
    step: 0.01,
    label: 'Color Variation',
    category: 'Color'
  }
};

function drawVisualization(ctx, width, height, params, time, utils) {
  utils.applyUniversalBackground(ctx, width, height, params);
  
  // Access universal properties
  const fillColor = params.fillColor || '#1DB954'; // Spotify green
  const strokeColor = params.strokeColor || '#1ED760'; // Lighter Spotify green
  const fillOpacity = params.fillOpacity ?? 1;
  const strokeOpacity = params.strokeOpacity ?? 0.8;
  const colorMode = params.colorMode || 'theme';
  
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

  const centerX = width / 2;
  const centerY = height / 2;
  const baseRadius = params.radius || 50;
  const layers = params.layers || 4;
  const frequency = params.frequency || 3;
  const amplitude = params.amplitude || 50;
  const complexity = params.complexity || 0.3;
  const chaos = params.chaos || 0.1;
  const damping = params.damping || 0.9;
  const colorVariation = params.colorVariation || 0.5;
  
  // Generate multiple layers of circles
  for (let layer = 0; layer < layers; layer++) {
    const layerPhase = (layer / layers) * Math.PI * 2 + time * frequency * 0.5;
    const layerRadius = baseRadius * (1 + layer * 0.3);
    const chaosOffset = chaos * 20 * (Math.sin(time * 1.7 + layer) + Math.sin(time * 2.3 + layer * 1.5));
    const radiusVariation = amplitude * Math.sin(layerPhase) * damping + chaosOffset;
    const finalRadius = Math.max(10, layerRadius + radiusVariation);
    
    // Color based on mode
    let hue, saturation, lightness;
    
    if (colorMode === 'spotify') {
      // Spotify-inspired green color palette
      hue = 140 + (layer / layers) * 20 + colorVariation * 15 * Math.sin(time + layer);
      saturation = 70 - layer * 5;
      lightness = 50 + layer * 5;
    } else {
      // Theme colors with layer variations
      const [baseHue, baseSat, baseLum] = hexToHsl(layer % 2 === 0 ? fillColor : strokeColor);
      hue = baseHue + (layer / layers) * 30 + colorVariation * 20 * Math.sin(time + layer);
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
    if (complexity > 0.3 && params.fillType !== 'none') {
      const orbitCount = Math.floor(complexity * 8);
      for (let i = 0; i < orbitCount; i++) {
        const orbitAngle = (i / orbitCount) * Math.PI * 2 + layerPhase;
        const orbitOffset = chaos * 10 * Math.sin(time * 3 + i);
        const orbitX = centerX + Math.cos(orbitAngle) * (finalRadius * 0.7 + orbitOffset);
        const orbitY = centerY + Math.sin(orbitAngle) * (finalRadius * 0.7 + orbitOffset);
        const orbitRadius = 5 + layer * 2 + chaos * 3 * Math.sin(time * 5 + i);
        
        ctx.save();
        ctx.fillStyle = `hsl(${(hue + 10) % 360}, ${Math.min(100, saturation + 10)}%, ${Math.min(90, lightness + 20)}%)`;
        ctx.globalAlpha = (0.6 - complexity * 0.3) * fillOpacity;
        
        ctx.beginPath();
        ctx.arc(orbitX, orbitY, Math.max(2, orbitRadius), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }
}

const metadata = {
  id: 'pulse-spotify',
  name: "● Pulse (Spotify-style)",
  description: "Pulsing concentric circles with theme colors or Spotify's signature green palette",
  parameters,
  defaultParams: {
    colorMode: 'theme',
    frequency: 3,
    amplitude: 50,
    radius: 50,
    layers: 2,
    complexity: 0.3,
    chaos: 0.1,
    damping: 0.9,
    colorVariation: 0.5
  }
};

export { parameters, metadata, drawVisualization };