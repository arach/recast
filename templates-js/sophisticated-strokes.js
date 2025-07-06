// Helpers
const slider = (def, min, max, step, label, unit, opts = {}) => ({ 
  type: "slider", default: def, min, max, step, label, unit, ...opts 
});
const select = (def, options, label, opts = {}) => ({ 
  type: "select", default: def, options, label, ...opts 
});

// Parameters
const parameters = {
  strokeStyle: select(2, [
    { value: 0, label: '✒️ Ink Pen' },
    { value: 1, label: '🖌️ Brush' },
    { value: 2, label: '🖋️ Calligraphy' },
    { value: 3, label: '✏️ Pencil' },
    { value: 4, label: '🖍️ Marker' }
  ], 'Stroke Style', { category: 'Style' }),
  frequency: slider(0.8, 0.1, 2, 0.1, 'Flow Rhythm', '', { category: 'Movement' }),
  amplitude: slider(100, 60, 180, 5, 'Stroke Reach', '', { category: 'Movement' }),
  complexity: slider(0.6, 0, 1, 0.05, 'Stroke Complexity', '', { category: 'Movement' }),
  strokeWeight: slider(8, 2, 20, 1, 'Stroke Weight', '', { category: 'Stroke' }),
  strokeVariation: slider(0.5, 0, 1, 0.05, 'Weight Variation', '', { category: 'Stroke' }),
  strokeTaper: slider(0.7, 0, 1, 0.05, 'Stroke Taper', '', { category: 'Stroke' }),
  strokeTexture: slider(0.3, 0, 1, 0.05, 'Texture Amount', '', { category: 'Texture' }),
  inkFlow: slider(0.8, 0.3, 1, 0.05, 'Ink Flow', '', { category: 'Texture' }),
  paperTexture: slider(0.2, 0, 0.8, 0.05, 'Paper Texture', '', { category: 'Texture' }),
  artisticFlair: slider(0.4, 0, 1, 0.05, 'Artistic Flair', '', { category: 'Effects' }),
  inkSplatter: slider(0.1, 0, 0.5, 0.05, 'Ink Splatter', '', { category: 'Effects' }),
  strokeCount: slider(3, 1, 7, 1, 'Stroke Count', '', { category: 'Composition' }),
  layering: slider(0.3, 0, 1, 0.05, 'Stroke Layering', '', { category: 'Composition' })
};

function drawVisualization(ctx, width, height, params, time, utils) {
  // Load parameters with defaults
  const p = utils.params.load(params, ctx, width, height, time, { parameters });
  
  // Access universal properties
  const fillColor = p.fillColor || '#2c3e50';
  const strokeColor = p.strokeColor || '#34495e';
  const fillOpacity = p.fillOpacity ?? 0.9;
  const strokeOpacity = p.strokeOpacity ?? 1;

  // Extract parameters
  const centerX = width / 2;
  const centerY = height / 2;
  const strokeStyleNum = Math.round(p.strokeStyle);
  const frequency = p.frequency;
  const amplitude = p.amplitude;
  const complexity = p.complexity;
  const strokeWeight = p.strokeWeight;
  const strokeVariation = p.strokeVariation;
  const strokeTaper = p.strokeTaper;
  const strokeTexture = p.strokeTexture;
  const inkFlow = p.inkFlow;
  const paperTexture = p.paperTexture;
  const artisticFlair = p.artisticFlair;
  const inkSplatter = p.inkSplatter;
  const strokeCount = Math.round(p.strokeCount);
  const layering = p.layering;

  // Scale based on canvas size
  const baseScale = Math.min(width, height) / 300;
  const scaledAmplitude = amplitude * baseScale;
  const scaledWeight = strokeWeight * baseScale;

  // Apply paper texture background
  if (paperTexture > 0) {
    applyPaperTexture(ctx, width, height, paperTexture);
  }

  // Draw multiple strokes with layering
  for (let s = 0; s < strokeCount; s++) {
    const strokePhase = (s / strokeCount) * Math.PI * 2;
    const strokeOffset = time * frequency + strokePhase;
    const layerOpacity = 1 - (s * layering * 0.2);
    
    // Generate stroke path
    const strokePath = generateArtisticStroke(
      centerX, centerY, scaledAmplitude, 
      complexity, strokeOffset, s
    );

    // Apply stroke style
    ctx.save();
    ctx.globalAlpha = layerOpacity * strokeOpacity;
    
    switch (strokeStyleNum) {
      case 0: // Ink Pen
        drawInkPenStroke(ctx, strokePath, scaledWeight, strokeVariation, strokeTaper, inkFlow, fillColor);
        break;
      case 1: // Brush
        drawBrushStroke(ctx, strokePath, scaledWeight, strokeVariation, strokeTexture, inkFlow, fillColor);
        break;
      case 2: // Calligraphy
        drawCalligraphyStroke(ctx, strokePath, scaledWeight, strokeVariation, strokeTaper, fillColor);
        break;
      case 3: // Pencil
        drawPencilStroke(ctx, strokePath, scaledWeight, strokeTexture, fillColor);
        break;
      case 4: // Marker
        drawMarkerStroke(ctx, strokePath, scaledWeight, inkFlow, fillColor);
        break;
    }
    
    ctx.restore();
  }

  // Add artistic flair
  if (artisticFlair > 0) {
    addArtisticFlair(ctx, centerX, centerY, scaledAmplitude, artisticFlair, fillColor);
  }

  // Add ink splatters
  if (inkSplatter > 0) {
    addInkSplatter(ctx, width, height, inkSplatter, fillColor);
  }

  function generateArtisticStroke(centerX, centerY, radius, complexity, phase, strokeIndex) {
    const points = [];
    const numPoints = Math.floor(20 + complexity * 30); // 20-50 points for smoothness
    
    for (let i = 0; i < numPoints; i++) {
      const t = i / (numPoints - 1);
      const angle = t * Math.PI * 1.5 - Math.PI * 0.75; // 3/4 circle for artistic stroke
      
      // Create flowing movement
      const flow1 = Math.sin(angle * 2 + phase) * complexity * 0.3;
      const flow2 = Math.sin(angle * 3 + phase * 1.5) * complexity * 0.15;
      const flow3 = Math.sin(angle * 5 + phase * 0.7) * complexity * 0.08;
      
      // Add unique variation per stroke
      const strokeVar = Math.sin(angle + strokeIndex * 0.7) * 0.1;
      
      const finalRadius = radius * (0.7 + flow1 + flow2 + flow3 + strokeVar);
      
      // Calculate position with artistic offset
      const offsetX = Math.sin(phase + strokeIndex) * radius * 0.2;
      const offsetY = Math.cos(phase * 0.7 + strokeIndex) * radius * 0.1;
      
      points.push({
        x: centerX + Math.cos(angle) * finalRadius + offsetX,
        y: centerY + Math.sin(angle) * finalRadius + offsetY,
        angle: angle,
        t: t,
        pressure: 0.5 + Math.sin(angle * 4 + phase) * 0.5, // Simulate pen pressure
        speed: Math.abs(flow1) + 0.5 // Simulate drawing speed
      });
    }
    
    return points;
  }

  function drawInkPenStroke(ctx, points, weight, variation, taper, inkFlow, color) {
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      
      // Calculate ink flow variation
      const flowVariation = 1 - (1 - inkFlow) * current.speed;
      
      // Apply taper
      const taperEffect = taper > 0 ? 
        Math.sin(current.t * Math.PI) * taper + (1 - taper) : 1;
      
      // Apply pressure variation
      const pressureEffect = 1 + (current.pressure - 0.5) * variation;
      
      ctx.lineWidth = weight * taperEffect * pressureEffect * flowVariation;
      ctx.globalAlpha = inkFlow * (0.8 + flowVariation * 0.2);
      
      ctx.beginPath();
      ctx.moveTo(current.x, current.y);
      ctx.lineTo(next.x, next.y);
      ctx.stroke();
    }
  }

  function drawBrushStroke(ctx, points, weight, variation, texture, inkFlow, color) {
    // Main brush stroke
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Draw multiple brush fibers
    const fiberCount = Math.floor(3 + texture * 5);
    
    for (let f = 0; f < fiberCount; f++) {
      const fiberOffset = (f - fiberCount / 2) * weight * 0.1;
      const fiberAlpha = inkFlow * (1 - f / fiberCount * 0.3);
      
      ctx.globalAlpha = fiberAlpha;
      
      for (let i = 0; i < points.length - 1; i++) {
        const current = points[i];
        const next = points[i + 1];
        
        // Vary weight based on pressure and speed
        const brushWidth = weight * (0.8 + current.pressure * variation * 0.4);
        ctx.lineWidth = brushWidth * (1 - f * 0.15);
        
        // Calculate perpendicular offset for fiber
        const angle = Math.atan2(next.y - current.y, next.x - current.x) + Math.PI / 2;
        const offsetX = Math.cos(angle) * fiberOffset;
        const offsetY = Math.sin(angle) * fiberOffset;
        
        ctx.beginPath();
        ctx.moveTo(current.x + offsetX, current.y + offsetY);
        ctx.lineTo(next.x + offsetX, next.y + offsetY);
        ctx.stroke();
      }
    }
  }

  function drawCalligraphyStroke(ctx, points, weight, variation, taper, color) {
    ctx.fillStyle = color;
    
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      
      // Calculate stroke angle for calligraphy effect
      const angle = Math.atan2(next.y - current.y, next.x - current.x);
      
      // Calligraphy width varies with angle (thick on downstrokes)
      const calligraphyEffect = 0.5 + Math.abs(Math.sin(angle)) * 0.5;
      const width = weight * calligraphyEffect * (1 + (current.pressure - 0.5) * variation);
      
      // Apply taper
      const taperEffect = taper > 0 ? 
        Math.sin(current.t * Math.PI) * taper + (1 - taper) : 1;
      
      const finalWidth = width * taperEffect;
      
      // Draw as a quadrilateral for proper calligraphy effect
      const perpAngle = angle + Math.PI / 2;
      const dx = Math.cos(perpAngle) * finalWidth / 2;
      const dy = Math.sin(perpAngle) * finalWidth / 2;
      
      ctx.beginPath();
      ctx.moveTo(current.x - dx, current.y - dy);
      ctx.lineTo(current.x + dx, current.y + dy);
      ctx.lineTo(next.x + dx, next.y + dy);
      ctx.lineTo(next.x - dx, next.y - dy);
      ctx.closePath();
      ctx.fill();
    }
  }

  function drawPencilStroke(ctx, points, weight, texture, color) {
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    
    // Main pencil line
    ctx.lineWidth = weight;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
    
    // Add pencil texture
    if (texture > 0) {
      ctx.globalAlpha = texture * 0.3;
      
      for (let i = 0; i < points.length - 1; i++) {
        const current = points[i];
        const next = points[i + 1];
        
        // Add texture lines
        const textureCount = Math.floor(2 + texture * 3);
        for (let t = 0; t < textureCount; t++) {
          const offset = (Math.random() - 0.5) * weight;
          const perpAngle = Math.atan2(next.y - current.y, next.x - current.x) + Math.PI / 2;
          const offsetX = Math.cos(perpAngle) * offset;
          const offsetY = Math.sin(perpAngle) * offset;
          
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(current.x + offsetX, current.y + offsetY);
          ctx.lineTo(next.x + offsetX, next.y + offsetY);
          ctx.stroke();
        }
      }
    }
  }

  function drawMarkerStroke(ctx, points, weight, inkFlow, color) {
    // Marker has consistent width but varying opacity
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = weight;
    
    // Draw main stroke
    ctx.globalAlpha = inkFlow * 0.8;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
    
    // Add marker bleed effect
    ctx.globalAlpha = inkFlow * 0.2;
    ctx.lineWidth = weight * 1.3;
    ctx.stroke();
  }

  function applyPaperTexture(ctx, width, height, intensity) {
    ctx.save();
    ctx.globalAlpha = intensity * 0.1;
    
    // Create paper grain
    for (let i = 0; i < 100 * intensity; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 2;
      const opacity = Math.random() * 0.3;
      
      ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }

  function addArtisticFlair(ctx, centerX, centerY, radius, flair, color) {
    ctx.save();
    ctx.globalAlpha = flair * 0.3;
    
    // Add artistic swirls
    const swirlCount = Math.floor(2 + flair * 3);
    
    for (let i = 0; i < swirlCount; i++) {
      const swirlAngle = Math.random() * Math.PI * 2;
      const swirlRadius = radius * (0.3 + Math.random() * 0.4);
      const swirlX = centerX + Math.cos(swirlAngle) * swirlRadius;
      const swirlY = centerY + Math.sin(swirlAngle) * swirlRadius;
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 1 + Math.random() * 2;
      ctx.beginPath();
      
      // Draw a small spiral
      for (let j = 0; j < 20; j++) {
        const t = j / 20;
        const spiralRadius = (1 - t) * 20 * flair;
        const angle = t * Math.PI * 4;
        const x = swirlX + Math.cos(angle) * spiralRadius;
        const y = swirlY + Math.sin(angle) * spiralRadius;
        
        if (j === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
    }
    
    ctx.restore();
  }

  function addInkSplatter(ctx, width, height, intensity, color) {
    ctx.save();
    
    const splatterCount = Math.floor(5 + intensity * 20);
    
    for (let i = 0; i < splatterCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = 1 + Math.random() * 4 * intensity;
      const opacity = 0.3 + Math.random() * 0.7;
      
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity * intensity;
      
      // Create irregular splatter shape
      ctx.beginPath();
      const points = 5 + Math.floor(Math.random() * 5);
      for (let j = 0; j < points; j++) {
        const angle = (j / points) * Math.PI * 2;
        const radius = size * (0.5 + Math.random() * 0.5);
        const px = x + Math.cos(angle) * radius;
        const py = y + Math.sin(angle) * radius;
        
        if (j === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();
      ctx.fill();
    }
    
    ctx.restore();
  }
}

// Metadata
export const metadata = {
  name: "🎨 Sophisticated Strokes", 
  description: "Artistic brush strokes with calligraphy effects",
  category: "artistic",
  tags: ["brush", "strokes", "calligraphy", "artistic", "painting"],
  author: "ReFlow",
  version: "1.0.0"
};

export { parameters, drawVisualization };

