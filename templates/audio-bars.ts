// 🎵 Audio Bars
import type { TemplateUtils } from '@/lib/template-utils';

const parameters = {
  frequency: {
    default: 4,
    range: [0.1, 20, 0.1]
  },
  amplitude: {
    default: 60,
    range: [0, 100, 1]
  },
  complexity: {
    default: 0.2,
    range: [0, 1, 0.01]
  },
  chaos: {
    default: 0.15,
    range: [0, 1, 0.01]
  },
  damping: {
    default: 0.85,
    range: [0, 1, 0.01]
  },
  layers: {
    default: 1,
    range: [1, 3, 1]
  },
  barCount: {
    default: 30,
    range: [10, 80, 5]
  },
  barSpacing: {
    default: 3,
    range: [1, 8, 1]
  },
  colorMode: {
    default: 'spectrum',
    options: ['spectrum', 'theme', 'toneShift']
  }
};

const metadata = {
  id: 'audio-bars',
  name: "🎵 Audio Bars",
  description: "Dynamic audio visualizer bars with customizable color modes",
  parameters,
  defaultParams: {
    frequency: 4,
    amplitude: 60,
    complexity: 0.2,
    chaos: 0.15,
    damping: 0.85,
    layers: 1,
    barCount: 30,
    barSpacing: 3,
    colorMode: 'spectrum'
  }
};

function drawVisualization(ctx: CanvasRenderingContext2D, width: number, height: number, params: any, time: number, utils: TemplateUtils) {
  utils.applyUniversalBackground(ctx, width, height, params);
  
  const fillColor = params.fillColor || '#3b82f6';
  const strokeColor = params.strokeColor || '#1e40af';
  const colorMode = params.colorMode || 'spectrum';
  const fillOpacity = params.fillOpacity ?? 1;
  const strokeOpacity = params.strokeOpacity ?? 1;
  
  const barWidth = (width - params.barSpacing * (params.barCount - 1)) / params.barCount;
  const centerY = height / 2;

  for (let i = 0; i < params.barCount; i++) {
    const x = i * (barWidth + params.barSpacing);
    const t = i / params.barCount;
    
    // Generate wave-based bar heights using the parameters
    const waveY = Math.sin((t * params.frequency * Math.PI * 2) + time) * params.amplitude;
    const harmonics = Math.sin((t * params.frequency * 3 * Math.PI * 2) + time * 2) * params.amplitude * params.complexity;
    const chaos = (Math.random() - 0.5) * params.chaos * params.amplitude;
    const dampedValue = waveY + harmonics + chaos;
    const barHeight = Math.abs(dampedValue) + 10;
    
    // Create gradient based on color mode
    const gradient = ctx.createLinearGradient(x, centerY - barHeight/2, x, centerY + barHeight/2);
    
    if (colorMode === 'spectrum') {
      // Original rainbow spectrum
      const hue = (i / params.barCount) * 360;
      gradient.addColorStop(0, `hsla(${hue}, 70%, 60%, 0.9)`);
      gradient.addColorStop(0.5, `hsla(${hue}, 80%, 50%, 1)`);
      gradient.addColorStop(1, `hsla(${hue}, 70%, 60%, 0.9)`);
    } else if (colorMode === 'theme') {
      // Use theme colors with intensity variations based on bar height
      const intensity = barHeight / (params.amplitude * 2);
      const lightness = 0.2 + intensity * 0.3;
      gradient.addColorStop(0, utils.adjustColor(fillColor, lightness + 0.2));
      gradient.addColorStop(0.5, fillColor);
      gradient.addColorStop(1, utils.adjustColor(fillColor, lightness + 0.2));
    } else if (colorMode === 'toneShift') {
      // Shift hue based on theme color
      const [baseHue, baseSat, baseLum] = utils.hexToHsl(fillColor);
      const hueShift = (i / params.barCount) * 180 - 90; // Shift ±90 degrees
      const hue = (baseHue + hueShift + 360) % 360;
      gradient.addColorStop(0, `hsla(${hue}, ${baseSat}%, ${baseLum + 10}%, 0.9)`);
      gradient.addColorStop(0.5, `hsla(${hue}, ${baseSat}%, ${baseLum}%, 1)`);
      gradient.addColorStop(1, `hsla(${hue}, ${baseSat}%, ${baseLum + 10}%, 0.9)`);
    }
    
    // Apply fill opacity if there's a fill
    if (params.fillType !== 'none' && fillOpacity < 1) {
      ctx.save();
      ctx.globalAlpha = fillOpacity;
    }
    
    ctx.fillStyle = gradient;
    
    // Draw rounded rectangles
    const radius = barWidth / 3;
    ctx.beginPath();
    ctx.roundRect(x, centerY - barHeight/2, barWidth, barHeight, radius);
    ctx.fill();
    
    // Add small dots at the ends
    if (barHeight > 20) {
      ctx.beginPath();
      ctx.arc(x + barWidth/2, centerY - barHeight/2 - 5, barWidth/2.5, 0, Math.PI * 2);
      ctx.arc(x + barWidth/2, centerY + barHeight/2 + 5, barWidth/2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Restore opacity if it was changed
    if (params.fillType !== 'none' && fillOpacity < 1) {
      ctx.restore();
    }
    
    // Apply stroke if enabled
    if (params.strokeType !== 'none') {
      ctx.save();
      ctx.globalAlpha = strokeOpacity;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = params.strokeWidth || 2;
      
      // Set stroke dash pattern
      if (params.strokeType === 'dashed') {
        ctx.setLineDash([5, 5]);
      } else if (params.strokeType === 'dotted') {
        ctx.setLineDash([2, 3]);
      }
      
      // Stroke the rounded rectangle
      ctx.beginPath();
      ctx.roundRect(x, centerY - barHeight/2, barWidth, barHeight, radius);
      ctx.stroke();
      
      // Stroke the dots if present
      if (barHeight > 20) {
        ctx.beginPath();
        ctx.arc(x + barWidth/2, centerY - barHeight/2 - 5, barWidth/2.5, 0, Math.PI * 2);
        ctx.arc(x + barWidth/2, centerY + barHeight/2 + 5, barWidth/2.5, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      ctx.restore();
    }
  }
}

export { drawVisualization, metadata };
export const PARAMETERS = metadata.parameters; // Alias for UI system