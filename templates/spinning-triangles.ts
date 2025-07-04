// 🔺 Spinning Triangles
const PARAMETERS = {
  backgroundColor: { type: 'color', default: "#0a0a0a", label: 'Background Color', category: 'Background' },
  backgroundType: { type: 'select', options: [{"value":"transparent","label":"Transparent"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "solid", label: 'Background Type', category: 'Background' },
  backgroundGradientStart: { type: 'color', default: "#0a0a0a", label: 'Gradient Start', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientEnd: { type: 'color', default: "#1a1a1a", label: 'Gradient End', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 0, label: 'Gradient Direction', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  fillType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "solid", label: 'Fill Type', category: 'Fill' },
  fillColor: { type: 'color', default: "#4080ff", label: 'Fill Color', category: 'Fill', showIf: (params)=>params.fillType === 'solid' },
  fillGradientStart: { type: 'color', default: "#4080ff", label: 'Gradient Start', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientEnd: { type: 'color', default: "#80ff40", label: 'Gradient End', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 90, label: 'Gradient Direction', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.3, label: 'Fill Opacity', category: 'Fill', showIf: (params)=>params.fillType !== 'none' },
  strokeType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid"},{"value":"dashed","label":"Dashed"},{"value":"dotted","label":"Dotted"}], default: "solid", label: 'Stroke Type', category: 'Stroke' },
  strokeColor: { type: 'color', default: "#80c0ff", label: 'Stroke Color', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeWidth: { type: 'slider', min: 0, max: 10, step: 0.5, default: 2, label: 'Stroke Width', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Stroke Opacity', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  frequency: { type: 'slider', min: 0.1, max: 10, step: 0.1, default: 3, label: 'Spin Speed', category: 'Wave' },
  amplitude: { type: 'slider', min: 10, max: 100, step: 5, default: 40, label: 'Triangle Size', category: 'Wave' },
  complexity: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.4, label: 'Constellation', category: 'Wave' },
  chaos: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.2, label: 'Randomness', category: 'Wave' },
  damping: { type: 'slider', min: 0.5, max: 1, step: 0.01, default: 0.85, label: 'Layer Decay', category: 'Wave' },
  layers: { type: 'slider', min: 1, max: 8, step: 1, default: 3, label: 'Layers', category: 'Wave' },
  sides: { type: 'slider', min: 3, max: 12, step: 1, default: 3, label: 'Polygon Sides', category: 'Shape' },
  rotation: { type: 'slider', min: 0, max: 360, step: 15, default: 0, label: 'Base Rotation', category: 'Shape' },
  backgroundOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Background Opacity', category: 'Background', showIf: (params)=>params.backgroundType !== 'transparent' }
};

function applyUniversalBackground(ctx, width, height, params) {
  if (!params.backgroundType || params.backgroundType === 'transparent') return;
  
  ctx.save();
  ctx.globalAlpha = params.backgroundOpacity ?? 1;
  
  if (params.backgroundType === 'solid') {
    ctx.fillStyle = params.backgroundColor || '#0a0a0a';
    ctx.fillRect(0, 0, width, height);
  } else if (params.backgroundType === 'gradient') {
    const direction = (params.backgroundGradientDirection || 0) * (Math.PI / 180);
    const x1 = width / 2 - Math.cos(direction) * width / 2;
    const y1 = height / 2 - Math.sin(direction) * height / 2;
    const x2 = width / 2 + Math.cos(direction) * width / 2;
    const y2 = height / 2 + Math.sin(direction) * height / 2;
    
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, params.backgroundGradientStart || '#0a0a0a');
    gradient.addColorStop(1, params.backgroundGradientEnd || '#1a1a1a');
    
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
    
    // Use theme colors if available
    const fillColor = params.fillType === 'solid' ? params.fillColor : null;
    const strokeColor = params.strokeType !== 'none' ? params.strokeColor : null;
    
    // Create triangle path
    const rotationRad = ((layerRotation + chaosRotation) * Math.PI) / 180;
    const angleStep = (Math.PI * 2) / sides;
    
    ctx.save();
    
    // Draw filled triangle
    if (params.fillType !== 'none') {
      ctx.globalAlpha = (0.8 - (layer * 0.1)) * (params.fillOpacity || 0.3);
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
      ctx.globalAlpha = (0.8 - (layer * 0.1)) * (params.strokeOpacity || 1);
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
    
    // Extract stroke opacity with default
    const strokeOpacity = params.strokeOpacity ?? 1;
    
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

export const metadata = {
  name: "🔺 Spinning Triangles",
  description: "Geometric triangular patterns with orbital motion and constellation effects",
  defaultParams: {
    seed: "spinning-triangles",
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

export { drawVisualization };
export const id = 'spinning-triangles';
export const name = "🔺 Spinning Triangles";
export const description = "Geometric triangular patterns with orbital motion and constellation effects";
export const defaultParams = {
  seed: "spinning-triangles",
  frequency: 3,
  amplitude: 40,
  complexity: 0.4,
  chaos: 0.2,
  damping: 0.85,
  layers: 3,
  sides: 3,
  rotation: 0
};
export const code = `// 🔺 Spinning Triangles
const PARAMETERS = {
  backgroundColor: { type: 'color', default: "#0a0a0a", label: 'Background Color', category: 'Background' },
  backgroundType: { type: 'select', options: [{"value":"transparent","label":"Transparent"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "solid", label: 'Background Type', category: 'Background' },
  backgroundGradientStart: { type: 'color', default: "#0a0a0a", label: 'Gradient Start', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientEnd: { type: 'color', default: "#1a1a1a", label: 'Gradient End', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 0, label: 'Gradient Direction', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  fillType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "solid", label: 'Fill Type', category: 'Fill' },
  fillColor: { type: 'color', default: "#4080ff", label: 'Fill Color', category: 'Fill', showIf: (params)=>params.fillType === 'solid' },
  fillGradientStart: { type: 'color', default: "#4080ff", label: 'Gradient Start', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientEnd: { type: 'color', default: "#80ff40", label: 'Gradient End', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 90, label: 'Gradient Direction', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.3, label: 'Fill Opacity', category: 'Fill', showIf: (params)=>params.fillType !== 'none' },
  strokeType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid"},{"value":"dashed","label":"Dashed"},{"value":"dotted","label":"Dotted"}], default: "solid", label: 'Stroke Type', category: 'Stroke' },
  strokeColor: { type: 'color', default: "#80c0ff", label: 'Stroke Color', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeWidth: { type: 'slider', min: 0, max: 10, step: 0.5, default: 2, label: 'Stroke Width', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Stroke Opacity', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  frequency: { type: 'slider', min: 0.1, max: 10, step: 0.1, default: 3, label: 'Spin Speed', category: 'Wave' },
  amplitude: { type: 'slider', min: 10, max: 100, step: 5, default: 40, label: 'Triangle Size', category: 'Wave' },
  complexity: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.4, label: 'Constellation', category: 'Wave' },
  chaos: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.2, label: 'Randomness', category: 'Wave' },
  damping: { type: 'slider', min: 0.5, max: 1, step: 0.01, default: 0.85, label: 'Layer Decay', category: 'Wave' },
  layers: { type: 'slider', min: 1, max: 8, step: 1, default: 3, label: 'Layers', category: 'Wave' },
  sides: { type: 'slider', min: 3, max: 12, step: 1, default: 3, label: 'Polygon Sides', category: 'Shape' },
  rotation: { type: 'slider', min: 0, max: 360, step: 15, default: 0, label: 'Base Rotation', category: 'Shape' },
  backgroundOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Background Opacity', category: 'Background', showIf: (params)=>params.backgroundType !== 'transparent' }
};

function applyUniversalBackground(ctx, width, height, params) {
  if (!params.backgroundType || params.backgroundType === 'transparent') return;
  
  ctx.save();
  ctx.globalAlpha = params.backgroundOpacity ?? 1;
  
  if (params.backgroundType === 'solid') {
    ctx.fillStyle = params.backgroundColor || '#0a0a0a';
    ctx.fillRect(0, 0, width, height);
  } else if (params.backgroundType === 'gradient') {
    const direction = (params.backgroundGradientDirection || 0) * (Math.PI / 180);
    const x1 = width / 2 - Math.cos(direction) * width / 2;
    const y1 = height / 2 - Math.sin(direction) * height / 2;
    const x2 = width / 2 + Math.cos(direction) * width / 2;
    const y2 = height / 2 + Math.sin(direction) * height / 2;
    
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, params.backgroundGradientStart || '#0a0a0a');
    gradient.addColorStop(1, params.backgroundGradientEnd || '#1a1a1a');
    
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
    
    // Use theme colors if available
    const fillColor = params.fillType === 'solid' ? params.fillColor : null;
    const strokeColor = params.strokeType !== 'none' ? params.strokeColor : null;
    
    // Create triangle path
    const rotationRad = ((layerRotation + chaosRotation) * Math.PI) / 180;
    const angleStep = (Math.PI * 2) / sides;
    
    ctx.save();
    
    // Draw filled triangle
    if (params.fillType !== 'none') {
      ctx.globalAlpha = (0.8 - (layer * 0.1)) * (params.fillOpacity || 0.3);
      if (params.fillType === 'gradient') {
        const gradient = ctx.createLinearGradient(
          finalX - layerSize, finalY - layerSize,
          finalX + layerSize, finalY + layerSize
        );
        gradient.addColorStop(0, params.fillGradientStart || \`hsl(\${hue}, \${saturation}%, \${lightness + 20}%)\`);
        gradient.addColorStop(1, params.fillGradientEnd || \`hsl(\${hue + 60}, \${saturation}%, \${lightness}%)\`);
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = fillColor || \`hsla(\${hue}, \${saturation}%, \${lightness + 20}%, 0.3)\`;
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
      ctx.globalAlpha = (0.8 - (layer * 0.1)) * (params.strokeOpacity || 1);
      ctx.strokeStyle = strokeColor || \`hsl(\${hue}, \${saturation}%, \${lightness}%)\`;
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
            ctx.fillStyle = fillColor ? fillColor + '66' : \`hsla(\${hue + 60}, \${saturation}%, \${lightness + 10}%, 0.4)\`;
          }
          if (params.strokeType !== 'none') {
            ctx.strokeStyle = strokeColor || \`hsl(\${hue + 60}, \${saturation}%, \${lightness}%)\`;
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

  // Add glow effect
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
    
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = \`hsl(\${hue}, \${saturation}%, \${lightness}%)\`;
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
}`;