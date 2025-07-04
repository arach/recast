import type { ParameterDefinition, PresetMetadata } from './types';

// Brand Network - Logo-optimized network shapes
const PARAMETERS = {
  // Universal Background Controls
  backgroundColor: { type: 'color', default: "#ffffff", label: 'Background Color', category: 'Background' },
  backgroundType: { type: 'select', options: [{"value":"transparent","label":"Transparent"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "solid", label: 'Background Type', category: 'Background' },
  backgroundGradientStart: { type: 'color', default: "#ffffff", label: 'Gradient Start', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientEnd: { type: 'color', default: "#f0f0f0", label: 'Gradient End', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 45, label: 'Gradient Direction', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  
  // Universal Fill Controls
  fillType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "solid", label: 'Fill Type', category: 'Fill' },
  fillColor: { type: 'color', default: "#e6f2ff", label: 'Fill Color', category: 'Fill', showIf: (params)=>params.fillType === 'solid' },
  fillGradientStart: { type: 'color', default: "#e6f2ff", label: 'Gradient Start', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientEnd: { type: 'color', default: "#cce7ff", label: 'Gradient End', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 90, label: 'Gradient Direction', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.1, label: 'Fill Opacity', category: 'Fill', showIf: (params)=>params.fillType !== 'none' },
  
  // Universal Stroke Controls
  strokeType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid"},{"value":"dashed","label":"Dashed"},{"value":"dotted","label":"Dotted"}], default: "solid", label: 'Stroke Type', category: 'Stroke' },
  strokeColor: { type: 'color', default: "#0064c8", label: 'Stroke Color', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeWidth: { type: 'slider', min: 0, max: 10, step: 0.5, default: 3, label: 'Stroke Width', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Stroke Opacity', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  
  // Minimal controls for clean logos
  frequency: { type: 'slider', min: 0.1, max: 2, step: 0.1, default: 0.8, label: 'Pulse Speed' },
  amplitude: { type: 'slider', min: 40, max: 120, step: 5, default: 70, label: 'Logo Size' },
  complexity: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.0, label: 'Connection Density' },
  
  // Brand shape - minimal set
  shapeType: { 
    type: 'slider', 
    min: 0, 
    max: 3, 
    step: 1, 
    default: 0, 
    label: 'Brand Shape (0=Circle, 1=Star, 2=Shield, 3=Hexagon)' 
  },
  nodeCount: { type: 'slider', min: 3, max: 8, step: 1, default: 4, label: 'Connection Points' },
  
  // Logo styling
  contrast: { type: 'slider', min: 0.5, max: 1, step: 0.05, default: 1, label: 'Contrast' }
};

function applyUniversalBackground(ctx, width, height, params) {
  if (params.backgroundType === 'transparent') {
    ctx.clearRect(0, 0, width, height);
  } else if (params.backgroundType === 'gradient') {
    const angle = (params.backgroundGradientDirection || 45) * Math.PI / 180;
    const x1 = width / 2 - Math.cos(angle) * width;
    const y1 = height / 2 - Math.sin(angle) * height;
    const x2 = width / 2 + Math.cos(angle) * width;
    const y2 = height / 2 + Math.sin(angle) * height;
    
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, params.backgroundGradientStart || '#ffffff');
    gradient.addColorStop(1, params.backgroundGradientEnd || '#f0f0f0');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  } else {
    ctx.fillStyle = params.backgroundColor || '#ffffff';
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

  // Extract parameters with logo-friendly defaults
  const centerX = width / 2;
  const centerY = height / 2;
  const frequency = params.frequency || 0.8;
  const amplitude = params.amplitude || 70;
  const complexity = params.complexity || 0.0;
  const shapeTypeNum = Math.round(params.shapeType || 0);
  const nodeCount = Math.max(3, Math.min(8, params.nodeCount || 4));
  const contrast = params.contrast || 1;

  // Logo-friendly shape types (simplified set)
  const shapeTypes = ['circle', 'star', 'shield', 'hexagon'];
  const shapeType = shapeTypes[shapeTypeNum] || 'circle';

  // Base scale for logo sizing
  const baseScale = Math.min(width, height) / 300;
  const scaledAmplitude = amplitude * baseScale;

  // Gentle pulse for subtle animation (logo-appropriate)
  const pulsePhase = time * frequency;
  const pulse = 1 + Math.sin(pulsePhase) * 0.1; // Very subtle 10% pulse

  // Generate clean nodes in brand shape
  const nodes = generateCleanBrandShape(
    shapeType, 
    centerX, 
    centerY, 
    scaledAmplitude * pulse, 
    nodeCount,
    pulsePhase
  );

  // Set up clean line style
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // Draw clean connections (minimal, logo-appropriate)
  if (complexity > 0.1) {
    drawCleanConnections(ctx, nodes, complexity, params, contrast);
  }

  // Draw the main shape outline (bold, recognizable)
  drawShapeOutline(ctx, nodes, params, contrast);

  // Draw clean nodes (simple, bold)
  drawCleanNodes(ctx, nodes, scaledAmplitude * 0.08, params, contrast);

  function generateCleanBrandShape(shapeType, centerX, centerY, radius, nodeCount, phase) {
    const nodes = [];
    
    switch (shapeType) {
      case 'circle':
        for (let i = 0; i < nodeCount; i++) {
          const angle = (i / nodeCount) * Math.PI * 2;
          nodes.push({
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius
          });
        }
        break;
        
      case 'star':
        // Clean 5-point star (logo classic)
        const starPoints = 5;
        for (let i = 0; i < starPoints; i++) {
          const angle = (i / starPoints) * Math.PI * 2 - Math.PI / 2;
          nodes.push({
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius
          });
        }
        break;
        
      case 'shield':
        // Classic shield proportions
        const shieldPoints = [
          {x: centerX, y: centerY - radius},                    // Top point
          {x: centerX + radius * 0.6, y: centerY - radius * 0.3}, // Top right
          {x: centerX + radius * 0.6, y: centerY + radius * 0.3}, // Bottom right  
          {x: centerX, y: centerY + radius},                    // Bottom point
          {x: centerX - radius * 0.6, y: centerY + radius * 0.3}, // Bottom left
          {x: centerX - radius * 0.6, y: centerY - radius * 0.3}  // Top left
        ];
        nodes.push(...shieldPoints.slice(0, nodeCount));
        break;
        
      case 'hexagon':
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2;
          nodes.push({
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius
          });
        }
        break;
    }
    
    return nodes;
  }

  function drawCleanConnections(ctx, nodes, complexity, params, contrast) {
    ctx.save();
    
    // Apply stroke settings with reduced opacity for connections
    const connectionOpacity = 0.3 * contrast * (params.strokeOpacity || 1);
    ctx.globalAlpha = connectionOpacity;
    ctx.strokeStyle = params.strokeColor || '#0064c8';
    ctx.lineWidth = (params.strokeWidth || 3) * 0.5;
    
    // Apply stroke dash pattern if needed
    if (params.strokeType === 'dashed') {
      ctx.setLineDash([5, 5]);
    } else if (params.strokeType === 'dotted') {
      ctx.setLineDash([2, 4]);
    }
    
    // Only connect adjacent nodes for clean look
    for (let i = 0; i < nodes.length; i++) {
      const nextIndex = (i + 1) % nodes.length;
      const node = nodes[i];
      const nextNode = nodes[nextIndex];
      
      if (Math.random() < complexity) {
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(nextNode.x, nextNode.y);
        ctx.stroke();
      }
    }
    
    ctx.restore();
  }

  function drawShapeOutline(ctx, nodes, params, contrast) {
    if (nodes.length < 3) return;
    
    ctx.save();
    
    // Fill the shape
    if (params.fillType !== 'none') {
      ctx.globalAlpha = (params.fillOpacity || 0.1) * contrast;
      
      if (params.fillType === 'solid') {
        ctx.fillStyle = params.fillColor || '#e6f2ff';
      } else if (params.fillType === 'gradient') {
        const bounds = getBounds(nodes);
        const angle = (params.fillGradientDirection || 90) * Math.PI / 180;
        const gradientLength = Math.max(bounds.width, bounds.height);
        
        const startX = bounds.centerX - Math.cos(angle) * gradientLength * 0.5;
        const startY = bounds.centerY - Math.sin(angle) * gradientLength * 0.5;
        const endX = bounds.centerX + Math.cos(angle) * gradientLength * 0.5;
        const endY = bounds.centerY + Math.sin(angle) * gradientLength * 0.5;
        
        const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
        gradient.addColorStop(0, params.fillGradientStart || '#e6f2ff');
        gradient.addColorStop(1, params.fillGradientEnd || '#cce7ff');
        
        ctx.fillStyle = gradient;
      }
      
      ctx.beginPath();
      ctx.moveTo(nodes[0].x, nodes[0].y);
      for (let i = 1; i < nodes.length; i++) {
        ctx.lineTo(nodes[i].x, nodes[i].y);
      }
      ctx.closePath();
      ctx.fill();
    }
    
    // Stroke the outline
    if (params.strokeType !== 'none') {
      ctx.globalAlpha = (params.strokeOpacity || 1) * contrast;
      ctx.strokeStyle = params.strokeColor || '#0064c8';
      ctx.lineWidth = params.strokeWidth || 3;
      
      // Apply stroke dash pattern if needed
      if (params.strokeType === 'dashed') {
        ctx.setLineDash([params.strokeWidth * 3, params.strokeWidth * 2]);
      } else if (params.strokeType === 'dotted') {
        ctx.setLineDash([params.strokeWidth, params.strokeWidth * 2]);
      }
      
      ctx.beginPath();
      ctx.moveTo(nodes[0].x, nodes[0].y);
      for (let i = 1; i < nodes.length; i++) {
        ctx.lineTo(nodes[i].x, nodes[i].y);
      }
      ctx.closePath();
      ctx.stroke();
    }
    
    ctx.restore();
  }

  function drawCleanNodes(ctx, nodes, nodeSize, params, contrast) {
    ctx.save();
    
    // Use stroke color for nodes
    ctx.fillStyle = params.strokeColor || '#0064c8';
    ctx.globalAlpha = (params.strokeOpacity || 1) * contrast;
    
    for (const node of nodes) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }

  function getBounds(nodes) {
    const xs = nodes.map(n => n.x);
    const ys = nodes.map(n => n.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    
    return {
      minX, maxX, minY, maxY,
      width: maxX - minX,
      height: maxY - minY,
      centerX: (minX + maxX) / 2,
      centerY: (minY + maxY) / 2
    };
  }
}

export const metadata: PresetMetadata = {
  name: "🎯 Brand Network",
  description: "Clean, logo-ready network shapes optimized for brand identity and small sizes",
  defaultParams: {
    seed: "brand-network",
    backgroundColor: "#ffffff",
    backgroundType: "solid",
    backgroundGradientStart: "#ffffff",
    backgroundGradientEnd: "#f0f0f0",
    backgroundGradientDirection: 45,
    fillType: "solid",
    fillColor: "#e6f2ff",
    fillGradientStart: "#e6f2ff",
    fillGradientEnd: "#cce7ff",
    fillGradientDirection: 90,
    fillOpacity: 0.1,
    strokeType: "solid",
    strokeColor: "#0064c8",
    strokeWidth: 3,
    strokeOpacity: 1,
    frequency: 0.8,
    amplitude: 70,
    complexity: 0.0,
    shapeType: 0,
    nodeCount: 4,
    contrast: 1
  }
};

export const id = 'brand-network';
export const name = "Brand Network";
export const description = "Clean, logo-ready network shapes optimized for brand identity and small sizes";
export const defaultParams = metadata.defaultParams;
export const parameters = PARAMETERS;
export { drawVisualization };

export const code = `// Brand Network - Logo-optimized network shapes
const PARAMETERS = ${JSON.stringify(PARAMETERS, null, 2)};

${applyUniversalBackground.toString()}

${drawVisualization.toString()}`;