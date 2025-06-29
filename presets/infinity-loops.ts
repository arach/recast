import type { ParameterDefinition, PresetMetadata } from './types';

// Infinity Loops Visualization
export const parameters: Record<string, ParameterDefinition> = {
  // Core wave parameters
  frequency: { type: 'slider', min: 0.1, max: 8, step: 0.1, default: 2, label: 'Flow Speed' },
  amplitude: { type: 'slider', min: 10, max: 150, step: 5, default: 60, label: 'Loop Size' },
  complexity: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.3, label: 'Flowing Particles' },
  chaos: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.1, label: 'Organic Variance' },
  damping: { type: 'slider', min: 0.3, max: 1, step: 0.01, default: 0.9, label: 'Layer Scale' },
  layers: { type: 'slider', min: 1, max: 6, step: 1, default: 2, label: 'Nested Loops' },
  
  // Infinity-specific parameters
  scale: { type: 'slider', min: 0.3, max: 3, step: 0.1, default: 1.0, label: 'Overall Scale' }
};

export function draw(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, any>,
  generator: any,
  time: number
) {
  // Clear with deep space background
  const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2);
  gradient.addColorStop(0, '#0f0f23');
  gradient.addColorStop(1, '#050505');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Direct infinity loop generation without external requires
  const centerX = width / 2;
  const centerY = height / 2;
  const layers = params.layers || 2;
  const frequency = params.frequency || 2;
  const amplitude = params.amplitude || 60;
  const complexity = params.complexity || 0.3;
  const chaos = params.chaos || 0.1;
  const damping = params.damping || 0.9;
  const scale = (params.scale || 1.0) * Math.min(width, height) / 400;

  // Simple seeded random function
  let seed = 1;
  const seedStr = params.seed || 'infinity';
  for (let i = 0; i < seedStr.length; i++) {
    seed = ((seed << 5) - seed) + seedStr.charCodeAt(i);
    seed = seed & seed;
  }
  
  function seededRandom() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  // Add glow effect for mystical appearance
  ctx.shadowColor = 'rgba(150, 100, 255, 0.4)';
  ctx.shadowBlur = 10;

  // Generate infinity loop layers
  for (let layer = 0; layer < layers; layer++) {
    const layerPhase = (layer / layers) * frequency * Math.PI * 2 + time;
    const layerScale = scale * Math.pow(damping, layer);
    const layerAmplitude = amplitude * layerScale;
    
    // Color progression through spectrum
    const hue = (layer / layers) * 180 + time * 15 + 240; // Purple to blue spectrum
    const saturation = 80 - (layer * 10);
    const lightness = 50 + Math.sin(layerPhase) * 20;
    const strokeColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    
    // Draw infinity loop using lemniscate equation
    ctx.save();
    ctx.globalAlpha = 0.8 - (layer * 0.15);
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = Math.max(1, layerAmplitude / 25);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    const resolution = 120;
    let firstPoint = true;
    
    for (let i = 0; i <= resolution; i++) {
      const t = (i / resolution) * Math.PI * 2;
      const animatedT = t + (time + layer * 0.5) * frequency;
      
      // Lemniscate equation: x = a*cos(t)/(1+sin²(t)), y = a*sin(t)*cos(t)/(1+sin²(t))
      const sinT = Math.sin(animatedT);
      const cosT = Math.cos(animatedT);
      const denominator = 1 + sinT * sinT;
      
      let x = layerAmplitude * cosT / denominator;
      let y = layerAmplitude * sinT * cosT / denominator;
      
      // Add chaos for organic feel
      if (chaos > 0) {
        x += (seededRandom() - 0.5) * layerAmplitude * chaos * 0.1;
        y += (seededRandom() - 0.5) * layerAmplitude * chaos * 0.1;
      }
      
      // Translate to center
      x += centerX;
      y += centerY;
      
      if (firstPoint) {
        ctx.moveTo(x, y);
        firstPoint = false;
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
    ctx.restore();
    
    // Add complexity: flowing particles
    if (complexity > 0) {
      const particleCount = Math.ceil(complexity * 8);
      
      for (let p = 0; p < particleCount; p++) {
        const particlePhase = (p / particleCount) * frequency * Math.PI * 2 + time * 2 + layer;
        const t = (particlePhase / (Math.PI * 2)) % 1;
        
        // Calculate position along infinity curve
        const angle = t * Math.PI * 2;
        const sinT = Math.sin(angle + time * frequency);
        const cosT = Math.cos(angle + time * frequency);
        const denominator = 1 + sinT * sinT;
        
        let particleX = centerX + layerAmplitude * cosT / denominator;
        let particleY = centerY + layerAmplitude * sinT * cosT / denominator;
        
        // Add chaos to particle position
        particleX += (seededRandom() - 0.5) * layerAmplitude * 0.1;
        particleY += (seededRandom() - 0.5) * layerAmplitude * 0.1;
        
        // Bounds check for particles
        const particleSize = layerAmplitude * 0.05;
        if (particleX > particleSize && particleX < width - particleSize && 
            particleY > particleSize && particleY < height - particleSize) {
          
          ctx.save();
          ctx.globalAlpha = 0.6 + Math.sin(particlePhase) * 0.3;
          ctx.fillStyle = `hsla(${hue + 30}, ${saturation}%, ${lightness + 20}%, 0.7)`;
          
          ctx.beginPath();
          ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.restore();
        }
      }
    }
  }

  // Enhanced glow pass for main curves
  ctx.shadowColor = 'rgba(200, 150, 255, 0.6)';
  ctx.shadowBlur = 20;
  
  for (let layer = 0; layer < Math.min(layers, 2); layer++) {
    const layerPhase = (layer / layers) * frequency * Math.PI * 2 + time;
    const layerScale = scale * Math.pow(damping, layer);
    const layerAmplitude = amplitude * layerScale;
    
    const hue = (layer / layers) * 180 + time * 15 + 240;
    const saturation = 80 - (layer * 10);
    const lightness = 50 + Math.sin(layerPhase) * 20;
    
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    ctx.lineWidth = Math.max(2, layerAmplitude / 15);
    ctx.lineCap = 'round';
    
    ctx.beginPath();
    const resolution = 60; // Lower resolution for glow
    let firstPoint = true;
    
    for (let i = 0; i <= resolution; i++) {
      const t = (i / resolution) * Math.PI * 2;
      const animatedT = t + (time + layer * 0.5) * frequency;
      
      const sinT = Math.sin(animatedT);
      const cosT = Math.cos(animatedT);
      const denominator = 1 + sinT * sinT;
      
      const x = centerX + layerAmplitude * cosT / denominator;
      const y = centerY + layerAmplitude * sinT * cosT / denominator;
      
      if (firstPoint) {
        ctx.moveTo(x, y);
        firstPoint = false;
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
    ctx.restore();
  }
  
  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;

  // Add subtle starfield background
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  for (let i = 0; i < 20; i++) {
    const x = (Math.sin(time * 0.1 + i) * 0.5 + 0.5) * width;
    const y = (Math.cos(time * 0.15 + i * 2) * 0.5 + 0.5) * height;
    const size = Math.sin(time * 0.5 + i) * 0.5 + 1;
    
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

export const metadata: PresetMetadata = {
  name: "∞ Infinity Loops",
  description: "Mystical figure-8 patterns with flowing particles and ethereal glow effects",
  defaultParams: {
    seed: "infinity-loops",
    frequency: 2,
    amplitude: 60,
    complexity: 0.3,
    chaos: 0.1,
    damping: 0.9,
    layers: 2,
    scale: 1.0
  }
};