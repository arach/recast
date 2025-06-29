import type { ParameterDefinition, PresetMetadata } from './types';

// Quantum Field - Abstract quantum physics visualization for tech/research brands
export const parameters: Record<string, ParameterDefinition> = {
  // Core quantum properties
  frequency: { type: 'slider', min: 0.8, max: 3, step: 0.1, default: 1.8, label: 'Quantum Frequency' },
  amplitude: { type: 'slider', min: 90, max: 220, step: 5, default: 160, label: 'Field Amplitude' },
  
  // Quantum mechanics
  quantumState: {
    type: 'slider',
    min: 0,
    max: 4,
    step: 1,
    default: 2,
    label: 'Quantum State (0=Ground, 1=Excited, 2=Superposition, 3=Entangled, 4=Collapsed)'
  },
  
  // Field properties
  fieldDensity: { type: 'slider', min: 0.4, max: 1, step: 0.05, default: 0.7, label: 'Field Density' },
  waveFunction: { type: 'slider', min: 0.3, max: 1, step: 0.05, default: 0.8, label: 'Wave Function Complexity' },
  uncertainty: { type: 'slider', min: 0.2, max: 0.8, step: 0.05, default: 0.4, label: 'Heisenberg Uncertainty' },
  
  // Quantum effects
  superposition: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.6, label: 'Superposition State' },
  entanglement: { type: 'slider', min: 0, max: 0.8, step: 0.05, default: 0.3, label: 'Quantum Entanglement' },
  tunneling: { type: 'slider', min: 0, max: 0.6, step: 0.05, default: 0.2, label: 'Quantum Tunneling' },
  
  // Energy levels
  energyLevels: { type: 'slider', min: 3, max: 12, step: 1, default: 7, label: 'Energy Level Count' },
  energySpacing: { type: 'slider', min: 0.5, max: 2, step: 0.1, default: 1.2, label: 'Level Spacing' },
  quantumJumps: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.4, label: 'Quantum Jump Rate' },
  
  // Probability distributions
  probabilityCloud: { type: 'slider', min: 0.2, max: 1, step: 0.05, default: 0.6, label: 'Probability Cloud' },
  waveCollapse: { type: 'slider', min: 0, max: 0.7, step: 0.05, default: 0.3, label: 'Wave Function Collapse' },
  measurement: { type: 'slider', min: 0, max: 0.5, step: 0.05, default: 0.2, label: 'Measurement Effect' },
  
  // Field visualization
  fieldLines: { type: 'slider', min: 0.3, max: 1, step: 0.05, default: 0.7, label: 'Field Line Visibility' },
  particleTrails: { type: 'slider', min: 0, max: 0.8, step: 0.05, default: 0.4, label: 'Particle Trails' },
  virtualParticles: { type: 'slider', min: 0, max: 0.6, step: 0.05, default: 0.3, label: 'Virtual Particles' },
  
  // Color and energy
  energySpectrum: { type: 'slider', min: 0, max: 360, step: 20, default: 240, label: 'Energy Spectrum Hue' },
  spectralWidth: { type: 'slider', min: 30, max: 120, step: 10, default: 60, label: 'Spectral Range' },
  quantumGlow: { type: 'slider', min: 0.4, max: 1, step: 0.05, default: 0.8, label: 'Quantum Luminescence' }
};

export function draw(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, any>,
  generator: any,
  time: number
) {
  // Deep space/laboratory background
  const bgGradient = ctx.createRadialGradient(
    width * 0.5, height * 0.5, 0,
    width * 0.5, height * 0.5, Math.max(width, height) * 0.9
  );
  bgGradient.addColorStop(0, '#0a0a12');
  bgGradient.addColorStop(0.6, '#050508');
  bgGradient.addColorStop(1, '#000000');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  // Extract parameters
  const centerX = width / 2;
  const centerY = height / 2;
  const frequency = params.frequency || 1.8;
  const amplitude = params.amplitude || 160;
  const quantumStateNum = Math.round(params.quantumState || 2);
  const fieldDensity = params.fieldDensity || 0.7;
  const waveFunction = params.waveFunction || 0.8;
  const uncertainty = params.uncertainty || 0.4;
  const superposition = params.superposition || 0.6;
  const entanglement = params.entanglement || 0.3;
  const tunneling = params.tunneling || 0.2;
  const energyLevels = Math.round(params.energyLevels || 7);
  const energySpacing = params.energySpacing || 1.2;
  const quantumJumps = params.quantumJumps || 0.4;
  const probabilityCloud = params.probabilityCloud || 0.6;
  const waveCollapse = params.waveCollapse || 0.3;
  const measurement = params.measurement || 0.2;
  const fieldLines = params.fieldLines || 0.7;
  const particleTrails = params.particleTrails || 0.4;
  const virtualParticles = params.virtualParticles || 0.3;
  const energySpectrum = params.energySpectrum || 240;
  const spectralWidth = params.spectralWidth || 60;
  const quantumGlow = params.quantumGlow || 0.8;

  // Quantum scaling with field dynamics
  const baseScale = Math.min(width, height) / 380;
  const scaledAmplitude = amplitude * baseScale;
  
  // Quantum field oscillation
  const quantumPhase = time * frequency * 2;
  const fieldOscillation = 1 + Math.sin(quantumPhase) * uncertainty * 0.1;

  // Generate quantum field structure
  const quantumField = generateQuantumField(
    quantumStateNum, centerX, centerY, scaledAmplitude * fieldOscillation,
    fieldDensity, waveFunction, uncertainty, energyLevels, quantumPhase
  );

  // Quantum color system
  const quantumColors = generateQuantumColors(energySpectrum, spectralWidth, quantumGlow, time);

  // Render probability cloud (background effect)
  if (probabilityCloud > 0.2) {
    renderProbabilityCloud(ctx, quantumField, quantumColors, probabilityCloud, time, scaledAmplitude);
  }

  // Render field lines
  if (fieldLines > 0.3) {
    renderQuantumFieldLines(ctx, quantumField, quantumColors, fieldLines, waveFunction, scaledAmplitude);
  }

  // Render main quantum field
  renderQuantumFieldBody(ctx, quantumField, quantumColors, superposition, waveFunction);

  // Render energy levels
  renderEnergyLevels(ctx, quantumField, quantumColors, energyLevels, energySpacing, quantumJumps, time, scaledAmplitude);

  // Render quantum effects
  if (superposition > 0.1) {
    renderSuperposition(ctx, quantumField, quantumColors, superposition, time, scaledAmplitude);
  }

  if (entanglement > 0.1) {
    renderQuantumEntanglement(ctx, quantumField, quantumColors, entanglement, time, scaledAmplitude);
  }

  if (tunneling > 0.1) {
    renderQuantumTunneling(ctx, quantumField, quantumColors, tunneling, time, scaledAmplitude);
  }

  // Render particle trails
  if (particleTrails > 0.1) {
    renderParticleTrails(ctx, quantumField, quantumColors, particleTrails, time, scaledAmplitude);
  }

  // Render virtual particles
  if (virtualParticles > 0.1) {
    renderVirtualParticles(ctx, quantumField, quantumColors, virtualParticles, time, scaledAmplitude);
  }

  // Render wave function collapse
  if (waveCollapse > 0.1) {
    renderWaveCollapse(ctx, quantumField, quantumColors, waveCollapse, measurement, time);
  }

  function generateQuantumField(quantumState: number, centerX: number, centerY: number, radius: number, density: number, waveFunc: number, uncertainty: number, levels: number, phase: number) {
    const points = [];
    const basePoints = Math.floor(8 + density * 20); // 8-28 points for field complexity
    
    for (let i = 0; i < basePoints; i++) {
      const t = i / basePoints;
      const angle = t * Math.PI * 2;
      
      let fieldRadius = radius;
      
      // Generate quantum state-specific geometry
      switch (quantumState) {
        case 0: // Ground state - minimal energy, stable
          const ground1 = Math.sin(angle * 2 + phase) * (1 - waveFunc) * 0.08;
          const ground2 = Math.sin(angle * 4 + phase * 0.5) * uncertainty * 0.05;
          fieldRadius = radius * (0.92 + ground1 + ground2);
          break;
          
        case 1: // Excited state - higher energy, more dynamic
          const excited1 = Math.sin(angle * 5 + phase) * waveFunc * 0.15;
          const excited2 = Math.sin(angle * 9 + phase * 1.3) * uncertainty * 0.1;
          const excited3 = Math.sin(angle * 13 + phase * 0.8) * density * 0.08;
          fieldRadius = radius * (0.85 + excited1 + excited2 + excited3);
          break;
          
        case 2: // Superposition - multiple states simultaneously
          const super1 = Math.sin(angle * 7 + phase) * waveFunc * 0.2;
          const super2 = Math.sin(angle * 11 + phase * 1.7) * uncertainty * 0.15;
          const super3 = Math.sin(angle * 17 + phase * 2.3) * density * 0.12;
          const superposition = Math.sin(angle * 3 + phase * 0.4) * 0.1;
          fieldRadius = radius * (0.8 + super1 + super2 + super3 + superposition);
          break;
          
        case 3: // Entangled - correlated with distant particles
          const entangled1 = Math.sin(angle * 6 + phase) * waveFunc * 0.18;
          const entangled2 = Math.sin(angle * 14 + phase * 1.9) * uncertainty * 0.13;
          const correlation = Math.sin(angle * 19 + phase * 2.7) * density * 0.15;
          fieldRadius = radius * (0.82 + entangled1 + entangled2 + correlation);
          break;
          
        case 4: // Collapsed - wave function has collapsed to definite state
          const collapsed1 = Math.sin(angle * 4 + phase) * (1 - waveFunc) * 0.1;
          const collapsed2 = Math.floor(Math.sin(angle * 8 + phase) * 3) / 3 * uncertainty * 0.08;
          const definite = (1 - uncertainty) * 0.05;
          fieldRadius = radius * (0.9 + collapsed1 + collapsed2 + definite);
          break;
      }
      
      // Add quantum uncertainty
      const uncertaintyEffect = (Math.random() - 0.5) * uncertainty * 0.1;
      const waveEffect = Math.sin(angle * levels + phase * waveFunc) * waveFunc * 0.08;
      const quantumFluctuation = Math.sin(angle * 23 + phase * 3.1) * density * 0.06;
      
      const finalRadius = fieldRadius * (1 + uncertaintyEffect + waveEffect + quantumFluctuation);
      
      points.push({
        x: centerX + Math.cos(angle) * finalRadius,
        y: centerY + Math.sin(angle) * finalRadius,
        angle: angle,
        radius: finalRadius,
        energyLevel: Math.floor((Math.sin(angle * levels + phase) + 1) * levels / 2),
        waveAmplitude: 0.3 + Math.sin(angle * 5 + phase) * 0.7,
        quantumPhase: (angle + phase * waveFunc) % (Math.PI * 2),
        probability: Math.pow(Math.sin(angle * 3 + phase) * 0.5 + 0.5, 2), // |ψ|²
        fieldStrength: density + Math.sin(angle * 7 + phase * 1.4) * 0.3
      });
    }
    
    return points;
  }

  function generateQuantumColors(spectrum: number, width: number, glow: number, time: number) {
    const animatedSpectrum = spectrum + Math.sin(time * 0.8) * width * 0.3;
    const baseGlow = glow * 80;
    
    return {
      field: `hsl(${animatedSpectrum}, 70%, ${60 + baseGlow * 0.3}%)`,
      high: `hsl(${animatedSpectrum + width * 0.3}, 80%, ${70 + baseGlow * 0.4}%)`,
      low: `hsl(${animatedSpectrum - width * 0.3}, 60%, ${50 + baseGlow * 0.2}%)`,
      quantum: `hsl(${animatedSpectrum + width * 0.6}, 90%, ${80 + baseGlow * 0.2}%)`,
      virtual: `hsl(${animatedSpectrum + width * 0.8}, 85%, 85%)`,
      probability: `hsl(${animatedSpectrum - width * 0.5}, 60%, 65%)`,
      entangled: `hsl(${animatedSpectrum + width}, 95%, 75%)`
    };
  }

  function renderProbabilityCloud(ctx: CanvasRenderingContext2D, field: any[], colors: any, probability: number, time: number, scale: number) {
    ctx.save();
    
    const cloudCount = Math.floor(probability * 25);
    
    for (let c = 0; c < cloudCount; c++) {
      const cloudPhase = time * 1.2 + c * 0.6;
      const cloudLife = (Math.sin(cloudPhase) + 1) / 2;
      
      if (cloudLife > 0.2) {
        const angle = (c / cloudCount) * Math.PI * 2 + time * 0.4;
        const distance = scale * (0.5 + Math.sin(cloudPhase * 0.8) * 0.4);
        const cloudX = field[0].x + Math.cos(angle) * distance;
        const cloudY = field[0].y + Math.sin(angle) * distance;
        const cloudSize = scale * 0.12 * cloudLife * probability;
        
        ctx.globalAlpha = probability * cloudLife * 0.3;
        
        // Probability density visualization
        const probabilityGradient = ctx.createRadialGradient(
          cloudX, cloudY, 0,
          cloudX, cloudY, cloudSize
        );
        probabilityGradient.addColorStop(0, colors.probability);
        probabilityGradient.addColorStop(0.7, colors.field);
        probabilityGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = probabilityGradient;
        ctx.beginPath();
        ctx.arc(cloudX, cloudY, cloudSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    ctx.restore();
  }

  function renderQuantumFieldLines(ctx: CanvasRenderingContext2D, field: any[], colors: any, lines: number, waveFunc: number, scale: number) {
    ctx.save();
    ctx.globalAlpha = lines * 0.4;
    
    const bounds = getBounds(field);
    const lineCount = Math.floor(lines * waveFunc * 12);
    
    for (let l = 0; l < lineCount; l++) {
      const lineAngle = (l / lineCount) * Math.PI * 2;
      const fieldStrength = 0.5 + Math.sin(lineAngle * 7) * 0.5;
      
      ctx.strokeStyle = colors.field;
      ctx.lineWidth = 0.5 + fieldStrength * 1.5;
      ctx.globalAlpha = lines * fieldStrength * 0.6;
      
      // Field line from center outward
      const startX = bounds.centerX;
      const startY = bounds.centerY;
      const endX = bounds.centerX + Math.cos(lineAngle) * scale * fieldStrength;
      const endY = bounds.centerY + Math.sin(lineAngle) * scale * fieldStrength;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      
      // Curved field line
      const segments = 8;
      for (let s = 1; s <= segments; s++) {
        const t = s / segments;
        const curveX = startX + (endX - startX) * t;
        const curveY = startY + (endY - startY) * t;
        const waveOffset = Math.sin(t * Math.PI * 4 + lineAngle * 3) * waveFunc * 5;
        
        ctx.lineTo(
          curveX + Math.cos(lineAngle + Math.PI/2) * waveOffset,
          curveY + Math.sin(lineAngle + Math.PI/2) * waveOffset
        );
      }
      
      ctx.stroke();
    }
    
    ctx.restore();
  }

  function renderQuantumFieldBody(ctx: CanvasRenderingContext2D, field: any[], colors: any, superposition: number, waveFunc: number) {
    ctx.save();
    
    // Main quantum field with wave-like gradient
    const bounds = getBounds(field);
    const fieldGradient = ctx.createRadialGradient(
      bounds.centerX - bounds.width * 0.2, bounds.centerY - bounds.height * 0.2, 0,
      bounds.centerX, bounds.centerY, Math.max(bounds.width, bounds.height) * 0.7
    );
    
    fieldGradient.addColorStop(0, colors.quantum);
    fieldGradient.addColorStop(0.3, colors.high);
    fieldGradient.addColorStop(0.7, colors.field);
    fieldGradient.addColorStop(1, colors.low);
    
    ctx.fillStyle = fieldGradient;
    ctx.globalAlpha = 0.6 + superposition * 0.4;
    drawQuantumPath(ctx, field, waveFunc);
    ctx.fill();
    
    // Field boundary
    ctx.strokeStyle = colors.field;
    ctx.lineWidth = 1 + waveFunc * 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = 0.8;
    drawQuantumPath(ctx, field, waveFunc);
    ctx.stroke();
    
    ctx.restore();
  }

  function renderEnergyLevels(ctx: CanvasRenderingContext2D, field: any[], colors: any, levels: number, spacing: number, jumps: number, time: number, scale: number) {
    ctx.save();
    
    const bounds = getBounds(field);
    
    for (let level = 0; level < levels; level++) {
      const levelRadius = scale * (0.3 + level * 0.08 * spacing);
      const levelEnergy = level / levels;
      const jumpPhase = time * 3 + level * 0.7;
      const jumpActive = Math.sin(jumpPhase) > (1 - jumps * 2);
      
      ctx.globalAlpha = jumpActive ? 0.8 : 0.3;
      
      // Energy level color based on quantum energy
      const levelHue = parseInt(colors.field.match(/\d+/)[0]) + level * 15;
      ctx.strokeStyle = `hsl(${levelHue}, 70%, ${60 + levelEnergy * 30}%)`;
      ctx.lineWidth = jumpActive ? 2 : 1;
      
      // Energy level orbit
      ctx.beginPath();
      
      for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
        const quantumVariation = Math.sin(angle * 7 + time * 2) * 0.05;
        const radius = levelRadius * (1 + quantumVariation);
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
      
      // Quantum jump visualization
      if (jumpActive && jumps > 0.2) {
        ctx.save();
        ctx.globalAlpha = jumps * 0.8;
        ctx.fillStyle = colors.quantum;
        
        const jumpAngle = time * 4 + level;
        const jumpX = bounds.centerX + Math.cos(jumpAngle) * levelRadius;
        const jumpY = bounds.centerY + Math.sin(jumpAngle) * levelRadius;
        
        ctx.beginPath();
        ctx.arc(jumpX, jumpY, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    
    ctx.restore();
  }

  function renderSuperposition(ctx: CanvasRenderingContext2D, field: any[], colors: any, superposition: number, time: number, scale: number) {
    ctx.save();
    ctx.globalAlpha = superposition * 0.5;
    
    // Superposition creates multiple overlapping states
    const stateCount = 3;
    for (let state = 0; state < stateCount; state++) {
      const statePhase = time * 1.5 + state * (Math.PI * 2 / stateCount);
      const stateOffset = scale * 0.1 * Math.sin(statePhase);
      
      ctx.strokeStyle = colors.quantum;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      
      // Offset quantum field copy
      ctx.save();
      ctx.translate(
        Math.cos(state * Math.PI * 2 / stateCount) * stateOffset,
        Math.sin(state * Math.PI * 2 / stateCount) * stateOffset
      );
      drawQuantumPath(ctx, field, 0.8);
      ctx.stroke();
      ctx.restore();
    }
    
    ctx.setLineDash([]);
    ctx.restore();
  }

  function renderQuantumEntanglement(ctx: CanvasRenderingContext2D, field: any[], colors: any, entanglement: number, time: number, scale: number) {
    ctx.save();
    
    const entanglementCount = Math.floor(entanglement * 6);
    
    for (let e = 0; e < entanglementCount; e++) {
      const entanglePhase = time * 2.5 + e * 1.3;
      const entangleLife = (Math.sin(entanglePhase) + 1) / 2;
      
      if (entangleLife > 0.3) {
        const angle1 = (e / entanglementCount) * Math.PI * 2;
        const angle2 = angle1 + Math.PI + Math.sin(entanglePhase) * 0.5;
        
        const point1 = field[Math.floor((e / entanglementCount) * field.length)];
        const point2X = point1.x + Math.cos(angle2) * scale * 0.3;
        const point2Y = point1.y + Math.sin(angle2) * scale * 0.3;
        
        ctx.globalAlpha = entanglement * entangleLife * 0.7;
        
        // Entanglement connection
        const entangleGradient = ctx.createLinearGradient(
          point1.x, point1.y, point2X, point2Y
        );
        entangleGradient.addColorStop(0, colors.entangled);
        entangleGradient.addColorStop(0.5, colors.quantum);
        entangleGradient.addColorStop(1, colors.entangled);
        
        ctx.strokeStyle = entangleGradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(point1.x, point1.y);
        
        // Curved entanglement line
        const midX = (point1.x + point2X) / 2;
        const midY = (point1.y + point2Y) / 2;
        const curveOffset = Math.sin(entanglePhase * 2) * 20;
        ctx.quadraticCurveTo(
          midX + curveOffset * Math.cos(angle1 + Math.PI/2),
          midY + curveOffset * Math.sin(angle1 + Math.PI/2),
          point2X, point2Y
        );
        ctx.stroke();
        
        // Entangled particles
        ctx.fillStyle = colors.entangled;
        ctx.beginPath();
        ctx.arc(point1.x, point1.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(point2X, point2Y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    ctx.restore();
  }

  function renderQuantumTunneling(ctx: CanvasRenderingContext2D, field: any[], colors: any, tunneling: number, time: number, scale: number) {
    ctx.save();
    
    const tunnelCount = Math.floor(tunneling * 8);
    
    for (let t = 0; t < tunnelCount; t++) {
      const tunnelPhase = time * 3 + t * 0.9;
      const tunnelProgress = (Math.sin(tunnelPhase) + 1) / 2;
      
      if (tunnelProgress > 0.2) {
        const tunnelAngle = (t / tunnelCount) * Math.PI * 2;
        const startPoint = field[Math.floor((t / tunnelCount) * field.length)];
        
        // Tunnel through "forbidden" region
        const tunnelDistance = scale * 0.4;
        const tunnelX = startPoint.x + Math.cos(tunnelAngle) * tunnelDistance * tunnelProgress;
        const tunnelY = startPoint.y + Math.sin(tunnelAngle) * tunnelDistance * tunnelProgress;
        
        ctx.globalAlpha = tunneling * (1 - tunnelProgress) * 0.8;
        
        // Tunneling particle trail
        const trailGradient = ctx.createLinearGradient(
          startPoint.x, startPoint.y, tunnelX, tunnelY
        );
        trailGradient.addColorStop(0, colors.virtual);
        trailGradient.addColorStop(tunnelProgress, colors.quantum);
        trailGradient.addColorStop(1, 'transparent');
        
        ctx.strokeStyle = trailGradient;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(tunnelX, tunnelY);
        ctx.stroke();
        
        // Tunneling particle
        ctx.fillStyle = colors.quantum;
        ctx.globalAlpha = tunneling * 0.9;
        ctx.beginPath();
        ctx.arc(tunnelX, tunnelY, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    ctx.restore();
  }

  function renderParticleTrails(ctx: CanvasRenderingContext2D, field: any[], colors: any, trails: number, time: number, scale: number) {
    ctx.save();
    
    const trailCount = Math.floor(trails * 12);
    
    for (let trail = 0; trail < trailCount; trail++) {
      const trailPhase = time * 2 + trail * 0.7;
      const trailLife = (Math.sin(trailPhase) + 1) / 2;
      
      if (trailLife > 0.1) {
        const trailAngle = (trail / trailCount) * Math.PI * 2 + time * 0.3;
        const trailRadius = scale * (0.6 + Math.sin(trailPhase * 1.2) * 0.3);
        const trailX = field[0].x + Math.cos(trailAngle) * trailRadius;
        const trailY = field[0].y + Math.sin(trailAngle) * trailRadius;
        
        ctx.globalAlpha = trails * trailLife * 0.6;
        
        // Particle trail
        const trailSize = 1 + trailLife * 2;
        ctx.fillStyle = colors.high;
        ctx.beginPath();
        ctx.arc(trailX, trailY, trailSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Trail blur
        ctx.save();
        ctx.globalAlpha = trails * trailLife * 0.3;
        ctx.filter = 'blur(2px)';
        ctx.fillStyle = colors.field;
        ctx.beginPath();
        ctx.arc(trailX, trailY, trailSize * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    
    ctx.restore();
  }

  function renderVirtualParticles(ctx: CanvasRenderingContext2D, field: any[], colors: any, virtual: number, time: number, scale: number) {
    ctx.save();
    
    const virtualCount = Math.floor(virtual * 15);
    
    for (let v = 0; v < virtualCount; v++) {
      const virtualPhase = time * 4 + v * 0.5;
      const virtualLife = Math.abs(Math.sin(virtualPhase)); // Brief existence
      
      if (virtualLife > 0.1) {
        const virtualX = field[0].x + (Math.random() - 0.5) * scale * 0.8;
        const virtualY = field[0].y + (Math.random() - 0.5) * scale * 0.8;
        const virtualSize = 0.5 + virtualLife * 1.5;
        
        ctx.globalAlpha = virtual * virtualLife * 0.7;
        
        // Virtual particle (appears and disappears)
        ctx.fillStyle = colors.virtual;
        ctx.beginPath();
        ctx.arc(virtualX, virtualY, virtualSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Virtual particle glow
        ctx.save();
        ctx.globalAlpha = virtual * virtualLife * 0.4;
        ctx.filter = 'blur(1px)';
        ctx.fillStyle = colors.quantum;
        ctx.beginPath();
        ctx.arc(virtualX, virtualY, virtualSize * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
    
    ctx.restore();
  }

  function renderWaveCollapse(ctx: CanvasRenderingContext2D, field: any[], colors: any, collapse: number, measurement: number, time: number) {
    if (measurement > 0.1) {
      ctx.save();
      
      const collapsePhase = time * 1.5;
      const collapseActive = Math.sin(collapsePhase) > (1 - measurement * 2);
      
      if (collapseActive) {
        ctx.globalAlpha = collapse * 0.8;
        
        // Wave function collapse visualization
        const bounds = getBounds(field);
        const collapseGradient = ctx.createRadialGradient(
          bounds.centerX, bounds.centerY, 0,
          bounds.centerX, bounds.centerY, bounds.width * 0.3
        );
        collapseGradient.addColorStop(0, colors.quantum);
        collapseGradient.addColorStop(0.5, colors.field);
        collapseGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = collapseGradient;
        ctx.beginPath();
        ctx.arc(bounds.centerX, bounds.centerY, bounds.width * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Collapse ripples
        for (let r = 1; r <= 3; r++) {
          ctx.globalAlpha = collapse * (0.8 - r * 0.2);
          ctx.strokeStyle = colors.quantum;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.arc(bounds.centerX, bounds.centerY, bounds.width * 0.1 * r, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      
      ctx.restore();
    }
  }

  function drawQuantumPath(ctx: CanvasRenderingContext2D, points: any[], waveComplexity: number) {
    if (points.length < 3) return;
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    // Quantum wave-like curves with uncertainty
    for (let i = 1; i < points.length; i++) {
      const current = points[i];
      const previous = points[i - 1];
      const next = points[(i + 1) % points.length];
      
      // Wave function affects curve smoothness
      const quantumTension = 0.6 + waveComplexity * 0.4;
      const uncertainty = current.probability ? (1 - current.probability) * 0.1 : 0.05;
      
      const cp1x = previous.x + (current.x - (points[i - 2] || previous).x) * quantumTension * 0.3;
      const cp1y = previous.y + (current.y - (points[i - 2] || previous).y) * quantumTension * 0.3;
      const cp2x = current.x - (next.x - previous.x) * quantumTension * 0.3 + uncertainty;
      const cp2y = current.y - (next.y - previous.y) * quantumTension * 0.3 + uncertainty;
      
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, current.x, current.y);
    }
    
    // Close the quantum field
    const first = points[0];
    const last = points[points.length - 1];
    const secondLast = points[points.length - 2];
    const second = points[1];
    
    const quantumTension = 0.6 + waveComplexity * 0.4;
    const cp1x = last.x + (first.x - secondLast.x) * quantumTension * 0.3;
    const cp1y = last.y + (first.y - secondLast.y) * quantumTension * 0.3;
    const cp2x = first.x - (second.x - last.x) * quantumTension * 0.3;
    const cp2y = first.y - (second.y - last.y) * quantumTension * 0.3;
    
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
  name: "⚛️ Quantum Field",
  description: "Abstract quantum physics visualization with superposition, entanglement, and wave-particle duality",
  defaultParams: {
    seed: "quantum-field-physics",
    frequency: 1.8,
    amplitude: 160,
    quantumState: 2,
    fieldDensity: 0.7,
    waveFunction: 0.8,
    uncertainty: 0.4,
    superposition: 0.6,
    entanglement: 0.3,
    tunneling: 0.2,
    energyLevels: 7,
    energySpacing: 1.2,
    quantumJumps: 0.4,
    probabilityCloud: 0.6,
    waveCollapse: 0.3,
    measurement: 0.2,
    fieldLines: 0.7,
    particleTrails: 0.4,
    virtualParticles: 0.3,
    energySpectrum: 240,
    spectralWidth: 60,
    quantumGlow: 0.8
  }
};