import type { TemplateUtils } from '@reflow/template-utils';

const parameters = {
  frequency: {
    default: 0.5,
    range: [0.2, 1, 0.05]
  },
  amplitude: {
    default: 100,
    range: [60, 180, 5]
  },
  architecturalStyle: {
    default: 1,
    range: [0, 4, 1]
  },
  gridDensity: {
    default: 0.7,
    range: [0.3, 1, 0.05]
  },
  structuralOrder: {
    default: 0.95,
    range: [0.8, 1, 0.01]
  },
  modularity: {
    default: 0.85,
    range: [0.6, 1, 0.05]
  },
  lineWeight: {
    default: 1.5,
    range: [0.5, 4, 0.25]
  },
  cornerSharpness: {
    default: 2,
    range: [0, 8, 0.5]
  },
  structuralDepth: {
    default: 0.3,
    range: [0.1, 0.8, 0.05]
  },
  fenestration: {
    default: 0.4,
    range: [0, 1, 0.05]
  },
  cantilevers: {
    default: 0.2,
    range: [0, 0.6, 0.05]
  },
  curtainWall: {
    default: 0.3,
    range: [0, 0.8, 0.05]
  },
  materialHonesty: {
    default: 0.8,
    range: [0.5, 1, 0.05]
  },
  structuralExpression: {
    default: 0.7,
    range: [0.3, 1, 0.05]
  },
  surfaceTexture: {
    default: 0.2,
    range: [0, 0.5, 0.05]
  },
  goldenSection: {
    default: 1.618,
    range: [1.4, 1.8, 0.05]
  },
  modularProportion: {
    default: 0.9,
    range: [0.7, 1, 0.05]
  },
  materialPalette: {
    default: 1,
    range: [0, 4, 1]
  },
  materialHue: {
    default: 210,
    range: [0, 360, 15]
  },
  industrialFinish: {
    default: 0.6,
    range: [0.3, 0.9, 0.05]
  }
};

function drawVisualization(ctx: CanvasRenderingContext2D, width: number, height: number, params: any, time: number, utils: TemplateUtils) {
  // Apply universal background
  utils.applyUniversalBackground(ctx, width, height, params);

  // Access universal properties
  const fillColor = params.fillColor || '#1e40af';
  const strokeColor = params.strokeColor || '#0f172a';
  const fillOpacity = params.fillOpacity ?? 0.85;
  const strokeOpacity = params.strokeOpacity ?? 0.8;

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
  renderBuildingStructure(ctx, buildingStructure, materialColors, structuralDepth, materialHonesty, fillColor, strokeColor, fillOpacity, strokeOpacity, params);

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

  function generateArchitecturalStructure(style: number, centerX: number, centerY: number, radius: number, density: number, order: number, modularity: number, golden: number, proportion: number, phase: number) {
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

  function generateMaterialColors(hue: number, finish: number, materialType: number) {
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

  function renderStructuralGrid(ctx: any, structure: any, colors: any, density: number, weight: number, scale: number) {
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

  function renderBuildingStructure(ctx: any, structure: any, colors: any, depth: number, honesty: number, fillColor: string, strokeColor: string, fillOpacity: number, strokeOpacity: number, params: any) {
    ctx.save();
    
    // Main structural body
    const bounds = getBounds(structure);
    
    // Apply universal fill/stroke
    drawArchitecturalPath(ctx, structure);
    
    // Apply universal fill
    ctx.save();
    ctx.globalAlpha = fillOpacity;
    ctx.fillStyle = fillColor || colors.primary;
    ctx.fill();
    ctx.restore();
    
    // Apply universal stroke
    ctx.save();
    ctx.globalAlpha = strokeOpacity;
    ctx.strokeStyle = strokeColor || colors.dark;
    ctx.lineWidth = params.strokeWidth || (1 + honesty * 2);
    ctx.lineCap = 'square'; // Architectural precision
    ctx.lineJoin = 'miter';
    ctx.stroke();
    ctx.restore();
    
    ctx.restore();
  }

  function renderArchitecturalDetails(ctx: any, structure: any, colors: any, weight: number, sharpness: number, expression: number) {
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

  function renderFenestration(ctx: any, structure: any, colors: any, fenestration: number, modularity: number, scale: number) {
    ctx.save();
    
    const bounds = getBounds(structure);
    const windowCount = Math.floor(fenestration * modularity * 12);
    
    for (let w = 0; w < windowCount; w++) {
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
    }
    
    ctx.restore();
  }

  function renderCurtainWall(ctx: any, structure: any, colors: any, curtainWall: number, density: number, scale: number) {
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

  function renderCantilevers(ctx: any, structure: any, colors: any, cantilevers: number, depth: number, scale: number) {
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

  function renderSurfaceTexture(ctx: any, structure: any, colors: any, texture: number, materialType: number) {
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

  function drawArchitecturalPath(ctx: any, points: any) {
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

  function getBounds(points: any) {
    const xs = points.map((p: any) => p.x);
    const ys = points.map((p: any) => p.y);
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

const metadata = {
  id: 'architectural-grid',
  name: "🏢 Architectural Grid",
  description: "Clean modernist architectural elements with structural grids, proportional systems, and material honesty",
  parameters,
  defaultParams: {
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

export { parameters, metadata, drawVisualization };