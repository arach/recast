// 💫 Neon Glow - Cyberpunk-inspired glowing neon effects with electric energy

const parameters = {
  neonStyle: {
    type: 'select',
    default: 1,
    options: [
      { value: 0, label: '🚧 Tube' },
      { value: 1, label: '🔌 Wire' },
      { value: 2, label: '⚡ Plasma' },
      { value: 3, label: '🔦 Laser' },
      { value: 4, label: '🌐 Hologram' }
    ],
    label: 'Neon Style',
    category: 'Style'
  },
  frequency: {
    type: 'slider',
    default: 1.8,
    min: 0.5,
    max: 3,
    step: 0.1,
    label: 'Electric Frequency',
    category: 'Movement'
  },
  amplitude: {
    type: 'slider',
    default: 140,
    min: 80,
    max: 200,
    step: 5,
    label: 'Neon Size',
    category: 'Geometry'
  },
  complexity: {
    type: 'slider',
    default: 0.6,
    min: 0.2,
    max: 1,
    step: 0.05,
    label: 'Circuit Complexity',
    category: 'Geometry'
  },
  glowIntensity: {
    type: 'slider',
    default: 0.8,
    min: 0.3,
    max: 1,
    step: 0.05,
    label: 'Glow Intensity',
    category: 'Glow'
  },
  glowRadius: {
    type: 'slider',
    default: 25,
    min: 10,
    max: 50,
    step: 2,
    label: 'Glow Radius',
    category: 'Glow'
  },
  glowLayers: {
    type: 'slider',
    default: 4,
    min: 2,
    max: 6,
    step: 1,
    label: 'Glow Layers',
    category: 'Glow'
  },
  electricSpark: {
    type: 'slider',
    default: 0.4,
    min: 0,
    max: 1,
    step: 0.05,
    label: 'Electric Sparks',
    category: 'Effects'
  },
  energyFlow: {
    type: 'slider',
    default: 0.6,
    min: 0,
    max: 1,
    step: 0.05,
    label: 'Energy Flow',
    category: 'Effects'
  },
  circuitBreaks: {
    type: 'slider',
    default: 0.1,
    min: 0,
    max: 0.3,
    step: 0.02,
    label: 'Circuit Breaks',
    category: 'Effects'
  },
  neonHue: {
    type: 'slider',
    default: 180,
    min: 0,
    max: 360,
    step: 10,
    label: 'Neon Hue',
    category: 'Color'
  },
  colorShift: {
    type: 'slider',
    default: 20,
    min: 0,
    max: 60,
    step: 5,
    label: 'Color Shift Range',
    category: 'Color'
  },
  saturation: {
    type: 'slider',
    default: 1,
    min: 0.8,
    max: 1,
    step: 0.02,
    label: 'Color Saturation',
    category: 'Color'
  },
  pulseSpeed: {
    type: 'slider',
    default: 1.5,
    min: 0.5,
    max: 3,
    step: 0.1,
    label: 'Pulse Speed',
    category: 'Animation'
  },
  flicker: {
    type: 'slider',
    default: 0.15,
    min: 0,
    max: 0.5,
    step: 0.05,
    label: 'Neon Flicker',
    category: 'Animation'
  }
};

function drawVisualization(ctx, width, height, params, time, utils) {
  // Apply universal background
  utils.background.apply(ctx, width, height, params);

  // Extract parameters
  const centerX = width / 2;
  const centerY = height / 2;
  const frequency = params.frequency || 1.8;
  const amplitude = params.amplitude || 140;
  const complexity = params.complexity || 0.6;
  const neonStyleNum = Math.round(params.neonStyle || 1);
  const glowIntensity = params.glowIntensity || 0.8;
  const glowRadius = params.glowRadius || 25;
  const glowLayers = Math.round(params.glowLayers || 4);
  const electricSpark = params.electricSpark || 0.4;
  const energyFlow = params.energyFlow || 0.6;
  const circuitBreaks = params.circuitBreaks || 0.1;
  const neonHue = params.neonHue || 180;
  const colorShift = params.colorShift || 20;
  const saturation = params.saturation || 1;
  const pulseSpeed = params.pulseSpeed || 1.5;
  const flicker = params.flicker || 0.15;

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
  renderNeonCore(ctx, neonPath, neonColors, neonStyleNum, flickerEffect, params, utils);

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

  function renderNeonCore(ctx, points, colors, style, flicker, params, utils) {
    ctx.save();
    ctx.globalAlpha = flicker;
    
    // Core neon line
    ctx.strokeStyle = params.strokeColor || colors.core;
    ctx.lineWidth = params.strokeWidth || (style === 3 ? 1 : 2); // Laser is thinner
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Apply universal stroke style
    if (params.strokeType === 'dashed') {
      ctx.setLineDash([ctx.lineWidth * 4, ctx.lineWidth * 2]);
    } else if (params.strokeType === 'dotted') {
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

const metadata = {
  id: 'neon-glow',
  name: "💫 Neon Glow",
  description: "Cyberpunk-inspired glowing neon effects with electric energy and circuit aesthetics",
  parameters,
  defaultParams: {
    neonStyle: 1,
    frequency: 1.8,
    amplitude: 140,
    complexity: 0.6,
    glowIntensity: 0.8,
    glowRadius: 25,
    glowLayers: 4,
    electricSpark: 0.4,
    energyFlow: 0.6,
    circuitBreaks: 0.1,
    neonHue: 180,
    colorShift: 20,
    saturation: 1,
    pulseSpeed: 1.5,
    flicker: 0.15
  }
};

