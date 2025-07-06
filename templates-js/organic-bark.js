/**
 * 🌳 Organic Bark
 * 
 * Natural wood textures with growth patterns and organic character
 */

function draw(ctx, width, height, params, time, utils) {
  // Load and process all parameters - clean and deterministic
  const p = utils.params.load(params, ctx, width, height, time, { parameters });
  
  // Template-specific parameters (defaults come from exported parameters)
  const { barkType, frequency, amplitude, growthComplexity, naturalVariation, organicFlow } = p;
  const { barkRoughness, ridgeDepth, furrowWidth, growthRings, branchMarks } = p;
  const { weathering, lichens, moss, insects, treeAge, characterMarks } = p;
  const { woodHue, weatheredTone, naturalSaturation } = p;

  // Calculate dimensions
  const centerX = width / 2;
  const centerY = height / 2;
  const barkTypeNum = Math.round(barkType);
  
  // Bark types
  const barkTypes = [
    { name: 'Oak', ridgePattern: 0.7, furrowDepth: 0.8, textureDensity: 0.9 },
    { name: 'Pine', ridgePattern: 0.5, furrowDepth: 0.6, textureDensity: 0.7 },
    { name: 'Birch', ridgePattern: 0.3, furrowDepth: 0.3, textureDensity: 0.4 },
    { name: 'Redwood', ridgePattern: 0.8, furrowDepth: 0.9, textureDensity: 0.8 },
    { name: 'Ancient', ridgePattern: 0.9, furrowDepth: 1.0, textureDensity: 1.0 }
  ];
  
  const currentBarkType = barkTypes[Math.min(barkTypeNum, barkTypes.length - 1)];

  // Helper functions for organic shapes
  function organicNoise(x, y, scale, octaves = 3) {
    let value = 0;
    let amplitude = 1;
    let frequency = scale;
    let maxValue = 0;
    
    for (let i = 0; i < octaves; i++) {
      value += Math.sin(x * frequency) * Math.cos(y * frequency) * amplitude;
      maxValue += amplitude;
      amplitude *= 0.5;
      frequency *= 2;
    }
    
    return value / maxValue;
  }
  
  function drawBarkTexture() {
    ctx.save();
    
    // Create clipping mask for organic shape
    ctx.beginPath();
    const points = 72;
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const baseRadius = amplitude;
      const noiseX = Math.cos(angle) * frequency;
      const noiseY = Math.sin(angle) * frequency;
      const noise = organicNoise(noiseX + time * 0.05, noiseY, 2, 4) * naturalVariation;
      const growthNoise = organicNoise(noiseX * 0.5, noiseY * 0.5 + time * 0.02, 1, 3) * growthComplexity;
      const radius = baseRadius * (1 + noise * 0.3 + growthNoise * 0.2);
      
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.clip();
    
    // Fill base color with natural wood hue
    const hue = woodHue;
    const saturation = 35 * naturalSaturation;
    const lightness = 35 + weatheredTone * 20;
    
    if (p.theme.fillType !== 'none') {
      ctx.save();
      ctx.globalAlpha = p.theme.fillOpacity;
      
      if (p.theme.fillType === 'gradient') {
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, amplitude * 1.5);
        gradient.addColorStop(0, `hsl(${hue}, ${saturation}%, ${lightness + 10}%)`);
        gradient.addColorStop(0.5, `hsl(${hue}, ${saturation}%, ${lightness}%)`);
        gradient.addColorStop(1, `hsl(${hue - 5}, ${saturation - 10}%, ${lightness - 15}%)`);
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = p.fillColor;
      }
      
      ctx.fillRect(centerX - amplitude * 2, centerY - amplitude * 2, amplitude * 4, amplitude * 4);
      ctx.restore();
    }
    
    // Draw bark ridges and furrows
    const ridgeCount = Math.floor(12 * currentBarkType.textureDensity * barkRoughness);
    for (let i = 0; i < ridgeCount; i++) {
      ctx.save();
      ctx.globalAlpha = p.theme.fillOpacity;
      
      const ridgeAngle = (i / ridgeCount) * Math.PI * 2 + organicNoise(i, time * 0.1, 2) * 0.5;
      const ridgeStart = amplitude * 0.3;
      const ridgeEnd = amplitude * (1 + organicNoise(i, time * 0.05, 1) * 0.3);
      const ridgeThickness = furrowWidth * 20 * (1 + organicNoise(i * 2, time * 0.05, 1) * 0.5);
      
      // Create ridge gradient
      const x1 = centerX + Math.cos(ridgeAngle) * ridgeStart;
      const y1 = centerY + Math.sin(ridgeAngle) * ridgeStart;
      const x2 = centerX + Math.cos(ridgeAngle) * ridgeEnd;
      const y2 = centerY + Math.sin(ridgeAngle) * ridgeEnd;
      
      const ridgeGradient = ctx.createLinearGradient(x1, y1, x2, y2);
      ridgeGradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness - 10}%, 0.1)`);
      ridgeGradient.addColorStop(0.5, `hsla(${hue - 5}, ${saturation - 5}%, ${lightness - 20}%, ${ridgeDepth})`);
      ridgeGradient.addColorStop(1, `hsla(${hue - 10}, ${saturation - 10}%, ${lightness - 30}%, 0.1)`);
      
      // Draw organic ridge
      ctx.strokeStyle = ridgeGradient;
      ctx.lineWidth = ridgeThickness;
      ctx.lineCap = 'round';
      ctx.beginPath();
      
      const ridgePoints = 20;
      for (let j = 0; j <= ridgePoints; j++) {
        const t = j / ridgePoints;
        const r = ridgeStart + (ridgeEnd - ridgeStart) * t;
        const wobble = organicNoise(i + j * 0.1, time * 0.05, 3) * organicFlow * 10;
        const x = centerX + Math.cos(ridgeAngle + wobble * 0.01) * r;
        const y = centerY + Math.sin(ridgeAngle + wobble * 0.01) * r;
        
        if (j === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
      ctx.restore();
    }
    
    // Draw growth rings
    if (growthRings > 0) {
      ctx.save();
      ctx.globalAlpha = growthRings * 0.3 * p.theme.fillOpacity;
      
      const ringCount = Math.floor(5 + treeAge * 10);
      for (let i = 0; i < ringCount; i++) {
        const ringRadius = amplitude * 0.3 + (amplitude * 0.7 * i / ringCount);
        const ringAlpha = (1 - i / ringCount) * growthRings * 0.2;
        
        ctx.strokeStyle = `hsla(${hue - 5}, ${saturation - 10}%, ${lightness - 15}%, ${ringAlpha})`;
        ctx.lineWidth = 1 + organicNoise(i, time * 0.1, 2) * 2;
        ctx.beginPath();
        
        for (let j = 0; j <= 72; j++) {
          const angle = (j / 72) * Math.PI * 2;
          const noise = organicNoise(Math.cos(angle) * 3 + i, Math.sin(angle) * 3, 2) * 10;
          const x = centerX + Math.cos(angle) * (ringRadius + noise);
          const y = centerY + Math.sin(angle) * (ringRadius + noise);
          
          if (j === 0) {
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
    
    // Draw branch marks/scars
    if (branchMarks > 0) {
      ctx.save();
      ctx.globalAlpha = p.theme.fillOpacity;
      
      const markCount = Math.floor(3 + branchMarks * 5);
      for (let i = 0; i < markCount; i++) {
        const markAngle = organicNoise(i * 7, time * 0.1, 1) * Math.PI * 2;
        const markRadius = amplitude * (0.4 + organicNoise(i * 3, time * 0.05, 1) * 0.4);
        const markSize = 10 + branchMarks * 20 * (0.5 + organicNoise(i * 5, time * 0.05, 1) * 0.5);
        
        const markX = centerX + Math.cos(markAngle) * markRadius;
        const markY = centerY + Math.sin(markAngle) * markRadius;
        
        // Draw oval branch scar
        ctx.save();
        ctx.translate(markX, markY);
        ctx.rotate(markAngle + Math.PI / 2);
        ctx.scale(1, 0.6);
        
        const scarGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, markSize);
        scarGradient.addColorStop(0, `hsla(${hue - 10}, ${saturation - 20}%, ${lightness - 30}%, ${branchMarks * 0.8})`);
        scarGradient.addColorStop(0.7, `hsla(${hue - 5}, ${saturation - 15}%, ${lightness - 20}%, ${branchMarks * 0.4})`);
        scarGradient.addColorStop(1, `hsla(${hue}, ${saturation - 10}%, ${lightness - 10}%, 0)`);
        
        ctx.fillStyle = scarGradient;
        ctx.beginPath();
        ctx.arc(0, 0, markSize, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      }
      
      ctx.restore();
    }
    
    // Draw weathering effects
    if (weathering > 0) {
      ctx.save();
      ctx.globalAlpha = weathering * 0.4 * p.theme.fillOpacity;
      
      // Create weathered patches
      const weatherCount = Math.floor(5 + weathering * 10);
      for (let i = 0; i < weatherCount; i++) {
        const weatherX = centerX + (Math.random() - 0.5) * amplitude * 1.8;
        const weatherY = centerY + (Math.random() - 0.5) * amplitude * 1.8;
        const weatherSize = 20 + Math.random() * 40 * weathering;
        
        const weatherGradient = ctx.createRadialGradient(
          weatherX, weatherY, 0,
          weatherX, weatherY, weatherSize
        );
        weatherGradient.addColorStop(0, `hsla(${hue}, ${saturation * 0.5}%, ${lightness + 10}%, ${weathering * 0.3})`);
        weatherGradient.addColorStop(1, `hsla(${hue}, ${saturation * 0.5}%, ${lightness + 10}%, 0)`);
        
        ctx.fillStyle = weatherGradient;
        ctx.beginPath();
        
        // Create irregular weathered shape
        const points = 8;
        for (let j = 0; j <= points; j++) {
          const angle = (j / points) * Math.PI * 2;
          const radius = weatherSize * (0.7 + Math.random() * 0.3);
          const x = weatherX + Math.cos(angle) * radius;
          const y = weatherY + Math.sin(angle) * radius;
          
          if (j === 0) {
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
    
    // Draw lichens
    if (lichens > 0) {
      ctx.save();
      ctx.globalAlpha = lichens * p.theme.fillOpacity;
      
      const lichenCount = Math.floor(4 + lichens * 8);
      for (let i = 0; i < lichenCount; i++) {
        const lichenX = centerX + (Math.random() - 0.5) * amplitude * 1.6;
        const lichenY = centerY + (Math.random() - 0.5) * amplitude * 1.6;
        const lichenSize = 5 + Math.random() * 15 * lichens;
        
        // Lichen colors (pale greens and yellows)
        const lichenHue = 60 + Math.random() * 40;
        ctx.fillStyle = `hsla(${lichenHue}, 40%, 60%, ${lichens * 0.6})`;
        
        // Draw circular lichen patches
        ctx.beginPath();
        ctx.arc(lichenX, lichenY, lichenSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Add texture
        ctx.fillStyle = `hsla(${lichenHue}, 30%, 70%, ${lichens * 0.3})`;
        for (let j = 0; j < 5; j++) {
          const dotX = lichenX + (Math.random() - 0.5) * lichenSize;
          const dotY = lichenY + (Math.random() - 0.5) * lichenSize;
          ctx.beginPath();
          ctx.arc(dotX, dotY, 1 + Math.random() * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      ctx.restore();
    }
    
    // Draw moss
    if (moss > 0) {
      ctx.save();
      ctx.globalAlpha = moss * p.theme.fillOpacity;
      
      const mossPatches = Math.floor(3 + moss * 6);
      for (let i = 0; i < mossPatches; i++) {
        const mossX = centerX + (Math.random() - 0.5) * amplitude * 1.4;
        const mossY = centerY + (Math.random() - 0.5) * amplitude * 1.4;
        const mossSize = 15 + Math.random() * 30 * moss;
        
        // Moss gradient (deep greens)
        const mossGradient = ctx.createRadialGradient(
          mossX, mossY, 0,
          mossX, mossY, mossSize
        );
        mossGradient.addColorStop(0, `hsla(120, 40%, 35%, ${moss * 0.7})`);
        mossGradient.addColorStop(0.5, `hsla(115, 35%, 30%, ${moss * 0.5})`);
        mossGradient.addColorStop(1, `hsla(110, 30%, 25%, 0)`);
        
        ctx.fillStyle = mossGradient;
        
        // Draw fuzzy moss shape
        for (let j = 0; j < 20; j++) {
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * mossSize;
          const fuzzX = mossX + Math.cos(angle) * distance;
          const fuzzY = mossY + Math.sin(angle) * distance;
          const fuzzSize = 2 + Math.random() * 4;
          
          ctx.beginPath();
          ctx.arc(fuzzX, fuzzY, fuzzSize, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      ctx.restore();
    }
    
    // Draw insect holes
    if (insects > 0) {
      ctx.save();
      ctx.globalAlpha = p.theme.fillOpacity;
      
      const holeCount = Math.floor(2 + insects * 8);
      for (let i = 0; i < holeCount; i++) {
        const holeX = centerX + (Math.random() - 0.5) * amplitude * 1.5;
        const holeY = centerY + (Math.random() - 0.5) * amplitude * 1.5;
        const holeSize = 2 + Math.random() * 4 * insects;
        
        // Dark hole
        ctx.fillStyle = `hsla(${hue - 20}, ${saturation - 20}%, ${lightness - 40}%, ${insects * 0.8})`;
        ctx.beginPath();
        ctx.arc(holeX, holeY, holeSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Hole edge
        ctx.strokeStyle = `hsla(${hue - 10}, ${saturation - 10}%, ${lightness - 25}%, ${insects * 0.4})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      
      ctx.restore();
    }
    
    // Draw character marks
    if (characterMarks > 0) {
      ctx.save();
      ctx.globalAlpha = characterMarks * 0.6 * p.theme.fillOpacity;
      
      const markTypes = Math.floor(2 + characterMarks * 4);
      for (let i = 0; i < markTypes; i++) {
        const markX = centerX + (Math.random() - 0.5) * amplitude * 1.2;
        const markY = centerY + (Math.random() - 0.5) * amplitude * 1.2;
        
        ctx.strokeStyle = `hsla(${hue - 15}, ${saturation - 15}%, ${lightness - 25}%, ${characterMarks * 0.5})`;
        ctx.lineWidth = 1 + Math.random() * 3;
        ctx.lineCap = 'round';
        
        // Draw various character marks (scratches, cuts, etc.)
        ctx.beginPath();
        const markLength = 10 + Math.random() * 30 * characterMarks;
        const markAngle = Math.random() * Math.PI * 2;
        
        if (Math.random() > 0.5) {
          // Straight scratch
          ctx.moveTo(
            markX - Math.cos(markAngle) * markLength / 2,
            markY - Math.sin(markAngle) * markLength / 2
          );
          ctx.lineTo(
            markX + Math.cos(markAngle) * markLength / 2,
            markY + Math.sin(markAngle) * markLength / 2
          );
        } else {
          // Curved mark
          const curvePoints = 5;
          for (let j = 0; j <= curvePoints; j++) {
            const t = j / curvePoints;
            const curve = Math.sin(t * Math.PI) * 10 * characterMarks;
            const x = markX + Math.cos(markAngle) * (markLength * (t - 0.5)) + 
                     Math.cos(markAngle + Math.PI / 2) * curve;
            const y = markY + Math.sin(markAngle) * (markLength * (t - 0.5)) + 
                     Math.sin(markAngle + Math.PI / 2) * curve;
            
            if (j === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
        }
        
        ctx.stroke();
      }
      
      ctx.restore();
    }
    
    ctx.restore();
    
    // Draw outer edge/stroke
    if (p.theme.strokeType !== 'none') {
      ctx.save();
      ctx.globalAlpha = p.theme.strokeOpacity;
      
      ctx.strokeStyle = p.strokeColor;
      ctx.lineWidth = p.theme.strokeWidth || 1.5;
      
      if (p.theme.strokeType === 'dashed') {
        ctx.setLineDash([10, 5]);
      } else if (p.theme.strokeType === 'dotted') {
        ctx.setLineDash([2, 3]);
      }
      
      ctx.beginPath();
      const points = 72;
      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const baseRadius = amplitude;
        const noiseX = Math.cos(angle) * frequency;
        const noiseY = Math.sin(angle) * frequency;
        const noise = organicNoise(noiseX + time * 0.05, noiseY, 2, 4) * naturalVariation;
        const growthNoise = organicNoise(noiseX * 0.5, noiseY * 0.5 + time * 0.02, 1, 3) * growthComplexity;
        const radius = baseRadius * (1 + noise * 0.3 + growthNoise * 0.2);
        
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.stroke();
      
      ctx.restore();
    }
  }
  
  drawBarkTexture();
}

// Helper functions for concise parameter definitions
const slider = (def, min, max, step, label, unit, opts = {}) => ({ 
  type: "slider", default: def, min, max, step, label, unit, ...opts 
});
const select = (def, options, label, opts = {}) => ({ 
  type: "select", default: def, options, label, ...opts 
});

// Parameter definitions - controls and defaults
export const parameters = {
  barkType: select(1, [
    { value: 0, label: '🌳 Oak' },
    { value: 1, label: '🌲 Pine' },
    { value: 2, label: '🌿 Birch' },
    { value: 3, label: '🌴 Redwood' },
    { value: 4, label: '🗿 Ancient' }
  ], 'Bark Type'),
  
  frequency: slider(0.6, 0.2, 1.5, 0.05, 'Pattern Frequency'),
  amplitude: slider(140, 80, 200, 5, 'Texture Scale', 'px'),
  
  growthComplexity: slider(0.7, 0.3, 1, 0.05, 'Growth Complexity'),
  naturalVariation: slider(0.8, 0.5, 1, 0.05, 'Natural Variation'),
  organicFlow: slider(0.75, 0.4, 1, 0.05, 'Organic Flow'),
  
  barkRoughness: slider(0.6, 0.2, 1, 0.05, 'Bark Roughness'),
  ridgeDepth: slider(0.4, 0.1, 0.8, 0.05, 'Ridge Depth'),
  furrowWidth: slider(0.3, 0.1, 0.6, 0.05, 'Furrow Width'),
  
  growthRings: slider(0.5, 0, 1, 0.05, 'Growth Rings'),
  branchMarks: slider(0.3, 0, 0.8, 0.05, 'Branch Marks'),
  treeAge: slider(0.6, 0.3, 1, 0.05, 'Tree Age'),
  characterMarks: slider(0.3, 0, 0.8, 0.05, 'Character Marks'),
  
  weathering: slider(0.4, 0, 0.8, 0.05, 'Weathering'),
  lichens: slider(0.2, 0, 0.6, 0.05, 'Lichens'),
  moss: slider(0.15, 0, 0.5, 0.05, 'Moss Coverage'),
  insects: slider(0.1, 0, 0.4, 0.05, 'Insect Holes'),
  
  woodHue: slider(25, 0, 60, 5, 'Wood Hue', '°'),
  weatheredTone: slider(0.6, 0.3, 1, 0.05, 'Weathered Tone'),
  naturalSaturation: slider(0.5, 0.3, 0.8, 0.05, 'Natural Saturation')
};

// Template metadata
export const metadata = {
  name: "🌳 Organic Bark",
  description: "Natural wood textures with growth patterns, weathering, and organic character marks",
  category: "organic",
  tags: ["bark", "wood", "natural", "texture", "organic", "tree"],
  author: "ReFlow",
  version: "1.0.0"
};

