/**
 * 🌊 Wave Bars
 * 
 * Audio bars that follow wave patterns with customizable color modes
 */

function draw(ctx, width, height, params, time, utils) {
  // Load and process all parameters - clean and deterministic
  const p = utils.params.load(params, ctx, width, height, time, { parameters });
  
  // Template-specific parameters (defaults come from exported parameters)
  const { barCount, barSpacing, colorMode, barStyle, waveType, showWavePath, pathOpacity } = p;
  
  // Calculate dimensions
  const totalSpacing = barSpacing * (barCount - 1);
  const availableWidth = width - totalSpacing;
  const barWidth = availableWidth / barCount;
  
  // Wave function based on type
  const waveFunction = (t) => {
    const phase = (t * p.frequency * Math.PI * 2) + p.animTime + (p.phaseShift || 0);
    switch (waveType) {
      case 'sine':
        return Math.sin(phase);
      case 'triangle':
        return 2 * Math.abs(2 * ((phase / (Math.PI * 2)) % 1 - 0.5)) - 1;
      case 'square':
        return Math.sin(phase) > 0 ? 1 : -1;
      case 'sawtooth':
        return 2 * ((phase / (Math.PI * 2)) % 1) - 1;
      default:
        return Math.sin(phase);
    }
  };
  
  // Draw wave path if enabled
  if (showWavePath) {
    ctx.save();
    ctx.globalAlpha = pathOpacity;
    ctx.strokeStyle = p.strokeColor;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    ctx.beginPath();
    for (let i = 0; i <= barCount; i++) {
      const t = i / barCount;
      const x = i * (barWidth + barSpacing) + barWidth / 2;
      const y = height / 2 + waveFunction(t) * p.amplitude;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }
  
  // Draw bars
  for (let i = 0; i < barCount; i++) {
    const t = i / barCount;
    const x = i * (barWidth + barSpacing);
    
    // Calculate wave position
    const waveY = height / 2 + waveFunction(t) * p.amplitude;
    
    // Calculate bar height with secondary animation
    const heightPhase = (t * p.frequency * 3 * Math.PI * 2) + p.animTime * 2;
    const barHeight = Math.abs(Math.sin(heightPhase) * 40) + 20;
    
    // Create gradient based on color mode
    const gradient = ctx.createLinearGradient(x, waveY - barHeight/2, x, waveY + barHeight/2);
    
    if (colorMode === 'spectrum') {
      const hue = t * 360;
      gradient.addColorStop(0, `hsla(${hue}, 70%, 60%, 0.9)`);
      gradient.addColorStop(0.5, `hsla(${hue}, 80%, 50%, 1)`);
      gradient.addColorStop(1, `hsla(${hue}, 70%, 60%, 0.9)`);
    } else if (colorMode === 'theme') {
      const phase = t * Math.PI * 2;
      const lightness = 0.3 + Math.sin(phase + p.animTime) * 0.2;
      const adjustedColor = utils.color.adjustBrightness(p.fillColor, lightness);
      gradient.addColorStop(0, adjustedColor);
      gradient.addColorStop(0.5, p.fillColor);
      gradient.addColorStop(1, adjustedColor);
    } else if (colorMode === 'toneShift') {
      const hsl = utils.color.hexToHsl(p.fillColor);
      const hueShift = t * 120 - 60; // Shift ±60 degrees
      const hue = (hsl.h + hueShift + 360) % 360;
      gradient.addColorStop(0, `hsla(${hue}, ${hsl.s}%, ${Math.min(100, hsl.l + 10)}%, 0.9)`);
      gradient.addColorStop(0.5, `hsla(${hue}, ${hsl.s}%, ${hsl.l}%, 1)`);
      gradient.addColorStop(1, `hsla(${hue}, ${hsl.s}%, ${Math.min(100, hsl.l + 10)}%, 0.9)`);
    } else if (colorMode === 'mono') {
      gradient.addColorStop(0, utils.color.withAlpha(p.fillColor, 0.7));
      gradient.addColorStop(0.5, p.fillColor);
      gradient.addColorStop(1, utils.color.withAlpha(p.fillColor, 0.7));
    }
    
    // Draw bar
    ctx.save();
    ctx.globalAlpha = p.theme.fillOpacity;
    ctx.fillStyle = gradient;
    
    if (barStyle === 'rounded') {
      const radius = Math.min(barWidth / 3, 8);
      utils.canvas.fillRect(ctx, x, waveY - barHeight/2, barWidth, barHeight, radius);
    } else if (barStyle === 'sharp') {
      ctx.fillRect(x, waveY - barHeight/2, barWidth, barHeight);
    } else if (barStyle === 'circle') {
      // Bar with circular caps
      const radius = barWidth / 2;
      ctx.beginPath();
      ctx.moveTo(x + radius, waveY - barHeight/2);
      ctx.lineTo(x + radius, waveY + barHeight/2);
      ctx.arc(x + radius, waveY + barHeight/2, radius, 0, Math.PI);
      ctx.lineTo(x + radius, waveY - barHeight/2);
      ctx.arc(x + radius, waveY - barHeight/2, radius, Math.PI, Math.PI * 2);
      ctx.fill();
    }
    
    // Add decorative circles for tall bars
    if (barHeight > 25 && barStyle === 'rounded') {
      const circleRadius = barWidth / 2.5;
      utils.canvas.fillCircle(ctx, x + barWidth/2, waveY - barHeight/2 - 4, circleRadius);
      utils.canvas.fillCircle(ctx, x + barWidth/2, waveY + barHeight/2 + 4, circleRadius);
    }
    
    ctx.restore();
  }
  
  // Debug info in dev mode
  if (utils.debug) {
    utils.debug.log('Wave bars rendered', {
      barCount,
      colorMode,
      waveType,
      time: time.toFixed(2)
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
const toggle = (def, label, opts = {}) => ({ 
  type: "toggle", default: def, label, ...opts 
});

// Parameter definitions - controls and defaults
export const parameters = {
  barCount: slider(40, 20, 100, 5, "Number of Bars"),
  barSpacing: slider(2, 0, 10, 1, "Bar Spacing", "px"),
  frequency: slider(3, 0.1, 20, 0.1, "Wave Frequency"),
  amplitude: slider(50, 0, 100, 1, "Wave Amplitude", "%"),
  animationSpeed: slider(1, 0, 5, 0.1, "Animation Speed", "x"),
  phaseShift: slider(0, 0, 360, 1, "Phase Shift", "°", { when: { waveType: ["sine", "triangle"] } }),
  pathOpacity: slider(0.15, 0, 1, 0.05, "Path Opacity", null, { when: { showWavePath: true } }),
  
  colorMode: select("spectrum", [
    { value: "spectrum", label: "🌈 Rainbow Spectrum" },
    { value: "theme", label: "🎨 Theme Colors" },
    { value: "toneShift", label: "🎭 Tone Shift" },
    { value: "mono", label: "⚫ Monochrome" }
  ], "Color Mode"),
  
  barStyle: select("rounded", [
    { value: "rounded", label: "Rounded" },
    { value: "sharp", label: "Sharp" },
    { value: "circle", label: "Circular Caps" }
  ], "Bar Style"),
  
  waveType: select("sine", ["sine", "triangle", "square", "sawtooth"], "Wave Type"),
  showWavePath: toggle(false, "Show Wave Path"),
};

// Template metadata
export const metadata = {
  name: "🌊 Wave Bars",
  description: "Audio bars that follow wave patterns with customizable color modes",
  category: "animated",
  tags: ["wave", "bars", "audio", "animated", "colorful"],
  author: "ReFlow",
  version: "1.0.0"
};