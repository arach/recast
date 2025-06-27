import type { ParameterDefinition, PresetMetadata } from './types';

// Pulse (Spotify-style) Visualization
export const parameters: Record<string, ParameterDefinition> = {
  // Core wave parameters
  frequency: { type: 'slider', min: 0.1, max: 20, step: 0.1, default: 3, label: 'Wave Frequency' },
  amplitude: { type: 'slider', min: 0, max: 100, step: 1, default: 50, label: 'Wave Height' },
  complexity: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.3, label: 'Harmonics' },
  chaos: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.1, label: 'Randomness' },
  damping: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.9, label: 'Decay' },
  layers: { type: 'slider', min: 1, max: 8, step: 1, default: 2, label: 'Layers' },
  
  // Circle-specific parameters
  radius: { type: 'slider', min: 10, max: 200, step: 1, default: 50, label: 'Base Radius' },
  strokeWidth: { type: 'slider', min: 1, max: 10, step: 1, default: 3, label: 'Stroke Width' },
  colorVariation: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.5, label: 'Color Variation' }
};

export function draw(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, any>,
  generator: any,
  time: number
) {
  // Clear canvas with gradient background
  const bgGradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2);
  bgGradient.addColorStop(0, '#fafafa');
  bgGradient.addColorStop(1, '#f0f0f0');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  const centerX = width / 2;
  const centerY = height / 2;
  const baseRadius = params.radius || 50;
  const layers = params.layers || 4;
  
  // Generate multiple layers of circles
  for (let layer = 0; layer < layers; layer++) {
    const layerPhase = (layer / layers) * Math.PI * 2 + time * 0.5;
    const layerRadius = baseRadius * (1 + layer * 0.3);
    const radiusVariation = (params.amplitude || 25) * Math.sin(layerPhase + time);
    const finalRadius = Math.max(10, layerRadius + radiusVariation);
    
    // Spotify-inspired green color palette
    const hue = 140 + (layer / layers) * 20 + (params.colorVariation || 0.5) * 15 * Math.sin(time + layer);
    const saturation = 70 - layer * 5;
    const lightness = 50 + layer * 5;
    
    ctx.beginPath();
    ctx.strokeStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    ctx.lineWidth = params.strokeWidth || 3;
    ctx.globalAlpha = 0.8 - layer * 0.1;
    ctx.arc(centerX, centerY, finalRadius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Add complexity with orbital elements
    if (params.complexity > 0.3) {
      const orbitCount = Math.floor(params.complexity * 8);
      for (let i = 0; i < orbitCount; i++) {
        const orbitAngle = (i / orbitCount) * Math.PI * 2 + layerPhase;
        const orbitX = centerX + Math.cos(orbitAngle) * finalRadius * 0.7;
        const orbitY = centerY + Math.sin(orbitAngle) * finalRadius * 0.7;
        const orbitRadius = 5 + layer * 2;
        
        ctx.beginPath();
        ctx.fillStyle = `hsl(${hue + 10}, ${saturation}%, ${lightness + 20}%)`;
        ctx.globalAlpha = 0.6;
        ctx.arc(orbitX, orbitY, orbitRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  
  ctx.globalAlpha = 1;
}

export const metadata: PresetMetadata = {
  name: "● Pulse (Spotify-style)",
  description: "Pulsing concentric circles with Spotify's signature green palette",
  defaultParams: {
    seed: "pulse-spotify",
    frequency: 3,
    amplitude: 25,
    complexity: 0.6,
    chaos: 0.1,
    damping: 0.8,
    layers: 4,
    radius: 80,
    strokeWidth: 3,
    colorVariation: 0.5
  }
};