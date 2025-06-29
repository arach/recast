import type { ParameterDefinition, PresetMetadata } from './types';

// NEXUS AI Brand - Neural kinetic energy with network connections
export const parameters: Record<string, ParameterDefinition> = {
  // Core NEXUS identity parameters - locked for brand consistency
  frequency: { type: 'slider', min: 1.2, max: 1.6, step: 0.1, default: 1.4, label: 'Neural Frequency' },
  amplitude: { type: 'slider', min: 120, max: 160, step: 5, default: 140, label: 'Presence Scale' },
  
  // Neural network architecture
  nodeCount: { type: 'slider', min: 5, max: 8, step: 1, default: 6, label: 'Neural Nodes' },
  connectionDensity: { type: 'slider', min: 0.6, max: 1, step: 0.05, default: 0.85, label: 'Network Density' },
  synapseGlow: { type: 'slider', min: 0.5, max: 1, step: 0.05, default: 0.8, label: 'Synapse Intensity' },
  
  // NEXUS kinetic energy
  kineticFlow: { type: 'slider', min: 0.7, max: 1, step: 0.05, default: 0.9, label: 'Energy Flow' },
  pulsePower: { type: 'slider', min: 0.6, max: 1, step: 0.05, default: 0.8, label: 'Neural Pulse' },
  
  // Premium materials (locked to carbon for NEXUS)
  surfaceRefinement: { type: 'slider', min: 0.7, max: 1, step: 0.05, default: 0.9, label: 'Surface Quality' },
  specularShine: { type: 'slider', min: 0.4, max: 0.8, step: 0.05, default: 0.6, label: 'Metallic Shine' },
  
  // NEXUS color system (locked to brand palette)
  chromaShift: { type: 'slider', min: 0, max: 30, step: 5, default: 10, label: 'Color Variance' },
  energyBrightness: { type: 'slider', min: 0.6, max: 1, step: 0.05, default: 0.8, label: 'Energy Luminance' }
};

export function draw(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, any>,
  generator: any,
  time: number
) {
  // NEXUS brand background - high-tech gradient
  const bgGradient = ctx.createRadialGradient(
    width * 0.3, height * 0.2, 0,
    width * 0.7, height * 0.8, Math.max(width, height)
  );
  bgGradient.addColorStop(0, '#0a0f1c');
  bgGradient.addColorStop(0.6, '#0f172a');
  bgGradient.addColorStop(1, '#020617');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  // Extract NEXUS parameters
  const centerX = width / 2;
  const centerY = height / 2;
  const frequency = params.frequency || 1.4;
  const amplitude = params.amplitude || 140;
  const nodeCount = Math.round(params.nodeCount || 6);
  const connectionDensity = params.connectionDensity || 0.85;
  const synapseGlow = params.synapseGlow || 0.8;
  const kineticFlow = params.kineticFlow || 0.9;
  const pulsePower = params.pulsePower || 0.8;
  const chromaShift = params.chromaShift || 10;
  const energyBrightness = params.energyBrightness || 0.8;

  // NEXUS brand colors - high-tech neural palette
  const baseHue = 200 + chromaShift; // Neural blue
  const brandColors = {
    primary: `hsl(${baseHue}, 85%, ${40 + energyBrightness * 20}%)`,
    neural: `hsl(${baseHue + 20}, 90%, ${60 + energyBrightness * 25}%)`,
    synapse: `hsl(${baseHue - 15}, 95%, ${70 + energyBrightness * 20}%)`,
    energy: `hsl(${baseHue + 40}, 100%, ${75 + energyBrightness * 15}%)`,
    glow: `hsl(${baseHue + 10}, 100%, 85%)`
  };

  // Scale and kinetic motion
  const baseScale = Math.min(width, height) / 350;
  const scaledAmplitude = amplitude * baseScale;
  
  // NEXUS kinetic pulse - neural firing pattern
  const primaryPulse = time * frequency;
  const neuralPulse = 1 + Math.sin(primaryPulse) * pulsePower * 0.15;
  const synapsePhase = time * frequency * 1.618; // Golden ratio timing

  // Generate NEXUS neural network nodes
  const neuralNodes = generateNeuralNetwork(
    centerX, centerY, scaledAmplitude * neuralPulse,
    nodeCount, primaryPulse, synapsePhase
  );

  // Render NEXUS neural glow field
  renderNeuralField(ctx, neuralNodes, brandColors, synapseGlow, scaledAmplitude);

  // Render neural connections with kinetic energy
  renderKineticConnections(ctx, neuralNodes, brandColors, connectionDensity, kineticFlow, time);

  // Render NEXUS core nodes
  renderNeuralCores(ctx, neuralNodes, brandColors, scaledAmplitude, neuralPulse, synapsePhase);

  // Add NEXUS energy signatures
  renderEnergySignatures(ctx, centerX, centerY, scaledAmplitude, brandColors, time, frequency);

  function generateNeuralNetwork(centerX: number, centerY: number, radius: number, nodeCount: number, phase: number, synapsePhase: number) {
    const nodes = [];
    
    // Primary neural star formation
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2 - Math.PI / 2;
      
      // Neural positioning with kinetic variation
      const neuralRadius = radius * (0.8 + Math.sin(angle * 2 + phase) * 0.2);
      const synapticShift = Math.sin(angle * 3 + synapsePhase) * radius * 0.1;
      
      nodes.push({
        x: centerX + Math.cos(angle) * neuralRadius + synapticShift,
        y: centerY + Math.sin(angle) * neuralRadius,
        angle: angle,
        energy: 0.7 + Math.sin(angle + phase) * 0.3,
        synapticActivity: Math.sin(angle * 2 + synapsePhase) * 0.5 + 0.5
      });
    }
    
    return nodes;
  }

  function renderNeuralField(ctx: CanvasRenderingContext2D, nodes: any[], colors: any, glow: number, scale: number) {
    ctx.save();
    ctx.globalAlpha = glow * 0.4;
    
    for (const node of nodes) {
      const fieldGradient = ctx.createRadialGradient(
        node.x, node.y, 0,
        node.x, node.y, scale * 0.8
      );
      
      fieldGradient.addColorStop(0, colors.glow);
      fieldGradient.addColorStop(0.3, colors.neural);
      fieldGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = fieldGradient;
      ctx.beginPath();
      ctx.arc(node.x, node.y, scale * 0.8 * node.energy, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }

  function renderKineticConnections(ctx: CanvasRenderingContext2D, nodes: any[], colors: any, density: number, flow: number, time: number) {
    ctx.save();
    
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.random() < density * 0.7) {
          const nodeA = nodes[i];
          const nodeB = nodes[j];
          
          // Kinetic energy flowing through connections
          const flowPhase = time * 3 + i + j;
          const energyFlow = Math.sin(flowPhase) * flow;
          const connectionStrength = (nodeA.energy + nodeB.energy) / 2;
          
          ctx.globalAlpha = connectionStrength * 0.6;
          ctx.strokeStyle = colors.synapse;
          ctx.lineWidth = 2 + energyFlow * 2;
          ctx.lineCap = 'round';
          
          // Animated energy pulse along connection
          const pulsePosition = (Math.sin(flowPhase * 2) + 1) / 2;
          const pulseX = nodeA.x + (nodeB.x - nodeA.x) * pulsePosition;
          const pulseY = nodeA.y + (nodeB.y - nodeA.y) * pulsePosition;
          
          // Draw connection
          ctx.beginPath();
          ctx.moveTo(nodeA.x, nodeA.y);
          ctx.lineTo(nodeB.x, nodeB.y);
          ctx.stroke();
          
          // Draw energy pulse
          ctx.fillStyle = colors.energy;
          ctx.globalAlpha = connectionStrength * energyFlow * 0.8;
          ctx.beginPath();
          ctx.arc(pulseX, pulseY, 3 + energyFlow * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    
    ctx.restore();
  }

  function renderNeuralCores(ctx: CanvasRenderingContext2D, nodes: any[], colors: any, scale: number, pulse: number, synapsePhase: number) {
    ctx.save();
    
    for (const node of nodes) {
      const coreSize = scale * 0.08 * pulse * node.energy;
      const synapticGlow = Math.sin(node.angle * 2 + synapsePhase) * 0.3 + 0.7;
      
      // Neural core glow
      const coreGradient = ctx.createRadialGradient(
        node.x, node.y, 0,
        node.x, node.y, coreSize * 2
      );
      
      coreGradient.addColorStop(0, colors.energy);
      coreGradient.addColorStop(0.5, colors.neural);
      coreGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = coreGradient;
      ctx.globalAlpha = synapticGlow * 0.8;
      ctx.beginPath();
      ctx.arc(node.x, node.y, coreSize * 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Neural core
      ctx.fillStyle = colors.primary;
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(node.x, node.y, coreSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Synaptic highlight
      ctx.fillStyle = colors.glow;
      ctx.globalAlpha = synapticGlow;
      ctx.beginPath();
      ctx.arc(node.x - coreSize * 0.3, node.y - coreSize * 0.3, coreSize * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }

  function renderEnergySignatures(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, scale: number, colors: any, time: number, frequency: number) {
    ctx.save();
    
    // NEXUS energy rings
    for (let ring = 0; ring < 3; ring++) {
      const ringRadius = scale * (0.3 + ring * 0.4);
      const ringPhase = time * frequency * (1 + ring * 0.3);
      const ringAlpha = 0.3 - ring * 0.1;
      
      ctx.globalAlpha = ringAlpha;
      ctx.strokeStyle = colors.synapse;
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 10]);
      ctx.lineDashOffset = ringPhase * 10;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    ctx.restore();
  }
}

export const metadata: PresetMetadata = {
  name: "🔮 NEXUS AI",
  description: "Neural kinetic energy brand with synaptic connections and high-tech carbon materials",
  defaultParams: {
    seed: "nexus-ai-neural-kinetic-2025",
    frequency: 1.4,
    amplitude: 140,
    nodeCount: 6,
    connectionDensity: 0.85,
    synapseGlow: 0.8,
    kineticFlow: 0.9,
    pulsePower: 0.8,
    surfaceRefinement: 0.9,
    specularShine: 0.6,
    chromaShift: 10,
    energyBrightness: 0.8
  }
};