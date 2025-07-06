/**
 * ⭕ Circles
 * 
 * Pulsing circles, orbital patterns, and nested ring systems
 * Converted from TypeScript CircleGenerator
 */

function draw(ctx, width, height, params, time, utils) {
  // Apply universal background
  utils.background.apply(ctx, width, height, params);
  
  // Load parameters with defaults
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
  
  // Draw circles layer by layer
  for (let layer = 0; layer < p.layers; layer++) {
    // Calculate layer-specific parameters
    const layerPhase = calculatePhase(layer, p.layers, time);
    const layerRadius = scaleToCanvas(p.radius, minDim) * Math.pow(p.damping, layer);
    const radiusVariation = scaleToCanvas(p.amplitude, minDim) * Math.sin(layerPhase);
    const finalRadius = Math.max(1, layerRadius + radiusVariation);
    
    // Add chaos to position
    const chaosX = addChaos(0, finalRadius * 0.1);
    const chaosY = addChaos(0, finalRadius * 0.1);
    
    // Calculate position
    const cx = Math.max(finalRadius, Math.min(width - finalRadius, centerX + chaosX));
    const cy = Math.max(finalRadius, Math.min(height - finalRadius, centerY + chaosY));
    
    // Draw main circle
    ctx.save();
    ctx.globalAlpha = p.strokeOpacity * (0.8 - layer * 0.1);
    ctx.strokeStyle = p.strokeColor;
    ctx.lineWidth = Math.max(1, finalRadius / 20);
    ctx.beginPath();
    ctx.arc(cx, cy, finalRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    
    // Add complexity: orbital elements
    if (p.complexity > 0 && layer < p.layers / 2) {
      const complexityCount = Math.ceil(p.complexity * 6);
      
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
        ctx.globalAlpha = p.fillOpacity * 0.6;
        ctx.fillStyle = p.fillColor;
        ctx.beginPath();
        ctx.arc(finalOrbitX, finalOrbitY, orbitSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  }
}

// Parameter definitions
const parameters = {
  frequency: { default: 2, min: 0.1, max: 10, step: 0.1 },
  amplitude: { default: 30, min: 0, max: 100, step: 1 },
  complexity: { default: 0.5, min: 0, max: 1, step: 0.1 },
  chaos: { default: 0.1, min: 0, max: 1, step: 0.1 },
  damping: { default: 0.8, min: 0.1, max: 1, step: 0.1 },
  layers: { default: 3, min: 1, max: 10, step: 1 },
  radius: { default: 50, min: 5, max: 100, step: 1 },
  fillColor: { default: '#000000', type: 'color' },
  strokeColor: { default: '#000000', type: 'color' },
  fillOpacity: { default: 0.8, min: 0, max: 1, step: 0.1 },
  strokeOpacity: { default: 0.8, min: 0, max: 1, step: 0.1 }
};

// Helper functions
const slider = (label, key, min, max, step = 1, defaultValue = min) => ({
  label, key, min, max, step, defaultValue, type: 'slider'
});

const select = (label, key, options, defaultValue = options[0]) => ({
  label, key, options, defaultValue, type: 'select'
});

const toggle = (label, key, defaultValue = false) => ({
  label, key, defaultValue, type: 'toggle'
});

// Metadata
const metadata = {
  name: "⭕ Circles",
  description: "Pulsing circles, orbital patterns, and nested ring systems",
  author: "ReFlow",
  version: "1.0.0",
  tags: ["geometric", "circles", "animation", "orbital"]
};

// Export the template
const template = { draw };
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { template, parameters, metadata, slider, select, toggle };
} else if (typeof window !== 'undefined') {
  window.circles = { template, parameters, metadata, slider, select, toggle };
}