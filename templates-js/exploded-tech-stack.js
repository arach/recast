/**
 * 🏗️ Exploded Tech Stack
 * 
 * Advanced multi-layer isometric architecture visualization with sophisticated animations
 * Perfect for visualizing technical architectures, data flows, and system diagrams
 */

function draw(ctx, width, height, params, time, utils) {
  // Load and process all parameters
  const p = utils.params.load(params, ctx, width, height, time, { parameters });
  
  // Template-specific parameters
  const { layerCount, explosionPattern, explosionIntensity, animationSpeed, 
          colorScheme, layerStyle, showConnections, connectionStyle,
          rotationSpeed, pulseIntensity, glowStrength, dataFlowDensity,
          perspective, showLabels, labelStyle, architecture } = p;
  
  // Calculate positioning
  const centerX = width / 2;
  const centerY = height / 2;
  const baseScale = Math.min(width, height) / 200; // Even larger base scale
  
  // Advanced animation calculations
  const animTime = time * animationSpeed;
  const rotationTime = time * rotationSpeed;
  
  // Explosion pattern calculations
  let explosionPhase;
  switch(explosionPattern) {
    case 'sine':
      explosionPhase = Math.sin(animTime) * 0.5 + 0.5;
      break;
    case 'bounce':
      explosionPhase = Math.abs(Math.sin(animTime * 1.5)) * (1 + Math.sin(animTime * 0.3) * 0.3);
      break;
    case 'spiral':
      explosionPhase = (Math.sin(animTime) * 0.5 + 0.5) * (1 + Math.sin(animTime * 2) * 0.2);
      break;
    case 'pulse':
      explosionPhase = Math.pow(Math.sin(animTime * 0.8) * 0.5 + 0.5, 2);
      break;
    default:
      explosionPhase = Math.sin(animTime) * 0.5 + 0.5;
  }
  
  const currentExplosion = explosionIntensity * explosionPhase;
  
  // Transform canvas to center the view
  ctx.save();
  ctx.translate(centerX, centerY);
  
  // Apply perspective rotation with animation
  const totalRotation = perspective + rotationTime * 10;
  if (totalRotation !== 0) {
    ctx.rotate((totalRotation * Math.PI) / 180);
  }
  
  // Get layer configuration
  const layers = getArchitectureLayers(architecture, layerCount, colorScheme);
  
  // Draw connections between layers first (behind layers)
  if (showConnections) {
    drawLayerConnections(ctx, layers, currentExplosion, connectionStyle, time, baseScale, p);
  }
  
  // Draw data flow streams
  if (dataFlowDensity > 0) {
    drawDataFlowStreams(ctx, layers, currentExplosion, time, dataFlowDensity, baseScale, p);
  }
  
  // Draw layers from bottom to top with advanced effects
  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    const layerIndex = layers.length - 1 - i;
    
    // Calculate layer position with explosion and spiral effects
    const baseZ = layerIndex * 25;
    let explosionOffset = layerIndex * currentExplosion * 60;
    
    // Add spiral effect for spiral explosion pattern
    if (explosionPattern === 'spiral') {
      const spiralAngle = layerIndex * 0.5 + animTime * 0.5;
      explosionOffset += Math.sin(spiralAngle) * currentExplosion * 20;
    }
    
    const layerZ = baseZ + explosionOffset;
    
    // Calculate layer dimensions with breathing effect
    const breathingPhase = Math.sin(time * pulseIntensity + layerIndex * 0.8);
    const breathingScale = 1 + breathingPhase * 0.1;
    
    const layerWidth = layer.width * baseScale * breathingScale;
    const layerDepth = layer.depth * baseScale * breathingScale;
    const layerHeight = 20 * baseScale;
    
    // Position layer in center
    const layerX = -layerWidth / 2;
    const layerY = -layerDepth / 2;
    
    // Draw the layer with advanced styling
    drawAdvancedTechLayer(ctx, layerX, layerY, layerZ, layerWidth, layerDepth, layerHeight, 
                         layer, time, layerStyle, glowStrength, p);
    
    // Draw layer label with advanced styling
    if (showLabels) {
      drawAdvancedLayerLabel(ctx, layerX, layerY, layerZ + layerHeight, 
                           layerWidth, layerDepth, layer.name, labelStyle, time, p);
    }
  }
  
  ctx.restore();
  
  // Debug info
  if (utils.debug) {
    utils.debug.log('Advanced Exploded Tech Stack rendered', {
      layerCount: layers.length,
      explosionPhase: explosionPhase.toFixed(2),
      explosionPattern,
      colorScheme,
      time: time.toFixed(2)
    });
  }
}

/**
 * Get sophisticated layer configuration based on architecture type
 */
function getArchitectureLayers(architecture, layerCount, colorScheme) {
  const colorSchemes = {
    'tech-blue': ['#1e3a8a', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'],
    'cyberpunk': ['#7c3aed', '#a855f7', '#c084fc', '#e879f9', '#f3e8ff'],
    'matrix': ['#065f46', '#059669', '#10b981', '#34d399', '#a7f3d0'],
    'sunset': ['#b91c1c', '#dc2626', '#ef4444', '#f87171', '#fca5a5'],
    'ocean': ['#0c4a6e', '#0369a1', '#0284c7', '#0ea5e9', '#38bdf8'],
    'neon': ['#be185d', '#db2777', '#ec4899', '#f472b6', '#f9a8d4']
  };
  
  const colors = colorSchemes[colorScheme] || colorSchemes['tech-blue'];
  
  const architectures = {
    'web-app': [
      { name: 'Database', baseWidth: 140, baseDepth: 100, type: 'storage', icon: '🗄️' },
      { name: 'API Layer', baseWidth: 120, baseDepth: 120, type: 'service', icon: '⚡' },
      { name: 'Frontend', baseWidth: 160, baseDepth: 110, type: 'interface', icon: '🖥️' }
    ],
    'microservices': [
      { name: 'Database', baseWidth: 170, baseDepth: 120, type: 'storage', icon: '🗄️' },
      { name: 'Message Queue', baseWidth: 140, baseDepth: 80, type: 'messaging', icon: '📨' },
      { name: 'Services', baseWidth: 160, baseDepth: 140, type: 'service', icon: '⚙️' },
      { name: 'Gateway', baseWidth: 120, baseDepth: 100, type: 'gateway', icon: '🚪' },
      { name: 'Client Apps', baseWidth: 180, baseDepth: 120, type: 'interface', icon: '📱' }
    ],
    'data-pipeline': [
      { name: 'Data Sources', baseWidth: 150, baseDepth: 90, type: 'source', icon: '📡' },
      { name: 'ETL Pipeline', baseWidth: 130, baseDepth: 110, type: 'processing', icon: '⚗️' },
      { name: 'Data Lake', baseWidth: 170, baseDepth: 130, type: 'storage', icon: '🏞️' },
      { name: 'Analytics', baseWidth: 140, baseDepth: 100, type: 'analytics', icon: '📊' },
      { name: 'Dashboards', baseWidth: 180, baseDepth: 110, type: 'interface', icon: '📈' }
    ],
    'ai-stack': [
      { name: 'Data Sources', baseWidth: 150, baseDepth: 90, type: 'source', icon: '🌊' },
      { name: 'Data Processing', baseWidth: 140, baseDepth: 110, type: 'processing', icon: '🔄' },
      { name: 'ML Training', baseWidth: 160, baseDepth: 120, type: 'ml', icon: '🧠' },
      { name: 'Model Serving', baseWidth: 130, baseDepth: 100, type: 'service', icon: '🚀' },
      { name: 'Applications', baseWidth: 170, baseDepth: 110, type: 'interface', icon: '✨' }
    ]
  };
  
  const preset = architectures[architecture] || architectures['web-app'];
  
  // Map colors and adjust layer count
  let layers = preset.slice(0, Math.min(layerCount, preset.length));
  if (layerCount > preset.length) {
    // Extend with variations
    while (layers.length < layerCount) {
      const template = preset[layers.length % preset.length];
      layers.push({
        ...template,
        name: `${template.name} ${Math.floor(layers.length / preset.length) + 1}`
      });
    }
  }
  
  // Apply colors
  return layers.map((layer, index) => ({
    ...layer,
    color: colors[index % colors.length],
    width: layer.baseWidth,
    depth: layer.baseDepth
  }));
}

/**
 * Draw advanced tech layer with sophisticated styling
 */
function drawAdvancedTechLayer(ctx, x, y, z, width, depth, height, layer, time, style, glowStrength, params) {
  // Apply layer-specific animations
  const typeAnimations = {
    'storage': Math.sin(time * 1.5 + z * 0.02) * 0.08,
    'service': Math.sin(time * 2.5 + z * 0.03) * 0.12,
    'interface': Math.sin(time * 2 + z * 0.025) * 0.1,
    'processing': Math.sin(time * 3 + z * 0.04) * 0.15,
    'ml': Math.sin(time * 2.2 + z * 0.035) * 0.13
  };
  
  const animation = typeAnimations[layer.type] || 0;
  const animatedWidth = width * (1 + animation);
  const animatedDepth = depth * (1 + animation);
  
  // Draw glow effect if enabled
  if (glowStrength > 0 && style !== 'minimal') {
    drawLayerGlow(ctx, x, y, z, animatedWidth, animatedDepth, height, layer.color, glowStrength);
  }
  
  // Draw main layer based on style
  switch(style) {
    case 'gradient':
      drawGradientLayer(ctx, x, y, z, animatedWidth, animatedDepth, height, layer, time);
      break;
    case 'neon':
      drawNeonLayer(ctx, x, y, z, animatedWidth, animatedDepth, height, layer, time);
      break;
    case 'holographic':
      drawHolographicLayer(ctx, x, y, z, animatedWidth, animatedDepth, height, layer, time);
      break;
    default:
      drawSolidLayer(ctx, x, y, z, animatedWidth, animatedDepth, height, layer, time);
  }
  
  // Add layer-specific details
  drawLayerDetails(ctx, x, y, z, animatedWidth, animatedDepth, height, layer, time, params);
}

/**
 * Draw glow effect around layer
 */
function drawLayerGlow(ctx, x, y, z, width, depth, height, color, intensity) {
  const glowLayers = 3;
  for (let i = 0; i < glowLayers; i++) {
    const glowScale = 1 + (i + 1) * 0.15;
    const glowAlpha = intensity * 0.3 / (i + 1);
    
    ctx.save();
    ctx.globalAlpha = glowAlpha;
    
    const glowWidth = width * glowScale;
    const glowDepth = depth * glowScale;
    const glowX = x - (glowWidth - width) / 2;
    const glowY = y - (glowDepth - depth) / 2;
    
    utils.iso.drawBuilding(ctx, glowX, glowY, z, glowWidth, glowDepth, height, color, {
      windows: false,
      lighting: false,
      stroke: false
    });
    
    ctx.restore();
  }
}

/**
 * Draw gradient-styled layer
 */
function drawGradientLayer(ctx, x, y, z, width, depth, height, layer, time) {
  // Create gradient effect by drawing multiple slightly offset layers
  const gradientSteps = 5;
  for (let step = 0; step < gradientSteps; step++) {
    const alpha = 1 - (step / gradientSteps) * 0.6;
    const brightness = 1 - (step / gradientSteps) * 0.4;
    
    ctx.save();
    ctx.globalAlpha = alpha;
    
    const stepColor = utils.iso.adjustBrightness(layer.color, brightness);
    const stepZ = z + step * 2;
    
    utils.iso.drawBuilding(ctx, x, y, stepZ, width, depth, height, stepColor, {
      windows: step === 0,
      windowColor: getAnimatedAccentColor(layer.type, time),
      lighting: true,
      stroke: step === 0
    });
    
    ctx.restore();
  }
}

/**
 * Draw neon-styled layer
 */
function drawNeonLayer(ctx, x, y, z, width, depth, height, layer, time) {
  // Pulsing neon effect
  const pulseIntensity = Math.sin(time * 4 + z * 0.1) * 0.3 + 0.7;
  
  // Dark base
  utils.iso.drawBuilding(ctx, x, y, z, width, depth, height, '#1a1a1a', {
    windows: false,
    lighting: false,
    stroke: false
  });
  
  // Neon edges
  ctx.save();
  ctx.globalAlpha = pulseIntensity;
  ctx.shadowColor = layer.color;
  ctx.shadowBlur = 20;
  
  utils.iso.drawBuilding(ctx, x, y, z, width, depth, height, 'transparent', {
    windows: true,
    windowColor: layer.color,
    lighting: false,
    stroke: true
  });
  
  ctx.restore();
}

/**
 * Draw holographic layer
 */
function drawHolographicLayer(ctx, x, y, z, width, depth, height, layer, time) {
  const holoPhase = time * 2 + z * 0.05;
  const holoAlpha = 0.6 + Math.sin(holoPhase) * 0.3;
  
  ctx.save();
  ctx.globalAlpha = holoAlpha;
  
  // Holographic shimmer effect
  const shimmerColors = [layer.color, utils.iso.adjustBrightness(layer.color, 1.3), layer.color];
  const colorIndex = Math.floor(holoPhase) % shimmerColors.length;
  
  utils.iso.drawBuilding(ctx, x, y, z, width, depth, height, shimmerColors[colorIndex], {
    windows: true,
    windowColor: utils.iso.adjustBrightness(layer.color, 1.5),
    lighting: true,
    stroke: true
  });
  
  ctx.restore();
}

/**
 * Draw solid layer (default)
 */
function drawSolidLayer(ctx, x, y, z, width, depth, height, layer, time) {
  utils.iso.drawBuilding(ctx, x, y, z, width, depth, height, layer.color, {
    windows: true,
    windowColor: getAnimatedAccentColor(layer.type, time),
    lighting: true,
    stroke: true
  });
}

/**
 * Get animated accent color for layer type
 */
function getAnimatedAccentColor(type, time) {
  const baseColors = {
    'storage': '#fbbf24',
    'service': '#10b981', 
    'interface': '#3b82f6',
    'messaging': '#f59e0b',
    'gateway': '#8b5cf6',
    'processing': '#ef4444',
    'analytics': '#06b6d4',
    'ml': '#d946ef',
    'source': '#84cc16'
  };
  
  const baseColor = baseColors[type] || '#6b7280';
  const intensity = 0.7 + Math.sin(time * 3) * 0.3;
  
  return utils.iso.adjustBrightness(baseColor, intensity);
}

/**
 * Draw layer-specific details and effects
 */
function drawLayerDetails(ctx, x, y, z, width, depth, height, layer, time, params) {
  // Add floating particles for active layers
  if (layer.type === 'service' || layer.type === 'processing' || layer.type === 'ml') {
    drawFloatingParticles(ctx, x, y, z, width, depth, height, layer, time);
  }
  
  // Add data streams for storage layers
  if (layer.type === 'storage') {
    drawDataStreams(ctx, x, y, z, width, depth, height, layer, time);
  }
  
  // Add energy field for ML layers
  if (layer.type === 'ml') {
    drawEnergyField(ctx, x, y, z, width, depth, height, layer, time);
  }
}

/**
 * Draw floating particles around layer
 */
function drawFloatingParticles(ctx, x, y, z, width, depth, height, layer, time) {
  const particleCount = 6;
  const animTime = time * 2;
  
  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2 + animTime;
    const radius = Math.max(width, depth) * 0.8;
    const particleX = x + width/2 + Math.cos(angle) * radius;
    const particleY = y + depth/2 + Math.sin(angle) * radius * 0.6;
    const particleZ = z + height + Math.sin(animTime + i) * 15;
    
    const projected = utils.iso.project(particleX, particleY, particleZ);
    
    ctx.save();
    ctx.globalAlpha = 0.8 + Math.sin(animTime + i) * 0.2;
    ctx.fillStyle = getAnimatedAccentColor(layer.type, time);
    ctx.shadowColor = layer.color;
    ctx.shadowBlur = 5;
    ctx.beginPath();
    ctx.arc(projected.x, projected.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

/**
 * Draw data streams
 */
function drawDataStreams(ctx, x, y, z, width, depth, height, layer, time) {
  const streamCount = 4;
  for (let i = 0; i < streamCount; i++) {
    const streamX = x + width * (0.2 + i * 0.2);
    const streamY = y + depth * 0.5;
    const streamZ = z + height + 10 + Math.sin(time * 2 + i * 0.5) * 5;
    
    const projected = utils.iso.project(streamX, streamY, streamZ);
    
    ctx.save();
    ctx.fillStyle = getAnimatedAccentColor(layer.type, time);
    ctx.globalAlpha = 0.7 + Math.sin(time * 3 + i) * 0.3;
    ctx.beginPath();
    ctx.rect(projected.x - 1, projected.y - 1, 2, 4);
    ctx.fill();
    ctx.restore();
  }
}

/**
 * Draw energy field for ML layers
 */
function drawEnergyField(ctx, x, y, z, width, depth, height, layer, time) {
  const fieldSize = Math.max(width, depth) * 1.2;
  const centerX = x + width / 2;
  const centerY = y + depth / 2;
  const centerZ = z + height;
  
  // Draw energy rings
  for (let ring = 0; ring < 3; ring++) {
    const ringRadius = fieldSize * (0.3 + ring * 0.2);
    const ringAlpha = 0.3 - ring * 0.1;
    const ringTime = time * (1 + ring * 0.5);
    
    const points = 12;
    ctx.save();
    ctx.globalAlpha = ringAlpha;
    ctx.strokeStyle = layer.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2 + ringTime;
      const ringX = centerX + Math.cos(angle) * ringRadius;
      const ringY = centerY + Math.sin(angle) * ringRadius * 0.5;
      const ringZ = centerZ + Math.sin(ringTime + ring) * 10;
      
      const projected = utils.iso.project(ringX, ringY, ringZ);
      
      if (i === 0) {
        ctx.moveTo(projected.x, projected.y);
      } else {
        ctx.lineTo(projected.x, projected.y);
      }
    }
    
    ctx.stroke();
    ctx.restore();
  }
}

/**
 * Draw layer connections
 */
function drawLayerConnections(ctx, layers, explosion, style, time, scale, params) {
  for (let i = 0; i < layers.length - 1; i++) {
    const layer1 = layers[i];
    const layer2 = layers[i + 1];
    
    const z1 = (layers.length - 1 - i) * 25 + (layers.length - 1 - i) * explosion * 60;
    const z2 = (layers.length - 2 - i) * 25 + (layers.length - 2 - i) * explosion * 60;
    
    drawConnection(ctx, z1, z2, style, time, params);
  }
}

/**
 * Draw single connection between layers
 */
function drawConnection(ctx, z1, z2, style, time, params) {
  const point1 = utils.iso.project(0, 0, z1);
  const point2 = utils.iso.project(0, 0, z2);
  
  ctx.save();
  
  switch(style) {
    case 'beam':
      ctx.strokeStyle = params.strokeColor || '#00ff88';
      ctx.lineWidth = 3;
      ctx.globalAlpha = 0.6;
      ctx.shadowColor = params.strokeColor || '#00ff88';
      ctx.shadowBlur = 10;
      break;
    case 'data':
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.lineDashOffset = -time * 20;
      ctx.globalAlpha = 0.8;
      break;
    default:
      ctx.strokeStyle = '#6b7280';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.4;
  }
  
  ctx.beginPath();
  ctx.moveTo(point1.x, point1.y);
  ctx.lineTo(point2.x, point2.y);
  ctx.stroke();
  ctx.restore();
}

/**
 * Draw data flow streams between all layers
 */
function drawDataFlowStreams(ctx, layers, explosion, time, density, scale, params) {
  const streamCount = Math.floor(density * 10);
  
  for (let i = 0; i < streamCount; i++) {
    const streamTime = time * 2 + i * 0.3;
    const progress = (streamTime % 3) / 3; // 0 to 1
    
    if (progress > 0.8) continue; // Create gaps
    
    const startLayer = Math.floor(progress * (layers.length - 1));
    const endLayer = startLayer + 1;
    
    if (endLayer >= layers.length) continue;
    
    const z1 = (layers.length - 1 - startLayer) * 25 + (layers.length - 1 - startLayer) * explosion * 60;
    const z2 = (layers.length - 1 - endLayer) * 25 + (layers.length - 1 - endLayer) * explosion * 60;
    
    const streamZ = z1 + (z2 - z1) * (progress - startLayer);
    const streamX = Math.sin(streamTime + i) * 30;
    const streamY = Math.cos(streamTime + i * 0.7) * 20;
    
    const projected = utils.iso.project(streamX, streamY, streamZ);
    
    ctx.save();
    ctx.globalAlpha = 0.8 * (1 - progress * 0.5);
    ctx.fillStyle = params.strokeColor || '#00ff88';
    ctx.shadowColor = params.strokeColor || '#00ff88';
    ctx.shadowBlur = 3;
    ctx.beginPath();
    ctx.arc(projected.x, projected.y, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

/**
 * Draw advanced layer label with styling
 */
function drawAdvancedLayerLabel(ctx, x, y, z, width, depth, text, style, time, params) {
  const labelPoint = utils.iso.project(x + width/2, y - depth * 0.2, z + 30);
  
  ctx.save();
  
  switch(style) {
    case 'glow':
      ctx.shadowColor = params.strokeColor || '#ffffff';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#ffffff';
      break;
    case 'neon':
      const pulseAlpha = 0.8 + Math.sin(time * 4) * 0.2;
      ctx.globalAlpha = pulseAlpha;
      ctx.shadowColor = params.strokeColor || '#00ff88';
      ctx.shadowBlur = 15;
      ctx.fillStyle = params.strokeColor || '#00ff88';
      break;
    default:
      ctx.fillStyle = params.strokeColor || '#333333';
  }
  
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, labelPoint.x, labelPoint.y);
  ctx.restore();
}

// Helper functions for parameter definitions
const slider = (def, min, max, step, label, unit, opts = {}) => ({ 
  type: "slider", default: def, min, max, step, label, unit, ...opts 
});
const select = (def, options, label, opts = {}) => ({ 
  type: "select", default: def, options, label, ...opts 
});
const toggle = (def, label, opts = {}) => ({ 
  type: "toggle", default: def, label, ...opts 
});

// Advanced parameter definitions
export const parameters = {
  // Architecture & Structure
  architecture: select('microservices', [
    { value: 'web-app', label: '🌐 Web Application' },
    { value: 'microservices', label: '🔗 Microservices' },
    { value: 'data-pipeline', label: '📊 Data Pipeline' },
    { value: 'ai-stack', label: '🤖 AI/ML Stack' }
  ], 'Architecture Type'),
  
  layerCount: slider(4, 2, 6, 1, 'Number of Layers'),
  
  // Visual Style
  colorScheme: select('cyberpunk', [
    { value: 'tech-blue', label: '💙 Tech Blue' },
    { value: 'cyberpunk', label: '🟣 Cyberpunk' },
    { value: 'matrix', label: '💚 Matrix Green' },
    { value: 'sunset', label: '🌅 Sunset' },
    { value: 'ocean', label: '🌊 Ocean' },
    { value: 'neon', label: '💖 Neon Pink' }
  ], 'Color Scheme'),
  
  layerStyle: select('gradient', [
    { value: 'solid', label: '⬜ Solid' },
    { value: 'gradient', label: '🌈 Gradient' },
    { value: 'neon', label: '✨ Neon' },
    { value: 'holographic', label: '🔮 Holographic' }
  ], 'Layer Style'),
  
  // Animation Controls
  explosionPattern: select('spiral', [
    { value: 'sine', label: '〰️ Smooth Wave' },
    { value: 'bounce', label: '🎾 Bounce' },
    { value: 'spiral', label: '🌀 Spiral' },
    { value: 'pulse', label: '💗 Pulse' }
  ], 'Explosion Pattern'),
  
  explosionIntensity: slider(80, 0, 150, 10, 'Explosion Distance', 'px'),
  animationSpeed: slider(0.6, 0.1, 2.0, 0.1, 'Animation Speed', 'x'),
  rotationSpeed: slider(0.1, 0, 1.0, 0.05, 'Rotation Speed', 'x'),
  pulseIntensity: slider(1.5, 0, 3.0, 0.1, 'Breathing Intensity', 'x'),
  
  // Effects
  glowStrength: slider(0.8, 0, 2.0, 0.1, 'Glow Strength'),
  showConnections: toggle(true, 'Show Layer Connections'),
  connectionStyle: select('beam', [
    { value: 'simple', label: '➖ Simple' },
    { value: 'beam', label: '⚡ Energy Beam' },
    { value: 'data', label: '📊 Data Stream' }
  ], 'Connection Style'),
  
  dataFlowDensity: slider(0.6, 0, 1.0, 0.1, 'Data Flow Density'),
  
  // Labels & Display
  showLabels: toggle(true, 'Show Layer Labels'),
  labelStyle: select('glow', [
    { value: 'simple', label: '📝 Simple' },
    { value: 'glow', label: '✨ Glow' },
    { value: 'neon', label: '🔆 Neon' }
  ], 'Label Style'),
  
  perspective: slider(5, -45, 45, 5, 'Perspective Angle', '°')
};

// Template metadata
export const metadata = {
  name: "🏗️ Exploded Tech Stack",
  description: "Advanced multi-layer isometric architecture visualization with sophisticated animations and effects - perfect for technical presentations and system architecture demos",
  category: "isometric",
  tags: ["isometric", "3d", "architecture", "exploded", "technical", "animated", "advanced", "cyberpunk"],
  author: "ReFlow",
  version: "2.0.0"
};