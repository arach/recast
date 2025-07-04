// ◆ Prism (Google-style)
const PARAMETERS = {
  backgroundColor: { type: 'color', default: "#ffffff", label: 'Background Color', category: 'Background' },
  backgroundType: { type: 'select', options: [{"value":"transparent","label":"Transparent"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "solid", label: 'Background Type', category: 'Background' },
  backgroundGradientStart: { type: 'color', default: "#ffffff", label: 'Gradient Start', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientEnd: { type: 'color', default: "#f8f9fa", label: 'Gradient End', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 0, label: 'Gradient Direction', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  fillType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "solid", label: 'Fill Type', category: 'Fill' },
  fillColor: { type: 'color', default: "#4285F4", label: 'Fill Color', category: 'Fill', showIf: (params)=>params.fillType === 'solid' },
  fillGradientStart: { type: 'color', default: "#4285F4", label: 'Gradient Start', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientEnd: { type: 'color', default: "#1976d2", label: 'Gradient End', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 45, label: 'Gradient Direction', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Fill Opacity', category: 'Fill', showIf: (params)=>params.fillType !== 'none' },
  strokeType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid"},{"value":"dashed","label":"Dashed"},{"value":"dotted","label":"Dotted"}], default: "solid", label: 'Stroke Type', category: 'Stroke' },
  strokeColor: { type: 'color', default: "#EA4335", label: 'Stroke Color', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeWidth: { type: 'slider', min: 0, max: 10, step: 0.5, default: 3, label: 'Stroke Width', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Stroke Opacity', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  frequency: { type: 'slider', min: 0.1, max: 20, step: 0.1, default: 3, label: 'Wave Frequency', category: 'Wave' },
  amplitude: { type: 'slider', min: 0, max: 100, step: 1, default: 50, label: 'Wave Height', category: 'Wave' },
  complexity: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.3, label: 'Harmonics', category: 'Wave' },
  chaos: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.1, label: 'Chaos (Jitter)', category: 'Wave' },
  damping: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.9, label: 'Decay', category: 'Wave' },
  layers: { type: 'slider', min: 1, max: 8, step: 1, default: 2, label: 'Layers', category: 'Wave' },
  radius: { type: 'slider', min: 10, max: 200, step: 1, default: 50, label: 'Base Radius', category: 'Geometry' },
  scale: { type: 'slider', min: 0.1, max: 3, step: 0.1, default: 1, label: 'Overall Scale', category: 'Geometry' },
  symmetry: { type: 'slider', min: 1, max: 12, step: 1, default: 6, label: 'Symmetry Segments', category: 'Geometry' },
  colorMode: { type: 'select', options: [{"value":"duotone","label":"Duotone"},{"value":"layered HSL","label":"Layered HSL"},{"value":"monochrome","label":"Monochrome"},{"value":"theme","label":"Theme"}], default: 'theme', label: 'Color Mode', category: 'Colors' },
  backgroundOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Background Opacity', category: 'Background', showIf: (params)=>params.backgroundType !== 'transparent' }
};

function applyUniversalBackground(ctx, width, height, params) {
  if (!params.backgroundType || params.backgroundType === 'transparent') return;
  
  ctx.save();
  ctx.globalAlpha = params.backgroundOpacity ?? 1;
  
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
    gradient.addColorStop(1, params.backgroundGradientEnd || '#f8f9fa');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
  
  ctx.restore();
}

function getColor(params, layer, time) {
  // Use theme colors as defaults
  const primaryColor = params.primaryColor || params.fillColor || '#4285F4';
  const secondaryColor = params.secondaryColor || params.strokeColor || '#EA4335';
  
  if (params.colorMode === 'theme') {
    // Use theme colors directly
    return layer % 2 === 0 ? (params.fillColor || '#4285F4') : (params.strokeColor || '#EA4335');
  } else if (params.colorMode === 'duotone') {
    return layer % 2 === 0 ? primaryColor : secondaryColor;
  } else if (params.colorMode === 'monochrome') {
    return primaryColor;
  } else {
    const hue = (layer / params.layers) * 360;
    return `hsl(${hue}, 70%, 50%)`;
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

  const centerX = width / 2;
  const centerY = height / 2;
  const segments = params.symmetry;
  
  // Extract opacity values with defaults
  const strokeOpacity = params.strokeOpacity ?? 1;
  const fillOpacity = params.fillOpacity ?? 1;
  
  // Apply overall scale
  const scale = params.scale ?? 1;

  for (let layer = 0; layer < params.layers; layer++) {
    const baseRadius = params.radius * (1 + layer * 0.25) * scale;
    const angleStep = (Math.PI * 2) / segments;
    const color = getColor(params, layer, time);
    
    // Save context before applying opacity
    ctx.save();
    
    // Apply stroke or fill based on parameters
    if (params.strokeType !== 'none') {
      ctx.strokeStyle = color;
      ctx.lineWidth = params.strokeWidth;
      ctx.globalAlpha = (1 - layer * 0.1) * strokeOpacity;
      
      ctx.beginPath();
      for (let i = 0; i <= segments; i++) {
        const angle = i * angleStep;
        const jitter = (Math.random() - 0.5) * params.chaos * 10;
        const radius = baseRadius + jitter + params.amplitude * Math.sin(time + i);
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }
    
    // Also support fill if fillType is not 'none'
    if (params.fillType !== 'none') {
      ctx.fillStyle = color;
      ctx.globalAlpha = (1 - layer * 0.1) * fillOpacity;
      
      ctx.beginPath();
      for (let i = 0; i <= segments; i++) {
        const angle = i * angleStep;
        const jitter = (Math.random() - 0.5) * params.chaos * 10;
        const radius = baseRadius + jitter + params.amplitude * Math.sin(time + i);
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    }
    
    // Restore context after drawing
    ctx.restore();
  }
}

export const metadata = {
  name: "◆ Prism (Google-style)",
  description: "Structured geometric layers with theme-aware colors and controlled symmetry",
  defaultParams: {
    seed: "prism-google",
    frequency: 3,
    amplitude: 50,
    complexity: 0.3,
    chaos: 0.1,
    damping: 0.9,
    layers: 2,
    radius: 50,
    scale: 1,
    symmetry: 6,
    colorMode: "theme"
  }
};

export const id = 'prism-google';
export const name = "◆ Prism (Google-style)";
export const description = "Structured geometric layers with theme-aware colors and controlled symmetry";
export { drawVisualization };
export const defaultParams = {
  seed: "prism-google",
  frequency: 3,
  amplitude: 50,
  complexity: 0.3,
  chaos: 0.1,
  damping: 0.9,
  layers: 2,
  radius: 50,
  symmetry: 6,
  colorMode: "theme"
};
export const code = `// ◆ Prism (Google-style)
const PARAMETERS = {
  backgroundColor: { type: 'color', default: "#ffffff", label: 'Background Color', category: 'Background' },
  backgroundType: { type: 'select', options: [{"value":"transparent","label":"Transparent"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "solid", label: 'Background Type', category: 'Background' },
  backgroundGradientStart: { type: 'color', default: "#ffffff", label: 'Gradient Start', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientEnd: { type: 'color', default: "#f8f9fa", label: 'Gradient End', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 0, label: 'Gradient Direction', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  fillType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "solid", label: 'Fill Type', category: 'Fill' },
  fillColor: { type: 'color', default: "#4285F4", label: 'Fill Color', category: 'Fill', showIf: (params)=>params.fillType === 'solid' },
  fillGradientStart: { type: 'color', default: "#4285F4", label: 'Gradient Start', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientEnd: { type: 'color', default: "#1976d2", label: 'Gradient End', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 45, label: 'Gradient Direction', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Fill Opacity', category: 'Fill', showIf: (params)=>params.fillType !== 'none' },
  strokeType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid"},{"value":"dashed","label":"Dashed"},{"value":"dotted","label":"Dotted"}], default: "solid", label: 'Stroke Type', category: 'Stroke' },
  strokeColor: { type: 'color', default: "#EA4335", label: 'Stroke Color', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeWidth: { type: 'slider', min: 0, max: 10, step: 0.5, default: 3, label: 'Stroke Width', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Stroke Opacity', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  frequency: { type: 'slider', min: 0.1, max: 20, step: 0.1, default: 3, label: 'Wave Frequency', category: 'Wave' },
  amplitude: { type: 'slider', min: 0, max: 100, step: 1, default: 50, label: 'Wave Height', category: 'Wave' },
  complexity: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.3, label: 'Harmonics', category: 'Wave' },
  chaos: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.1, label: 'Chaos (Jitter)', category: 'Wave' },
  damping: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.9, label: 'Decay', category: 'Wave' },
  layers: { type: 'slider', min: 1, max: 8, step: 1, default: 2, label: 'Layers', category: 'Wave' },
  radius: { type: 'slider', min: 10, max: 200, step: 1, default: 50, label: 'Base Radius', category: 'Geometry' },
  scale: { type: 'slider', min: 0.1, max: 3, step: 0.1, default: 1, label: 'Overall Scale', category: 'Geometry' },
  symmetry: { type: 'slider', min: 1, max: 12, step: 1, default: 6, label: 'Symmetry Segments', category: 'Geometry' },
  colorMode: { type: 'select', options: [{"value":"duotone","label":"Duotone"},{"value":"layered HSL","label":"Layered HSL"},{"value":"monochrome","label":"Monochrome"},{"value":"theme","label":"Theme"}], default: 'theme', label: 'Color Mode', category: 'Colors' },
  backgroundOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Background Opacity', category: 'Background', showIf: (params)=>params.backgroundType !== 'transparent' }
};

function applyUniversalBackground(ctx, width, height, params) {
  if (!params.backgroundType || params.backgroundType === 'transparent') return;
  
  ctx.save();
  ctx.globalAlpha = params.backgroundOpacity ?? 1;
  
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
    gradient.addColorStop(1, params.backgroundGradientEnd || '#f8f9fa');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
  
  ctx.restore();
}

function getColor(params, layer, time) {
  // Use theme colors as defaults
  const primaryColor = params.primaryColor || params.fillColor || '#4285F4';
  const secondaryColor = params.secondaryColor || params.strokeColor || '#EA4335';
  
  if (params.colorMode === 'theme') {
    // Use theme colors directly
    return layer % 2 === 0 ? (params.fillColor || '#4285F4') : (params.strokeColor || '#EA4335');
  } else if (params.colorMode === 'duotone') {
    return layer % 2 === 0 ? primaryColor : secondaryColor;
  } else if (params.colorMode === 'monochrome') {
    return primaryColor;
  } else {
    const hue = (layer / params.layers) * 360;
    return \`hsl(\${hue}, 70%, 50%)\`;
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

  const centerX = width / 2;
  const centerY = height / 2;
  const segments = params.symmetry;
  
  // Extract opacity values with defaults
  const strokeOpacity = params.strokeOpacity ?? 1;
  const fillOpacity = params.fillOpacity ?? 1;
  
  // Apply overall scale
  const scale = params.scale ?? 1;

  for (let layer = 0; layer < params.layers; layer++) {
    const baseRadius = params.radius * (1 + layer * 0.25) * scale;
    const angleStep = (Math.PI * 2) / segments;
    const color = getColor(params, layer, time);
    
    // Save context before applying opacity
    ctx.save();
    
    // Apply stroke or fill based on parameters
    if (params.strokeType !== 'none') {
      ctx.strokeStyle = color;
      ctx.lineWidth = params.strokeWidth;
      ctx.globalAlpha = (1 - layer * 0.1) * strokeOpacity;
      
      ctx.beginPath();
      for (let i = 0; i <= segments; i++) {
        const angle = i * angleStep;
        const jitter = (Math.random() - 0.5) * params.chaos * 10;
        const radius = baseRadius + jitter + params.amplitude * Math.sin(time + i);
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }
    
    // Also support fill if fillType is not 'none'
    if (params.fillType !== 'none') {
      ctx.fillStyle = color;
      ctx.globalAlpha = (1 - layer * 0.1) * fillOpacity;
      
      ctx.beginPath();
      for (let i = 0; i <= segments; i++) {
        const angle = i * angleStep;
        const jitter = (Math.random() - 0.5) * params.chaos * 10;
        const radius = baseRadius + jitter + params.amplitude * Math.sin(time + i);
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
    }
    
    // Restore context after drawing
    ctx.restore();
  }
}`;