/**
 * 🏷️ Isometric Wordmark Simple
 * 
 * Clean isometric wordmark with simplified visual style
 * Uses subtle shadows and gradients instead of complex 3D geometry
 */

function draw(ctx, width, height, params, time, utils) {
  // Load and process all parameters
  const p = utils.params.load(params, ctx, width, height, time, { parameters });
  
  // Enable crisp edges for sharp rendering
  ctx.imageSmoothingEnabled = false;
  
  // Calculate positioning with viewport support for infinite canvas
  const viewport = p._viewport || { offsetX: 0, offsetY: 0, zoom: 1 };
  const centerX = Math.round((width / 2) + viewport.offsetX);
  const centerY = Math.round((height / 2) + viewport.offsetY);
  const baseScale = Math.min(width, height) / 400 * viewport.zoom;
  
  // Animation calculations
  const animTime = time * p.animationSpeed;
  const breathingPhase = Math.sin(animTime * 0.8) * p.breathingIntensity;
  
  // Transform canvas to center
  ctx.save();
  ctx.translate(centerX, centerY);
  
  // Calculate isometric angle based on perspective parameter
  const isoAngle = Math.PI / 6 + (p.perspective * Math.PI / 180); // 30° + adjustment
  
  // Calculate platform dimensions
  const platformWidth = p.platformWidth * baseScale;
  const platformHeight = p.platformHeight * baseScale;
  const cornerRadius = p.cornerRadius * baseScale;
  
  // Layer configuration
  const layerCount = Math.floor(p.layerCount);
  const layerOffset = p.layerOffset * baseScale;
  
  // Helper function to project 3D to 2D (isometric)
  const project = (x, y, z) => ({
    x: (x - y) * Math.cos(isoAngle),
    y: (x + y) * Math.sin(isoAngle) - z
  });
  
  // Draw layers from bottom to top
  for (let i = 0; i < layerCount; i++) {
    const layerIndex = layerCount - 1 - i;
    
    // Calculate layer offset
    const offsetX = layerIndex * layerOffset * 0.5;
    const offsetY = layerIndex * layerOffset * 0.5;
    const offsetZ = layerIndex * layerOffset;
    
    // Layer breathing effect
    const layerBreathing = 1 + breathingPhase * 0.05 * (1 - layerIndex * 0.3);
    const layerScale = 1 - (layerIndex * p.layerTaper);
    
    // Get layer color
    const layerColor = getLayerColor(p.colorScheme, layerIndex, layerCount);
    
    // Project layer position
    const layerPos = project(-offsetX, -offsetY, offsetZ);
    
    ctx.save();
    ctx.translate(layerPos.x, layerPos.y);
    
    // Apply slight rotation for depth effect
    ctx.rotate((p.rotation * Math.PI / 180) * layerBreathing);
    
    // Scale for layer taper
    ctx.scale(layerScale * layerBreathing, layerScale * layerBreathing);
    
    // Draw shadow
    if (p.shadowIntensity > 0 && i < layerCount - 1) {
      ctx.save();
      ctx.translate(4, 4);
      ctx.globalAlpha = p.shadowIntensity * 0.3 * (1 - layerIndex / layerCount);
      ctx.fillStyle = '#000000';
      drawRoundedRect(ctx, -platformWidth/2, -platformHeight/2, platformWidth, platformHeight, cornerRadius);
      ctx.fill();
      ctx.restore();
    }
    
    // Draw main shape with gradient
    const gradient = ctx.createLinearGradient(0, -platformHeight/2, 0, platformHeight/2);
    gradient.addColorStop(0, adjustBrightness(layerColor, 1.2));
    gradient.addColorStop(0.5, layerColor);
    gradient.addColorStop(1, adjustBrightness(layerColor, 0.8));
    
    ctx.fillStyle = gradient;
    ctx.strokeStyle = adjustBrightness(layerColor, 0.6);
    ctx.lineWidth = 2;
    
    drawRoundedRect(ctx, -platformWidth/2, -platformHeight/2, platformWidth, platformHeight, cornerRadius);
    ctx.fill();
    
    if (p.strokeEnabled) {
      ctx.stroke();
    }
    
    // Add subtle inner highlight
    if (p.highlightIntensity > 0) {
      ctx.save();
      ctx.globalAlpha = p.highlightIntensity * 0.3;
      
      const highlightGradient = ctx.createLinearGradient(0, -platformHeight/2, 0, 0);
      highlightGradient.addColorStop(0, '#ffffff');
      highlightGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = highlightGradient;
      drawRoundedRect(ctx, -platformWidth/2 + 2, -platformHeight/2 + 2, platformWidth - 4, platformHeight/2, cornerRadius - 2);
      ctx.fill();
      ctx.restore();
    }
    
    ctx.restore();
  }
  
  // Draw wordmark on top layer
  if (p.wordmark && p.wordmark.trim()) {
    const textSize = p.textSize * baseScale;
    
    // Position text on top layer
    const topLayerPos = project(0, 0, 0);
    
    ctx.save();
    ctx.translate(topLayerPos.x, topLayerPos.y);
    
    // Apply text rotation
    if (p.textOrientation === 'rotated-90') {
      ctx.rotate(-Math.PI / 2);
    } else if (p.textOrientation === 'rotated-45') {
      ctx.rotate(-Math.PI / 4);
    }
    
    // Set font
    const fontFamily = utils.font.get(p.textStyle);
    ctx.font = `bold ${textSize}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw text shadow
    if (p.textShadow > 0) {
      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = '#000000';
      ctx.fillText(p.wordmark, p.textShadow, p.textShadow);
      ctx.restore();
    }
    
    // Draw main text
    ctx.fillStyle = p.textColor;
    ctx.fillText(p.wordmark, 0, 0);
    
    // Add text outline for better visibility
    if (p.textOutline) {
      ctx.strokeStyle = adjustBrightness(p.textColor, 0.3);
      ctx.lineWidth = 1;
      ctx.strokeText(p.wordmark, 0, 0);
    }
    
    ctx.restore();
  }
  
  ctx.restore();
}

/**
 * Draw a rounded rectangle
 */
function drawRoundedRect(ctx, x, y, width, height, radius) {
  if (radius === 0) {
    ctx.rect(x, y, width, height);
    return;
  }
  
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Get color for layer based on scheme
 */
function getLayerColor(scheme, layerIndex, totalLayers) {
  const schemes = {
    'monochrome': ['#2d3748', '#4a5568', '#718096'],
    'blue': ['#2b6cb0', '#3182ce', '#4299e1'],
    'purple': ['#6b46c1', '#8b5cf6', '#a78bfa'],
    'green': ['#059669', '#10b981', '#34d399'],
    'warm': ['#dc2626', '#f59e0b', '#eab308'],
    'cool': ['#0891b2', '#06b6d4', '#22d3ee'],
    'brand': ['#1b416b', '#2563eb', '#3b82f6']
  };
  
  const colors = schemes[scheme] || schemes['blue'];
  return colors[layerIndex % colors.length];
}

/**
 * Adjust color brightness
 */
function adjustBrightness(color, factor) {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  const newR = Math.min(255, Math.max(0, Math.round(r * factor)));
  const newG = Math.min(255, Math.max(0, Math.round(g * factor)));
  const newB = Math.min(255, Math.max(0, Math.round(b * factor)));
  
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

// Helper functions for parameter definitions
const slider = (def, min, max, step, label, unit, opts = {}) => ({ 
  type: "slider", default: def, min, max, step, label, unit, ...opts 
});
const select = (def, options, label, opts = {}) => ({ 
  type: "select", default: def, options, label, ...opts 
});
const text = (def, label, opts = {}) => ({ 
  type: "text", default: def, label, ...opts 
});
const toggle = (def, label, opts = {}) => ({ 
  type: "toggle", default: def, label, ...opts 
});
const color = (def, label, opts = {}) => ({ 
  type: "color", default: def, label, ...opts 
});

// Parameter definitions
export const parameters = {
  // Text Content
  wordmark: text('ReFlow', 'Wordmark Text', { group: 'Text Content' }),
  textSize: slider(32, 16, 72, 2, 'Text Size', 'px', { group: 'Text Content' }),
  textColor: color('#ffffff', 'Text Color', { group: 'Text Content' }),
  textStyle: select('bold', [
    { value: 'modern', label: 'Modern' },
    { value: 'bold', label: 'Bold' },
    { value: 'elegant', label: 'Elegant' },
    { value: 'minimal', label: 'Minimal' },
    { value: 'tech', label: 'Tech' }
  ], 'Text Style', { group: 'Text Content' }),
  textShadow: slider(2, 0, 8, 1, 'Text Shadow', 'px', { group: 'Text Content' }),
  textOutline: toggle(true, 'Text Outline', { group: 'Text Content' }),
  
  // Text Orientation
  textOrientation: select('normal', [
    { value: 'normal', label: 'Normal' },
    { value: 'rotated-45', label: 'Rotated 45°' },
    { value: 'rotated-90', label: 'Rotated 90°' }
  ], 'Text Orientation', { group: 'Text Orientation' }),
  
  // Platform Dimensions
  platformWidth: slider(200, 100, 300, 10, 'Platform Width', 'px', { group: 'Platform Dimensions' }),
  platformHeight: slider(80, 40, 160, 5, 'Platform Height', 'px', { group: 'Platform Dimensions' }),
  cornerRadius: slider(12, 0, 40, 2, 'Corner Radius', 'px', { group: 'Platform Dimensions' }),
  
  // Layers
  layerCount: slider(3, 1, 6, 1, 'Layer Count', '', { group: 'Layers' }),
  layerOffset: slider(8, 0, 20, 1, 'Layer Offset', 'px', { group: 'Layers' }),
  layerTaper: slider(0.1, 0, 0.3, 0.05, 'Layer Taper', '', { group: 'Layers' }),
  
  // Visual Style
  colorScheme: select('brand', [
    { value: 'monochrome', label: 'Monochrome' },
    { value: 'blue', label: 'Blue' },
    { value: 'purple', label: 'Purple' },
    { value: 'green', label: 'Green' },
    { value: 'warm', label: 'Warm' },
    { value: 'cool', label: 'Cool' },
    { value: 'brand', label: 'Brand' }
  ], 'Color Scheme', { group: 'Visual Style' }),
  strokeEnabled: toggle(true, 'Enable Stroke', { group: 'Visual Style' }),
  shadowIntensity: slider(0.8, 0, 1, 0.1, 'Shadow Intensity', '', { group: 'Visual Style' }),
  highlightIntensity: slider(0.5, 0, 1, 0.1, 'Highlight Intensity', '', { group: 'Visual Style' }),
  
  // Perspective
  perspective: slider(0, -30, 30, 5, 'Perspective', '°', { group: 'Perspective' }),
  rotation: slider(0, -15, 15, 1, 'Rotation', '°', { group: 'Perspective' }),
  
  // Animation
  animationSpeed: slider(1, 0, 3, 0.1, 'Animation Speed', 'x', { group: 'Animation' }),
  breathingIntensity: slider(0.5, 0, 1, 0.1, 'Breathing Intensity', '', { group: 'Animation' })
};

export const metadata = {
  id: 'isometric-wordmark-simple',
  name: "🏷️ Isometric Wordmark Simple",
  description: "Clean isometric wordmark with simplified visual style",
  parameters,
  defaultParams: {
    wordmark: 'ReFlow',
    textSize: 32,
    textColor: '#ffffff',
    textStyle: 'bold',
    textShadow: 2,
    textOutline: true,
    textOrientation: 'normal',
    platformWidth: 200,
    platformHeight: 80,
    cornerRadius: 12,
    layerCount: 3,
    layerOffset: 8,
    layerTaper: 0.1,
    colorScheme: 'brand',
    strokeEnabled: true,
    shadowIntensity: 0.8,
    highlightIntensity: 0.5,
    perspective: 0,
    rotation: 0,
    animationSpeed: 1,
    breathingIntensity: 0.5
  }
};

export { draw, parameters as params };