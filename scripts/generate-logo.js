#!/usr/bin/env node

/**
 * Generate ReFlow logo files from the programmatic definition
 */

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Import the WaveGenerator (we'll need to compile TypeScript first)
const { WaveGenerator } = require('../dist/core/wave-generator');

// ReFlow Logo preset configuration
const logoConfig = {
  mode: 'wavebars',
  params: {
    seed: 'reflow-identity',
    frequency: 5,
    amplitude: 80,
    complexity: 0.6,
    chaos: 0.15,
    damping: 0.85,
    layers: 1,
    barCount: 80,
    barSpacing: 2,
  }
};

// Sizes to generate
const sizes = [
  { size: 1024, name: 'logo-1024.png' },
  { size: 512, name: 'logo-512.png' },
  { size: 256, name: 'logo-256.png' },
  { size: 128, name: 'logo-128.png' },
  { size: 64, name: 'logo-64.png' },
  { size: 32, name: 'favicon-32.png' },
  { size: 16, name: 'favicon-16.png' },
];

function generateWaveBars(ctx, width, height, params) {
  const generator = new WaveGenerator({
    amplitude: params.amplitude,
    frequency: params.frequency,
    phase: 0,
    complexity: params.complexity,
    chaos: params.chaos,
    damping: params.damping,
    layers: params.layers
  }, params.seed);

  // Generate the wave center line
  const waveOptions = {
    width,
    height,
    resolution: params.barCount,
    time: 0,
    seed: params.seed
  };

  const waveData = generator.generate(waveOptions)[0];

  // Generate bar heights variation
  const barGen = new WaveGenerator({
    amplitude: 40,
    frequency: params.frequency * 3,
    phase: 0,
    complexity: params.complexity * 1.5,
    chaos: params.chaos,
    damping: 1,
    layers: 1
  }, params.seed + '-bars');
  
  const barHeights = barGen.generate({
    ...waveOptions,
    time: 0
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
    gradient.addColorStop(0, `hsla(${hue}, 70%, 60%, 0.9)`);
    gradient.addColorStop(0.5, `hsla(${hue}, 80%, 50%, 1)`);
    gradient.addColorStop(1, `hsla(${hue}, 70%, 60%, 0.9)`);
    
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
}

async function generateLogo() {
  console.log('🎨 Generating ReFlow logos...\n');

  for (const { size, name } of sizes) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Clear with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Add subtle gradient background
    const gradient = ctx.createRadialGradient(
      size / 2, size / 2, 0,
      size / 2, size / 2, size / 2
    );
    gradient.addColorStop(0, 'rgba(250, 250, 250, 1)');
    gradient.addColorStop(1, 'rgba(245, 245, 245, 1)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    // Generate the wave bars
    generateWaveBars(ctx, size, size, logoConfig.params);

    // Save the file
    const outputPath = path.join(__dirname, '..', 'public', 'assets', name);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`✓ Generated ${name} (${size}x${size})`);
  }

  console.log('\n✨ All logos generated successfully!');
}

// Check if TypeScript is compiled
if (!fs.existsSync(path.join(__dirname, '..', 'dist'))) {
  console.error('❌ Please run "pnpm build:lib" first to compile TypeScript files');
  process.exit(1);
}

generateLogo().catch(console.error);