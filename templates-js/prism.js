function drawVisualization(ctx, width, height, params, time, utils) {
  // Apply background
  utils.applyUniversalBackground(ctx, width, height, params);
  
  // Load parameters with new system
  const p = utils.params.load(params, ctx, width, height, time, { parameters });
  
  // Calculate dimensions
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Base scale
  const baseScale = Math.min(width, height) / 400;
  const scaledAmplitude = p.amplitude * baseScale;
  
  // Animation
  const animationPhase = time * p.frequency;
  const breathingScale = 1 + Math.sin(animationPhase) * 0.05;
  
  // Calculate prism geometry
  const radius = scaledAmplitude * breathingScale;
  const depth = radius * p.depthRatio;
  
  // Convert degrees to radians
  const shapeRotation = p.shapeRotation * (Math.PI / 180);
  const perspectiveAngle = p.perspectiveAngle * (Math.PI / 180);
  const rotationY = p.rotationY * (Math.PI / 180);
  const rotationX = p.rotationX * (Math.PI / 180);
  
  // Isometric projection helpers
  const cos30 = Math.cos(perspectiveAngle);
  const sin30 = Math.sin(perspectiveAngle);
  
  // Generate front face vertices
  const frontVertices = [];
  for (let i = 0; i < p.prismSides; i++) {
    const angle = (i / p.prismSides) * Math.PI * 2 + shapeRotation;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius * p.prismHeight;
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
  if (p.showInternalStructure) {
    ctx.save();
    ctx.globalAlpha = 0.6;
    
    // Draw back face with rounded corners if needed
    if (p.cornerRadius > 0) {
      drawRoundedPolygon(ctx, backVertices, p.cornerRadius * 0.8);
    } else {
      ctx.beginPath();
      backVertices.forEach((v, i) => {
        if (i === 0) ctx.moveTo(v.x, v.y);
        else ctx.lineTo(v.x, v.y);
      });
      ctx.closePath();
    }
    
    // Apply universal fill with darker shade for back face
    const bounds = getBounds(backVertices);
    utils.applyUniversalFill(ctx, bounds.width, bounds.height, params, {
      x: bounds.minX,
      y: bounds.minY,
      darken: p.faceShading
    });
    
    // Apply universal stroke
    utils.applyUniversalStroke(ctx, params, { opacity: 0.7 });
    
    ctx.restore();
  }
  
  // Draw side faces
  const visibleFaces = [];
  for (let i = 0; i < p.prismSides; i++) {
    const nextI = (i + 1) % p.prismSides;
    
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
        brightness: -p.faceShading * 0.5 * (1 + normal.x / Math.sqrt(normal.x * normal.x + normal.y * normal.y))
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
    ctx.globalAlpha = 0.8;
    
    ctx.beginPath();
    face.vertices.forEach((v, i) => {
      if (i === 0) ctx.moveTo(v.x, v.y);
      else ctx.lineTo(v.x, v.y);
    });
    ctx.closePath();
    
    // Apply universal fill with brightness adjustment
    const faceBounds = getBounds(face.vertices);
    utils.applyUniversalFill(ctx, faceBounds.width, faceBounds.height, params, {
      x: faceBounds.minX,
      y: faceBounds.minY,
      darken: face.brightness
    });
    
    // Apply universal stroke
    utils.applyUniversalStroke(ctx, params, { opacity: 0.6 });
    
    ctx.restore();
  });
  
  // Draw connecting edges
  if (p.showInternalStructure) {
    ctx.save();
    
    for (let i = 0; i < p.prismSides; i++) {
      ctx.beginPath();
      ctx.moveTo(frontVertices[i].x, frontVertices[i].y);
      ctx.lineTo(backVertices[i].x, backVertices[i].y);
      ctx.stroke();
    }
    
    // Apply universal stroke
    utils.applyUniversalStroke(ctx, params, { opacity: 0.5 });
    
    ctx.restore();
  }
  
  // Draw front face
  ctx.save();
  
  if (p.cornerRadius > 0) {
    drawRoundedPolygon(ctx, frontVertices, p.cornerRadius);
  } else {
    ctx.beginPath();
    frontVertices.forEach((v, i) => {
      if (i === 0) ctx.moveTo(v.x, v.y);
      else ctx.lineTo(v.x, v.y);
    });
    ctx.closePath();
  }
  
  // Apply universal fill
  const frontBounds = getBounds(frontVertices);
  utils.applyUniversalFill(ctx, frontBounds.width, frontBounds.height, params, {
    x: frontBounds.minX,
    y: frontBounds.minY
  });
  
  // Apply universal stroke
  utils.applyUniversalStroke(ctx, params);
  
  ctx.restore();
  
  // Add subtle inner highlight
  ctx.save();
  ctx.globalAlpha = 0.3;
  
  const highlightVertices = frontVertices.map(v => ({
    x: v.x * 0.7,
    y: v.y * 0.7
  }));
  
  if (p.cornerRadius > 0) {
    drawRoundedPolygon(ctx, highlightVertices, p.cornerRadius * 0.7);
  } else {
    ctx.beginPath();
    highlightVertices.forEach((v, i) => {
      if (i === 0) ctx.moveTo(v.x, v.y);
      else ctx.lineTo(v.x, v.y);
    });
    ctx.closePath();
  }
  
  // Apply lighter fill for highlight
  const highlightBounds = getBounds(highlightVertices);
  utils.applyUniversalFill(ctx, highlightBounds.width, highlightBounds.height, params, {
    x: highlightBounds.minX,
    y: highlightBounds.minY,
    lighten: 0.2
  });
  
  ctx.restore();
  
  ctx.restore();
  
  // Helper functions
  function drawRoundedPolygon(ctx, vertices, radius) {
    if (vertices.length < 3) return;
    
    ctx.beginPath();
    
    for (let i = 0; i < vertices.length; i++) {
      const current = vertices[i];
      const next = vertices[(i + 1) % vertices.length];
      const prev = vertices[(i - 1 + vertices.length) % vertices.length];
      
      // Calculate angles for rounded corners
      const angle1 = Math.atan2(current.y - prev.y, current.x - prev.x);
      const angle2 = Math.atan2(next.y - current.y, next.x - current.x);
      
      const cornerX1 = current.x - Math.cos(angle1) * radius;
      const cornerY1 = current.y - Math.sin(angle1) * radius;
      const cornerX2 = current.x + Math.cos(angle2) * radius;
      const cornerY2 = current.y + Math.sin(angle2) * radius;
      
      if (i === 0) {
        ctx.moveTo(cornerX1, cornerY1);
      } else {
        ctx.lineTo(cornerX1, cornerY1);
      }
      
      ctx.quadraticCurveTo(current.x, current.y, cornerX2, cornerY2);
    }
    
    ctx.closePath();
  }
  
  function getBounds(vertices) {
    const xs = vertices.map(v => v.x);
    const ys = vertices.map(v => v.y);
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

const parameters = {
  frequency: { default: 0.6, range: [0.1, 2.0, 0.1] },
  amplitude: { default: 100, range: [50, 200, 5] },
  prismSides: { default: 6, range: [3, 12, 1] },
  prismHeight: { default: 1, range: [0.5, 2.0, 0.1] },
  cornerRadius: { default: 4, range: [0, 20, 1] },
  shapeRotation: { default: 0, range: [0, 360, 5] },
  showInternalStructure: { default: true, range: [false, true] },
  depthRatio: { default: 0.6, range: [0.2, 1.0, 0.1] },
  perspectiveAngle: { default: 30, range: [10, 60, 5] },
  rotationY: { default: 0, range: [-45, 45, 5] },
  rotationX: { default: 0, range: [-45, 45, 5] },
  faceShading: { default: 0.15, range: [0, 0.5, 0.05] }
};

export const metadata = {
  id: 'prism',
  name: "🔮 Prism",
  description: "Clean geometric prism with isometric 3D perspective and subtle animation",
  category: 'geometry',
  tags: ['3d', 'prism', 'geometric', 'isometric', 'polygon'],
  parameters,
  defaultParams: {
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
    faceShading: 0.15
  }
};

export { parameters, drawVisualization };