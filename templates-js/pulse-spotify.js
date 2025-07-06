// Helpers
const slider = (def, min, max, step, label, unit, opts = {}) => ({ 
  type: "slider", default: def, min, max, step, label, unit, ...opts 
});
const select = (def, options, label, opts = {}) => ({ 
  type: "select", default: def, options, label, ...opts 
});

function drawVisualization(ctx, width, height, params, time, utils) {
  const p = utils.params.load(params, ctx, width, height, time, { parameters });
  
  // Access universal properties
  const fillColor = p.fillColor || '#1DB954'; // Spotify green
  const strokeColor = p.strokeColor || '#1ED760'; // Lighter Spotify green
  const fillOpacity = p.fillOpacity ?? 1;
  const strokeOpacity = p.strokeOpacity ?? 0.8;
  const colorMode = p.colorMode || 'theme';
  
// Helper functions
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
  
  // Generate multiple layers of circles
  for (let layer = 0; layer < p.layers; layer++) {
    const layerPhase = (layer / p.layers) * Math.PI * 2 + time * p.frequency * 0.5;
    const layerRadius = p.radius * (1 + layer * 0.3);
    const chaosOffset = p.chaos * 20 * (Math.sin(time * 1.7 + layer) + Math.sin(time * 2.3 + layer * 1.5));
    const radiusVariation = p.amplitude * Math.sin(layerPhase) * p.damping + chaosOffset;
    const finalRadius = Math.max(10, layerRadius + radiusVariation);
    
    // Color based on mode
    let hue, saturation, lightness;
    
    if (colorMode === 'spotify') {
      // Spotify-inspired green color palette
      hue = 140 + (layer / p.layers) * 20 + p.colorVariation * 15 * Math.sin(time + layer);
      saturation = 70 - layer * 5;
      lightness = 50 + layer * 5;
    } else {
      // Theme colors with layer variations
      const [baseHue, baseSat, baseLum] = hexToHsl(layer % 2 === 0 ? fillColor : strokeColor);
      hue = baseHue + (layer / p.layers) * 30 + p.colorVariation * 20 * Math.sin(time + layer);
      saturation = baseSat - layer * 5;
      lightness = baseLum + layer * 10;
    }
    
    // Draw main circles with stroke
    if (p.strokeType !== 'none') {
      ctx.save();
      ctx.strokeStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      ctx.lineWidth = p.strokeWidth || 3;
      ctx.globalAlpha = (0.8 - layer * 0.1) * strokeOpacity;
      
      if (p.strokeType === 'dashed') {
        ctx.setLineDash([5, 5]);
      } else if (p.strokeType === 'dotted') {
        ctx.setLineDash([2, 2]);
      }
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, finalRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }
    
    // Add complexity with orbital elements
    if (p.complexity > 0.3 && p.fillType !== 'none') {
      const orbitCount = Math.floor(p.complexity * 8);
      for (let i = 0; i < orbitCount; i++) {
        const orbitAngle = (i / orbitCount) * Math.PI * 2 + layerPhase;
        const orbitOffset = p.chaos * 10 * Math.sin(time * 3 + i);
        const orbitX = centerX + Math.cos(orbitAngle) * (finalRadius * 0.7 + orbitOffset);
        const orbitY = centerY + Math.sin(orbitAngle) * (finalRadius * 0.7 + orbitOffset);
        const orbitRadius = 5 + layer * 2 + p.chaos * 3 * Math.sin(time * 5 + i);
        
        ctx.save();
        ctx.fillStyle = `hsl(${(hue + 10) % 360}, ${Math.min(100, saturation + 10)}%, ${Math.min(90, lightness + 20)}%)`;
        ctx.globalAlpha = (0.6 - p.complexity * 0.3) * fillOpacity;
        
        ctx.beginPath();
        ctx.arc(orbitX, orbitY, Math.max(2, orbitRadius), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }
}

// Parameters
export const parameters = {
  colorMode: select('theme', [
    { value: 'spotify', label: '🟢 Spotify' },
    { value: 'theme', label: '🎨 Theme' }
  ], 'Color Mode'),
  frequency: slider(3, 0.1, 20, 0.1, 'Pulse Frequency', 'Hz'),
  amplitude: slider(50, 0, 100, 1, 'Pulse Amplitude', '%'),
  radius: slider(50, 10, 200, 1, 'Base Radius', 'px'),
  layers: slider(2, 1, 8, 1, 'Circle Layers', ''),
  complexity: slider(0.3, 0, 1, 0.01, 'Orbital Complexity', ''),
  chaos: slider(0.1, 0, 1, 0.01, 'Chaos Factor', ''),
  damping: slider(0.9, 0, 1, 0.01, 'Motion Damping', ''),
  colorVariation: slider(0.5, 0, 1, 0.01, 'Color Variation', '')
};

// Metadata
export const metadata = {
  name: "🎧 Pulse Spotify",
  description: "Pulsing circles with orbital elements",
  category: "generative",
  tags: ["pulse", "spotify", "audio", "circles", "orbital"],
  author: "ReFlow",
  version: "1.0.0"
};

// Export
export { drawVisualization };

