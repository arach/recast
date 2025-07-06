/**
 * ⭕ Circles
 * 
 * Pulsing circles, orbital patterns, and nested ring systems
 * Converted from TypeScript CircleGenerator
 */

function draw(ctx, width, height, params, time, utils) {
  // Apply universal background
  utils.background.apply(ctx, width, height, params);
  
  // Extract parameters with defaults
  const frequency = params.frequency || 2;
  const amplitude = params.amplitude || 30;
  const complexity = params.complexity || 0.5;
  const chaos = params.chaos || 0.1;
  const damping = params.damping || 0.8;
  const layers = params.layers || 3;
  const radius = params.radius || 50;
  
  // Get theme colors
  const fillColor = params.fillColor || '#000000';
  const strokeColor = params.strokeColor || '#000000';
  const fillOpacity = params.fillOpacity ?? 0.8;
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
  
  // Draw circles layer by layer
  for (let layer = 0; layer < layers; layer++) {
    // Calculate layer-specific parameters
    const layerPhase = calculatePhase(layer, layers, time);
    const layerRadius = scaleToCanvas(radius, minDim) * Math.pow(damping, layer);
    const radiusVariation = scaleToCanvas(amplitude, minDim) * Math.sin(layerPhase);
    const finalRadius = Math.max(1, layerRadius + radiusVariation);
    
    // Add chaos to position
    const chaosX = addChaos(0, finalRadius * 0.1);
    const chaosY = addChaos(0, finalRadius * 0.1);
    
    // Calculate position
    const cx = Math.max(finalRadius, Math.min(width - finalRadius, centerX + chaosX));
    const cy = Math.max(finalRadius, Math.min(height - finalRadius, centerY + chaosY));
    
    // Draw main circle
    ctx.save();
    ctx.globalAlpha = strokeOpacity * (0.8 - layer * 0.1);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = Math.max(1, finalRadius / 20);
    ctx.beginPath();
    ctx.arc(cx, cy, finalRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    
    // Add complexity: orbital elements
    if (complexity > 0 && layer < layers / 2) {
      const complexityCount = Math.ceil(complexity * 6);
      
      for (let i = 0; i < complexityCount; i++) {
        const orbitPhase = calculatePhase(i, complexityCount, time * 2);
        const orbitRadius = finalRadius * 0.7;
        const orbitX = centerX + chaosX + Math.cos(orbitPhase) * orbitRadius;
        const orbitY = centerY + chaosY + Math.sin(orbitPhase) * orbitRadius;
        const orbitSize = finalRadius * 0.2;
        
        // Constrain to canvas
        const finalOrbitX = Math.max(orbitSize, Math.min(width - orbitSize, orbitX));
        const finalOrbitY = Math.max(orbitSize, Math.min(height - orbitSize, orbitY));
        
        // Draw orbital circle
        ctx.save();
        ctx.globalAlpha = fillOpacity * 0.6;
        ctx.fillStyle = fillColor;
        ctx.beginPath();
        ctx.arc(finalOrbitX, finalOrbitY, orbitSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }
}

// Export the template
const template = { draw };
if (typeof module !== 'undefined' && module.exports) {
  module.exports = template;
} else if (typeof window !== 'undefined') {
  window.circles = template;
}