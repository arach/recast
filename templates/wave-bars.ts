// 🌊 Wave Bars
import type { TemplateUtils } from '@/lib/template-utils';

const parameters = {
  barCount: {
    default: 40,
    range: [20, 100, 5]  // min, max, step
  },
  barSpacing: {
    default: 2,
    range: [0, 10, 1]
  },
  colorMode: {
    default: 'spectrum',
    options: ['spectrum', 'theme', 'toneShift']
  },
  frequency: {
    default: 3,
    range: [0.1, 20, 0.1]
  },
  amplitude: {
    default: 50,
    range: [0, 100, 1]
  }
};

const metadata = {
  id: 'wave-bars',
  name: "🌊 Wave Bars",
  description: "Audio bars that follow wave patterns with customizable color modes",
  parameters,
  defaultParams: {
    barCount: 40,
    barSpacing: 2,
    colorMode: 'spectrum',
    frequency: 3,
    amplitude: 50
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
  
  for (let i = 0; i < params.barCount; i++) {
    const x = i * (barWidth + params.barSpacing);
    const t = i / params.barCount;
    const waveY = height / 2 + Math.sin((t * params.frequency * Math.PI * 2) + time) * params.amplitude;
    
    const barHeight = Math.abs(Math.sin((t * params.frequency * 3 * Math.PI * 2) + time * 2) * 40) + 20;
    const gradient = ctx.createLinearGradient(x, waveY - barHeight/2, x, waveY + barHeight/2);
    
    if (colorMode === 'spectrum') {
      const hue = (i / params.barCount) * 360;
      gradient.addColorStop(0, `hsla(${hue}, 70%, 60%, 0.9)`);
      gradient.addColorStop(0.5, `hsla(${hue}, 80%, 50%, 1)`);
      gradient.addColorStop(1, `hsla(${hue}, 70%, 60%, 0.9)`);
    } else if (colorMode === 'theme') {
      const phase = (i / params.barCount) * Math.PI * 2;
      const lightness = 0.3 + Math.sin(phase + time) * 0.2;
      gradient.addColorStop(0, utils.adjustColor(fillColor, lightness));
      gradient.addColorStop(0.5, fillColor);
      gradient.addColorStop(1, utils.adjustColor(fillColor, lightness));
    } else if (colorMode === 'toneShift') {
      const [baseHue, baseSat, baseLum] = utils.hexToHsl(fillColor);
      const hueShift = (i / params.barCount) * 120 - 60; // Shift ±60 degrees
      const hue = (baseHue + hueShift + 360) % 360;
      gradient.addColorStop(0, `hsla(${hue}, ${baseSat}%, ${baseLum + 10}%, 0.9)`);
      gradient.addColorStop(0.5, `hsla(${hue}, ${baseSat}%, ${baseLum}%, 1)`);
      gradient.addColorStop(1, `hsla(${hue}, ${baseSat}%, ${baseLum + 10}%, 0.9)`);
    }
    
    ctx.save();
    ctx.globalAlpha = fillOpacity;
    ctx.fillStyle = gradient;
    
    const radius = barWidth / 3;
    ctx.beginPath();
    ctx.roundRect(x, waveY - barHeight/2, barWidth, barHeight, radius);
    ctx.fill();
    
    if (barHeight > 25) {
      ctx.beginPath();
      ctx.arc(x + barWidth/2, waveY - barHeight/2 - 4, barWidth/2.5, 0, Math.PI * 2);
      ctx.arc(x + barWidth/2, waveY + barHeight/2 + 4, barWidth/2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }
  
  ctx.save();
  ctx.globalAlpha = strokeOpacity * 0.15;
  ctx.beginPath();
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  for (let i = 0; i < params.barCount; i++) {
    const x = i * (barWidth + params.barSpacing);
    const t = i / params.barCount;
    const y = height / 2 + Math.sin((t * params.frequency * Math.PI * 2) + time) * params.amplitude;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

export { drawVisualization, metadata };
export const PARAMETERS = metadata.parameters; // Alias for UI system