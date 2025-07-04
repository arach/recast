// ● Pulse (Spotify-style)
const PARAMETERS = {
  backgroundColor: { type: 'color', default: "#000000", label: 'Background Color', category: 'Background' },
  backgroundType: { type: 'select', options: [{"value":"transparent","label":"Transparent"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "solid", label: 'Background Type', category: 'Background' },
  backgroundGradientStart: { type: 'color', default: "#000000", label: 'Gradient Start', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientEnd: { type: 'color', default: "#121212", label: 'Gradient End', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 0, label: 'Gradient Direction', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  fillType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "solid", label: 'Fill Type', category: 'Fill' },
  fillColor: { type: 'color', default: "#1DB954", label: 'Fill Color', category: 'Fill', showIf: (params)=>params.fillType === 'solid' },
  fillGradientStart: { type: 'color', default: "#1DB954", label: 'Gradient Start', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientEnd: { type: 'color', default: "#1ED760", label: 'Gradient End', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 45, label: 'Gradient Direction', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Fill Opacity', category: 'Fill', showIf: (params)=>params.fillType !== 'none' },
  strokeType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid"},{"value":"dashed","label":"Dashed"},{"value":"dotted","label":"Dotted"}], default: "solid", label: 'Stroke Type', category: 'Stroke' },
  strokeColor: { type: 'color', default: "#1ED760", label: 'Stroke Color', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeWidth: { type: 'slider', min: 0, max: 10, step: 0.5, default: 3, label: 'Stroke Width', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.8, label: 'Stroke Opacity', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  frequency: { type: 'slider', min: 0.1, max: 20, step: 0.1, default: 3, label: 'Wave Frequency', category: 'Wave' },
  amplitude: { type: 'slider', min: 0, max: 100, step: 1, default: 50, label: 'Wave Height', category: 'Wave' },
  complexity: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.3, label: 'Harmonics', category: 'Wave' },
  chaos: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.1, label: 'Randomness', category: 'Wave' },
  damping: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.9, label: 'Decay', category: 'Wave' },
  layers: { type: 'slider', min: 1, max: 8, step: 1, default: 2, label: 'Layers', category: 'Wave' },
  radius: { type: 'slider', min: 10, max: 200, step: 1, default: 50, label: 'Base Radius', category: 'Circles' },
  colorVariation: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.5, label: 'Color Variation', category: 'Circles' },
  colorMode: { type: 'select', options: [{"value":"spotify","label":"Spotify Green"},{"value":"theme","label":"Use Theme Colors"}], default: 'theme', label: 'Color Mode', category: 'Colors' },
  backgroundOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Background Opacity', category: 'Background', showIf: (params)=>params.backgroundType !== 'transparent' }
};

function applyUniversalBackground(ctx, width, height, params) {
  if (!params.backgroundType || params.backgroundType === 'transparent') return;
  
  ctx.save();
  ctx.globalAlpha = params.backgroundOpacity ?? 1;
  
  if (params.backgroundType === 'solid') {
    ctx.fillStyle = params.backgroundColor || '#000000';
    ctx.fillRect(0, 0, width, height);
  } else if (params.backgroundType === 'gradient') {
    const direction = (params.backgroundGradientDirection || 0) * (Math.PI / 180);
    const x1 = width / 2 - Math.cos(direction) * width / 2;
    const y1 = height / 2 - Math.sin(direction) * height / 2;
    const x2 = width / 2 + Math.cos(direction) * width / 2;
    const y2 = height / 2 + Math.sin(direction) * height / 2;
    
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, params.backgroundGradientStart || '#000000');
    gradient.addColorStop(1, params.backgroundGradientEnd || '#121212');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
  
  ctx.restore();
}

function drawVisualization(ctx, width, height, params, _generator, time) {
  // Parameter compatibility layer
  if (params.customParameters) {
    params.fillColor = params.fillColor || params.customParameters.fillColor;
    params.strokeColor = params.strokeColor || params.customParameters.strokeColor;
    params.backgroundColor = params.backgroundColor || params.customParameters.backgroundColor;
    params.textColor = params.textColor || params.customParameters.textColor;
    
    Object.keys(params.customParameters).forEach(key => {
      if (params[key] === undefined) {
        params[key] = params.customParameters[key];
      }
    });
  }

  // Apply universal background
  applyUniversalBackground(ctx, width, height, params);
  
  // Get theme colors with fallbacks
  const fillColor = params.fillColor || '#1DB954'; // Spotify green
  const strokeColor = params.strokeColor || '#1ED760'; // Lighter Spotify green
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
  
  // Extract opacity values with defaults
  const strokeOpacity = params.strokeOpacity ?? 0.8;
  const fillOpacity = params.fillOpacity ?? 1;
  
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
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, finalRadius, 0, Math.PI * 2);
      ctx.stroke();
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

export const metadata = {
  name: "● Pulse (Spotify-style)",
  description: "Pulsing concentric circles with theme colors or Spotify's signature green palette",
  defaultParams: {
    seed: "pulse-spotify",
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

export const id = 'pulse-spotify';
export const name = "● Pulse (Spotify-style)";
export const description = "Pulsing concentric circles with theme colors or Spotify's signature green palette";
export { drawVisualization };
export const defaultParams = {
  seed: "pulse-spotify",
  frequency: 3,
  amplitude: 50,
  complexity: 0.3,
  chaos: 0.1,
  damping: 0.9,
  layers: 2,
  radius: 50,
  colorVariation: 0.5,
  colorMode: 'theme'
};
export const code = `// ● Pulse (Spotify-style)
const PARAMETERS = {
  backgroundColor: { type: 'color', default: "#000000", label: 'Background Color', category: 'Background' },
  backgroundType: { type: 'select', options: [{"value":"transparent","label":"Transparent"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "solid", label: 'Background Type', category: 'Background' },
  backgroundGradientStart: { type: 'color', default: "#000000", label: 'Gradient Start', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientEnd: { type: 'color', default: "#121212", label: 'Gradient End', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 0, label: 'Gradient Direction', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  fillType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "solid", label: 'Fill Type', category: 'Fill' },
  fillColor: { type: 'color', default: "#1DB954", label: 'Fill Color', category: 'Fill', showIf: (params)=>params.fillType === 'solid' },
  fillGradientStart: { type: 'color', default: "#1DB954", label: 'Gradient Start', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientEnd: { type: 'color', default: "#1ED760", label: 'Gradient End', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 45, label: 'Gradient Direction', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Fill Opacity', category: 'Fill', showIf: (params)=>params.fillType !== 'none' },
  strokeType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid"},{"value":"dashed","label":"Dashed"},{"value":"dotted","label":"Dotted"}], default: "solid", label: 'Stroke Type', category: 'Stroke' },
  strokeColor: { type: 'color', default: "#1ED760", label: 'Stroke Color', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeWidth: { type: 'slider', min: 0, max: 10, step: 0.5, default: 3, label: 'Stroke Width', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.8, label: 'Stroke Opacity', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  frequency: { type: 'slider', min: 0.1, max: 20, step: 0.1, default: 3, label: 'Wave Frequency', category: 'Wave' },
  amplitude: { type: 'slider', min: 0, max: 100, step: 1, default: 50, label: 'Wave Height', category: 'Wave' },
  complexity: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.3, label: 'Harmonics', category: 'Wave' },
  chaos: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.1, label: 'Randomness', category: 'Wave' },
  damping: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.9, label: 'Decay', category: 'Wave' },
  layers: { type: 'slider', min: 1, max: 8, step: 1, default: 2, label: 'Layers', category: 'Wave' },
  radius: { type: 'slider', min: 10, max: 200, step: 1, default: 50, label: 'Base Radius', category: 'Circles' },
  colorVariation: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.5, label: 'Color Variation', category: 'Circles' },
  colorMode: { type: 'select', options: [{"value":"spotify","label":"Spotify Green"},{"value":"theme","label":"Use Theme Colors"}], default: 'theme', label: 'Color Mode', category: 'Colors' },
  backgroundOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Background Opacity', category: 'Background', showIf: (params)=>params.backgroundType !== 'transparent' }
};

function applyUniversalBackground(ctx, width, height, params) {
  if (!params.backgroundType || params.backgroundType === 'transparent') return;
  
  ctx.save();
  ctx.globalAlpha = params.backgroundOpacity ?? 1;
  
  if (params.backgroundType === 'solid') {
    ctx.fillStyle = params.backgroundColor || '#000000';
    ctx.fillRect(0, 0, width, height);
  } else if (params.backgroundType === 'gradient') {
    const direction = (params.backgroundGradientDirection || 0) * (Math.PI / 180);
    const x1 = width / 2 - Math.cos(direction) * width / 2;
    const y1 = height / 2 - Math.sin(direction) * height / 2;
    const x2 = width / 2 + Math.cos(direction) * width / 2;
    const y2 = height / 2 + Math.sin(direction) * height / 2;
    
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, params.backgroundGradientStart || '#000000');
    gradient.addColorStop(1, params.backgroundGradientEnd || '#121212');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
  
  ctx.restore();
}

function drawVisualization(ctx, width, height, params, _generator, time) {
  // Parameter compatibility layer
  if (params.customParameters) {
    params.fillColor = params.fillColor || params.customParameters.fillColor;
    params.strokeColor = params.strokeColor || params.customParameters.strokeColor;
    params.backgroundColor = params.backgroundColor || params.customParameters.backgroundColor;
    params.textColor = params.textColor || params.customParameters.textColor;
    
    Object.keys(params.customParameters).forEach(key => {
      if (params[key] === undefined) {
        params[key] = params.customParameters[key];
      }
    });
  }

  // Apply universal background
  applyUniversalBackground(ctx, width, height, params);
  
  // Get theme colors with fallbacks
  const fillColor = params.fillColor || '#1DB954'; // Spotify green
  const strokeColor = params.strokeColor || '#1ED760'; // Lighter Spotify green
  const colorMode = params.colorMode || 'theme';
  
  // Helper to convert hex to HSL
  const hexToHsl = (hex) => {
    const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
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
    
    ctx.beginPath();
    ctx.strokeStyle = \`hsl(\${hue}, \${saturation}%, \${lightness}%)\`;
    ctx.lineWidth = params.strokeWidth || 3;
    ctx.globalAlpha = (0.8 - layer * 0.1) * (params.strokeOpacity || 1);
    ctx.arc(centerX, centerY, finalRadius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Add complexity with orbital elements
    if (params.complexity > 0.3) {
      const orbitCount = Math.floor(params.complexity * 8);
      for (let i = 0; i < orbitCount; i++) {
        const orbitAngle = (i / orbitCount) * Math.PI * 2 + layerPhase;
        const orbitX = centerX + Math.cos(orbitAngle) * finalRadius * 0.7;
        const orbitY = centerY + Math.sin(orbitAngle) * finalRadius * 0.7;
        const orbitRadius = 5 + layer * 2;
        
        ctx.beginPath();
        ctx.fillStyle = \`hsl(\${(hue + 10) % 360}, \${Math.min(100, saturation + 10)}%, \${Math.min(90, lightness + 20)}%)\`;
        ctx.globalAlpha = 0.6 * (params.fillOpacity || 1);
        ctx.arc(orbitX, orbitY, orbitRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  
  ctx.globalAlpha = 1;
}`;