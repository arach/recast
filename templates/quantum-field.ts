// ⚛️ Quantum Field
import type { TemplateUtils } from '@/lib/template-utils';

const parameters = {
  frequency: {
    default: 1.8,
    range: [0.8, 3, 0.1]
  },
  amplitude: {
    default: 160,
    range: [90, 220, 5]
  },
  quantumState: {
    default: 2,
    range: [0, 4, 1]  // 0=Ground, 1=Excited, 2=Superposition, 3=Entangled, 4=Collapsed
  },
  fieldDensity: {
    default: 0.7,
    range: [0.4, 1, 0.05]
  },
  waveFunction: {
    default: 0.8,
    range: [0.3, 1, 0.05]
  },
  uncertainty: {
    default: 0.4,
    range: [0.2, 0.8, 0.05]
  },
  superposition: {
    default: 0.6,
    range: [0, 1, 0.05]
  },
  entanglement: {
    default: 0.3,
    range: [0, 0.8, 0.05]
  },
  tunneling: {
    default: 0.2,
    range: [0, 0.6, 0.05]
  },
  energyLevels: {
    default: 7,
    range: [3, 12, 1]
  },
  energySpacing: {
    default: 1.2,
    range: [0.5, 2, 0.1]
  },
  quantumJumps: {
    default: 0.4,
    range: [0, 1, 0.05]
  },
  probabilityCloud: {
    default: 0.6,
    range: [0.2, 1, 0.05]
  },
  waveCollapse: {
    default: 0.3,
    range: [0, 0.7, 0.05]
  },
  measurement: {
    default: 0.2,
    range: [0, 0.5, 0.05]
  },
  fieldLines: {
    default: 0.7,
    range: [0.3, 1, 0.05]
  },
  particleTrails: {
    default: 0.4,
    range: [0, 0.8, 0.05]
  },
  virtualParticles: {
    default: 0.3,
    range: [0, 0.6, 0.05]
  },
  energySpectrum: {
    default: 240,
    range: [0, 360, 20]
  },
  spectralWidth: {
    default: 60,
    range: [30, 120, 10]
  },
  quantumGlow: {
    default: 0.8,
    range: [0.4, 1, 0.05]
  }
};

const metadata = {
  id: 'quantum-field',
  name: "⚛️ Quantum Field",
  description: "Visualize quantum mechanics with wave functions, probability clouds, and energy levels",
  parameters,
  defaultParams: {
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

function drawVisualization(ctx: CanvasRenderingContext2D, width: number, height: number, params: any, time: number, utils: TemplateUtils) {
  utils.applyUniversalBackground(ctx, width, height, params);
  
  const fillColor = params.fillColor || '#60a5fa';
  const strokeColor = params.strokeColor || '#3b82f6';
  const fillOpacity = params.fillOpacity ?? 0.8;
  const strokeOpacity = params.strokeOpacity ?? 0.8;
  
  // Extract parameters
  const centerX = width / 2;
  const centerY = height / 2;
  const frequency = params.frequency || 1.8;
  const amplitude = params.amplitude || 160;
  const quantumStateIndex = Math.round(params.quantumState || 2);
  
  // Quantum states
  const quantumStates = [
    { name: 'Ground', energy: 0, coherence: 0.2, fluctuation: 0.1 },
    { name: 'Excited', energy: 0.6, coherence: 0.7, fluctuation: 0.4 },
    { name: 'Superposition', energy: 0.8, coherence: 1, fluctuation: 0.6 },
    { name: 'Entangled', energy: 0.9, coherence: 0.9, fluctuation: 0.8 },
    { name: 'Collapsed', energy: 0.3, coherence: 0.1, fluctuation: 0.2 }
  ];
  
  const quantumState = quantumStates[Math.min(quantumStateIndex, quantumStates.length - 1)];
  
  // Field properties
  const fieldDensity = params.fieldDensity || 0.7;
  const waveFunction = params.waveFunction || 0.8;
  const uncertainty = params.uncertainty || 0.4;
  
  // Quantum effects
  const superposition = params.superposition || 0.6;
  const entanglement = params.entanglement || 0.3;
  const tunneling = params.tunneling || 0.2;
  
  // Energy levels
  const energyLevels = Math.round(params.energyLevels || 7);
  const energySpacing = params.energySpacing || 1.2;
  const quantumJumps = params.quantumJumps || 0.4;
  
  // Probability distributions
  const probabilityCloud = params.probabilityCloud || 0.6;
  const waveCollapse = params.waveCollapse || 0.3;
  const measurement = params.measurement || 0.2;
  
  // Field visualization
  const fieldLines = params.fieldLines || 0.7;
  const particleTrails = params.particleTrails || 0.4;
  const virtualParticles = params.virtualParticles || 0.3;
  
  // Color properties
  const energySpectrum = params.energySpectrum || 240;
  const spectralWidth = params.spectralWidth || 60;
  const quantumGlow = params.quantumGlow || 0.8;

  // Helper functions
  function quantumWave(x: number, y: number, phase: number): number {
    const k = frequency * 0.1;
    const psi = Math.sin(k * x + phase) * Math.cos(k * y + phase * 0.7);
    const uncertainty_factor = 1 + uncertainty * Math.sin(phase * 3);
    return psi * uncertainty_factor;
  }
  
  function probabilityDensity(x: number, y: number, phase: number): number {
    const wave = quantumWave(x, y, phase);
    return Math.abs(wave * wave);
  }
  
  function drawQuantumField() {
    ctx.save();
    
    // Draw energy levels
    if (energyLevels > 0) {
      ctx.save();
      
      for (let i = 0; i < energyLevels; i++) {
        const levelY = centerY - (i - energyLevels / 2) * energySpacing * 20;
        const levelEnergy = i / energyLevels;
        const levelAlpha = fieldLines * (1 - i / energyLevels) * 0.4;
        
        // Energy level line
        ctx.strokeStyle = `hsla(${energySpectrum + levelEnergy * spectralWidth}, 80%, 60%, ${levelAlpha})`;
        ctx.lineWidth = 1 + quantumState.energy * 2;
        ctx.beginPath();
        ctx.moveTo(centerX - amplitude, levelY);
        ctx.lineTo(centerX + amplitude, levelY);
        ctx.stroke();
        
        // Quantum jumps between levels
        if (quantumJumps > 0 && i < energyLevels - 1 && Math.sin(time * 3 + i) > (1 - quantumJumps)) {
          ctx.save();
          ctx.globalAlpha = quantumJumps * fillOpacity;
          
          const jumpX = centerX + Math.sin(time * 2 + i) * amplitude * 0.8;
          const nextLevelY = centerY - (i + 1 - energyLevels / 2) * energySpacing * 20;
          
          // Jump particle
          const particleGradient = ctx.createRadialGradient(jumpX, levelY, 0, jumpX, levelY, 10);
          particleGradient.addColorStop(0, `hsla(${energySpectrum + 30}, 100%, 70%, ${quantumJumps})`);
          particleGradient.addColorStop(1, `hsla(${energySpectrum + 30}, 100%, 70%, 0)`);
          
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
    if (probabilityCloud > 0) {
      ctx.save();
      ctx.globalAlpha = probabilityCloud * fillOpacity * 0.3;
      
      const cloudPoints = 50;
      const cloudLayers = 5;
      
      for (let layer = 0; layer < cloudLayers; layer++) {
        const layerRadius = amplitude * (0.3 + layer * 0.2);
        const layerAlpha = (1 - layer / cloudLayers) * probabilityCloud;
        
        for (let i = 0; i < cloudPoints; i++) {
          const angle = (i / cloudPoints) * Math.PI * 2;
          const phase = time + layer * 0.5;
          const x = Math.cos(angle) * layerRadius;
          const y = Math.sin(angle) * layerRadius;
          const probability = probabilityDensity(x, y, phase);
          
          const size = 20 * probability * waveFunction;
          const hue = energySpectrum + probability * spectralWidth;
          
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
    if (waveFunction > 0) {
      ctx.save();
      ctx.globalAlpha = waveFunction * fillOpacity;
      
      const waveResolution = 100;
      
      for (let i = 0; i < waveResolution; i++) {
        const x = (i / waveResolution - 0.5) * amplitude * 2;
        const phase = time * quantumState.coherence;
        const wave = quantumWave(x, 0, phase) * amplitude * 0.5;
        const nextX = ((i + 1) / waveResolution - 0.5) * amplitude * 2;
        const nextWave = quantumWave(nextX, 0, phase) * amplitude * 0.5;
        
        // Wave gradient
        const waveGradient = ctx.createLinearGradient(
          centerX + x, centerY,
          centerX + x, centerY - Math.abs(wave)
        );
        const hue = energySpectrum + (wave / amplitude) * spectralWidth;
        waveGradient.addColorStop(0, `hsla(${hue}, 80%, 60%, 0)`);
        waveGradient.addColorStop(0.5, `hsla(${hue}, 90%, 70%, ${waveFunction * 0.8})`);
        waveGradient.addColorStop(1, `hsla(${hue}, 100%, 80%, ${waveFunction})`);
        
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
    if (superposition > 0) {
      ctx.save();
      ctx.globalAlpha = superposition * fillOpacity * 0.5;
      
      const states = 3;
      for (let s = 0; s < states; s++) {
        const statePhase = time + s * Math.PI * 2 / states;
        const stateAlpha = superposition * (1 - s / states);
        
        ctx.strokeStyle = `hsla(${energySpectrum + s * 30}, 70%, 60%, ${stateAlpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        for (let i = 0; i <= 72; i++) {
          const angle = (i / 72) * Math.PI * 2;
          const r = amplitude * 0.8;
          const wave = quantumWave(r * Math.cos(angle), r * Math.sin(angle), statePhase);
          const radius = r + wave * 20 * waveFunction;
          
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
    if (entanglement > 0) {
      ctx.save();
      ctx.globalAlpha = entanglement * fillOpacity;
      
      const entangledPairs = Math.floor(3 + entanglement * 5);
      
      for (let i = 0; i < entangledPairs; i++) {
        const angle1 = (i / entangledPairs) * Math.PI * 2;
        const angle2 = angle1 + Math.PI + Math.sin(time + i) * 0.5;
        const r = amplitude * 0.7;
        
        const x1 = centerX + Math.cos(angle1) * r;
        const y1 = centerY + Math.sin(angle1) * r;
        const x2 = centerX + Math.cos(angle2) * r;
        const y2 = centerY + Math.sin(angle2) * r;
        
        // Entanglement connection
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, `hsla(${energySpectrum}, 80%, 70%, ${entanglement})`);
        gradient.addColorStop(0.5, `hsla(${energySpectrum + 30}, 70%, 60%, ${entanglement * 0.5})`);
        gradient.addColorStop(1, `hsla(${energySpectrum + 60}, 80%, 70%, ${entanglement})`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1 + entanglement * 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Entangled particles
        const particleSize = 4 + entanglement * 6;
        
        // Particle 1
        const particle1Gradient = ctx.createRadialGradient(x1, y1, 0, x1, y1, particleSize);
        particle1Gradient.addColorStop(0, `hsla(${energySpectrum}, 100%, 80%, ${entanglement})`);
        particle1Gradient.addColorStop(1, `hsla(${energySpectrum}, 100%, 80%, 0)`);
        ctx.fillStyle = particle1Gradient;
        ctx.beginPath();
        ctx.arc(x1, y1, particleSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Particle 2
        const particle2Gradient = ctx.createRadialGradient(x2, y2, 0, x2, y2, particleSize);
        particle2Gradient.addColorStop(0, `hsla(${energySpectrum + 60}, 100%, 80%, ${entanglement})`);
        particle2Gradient.addColorStop(1, `hsla(${energySpectrum + 60}, 100%, 80%, 0)`);
        ctx.fillStyle = particle2Gradient;
        ctx.beginPath();
        ctx.arc(x2, y2, particleSize, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
    }
    
    // Draw quantum tunneling
    if (tunneling > 0) {
      ctx.save();
      ctx.globalAlpha = tunneling * fillOpacity;
      
      // Barrier
      const barrierX = centerX;
      const barrierHeight = amplitude * 0.6;
      
      ctx.strokeStyle = `hsla(0, 0%, 50%, ${tunneling * 0.5})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(barrierX, centerY - barrierHeight);
      ctx.lineTo(barrierX, centerY + barrierHeight);
      ctx.stroke();
      
      // Tunneling particles
      const tunnelCount = Math.floor(2 + tunneling * 4);
      for (let i = 0; i < tunnelCount; i++) {
        const particleY = centerY + (Math.random() - 0.5) * barrierHeight * 1.5;
        const phase = time * 2 + i;
        const tunnelProgress = (Math.sin(phase) + 1) / 2;
        const particleX = centerX - amplitude * 0.3 + tunnelProgress * amplitude * 0.6;
        
        // Ghost particle showing tunneling
        if (Math.abs(particleX - barrierX) < 20) {
          ctx.globalAlpha = tunneling * 0.3 * fillOpacity;
        } else {
          ctx.globalAlpha = tunneling * fillOpacity;
        }
        
        const particleGradient = ctx.createRadialGradient(
          particleX, particleY, 0,
          particleX, particleY, 8
        );
        particleGradient.addColorStop(0, `hsla(${energySpectrum + 120}, 80%, 70%, 1)`);
        particleGradient.addColorStop(1, `hsla(${energySpectrum + 120}, 80%, 70%, 0)`);
        
        ctx.fillStyle = particleGradient;
        ctx.beginPath();
        ctx.arc(particleX, particleY, 8, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
    }
    
    // Draw field lines
    if (fieldLines > 0) {
      ctx.save();
      ctx.globalAlpha = fieldLines * 0.3 * fillOpacity;
      
      const lineCount = Math.floor(8 * fieldDensity);
      
      for (let i = 0; i < lineCount; i++) {
        const angle = (i / lineCount) * Math.PI * 2;
        const phase = time * 0.5 + i * 0.5;
        
        ctx.strokeStyle = `hsla(${energySpectrum}, 50%, 60%, ${fieldLines * 0.3})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        for (let r = 0; r < amplitude; r += 5) {
          const fieldStrength = 1 - r / amplitude;
          const wobble = Math.sin(phase + r * 0.05) * uncertainty * 10;
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
    if (particleTrails > 0) {
      ctx.save();
      ctx.globalAlpha = particleTrails * fillOpacity;
      
      const trailCount = Math.floor(3 + particleTrails * 5);
      
      for (let i = 0; i < trailCount; i++) {
        const trailPhase = time * 1.5 + i * Math.PI * 2 / trailCount;
        const trailRadius = amplitude * (0.5 + Math.sin(trailPhase * 0.3) * 0.3);
        const x = centerX + Math.cos(trailPhase) * trailRadius;
        const y = centerY + Math.sin(trailPhase * 1.3) * trailRadius * 0.6;
        
        // Trail history
        const trailLength = 20;
        ctx.beginPath();
        
        for (let j = 0; j < trailLength; j++) {
          const historyPhase = trailPhase - j * 0.1;
          const historyRadius = amplitude * (0.5 + Math.sin(historyPhase * 0.3) * 0.3);
          const historyX = centerX + Math.cos(historyPhase) * historyRadius;
          const historyY = centerY + Math.sin(historyPhase * 1.3) * historyRadius * 0.6;
          const historyAlpha = (1 - j / trailLength) * particleTrails;
          
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
        trailGradient.addColorStop(0, `hsla(${energySpectrum + i * 30}, 80%, 70%, ${particleTrails})`);
        trailGradient.addColorStop(1, `hsla(${energySpectrum + i * 30}, 80%, 70%, 0)`);
        
        ctx.strokeStyle = trailGradient;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Leading particle
        const particleGradient = ctx.createRadialGradient(x, y, 0, x, y, 6);
        particleGradient.addColorStop(0, `hsla(${energySpectrum + i * 30}, 100%, 80%, 1)`);
        particleGradient.addColorStop(1, `hsla(${energySpectrum + i * 30}, 100%, 80%, 0)`);
        
        ctx.fillStyle = particleGradient;
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
    }
    
    // Draw virtual particles
    if (virtualParticles > 0) {
      ctx.save();
      ctx.globalAlpha = virtualParticles * fillOpacity * 0.5;
      
      const virtualCount = Math.floor(10 + virtualParticles * 20);
      
      for (let i = 0; i < virtualCount; i++) {
        const lifetime = 0.5 + Math.random() * 0.5;
        const birth = (time * 2 + i * 17) % (Math.PI * 2);
        const age = ((time * 2) % (Math.PI * 2) - birth + Math.PI * 2) % (Math.PI * 2);
        
        if (age < lifetime) {
          const x = centerX + (Math.random() - 0.5) * amplitude * 2;
          const y = centerY + (Math.random() - 0.5) * amplitude * 2;
          const ageRatio = age / lifetime;
          const alpha = (1 - ageRatio) * virtualParticles * 0.5;
          const size = 2 + (1 - ageRatio) * 4;
          
          ctx.fillStyle = `hsla(${energySpectrum + Math.random() * spectralWidth}, 70%, 70%, ${alpha})`;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      ctx.restore();
    }
    
    // Draw wave collapse visualization
    if (waveCollapse > 0 && Math.sin(time * 0.5) > 0.5) {
      ctx.save();
      ctx.globalAlpha = waveCollapse * fillOpacity;
      
      const collapseProgress = (Math.sin(time * 0.5) - 0.5) * 2;
      const collapseRadius = amplitude * (1 - collapseProgress * 0.5);
      
      // Collapsing wave
      ctx.strokeStyle = `hsla(${energySpectrum + 180}, 80%, 60%, ${waveCollapse * (1 - collapseProgress)})`;
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
        particleGradient.addColorStop(0, `hsla(${energySpectrum + 180}, 100%, 80%, ${waveCollapse})`);
        particleGradient.addColorStop(0.5, `hsla(${energySpectrum + 180}, 90%, 70%, ${waveCollapse * 0.5})`);
        particleGradient.addColorStop(1, `hsla(${energySpectrum + 180}, 80%, 60%, 0)`);
        
        ctx.fillStyle = particleGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();
    }
    
    // Draw measurement effect
    if (measurement > 0) {
      ctx.save();
      ctx.globalAlpha = measurement * fillOpacity;
      
      // Measurement device indicator
      const measureX = centerX + amplitude * 0.8;
      const measureY = centerY;
      
      ctx.strokeStyle = `hsla(0, 80%, 60%, ${measurement})`;
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
      disruptionGradient.addColorStop(0, `hsla(0, 70%, 60%, ${measurement * 0.3})`);
      disruptionGradient.addColorStop(0.5, `hsla(0, 60%, 50%, ${measurement * 0.1})`);
      disruptionGradient.addColorStop(1, `hsla(0, 50%, 40%, 0)`);
      
      ctx.fillStyle = disruptionGradient;
      ctx.beginPath();
      ctx.arc(measureX, measureY, 50, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    }
    
    // Quantum glow effect
    if (quantumGlow > 0) {
      ctx.save();
      ctx.globalAlpha = quantumGlow * 0.3 * fillOpacity;
      
      const glowGradient = ctx.createRadialGradient(
        centerX, centerY, amplitude * 0.5,
        centerX, centerY, amplitude * 1.5
      );
      glowGradient.addColorStop(0, `hsla(${energySpectrum}, 100%, 70%, 0)`);
      glowGradient.addColorStop(0.5, `hsla(${energySpectrum}, 90%, 60%, ${quantumGlow * 0.1})`);
      glowGradient.addColorStop(1, `hsla(${energySpectrum}, 80%, 50%, 0)`);
      
      ctx.fillStyle = glowGradient;
      ctx.fillRect(0, 0, width, height);
      
      ctx.restore();
    }
  }
  
  drawQuantumField();
  
  // Draw outer boundary
  if (params.strokeType !== 'none') {
    ctx.save();
    ctx.globalAlpha = strokeOpacity;
    
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = params.strokeWidth || 1;
    
    if (params.strokeType === 'dashed') {
      ctx.setLineDash([10, 5]);
    } else if (params.strokeType === 'dotted') {
      ctx.setLineDash([2, 3]);
    }
    
    // Quantum field boundary
    ctx.beginPath();
    ctx.arc(centerX, centerY, amplitude, 0, Math.PI * 2);
    ctx.stroke();
    
    ctx.restore();
  }
}

export { parameters, metadata, drawVisualization };