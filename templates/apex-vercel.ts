// 🌊 Apex (Vercel-style)
const PARAMETERS = {
  backgroundColor: { type: 'color', default: "#000000", label: 'Background Color', category: 'Background' },
  backgroundType: { type: 'select', options: [{"value":"transparent","label":"Transparent"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "solid", label: 'Background Type', category: 'Background' },
  backgroundGradientStart: { type: 'color', default: "#000000", label: 'Gradient Start', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientEnd: { type: 'color', default: "#0a0a0a", label: 'Gradient End', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 0, label: 'Gradient Direction', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  fillType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "solid", label: 'Fill Type', category: 'Fill' },
  fillColor: { type: 'color', default: "#0070f3", label: 'Fill Color', category: 'Fill', showIf: (params)=>params.fillType === 'solid' },
  fillGradientStart: { type: 'color', default: "#0070f3", label: 'Gradient Start', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientEnd: { type: 'color', default: "#0051cc", label: 'Gradient End', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 90, label: 'Gradient Direction', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Fill Opacity', category: 'Fill', showIf: (params)=>params.fillType !== 'none' },
  strokeType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid"},{"value":"dashed","label":"Dashed"},{"value":"dotted","label":"Dotted"}], default: "solid", label: 'Stroke Type', category: 'Stroke' },
  strokeColor: { type: 'color', default: "#0051cc", label: 'Stroke Color', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeWidth: { type: 'slider', min: 0, max: 10, step: 0.5, default: 1, label: 'Stroke Width', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.2, label: 'Stroke Opacity', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  frequency: { type: 'slider', min: 0.1, max: 20, step: 0.1, default: 7, label: 'Wave Frequency', category: 'Wave' },
  amplitude: { type: 'slider', min: 0, max: 100, step: 1, default: 85, label: 'Wave Height', category: 'Wave' },
  complexity: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.05, label: 'Harmonics', category: 'Wave' },
  chaos: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.0, label: 'Randomness', category: 'Wave' },
  damping: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.98, label: 'Decay', category: 'Wave' },
  layers: { type: 'slider', min: 1, max: 8, step: 1, default: 1, label: 'Layers', category: 'Wave' },
  barCount: { type: 'slider', min: 20, max: 100, step: 5, default: 30, label: 'Number of Bars', category: 'Bars' },
  barSpacing: { type: 'slider', min: 0, max: 5, step: 1, default: 5, label: 'Bar Spacing', category: 'Bars' },
  sharpness: { type: 'slider', min: 0.1, max: 2, step: 0.1, default: 1.2, label: 'Triangle Sharpness', category: 'Bars' }
};

function applyUniversalBackground(ctx, width, height, params) {
  if (!params.backgroundType || params.backgroundType === 'transparent') return;
  
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
    gradient.addColorStop(1, params.backgroundGradientEnd || '#0a0a0a');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
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
  const fillColor = params.fillColor || '#0070f3';
  const strokeColor = params.strokeColor || '#0051cc';
  
  // Helper to convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };
  
  // Helper to convert hex to HSL
  const hexToHsl = (hex) => {
    const rgb = hexToRgb(hex);
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    
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

  const barCount = params.barCount || 30;
  const barSpacing = params.barSpacing || 5;
  const totalSpacing = (barCount - 1) * barSpacing;
  const barWidth = (width - totalSpacing - 60) / barCount; 
  const startX = 30;
  
  // Dynamic animated wave using simple sine calculations for performance
  for (let i = 0; i < barCount; i++) {
    const x = startX + i * (barWidth + barSpacing);
    const t = i / barCount;
    
    // Primary wave with animation
    const primaryWave = Math.sin((t * params.frequency * Math.PI * 2) + time * 2) * params.amplitude;
    
    // Secondary wave for complexity
    const secondaryWave = Math.sin((t * params.frequency * 4 * Math.PI * 2) + time * 3) * params.amplitude * 0.3;
    
    // Combine waves and ensure positive
    const combinedHeight = Math.abs(primaryWave + secondaryWave * params.complexity);
    const barHeight = Math.max(10, combinedHeight);
    
    // Use theme colors with intensity variations
    const [baseHue, baseSat, baseLum] = hexToHsl(fillColor);
    const intensity = (barHeight / params.amplitude);
    
    // Subtle hue shift based on position for visual interest
    const hueShift = (i / barCount) * 20 - 10; // ±10 degree shift
    const hue = (baseHue + hueShift + 360) % 360;
    
    // Dynamic saturation and lightness based on bar height
    const saturation = baseSat + intensity * 20;
    const lightness = baseLum + intensity * 30;
    
    // Create dynamic gradient per bar
    const gradient = ctx.createLinearGradient(x, height - barHeight, x, height);
    gradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness}%, 0.9)`);
    gradient.addColorStop(0.6, `hsla(${hue}, ${saturation * 0.8}%, ${lightness * 0.7}%, 0.7)`);
    gradient.addColorStop(1, `hsla(${hue}, ${saturation * 0.6}%, ${lightness * 0.4}%, 0.5)`);
    ctx.fillStyle = gradient;
    
    // Draw modern rounded bars instead of triangles
    ctx.beginPath();
    const centerY = height - barHeight;
    const radius = Math.min(barWidth / 2, 8);
    ctx.roundRect(x, centerY, barWidth, barHeight, [radius, radius, 0, 0]);
    ctx.fill();
    
    // Add glow effect for better visuals
    if (barHeight > 30) {
      ctx.shadowColor = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.6)`;
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 0;
      
      // Draw glow
      ctx.beginPath();
      ctx.roundRect(x, centerY, barWidth, barHeight, [radius, radius, 0, 0]);
      ctx.fill();
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    }
  }
  
  // Add subtle wave guide line
  ctx.beginPath();
  // Use stroke color with reduced opacity
  const strokeRgb = hexToRgb(strokeColor);
  ctx.strokeStyle = `rgba(${strokeRgb.r}, ${strokeRgb.g}, ${strokeRgb.b}, ${params.strokeOpacity || 0.2})`;
  ctx.lineWidth = params.strokeWidth || 1;
  for (let i = 0; i < barCount; i++) {
    const x = startX + i * (barWidth + barSpacing) + barWidth / 2;
    const t = i / barCount;
    const y = height - Math.abs(Math.sin((t * params.frequency * Math.PI * 2) + time * 2) * params.amplitude);
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
}

export const metadata = {
  name: "🌊 Apex (Vercel-style)",
  description: "Dynamic animated bars with theme-aware glowing gradients and smooth wave motion",
  defaultParams: {
    seed: "apex-vercel",
    frequency: 7,
    amplitude: 85,
    complexity: 0.05,
    chaos: 0.0,
    damping: 0.98,
    layers: 1,
    barCount: 30,
    barSpacing: 5,
    sharpness: 1.2
  }
};

export const id = 'apex-vercel';
export const name = "🌊 Apex (Vercel-style)";
export const description = "Dynamic animated bars with theme-aware glowing gradients and smooth wave motion";
export { drawVisualization };
export const defaultParams = {
  seed: "apex-vercel",
  frequency: 7,
  amplitude: 85,
  complexity: 0.05,
  chaos: 0.0,
  damping: 0.98,
  layers: 1,
  barCount: 30,
  barSpacing: 5,
  sharpness: 1.2
};
export const code = `// 🌊 Apex (Vercel-style)
const PARAMETERS = {
  backgroundColor: { type: 'color', default: "#000000", label: 'Background Color', category: 'Background' },
  backgroundType: { type: 'select', options: [{"value":"transparent","label":"Transparent"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "solid", label: 'Background Type', category: 'Background' },
  backgroundGradientStart: { type: 'color', default: "#000000", label: 'Gradient Start', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientEnd: { type: 'color', default: "#0a0a0a", label: 'Gradient End', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 0, label: 'Gradient Direction', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  fillType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "solid", label: 'Fill Type', category: 'Fill' },
  fillColor: { type: 'color', default: "#0070f3", label: 'Fill Color', category: 'Fill', showIf: (params)=>params.fillType === 'solid' },
  fillGradientStart: { type: 'color', default: "#0070f3", label: 'Gradient Start', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientEnd: { type: 'color', default: "#0051cc", label: 'Gradient End', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 90, label: 'Gradient Direction', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Fill Opacity', category: 'Fill', showIf: (params)=>params.fillType !== 'none' },
  strokeType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid"},{"value":"dashed","label":"Dashed"},{"value":"dotted","label":"Dotted"}], default: "solid", label: 'Stroke Type', category: 'Stroke' },
  strokeColor: { type: 'color', default: "#0051cc", label: 'Stroke Color', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeWidth: { type: 'slider', min: 0, max: 10, step: 0.5, default: 1, label: 'Stroke Width', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.2, label: 'Stroke Opacity', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  frequency: { type: 'slider', min: 0.1, max: 20, step: 0.1, default: 7, label: 'Wave Frequency', category: 'Wave' },
  amplitude: { type: 'slider', min: 0, max: 100, step: 1, default: 85, label: 'Wave Height', category: 'Wave' },
  complexity: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.05, label: 'Harmonics', category: 'Wave' },
  chaos: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.0, label: 'Randomness', category: 'Wave' },
  damping: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.98, label: 'Decay', category: 'Wave' },
  layers: { type: 'slider', min: 1, max: 8, step: 1, default: 1, label: 'Layers', category: 'Wave' },
  barCount: { type: 'slider', min: 20, max: 100, step: 5, default: 30, label: 'Number of Bars', category: 'Bars' },
  barSpacing: { type: 'slider', min: 0, max: 5, step: 1, default: 5, label: 'Bar Spacing', category: 'Bars' },
  sharpness: { type: 'slider', min: 0.1, max: 2, step: 0.1, default: 1.2, label: 'Triangle Sharpness', category: 'Bars' }
};

function applyUniversalBackground(ctx, width, height, params) {
  if (!params.backgroundType || params.backgroundType === 'transparent') return;
  
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
    gradient.addColorStop(1, params.backgroundGradientEnd || '#0a0a0a');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
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
  const fillColor = params.fillColor || '#0070f3';
  const strokeColor = params.strokeColor || '#0051cc';
  
  // Helper to convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };
  
  // Helper to convert hex to HSL
  const hexToHsl = (hex) => {
    const rgb = hexToRgb(hex);
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    
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

  const barCount = params.barCount || 30;
  const barSpacing = params.barSpacing || 5;
  const totalSpacing = (barCount - 1) * barSpacing;
  const barWidth = (width - totalSpacing - 60) / barCount; 
  const startX = 30;
  
  // Dynamic animated wave using simple sine calculations for performance
  for (let i = 0; i < barCount; i++) {
    const x = startX + i * (barWidth + barSpacing);
    const t = i / barCount;
    
    // Primary wave with animation
    const primaryWave = Math.sin((t * params.frequency * Math.PI * 2) + time * 2) * params.amplitude;
    
    // Secondary wave for complexity
    const secondaryWave = Math.sin((t * params.frequency * 4 * Math.PI * 2) + time * 3) * params.amplitude * 0.3;
    
    // Combine waves and ensure positive
    const combinedHeight = Math.abs(primaryWave + secondaryWave * params.complexity);
    const barHeight = Math.max(10, combinedHeight);
    
    // Use theme colors with intensity variations
    const [baseHue, baseSat, baseLum] = hexToHsl(fillColor);
    const intensity = (barHeight / params.amplitude);
    
    // Subtle hue shift based on position for visual interest
    const hueShift = (i / barCount) * 20 - 10; // ±10 degree shift
    const hue = (baseHue + hueShift + 360) % 360;
    
    // Dynamic saturation and lightness based on bar height
    const saturation = baseSat + intensity * 20;
    const lightness = baseLum + intensity * 30;
    
    // Create dynamic gradient per bar
    const gradient = ctx.createLinearGradient(x, height - barHeight, x, height);
    gradient.addColorStop(0, \`hsla(\${hue}, \${saturation}%, \${lightness}%, 0.9)\`);
    gradient.addColorStop(0.6, \`hsla(\${hue}, \${saturation * 0.8}%, \${lightness * 0.7}%, 0.7)\`);
    gradient.addColorStop(1, \`hsla(\${hue}, \${saturation * 0.6}%, \${lightness * 0.4}%, 0.5)\`);
    ctx.fillStyle = gradient;
    
    // Draw modern rounded bars instead of triangles
    ctx.beginPath();
    const centerY = height - barHeight;
    const radius = Math.min(barWidth / 2, 8);
    ctx.roundRect(x, centerY, barWidth, barHeight, [radius, radius, 0, 0]);
    ctx.fill();
    
    // Add glow effect for better visuals
    if (barHeight > 30) {
      ctx.shadowColor = \`hsla(\${hue}, \${saturation}%, \${lightness}%, 0.6)\`;
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 0;
      
      // Draw glow
      ctx.beginPath();
      ctx.roundRect(x, centerY, barWidth, barHeight, [radius, radius, 0, 0]);
      ctx.fill();
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    }
  }
  
  // Add subtle wave guide line
  ctx.beginPath();
  // Use stroke color with reduced opacity
  const strokeRgb = hexToRgb(strokeColor);
  ctx.strokeStyle = \`rgba(\${strokeRgb.r}, \${strokeRgb.g}, \${strokeRgb.b}, \${params.strokeOpacity || 0.2})\`;
  ctx.lineWidth = params.strokeWidth || 1;
  for (let i = 0; i < barCount; i++) {
    const x = startX + i * (barWidth + barSpacing) + barWidth / 2;
    const t = i / barCount;
    const y = height - Math.abs(Math.sin((t * params.frequency * Math.PI * 2) + time * 2) * params.amplitude);
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
}`;