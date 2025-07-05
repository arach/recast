import type { TemplateUtils } from '@reflow/template-utils';

const parameters = {
  frequency: {
    default: 7,
    range: [0.1, 20, 0.1]
  },
  amplitude: {
    default: 85,
    range: [0, 100, 1]
  },
  complexity: {
    default: 0.05,
    range: [0, 1, 0.01]
  },
  chaos: {
    default: 0.0,
    range: [0, 1, 0.01]
  },
  damping: {
    default: 0.98,
    range: [0, 1, 0.01]
  },
  layers: {
    default: 1,
    range: [1, 8, 1]
  },
  barCount: {
    default: 30,
    range: [20, 100, 5]
  },
  barSpacing: {
    default: 5,
    range: [0, 5, 1]
  },
  sharpness: {
    default: 1.2,
    range: [0.1, 2, 0.1]
  }
};

function drawVisualization(ctx: CanvasRenderingContext2D, width: number, height: number, params: any, time: number, utils: TemplateUtils) {
  // Apply universal background
  utils.applyUniversalBackground(ctx, width, height, params);
  
  // Access universal properties
  const fillColor = params.fillColor || '#0070f3';
  const strokeColor = params.strokeColor || '#0051cc';
  const fillOpacity = params.fillOpacity ?? 1;
  const strokeOpacity = params.strokeOpacity ?? 0.2;
  
  // Helper to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };
  
  // Helper to convert hex to HSL
  const hexToHsl = (hex: string) => {
    const rgb = hexToRgb(hex);
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    
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

  const barCount = params.barCount || 30;
  const barSpacing = params.barSpacing || 5;
  const totalSpacing = (barCount - 1) * barSpacing;
  const barWidth = (width - totalSpacing - 60) / barCount; 
  const startX = 30;
  
  // Dynamic animated wave using simple sine calculations for performance
  for (let i = 0; i < barCount; i++) {
    const x = startX + i * (barWidth + barSpacing);
    const t = i / barCount;
    
    // Primary wave with animation
    const primaryWave = Math.sin((t * params.frequency * Math.PI * 2) + time * 2) * params.amplitude;
    
    // Secondary wave for complexity
    const secondaryWave = Math.sin((t * params.frequency * 4 * Math.PI * 2) + time * 3) * params.amplitude * 0.3;
    
    // Combine waves and ensure positive
    const combinedHeight = Math.abs(primaryWave + secondaryWave * params.complexity);
    const barHeight = Math.max(10, combinedHeight);
    
    // Use theme colors with intensity variations
    const [baseHue, baseSat, baseLum] = hexToHsl(fillColor);
    const intensity = (barHeight / params.amplitude);
    
    // Subtle hue shift based on position for visual interest
    const hueShift = (i / barCount) * 20 - 10; // ±10 degree shift
    const hue = (baseHue + hueShift + 360) % 360;
    
    // Dynamic saturation and lightness based on bar height
    const saturation = baseSat + intensity * 20;
    const lightness = baseLum + intensity * 30;
    
    // Save context before applying opacity
    ctx.save();
    ctx.globalAlpha = fillOpacity;
    
    // Create dynamic gradient per bar with opacity already baked in
    const gradient = ctx.createLinearGradient(x, height - barHeight, x, height);
    gradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness}%, 0.9)`);
    gradient.addColorStop(0.6, `hsla(${hue}, ${saturation * 0.8}%, ${lightness * 0.7}%, 0.7)`);
    gradient.addColorStop(1, `hsla(${hue}, ${saturation * 0.6}%, ${lightness * 0.4}%, 0.5)`);
    ctx.fillStyle = gradient;
    
    // Draw modern rounded bars instead of triangles
    ctx.beginPath();
    const centerY = height - barHeight;
    const radius = Math.min(barWidth / 2, 8);
    ctx.roundRect(x, centerY, barWidth, barHeight, [radius, radius, 0, 0]);
    ctx.fill();
    
    // Add glow effect for better visuals
    if (barHeight > 30) {
      ctx.shadowColor = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.6)`;
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 0;
      
      // Draw glow
      ctx.beginPath();
      ctx.roundRect(x, centerY, barWidth, barHeight, [radius, radius, 0, 0]);
      ctx.fill();
      
      // Reset shadow
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    }
    
    // Restore context after drawing
    ctx.restore();
  }
  
  // Add subtle wave guide line
  ctx.save();
  ctx.globalAlpha = strokeOpacity;
  
  ctx.beginPath();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = params.strokeWidth || 1;
  
  for (let i = 0; i < barCount; i++) {
    const x = startX + i * (barWidth + barSpacing) + barWidth / 2;
    const t = i / barCount;
    const y = height - Math.abs(Math.sin((t * params.frequency * Math.PI * 2) + time * 2) * params.amplitude);
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  
  ctx.restore();
}

const metadata = {
  id: 'apex-vercel',
  name: "🌊 Apex (Vercel-style)",
  description: "Dynamic animated bars with theme-aware glowing gradients and smooth wave motion",
  parameters,
  defaultParams: {
    frequency: 7,
    amplitude: 85,
    complexity: 0.05,
    chaos: 0.0,
    damping: 0.98,
    layers: 1,
    barCount: 30,
    barSpacing: 5,
    sharpness: 1.2
  }
};

export { parameters, metadata, drawVisualization };