/**
 * Shape Drawing Utilities
 * 
 * Functions for drawing common shapes and complex geometries
 */

/**
 * Draw a regular polygon
 */
export function polygon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  sides: number,
  rotation: number = 0
): void {
  if (sides < 3) return;
  
  ctx.beginPath();
  
  const angleStep = (Math.PI * 2) / sides;
  
  for (let i = 0; i < sides; i++) {
    const angle = i * angleStep + rotation;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    
    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }
  
  ctx.closePath();
}

/**
 * Draw a star shape
 */
export function star(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  outerRadius: number,
  innerRadius: number,
  points: number,
  rotation: number = 0
): void {
  if (points < 2) return;
  
  ctx.beginPath();
  
  const angleStep = Math.PI / points;
  
  for (let i = 0; i < points * 2; i++) {
    const angle = i * angleStep + rotation;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    
    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }
  
  ctx.closePath();
}

/**
 * Draw a wave shape
 */
export function wave(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  amplitude: number,
  frequency: number,
  phase: number = 0,
  resolution: number = 50
): void {
  ctx.beginPath();
  
  for (let i = 0; i <= resolution; i++) {
    const t = i / resolution;
    const px = x + t * width;
    const py = y + Math.sin((t * frequency * Math.PI * 2) + phase) * amplitude;
    
    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }
}

/**
 * Draw a spiral
 */
export function spiral(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  startRadius: number,
  endRadius: number,
  rotations: number,
  resolution: number = 100
): void {
  ctx.beginPath();
  
  for (let i = 0; i <= resolution; i++) {
    const t = i / resolution;
    const angle = t * rotations * Math.PI * 2;
    const radius = startRadius + (endRadius - startRadius) * t;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    
    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }
}

/**
 * Draw a heart shape
 */
export function heart(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  rotation: number = 0
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.5);
  
  // Left curve
  ctx.bezierCurveTo(
    -size * 0.5, -size * 0.8,
    -size, -size * 0.5,
    -size, -size * 0.1
  );
  ctx.bezierCurveTo(
    -size, size * 0.3,
    -size * 0.5, size * 0.6,
    0, size
  );
  
  // Right curve
  ctx.bezierCurveTo(
    size * 0.5, size * 0.6,
    size, size * 0.3,
    size, -size * 0.1
  );
  ctx.bezierCurveTo(
    size, -size * 0.5,
    size * 0.5, -size * 0.8,
    0, -size * 0.5
  );
  
  ctx.closePath();
  ctx.restore();
}

/**
 * Draw an arrow
 */
export function arrow(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  headSize: number = 10
): void {
  const angle = Math.atan2(toY - fromY, toX - fromX);
  
  // Draw line
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  
  // Draw arrowhead
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - headSize * Math.cos(angle - Math.PI / 6),
    toY - headSize * Math.sin(angle - Math.PI / 6)
  );
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - headSize * Math.cos(angle + Math.PI / 6),
    toY - headSize * Math.sin(angle + Math.PI / 6)
  );
}

/**
 * Draw a rounded rectangle (path only)
 */
export function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number | { tl?: number; tr?: number; br?: number; bl?: number }
): void {
  const r = typeof radius === 'number' 
    ? { tl: radius, tr: radius, br: radius, bl: radius }
    : { tl: radius.tl || 0, tr: radius.tr || 0, br: radius.br || 0, bl: radius.bl || 0 };
  
  ctx.beginPath();
  ctx.moveTo(x + r.tl, y);
  ctx.lineTo(x + width - r.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r.tr);
  ctx.lineTo(x + width, y + height - r.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r.br, y + height);
  ctx.lineTo(x + r.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r.bl);
  ctx.lineTo(x, y + r.tl);
  ctx.quadraticCurveTo(x, y, x + r.tl, y);
  ctx.closePath();
}

/**
 * Draw a gear/cog shape
 */
export function gear(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  outerRadius: number,
  innerRadius: number,
  teeth: number,
  toothDepth: number = 0.3,
  rotation: number = 0
): void {
  ctx.beginPath();
  
  const angleStep = (Math.PI * 2) / (teeth * 2);
  
  for (let i = 0; i < teeth * 2; i++) {
    const angle = i * angleStep + rotation;
    const radius = i % 2 === 0 ? outerRadius : outerRadius * (1 - toothDepth);
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    
    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }
  
  ctx.closePath();
  
  // Inner circle
  ctx.moveTo(x + innerRadius, y);
  ctx.arc(x, y, innerRadius, 0, Math.PI * 2, true);
}

/**
 * Draw a burst/badge shape
 */
export function burst(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  innerRadius: number,
  outerRadius: number,
  points: number,
  rotation: number = 0
): void {
  ctx.beginPath();
  
  const angleStep = Math.PI / points;
  
  for (let i = 0; i < points * 2; i++) {
    const angle = i * angleStep + rotation;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    
    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }
  
  ctx.closePath();
}