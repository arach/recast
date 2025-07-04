import type { TemplateUtils } from '@/lib/template-utils';

const parameters = {
  frequency: {
    default: 0.6,
    range: [0.2, 1.5, 0.05]
  },
  amplitude: {
    default: 100,
    range: [60, 180, 5]
  },
  prismSides: {
    default: 6,
    range: [3, 8, 1]
  },
  prismHeight: {
    default: 1,
    range: [0.5, 2, 0.1]
  },
  cornerRadius: {
    default: 4,
    range: [0, 20, 1]
  },
  shapeRotation: {
    default: 0,
    range: [0, 360, 15]
  },
  showInternalStructure: {
    default: true,
    options: [true, false]
  },
  depthRatio: {
    default: 0.6,
    range: [0.2, 1.5, 0.05]
  },
  perspectiveAngle: {
    default: 30,
    range: [15, 45, 5]
  },
  rotationY: {
    default: 0,
    range: [-45, 45, 5]
  },
  rotationX: {
    default: 0,
    range: [-30, 30, 5]
  },
  faceShading: {
    default: 0.15,
    range: [0, 0.4, 0.05]
  }
};

function drawVisualization(ctx: CanvasRenderingContext2D, width: number, height: number, params: any, time: number, utils: TemplateUtils) {
  // Apply universal background
  utils.applyUniversalBackground(ctx, width, height, params);

  // Access universal properties
  const fillColor = params.fillColor || '#3b82f6';
  const strokeColor = params.strokeColor || '#1e40af';
  const fillOpacity = params.fillOpacity ?? 1;
  const strokeOpacity = params.strokeOpacity ?? 1;

  const centerX = width / 2;
  const centerY = height / 2;
  const frequency = params.frequency || 0.6;
  const amplitude = params.amplitude || 100;
  const prismSides = params.prismSides || 6;
  const prismHeight = params.prismHeight || 1;
  const cornerRadius = params.cornerRadius || 4;
  const shapeRotation = (params.shapeRotation || 0) * (Math.PI / 180);
  const showInternalStructure = params.showInternalStructure ?? true;
  const depthRatio = params.depthRatio || 0.6;
  const perspectiveAngle = (params.perspectiveAngle || 30) * (Math.PI / 180);
  const rotationY = (params.rotationY || 0) * (Math.PI / 180);
  const rotationX = (params.rotationX || 0) * (Math.PI / 180);
  const faceShading = params.faceShading || 0.15;

  // Base scale
  const baseScale = Math.min(width, height) / 400;
  const scaledAmplitude = amplitude * baseScale;

  // Animation
  const animationPhase = time * frequency;
  const breathingScale = 1 + Math.sin(animationPhase) * 0.05;

  // Calculate prism geometry
  const radius = scaledAmplitude * breathingScale;
  const depth = radius * depthRatio;

  // Isometric projection helpers
  const cos30 = Math.cos(perspectiveAngle);
  const sin30 = Math.sin(perspectiveAngle);

  // Generate front face vertices
  const frontVertices = [];
  for (let i = 0; i < prismSides; i++) {
    const angle = (i / prismSides) * Math.PI * 2 + shapeRotation;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius * prismHeight;
    frontVertices.push({ x, y });
  }

  // Generate back face vertices (projected)
  const backVertices = frontVertices.map(v => ({
    x: v.x + depth * cos30,
    y: v.y - depth * sin30
  }));

  // Draw faces
  ctx.save();
  ctx.translate(centerX, centerY);

  // Apply 3D rotations
  if (rotationY !== 0 || rotationX !== 0) {
    // Simple rotation approximation
    const cosY = Math.cos(rotationY);
    const sinY = Math.sin(rotationY);
    const cosX = Math.cos(rotationX);
    const sinX = Math.sin(rotationX);
    
    frontVertices.forEach(v => {
      const rotY = v.x * cosY - v.y * sinY;
      const rotX = v.y * cosX;
      v.x = rotY;
      v.y = rotX;
    });
  }

  // Draw back face (if visible)
  if (showInternalStructure) {
    ctx.save();
    ctx.globalAlpha = fillOpacity * 0.6;
    
    // Draw back face
    ctx.beginPath();
    backVertices.forEach((v, i) => {
      if (i === 0) ctx.moveTo(v.x, v.y);
      else ctx.lineTo(v.x, v.y);
    });
    ctx.closePath();
    
    // Darker fill for back face
    ctx.fillStyle = adjustBrightness(fillColor, -faceShading);
    ctx.fill();
    
    ctx.globalAlpha = strokeOpacity * 0.7;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1;
    ctx.stroke();
    
    ctx.restore();
  }

  // Draw connecting edges
  if (showInternalStructure) {
    ctx.save();
    ctx.globalAlpha = strokeOpacity * 0.5;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1;
    
    for (let i = 0; i < prismSides; i++) {
      ctx.beginPath();
      ctx.moveTo(frontVertices[i].x, frontVertices[i].y);
      ctx.lineTo(backVertices[i].x, backVertices[i].y);
      ctx.stroke();
    }
    
    ctx.restore();
  }

  // Draw front face
  ctx.save();
  ctx.globalAlpha = fillOpacity;
  
  ctx.beginPath();
  frontVertices.forEach((v, i) => {
    if (i === 0) ctx.moveTo(v.x, v.y);
    else ctx.lineTo(v.x, v.y);
  });
  ctx.closePath();
  
  // Fill front face
  ctx.fillStyle = fillColor;
  ctx.fill();
  
  // Stroke front face
  ctx.globalAlpha = strokeOpacity;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = params.strokeWidth || 2;
  ctx.stroke();
  
  ctx.restore();

  // Add subtle inner highlight
  ctx.save();
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  frontVertices.forEach((v, i) => {
    const factor = 0.7;
    if (i === 0) ctx.moveTo(v.x * factor, v.y * factor);
    else ctx.lineTo(v.x * factor, v.y * factor);
  });
  ctx.closePath();
  ctx.fillStyle = adjustBrightness(fillColor, 0.2);
  ctx.fill();
  ctx.restore();

  ctx.restore();

  function adjustBrightness(hexColor: string, percent: number): string {
    // Convert hex to RGB
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Adjust brightness
    const newR = Math.max(0, Math.min(255, r + (r * percent)));
    const newG = Math.max(0, Math.min(255, g + (g * percent)));
    const newB = Math.max(0, Math.min(255, b + (b * percent)));
    
    // Convert back to hex
    return `#${Math.round(newR).toString(16).padStart(2, '0')}${Math.round(newG).toString(16).padStart(2, '0')}${Math.round(newB).toString(16).padStart(2, '0')}`;
  }
}

const metadata = {
  id: 'simple-prism',
  name: "🔮 Simple Prism",
  description: "Clean geometric prism with isometric 3D perspective and subtle animation",
  parameters,
  defaultParams: {
    frequency: 0.6,
    amplitude: 100,
    prismSides: 6,
    prismHeight: 1,
    cornerRadius: 4,
    shapeRotation: 0,
    showInternalStructure: true,
    depthRatio: 0.6,
    perspectiveAngle: 30,
    rotationY: 0,
    rotationX: 0,
    faceShading: 0.15
  }
};

export { parameters, metadata, drawVisualization };