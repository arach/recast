import type { ParameterDefinition, PresetMetadata } from './types';
import { 
  UNIVERSAL_PARAMETER_DEFINITIONS,
  applyUniversalBackground,
  applyUniversalFill,
  applyUniversalStroke,
  getBoundsFromPoints,
  type UniversalControls
} from '@/lib/universal-controls';

// Simple Prism - Clean geometric prism perfect for voice/processing apps
export const parameters: Record<string, ParameterDefinition> = {
  // Universal controls are automatically included
  ...UNIVERSAL_PARAMETER_DEFINITIONS,
  
  // Template-specific controls
  frequency: { type: 'slider', min: 0.2, max: 1.5, step: 0.05, default: 0.6, label: 'Animation Speed', category: 'Shape' },
  amplitude: { type: 'slider', min: 60, max: 180, step: 5, default: 100, label: 'Size', category: 'Shape' },
  
  // Prism geometry
  prismSides: { type: 'slider', min: 3, max: 8, step: 1, default: 6, label: 'Prism Sides', category: 'Shape' },
  prismHeight: { type: 'slider', min: 0.5, max: 2, step: 0.1, default: 1, label: 'Height Ratio', category: 'Shape' },
  cornerRadius: { type: 'slider', min: 0, max: 20, step: 1, default: 4, label: 'Corner Rounding', category: 'Shape' },
  
  // Light effects (optional enhancements)
  lightRefraction: { type: 'slider', min: 0, max: 1, step: 0.05, default: 0.3, label: 'Light Refraction', category: 'Effects' },
  refractionCount: { type: 'slider', min: 2, max: 8, step: 1, default: 4, label: 'Refraction Rays', category: 'Effects' },
  refractionColor: { type: 'color', default: '#60a5fa', label: 'Refraction Color', category: 'Effects' }
};

export function draw(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, any>,
  generator: any,
  time: number
) {
  // Apply universal background
  applyUniversalBackground(ctx, width, height, params as UniversalControls);

  // Extract parameters
  const centerX = width / 2;
  const centerY = height / 2;
  const frequency = params.frequency || 0.6;
  const amplitude = params.amplitude || 100;
  const prismSides = Math.round(params.prismSides || 6);
  const prismHeight = params.prismHeight || 1;
  const cornerRadius = params.cornerRadius || 4;
  const lightRefraction = params.lightRefraction || 0.3;
  const refractionCount = Math.round(params.refractionCount || 4);
  const refractionColor = params.refractionColor || '#60a5fa';

  // Scale and animation
  const baseScale = Math.min(width, height) / 300;
  const scaledAmplitude = amplitude * baseScale;
  const animationPhase = time * frequency;
  const breathingPulse = 1 + Math.sin(animationPhase) * 0.05; // Subtle breathing

  // Generate prism shape
  const prismPoints = generatePrismShape(
    centerX, centerY, scaledAmplitude * breathingPulse, 
    prismSides, prismHeight, cornerRadius
  );

  // Render light refraction effects (behind the prism)
  if (lightRefraction > 0.1) {
    renderRefractionRays(ctx, centerX, centerY, scaledAmplitude, refractionCount, refractionColor, lightRefraction, time);
  }

  // Draw the main prism shape
  ctx.save();
  drawPrismPath(ctx, prismPoints, cornerRadius);
  
  // Apply universal fill
  const bounds = getBoundsFromPoints(prismPoints);
  applyUniversalFill(ctx, bounds, params as UniversalControls);
  
  // Apply universal stroke
  applyUniversalStroke(ctx, params as UniversalControls);
  
  ctx.restore();

  function generatePrismShape(centerX: number, centerY: number, radius: number, sides: number, heightRatio: number, cornerRadius: number) {
    const points = [];
    
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * Math.PI * 2 - Math.PI / 2; // Start from top
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius * heightRatio;
      
      points.push({ x, y, angle });
    }
    
    return points;
  }

  function drawPrismPath(ctx: CanvasRenderingContext2D, points: Array<{x: number, y: number}>, cornerRadius: number) {
    if (points.length < 3) return;
    
    ctx.beginPath();
    
    if (cornerRadius <= 0) {
      // Sharp corners
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.closePath();
    } else {
      // Rounded corners
      for (let i = 0; i < points.length; i++) {
        const current = points[i];
        const next = points[(i + 1) % points.length];
        const prev = points[(i - 1 + points.length) % points.length];
        
        // Calculate corner vectors
        const prevVecX = current.x - prev.x;
        const prevVecY = current.y - prev.y;
        const nextVecX = next.x - current.x;
        const nextVecY = next.y - current.y;
        
        // Normalize vectors
        const prevLen = Math.sqrt(prevVecX * prevVecX + prevVecY * prevVecY);
        const nextLen = Math.sqrt(nextVecX * nextVecX + nextVecY * nextVecY);
        
        const prevUnitX = prevVecX / prevLen;
        const prevUnitY = prevVecY / prevLen;
        const nextUnitX = nextVecX / nextLen;
        const nextUnitY = nextVecY / nextLen;
        
        // Calculate control points for rounded corner
        const radius = Math.min(cornerRadius, prevLen / 2, nextLen / 2);
        const cp1x = current.x - prevUnitX * radius;
        const cp1y = current.y - prevUnitY * radius;
        const cp2x = current.x + nextUnitX * radius;
        const cp2y = current.y + nextUnitY * radius;
        
        if (i === 0) {
          ctx.moveTo(cp1x, cp1y);
        } else {
          ctx.lineTo(cp1x, cp1y);
        }
        
        // Draw rounded corner
        ctx.quadraticCurveTo(current.x, current.y, cp2x, cp2y);
      }
      
      ctx.closePath();
    }
  }

  function renderRefractionRays(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, scale: number, rayCount: number, color: string, intensity: number, time: number) {
    ctx.save();
    ctx.globalAlpha = intensity * 0.6;
    
    for (let i = 0; i < rayCount; i++) {
      const rayAngle = (i / rayCount) * Math.PI * 2 + time * 0.2; // Slow rotation
      const rayLength = scale * (1.2 + Math.sin(time * 2 + i) * 0.3);
      
      // Ray gradient
      const gradient = ctx.createLinearGradient(
        centerX, centerY,
        centerX + Math.cos(rayAngle) * rayLength,
        centerY + Math.sin(rayAngle) * rayLength
      );
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.7, color + '80'); // Semi-transparent
      gradient.addColorStop(1, 'transparent');
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + Math.cos(rayAngle) * rayLength,
        centerY + Math.sin(rayAngle) * rayLength
      );
      ctx.stroke();
    }
    
    ctx.restore();
  }
}

export const metadata: PresetMetadata = {
  name: "🔍 Simple Prism",
  description: "Clean geometric prism with universal controls - perfect for voice processing and clear brand identities",
  defaultParams: {
    seed: "simple-prism",
    frequency: 0.6,
    amplitude: 100,
    prismSides: 6,
    prismHeight: 1,
    cornerRadius: 4,
    lightRefraction: 0.3,
    refractionCount: 4,
    refractionColor: '#60a5fa',
    
    // Universal controls defaults
    backgroundColor: '#ffffff',
    backgroundType: 'transparent',
    fillType: 'solid',
    fillColor: '#3b82f6',
    fillOpacity: 0.8,
    strokeType: 'solid',
    strokeColor: '#1e40af',
    strokeWidth: 2,
    strokeOpacity: 1
  }
};