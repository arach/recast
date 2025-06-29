import { GeneratorBase, GeneratedElement, GenerationOptions, GenerativeParameters } from './generative-engine';

interface Point {
  x: number;
  y: number;
}

export class PrismGenerator extends GeneratorBase {
  constructor(params: GenerativeParameters, seed?: string) {
    super(params, seed);
    this.metadata = {
      name: 'Prism Generator',
      description: 'Creates isometric 3D prisms and crystal structures',
      category: 'geometric',
      supportedModes: ['cube', 'pyramid', 'hexagonal', 'crystal'],
      defaultParameters: {
        frequency: 1.5,
        amplitude: 60,
        complexity: 0.6,
        chaos: 0.3,
        damping: 0.75,
        layers: 5
      },
      parameterRanges: {
        frequency: { min: 0.1, max: 5, step: 0.1 },
        amplitude: { min: 20, max: 120, step: 5 },
        complexity: { min: 0, max: 1, step: 0.01 },
        chaos: { min: 0, max: 1, step: 0.01 },
        damping: { min: 0.5, max: 1, step: 0.01 },
        layers: { min: 1, max: 8, step: 1 }
      }
    };
  }

  generate(options: GenerationOptions): GeneratedElement[] {
    const elements: GeneratedElement[] = [];
    const { width, height, time = 0 } = options;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Use parameters from this.params instead of options
    const prismType = this.params.prismType || 'crystal';
    const blockCount = Math.max(1, Math.min(12, this.params.layers || 5));
    const frequency = this.params.frequency || 1.5;
    const amplitude = this.params.amplitude || 60;
    const chaos = this.params.chaos || 0.3;
    const damping = this.params.damping || 0.75;
    
    // Base scale and positioning
    const baseScale = Math.min(width, height) / 400;
    const scaledAmplitude = amplitude * baseScale;
    
    // Time-based rotation
    const globalRotation = time * frequency * 0.5;
    
    // Generate prisms
    for (let i = 0; i < blockCount; i++) {
      const blockPhase = (i / blockCount) * Math.PI * 2 + globalRotation;
      
      // Position blocks in formation
      const radius = scaledAmplitude * (0.8 + 0.4 * Math.sin(time + i));
      const blockX = centerX + Math.cos(blockPhase) * radius;
      const blockY = centerY + Math.sin(blockPhase) * radius * 0.6;
      
      // Add chaos to positioning
      const chaosX = (this.rng() - 0.5) * scaledAmplitude * chaos * 0.3;
      const chaosY = (this.rng() - 0.5) * scaledAmplitude * chaos * 0.3;
      
      const finalX = blockX + chaosX;
      const finalY = blockY + chaosY;
      
      // Individual block size
      const blockSize = scaledAmplitude * (0.6 + 0.4 * Math.pow(damping, i));
      
      // Generate simple cube for now
      const cubeElements = this.generateCube(finalX, finalY, blockSize, i, blockCount, time);
      elements.push(...cubeElements);
    }
    
    return elements;
  }
  
  private generateCube(x: number, y: number, size: number, index: number, total: number, time: number): GeneratedElement[] {
    const elements: GeneratedElement[] = [];
    const isoAngle = Math.PI / 6;
    const cos30 = Math.cos(isoAngle);
    const sin30 = Math.sin(isoAngle);
    const depthOffset = size * 0.6;
    
    // Color based on position in sequence
    const hue = (index / total) * 240 + time * 20 + 200;
    const saturation = 70;
    const baseLightness = 50;
    
    // Front face (brightest)
    const frontPoints = [
      { x: x - size/2, y: y - size/2 },
      { x: x + size/2, y: y - size/2 },
      { x: x + size/2, y: y + size/2 },
      { x: x - size/2, y: y + size/2 }
    ];
    
    elements.push({
      type: 'polygon',
      props: {
        points: frontPoints.map(p => `${p.x},${p.y}`).join(' ')
      },
      style: {
        fill: `hsl(${hue}, ${saturation}%, ${baseLightness}%)`,
        stroke: `hsl(${hue}, ${saturation + 10}%, ${baseLightness + 20}%)`,
        strokeWidth: 2
      }
    });
    
    // Right face (medium brightness)
    const rightPoints = [
      { x: x + size/2, y: y - size/2 },
      { x: x + size/2 + depthOffset * cos30, y: y - size/2 - depthOffset * sin30 },
      { x: x + size/2 + depthOffset * cos30, y: y + size/2 - depthOffset * sin30 },
      { x: x + size/2, y: y + size/2 }
    ];
    
    elements.push({
      type: 'polygon',
      props: {
        points: rightPoints.map(p => `${p.x},${p.y}`).join(' ')
      },
      style: {
        fill: `hsl(${hue}, ${saturation}%, ${baseLightness * 0.7}%)`,
        stroke: `hsl(${hue}, ${saturation + 10}%, ${baseLightness + 10}%)`,
        strokeWidth: 2
      }
    });
    
    // Top face (darkest)
    const topPoints = [
      { x: x - size/2, y: y - size/2 },
      { x: x - size/2 + depthOffset * cos30, y: y - size/2 - depthOffset * sin30 },
      { x: x + size/2 + depthOffset * cos30, y: y - size/2 - depthOffset * sin30 },
      { x: x + size/2, y: y - size/2 }
    ];
    
    elements.push({
      type: 'polygon',
      props: {
        points: topPoints.map(p => `${p.x},${p.y}`).join(' ')
      },
      style: {
        fill: `hsl(${hue}, ${saturation}%, ${baseLightness * 0.5}%)`,
        stroke: `hsl(${hue}, ${saturation + 10}%, ${baseLightness}%)`,
        strokeWidth: 2
      }
    });
    
    return elements;
  }
}