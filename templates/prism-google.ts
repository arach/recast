import type { TemplateUtils } from '@/lib/template-utils';

const parameters = {
  frequency: {
    default: 3,
    range: [0.1, 20, 0.1]
  },
  amplitude: {
    default: 50,
    range: [0, 100, 1]
  },
  complexity: {
    default: 0.3,
    range: [0, 1, 0.01]
  },
  chaos: {
    default: 0.1,
    range: [0, 1, 0.01]
  },
  damping: {
    default: 0.9,
    range: [0, 1, 0.01]
  },
  layers: {
    default: 2,
    range: [1, 8, 1]
  },
  radius: {
    default: 50,
    range: [10, 200, 1]
  },
  scale: {
    default: 1,
    range: [0.1, 3, 0.1]
  },
  symmetry: {
    default: 6,
    range: [1, 12, 1]
  },
  colorMode: {
    default: 'theme',
    options: ['duotone', 'layered HSL', 'monochrome', 'theme']
  }
};

function getColor(params: any, layer: number, time: number) {
  // Use theme colors as defaults
  const primaryColor = params.primaryColor || params.fillColor || '#4285F4';
  const secondaryColor = params.secondaryColor || params.strokeColor || '#EA4335';
  
  if (params.colorMode === 'theme') {
    // Use theme colors directly
    return layer % 2 === 0 ? (params.fillColor || '#4285F4') : (params.strokeColor || '#EA4335');
  } else if (params.colorMode === 'duotone') {
    return layer % 2 === 0 ? primaryColor : secondaryColor;
  } else if (params.colorMode === 'monochrome') {
    return primaryColor;
  } else {
    const hue = (layer / params.layers) * 360;
    return `hsl(${hue}, 70%, 50%)`;
  }
}

function drawVisualization(ctx: CanvasRenderingContext2D, width: number, height: number, params: any, time: number, utils: TemplateUtils) {
  // Apply universal background
  utils.applyUniversalBackground(ctx, width, height, params);

  // Access universal properties
  const fillColor = params.fillColor || '#4285F4';
  const strokeColor = params.strokeColor || '#EA4335';
  const fillOpacity = params.fillOpacity ?? 1;
  const strokeOpacity = params.strokeOpacity ?? 1;

  const centerX = width / 2;
  const centerY = height / 2;
  const segments = params.symmetry;
  
  // Apply overall scale
  const scale = params.scale ?? 1;

  for (let layer = 0; layer < params.layers; layer++) {
    const baseRadius = params.radius * (1 + layer * 0.25) * scale;
    const angleStep = (Math.PI * 2) / segments;
    const color = getColor(params, layer, time);
    
    // Save context before applying opacity
    ctx.save();
    
    // Apply stroke or fill based on parameters
    if (params.strokeType !== 'none') {
      ctx.strokeStyle = color;
      ctx.lineWidth = params.strokeWidth || 3;
      ctx.globalAlpha = (1 - layer * 0.1) * strokeOpacity;
      
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
    
    // Also support fill if fillType is not 'none'
    if (params.fillType !== 'none') {
      ctx.fillStyle = color;
      ctx.globalAlpha = (1 - layer * 0.1) * fillOpacity;
      
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
      ctx.fill();
    }
    
    // Restore context after drawing
    ctx.restore();
  }
}

const metadata = {
  id: 'prism-google',
  name: "◆ Prism (Google-style)",
  description: "Structured geometric layers with theme-aware colors and controlled symmetry",
  parameters,
  defaultParams: {
    frequency: 3,
    amplitude: 50,
    complexity: 0.3,
    chaos: 0.1,
    damping: 0.9,
    layers: 2,
    radius: 50,
    scale: 1,
    symmetry: 6,
    colorMode: "theme"
  }
};

export { parameters, metadata, drawVisualization };