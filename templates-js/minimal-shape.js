// ◼ Minimal Shape - Simple geometric shapes for clean, modern brand identities

const parameters = {
  shape: {
    type: 'select',
    default: 'square',
    options: [
      { value: 'square', label: '◼ Square' },
      { value: 'circle', label: '● Circle' },
      { value: 'triangle', label: '▲ Triangle' },
      { value: 'hexagon', label: '⬡ Hexagon' },
      { value: 'diamond', label: '◆ Diamond' },
      { value: 'grid', label: '⊞ Grid' }
    ],
    label: 'Shape Type',
    category: 'Shape'
  },
  size: {
    type: 'slider',
    default: 0.6,
    min: 0.3,
    max: 0.8,
    step: 0.05,
    label: 'Shape Size',
    category: 'Geometry'
  },
  cornerRadius: {
    type: 'slider',
    default: 0.1,
    min: 0,
    max: 0.5,
    step: 0.05,
    label: 'Corner Radius',
    category: 'Shape'
  },
  rotation: {
    type: 'slider',
    default: 0,
    min: 0,
    max: 360,
    step: 15,
    label: 'Rotation Angle',
    category: 'Transform'
  },
  thickness: {
    type: 'slider',
    default: 1,
    min: 0,
    max: 1,
    step: 0.1,
    label: 'Shape Thickness',
    category: 'Shape'
  },
  gridGap: {
    type: 'slider',
    default: 0.05,
    min: 0.02,
    max: 0.15,
    step: 0.01,
    label: 'Grid Gap',
    category: 'Grid'
  },
  gridColors: {
    type: 'select',
    default: 'theme',
    options: [
      { value: 'theme', label: '🎨 Theme Color' },
      { value: 'microsoft', label: '🪟 Microsoft' },
      { value: 'gradient', label: '🌈 Gradient' }
    ],
    label: 'Grid Colors',
    category: 'Grid'
  }
};

function drawVisualization(ctx, width, height, params, time, utils) {
  // Apply universal background
  utils.background.apply(ctx, width, height, params);
  
  // Get theme colors and opacity
  const fillColor = params.fillColor || '#0078D4';
  const strokeColor = params.strokeColor || '#106EBE';
  const fillOpacity = params.fillOpacity ?? 1;
  const strokeOpacity = params.strokeOpacity ?? 1;
  
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
    let colors;
    if (gridColors === 'microsoft') {
      colors = ['#F25022', '#7FBA00', '#00A4EF', '#FFB900']; // Microsoft colors
    } else if (gridColors === 'gradient') {
      // Create gradient variations of theme color
      const hexToHsl = (hex) => {
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
      ctx.globalAlpha = fillOpacity;
      const radius = squareSize * cornerRadius;
      
      // Create path for rounded rectangle
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(pos.x, pos.y, squareSize, squareSize, radius);
      } else {
        // Fallback for browsers that don't support roundRect
        ctx.moveTo(pos.x + radius, pos.y);
        ctx.lineTo(pos.x + squareSize - radius, pos.y);
        ctx.quadraticCurveTo(pos.x + squareSize, pos.y, pos.x + squareSize, pos.y + radius);
        ctx.lineTo(pos.x + squareSize, pos.y + squareSize - radius);
        ctx.quadraticCurveTo(pos.x + squareSize, pos.y + squareSize, pos.x + squareSize - radius, pos.y + squareSize);
        ctx.lineTo(pos.x + radius, pos.y + squareSize);
        ctx.quadraticCurveTo(pos.x, pos.y + squareSize, pos.x, pos.y + squareSize - radius);
        ctx.lineTo(pos.x, pos.y + radius);
        ctx.quadraticCurveTo(pos.x, pos.y, pos.x + radius, pos.y);
        ctx.closePath();
      }
      ctx.fill();
    });
    
  } else {
    // Single shape - prepare fill
    if (params.fillType === 'gradient') {
      const direction = (params.fillGradientDirection || 90) * (Math.PI / 180);
      const x1 = centerX - Math.cos(direction) * shapeSize / 2;
      const y1 = centerY - Math.sin(direction) * shapeSize / 2;
      const x2 = centerX + Math.cos(direction) * shapeSize / 2;
      const y2 = centerY + Math.sin(direction) * shapeSize / 2;
      
      const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
      gradient.addColorStop(0, params.fillGradientStart || fillColor);
      gradient.addColorStop(1, params.fillGradientEnd || strokeColor);
      ctx.fillStyle = gradient;
    } else if (params.fillType === 'solid') {
      ctx.fillStyle = fillColor;
    }
    
    ctx.globalAlpha = fillOpacity;
    
    switch (shape) {
      case 'square':
        const halfSize = shapeSize / 2;
        const radius = shapeSize * cornerRadius;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(centerX - halfSize, centerY - halfSize, shapeSize, shapeSize, radius);
        } else {
          // Fallback for rounded rectangle
          const x = centerX - halfSize;
          const y = centerY - halfSize;
          ctx.moveTo(x + radius, y);
          ctx.lineTo(x + shapeSize - radius, y);
          ctx.quadraticCurveTo(x + shapeSize, y, x + shapeSize, y + radius);
          ctx.lineTo(x + shapeSize, y + shapeSize - radius);
          ctx.quadraticCurveTo(x + shapeSize, y + shapeSize, x + shapeSize - radius, y + shapeSize);
          ctx.lineTo(x + radius, y + shapeSize);
          ctx.quadraticCurveTo(x, y + shapeSize, x, y + shapeSize - radius);
          ctx.lineTo(x, y + radius);
          ctx.quadraticCurveTo(x, y, x + radius, y);
          ctx.closePath();
        }
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
    
    if (params.fillType !== 'none') {
      ctx.fill();
    }
    
    // Apply stroke
    if (params.strokeWidth && params.strokeWidth > 0) {
      ctx.globalAlpha = strokeOpacity;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = params.strokeWidth;
      
      // Apply stroke patterns based on universal stroke type
      if (params.strokeType === 'dashed') {
        ctx.setLineDash([5, 5]);
      } else if (params.strokeType === 'dotted') {
        ctx.setLineDash([2, 2]);
      }
      
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
  
  ctx.restore();
}

const metadata = {
  id: 'minimal-shape',
  name: "◼ Minimal Shape",
  description: "Simple geometric shapes for clean, modern brand identities",
  parameters,
  defaultParams: {
    shape: 'square',
    size: 0.6,
    cornerRadius: 0.1,
    rotation: 0,
    thickness: 1,
    gridGap: 0.05,
    gridColors: 'theme'
  }
};

