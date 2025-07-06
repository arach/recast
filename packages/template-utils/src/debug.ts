/**
 * Debug Utilities
 * 
 * Development mode debugging helpers that become no-ops in production
 */

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// Store for performance measurements
const performanceMarks = new Map<string, number>();
const performanceMeasures = new Map<string, number[]>();

/**
 * Log a message with template context (dev mode only)
 */
export function log(message: string, data?: any): void {
  if (!isDevelopment) return;
  
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  const prefix = `[Template ${timestamp}]`;
  
  if (data !== undefined) {
    console.log(`${prefix} ${message}`, data);
  } else {
    console.log(`${prefix} ${message}`);
  }
}

/**
 * Log a warning (dev mode only)
 */
export function warn(message: string, data?: any): void {
  if (!isDevelopment) return;
  
  const prefix = '[Template Warning]';
  if (data !== undefined) {
    console.warn(`${prefix} ${message}`, data);
  } else {
    console.warn(`${prefix} ${message}`);
  }
}

/**
 * Log an error (always, but with more detail in dev mode)
 */
export function error(message: string, error?: any): void {
  const prefix = '[Template Error]';
  
  if (isDevelopment && error) {
    console.error(`${prefix} ${message}`, error);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
  } else {
    console.error(`${prefix} ${message}`);
  }
}

/**
 * Trace execution path (dev mode only)
 */
export function trace(label: string, data?: any): void {
  if (!isDevelopment) return;
  
  const stack = new Error().stack?.split('\\n')[2]?.trim() || 'unknown';
  if (data !== undefined) {
    console.debug(`[Trace] ${label} at ${stack}`, data);
  } else {
    console.debug(`[Trace] ${label} at ${stack}`);
  }
}

/**
 * Start a performance timer (dev mode only)
 */
export function time(label: string): void {
  if (!isDevelopment) return;
  
  performanceMarks.set(label, performance.now());
  log(`Timer started: ${label}`);
}

/**
 * End a performance timer and log the result (dev mode only)
 */
export function timeEnd(label: string): void {
  if (!isDevelopment) return;
  
  const startTime = performanceMarks.get(label);
  if (startTime === undefined) {
    warn(`Timer '${label}' was not started`);
    return;
  }
  
  const duration = performance.now() - startTime;
  performanceMarks.delete(label);
  
  // Store measurement for analysis
  if (!performanceMeasures.has(label)) {
    performanceMeasures.set(label, []);
  }
  performanceMeasures.get(label)!.push(duration);
  
  log(`Timer ended: ${label} - ${duration.toFixed(2)}ms`);
}

/**
 * Mark a performance point (dev mode only)
 */
export function mark(label: string): void {
  if (!isDevelopment) return;
  
  performance.mark(`template-${label}`);
  trace(`Performance mark: ${label}`);
}

/**
 * Measure between two marks (dev mode only)
 */
export function measure(measureName: string, startMark: string, endMark?: string): void {
  if (!isDevelopment) return;
  
  try {
    if (endMark) {
      performance.measure(
        `template-${measureName}`,
        `template-${startMark}`,
        `template-${endMark}`
      );
    } else {
      performance.measure(
        `template-${measureName}`,
        `template-${startMark}`
      );
    }
    
    const entries = performance.getEntriesByName(`template-${measureName}`);
    if (entries.length > 0) {
      const duration = entries[entries.length - 1].duration;
      log(`Measure '${measureName}': ${duration.toFixed(2)}ms`);
    }
  } catch (e) {
    warn(`Failed to measure '${measureName}'`, e);
  }
}

/**
 * Get performance summary (dev mode only)
 */
export function getPerformanceSummary(): Record<string, { count: number; avg: number; min: number; max: number }> | null {
  if (!isDevelopment) return null;
  
  const summary: Record<string, { count: number; avg: number; min: number; max: number }> = {};
  
  performanceMeasures.forEach((measurements, label) => {
    if (measurements.length === 0) return;
    
    const sum = measurements.reduce((a, b) => a + b, 0);
    const avg = sum / measurements.length;
    const min = Math.min(...measurements);
    const max = Math.max(...measurements);
    
    summary[label] = { count: measurements.length, avg, min, max };
  });
  
  return summary;
}

/**
 * Assert a condition (dev mode only)
 */
export function assert(condition: boolean, message: string): void {
  if (!isDevelopment) return;
  
  if (!condition) {
    error(`Assertion failed: ${message}`);
    throw new Error(`Template assertion failed: ${message}`);
  }
}

/**
 * Visualize a value on the canvas (dev mode only)
 */
export function visualize(
  ctx: CanvasRenderingContext2D,
  label: string,
  value: any,
  x: number,
  y: number
): void {
  if (!isDevelopment) return;
  
  ctx.save();
  
  // Background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(x, y - 12, 200, 16);
  
  // Text
  ctx.fillStyle = '#00ff00';
  ctx.font = '10px monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  
  const text = `${label}: ${JSON.stringify(value)}`;
  ctx.fillText(text, x + 2, y - 4);
  
  ctx.restore();
}

/**
 * Draw a debug grid (dev mode only)
 */
export function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  spacing: number = 50
): void {
  if (!isDevelopment) return;
  
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 0, 255, 0.1)';
  ctx.lineWidth = 1;
  
  // Vertical lines
  for (let x = 0; x <= width; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  
  // Horizontal lines
  for (let y = 0; y <= height; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  
  // Center cross
  ctx.strokeStyle = 'rgba(255, 0, 255, 0.3)';
  ctx.beginPath();
  ctx.moveTo(width / 2, 0);
  ctx.lineTo(width / 2, height);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();
  
  ctx.restore();
}

/**
 * Clear all performance data (dev mode only)
 */
export function clearPerformanceData(): void {
  if (!isDevelopment) return;
  
  performanceMarks.clear();
  performanceMeasures.clear();
  log('Performance data cleared');
}