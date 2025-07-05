/**
 * 🔺 Triangles
 * 
 * Spinning triangles, constellation patterns, and geometric formations
 * Converted from TypeScript TriangleGenerator
 */

function draw(ctx, width, height, params, time, utils) {
  // Apply universal background
  utils.applyUniversalBackground(ctx, width, height, params);
  
  // Extract parameters with defaults
  const frequency = params.frequency || 3;
  const amplitude = params.amplitude || 40;
  const complexity = params.complexity || 0.4;
  const chaos = params.chaos || 0.2;
  const damping = params.damping || 0.85;
  const layers = params.layers || 3;
  const sides = params.sides || 3;
  const rotation = params.rotation || 0;
  
  // Get theme colors
  const fillColor = params.fillColor || '#000000';
  const strokeColor = params.strokeColor || '#000000';
  const fillOpacity = params.fillOpacity ?? 0.3;
  const strokeOpacity = params.strokeOpacity ?? 0.8;
  
  const centerX = width / 2;
  const centerY = height / 2;
  const minDim = Math.min(width, height);
  
  // Helper functions from original GeneratorBase
  const scaleToCanvas = (value, canvasSize) => {
    return (value / 100) * canvasSize;
  };
  
  const calculatePhase = (index, total, timeOffset) => {
    const basePhase = (index / total) * Math.PI * 2;
    return basePhase + timeOffset * frequency;
  };
  
  const addChaos = (value, range) => {
    if (chaos === 0) return value;
    return value + (Math.random() - 0.5) * range * chaos;
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
  
  const baseSize = scaleToCanvas(amplitude, minDim);
  
  // Draw triangles layer by layer
  for (let layer = 0; layer < layers; layer++) {
    // Calculate layer-specific parameters
    const layerPhase = calculatePhase(layer, layers, time);
    const layerSize = baseSize * Math.pow(damping, layer);
    const layerRotation = rotation + (layerPhase * 180 / Math.PI);
    
    // Add chaos to position and rotation
    const chaosX = addChaos(0, layerSize * 0.2);
    const chaosY = addChaos(0, layerSize * 0.2);
    const chaosRotation = addChaos(0, 45);
    
    // Calculate final position
    const finalX = Math.max(layerSize, Math.min(width - layerSize, centerX + chaosX));
    const finalY = Math.max(layerSize, Math.min(height - layerSize, centerY + chaosY));
    
    // Create triangle path
    const trianglePoints = createTrianglePath(finalX, finalY, layerSize, layerRotation + chaosRotation, sides);
    
    // Draw main triangle
    ctx.save();
    
    // Fill
    if (fillOpacity > 0) {
      ctx.globalAlpha = fillOpacity * (0.8 - layer * 0.1);
      ctx.fillStyle = fillColor;
      ctx.beginPath();
      ctx.moveTo(trianglePoints[0].x, trianglePoints[0].y);
      for (let i = 1; i < trianglePoints.length; i++) {
        ctx.lineTo(trianglePoints[i].x, trianglePoints[i].y);
      }
      ctx.closePath();
      ctx.fill();
    }
    
    // Stroke
    if (strokeOpacity > 0 && params.strokeWidth > 0) {
      ctx.globalAlpha = strokeOpacity * (0.8 - layer * 0.1);
      ctx.strokeStyle = strokeColor;
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
    if (complexity > 0 && layer < layers / 2) {
      const complexityCount = Math.ceil(complexity * 5);
      
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
          ctx.globalAlpha = fillOpacity * 0.6;
          ctx.fillStyle = fillColor;
          ctx.beginPath();
          ctx.moveTo(orbitPoints[0].x, orbitPoints[0].y);
          for (let j = 1; j < orbitPoints.length; j++) {
            ctx.lineTo(orbitPoints[j].x, orbitPoints[j].y);
          }
          ctx.closePath();
          ctx.fill();
          
          if (params.strokeWidth > 0) {
            ctx.globalAlpha = strokeOpacity * 0.6;
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = Math.max(1, orbitSize / 20);
            ctx.stroke();
          }
          
          ctx.restore();
        }
      }
    }
  }
}

// Export the template
const template = { draw };
if (typeof module !== 'undefined' && module.exports) {
  module.exports = template;
} else if (typeof window !== 'undefined') {
  window.triangles = template;
}