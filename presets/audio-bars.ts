import type { ParameterDefinition, PresetMetadata } from './types';

// Audio Bars Visualization
export const parameters: Record<string, ParameterDefinition> = {
  // Core wave parameters
  frequency: { type: 'slider', min: 0.1, max: 20, step: 0.1, default: 4, label: 'Wave Frequency' },
  amplitude: { type: 'slider', min: 0, max: 100, step: 1, default: 60, label: 'Bar Height' },
  complexity: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.2, label: 'Harmonics' },
  chaos: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.15, label: 'Randomness' },
  damping: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.85, label: 'Decay' },
  layers: { type: 'slider', min: 1, max: 3, step: 1, default: 1, label: 'Layers' },
  
  // Bar-specific parameters
  barCount: { type: 'slider', min: 10, max: 80, step: 5, default: 30, label: 'Number of Bars' },
  barSpacing: { type: 'slider', min: 1, max: 8, step: 1, default: 3, label: 'Bar Spacing' }
};

export function draw(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, any>,
  generator: any,
  time: number
) {
  const options = {
    width,
    height,
    resolution: params.barCount,
    time: time,
    seed: params.seed
  };

  const waveData = generator.generateWavePoints(options)[0];
  const barWidth = (width - params.barSpacing * (params.barCount - 1)) / params.barCount;
  const centerY = height / 2;

  waveData.forEach((point, i) => {
    const barHeight = Math.abs(point.y - centerY) * 2;
    const x = i * (barWidth + params.barSpacing);
    
    // Rainbow gradient based on position
    const hue = (i / params.barCount) * 360;
    
    // Create gradient for each bar
    const gradient = ctx.createLinearGradient(x, centerY - barHeight/2, x, centerY + barHeight/2);
    gradient.addColorStop(0, `hsla(${hue}, 70%, 60%, 0.9)`);
    gradient.addColorStop(0.5, `hsla(${hue}, 80%, 50%, 1)`);
    gradient.addColorStop(1, `hsla(${hue}, 70%, 60%, 0.9)`);
    
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
  });
}

export const metadata: PresetMetadata = {
  name: "🎵 Audio Bars",
  description: "Dynamic audio visualizer bars with rainbow colors",
  defaultParams: {
    seed: "audio-bars",
    frequency: 4,
    amplitude: 60,
    complexity: 0.2,
    chaos: 0.15,
    damping: 0.85,
    layers: 1,
    barCount: 30,
    barSpacing: 3
  }
};