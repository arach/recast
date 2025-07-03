// 🔮 Simple Prism
const PARAMETERS = {
  // Universal Background Controls
  backgroundColor: { type: 'color', default: "#ffffff", label: 'Background Color', category: 'Background' },
  backgroundType: { type: 'select', options: [{"value":"transparent","label":"Transparent"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "transparent", label: 'Background Type', category: 'Background' },
  backgroundGradientStart: { type: 'color', default: "#ffffff", label: 'Gradient Start', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientEnd: { type: 'color', default: "#f0f0f0", label: 'Gradient End', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 45, label: 'Gradient Direction', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  
  // Universal Fill Controls
  fillType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "solid", label: 'Fill Type', category: 'Fill' },
  fillColor: { type: 'color', default: "#3b82f6", label: 'Fill Color', category: 'Fill', showIf: (params)=>params.fillType === 'solid' },
  fillGradientStart: { type: 'color', default: "#3b82f6", label: 'Gradient Start', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientEnd: { type: 'color', default: "#1d4ed8", label: 'Gradient End', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 90, label: 'Gradient Direction', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Fill Opacity', category: 'Fill', showIf: (params)=>params.fillType !== 'none' },
  
  // Universal Stroke Controls
  strokeType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid"},{"value":"dashed","label":"Dashed"},{"value":"dotted","label":"Dotted"}], default: "solid", label: 'Stroke Type', category: 'Stroke' },
  strokeColor: { type: 'color', default: "#1e40af", label: 'Stroke Color', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeWidth: { type: 'slider', min: 0, max: 10, step: 0.5, default: 2, label: 'Stroke Width', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Stroke Opacity', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  
  // Template-specific controls
  frequency: { type: 'slider', min: 0.2, max: 1.5, step: 0.05, default: 0.6, label: 'Animation Speed', category: 'Shape' },
  amplitude: { type: 'slider', min: 60, max: 180, step: 5, default: 100, label: 'Size', category: 'Shape' },
  
  // Prism geometry
  prismSides: { type: 'slider', min: 3, max: 8, step: 1, default: 6, label: 'Prism Sides', category: 'Shape' },
  prismHeight: { type: 'slider', min: 0.5, max: 2, step: 0.1, default: 1, label: 'Height Ratio', category: 'Shape' },
  cornerRadius: { type: 'slider', min: 0, max: 20, step: 1, default: 4, label: 'Corner Rounding', category: 'Shape' },
  shapeRotation: { type: 'slider', min: 0, max: 360, step: 15, default: 0, label: 'Rotation Angle', category: 'Shape' },
  
  // Isometric 3D Structure
  showInternalStructure: { type: 'toggle', default: true, label: 'Internal Structure', category: '3D' },
  depthRatio: { type: 'slider', min: 0.2, max: 1.5, step: 0.05, default: 0.6, label: 'Depth', category: '3D' },
  perspectiveAngle: { type: 'slider', min: 15, max: 45, step: 5, default: 30, label: 'Perspective Angle', category: '3D' },
  rotationY: { type: 'slider', min: -45, max: 45, step: 5, default: 0, label: 'Y-Axis Rotation', category: '3D' },
  rotationX: { type: 'slider', min: -30, max: 30, step: 5, default: 0, label: 'X-Axis Rotation', category: '3D' },
  faceShading: { type: 'slider', min: 0, max: 0.4, step: 0.05, default: 0.15, label: 'Face Shading', category: '3D' },
  
  // Typography (brand text on surface)
  showText: { type: 'toggle', default: true, label: 'Show Text', category: 'Typography' },
  text: { type: 'text', default: 'SCOUT', label: 'Text Content', category: 'Typography' },
  fontSize: { type: 'slider', min: 12, max: 60, step: 2, default: 24, label: 'Font Size', category: 'Typography' },
  fontWeight: { type: 'select', options: ['300', '400', '500', '600', '700', '800'], default: '600', label: 'Font Weight', category: 'Typography' },
  textColor: { type: 'color', default: '#ffffff', label: 'Text Color', category: 'Typography' },
  textPosition: { type: 'select', options: ['center', 'top', 'bottom'], default: 'center', label: 'Text Position', category: 'Typography' },
  textProjection: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.7, label: 'Surface Projection', category: 'Typography' },
  
  // Light effects (optional enhancements)
  lightRefraction: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.3, label: 'Light Refraction', category: 'Effects' },
  refractionCount: { type: 'slider', min: 2, max: 8, step: 1, default: 4, label: 'Refraction Rays', category: 'Effects' },
  refractionColor: { type: 'color', default: '#60a5fa', label: 'Refraction Color', category: 'Effects' }
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

function applyUniversalFill(ctx, params) {
  if (params.fillType === 'none') return;
  
  ctx.save();
  ctx.globalAlpha = params.fillOpacity || 1;
  
  if (params.fillType === 'solid') {
    ctx.fillStyle = params.fillColor || '#3b82f6';
  } else if (params.fillType === 'gradient') {
    // Gradient will be applied by the specific implementation
    ctx.fillStyle = params.fillColor || '#3b82f6';
  }
  
  ctx.fill();
  ctx.restore();
}

function applyUniversalStroke(ctx, params) {
  if (params.strokeType === 'none') return;
  
  ctx.save();
  ctx.globalAlpha = params.strokeOpacity || 1;
  ctx.strokeStyle = params.strokeColor || '#1e40af';
  ctx.lineWidth = params.strokeWidth || 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  switch (params.strokeType) {
    case 'solid':
      ctx.setLineDash([]);
      break;
    case 'dashed':
      ctx.setLineDash([(params.strokeWidth || 2) * 3, (params.strokeWidth || 2) * 2]);
      break;
    case 'dotted':
      ctx.setLineDash([params.strokeWidth || 2, params.strokeWidth || 2]);
      break;
  }
  
  ctx.stroke();
  ctx.restore();
}

function getBoundsFromPoints(points) {
  if (points.length === 0) {
    return { width: 0, height: 0, centerX: 0, centerY: 0, minX: 0, maxX: 0, minY: 0, maxY: 0 };
  }
  
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
  const amplitude = params.amplitude || 100;
  const prismSides = Math.round(params.prismSides || 6);
  const prismHeight = params.prismHeight || 1;
  const cornerRadius = params.cornerRadius || 4;
  const shapeRotation = (params.shapeRotation || 0) * Math.PI / 180;
  const lightRefraction = params.lightRefraction || 0.3;
  const refractionCount = Math.round(params.refractionCount || 4);
  const refractionColor = params.refractionColor || '#60a5fa';
  
  // 3D Parameters
  const showInternalStructure = params.showInternalStructure !== false;
  const depthRatio = params.depthRatio || 0.6;
  const perspectiveAngle = (params.perspectiveAngle || 30) * Math.PI / 180;
  const rotationY = (params.rotationY || 0) * Math.PI / 180;
  const rotationX = (params.rotationX || 0) * Math.PI / 180;
  const faceShading = params.faceShading || 0.15;
  
  // Typography Parameters
  const showText = params.showText !== false;
  const text = params.text || 'SCOUT';
  const fontSize = params.fontSize || 24;
  const fontWeight = params.fontWeight || '600';
  const textColor = params.textColor || '#ffffff';
  const textPosition = params.textPosition || 'center';
  const textProjection = params.textProjection || 0.7;

  // Scale and animation
  const baseScale = Math.min(width, height) / 300;
  const scaledAmplitude = amplitude * baseScale;
  const animationPhase = time * frequency;
  const breathingPulse = 1 + Math.sin(animationPhase) * 0.05; // Subtle breathing

  // Generate isometric 3D prism
  const prismData = generateIsometricPrism(
    centerX, centerY, scaledAmplitude * breathingPulse, 
    prismSides, prismHeight, depthRatio, perspectiveAngle, shapeRotation, rotationY, rotationX
  );

  // Render light refraction effects (behind the prism)
  if (lightRefraction > 0.1) {
    renderRefractionRays(ctx, centerX, centerY, scaledAmplitude, refractionCount, refractionColor, lightRefraction, time);
  }

  // Draw the 3D prism with proper depth ordering
  ctx.save();
  
  // Draw back faces first (if visible)
  if (showInternalStructure) {
    drawPrismFaces(ctx, prismData, faceShading, params, true); // back faces
  }
  
  // Draw front face
  drawPrismPath(ctx, prismData.frontFace, cornerRadius);
  const bounds = getBoundsFromPoints(prismData.frontFace);
  applyUniversalFill(ctx, params);
  applyUniversalStroke(ctx, params);
  
  // Draw side faces and internal structure
  if (showInternalStructure) {
    drawPrismFaces(ctx, prismData, faceShading, params, false); // side faces and edges
  }
  
  // Render text on surface
  if (showText && text.trim()) {
    renderTextOnSurface(ctx, text, prismData, fontSize, fontWeight, textColor, textPosition, textProjection);
  }
  
  ctx.restore();

  function generateIsometricPrism(centerX: number, centerY: number, radius: number, sides: number, heightRatio: number, depthRatio: number, perspectiveAngle: number, shapeRotation: number, rotationY: number, rotationX: number) {
    // Generate base prism points in 3D space
    const points3D = [];
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * Math.PI * 2 - Math.PI / 2 + shapeRotation;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * heightRatio;
      const z = 0;
      points3D.push({ x, y, z });
    }
    
    // Apply 3D rotations
    const rotatedPoints = points3D.map(point => {
      // Rotate around Y axis
      let x1 = point.x * Math.cos(rotationY) - point.z * Math.sin(rotationY);
      let z1 = point.x * Math.sin(rotationY) + point.z * Math.cos(rotationY);
      let y1 = point.y;
      
      // Rotate around X axis
      let y2 = y1 * Math.cos(rotationX) - z1 * Math.sin(rotationX);
      let z2 = y1 * Math.sin(rotationX) + z1 * Math.cos(rotationX);
      let x2 = x1;
      
      return { x: x2, y: y2, z: z2 };
    });
    
    // Project to 2D with isometric projection
    const frontFace = rotatedPoints.map(point => ({
      x: centerX + point.x,
      y: centerY + point.y,
      z3d: point.z // Store z for proper depth ordering
    }));
    
    // Calculate depth offset based on perspective and rotations
    const depthOffset = radius * depthRatio;
    const depthX = Math.cos(perspectiveAngle) * depthOffset;
    const depthY = Math.sin(perspectiveAngle) * depthOffset;
    
    // Generate back face points with same rotation
    const backPoints3D = points3D.map(point => ({
      x: point.x,
      y: point.y,
      z: -depthOffset
    }));
    
    const rotatedBackPoints = backPoints3D.map(point => {
      // Rotate around Y axis
      let x1 = point.x * Math.cos(rotationY) - point.z * Math.sin(rotationY);
      let z1 = point.x * Math.sin(rotationY) + point.z * Math.cos(rotationY);
      let y1 = point.y;
      
      // Rotate around X axis
      let y2 = y1 * Math.cos(rotationX) - z1 * Math.sin(rotationX);
      let z2 = y1 * Math.sin(rotationX) + z1 * Math.cos(rotationX);
      let x2 = x1;
      
      return { x: x2, y: y2, z: z2 };
    });
    
    const backFace = rotatedBackPoints.map(point => ({
      x: centerX + point.x - depthX,
      y: centerY + point.y - depthY,
      z3d: point.z
    }));
    
    // Generate side faces (connections between front and back)
    const sideFaces = [];
    for (let i = 0; i < sides; i++) {
      const nextI = (i + 1) % sides;
      sideFaces.push([
        frontFace[i],
        frontFace[nextI], 
        backFace[nextI],
        backFace[i]
      ]);
    }
    
    // Calculate face normal for text projection
    const faceNormal = calculateFaceNormal(rotatedPoints);
    
    return {
      frontFace,
      backFace,
      sideFaces,
      depthX,
      depthY,
      faceNormal,
      rotationY,
      rotationX
    };
  }
  
  function calculateFaceNormal(points3D: Array<{x: number, y: number, z: number}>) {
    // Calculate the normal vector of the front face
    if (points3D.length < 3) return { x: 0, y: 0, z: 1 };
    
    // Use first three points to calculate normal
    const p1 = points3D[0];
    const p2 = points3D[1];
    const p3 = points3D[2];
    
    // Calculate two edge vectors
    const v1 = { x: p2.x - p1.x, y: p2.y - p1.y, z: p2.z - p1.z };
    const v2 = { x: p3.x - p1.x, y: p3.y - p1.y, z: p3.z - p1.z };
    
    // Cross product to get normal
    const normal = {
      x: v1.y * v2.z - v1.z * v2.y,
      y: v1.z * v2.x - v1.x * v2.z,
      z: v1.x * v2.y - v1.y * v2.x
    };
    
    // Normalize
    const length = Math.sqrt(normal.x * normal.x + normal.y * normal.y + normal.z * normal.z);
    return {
      x: normal.x / length,
      y: normal.y / length,
      z: normal.z / length
    };
  }
  
  function drawPrismFaces(ctx: CanvasRenderingContext2D, prismData: any, faceShading: number, params: any, drawBackFaces: boolean) {
    const fillColor = params.fillColor || '#3b82f6';
    
    if (drawBackFaces) {
      // Draw back face with darker shading
      ctx.save();
      ctx.globalAlpha = 0.3;
      drawPrismPath(ctx, prismData.backFace, 0);
      ctx.fillStyle = shadeColor(fillColor, -faceShading * 2);
      ctx.fill();
      ctx.restore();
    } else {
      // Draw side faces with varying shading
      prismData.sideFaces.forEach((face: any, index: number) => {
        ctx.save();
        ctx.globalAlpha = 0.6;
        
        // Create gradient for side face depth
        const shadingLevel = Math.sin((index / prismData.sideFaces.length) * Math.PI * 2) * faceShading;
        ctx.fillStyle = shadeColor(fillColor, shadingLevel);
        
        ctx.beginPath();
        ctx.moveTo(face[0].x, face[0].y);
        face.forEach((point: any) => ctx.lineTo(point.x, point.y));
        ctx.closePath();
        ctx.fill();
        
        // Draw edge lines
        ctx.strokeStyle = params.strokeColor || '#1e40af';
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.4;
        ctx.stroke();
        
        ctx.restore();
      });
      
      // Draw internal structure lines
      ctx.save();
      ctx.strokeStyle = params.strokeColor || '#1e40af';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.3;
      
      // Connect corresponding vertices between front and back faces
      for (let i = 0; i < prismData.frontFace.length; i++) {
        ctx.beginPath();
        ctx.moveTo(prismData.frontFace[i].x, prismData.frontFace[i].y);
        ctx.lineTo(prismData.backFace[i].x, prismData.backFace[i].y);
        ctx.stroke();
      }
      
      ctx.restore();
    }
  }
  
  function shadeColor(color: string, amount: number) {
    // Simple color shading function
    const num = parseInt(color.replace("#",""), 16);
    const amt = Math.round(2.55 * amount * 100);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }
  
  function renderTextOnSurface(ctx: CanvasRenderingContext2D, text: string, prismData: any, fontSize: number, fontWeight: string, textColor: string, textPosition: string, projection: number) {
    // Calculate the center and bounds of the front face
    const facePoints = prismData.frontFace;
    const bounds = getBoundsFromPoints(facePoints);
    
    ctx.save();
    
    // Create a clipping path for the front face to contain the text
    ctx.beginPath();
    if (facePoints.length > 0) {
      ctx.moveTo(facePoints[0].x, facePoints[0].y);
      for (let i = 1; i < facePoints.length; i++) {
        ctx.lineTo(facePoints[i].x, facePoints[i].y);
      }
      ctx.closePath();
      ctx.clip();
    }
    
    // Calculate transformation based on 3D rotation
    // The text should appear to be painted on the front face
    const rotY = prismData.rotationY;
    const rotX = prismData.rotationX;
    
    // Apply perspective transformation that matches the prism rotation
    // Y rotation affects horizontal skew
    // X rotation affects vertical skew
    const skewX = -Math.sin(rotY) * projection;
    const skewY = Math.sin(rotX) * projection * 0.5;
    const scaleX = Math.cos(rotY) * (1 - (1 - Math.cos(rotY)) * projection * 0.3);
    const scaleY = Math.cos(rotX) * (1 - (1 - Math.cos(rotX)) * projection * 0.3);
    
    if (projection > 0.1) {
      // Apply full transformation matrix
      ctx.transform(scaleX, skewY, skewX, scaleY, 0, 0);
    }
    
    // Set up text rendering
    ctx.fillStyle = textColor;
    ctx.font = `${fontWeight} ${fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Position text based on textPosition setting
    let textY = bounds.centerY;
    switch (textPosition) {
      case 'top':
        textY = bounds.centerY - bounds.height * 0.25;
        break;
      case 'bottom':
        textY = bounds.centerY + bounds.height * 0.25;
        break;
      case 'center':
      default:
        textY = bounds.centerY;
        break;
    }
    
    // Adjust text position to account for transformation
    const adjustedX = bounds.centerX + (textY - bounds.centerY) * skewX;
    const adjustedY = textY;
    
    // Add subtle embossed effect for surface projection (scaled by projection amount)
    if (projection > 0.3) {
      ctx.shadowColor = `rgba(0, 0, 0, ${0.4 * projection})`;
      ctx.shadowBlur = Math.round(1 + projection);
      ctx.shadowOffsetX = 1 * projection;
      ctx.shadowOffsetY = 1 * projection;
      
      // Render the projected text with shadow
      ctx.fillText(text, adjustedX, adjustedY);
      
      // Add subtle highlight effect for 3D surface appearance
      ctx.shadowColor = `rgba(255, 255, 255, ${0.3 * projection})`;
      ctx.shadowBlur = 1;
      ctx.shadowOffsetX = -0.5 * projection;
      ctx.shadowOffsetY = -0.5 * projection;
      ctx.fillText(text, adjustedX, adjustedY);
    } else {
      // Minimal shadows for low projection (more flat appearance)
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 1;
      ctx.shadowOffsetX = 0.5;
      ctx.shadowOffsetY = 0.5;
      ctx.fillText(text, adjustedX, adjustedY);
    }
    
    ctx.restore();
  }

  function drawPrismPath(ctx: CanvasRenderingContext2D, points: Array<{x: number, y: number}>, cornerRadius: number) {
    if (points.length < 3) return;
    
    ctx.beginPath();
    
    if (cornerRadius <= 0) {
      // Sharp corners
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.closePath();
    } else {
      // Rounded corners
      for (let i = 0; i < points.length; i++) {
        const current = points[i];
        const next = points[(i + 1) % points.length];
        const prev = points[(i - 1 + points.length) % points.length];
        
        // Calculate corner vectors
        const prevVecX = current.x - prev.x;
        const prevVecY = current.y - prev.y;
        const nextVecX = next.x - current.x;
        const nextVecY = next.y - current.y;
        
        // Normalize vectors
        const prevLen = Math.sqrt(prevVecX * prevVecX + prevVecY * prevVecY);
        const nextLen = Math.sqrt(nextVecX * nextVecX + nextVecY * nextVecY);
        
        const prevUnitX = prevVecX / prevLen;
        const prevUnitY = prevVecY / prevLen;
        const nextUnitX = nextVecX / nextLen;
        const nextUnitY = nextVecY / nextLen;
        
        // Calculate control points for rounded corner
        const radius = Math.min(cornerRadius, prevLen / 2, nextLen / 2);
        const cp1x = current.x - prevUnitX * radius;
        const cp1y = current.y - prevUnitY * radius;
        const cp2x = current.x + nextUnitX * radius;
        const cp2y = current.y + nextUnitY * radius;
        
        if (i === 0) {
          ctx.moveTo(cp1x, cp1y);
        } else {
          ctx.lineTo(cp1x, cp1y);
        }
        
        // Draw rounded corner
        ctx.quadraticCurveTo(current.x, current.y, cp2x, cp2y);
      }
      
      ctx.closePath();
    }
  }

  function renderRefractionRays(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, scale: number, rayCount: number, color: string, intensity: number, time: number) {
    ctx.save();
    ctx.globalAlpha = intensity * 0.6;
    
    for (let i = 0; i < rayCount; i++) {
      const rayAngle = (i / rayCount) * Math.PI * 2 + time * 0.2; // Slow rotation
      const rayLength = scale * (1.2 + Math.sin(time * 2 + i) * 0.3);
      
      // Ray gradient
      const gradient = ctx.createLinearGradient(
        centerX, centerY,
        centerX + Math.cos(rayAngle) * rayLength,
        centerY + Math.sin(rayAngle) * rayLength
      );
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.7, color + '80'); // Semi-transparent
      gradient.addColorStop(1, 'transparent');
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + Math.cos(rayAngle) * rayLength,
        centerY + Math.sin(rayAngle) * rayLength
      );
      ctx.stroke();
    }
    
    ctx.restore();
  }
}

export const metadata = {
  name: "🔮 Simple Prism",
  description: "Professional 3D isometric prism with surface-projected text - perfect for Scout's voice processing identity",
  defaultParams: {
    seed: "scout-voice",
    frequency: 0.6,
    amplitude: 100,
    prismSides: 6,
    prismHeight: 1,
    cornerRadius: 4,
    shapeRotation: 0,
    showInternalStructure: true,
    depthRatio: 0.6,
    perspectiveAngle: 30,
    rotationY: 0,
    rotationX: 0,
    faceShading: 0.15,
    showText: true,
    text: 'SCOUT',
    fontSize: 24,
    fontWeight: '600',
    textColor: '#ffffff',
    textPosition: 'center',
    textProjection: 0.7,
    lightRefraction: 0.3,
    refractionCount: 4,
    refractionColor: '#60a5fa'
  }
};

export const id = 'simple-prism';
export const name = "🔮 Simple Prism";
export const description = "Professional 3D isometric prism with surface-projected text - perfect for Scout's voice processing identity";
export const defaultParams = {
  seed: "scout-voice",
  frequency: 0.6,
  amplitude: 100,
  prismSides: 6,
  prismHeight: 1,
  cornerRadius: 4,
  shapeRotation: 0,
  showInternalStructure: true,
  depthRatio: 0.6,
  perspectiveAngle: 30,
  rotationY: 0,
  rotationX: 0,
  faceShading: 0.15,
  showText: true,
  text: 'SCOUT',
  fontSize: 24,
  fontWeight: '600',
  textColor: '#ffffff',
  textPosition: 'center',
  textProjection: 0.7,
  lightRefraction: 0.3,
  refractionCount: 4,
  refractionColor: '#60a5fa'
};
export const code = `// 🔮 Simple Prism
const PARAMETERS = {
  backgroundColor: { type: 'color', default: "#ffffff", label: 'Background Color', category: 'Background' },
  backgroundType: { type: 'select', options: [{"value":"transparent","label":"Transparent"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "transparent", label: 'Background Type', category: 'Background' },
  backgroundGradientStart: { type: 'color', default: "#ffffff", label: 'Gradient Start', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientEnd: { type: 'color', default: "#f0f0f0", label: 'Gradient End', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  backgroundGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 45, label: 'Gradient Direction', category: 'Background', showIf: (params)=>params.backgroundType === 'gradient' },
  fillType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid Color"},{"value":"gradient","label":"Gradient"}], default: "solid", label: 'Fill Type', category: 'Fill' },
  fillColor: { type: 'color', default: "#3b82f6", label: 'Fill Color', category: 'Fill', showIf: (params)=>params.fillType === 'solid' },
  fillGradientStart: { type: 'color', default: "#3b82f6", label: 'Gradient Start', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientEnd: { type: 'color', default: "#1d4ed8", label: 'Gradient End', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillGradientDirection: { type: 'slider', min: 0, max: 360, step: 15, default: 90, label: 'Gradient Direction', category: 'Fill', showIf: (params)=>params.fillType === 'gradient' },
  fillOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Fill Opacity', category: 'Fill', showIf: (params)=>params.fillType !== 'none' },
  strokeType: { type: 'select', options: [{"value":"none","label":"None"},{"value":"solid","label":"Solid"},{"value":"dashed","label":"Dashed"},{"value":"dotted","label":"Dotted"}], default: "solid", label: 'Stroke Type', category: 'Stroke' },
  strokeColor: { type: 'color', default: "#1e40af", label: 'Stroke Color', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeWidth: { type: 'slider', min: 0, max: 10, step: 0.5, default: 2, label: 'Stroke Width', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  strokeOpacity: { type: 'slider', min: 0, max: 1, step: 0.05, default: 1, label: 'Stroke Opacity', category: 'Stroke', showIf: (params)=>params.strokeType !== 'none' },
  frequency: { type: 'slider', min: 0.2, max: 1.5, step: 0.05, default: 0.6, label: 'Animation Speed', category: 'Shape' },
  amplitude: { type: 'slider', min: 60, max: 180, step: 5, default: 100, label: 'Size', category: 'Shape' },
  prismSides: { type: 'slider', min: 3, max: 8, step: 1, default: 6, label: 'Prism Sides', category: 'Shape' },
  prismHeight: { type: 'slider', min: 0.5, max: 2, step: 0.1, default: 1, label: 'Height Ratio', category: 'Shape' },
  cornerRadius: { type: 'slider', min: 0, max: 20, step: 1, default: 4, label: 'Corner Rounding', category: 'Shape' },
  shapeRotation: { type: 'slider', min: 0, max: 360, step: 15, default: 0, label: 'Rotation Angle', category: 'Shape' },
  showInternalStructure: { type: 'toggle', default: true, label: 'Internal Structure', category: '3D' },
  depthRatio: { type: 'slider', min: 0.2, max: 1.5, step: 0.05, default: 0.6, label: 'Depth', category: '3D' },
  perspectiveAngle: { type: 'slider', min: 15, max: 45, step: 5, default: 30, label: 'Perspective Angle', category: '3D' },
  rotationY: { type: 'slider', min: -45, max: 45, step: 5, default: 0, label: 'Y-Axis Rotation', category: '3D' },
  rotationX: { type: 'slider', min: -30, max: 30, step: 5, default: 0, label: 'X-Axis Rotation', category: '3D' },
  faceShading: { type: 'slider', min: 0, max: 0.4, step: 0.05, default: 0.15, label: 'Face Shading', category: '3D' },
  showText: { type: 'toggle', default: true, label: 'Show Text', category: 'Typography' },
  text: { type: 'text', default: 'SCOUT', label: 'Text Content', category: 'Typography' },
  fontSize: { type: 'slider', min: 12, max: 60, step: 2, default: 24, label: 'Font Size', category: 'Typography' },
  fontWeight: { type: 'select', options: ['300', '400', '500', '600', '700', '800'], default: '600', label: 'Font Weight', category: 'Typography' },
  textColor: { type: 'color', default: '#ffffff', label: 'Text Color', category: 'Typography' },
  textPosition: { type: 'select', options: ['center', 'top', 'bottom'], default: 'center', label: 'Text Position', category: 'Typography' },
  textProjection: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.7, label: 'Surface Projection', category: 'Typography' },
  lightRefraction: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.3, label: 'Light Refraction', category: 'Effects' },
  refractionCount: { type: 'slider', min: 2, max: 8, step: 1, default: 4, label: 'Refraction Rays', category: 'Effects' },
  refractionColor: { type: 'color', default: '#60a5fa', label: 'Refraction Color', category: 'Effects' }
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

function drawVisualization(ctx, width, height, params, _generator, time) {
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

  applyUniversalBackground(ctx, width, height, params);
  
  // [Isometric prism visualization code would continue here...]
  // This template contains extensive 3D prism rendering code with
  // surface text projection and light refraction effects
}`;