// A Letter Mark
const PARAMETERS = {
  backgroundColor: { type: 'color', default: "#ffffff", label: 'Background Color', category: 'Background' },
  backgroundType: { type: 'select', options: [{"value":"transparent","label":"Transparent"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "transparent", label: 'Background Type', category: 'Background' },
  backgroundGradientStart: { type: 'color', default: "#ffffff", label: 'Gradient Start', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientEnd: { type: 'color', default: "#f0f0f0", label: 'Gradient End', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 0, label: 'Gradient Direction', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  fillType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "solid", label: 'Fill Type', category: 'Fill' },
  fillColor: { type: 'color', default: "#000000", label: 'Fill Color', category: 'Fill', showIf: (params)=>params.fillType === 'solid' },
  fillGradientStart: { type: 'color', default: "#000000", label: 'Gradient Start', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientEnd: { type: 'color', default: "#333333", label: 'Gradient End', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 45, label: 'Gradient Direction', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Fill Opacity', category: 'Fill', showIf: (params)=>params.fillType !== 'none' },
  strokeType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid"},{"value":"dashed","label":"Dashed"},{"value":"dotted","label":"Dotted"}], default: "none", label: 'Stroke Type', category: 'Stroke' },
  strokeColor: { type: 'color', default: "#000000", label: 'Stroke Color', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeWidth: { type: 'slider', min: 0, max: 10, step: 0.5, default: 2, label: 'Stroke Width', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Stroke Opacity', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  letter: { type: 'text', default: 'A', label: 'Letter(s)', category: 'Text' },
  fontWeight: { type: 'select', options: [{"value":"300","label":"Light"},{"value":"400","label":"Regular"},{"value":"500","label":"Medium"},{"value":"600","label":"Semibold"},{"value":"700","label":"Bold"},{"value":"800","label":"Heavy"}], default: "600", label: 'Font Weight', category: 'Typography' },
  style: { type: 'select', options: [{"value":"modern","label":"Modern Sans"},{"value":"rounded","label":"Rounded"},{"value":"geometric","label":"Geometric"},{"value":"classic","label":"Classic"}], default: "modern", label: 'Style', category: 'Typography' },
  alignment: { type: 'select', options: [{"value":"center","label":"Center"},{"value":"left","label":"Left"},{"value":"right","label":"Right"}], default: "center", label: 'Alignment', category: 'Layout' },
  size: { type: 'slider', min: 0.3, max: 0.9, step: 0.05, default: 0.7, label: 'Size', category: 'Layout' },
  letterSpacing: { type: 'slider', min: -0.1, max: 0.3, step: 0.02, default: 0, label: 'Letter Spacing', category: 'Typography' },
  container: { type: 'select', options: [{"value":"none","label":"None"},{"value":"circle","label":"Circle"},{"value":"square","label":"Square"},{"value":"rounded","label":"Rounded Square"}], default: "none", label: 'Container', category: 'Container' },
  containerPadding: { type: 'slider', min: 0.1, max: 0.4, step: 0.05, default: 0.2, label: 'Container Padding', category: 'Container' }
};

function applyUniversalBackground(ctx, width, height, params) {
  if (!params.backgroundType || params.backgroundType === 'transparent') return;
  
  if (params.backgroundType === 'solid') {
    ctx.fillStyle = params.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, width, height);
  } else if (params.backgroundType === 'gradient') {
    const direction = (params.backgroundGradientDirection || 0) * (Math.PI / 180);
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

function drawVisualization(ctx, width, height, params, generator, time) {
  // Ensure color parameters are available at the root level
  if (params.customParameters) {
    params.fillColor = params.fillColor || params.customParameters.fillColor;
    params.strokeColor = params.strokeColor || params.customParameters.strokeColor;
    params.backgroundColor = params.backgroundColor || params.customParameters.backgroundColor;
    params.textColor = params.textColor || params.customParameters.textColor;
    
    // Also make sure all custom parameters are available at root level for convenience
    Object.keys(params.customParameters).forEach(key => {
      if (params[key] === undefined) {
        params[key] = params.customParameters[key];
      }
    });
  }

  // Apply universal background
  applyUniversalBackground(ctx, width, height, params);
  
  // Get theme colors
  const fillColor = params.fillColor || '#000000';
  const strokeColor = params.strokeColor || '#000000';
  const backgroundColor = params.backgroundColor || '#ffffff';
  
  // Extract parameters
  const letter = params.letter || 'A';
  const fontWeight = params.fontWeight || '600';
  const style = params.style || 'modern';
  const alignment = params.alignment || 'center';
  const size = params.size || 0.7;
  const letterSpacing = params.letterSpacing || 0;
  const container = params.container || 'none';
  const containerPadding = params.containerPadding || 0.2;
  
  // Calculate dimensions
  const minDim = Math.min(width, height);
  const fontSize = minDim * size;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Set up font
  let fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  if (style === 'rounded') {
    fontFamily = '"SF Pro Rounded", -apple-system, BlinkMacSystemFont, sans-serif';
  } else if (style === 'geometric') {
    fontFamily = 'Futura, "Century Gothic", sans-serif';
  } else if (style === 'classic') {
    fontFamily = 'Georgia, "Times New Roman", serif';
  }
  
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.textAlign = alignment;
  ctx.textBaseline = 'middle';
  
  // Apply letter spacing
  if (letterSpacing !== 0 && letter.length > 1) {
    ctx.letterSpacing = `${letterSpacing}em`;
  }
  
  // Calculate text position
  let textX = centerX;
  if (alignment === 'left') textX = width * 0.1;
  else if (alignment === 'right') textX = width * 0.9;
  
  // Draw container if specified
  if (container !== 'none') {
    const metrics = ctx.measureText(letter);
    const textWidth = metrics.width;
    const textHeight = fontSize;
    const padding = minDim * containerPadding;
    
    ctx.fillStyle = fillColor;
    
    if (container === 'circle') {
      const radius = Math.max(textWidth, textHeight) / 2 + padding;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Invert text color for contrast
      ctx.fillStyle = backgroundColor;
    } else if (container === 'square' || container === 'rounded') {
      const boxSize = Math.max(textWidth, textHeight) + padding * 2;
      const boxX = centerX - boxSize / 2;
      const boxY = centerY - boxSize / 2;
      
      ctx.beginPath();
      if (container === 'rounded') {
        const radius = boxSize * 0.1;
        ctx.roundRect(boxX, boxY, boxSize, boxSize, radius);
      } else {
        ctx.rect(boxX, boxY, boxSize, boxSize);
      }
      ctx.fill();
      
      // Invert text color for contrast
      ctx.fillStyle = backgroundColor;
    }
  } else {
    // No container, use fill color for text
    ctx.fillStyle = fillColor;
  }
  
  // Draw the letter(s)
  ctx.fillText(letter, textX, centerY);
  
  // Optional: Add subtle depth with stroke
  if (params.strokeWidth && params.strokeWidth > 0) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = params.strokeWidth;
    ctx.strokeText(letter, textX, centerY);
  }
}

export const metadata = {
  name: "A Letter Mark",
  description: "Clean, professional letter-based logos perfect for modern brands",
  defaultParams: {
    seed: "letter-mark",
    letter: 'A',
    fontWeight: '600',
    style: 'modern',
    alignment: 'center',
    size: 0.7,
    letterSpacing: 0,
    container: 'none',
    containerPadding: 0.2
  }
};

export const id = 'letter-mark';
export const name = "A Letter Mark";
export const description = "Clean, professional letter-based logos perfect for modern brands";
export { drawVisualization };
export const defaultParams = {
  seed: "letter-mark",
  letter: 'A',
  fontWeight: '600',
  style: 'modern',
  alignment: 'center',
  size: 0.7,
  letterSpacing: 0,
  container: 'none',
  containerPadding: 0.2
};
export const code = `// A Letter Mark
const PARAMETERS = {
  backgroundColor: { type: 'color', default: "#ffffff", label: 'Background Color', category: 'Background' },
  backgroundType: { type: 'select', options: [{"value":"transparent","label":"Transparent"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "transparent", label: 'Background Type', category: 'Background' },
  backgroundGradientStart: { type: 'color', default: "#ffffff", label: 'Gradient Start', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientEnd: { type: 'color', default: "#f0f0f0", label: 'Gradient End', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 0, label: 'Gradient Direction', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  fillType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "solid", label: 'Fill Type', category: 'Fill' },
  fillColor: { type: 'color', default: "#000000", label: 'Fill Color', category: 'Fill', showIf: (params)=>params.fillType === 'solid' },
  fillGradientStart: { type: 'color', default: "#000000", label: 'Gradient Start', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientEnd: { type: 'color', default: "#333333", label: 'Gradient End', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 45, label: 'Gradient Direction', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Fill Opacity', category: 'Fill', showIf: (params)=>params.fillType !== 'none' },
  strokeType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid"},{"value":"dashed","label":"Dashed"},{"value":"dotted","label":"Dotted"}], default: "none", label: 'Stroke Type', category: 'Stroke' },
  strokeColor: { type: 'color', default: "#000000", label: 'Stroke Color', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeWidth: { type: 'slider', min: 0, max: 10, step: 0.5, default: 2, label: 'Stroke Width', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Stroke Opacity', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  letter: { type: 'text', default: 'A', label: 'Letter(s)', category: 'Text' },
  fontWeight: { type: 'select', options: [{"value":"300","label":"Light"},{"value":"400","label":"Regular"},{"value":"500","label":"Medium"},{"value":"600","label":"Semibold"},{"value":"700","label":"Bold"},{"value":"800","label":"Heavy"}], default: "600", label: 'Font Weight', category: 'Typography' },
  style: { type: 'select', options: [{"value":"modern","label":"Modern Sans"},{"value":"rounded","label":"Rounded"},{"value":"geometric","label":"Geometric"},{"value":"classic","label":"Classic"}], default: "modern", label: 'Style', category: 'Typography' },
  alignment: { type: 'select', options: [{"value":"center","label":"Center"},{"value":"left","label":"Left"},{"value":"right","label":"Right"}], default: "center", label: 'Alignment', category: 'Layout' },
  size: { type: 'slider', min: 0.3, max: 0.9, step: 0.05, default: 0.7, label: 'Size', category: 'Layout' },
  letterSpacing: { type: 'slider', min: -0.1, max: 0.3, step: 0.02, default: 0, label: 'Letter Spacing', category: 'Typography' },
  container: { type: 'select', options: [{"value":"none","label":"None"},{"value":"circle","label":"Circle"},{"value":"square","label":"Square"},{"value":"rounded","label":"Rounded Square"}], default: "none", label: 'Container', category: 'Container' },
  containerPadding: { type: 'slider', min: 0.1, max: 0.4, step: 0.05, default: 0.2, label: 'Container Padding', category: 'Container' }
};

function applyUniversalBackground(ctx, width, height, params) {
  if (!params.backgroundType || params.backgroundType === 'transparent') return;
  
  if (params.backgroundType === 'solid') {
    ctx.fillStyle = params.backgroundColor || '#ffffff';
    ctx.fillRect(0, 0, width, height);
  } else if (params.backgroundType === 'gradient') {
    const direction = (params.backgroundGradientDirection || 0) * (Math.PI / 180);
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

function drawVisualization(ctx, width, height, params, generator, time) {
  // Ensure color parameters are available at the root level
  if (params.customParameters) {
    params.fillColor = params.fillColor || params.customParameters.fillColor;
    params.strokeColor = params.strokeColor || params.customParameters.strokeColor;
    params.backgroundColor = params.backgroundColor || params.customParameters.backgroundColor;
    params.textColor = params.textColor || params.customParameters.textColor;
    
    // Also make sure all custom parameters are available at root level for convenience
    Object.keys(params.customParameters).forEach(key => {
      if (params[key] === undefined) {
        params[key] = params.customParameters[key];
      }
    });
  }

  // Apply universal background
  applyUniversalBackground(ctx, width, height, params);
  
  // Get theme colors
  const fillColor = params.fillColor || '#000000';
  const strokeColor = params.strokeColor || '#000000';
  const backgroundColor = params.backgroundColor || '#ffffff';
  
  // Extract parameters
  const letter = params.letter || 'A';
  const fontWeight = params.fontWeight || '600';
  const style = params.style || 'modern';
  const alignment = params.alignment || 'center';
  const size = params.size || 0.7;
  const letterSpacing = params.letterSpacing || 0;
  const container = params.container || 'none';
  const containerPadding = params.containerPadding || 0.2;
  
  // Calculate dimensions
  const minDim = Math.min(width, height);
  const fontSize = minDim * size;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Set up font
  let fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  if (style === 'rounded') {
    fontFamily = '"SF Pro Rounded", -apple-system, BlinkMacSystemFont, sans-serif';
  } else if (style === 'geometric') {
    fontFamily = 'Futura, "Century Gothic", sans-serif';
  } else if (style === 'classic') {
    fontFamily = 'Georgia, "Times New Roman", serif';
  }
  
  ctx.font = \`\${fontWeight} \${fontSize}px \${fontFamily}\`;
  ctx.textAlign = alignment;
  ctx.textBaseline = 'middle';
  
  // Apply letter spacing
  if (letterSpacing !== 0 && letter.length > 1) {
    ctx.letterSpacing = \`\${letterSpacing}em\`;
  }
  
  // Calculate text position
  let textX = centerX;
  if (alignment === 'left') textX = width * 0.1;
  else if (alignment === 'right') textX = width * 0.9;
  
  // Draw container if specified
  if (container !== 'none') {
    const metrics = ctx.measureText(letter);
    const textWidth = metrics.width;
    const textHeight = fontSize;
    const padding = minDim * containerPadding;
    
    ctx.fillStyle = fillColor;
    
    if (container === 'circle') {
      const radius = Math.max(textWidth, textHeight) / 2 + padding;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Invert text color for contrast
      ctx.fillStyle = backgroundColor;
    } else if (container === 'square' || container === 'rounded') {
      const boxSize = Math.max(textWidth, textHeight) + padding * 2;
      const boxX = centerX - boxSize / 2;
      const boxY = centerY - boxSize / 2;
      
      ctx.beginPath();
      if (container === 'rounded') {
        const radius = boxSize * 0.1;
        ctx.roundRect(boxX, boxY, boxSize, boxSize, radius);
      } else {
        ctx.rect(boxX, boxY, boxSize, boxSize);
      }
      ctx.fill();
      
      // Invert text color for contrast
      ctx.fillStyle = backgroundColor;
    }
  } else {
    // No container, use fill color for text
    ctx.fillStyle = fillColor;
  }
  
  // Draw the letter(s)
  ctx.fillText(letter, textX, centerY);
  
  // Optional: Add subtle depth with stroke
  if (params.strokeWidth && params.strokeWidth > 0) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = params.strokeWidth;
    ctx.strokeText(letter, textX, centerY);
  }
}`;