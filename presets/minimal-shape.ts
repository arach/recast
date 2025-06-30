import type { ParameterDefinition, PresetMetadata } from './types';

// Minimal Shape - Simple geometric logos like Microsoft, Dropbox, etc.
export const parameters: Record<string, ParameterDefinition> = {
  // Shape selection
  shape: {
    type: 'select',
    options: [
      { value: 'square', label: 'Square' },
      { value: 'circle', label: 'Circle' },
      { value: 'triangle', label: 'Triangle' },
      { value: 'hexagon', label: 'Hexagon' },
      { value: 'diamond', label: 'Diamond' },
      { value: 'grid', label: 'Grid (2x2)' }
    ],
    default: 'square',
    label: 'Shape'
  },
  
  // Size and proportions
  size: { 
    type: 'slider', 
    min: 0.3, 
    max: 0.8, 
    step: 0.05, 
    default: 0.6, 
    label: 'Size' 
  },
  
  cornerRadius: {
    type: 'slider',
    min: 0,
    max: 0.5,
    step: 0.05,
    default: 0.1,
    label: 'Corner Roundness'
  },
  
  // Grid specific (like Microsoft)
  gridGap: {
    type: 'slider',
    min: 0.02,
    max: 0.15,
    step: 0.01,
    default: 0.05,
    label: 'Grid Gap',
    showIf: (params) => params.shape === 'grid'
  },
  
  gridColors: {
    type: 'select',
    options: [
      { value: 'theme', label: 'Use Theme Color' },
      { value: 'microsoft', label: 'Microsoft Colors' },
      { value: 'gradient', label: 'Gradient Variation' }
    ],
    default: 'theme',
    label: 'Grid Colors',
    showIf: (params) => params.shape === 'grid'
  },
  
  // Style variations
  rotation: {
    type: 'slider',
    min: 0,
    max: 360,
    step: 15,
    default: 0,
    label: 'Rotation'
  },
  
  thickness: {
    type: 'slider',
    min: 0,
    max: 1,
    step: 0.1,
    default: 1,
    label: 'Fill Amount'
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
  
  // Get theme colors
  const fillColor = params.fillColor || '#0078D4';
  const strokeColor = params.strokeColor || '#106EBE';
  
  // Extract parameters
  const shape = params.shape || 'square';
  const size = params.size || 0.6;
  const cornerRadius = params.cornerRadius || 0.1;
  const gridGap = params.gridGap || 0.05;
  const gridColors = params.gridColors || 'theme';
  const rotation = params.rotation || 0;
  const thickness = params.thickness || 1;
  
  // Calculate dimensions
  const minDim = Math.min(width, height);
  const shapeSize = minDim * size;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Apply rotation
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-centerX, -centerY);
  
  // Draw based on shape
  if (shape === 'grid') {
    // Microsoft-style 2x2 grid
    const gap = shapeSize * gridGap;
    const squareSize = (shapeSize - gap) / 2;
    
    // Define colors
    let colors: string[];
    if (gridColors === 'microsoft') {
      colors = ['#F25022', '#7FBA00', '#00A4EF', '#FFB900']; // Microsoft colors
    } else if (gridColors === 'gradient') {
      // Create gradient variations of theme color
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
      
      const [h, s, l] = hexToHsl(fillColor);
      colors = [
        `hsl(${h}, ${s}%, ${l}%)`,
        `hsl(${h + 30}, ${s}%, ${l}%)`,
        `hsl(${h}, ${s * 0.7}%, ${l + 10}%)`,
        `hsl(${h - 30}, ${s}%, ${l}%)`
      ];
    } else {
      // Use theme color for all squares
      colors = [fillColor, fillColor, fillColor, fillColor];
    }
    
    // Draw 2x2 grid
    const positions = [
      { x: centerX - squareSize - gap/2, y: centerY - squareSize - gap/2 }, // Top left
      { x: centerX + gap/2, y: centerY - squareSize - gap/2 }, // Top right
      { x: centerX - squareSize - gap/2, y: centerY + gap/2 }, // Bottom left
      { x: centerX + gap/2, y: centerY + gap/2 } // Bottom right
    ];
    
    positions.forEach((pos, i) => {
      ctx.fillStyle = colors[i];
      const radius = squareSize * cornerRadius;
      ctx.beginPath();
      ctx.roundRect(pos.x, pos.y, squareSize, squareSize, radius);
      ctx.fill();
    });
    
  } else {
    // Single shape
    ctx.fillStyle = fillColor;
    
    switch (shape) {
      case 'square':
        const halfSize = shapeSize / 2;
        const radius = shapeSize * cornerRadius;
        ctx.beginPath();
        ctx.roundRect(centerX - halfSize, centerY - halfSize, shapeSize, shapeSize, radius);
        break;
        
      case 'circle':
        ctx.beginPath();
        if (thickness < 1) {
          // Ring shape
          ctx.arc(centerX, centerY, shapeSize / 2, 0, Math.PI * 2);
          ctx.arc(centerX, centerY, (shapeSize / 2) * (1 - thickness), 0, Math.PI * 2, true);
        } else {
          // Filled circle
          ctx.arc(centerX, centerY, shapeSize / 2, 0, Math.PI * 2);
        }
        break;
        
      case 'triangle':
        ctx.beginPath();
        const height = (shapeSize * Math.sqrt(3)) / 2;
        ctx.moveTo(centerX, centerY - height / 2);
        ctx.lineTo(centerX - shapeSize / 2, centerY + height / 2);
        ctx.lineTo(centerX + shapeSize / 2, centerY + height / 2);
        ctx.closePath();
        break;
        
      case 'hexagon':
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const x = centerX + (shapeSize / 2) * Math.cos(angle);
          const y = centerY + (shapeSize / 2) * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        break;
        
      case 'diamond':
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - shapeSize / 2);
        ctx.lineTo(centerX + shapeSize / 2, centerY);
        ctx.lineTo(centerX, centerY + shapeSize / 2);
        ctx.lineTo(centerX - shapeSize / 2, centerY);
        ctx.closePath();
        break;
    }
    
    ctx.fill();
    
    // Optional stroke
    if (params.strokeWidth && params.strokeWidth > 0) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = params.strokeWidth;
      ctx.stroke();
    }
  }
  
  ctx.restore();
}

export const metadata: PresetMetadata = {
  name: "◼ Minimal Shape",
  description: "Simple geometric shapes for clean, modern brand identities",
  defaultParams: {
    seed: "minimal-shape",
    shape: 'square',
    size: 0.6,
    cornerRadius: 0.1,
    gridGap: 0.05,
    gridColors: 'theme',
    rotation: 0,
    thickness: 1
  }
};