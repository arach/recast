// 🌐 Network Constellation - Brand-smart network formations creating globally recognized logo shapes

const parameters = {
  shapeType: {
    type: 'select',
    default: 0,
    options: [
      { value: 0, label: '⭕ Circle' },
      { value: 1, label: '⭐ Star' },
      { value: 2, label: '🛡️ Shield' },
      { value: 3, label: '⬡ Hexagon' },
      { value: 4, label: '♦️ Diamond' },
      { value: 5, label: '▲ Triangle' }
    ],
    label: 'Network Shape',
    category: 'Geometry'
  },
  nodeCount: {
    type: 'slider',
    default: 8,
    min: 3,
    max: 24,
    step: 1,
    label: 'Node Count',
    category: 'Geometry'
  },
  connectionStyle: {
    type: 'select',
    default: 0,
    options: [
      { value: 0, label: '〰️ Flowing' },
      { value: 1, label: '🧠 Neural' },
      { value: 2, label: '🧲 Magnetic' },
      { value: 3, label: '➖ Minimal' }
    ],
    label: 'Connection Style',
    category: 'Effects'
  },
  frequency: {
    type: 'slider',
    default: 1.2,
    min: 0.1,
    max: 4,
    step: 0.1,
    label: 'Animation Speed',
    category: 'Movement'
  },
  amplitude: {
    type: 'slider',
    default: 80,
    min: 30,
    max: 150,
    step: 5,
    label: 'Size',
    category: 'Geometry'
  },
  complexity: {
    type: 'slider',
    default: 0.7,
    min: 0,
    max: 1,
    step: 0.05,
    label: 'Connection Density',
    category: 'Network'
  },
  chaos: {
    type: 'slider',
    default: 0.15,
    min: 0,
    max: 1,
    step: 0.05,
    label: 'Node Chaos',
    category: 'Effects'
  },
  layers: {
    type: 'slider',
    default: 2,
    min: 1,
    max: 5,
    step: 1,
    label: 'Depth Layers',
    category: 'Geometry'
  },
  energyFlow: {
    type: 'slider',
    default: 0.8,
    min: 0,
    max: 1,
    step: 0.05,
    label: 'Energy Flow',
    category: 'Network'
  },
  glowIntensity: {
    type: 'slider',
    default: 0.6,
    min: 0,
    max: 1,
    step: 0.05,
    label: 'Glow Intensity',
    category: 'Effects'
  },
  damping: {
    type: 'slider',
    default: 0.8,
    min: 0.3,
    max: 1,
    step: 0.05,
    label: 'Layer Damping',
    category: 'Effects'
  }
};

function drawVisualization(ctx, width, height, params, time, utils) {
  // Apply universal background
  utils.background.apply(ctx, width, height, params);
  
  // Access universal properties
  const fillColor = params.fillColor || '#4080ff';
  const strokeColor = params.strokeColor || '#80c0ff';
  const fillOpacity = params.fillOpacity ?? 0.7;
  const strokeOpacity = params.strokeOpacity ?? 0.8;

  // Extract parameters
  const centerX = width / 2;
  const centerY = height / 2;
  const layers = params.layers || 2;
  const frequency = params.frequency || 1.2;
  const amplitude = params.amplitude || 80;
  const complexity = params.complexity || 0.7;
  const chaos = params.chaos || 0.15;
  const damping = params.damping || 0.8;
  const shapeTypeNum = Math.round(params.shapeType || 0);
  const shapeTypes = ['circle', 'star', 'shield', 'hexagon', 'diamond', 'triangle'];
  const shapeType = shapeTypes[shapeTypeNum] || 'circle';
  const nodeCount = params.nodeCount || 8;
  const connectionStyleNum = Math.round(params.connectionStyle || 0);
  const connectionStyles = ['flowing', 'neural', 'magnetic', 'minimal'];
  const connectionStyle = connectionStyles[connectionStyleNum] || 'flowing';
  const energyFlow = params.energyFlow || 0.8;
  const glowIntensity = params.glowIntensity || 0.6;

  // Base scale
  const baseScale = Math.min(width, height) / 400;
  const scaledAmplitude = amplitude * baseScale;

  // Seeded random
  let seed = 1;
  const seedStr = params.seed || 'network-constellation';
  for (let i = 0; i < seedStr.length; i++) {
    seed = ((seed << 5) - seed) + seedStr.charCodeAt(i);
    seed = seed & seed;
  }
  
  function seededRandom() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  // Generate constellation layers
  for (let layer = 0; layer < layers; layer++) {
    const layerPhase = time * frequency + (layer * Math.PI / layers);
    const layerScale = scaledAmplitude * Math.pow(damping, layer);
    const layerAlpha = (1 - layer * 0.3);
    
    // Color progression through brand-friendly spectrum
    const hue = (layer / layers) * 60 + time * 10 + 220; // Blue to purple to pink
    const saturation = 80 - layer * 10;
    const lightness = 60 + Math.sin(layerPhase) * 20;
    
    // Generate nodes in brand shape formation
    const nodes = generateBrandShapeNodes(
      shapeType, 
      centerX, 
      centerY, 
      layerScale, 
      nodeCount + layer * 2, 
      layerPhase, 
      chaos, 
      seededRandom
    );
    
    // Draw connections first (behind nodes)
    drawConnections(
      ctx, 
      nodes, 
      connectionStyle, 
      complexity, 
      energyFlow, 
      time, 
      layerPhase, 
      hue, 
      saturation, 
      lightness, 
      layerAlpha,
      glowIntensity,
      params,
      fillColor,
      strokeColor,
      fillOpacity,
      strokeOpacity
    );
    
    // Draw nodes on top
    drawNodes(
      ctx, 
      nodes, 
      layerScale, 
      time, 
      layerPhase, 
      hue, 
      saturation, 
      lightness, 
      layerAlpha,
      glowIntensity,
      params,
      fillColor,
      fillOpacity
    );
  }

  // Add subtle network particles if high complexity
  if (complexity > 0.6) {
    drawNetworkParticles(ctx, centerX, centerY, scaledAmplitude, time, complexity);
  }

  function generateBrandShapeNodes(shapeType, centerX, centerY, radius, nodeCount, phase, chaos, random) {
    const nodes = [];
    
    for (let i = 0; i < nodeCount; i++) {
      let angle, distance, x, y;
      
      switch (shapeType) {
        case 'circle':
          angle = (i / nodeCount) * Math.PI * 2 + phase;
          distance = radius + Math.sin(phase + i) * radius * 0.1;
          x = centerX + Math.cos(angle) * distance;
          y = centerY + Math.sin(angle) * distance;
          break;
          
        case 'star':
          const starPoints = Math.max(5, Math.floor(nodeCount / 2));
          const isOuter = i % 2 === 0;
          const starAngle = (Math.floor(i / 2) / starPoints) * Math.PI * 2 + phase;
          const starRadius = isOuter ? radius : radius * 0.5;
          x = centerX + Math.cos(starAngle) * starRadius;
          y = centerY + Math.sin(starAngle) * starRadius;
          break;
          
        case 'shield':
          // Shield shape: wider at top, pointed at bottom
          const shieldT = i / (nodeCount - 1);
          const shieldAngle = Math.PI * 0.8 * (shieldT - 0.5) + phase * 0.1;
          const shieldHeight = Math.cos(shieldAngle * 0.8) * radius;
          x = centerX + Math.sin(shieldAngle) * radius * 0.8;
          y = centerY - shieldHeight * 0.3 + shieldHeight;
          break;
          
        case 'hexagon':
          const hexSide = Math.floor(i / (nodeCount / 6));
          const hexT = (i % (nodeCount / 6)) / (nodeCount / 6);
          const hexAngle = (hexSide * Math.PI / 3) + phase;
          const hexRadius = radius * (0.9 + hexT * 0.1);
          x = centerX + Math.cos(hexAngle) * hexRadius;
          y = centerY + Math.sin(hexAngle) * hexRadius;
          break;
          
        case 'diamond':
          const diamondAngle = (i / nodeCount) * Math.PI * 2 + phase;
          const diamondRadius = radius * (1 + 0.5 * Math.cos(diamondAngle * 2));
          x = centerX + Math.cos(diamondAngle) * diamondRadius;
          y = centerY + Math.sin(diamondAngle) * diamondRadius * 0.8;
          break;
          
        case 'triangle':
          const triSide = Math.floor(i / (nodeCount / 3));
          const triT = (i % (nodeCount / 3)) / (nodeCount / 3);
          const triAngle = (triSide * Math.PI * 2 / 3) + phase + Math.PI / 2;
          x = centerX + Math.cos(triAngle) * radius * (0.8 + triT * 0.2);
          y = centerY + Math.sin(triAngle) * radius * (0.8 + triT * 0.2);
          break;
          
        default:
          angle = (i / nodeCount) * Math.PI * 2 + phase;
          x = centerX + Math.cos(angle) * radius;
          y = centerY + Math.sin(angle) * radius;
      }
      
      // Add chaos variation
      x += (random() - 0.5) * radius * chaos * 0.3;
      y += (random() - 0.5) * radius * chaos * 0.3;
      
      // Energy level for pulsing
      const energy = Math.sin(phase + i * 0.5) * 0.5 + 0.5;
      
      nodes.push({ x, y, energy });
    }
    
    return nodes;
  }

  function drawConnections(ctx, nodes, style, complexity, energyFlow, time, phase, hue, saturation, lightness, alpha, glowIntensity, params, fillColor, strokeColor, fillOpacity, strokeOpacity) {
    const connectionCount = Math.floor(nodes.length * complexity);
    
    ctx.save();
    ctx.globalAlpha = alpha * 0.7;
    
    // Add glow for connections
    if (glowIntensity > 0.3) {
      ctx.shadowColor = `hsla(${hue}, ${saturation}%, ${lightness}%, ${glowIntensity})`;
      ctx.shadowBlur = 10;
    }
    
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      
      // Connect to nearest neighbors
      const connections = Math.min(3, connectionCount);
      for (let c = 0; c < connections; c++) {
        const targetIndex = (i + 1 + c) % nodes.length;
        const target = nodes[targetIndex];
        
        // Connection strength based on energy flow
        const connectionStrength = energyFlow * (node.energy + target.energy) * 0.5;
        const connectionAlpha = connectionStrength * alpha;
        
        if (connectionAlpha > 0.1) {
          ctx.beginPath();
          
          if (style === 'flowing') {
            // Curved flowing lines
            const midX = (node.x + target.x) / 2 + Math.sin(time * 2 + i) * 20;
            const midY = (node.y + target.y) / 2 + Math.cos(time * 2 + i) * 20;
            ctx.moveTo(node.x, node.y);
            ctx.quadraticCurveTo(midX, midY, target.x, target.y);
          } else if (style === 'neural') {
            // Pulsing straight lines with energy bursts
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(target.x, target.y);
          } else {
            // Clean straight lines
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(target.x, target.y);
          }
          
          // Dynamic line width based on energy
          const lineWidth = Math.max(1, connectionStrength * 3);
          ctx.lineWidth = params.strokeWidth || lineWidth;
          
          // Color intensity based on connection strength
          const connectionLightness = lightness + connectionStrength * 30;
          ctx.strokeStyle = strokeColor || `hsla(${hue}, ${saturation}%, ${connectionLightness}%, ${connectionAlpha})`;
          ctx.globalAlpha = connectionAlpha * strokeOpacity;
          
          ctx.stroke();
        }
      }
    }
    
    ctx.restore();
  }

  function drawNodes(ctx, nodes, scale, time, phase, hue, saturation, lightness, alpha, glowIntensity, params, fillColor, fillOpacity) {
    ctx.save();
    
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const nodeSize = (scale * 0.05) * (0.8 + node.energy * 0.4);
      
      ctx.globalAlpha = alpha;
      
      // Outer glow
      if (glowIntensity > 0.2) {
        ctx.shadowColor = `hsla(${hue}, ${saturation}%, ${lightness + 20}%, ${glowIntensity})`;
        ctx.shadowBlur = nodeSize * 2;
      }
      
      // Node core
      ctx.globalAlpha = alpha * fillOpacity;
      ctx.fillStyle = fillColor || `hsl(${hue}, ${saturation}%, ${lightness + node.energy * 20}%)`;
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Inner highlight
      ctx.shadowBlur = 0;
      ctx.fillStyle = `hsla(${hue + 30}, 90%, 80%, ${0.6 + node.energy * 0.4})`;
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeSize * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }

  function drawNetworkParticles(ctx, centerX, centerY, radius, time, complexity) {
    ctx.save();
    
    const particleCount = Math.floor(complexity * 8);
    
    for (let p = 0; p < particleCount; p++) {
      const particleAngle = (p / particleCount) * Math.PI * 2 + time * 0.5;
      const particleRadius = radius * (0.2 + 0.8 * Math.sin(time + p));
      const particleX = centerX + Math.cos(particleAngle) * particleRadius;
      const particleY = centerY + Math.sin(particleAngle) * particleRadius;
      const particleSize = 2 + Math.sin(time * 3 + p) * 1;
      
      ctx.fillStyle = `hsla(240, 80%, 70%, ${0.3 + Math.sin(time * 2 + p) * 0.3})`;
      ctx.beginPath();
      ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }
}

const metadata = {
  id: 'network-constellation',
  name: "🌐 Network Constellation",
  description: "Brand-smart network formations creating globally recognized logo shapes",
  parameters,
  defaultParams: {
    shapeType: 0,
    nodeCount: 8,
    connectionStyle: 0,
    frequency: 1.2,
    amplitude: 80,
    complexity: 0.7,
    chaos: 0.15,
    layers: 2,
    energyFlow: 0.8,
    glowIntensity: 0.6,
    damping: 0.8
  }
};

