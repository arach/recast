// ◼ Minimal Shape
const PARAMETERS = {
  // Universal Background Controls
  backgroundColor: { type: 'color', default: "#ffffff", label: 'Background Color', category: 'Background' },
  backgroundType: { type: 'select', options: [{"value":"transparent","label":"Transparent"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "solid", label: 'Background Type', category: 'Background' },
  backgroundGradientStart: { type: 'color', default: "#ffffff", label: 'Gradient Start', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientEnd: { type: 'color', default: "#f0f0f0", label: 'Gradient End', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 45, label: 'Gradient Direction', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  
  // Universal Fill Controls
  fillType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "solid", label: 'Fill Type', category: 'Fill' },
  fillColor: { type: 'color', default: "#0078D4", label: 'Fill Color', category: 'Fill', showIf: (params)=>params.fillType === 'solid' },
  fillGradientStart: { type: 'color', default: "#0078D4", label: 'Gradient Start', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientEnd: { type: 'color', default: "#106EBE", label: 'Gradient End', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 90, label: 'Gradient Direction', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Fill Opacity', category: 'Fill', showIf: (params)=>params.fillType !== 'none' },
  
  // Universal Stroke Controls
  strokeType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid"},{"value":"dashed","label":"Dashed"},{"value":"dotted","label":"Dotted"}], default: "none", label: 'Stroke Type', category: 'Stroke' },
  strokeColor: { type: 'color', default: "#106EBE", label: 'Stroke Color', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeWidth: { type: 'slider', min: 0, max: 10, step: 0.5, default: 2, label: 'Stroke Width', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Stroke Opacity', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  
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

function applyUniversalBackground(ctx, width, height, params) {
  if (!params.backgroundType || params.backgroundType === 'transparent') return;
  
  if (params.backgroundType === 'solid') {
    ctx.fillStyle = params.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, width, height);
  } else if (params.backgroundType === 'gradient') {
    const direction = (params.backgroundGradientDirection || 45) * (Math.PI / 180);
    const x1 = width / 2 - Math.cos(direction) * width / 2;
    const y1 = height / 2 - Math.sin(direction) * height / 2;
    const x2 = width / 2 + Math.cos(direction) * width / 2;
    const y2 = height / 2 + Math.sin(direction) * height / 2;
    
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, params.backgroundGradientStart || '#ffffff');
    gradient.addColorStop(1, params.backgroundGradientEnd || '#f0f0f0');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
}

export { drawVisualization };


function drawVisualization(ctx, width, height, params, _generator, time) {
  // Parameter compatibility layer
  if (params.customParameters) {
    params.fillColor = params.fillColor || params.customParameters.fillColor;
    params.strokeColor = params.strokeColor || params.customParameters.strokeColor;
    params.backgroundColor = params.backgroundColor || params.customParameters.backgroundColor;
    params.textColor = params.textColor || params.customParameters.textColor;
    
    Object.keys(params.customParameters).forEach(key => {
      if (params[key] === undefined) {
        params[key] = params.customParameters[key];
      }
    });
  }

  // Apply universal background
  applyUniversalBackground(ctx, width, height, params);
  
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
      
      const [h, s, l] = hexToHsl(params.fillColor || '#0078D4');
      colors = [
        `hsl(${h}, ${s}%, ${l}%)`,
        `hsl(${h + 30}, ${s}%, ${l}%)`,
        `hsl(${h}, ${s * 0.7}%, ${l + 10}%)`,
        `hsl(${h - 30}, ${s}%, ${l}%)`
      ];
    } else {
      // Use theme color for all squares
      const fillColor = params.fillColor || '#0078D4';
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
      ctx.globalAlpha = params.fillOpacity || 1;
      const radius = squareSize * cornerRadius;
      ctx.beginPath();
      ctx.roundRect(pos.x, pos.y, squareSize, squareSize, radius);
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
      gradient.addColorStop(0, params.fillGradientStart || '#0078D4');
      gradient.addColorStop(1, params.fillGradientEnd || '#106EBE');
      ctx.fillStyle = gradient;
    } else if (params.fillType === 'solid') {
      ctx.fillStyle = params.fillColor || '#0078D4';
    }
    
    ctx.globalAlpha = params.fillOpacity || 1;
    
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
    
    if (params.fillType !== 'none') {
      ctx.fill();
    }
    
    // Apply stroke
    if (params.strokeType !== 'none') {
      ctx.globalAlpha = params.strokeOpacity || 1;
      ctx.strokeStyle = params.strokeColor || '#106EBE';
      ctx.lineWidth = params.strokeWidth || 2;
      
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

export const metadata = {
  name: "◼ Minimal Shape",
  description: "Simple geometric shapes for clean, modern brand identities",
  defaultParams: {
    seed: "minimal-shape",
    backgroundType: "solid",
    backgroundColor: "#ffffff",
    fillType: "solid",
    fillColor: "#0078D4",
    fillOpacity: 1,
    strokeType: "none",
    shape: 'square',
    size: 0.6,
    cornerRadius: 0.1,
    gridGap: 0.05,
    gridColors: 'theme',
    rotation: 0,
    thickness: 1
  }
};

export const id = 'minimal-shape';
export const name = "◼ Minimal Shape";
export const description = "Simple geometric shapes for clean, modern brand identities";
export const defaultParams = metadata.defaultParams;

export const code = `// ◼ Minimal Shape
const PARAMETERS = ${JSON.stringify(PARAMETERS, null, 2)};

${applyUniversalBackground.toString()}

${drawVisualization.toString()}`;