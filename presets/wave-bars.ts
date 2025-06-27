import type { ParameterDefinition, PresetMetadata } from './types';

// Wave Bars Visualization
export const parameters: Record<string, ParameterDefinition> = {
  // Core wave parameters
  frequency: { type: 'slider', min: 0.1, max: 20, step: 0.1, default: 3, label: 'Wave Frequency' },
  amplitude: { type: 'slider', min: 0, max: 100, step: 1, default: 50, label: 'Wave Height' },
  complexity: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.3, label: 'Harmonics' },
  chaos: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.1, label: 'Randomness' },
  damping: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.9, label: 'Layer Decay' },
  layers: { type: 'slider', min: 1, max: 5, step: 1, default: 2, label: 'Layers' },
  
  // Bar-specific parameters
  barCount: { type: 'slider', min: 20, max: 100, step: 5, default: 40, label: 'Number of Bars' },
  barSpacing: { type: 'slider', min: 0, max: 10, step: 1, default: 2, label: 'Bar Spacing' }
};

export function draw(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, any>,
  generator: any,
  time: number
) {
  // Yesterday's direct approach - simple sine calculations (high performance)
  const barWidth = (width - params.barSpacing * (params.barCount - 1)) / params.barCount;
  
  for (let i = 0; i < params.barCount; i++) {
    const x = i * (barWidth + params.barSpacing);
    
    // Simple sine wave for center line
    const t = i / params.barCount;
    const waveY = height / 2 + Math.sin((t * params.frequency * Math.PI * 2) + time) * params.amplitude;
    
    // Simple sine wave for bar height
    const barHeight = Math.abs(Math.sin((t * params.frequency * 3 * Math.PI * 2) + time * 2) * 40) + 20;
    
    // Rainbow gradient
    const hue = (i / params.barCount) * 360;
    const gradient = ctx.createLinearGradient(x, waveY - barHeight/2, x, waveY + barHeight/2);
    gradient.addColorStop(0, `hsla(${hue}, 70%, 60%, 0.9)`);
    gradient.addColorStop(0.5, `hsla(${hue}, 80%, 50%, 1)`);
    gradient.addColorStop(1, `hsla(${hue}, 70%, 60%, 0.9)`);
    
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
  }
  
  // Simple wave guide line
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(100, 100, 100, 0.15)';
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
}

export const metadata: PresetMetadata = {
  name: "🌊 Wave Bars",
  description: "Audio bars that follow wave patterns with rainbow gradients",
  defaultParams: {
    seed: "wave-bars",
    frequency: 3,
    amplitude: 50,
    complexity: 0.3,
    chaos: 0.1,
    damping: 0.9,
    layers: 2,
    barCount: 40,
    barSpacing: 2
  }
};