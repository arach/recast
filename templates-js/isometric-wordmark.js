/**
 * 🏷️ Isometric Wordmark
 * 
 * Clean isometric wordmark with simplified 3D effect
 * Perfect for brand identity with elegant depth and optional layers
 */

function draw(ctx, width, height, params, time, utils) {
  // Load and process all parameters
  const p = utils.params.load(params, ctx, width, height, time, { parameters });
  
  // Enable crisp edges for sharp rendering
  ctx.imageSmoothingEnabled = false;
  
  // Calculate positioning with viewport support for infinite canvas
  const viewport = p._viewport || { offsetX: 0, offsetY: 0, zoom: 1 };
  // Ensure pixel-perfect alignment by rounding coordinates
  const centerX = Math.round((width / 2) + viewport.offsetX);
  const centerY = Math.round((height / 2) + viewport.offsetY);
  const baseScale = Math.min(width, height) / 400 * viewport.zoom;
  
  // Animation calculations
  const animTime = time * p.animationSpeed;
  const breathingPhase = Math.sin(animTime * 0.8) * p.breathingIntensity;
  
  // Transform canvas to center
  ctx.save();
  ctx.translate(centerX, centerY);
  
  // Calculate isometric angle based on perspective parameter
  const isoAngle = Math.PI / 6 + (p.perspective * Math.PI / 180); // 30° + adjustment
  
  // Calculate platform dimensions - make it upright (taller than wide)
  const platformWidth = p.platformWidth * baseScale;
  const platformDepth = p.platformDepth * baseScale;
  const platformHeight = p.platformHeight * baseScale;
  const cornerRadius = p.cornerRadius * baseScale;
  
  // Layer configuration
  const layerCount = Math.floor(p.layerCount);
  const layerSpacing = p.layerSpacing * baseScale;
  
  // Draw platforms from bottom to top
  for (let i = 0; i < layerCount; i++) {
    const layerIndex = layerCount - 1 - i;
    const layerZ = layerIndex * layerSpacing;
    
    // Calculate layer size (each layer slightly smaller)
    const layerScale = 1 - (layerIndex * p.layerTaper);
    const layerWidth = platformWidth * layerScale;
    const layerDepth = platformDepth * layerScale;
    
    // Layer breathing effect
    const layerBreathing = 1 + breathingPhase * 0.1 * (1 - layerIndex * 0.3);
    const finalWidth = layerWidth * layerBreathing;
    const finalDepth = layerDepth * layerBreathing;
    
    // Layer color
    const layerColor = getLayerColor(p.colorScheme, layerIndex, layerCount);
    
    // Draw the rounded platform (upright rectangle)
    // Only apply corner radius to the face with the wordmark
    drawUprightRoundedPlatform(
      ctx, 
      -finalWidth / 2, 
      -finalDepth / 2, 
      layerZ, 
      finalWidth, 
      finalDepth, 
      platformHeight, 
      cornerRadius * layerScale, 
      layerColor,
      p.lighting,
      utils,
      isoAngle,
      p.wordmarkFace || 'front'
    );
  }
  
  // Draw wordmark on selected face
  if (p.wordmark && p.wordmark.trim()) {
    const textSize = p.textSize * baseScale;
    const maxTextWidth = platformWidth * 0.8;
    
    switch (p.wordmarkFace) {
      case 'front':
        // Front face - vertical face facing viewer
        drawFrontFaceWordmark(
          ctx, 
          p.wordmark, 
          0, // Center X
          platformDepth/2, // Y position at front of platform
          (layerCount - 1) * layerSpacing + platformHeight/2, // Z position at middle height
          textSize, 
          p.textColor, 
          p.textStyle,
          p.textShadow * baseScale,
          maxTextWidth,
          utils,
          isoAngle,
          p.textOrientation
        );
        break;
        
      case 'top':
        // Top face - horizontal face
        drawTopFaceWordmark(
          ctx,
          p.wordmark,
          0, // Center X
          0, // Center Y 
          (layerCount - 1) * layerSpacing + platformHeight, // Z position at top
          textSize,
          p.textColor,
          p.textStyle,
          p.textShadow * baseScale,
          maxTextWidth,
          platformDepth * 0.8,
          utils,
          isoAngle,
          p.textOrientation
        );
        break;
        
      case 'side':
        // Right side face
        drawSideFaceWordmark(
          ctx,
          p.wordmark,
          platformWidth/2, // X position at right edge
          0, // Center Y
          (layerCount - 1) * layerSpacing + platformHeight/2, // Z position at middle height
          textSize,
          p.textColor,
          p.textStyle,
          p.textShadow * baseScale,
          platformDepth * 0.8,
          utils,
          isoAngle,
          p.textOrientation
        );
        break;
    }
  }
  
  ctx.restore();
}

/**
 * Draw an upright rounded rectangle platform in isometric view
 */
function drawUprightRoundedPlatform(ctx, x, y, z, width, depth, height, radius, color, lighting, utils, isoAngle, wordmarkFace) {
  // Helper function to project 3D to 2D with pixel-perfect alignment
  const project = (px, py, pz) => ({
    x: Math.round((px - py) * Math.cos(isoAngle)),
    y: Math.round((px + py) * Math.sin(isoAngle) - pz)
  });
  
  ctx.save();
  
  // Enable crisp rendering
  ctx.imageSmoothingEnabled = false;
  ctx.lineWidth = 1;
  
  // Draw top face (rounded only if wordmark is on top)
  ctx.fillStyle = lighting ? adjustBrightness(color, 1.0) : color;
  ctx.strokeStyle = lighting ? adjustBrightness(color, 0.9) : adjustBrightness(color, 0.8);
  if (wordmarkFace === 'top') {
    drawRoundedTopFace(ctx, x, y, z + height, width, depth, radius, project);
  } else {
    // Pass radius info if adjacent face has rounded corners
    const adjacentRadius = (wordmarkFace === 'front' || wordmarkFace === 'side') ? radius : 0;
    drawTopFace(ctx, x, y, z + height, width, depth, project, adjacentRadius, wordmarkFace);
  }
  ctx.fill();
  ctx.stroke();
  
  // Draw front face (rounded only if wordmark is on front)
  ctx.fillStyle = lighting ? adjustBrightness(color, 0.8) : color;
  ctx.strokeStyle = lighting ? adjustBrightness(color, 0.7) : adjustBrightness(color, 0.6);
  if (wordmarkFace === 'front') {
    drawRoundedFrontFace(ctx, x, y + depth, z, width, height, radius, project);
  } else {
    // Pass radius info if adjacent face has rounded corners
    const adjacentRadius = (wordmarkFace === 'top' || wordmarkFace === 'side') ? radius : 0;
    drawFrontFace(ctx, x, y + depth, z, width, height, project, adjacentRadius, wordmarkFace);
  }
  ctx.fill();
  ctx.stroke();
  
  // Draw right face (rounded only if wordmark is on side)
  ctx.fillStyle = lighting ? adjustBrightness(color, 0.6) : color;
  ctx.strokeStyle = lighting ? adjustBrightness(color, 0.5) : adjustBrightness(color, 0.4);
  if (wordmarkFace === 'side') {
    drawRoundedRightFace(ctx, x + width, y, z, depth, height, radius, project);
  } else {
    // Pass radius info if adjacent face has rounded corners
    const adjacentRadius = (wordmarkFace === 'front' || wordmarkFace === 'top') ? radius : 0;
    drawRightFace(ctx, x + width, y, z, depth, height, project, adjacentRadius, wordmarkFace);
  }
  ctx.fill();
  ctx.stroke();
  
  // Draw connecting edges that follow the rounded face's curves
  if (radius > 0) {
    ctx.strokeStyle = lighting ? adjustBrightness(color, 0.4) : adjustBrightness(color, 0.3);
    ctx.lineWidth = 1;
    drawConnectingEdges(ctx, x, y, z, width, depth, height, radius, project, wordmarkFace);
  }
  
  ctx.restore();
}

/**
 * Draw rounded top face
 */
function drawRoundedTopFace(ctx, x, y, z, width, depth, radius, project) {
  ctx.beginPath();
  
  // Clamp radius to not exceed half the smallest dimension
  const maxRadius = Math.min(width, depth) / 2;
  const actualRadius = Math.min(radius, maxRadius);
  const segments = 8;
  
  if (actualRadius > 0) {
    // Start from top-left corner (after radius)
    let p = project(x + actualRadius, y, z);
    ctx.moveTo(p.x, p.y);
    
    // Top edge
    p = project(x + width - actualRadius, y, z);
    ctx.lineTo(p.x, p.y);
    
    // Top-right corner (rounded)
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI / 2;
      const px = x + width - actualRadius + actualRadius * Math.sin(angle);
      const py = y + actualRadius * (1 - Math.cos(angle));
      p = project(px, py, z);
      ctx.lineTo(p.x, p.y);
    }
    
    // Right edge
    p = project(x + width, y + depth - actualRadius, z);
    ctx.lineTo(p.x, p.y);
    
    // Bottom-right corner (rounded)
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI / 2;
      const px = x + width - actualRadius * (1 - Math.cos(angle));
      const py = y + depth - actualRadius + actualRadius * Math.sin(angle);
      p = project(px, py, z);
      ctx.lineTo(p.x, p.y);
    }
    
    // Bottom edge
    p = project(x + actualRadius, y + depth, z);
    ctx.lineTo(p.x, p.y);
    
    // Bottom-left corner (rounded)
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI / 2;
      const px = x + actualRadius - actualRadius * Math.sin(angle);
      const py = y + depth - actualRadius * (1 - Math.cos(angle));
      p = project(px, py, z);
      ctx.lineTo(p.x, p.y);
    }
    
    // Left edge
    p = project(x, y + actualRadius, z);
    ctx.lineTo(p.x, p.y);
    
    // Top-left corner (rounded)
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI / 2;
      const px = x + actualRadius * (1 - Math.cos(angle));
      const py = y + actualRadius - actualRadius * Math.sin(angle);
      p = project(px, py, z);
      ctx.lineTo(p.x, p.y);
    }
  } else {
    // No radius - draw straight edges
    let p = project(x, y, z);
    ctx.moveTo(p.x, p.y);
    
    p = project(x + width, y, z);
    ctx.lineTo(p.x, p.y);
    
    p = project(x + width, y + depth, z);
    ctx.lineTo(p.x, p.y);
    
    p = project(x, y + depth, z);
    ctx.lineTo(p.x, p.y);
  }
  
  ctx.closePath();
}

/**
 * Draw rounded front face (upright)
 */
function drawRoundedFrontFace(ctx, x, y, z, width, height, radius, project) {
  ctx.beginPath();
  
  // Clamp radius to not exceed half the smallest dimension
  const maxRadius = Math.min(width, height) / 2;
  const actualRadius = Math.min(radius, maxRadius);
  
  if (actualRadius > 0) {
    // Start from bottom-left corner (after radius)
    let p = project(x + actualRadius, y, z);
    ctx.moveTo(p.x, p.y);
    
    // Bottom edge
    p = project(x + width - actualRadius, y, z);
    ctx.lineTo(p.x, p.y);
    
    // Bottom-right corner (rounded)
    const segments = 8;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI / 2;
      const px = x + width - actualRadius + actualRadius * Math.sin(angle);
      const pz = z + actualRadius * (1 - Math.cos(angle));
      p = project(px, y, pz);
      ctx.lineTo(p.x, p.y);
    }
  } else {
    // No radius - start from bottom-left
    let p = project(x, y, z);
    ctx.moveTo(p.x, p.y);
    
    // Bottom edge
    p = project(x + width, y, z);
    ctx.lineTo(p.x, p.y);
  }
  
  if (actualRadius > 0) {
    // Right edge
    p = project(x + width, y, z + height - actualRadius);
    ctx.lineTo(p.x, p.y);
    
    // Top-right corner (rounded)
    const segments = 8;
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI / 2;
      const px = x + width - actualRadius * (1 - Math.cos(angle));
      const pz = z + height - actualRadius + actualRadius * Math.sin(angle);
      p = project(px, y, pz);
      ctx.lineTo(p.x, p.y);
    }
    
    // Top edge
    p = project(x + actualRadius, y, z + height);
    ctx.lineTo(p.x, p.y);
    
    // Top-left corner (rounded)
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI / 2;
      const px = x + actualRadius - actualRadius * Math.sin(angle);
      const pz = z + height - actualRadius * (1 - Math.cos(angle));
      p = project(px, y, pz);
      ctx.lineTo(p.x, p.y);
    }
    
    // Left edge
    p = project(x, y, z + actualRadius);
    ctx.lineTo(p.x, p.y);
    
    // Bottom-left corner (rounded)
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI / 2;
      const px = x + actualRadius * (1 - Math.cos(angle));
      const pz = z + actualRadius - actualRadius * Math.sin(angle);
      p = project(px, y, pz);
      ctx.lineTo(p.x, p.y);
    }
  } else {
    // No radius - draw straight edges
    p = project(x + width, y, z + height);
    ctx.lineTo(p.x, p.y);
    
    p = project(x, y, z + height);
    ctx.lineTo(p.x, p.y);
    
    p = project(x, y, z);
    ctx.lineTo(p.x, p.y);
  }
  
  ctx.closePath();
}

/**
 * Draw rounded right face (side face)
 */
function drawRoundedRightFace(ctx, x, y, z, depth, height, radius, project) {
  ctx.beginPath();
  
  // Clamp radius to not exceed half the smallest dimension
  const maxRadius = Math.min(depth, height) / 2;
  const actualRadius = Math.min(radius, maxRadius);
  const segments = 8;
  
  if (actualRadius > 0) {
    // Start from bottom-back corner (after radius)
    let p = project(x, y + actualRadius, z);
    ctx.moveTo(p.x, p.y);
    
    // Bottom edge
    p = project(x, y + depth - actualRadius, z);
    ctx.lineTo(p.x, p.y);
    
    // Bottom-front corner (rounded)
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI / 2;
      const py = y + depth - actualRadius + actualRadius * Math.sin(angle);
      const pz = z + actualRadius * (1 - Math.cos(angle));
      p = project(x, py, pz);
      ctx.lineTo(p.x, p.y);
    }
    
    // Front edge
    p = project(x, y + depth, z + height - actualRadius);
    ctx.lineTo(p.x, p.y);
    
    // Top-front corner (rounded)
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI / 2;
      const py = y + depth - actualRadius * (1 - Math.cos(angle));
      const pz = z + height - actualRadius + actualRadius * Math.sin(angle);
      p = project(x, py, pz);
      ctx.lineTo(p.x, p.y);
    }
    
    // Top edge
    p = project(x, y + actualRadius, z + height);
    ctx.lineTo(p.x, p.y);
    
    // Top-back corner (rounded)
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI / 2;
      const py = y + actualRadius - actualRadius * Math.sin(angle);
      const pz = z + height - actualRadius * (1 - Math.cos(angle));
      p = project(x, py, pz);
      ctx.lineTo(p.x, p.y);
    }
    
    // Back edge
    p = project(x, y, z + actualRadius);
    ctx.lineTo(p.x, p.y);
    
    // Bottom-back corner (rounded)
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI / 2;
      const py = y + actualRadius * (1 - Math.cos(angle));
      const pz = z + actualRadius - actualRadius * Math.sin(angle);
      p = project(x, py, pz);
      ctx.lineTo(p.x, p.y);
    }
  } else {
    // No radius - draw straight edges
    let p = project(x, y, z);
    ctx.moveTo(p.x, p.y);
    
    p = project(x, y + depth, z);
    ctx.lineTo(p.x, p.y);
    
    p = project(x, y + depth, z + height);
    ctx.lineTo(p.x, p.y);
    
    p = project(x, y, z + height);
    ctx.lineTo(p.x, p.y);
  }
  
  ctx.closePath();
}

/**
 * Draw right face with curved edges if adjacent face has rounded corners
 */
function drawRightFace(ctx, x, y, z, depth, height, project, radius = 0, roundedFace = null) {
  ctx.beginPath();
  
  const actualRadius = Math.min(radius, Math.min(depth, height) / 2);
  
  if (actualRadius > 0 && roundedFace) {
    // If front face has rounded corners, adjust front edge
    if (roundedFace === 'front') {
      // Start from front-bottom corner (with curve)
      let p = project(x, y + depth - actualRadius, z);
      ctx.moveTo(p.x, p.y);
      
      // Bottom edge
      p = project(x, y + actualRadius, z);
      ctx.lineTo(p.x, p.y);
      
      // Back-bottom corner
      p = project(x, y, z);
      ctx.lineTo(p.x, p.y);
      
      // Back edge
      p = project(x, y, z + height);
      ctx.lineTo(p.x, p.y);
      
      // Top edge
      p = project(x, y + depth - actualRadius, z + height);
      ctx.lineTo(p.x, p.y);
      
      // Front-top curve
      drawCurvedCorner(ctx, project, x, y + depth - actualRadius, z + height, x, y + depth, z + height - actualRadius, actualRadius);
      
      // Front edge with curves
      p = project(x, y + depth, z + actualRadius);
      ctx.lineTo(p.x, p.y);
      
      // Front-bottom curve
      drawCurvedCorner(ctx, project, x, y + depth, z + actualRadius, x, y + depth - actualRadius, z, actualRadius);
    }
    // Similar logic for top face rounded corners
    else if (roundedFace === 'top') {
      // Adjust top edge for curved corners
      let p = project(x, y, z);
      ctx.moveTo(p.x, p.y);
      
      // Bottom edge
      p = project(x, y + depth, z);
      ctx.lineTo(p.x, p.y);
      
      // Front edge
      p = project(x, y + depth, z + height - actualRadius);
      ctx.lineTo(p.x, p.y);
      
      // Top-front curve
      drawCurvedCorner(ctx, project, x, y + depth, z + height - actualRadius, x, y + depth - actualRadius, z + height, actualRadius);
      
      // Top edge with curves
      p = project(x, y + actualRadius, z + height);
      ctx.lineTo(p.x, p.y);
      
      // Top-back curve
      drawCurvedCorner(ctx, project, x, y + actualRadius, z + height, x, y, z + height - actualRadius, actualRadius);
      
      // Back edge
      p = project(x, y, z + actualRadius);
      ctx.lineTo(p.x, p.y);
    }
  } else {
    // Standard rectangular right face
    let p = project(x, y, z);
    ctx.moveTo(p.x + 0.5, p.y + 0.5);
    
    p = project(x, y + depth, z);
    ctx.lineTo(p.x, p.y);
    
    p = project(x, y + depth, z + height);
    ctx.lineTo(p.x, p.y);
    
    p = project(x, y, z + height);
    ctx.lineTo(p.x, p.y);
  }
  
  ctx.closePath();
}

/**
 * Draw top face with curved edges if adjacent face has rounded corners
 */
function drawTopFace(ctx, x, y, z, width, depth, project, radius = 0, roundedFace = null) {
  ctx.beginPath();
  
  const actualRadius = Math.min(radius, Math.min(width, depth) / 2);
  
  if (actualRadius > 0 && roundedFace) {
    // If front face has rounded corners, adjust front edge
    if (roundedFace === 'front') {
      // Start from front-left corner (with curve)
      let p = project(x + actualRadius, y + depth, z);
      ctx.moveTo(p.x, p.y);
      
      // Front edge with curves
      p = project(x + width - actualRadius, y + depth, z);
      ctx.lineTo(p.x, p.y);
      
      // Front-right curve
      drawCurvedCorner(ctx, project, x + width - actualRadius, y + depth, z, x + width, y + depth - actualRadius, z, actualRadius);
      
      // Right edge
      p = project(x + width, y + actualRadius, z);
      ctx.lineTo(p.x, p.y);
      
      // Back-right corner
      p = project(x + width, y, z);
      ctx.lineTo(p.x, p.y);
      
      // Back edge
      p = project(x, y, z);
      ctx.lineTo(p.x, p.y);
      
      // Left edge
      p = project(x, y + depth - actualRadius, z);
      ctx.lineTo(p.x, p.y);
      
      // Front-left curve
      drawCurvedCorner(ctx, project, x, y + depth - actualRadius, z, x + actualRadius, y + depth, z, actualRadius);
    }
    // Similar logic for side face rounded corners
    else if (roundedFace === 'side') {
      // Adjust right edge for curved corners
      let p = project(x, y, z);
      ctx.moveTo(p.x, p.y);
      
      // Top edge
      p = project(x + width - actualRadius, y, z);
      ctx.lineTo(p.x, p.y);
      
      // Back-right curve
      drawCurvedCorner(ctx, project, x + width - actualRadius, y, z, x + width, y + actualRadius, z, actualRadius);
      
      // Right edge with curves
      p = project(x + width, y + depth - actualRadius, z);
      ctx.lineTo(p.x, p.y);
      
      // Front-right curve
      drawCurvedCorner(ctx, project, x + width, y + depth - actualRadius, z, x + width - actualRadius, y + depth, z, actualRadius);
      
      // Bottom edge
      p = project(x, y + depth, z);
      ctx.lineTo(p.x, p.y);
    }
  } else {
    // Standard rectangular top face
    let p = project(x, y, z);
    ctx.moveTo(p.x + 0.5, p.y + 0.5);
    
    p = project(x + width, y, z);
    ctx.lineTo(p.x, p.y);
    
    p = project(x + width, y + depth, z);
    ctx.lineTo(p.x, p.y);
    
    p = project(x, y + depth, z);
    ctx.lineTo(p.x, p.y);
  }
  
  ctx.closePath();
}

/**
 * Draw front face with curved edges if adjacent face has rounded corners
 */
function drawFrontFace(ctx, x, y, z, width, height, project, radius = 0, roundedFace = null) {
  ctx.beginPath();
  
  const actualRadius = Math.min(radius, Math.min(width, height) / 2);
  
  if (actualRadius > 0 && roundedFace) {
    // If top face has rounded corners, adjust top edge
    if (roundedFace === 'top') {
      // Start from top-left corner (with curve)
      let p = project(x + actualRadius, y, z + height);
      ctx.moveTo(p.x, p.y);
      
      // Top edge with curves
      p = project(x + width - actualRadius, y, z + height);
      ctx.lineTo(p.x, p.y);
      
      // Top-right curve
      drawCurvedCorner(ctx, project, x + width - actualRadius, y, z + height, x + width, y, z + height - actualRadius, actualRadius);
      
      // Right edge
      p = project(x + width, y, z + actualRadius);
      ctx.lineTo(p.x, p.y);
      
      // Bottom-right corner
      p = project(x + width, y, z);
      ctx.lineTo(p.x, p.y);
      
      // Bottom edge
      p = project(x, y, z);
      ctx.lineTo(p.x, p.y);
      
      // Left edge
      p = project(x, y, z + height - actualRadius);
      ctx.lineTo(p.x, p.y);
      
      // Top-left curve
      drawCurvedCorner(ctx, project, x, y, z + height - actualRadius, x + actualRadius, y, z + height, actualRadius);
    }
    // Similar logic for side face rounded corners
    else if (roundedFace === 'side') {
      // Adjust right edge for curved corners
      let p = project(x, y, z);
      ctx.moveTo(p.x, p.y);
      
      // Bottom edge
      p = project(x + width - actualRadius, y, z);
      ctx.lineTo(p.x, p.y);
      
      // Bottom-right curve
      drawCurvedCorner(ctx, project, x + width - actualRadius, y, z, x + width, y, z + actualRadius, actualRadius);
      
      // Right edge with curves
      p = project(x + width, y, z + height - actualRadius);
      ctx.lineTo(p.x, p.y);
      
      // Top-right curve
      drawCurvedCorner(ctx, project, x + width, y, z + height - actualRadius, x + width - actualRadius, y, z + height, actualRadius);
      
      // Top edge
      p = project(x, y, z + height);
      ctx.lineTo(p.x, p.y);
    }
  } else {
    // Standard rectangular front face
    let p = project(x, y, z);
    ctx.moveTo(p.x + 0.5, p.y + 0.5);
    
    p = project(x + width, y, z);
    ctx.lineTo(p.x, p.y);
    
    p = project(x + width, y, z + height);
    ctx.lineTo(p.x, p.y);
    
    p = project(x, y, z + height);
    ctx.lineTo(p.x, p.y);
  }
  
  ctx.closePath();
}

/**
 * Draw rounded right face
 */
function drawRoundedRightFace(ctx, x, y, z, depth, height, radius, project) {
  ctx.beginPath();
  
  // Clamp radius to not exceed half the smallest dimension
  const maxRadius = Math.min(depth, height) / 2;
  const actualRadius = Math.min(radius, maxRadius);
  
  // Start from bottom-front corner (after radius)
  let p = project(x, y + actualRadius, z);
  ctx.moveTo(p.x, p.y);
  
  // Bottom edge
  p = project(x, y + depth - actualRadius, z);
  ctx.lineTo(p.x, p.y);
  
  // Bottom-back corner (rounded)
  if (actualRadius > 0) {
    let p1 = project(x, y + depth, z);
    let p2 = project(x, y + depth, z + actualRadius);
    ctx.arcTo(p1.x, p1.y, p2.x, p2.y, actualRadius);
  }
  
  // Back edge
  p = project(x, y + depth, z + height - actualRadius);
  ctx.lineTo(p.x, p.y);
  
  // Top-back corner (rounded)
  if (actualRadius > 0) {
    let p1 = project(x, y + depth, z + height);
    let p2 = project(x, y + depth - actualRadius, z + height);
    ctx.arcTo(p1.x, p1.y, p2.x, p2.y, actualRadius);
  }
  
  // Top edge
  p = project(x, y + actualRadius, z + height);
  ctx.lineTo(p.x, p.y);
  
  // Top-front corner (rounded)
  if (actualRadius > 0) {
    let p1 = project(x, y, z + height);
    let p2 = project(x, y, z + height - actualRadius);
    ctx.arcTo(p1.x, p1.y, p2.x, p2.y, actualRadius);
  }
  
  // Front edge
  p = project(x, y, z + actualRadius);
  ctx.lineTo(p.x, p.y);
  
  // Bottom-front corner (rounded)
  if (actualRadius > 0) {
    let p1 = project(x, y, z);
    let p2 = project(x, y + actualRadius, z);
    ctx.arcTo(p1.x, p1.y, p2.x, p2.y, actualRadius);
  }
  
  ctx.closePath();
}

/**
 * Draw connecting edges that follow the rounded face's curves
 */
function drawConnectingEdges(ctx, x, y, z, width, depth, height, radius, project, wordmarkFace) {
  // Clamp radius to not exceed half the smallest dimension
  const maxRadius = Math.min(width, depth, height) / 2;
  const actualRadius = Math.min(radius, maxRadius);
  
  if (actualRadius <= 0) return;
  
  ctx.save();
  ctx.lineWidth = 1;
  
  // Draw edges based on which face has the wordmark (and rounded corners)
  
  if (wordmarkFace === 'front') {
    // Front face has rounded corners - draw curved edges extending from it
    // Top edges connecting to front face corners
    drawCurvedConnectingEdge(ctx, project,
      x + actualRadius, y + depth, z + height,      // front face top-left corner
      x + actualRadius, y, z + height,              // extends back
      actualRadius, 'y'
    );
    
    drawCurvedConnectingEdge(ctx, project,
      x + width - actualRadius, y + depth, z + height,  // front face top-right corner
      x + width - actualRadius, y, z + height,          // extends back
      actualRadius, 'y'
    );
    
    // Bottom edges connecting to front face corners
    drawCurvedConnectingEdge(ctx, project,
      x + actualRadius, y + depth, z,              // front face bottom-left corner
      x + actualRadius, y, z,                      // extends back
      actualRadius, 'y'
    );
    
    drawCurvedConnectingEdge(ctx, project,
      x + width - actualRadius, y + depth, z,      // front face bottom-right corner
      x + width - actualRadius, y, z,              // extends back
      actualRadius, 'y'
    );
    
    // Side edges extending from front face rounded corners
    drawCurvedVerticalEdge(ctx, project,
      x + width, y + depth, z + actualRadius,      // front face right edge
      x + width, y + depth, z + height - actualRadius,
      actualRadius
    );
  }
  
  else if (wordmarkFace === 'top') {
    // Top face has rounded corners - draw curved edges extending down
    // Front edges connecting to top face corners
    drawCurvedConnectingEdge(ctx, project,
      x + actualRadius, y + depth, z + height,      // top face front-left corner
      x + actualRadius, y + depth, z,               // extends down
      actualRadius, 'z'
    );
    
    drawCurvedConnectingEdge(ctx, project,
      x + width - actualRadius, y + depth, z + height,  // top face front-right corner
      x + width - actualRadius, y + depth, z,           // extends down
      actualRadius, 'z'
    );
    
    // Back edges connecting to top face corners
    drawCurvedConnectingEdge(ctx, project,
      x + actualRadius, y, z + height,              // top face back-left corner
      x + actualRadius, y, z,                       // extends down
      actualRadius, 'z'
    );
    
    drawCurvedConnectingEdge(ctx, project,
      x + width - actualRadius, y, z + height,      // top face back-right corner
      x + width - actualRadius, y, z,               // extends down
      actualRadius, 'z'
    );
  }
  
  else if (wordmarkFace === 'side') {
    // Side face has rounded corners - draw curved edges extending left
    // Front edges connecting to side face corners
    drawCurvedConnectingEdge(ctx, project,
      x + width, y + depth - actualRadius, z + height,  // side face top-front corner
      x, y + depth - actualRadius, z + height,          // extends left
      actualRadius, 'x'
    );
    
    drawCurvedConnectingEdge(ctx, project,
      x + width, y + depth - actualRadius, z,           // side face bottom-front corner
      x, y + depth - actualRadius, z,                   // extends left
      actualRadius, 'x'
    );
    
    // Back edges connecting to side face corners
    drawCurvedConnectingEdge(ctx, project,
      x + width, y + actualRadius, z + height,          // side face top-back corner
      x, y + actualRadius, z + height,                  // extends left
      actualRadius, 'x'
    );
    
    drawCurvedConnectingEdge(ctx, project,
      x + width, y + actualRadius, z,                   // side face bottom-back corner
      x, y + actualRadius, z,                           // extends left
      actualRadius, 'x'
    );
  }
  
  ctx.restore();
}

/**
 * Draw a curved corner in 2D projection space
 */
function drawCurvedCorner(ctx, project, x1, y1, z1, x2, y2, z2, radius) {
  const segments = 8;
  
  // Determine which axis the curve is on
  const isXAxis = (y1 === y2 && z1 === z2);
  const isYAxis = (x1 === x2 && z1 === z2);
  const isZAxis = (x1 === x2 && y1 === y2);
  
  // Draw the curve by interpolating between the two points
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const angle = t * Math.PI / 2; // 90 degree arc
    
    let x, y, z;
    
    if (isXAxis) {
      // Curve in X-Y or X-Z plane
      const centerX = Math.min(x1, x2) + radius;
      x = centerX - radius * Math.cos(angle) * Math.sign(x2 - x1);
      y = y1;
      z = z1;
    } else if (isYAxis) {
      // Curve in Y-X or Y-Z plane
      const centerY = Math.min(y1, y2) + radius;
      x = x1;
      y = centerY - radius * Math.cos(angle) * Math.sign(y2 - y1);
      z = z1;
    } else if (isZAxis) {
      // Curve in Z-X or Z-Y plane
      const centerZ = Math.min(z1, z2) + radius;
      x = x1;
      y = y1;
      z = centerZ - radius * Math.cos(angle) * Math.sign(z2 - z1);
    } else {
      // Complex 3D curve - need to handle the corner where two axes change
      const dx = x2 - x1;
      const dy = y2 - y1;
      const dz = z2 - z1;
      
      // Find the corner point
      let cornerX = x1, cornerY = y1, cornerZ = z1;
      if (dx !== 0 && dy !== 0) {
        // X-Y corner
        cornerX = x2;
        cornerY = y1;
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        x = cornerX - radius * (1 - sinA) * Math.sign(dx);
        y = cornerY + radius * (1 - cosA) * Math.sign(dy);
        z = z1;
      } else if (dx !== 0 && dz !== 0) {
        // X-Z corner
        cornerX = x2;
        cornerZ = z1;
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        x = cornerX - radius * (1 - sinA) * Math.sign(dx);
        y = y1;
        z = cornerZ + radius * (1 - cosA) * Math.sign(dz);
      } else if (dy !== 0 && dz !== 0) {
        // Y-Z corner
        cornerY = y2;
        cornerZ = z1;
        const cosA = Math.cos(angle);
        const sinA = Math.sin(angle);
        x = x1;
        y = cornerY - radius * (1 - sinA) * Math.sign(dy);
        z = cornerZ + radius * (1 - cosA) * Math.sign(dz);
      }
    }
    
    const p = project(x, y, z);
    
    if (i === 0) {
      ctx.lineTo(p.x, p.y);
    } else {
      ctx.lineTo(p.x, p.y);
    }
  }
}

/**
 * Draw a curved connecting edge that follows the rounded corner
 */
function drawCurvedConnectingEdge(ctx, project, x1, y1, z1, x2, y2, z2, radius, axis) {
  ctx.beginPath();
  
  const segments = 8;
  
  // Determine the direction of the curve
  if (axis === 'x') {
    // Edge extends in X direction
    const length = Math.abs(x2 - x1);
    const dir = Math.sign(x2 - x1);
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const distance = t * radius;
      
      // Start straight, then curve
      let x, y, z;
      if (distance < radius) {
        const angle = (1 - t) * Math.PI / 2;
        x = x1 + dir * radius * (1 - Math.sin(angle));
        y = y1;
        z = z1;
      } else {
        x = x1 + dir * distance;
        y = y1;
        z = z1;
      }
      
      const p = project(x, y, z);
      if (i === 0) {
        ctx.moveTo(p.x, p.y);
      } else {
        ctx.lineTo(p.x, p.y);
      }
    }
    
    // Complete the edge
    const pEnd = project(x2, y2, z2);
    ctx.lineTo(pEnd.x, pEnd.y);
  } else if (axis === 'y') {
    // Edge extends in Y direction
    const length = Math.abs(y2 - y1);
    const dir = Math.sign(y2 - y1);
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const distance = t * radius;
      
      // Start straight, then curve
      let x, y, z;
      if (distance < radius) {
        const angle = (1 - t) * Math.PI / 2;
        x = x1;
        y = y1 + dir * radius * (1 - Math.sin(angle));
        z = z1;
      } else {
        x = x1;
        y = y1 + dir * distance;
        z = z1;
      }
      
      const p = project(x, y, z);
      if (i === 0) {
        ctx.moveTo(p.x, p.y);
      } else {
        ctx.lineTo(p.x, p.y);
      }
    }
    
    // Complete the edge
    const pEnd = project(x2, y2, z2);
    ctx.lineTo(pEnd.x, pEnd.y);
  } else {
    // Z axis or unknown - draw straight line
    const p1 = project(x1, y1, z1);
    const p2 = project(x2, y2, z2);
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
  }
  
  ctx.stroke();
}

/**
 * Draw a curved vertical edge on the face
 */
function drawCurvedVerticalEdge(ctx, project, x, y, z1, x2, y2, z2, radius) {
  // For vertical edges on faces with rounded corners
  const segments = 12;
  ctx.beginPath();
  
  const height = Math.abs(z2 - z1);
  const dir = Math.sign(z2 - z1);
  
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    let z, offsetX = 0, offsetY = 0;
    
    // Create rounded corners at top and bottom
    if (t < 0.1) {
      // Bottom curve
      const angle = (1 - t * 10) * Math.PI / 2;
      z = z1 + dir * radius * (1 - Math.cos(angle));
      // Slightly offset to follow the curve
      offsetX = radius * (1 - Math.sin(angle)) * 0.1;
    } else if (t > 0.9) {
      // Top curve
      const localT = (t - 0.9) * 10;
      const angle = localT * Math.PI / 2;
      z = z2 - dir * radius * (1 - Math.cos(angle));
      // Slightly offset to follow the curve
      offsetX = radius * (1 - Math.sin(angle)) * 0.1;
    } else {
      // Straight middle section
      z = z1 + dir * height * t;
    }
    
    const p = project(x + offsetX, y + offsetY, z);
    
    if (i === 0) {
      ctx.moveTo(p.x, p.y);
    } else {
      ctx.lineTo(p.x, p.y);
    }
  }
  
  ctx.stroke();
}


/**
 * Draw wordmark on the front face (facing viewer in isometric view)
 */
function drawFrontFaceWordmark(ctx, text, x, y, z, size, color, style, shadow, maxWidth, utils, isoAngle, orientation) {
  const project = (px, py, pz) => ({
    x: (px - py) * Math.cos(isoAngle),
    y: (px + py) * Math.sin(isoAngle) - pz
  });
  
  ctx.save();
  
  // Set font based on style using utils.font.get
  const fontFamily = utils.font.get(style);
  ctx.font = `bold ${size}px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // For front face, the text should be positioned at the center of the front face
  // The coordinates passed in (x, y, z) are already the center position
  // We just need to project this to 2D screen coordinates
  const textPosition = project(x, y, z);
  
  // Position text at the projected center position
  ctx.translate(textPosition.x, textPosition.y);
  
  // For front face, text should appear perfectly flat and readable
  // No isometric distortion - it's like text painted on a billboard
  if (orientation === 'rotated-90') {
    ctx.rotate(-Math.PI / 2);
  } else if (orientation === 'rotated-45') {
    ctx.rotate(-Math.PI / 4);
  }
  // For 'normal' orientation, text appears normally readable
  
  // Draw text shadow if enabled
  if (shadow > 0) {
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillText(text, shadow, shadow);
  }
  
  // Draw main text
  ctx.globalAlpha = 1;
  ctx.fillStyle = color;
  ctx.fillText(text, 0, 0);
  
  // Add subtle text outline for better visibility
  ctx.strokeStyle = adjustBrightness(color, 0.9);
  ctx.lineWidth = 0.5;
  ctx.strokeText(text, 0, 0);
  
  ctx.restore();
}

/**
 * Draw wordmark on the top face (horizontal in isometric view)
 */
function drawTopFaceWordmark(ctx, text, x, y, z, size, color, style, shadow, maxWidth, maxHeight, utils, isoAngle, orientation) {
  const project = (px, py, pz) => ({
    x: (px - py) * Math.cos(isoAngle),
    y: (px + py) * Math.sin(isoAngle) - pz
  });
  
  ctx.save();
  
  // Set font
  const fontFamily = utils.font.get(style);
  ctx.font = `bold ${size}px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Project text position
  const textPos = project(x, y, z);
  ctx.translate(textPos.x, textPos.y);
  
  // Apply isometric transform for top face
  // This makes the text appear to lie flat on the horizontal top surface
  const cos = Math.cos(isoAngle);
  const sin = Math.sin(isoAngle);
  ctx.transform(cos, sin, -cos, sin, 0, 0);
  
  // Apply additional rotation based on orientation
  if (orientation === 'rotated-90') {
    ctx.rotate(Math.PI / 2);
  } else if (orientation === 'rotated-45') {
    ctx.rotate(Math.PI / 4);
  }
  // For 'normal' orientation, no additional rotation needed
  
  // Draw text shadow if enabled
  if (shadow > 0) {
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillText(text, shadow, shadow);
  }
  
  // Draw main text
  ctx.globalAlpha = 1;
  ctx.fillStyle = color;
  ctx.fillText(text, 0, 0);
  
  ctx.restore();
}

/**
 * Draw wordmark on the side face (right side in isometric view)
 */
function drawSideFaceWordmark(ctx, text, x, y, z, size, color, style, shadow, maxDepth, utils, isoAngle, orientation) {
  const project = (px, py, pz) => ({
    x: (px - py) * Math.cos(isoAngle),
    y: (px + py) * Math.sin(isoAngle) - pz
  });
  
  ctx.save();
  
  // Set font
  const fontFamily = utils.font.get(style);
  ctx.font = `bold ${size}px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Project text position
  const textPos = project(x, y, z);
  ctx.translate(textPos.x, textPos.y);
  
  // Apply transform for side face
  // Default is normal (readable when tilting head right)
  if (orientation === 'normal') {
    // Rotate text 90 degrees counter-clockwise so it reads horizontally
    // when you tilt your head to the right
    ctx.rotate(-Math.PI / 2);
  } else if (orientation === 'rotated-45') {
    // 45 degree angle
    ctx.rotate(-Math.PI / 4);
  }
  // For 'rotated-90' orientation, no rotation needed as text naturally goes up-down
  
  // Then apply the isometric transform for the side face
  const sin = Math.sin(isoAngle);
  const cos = Math.cos(isoAngle);
  ctx.transform(sin, cos, 0, 1, 0, 0);
  
  // Draw text shadow if enabled
  if (shadow > 0) {
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillText(text, shadow, shadow);
  }
  
  // Draw main text
  ctx.globalAlpha = 1;
  ctx.fillStyle = color;
  ctx.fillText(text, 0, 0);
  
  ctx.restore();
}


/**
 * Get color for layer based on scheme
 */
function getLayerColor(scheme, layerIndex, totalLayers) {
  const schemes = {
    'monochrome': ['#2d3748', '#4a5568', '#718096'],
    'blue': ['#2b6cb0', '#3182ce', '#4299e1'],
    'purple': ['#6b46c1', '#8b5cf6', '#a78bfa'],
    'green': ['#059669', '#10b981', '#34d399'],
    'warm': ['#dc2626', '#f59e0b', '#eab308'],
    'cool': ['#0891b2', '#06b6d4', '#22d3ee']
  };
  
  const colors = schemes[scheme] || schemes['blue'];
  return colors[layerIndex % colors.length];
}

/**
 * Adjust color brightness
 */
function adjustBrightness(color, factor) {
  // Simple brightness adjustment for hex colors
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  const newR = Math.min(255, Math.round(r * factor));
  const newG = Math.min(255, Math.round(g * factor));
  const newB = Math.min(255, Math.round(b * factor));
  
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

// Helper functions for parameter definitions
const slider = (def, min, max, step, label, unit, opts = {}) => ({ 
  type: "slider", default: def, min, max, step, label, unit, ...opts 
});
const select = (def, options, label, opts = {}) => ({ 
  type: "select", default: def, options, label, ...opts 
});
const text = (def, label, opts = {}) => ({ 
  type: "text", default: def, label, ...opts 
});
const toggle = (def, label, opts = {}) => ({ 
  type: "toggle", default: def, label, ...opts 
});
const color = (def, label, opts = {}) => ({ 
  type: "color", default: def, label, ...opts 
});

// Parameter definitions
export const parameters = {
  // Text Content
  wordmark: text('ReFlow', 'Wordmark Text', { group: 'Text Content' }),
  textSize: slider(24, 12, 60, 2, 'Text Size', 'px', { group: 'Text Content' }),
  textColor: color('#ffffff', 'Text Color', { group: 'Text Content' }),
  textStyle: select('bold', [
    { value: 'modern', label: 'Modern' },
    { value: 'bold', label: 'Bold' },
    { value: 'elegant', label: 'Elegant' },
    { value: 'minimal', label: 'Minimal' }
  ], 'Text Style', { group: 'Text Content' }),
  textShadow: slider(2, 0, 8, 1, 'Text Shadow', 'px', { group: 'Text Content' }),
  
  // Face & Text Orientation
  wordmarkFace: select('front', [
    { value: 'front', label: 'Front Face' },
    { value: 'top', label: 'Top Face' },
    { value: 'side', label: 'Side Face' }
  ], 'Wordmark Face', { group: 'Face & Text Orientation' }),
  textOrientation: select('normal', [
    { value: 'normal', label: 'Normal' },
    { value: 'rotated-90', label: 'Rotated 90°' },
    { value: 'rotated-45', label: 'Rotated 45°' }
  ], 'Text Orientation', { group: 'Face & Text Orientation' }),
  cornerRadius: slider(12, 0, 50, 2, 'Corner Radius', 'px', { group: 'Face & Text Orientation' }),
  
  // Platform dimensions - grouped together
  platformWidth: slider(100, 5, 800, 5, 'Width', 'px', { group: 'Platform Size' }),
  platformDepth: slider(40, 5, 400, 5, 'Depth', 'px', { group: 'Platform Size' }),
  platformHeight: slider(120, 5, 600, 5, 'Height', 'px', { group: 'Platform Size' }),
  
  // Platform Style
  colorScheme: select('blue', [
    { value: 'monochrome', label: '⚫ Monochrome' },
    { value: 'blue', label: '🔵 Blue' },
    { value: 'purple', label: '🟣 Purple' },
    { value: 'green', label: '🟢 Green' },
    { value: 'warm', label: '🔴 Warm' },
    { value: 'cool', label: '🔵 Cool' }
  ], 'Color Scheme', { group: 'Platform Style' }),
  lighting: toggle(true, 'Enable Lighting', { group: 'Platform Style' }),
  
  // Layers
  layerCount: slider(1, 1, 3, 1, 'Layer Count', { group: 'Layers' }),
  layerSpacing: slider(20, 10, 40, 2, 'Layer Spacing', 'px', { group: 'Layers' }),
  layerTaper: slider(0.08, 0, 0.2, 0.02, 'Layer Taper', { group: 'Layers' }),
  
  // Animation
  animationSpeed: slider(0.3, 0, 1.5, 0.1, 'Animation Speed', 'x', { group: 'Animation' }),
  breathingIntensity: slider(0.02, 0, 0.08, 0.01, 'Breathing Effect', { group: 'Animation' }),
  
  // View
  perspective: slider(0, -20, 20, 2, 'View Angle', '°', { group: 'View' })
};

// Template metadata
export const metadata = {
  name: "🏷️ Isometric Wordmark",
  description: "Clean isometric wordmark projected flat on upright rounded rectangle platforms - perfect for elegant brand identity with 3D depth",
  category: "isometric",
  tags: ["isometric", "3d", "wordmark", "brand", "elegant", "typography", "platform", "upright"],
  author: "ReFlow",
  version: "1.1.0"
};