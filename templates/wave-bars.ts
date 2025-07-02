// 🌊 Wave Bars
const PARAMETERS = {
  backgroundColor: { type: 'color', default: "#ffffff", label: 'Background Color', category: 'Background' },
  backgroundType: { type: 'select', options: [{"value":"transparent","label":"Transparent"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "transparent", label: 'Background Type', category: 'Background' },
  backgroundGradientStart: { type: 'color', default: "#ffffff", label: 'Gradient Start', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientEnd: { type: 'color', default: "#f0f0f0", label: 'Gradient End', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 0, label: 'Gradient Direction', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  fillType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "solid", label: 'Fill Type', category: 'Fill' },
  fillColor: { type: 'color', default: "#3b82f6", label: 'Fill Color', category: 'Fill', showIf: (params)=>params.fillType === 'solid' },
  fillGradientStart: { type: 'color', default: "#3b82f6", label: 'Gradient Start', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientEnd: { type: 'color', default: "#1d4ed8", label: 'Gradient End', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 45, label: 'Gradient Direction', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Fill Opacity', category: 'Fill', showIf: (params)=>params.fillType !== 'none' },
  strokeType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid"},{"value":"dashed","label":"Dashed"},{"value":"dotted","label":"Dotted"}], default: "solid", label: 'Stroke Type', category: 'Stroke' },
  strokeColor: { type: 'color', default: "#1e40af", label: 'Stroke Color', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeWidth: { type: 'slider', min: 0, max: 10, step: 0.5, default: 2, label: 'Stroke Width', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Stroke Opacity', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  frequency: { type: 'slider', min: 0.1, max: 20, step: 0.1, default: 3, label: 'Wave Frequency' },
  amplitude: { type: 'slider', min: 0, max: 100, step: 1, default: 50, label: 'Wave Height' },
  complexity: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.3, label: 'Harmonics' },
  chaos: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.1, label: 'Randomness' },
  damping: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.9, label: 'Layer Decay' },
  layers: { type: 'slider', min: 1, max: 5, step: 1, default: 2, label: 'Layers' },
  barCount: { type: 'slider', min: 20, max: 100, step: 5, default: 40, label: 'Number of Bars' },
  barSpacing: { type: 'slider', min: 0, max: 10, step: 1, default: 2, label: 'Bar Spacing' },
  colorMode: { type: 'select', options: [{"value":"spectrum","label":"Rainbow Spectrum"},{"value":"theme","label":"Use Theme Colors"},{"value":"toneShift","label":"Theme Tone Shift"}], default: "spectrum", label: 'Color Mode' }
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
  const fillColor = params.fillColor || '#3b82f6';
  const strokeColor = params.strokeColor || '#1e40af';
  const colorMode = params.colorMode || 'spectrum';
  
  // Helper to create color variations
  const adjustColor = (color, lightness) => {
    // Simple hex to RGB conversion
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Adjust lightness
    const factor = lightness > 0 ? lightness : 0;
    const newR = Math.min(255, r + (255 - r) * factor);
    const newG = Math.min(255, g + (255 - g) * factor);
    const newB = Math.min(255, b + (255 - b) * factor);
    
    return `rgb(${Math.round(newR)}, ${Math.round(newG)}, ${Math.round(newB)})`;
  };
  
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
  
  // Yesterday's direct approach - simple sine calculations (high performance)
  const barWidth = (width - params.barSpacing * (params.barCount - 1)) / params.barCount;
  
  for (let i = 0; i < params.barCount; i++) {
    const x = i * (barWidth + params.barSpacing);
    
    // Simple sine wave for center line
    const t = i / params.barCount;
    const waveY = height / 2 + Math.sin((t * params.frequency * Math.PI * 2) + time) * params.amplitude;
    
    // Simple sine wave for bar height
    const barHeight = Math.abs(Math.sin((t * params.frequency * 3 * Math.PI * 2) + time * 2) * 40) + 20;
    
    // Create gradient based on color mode
    const gradient = ctx.createLinearGradient(x, waveY - barHeight/2, x, waveY + barHeight/2);
    
    if (colorMode === 'spectrum') {
      // Original rainbow spectrum
      const hue = (i / params.barCount) * 360;
      gradient.addColorStop(0, `hsla(${hue}, 70%, 60%, 0.9)`);
      gradient.addColorStop(0.5, `hsla(${hue}, 80%, 50%, 1)`);
      gradient.addColorStop(1, `hsla(${hue}, 70%, 60%, 0.9)`);
    } else if (colorMode === 'theme') {
      // Use theme colors with lightness variations
      const phase = (i / params.barCount) * Math.PI * 2;
      const lightness = 0.3 + Math.sin(phase + time) * 0.2;
      gradient.addColorStop(0, adjustColor(fillColor, lightness));
      gradient.addColorStop(0.5, fillColor);
      gradient.addColorStop(1, adjustColor(fillColor, lightness));
    } else if (colorMode === 'toneShift') {
      // Shift hue based on theme color
      const [baseHue, baseSat, baseLum] = hexToHsl(fillColor);
      const hueShift = (i / params.barCount) * 120 - 60; // Shift ±60 degrees
      const hue = (baseHue + hueShift + 360) % 360;
      gradient.addColorStop(0, `hsla(${hue}, ${baseSat}%, ${baseLum + 10}%, 0.9)`);
      gradient.addColorStop(0.5, `hsla(${hue}, ${baseSat}%, ${baseLum}%, 1)`);
      gradient.addColorStop(1, `hsla(${hue}, ${baseSat}%, ${baseLum + 10}%, 0.9)`);
    }
    
    ctx.fillStyle = gradient;
    
    const radius = barWidth / 3;
    ctx.beginPath();
    ctx.roundRect(x, waveY - barHeight/2, barWidth, barHeight, radius);
    ctx.fill();
    
    if (barHeight > 25) {
      ctx.beginPath();
      ctx.arc(x + barWidth/2, waveY - barHeight/2 - 4, barWidth/2.5, 0, Math.PI * 2);
      ctx.arc(x + barWidth/2, waveY + barHeight/2 + 4, barWidth/2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Simple wave guide line
  ctx.beginPath();
  // Use stroke color with reduced opacity for guide line
  const strokeRgb = strokeColor.startsWith('#') ? 
    `rgba(${parseInt(strokeColor.substr(1,2), 16)}, ${parseInt(strokeColor.substr(3,2), 16)}, ${parseInt(strokeColor.substr(5,2), 16)}, 0.15)` :
    strokeColor.replace(/rgb\(/, 'rgba(').replace(/\)/, ', 0.15)');
  ctx.strokeStyle = strokeRgb;
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  for (let i = 0; i < params.barCount; i++) {
    const x = i * (barWidth + params.barSpacing);
    const t = i / params.barCount;
    const y = height / 2 + Math.sin((t * params.frequency * Math.PI * 2) + time) * params.amplitude;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  ctx.setLineDash([]);
}

export const metadata = {
  name: "🌊 Wave Bars",
  description: "Audio bars that follow wave patterns with customizable color modes",
  defaultParams: {
    seed: "wave-bars",
    frequency: 3,
    amplitude: 50,
    complexity: 0.3,
    chaos: 0.1,
    damping: 0.9,
    layers: 2,
    barCount: 40,
    barSpacing: 2,
    colorMode: 'spectrum'
  }
};

export const id = 'wave-bars';
export const name = "🌊 Wave Bars";
export const description = "Audio bars that follow wave patterns with customizable color modes";
export { drawVisualization };
export const defaultParams = {
  seed: "wave-bars",
  frequency: 3,
  amplitude: 50,
  complexity: 0.3,
  chaos: 0.1,
  damping: 0.9,
  layers: 2,
  barCount: 40,
  barSpacing: 2,
  colorMode: 'spectrum'
};
export const code = `// 🌊 Wave Bars
const PARAMETERS = {
  backgroundColor: { type: 'color', default: "#ffffff", label: 'Background Color', category: 'Background' },
  backgroundType: { type: 'select', options: [{"value":"transparent","label":"Transparent"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "transparent", label: 'Background Type', category: 'Background' },
  backgroundGradientStart: { type: 'color', default: "#ffffff", label: 'Gradient Start', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientEnd: { type: 'color', default: "#f0f0f0", label: 'Gradient End', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 0, label: 'Gradient Direction', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  fillType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "solid", label: 'Fill Type', category: 'Fill' },
  fillColor: { type: 'color', default: "#3b82f6", label: 'Fill Color', category: 'Fill', showIf: (params)=>params.fillType === 'solid' },
  fillGradientStart: { type: 'color', default: "#3b82f6", label: 'Gradient Start', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientEnd: { type: 'color', default: "#1d4ed8", label: 'Gradient End', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 45, label: 'Gradient Direction', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Fill Opacity', category: 'Fill', showIf: (params)=>params.fillType !== 'none' },
  strokeType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid"},{"value":"dashed","label":"Dashed"},{"value":"dotted","label":"Dotted"}], default: "solid", label: 'Stroke Type', category: 'Stroke' },
  strokeColor: { type: 'color', default: "#1e40af", label: 'Stroke Color', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeWidth: { type: 'slider', min: 0, max: 10, step: 0.5, default: 2, label: 'Stroke Width', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Stroke Opacity', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  frequency: { type: 'slider', min: 0.1, max: 20, step: 0.1, default: 3, label: 'Wave Frequency' },
  amplitude: { type: 'slider', min: 0, max: 100, step: 1, default: 50, label: 'Wave Height' },
  complexity: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.3, label: 'Harmonics' },
  chaos: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.1, label: 'Randomness' },
  damping: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.9, label: 'Layer Decay' },
  layers: { type: 'slider', min: 1, max: 5, step: 1, default: 2, label: 'Layers' },
  barCount: { type: 'slider', min: 20, max: 100, step: 5, default: 40, label: 'Number of Bars' },
  barSpacing: { type: 'slider', min: 0, max: 10, step: 1, default: 2, label: 'Bar Spacing' },
  colorMode: { type: 'select', options: [{"value":"spectrum","label":"Rainbow Spectrum"},{"value":"theme","label":"Use Theme Colors"},{"value":"toneShift","label":"Theme Tone Shift"}], default: "spectrum", label: 'Color Mode' }
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
  const fillColor = params.fillColor || '#3b82f6';
  const strokeColor = params.strokeColor || '#1e40af';
  const colorMode = params.colorMode || 'spectrum';
  
  // Helper to create color variations
  const adjustColor = (color, lightness) => {
    // Simple hex to RGB conversion
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Adjust lightness
    const factor = lightness > 0 ? lightness : 0;
    const newR = Math.min(255, r + (255 - r) * factor);
    const newG = Math.min(255, g + (255 - g) * factor);
    const newB = Math.min(255, b + (255 - b) * factor);
    
    return \`rgb(\${Math.round(newR)}, \${Math.round(newG)}, \${Math.round(newB)})\`;
  };
  
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
  
  // Yesterday's direct approach - simple sine calculations (high performance)
  const barWidth = (width - params.barSpacing * (params.barCount - 1)) / params.barCount;
  
  for (let i = 0; i < params.barCount; i++) {
    const x = i * (barWidth + params.barSpacing);
    
    // Simple sine wave for center line
    const t = i / params.barCount;
    const waveY = height / 2 + Math.sin((t * params.frequency * Math.PI * 2) + time) * params.amplitude;
    
    // Simple sine wave for bar height
    const barHeight = Math.abs(Math.sin((t * params.frequency * 3 * Math.PI * 2) + time * 2) * 40) + 20;
    
    // Create gradient based on color mode
    const gradient = ctx.createLinearGradient(x, waveY - barHeight/2, x, waveY + barHeight/2);
    
    if (colorMode === 'spectrum') {
      // Original rainbow spectrum
      const hue = (i / params.barCount) * 360;
      gradient.addColorStop(0, \`hsla(\${hue}, 70%, 60%, 0.9)\`);
      gradient.addColorStop(0.5, \`hsla(\${hue}, 80%, 50%, 1)\`);
      gradient.addColorStop(1, \`hsla(\${hue}, 70%, 60%, 0.9)\`);
    } else if (colorMode === 'theme') {
      // Use theme colors with lightness variations
      const phase = (i / params.barCount) * Math.PI * 2;
      const lightness = 0.3 + Math.sin(phase + time) * 0.2;
      gradient.addColorStop(0, adjustColor(fillColor, lightness));
      gradient.addColorStop(0.5, fillColor);
      gradient.addColorStop(1, adjustColor(fillColor, lightness));
    } else if (colorMode === 'toneShift') {
      // Shift hue based on theme color
      const [baseHue, baseSat, baseLum] = hexToHsl(fillColor);
      const hueShift = (i / params.barCount) * 120 - 60; // Shift ±60 degrees
      const hue = (baseHue + hueShift + 360) % 360;
      gradient.addColorStop(0, \`hsla(\${hue}, \${baseSat}%, \${baseLum + 10}%, 0.9)\`);
      gradient.addColorStop(0.5, \`hsla(\${hue}, \${baseSat}%, \${baseLum}%, 1)\`);
      gradient.addColorStop(1, \`hsla(\${hue}, \${baseSat}%, \${baseLum + 10}%, 0.9)\`);
    }
    
    ctx.fillStyle = gradient;
    
    const radius = barWidth / 3;
    ctx.beginPath();
    ctx.roundRect(x, waveY - barHeight/2, barWidth, barHeight, radius);
    ctx.fill();
    
    if (barHeight > 25) {
      ctx.beginPath();
      ctx.arc(x + barWidth/2, waveY - barHeight/2 - 4, barWidth/2.5, 0, Math.PI * 2);
      ctx.arc(x + barWidth/2, waveY + barHeight/2 + 4, barWidth/2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  // Simple wave guide line
  ctx.beginPath();
  // Use stroke color with reduced opacity for guide line
  const strokeRgb = strokeColor.startsWith('#') ? 
    \`rgba(\${parseInt(strokeColor.substr(1,2), 16)}, \${parseInt(strokeColor.substr(3,2), 16)}, \${parseInt(strokeColor.substr(5,2), 16)}, 0.15)\` :
    strokeColor.replace(/rgb\\(/, 'rgba(').replace(/\\)/, ', 0.15)');
  ctx.strokeStyle = strokeRgb;
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  for (let i = 0; i < params.barCount; i++) {
    const x = i * (barWidth + params.barSpacing);
    const t = i / params.barCount;
    const y = height / 2 + Math.sin((t * params.frequency * Math.PI * 2) + time) * params.amplitude;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  ctx.setLineDash([]);
}`;