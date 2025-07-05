// 🌊 Wave Bars
(function() {
  'use strict';
  
  const metadata = {
    id: 'wave-bars',
    name: "🌊 Wave Bars",
    description: "Audio bars that follow wave patterns with customizable color modes",
    category: 'animated'
  };
  
  const parameters = {
    barCount: {
      default: 40,
      min: 20,
      max: 100,
      step: 5,
      label: 'Number of Bars'
    },
    barSpacing: {
      default: 2,
      min: 0,
      max: 10,
      step: 1,
      label: 'Bar Spacing'
    },
    colorMode: {
      default: 'spectrum',
      options: ['spectrum', 'theme', 'toneShift'],
      label: 'Color Mode'
    },
    frequency: {
      default: 3,
      min: 0.1,
      max: 20,
      step: 0.1,
      label: 'Wave Frequency'
    },
    amplitude: {
      default: 50,
      min: 0,
      max: 100,
      step: 1,
      label: 'Wave Amplitude'
    }
  };
  
  function draw(ctx, width, height, params, time, utils) {
    // Apply background
    utils.applyUniversalBackground(ctx, width, height, params);
    
    // Get theme colors
    const fillColor = params.fillColor || '#3b82f6';
    const strokeColor = params.strokeColor || '#1e40af';
    const colorMode = params.colorMode || 'spectrum';
    const fillOpacity = params.fillOpacity ?? 1;
    const strokeOpacity = params.strokeOpacity ?? 1;
    
    // Calculate bar dimensions
    const barWidth = (width - params.barSpacing * (params.barCount - 1)) / params.barCount;
    const maxBarHeight = height * 0.8;
    
    // Draw bars
    for (let i = 0; i < params.barCount; i++) {
      const phase = (i / params.barCount) * Math.PI * 2;
      const waveOffset = Math.sin(time * params.frequency + phase) * params.amplitude / 100;
      const barHeight = maxBarHeight * (0.5 + waveOffset);
      
      // Set color based on mode
      if (colorMode === 'spectrum') {
        const hue = (i / params.barCount) * 360;
        ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
      } else if (colorMode === 'toneShift') {
        const hsl = utils.hexToHsl(fillColor);
        const hue = (hsl.h + (i / params.barCount) * 60) % 360;
        ctx.fillStyle = `hsl(${hue}, ${hsl.s}%, ${hsl.l}%)`;
      } else {
        ctx.fillStyle = fillColor;
      }
      
      // Apply opacity and draw
      ctx.globalAlpha = fillOpacity;
      const x = i * (barWidth + params.barSpacing);
      const y = height - barHeight;
      
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // Optional stroke
      if (params.strokeWidth && params.strokeWidth > 0) {
        ctx.globalAlpha = strokeOpacity;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = params.strokeWidth;
        ctx.strokeRect(x, y, barWidth, barHeight);
      }
    }
    
    // Reset alpha
    ctx.globalAlpha = 1;
  }
  
  return { metadata, parameters, draw };
})();