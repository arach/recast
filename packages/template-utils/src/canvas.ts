/**
 * Canvas Drawing Utilities
 * 
 * Common canvas operations with enhanced functionality
 */

/**
 * Clear the entire canvas
 */
export function clear(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  ctx.clearRect(0, 0, width, height);
}

/**
 * Fill a rectangle with optional rounded corners
 */
export function fillRect(
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  width: number, 
  height: number, 
  radius: number = 0
): void {
  if (radius <= 0) {
    ctx.fillRect(x, y, width, height);
    return;
  }
  
  // Draw rounded rectangle
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

/**
 * Stroke a rectangle with optional rounded corners
 */
export function strokeRect(
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  width: number, 
  height: number, 
  radius: number = 0
): void {
  if (radius <= 0) {
    ctx.strokeRect(x, y, width, height);
    return;
  }
  
  // Draw rounded rectangle
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.stroke();
}

/**
 * Draw a filled circle
 */
export function fillCircle(
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  radius: number
): void {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Draw a stroked circle
 */
export function strokeCircle(
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number, 
  radius: number
): void {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
}

/**
 * Draw a path from an array of points
 */
export function drawPath(
  ctx: CanvasRenderingContext2D,
  points: Array<{x: number, y: number}>,
  closePath: boolean = false
): void {
  if (points.length < 2) return;
  
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  
  if (closePath) {
    ctx.closePath();
  }
}

/**
 * Draw text with better control
 */
export interface TextOptions {
  font?: string;
  align?: CanvasTextAlign;
  baseline?: CanvasTextBaseline;
  maxWidth?: number;
  lineHeight?: number;
}

export function fillText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  options: TextOptions = {}
): void {
  const savedFont = ctx.font;
  const savedAlign = ctx.textAlign;
  const savedBaseline = ctx.textBaseline;
  
  if (options.font) ctx.font = options.font;
  if (options.align) ctx.textAlign = options.align;
  if (options.baseline) ctx.textBaseline = options.baseline;
  
  if (options.maxWidth) {
    ctx.fillText(text, x, y, options.maxWidth);
  } else {
    ctx.fillText(text, x, y);
  }
  
  // Restore original settings
  ctx.font = savedFont;
  ctx.textAlign = savedAlign;
  ctx.textBaseline = savedBaseline;
}

/**
 * Measure text with the current or specified font
 */
export function measureText(
  ctx: CanvasRenderingContext2D,
  text: string,
  font?: string
): TextMetrics {
  const savedFont = ctx.font;
  if (font) ctx.font = font;
  
  const metrics = ctx.measureText(text);
  
  if (font) ctx.font = savedFont;
  return metrics;
}

/**
 * Save canvas state and restore after callback
 */
export function withState(
  ctx: CanvasRenderingContext2D,
  callback: () => void
): void {
  ctx.save();
  try {
    callback();
  } finally {
    ctx.restore();
  }
}

/**
 * Apply a transform and restore after callback
 */
export function withTransform(
  ctx: CanvasRenderingContext2D,
  transform: {
    translate?: { x: number; y: number };
    rotate?: number;
    scale?: { x: number; y: number } | number;
  },
  callback: () => void
): void {
  ctx.save();
  
  if (transform.translate) {
    ctx.translate(transform.translate.x, transform.translate.y);
  }
  
  if (transform.rotate !== undefined) {
    ctx.rotate(transform.rotate);
  }
  
  if (transform.scale !== undefined) {
    if (typeof transform.scale === 'number') {
      ctx.scale(transform.scale, transform.scale);
    } else {
      ctx.scale(transform.scale.x, transform.scale.y);
    }
  }
  
  try {
    callback();
  } finally {
    ctx.restore();
  }
}

/**
 * Draw a rounded polygon
 */
export function drawRoundedPolygon(
  ctx: CanvasRenderingContext2D,
  vertices: Array<{x: number, y: number}>,
  radius: number = 0
): void {
  if (vertices.length < 3) return;
  
  ctx.beginPath();
  
  if (radius <= 0) {
    // No rounding
    vertices.forEach((v, i) => {
      if (i === 0) ctx.moveTo(v.x, v.y);
      else ctx.lineTo(v.x, v.y);
    });
    ctx.closePath();
    return;
  }
  
  // Draw with rounded corners
  const n = vertices.length;
  for (let i = 0; i < n; i++) {
    const curr = vertices[i];
    const next = vertices[(i + 1) % n];
    const prev = vertices[(i - 1 + n) % n];
    
    // Calculate vectors
    const v1x = prev.x - curr.x;
    const v1y = prev.y - curr.y;
    const v2x = next.x - curr.x;
    const v2y = next.y - curr.y;
    
    // Normalize vectors
    const len1 = Math.sqrt(v1x * v1x + v1y * v1y);
    const len2 = Math.sqrt(v2x * v2x + v2y * v2y);
    
    if (len1 > 0 && len2 > 0) {
      const n1x = v1x / len1;
      const n1y = v1y / len1;
      const n2x = v2x / len2;
      const n2y = v2y / len2;
      
      // Calculate angle between vectors
      const angle = Math.acos(Math.max(-1, Math.min(1, n1x * n2x + n1y * n2y)));
      
      // Calculate tangent length
      const tangentLength = radius / Math.tan(angle / 2);
      const maxTangent = Math.min(len1, len2) * 0.5;
      const actualTangent = Math.min(tangentLength, maxTangent);
      
      // Calculate control points
      const p1x = curr.x + n1x * actualTangent;
      const p1y = curr.y + n1y * actualTangent;
      const p2x = curr.x + n2x * actualTangent;
      const p2y = curr.y + n2y * actualTangent;
      
      if (i === 0) {
        ctx.moveTo(p1x, p1y);
      } else {
        ctx.lineTo(p1x, p1y);
      }
      
      ctx.quadraticCurveTo(curr.x, curr.y, p2x, p2y);
    }
  }
  
  ctx.closePath();
}