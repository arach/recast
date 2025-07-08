/**
 * 🏢 Tech Tower
 * 
 * Isometric tech building with animated glowing windows - perfect for SaaS companies
 */

function draw(ctx, width, height, params, time, utils) {
  // Load and process all parameters - clean and deterministic
  const p = utils.params.load(params, ctx, width, height, time, { parameters });
  
  // Template-specific parameters (defaults come from exported parameters)
  const { floors, buildingWidth, buildingDepth, buildingColor, windowGlow, 
          animationSpeed, perspective, showShadow, scale } = p;
  
  // Calculate positioning
  const centerX = width / 2;
  const centerY = height / 2;
  // Improved scaling - larger default size with user control
  const baseScale = (Math.min(width, height) / 250) * scale;
  
  // Scale building dimensions
  const scaledWidth = buildingWidth * baseScale;
  const scaledDepth = buildingDepth * baseScale; 
  const scaledHeight = floors;
  
  // Position building in center of canvas
  const buildingX = -scaledWidth / 2;
  const buildingY = -scaledDepth / 2;
  const buildingZ = 0;
  
  // Transform canvas to center the isometric view
  ctx.save();
  ctx.translate(centerX, centerY);
  
  // Apply perspective rotation if enabled
  if (perspective > 0) {
    ctx.rotate((perspective * Math.PI) / 180);
  }
  
  // Draw shadow if enabled
  if (showShadow) {
    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = '#000000';
    
    // Simple shadow projection
    const shadowOffset = scaledWidth * 0.8;
    ctx.beginPath();
    ctx.ellipse(shadowOffset, scaledDepth + 20, scaledWidth * 1.2, scaledDepth * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  
  // Draw the main building structure
  utils.iso.drawBuilding(
    ctx,
    buildingX,
    buildingY, 
    buildingZ,
    scaledWidth,
    scaledDepth,
    scaledHeight,
    p.fillColor || buildingColor,
    {
      windows: true,
      windowColor: calculateWindowColor(time, animationSpeed, windowGlow),
      lighting: true,
      stroke: true
    }
  );
  
  // Add animated details
  addAnimatedElements(ctx, buildingX, buildingY, buildingZ, scaledWidth, scaledDepth, scaledHeight, time, p);
  
  ctx.restore();
  
  // Debug info in dev mode
  if (utils.debug) {
    utils.debug.log('Tech Tower rendered', {
      floors,
      buildingColor,
      windowGlow: windowGlow.toFixed(2),
      time: time.toFixed(2)
    });
  }
}

/**
 * Calculate animated window color based on glow intensity
 */
function calculateWindowColor(time, animationSpeed, windowGlow) {
  const glowPhase = time * animationSpeed;
  const baseIntensity = 0.6 + Math.sin(glowPhase) * 0.4; // Breathing effect
  const glowIntensity = windowGlow * baseIntensity;
  
  // Create glowing yellow/orange color
  const r = Math.round(255 * glowIntensity);
  const g = Math.round(255 * glowIntensity * 0.9);
  const b = Math.round(100 * glowIntensity);
  
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Add animated details like floating particles, data streams, etc.
 */
function addAnimatedElements(ctx, x, y, z, width, depth, height, time, params) {
  if (!params.showEffects) return;
  
  // Floating data particles
  const particleCount = 8;
  const animTime = time * params.animationSpeed;
  
  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2 + animTime;
    const radius = width * 1.5;
    const particleX = Math.cos(angle) * radius;
    const particleY = Math.sin(angle) * radius * 0.5;
    const particleZ = z + height * width + Math.sin(animTime + i) * 20;
    
    const projected = utils.iso.project(x + particleX, y + particleY, particleZ);
    
    ctx.save();
    ctx.globalAlpha = 0.6 + Math.sin(animTime + i) * 0.4;
    ctx.fillStyle = params.strokeColor || '#00ff88';
    ctx.beginPath();
    ctx.arc(projected.x, projected.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  
  // Energy beam from top
  if (params.showEnergyBeam) {
    const beamTop = utils.iso.project(x + width/2, y + depth/2, z + height * width + 40);
    const beamBottom = utils.iso.project(x + width/2, y + depth/2, z + height * width);
    
    ctx.save();
    ctx.globalAlpha = 0.8;
    ctx.strokeStyle = params.strokeColor || '#00ff88';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.lineDashOffset = -time * params.animationSpeed * 10;
    
    ctx.beginPath();
    ctx.moveTo(beamBottom.x, beamBottom.y);
    ctx.lineTo(beamTop.x, beamTop.y);
    ctx.stroke();
    ctx.restore();
  }
}

// Helper functions for concise parameter definitions
const slider = (def, min, max, step, label, unit, opts = {}) => ({ 
  type: "slider", default: def, min, max, step, label, unit, ...opts 
});
const select = (def, options, label, opts = {}) => ({ 
  type: "select", default: def, options, label, ...opts 
});
const toggle = (def, label, opts = {}) => ({ 
  type: "toggle", default: def, label, ...opts 
});

// Parameter definitions - controls and defaults
export const parameters = {
  // Building Structure
  floors: slider(5, 1, 12, 1, "Number of Floors"),
  buildingWidth: slider(80, 40, 150, 10, "Building Width", "px"),
  buildingDepth: slider(60, 30, 120, 10, "Building Depth", "px"),
  
  // Appearance
  buildingColor: select("#4a90e2", [
    { value: "#4a90e2", label: "🔵 Tech Blue" },
    { value: "#2c3e50", label: "⚫ Corporate Gray" },
    { value: "#e74c3c", label: "🔴 Bold Red" },
    { value: "#27ae60", label: "🟢 Growth Green" },
    { value: "#8e44ad", label: "🟣 Innovation Purple" },
    { value: "#f39c12", label: "🟡 Energy Orange" }
  ], "Building Color"),
  
  windowGlow: slider(0.8, 0.2, 1.5, 0.1, "Window Glow Intensity"),
  
  // Animation
  animationSpeed: slider(1, 0.2, 3, 0.1, "Animation Speed", "x"),
  
  // Scale & Perspective
  scale: slider(1.0, 0.3, 2.5, 0.1, "Scale", "x"),
  perspective: slider(0, -15, 15, 1, "Perspective Angle", "°"),
  showShadow: toggle(true, "Show Shadow"),
  showEffects: toggle(true, "Show Particle Effects"),
  showEnergyBeam: toggle(false, "Show Energy Beam")
};

// Template metadata
export const metadata = {
  name: "🏢 Tech Tower",
  description: "Isometric tech building with animated glowing windows - perfect for SaaS companies",
  category: "isometric",
  tags: ["isometric", "3d", "building", "tech", "corporate", "animated"],
  author: "ReFlow",
  version: "1.0.0"
};