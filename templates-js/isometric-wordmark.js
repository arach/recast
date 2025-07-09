/**
 * 🏷️ Isometric Wordmark
 * 
 * Clean isometric wordmark positioned on rounded rectangle platforms
 * Perfect for brand identity with elegant 3D depth and optional layers
 */

function draw(ctx, width, height, params, time, utils) {
  // Load and process all parameters
  const p = utils.params.load(params, ctx, width, height, time, { parameters });
  
  // Enable crisp edges for sharp rendering
  ctx.imageSmoothingEnabled = false;
  
  // Calculate positioning with viewport support for infinite canvas
  const viewport = p._viewport || { offsetX: 0, offsetY: 0, zoom: 1 };
  // Ensure pixel-perfect alignment by rounding coordinates
  const centerX = Math.round((width / 2) + viewport.offsetX);
  const centerY = Math.round((height / 2) + viewport.offsetY);
  const baseScale = Math.min(width, height) / 400 * viewport.zoom;
  
  // Animation calculations
  const animTime = time * p.animationSpeed;
  const breathingPhase = Math.sin(animTime * 0.8) * p.breathingIntensity;
  
  // Transform canvas to center
  ctx.save();
  ctx.translate(centerX, centerY);
  
  // Apply perspective rotation
  if (p.perspective !== 0) {
    ctx.rotate((p.perspective * Math.PI) / 180);
  }
  
  // Calculate platform dimensions - make it upright (taller than wide)
  const platformWidth = p.platformWidth * baseScale;
  const platformDepth = p.platformDepth * baseScale;
  const platformHeight = p.platformHeight * baseScale;
  const cornerRadius = p.cornerRadius * baseScale;
  
  // Layer configuration
  const layerCount = Math.floor(p.layerCount);
  const layerSpacing = p.layerSpacing * baseScale;
  
  // Draw platforms from bottom to top
  for (let i = 0; i < layerCount; i++) {
    const layerIndex = layerCount - 1 - i;
    const layerZ = layerIndex * layerSpacing;
    
    // Calculate layer size (each layer slightly smaller)
    const layerScale = 1 - (layerIndex * p.layerTaper);
    const layerWidth = platformWidth * layerScale;
    const layerDepth = platformDepth * layerScale;
    
    // Layer breathing effect
    const layerBreathing = 1 + breathingPhase * 0.1 * (1 - layerIndex * 0.3);
    const finalWidth = layerWidth * layerBreathing;
    const finalDepth = layerDepth * layerBreathing;
    
    // Layer color
    const layerColor = getLayerColor(p.colorScheme, layerIndex, layerCount);
    
    // Draw the rounded platform (upright rectangle)
    drawUprightRoundedPlatform(
      ctx, 
      -finalWidth / 2, 
      -finalDepth / 2, 
      layerZ, 
      finalWidth, 
      finalDepth, 
      platformHeight, 
      cornerRadius * layerScale, 
      layerColor,
      p.lighting,
      utils
    );
  }
  
  // Draw wordmark on the front face (facing right)
  if (p.wordmark && p.wordmark.trim()) {
    const textZ = (layerCount - 1) * layerSpacing + platformHeight/2; // Middle of the front face
    drawFrontFaceWordmark(
      ctx, 
      p.wordmark, 
      0, // Center X
      platformDepth/2, // Front face Y position
      textZ, 
      p.textSize * baseScale, 
      p.textColor, 
      p.textStyle,
      p.textShadow * baseScale,
      platformWidth * 0.8, // Max width for text
      utils
    );
  }
  
  ctx.restore();
}

/**
 * Draw an upright rounded rectangle platform in isometric view
 */
function drawUprightRoundedPlatform(ctx, x, y, z, width, depth, height, radius, color, lighting, utils) {
  // Helper function to project 3D to 2D with pixel-perfect alignment
  const project = (px, py, pz) => ({
    x: Math.round((px - py) * Math.cos(Math.PI / 6)),
    y: Math.round((px + py) * Math.sin(Math.PI / 6) - pz)
  });
  
  ctx.save();
  
  // Enable crisp rendering
  ctx.imageSmoothingEnabled = false;
  ctx.lineWidth = 1;
  
  // Draw top face (with rounded corners)
  ctx.fillStyle = lighting ? adjustBrightness(color, 1.0) : color;
  ctx.strokeStyle = lighting ? adjustBrightness(color, 0.9) : adjustBrightness(color, 0.8);
  drawRoundedTopFace(ctx, x, y, z + height, width, depth, radius, project);
  ctx.fill();
  ctx.stroke();
  
  // Draw front face (upright rectangle with rounded corners)
  ctx.fillStyle = lighting ? adjustBrightness(color, 0.8) : color;
  ctx.strokeStyle = lighting ? adjustBrightness(color, 0.7) : adjustBrightness(color, 0.6);
  drawRoundedFrontFace(ctx, x, y + depth, z, width, height, radius, project);
  ctx.fill();
  ctx.stroke();
  
  // Draw right face (side face)
  ctx.fillStyle = lighting ? adjustBrightness(color, 0.6) : color;
  ctx.strokeStyle = lighting ? adjustBrightness(color, 0.5) : adjustBrightness(color, 0.4);
  drawRightFace(ctx, x + width, y, z, depth, height, project);
  ctx.fill();
  ctx.stroke();
  
  ctx.restore();
}

/**
 * Draw rounded top face
 */
function drawRoundedTopFace(ctx, x, y, z, width, depth, radius, project) {
  ctx.beginPath();
  
  // Start from top-left corner (after radius) with subpixel adjustment
  let p = project(x + radius, y, z);
  ctx.moveTo(p.x + 0.5, p.y + 0.5);
  
  // Top edge
  p = project(x + width - radius, y, z);
  ctx.lineTo(p.x, p.y);
  
  // Top-right corner
  p = project(x + width, y + radius, z);
  ctx.lineTo(p.x, p.y);
  
  // Right edge
  p = project(x + width, y + depth - radius, z);
  ctx.lineTo(p.x, p.y);
  
  // Bottom-right corner
  p = project(x + width - radius, y + depth, z);
  ctx.lineTo(p.x, p.y);
  
  // Bottom edge
  p = project(x + radius, y + depth, z);
  ctx.lineTo(p.x, p.y);
  
  // Bottom-left corner
  p = project(x, y + depth - radius, z);
  ctx.lineTo(p.x, p.y);
  
  // Left edge
  p = project(x, y + radius, z);
  ctx.lineTo(p.x, p.y);
  
  ctx.closePath();
}

/**
 * Draw rounded front face (upright)
 */
function drawRoundedFrontFace(ctx, x, y, z, width, height, radius, project) {
  ctx.beginPath();
  
  // Start from bottom-left corner (after radius) with subpixel adjustment
  let p = project(x + radius, y, z);
  ctx.moveTo(p.x + 0.5, p.y + 0.5);
  
  // Bottom edge
  p = project(x + width - radius, y, z);
  ctx.lineTo(p.x, p.y);
  
  // Bottom-right corner
  p = project(x + width, y, z + radius);
  ctx.lineTo(p.x, p.y);
  
  // Right edge
  p = project(x + width, y, z + height - radius);
  ctx.lineTo(p.x, p.y);
  
  // Top-right corner
  p = project(x + width - radius, y, z + height);
  ctx.lineTo(p.x, p.y);
  
  // Top edge
  p = project(x + radius, y, z + height);
  ctx.lineTo(p.x, p.y);
  
  // Top-left corner
  p = project(x, y, z + height - radius);
  ctx.lineTo(p.x, p.y);
  
  // Left edge
  p = project(x, y, z + radius);
  ctx.lineTo(p.x, p.y);
  
  ctx.closePath();
}

/**
 * Draw right face
 */
function drawRightFace(ctx, x, y, z, depth, height, project) {
  ctx.beginPath();
  
  let p = project(x, y, z);
  ctx.moveTo(p.x + 0.5, p.y + 0.5);
  
  p = project(x, y + depth, z);
  ctx.lineTo(p.x, p.y);
  
  p = project(x, y + depth, z + height);
  ctx.lineTo(p.x, p.y);
  
  p = project(x, y, z + height);
  ctx.lineTo(p.x, p.y);
  
  ctx.closePath();
}

/**
 * Draw wordmark on the front face (facing right in isometric view)
 */
function drawFrontFaceWordmark(ctx, text, x, y, z, size, color, style, shadow, maxWidth, utils) {
  const project = (px, py, pz) => ({
    x: (px - py) * Math.cos(Math.PI / 6),
    y: (px + py) * Math.sin(Math.PI / 6) - pz
  });
  
  ctx.save();
  
  // Set font based on style using utils.font.get
  const fontFamily = utils.font.get(style);
  ctx.font = `bold ${size}px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Calculate center of front face
  // Front face in isometric view is the x,y plane at the given depth
  const textPos = project(x, y, z);
  
  ctx.translate(textPos.x, textPos.y);
  
  // No skew transform - text appears flat on the vertical front face
  // The front face is already vertically oriented in isometric view
  
  // Draw text shadow if enabled
  if (shadow > 0) {
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillText(text, shadow, shadow);
  }
  
  // Draw main text
  ctx.globalAlpha = 1;
  ctx.fillStyle = color;
  ctx.fillText(text, 0, 0);
  
  // Add subtle text outline for better visibility
  ctx.strokeStyle = adjustBrightness(color, 0.9);
  ctx.lineWidth = 0.5;
  ctx.strokeText(text, 0, 0);
  
  ctx.restore();
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
    'cool': ['#0891b2', '#06b6d4', '#22d3ee']
  };
  
  const colors = schemes[scheme] || schemes['blue'];
  return colors[layerIndex % colors.length];
}

/**
 * Adjust color brightness
 */
function adjustBrightness(color, factor) {
  // Simple brightness adjustment for hex colors
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  const newR = Math.min(255, Math.round(r * factor));
  const newG = Math.min(255, Math.round(g * factor));
  const newB = Math.min(255, Math.round(b * factor));
  
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

// Parameter definitions
export const parameters = {
  // Wordmark
  wordmark: text('ReFlow', 'Wordmark Text'),
  textSize: slider(24, 12, 60, 2, 'Text Size', 'px'),
  textColor: { type: "color", default: '#ffffff', label: 'Text Color' },
  textStyle: select('bold', [
    { value: 'modern', label: 'Modern' },
    { value: 'bold', label: 'Bold' },
    { value: 'elegant', label: 'Elegant' },
    { value: 'minimal', label: 'Minimal' }
  ], 'Text Style'),
  textShadow: slider(2, 0, 8, 1, 'Text Shadow', 'px'),
  
  // Platform dimensions - grouped together
  platformWidth: slider(100, 40, 300, 10, 'Width', 'px', { group: 'Platform Size' }),
  platformDepth: slider(40, 20, 80, 5, 'Depth', 'px', { group: 'Platform Size' }),
  platformHeight: slider(120, 60, 200, 10, 'Height', 'px', { group: 'Platform Size' }),
  
  // Platform styling
  cornerRadius: slider(12, 0, 25, 2, 'Corner Radius', 'px'),
  colorScheme: select('blue', [
    { value: 'monochrome', label: '⚫ Monochrome' },
    { value: 'blue', label: '🔵 Blue' },
    { value: 'purple', label: '🟣 Purple' },
    { value: 'green', label: '🟢 Green' },
    { value: 'warm', label: '🔴 Warm' },
    { value: 'cool', label: '🔵 Cool' }
  ], 'Color Scheme'),
  
  // Layers
  layerCount: slider(1, 1, 3, 1, 'Layer Count'),
  layerSpacing: slider(20, 10, 40, 2, 'Layer Spacing', 'px'),
  layerTaper: slider(0.08, 0, 0.2, 0.02, 'Layer Taper'),
  
  // Animation
  animationSpeed: slider(0.3, 0, 1.5, 0.1, 'Animation Speed', 'x'),
  breathingIntensity: slider(0.02, 0, 0.08, 0.01, 'Breathing Effect'),
  
  // View
  perspective: slider(0, -20, 20, 2, 'View Angle', '°'),
  lighting: toggle(true, 'Enable Lighting')
};

// Template metadata
export const metadata = {
  name: "🏷️ Isometric Wordmark",
  description: "Clean isometric wordmark projected flat on upright rounded rectangle platforms - perfect for elegant brand identity with 3D depth",
  category: "isometric",
  tags: ["isometric", "3d", "wordmark", "brand", "elegant", "typography", "platform", "upright"],
  author: "ReFlow",
  version: "1.1.0"
};