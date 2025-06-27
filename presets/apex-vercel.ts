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
  // Clear canvas with clean background
  const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
  bgGradient.addColorStop(0, '#fafafa');
  bgGradient.addColorStop(1, '#ffffff');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  const barCount = params.barCount || 30;
  const barSpacing = params.barSpacing || 5;
  const totalSpacing = (barCount - 1) * barSpacing;
  const barWidth = (width - totalSpacing - 100) / barCount; // 100px margin
  const startX = 50; // 50px left margin
  
  // Generate wave data for triangular pattern
  const waveData = [];
  for (let i = 0; i < barCount; i++) {
    const x = i / (barCount - 1);
    const frequency = (params.frequency || 7) * Math.PI;
    
    // Create triangular wave pattern
    let triangleWave = Math.abs(2 * (x * frequency / Math.PI - Math.floor(x * frequency / Math.PI + 0.5)));
    triangleWave = triangleWave * 2 - 1; // Normalize to -1 to 1
    
    // Apply sharpness factor
    const sharpness = params.sharpness || 1.2;
    triangleWave = Math.sign(triangleWave) * Math.pow(Math.abs(triangleWave), 1/sharpness);
    
    const baseHeight = triangleWave * (params.amplitude || 85);
    
    // Minimal complexity for clean geometric look
    let finalHeight = baseHeight;
    if (params.complexity > 0) {
      finalHeight += Math.sin(x * frequency * 2 + time) * (params.amplitude || 85) * params.complexity * 0.1;
    }
    
    // Apply damping and ensure positive
    finalHeight = Math.abs(finalHeight) * (params.damping || 0.98);
    waveData.push(Math.max(5, finalHeight));
  }
  
  // Draw triangular bars
  for (let i = 0; i < barCount; i++) {
    const x = startX + i * (barWidth + barSpacing);
    const barHeight = waveData[i];
    const y = height - barHeight - 50; // 50px from bottom
    
    // Vercel-inspired color scheme (black to gray gradient)
    const intensity = barHeight / (params.amplitude || 85);
    const lightness = 10 + intensity * 40; // Dark to medium gray
    
    ctx.fillStyle = `hsl(0, 0%, ${lightness}%)`;
    
    // Draw sharp triangular bars
    ctx.beginPath();
    ctx.moveTo(x + barWidth/2, y); // Top point
    ctx.lineTo(x, y + barHeight); // Bottom left
    ctx.lineTo(x + barWidth, y + barHeight); // Bottom right
    ctx.closePath();
    ctx.fill();
    
    // Add subtle stroke for definition
    ctx.strokeStyle = `hsl(0, 0%, ${Math.max(0, lightness - 20)}%)`;
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }
}

export const metadata: PresetMetadata = {
  name: "▲ Apex (Vercel-style)",
  description: "Sharp geometric triangular patterns inspired by Vercel's clean design",
  defaultParams: {
    seed: "apex-triangle",
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