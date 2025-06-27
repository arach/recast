import type { ParameterDefinition, PresetMetadata } from './types';

// Apex (Vercel-style) Visualization
export const parameters: Record<string, ParameterDefinition> = {
  // Core wave parameters
  frequency: { type: 'slider', min: 0.1, max: 20, step: 0.1, default: 7, label: 'Wave Frequency' },
  amplitude: { type: 'slider', min: 0, max: 100, step: 1, default: 85, label: 'Wave Height' },
  complexity: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.05, label: 'Harmonics' },
  chaos: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.0, label: 'Randomness' },
  damping: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.98, label: 'Decay' },
  layers: { type: 'slider', min: 1, max: 8, step: 1, default: 1, label: 'Layers' },
  
  // Bar-specific parameters
  barCount: { type: 'slider', min: 20, max: 100, step: 5, default: 30, label: 'Number of Bars' },
  barSpacing: { type: 'slider', min: 0, max: 5, step: 1, default: 5, label: 'Bar Spacing' },
  sharpness: { type: 'slider', min: 0.1, max: 2, step: 0.1, default: 1.2, label: 'Triangle Sharpness' }
};

export function draw(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, any>,
  generator: any,
  time: number
) {
  // Clean gradient background 
  const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
  bgGradient.addColorStop(0, '#000000');
  bgGradient.addColorStop(1, '#111111');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

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
    
    // Dynamic color based on position and time
    const hue = (i / barCount) * 60 + time * 30; // Blue to cyan spectrum
    const intensity = (barHeight / params.amplitude);
    const saturation = 80 + intensity * 20;
    const lightness = 40 + intensity * 40;
    
    // Create dynamic gradient per bar
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
  }
  
  // Add subtle wave guide line
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 1;
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
}

export const metadata: PresetMetadata = {
  name: "🌊 Apex (Modern)",
  description: "Dynamic animated bars with glowing gradients and smooth wave motion",
  defaultParams: {
    seed: "apex-modern",
    frequency: 7,
    amplitude: 85,
    complexity: 0.3,
    chaos: 0.0,
    damping: 0.98,
    layers: 1,
    barCount: 30,
    barSpacing: 5,
    sharpness: 1.2
  }
};