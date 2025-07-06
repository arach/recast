/**
 * 💫 Neon Glow
 * 
 * Cyberpunk-inspired glowing neon effects with electric energy and circuit aesthetics
 */

function draw(ctx, width, height, params, time, utils) {
  // Load and process all parameters - clean and deterministic
  const p = utils.params.load(params, ctx, width, height, time, { parameters });

  // Template-specific parameters (defaults come from exported parameters)
  const centerX = width / 2;
  const centerY = height / 2;
  const { frequency, amplitude, complexity, neonStyle, glowIntensity, glowRadius, glowLayers, electricSpark, energyFlow, circuitBreaks, neonHue, colorShift, saturation, pulseSpeed, flicker } = p;
  const neonStyleNum = Math.round(neonStyle);

  // Neon scale and pulsing
  const baseScale = Math.min(width, height) / 350;
  const scaledAmplitude = amplitude * baseScale;
  
  // Electric pulse with flicker
  const electricPhase = time * frequency * pulseSpeed;
  const flickerEffect = 1 + Math.sin(time * 10) * flicker * Math.random();
  const neonPulse = (1 + Math.sin(electricPhase) * 0.2) * flickerEffect;

  // Generate neon path
  const neonPath = generateNeonPath(
    neonStyleNum, centerX, centerY, scaledAmplitude * neonPulse,
    complexity, electricPhase, circuitBreaks
  );

  // Neon color system
  const neonColors = generateNeonColors(neonHue, colorShift, saturation, time);

  // Render multi-layer glow effect
  for (let layer = glowLayers - 1; layer >= 0; layer--) {
    const layerRadius = glowRadius * (layer + 1) / glowLayers;
    const layerAlpha = glowIntensity * (1 - layer * 0.15);
    renderGlowLayer(ctx, neonPath, neonColors, layerRadius, layerAlpha, layer);
  }

  // Render main neon tube
  renderNeonCore(ctx, neonPath, neonColors, neonStyleNum, flickerEffect, p, utils);

  // Electric spark effects
  if (electricSpark > 0.1) {
    renderElectricSparks(ctx, neonPath, neonColors, electricSpark, time, scaledAmplitude);
  }

  // Energy flow animation
  if (energyFlow > 0.1) {
    renderEnergyFlow(ctx, neonPath, neonColors, energyFlow, time, pulseSpeed);
  }

  function generateNeonPath(style, centerX, centerY, radius, complexity, phase, breaks) {
    const points = [];
    const basePoints = Math.floor(8 + complexity * 16); // 8-24 points
    
    for (let i = 0; i < basePoints; i++) {
      const t = i / basePoints;
      const angle = t * Math.PI * 2;
      
      let pathRadius = radius;
      
      switch (style) {
        case 0: // Tube - smooth flowing neon tube
          const tube1 = Math.sin(angle * 3 + phase) * complexity * 0.2;
          const tube2 = Math.sin(angle * 5 + phase * 1.3) * complexity * 0.1;
          pathRadius = radius * (0.8 + tube1 + tube2);
          break;
          
        case 1: // Wire - angular, circuit-like
          const wireSegments = Math.floor(angle / (Math.PI / 4));
          const wireAngle = wireSegments * (Math.PI / 4);
          const wire1 = Math.sin(angle * 4 + phase) * complexity * 0.15;
          pathRadius = radius * (0.85 + wire1);
          break;
          
        case 2: // Plasma - organic, flowing energy
          const plasma1 = Math.sin(angle * 2 + phase) * complexity * 0.3;
          const plasma2 = Math.sin(angle * 7 + phase * 2) * complexity * 0.15;
          const plasma3 = Math.sin(angle * 11 + phase * 0.7) * complexity * 0.08;
          pathRadius = radius * (0.7 + plasma1 + plasma2 + plasma3);
          break;
          
        case 3: // Laser - sharp, precise lines
          const laserSegments = 6;
          const laserAngle = Math.floor(angle / (Math.PI * 2 / laserSegments)) * (Math.PI * 2 / laserSegments);
          const laser1 = Math.sin(laserAngle * 2 + phase) * complexity * 0.1;
          pathRadius = radius * (0.9 + laser1);
          break;
          
        case 4: // Hologram - glitchy, digital
          const holo1 = Math.sin(angle * 8 + phase) * complexity * 0.25;
          const holo2 = Math.floor(Math.sin(angle * 12 + phase * 3) * 5) / 5 * complexity * 0.1;
          pathRadius = radius * (0.8 + holo1 + holo2);
          break;
      }
      
      // Add circuit breaks
      const isBreak = Math.sin(angle * 7 + phase) < -0.7 && Math.random() < breaks;
      
      points.push({
        x: centerX + Math.cos(angle) * pathRadius,
        y: centerY + Math.sin(angle) * pathRadius,
        angle: angle,
        radius: pathRadius,
        isBreak: isBreak,
        energy: 0.5 + Math.sin(angle * 3 + phase) * 0.5
      });
    }
    
    return points;
  }

  function generateNeonColors(hue, shift, sat, time) {
    const animatedHue = hue + Math.sin(time * 0.5) * shift;
    const saturation = sat * 100;
    
    return {
      core: `hsl(${animatedHue}, ${saturation}%, 90%)`,
      bright: `hsl(${animatedHue}, ${saturation}%, 95%)`,
      glow: `hsl(${animatedHue}, ${saturation}%, 80%)`,
      outer: `hsl(${animatedHue}, ${saturation * 0.8}%, 60%)`,
      spark: `hsl(${animatedHue + shift * 0.5}, 100%, 95%)`
    };
  }

  function renderGlowLayer(ctx, points, colors, radius, alpha, layer) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.filter = `blur(${radius}px)`;
    
    const glowColor = layer === 0 ? colors.bright : 
                     layer === 1 ? colors.glow : 
                     layer === 2 ? colors.outer : colors.glow;
    
    ctx.strokeStyle = glowColor;
    ctx.lineWidth = 4 + layer * 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    drawNeonPath(ctx, points);
    ctx.stroke();
    
    ctx.restore();
  }

  function renderNeonCore(ctx, points, colors, style, flicker, p, utils) {
    ctx.save();
    ctx.globalAlpha = flicker;
    
    // Core neon line
    ctx.strokeStyle = p.strokeColor || colors.core;
    ctx.lineWidth = p.strokeWidth || (style === 3 ? 1 : 2); // Laser is thinner
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Apply universal stroke style
    if (p.strokeType === 'dashed') {
      ctx.setLineDash([ctx.lineWidth * 4, ctx.lineWidth * 2]);
    } else if (p.strokeType === 'dotted') {
      ctx.setLineDash([ctx.lineWidth, ctx.lineWidth * 2]);
    }
    
    drawNeonPath(ctx, points);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Inner bright core
    ctx.strokeStyle = colors.bright;
    ctx.lineWidth = 1;
    ctx.globalAlpha = flicker * 0.8;
    
    drawNeonPath(ctx, points);
    ctx.stroke();
    
    ctx.restore();
  }

  function renderElectricSparks(ctx, points, colors, spark, time, scale) {
    ctx.save();
    
    for (let i = 0; i < points.length; i++) {
      const point = points[i];
      if (point.energy > 0.7 && Math.random() < spark * 0.1) {
        const sparkPhase = time * 8 + i;
        const sparkSize = (1 + Math.sin(sparkPhase) * 2) * scale * 0.05;
        
        ctx.globalAlpha = spark * 0.8;
        
        // Spark glow
        const sparkGradient = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, sparkSize * 3
        );
        sparkGradient.addColorStop(0, colors.spark);
        sparkGradient.addColorStop(0.5, colors.bright);
        sparkGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = sparkGradient;
        ctx.beginPath();
        ctx.arc(point.x, point.y, sparkSize * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Spark core
        ctx.fillStyle = colors.bright;
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(point.x, point.y, sparkSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    ctx.restore();
  }

  function renderEnergyFlow(ctx, points, colors, flow, time, speed) {
    ctx.save();
    
    const flowCount = Math.floor(flow * 8);
    
    for (let f = 0; f < flowCount; f++) {
      const flowPhase = time * speed * 2 + f * 1.5;
      const flowPosition = (Math.sin(flowPhase) + 1) / 2; // 0 to 1
      const pointIndex = Math.floor(flowPosition * points.length);
      const point = points[pointIndex];
      
      if (point && !point.isBreak) {
        ctx.globalAlpha = flow * 0.6;
        
        // Energy pulse
        const pulseGradient = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, 8
        );
        pulseGradient.addColorStop(0, colors.bright);
        pulseGradient.addColorStop(0.5, colors.glow);
        pulseGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = pulseGradient;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    ctx.restore();
  }

  function drawNeonPath(ctx, points) {
    if (points.length < 2) return;
    
    ctx.beginPath();
    
    let lastPoint = null;
    for (let i = 0; i < points.length; i++) {
      const current = points[i];
      const next = points[(i + 1) % points.length];
      
      if (current.isBreak) {
        lastPoint = null;
        continue;
      }
      
      if (lastPoint === null) {
        ctx.moveTo(current.x, current.y);
        lastPoint = current;
      } else {
        // Smooth curves for neon flow
        const cp1x = lastPoint.x + (current.x - lastPoint.x) * 0.3;
        const cp1y = lastPoint.y + (current.y - lastPoint.y) * 0.3;
        const cp2x = current.x - (next.x - lastPoint.x) * 0.3;
        const cp2y = current.y - (next.y - lastPoint.y) * 0.3;
        
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, current.x, current.y);
        lastPoint = current;
      }
    }
  }
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
  neonStyle: select(1, [
    { value: 0, label: '🚧 Tube' },
    { value: 1, label: '🔌 Wire' },
    { value: 2, label: '⚡ Plasma' },
    { value: 3, label: '🔦 Laser' },
    { value: 4, label: '🌐 Hologram' }
  ], 'Neon Style'),
  frequency: slider(1.8, 0.5, 3, 0.1, 'Electric Frequency'),
  amplitude: slider(140, 80, 200, 5, 'Neon Size'),
  complexity: slider(0.6, 0.2, 1, 0.05, 'Circuit Complexity'),
  glowIntensity: slider(0.8, 0.3, 1, 0.05, 'Glow Intensity'),
  glowRadius: slider(25, 10, 50, 2, 'Glow Radius', 'px'),
  glowLayers: slider(4, 2, 6, 1, 'Glow Layers'),
  electricSpark: slider(0.4, 0, 1, 0.05, 'Electric Sparks'),
  energyFlow: slider(0.6, 0, 1, 0.05, 'Energy Flow'),
  circuitBreaks: slider(0.1, 0, 0.3, 0.02, 'Circuit Breaks'),
  neonHue: slider(180, 0, 360, 10, 'Neon Hue', '°'),
  colorShift: slider(20, 0, 60, 5, 'Color Shift Range', '°'),
  saturation: slider(1, 0.8, 1, 0.02, 'Color Saturation'),
  pulseSpeed: slider(1.5, 0.5, 3, 0.1, 'Pulse Speed', 'x'),
  flicker: slider(0.15, 0, 0.5, 0.05, 'Neon Flicker')
};

// Template metadata
export const metadata = {
  name: "💫 Neon Glow",
  description: "Cyberpunk-inspired glowing neon effects with electric energy and circuit aesthetics",
  category: "effects",
  tags: ["neon", "glow", "cyberpunk", "electric", "animated", "circuits"],
  author: "ReFlow",
  version: "1.0.0"
};

