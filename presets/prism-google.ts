import type { ParameterDefinition, PresetMetadata } from './types';

// Prism (Google-style) Visualization
export const parameters: Record<string, ParameterDefinition> = {
  frequency: { type: 'slider', min: 0.1, max: 20, step: 0.1, default: 3, label: 'Wave Frequency' },
  amplitude: { type: 'slider', min: 0, max: 100, step: 1, default: 50, label: 'Wave Height' },
  complexity: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.3, label: 'Harmonics' },
  chaos: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.1, label: 'Chaos (Jitter)' },
  damping: { type: 'slider', min: 0, max: 1, step: 0.01, default: 0.9, label: 'Decay' },
  layers: { type: 'slider', min: 1, max: 8, step: 1, default: 2, label: 'Layers' },
  radius: { type: 'slider', min: 10, max: 200, step: 1, default: 50, label: 'Base Radius' },
  symmetry: { type: 'slider', min: 1, max: 12, step: 1, default: 6, label: 'Symmetry Segments' },
  strokeWidth: { type: 'slider', min: 1, max: 10, step: 1, default: 3, label: 'Stroke Width' },
  colorMode: { type: 'select', options: ['duotone', 'layered HSL', 'monochrome'], default: 'duotone', label: 'Color Mode' },
  primaryColor: { type: 'color', default: '#4285F4', label: 'Primary Color' },
  secondaryColor: { type: 'color', default: '#EA4335', label: 'Secondary Color' }
};

function getColor(params: Record<string, any>, layer: number, time: number): string {
  if (params.colorMode === 'duotone') {
    return layer % 2 === 0 ? params.primaryColor : params.secondaryColor;
  } else if (params.colorMode === 'monochrome') {
    return params.primaryColor;
  } else {
    const hue = (layer / params.layers) * 360;
    return `hsl(${hue}, 70%, 50%)`;
  }
}

export function draw(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, any>,
  generator: any,
  time: number
) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, width, height);

  const centerX = width / 2;
  const centerY = height / 2;
  const segments = params.symmetry;

  for (let layer = 0; layer < params.layers; layer++) {
    const baseRadius = params.radius * (1 + layer * 0.25);
    const angleStep = (Math.PI * 2) / segments;
    const color = getColor(params, layer, time);

    ctx.strokeStyle = color;
    ctx.lineWidth = params.strokeWidth;
    ctx.globalAlpha = 1 - layer * 0.1;

    ctx.beginPath();
    for (let i = 0; i <= segments; i++) {
      const angle = i * angleStep;
      const jitter = (Math.random() - 0.5) * params.chaos * 10;
      const radius = baseRadius + jitter + params.amplitude * Math.sin(time + i);
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

export const metadata: PresetMetadata = {
  name: "◆ Prism (Google-style)",
  description: "Structured geometric layers with controlled symmetry and color palette",
  defaultParams: {
    seed: "prism-geometry",
    frequency: 1,
    amplitude: 25,
    complexity: 0.6,
    chaos: 0.0,
    damping: 0.8,
    layers: 4,
    radius: 80,
    symmetry: 6,
    colorMode: "duotone",
    primaryColor: "#4285F4",
    secondaryColor: "#EA4335"
  }
};