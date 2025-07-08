/**
 * 📊 Data Platform Stack
 * 
 * Animated data platform architecture inspired by modern analytics stacks
 * Perfect for visualizing data pipelines, semantic layers, and integration ecosystems
 */

function draw(ctx, width, height, params, time, utils) {
  // Load and process all parameters
  const p = utils.params.load(params, ctx, width, height, time, { parameters });
  
  // Template-specific parameters
  const { platformType, showDataFlow, dataFlowSpeed, explosionAmount, 
          animationSpeed, colorScheme, componentStyle, showConnections,
          glowIntensity, showLabels, viewAngle } = p;
  
  // Calculate positioning
  const centerX = width / 2;
  const centerY = height / 2;
  const baseScale = Math.min(width, height) / 350;
  
  // Animation calculations
  const animTime = time * animationSpeed;
  const explosionPhase = Math.sin(animTime * 0.8) * 0.5 + 0.5;
  const currentExplosion = explosionAmount * explosionPhase;
  
  // Transform canvas
  ctx.save();
  ctx.translate(centerX, centerY);
  
  // Apply perspective rotation
  if (viewAngle !== 0) {
    ctx.rotate((viewAngle * Math.PI) / 180);
  }
  
  // Get platform configuration
  const config = getPlatformConfig(platformType, colorScheme);
  
  // Draw data source connections (background layer)
  if (showConnections) {
    drawDataSourceConnections(ctx, config, currentExplosion, time, baseScale, 'energy', p, utils);
  }
  
  // Draw data flow streams
  if (showDataFlow) {
    drawPlatformDataFlow(ctx, config, currentExplosion, time, dataFlowSpeed, baseScale, p, utils);
  }
  
  // Draw data sources (left side)
  drawDataSources(ctx, config.sources, currentExplosion, time, baseScale, componentStyle, glowIntensity, p, utils);
  
  // Draw semantic layer (center) - this is the main exploding component
  drawSemanticLayer(ctx, config.core, currentExplosion, time, baseScale, componentStyle, glowIntensity, 1.5, p, utils);
  
  // Draw output integrations (right side)
  drawOutputIntegrations(ctx, config.outputs, currentExplosion, time, baseScale, componentStyle, glowIntensity, p, utils);
  
  // Draw labels if enabled
  if (showLabels) {
    drawPlatformLabels(ctx, config, currentExplosion, time, baseScale, 'glow', p, utils);
  }
  
  ctx.restore();
}

/**
 * Get platform configuration based on type
 */
function getPlatformConfig(platformType, colorScheme) {
  const colorSchemes = {
    'modern': ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'],
    'corporate': ['#1f2937', '#374151', '#6b7280', '#9ca3af', '#d1d5db'],
    'vibrant': ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'],
    'ocean': ['#0c4a6e', '#0369a1', '#0284c7', '#0ea5e9', '#38bdf8'],
    'sunset': ['#7c2d12', '#ea580c', '#f59e0b', '#eab308', '#84cc16']
  };
  
  const colors = colorSchemes[colorScheme] || colorSchemes['modern'];
  
  const platforms = {
    'cube-cloud': {
      name: 'Cube Cloud',
      sources: [
        { name: 'ClickHouse', icon: '🔍', color: colors[0] },
        { name: 'Redshift', icon: '🗄️', color: colors[1] },
        { name: 'BigQuery', icon: '📊', color: colors[2] },
        { name: 'Snowflake', icon: '❄️', color: colors[3] },
        { name: 'Databricks', icon: '🧱', color: colors[4] }
      ],
      core: [
        { name: 'Data Modeling', color: colors[0], type: 'modeling' },
        { name: 'Access Control', color: colors[1], type: 'security' },
        { name: 'Caching', color: colors[2], type: 'performance' },
        { name: 'APIs', color: colors[3], type: 'interface' }
      ],
      outputs: [
        { name: 'Looker', icon: '👀', color: colors[0] },
        { name: 'Tableau', icon: '📈', color: colors[1] },
        { name: 'Metabase', icon: '🔬', color: colors[2] },
        { name: 'Superset', icon: '🚀', color: colors[3] },
        { name: 'PowerBI', icon: '⚡', color: colors[4] }
      ]
    },
    'modern-stack': {
      name: 'Modern Data Stack',
      sources: [
        { name: 'Postgres', icon: '🐘', color: colors[0] },
        { name: 'MongoDB', icon: '🍃', color: colors[1] },
        { name: 'Kafka', icon: '📨', color: colors[2] },
        { name: 'S3', icon: '☁️', color: colors[3] },
        { name: 'APIs', icon: '🔌', color: colors[4] }
      ],
      core: [
        { name: 'Data Lake', color: colors[0], type: 'storage' },
        { name: 'ETL Pipeline', color: colors[1], type: 'processing' },
        { name: 'Data Warehouse', color: colors[2], type: 'storage' },
        { name: 'Metrics Layer', color: colors[3], type: 'modeling' }
      ],
      outputs: [
        { name: 'Dashboards', icon: '📊', color: colors[0] },
        { name: 'Reports', icon: '📄', color: colors[1] },
        { name: 'Alerts', icon: '🚨', color: colors[2] },
        { name: 'APIs', icon: '🔗', color: colors[3] },
        { name: 'Exports', icon: '📤', color: colors[4] }
      ]
    },
    'ml-platform': {
      name: 'ML Platform',
      sources: [
        { name: 'Training Data', icon: '🎯', color: colors[0] },
        { name: 'Feature Store', icon: '🏪', color: colors[1] },
        { name: 'Model Registry', icon: '📚', color: colors[2] },
        { name: 'Experiments', icon: '🧪', color: colors[3] },
        { name: 'Metrics', icon: '📈', color: colors[4] }
      ],
      core: [
        { name: 'Training', color: colors[0], type: 'ml' },
        { name: 'Validation', color: colors[1], type: 'processing' },
        { name: 'Deployment', color: colors[2], type: 'service' },
        { name: 'Monitoring', color: colors[3], type: 'observability' }
      ],
      outputs: [
        { name: 'Applications', icon: '📱', color: colors[0] },
        { name: 'APIs', icon: '🔌', color: colors[1] },
        { name: 'Batch Jobs', icon: '⚙️', color: colors[2] },
        { name: 'Real-time', icon: '⚡', color: colors[3] },
        { name: 'Reports', icon: '📊', color: colors[4] }
      ]
    }
  };
  
  return platforms[platformType] || platforms['cube-cloud'];
}

/**
 * Draw data sources on the left side
 */
function drawDataSources(ctx, sources, explosion, time, scale, style, glowStrength, params, utils) {
  const sourceSpacing = 60 * scale;
  const startY = -(sources.length - 1) * sourceSpacing / 2;
  const baseX = -200 * scale - explosion * 40;
  
  sources.forEach((source, index) => {
    const sourceY = startY + index * sourceSpacing;
    const sourceX = baseX + Math.sin(time * 1.5 + index * 0.3) * explosion * 10;
    
    // Breathing animation
    const breathingPhase = Math.sin(time * 2 + index * 0.5) * 0.1 + 1;
    const sourceSize = 35 * scale * breathingPhase;
    
    drawPlatformComponent(ctx, sourceX, sourceY, 0, sourceSize, sourceSize, 15 * scale, 
                         source, time, style, glowStrength, 'source', utils);
    
    // Add floating particles around active sources
    if (index % 2 === 0) {
      drawComponentParticles(ctx, sourceX, sourceY, 0, sourceSize, source.color, time, index, utils);
    }
  });
}

/**
 * Draw semantic layer in the center (main exploding component)
 */
function drawSemanticLayer(ctx, coreServices, explosion, time, scale, style, glowStrength, breathingIntensity, params, utils) {
  const serviceSpacing = 45 * scale;
  const explosionSpacing = explosion * 20;
  
  // Arrange services in a 2x2 grid that explodes apart
  const positions = [
    { x: -serviceSpacing - explosionSpacing, y: -serviceSpacing - explosionSpacing },
    { x: serviceSpacing + explosionSpacing, y: -serviceSpacing - explosionSpacing },
    { x: -serviceSpacing - explosionSpacing, y: serviceSpacing + explosionSpacing },
    { x: serviceSpacing + explosionSpacing, y: serviceSpacing + explosionSpacing }
  ];
  
  coreServices.forEach((service, index) => {
    const pos = positions[index % positions.length];
    
    // Add spiral motion during explosion
    const spiralPhase = time * 0.5 + index * Math.PI / 2;
    const spiralRadius = explosion * 15;
    const spiralX = Math.cos(spiralPhase) * spiralRadius;
    const spiralY = Math.sin(spiralPhase) * spiralRadius;
    
    const serviceX = pos.x + spiralX;
    const serviceY = pos.y + spiralY;
    const serviceZ = explosion * 30;
    
    // Enhanced breathing for core services
    const breathingPhase = Math.sin(time * breathingIntensity + index * 0.8) * 0.15 + 1;
    const serviceWidth = 60 * scale * breathingPhase;
    const serviceDepth = 50 * scale * breathingPhase;
    const serviceHeight = 25 * scale;
    
    drawPlatformComponent(ctx, serviceX, serviceY, serviceZ, serviceWidth, serviceDepth, serviceHeight,
                         service, time, style, glowStrength, 'core', utils);
    
    // Add energy field for core services
    drawServiceEnergyField(ctx, serviceX, serviceY, serviceZ + serviceHeight, 
                          serviceWidth, service.color, time, index, utils);
  });
  
  // Draw semantic layer container outline when not exploded
  if (explosion < 0.3) {
    drawSemanticContainer(ctx, scale, time, params, utils);
  }
}

/**
 * Draw output integrations on the right side
 */
function drawOutputIntegrations(ctx, outputs, explosion, time, scale, style, glowStrength, params, utils) {
  const outputSpacing = 60 * scale;
  const startY = -(outputs.length - 1) * outputSpacing / 2;
  const baseX = 200 * scale + explosion * 40;
  
  outputs.forEach((output, index) => {
    const outputY = startY + index * outputSpacing;
    const outputX = baseX + Math.sin(time * 1.8 + index * 0.4) * explosion * 8;
    
    // Pulsing animation for outputs
    const pulsePhase = Math.sin(time * 3 + index * 0.7) * 0.12 + 1;
    const outputSize = 32 * scale * pulsePhase;
    
    drawPlatformComponent(ctx, outputX, outputY, 0, outputSize, outputSize, 12 * scale,
                         output, time, style, glowStrength, 'output', utils);
    
    // Add data reception indicators
    if (time % (2 + index * 0.3) < 0.2) {
      drawDataReceptionEffect(ctx, outputX, outputY, 0, outputSize, output.color, time, utils);
    }
  });
}

/**
 * Draw a platform component (source, core service, or output)
 */
function drawPlatformComponent(ctx, x, y, z, width, depth, height, component, time, style, glowStrength, type, utils) {
  // Project to isometric
  const projected = utils.iso.project(x, y, z);
  
  // Draw glow effect
  if (glowStrength > 0 && type === 'core') {
    ctx.save();
    ctx.globalAlpha = glowStrength * 0.4;
    ctx.shadowColor = component.color;
    ctx.shadowBlur = 20;
    ctx.fillStyle = component.color;
    ctx.beginPath();
    ctx.arc(projected.x, projected.y, width * 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  
  // Draw component based on style
  switch(style) {
    case 'modern':
      drawModernComponent(ctx, x, y, z, width, depth, height, component, time, type, utils);
      break;
    case 'glass':
      drawGlassComponent(ctx, x, y, z, width, depth, height, component, time, type, utils);
      break;
    case 'neon':
      drawNeonComponent(ctx, x, y, z, width, depth, height, component, time, type, utils);
      break;
    default:
      drawSolidComponent(ctx, x, y, z, width, depth, height, component, time, type, utils);
  }
}

/**
 * Draw modern style component
 */
function drawModernComponent(ctx, x, y, z, width, depth, height, component, time, type, utils) {
  if (type === 'core') {
    // Draw as isometric building for core services
    utils.iso.drawBuilding(ctx, x - width/2, y - depth/2, z, width, depth, height, component.color, {
      windows: true,
      windowColor: utils.iso.adjustBrightness(component.color, 1.3),
      lighting: true,
      stroke: true
    });
  } else {
    // Draw as rounded rectangle for sources/outputs
    const projected = utils.iso.project(x, y, z + height/2);
    
    ctx.save();
    ctx.fillStyle = component.color;
    ctx.strokeStyle = utils.iso.adjustBrightness(component.color, 0.7);
    ctx.lineWidth = 2;
    
    // Draw rounded rectangle (fallback for browsers without roundRect)
    const cornerRadius = width * 0.2;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(projected.x - width/2, projected.y - depth/2, width, depth, cornerRadius);
    } else {
      ctx.rect(projected.x - width/2, projected.y - depth/2, width, depth);
    }
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

/**
 * Draw glass style component
 */
function drawGlassComponent(ctx, x, y, z, width, depth, height, component, time, type, utils) {
  const projected = utils.iso.project(x, y, z + height/2);
  
  ctx.save();
  ctx.globalAlpha = 0.7;
  ctx.fillStyle = component.color;
  ctx.strokeStyle = utils.iso.adjustBrightness(component.color, 1.5);
  ctx.lineWidth = 1;
  ctx.shadowColor = component.color;
  ctx.shadowBlur = 10;
  
  if (type === 'core') {
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(projected.x - width/2, projected.y - depth/2, width, depth, width * 0.15);
    } else {
      ctx.rect(projected.x - width/2, projected.y - depth/2, width, depth);
    }
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(projected.x, projected.y, width/2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  
  ctx.restore();
}

/**
 * Draw neon style component
 */
function drawNeonComponent(ctx, x, y, z, width, depth, height, component, time, type, utils) {
  const projected = utils.iso.project(x, y, z + height/2);
  const pulseIntensity = Math.sin(time * 4 + x * 0.01) * 0.3 + 0.7;
  
  ctx.save();
  ctx.globalAlpha = pulseIntensity;
  ctx.strokeStyle = component.color;
  ctx.lineWidth = 3;
  ctx.shadowColor = component.color;
  ctx.shadowBlur = 15;
  
  if (type === 'core') {
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(projected.x - width/2, projected.y - depth/2, width, depth, width * 0.1);
    } else {
      ctx.rect(projected.x - width/2, projected.y - depth/2, width, depth);
    }
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(projected.x, projected.y, width/2, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  ctx.restore();
}

/**
 * Draw solid style component
 */
function drawSolidComponent(ctx, x, y, z, width, depth, height, component, time, type, utils) {
  if (type === 'core') {
    utils.iso.drawCube(ctx, x - width/2, y - depth/2, z, Math.min(width, depth), component.color, {
      lighting: true,
      stroke: true
    });
  } else {
    const projected = utils.iso.project(x, y, z + height/2);
    
    ctx.save();
    ctx.fillStyle = component.color;
    ctx.beginPath();
    ctx.arc(projected.x, projected.y, width/2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

/**
 * Draw semantic layer container
 */
function drawSemanticContainer(ctx, scale, time, params, utils) {
  const containerSize = 140 * scale;
  const projected = utils.iso.project(0, 0, 10);
  
  ctx.save();
  ctx.strokeStyle = params.strokeColor || '#6366f1';
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.6;
  ctx.setLineDash([10, 5]);
  ctx.lineDashOffset = -time * 20;
  
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(projected.x - containerSize/2, projected.y - containerSize/2, 
                  containerSize, containerSize, 20);
  } else {
    ctx.rect(projected.x - containerSize/2, projected.y - containerSize/2, 
             containerSize, containerSize);
  }
  ctx.stroke();
  ctx.restore();
}

/**
 * Draw energy field around core services
 */
function drawServiceEnergyField(ctx, x, y, z, size, color, time, index, utils) {
  const fieldRadius = size * 0.8;
  const centerPoint = utils.iso.project(x, y, z);
  
  // Draw pulsing energy ring
  const pulsePhase = time * 2 + index * Math.PI / 2;
  const pulseRadius = fieldRadius * (0.8 + Math.sin(pulsePhase) * 0.2);
  
  ctx.save();
  ctx.globalAlpha = 0.4;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerPoint.x, centerPoint.y, pulseRadius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

/**
 * Draw floating particles around components
 */
function drawComponentParticles(ctx, x, y, z, size, color, time, index, utils) {
  const particleCount = 3;
  
  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2 + time + index;
    const radius = size * 1.5;
    const particleX = x + Math.cos(angle) * radius;
    const particleY = y + Math.sin(angle) * radius * 0.6;
    const particleZ = z + Math.sin(time * 2 + i) * 10;
    
    const projected = utils.iso.project(particleX, particleY, particleZ);
    
    ctx.save();
    ctx.globalAlpha = 0.6 + Math.sin(time * 3 + i) * 0.4;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(projected.x, projected.y, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

/**
 * Draw data reception effect for outputs
 */
function drawDataReceptionEffect(ctx, x, y, z, size, color, time, utils) {
  const effectSize = size * 1.5;
  const projected = utils.iso.project(x, y, z);
  
  ctx.save();
  ctx.globalAlpha = 0.8;
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.shadowColor = color;
  ctx.shadowBlur = 10;
  
  for (let ring = 0; ring < 2; ring++) {
    const ringRadius = effectSize * (0.5 + ring * 0.3);
    ctx.beginPath();
    ctx.arc(projected.x, projected.y, ringRadius, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  ctx.restore();
}

/**
 * Draw data source connections
 */
function drawDataSourceConnections(ctx, config, explosion, time, scale, style, params, utils) {
  const sourceX = -200 * scale - explosion * 40;
  const coreX = 0;
  const outputX = 200 * scale + explosion * 40;
  
  // Source to core connections
  config.sources.forEach((_, index) => {
    const sourceY = -(config.sources.length - 1) * 60 * scale / 2 + index * 60 * scale;
    drawConnection(ctx, sourceX, sourceY, 0, coreX, 0, explosion * 30, style, time, params, utils);
  });
  
  // Core to output connections  
  config.outputs.forEach((_, index) => {
    const outputY = -(config.outputs.length - 1) * 60 * scale / 2 + index * 60 * scale;
    drawConnection(ctx, coreX, 0, explosion * 30, outputX, outputY, 0, style, time, params, utils);
  });
}

/**
 * Draw single connection line
 */
function drawConnection(ctx, x1, y1, z1, x2, y2, z2, style, time, params, utils) {
  const point1 = utils.iso.project(x1, y1, z1);
  const point2 = utils.iso.project(x2, y2, z2);
  
  ctx.save();
  
  switch(style) {
    case 'energy':
      ctx.strokeStyle = params.strokeColor || '#6366f1';
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.6;
      ctx.shadowColor = params.strokeColor || '#6366f1';
      ctx.shadowBlur = 8;
      break;
    case 'data':
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.lineDashOffset = -time * 15;
      ctx.globalAlpha = 0.7;
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
 * Draw platform data flow
 */
function drawPlatformDataFlow(ctx, config, explosion, time, speed, scale, params, utils) {
  const flowCount = 8;
  
  for (let i = 0; i < flowCount; i++) {
    const flowTime = time * speed + i * 0.4;
    const progress = (flowTime % 4) / 4; // 0 to 1
    
    if (progress > 0.8) continue; // Create gaps
    
    // Flow from sources to core
    if (progress < 0.4) {
      const sourceIndex = Math.floor(i % config.sources.length);
      const sourceY = -(config.sources.length - 1) * 60 * scale / 2 + sourceIndex * 60 * scale;
      const sourceX = -200 * scale - explosion * 40;
      const coreX = 0;
      
      const flowProgress = progress / 0.4;
      const flowX = sourceX + (coreX - sourceX) * flowProgress;
      const flowY = sourceY * (1 - flowProgress);
      const flowZ = explosion * 30 * flowProgress;
      
      const projected = utils.iso.project(flowX, flowY, flowZ);
      
      ctx.save();
      ctx.globalAlpha = 0.8 * (1 - flowProgress * 0.5);
      ctx.fillStyle = params.strokeColor || '#10b981';
      ctx.shadowColor = params.strokeColor || '#10b981';
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.arc(projected.x, projected.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    // Flow from core to outputs
    else {
      const outputIndex = Math.floor(i % config.outputs.length);
      const outputY = -(config.outputs.length - 1) * 60 * scale / 2 + outputIndex * 60 * scale;
      const coreX = 0;
      const outputX = 200 * scale + explosion * 40;
      
      const flowProgress = (progress - 0.4) / 0.4;
      const flowX = coreX + (outputX - coreX) * flowProgress;
      const flowY = outputY * flowProgress;
      const flowZ = explosion * 30 * (1 - flowProgress);
      
      const projected = utils.iso.project(flowX, flowY, flowZ);
      
      ctx.save();
      ctx.globalAlpha = 0.8 * (1 - flowProgress * 0.5);
      ctx.fillStyle = params.strokeColor || '#ec4899';
      ctx.shadowColor = params.strokeColor || '#ec4899';
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.arc(projected.x, projected.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
}

/**
 * Draw platform labels
 */
function drawPlatformLabels(ctx, config, explosion, time, scale, style, params, utils) {
  // Main platform label
  const titlePoint = utils.iso.project(0, -120 * scale, explosion * 40);
  
  ctx.save();
  switch(style) {
    case 'glow':
      ctx.shadowColor = params.strokeColor || '#ffffff';
      ctx.shadowBlur = 8;
      ctx.fillStyle = '#ffffff';
      break;
    case 'neon':
      ctx.shadowColor = params.strokeColor || '#6366f1';
      ctx.shadowBlur = 12;
      ctx.fillStyle = params.strokeColor || '#6366f1';
      break;
    default:
      ctx.fillStyle = params.strokeColor || '#374151';
  }
  
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(config.name, titlePoint.x, titlePoint.y);
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

// Parameter definitions - focused on core controls
export const parameters = {
  // Core Configuration
  platformType: select('cube-cloud', [
    { value: 'cube-cloud', label: '🧊 Cube Cloud' },
    { value: 'modern-stack', label: '🏗️ Modern Data Stack' },
    { value: 'ml-platform', label: '🤖 ML Platform' }
  ], 'Platform Type'),
  
  colorScheme: select('modern', [
    { value: 'modern', label: '🔮 Modern' },
    { value: 'vibrant', label: '🌈 Vibrant' },
    { value: 'ocean', label: '🌊 Ocean' },
    { value: 'corporate', label: '🏢 Corporate' }
  ], 'Color Scheme'),
  
  // Main Animation Controls
  explosionAmount: slider(60, 0, 120, 10, 'Layer Separation', 'px'),
  animationSpeed: slider(0.8, 0.1, 2.0, 0.1, 'Animation Speed', 'x'),
  
  // Visual Style
  componentStyle: select('modern', [
    { value: 'modern', label: '✨ Modern' },
    { value: 'glass', label: '🔍 Glass' },
    { value: 'neon', label: '💫 Neon' },
    { value: 'solid', label: '⬜ Solid' }
  ], 'Component Style'),
  
  glowIntensity: slider(1.0, 0, 2.0, 0.2, 'Glow Effect', 'x'),
  
  // Data Flow
  showDataFlow: toggle(true, 'Show Data Flow'),
  dataFlowSpeed: slider(1.2, 0.5, 3.0, 0.2, 'Data Flow Speed', 'x'),
  
  // Layout
  showConnections: toggle(true, 'Show Connections'),
  showLabels: toggle(true, 'Show Labels'),
  viewAngle: slider(0, -20, 20, 2, 'View Angle', '°')
};

// Template metadata
export const metadata = {
  name: "📊 Data Platform Stack",
  description: "Animated data platform architecture inspired by modern analytics stacks like Cube Cloud - perfect for data engineering presentations",
  category: "isometric",
  tags: ["isometric", "data", "platform", "analytics", "architecture", "animated", "enterprise"],
  author: "ReFlow",
  version: "1.0.0"
};