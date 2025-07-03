// 🏢 Architectural Grid
const PARAMETERS = {
  // Universal Background Controls
  backgroundColor: { type: 'color', default: "#f8f8f8", label: 'Background Color', category: 'Background' },
  backgroundType: { type: 'select', options: [{"value":"transparent","label":"Transparent"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "gradient", label: 'Background Type', category: 'Background' },
  backgroundGradientStart: { type: 'color', default: "#fcfcfc", label: 'Gradient Start', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientEnd: { type: 'color', default: "#f4f4f4", label: 'Gradient End', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 135, label: 'Gradient Direction', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  
  // Universal Fill Controls
  fillType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "gradient", label: 'Fill Type', category: 'Fill' },
  fillColor: { type: 'color', default: "#1e40af", label: 'Fill Color', category: 'Fill', showIf: (params)=>params.fillType === 'solid' },
  fillGradientStart: { type: 'color', default: "#3b82f6", label: 'Gradient Start', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientEnd: { type: 'color', default: "#1e40af", label: 'Gradient End', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 90, label: 'Gradient Direction', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.85, label: 'Fill Opacity', category: 'Fill', showIf: (params)=>params.fillType !== 'none' },
  
  // Universal Stroke Controls
  strokeType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid"},{"value":"dashed","label":"Dashed"},{"value":"dotted","label":"Dotted"}], default: "solid", label: 'Stroke Type', category: 'Stroke' },
  strokeColor: { type: 'color', default: "#0f172a", label: 'Stroke Color', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeWidth: { type: 'slider', min: 0, max: 10, step: 0.5, default: 1.5, label: 'Stroke Width', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.8, label: 'Stroke Opacity', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  
  // Core structural properties
  frequency: { type: 'slider', min: 0.2, max: 1, step: 0.05, default: 0.5, label: 'Structural Rhythm' },
  amplitude: { type: 'slider', min: 60, max: 180, step: 5, default: 100, label: 'Building Scale' },
  
  // Architectural style
  architecturalStyle: {
    type: 'slider',
    min: 0,
    max: 4,
    step: 1,
    default: 1,
    label: 'Style (0=Bauhaus, 1=Modernist, 2=Brutalist, 3=Minimalist, 4=Deconstructivist)'
  },
  
  // Grid system
  gridDensity: { type: 'slider', min: 0.3, max: 1, step: 0.05, default: 0.7, label: 'Grid Density' },
  structuralOrder: { type: 'slider', min: 0.8, max: 1, step: 0.01, default: 0.95, label: 'Structural Order' },
  modularity: { type: 'slider', min: 0.6, max: 1, step: 0.05, default: 0.85, label: 'Modular System' },
  
  // Geometric precision
  lineWeight: { type: 'slider', min: 0.5, max: 4, step: 0.25, default: 1.5, label: 'Line Weight' },
  cornerSharpness: { type: 'slider', min: 0, max: 8, step: 0.5, default: 2, label: 'Corner Detail' },
  structuralDepth: { type: 'slider', min: 0.1, max: 0.8, step: 0.05, default: 0.3, label: 'Structural Depth' },
  
  // Building elements
  fenestration: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.4, label: 'Window Pattern' },
  cantilevers: { type: 'slider', min: 0, max: 0.6, step: 0.05, default: 0.2, label: 'Cantilever Elements' },
  curtainWall: { type: 'slider', min: 0, max: 0.8, step: 0.05, default: 0.3, label: 'Curtain Wall System' },
  
  // Material expression
  materialHonesty: { type: 'slider', min: 0.5, max: 1, step: 0.05, default: 0.8, label: 'Material Honesty' },
  structuralExpression: { type: 'slider', min: 0.3, max: 1, step: 0.05, default: 0.7, label: 'Structural Expression' },
  surfaceTexture: { type: 'slider', min: 0, max: 0.5, step: 0.05, default: 0.2, label: 'Surface Texture' },
  
  // Proportional systems
  goldenSection: { type: 'slider', min: 1.4, max: 1.8, step: 0.05, default: 1.618, label: 'Golden Section (φ)' },
  modularProportion: { type: 'slider', min: 0.7, max: 1, step: 0.05, default: 0.9, label: 'Proportional Harmony' },
  
  // Color and materials
  materialPalette: {
    type: 'slider',
    min: 0,
    max: 4,
    step: 1,
    default: 1,
    label: 'Materials (0=Concrete, 1=Steel/Glass, 2=Brick, 3=Wood, 4=Composite)'
  },
  materialHue: { type: 'slider', min: 0, max: 360, step: 15, default: 210, label: 'Material Tone' },
  industrialFinish: { type: 'slider', min: 0.3, max: 0.9, step: 0.05, default: 0.6, label: 'Industrial Finish' }
};

function applyUniversalBackground(ctx, width, height, params) {
  if (!params.backgroundType || params.backgroundType === 'transparent') return;
  
  if (params.backgroundType === 'solid') {
    ctx.fillStyle = params.backgroundColor || '#f8f8f8';
    ctx.fillRect(0, 0, width, height);
  } else if (params.backgroundType === 'gradient') {
    const direction = (params.backgroundGradientDirection || 135) * (Math.PI / 180);
    const x1 = width / 2 - Math.cos(direction) * width / 2;
    const y1 = height / 2 - Math.sin(direction) * height / 2;
    const x2 = width / 2 + Math.cos(direction) * width / 2;
    const y2 = height / 2 + Math.sin(direction) * height / 2;
    
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, params.backgroundGradientStart || '#fcfcfc');
    gradient.addColorStop(0.5, '#f8f8f8');
    gradient.addColorStop(1, params.backgroundGradientEnd || '#f4f4f4');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
}

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
  const centerX = width / 2;
  const centerY = height / 2;
  const frequency = params.frequency || 0.5;
  const amplitude = params.amplitude || 100;
  const architecturalStyleNum = Math.round(params.architecturalStyle || 1);
  const gridDensity = params.gridDensity || 0.7;
  const structuralOrder = params.structuralOrder || 0.95;
  const modularity = params.modularity || 0.85;
  const lineWeight = params.lineWeight || 1.5;
  const cornerSharpness = params.cornerSharpness || 2;
  const structuralDepth = params.structuralDepth || 0.3;
  const fenestration = params.fenestration || 0.4;
  const cantilevers = params.cantilevers || 0.2;
  const curtainWall = params.curtainWall || 0.3;
  const materialHonesty = params.materialHonesty || 0.8;
  const structuralExpression = params.structuralExpression || 0.7;
  const surfaceTexture = params.surfaceTexture || 0.2;
  const goldenSection = params.goldenSection || 1.618;
  const modularProportion = params.modularProportion || 0.9;
  const materialPaletteNum = Math.round(params.materialPalette || 1);
  const materialHue = params.materialHue || 210;
  const industrialFinish = params.industrialFinish || 0.6;

  // Architectural scaling with proportional systems
  const baseScale = Math.min(width, height) / 400;
  const scaledAmplitude = amplitude * baseScale;
  
  // Subtle structural movement (minimal for architectural stability)
  const structuralPhase = time * frequency * 0.4;
  const structuralPulse = 1 + Math.sin(structuralPhase) * 0.02; // Very subtle

  // Generate architectural structure
  const buildingStructure = generateArchitecturalStructure(
    architecturalStyleNum, centerX, centerY, scaledAmplitude * structuralPulse,
    gridDensity, structuralOrder, modularity, goldenSection, modularProportion, structuralPhase
  );

  // Material color system
  const materialColors = generateMaterialColors(materialHue, industrialFinish, materialPaletteNum);

  // Render structural grid (background)
  if (gridDensity > 0.3) {
    renderStructuralGrid(ctx, buildingStructure, materialColors, gridDensity, lineWeight, scaledAmplitude);
  }

  // Render main building structure
  renderBuildingStructure(ctx, buildingStructure, materialColors, structuralDepth, materialHonesty, params);

  // Render architectural details
  renderArchitecturalDetails(ctx, buildingStructure, materialColors, lineWeight, cornerSharpness, structuralExpression);

  // Render fenestration (windows)
  if (fenestration > 0.1) {
    renderFenestration(ctx, buildingStructure, materialColors, fenestration, modularity, scaledAmplitude);
  }

  // Render curtain wall system
  if (curtainWall > 0.1) {
    renderCurtainWall(ctx, buildingStructure, materialColors, curtainWall, gridDensity, scaledAmplitude);
  }

  // Render cantilever elements
  if (cantilevers > 0.1) {
    renderCantilevers(ctx, buildingStructure, materialColors, cantilevers, structuralDepth, scaledAmplitude);
  }

  // Render surface texture
  if (surfaceTexture > 0.05) {
    renderSurfaceTexture(ctx, buildingStructure, materialColors, surfaceTexture, materialPaletteNum);
  }

  function generateArchitecturalStructure(style, centerX, centerY, radius, density, order, modularity, golden, proportion, phase) {
    const points = [];
    
    // Determine point count based on style and modularity
    const basePoints = Math.floor(4 + density * 8); // 4-12 points for architectural clarity
    
    for (let i = 0; i < basePoints; i++) {
      const t = i / basePoints;
      const angle = t * Math.PI * 2;
      
      let structuralRadius = radius;
      
      // Generate style-specific geometry
      switch (style) {
        case 0: // Bauhaus - functional, geometric
          const bauhaus1 = Math.sin(angle * 4 + phase) * (1 - order) * 0.1;
          const bauhausModule = Math.floor(Math.sin(angle * 8 + phase) * 2) / 2 * modularity * 0.05;
          structuralRadius = radius * (0.9 + bauhaus1 + bauhausModule);
          break;
          
        case 1: // Modernist - clean lines, proportional
          const modernist1 = Math.sin(angle * golden + phase) * (1 - order) * 0.08;
          const modernist2 = Math.sin(angle * 6 + phase * proportion) * modularity * 0.06;
          structuralRadius = radius * (0.88 + modernist1 + modernist2);
          break;
          
        case 2: // Brutalist - massive, angular
          const brutalist1 = Math.sin(angle * 3 + phase) * (1 - order) * 0.15;
          const brutalistMass = Math.floor(Math.sin(angle * 5 + phase) * 3) / 3 * modularity * 0.1;
          structuralRadius = radius * (0.85 + brutalist1 + brutalistMass);
          break;
          
        case 3: // Minimalist - pure, reductive
          const minimalist1 = Math.sin(angle * 2 + phase) * (1 - order) * 0.05;
          const minimalistPure = Math.sin(angle * golden + phase * 0.5) * proportion * 0.03;
          structuralRadius = radius * (0.92 + minimalist1 + minimalistPure);
          break;
          
        case 4: // Deconstructivist - fragmented, dynamic
          const decon1 = Math.sin(angle * 7 + phase) * (1 - order) * 0.2;
          const decon2 = Math.sin(angle * 11 + phase * 1.7) * modularity * 0.15;
          const deconFragment = Math.floor(Math.sin(angle * 13 + phase * 2) * 4) / 4 * density * 0.1;
          structuralRadius = radius * (0.8 + decon1 + decon2 + deconFragment);
          break;
      }
      
      // Apply proportional systems
      const goldenHarmonic = Math.sin(angle * golden + phase) * proportion * 0.04;
      const modularGrid = Math.floor(angle / (Math.PI * 2 / 16)) * (Math.PI * 2 / 16); // 16-unit grid
      const gridInfluence = Math.sin(modularGrid * 2 + phase) * modularity * 0.03;
      
      const finalRadius = structuralRadius * (1 + goldenHarmonic + gridInfluence);
      
      points.push({
        x: centerX + Math.cos(angle) * finalRadius,
        y: centerY + Math.sin(angle) * finalRadius,
        angle: angle,
        radius: finalRadius,
        structuralLoad: 0.3 + Math.sin(angle * 4 + phase) * 0.7,
        gridAlignment: Math.sin(angle * 8 + phase) * 0.5 + 0.5,
        modulePosition: Math.floor(t * 8) / 8, // 8-unit modular system
        proportionalWeight: order + Math.sin(angle * golden) * 0.1
      });
    }
    
    return points;
  }

  function generateMaterialColors(hue, finish, materialType) {
    const baseSaturation = finish * 30; // Industrial materials have low saturation
    const baseLightness = 50 + finish * 30;
    
    // Material type affects color characteristics
    const materialAdjustments = [
      { hueShift: 0, satMult: 0.3, lightMult: 0.8 },   // Concrete - cool, neutral
      { hueShift: -15, satMult: 0.2, lightMult: 1.2 }, // Steel/Glass - metallic, bright
      { hueShift: 15, satMult: 1.2, lightMult: 0.7 },  // Brick - warm, earthy
      { hueShift: 25, satMult: 0.8, lightMult: 0.9 },  // Wood - natural, warm
      { hueShift: 5, satMult: 0.6, lightMult: 1.0 }    // Composite - engineered
    ];
    
    const adjustment = materialAdjustments[materialType] || materialAdjustments[0];
    const adjustedHue = hue + adjustment.hueShift;
    const adjustedSat = baseSaturation * adjustment.satMult;
    const adjustedLight = baseLightness * adjustment.lightMult;
    
    return {
      primary: `hsl(${adjustedHue}, ${adjustedSat}%, ${adjustedLight}%)`,
      light: `hsl(${adjustedHue}, ${adjustedSat * 0.7}%, ${Math.min(adjustedLight + 25, 90)}%)`,
      dark: `hsl(${adjustedHue}, ${adjustedSat * 1.3}%, ${adjustedLight - 20}%)`,
      structural: `hsl(${adjustedHue - 5}, ${adjustedSat * 0.8}%, ${adjustedLight - 10}%)`,
      grid: `hsl(${adjustedHue}, ${adjustedSat * 0.5}%, ${adjustedLight + 15}%)`,
      glass: `hsl(${adjustedHue + 30}, ${adjustedSat * 0.3}%, 85%)`
    };
  }

  function renderStructuralGrid(ctx, structure, colors, density, weight, scale) {
    ctx.save();
    ctx.globalAlpha = density * 0.3;
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = weight * 0.5;
    
    const bounds = getBounds(structure);
    const gridSpacing = scale * (0.15 / density); // Denser grids have closer spacing
    
    // Horizontal grid lines
    for (let y = bounds.minY; y <= bounds.maxY; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(bounds.minX, y);
      ctx.lineTo(bounds.maxX, y);
      ctx.stroke();
    }
    
    // Vertical grid lines
    for (let x = bounds.minX; x <= bounds.maxX; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, bounds.minY);
      ctx.lineTo(x, bounds.maxY);
      ctx.stroke();
    }
    
    ctx.restore();
  }

  function renderBuildingStructure(ctx, structure, colors, depth, honesty, params) {
    ctx.save();
    
    // Main structural body
    const bounds = getBounds(structure);
    
    // Apply universal fill/stroke
    drawArchitecturalPath(ctx, structure);
    
    // Apply universal fill
    if (params.fillType && params.fillType !== 'none') {
      ctx.save();
      ctx.globalAlpha = params.fillOpacity || 0.85;
      
      if (params.fillType === 'solid') {
        ctx.fillStyle = params.fillColor || colors.primary;
      } else if (params.fillType === 'gradient') {
        const direction = (params.fillGradientDirection || 90) * (Math.PI / 180);
        const x1 = bounds.centerX - Math.cos(direction) * bounds.width / 2;
        const y1 = bounds.centerY - Math.sin(direction) * bounds.height / 2;
        const x2 = bounds.centerX + Math.cos(direction) * bounds.width / 2;
        const y2 = bounds.centerY + Math.sin(direction) * bounds.height / 2;
        
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, params.fillGradientStart || colors.light);
        gradient.addColorStop(0.3, colors.primary);
        gradient.addColorStop(0.7, colors.structural);
        gradient.addColorStop(1, params.fillGradientEnd || colors.dark);
        
        ctx.fillStyle = gradient;
      }
      
      ctx.fill();
      ctx.restore();
    }
    
    // Apply universal stroke
    if (params.strokeType && params.strokeType !== 'none') {
      ctx.save();
      ctx.globalAlpha = params.strokeOpacity || 0.8;
      ctx.strokeStyle = params.strokeColor || colors.dark;
      ctx.lineWidth = params.strokeWidth || (1 + honesty * 2);
      ctx.lineCap = 'square'; // Architectural precision
      ctx.lineJoin = 'miter';
      
      // Apply stroke pattern
      switch (params.strokeType) {
        case 'dashed':
          ctx.setLineDash([ctx.lineWidth * 3, ctx.lineWidth * 2]);
          break;
        case 'dotted':
          ctx.setLineDash([ctx.lineWidth, ctx.lineWidth]);
          break;
        default:
          ctx.setLineDash([]);
      }
      
      ctx.stroke();
      ctx.restore();
    }
    
    ctx.restore();
  }

  function renderArchitecturalDetails(ctx, structure, colors, weight, sharpness, expression) {
    ctx.save();
    
    for (let i = 0; i < structure.length; i++) {
      const current = structure[i];
      const next = structure[(i + 1) % structure.length];
      
      if (current.structuralLoad > 0.6) {
        ctx.globalAlpha = current.structuralLoad * expression * 0.7;
        
        // Structural detail line
        ctx.strokeStyle = colors.structural;
        ctx.lineWidth = weight;
        ctx.beginPath();
        ctx.moveTo(current.x, current.y);
        ctx.lineTo(next.x, next.y);
        ctx.stroke();
        
        // Corner detail
        if (sharpness > 2) {
          const cornerSize = sharpness;
          ctx.fillStyle = colors.light;
          ctx.globalAlpha = expression * 0.5;
          ctx.beginPath();
          ctx.arc(current.x, current.y, cornerSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    
    ctx.restore();
  }

  function renderFenestration(ctx, structure, colors, fenestration, modularity, scale) {
    ctx.save();
    
    const bounds = getBounds(structure);
    const windowCount = Math.floor(fenestration * modularity * 12);
    
    for (let w = 0; w < windowCount; w++) {
      const windowPhase = w * 0.8;
      const windowT = (w / windowCount);
      
      // Modular window positioning
      const moduleX = bounds.minX + (windowT * bounds.width);
      const moduleY = bounds.centerY + Math.sin(windowT * Math.PI * 4) * bounds.height * 0.2;
      const windowWidth = scale * 0.06 * modularity;
      const windowHeight = windowWidth * 1.5; // Proportional windows
      
      ctx.globalAlpha = fenestration * 0.8;
      
      // Window frame
      ctx.strokeStyle = colors.dark;
      ctx.lineWidth = 1;
      ctx.strokeRect(moduleX - windowWidth/2, moduleY - windowHeight/2, windowWidth, windowHeight);
      
      // Window glass
      ctx.fillStyle = colors.glass;
      ctx.globalAlpha = fenestration * 0.6;
      ctx.fillRect(moduleX - windowWidth/2, moduleY - windowHeight/2, windowWidth, windowHeight);
      
      // Mullions (if modular)
      if (modularity > 0.7) {
        ctx.strokeStyle = colors.structural;
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = modularity * 0.7;
        
        // Vertical mullion
        ctx.beginPath();
        ctx.moveTo(moduleX, moduleY - windowHeight/2);
        ctx.lineTo(moduleX, moduleY + windowHeight/2);
        ctx.stroke();
        
        // Horizontal mullion
        ctx.beginPath();
        ctx.moveTo(moduleX - windowWidth/2, moduleY);
        ctx.lineTo(moduleX + windowWidth/2, moduleY);
        ctx.stroke();
      }
    }
    
    ctx.restore();
  }

  function renderCurtainWall(ctx, structure, colors, curtainWall, density, scale) {
    ctx.save();
    ctx.globalAlpha = curtainWall * 0.6;
    
    const bounds = getBounds(structure);
    const panelSize = scale * (0.08 / density);
    
    // Curtain wall panels
    for (let y = bounds.minY; y < bounds.maxY; y += panelSize) {
      for (let x = bounds.minX; x < bounds.maxX; x += panelSize) {
        // Panel frame
        ctx.strokeStyle = colors.structural;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x, y, panelSize, panelSize);
        
        // Panel glass
        ctx.fillStyle = colors.glass;
        ctx.globalAlpha = curtainWall * 0.4;
        ctx.fillRect(x + 1, y + 1, panelSize - 2, panelSize - 2);
      }
    }
    
    ctx.restore();
  }

  function renderCantilevers(ctx, structure, colors, cantilevers, depth, scale) {
    ctx.save();
    
    const cantileverCount = Math.floor(cantilevers * 6);
    
    for (let c = 0; c < cantileverCount; c++) {
      const cantileverT = c / cantileverCount;
      const angle = cantileverT * Math.PI * 2;
      const point = structure[Math.floor(cantileverT * structure.length)];
      
      if (point) {
        const cantileverLength = scale * 0.15 * cantilevers;
        const cantileverWidth = scale * 0.03;
        
        ctx.globalAlpha = cantilevers * depth * 0.8;
        
        // Cantilever projection
        const projX = point.x + Math.cos(angle) * cantileverLength;
        const projY = point.y + Math.sin(angle) * cantileverLength;
        
        // Cantilever body
        ctx.fillStyle = colors.structural;
        ctx.fillRect(
          Math.min(point.x, projX) - cantileverWidth/2,
          Math.min(point.y, projY) - cantileverWidth/2,
          Math.abs(projX - point.x) + cantileverWidth,
          cantileverWidth
        );
        
        // Cantilever edge
        ctx.strokeStyle = colors.dark;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(projX, projY);
        ctx.stroke();
      }
    }
    
    ctx.restore();
  }

  function renderSurfaceTexture(ctx, structure, colors, texture, materialType) {
    ctx.save();
    ctx.globalAlpha = texture * 0.4;
    
    const bounds = getBounds(structure);
    const textureCount = Math.floor(texture * 50);
    
    for (let t = 0; t < textureCount; t++) {
      const textureX = bounds.minX + Math.random() * bounds.width;
      const textureY = bounds.minY + Math.random() * bounds.height;
      
      switch (materialType) {
        case 0: // Concrete texture
          ctx.fillStyle = colors.dark;
          ctx.beginPath();
          ctx.arc(textureX, textureY, Math.random() * 2, 0, Math.PI * 2);
          ctx.fill();
          break;
          
        case 1: // Steel/Glass texture
          ctx.strokeStyle = colors.light;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(textureX, textureY);
          ctx.lineTo(textureX + Math.random() * 4 - 2, textureY + Math.random() * 4 - 2);
          ctx.stroke();
          break;
          
        case 2: // Brick texture
          const brickWidth = 8;
          const brickHeight = 3;
          ctx.strokeStyle = colors.structural;
          ctx.lineWidth = 0.5;
          ctx.strokeRect(textureX, textureY, brickWidth, brickHeight);
          break;
      }
    }
    
    ctx.restore();
  }

  function drawArchitecturalPath(ctx, points) {
    if (points.length < 3) return;
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    // Precise architectural curves (minimal smoothing for clarity)
    for (let i = 1; i < points.length; i++) {
      const current = points[i];
      const previous = points[i - 1];
      const next = points[(i + 1) % points.length];
      
      // Architectural precision
      const precision = current.proportionalWeight || 0.9;
      const cp1x = previous.x + (current.x - (points[i - 2] || previous).x) * precision * 0.15;
      const cp1y = previous.y + (current.y - (points[i - 2] || previous).y) * precision * 0.15;
      const cp2x = current.x - (next.x - previous.x) * precision * 0.15;
      const cp2y = current.y - (next.y - previous.y) * precision * 0.15;
      
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, current.x, current.y);
    }
    
    // Close the architectural form with precision
    const first = points[0];
    const last = points[points.length - 1];
    const secondLast = points[points.length - 2];
    const second = points[1];
    
    const precision = 0.9;
    const cp1x = last.x + (first.x - secondLast.x) * precision * 0.15;
    const cp1y = last.y + (first.y - secondLast.y) * precision * 0.15;
    const cp2x = first.x - (second.x - last.x) * precision * 0.15;
    const cp2y = first.y - (second.y - last.y) * precision * 0.15;
    
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, first.x, first.y);
    ctx.closePath();
  }

  function getBounds(points) {
    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    
    return {
      minX, maxX, minY, maxY,
      width: maxX - minX,
      height: maxY - minY,
      centerX: (minX + maxX) / 2,
      centerY: (minY + maxY) / 2
    };
  }
}

export const metadata = {
  name: "🏢 Architectural Grid",
  description: "Clean modernist architectural elements with structural grids, proportional systems, and material honesty",
  defaultParams: {
    seed: "architectural-grid-modernist",
    frequency: 0.5,
    amplitude: 100,
    architecturalStyle: 1,
    gridDensity: 0.7,
    structuralOrder: 0.95,
    modularity: 0.85,
    lineWeight: 1.5,
    cornerSharpness: 2,
    structuralDepth: 0.3,
    fenestration: 0.4,
    cantilevers: 0.2,
    curtainWall: 0.3,
    materialHonesty: 0.8,
    structuralExpression: 0.7,
    surfaceTexture: 0.2,
    goldenSection: 1.618,
    modularProportion: 0.9,
    materialPalette: 1,
    materialHue: 210,
    industrialFinish: 0.6
  }
};

export const id = 'architectural-grid';
export const name = "🏢 Architectural Grid";
export const description = "Clean modernist architectural elements with structural grids, proportional systems, and material honesty";
export const defaultParams = {
  seed: "architectural-grid-modernist",
  frequency: 0.5,
  amplitude: 100,
  architecturalStyle: 1,
  gridDensity: 0.7,
  structuralOrder: 0.95,
  modularity: 0.85,
  lineWeight: 1.5,
  cornerSharpness: 2,
  structuralDepth: 0.3,
  fenestration: 0.4,
  cantilevers: 0.2,
  curtainWall: 0.3,
  materialHonesty: 0.8,
  structuralExpression: 0.7,
  surfaceTexture: 0.2,
  goldenSection: 1.618,
  modularProportion: 0.9,
  materialPalette: 1,
  materialHue: 210,
  industrialFinish: 0.6
};

export const code = `// 🏢 Architectural Grid
const PARAMETERS = {
  // Universal Background Controls
  backgroundColor: { type: 'color', default: "#f8f8f8", label: 'Background Color', category: 'Background' },
  backgroundType: { type: 'select', options: [{"value":"transparent","label":"Transparent"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "gradient", label: 'Background Type', category: 'Background' },
  backgroundGradientStart: { type: 'color', default: "#fcfcfc", label: 'Gradient Start', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientEnd: { type: 'color', default: "#f4f4f4", label: 'Gradient End', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 135, label: 'Gradient Direction', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  
  // Universal Fill Controls
  fillType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "gradient", label: 'Fill Type', category: 'Fill' },
  fillColor: { type: 'color', default: "#1e40af", label: 'Fill Color', category: 'Fill', showIf: (params)=>params.fillType === 'solid' },
  fillGradientStart: { type: 'color', default: "#3b82f6", label: 'Gradient Start', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientEnd: { type: 'color', default: "#1e40af", label: 'Gradient End', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 90, label: 'Gradient Direction', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.85, label: 'Fill Opacity', category: 'Fill', showIf: (params)=>params.fillType !== 'none' },
  
  // Universal Stroke Controls
  strokeType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid"},{"value":"dashed","label":"Dashed"},{"value":"dotted","label":"Dotted"}], default: "solid", label: 'Stroke Type', category: 'Stroke' },
  strokeColor: { type: 'color', default: "#0f172a", label: 'Stroke Color', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeWidth: { type: 'slider', min: 0, max: 10, step: 0.5, default: 1.5, label: 'Stroke Width', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.8, label: 'Stroke Opacity', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  
  // Core structural properties
  frequency: { type: 'slider', min: 0.2, max: 1, step: 0.05, default: 0.5, label: 'Structural Rhythm' },
  amplitude: { type: 'slider', min: 60, max: 180, step: 5, default: 100, label: 'Building Scale' },
  
  // Architectural style
  architecturalStyle: {
    type: 'slider',
    min: 0,
    max: 4,
    step: 1,
    default: 1,
    label: 'Style (0=Bauhaus, 1=Modernist, 2=Brutalist, 3=Minimalist, 4=Deconstructivist)'
  },
  
  // Grid system
  gridDensity: { type: 'slider', min: 0.3, max: 1, step: 0.05, default: 0.7, label: 'Grid Density' },
  structuralOrder: { type: 'slider', min: 0.8, max: 1, step: 0.01, default: 0.95, label: 'Structural Order' },
  modularity: { type: 'slider', min: 0.6, max: 1, step: 0.05, default: 0.85, label: 'Modular System' },
  
  // Geometric precision
  lineWeight: { type: 'slider', min: 0.5, max: 4, step: 0.25, default: 1.5, label: 'Line Weight' },
  cornerSharpness: { type: 'slider', min: 0, max: 8, step: 0.5, default: 2, label: 'Corner Detail' },
  structuralDepth: { type: 'slider', min: 0.1, max: 0.8, step: 0.05, default: 0.3, label: 'Structural Depth' },
  
  // Building elements
  fenestration: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.4, label: 'Window Pattern' },
  cantilevers: { type: 'slider', min: 0, max: 0.6, step: 0.05, default: 0.2, label: 'Cantilever Elements' },
  curtainWall: { type: 'slider', min: 0, max: 0.8, step: 0.05, default: 0.3, label: 'Curtain Wall System' },
  
  // Material expression
  materialHonesty: { type: 'slider', min: 0.5, max: 1, step: 0.05, default: 0.8, label: 'Material Honesty' },
  structuralExpression: { type: 'slider', min: 0.3, max: 1, step: 0.05, default: 0.7, label: 'Structural Expression' },
  surfaceTexture: { type: 'slider', min: 0, max: 0.5, step: 0.05, default: 0.2, label: 'Surface Texture' },
  
  // Proportional systems
  goldenSection: { type: 'slider', min: 1.4, max: 1.8, step: 0.05, default: 1.618, label: 'Golden Section (φ)' },
  modularProportion: { type: 'slider', min: 0.7, max: 1, step: 0.05, default: 0.9, label: 'Proportional Harmony' },
  
  // Color and materials
  materialPalette: {
    type: 'slider',
    min: 0,
    max: 4,
    step: 1,
    default: 1,
    label: 'Materials (0=Concrete, 1=Steel/Glass, 2=Brick, 3=Wood, 4=Composite)'
  },
  materialHue: { type: 'slider', min: 0, max: 360, step: 15, default: 210, label: 'Material Tone' },
  industrialFinish: { type: 'slider', min: 0.3, max: 0.9, step: 0.05, default: 0.6, label: 'Industrial Finish' }
};

function applyUniversalBackground(ctx, width, height, params) {
  if (!params.backgroundType || params.backgroundType === 'transparent') return;
  
  if (params.backgroundType === 'solid') {
    ctx.fillStyle = params.backgroundColor || '#f8f8f8';
    ctx.fillRect(0, 0, width, height);
  } else if (params.backgroundType === 'gradient') {
    const direction = (params.backgroundGradientDirection || 135) * (Math.PI / 180);
    const x1 = width / 2 - Math.cos(direction) * width / 2;
    const y1 = height / 2 - Math.sin(direction) * height / 2;
    const x2 = width / 2 + Math.cos(direction) * width / 2;
    const y2 = height / 2 + Math.sin(direction) * height / 2;
    
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, params.backgroundGradientStart || '#fcfcfc');
    gradient.addColorStop(0.5, '#f8f8f8');
    gradient.addColorStop(1, params.backgroundGradientEnd || '#f4f4f4');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
}

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
  const centerX = width / 2;
  const centerY = height / 2;
  const frequency = params.frequency || 0.5;
  const amplitude = params.amplitude || 100;
  const architecturalStyleNum = Math.round(params.architecturalStyle || 1);
  const gridDensity = params.gridDensity || 0.7;
  const structuralOrder = params.structuralOrder || 0.95;
  const modularity = params.modularity || 0.85;
  const lineWeight = params.lineWeight || 1.5;
  const cornerSharpness = params.cornerSharpness || 2;
  const structuralDepth = params.structuralDepth || 0.3;
  const fenestration = params.fenestration || 0.4;
  const cantilevers = params.cantilevers || 0.2;
  const curtainWall = params.curtainWall || 0.3;
  const materialHonesty = params.materialHonesty || 0.8;
  const structuralExpression = params.structuralExpression || 0.7;
  const surfaceTexture = params.surfaceTexture || 0.2;
  const goldenSection = params.goldenSection || 1.618;
  const modularProportion = params.modularProportion || 0.9;
  const materialPaletteNum = Math.round(params.materialPalette || 1);
  const materialHue = params.materialHue || 210;
  const industrialFinish = params.industrialFinish || 0.6;

  // Architectural scaling with proportional systems
  const baseScale = Math.min(width, height) / 400;
  const scaledAmplitude = amplitude * baseScale;
  
  // Subtle structural movement (minimal for architectural stability)
  const structuralPhase = time * frequency * 0.4;
  const structuralPulse = 1 + Math.sin(structuralPhase) * 0.02; // Very subtle

  // Generate architectural structure
  const buildingStructure = generateArchitecturalStructure(
    architecturalStyleNum, centerX, centerY, scaledAmplitude * structuralPulse,
    gridDensity, structuralOrder, modularity, goldenSection, modularProportion, structuralPhase
  );

  // Material color system
  const materialColors = generateMaterialColors(materialHue, industrialFinish, materialPaletteNum);

  // Render structural grid (background)
  if (gridDensity > 0.3) {
    renderStructuralGrid(ctx, buildingStructure, materialColors, gridDensity, lineWeight, scaledAmplitude);
  }

  // Render main building structure
  renderBuildingStructure(ctx, buildingStructure, materialColors, structuralDepth, materialHonesty, params);

  // Render architectural details
  renderArchitecturalDetails(ctx, buildingStructure, materialColors, lineWeight, cornerSharpness, structuralExpression);

  // Render fenestration (windows)
  if (fenestration > 0.1) {
    renderFenestration(ctx, buildingStructure, materialColors, fenestration, modularity, scaledAmplitude);
  }

  // Render curtain wall system
  if (curtainWall > 0.1) {
    renderCurtainWall(ctx, buildingStructure, materialColors, curtainWall, gridDensity, scaledAmplitude);
  }

  // Render cantilever elements
  if (cantilevers > 0.1) {
    renderCantilevers(ctx, buildingStructure, materialColors, cantilevers, structuralDepth, scaledAmplitude);
  }

  // Render surface texture
  if (surfaceTexture > 0.05) {
    renderSurfaceTexture(ctx, buildingStructure, materialColors, surfaceTexture, materialPaletteNum);
  }

  function generateArchitecturalStructure(style, centerX, centerY, radius, density, order, modularity, golden, proportion, phase) {
    const points = [];
    
    // Determine point count based on style and modularity
    const basePoints = Math.floor(4 + density * 8); // 4-12 points for architectural clarity
    
    for (let i = 0; i < basePoints; i++) {
      const t = i / basePoints;
      const angle = t * Math.PI * 2;
      
      let structuralRadius = radius;
      
      // Generate style-specific geometry
      switch (style) {
        case 0: // Bauhaus - functional, geometric
          const bauhaus1 = Math.sin(angle * 4 + phase) * (1 - order) * 0.1;
          const bauhausModule = Math.floor(Math.sin(angle * 8 + phase) * 2) / 2 * modularity * 0.05;
          structuralRadius = radius * (0.9 + bauhaus1 + bauhausModule);
          break;
          
        case 1: // Modernist - clean lines, proportional
          const modernist1 = Math.sin(angle * golden + phase) * (1 - order) * 0.08;
          const modernist2 = Math.sin(angle * 6 + phase * proportion) * modularity * 0.06;
          structuralRadius = radius * (0.88 + modernist1 + modernist2);
          break;
          
        case 2: // Brutalist - massive, angular
          const brutalist1 = Math.sin(angle * 3 + phase) * (1 - order) * 0.15;
          const brutalistMass = Math.floor(Math.sin(angle * 5 + phase) * 3) / 3 * modularity * 0.1;
          structuralRadius = radius * (0.85 + brutalist1 + brutalistMass);
          break;
          
        case 3: // Minimalist - pure, reductive
          const minimalist1 = Math.sin(angle * 2 + phase) * (1 - order) * 0.05;
          const minimalistPure = Math.sin(angle * golden + phase * 0.5) * proportion * 0.03;
          structuralRadius = radius * (0.92 + minimalist1 + minimalistPure);
          break;
          
        case 4: // Deconstructivist - fragmented, dynamic
          const decon1 = Math.sin(angle * 7 + phase) * (1 - order) * 0.2;
          const decon2 = Math.sin(angle * 11 + phase * 1.7) * modularity * 0.15;
          const deconFragment = Math.floor(Math.sin(angle * 13 + phase * 2) * 4) / 4 * density * 0.1;
          structuralRadius = radius * (0.8 + decon1 + decon2 + deconFragment);
          break;
      }
      
      // Apply proportional systems
      const goldenHarmonic = Math.sin(angle * golden + phase) * proportion * 0.04;
      const modularGrid = Math.floor(angle / (Math.PI * 2 / 16)) * (Math.PI * 2 / 16); // 16-unit grid
      const gridInfluence = Math.sin(modularGrid * 2 + phase) * modularity * 0.03;
      
      const finalRadius = structuralRadius * (1 + goldenHarmonic + gridInfluence);
      
      points.push({
        x: centerX + Math.cos(angle) * finalRadius,
        y: centerY + Math.sin(angle) * finalRadius,
        angle: angle,
        radius: finalRadius,
        structuralLoad: 0.3 + Math.sin(angle * 4 + phase) * 0.7,
        gridAlignment: Math.sin(angle * 8 + phase) * 0.5 + 0.5,
        modulePosition: Math.floor(t * 8) / 8, // 8-unit modular system
        proportionalWeight: order + Math.sin(angle * golden) * 0.1
      });
    }
    
    return points;
  }

  function generateMaterialColors(hue, finish, materialType) {
    const baseSaturation = finish * 30; // Industrial materials have low saturation
    const baseLightness = 50 + finish * 30;
    
    // Material type affects color characteristics
    const materialAdjustments = [
      { hueShift: 0, satMult: 0.3, lightMult: 0.8 },   // Concrete - cool, neutral
      { hueShift: -15, satMult: 0.2, lightMult: 1.2 }, // Steel/Glass - metallic, bright
      { hueShift: 15, satMult: 1.2, lightMult: 0.7 },  // Brick - warm, earthy
      { hueShift: 25, satMult: 0.8, lightMult: 0.9 },  // Wood - natural, warm
      { hueShift: 5, satMult: 0.6, lightMult: 1.0 }    // Composite - engineered
    ];
    
    const adjustment = materialAdjustments[materialType] || materialAdjustments[0];
    const adjustedHue = hue + adjustment.hueShift;
    const adjustedSat = baseSaturation * adjustment.satMult;
    const adjustedLight = baseLightness * adjustment.lightMult;
    
    return {
      primary: \`hsl(\${adjustedHue}, \${adjustedSat}%, \${adjustedLight}%)\`,
      light: \`hsl(\${adjustedHue}, \${adjustedSat * 0.7}%, \${Math.min(adjustedLight + 25, 90)}%)\`,
      dark: \`hsl(\${adjustedHue}, \${adjustedSat * 1.3}%, \${adjustedLight - 20}%)\`,
      structural: \`hsl(\${adjustedHue - 5}, \${adjustedSat * 0.8}%, \${adjustedLight - 10}%)\`,
      grid: \`hsl(\${adjustedHue}, \${adjustedSat * 0.5}%, \${adjustedLight + 15}%)\`,
      glass: \`hsl(\${adjustedHue + 30}, \${adjustedSat * 0.3}%, 85%)\`
    };
  }

  function renderStructuralGrid(ctx, structure, colors, density, weight, scale) {
    ctx.save();
    ctx.globalAlpha = density * 0.3;
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = weight * 0.5;
    
    const bounds = getBounds(structure);
    const gridSpacing = scale * (0.15 / density); // Denser grids have closer spacing
    
    // Horizontal grid lines
    for (let y = bounds.minY; y <= bounds.maxY; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(bounds.minX, y);
      ctx.lineTo(bounds.maxX, y);
      ctx.stroke();
    }
    
    // Vertical grid lines
    for (let x = bounds.minX; x <= bounds.maxX; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, bounds.minY);
      ctx.lineTo(x, bounds.maxY);
      ctx.stroke();
    }
    
    ctx.restore();
  }

  function renderBuildingStructure(ctx, structure, colors, depth, honesty, params) {
    ctx.save();
    
    // Main structural body
    const bounds = getBounds(structure);
    
    // Apply universal fill/stroke
    drawArchitecturalPath(ctx, structure);
    
    // Apply universal fill
    if (params.fillType && params.fillType !== 'none') {
      ctx.save();
      ctx.globalAlpha = params.fillOpacity || 0.85;
      
      if (params.fillType === 'solid') {
        ctx.fillStyle = params.fillColor || colors.primary;
      } else if (params.fillType === 'gradient') {
        const direction = (params.fillGradientDirection || 90) * (Math.PI / 180);
        const x1 = bounds.centerX - Math.cos(direction) * bounds.width / 2;
        const y1 = bounds.centerY - Math.sin(direction) * bounds.height / 2;
        const x2 = bounds.centerX + Math.cos(direction) * bounds.width / 2;
        const y2 = bounds.centerY + Math.sin(direction) * bounds.height / 2;
        
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, params.fillGradientStart || colors.light);
        gradient.addColorStop(0.3, colors.primary);
        gradient.addColorStop(0.7, colors.structural);
        gradient.addColorStop(1, params.fillGradientEnd || colors.dark);
        
        ctx.fillStyle = gradient;
      }
      
      ctx.fill();
      ctx.restore();
    }
    
    // Apply universal stroke
    if (params.strokeType && params.strokeType !== 'none') {
      ctx.save();
      ctx.globalAlpha = params.strokeOpacity || 0.8;
      ctx.strokeStyle = params.strokeColor || colors.dark;
      ctx.lineWidth = params.strokeWidth || (1 + honesty * 2);
      ctx.lineCap = 'square'; // Architectural precision
      ctx.lineJoin = 'miter';
      
      // Apply stroke pattern
      switch (params.strokeType) {
        case 'dashed':
          ctx.setLineDash([ctx.lineWidth * 3, ctx.lineWidth * 2]);
          break;
        case 'dotted':
          ctx.setLineDash([ctx.lineWidth, ctx.lineWidth]);
          break;
        default:
          ctx.setLineDash([]);
      }
      
      ctx.stroke();
      ctx.restore();
    }
    
    ctx.restore();
  }

  function renderArchitecturalDetails(ctx, structure, colors, weight, sharpness, expression) {
    ctx.save();
    
    for (let i = 0; i < structure.length; i++) {
      const current = structure[i];
      const next = structure[(i + 1) % structure.length];
      
      if (current.structuralLoad > 0.6) {
        ctx.globalAlpha = current.structuralLoad * expression * 0.7;
        
        // Structural detail line
        ctx.strokeStyle = colors.structural;
        ctx.lineWidth = weight;
        ctx.beginPath();
        ctx.moveTo(current.x, current.y);
        ctx.lineTo(next.x, next.y);
        ctx.stroke();
        
        // Corner detail
        if (sharpness > 2) {
          const cornerSize = sharpness;
          ctx.fillStyle = colors.light;
          ctx.globalAlpha = expression * 0.5;
          ctx.beginPath();
          ctx.arc(current.x, current.y, cornerSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    
    ctx.restore();
  }

  function renderFenestration(ctx, structure, colors, fenestration, modularity, scale) {
    ctx.save();
    
    const bounds = getBounds(structure);
    const windowCount = Math.floor(fenestration * modularity * 12);
    
    for (let w = 0; w < windowCount; w++) {
      const windowPhase = w * 0.8;
      const windowT = (w / windowCount);
      
      // Modular window positioning
      const moduleX = bounds.minX + (windowT * bounds.width);
      const moduleY = bounds.centerY + Math.sin(windowT * Math.PI * 4) * bounds.height * 0.2;
      const windowWidth = scale * 0.06 * modularity;
      const windowHeight = windowWidth * 1.5; // Proportional windows
      
      ctx.globalAlpha = fenestration * 0.8;
      
      // Window frame
      ctx.strokeStyle = colors.dark;
      ctx.lineWidth = 1;
      ctx.strokeRect(moduleX - windowWidth/2, moduleY - windowHeight/2, windowWidth, windowHeight);
      
      // Window glass
      ctx.fillStyle = colors.glass;
      ctx.globalAlpha = fenestration * 0.6;
      ctx.fillRect(moduleX - windowWidth/2, moduleY - windowHeight/2, windowWidth, windowHeight);
      
      // Mullions (if modular)
      if (modularity > 0.7) {
        ctx.strokeStyle = colors.structural;
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = modularity * 0.7;
        
        // Vertical mullion
        ctx.beginPath();
        ctx.moveTo(moduleX, moduleY - windowHeight/2);
        ctx.lineTo(moduleX, moduleY + windowHeight/2);
        ctx.stroke();
        
        // Horizontal mullion
        ctx.beginPath();
        ctx.moveTo(moduleX - windowWidth/2, moduleY);
        ctx.lineTo(moduleX + windowWidth/2, moduleY);
        ctx.stroke();
      }
    }
    
    ctx.restore();
  }

  function renderCurtainWall(ctx, structure, colors, curtainWall, density, scale) {
    ctx.save();
    ctx.globalAlpha = curtainWall * 0.6;
    
    const bounds = getBounds(structure);
    const panelSize = scale * (0.08 / density);
    
    // Curtain wall panels
    for (let y = bounds.minY; y < bounds.maxY; y += panelSize) {
      for (let x = bounds.minX; x < bounds.maxX; x += panelSize) {
        // Panel frame
        ctx.strokeStyle = colors.structural;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(x, y, panelSize, panelSize);
        
        // Panel glass
        ctx.fillStyle = colors.glass;
        ctx.globalAlpha = curtainWall * 0.4;
        ctx.fillRect(x + 1, y + 1, panelSize - 2, panelSize - 2);
      }
    }
    
    ctx.restore();
  }

  function renderCantilevers(ctx, structure, colors, cantilevers, depth, scale) {
    ctx.save();
    
    const cantileverCount = Math.floor(cantilevers * 6);
    
    for (let c = 0; c < cantileverCount; c++) {
      const cantileverT = c / cantileverCount;
      const angle = cantileverT * Math.PI * 2;
      const point = structure[Math.floor(cantileverT * structure.length)];
      
      if (point) {
        const cantileverLength = scale * 0.15 * cantilevers;
        const cantileverWidth = scale * 0.03;
        
        ctx.globalAlpha = cantilevers * depth * 0.8;
        
        // Cantilever projection
        const projX = point.x + Math.cos(angle) * cantileverLength;
        const projY = point.y + Math.sin(angle) * cantileverLength;
        
        // Cantilever body
        ctx.fillStyle = colors.structural;
        ctx.fillRect(
          Math.min(point.x, projX) - cantileverWidth/2,
          Math.min(point.y, projY) - cantileverWidth/2,
          Math.abs(projX - point.x) + cantileverWidth,
          cantileverWidth
        );
        
        // Cantilever edge
        ctx.strokeStyle = colors.dark;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(projX, projY);
        ctx.stroke();
      }
    }
    
    ctx.restore();
  }

  function renderSurfaceTexture(ctx, structure, colors, texture, materialType) {
    ctx.save();
    ctx.globalAlpha = texture * 0.4;
    
    const bounds = getBounds(structure);
    const textureCount = Math.floor(texture * 50);
    
    for (let t = 0; t < textureCount; t++) {
      const textureX = bounds.minX + Math.random() * bounds.width;
      const textureY = bounds.minY + Math.random() * bounds.height;
      
      switch (materialType) {
        case 0: // Concrete texture
          ctx.fillStyle = colors.dark;
          ctx.beginPath();
          ctx.arc(textureX, textureY, Math.random() * 2, 0, Math.PI * 2);
          ctx.fill();
          break;
          
        case 1: // Steel/Glass texture
          ctx.strokeStyle = colors.light;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(textureX, textureY);
          ctx.lineTo(textureX + Math.random() * 4 - 2, textureY + Math.random() * 4 - 2);
          ctx.stroke();
          break;
          
        case 2: // Brick texture
          const brickWidth = 8;
          const brickHeight = 3;
          ctx.strokeStyle = colors.structural;
          ctx.lineWidth = 0.5;
          ctx.strokeRect(textureX, textureY, brickWidth, brickHeight);
          break;
      }
    }
    
    ctx.restore();
  }

  function drawArchitecturalPath(ctx, points) {
    if (points.length < 3) return;
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    // Precise architectural curves (minimal smoothing for clarity)
    for (let i = 1; i < points.length; i++) {
      const current = points[i];
      const previous = points[i - 1];
      const next = points[(i + 1) % points.length];
      
      // Architectural precision
      const precision = current.proportionalWeight || 0.9;
      const cp1x = previous.x + (current.x - (points[i - 2] || previous).x) * precision * 0.15;
      const cp1y = previous.y + (current.y - (points[i - 2] || previous).y) * precision * 0.15;
      const cp2x = current.x - (next.x - previous.x) * precision * 0.15;
      const cp2y = current.y - (next.y - previous.y) * precision * 0.15;
      
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, current.x, current.y);
    }
    
    // Close the architectural form with precision
    const first = points[0];
    const last = points[points.length - 1];
    const secondLast = points[points.length - 2];
    const second = points[1];
    
    const precision = 0.9;
    const cp1x = last.x + (first.x - secondLast.x) * precision * 0.15;
    const cp1y = last.y + (first.y - secondLast.y) * precision * 0.15;
    const cp2x = first.x - (second.x - last.x) * precision * 0.15;
    const cp2y = first.y - (second.y - last.y) * precision * 0.15;
    
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, first.x, first.y);
    ctx.closePath();
  }

  function getBounds(points) {
    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    
    return {
      minX, maxX, minY, maxY,
      width: maxX - minX,
      height: maxY - minY,
      centerX: (minX + maxX) / 2,
      centerY: (minY + maxY) / 2
    };
  }
}`;