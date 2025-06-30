import type { ParameterDefinition, PresetMetadata } from './types';

// VOLT Electric Brand - High-energy borders with electric flow
export const parameters: Record<string, ParameterDefinition> = {
  // Core VOLT energy - high frequency electric pulse
  frequency: { type: 'slider', min: 1.8, max: 2.4, step: 0.1, default: 2.1, label: 'Electric Frequency' },
  amplitude: { type: 'slider', min: 140, max: 180, step: 5, default: 160, label: 'Energy Scale' },
  
  // Electric form generation
  energyComplexity: { type: 'slider', min: 0.5, max: 1, step: 0.05, default: 0.7, label: 'Energy Complexity' },
  voltageSpike: { type: 'slider', min: 0.6, max: 1, step: 0.05, default: 0.8, label: 'Voltage Spikes' },
  electricPulse: { type: 'slider', min: 0.7, max: 1, step: 0.05, default: 0.9, label: 'Electric Pulse' },
  
  // VOLT border system - electric channels
  borderVoltage: { type: 'slider', min: 4, max: 12, step: 1, default: 8, label: 'Border Voltage' },
  electricLayers: { type: 'slider', min: 2, max: 4, step: 1, default: 3, label: 'Electric Layers' },
  channelSpacing: { type: 'slider', min: 4, max: 10, step: 1, default: 6, label: 'Channel Spacing' },
  
  // Electric effects
  electricGlow: { type: 'slider', min: 0.7, max: 1, step: 0.05, default: 0.9, label: 'Electric Glow' },
  energyFlow: { type: 'slider', min: 0.6, max: 1, step: 0.05, default: 0.8, label: 'Energy Flow Speed' },
  sparkIntensity: { type: 'slider', min: 0.5, max: 1, step: 0.05, default: 0.7, label: 'Spark Intensity' },
  
  // VOLT electric color system
  electricHue: { type: 'slider', min: 35, max: 65, step: 5, default: 45, label: 'Electric Hue (Yellow-Orange)' },
  voltageShift: { type: 'slider', min: 0, max: 20, step: 2, default: 8, label: 'Voltage Color Shift' },
  energyBrightness: { type: 'slider', min: 0.8, max: 1, step: 0.05, default: 0.95, label: 'Energy Brightness' },
  
  // Electric animation
  currentFlow: { type: 'slider', min: 0.7, max: 1, step: 0.05, default: 0.85, label: 'Current Flow Rate' },
  arcDischarge: { type: 'slider', min: 0.4, max: 0.8, step: 0.05, default: 0.6, label: 'Arc Discharge' }
};

export function draw(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, any>,
  _generator: any,
  time: number
) {
  // VOLT electric background - dark energy field
  const bgGradient = ctx.createRadialGradient(
    width * 0.5, height * 0.5, 0,
    width * 0.5, height * 0.5, Math.max(width, height) * 0.8
  );
  bgGradient.addColorStop(0, '#0f0f23');
  bgGradient.addColorStop(0.6, '#1a1a2e');
  bgGradient.addColorStop(1, '#16213e');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  // Extract VOLT parameters
  const centerX = width / 2;
  const centerY = height / 2;
  const frequency = params.frequency || 2.1;
  const amplitude = params.amplitude || 160;
  const energyComplexity = params.energyComplexity || 0.7;
  const voltageSpike = params.voltageSpike || 0.8;
  const electricPulse = params.electricPulse || 0.9;
  const borderVoltage = params.borderVoltage || 8;
  const electricLayers = Math.round(params.electricLayers || 3);
  const channelSpacing = params.channelSpacing || 6;
  const electricGlow = params.electricGlow || 0.9;
  const energyFlow = params.energyFlow || 0.8;
  const sparkIntensity = params.sparkIntensity || 0.7;
  const electricHue = params.electricHue || 45;
  const voltageShift = params.voltageShift || 8;
  const energyBrightness = params.energyBrightness || 0.95;
  const currentFlow = params.currentFlow || 0.85;
  const arcDischarge = params.arcDischarge || 0.6;

  // VOLT electric color palette - high-energy yellows and oranges
  const baseHue = electricHue + Math.sin(time * 2) * voltageShift; // Voltage fluctuation
  const voltColors = {
    primary: `hsl(${baseHue}, 100%, ${70 * energyBrightness}%)`,
    electric: `hsl(${baseHue + 10}, 100%, ${80 * energyBrightness}%)`,
    spark: `hsl(${baseHue - 15}, 100%, ${90 * energyBrightness}%)`,
    arc: `hsl(${baseHue + 25}, 100%, ${85 * energyBrightness}%)`,
    glow: `hsl(${baseHue + 5}, 100%, 95%)`,
    core: '#ffffff'
  };

  // Scale and electric motion
  const baseScale = Math.min(width, height) / 350;
  const scaledAmplitude = amplitude * baseScale;
  
  // VOLT electric pulse - high-frequency energy
  const electricPhase = time * frequency;
  const energyPulse = 1 + Math.sin(electricPhase) * electricPulse * 0.2;
  const voltagePhase = time * frequency * 1.3; // Voltage fluctuation

  // Generate VOLT electric form
  const electricForm = generateElectricForm(
    centerX, centerY, scaledAmplitude * energyPulse,
    energyComplexity, voltageSpike, electricPhase, voltagePhase
  );

  // Render electric field glow
  renderElectricField(ctx, electricForm, voltColors, electricGlow, scaledAmplitude);

  // Render VOLT multi-layer electric borders
  for (let layer = electricLayers - 1; layer >= 0; layer--) {
    const layerOffset = layer * channelSpacing;
    const layerAlpha = 1 - (layer * 0.15);
    renderElectricBorder(ctx, electricForm, voltColors, borderVoltage, layerOffset, layerAlpha, time, layer);
  }

  // Render energy flow animations
  renderEnergyFlow(ctx, electricForm, voltColors, energyFlow, currentFlow, time, scaledAmplitude);

  // Render electric sparks and arcs
  renderElectricSparks(ctx, electricForm, voltColors, sparkIntensity, arcDischarge, time, scaledAmplitude);

  function generateElectricForm(centerX: number, centerY: number, radius: number, complexity: number, voltage: number, phase: number, voltagePhase: number) {
    const points = [];
    const basePoints = Math.floor(6 + complexity * 8); // 6-14 points for electric energy
    
    for (let i = 0; i < basePoints; i++) {
      const t = i / basePoints;
      const angle = t * Math.PI * 2;
      
      // Electric energy harmonics
      const electric1 = Math.sin(angle * 4 + phase) * complexity * 0.25;
      const electric2 = Math.sin(angle * 7 + voltagePhase) * complexity * voltage * 0.15;
      const electric3 = Math.sin(angle * 11 + phase * 1.5) * complexity * 0.08;
      
      // Voltage spike variations
      const voltageSpike = 1 + Math.sin(angle * 3 + voltagePhase * 2) * voltage * 0.12;
      const finalRadius = radius * (0.8 + electric1 + electric2 + electric3) * voltageSpike;
      
      points.push({
        x: centerX + Math.cos(angle) * finalRadius,
        y: centerY + Math.sin(angle) * finalRadius,
        angle: angle,
        voltage: electric1 + electric2,
        spike: voltageSpike,
        energy: 0.6 + Math.sin(angle + phase) * 0.4
      });
    }
    
    return points;
  }

  function renderElectricField(ctx: CanvasRenderingContext2D, points: any[], colors: any, glow: number, scale: number) {
    ctx.save();
    ctx.globalAlpha = glow * 0.6;
    
    const bounds = getBounds(points);
    
    // Electric field gradient
    const fieldGradient = ctx.createRadialGradient(
      bounds.centerX, bounds.centerY, 0,
      bounds.centerX, bounds.centerY, Math.max(bounds.width, bounds.height) * 0.8
    );
    
    fieldGradient.addColorStop(0, colors.glow);
    fieldGradient.addColorStop(0.3, colors.electric);
    fieldGradient.addColorStop(0.6, colors.primary);
    fieldGradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = fieldGradient;
    drawElectricPath(ctx, points, 0);
    ctx.fill();
    
    ctx.restore();
  }

  function renderElectricBorder(ctx: CanvasRenderingContext2D, points: any[], colors: any, voltage: number, offset: number, alpha: number, time: number, layer: number) {
    ctx.save();
    ctx.globalAlpha = alpha;
    
    // Electric ridge border effect
    const borderColors = [colors.primary, colors.electric, colors.spark];
    const layerColor = borderColors[layer % borderColors.length];
    
    ctx.strokeStyle = layerColor;
    ctx.lineWidth = voltage - layer;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Electric border with energy flow
    drawElectricPath(ctx, points, offset);
    ctx.stroke();
    
    // Add electric flow animation
    if (layer === 0) {
      renderBorderFlow(ctx, points, colors, voltage, time, offset);
    }
    
    ctx.restore();
  }

  function renderBorderFlow(ctx: CanvasRenderingContext2D, points: any[], colors: any, voltage: number, time: number, offset: number) {
    ctx.save();
    ctx.globalAlpha = 0.8;
    ctx.strokeStyle = colors.glow;
    ctx.lineWidth = voltage * 0.3;
    
    // Animated flow along border
    const flowOffset = (time * 60) % 25;
    ctx.setLineDash([8, 17]);
    ctx.lineDashOffset = flowOffset;
    
    drawElectricPath(ctx, points, offset);
    ctx.stroke();
    
    ctx.restore();
  }

  function renderEnergyFlow(ctx: CanvasRenderingContext2D, points: any[], colors: any, flow: number, current: number, time: number, scale: number) {
    ctx.save();
    
    // Energy current flowing through the form
    for (let i = 0; i < points.length; i++) {
      const current_point = points[i];
      const next = points[(i + 1) % points.length];
      
      if (Math.random() < flow * 0.6) {
        const flowPhase = time * 4 + i;
        const currentStrength = Math.sin(flowPhase) * current;
        
        if (currentStrength > 0.3) {
          ctx.globalAlpha = currentStrength * 0.8;
          ctx.strokeStyle = colors.electric;
          ctx.lineWidth = 2 + currentStrength * 3;
          ctx.lineCap = 'round';
          
          // Energy pulse along edge
          const pulsePosition = (Math.sin(flowPhase * 2) + 1) / 2;
          const pulseX = current_point.x + (next.x - current_point.x) * pulsePosition;
          const pulseY = current_point.y + (next.y - current_point.y) * pulsePosition;
          
          // Draw energy line
          ctx.beginPath();
          ctx.moveTo(current_point.x, current_point.y);
          ctx.lineTo(next.x, next.y);
          ctx.stroke();
          
          // Draw energy pulse
          ctx.fillStyle = colors.glow;
          ctx.globalAlpha = currentStrength;
          ctx.beginPath();
          ctx.arc(pulseX, pulseY, 2 + currentStrength * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    
    ctx.restore();
  }

  function renderElectricSparks(ctx: CanvasRenderingContext2D, points: any[], colors: any, sparkIntensity: number, arcDischarge: number, time: number, scale: number) {
    ctx.save();
    
    // Electric sparks at high-energy points
    for (const point of points) {
      if (point.energy > 0.7 && Math.random() < sparkIntensity * 0.3) {
        const sparkPhase = time * 6 + point.angle;
        const sparkSize = (2 + Math.sin(sparkPhase) * 3) * point.spike;
        
        ctx.globalAlpha = sparkIntensity * 0.7;
        ctx.fillStyle = colors.spark;
        
        // Spark glow
        const sparkGradient = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, sparkSize * 2
        );
        sparkGradient.addColorStop(0, colors.core);
        sparkGradient.addColorStop(0.5, colors.spark);
        sparkGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = sparkGradient;
        ctx.beginPath();
        ctx.arc(point.x, point.y, sparkSize * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Spark core
        ctx.fillStyle = colors.core;
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(point.x, point.y, sparkSize * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Electric arcs between high-energy points
      if (point.energy > 0.8 && Math.random() < arcDischarge * 0.1) {
        const nearbyPoints = points.filter(p => {
          const dist = Math.sqrt((p.x - point.x) ** 2 + (p.y - point.y) ** 2);
          return dist < scale * 0.8 && p !== point && p.energy > 0.6;
        });
        
        if (nearbyPoints.length > 0) {
          const target = nearbyPoints[0];
          
          ctx.globalAlpha = arcDischarge * 0.6;
          ctx.strokeStyle = colors.arc;
          ctx.lineWidth = 1 + Math.random() * 2;
          ctx.lineCap = 'round';
          
          // Jagged electric arc
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          
          const steps = 3 + Math.floor(Math.random() * 3);
          for (let step = 1; step <= steps; step++) {
            const t = step / steps;
            const arcX = point.x + (target.x - point.x) * t + (Math.random() - 0.5) * 20;
            const arcY = point.y + (target.y - point.y) * t + (Math.random() - 0.5) * 20;
            ctx.lineTo(arcX, arcY);
          }
          
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
        }
      }
    }
    
    ctx.restore();
  }

  function drawElectricPath(ctx: CanvasRenderingContext2D, points: any[], offset: number) {
    if (points.length < 3) return;
    
    const adjustedPoints = points.map(p => ({
      x: p.x + (p.x < width/2 ? -offset : offset),
      y: p.y + (p.y < height/2 ? -offset : offset),
      voltage: p.voltage,
      energy: p.energy
    }));
    
    ctx.beginPath();
    ctx.moveTo(adjustedPoints[0].x, adjustedPoints[0].y);
    
    // Electric curves with voltage-influenced tension
    for (let i = 1; i < adjustedPoints.length; i++) {
      const current = adjustedPoints[i];
      const previous = adjustedPoints[i - 1];
      const next = adjustedPoints[(i + 1) % adjustedPoints.length];
      
      // Electric tension varies with voltage
      const electricTension = 0.7 + (current.voltage || 0) * 0.3;
      const cp1x = previous.x + (current.x - (adjustedPoints[i - 2] || previous).x) * electricTension * 0.2;
      const cp1y = previous.y + (current.y - (adjustedPoints[i - 2] || previous).y) * electricTension * 0.2;
      const cp2x = current.x - (next.x - previous.x) * electricTension * 0.2;
      const cp2y = current.y - (next.y - previous.y) * electricTension * 0.2;
      
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, current.x, current.y);
    }
    
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
  name: "⚡ VOLT Electric",
  description: "High-energy electric vehicle brand with voltage borders, energy flow, and electric spark effects",
  defaultParams: {
    seed: "volt-electric-energy-dynamic-ev",
    frequency: 2.1,
    amplitude: 160,
    energyComplexity: 0.7,
    voltageSpike: 0.8,
    electricPulse: 0.9,
    borderVoltage: 8,
    electricLayers: 3,
    channelSpacing: 6,
    electricGlow: 0.9,
    energyFlow: 0.8,
    sparkIntensity: 0.7,
    electricHue: 45,
    voltageShift: 8,
    energyBrightness: 0.95,
    currentFlow: 0.85,
    arcDischarge: 0.6
  }
};