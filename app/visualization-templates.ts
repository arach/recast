export const visualizationTemplates = {
  wave: `// Wave Lines Visualization
function drawVisualization(ctx, width, height, params, generator, time) {
  const options = {
    width,
    height,
    resolution: 200,
    time: time,
    seed: params.seed
  };

  const waveLayers = generator.generate(options);

  // Draw each layer
  waveLayers.forEach((layer, layerIndex) => {
    ctx.beginPath();
    ctx.strokeStyle = \`hsla(\${200 + layerIndex * 30}, 70%, 50%, \${0.8 - layerIndex * 0.2})\`;
    ctx.lineWidth = 3 - layerIndex * 0.5;
    
    layer.forEach((point, i) => {
      if (i === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    
    ctx.stroke();
  });
}`,

  bars: `// Audio Bars Visualization
function drawVisualization(ctx, width, height, params, generator, time) {
  const options = {
    width,
    height,
    resolution: params.barCount,
    time: time,
    seed: params.seed
  };

  const waveData = generator.generate(options)[0];
  const barWidth = (width - params.barSpacing * (params.barCount - 1)) / params.barCount;
  const centerY = height / 2;

  waveData.forEach((point, i) => {
    const barHeight = Math.abs(point.y - centerY) * 2;
    const x = i * (barWidth + params.barSpacing);
    
    // Rainbow gradient based on position
    const hue = (i / params.barCount) * 360;
    
    // Create gradient for each bar
    const gradient = ctx.createLinearGradient(x, centerY - barHeight/2, x, centerY + barHeight/2);
    gradient.addColorStop(0, \`hsla(\${hue}, 70%, 60%, 0.9)\`);
    gradient.addColorStop(0.5, \`hsla(\${hue}, 80%, 50%, 1)\`);
    gradient.addColorStop(1, \`hsla(\${hue}, 70%, 60%, 0.9)\`);
    
    ctx.fillStyle = gradient;
    
    // Draw rounded rectangles
    const radius = barWidth / 3;
    ctx.beginPath();
    ctx.roundRect(x, centerY - barHeight/2, barWidth, barHeight, radius);
    ctx.fill();
    
    // Add small dots at the ends
    if (barHeight > 20) {
      ctx.beginPath();
      ctx.arc(x + barWidth/2, centerY - barHeight/2 - 5, barWidth/2.5, 0, Math.PI * 2);
      ctx.arc(x + barWidth/2, centerY + barHeight/2 + 5, barWidth/2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}`,

  wavebars: `// Wave Bars Visualization
function drawVisualization(ctx, width, height, params, generator, time) {
  // Generate the wave center line
  const waveOptions = {
    width,
    height,
    resolution: params.barCount,
    time: time,
    seed: params.seed
  };

  const waveData = generator.generate(waveOptions)[0];

  // Generate bar heights variation
  const barGen = new WaveGenerator({
    ...generator.params,
    amplitude: 40,
    frequency: generator.params.frequency * 3,
    chaos: generator.params.chaos
  }, params.seed + '-bars');
  
  const barHeights = barGen.generate({
    ...waveOptions,
    time: time * 2
  })[0];

  const barWidth = (width - params.barSpacing * (params.barCount - 1)) / params.barCount;

  // Draw each bar
  for (let i = 0; i < params.barCount; i++) {
    const x = i * (barWidth + params.barSpacing);
    const waveCenterY = waveData[i].y;
    const barHeight = Math.abs(barHeights[i].y - height / 2) + 20;
    
    // Rainbow gradient
    const hue = (i / params.barCount) * 360;
    const gradient = ctx.createLinearGradient(x, waveCenterY - barHeight/2, x, waveCenterY + barHeight/2);
    gradient.addColorStop(0, \`hsla(\${hue}, 70%, 60%, 0.9)\`);
    gradient.addColorStop(0.5, \`hsla(\${hue}, 80%, 50%, 1)\`);
    gradient.addColorStop(1, \`hsla(\${hue}, 70%, 60%, 0.9)\`);
    
    ctx.fillStyle = gradient;
    
    // Draw rounded rectangles centered on wave
    const radius = barWidth / 3;
    ctx.beginPath();
    ctx.roundRect(x, waveCenterY - barHeight/2, barWidth, barHeight, radius);
    ctx.fill();
    
    // Add dots
    if (barHeight > 25) {
      ctx.beginPath();
      ctx.arc(x + barWidth/2, waveCenterY - barHeight/2 - 4, barWidth/2.5, 0, Math.PI * 2);
      ctx.arc(x + barWidth/2, waveCenterY + barHeight/2 + 4, barWidth/2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Draw wave guide line
  ctx.beginPath();
  ctx.strokeStyle = 'rgba(100, 100, 100, 0.15)';
  ctx.lineWidth = 1;
  ctx.setLineDash([5, 5]);
  waveData.forEach((point, i) => {
    if (i === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.stroke();
  ctx.setLineDash([]);
}`,

  custom: `// Custom Visualization Template
// You have access to:
// - ctx: Canvas 2D context
// - width, height: Canvas dimensions
// - params: All slider values and settings
// - generator: WaveGenerator instance
// - time: Animation time value

function drawVisualization(ctx, width, height, params, generator, time) {
  // Clear canvas with a gradient background
  const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
  bgGradient.addColorStop(0, '#f0f0f0');
  bgGradient.addColorStop(1, '#ffffff');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  // Generate wave data
  const options = {
    width,
    height,
    resolution: 100,
    time: time,
    seed: params.seed
  };

  const waves = generator.generate(options);
  
  // Example: Draw circles along the wave path
  const wave = waves[0];
  wave.forEach((point, i) => {
    const hue = (i / wave.length) * 360;
    const radius = 5 + Math.sin(time + i * 0.1) * 3;
    
    ctx.beginPath();
    ctx.fillStyle = \`hsla(\${hue}, 70%, 50%, 0.8)\`;
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fill();
  });
  
  // Add your creative code here!
}`,
};