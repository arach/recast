import type { ParameterDefinition, PresetMetadata } from './types';

// Organic Bark - Natural wood textures with growth patterns for environmental/artisan brands
export const parameters: Record<string, ParameterDefinition> = {
  // Core organic properties
  frequency: { type: 'slider', min: 0.2, max: 1.2, step: 0.05, default: 0.6, label: 'Growth Rhythm' },
  amplitude: { type: 'slider', min: 80, max: 200, step: 5, default: 140, label: 'Bark Scale' },
  
  // Bark texture type
  barkType: {
    type: 'slider',
    min: 0,
    max: 4,
    step: 1,
    default: 1,
    label: 'Bark Type (0=Oak, 1=Pine, 2=Birch, 3=Redwood, 4=Ancient)'
  },
  
  // Organic growth characteristics
  growthComplexity: { type: 'slider', min: 0.3, max: 1, step: 0.05, default: 0.7, label: 'Growth Complexity' },
  naturalVariation: { type: 'slider', min: 0.4, max: 1, step: 0.05, default: 0.8, label: 'Natural Variation' },
  organicFlow: { type: 'slider', min: 0.5, max: 1, step: 0.05, default: 0.75, label: 'Organic Flow' },
  
  // Surface texture
  barkRoughness: { type: 'slider', min: 0.2, max: 1, step: 0.05, default: 0.6, label: 'Bark Roughness' },
  ridgeDepth: { type: 'slider', min: 0.1, max: 0.8, step: 0.05, default: 0.4, label: 'Ridge Depth' },
  furrowWidth: { type: 'slider', min: 0.1, max: 0.6, step: 0.05, default: 0.3, label: 'Furrow Width' },
  
  // Growth patterns
  growthRings: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.5, label: 'Growth Ring Visibility' },
  branchMarks: { type: 'slider', min: 0, max: 0.8, step: 0.05, default: 0.3, label: 'Branch Scar Marks' },
  weathering: { type: 'slider', min: 0, max: 0.7, step: 0.05, default: 0.4, label: 'Weather Weathering' },
  
  // Natural effects
  lichens: { type: 'slider', min: 0, max: 0.5, step: 0.05, default: 0.2, label: 'Lichen Growth' },
  moss: { type: 'slider', min: 0, max: 0.4, step: 0.05, default: 0.15, label: 'Moss Patches' },
  insects: { type: 'slider', min: 0, max: 0.3, step: 0.02, default: 0.1, label: 'Insect Holes' },
  
  // Age and character
  treeAge: { type: 'slider', min: 0.2, max: 1, step: 0.05, default: 0.6, label: 'Tree Age/Maturity' },
  characterMarks: { type: 'slider', min: 0, max: 0.6, step: 0.05, default: 0.3, label: 'Character Marks' },
  
  // Color and material
  woodHue: { type: 'slider', min: 0, max: 60, step: 5, default: 25, label: 'Wood Hue' },
  weatheredTone: { type: 'slider', min: 0.3, max: 0.9, step: 0.05, default: 0.6, label: 'Weathered Tone' },
  naturalSaturation: { type: 'slider', min: 0.3, max: 0.8, step: 0.05, default: 0.5, label: 'Natural Saturation' }
};

export function draw(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, any>,
  generator: any,
  time: number
) {
  // Natural forest background
  const bgGradient = ctx.createLinearGradient(0, 0, width, height);
  bgGradient.addColorStop(0, '#f8f6f0');
  bgGradient.addColorStop(0.5, '#f4f2e8');
  bgGradient.addColorStop(1, '#f0ede0');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

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
  const baseScale = Math.min(width, height) / 360;
  const scaledAmplitude = amplitude * baseScale;
  
  // Organic growth with seasonal variation
  const growthPhase = time * frequency * 0.8;
  const seasonalPulse = 1 + Math.sin(growthPhase * 0.3) * 0.04; // Slow seasonal growth

  // Generate organic bark structure
  const barkStructure = generateBarkStructure(
    barkTypeNum, centerX, centerY, scaledAmplitude * seasonalPulse,
    growthComplexity, naturalVariation, organicFlow, treeAge, growthPhase
  );

  // Bark color system
  const barkColors = generateBarkColors(woodHue, weatheredTone, naturalSaturation, treeAge);

  // Render growth rings (background texture)
  if (growthRings > 0.1) {
    renderGrowthRings(ctx, barkStructure, barkColors, growthRings, treeAge, scaledAmplitude);
  }

  // Render main bark texture
  renderBarkTexture(ctx, barkStructure, barkColors, barkRoughness, ridgeDepth, furrowWidth);

  // Render bark ridges and furrows
  renderBarkSurface(ctx, barkStructure, barkColors, ridgeDepth, furrowWidth, naturalVariation);

  // Render weathering effects
  if (weathering > 0.1) {
    renderWeathering(ctx, barkStructure, barkColors, weathering, time, scaledAmplitude);
  }

  // Render branch scars
  if (branchMarks > 0.1) {
    renderBranchScars(ctx, barkStructure, barkColors, branchMarks, treeAge, scaledAmplitude);
  }

  // Render natural growth (lichens and moss)
  if (lichens > 0.05) {
    renderLichenGrowth(ctx, barkStructure, barkColors, lichens, time, scaledAmplitude);
  }

  if (moss > 0.05) {
    renderMossPatches(ctx, barkStructure, barkColors, moss, time, scaledAmplitude);
  }

  // Render character marks and insect activity
  if (characterMarks > 0.1) {
    renderCharacterMarks(ctx, barkStructure, barkColors, characterMarks, insects, scaledAmplitude);
  }

  function generateBarkStructure(barkType: number, centerX: number, centerY: number, radius: number, complexity: number, variation: number, flow: number, age: number, phase: number) {
    const points = [];
    const basePoints = Math.floor(12 + complexity * 20); // 12-32 points for organic detail
    
    for (let i = 0; i < basePoints; i++) {
      const t = i / basePoints;
      const angle = t * Math.PI * 2;
      
      let barkRadius = radius;
      
      // Generate bark-type specific geometry
      switch (barkType) {
        case 0: // Oak - deep furrows, irregular
          const oak1 = Math.sin(angle * 7 + phase) * variation * 0.3;
          const oak2 = Math.sin(angle * 13 + phase * 1.3) * complexity * 0.15;
          const oak3 = Math.sin(angle * 19 + phase * 0.7) * flow * 0.1;
          barkRadius = radius * (0.75 + oak1 + oak2 + oak3);
          break;
          
        case 1: // Pine - scaly, plated texture
          const pine1 = Math.sin(angle * 11 + phase) * variation * 0.25;
          const pine2 = Math.sin(angle * 17 + phase * 1.5) * complexity * 0.12;
          const pineScale = Math.floor(Math.sin(angle * 23 + phase * 2) * 3) / 3 * variation * 0.08;
          barkRadius = radius * (0.8 + pine1 + pine2 + pineScale);
          break;
          
        case 2: // Birch - smooth with horizontal lines
          const birch1 = Math.sin(angle * 5 + phase) * variation * 0.15;
          const birch2 = Math.sin(angle * 29 + phase * 0.5) * complexity * 0.08;
          const birchLines = Math.sin(angle * 41 + phase * 1.8) * flow * 0.06;
          barkRadius = radius * (0.9 + birch1 + birch2 + birchLines);
          break;
          
        case 3: // Redwood - fibrous, vertical ridges
          const redwood1 = Math.sin(angle * 3 + phase) * variation * 0.35;
          const redwood2 = Math.sin(angle * 9 + phase * 0.8) * complexity * 0.18;
          const redwoodFiber = Math.sin(angle * 31 + phase * 2.2) * flow * 0.12;
          barkRadius = radius * (0.7 + redwood1 + redwood2 + redwoodFiber);
          break;
          
        case 4: // Ancient - gnarled, complex, aged
          const ancient1 = Math.sin(angle * 8 + phase) * variation * 0.4;
          const ancient2 = Math.sin(angle * 14 + phase * 1.7) * complexity * 0.25;
          const ancient3 = Math.sin(angle * 22 + phase * 0.9) * flow * 0.15;
          const ancientGnarl = Math.sin(angle * 37 + phase * 2.5) * age * 0.2;
          barkRadius = radius * (0.6 + ancient1 + ancient2 + ancient3 + ancientGnarl);
          break;
      }
      
      // Add natural organic variation
      const organicVariation = Math.sin(angle * 16 + phase * 1.4) * variation * 0.1;
      const flowVariation = Math.sin(angle * 12 + phase * flow) * flow * 0.08;
      const ageVariation = (1 - age) * Math.sin(angle * 6 + phase * 0.6) * 0.05;
      
      const finalRadius = barkRadius * (1 + organicVariation + flowVariation + ageVariation);
      
      points.push({
        x: centerX + Math.cos(angle) * finalRadius,
        y: centerY + Math.sin(angle) * finalRadius,
        angle: angle,
        radius: finalRadius,
        roughness: 0.3 + Math.sin(angle * 7 + phase) * 0.7,
        growth: 0.2 + Math.sin(angle * 5 + phase * 0.4) * 0.8,
        weatherPattern: Math.sin(angle * 11 + phase * 1.2),
        textureDepth: complexity + Math.sin(angle * 3) * 0.2
      });
    }
    
    return points;
  }

  function generateBarkColors(hue: number, weathered: number, saturation: number, age: number) {
    const baseSaturation = saturation * 40; // Natural wood has low saturation
    const baseLightness = 30 + weathered * 35; // Weathered wood is lighter
    const ageAdjustment = age * 0.8; // Older wood is darker
    
    return {
      primary: `hsl(${hue}, ${baseSaturation}%, ${baseLightness - ageAdjustment * 10}%)`,
      light: `hsl(${hue}, ${baseSaturation * 0.7}%, ${baseLightness + 20}%)`,
      dark: `hsl(${hue}, ${baseSaturation * 1.3}%, ${baseLightness - 25 - ageAdjustment * 5}%)`,
      weathered: `hsl(${hue + 10}, ${baseSaturation * 0.5}%, ${baseLightness + 15}%)`,
      lichen: `hsl(${90}, 30%, 45%)`, // Greenish lichen
      moss: `hsl(${110}, 40%, 35%)`, // Deeper green moss
      growth: `hsl(${hue - 5}, ${baseSaturation * 0.8}%, ${baseLightness - 10}%)`
    };
  }

  function renderGrowthRings(ctx: CanvasRenderingContext2D, structure: any[], colors: any, rings: number, age: number, scale: number) {
    ctx.save();
    ctx.globalAlpha = rings * 0.3;
    ctx.strokeStyle = colors.growth;
    ctx.lineWidth = 0.5;
    
    const bounds = getBounds(structure);
    const ringCount = Math.floor(age * 12); // More rings for older trees
    
    for (let r = 0; r < ringCount; r++) {
      const ringRadius = scale * (0.3 + r * 0.08);
      const ringVariation = Math.sin(r * 0.7) * scale * 0.05;
      
      ctx.beginPath();
      
      // Irregular growth rings
      for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
        const radius = ringRadius + ringVariation * Math.sin(angle * 3);
        const x = bounds.centerX + Math.cos(angle) * radius;
        const y = bounds.centerY + Math.sin(angle) * radius;
        
        if (angle === 0) {
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

  function renderBarkTexture(ctx: CanvasRenderingContext2D, structure: any[], colors: any, roughness: number, ridgeDepth: number, furrowWidth: number) {
    ctx.save();
    
    // Main bark body with textured gradient
    const bounds = getBounds(structure);
    const barkGradient = ctx.createRadialGradient(
      bounds.centerX - bounds.width * 0.3, bounds.centerY - bounds.height * 0.3, 0,
      bounds.centerX, bounds.centerY, Math.max(bounds.width, bounds.height) * 0.8
    );
    
    barkGradient.addColorStop(0, colors.light);
    barkGradient.addColorStop(0.4, colors.primary);
    barkGradient.addColorStop(0.8, colors.dark);
    barkGradient.addColorStop(1, colors.growth);
    
    ctx.fillStyle = barkGradient;
    drawBarkPath(ctx, structure, roughness);
    ctx.fill();
    
    // Bark edge with natural irregularity
    ctx.strokeStyle = colors.dark;
    ctx.lineWidth = 1.5 + roughness * 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    drawBarkPath(ctx, structure, roughness);
    ctx.stroke();
    
    ctx.restore();
  }

  function renderBarkSurface(ctx: CanvasRenderingContext2D, structure: any[], colors: any, ridgeDepth: number, furrowWidth: number, variation: number) {
    ctx.save();
    
    for (let i = 0; i < structure.length; i++) {
      const current = structure[i];
      const next = structure[(i + 1) % structure.length];
      
      if (current.roughness > 0.5) {
        ctx.globalAlpha = current.roughness * ridgeDepth * 0.6;
        
        // Ridge highlight
        ctx.strokeStyle = colors.light;
        ctx.lineWidth = 1 + variation;
        ctx.beginPath();
        ctx.moveTo(current.x, current.y);
        ctx.lineTo(next.x, next.y);
        ctx.stroke();
        
        // Furrow shadow
        ctx.globalAlpha = current.textureDepth * furrowWidth * 0.4;
        ctx.strokeStyle = colors.dark;
        ctx.lineWidth = furrowWidth * 3;
        
        const furrowOffset = furrowWidth * 5;
        const furrowX1 = current.x + Math.cos(current.angle + Math.PI/2) * furrowOffset;
        const furrowY1 = current.y + Math.sin(current.angle + Math.PI/2) * furrowOffset;
        const furrowX2 = next.x + Math.cos(next.angle + Math.PI/2) * furrowOffset;
        const furrowY2 = next.y + Math.sin(next.angle + Math.PI/2) * furrowOffset;
        
        ctx.beginPath();
        ctx.moveTo(furrowX1, furrowY1);
        ctx.lineTo(furrowX2, furrowY2);
        ctx.stroke();
      }
    }
    
    ctx.restore();
  }

  function renderWeathering(ctx: CanvasRenderingContext2D, structure: any[], colors: any, weathering: number, time: number, scale: number) {
    ctx.save();
    ctx.globalAlpha = weathering * 0.4;
    
    const weatherCount = Math.floor(weathering * 15);
    
    for (let w = 0; w < weatherCount; w++) {
      const weatherPhase = time * 0.3 + w * 0.9;
      const weatherLife = (Math.sin(weatherPhase) + 1) / 2;
      
      if (weatherLife > 0.2) {
        const angle = (w / weatherCount) * Math.PI * 2 + time * 0.1;
        const distance = scale * (0.6 + Math.sin(weatherPhase * 1.2) * 0.3);
        const weatherX = structure[0].x + Math.cos(angle) * distance;
        const weatherY = structure[0].y + Math.sin(angle) * distance;
        const weatherSize = scale * 0.08 * weatherLife;
        
        // Weathered spot
        const weatherGradient = ctx.createRadialGradient(
          weatherX, weatherY, 0,
          weatherX, weatherY, weatherSize
        );
        weatherGradient.addColorStop(0, colors.weathered);
        weatherGradient.addColorStop(0.7, colors.light);
        weatherGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = weatherGradient;
        ctx.beginPath();
        ctx.arc(weatherX, weatherY, weatherSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    ctx.restore();
  }

  function renderBranchScars(ctx: CanvasRenderingContext2D, structure: any[], colors: any, branchMarks: number, age: number, scale: number) {
    ctx.save();
    ctx.globalAlpha = branchMarks * age * 0.5;
    
    const branchCount = Math.floor(branchMarks * age * 8);
    
    for (let b = 0; b < branchCount; b++) {
      const branchAngle = (b / branchCount) * Math.PI * 2;
      const distance = scale * (0.4 + Math.random() * 0.4);
      const branchX = structure[0].x + Math.cos(branchAngle) * distance;
      const branchY = structure[0].y + Math.sin(branchAngle) * distance;
      const scarSize = scale * (0.02 + Math.random() * 0.04);
      
      // Branch scar (slightly oval)
      ctx.fillStyle = colors.dark;
      ctx.save();
      ctx.translate(branchX, branchY);
      ctx.rotate(branchAngle);
      ctx.scale(1, 0.6); // Make oval
      ctx.beginPath();
      ctx.arc(0, 0, scarSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      
      // Scar rim
      ctx.strokeStyle = colors.growth;
      ctx.lineWidth = 0.5;
      ctx.save();
      ctx.translate(branchX, branchY);
      ctx.rotate(branchAngle);
      ctx.scale(1, 0.6);
      ctx.beginPath();
      ctx.arc(0, 0, scarSize * 1.3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    
    ctx.restore();
  }

  function renderLichenGrowth(ctx: CanvasRenderingContext2D, structure: any[], colors: any, lichens: number, time: number, scale: number) {
    ctx.save();
    
    const lichenCount = Math.floor(lichens * 12);
    
    for (let l = 0; l < lichenCount; l++) {
      const lichenPhase = time * 0.2 + l * 1.1;
      const lichenLife = (Math.sin(lichenPhase) + 1) / 2;
      
      if (lichenLife > 0.3) {
        const angle = (l / lichenCount) * Math.PI * 2 + time * 0.05;
        const distance = scale * (0.5 + Math.sin(lichenPhase * 0.8) * 0.3);
        const lichenX = structure[0].x + Math.cos(angle) * distance;
        const lichenY = structure[0].y + Math.sin(angle) * distance;
        const lichenSize = scale * 0.06 * lichenLife;
        
        ctx.globalAlpha = lichens * lichenLife * 0.6;
        
        // Lichen patch (irregular)
        const lichenGradient = ctx.createRadialGradient(
          lichenX, lichenY, 0,
          lichenX, lichenY, lichenSize * 1.5
        );
        lichenGradient.addColorStop(0, colors.lichen);
        lichenGradient.addColorStop(0.6, colors.moss);
        lichenGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = lichenGradient;
        
        // Irregular lichen shape
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 2; a += 0.3) {
          const r = lichenSize * (0.7 + Math.sin(a * 3 + lichenPhase) * 0.3);
          const x = lichenX + Math.cos(a) * r;
          const y = lichenY + Math.sin(a) * r;
          if (a === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
      }
    }
    
    ctx.restore();
  }

  function renderMossPatches(ctx: CanvasRenderingContext2D, structure: any[], colors: any, moss: number, time: number, scale: number) {
    ctx.save();
    
    const mossCount = Math.floor(moss * 10);
    
    for (let m = 0; m < mossCount; m++) {
      const mossPhase = time * 0.15 + m * 1.3;
      const mossLife = (Math.sin(mossPhase) + 1) / 2;
      
      if (mossLife > 0.4) {
        const angle = (m / mossCount) * Math.PI * 2 + time * 0.03;
        const distance = scale * (0.6 + Math.sin(mossPhase * 0.6) * 0.2);
        const mossX = structure[0].x + Math.cos(angle) * distance;
        const mossY = structure[0].y + Math.sin(angle) * distance;
        const mossSize = scale * 0.04 * mossLife;
        
        ctx.globalAlpha = moss * mossLife * 0.7;
        ctx.fillStyle = colors.moss;
        
        // Small moss clusters
        for (let cluster = 0; cluster < 3; cluster++) {
          const clusterX = mossX + (Math.random() - 0.5) * mossSize;
          const clusterY = mossY + (Math.random() - 0.5) * mossSize;
          ctx.beginPath();
          ctx.arc(clusterX, clusterY, mossSize * (0.5 + Math.random() * 0.5), 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    
    ctx.restore();
  }

  function renderCharacterMarks(ctx: CanvasRenderingContext2D, structure: any[], colors: any, character: number, insects: number, scale: number) {
    ctx.save();
    
    // Character marks (scratches, gouges)
    const markCount = Math.floor(character * 8);
    ctx.globalAlpha = character * 0.5;
    
    for (let mark = 0; mark < markCount; mark++) {
      const markAngle = Math.random() * Math.PI * 2;
      const distance = scale * (0.3 + Math.random() * 0.5);
      const markX = structure[0].x + Math.cos(markAngle) * distance;
      const markY = structure[0].y + Math.sin(markAngle) * distance;
      const markLength = scale * (0.02 + Math.random() * 0.08);
      
      ctx.strokeStyle = colors.dark;
      ctx.lineWidth = 0.5 + Math.random() * 1;
      ctx.beginPath();
      ctx.moveTo(markX, markY);
      ctx.lineTo(
        markX + Math.cos(markAngle + Math.random() - 0.5) * markLength,
        markY + Math.sin(markAngle + Math.random() - 0.5) * markLength
      );
      ctx.stroke();
    }
    
    // Insect holes
    const holeCount = Math.floor(insects * 15);
    ctx.globalAlpha = insects * 0.8;
    
    for (let hole = 0; hole < holeCount; hole++) {
      const holeAngle = Math.random() * Math.PI * 2;
      const distance = scale * (0.4 + Math.random() * 0.4);
      const holeX = structure[0].x + Math.cos(holeAngle) * distance;
      const holeY = structure[0].y + Math.sin(holeAngle) * distance;
      const holeSize = scale * (0.005 + Math.random() * 0.01);
      
      ctx.fillStyle = colors.dark;
      ctx.beginPath();
      ctx.arc(holeX, holeY, holeSize, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }

  function drawBarkPath(ctx: CanvasRenderingContext2D, points: any[], roughness: number) {
    if (points.length < 3) return;
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    // Organic, irregular curves
    for (let i = 1; i < points.length; i++) {
      const current = points[i];
      const previous = points[i - 1];
      const next = points[(i + 1) % points.length];
      
      // Bark surface irregularity
      const organicTension = 0.5 + roughness * 0.5;
      const roughnessVariation = current.roughness * roughness * 0.1;
      
      const cp1x = previous.x + (current.x - (points[i - 2] || previous).x) * organicTension * 0.3;
      const cp1y = previous.y + (current.y - (points[i - 2] || previous).y) * organicTension * 0.3;
      const cp2x = current.x - (next.x - previous.x) * organicTension * 0.3 + roughnessVariation;
      const cp2y = current.y - (next.y - previous.y) * organicTension * 0.3 + roughnessVariation;
      
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, current.x, current.y);
    }
    
    // Close the organic shape
    const first = points[0];
    const last = points[points.length - 1];
    const secondLast = points[points.length - 2];
    const second = points[1];
    
    const organicTension = 0.5 + roughness * 0.5;
    const cp1x = last.x + (first.x - secondLast.x) * organicTension * 0.3;
    const cp1y = last.y + (first.y - secondLast.y) * organicTension * 0.3;
    const cp2x = first.x - (second.x - last.x) * organicTension * 0.3;
    const cp2y = first.y - (second.y - last.y) * organicTension * 0.3;
    
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, first.x, first.y);
    ctx.closePath();
  }

  function getBounds(points: any[]) {
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

export const metadata: PresetMetadata = {
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