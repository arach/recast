import type { TemplateUtils } from '@/lib/template-utils';

// Brand Network - Logo-optimized network shapes
const parameters = {
  // Minimal controls for clean logos
  frequency: {
    default: 0.8,
    range: [0.1, 2, 0.1]
  },
  amplitude: {
    default: 70,
    range: [40, 120, 5]
  },
  complexity: {
    default: 0.0,
    range: [0, 1, 0.01]
  },
  
  // Brand shape - minimal set
  shapeType: {
    default: 'Circle',
    options: ['Circle', 'Star', 'Shield', 'Hexagon']
  },
  nodeCount: {
    default: 4,
    range: [3, 8, 1]
  },
  
  // Logo styling
  contrast: {
    default: 1,
    range: [0.5, 1, 0.05]
  }
};

function drawVisualization(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: any,
  time: number,
  utils: TemplateUtils
) {
  // Apply universal background
  utils.applyUniversalBackground(ctx, width, height, params);
  
  // Access universal properties
  const fillColor = params.fillColor || '#e6f2ff';
  const strokeColor = params.strokeColor || '#0064c8';
  const fillOpacity = params.fillOpacity ?? 0.1;
  const strokeOpacity = params.strokeOpacity ?? 1;

  // Extract parameters with logo-friendly defaults
  const centerX = width / 2;
  const centerY = height / 2;
  const frequency = params.frequency || 0.8;
  const amplitude = params.amplitude || 70;
  const complexity = params.complexity || 0.0;
  const shapeType = (params.shapeType || 'Circle').toLowerCase();
  const nodeCount = Math.max(3, Math.min(8, params.nodeCount || 4));
  const contrast = params.contrast || 1;

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

const metadata = {
  id: 'brand-network',
  name: "🎯 Brand Network",
  description: "Clean, logo-ready network shapes optimized for brand identity and small sizes",
  parameters,
  defaultParams: {
    frequency: 0.8,
    amplitude: 70,
    complexity: 0.0,
    shapeType: 'Circle',
    nodeCount: 4,
    contrast: 1
  }
};

export { parameters, metadata, drawVisualization };