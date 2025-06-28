import type { ParameterDefinition, PresetMetadata } from './types';

// Brand Network - Logo-optimized network shapes
export const parameters: Record<string, ParameterDefinition> = {
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
  strokeWeight: { type: 'slider', min: 1, max: 8, step: 1, default: 3, label: 'Line Weight' },
  fillOpacity: { type: 'slider', min: 0, max: 1, step: 0.1, default: 0.1, label: 'Fill Opacity' },
  contrast: { type: 'slider', min: 0.5, max: 1, step: 0.05, default: 1, label: 'Contrast' }
};

export function draw(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, any>,
  generator: any,
  time: number
) {
  // Clean white background for logo clarity
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Extract parameters with logo-friendly defaults
  const centerX = width / 2;
  const centerY = height / 2;
  const frequency = params.frequency || 0.8;
  const amplitude = params.amplitude || 70;
  const complexity = params.complexity || 0.0;
  const shapeTypeNum = Math.round(params.shapeType || 0);
  const nodeCount = Math.max(3, Math.min(8, params.nodeCount || 4));
  const strokeWeight = params.strokeWeight || 3;
  const fillOpacity = params.fillOpacity || 0.1;
  const contrast = params.contrast || 1;

  // Logo-friendly shape types (simplified set)
  const shapeTypes = ['circle', 'star', 'shield', 'hexagon'];
  const shapeType = shapeTypes[shapeTypeNum] || 'circle';

  // Base scale for logo sizing
  const baseScale = Math.min(width, height) / 300;
  const scaledAmplitude = amplitude * baseScale;

  // Clean, high-contrast colors for logo use
  const primaryColor = `rgba(0, 100, 200, ${contrast})`;      // Professional blue
  const fillColor = `rgba(0, 100, 200, ${fillOpacity * contrast})`;

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
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = strokeWeight;

  // Draw clean connections (minimal, logo-appropriate)
  if (complexity > 0.1) {
    drawCleanConnections(ctx, nodes, complexity, primaryColor);
  }

  // Draw the main shape outline (bold, recognizable)
  drawShapeOutline(ctx, nodes, fillColor, primaryColor, strokeWeight);

  // Draw clean nodes (simple, bold)
  drawCleanNodes(ctx, nodes, scaledAmplitude * 0.08, primaryColor);

  function generateCleanBrandShape(shapeType: string, centerX: number, centerY: number, radius: number, nodeCount: number, phase: number) {
    const nodes: Array<{x: number, y: number}> = [];
    
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

  function drawCleanConnections(ctx: CanvasRenderingContext2D, nodes: any[], complexity: number, color: string) {
    ctx.save();
    ctx.strokeStyle = color.replace(/[\d.]+\)$/, '0.3)'); // Lower opacity for connections
    ctx.lineWidth = strokeWeight * 0.5;
    
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

  function drawShapeOutline(ctx: CanvasRenderingContext2D, nodes: any[], fillColor: string, strokeColor: string, strokeWeight: number) {
    if (nodes.length < 3) return;
    
    ctx.save();
    
    // Fill the shape
    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.moveTo(nodes[0].x, nodes[0].y);
    for (let i = 1; i < nodes.length; i++) {
      ctx.lineTo(nodes[i].x, nodes[i].y);
    }
    ctx.closePath();
    ctx.fill();
    
    // Stroke the outline
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = strokeWeight;
    ctx.stroke();
    
    ctx.restore();
  }

  function drawCleanNodes(ctx: CanvasRenderingContext2D, nodes: any[], nodeSize: number, color: string) {
    ctx.save();
    ctx.fillStyle = color;
    
    for (const node of nodes) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }
}

export const metadata: PresetMetadata = {
  name: "🎯 Brand Network",
  description: "Clean, logo-ready network shapes optimized for brand identity and small sizes",
  defaultParams: {
    seed: "brand-network",
    frequency: 0.8,
    amplitude: 70,
    complexity: 0.0,
    shapeType: 0,
    nodeCount: 4,
    strokeWeight: 3,
    fillOpacity: 0.1,
    contrast: 1
  }
};