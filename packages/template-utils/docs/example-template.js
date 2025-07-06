/**
 * Example Template: Gradient Waves
 * Shows how the new modular API makes templates more expressive
 */

function draw(ctx, width, height, params, time) {
  const { color, animation, geometry, canvas, random } = utils;
  
  // Create a gradient background with easing
  const bgGradient = color.gradient([
    params.bgColorStart || '#1a1a2e',
    params.bgColorEnd || '#16213e'
  ])
    .curve('ease-out');
  
  canvas.fillGradient(ctx, bgGradient, {
    angle: params.gradientAngle || 45,
    bounds: { x: 0, y: 0, width, height }
  });
  
  // Create color palette based on primary color
  const palette = color.palette({
    base: params.primaryColor || '#e94560',
    scheme: params.colorScheme || 'analogous'
  });
  
  // Generate waves with animation
  const waveCount = params.waveCount || 5;
  const waves = [];
  
  for (let i = 0; i < waveCount; i++) {
    // Each wave has different properties
    const waveProgress = i / waveCount;
    
    // Animated frequency
    const frequency = animation.oscillate(time, {
      from: 1 + i * 0.5,
      to: 2 + i * 0.5,
      duration: 5,
      easing: 'sine'
    });
    
    // Create wave path
    const wave = geometry.path();
    const amplitude = animation.wave(time, {
      frequency: 0.5,
      amplitude: 30 + i * 10,
      phase: i * 0.2
    });
    
    // Build wave path
    wave.moveTo(0, height / 2);
    
    for (let x = 0; x <= width; x += 5) {
      const y = height / 2 + animation.wave(x / width, {
        frequency: frequency,
        amplitude: amplitude,
        phase: time * 0.5 + i * 0.3,
        type: params.waveType || 'sine'
      });
      
      wave.lineTo(x, y);
    }
    
    wave.lineTo(width, height);
    wave.lineTo(0, height);
    wave.close();
    
    waves.push({ path: wave, color: palette[i % palette.length] });
  }
  
  // Draw waves with transparency
  waves.forEach((wave, i) => {
    const opacity = animation.ease('ease-out', 1 - i / waveCount) * 0.8;
    
    canvas.save(ctx)
      .alpha(opacity)
      .fill(wave.path, wave.color);
  });
  
  // Add some random particles
  if (params.particles) {
    const rng = random.create(params.seed || 'particles');
    const particleCount = params.particleCount || 50;
    
    for (let i = 0; i < particleCount; i++) {
      const x = rng.float(0, width);
      const y = rng.float(0, height);
      const size = rng.float(1, 4);
      
      // Particle color based on position
      const particleColor = bgGradient.at(y / height)
        .lighten(0.3)
        .alpha(0.6);
      
      const particle = geometry.circle({
        center: { x, y },
        radius: size
      });
      
      canvas.fill(ctx, particle, particleColor);
    }
  }
  
  // Add text if specified
  if (params.text) {
    const textColor = color.parse(params.textColor || '#ffffff');
    
    // Ensure text is readable
    const bgSample = bgGradient.at(0.5);
    const finalTextColor = textColor.contrast(bgSample) < 4.5
      ? textColor.isLight() ? textColor.darken(0.3) : textColor.lighten(0.3)
      : textColor;
    
    // Animated text
    const letters = typography.splitLetters(params.text);
    const font = typography.fitToBox(params.text, width * 0.8, height * 0.2, {
      family: params.fontFamily || 'Arial',
      weight: params.fontWeight || 'bold'
    });
    
    letters.forEach((letter, i) => {
      const offset = animation.wave(time, {
        frequency: 2,
        amplitude: 10,
        phase: i * 0.1,
        type: 'sine'
      });
      
      canvas.save(ctx)
        .font(font)
        .translate(width / 2, height / 2 + offset)
        .fillText(letter.char, letter.x - width / 2, 0, {
          align: 'center',
          baseline: 'middle',
          color: finalTextColor
        });
    });
  }
}

// Template metadata
const metadata = {
  name: 'Gradient Waves',
  description: 'Animated waves with gradient colors and optional particles',
  parameters: {
    // Colors
    primaryColor: { type: 'color', default: '#e94560' },
    bgColorStart: { type: 'color', default: '#1a1a2e' },
    bgColorEnd: { type: 'color', default: '#16213e' },
    gradientAngle: { type: 'range', min: 0, max: 360, default: 45 },
    
    // Waves
    waveCount: { type: 'range', min: 1, max: 10, default: 5 },
    waveType: { 
      type: 'select', 
      options: ['sine', 'square', 'sawtooth', 'triangle'],
      default: 'sine'
    },
    colorScheme: {
      type: 'select',
      options: ['analogous', 'triadic', 'complementary'],
      default: 'analogous'
    },
    
    // Particles
    particles: { type: 'boolean', default: true },
    particleCount: { type: 'range', min: 0, max: 200, default: 50 },
    seed: { type: 'string', default: 'particles' },
    
    // Text
    text: { type: 'string', default: '' },
    textColor: { type: 'color', default: '#ffffff' },
    fontFamily: { type: 'string', default: 'Arial' },
    fontWeight: { 
      type: 'select',
      options: ['normal', 'bold', '300', '500', '700', '900'],
      default: 'bold'
    }
  }
};

export { draw, metadata };