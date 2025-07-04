// 🌳 Organic Bark
const PARAMETERS = {
  // Universal Background Controls
  backgroundColor: { type: 'color', default: "#f8f5f0", label: 'Background Color', category: 'Background' },
  backgroundType: { type: 'select', options: [{"value":"transparent","label":"Transparent"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "gradient", label: 'Background Type', category: 'Background' },
  backgroundGradientStart: { type: 'color', default: "#faf8f5", label: 'Gradient Start', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientEnd: { type: 'color', default: "#f0ede0", label: 'Gradient End', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 45, label: 'Gradient Direction', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  
  // Universal Fill Controls
  fillType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "gradient", label: 'Fill Type', category: 'Fill' },
  fillColor: { type: 'color', default: "#8B4513", label: 'Fill Color', category: 'Fill', showIf: (params)=>params.fillType === 'solid' },
  fillGradientStart: { type: 'color', default: "#A0522D", label: 'Gradient Start', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientEnd: { type: 'color', default: "#654321", label: 'Gradient End', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 90, label: 'Gradient Direction', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.9, label: 'Fill Opacity', category: 'Fill', showIf: (params)=>params.fillType !== 'none' },
  
  // Universal Stroke Controls
  strokeType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid"},{"value":"dashed","label":"Dashed"},{"value":"dotted","label":"Dotted"}], default: "solid", label: 'Stroke Type', category: 'Stroke' },
  strokeColor: { type: 'color', default: "#3E2723", label: 'Stroke Color', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeWidth: { type: 'slider', min: 0, max: 10, step: 0.5, default: 1.5, label: 'Stroke Width', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.8, label: 'Stroke Opacity', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  
  // Core growth properties
  frequency: { type: 'slider', min: 0.2, max: 1.5, step: 0.05, default: 0.6, label: 'Growth Rhythm' },
  amplitude: { type: 'slider', min: 80, max: 200, step: 5, default: 140, label: 'Tree Scale' },
  
  // Bark type selector
  barkType: {
    type: 'slider',
    min: 0,
    max: 4,
    step: 1,
    default: 1,
    label: 'Bark Type (0=Oak, 1=Pine, 2=Birch, 3=Redwood, 4=Ancient)'
  },
  
  // Growth characteristics
  growthComplexity: { type: 'slider', min: 0.3, max: 1, step: 0.05, default: 0.7, label: 'Growth Complexity' },
  naturalVariation: { type: 'slider', min: 0.5, max: 1, step: 0.05, default: 0.8, label: 'Natural Variation' },
  organicFlow: { type: 'slider', min: 0.4, max: 1, step: 0.05, default: 0.75, label: 'Organic Flow' },
  
  // Bark texture properties
  barkRoughness: { type: 'slider', min: 0.2, max: 1, step: 0.05, default: 0.6, label: 'Bark Roughness' },
  ridgeDepth: { type: 'slider', min: 0.1, max: 0.8, step: 0.05, default: 0.4, label: 'Ridge Depth' },
  furrowWidth: { type: 'slider', min: 0.1, max: 0.6, step: 0.05, default: 0.3, label: 'Furrow Width' },
  
  // Tree aging and history
  growthRings: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.5, label: 'Growth Rings' },
  branchMarks: { type: 'slider', min: 0, max: 0.8, step: 0.05, default: 0.3, label: 'Branch Scars' },
  weathering: { type: 'slider', min: 0, max: 0.8, step: 0.05, default: 0.4, label: 'Weather Damage' },
  
  // Natural elements
  lichens: { type: 'slider', min: 0, max: 0.6, step: 0.05, default: 0.2, label: 'Lichen Growth' },
  moss: { type: 'slider', min: 0, max: 0.5, step: 0.05, default: 0.15, label: 'Moss Coverage' },
  insects: { type: 'slider', min: 0, max: 0.4, step: 0.05, default: 0.1, label: 'Insect Holes' },
  
  // Character and age
  treeAge: { type: 'slider', min: 0.3, max: 1, step: 0.05, default: 0.6, label: 'Tree Age' },
  characterMarks: { type: 'slider', min: 0, max: 0.8, step: 0.05, default: 0.3, label: 'Character Marks' },
  
  // Color properties
  woodHue: { type: 'slider', min: 0, max: 60, step: 5, default: 25, label: 'Wood Hue (Brown Spectrum)' },
  weatheredTone: { type: 'slider', min: 0.3, max: 1, step: 0.05, default: 0.6, label: 'Weathered Tone' },
  naturalSaturation: { type: 'slider', min: 0.3, max: 0.8, step: 0.05, default: 0.5, label: 'Natural Saturation' }
};

function applyUniversalBackground(ctx, width, height, params) {
  if (!params.backgroundType || params.backgroundType === 'transparent') return;
  
  if (params.backgroundType === 'solid') {
    ctx.fillStyle = params.backgroundColor || '#f8f5f0';
    ctx.fillRect(0, 0, width, height);
  } else if (params.backgroundType === 'gradient') {
    const direction = (params.backgroundGradientDirection || 45) * (Math.PI / 180);
    const x1 = width / 2 - Math.cos(direction) * width / 2;
    const y1 = height / 2 - Math.sin(direction) * height / 2;
    const x2 = width / 2 + Math.cos(direction) * width / 2;
    const y2 = height / 2 + Math.sin(direction) * height / 2;
    
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, params.backgroundGradientStart || '#faf8f5');
    gradient.addColorStop(0.5, '#f4f2e8');
    gradient.addColorStop(1, params.backgroundGradientEnd || '#f0ede0');
    
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
  const frequency = params.frequency || 0.6;
  const amplitude = params.amplitude || 140;
  const barkTypeNum = Math.round(params.barkType || 1);
  const growthComplexity = params.growthComplexity || 0.7;
  const naturalVariation = params.naturalVariation || 0.8;
  const organicFlow = params.organicFlow || 0.75;
  const barkRoughness = params.barkRoughness || 0.6;
  const ridgeDepth = params.ridgeDepth || 0.4;
  const furrowWidth = params.furrowWidth || 0.3;
  const growthRings = params.growthRings || 0.5;
  const branchMarks = params.branchMarks || 0.3;
  const weathering = params.weathering || 0.4;
  const lichens = params.lichens || 0.2;
  const moss = params.moss || 0.15;
  const insects = params.insects || 0.1;
  const treeAge = params.treeAge || 0.6;
  const characterMarks = params.characterMarks || 0.3;
  const woodHue = params.woodHue || 25;
  const weatheredTone = params.weatheredTone || 0.6;
  const naturalSaturation = params.naturalSaturation || 0.5;

  // Organic scaling with natural proportions
  const baseScale = Math.min(width, height) / 400;
  const scaledAmplitude = amplitude * baseScale;
  
  // Gentle organic movement (trees grow slowly!)
  const growthPhase = time * frequency * 0.3;
  const organicPulse = 1 + Math.sin(growthPhase) * 0.03; // Very subtle growth

  // Generate tree structure with organic growth patterns
  const treeStructure = generateOrganicTreeStructure(
    barkTypeNum, centerX, centerY, scaledAmplitude * organicPulse,
    growthComplexity, naturalVariation, organicFlow, treeAge, growthPhase
  );

  // Natural color palette based on bark type and weathering
  const barkColors = generateBarkColors(woodHue, weatheredTone, naturalSaturation, barkTypeNum, treeAge);

  // Render bark base structure
  renderBarkStructure(ctx, treeStructure, barkColors, barkRoughness, ridgeDepth, params);

  // Add growth ring patterns
  if (growthRings > 0.1) {
    renderGrowthRings(ctx, treeStructure, barkColors, growthRings, treeAge, scaledAmplitude);
  }

  // Add bark texture and furrows
  renderBarkTexture(ctx, treeStructure, barkColors, furrowWidth, barkRoughness, naturalVariation, scaledAmplitude);

  // Add branch scars and character marks
  if (branchMarks > 0.1 || characterMarks > 0.1) {
    renderBranchMarks(ctx, treeStructure, barkColors, branchMarks, characterMarks, treeAge, scaledAmplitude);
  }

  // Add weathering effects
  if (weathering > 0.1) {
    renderWeathering(ctx, treeStructure, barkColors, weathering, treeAge, scaledAmplitude);
  }

  // Add natural elements (lichens, moss, insects)
  if (lichens > 0.05) {
    renderLichens(ctx, treeStructure, barkColors, lichens, naturalVariation, scaledAmplitude);
  }

  if (moss > 0.05) {
    renderMoss(ctx, treeStructure, barkColors, moss, naturalVariation, scaledAmplitude);
  }

  if (insects > 0.05) {
    renderInsectHoles(ctx, treeStructure, barkColors, insects, treeAge, scaledAmplitude);
  }

  function generateOrganicTreeStructure(barkType, centerX, centerY, radius, complexity, variation, flow, age, phase) {
    const points = [];
    
    // Determine structure based on bark type
    const basePoints = Math.floor(6 + complexity * 12); // More complexity = more detailed structure
    
    for (let i = 0; i < basePoints; i++) {
      const t = i / basePoints;
      const angle = t * Math.PI * 2;
      
      let organicRadius = radius;
      
      // Generate bark-type specific organic patterns
      switch (barkType) {
        case 0: // Oak - irregular, deeply furrowed
          const oak1 = Math.sin(angle * 3 + phase) * variation * 0.15;
          const oak2 = Math.sin(angle * 7 + phase * 0.7) * complexity * 0.12;
          const oakFurrows = Math.floor(Math.sin(angle * 11 + phase) * 3) / 3 * flow * 0.1;
          organicRadius = radius * (0.85 + oak1 + oak2 + oakFurrows);
          break;
          
        case 1: // Pine - plated, scaly texture
          const pine1 = Math.sin(angle * 5 + phase) * variation * 0.1;
          const pine2 = Math.sin(angle * 9 + phase * 1.2) * complexity * 0.08;
          const pinePlates = Math.floor(Math.sin(angle * 13 + phase * 0.8) * 2) / 2 * flow * 0.08;
          organicRadius = radius * (0.88 + pine1 + pine2 + pinePlates);
          break;
          
        case 2: // Birch - smooth with horizontal marks
          const birch1 = Math.sin(angle * 2 + phase) * variation * 0.06;
          const birch2 = Math.sin(angle * 8 + phase * 0.9) * complexity * 0.05;
          const birchMarks = Math.sin(angle * 16 + phase) * flow * 0.04;
          organicRadius = radius * (0.92 + birch1 + birch2 + birchMarks);
          break;
          
        case 3: // Redwood - thick, fibrous
          const redwood1 = Math.sin(angle * 4 + phase) * variation * 0.12;
          const redwood2 = Math.sin(angle * 6 + phase * 1.1) * complexity * 0.1;
          const redwoodFibers = Math.floor(Math.sin(angle * 14 + phase * 1.3) * 4) / 4 * flow * 0.09;
          organicRadius = radius * (0.87 + redwood1 + redwood2 + redwoodFibers);
          break;
          
        case 4: // Ancient - gnarled, deeply characterized
          const ancient1 = Math.sin(angle * 6 + phase) * variation * 0.2;
          const ancient2 = Math.sin(angle * 10 + phase * 1.5) * complexity * 0.18;
          const ancientGnarls = Math.floor(Math.sin(angle * 17 + phase * 2) * 5) / 5 * flow * 0.15;
          organicRadius = radius * (0.8 + ancient1 + ancient2 + ancientGnarls);
          break;
      }
      
      // Apply age-related organic distortion
      const ageDistortion = Math.sin(angle * (3 + age * 5) + phase) * age * 0.1;
      const organicComplexity = Math.sin(angle * (8 + complexity * 7) + phase * flow) * complexity * 0.08;
      
      const finalRadius = organicRadius * (1 + ageDistortion + organicComplexity);
      
      points.push({
        x: centerX + Math.cos(angle) * finalRadius,
        y: centerY + Math.sin(angle) * finalRadius,
        angle: angle,
        radius: finalRadius,
        organicFlow: flow + Math.sin(angle * 4 + phase) * 0.3,
        textureDepth: complexity + Math.sin(angle * 6 + phase) * 0.2,
        weatheringLevel: Math.sin(angle * 3 + phase) * 0.5 + 0.5,
        growthDirection: Math.sin(angle * 2 + phase) * variation
      });
    }
    
    return points;
  }

  function generateBarkColors(hue, weathered, saturation, barkType, age) {
    const baseSaturation = saturation * 100;
    const baseLightness = 35 + weathered * 25;
    
    // Bark type affects color characteristics
    const barkAdjustments = [
      { hueShift: 0, satMult: 1.0, lightMult: 1.0 },   // Oak - standard brown
      { hueShift: 5, satMult: 0.8, lightMult: 1.1 },   // Pine - slightly lighter, less saturated
      { hueShift: -10, satMult: 0.3, lightMult: 1.8 }, // Birch - much lighter, desaturated
      { hueShift: 10, satMult: 1.2, lightMult: 0.8 },  // Redwood - reddish, darker
      { hueShift: -5, satMult: 0.6, lightMult: 0.6 }   // Ancient - darker, weathered
    ];
    
    const adjustment = barkAdjustments[barkType] || barkAdjustments[0];
    const adjustedHue = hue + adjustment.hueShift;
    const adjustedSat = baseSaturation * adjustment.satMult;
    const adjustedLight = baseLightness * adjustment.lightMult;
    
    // Age affects coloration
    const ageShift = age * 0.8; // Older = slightly more weathered tones
    
    return {
      base: `hsl(${adjustedHue}, ${adjustedSat}%, ${adjustedLight}%)`,
      light: `hsl(${adjustedHue}, ${adjustedSat * 0.8}%, ${Math.min(adjustedLight + 15 + ageShift * 10, 85)}%)`,
      dark: `hsl(${adjustedHue}, ${adjustedSat * 1.2}%, ${adjustedLight - 15 - ageShift * 5}%)`,
      ridge: `hsl(${adjustedHue - 3}, ${adjustedSat * 0.9}%, ${adjustedLight - 8}%)`,
      furrow: `hsl(${adjustedHue + 2}, ${adjustedSat * 1.1}%, ${adjustedLight - 20}%)`,
      weathered: `hsl(${adjustedHue + 5}, ${adjustedSat * 0.7}%, ${adjustedLight + 8}%)`,
      lichen: `hsl(120, 40%, 65%)`, // Greenish for lichens
      moss: `hsl(100, 60%, 45%)`,   // Deeper green for moss
      scar: `hsl(${adjustedHue - 8}, ${adjustedSat * 0.6}%, ${adjustedLight - 25}%)`
    };
  }

  function renderBarkStructure(ctx, structure, colors, roughness, depth, params) {
    ctx.save();
    
    // Main bark body
    const bounds = getBounds(structure);
    
    // Apply universal fill/stroke
    drawOrganicPath(ctx, structure, roughness);
    
    // Apply universal fill
    if (params.fillType && params.fillType !== 'none') {
      ctx.save();
      ctx.globalAlpha = params.fillOpacity || 0.9;
      
      if (params.fillType === 'solid') {
        ctx.fillStyle = params.fillColor || colors.base;
      } else if (params.fillType === 'gradient') {
        const direction = (params.fillGradientDirection || 90) * (Math.PI / 180);
        const x1 = bounds.centerX - Math.cos(direction) * bounds.width / 2;
        const y1 = bounds.centerY - Math.sin(direction) * bounds.height / 2;
        const x2 = bounds.centerX + Math.cos(direction) * bounds.width / 2;
        const y2 = bounds.centerY + Math.sin(direction) * bounds.height / 2;
        
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, params.fillGradientStart || colors.light);
        gradient.addColorStop(0.3, colors.base);
        gradient.addColorStop(0.7, colors.ridge);
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
      ctx.lineWidth = params.strokeWidth || (1 + depth * 3);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
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

  function renderGrowthRings(ctx, structure, colors, ringStrength, age, scale) {
    ctx.save();
    ctx.globalAlpha = ringStrength * 0.6;
    
    const bounds = getBounds(structure);
    const ringCount = Math.floor(age * 8 + 3); // More rings with age
    
    for (let r = 1; r <= ringCount; r++) {
      const ringRadius = (bounds.width / 2) * (r / ringCount) * 0.8;
      const ringAlpha = (1 - r / ringCount) * ringStrength;
      
      ctx.globalAlpha = ringAlpha * 0.4;
      ctx.strokeStyle = colors.ridge;
      ctx.lineWidth = 0.5 + age;
      
      // Organic ring shape (not perfect circles)
      ctx.beginPath();
      for (let i = 0; i <= 64; i++) {
        const angle = (i / 64) * Math.PI * 2;
        const organicVariation = Math.sin(angle * 3 + r) * scale * 0.02;
        const radius = ringRadius + organicVariation;
        const x = bounds.centerX + Math.cos(angle) * radius;
        const y = bounds.centerY + Math.sin(angle) * radius;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.stroke();
    }
    
    ctx.restore();
  }

  function renderBarkTexture(ctx, structure, colors, furrowWidth, roughness, variation, scale) {
    ctx.save();
    
    const bounds = getBounds(structure);
    const furrowCount = Math.floor(roughness * variation * 12);
    
    for (let f = 0; f < furrowCount; f++) {
      const furrowAngle = (f / furrowCount) * Math.PI * 2;
      const furrowLength = scale * (0.1 + variation * 0.15);
      const furrowDepth = furrowWidth * 3;
      
      // Furrow start position (on bark surface)
      const startRadius = bounds.width / 2 * (0.7 + Math.sin(furrowAngle * 3) * 0.2);
      const startX = bounds.centerX + Math.cos(furrowAngle) * startRadius;
      const startY = bounds.centerY + Math.sin(furrowAngle) * startRadius;
      
      // Furrow direction (radial outward with organic variation)
      const furrowDirX = Math.cos(furrowAngle + Math.sin(furrowAngle * 5) * variation * 0.3);
      const furrowDirY = Math.sin(furrowAngle + Math.sin(furrowAngle * 5) * variation * 0.3);
      
      ctx.globalAlpha = roughness * 0.8;
      ctx.strokeStyle = colors.furrow;
      ctx.lineWidth = furrowDepth;
      ctx.lineCap = 'round';
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(
        startX + furrowDirX * furrowLength,
        startY + furrowDirY * furrowLength
      );
      ctx.stroke();
      
      // Add ridge highlights
      ctx.globalAlpha = roughness * 0.4;
      ctx.strokeStyle = colors.ridge;
      ctx.lineWidth = furrowDepth * 0.3;
      
      ctx.beginPath();
      ctx.moveTo(
        startX - furrowDirY * furrowDepth * 0.5,
        startY + furrowDirX * furrowDepth * 0.5
      );
      ctx.lineTo(
        startX + furrowDirX * furrowLength - furrowDirY * furrowDepth * 0.5,
        startY + furrowDirY * furrowLength + furrowDirX * furrowDepth * 0.5
      );
      ctx.stroke();
    }
    
    ctx.restore();
  }

  function renderBranchMarks(ctx, structure, colors, branchStrength, characterStrength, age, scale) {
    ctx.save();
    
    const bounds = getBounds(structure);
    const markCount = Math.floor((branchStrength + characterStrength) * age * 6);
    
    for (let m = 0; m < markCount; m++) {
      const markAngle = Math.random() * Math.PI * 2;
      const markRadius = bounds.width / 2 * (0.6 + Math.random() * 0.3);
      const markX = bounds.centerX + Math.cos(markAngle) * markRadius;
      const markY = bounds.centerY + Math.sin(markAngle) * markRadius;
      
      if (Math.random() < branchStrength) {
        // Branch scar - circular
        const scarSize = scale * (0.02 + age * 0.03);
        ctx.globalAlpha = branchStrength * 0.8;
        ctx.fillStyle = colors.scar;
        ctx.beginPath();
        ctx.arc(markX, markY, scarSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Scar highlight
        ctx.globalAlpha = branchStrength * 0.4;
        ctx.fillStyle = colors.weathered;
        ctx.beginPath();
        ctx.arc(markX - scarSize * 0.3, markY - scarSize * 0.3, scarSize * 0.6, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Character mark - linear scratch/gouge
        const markLength = scale * (0.03 + characterStrength * 0.05);
        const markDirection = Math.random() * Math.PI * 2;
        
        ctx.globalAlpha = characterStrength * 0.7;
        ctx.strokeStyle = colors.scar;
        ctx.lineWidth = scale * 0.01;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(markX, markY);
        ctx.lineTo(
          markX + Math.cos(markDirection) * markLength,
          markY + Math.sin(markDirection) * markLength
        );
        ctx.stroke();
      }
    }
    
    ctx.restore();
  }

  function renderWeathering(ctx, structure, colors, weatheringLevel, age, scale) {
    ctx.save();
    
    const bounds = getBounds(structure);
    const weatherSpots = Math.floor(weatheringLevel * age * 15);
    
    for (let w = 0; w < weatherSpots; w++) {
      const spotX = bounds.minX + Math.random() * bounds.width;
      const spotY = bounds.minY + Math.random() * bounds.height;
      const spotSize = scale * (0.01 + Math.random() * 0.03);
      
      ctx.globalAlpha = weatheringLevel * 0.5;
      
      // Weathered spot
      ctx.fillStyle = colors.weathered;
      ctx.beginPath();
      ctx.arc(spotX, spotY, spotSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Small weathering streaks
      if (Math.random() < 0.3) {
        const streakLength = spotSize * 2;
        const streakAngle = Math.random() * Math.PI * 2;
        
        ctx.strokeStyle = colors.weathered;
        ctx.lineWidth = spotSize * 0.3;
        ctx.globalAlpha = weatheringLevel * 0.3;
        
        ctx.beginPath();
        ctx.moveTo(spotX, spotY);
        ctx.lineTo(
          spotX + Math.cos(streakAngle) * streakLength,
          spotY + Math.sin(streakAngle) * streakLength
        );
        ctx.stroke();
      }
    }
    
    ctx.restore();
  }

  function renderLichens(ctx, structure, colors, lichenLevel, variation, scale) {
    ctx.save();
    
    const bounds = getBounds(structure);
    const lichenPatches = Math.floor(lichenLevel * variation * 8);
    
    for (let l = 0; l < lichenPatches; l++) {
      const patchX = bounds.minX + Math.random() * bounds.width;
      const patchY = bounds.minY + Math.random() * bounds.height;
      const patchSize = scale * (0.015 + Math.random() * 0.025);
      
      ctx.globalAlpha = lichenLevel * (0.4 + Math.random() * 0.3);
      ctx.fillStyle = colors.lichen;
      
      // Organic lichen shape
      ctx.beginPath();
      for (let i = 0; i <= 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const radius = patchSize * (0.7 + Math.sin(angle * 3) * 0.3);
        const x = patchX + Math.cos(angle) * radius;
        const y = patchY + Math.sin(angle) * radius;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.fill();
    }
    
    ctx.restore();
  }

  function renderMoss(ctx, structure, colors, mossLevel, variation, scale) {
    ctx.save();
    
    const bounds = getBounds(structure);
    const mossCount = Math.floor(mossLevel * variation * 20);
    
    for (let m = 0; m < mossCount; m++) {
      const mossX = bounds.minX + Math.random() * bounds.width;
      const mossY = bounds.minY + Math.random() * bounds.height;
      const mossSize = scale * (0.005 + Math.random() * 0.015);
      
      ctx.globalAlpha = mossLevel * (0.3 + Math.random() * 0.4);
      ctx.fillStyle = colors.moss;
      
      // Small moss dots/clusters
      ctx.beginPath();
      ctx.arc(mossX, mossY, mossSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Occasional moss strands
      if (Math.random() < 0.2) {
        const strandLength = mossSize * 3;
        const strandAngle = Math.random() * Math.PI * 2;
        
        ctx.strokeStyle = colors.moss;
        ctx.lineWidth = mossSize * 0.3;
        ctx.globalAlpha = mossLevel * 0.5;
        
        ctx.beginPath();
        ctx.moveTo(mossX, mossY);
        ctx.lineTo(
          mossX + Math.cos(strandAngle) * strandLength,
          mossY + Math.sin(strandAngle) * strandLength
        );
        ctx.stroke();
      }
    }
    
    ctx.restore();
  }

  function renderInsectHoles(ctx, structure, colors, insectLevel, age, scale) {
    ctx.save();
    
    const bounds = getBounds(structure);
    const holeCount = Math.floor(insectLevel * age * 5);
    
    for (let h = 0; h < holeCount; h++) {
      const holeX = bounds.minX + Math.random() * bounds.width;
      const holeY = bounds.minY + Math.random() * bounds.height;
      const holeSize = scale * (0.008 + Math.random() * 0.015);
      
      ctx.globalAlpha = insectLevel * 0.9;
      
      // Dark hole
      ctx.fillStyle = colors.scar;
      ctx.beginPath();
      ctx.arc(holeX, holeY, holeSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Hole rim highlight
      ctx.globalAlpha = insectLevel * 0.4;
      ctx.strokeStyle = colors.ridge;
      ctx.lineWidth = holeSize * 0.2;
      ctx.beginPath();
      ctx.arc(holeX, holeY, holeSize * 1.2, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    ctx.restore();
  }

  function drawOrganicPath(ctx, points, roughness) {
    if (points.length < 3) return;
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    // Organic curves with natural flow
    for (let i = 1; i < points.length; i++) {
      const current = points[i];
      const previous = points[i - 1];
      const next = points[(i + 1) % points.length];
      
      // Natural organic flow with bark-specific roughness
      const organicFlow = current.organicFlow || 0.7;
      const textureRoughness = roughness * 0.2;
      
      const cp1x = previous.x + (current.x - (points[i - 2] || previous).x) * organicFlow * 0.2;
      const cp1y = previous.y + (current.y - (points[i - 2] || previous).y) * organicFlow * 0.2;
      const cp2x = current.x - (next.x - previous.x) * organicFlow * 0.2;
      const cp2y = current.y - (next.y - previous.y) * organicFlow * 0.2;
      
      // Add subtle texture roughness
      const roughX = (Math.random() - 0.5) * textureRoughness * 2;
      const roughY = (Math.random() - 0.5) * textureRoughness * 2;
      
      ctx.bezierCurveTo(
        cp1x + roughX, cp1y + roughY,
        cp2x + roughX, cp2y + roughY,
        current.x, current.y
      );
    }
    
    // Close the organic form with natural flow
    const first = points[0];
    const last = points[points.length - 1];
    const secondLast = points[points.length - 2];
    const second = points[1];
    
    const organicFlow = 0.7;
    const cp1x = last.x + (first.x - secondLast.x) * organicFlow * 0.2;
    const cp1y = last.y + (first.y - secondLast.y) * organicFlow * 0.2;
    const cp2x = first.x - (second.x - last.x) * organicFlow * 0.2;
    const cp2y = first.y - (second.y - last.y) * organicFlow * 0.2;
    
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

export { drawVisualization };

export const metadata = {
  name: "🌳 Organic Bark",
  description: "Natural wood textures with growth patterns, weathering, and organic character marks",
  defaultParams: {
    seed: "organic-bark-natural",
    frequency: 0.6,
    amplitude: 140,
    barkType: 1,
    growthComplexity: 0.7,
    naturalVariation: 0.8,
    organicFlow: 0.75,
    barkRoughness: 0.6,
    ridgeDepth: 0.4,
    furrowWidth: 0.3,
    growthRings: 0.5,
    branchMarks: 0.3,
    weathering: 0.4,
    lichens: 0.2,
    moss: 0.15,
    insects: 0.1,
    treeAge: 0.6,
    characterMarks: 0.3,
    woodHue: 25,
    weatheredTone: 0.6,
    naturalSaturation: 0.5
  }
};

export const id = 'organic-bark';
export const name = "🌳 Organic Bark";
export const description = "Natural wood textures with growth patterns, weathering, and organic character marks";
export const defaultParams = {
  seed: "organic-bark-natural",
  frequency: 0.6,
  amplitude: 140,
  barkType: 1,
  growthComplexity: 0.7,
  naturalVariation: 0.8,
  organicFlow: 0.75,
  barkRoughness: 0.6,
  ridgeDepth: 0.4,
  furrowWidth: 0.3,
  growthRings: 0.5,
  branchMarks: 0.3,
  weathering: 0.4,
  lichens: 0.2,
  moss: 0.15,
  insects: 0.1,
  treeAge: 0.6,
  characterMarks: 0.3,
  woodHue: 25,
  weatheredTone: 0.6,
  naturalSaturation: 0.5
};

export const code = `// 🌳 Organic Bark
const PARAMETERS = {
  // Universal Background Controls
  backgroundColor: { type: 'color', default: "#f8f5f0", label: 'Background Color', category: 'Background' },
  backgroundType: { type: 'select', options: [{"value":"transparent","label":"Transparent"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "gradient", label: 'Background Type', category: 'Background' },
  backgroundGradientStart: { type: 'color', default: "#faf8f5", label: 'Gradient Start', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientEnd: { type: 'color', default: "#f0ede0", label: 'Gradient End', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 45, label: 'Gradient Direction', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  
  // Universal Fill Controls
  fillType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "gradient", label: 'Fill Type', category: 'Fill' },
  fillColor: { type: 'color', default: "#8B4513", label: 'Fill Color', category: 'Fill', showIf: (params)=>params.fillType === 'solid' },
  fillGradientStart: { type: 'color', default: "#A0522D", label: 'Gradient Start', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientEnd: { type: 'color', default: "#654321", label: 'Gradient End', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 90, label: 'Gradient Direction', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.9, label: 'Fill Opacity', category: 'Fill', showIf: (params)=>params.fillType !== 'none' },
  
  // Universal Stroke Controls
  strokeType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid"},{"value":"dashed","label":"Dashed"},{"value":"dotted","label":"Dotted"}], default: "solid", label: 'Stroke Type', category: 'Stroke' },
  strokeColor: { type: 'color', default: "#3E2723", label: 'Stroke Color', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeWidth: { type: 'slider', min: 0, max: 10, step: 0.5, default: 1.5, label: 'Stroke Width', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.8, label: 'Stroke Opacity', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  
  // Core growth properties
  frequency: { type: 'slider', min: 0.2, max: 1.5, step: 0.05, default: 0.6, label: 'Growth Rhythm' },
  amplitude: { type: 'slider', min: 80, max: 200, step: 5, default: 140, label: 'Tree Scale' },
  
  // Bark type selector
  barkType: {
    type: 'slider',
    min: 0,
    max: 4,
    step: 1,
    default: 1,
    label: 'Bark Type (0=Oak, 1=Pine, 2=Birch, 3=Redwood, 4=Ancient)'
  },
  
  // Growth characteristics
  growthComplexity: { type: 'slider', min: 0.3, max: 1, step: 0.05, default: 0.7, label: 'Growth Complexity' },
  naturalVariation: { type: 'slider', min: 0.5, max: 1, step: 0.05, default: 0.8, label: 'Natural Variation' },
  organicFlow: { type: 'slider', min: 0.4, max: 1, step: 0.05, default: 0.75, label: 'Organic Flow' },
  
  // Bark texture properties
  barkRoughness: { type: 'slider', min: 0.2, max: 1, step: 0.05, default: 0.6, label: 'Bark Roughness' },
  ridgeDepth: { type: 'slider', min: 0.1, max: 0.8, step: 0.05, default: 0.4, label: 'Ridge Depth' },
  furrowWidth: { type: 'slider', min: 0.1, max: 0.6, step: 0.05, default: 0.3, label: 'Furrow Width' },
  
  // Tree aging and history
  growthRings: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.5, label: 'Growth Rings' },
  branchMarks: { type: 'slider', min: 0, max: 0.8, step: 0.05, default: 0.3, label: 'Branch Scars' },
  weathering: { type: 'slider', min: 0, max: 0.8, step: 0.05, default: 0.4, label: 'Weather Damage' },
  
  // Natural elements
  lichens: { type: 'slider', min: 0, max: 0.6, step: 0.05, default: 0.2, label: 'Lichen Growth' },
  moss: { type: 'slider', min: 0, max: 0.5, step: 0.05, default: 0.15, label: 'Moss Coverage' },
  insects: { type: 'slider', min: 0, max: 0.4, step: 0.05, default: 0.1, label: 'Insect Holes' },
  
  // Character and age
  treeAge: { type: 'slider', min: 0.3, max: 1, step: 0.05, default: 0.6, label: 'Tree Age' },
  characterMarks: { type: 'slider', min: 0, max: 0.8, step: 0.05, default: 0.3, label: 'Character Marks' },
  
  // Color properties
  woodHue: { type: 'slider', min: 0, max: 60, step: 5, default: 25, label: 'Wood Hue (Brown Spectrum)' },
  weatheredTone: { type: 'slider', min: 0.3, max: 1, step: 0.05, default: 0.6, label: 'Weathered Tone' },
  naturalSaturation: { type: 'slider', min: 0.3, max: 0.8, step: 0.05, default: 0.5, label: 'Natural Saturation' }
};

function applyUniversalBackground(ctx, width, height, params) {
  if (!params.backgroundType || params.backgroundType === 'transparent') return;
  
  if (params.backgroundType === 'solid') {
    ctx.fillStyle = params.backgroundColor || '#f8f5f0';
    ctx.fillRect(0, 0, width, height);
  } else if (params.backgroundType === 'gradient') {
    const direction = (params.backgroundGradientDirection || 45) * (Math.PI / 180);
    const x1 = width / 2 - Math.cos(direction) * width / 2;
    const y1 = height / 2 - Math.sin(direction) * height / 2;
    const x2 = width / 2 + Math.cos(direction) * width / 2;
    const y2 = height / 2 + Math.sin(direction) * height / 2;
    
    const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, params.backgroundGradientStart || '#faf8f5');
    gradient.addColorStop(0.5, '#f4f2e8');
    gradient.addColorStop(1, params.backgroundGradientEnd || '#f0ede0');
    
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
  const frequency = params.frequency || 0.6;
  const amplitude = params.amplitude || 140;
  const barkTypeNum = Math.round(params.barkType || 1);
  const growthComplexity = params.growthComplexity || 0.7;
  const naturalVariation = params.naturalVariation || 0.8;
  const organicFlow = params.organicFlow || 0.75;
  const barkRoughness = params.barkRoughness || 0.6;
  const ridgeDepth = params.ridgeDepth || 0.4;
  const furrowWidth = params.furrowWidth || 0.3;
  const growthRings = params.growthRings || 0.5;
  const branchMarks = params.branchMarks || 0.3;
  const weathering = params.weathering || 0.4;
  const lichens = params.lichens || 0.2;
  const moss = params.moss || 0.15;
  const insects = params.insects || 0.1;
  const treeAge = params.treeAge || 0.6;
  const characterMarks = params.characterMarks || 0.3;
  const woodHue = params.woodHue || 25;
  const weatheredTone = params.weatheredTone || 0.6;
  const naturalSaturation = params.naturalSaturation || 0.5;

  // Organic scaling with natural proportions
  const baseScale = Math.min(width, height) / 400;
  const scaledAmplitude = amplitude * baseScale;
  
  // Gentle organic movement (trees grow slowly!)
  const growthPhase = time * frequency * 0.3;
  const organicPulse = 1 + Math.sin(growthPhase) * 0.03; // Very subtle growth

  // Generate tree structure with organic growth patterns
  const treeStructure = generateOrganicTreeStructure(
    barkTypeNum, centerX, centerY, scaledAmplitude * organicPulse,
    growthComplexity, naturalVariation, organicFlow, treeAge, growthPhase
  );

  // Natural color palette based on bark type and weathering
  const barkColors = generateBarkColors(woodHue, weatheredTone, naturalSaturation, barkTypeNum, treeAge);

  // Render bark base structure
  renderBarkStructure(ctx, treeStructure, barkColors, barkRoughness, ridgeDepth, params);

  // Add growth ring patterns
  if (growthRings > 0.1) {
    renderGrowthRings(ctx, treeStructure, barkColors, growthRings, treeAge, scaledAmplitude);
  }

  // Add bark texture and furrows
  renderBarkTexture(ctx, treeStructure, barkColors, furrowWidth, barkRoughness, naturalVariation, scaledAmplitude);

  // Add branch scars and character marks
  if (branchMarks > 0.1 || characterMarks > 0.1) {
    renderBranchMarks(ctx, treeStructure, barkColors, branchMarks, characterMarks, treeAge, scaledAmplitude);
  }

  // Add weathering effects
  if (weathering > 0.1) {
    renderWeathering(ctx, treeStructure, barkColors, weathering, treeAge, scaledAmplitude);
  }

  // Add natural elements (lichens, moss, insects)
  if (lichens > 0.05) {
    renderLichens(ctx, treeStructure, barkColors, lichens, naturalVariation, scaledAmplitude);
  }

  if (moss > 0.05) {
    renderMoss(ctx, treeStructure, barkColors, moss, naturalVariation, scaledAmplitude);
  }

  if (insects > 0.05) {
    renderInsectHoles(ctx, treeStructure, barkColors, insects, treeAge, scaledAmplitude);
  }

  function generateOrganicTreeStructure(barkType, centerX, centerY, radius, complexity, variation, flow, age, phase) {
    const points = [];
    
    // Determine structure based on bark type
    const basePoints = Math.floor(6 + complexity * 12); // More complexity = more detailed structure
    
    for (let i = 0; i < basePoints; i++) {
      const t = i / basePoints;
      const angle = t * Math.PI * 2;
      
      let organicRadius = radius;
      
      // Generate bark-type specific organic patterns
      switch (barkType) {
        case 0: // Oak - irregular, deeply furrowed
          const oak1 = Math.sin(angle * 3 + phase) * variation * 0.15;
          const oak2 = Math.sin(angle * 7 + phase * 0.7) * complexity * 0.12;
          const oakFurrows = Math.floor(Math.sin(angle * 11 + phase) * 3) / 3 * flow * 0.1;
          organicRadius = radius * (0.85 + oak1 + oak2 + oakFurrows);
          break;
          
        case 1: // Pine - plated, scaly texture
          const pine1 = Math.sin(angle * 5 + phase) * variation * 0.1;
          const pine2 = Math.sin(angle * 9 + phase * 1.2) * complexity * 0.08;
          const pinePlates = Math.floor(Math.sin(angle * 13 + phase * 0.8) * 2) / 2 * flow * 0.08;
          organicRadius = radius * (0.88 + pine1 + pine2 + pinePlates);
          break;
          
        case 2: // Birch - smooth with horizontal marks
          const birch1 = Math.sin(angle * 2 + phase) * variation * 0.06;
          const birch2 = Math.sin(angle * 8 + phase * 0.9) * complexity * 0.05;
          const birchMarks = Math.sin(angle * 16 + phase) * flow * 0.04;
          organicRadius = radius * (0.92 + birch1 + birch2 + birchMarks);
          break;
          
        case 3: // Redwood - thick, fibrous
          const redwood1 = Math.sin(angle * 4 + phase) * variation * 0.12;
          const redwood2 = Math.sin(angle * 6 + phase * 1.1) * complexity * 0.1;
          const redwoodFibers = Math.floor(Math.sin(angle * 14 + phase * 1.3) * 4) / 4 * flow * 0.09;
          organicRadius = radius * (0.87 + redwood1 + redwood2 + redwoodFibers);
          break;
          
        case 4: // Ancient - gnarled, deeply characterized
          const ancient1 = Math.sin(angle * 6 + phase) * variation * 0.2;
          const ancient2 = Math.sin(angle * 10 + phase * 1.5) * complexity * 0.18;
          const ancientGnarls = Math.floor(Math.sin(angle * 17 + phase * 2) * 5) / 5 * flow * 0.15;
          organicRadius = radius * (0.8 + ancient1 + ancient2 + ancientGnarls);
          break;
      }
      
      // Apply age-related organic distortion
      const ageDistortion = Math.sin(angle * (3 + age * 5) + phase) * age * 0.1;
      const organicComplexity = Math.sin(angle * (8 + complexity * 7) + phase * flow) * complexity * 0.08;
      
      const finalRadius = organicRadius * (1 + ageDistortion + organicComplexity);
      
      points.push({
        x: centerX + Math.cos(angle) * finalRadius,
        y: centerY + Math.sin(angle) * finalRadius,
        angle: angle,
        radius: finalRadius,
        organicFlow: flow + Math.sin(angle * 4 + phase) * 0.3,
        textureDepth: complexity + Math.sin(angle * 6 + phase) * 0.2,
        weatheringLevel: Math.sin(angle * 3 + phase) * 0.5 + 0.5,
        growthDirection: Math.sin(angle * 2 + phase) * variation
      });
    }
    
    return points;
  }

  function generateBarkColors(hue, weathered, saturation, barkType, age) {
    const baseSaturation = saturation * 100;
    const baseLightness = 35 + weathered * 25;
    
    // Bark type affects color characteristics
    const barkAdjustments = [
      { hueShift: 0, satMult: 1.0, lightMult: 1.0 },   // Oak - standard brown
      { hueShift: 5, satMult: 0.8, lightMult: 1.1 },   // Pine - slightly lighter, less saturated
      { hueShift: -10, satMult: 0.3, lightMult: 1.8 }, // Birch - much lighter, desaturated
      { hueShift: 10, satMult: 1.2, lightMult: 0.8 },  // Redwood - reddish, darker
      { hueShift: -5, satMult: 0.6, lightMult: 0.6 }   // Ancient - darker, weathered
    ];
    
    const adjustment = barkAdjustments[barkType] || barkAdjustments[0];
    const adjustedHue = hue + adjustment.hueShift;
    const adjustedSat = baseSaturation * adjustment.satMult;
    const adjustedLight = baseLightness * adjustment.lightMult;
    
    // Age affects coloration
    const ageShift = age * 0.8; // Older = slightly more weathered tones
    
    return {
      base: \`hsl(\${adjustedHue}, \${adjustedSat}%, \${adjustedLight}%)\`,
      light: \`hsl(\${adjustedHue}, \${adjustedSat * 0.8}%, \${Math.min(adjustedLight + 15 + ageShift * 10, 85)}%)\`,
      dark: \`hsl(\${adjustedHue}, \${adjustedSat * 1.2}%, \${adjustedLight - 15 - ageShift * 5}%)\`,
      ridge: \`hsl(\${adjustedHue - 3}, \${adjustedSat * 0.9}%, \${adjustedLight - 8}%)\`,
      furrow: \`hsl(\${adjustedHue + 2}, \${adjustedSat * 1.1}%, \${adjustedLight - 20}%)\`,
      weathered: \`hsl(\${adjustedHue + 5}, \${adjustedSat * 0.7}%, \${adjustedLight + 8}%)\`,
      lichen: \`hsl(120, 40%, 65%)\`, // Greenish for lichens
      moss: \`hsl(100, 60%, 45%)\`,   // Deeper green for moss
      scar: \`hsl(\${adjustedHue - 8}, \${adjustedSat * 0.6}%, \${adjustedLight - 25}%)\`
    };
  }

  function renderBarkStructure(ctx, structure, colors, roughness, depth, params) {
    ctx.save();
    
    // Main bark body
    const bounds = getBounds(structure);
    
    // Apply universal fill/stroke
    drawOrganicPath(ctx, structure, roughness);
    
    // Apply universal fill
    if (params.fillType && params.fillType !== 'none') {
      ctx.save();
      ctx.globalAlpha = params.fillOpacity || 0.9;
      
      if (params.fillType === 'solid') {
        ctx.fillStyle = params.fillColor || colors.base;
      } else if (params.fillType === 'gradient') {
        const direction = (params.fillGradientDirection || 90) * (Math.PI / 180);
        const x1 = bounds.centerX - Math.cos(direction) * bounds.width / 2;
        const y1 = bounds.centerY - Math.sin(direction) * bounds.height / 2;
        const x2 = bounds.centerX + Math.cos(direction) * bounds.width / 2;
        const y2 = bounds.centerY + Math.sin(direction) * bounds.height / 2;
        
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, params.fillGradientStart || colors.light);
        gradient.addColorStop(0.3, colors.base);
        gradient.addColorStop(0.7, colors.ridge);
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
      ctx.lineWidth = params.strokeWidth || (1 + depth * 3);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
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

  function renderGrowthRings(ctx, structure, colors, ringStrength, age, scale) {
    ctx.save();
    ctx.globalAlpha = ringStrength * 0.6;
    
    const bounds = getBounds(structure);
    const ringCount = Math.floor(age * 8 + 3); // More rings with age
    
    for (let r = 1; r <= ringCount; r++) {
      const ringRadius = (bounds.width / 2) * (r / ringCount) * 0.8;
      const ringAlpha = (1 - r / ringCount) * ringStrength;
      
      ctx.globalAlpha = ringAlpha * 0.4;
      ctx.strokeStyle = colors.ridge;
      ctx.lineWidth = 0.5 + age;
      
      // Organic ring shape (not perfect circles)
      ctx.beginPath();
      for (let i = 0; i <= 64; i++) {
        const angle = (i / 64) * Math.PI * 2;
        const organicVariation = Math.sin(angle * 3 + r) * scale * 0.02;
        const radius = ringRadius + organicVariation;
        const x = bounds.centerX + Math.cos(angle) * radius;
        const y = bounds.centerY + Math.sin(angle) * radius;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.stroke();
    }
    
    ctx.restore();
  }

  function renderBarkTexture(ctx, structure, colors, furrowWidth, roughness, variation, scale) {
    ctx.save();
    
    const bounds = getBounds(structure);
    const furrowCount = Math.floor(roughness * variation * 12);
    
    for (let f = 0; f < furrowCount; f++) {
      const furrowAngle = (f / furrowCount) * Math.PI * 2;
      const furrowLength = scale * (0.1 + variation * 0.15);
      const furrowDepth = furrowWidth * 3;
      
      // Furrow start position (on bark surface)
      const startRadius = bounds.width / 2 * (0.7 + Math.sin(furrowAngle * 3) * 0.2);
      const startX = bounds.centerX + Math.cos(furrowAngle) * startRadius;
      const startY = bounds.centerY + Math.sin(furrowAngle) * startRadius;
      
      // Furrow direction (radial outward with organic variation)
      const furrowDirX = Math.cos(furrowAngle + Math.sin(furrowAngle * 5) * variation * 0.3);
      const furrowDirY = Math.sin(furrowAngle + Math.sin(furrowAngle * 5) * variation * 0.3);
      
      ctx.globalAlpha = roughness * 0.8;
      ctx.strokeStyle = colors.furrow;
      ctx.lineWidth = furrowDepth;
      ctx.lineCap = 'round';
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(
        startX + furrowDirX * furrowLength,
        startY + furrowDirY * furrowLength
      );
      ctx.stroke();
      
      // Add ridge highlights
      ctx.globalAlpha = roughness * 0.4;
      ctx.strokeStyle = colors.ridge;
      ctx.lineWidth = furrowDepth * 0.3;
      
      ctx.beginPath();
      ctx.moveTo(
        startX - furrowDirY * furrowDepth * 0.5,
        startY + furrowDirX * furrowDepth * 0.5
      );
      ctx.lineTo(
        startX + furrowDirX * furrowLength - furrowDirY * furrowDepth * 0.5,
        startY + furrowDirY * furrowLength + furrowDirX * furrowDepth * 0.5
      );
      ctx.stroke();
    }
    
    ctx.restore();
  }

  function renderBranchMarks(ctx, structure, colors, branchStrength, characterStrength, age, scale) {
    ctx.save();
    
    const bounds = getBounds(structure);
    const markCount = Math.floor((branchStrength + characterStrength) * age * 6);
    
    for (let m = 0; m < markCount; m++) {
      const markAngle = Math.random() * Math.PI * 2;
      const markRadius = bounds.width / 2 * (0.6 + Math.random() * 0.3);
      const markX = bounds.centerX + Math.cos(markAngle) * markRadius;
      const markY = bounds.centerY + Math.sin(markAngle) * markRadius;
      
      if (Math.random() < branchStrength) {
        // Branch scar - circular
        const scarSize = scale * (0.02 + age * 0.03);
        ctx.globalAlpha = branchStrength * 0.8;
        ctx.fillStyle = colors.scar;
        ctx.beginPath();
        ctx.arc(markX, markY, scarSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Scar highlight
        ctx.globalAlpha = branchStrength * 0.4;
        ctx.fillStyle = colors.weathered;
        ctx.beginPath();
        ctx.arc(markX - scarSize * 0.3, markY - scarSize * 0.3, scarSize * 0.6, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Character mark - linear scratch/gouge
        const markLength = scale * (0.03 + characterStrength * 0.05);
        const markDirection = Math.random() * Math.PI * 2;
        
        ctx.globalAlpha = characterStrength * 0.7;
        ctx.strokeStyle = colors.scar;
        ctx.lineWidth = scale * 0.01;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(markX, markY);
        ctx.lineTo(
          markX + Math.cos(markDirection) * markLength,
          markY + Math.sin(markDirection) * markLength
        );
        ctx.stroke();
      }
    }
    
    ctx.restore();
  }

  function renderWeathering(ctx, structure, colors, weatheringLevel, age, scale) {
    ctx.save();
    
    const bounds = getBounds(structure);
    const weatherSpots = Math.floor(weatheringLevel * age * 15);
    
    for (let w = 0; w < weatherSpots; w++) {
      const spotX = bounds.minX + Math.random() * bounds.width;
      const spotY = bounds.minY + Math.random() * bounds.height;
      const spotSize = scale * (0.01 + Math.random() * 0.03);
      
      ctx.globalAlpha = weatheringLevel * 0.5;
      
      // Weathered spot
      ctx.fillStyle = colors.weathered;
      ctx.beginPath();
      ctx.arc(spotX, spotY, spotSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Small weathering streaks
      if (Math.random() < 0.3) {
        const streakLength = spotSize * 2;
        const streakAngle = Math.random() * Math.PI * 2;
        
        ctx.strokeStyle = colors.weathered;
        ctx.lineWidth = spotSize * 0.3;
        ctx.globalAlpha = weatheringLevel * 0.3;
        
        ctx.beginPath();
        ctx.moveTo(spotX, spotY);
        ctx.lineTo(
          spotX + Math.cos(streakAngle) * streakLength,
          spotY + Math.sin(streakAngle) * streakLength
        );
        ctx.stroke();
      }
    }
    
    ctx.restore();
  }

  function renderLichens(ctx, structure, colors, lichenLevel, variation, scale) {
    ctx.save();
    
    const bounds = getBounds(structure);
    const lichenPatches = Math.floor(lichenLevel * variation * 8);
    
    for (let l = 0; l < lichenPatches; l++) {
      const patchX = bounds.minX + Math.random() * bounds.width;
      const patchY = bounds.minY + Math.random() * bounds.height;
      const patchSize = scale * (0.015 + Math.random() * 0.025);
      
      ctx.globalAlpha = lichenLevel * (0.4 + Math.random() * 0.3);
      ctx.fillStyle = colors.lichen;
      
      // Organic lichen shape
      ctx.beginPath();
      for (let i = 0; i <= 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const radius = patchSize * (0.7 + Math.sin(angle * 3) * 0.3);
        const x = patchX + Math.cos(angle) * radius;
        const y = patchY + Math.sin(angle) * radius;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.fill();
    }
    
    ctx.restore();
  }

  function renderMoss(ctx, structure, colors, mossLevel, variation, scale) {
    ctx.save();
    
    const bounds = getBounds(structure);
    const mossCount = Math.floor(mossLevel * variation * 20);
    
    for (let m = 0; m < mossCount; m++) {
      const mossX = bounds.minX + Math.random() * bounds.width;
      const mossY = bounds.minY + Math.random() * bounds.height;
      const mossSize = scale * (0.005 + Math.random() * 0.015);
      
      ctx.globalAlpha = mossLevel * (0.3 + Math.random() * 0.4);
      ctx.fillStyle = colors.moss;
      
      // Small moss dots/clusters
      ctx.beginPath();
      ctx.arc(mossX, mossY, mossSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Occasional moss strands
      if (Math.random() < 0.2) {
        const strandLength = mossSize * 3;
        const strandAngle = Math.random() * Math.PI * 2;
        
        ctx.strokeStyle = colors.moss;
        ctx.lineWidth = mossSize * 0.3;
        ctx.globalAlpha = mossLevel * 0.5;
        
        ctx.beginPath();
        ctx.moveTo(mossX, mossY);
        ctx.lineTo(
          mossX + Math.cos(strandAngle) * strandLength,
          mossY + Math.sin(strandAngle) * strandLength
        );
        ctx.stroke();
      }
    }
    
    ctx.restore();
  }

  function renderInsectHoles(ctx, structure, colors, insectLevel, age, scale) {
    ctx.save();
    
    const bounds = getBounds(structure);
    const holeCount = Math.floor(insectLevel * age * 5);
    
    for (let h = 0; h < holeCount; h++) {
      const holeX = bounds.minX + Math.random() * bounds.width;
      const holeY = bounds.minY + Math.random() * bounds.height;
      const holeSize = scale * (0.008 + Math.random() * 0.015);
      
      ctx.globalAlpha = insectLevel * 0.9;
      
      // Dark hole
      ctx.fillStyle = colors.scar;
      ctx.beginPath();
      ctx.arc(holeX, holeY, holeSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Hole rim highlight
      ctx.globalAlpha = insectLevel * 0.4;
      ctx.strokeStyle = colors.ridge;
      ctx.lineWidth = holeSize * 0.2;
      ctx.beginPath();
      ctx.arc(holeX, holeY, holeSize * 1.2, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    ctx.restore();
  }

  function drawOrganicPath(ctx, points, roughness) {
    if (points.length < 3) return;
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    // Organic curves with natural flow
    for (let i = 1; i < points.length; i++) {
      const current = points[i];
      const previous = points[i - 1];
      const next = points[(i + 1) % points.length];
      
      // Natural organic flow with bark-specific roughness
      const organicFlow = current.organicFlow || 0.7;
      const textureRoughness = roughness * 0.2;
      
      const cp1x = previous.x + (current.x - (points[i - 2] || previous).x) * organicFlow * 0.2;
      const cp1y = previous.y + (current.y - (points[i - 2] || previous).y) * organicFlow * 0.2;
      const cp2x = current.x - (next.x - previous.x) * organicFlow * 0.2;
      const cp2y = current.y - (next.y - previous.y) * organicFlow * 0.2;
      
      // Add subtle texture roughness
      const roughX = (Math.random() - 0.5) * textureRoughness * 2;
      const roughY = (Math.random() - 0.5) * textureRoughness * 2;
      
      ctx.bezierCurveTo(
        cp1x + roughX, cp1y + roughY,
        cp2x + roughX, cp2y + roughY,
        current.x, current.y
      );
    }
    
    // Close the organic form with natural flow
    const first = points[0];
    const last = points[points.length - 1];
    const secondLast = points[points.length - 2];
    const second = points[1];
    
    const organicFlow = 0.7;
    const cp1x = last.x + (first.x - secondLast.x) * organicFlow * 0.2;
    const cp1y = last.y + (first.y - secondLast.y) * organicFlow * 0.2;
    const cp2x = first.x - (second.x - last.x) * organicFlow * 0.2;
    const cp2y = first.y - (second.y - last.y) * organicFlow * 0.2;
    
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

export { drawVisualization };

export const metadata = {
  name: "🌳 Organic Bark",
  description: "Natural wood textures with growth patterns, weathering, and organic character marks",
  defaultParams: {
    seed: "organic-bark-natural",
    frequency: 0.6,
    amplitude: 140,
    barkType: 1,
    growthComplexity: 0.7,
    naturalVariation: 0.8,
    organicFlow: 0.75,
    barkRoughness: 0.6,
    ridgeDepth: 0.4,
    furrowWidth: 0.3,
    growthRings: 0.5,
    branchMarks: 0.3,
    weathering: 0.4,
    lichens: 0.2,
    moss: 0.15,
    insects: 0.1,
    treeAge: 0.6,
    characterMarks: 0.3,
    woodHue: 25,
    weatheredTone: 0.6,
    naturalSaturation: 0.5
  }
};

export const id = 'organic-bark';
export const name = "🌳 Organic Bark";
export const description = "Natural wood textures with growth patterns, weathering, and organic character marks";
export const defaultParams = {
  seed: "organic-bark-natural",
  frequency: 0.6,
  amplitude: 140,
  barkType: 1,
  growthComplexity: 0.7,
  naturalVariation: 0.8,
  organicFlow: 0.75,
  barkRoughness: 0.6,
  ridgeDepth: 0.4,
  furrowWidth: 0.3,
  growthRings: 0.5,
  branchMarks: 0.3,
  weathering: 0.4,
  lichens: 0.2,
  moss: 0.15,
  insects: 0.1,
  treeAge: 0.6,
  characterMarks: 0.3,
  woodHue: 25,
  weatheredTone: 0.6,
  naturalSaturation: 0.5
};`;