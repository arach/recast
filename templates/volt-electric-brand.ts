import type { TemplateUtils } from '@/lib/template-utils';

// VOLT Electric Brand - High-energy borders with electric flow
const parameters = {
  // Core VOLT energy - high frequency electric pulse
  frequency: {
    default: 2.1,
    range: [1.8, 2.4, 0.1]
  },
  amplitude: {
    default: 160,
    range: [140, 180, 5]
  },
  
  // Electric form generation
  energyComplexity: {
    default: 0.7,
    range: [0.5, 1, 0.05]
  },
  voltageSpike: {
    default: 0.8,
    range: [0.6, 1, 0.05]
  },
  electricPulse: {
    default: 0.9,
    range: [0.7, 1, 0.05]
  },
  
  // VOLT border system - electric channels
  borderVoltage: {
    default: 8,
    range: [4, 12, 1]
  },
  electricLayers: {
    default: 3,
    range: [2, 4, 1]
  },
  channelSpacing: {
    default: 6,
    range: [4, 10, 1]
  },
  
  // Electric effects
  electricGlow: {
    default: 0.9,
    range: [0.7, 1, 0.05]
  },
  energyFlow: {
    default: 0.8,
    range: [0.6, 1, 0.05]
  },
  sparkIntensity: {
    default: 0.7,
    range: [0.5, 1, 0.05]
  },
  
  // VOLT electric color system
  electricHue: {
    default: 45,
    range: [35, 65, 5]
  },
  voltageShift: {
    default: 8,
    range: [0, 20, 2]
  },
  energyBrightness: {
    default: 0.95,
    range: [0.8, 1, 0.05]
  },
  
  // Electric animation
  currentFlow: {
    default: 0.85,
    range: [0.7, 1, 0.05]
  },
  arcDischarge: {
    default: 0.6,
    range: [0.4, 0.8, 0.05]
  }
};

function drawVisualization(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: any,
  time: number,
  utils: TemplateUtils
) {
  // Apply universal background
  utils.applyUniversalBackground(ctx, width, height, params);
  
  // Access universal properties
  const fillColor = params.fillColor || '#ffd700';
  const strokeColor = params.strokeColor || '#ffd700';
  const fillOpacity = params.fillOpacity ?? 0.6;
  const strokeOpacity = params.strokeOpacity ?? 1;

  // Extract VOLT parameters
  const centerX = width / 2;
  const centerY = height / 2;
  const frequency = params.frequency || 2.1;
  const amplitude = params.amplitude || 160;
  const energyComplexity = params.energyComplexity || 0.7;
  const voltageSpike = params.voltageSpike || 0.8;
  const electricPulse = params.electricPulse || 0.9;
  const borderVoltage = params.borderVoltage || params.strokeWidth || 8;
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
    primary: params.strokeColor || `hsl(${baseHue}, 100%, ${70 * energyBrightness}%)`,
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

  // Render electric field glow (as fill)
  if (params.fillType !== 'none') {
    renderElectricField(ctx, electricForm, voltColors, params, scaledAmplitude);
  }

  // Render VOLT multi-layer electric borders using stroke settings
  if (params.strokeType !== 'none') {
    for (let layer = electricLayers - 1; layer >= 0; layer--) {
      const layerOffset = layer * channelSpacing;
      const layerAlpha = 1 - (layer * 0.15);
      renderElectricBorder(ctx, electricForm, voltColors, params, layerOffset, layerAlpha, time, layer);
    }
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
      const voltageSpikeVal = 1 + Math.sin(angle * 3 + voltagePhase * 2) * voltage * 0.12;
      const finalRadius = radius * (0.8 + electric1 + electric2 + electric3) * voltageSpikeVal;
      
      points.push({
        x: centerX + Math.cos(angle) * finalRadius,
        y: centerY + Math.sin(angle) * finalRadius,
        angle: angle,
        voltage: electric1 + electric2,
        spike: voltageSpikeVal,
        energy: 0.6 + Math.sin(angle + phase) * 0.4
      });
    }
    
    return points;
  }

  function renderElectricField(ctx: CanvasRenderingContext2D, points: any[], colors: any, params: any, scale: number) {
    ctx.save();
    ctx.globalAlpha = (params.fillOpacity || 0.6) * params.electricGlow;
    
    const bounds = getBounds(points);
    
    if (params.fillType === 'solid') {
      ctx.fillStyle = params.fillColor;
    } else if (params.fillType === 'gradient') {
      // Electric field gradient
      const fieldGradient = ctx.createRadialGradient(
        bounds.centerX, bounds.centerY, 0,
        bounds.centerX, bounds.centerY, Math.max(bounds.width, bounds.height) * 0.8
      );
      
      fieldGradient.addColorStop(0, colors.glow);
      fieldGradient.addColorStop(0.3, params.fillGradientStart || colors.electric);
      fieldGradient.addColorStop(0.6, params.fillGradientEnd || colors.primary);
      fieldGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = fieldGradient;
    }
    
    drawElectricPath(ctx, points, 0);
    ctx.fill();
    
    ctx.restore();
  }

  function renderElectricBorder(ctx: CanvasRenderingContext2D, points: any[], colors: any, params: any, offset: number, alpha: number, time: number, layer: number) {
    ctx.save();
    ctx.globalAlpha = alpha * (params.strokeOpacity || 1);
    
    // Electric ridge border effect
    const borderColors = [colors.primary, colors.electric, colors.spark];
    const layerColor = borderColors[layer % borderColors.length];
    
    ctx.strokeStyle = params.strokeColor || layerColor;
    ctx.lineWidth = (params.strokeWidth || borderVoltage) - layer;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    if (params.strokeType === 'dashed') {
      ctx.setLineDash([15, 5]);
    } else if (params.strokeType === 'dotted') {
      ctx.setLineDash([3, 5]);
    }
    
    // Electric border with energy flow
    drawElectricPath(ctx, points, offset);
    ctx.stroke();
    
    // Add electric flow animation
    if (layer === 0 && params.strokeType === 'solid') {
      renderBorderFlow(ctx, points, colors, params.strokeWidth || borderVoltage, time, offset);
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

const metadata = {
  id: 'volt-electric-brand',
  name: "⚡ VOLT Electric",
  description: "High-energy electric vehicle brand with voltage borders, energy flow, and electric spark effects",
  parameters,
  defaultParams: {
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

export { parameters, metadata, drawVisualization };