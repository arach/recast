function drawVisualization(ctx, width, height, params, time, utils) {
  const p = utils.params.load(params, ctx, width, height, time, { parameters });
  
  const fillColor = p.fillColor || '#60a5fa';
  const strokeColor = p.strokeColor || '#3b82f6';
  const fillOpacity = p.fillOpacity ?? 0.8;
  const strokeOpacity = p.strokeOpacity ?? 0.8;
  
  // Extract parameters
  const centerX = width / 2;
  const centerY = height / 2;
  const quantumStateIndex = Math.round(p.quantumState);
  
  // Quantum states
  const quantumStates = [
    { name: 'Ground', energy: 0, coherence: 0.2, fluctuation: 0.1 },
    { name: 'Excited', energy: 0.6, coherence: 0.7, fluctuation: 0.4 },
    { name: 'Superposition', energy: 0.8, coherence: 1, fluctuation: 0.6 },
    { name: 'Entangled', energy: 0.9, coherence: 0.9, fluctuation: 0.8 },
    { name: 'Collapsed', energy: 0.3, coherence: 0.1, fluctuation: 0.2 }
  ];
  
  const quantumState = quantumStates[Math.min(quantumStateIndex, quantumStates.length - 1)];

  // Helper functions
  function quantumWave(x, y, phase) {
    const k = p.frequency * 0.1;
    const psi = Math.sin(k * x + phase) * Math.cos(k * y + phase * 0.7);
    const uncertainty_factor = 1 + p.uncertainty * Math.sin(phase * 3);
    return psi * uncertainty_factor;
  }
  
  function probabilityDensity(x, y, phase) {
    const wave = quantumWave(x, y, phase);
    return Math.abs(wave * wave);
  }
  
  function drawQuantumField() {
    ctx.save();
    
    // Draw energy levels
    if (p.energyLevels > 0) {
      ctx.save();
      
      for (let i = 0; i < p.energyLevels; i++) {
        const levelY = centerY - (i - p.energyLevels / 2) * p.energySpacing * 20;
        const levelEnergy = i / p.energyLevels;
        const levelAlpha = p.fieldLines * (1 - i / p.energyLevels) * 0.4;
        
        // Energy level line
        ctx.strokeStyle = `hsla(${p.energySpectrum + levelEnergy * p.spectralWidth}, 80%, 60%, ${levelAlpha})`;
        ctx.lineWidth = 1 + quantumState.energy * 2;
        ctx.beginPath();
        ctx.moveTo(centerX - p.amplitude, levelY);
        ctx.lineTo(centerX + p.amplitude, levelY);
        ctx.stroke();
        
        // Quantum jumps between levels
        if (p.quantumJumps > 0 && i < p.energyLevels - 1 && Math.sin(time * 3 + i) > (1 - p.quantumJumps)) {
          ctx.save();
          ctx.globalAlpha = p.quantumJumps * fillOpacity;
          
          const jumpX = centerX + Math.sin(time * 2 + i) * p.amplitude * 0.8;
          const nextLevelY = centerY - (i + 1 - p.energyLevels / 2) * p.energySpacing * 20;
          
          // Jump particle
          const particleGradient = ctx.createRadialGradient(jumpX, levelY, 0, jumpX, levelY, 10);
          particleGradient.addColorStop(0, `hsla(${p.energySpectrum + 30}, 100%, 70%, ${p.quantumJumps})`);
          particleGradient.addColorStop(1, `hsla(${p.energySpectrum + 30}, 100%, 70%, 0)`);
          
          ctx.fillStyle = particleGradient;
          ctx.beginPath();
          ctx.arc(jumpX, levelY + (nextLevelY - levelY) * ((Math.sin(time * 4 + i) + 1) / 2), 5, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.restore();
        }
      }
      
      ctx.restore();
    }
    
    // Draw probability cloud
    if (p.probabilityCloud > 0) {
      ctx.save();
      ctx.globalAlpha = p.probabilityCloud * fillOpacity * 0.3;
      
      const cloudPoints = 50;
      const cloudLayers = 5;
      
      for (let layer = 0; layer < cloudLayers; layer++) {
        const layerRadius = p.amplitude * (0.3 + layer * 0.2);
        const layerAlpha = (1 - layer / cloudLayers) * p.probabilityCloud;
        
        for (let i = 0; i < cloudPoints; i++) {
          const angle = (i / cloudPoints) * Math.PI * 2;
          const phase = time + layer * 0.5;
          const x = Math.cos(angle) * layerRadius;
          const y = Math.sin(angle) * layerRadius;
          const probability = probabilityDensity(x, y, phase);
          
          const size = 20 * probability * p.waveFunction;
          const hue = p.energySpectrum + probability * p.spectralWidth;
          
          const cloudGradient = ctx.createRadialGradient(
            centerX + x, centerY + y, 0,
            centerX + x, centerY + y, size
          );
          cloudGradient.addColorStop(0, `hsla(${hue}, 70%, 60%, ${layerAlpha * probability})`);
          cloudGradient.addColorStop(0.5, `hsla(${hue}, 60%, 50%, ${layerAlpha * probability * 0.5})`);
          cloudGradient.addColorStop(1, `hsla(${hue}, 50%, 40%, 0)`);
          
          ctx.fillStyle = cloudGradient;
          ctx.beginPath();
          ctx.arc(centerX + x, centerY + y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      ctx.restore();
    }
    
    // Draw wave function
    if (p.waveFunction > 0) {
      ctx.save();
      ctx.globalAlpha = p.waveFunction * fillOpacity;
      
      const waveResolution = 100;
      
      for (let i = 0; i < waveResolution; i++) {
        const x = (i / waveResolution - 0.5) * p.amplitude * 2;
        const phase = time * quantumState.coherence;
        const wave = quantumWave(x, 0, phase) * p.amplitude * 0.5;
        const nextX = ((i + 1) / waveResolution - 0.5) * p.amplitude * 2;
        const nextWave = quantumWave(nextX, 0, phase) * p.amplitude * 0.5;
        
        // Wave gradient
        const waveGradient = ctx.createLinearGradient(
          centerX + x, centerY,
          centerX + x, centerY - Math.abs(wave)
        );
        const hue = p.energySpectrum + (wave / p.amplitude) * p.spectralWidth;
        waveGradient.addColorStop(0, `hsla(${hue}, 80%, 60%, 0)`);
        waveGradient.addColorStop(0.5, `hsla(${hue}, 90%, 70%, ${p.waveFunction * 0.8})`);
        waveGradient.addColorStop(1, `hsla(${hue}, 100%, 80%, ${p.waveFunction})`);
        
        ctx.strokeStyle = waveGradient;
        ctx.lineWidth = 2 + quantumState.energy;
        ctx.beginPath();
        ctx.moveTo(centerX + x, centerY - wave);
        ctx.lineTo(centerX + nextX, centerY - nextWave);
        ctx.stroke();
      }
      
      ctx.restore();
    }
    
    // Draw superposition states
    if (p.superposition > 0) {
      ctx.save();
      ctx.globalAlpha = p.superposition * fillOpacity * 0.5;
      
      const states = 3;
      for (let s = 0; s < states; s++) {
        const statePhase = time + s * Math.PI * 2 / states;
        const stateAlpha = p.superposition * (1 - s / states);
        
        ctx.strokeStyle = `hsla(${p.energySpectrum + s * 30}, 70%, 60%, ${stateAlpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        for (let i = 0; i <= 72; i++) {
          const angle = (i / 72) * Math.PI * 2;
          const r = p.amplitude * 0.8;
          const wave = quantumWave(r * Math.cos(angle), r * Math.sin(angle), statePhase);
          const radius = r + wave * 20 * p.waveFunction;
          
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
      }
      
      ctx.restore();
    }
    
    // Draw entanglement connections
    if (p.entanglement > 0) {
      ctx.save();
      ctx.globalAlpha = p.entanglement * fillOpacity;
      
      const entangledPairs = Math.floor(3 + p.entanglement * 5);
      
      for (let i = 0; i < entangledPairs; i++) {
        const angle1 = (i / entangledPairs) * Math.PI * 2;
        const angle2 = angle1 + Math.PI + Math.sin(time + i) * 0.5;
        const r = p.amplitude * 0.7;
        
        const x1 = centerX + Math.cos(angle1) * r;
        const y1 = centerY + Math.sin(angle1) * r;
        const x2 = centerX + Math.cos(angle2) * r;
        const y2 = centerY + Math.sin(angle2) * r;
        
        // Entanglement connection
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, `hsla(${p.energySpectrum}, 80%, 70%, ${p.entanglement})`);
        gradient.addColorStop(0.5, `hsla(${p.energySpectrum + 30}, 70%, 60%, ${p.entanglement * 0.5})`);
        gradient.addColorStop(1, `hsla(${p.energySpectrum + 60}, 80%, 70%, ${p.entanglement})`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1 + p.entanglement * 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Entangled particles
        const particleSize = 4 + p.entanglement * 6;
        
        // Particle 1
        const particle1Gradient = ctx.createRadialGradient(x1, y1, 0, x1, y1, particleSize);
        particle1Gradient.addColorStop(0, `hsla(${p.energySpectrum}, 100%, 80%, ${p.entanglement})`);
        particle1Gradient.addColorStop(1, `hsla(${p.energySpectrum}, 100%, 80%, 0)`);
        ctx.fillStyle = particle1Gradient;
        ctx.beginPath();
        ctx.arc(x1, y1, particleSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Particle 2
        const particle2Gradient = ctx.createRadialGradient(x2, y2, 0, x2, y2, particleSize);
        particle2Gradient.addColorStop(0, `hsla(${p.energySpectrum + 60}, 100%, 80%, ${p.entanglement})`);
        particle2Gradient.addColorStop(1, `hsla(${p.energySpectrum + 60}, 100%, 80%, 0)`);
        ctx.fillStyle = particle2Gradient;
        ctx.beginPath();
        ctx.arc(x2, y2, particleSize, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
    }
    
    // Draw quantum tunneling
    if (p.tunneling > 0) {
      ctx.save();
      ctx.globalAlpha = p.tunneling * fillOpacity;
      
      // Barrier
      const barrierX = centerX;
      const barrierHeight = p.amplitude * 0.6;
      
      ctx.strokeStyle = `hsla(0, 0%, 50%, ${p.tunneling * 0.5})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(barrierX, centerY - barrierHeight);
      ctx.lineTo(barrierX, centerY + barrierHeight);
      ctx.stroke();
      
      // Tunneling particles
      const tunnelCount = Math.floor(2 + p.tunneling * 4);
      for (let i = 0; i < tunnelCount; i++) {
        const particleY = centerY + (Math.random() - 0.5) * barrierHeight * 1.5;
        const phase = time * 2 + i;
        const tunnelProgress = (Math.sin(phase) + 1) / 2;
        const particleX = centerX - p.amplitude * 0.3 + tunnelProgress * p.amplitude * 0.6;
        
        // Ghost particle showing tunneling
        if (Math.abs(particleX - barrierX) < 20) {
          ctx.globalAlpha = p.tunneling * 0.3 * fillOpacity;
        } else {
          ctx.globalAlpha = p.tunneling * fillOpacity;
        }
        
        const particleGradient = ctx.createRadialGradient(
          particleX, particleY, 0,
          particleX, particleY, 8
        );
        particleGradient.addColorStop(0, `hsla(${p.energySpectrum + 120}, 80%, 70%, 1)`);
        particleGradient.addColorStop(1, `hsla(${p.energySpectrum + 120}, 80%, 70%, 0)`);
        
        ctx.fillStyle = particleGradient;
        ctx.beginPath();
        ctx.arc(particleX, particleY, 8, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
    }
    
    // Draw field lines
    if (p.fieldLines > 0) {
      ctx.save();
      ctx.globalAlpha = p.fieldLines * 0.3 * fillOpacity;
      
      const lineCount = Math.floor(8 * p.fieldDensity);
      
      for (let i = 0; i < lineCount; i++) {
        const angle = (i / lineCount) * Math.PI * 2;
        const phase = time * 0.5 + i * 0.5;
        
        ctx.strokeStyle = `hsla(${p.energySpectrum}, 50%, 60%, ${p.fieldLines * 0.3})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        for (let r = 0; r < p.amplitude; r += 5) {
          const fieldStrength = 1 - r / p.amplitude;
          const wobble = Math.sin(phase + r * 0.05) * p.uncertainty * 10;
          const x = centerX + Math.cos(angle + wobble * 0.01) * r;
          const y = centerY + Math.sin(angle + wobble * 0.01) * r;
          
          if (r === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
      }
      
      ctx.restore();
    }
    
    // Draw particle trails
    if (p.particleTrails > 0) {
      ctx.save();
      ctx.globalAlpha = p.particleTrails * fillOpacity;
      
      const trailCount = Math.floor(3 + p.particleTrails * 5);
      
      for (let i = 0; i < trailCount; i++) {
        const trailPhase = time * 1.5 + i * Math.PI * 2 / trailCount;
        const trailRadius = p.amplitude * (0.5 + Math.sin(trailPhase * 0.3) * 0.3);
        const x = centerX + Math.cos(trailPhase) * trailRadius;
        const y = centerY + Math.sin(trailPhase * 1.3) * trailRadius * 0.6;
        
        // Trail history
        const trailLength = 20;
        ctx.beginPath();
        
        for (let j = 0; j < trailLength; j++) {
          const historyPhase = trailPhase - j * 0.1;
          const historyRadius = p.amplitude * (0.5 + Math.sin(historyPhase * 0.3) * 0.3);
          const historyX = centerX + Math.cos(historyPhase) * historyRadius;
          const historyY = centerY + Math.sin(historyPhase * 1.3) * historyRadius * 0.6;
          const historyAlpha = (1 - j / trailLength) * p.particleTrails;
          
          if (j === 0) {
            ctx.moveTo(historyX, historyY);
          } else {
            ctx.lineTo(historyX, historyY);
          }
        }
        
        const trailGradient = ctx.createLinearGradient(
          x, y,
          centerX + Math.cos(trailPhase - trailLength * 0.1) * trailRadius,
          centerY + Math.sin(trailPhase * 1.3 - trailLength * 0.1) * trailRadius * 0.6
        );
        trailGradient.addColorStop(0, `hsla(${p.energySpectrum + i * 30}, 80%, 70%, ${p.particleTrails})`);
        trailGradient.addColorStop(1, `hsla(${p.energySpectrum + i * 30}, 80%, 70%, 0)`);
        
        ctx.strokeStyle = trailGradient;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Leading particle
        const particleGradient = ctx.createRadialGradient(x, y, 0, x, y, 6);
        particleGradient.addColorStop(0, `hsla(${p.energySpectrum + i * 30}, 100%, 80%, 1)`);
        particleGradient.addColorStop(1, `hsla(${p.energySpectrum + i * 30}, 100%, 80%, 0)`);
        
        ctx.fillStyle = particleGradient;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
    }
    
    // Draw virtual particles
    if (p.virtualParticles > 0) {
      ctx.save();
      ctx.globalAlpha = p.virtualParticles * fillOpacity * 0.5;
      
      const virtualCount = Math.floor(10 + p.virtualParticles * 20);
      
      for (let i = 0; i < virtualCount; i++) {
        const lifetime = 0.5 + Math.random() * 0.5;
        const birth = (time * 2 + i * 17) % (Math.PI * 2);
        const age = ((time * 2) % (Math.PI * 2) - birth + Math.PI * 2) % (Math.PI * 2);
        
        if (age < lifetime) {
          const x = centerX + (Math.random() - 0.5) * p.amplitude * 2;
          const y = centerY + (Math.random() - 0.5) * p.amplitude * 2;
          const ageRatio = age / lifetime;
          const alpha = (1 - ageRatio) * p.virtualParticles * 0.5;
          const size = 2 + (1 - ageRatio) * 4;
          
          ctx.fillStyle = `hsla(${p.energySpectrum + Math.random() * p.spectralWidth}, 70%, 70%, ${alpha})`;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      ctx.restore();
    }
    
    // Draw wave collapse visualization
    if (p.waveCollapse > 0 && Math.sin(time * 0.5) > 0.5) {
      ctx.save();
      ctx.globalAlpha = p.waveCollapse * fillOpacity;
      
      const collapseProgress = (Math.sin(time * 0.5) - 0.5) * 2;
      const collapseRadius = p.amplitude * (1 - collapseProgress * 0.5);
      
      // Collapsing wave
      ctx.strokeStyle = `hsla(${p.energySpectrum + 180}, 80%, 60%, ${p.waveCollapse * (1 - collapseProgress)})`;
      ctx.lineWidth = 2 + (1 - collapseProgress) * 3;
      ctx.beginPath();
      ctx.arc(centerX, centerY, collapseRadius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Collapsed state
      if (collapseProgress > 0.8) {
        const particleGradient = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, 20
        );
        particleGradient.addColorStop(0, `hsla(${p.energySpectrum + 180}, 100%, 80%, ${p.waveCollapse})`);
        particleGradient.addColorStop(0.5, `hsla(${p.energySpectrum + 180}, 90%, 70%, ${p.waveCollapse * 0.5})`);
        particleGradient.addColorStop(1, `hsla(${p.energySpectrum + 180}, 80%, 60%, 0)`);
        
        ctx.fillStyle = particleGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
    }
    
    // Draw measurement effect
    if (p.measurement > 0) {
      ctx.save();
      ctx.globalAlpha = p.measurement * fillOpacity;
      
      // Measurement device indicator
      const measureX = centerX + p.amplitude * 0.8;
      const measureY = centerY;
      
      ctx.strokeStyle = `hsla(0, 80%, 60%, ${p.measurement})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(measureX - 10, measureY - 10);
      ctx.lineTo(measureX + 10, measureY + 10);
      ctx.moveTo(measureX + 10, measureY - 10);
      ctx.lineTo(measureX - 10, measureY + 10);
      ctx.stroke();
      
      // Measurement disruption
      const disruptionGradient = ctx.createRadialGradient(
        measureX, measureY, 0,
        measureX, measureY, 50
      );
      disruptionGradient.addColorStop(0, `hsla(0, 70%, 60%, ${p.measurement * 0.3})`);
      disruptionGradient.addColorStop(0.5, `hsla(0, 60%, 50%, ${p.measurement * 0.1})`);
      disruptionGradient.addColorStop(1, `hsla(0, 50%, 40%, 0)`);
      
      ctx.fillStyle = disruptionGradient;
      ctx.beginPath();
      ctx.arc(measureX, measureY, 50, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    }
    
    // Quantum glow effect
    if (p.quantumGlow > 0) {
      ctx.save();
      ctx.globalAlpha = p.quantumGlow * 0.3 * fillOpacity;
      
      const glowGradient = ctx.createRadialGradient(
        centerX, centerY, p.amplitude * 0.5,
        centerX, centerY, p.amplitude * 1.5
      );
      glowGradient.addColorStop(0, `hsla(${p.energySpectrum}, 100%, 70%, 0)`);
      glowGradient.addColorStop(0.5, `hsla(${p.energySpectrum}, 90%, 60%, ${p.quantumGlow * 0.1})`);
      glowGradient.addColorStop(1, `hsla(${p.energySpectrum}, 80%, 50%, 0)`);
      
      ctx.fillStyle = glowGradient;
      ctx.fillRect(0, 0, width, height);
      
      ctx.restore();
    }
  }
  
  drawQuantumField();
  
  // Draw outer boundary
  if (p.strokeType !== 'none') {
    ctx.save();
    ctx.globalAlpha = strokeOpacity;
    
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = p.strokeWidth || 1;
    
    if (p.strokeType === 'dashed') {
      ctx.setLineDash([10, 5]);
    } else if (p.strokeType === 'dotted') {
      ctx.setLineDash([2, 3]);
    }
    
    // Quantum field boundary
    ctx.beginPath();
    ctx.arc(centerX, centerY, p.amplitude, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.restore();
  }
}

// Helper functions
const slider = (def, min, max, step, label, unit, opts = {}) => ({ 
  type: "slider", default: def, min, max, step, label, unit, ...opts 
});
const select = (def, options, label, opts = {}) => ({ 
  type: "select", default: def, options, label, ...opts 
});

export const parameters = {
  quantumState: select(2, [
    { value: 0, label: '⬇️ Ground' },
    { value: 1, label: '⬆️ Excited' },
    { value: 2, label: '🌀 Superposition' },
    { value: 3, label: '🔗 Entangled' },
    { value: 4, label: '💥 Collapsed' }
  ], 'Quantum State'),
  frequency: slider(1.8, 0.8, 3, 0.1, 'Wave Frequency', 'Hz'),
  amplitude: slider(160, 90, 220, 5, 'Field Amplitude', 'px'),
  fieldDensity: slider(0.7, 0.4, 1, 0.05, 'Field Density'),
  waveFunction: slider(0.8, 0.3, 1, 0.05, 'Wave Function'),
  uncertainty: slider(0.4, 0.2, 0.8, 0.05, 'Heisenberg Uncertainty'),
  superposition: slider(0.6, 0, 1, 0.05, 'Superposition'),
  entanglement: slider(0.3, 0, 0.8, 0.05, 'Entanglement'),
  tunneling: slider(0.2, 0, 0.6, 0.05, 'Quantum Tunneling'),
  energyLevels: slider(7, 3, 12, 1, 'Energy Levels'),
  energySpacing: slider(1.2, 0.5, 2, 0.1, 'Energy Spacing'),
  quantumJumps: slider(0.4, 0, 1, 0.05, 'Quantum Jumps'),
  probabilityCloud: slider(0.6, 0.2, 1, 0.05, 'Probability Cloud'),
  waveCollapse: slider(0.3, 0, 0.7, 0.05, 'Wave Collapse'),
  measurement: slider(0.2, 0, 0.5, 0.05, 'Measurement Effect'),
  fieldLines: slider(0.7, 0.3, 1, 0.05, 'Field Lines'),
  particleTrails: slider(0.4, 0, 0.8, 0.05, 'Particle Trails'),
  virtualParticles: slider(0.3, 0, 0.6, 0.05, 'Virtual Particles'),
  energySpectrum: slider(240, 0, 360, 20, 'Energy Spectrum Hue', '°'),
  spectralWidth: slider(60, 30, 120, 10, 'Spectral Width', '°'),
  quantumGlow: slider(0.8, 0.4, 1, 0.05, 'Quantum Glow')
};

export const metadata = {
  name: "⚛️ Quantum Field",
  description: "Quantum mechanics visualization with wave functions",
  category: "generative",
  tags: ["quantum", "physics", "wave", "field", "mechanics", "science"],
  author: "ReFlow",
  version: "1.0.0"
};