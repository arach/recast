// ∞ Infinity Loops
import type { TemplateUtils } from '@reflow/template-utils';

const parameters = {
  frequency: {
    default: 2,
    range: [0.1, 8, 0.1]
  },
  amplitude: {
    default: 60,
    range: [10, 150, 5]
  },
  complexity: {
    default: 0.3,
    range: [0, 1, 0.01]
  },
  chaos: {
    default: 0.1,
    range: [0, 1, 0.01]
  },
  damping: {
    default: 0.9,
    range: [0.3, 1, 0.01]
  },
  layers: {
    default: 2,
    range: [1, 6, 1]
  },
  scale: {
    default: 1.0,
    range: [0.3, 3, 0.1]
  }
};

const metadata = {
  id: 'infinity-loops',
  name: "∞ Infinity Loops",
  description: "Mystical figure-8 patterns with flowing particles and ethereal glow effects",
  parameters,
  defaultParams: {
    frequency: 2,
    amplitude: 60,
    complexity: 0.3,
    chaos: 0.1,
    damping: 0.9,
    layers: 2,
    scale: 1.0
  }
};

function drawVisualization(ctx: CanvasRenderingContext2D, width: number, height: number, params: any, time: number, utils: TemplateUtils) {
  utils.applyUniversalBackground(ctx, width, height, params);

  // Access universal properties
  const fillColor = params.fillColor || '#9333ea';
  const strokeColor = params.strokeColor || '#7c3aed';
  const fillOpacity = params.fillOpacity ?? 0.8;
  const strokeOpacity = params.strokeOpacity ?? 1;
  
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

  // Helper to convert hex to HSL
  const hexToHsl = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return [0, 0, 50];
    
    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;
    
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
        default: h = 0;
      }
    }
    
    return [h * 360, s * 100, l * 100];
  };

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

  // Add glow effect for mystical appearance using theme color
  const [baseHue, baseSat] = hexToHsl(fillColor);
  ctx.shadowColor = `hsla(${baseHue}, ${baseSat}%, 70%, 0.4)`;
  ctx.shadowBlur = 10;

  // Generate infinity loop layers
  for (let layer = 0; layer < layers; layer++) {
    const layerPhase = (layer / layers) * frequency * Math.PI * 2 + time;
    const layerScale = scale * Math.pow(damping, layer);
    const layerAmplitude = amplitude * layerScale;
    
    // Color progression based on theme color
    const hueShift = (layer / layers) * 60 + time * 15; // Subtle hue variation
    const hue = (baseHue + hueShift) % 360;
    const saturation = baseSat - (layer * 10);
    const lightness = 50 + Math.sin(layerPhase) * 20;
    const layerStrokeColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    
    // Draw infinity loop using lemniscate equation
    if (params.strokeType !== 'none') {
      ctx.save();
      ctx.globalAlpha = (0.8 - (layer * 0.15)) * strokeOpacity;
      ctx.strokeStyle = layerStrokeColor;
      ctx.lineWidth = params.strokeWidth || Math.max(1, layerAmplitude / 25);
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
    }
    
    // Add complexity: flowing particles
    if (complexity > 0 && params.fillType !== 'none') {
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
          ctx.globalAlpha = (0.6 + Math.sin(particlePhase) * 0.3) * fillOpacity;
          ctx.fillStyle = `hsla(${hue + 30}, ${saturation}%, ${lightness + 20}%, 0.7)`;
          
          ctx.beginPath();
          ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.restore();
        }
      }
    }
  }

  // Enhanced glow pass for main curves using theme color
  if (params.strokeType !== 'none') {
    ctx.shadowColor = `hsla(${baseHue}, ${baseSat}%, 80%, 0.6)`;
    ctx.shadowBlur = 20;
    
    for (let layer = 0; layer < Math.min(layers, 2); layer++) {
      const layerPhase = (layer / layers) * frequency * Math.PI * 2 + time;
      const layerScale = scale * Math.pow(damping, layer);
      const layerAmplitude = amplitude * layerScale;
      
      const hueShift = (layer / layers) * 60 + time * 15; // Subtle hue variation
      const glowHue = (baseHue + hueShift) % 360;
      const glowSaturation = baseSat - (layer * 10);
      const glowLightness = 50 + Math.sin(layerPhase) * 20;
      
      ctx.save();
      ctx.globalAlpha = 0.3 * strokeOpacity;
      ctx.strokeStyle = `hsl(${glowHue}, ${glowSaturation}%, ${glowLightness}%)`;
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

export { drawVisualization, metadata };
export const PARAMETERS = metadata.parameters; // Alias for UI system