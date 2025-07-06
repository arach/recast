/**
 * 🔺 Triangles
 * 
 * Spinning triangles, constellation patterns, and geometric formations
 * Converted from TypeScript TriangleGenerator
 */

function draw(ctx, width, height, params, time, utils) {
  // Load and process all parameters - clean and deterministic
  const p = utils.params.load(params, ctx, width, height, time, { parameters });
  
  const centerX = width / 2;
  const centerY = height / 2;
  const minDim = Math.min(width, height);
  
  // Helper functions from original GeneratorBase
  const scaleToCanvas = (value, canvasSize) => {
    return (value / 100) * canvasSize;
  };
  
  const calculatePhase = (index, total, timeOffset) => {
    const basePhase = (index / total) * Math.PI * 2;
    return basePhase + timeOffset * p.frequency;
  };
  
  const addChaos = (value, range) => {
    if (p.chaos === 0) return value;
    return value + (Math.random() - 0.5) * range * p.chaos;
  };
  
  // Create triangle path
  const createTrianglePath = (cx, cy, size, rot, numSides) => {
    const points = [];
    const angleStep = (Math.PI * 2) / numSides;
    const rotationRad = (rot * Math.PI) / 180;
    
    for (let i = 0; i < numSides; i++) {
      const angle = (i * angleStep) + rotationRad;
      const x = cx + Math.cos(angle) * size;
      const y = cy + Math.sin(angle) * size;
      points.push({ x, y });
    }
    
    return points;
  };
  
  const baseSize = scaleToCanvas(p.amplitude, minDim);
  
  // Draw triangles layer by layer
  for (let layer = 0; layer < p.layers; layer++) {
    // Calculate layer-specific parameters
    const layerPhase = calculatePhase(layer, p.layers, time);
    const layerSize = baseSize * Math.pow(p.damping, layer);
    const layerRotation = p.rotation + (layerPhase * 180 / Math.PI);
    
    // Add chaos to position and rotation
    const chaosX = addChaos(0, layerSize * 0.2);
    const chaosY = addChaos(0, layerSize * 0.2);
    const chaosRotation = addChaos(0, 45);
    
    // Calculate final position
    const finalX = Math.max(layerSize, Math.min(width - layerSize, centerX + chaosX));
    const finalY = Math.max(layerSize, Math.min(height - layerSize, centerY + chaosY));
    
    // Create triangle path
    const trianglePoints = createTrianglePath(finalX, finalY, layerSize, layerRotation + chaosRotation, p.sides);
    
    // Draw main triangle
    ctx.save();
    
    // Fill
    if (p.theme.fillOpacity > 0) {
      ctx.globalAlpha = p.theme.fillOpacity * (0.8 - layer * 0.1);
      ctx.fillStyle = p.fillColor;
      ctx.beginPath();
      ctx.moveTo(trianglePoints[0].x, trianglePoints[0].y);
      for (let i = 1; i < trianglePoints.length; i++) {
        ctx.lineTo(trianglePoints[i].x, trianglePoints[i].y);
      }
      ctx.closePath();
      ctx.fill();
    }
    
    // Stroke
    if (p.theme.strokeOpacity > 0 && p.theme.strokeWidth > 0) {
      ctx.globalAlpha = p.theme.strokeOpacity * (0.8 - layer * 0.1);
      ctx.strokeStyle = p.strokeColor;
      ctx.lineWidth = Math.max(1, layerSize / 30);
      ctx.beginPath();
      ctx.moveTo(trianglePoints[0].x, trianglePoints[0].y);
      for (let i = 1; i < trianglePoints.length; i++) {
        ctx.lineTo(trianglePoints[i].x, trianglePoints[i].y);
      }
      ctx.closePath();
      ctx.stroke();
    }
    
    ctx.restore();
    
    // Add complexity: constellation or smaller triangles
    if (p.complexity > 0 && layer < p.layers / 2) {
      const complexityCount = Math.ceil(p.complexity * 5);
      
      for (let i = 0; i < complexityCount; i++) {
        const orbitPhase = calculatePhase(i, complexityCount, time * 1.5);
        const orbitRadius = layerSize * 0.8;
        const orbitX = finalX + Math.cos(orbitPhase) * orbitRadius;
        const orbitY = finalY + Math.sin(orbitPhase) * orbitRadius;
        const orbitSize = layerSize * 0.25;
        
        // Bounds check for orbit triangles
        if (orbitX > orbitSize && orbitX < width - orbitSize && 
            orbitY > orbitSize && orbitY < height - orbitSize) {
          
          const orbitPoints = createTrianglePath(orbitX, orbitY, orbitSize, orbitPhase * 180 / Math.PI, 3);
          
          ctx.save();
          
          // Small triangles use fill color
          ctx.globalAlpha = p.theme.fillOpacity * 0.6;
          ctx.fillStyle = p.fillColor;
          ctx.beginPath();
          ctx.moveTo(orbitPoints[0].x, orbitPoints[0].y);
          for (let j = 1; j < orbitPoints.length; j++) {
            ctx.lineTo(orbitPoints[j].x, orbitPoints[j].y);
          }
          ctx.closePath();
          ctx.fill();
          
          if (p.theme.strokeWidth > 0) {
            ctx.globalAlpha = p.theme.strokeOpacity * 0.6;
            ctx.strokeStyle = p.strokeColor;
            ctx.lineWidth = Math.max(1, orbitSize / 20);
            ctx.stroke();
          }
          
          ctx.restore();
        }
      }
    }
  }
}

// Helper functions
const slider = (def, min, max, step, label, unit, opts = {}) => ({ 
  type: "slider", default: def, min, max, step, label, unit, ...opts 
});
const select = (def, options, label, opts = {}) => ({ 
  type: "select", default: def, options, label, ...opts 
});
const toggle = (def, label, opts = {}) => ({ 
  type: "toggle", default: def, label, ...opts 
});
export const parameters = {
  frequency: slider(3, 0.1, 10, 0.1, "Wave Frequency"),
  amplitude: slider(40, 10, 100, 1, "Triangle Size", "%"),
  complexity: slider(0.4, 0, 1, 0.1, "Complexity", null, { description: "Adds orbiting smaller triangles" }),
  chaos: slider(0.2, 0, 1, 0.05, "Chaos", null, { description: "Random position and rotation variation" }),
  damping: slider(0.85, 0.1, 1, 0.05, "Layer Damping", null, { description: "Size reduction per layer" }),
  layers: slider(3, 1, 8, 1, "Number of Layers"),
  sides: slider(3, 3, 12, 1, "Number of Sides", null, { description: "3 for triangles, higher for polygons" }),
  rotation: slider(0, 0, 360, 1, "Base Rotation", "°"),
};

export const metadata = {
  name: "🔺 Triangles",
  description: "Spinning triangles, constellation patterns, and geometric formations",
  category: "geometric",
  tags: ["triangle", "polygon", "geometric", "animated", "layers"],
  author: "ReFlow",
  version: "1.0.0"
};

export { draw };