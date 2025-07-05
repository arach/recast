import type { TemplateUtils } from '@reflow/template-utils';

const parameters = {
  frequency: {
    default: 1.5,
    range: [0.1, 5, 0.1]
  },
  amplitude: {
    default: 60,
    range: [20, 120, 5]
  },
  complexity: {
    default: 0.6,
    range: [0, 1, 0.01]
  },
  chaos: {
    default: 0.3,
    range: [0, 1, 0.01]
  },
  damping: {
    default: 0.75,
    range: [0.5, 1, 0.01]
  },
  layers: {
    default: 5,
    range: [1, 8, 1]
  },
  prismType: {
    default: 'crystal',
    options: ['cube', 'pyramid', 'hexagonal', 'crystal']
  },
  depth: {
    default: 0.8,
    range: [0.1, 2, 0.1]
  },
  perspective: {
    default: 0.6,
    range: [0.1, 1, 0.1]
  },
  facetBrightness: {
    default: 0.85,
    range: [0.2, 1, 0.05]
  },
  crystalline: {
    default: true,
    options: [true, false]
  }
};

function drawVisualization(ctx: CanvasRenderingContext2D, width: number, height: number, params: any, time: number, utils: TemplateUtils) {
  // Apply universal background
  utils.applyUniversalBackground(ctx, width, height, params);

  // Direct prism generation without external requires
  const centerX = width / 2;
  const centerY = height / 2;
  const blockCount = params.layers || 5;
  const frequency = params.frequency || 1.5;
  const amplitude = params.amplitude || 60;
  const complexity = params.complexity || 0.6;
  const chaos = params.chaos || 0.3;
  const damping = params.damping || 0.75;
  const prismType = params.prismType || 'crystal';
  const depth = params.depth || 0.8;
  const perspective = params.perspective || 0.6;
  const facetBrightness = params.facetBrightness || 0.85;
  const crystalline = params.crystalline !== false;

  // Simple seeded random function
  let seed = 1;
  const seedStr = params.seed || 'crystal-blocks';
  for (let i = 0; i < seedStr.length; i++) {
    seed = ((seed << 5) - seed) + seedStr.charCodeAt(i);
    seed = seed & seed;
  }
  
  function seededRandom() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  // Base scale and positioning
  const baseScale = Math.min(width, height) / 400;
  const scaledAmplitude = amplitude * baseScale;

  // Isometric transformation constants
  const isoAngle = Math.PI / 6; // 30 degrees
  const cos30 = Math.cos(isoAngle);
  const sin30 = Math.sin(isoAngle);

  // Time-based rotation
  const globalRotation = time * frequency * 0.5;

  // Generate and sort all geometric elements by depth for proper z-ordering
  const allElements: Array<{
    type: string;
    points?: Array<{x: number, y: number}>;
    center?: {x: number, y: number};
    radius?: number;
    fillColor: string;
    strokeColor: string;
    strokeWidth: number;
    depth: number;
  }> = [];

  // Generate prisms
  for (let i = 0; i < blockCount; i++) {
    const blockPhase = (i / blockCount) * Math.PI * 2 + globalRotation;
    
    // Position blocks in formation
    const radius = scaledAmplitude * (0.8 + 0.4 * Math.sin(time + i));
    const blockX = centerX + Math.cos(blockPhase) * radius;
    const blockY = centerY + Math.sin(blockPhase) * radius * 0.6; // Flatten Y for isometric look
    
    // Add chaos to positioning
    const chaosX = (seededRandom() - 0.5) * scaledAmplitude * chaos * 0.3;
    const chaosY = (seededRandom() - 0.5) * scaledAmplitude * chaos * 0.3;
    
    const finalX = blockX + chaosX;
    const finalY = blockY + chaosY;
    
    // Individual block rotation and size
    const blockRotation = globalRotation + (i * Math.PI / 3);
    const blockSize = scaledAmplitude * (0.6 + 0.4 * Math.pow(damping, i));
    
    // Generate prism elements based on type
    const prismElements = generatePrism(
      prismType,
      finalX,
      finalY,
      blockSize,
      blockRotation,
      depth,
      perspective,
      facetBrightness,
      crystalline,
      i,
      blockCount,
      time,
      seededRandom
    );
    
    allElements.push(...prismElements);
  }

  // Sort by depth for proper rendering order
  allElements.sort((a, b) => a.depth - b.depth);

  // Add subtle glow for crystalline effect
  if (crystalline) {
    ctx.shadowColor = 'rgba(150, 200, 255, 0.3)';
    ctx.shadowBlur = 8;
  }

  // Render all elements in depth order
  for (const element of allElements) {
    ctx.save();
    
    // Use element-specific colors (crystal blocks have their own color logic)
    ctx.fillStyle = element.fillColor;
    ctx.strokeStyle = params.strokeColor || element.strokeColor;
    ctx.lineWidth = params.strokeWidth || element.strokeWidth;
    
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    if (element.type === 'polygon' && element.points) {
      ctx.beginPath();
      const points = element.points;
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.closePath();
      if (params.fillOpacity > 0) {
        ctx.globalAlpha = params.fillOpacity;
        ctx.fill();
      }
      if (params.strokeOpacity > 0) {
        ctx.globalAlpha = params.strokeOpacity;
        ctx.stroke();
      }
    } else if (element.type === 'circle' && element.center && element.radius) {
      ctx.beginPath();
      ctx.arc(element.center.x, element.center.y, element.radius, 0, Math.PI * 2);
      if (params.fillOpacity > 0) {
        ctx.globalAlpha = params.fillOpacity;
        ctx.fill();
      }
      if (params.strokeOpacity > 0) {
        ctx.globalAlpha = params.strokeOpacity;
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;

  // Add ambient crystal sparkles if crystalline mode
  if (crystalline && complexity > 0.3) {
    ctx.save();
    for (let i = 0; i < 15; i++) {
      const sparkleX = (Math.sin(time * 0.8 + i * 2) * 0.4 + 0.5) * width;
      const sparkleY = (Math.cos(time * 0.6 + i * 1.5) * 0.4 + 0.5) * height;
      const sparkleSize = (Math.sin(time * 2 + i) * 0.5 + 1) * 2;
      const alpha = Math.sin(time * 3 + i) * 0.3 + 0.4;
      
      ctx.fillStyle = `rgba(200, 230, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(sparkleX, sparkleY, sparkleSize, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function generatePrism(
    type: string,
    x: number,
    y: number,
    size: number,
    rotation: number,
    depth: number,
    perspective: number,
    facetBrightness: number,
    crystalline: boolean,
    index: number,
    total: number,
    time: number,
    random: () => number
  ) {
    const elements: any[] = [];
    const depthOffset = size * depth * perspective;
    
    switch (type) {
      case 'cube':
        return generateCube(x, y, size, rotation, depthOffset, facetBrightness, index, total, time);
      case 'pyramid':
        return generatePyramid(x, y, size, rotation, depthOffset, facetBrightness, index, total, time);
      case 'hexagonal':
        return generateHexagonalPrism(x, y, size, rotation, depthOffset, facetBrightness, index, total, time);
      case 'crystal':
        return generateCrystal(x, y, size, rotation, depth, perspective, facetBrightness, crystalline, index, total, time, random);
      default:
        return generateCube(x, y, size, rotation, depthOffset, facetBrightness, index, total, time);
    }
  }

  function generateCube(x: number, y: number, size: number, rotation: number, depthOffset: number, facetBrightness: number, index: number, total: number, time: number) {
    const elements: any[] = [];
    
    // Front face
    const frontPoints = [
      { x: x - size/2, y: y - size/2 },
      { x: x + size/2, y: y - size/2 },
      { x: x + size/2, y: y + size/2 },
      { x: x - size/2, y: y + size/2 }
    ];
    
    const hue = (index / total) * 240 + time * 20 + 200;
    const saturation = 70;
    const baseLightness = 50;
    
    elements.push({
      type: 'polygon',
      points: frontPoints,
      fillColor: `hsl(${hue}, ${saturation}%, ${baseLightness * facetBrightness}%)`,
      strokeColor: `hsl(${hue}, ${saturation + 10}%, ${baseLightness + 20}%)`,
      strokeWidth: 2,
      depth: 0
    });
    
    // Right face
    const rightPoints = [
      { x: x + size/2, y: y - size/2 },
      { x: x + size/2 + depthOffset * cos30, y: y - size/2 - depthOffset * sin30 },
      { x: x + size/2 + depthOffset * cos30, y: y + size/2 - depthOffset * sin30 },
      { x: x + size/2, y: y + size/2 }
    ];
    
    elements.push({
      type: 'polygon',
      points: rightPoints,
      fillColor: `hsl(${hue}, ${saturation}%, ${baseLightness * facetBrightness * 0.7}%)`,
      strokeColor: `hsl(${hue}, ${saturation + 10}%, ${baseLightness + 10}%)`,
      strokeWidth: 2,
      depth: -1
    });
    
    // Top face
    const topPoints = [
      { x: x - size/2, y: y - size/2 },
      { x: x - size/2 + depthOffset * cos30, y: y - size/2 - depthOffset * sin30 },
      { x: x + size/2 + depthOffset * cos30, y: y - size/2 - depthOffset * sin30 },
      { x: x + size/2, y: y - size/2 }
    ];
    
    elements.push({
      type: 'polygon',
      points: topPoints,
      fillColor: `hsl(${hue}, ${saturation}%, ${baseLightness * facetBrightness * 0.5}%)`,
      strokeColor: `hsl(${hue}, ${saturation + 10}%, ${baseLightness}%)`,
      strokeWidth: 2,
      depth: -2
    });
    
    return elements;
  }

  function generatePyramid(x: number, y: number, size: number, rotation: number, depthOffset: number, facetBrightness: number, index: number, total: number, time: number) {
    const elements: any[] = [];
    const height = size * 1.2;
    
    // Base square
    const basePoints = [
      { x: x - size/2, y: y + size/2 },
      { x: x + size/2, y: y + size/2 },
      { x: x + size/2 + depthOffset * cos30, y: y + size/2 - depthOffset * sin30 },
      { x: x - size/2 + depthOffset * cos30, y: y + size/2 - depthOffset * sin30 }
    ];
    
    const apex = { x: x + depthOffset * cos30 / 2, y: y - height/2 - depthOffset * sin30 / 2 };
    
    const hue = (index / total) * 240 + time * 20 + 280;
    const saturation = 75;
    const baseLightness = 55;
    
    // Base
    elements.push({
      type: 'polygon',
      points: basePoints,
      fillColor: `hsl(${hue}, ${saturation}%, ${baseLightness * facetBrightness * 0.4}%)`,
      strokeColor: `hsl(${hue}, ${saturation + 10}%, ${baseLightness}%)`,
      strokeWidth: 2,
      depth: 1
    });
    
    // Front face
    elements.push({
      type: 'polygon',
      points: [
        { x: x - size/2, y: y + size/2 },
        { x: x + size/2, y: y + size/2 },
        apex
      ],
      fillColor: `hsl(${hue}, ${saturation}%, ${baseLightness * facetBrightness}%)`,
      strokeColor: `hsl(${hue}, ${saturation + 10}%, ${baseLightness + 20}%)`,
      strokeWidth: 2,
      depth: 0
    });
    
    // Right face
    elements.push({
      type: 'polygon',
      points: [
        { x: x + size/2, y: y + size/2 },
        { x: x + size/2 + depthOffset * cos30, y: y + size/2 - depthOffset * sin30 },
        apex
      ],
      fillColor: `hsl(${hue}, ${saturation}%, ${baseLightness * facetBrightness * 0.7}%)`,
      strokeColor: `hsl(${hue}, ${saturation + 10}%, ${baseLightness + 10}%)`,
      strokeWidth: 2,
      depth: -1
    });
    
    return elements;
  }

  function generateHexagonalPrism(x: number, y: number, size: number, rotation: number, depthOffset: number, facetBrightness: number, index: number, total: number, time: number) {
    const elements: any[] = [];
    const sides = 6;
    const angleStep = (Math.PI * 2) / sides;
    
    const frontPoints: any[] = [];
    const backPoints: any[] = [];
    
    for (let i = 0; i < sides; i++) {
      const angle = i * angleStep + rotation;
      const frontX = x + Math.cos(angle) * size * 0.6;
      const frontY = y + Math.sin(angle) * size * 0.6;
      
      frontPoints.push({ x: frontX, y: frontY });
      backPoints.push({ 
        x: frontX + depthOffset * cos30, 
        y: frontY - depthOffset * sin30 
      });
    }
    
    const hue = (index / total) * 240 + time * 20 + 160;
    const saturation = 80;
    const baseLightness = 45;
    
    // Front hexagon
    elements.push({
      type: 'polygon',
      points: frontPoints,
      fillColor: `hsl(${hue}, ${saturation}%, ${baseLightness * facetBrightness}%)`,
      strokeColor: `hsl(${hue}, ${saturation + 10}%, ${baseLightness + 25}%)`,
      strokeWidth: 2,
      depth: 0
    });
    
    // Back hexagon
    elements.push({
      type: 'polygon',
      points: backPoints,
      fillColor: `hsl(${hue}, ${saturation}%, ${baseLightness * facetBrightness * 0.6}%)`,
      strokeColor: `hsl(${hue}, ${saturation + 10}%, ${baseLightness + 15}%)`,
      strokeWidth: 2,
      depth: -3
    });
    
    // Side faces
    for (let i = 0; i < sides; i++) {
      const nextI = (i + 1) % sides;
      
      const sidePoints = [
        frontPoints[i],
        frontPoints[nextI],
        backPoints[nextI],
        backPoints[i]
      ];
      
      const sideLightness = baseLightness * facetBrightness * (0.7 + 0.2 * Math.sin(i));
      
      elements.push({
        type: 'polygon',
        points: sidePoints,
        fillColor: `hsl(${hue}, ${saturation}%, ${sideLightness}%)`,
        strokeColor: `hsl(${hue}, ${saturation + 10}%, ${baseLightness + 10}%)`,
        strokeWidth: 1,
        depth: -1
      });
    }
    
    return elements;
  }

  function generateCrystal(x: number, y: number, size: number, rotation: number, depth: number, perspective: number, facetBrightness: number, crystalline: boolean, index: number, total: number, time: number, random: () => number) {
    const elements: any[] = [];
    const faces = crystalline ? 8 : 6;
    const height = size * 1.5;
    
    // Generate multiple irregular faces for natural crystal look
    for (let face = 0; face < faces; face++) {
      const faceAngle = (face / faces) * Math.PI * 2 + rotation;
      const faceVariation = 0.7 + 0.6 * random();
      const faceRadius = size * faceVariation * 0.5;
      
      const centerAngle = faceAngle;
      const span = (Math.PI * 2) / faces;
      
      const p1 = {
        x: x + Math.cos(centerAngle - span/2) * faceRadius,
        y: y + Math.sin(centerAngle - span/2) * faceRadius
      };
      
      const p2 = {
        x: x + Math.cos(centerAngle + span/2) * faceRadius,
        y: y + Math.sin(centerAngle + span/2) * faceRadius
      };
      
      const apex = {
        x: x + Math.cos(centerAngle) * faceRadius * 0.3,
        y: y - height * (0.3 + 0.4 * random())
      };
      
      const hue = (index / total) * 240 + time * 30 + face * 15 + 320;
      const saturation = 85 - face * 3;
      const lightness = (45 + face * 8) * facetBrightness;
      
      elements.push({
        type: 'polygon',
        points: [p1, p2, apex],
        fillColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
        strokeColor: `hsl(${hue}, ${saturation + 15}%, ${lightness + 30}%)`,
        strokeWidth: 1,
        depth: -face * 0.1
      });
      
      // Add internal reflections
      if (crystalline && face % 2 === 0) {
        const reflectionCenter = {
          x: (p1.x + p2.x + apex.x) / 3,
          y: (p1.y + p2.y + apex.y) / 3
        };
        
        elements.push({
          type: 'circle',
          center: reflectionCenter,
          radius: size * 0.1 * random(),
          fillColor: `hsla(${hue + 60}, 90%, 80%, 0.6)`,
          strokeColor: `hsla(${hue + 60}, 90%, 90%, 0.8)`,
          strokeWidth: 1,
          depth: -face * 0.1 - 0.5
        });
      }
    }
    
    return elements;
  }
}

const metadata = {
  id: 'crystal-blocks',
  name: "💎 Crystal Blocks",
  description: "Isometric 3D prisms with crystalline facets and geological formations",
  parameters,
  defaultParams: {
    frequency: 1.5,
    amplitude: 60,
    complexity: 0.6,
    chaos: 0.3,
    damping: 0.75,
    layers: 5,
    prismType: 'crystal',
    depth: 0.8,
    perspective: 0.6,
    facetBrightness: 0.85,
    crystalline: true
  }
};

export { parameters, metadata, drawVisualization };