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
  colorVariation: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.5, label: 'Color Variation' },
  
  // Color mode
  colorMode: { 
    type: 'select', 
    options: [
      { value: 'spotify', label: 'Spotify Green' },
      { value: 'theme', label: 'Use Theme Colors' }
    ],
    default: 'theme',
    label: 'Color Mode'
  }
};

export function draw(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, any>,
  generator: any,
  time: number
) {
  // Apply universal background
  applyUniversalBackground(ctx, width, height, params);
  
  // Get theme colors with fallbacks
  const fillColor = params.fillColor || '#1DB954'; // Spotify green
  const strokeColor = params.strokeColor || '#1ED760'; // Lighter Spotify green
  const colorMode = params.colorMode || 'theme';
  
  // Helper to convert hex to HSL
  const hexToHsl = (hex: string): [number, number, number] => {
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
    
    // Color based on mode
    let hue, saturation, lightness;
    
    if (colorMode === 'spotify') {
      // Spotify-inspired green color palette
      hue = 140 + (layer / layers) * 20 + (params.colorVariation || 0.5) * 15 * Math.sin(time + layer);
      saturation = 70 - layer * 5;
      lightness = 50 + layer * 5;
    } else {
      // Theme colors with layer variations
      const [baseHue, baseSat, baseLum] = hexToHsl(layer % 2 === 0 ? fillColor : strokeColor);
      hue = baseHue + (layer / layers) * 30 + (params.colorVariation || 0.5) * 20 * Math.sin(time + layer);
      saturation = baseSat - layer * 5;
      lightness = baseLum + layer * 10;
    }
    
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
        ctx.fillStyle = `hsl(${(hue + 10) % 360}, ${Math.min(100, saturation + 10)}%, ${Math.min(90, lightness + 20)}%)`;
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
  description: "Pulsing concentric circles with theme colors or Spotify's signature green palette",
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
    colorVariation: 0.5,
    colorMode: 'theme'
  }
};