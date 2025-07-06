/**
 * 🎵 Audio Bars
 * 
 * Dynamic audio visualizer bars with customizable color modes
 * Exact conversion from TypeScript original
 */

function draw(ctx, width, height, params, time, utils) {
  // Load and process all parameters - clean and deterministic
  const p = utils.params.load(params, ctx, width, height, time, { parameters });
  
  
  // Calculate dimensions
  const barWidth = (width - p.barSpacing * (p.barCount - 1)) / p.barCount;
  const centerY = height / 2;

  for (let i = 0; i < p.barCount; i++) {
    const x = i * (barWidth + p.barSpacing);
    const t = i / p.barCount;
    
    // Generate wave-based bar heights using the parameters
    const waveY = Math.sin((t * p.frequency * Math.PI * 2) + time) * p.amplitude;
    const harmonics = Math.sin((t * p.frequency * 3 * Math.PI * 2) + time * 2) * p.amplitude * p.complexity;
    const chaosValue = (Math.random() - 0.5) * p.chaos * p.amplitude;
    const dampedValue = waveY + harmonics + chaosValue;
    const barHeight = Math.abs(dampedValue) + 10;
    
    // Create gradient based on color mode - exact match to TypeScript version
    const gradient = ctx.createLinearGradient(x, centerY - barHeight/2, x, centerY + barHeight/2);
    
    if (p.colorMode === 'spectrum') {
      // Original rainbow spectrum
      const hue = (i / p.barCount) * 360;
      gradient.addColorStop(0, `hsla(${hue}, 70%, 60%, 0.9)`);
      gradient.addColorStop(0.5, `hsla(${hue}, 80%, 50%, 1)`);
      gradient.addColorStop(1, `hsla(${hue}, 70%, 60%, 0.9)`);
    } else if (p.colorMode === 'theme') {
      // Use theme colors with intensity variations based on bar height
      const intensity = barHeight / (p.amplitude * 2);
      const lightness = 0.2 + intensity * 0.3;
      gradient.addColorStop(0, utils.adjustColor(p.fillColor, lightness + 0.2));
      gradient.addColorStop(0.5, p.fillColor);
      gradient.addColorStop(1, utils.adjustColor(p.fillColor, lightness + 0.2));
    } else if (p.colorMode === 'toneShift') {
      // Shift hue based on theme color - exact match to TypeScript version  
      const [baseHue, baseSat, baseLum] = utils.hexToHsl(p.fillColor);
      const hueShift = (i / p.barCount) * 180 - 90; // Shift ±90 degrees
      const hue = (baseHue + hueShift + 360) % 360;
      gradient.addColorStop(0, `hsla(${hue}, ${baseSat}%, ${baseLum + 10}%, 0.9)`);
      gradient.addColorStop(0.5, `hsla(${hue}, ${baseSat}%, ${baseLum}%, 1)`);
      gradient.addColorStop(1, `hsla(${hue}, ${baseSat}%, ${baseLum + 10}%, 0.9)`);
    }
    
    // Apply fill opacity if there's a fill
    if (p.fillType !== 'none' && p.fillOpacity < 1) {
      ctx.save();
      ctx.globalAlpha = p.fillOpacity;
    }
    
    ctx.fillStyle = gradient;
    
    // Draw rounded rectangles - exact match to TypeScript version
    const radius = barWidth / 3;
    ctx.beginPath();
    ctx.roundRect(x, centerY - barHeight/2, barWidth, barHeight, radius);
    ctx.fill();
    
    // Add small dots at the ends - exact match to TypeScript version
    if (barHeight > 20) {
      ctx.beginPath();
      ctx.arc(x + barWidth/2, centerY - barHeight/2 - 5, barWidth/2.5, 0, Math.PI * 2);
      ctx.arc(x + barWidth/2, centerY + barHeight/2 + 5, barWidth/2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Restore opacity if it was changed
    if (p.fillType !== 'none' && p.fillOpacity < 1) {
      ctx.restore();
    }
    
    // Apply stroke if enabled
    if (p.strokeType !== 'none') {
      ctx.save();
      ctx.globalAlpha = p.strokeOpacity;
      ctx.strokeStyle = p.strokeColor;
      ctx.lineWidth = p.strokeWidth || 2;
      
      // Set stroke dash pattern
      if (p.strokeType === 'dashed') {
        ctx.setLineDash([5, 5]);
      } else if (p.strokeType === 'dotted') {
        ctx.setLineDash([2, 3]);
      }
      
      // Stroke the rounded rectangle
      ctx.beginPath();
      ctx.roundRect(x, centerY - barHeight/2, barWidth, barHeight, radius);
      ctx.stroke();
      
      // Stroke the dots if present
      if (barHeight > 20) {
        ctx.beginPath();
        ctx.arc(x + barWidth/2, centerY - barHeight/2 - 5, barWidth/2.5, 0, Math.PI * 2);
        ctx.arc(x + barWidth/2, centerY + barHeight/2 + 5, barWidth/2.5, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      ctx.restore();
    }
  }
  
  // Debug info in dev mode
  if (utils.debug) {
    utils.debug.log('Audio bars rendered', {
      barCount: p.barCount,
      colorMode: p.colorMode,
      frequency: p.frequency.toFixed(2),
      amplitude: p.amplitude.toFixed(1)
    });
  }
}

// Helper functions for concise parameter definitions
const slider = (def, min, max, step, label, unit, opts = {}) => ({ 
  type: "slider", default: def, min, max, step, label, unit, ...opts 
});
const select = (def, options, label, opts = {}) => ({ 
  type: "select", default: def, options, label, ...opts 
});

// Parameter definitions - controls and defaults
export const parameters = {
  barCount: slider(30, 10, 80, 5, "Number of Bars"),
  barSpacing: slider(3, 0, 10, 1, "Bar Spacing", "px"),
  frequency: slider(2, 0.1, 10, 0.1, "Wave Frequency"),
  amplitude: slider(40, 10, 100, 5, "Wave Amplitude", "px"),
  complexity: slider(0.3, 0, 1, 0.1, "Harmonics Complexity"),
  chaos: slider(0.1, 0, 0.5, 0.05, "Random Chaos"),
  
  colorMode: select("spectrum", [
    { value: "spectrum", label: "🌈 Rainbow Spectrum" },
    { value: "theme", label: "🎨 Theme Colors" },
    { value: "toneShift", label: "🎭 Tone Shift" }
  ], "Color Mode")
};

// Template metadata
export const metadata = {
  name: "🎵 Audio Bars",
  description: "Dynamic audio visualizer bars with customizable color modes",
  category: "generative",
  tags: ["audio", "bars", "equalizer", "visualizer", "animated"],
  author: "ReFlow",
  version: "1.0.0"
};