// ∞ Infinity Loops
const PARAMETERS = {
  backgroundColor: { type: 'color', default: "#ffffff", label: 'Background Color', category: 'Background' },
  backgroundType: { type: 'select', options: [{"value":"transparent","label":"Transparent"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "transparent", label: 'Background Type', category: 'Background' },
  backgroundGradientStart: { type: 'color', default: "#ffffff", label: 'Gradient Start', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientEnd: { type: 'color', default: "#f0f0f0", label: 'Gradient End', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 0, label: 'Gradient Direction', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  fillType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "solid", label: 'Fill Type', category: 'Fill' },
  fillColor: { type: 'color', default: "#9333ea", label: 'Fill Color', category: 'Fill', showIf: (params)=>params.fillType === 'solid' },
  fillGradientStart: { type: 'color', default: "#9333ea", label: 'Gradient Start', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientEnd: { type: 'color', default: "#7c3aed", label: 'Gradient End', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 45, label: 'Gradient Direction', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.8, label: 'Fill Opacity', category: 'Fill', showIf: (params)=>params.fillType !== 'none' },
  strokeType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid"},{"value":"dashed","label":"Dashed"},{"value":"dotted","label":"Dotted"}], default: "solid", label: 'Stroke Type', category: 'Stroke' },
  strokeColor: { type: 'color', default: "#7c3aed", label: 'Stroke Color', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeWidth: { type: 'slider', min: 0, max: 10, step: 0.5, default: 2, label: 'Stroke Width', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Stroke Opacity', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  frequency: { type: 'slider', min: 0.1, max: 8, step: 0.1, default: 2, label: 'Flow Speed', category: 'Animation' },
  amplitude: { type: 'slider', min: 10, max: 150, step: 5, default: 60, label: 'Loop Size', category: 'Shape' },
  complexity: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.3, label: 'Flowing Particles', category: 'Effects' },
  chaos: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.1, label: 'Organic Variance', category: 'Effects' },
  damping: { type: 'slider', min: 0.3, max: 1, step: 0.01, default: 0.9, label: 'Layer Scale', category: 'Shape' },
  layers: { type: 'slider', min: 1, max: 6, step: 1, default: 2, label: 'Nested Loops', category: 'Shape' },
  scale: { type: 'slider', min: 0.3, max: 3, step: 0.1, default: 1.0, label: 'Overall Scale', category: 'Shape' }
};

function applyUniversalBackground(ctx, width, height, params) {
  if (!params.backgroundType || params.backgroundType === 'transparent') return;
  
  if (params.backgroundType === 'solid') {
    ctx.fillStyle = params.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, width, height);
  } else if (params.backgroundType === 'gradient') {
    const direction = (params.backgroundGradientDirection || 0) * (Math.PI / 180);
    const x1 = width / 2 - Math.cos(direction) * width / 2;
    const y1 = height / 2 - Math.sin(direction) * height / 2;
    const x2 = width / 2 + Math.cos(direction) * width / 2;
    const y2 = height / 2 + Math.sin(direction) * height / 2;
    
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, params.backgroundGradientStart || '#ffffff');
    gradient.addColorStop(1, params.backgroundGradientEnd || '#f0f0f0');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
}

function drawVisualization(ctx, width, height, params, generator, time) {
  // Ensure color parameters are available at the root level
  if (params.customParameters) {
    params.fillColor = params.fillColor || params.customParameters.fillColor;
    params.strokeColor = params.strokeColor || params.customParameters.strokeColor;
    params.backgroundColor = params.backgroundColor || params.customParameters.backgroundColor;
    params.textColor = params.textColor || params.customParameters.textColor;
    
    // Also make sure all custom parameters are available at root level for convenience
    Object.keys(params.customParameters).forEach(key => {
      if (params[key] === undefined) {
        params[key] = params.customParameters[key];
      }
    });
  }

  // Apply universal background
  applyUniversalBackground(ctx, width, height, params);

  // Get theme colors with fallbacks
  const fillColor = params.fillColor || '#9333ea';
  const strokeColor = params.strokeColor || '#7c3aed';
  
  // Direct infinity loop generation without external requires
  const centerX = width / 2;
  const centerY = height / 2;
  const layers = params.layers || 2;
  const frequency = params.frequency || 2;
  const amplitude = params.amplitude || 60;
  const complexity = params.complexity || 0.3;
  const chaos = params.chaos || 0.1;
  const damping = params.damping || 0.9;
  const scale = (params.scale || 1.0) * Math.min(width, height) / 400;

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

  // Simple seeded random function
  let seed = 1;
  const seedStr = params.seed || 'infinity';
  for (let i = 0; i < seedStr.length; i++) {
    seed = ((seed << 5) - seed) + seedStr.charCodeAt(i);
    seed = seed & seed;
  }
  
  function seededRandom() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  // Add glow effect for mystical appearance using theme color
  const [baseHue, baseSat] = hexToHsl(fillColor);
  ctx.shadowColor = `hsla(${baseHue}, ${baseSat}%, 70%, 0.4)`;
  ctx.shadowBlur = 10;

  // Generate infinity loop layers
  for (let layer = 0; layer < layers; layer++) {
    const layerPhase = (layer / layers) * frequency * Math.PI * 2 + time;
    const layerScale = scale * Math.pow(damping, layer);
    const layerAmplitude = amplitude * layerScale;
    
    // Color progression based on theme color
    const hueShift = (layer / layers) * 60 + time * 15; // Subtle hue variation
    const hue = (baseHue + hueShift) % 360;
    const saturation = baseSat - (layer * 10);
    const lightness = 50 + Math.sin(layerPhase) * 20;
    const layerStrokeColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    
    // Draw infinity loop using lemniscate equation
    ctx.save();
    ctx.globalAlpha = 0.8 - (layer * 0.15);
    ctx.strokeStyle = layerStrokeColor;
    ctx.lineWidth = Math.max(1, layerAmplitude / 25);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    const resolution = 120;
    let firstPoint = true;
    
    for (let i = 0; i <= resolution; i++) {
      const t = (i / resolution) * Math.PI * 2;
      const animatedT = t + (time + layer * 0.5) * frequency;
      
      // Lemniscate equation: x = a*cos(t)/(1+sin²(t)), y = a*sin(t)*cos(t)/(1+sin²(t))
      const sinT = Math.sin(animatedT);
      const cosT = Math.cos(animatedT);
      const denominator = 1 + sinT * sinT;
      
      let x = layerAmplitude * cosT / denominator;
      let y = layerAmplitude * sinT * cosT / denominator;
      
      // Add chaos for organic feel
      if (chaos > 0) {
        x += (seededRandom() - 0.5) * layerAmplitude * chaos * 0.1;
        y += (seededRandom() - 0.5) * layerAmplitude * chaos * 0.1;
      }
      
      // Translate to center
      x += centerX;
      y += centerY;
      
      if (firstPoint) {
        ctx.moveTo(x, y);
        firstPoint = false;
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
    ctx.restore();
    
    // Add complexity: flowing particles
    if (complexity > 0) {
      const particleCount = Math.ceil(complexity * 8);
      
      for (let p = 0; p < particleCount; p++) {
        const particlePhase = (p / particleCount) * frequency * Math.PI * 2 + time * 2 + layer;
        const t = (particlePhase / (Math.PI * 2)) % 1;
        
        // Calculate position along infinity curve
        const angle = t * Math.PI * 2;
        const sinT = Math.sin(angle + time * frequency);
        const cosT = Math.cos(angle + time * frequency);
        const denominator = 1 + sinT * sinT;
        
        let particleX = centerX + layerAmplitude * cosT / denominator;
        let particleY = centerY + layerAmplitude * sinT * cosT / denominator;
        
        // Add chaos to particle position
        particleX += (seededRandom() - 0.5) * layerAmplitude * 0.1;
        particleY += (seededRandom() - 0.5) * layerAmplitude * 0.1;
        
        // Bounds check for particles
        const particleSize = layerAmplitude * 0.05;
        if (particleX > particleSize && particleX < width - particleSize && 
            particleY > particleSize && particleY < height - particleSize) {
          
          ctx.save();
          ctx.globalAlpha = 0.6 + Math.sin(particlePhase) * 0.3;
          ctx.fillStyle = `hsla(${hue + 30}, ${saturation}%, ${lightness + 20}%, 0.7)`;
          
          ctx.beginPath();
          ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.restore();
        }
      }
    }
  }

  // Enhanced glow pass for main curves using theme color
  ctx.shadowColor = `hsla(${baseHue}, ${baseSat}%, 80%, 0.6)`;
  ctx.shadowBlur = 20;
  
  for (let layer = 0; layer < Math.min(layers, 2); layer++) {
    const layerPhase = (layer / layers) * frequency * Math.PI * 2 + time;
    const layerScale = scale * Math.pow(damping, layer);
    const layerAmplitude = amplitude * layerScale;
    
    const hueShift = (layer / layers) * 60 + time * 15; // Subtle hue variation
    const glowHue = (baseHue + hueShift) % 360;
    const glowSaturation = baseSat - (layer * 10);
    const glowLightness = 50 + Math.sin(layerPhase) * 20;
    
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = `hsl(${glowHue}, ${glowSaturation}%, ${glowLightness}%)`;
    ctx.lineWidth = Math.max(2, layerAmplitude / 15);
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    const resolution = 60; // Lower resolution for glow
    let firstPoint = true;
    
    for (let i = 0; i <= resolution; i++) {
      const t = (i / resolution) * Math.PI * 2;
      const animatedT = t + (time + layer * 0.5) * frequency;
      
      const sinT = Math.sin(animatedT);
      const cosT = Math.cos(animatedT);
      const denominator = 1 + sinT * sinT;
      
      const x = centerX + layerAmplitude * cosT / denominator;
      const y = centerY + layerAmplitude * sinT * cosT / denominator;
      
      if (firstPoint) {
        ctx.moveTo(x, y);
        firstPoint = false;
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
    ctx.restore();
  }
  
  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;

  // Add subtle starfield background
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  for (let i = 0; i < 20; i++) {
    const x = (Math.sin(time * 0.1 + i) * 0.5 + 0.5) * width;
    const y = (Math.cos(time * 0.15 + i * 2) * 0.5 + 0.5) * height;
    const size = Math.sin(time * 0.5 + i) * 0.5 + 1;
    
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

export const metadata = {
  name: "∞ Infinity Loops",
  description: "Mystical figure-8 patterns with flowing particles and ethereal glow effects",
  defaultParams: {
    seed: "infinity-loops",
    frequency: 2,
    amplitude: 60,
    complexity: 0.3,
    chaos: 0.1,
    damping: 0.9,
    layers: 2,
    scale: 1.0
  }
};

export const id = 'infinity-loops';
export const name = "∞ Infinity Loops";
export const description = "Mystical figure-8 patterns with flowing particles and ethereal glow effects";
export const defaultParams = {
  seed: "infinity-loops",
  frequency: 2,
  amplitude: 60,
  complexity: 0.3,
  chaos: 0.1,
  damping: 0.9,
  layers: 2,
  scale: 1.0
};
export const code = `// ∞ Infinity Loops
const PARAMETERS = {
  backgroundColor: { type: 'color', default: "#ffffff", label: 'Background Color', category: 'Background' },
  backgroundType: { type: 'select', options: [{"value":"transparent","label":"Transparent"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "transparent", label: 'Background Type', category: 'Background' },
  backgroundGradientStart: { type: 'color', default: "#ffffff", label: 'Gradient Start', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientEnd: { type: 'color', default: "#f0f0f0", label: 'Gradient End', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 0, label: 'Gradient Direction', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  fillType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "solid", label: 'Fill Type', category: 'Fill' },
  fillColor: { type: 'color', default: "#9333ea", label: 'Fill Color', category: 'Fill', showIf: (params)=>params.fillType === 'solid' },
  fillGradientStart: { type: 'color', default: "#9333ea", label: 'Gradient Start', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientEnd: { type: 'color', default: "#7c3aed", label: 'Gradient End', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 45, label: 'Gradient Direction', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.8, label: 'Fill Opacity', category: 'Fill', showIf: (params)=>params.fillType !== 'none' },
  strokeType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid"},{"value":"dashed","label":"Dashed"},{"value":"dotted","label":"Dotted"}], default: "solid", label: 'Stroke Type', category: 'Stroke' },
  strokeColor: { type: 'color', default: "#7c3aed", label: 'Stroke Color', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeWidth: { type: 'slider', min: 0, max: 10, step: 0.5, default: 2, label: 'Stroke Width', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Stroke Opacity', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  frequency: { type: 'slider', min: 0.1, max: 8, step: 0.1, default: 2, label: 'Flow Speed', category: 'Animation' },
  amplitude: { type: 'slider', min: 10, max: 150, step: 5, default: 60, label: 'Loop Size', category: 'Shape' },
  complexity: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.3, label: 'Flowing Particles', category: 'Effects' },
  chaos: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.1, label: 'Organic Variance', category: 'Effects' },
  damping: { type: 'slider', min: 0.3, max: 1, step: 0.01, default: 0.9, label: 'Layer Scale', category: 'Shape' },
  layers: { type: 'slider', min: 1, max: 6, step: 1, default: 2, label: 'Nested Loops', category: 'Shape' },
  scale: { type: 'slider', min: 0.3, max: 3, step: 0.1, default: 1.0, label: 'Overall Scale', category: 'Shape' }
};

function applyUniversalBackground(ctx, width, height, params) {
  if (!params.backgroundType || params.backgroundType === 'transparent') return;
  
  if (params.backgroundType === 'solid') {
    ctx.fillStyle = params.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, width, height);
  } else if (params.backgroundType === 'gradient') {
    const direction = (params.backgroundGradientDirection || 0) * (Math.PI / 180);
    const x1 = width / 2 - Math.cos(direction) * width / 2;
    const y1 = height / 2 - Math.sin(direction) * height / 2;
    const x2 = width / 2 + Math.cos(direction) * width / 2;
    const y2 = height / 2 + Math.sin(direction) * height / 2;
    
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, params.backgroundGradientStart || '#ffffff');
    gradient.addColorStop(1, params.backgroundGradientEnd || '#f0f0f0');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
}

function drawVisualization(ctx, width, height, params, generator, time) {
  // Ensure color parameters are available at the root level
  if (params.customParameters) {
    params.fillColor = params.fillColor || params.customParameters.fillColor;
    params.strokeColor = params.strokeColor || params.customParameters.strokeColor;
    params.backgroundColor = params.backgroundColor || params.customParameters.backgroundColor;
    params.textColor = params.textColor || params.customParameters.textColor;
    
    // Also make sure all custom parameters are available at root level for convenience
    Object.keys(params.customParameters).forEach(key => {
      if (params[key] === undefined) {
        params[key] = params.customParameters[key];
      }
    });
  }

  // Apply universal background
  applyUniversalBackground(ctx, width, height, params);

  // Get theme colors with fallbacks
  const fillColor = params.fillColor || '#9333ea';
  const strokeColor = params.strokeColor || '#7c3aed';
  
  // Direct infinity loop generation without external requires
  const centerX = width / 2;
  const centerY = height / 2;
  const layers = params.layers || 2;
  const frequency = params.frequency || 2;
  const amplitude = params.amplitude || 60;
  const complexity = params.complexity || 0.3;
  const chaos = params.chaos || 0.1;
  const damping = params.damping || 0.9;
  const scale = (params.scale || 1.0) * Math.min(width, height) / 400;

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

  // Simple seeded random function
  let seed = 1;
  const seedStr = params.seed || 'infinity';
  for (let i = 0; i < seedStr.length; i++) {
    seed = ((seed << 5) - seed) + seedStr.charCodeAt(i);
    seed = seed & seed;
  }
  
  function seededRandom() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  // Add glow effect for mystical appearance using theme color
  const [baseHue, baseSat] = hexToHsl(fillColor);
  ctx.shadowColor = \`hsla(\${baseHue}, \${baseSat}%, 70%, 0.4)\`;
  ctx.shadowBlur = 10;

  // Generate infinity loop layers
  for (let layer = 0; layer < layers; layer++) {
    const layerPhase = (layer / layers) * frequency * Math.PI * 2 + time;
    const layerScale = scale * Math.pow(damping, layer);
    const layerAmplitude = amplitude * layerScale;
    
    // Color progression based on theme color
    const hueShift = (layer / layers) * 60 + time * 15; // Subtle hue variation
    const hue = (baseHue + hueShift) % 360;
    const saturation = baseSat - (layer * 10);
    const lightness = 50 + Math.sin(layerPhase) * 20;
    const layerStrokeColor = \`hsl(\${hue}, \${saturation}%, \${lightness}%)\`;
    
    // Draw infinity loop using lemniscate equation
    ctx.save();
    ctx.globalAlpha = 0.8 - (layer * 0.15);
    ctx.strokeStyle = layerStrokeColor;
    ctx.lineWidth = Math.max(1, layerAmplitude / 25);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    const resolution = 120;
    let firstPoint = true;
    
    for (let i = 0; i <= resolution; i++) {
      const t = (i / resolution) * Math.PI * 2;
      const animatedT = t + (time + layer * 0.5) * frequency;
      
      // Lemniscate equation: x = a*cos(t)/(1+sin²(t)), y = a*sin(t)*cos(t)/(1+sin²(t))
      const sinT = Math.sin(animatedT);
      const cosT = Math.cos(animatedT);
      const denominator = 1 + sinT * sinT;
      
      let x = layerAmplitude * cosT / denominator;
      let y = layerAmplitude * sinT * cosT / denominator;
      
      // Add chaos for organic feel
      if (chaos > 0) {
        x += (seededRandom() - 0.5) * layerAmplitude * chaos * 0.1;
        y += (seededRandom() - 0.5) * layerAmplitude * chaos * 0.1;
      }
      
      // Translate to center
      x += centerX;
      y += centerY;
      
      if (firstPoint) {
        ctx.moveTo(x, y);
        firstPoint = false;
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
    ctx.restore();
    
    // Add complexity: flowing particles
    if (complexity > 0) {
      const particleCount = Math.ceil(complexity * 8);
      
      for (let p = 0; p < particleCount; p++) {
        const particlePhase = (p / particleCount) * frequency * Math.PI * 2 + time * 2 + layer;
        const t = (particlePhase / (Math.PI * 2)) % 1;
        
        // Calculate position along infinity curve
        const angle = t * Math.PI * 2;
        const sinT = Math.sin(angle + time * frequency);
        const cosT = Math.cos(angle + time * frequency);
        const denominator = 1 + sinT * sinT;
        
        let particleX = centerX + layerAmplitude * cosT / denominator;
        let particleY = centerY + layerAmplitude * sinT * cosT / denominator;
        
        // Add chaos to particle position
        particleX += (seededRandom() - 0.5) * layerAmplitude * 0.1;
        particleY += (seededRandom() - 0.5) * layerAmplitude * 0.1;
        
        // Bounds check for particles
        const particleSize = layerAmplitude * 0.05;
        if (particleX > particleSize && particleX < width - particleSize && 
            particleY > particleSize && particleY < height - particleSize) {
          
          ctx.save();
          ctx.globalAlpha = 0.6 + Math.sin(particlePhase) * 0.3;
          ctx.fillStyle = \`hsla(\${hue + 30}, \${saturation}%, \${lightness + 20}%, 0.7)\`;
          
          ctx.beginPath();
          ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.restore();
        }
      }
    }
  }

  // Enhanced glow pass for main curves using theme color
  ctx.shadowColor = \`hsla(\${baseHue}, \${baseSat}%, 80%, 0.6)\`;
  ctx.shadowBlur = 20;
  
  for (let layer = 0; layer < Math.min(layers, 2); layer++) {
    const layerPhase = (layer / layers) * frequency * Math.PI * 2 + time;
    const layerScale = scale * Math.pow(damping, layer);
    const layerAmplitude = amplitude * layerScale;
    
    const hueShift = (layer / layers) * 60 + time * 15; // Subtle hue variation
    const glowHue = (baseHue + hueShift) % 360;
    const glowSaturation = baseSat - (layer * 10);
    const glowLightness = 50 + Math.sin(layerPhase) * 20;
    
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = \`hsl(\${glowHue}, \${glowSaturation}%, \${glowLightness}%)\`;
    ctx.lineWidth = Math.max(2, layerAmplitude / 15);
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    const resolution = 60; // Lower resolution for glow
    let firstPoint = true;
    
    for (let i = 0; i <= resolution; i++) {
      const t = (i / resolution) * Math.PI * 2;
      const animatedT = t + (time + layer * 0.5) * frequency;
      
      const sinT = Math.sin(animatedT);
      const cosT = Math.cos(animatedT);
      const denominator = 1 + sinT * sinT;
      
      const x = centerX + layerAmplitude * cosT / denominator;
      const y = centerY + layerAmplitude * sinT * cosT / denominator;
      
      if (firstPoint) {
        ctx.moveTo(x, y);
        firstPoint = false;
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
    ctx.restore();
  }
  
  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;

  // Add subtle starfield background
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  for (let i = 0; i < 20; i++) {
    const x = (Math.sin(time * 0.1 + i) * 0.5 + 0.5) * width;
    const y = (Math.cos(time * 0.15 + i * 2) * 0.5 + 0.5) * height;
    const size = Math.sin(time * 0.5 + i) * 0.5 + 1;
    
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}`;