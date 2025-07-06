/**
 * 🔮 Prism
 * 
 * Clean geometric prism with isometric 3D perspective and subtle animation
 */

function draw(ctx, width, height, params, time, utils) {
  // Apply background
  utils.background.apply(ctx, width, height, params);
  
  // Extract parameters with defaults
  const frequency = params.frequency || 0.6;
  const amplitude = params.amplitude || 100;
  const prismSides = params.prismSides || 6;
  const prismHeight = params.prismHeight || 1;
  const cornerRadius = params.cornerRadius || 4;
  const shapeRotation = (params.shapeRotation || 0) * (Math.PI / 180);
  const showInternalStructure = params.showInternalStructure ?? true;
  const depthRatio = params.depthRatio || 0.6;
  const perspectiveAngle = (params.perspectiveAngle || 30) * (Math.PI / 180);
  const rotationY = (params.rotationY || 0) * (Math.PI / 180);
  const rotationX = (params.rotationX || 0) * (Math.PI / 180);
  const faceShading = params.faceShading || 0.15;
  
  // Theme colors
  const fillColor = params.fillColor || '#3b82f6';
  const strokeColor = params.strokeColor || '#1e40af';
  const fillOpacity = params.fillOpacity ?? 1;
  const strokeOpacity = params.strokeOpacity ?? 1;
  
  // Calculate dimensions
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Base scale
  const baseScale = Math.min(width, height) / 400;
  const scaledAmplitude = amplitude * baseScale;
  
  // Animation
  const animationPhase = time * frequency;
  const breathingScale = 1 + Math.sin(animationPhase) * 0.05;
  
  // Calculate prism geometry
  const radius = scaledAmplitude * breathingScale;
  const depth = radius * depthRatio;
  
  // Isometric projection helpers
  const cos30 = Math.cos(perspectiveAngle);
  const sin30 = Math.sin(perspectiveAngle);
  
  // Generate front face vertices
  const frontVertices = [];
  for (let i = 0; i < prismSides; i++) {
    const angle = (i / prismSides) * Math.PI * 2 + shapeRotation;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius * prismHeight;
    frontVertices.push({ x, y });
  }
  
  // Generate back face vertices (projected)
  const backVertices = frontVertices.map(v => ({
    x: v.x + depth * cos30,
    y: v.y - depth * sin30
  }));
  
  // Draw faces
  ctx.save();
  ctx.translate(centerX, centerY);
  
  // Apply 3D rotations
  if (rotationY !== 0 || rotationX !== 0) {
    // Simple rotation approximation
    const cosY = Math.cos(rotationY);
    const sinY = Math.sin(rotationY);
    const cosX = Math.cos(rotationX);
    const sinX = Math.sin(rotationX);
    
    frontVertices.forEach(v => {
      const rotY = v.x * cosY - v.y * sinY;
      const rotX = v.y * cosX;
      v.x = rotY;
      v.y = rotX;
    });
    
    // Also rotate back vertices
    backVertices.forEach(v => {
      const origX = v.x - depth * cos30;
      const origY = v.y + depth * sin30;
      const rotY = origX * cosY - origY * sinY;
      const rotX = origY * cosX;
      v.x = rotY + depth * cos30;
      v.y = rotX - depth * sin30;
    });
  }
  
  // Draw back face (if visible)
  if (showInternalStructure) {
    ctx.save();
    ctx.globalAlpha = fillOpacity * 0.6;
    
    // Draw back face with rounded corners if needed
    if (cornerRadius > 0) {
      utils.canvas.drawRoundedPolygon(ctx, backVertices, cornerRadius * 0.8);
    } else {
      ctx.beginPath();
      backVertices.forEach((v, i) => {
        if (i === 0) ctx.moveTo(v.x, v.y);
        else ctx.lineTo(v.x, v.y);
      });
      ctx.closePath();
    }
    
    // Darker fill for back face
    ctx.fillStyle = utils.color.adjustBrightness(fillColor, -faceShading);
    ctx.fill();
    
    // Back face stroke
    if (params.strokeType !== 'none' && params.strokeWidth > 0) {
      ctx.globalAlpha = strokeOpacity * 0.7;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1;
      
      if (params.strokeType === 'dashed') {
        ctx.setLineDash([params.strokeDashSize || 5, params.strokeGapSize || 5]);
      } else if (params.strokeType === 'dotted') {
        ctx.setLineDash([params.strokeDashSize || 2, params.strokeGapSize || 3]);
      }
      
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    ctx.restore();
  }
  
  // Draw side faces
  const visibleFaces = [];
  for (let i = 0; i < prismSides; i++) {
    const nextI = (i + 1) % prismSides;
    
    // Calculate face normal to determine visibility (simple approximation)
    const dx = frontVertices[nextI].x - frontVertices[i].x;
    const dy = frontVertices[nextI].y - frontVertices[i].y;
    const normal = { x: dy, y: -dx };
    
    // If normal points somewhat towards viewer, face is visible
    if (normal.y < 0) {
      visibleFaces.push({
        vertices: [
          frontVertices[i],
          frontVertices[nextI],
          backVertices[nextI],
          backVertices[i]
        ],
        brightness: -faceShading * 0.5 * (1 + normal.x / Math.sqrt(normal.x * normal.x + normal.y * normal.y))
      });
    }
  }
  
  // Sort faces by depth (painter's algorithm)
  visibleFaces.sort((a, b) => {
    const aDepth = a.vertices.reduce((sum, v) => sum + v.y, 0) / 4;
    const bDepth = b.vertices.reduce((sum, v) => sum + v.y, 0) / 4;
    return bDepth - aDepth;
  });
  
  // Draw visible side faces
  visibleFaces.forEach(face => {
    ctx.save();
    ctx.globalAlpha = fillOpacity * 0.8;
    
    ctx.beginPath();
    face.vertices.forEach((v, i) => {
      if (i === 0) ctx.moveTo(v.x, v.y);
      else ctx.lineTo(v.x, v.y);
    });
    ctx.closePath();
    
    ctx.fillStyle = utils.color.adjustBrightness(fillColor, face.brightness);
    ctx.fill();
    
    if (params.strokeType !== 'none' && params.strokeWidth > 0) {
      ctx.globalAlpha = strokeOpacity * 0.6;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1;
      
      if (params.strokeType === 'dashed') {
        ctx.setLineDash([params.strokeDashSize || 5, params.strokeGapSize || 5]);
      } else if (params.strokeType === 'dotted') {
        ctx.setLineDash([params.strokeDashSize || 2, params.strokeGapSize || 3]);
      }
      
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    ctx.restore();
  });
  
  // Draw connecting edges
  if (showInternalStructure) {
    ctx.save();
    ctx.globalAlpha = strokeOpacity * 0.5;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1;
    
    if (params.strokeType === 'dashed') {
      ctx.setLineDash([params.strokeDashSize || 5, params.strokeGapSize || 5]);
    } else if (params.strokeType === 'dotted') {
      ctx.setLineDash([params.strokeDashSize || 2, params.strokeGapSize || 3]);
    }
    
    for (let i = 0; i < prismSides; i++) {
      ctx.beginPath();
      ctx.moveTo(frontVertices[i].x, frontVertices[i].y);
      ctx.lineTo(backVertices[i].x, backVertices[i].y);
      ctx.stroke();
    }
    
    ctx.setLineDash([]);
    ctx.restore();
  }
  
  // Draw front face
  ctx.save();
  ctx.globalAlpha = fillOpacity;
  
  if (cornerRadius > 0) {
    utils.canvas.drawRoundedPolygon(ctx, frontVertices, cornerRadius);
  } else {
    ctx.beginPath();
    frontVertices.forEach((v, i) => {
      if (i === 0) ctx.moveTo(v.x, v.y);
      else ctx.lineTo(v.x, v.y);
    });
    ctx.closePath();
  }
  
  // Fill front face
  ctx.fillStyle = fillColor;
  ctx.fill();
  
  // Stroke front face
  if (params.strokeType !== 'none' && params.strokeWidth > 0) {
    ctx.globalAlpha = strokeOpacity;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = params.strokeWidth || 2;
    
    if (params.strokeType === 'dashed') {
      ctx.setLineDash([params.strokeDashSize || 5, params.strokeGapSize || 5]);
    } else if (params.strokeType === 'dotted') {
      ctx.setLineDash([params.strokeDashSize || 2, params.strokeGapSize || 3]);
    }
    
    ctx.stroke();
    ctx.setLineDash([]);
  }
  
  ctx.restore();
  
  // Add subtle inner highlight
  ctx.save();
  ctx.globalAlpha = 0.3;
  
  const highlightVertices = frontVertices.map(v => ({
    x: v.x * 0.7,
    y: v.y * 0.7
  }));
  
  if (cornerRadius > 0) {
    utils.canvas.drawRoundedPolygon(ctx, highlightVertices, cornerRadius * 0.7);
  } else {
    ctx.beginPath();
    highlightVertices.forEach((v, i) => {
      if (i === 0) ctx.moveTo(v.x, v.y);
      else ctx.lineTo(v.x, v.y);
    });
    ctx.closePath();
  }
  
  ctx.fillStyle = utils.color.adjustBrightness(fillColor, 0.2);
  ctx.fill();
  ctx.restore();
  
  ctx.restore();
  
  // Debug info
  if (utils.debug) {
    utils.debug.log('Prism rendered', {
      sides: prismSides,
      radius: radius.toFixed(1),
      depth: depth.toFixed(1),
      visibleFaces: visibleFaces.length,
      time: time.toFixed(2)
    });
  }
}