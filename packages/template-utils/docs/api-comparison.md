# API Comparison: Old vs New

## Color Manipulation

### Old API (Current)
```javascript
// Multiple function calls, manual conversion
const hsl = utils.color.hexToHsl('#3b82f6');
const lighter = utils.color.hslToHex(hsl.h, hsl.s, hsl.l + 0.2);
const rgb = utils.color.hexToRgb(lighter);
const final = utils.color.rgbToHex(rgb.r, rgb.g, rgb.b);

// Mixing colors requires manual calculation
const color1 = utils.color.hexToRgb('#ff0000');
const color2 = utils.color.hexToRgb('#0000ff');
const mixed = {
  r: Math.round(color1.r * 0.5 + color2.r * 0.5),
  g: Math.round(color1.g * 0.5 + color2.g * 0.5),
  b: Math.round(color1.b * 0.5 + color2.b * 0.5)
};
const mixedHex = utils.color.rgbToHex(mixed.r, mixed.g, mixed.b);
```

### New API
```javascript
// Chainable, intuitive
const lighter = color.parse('#3b82f6')
  .lighten(0.2)
  .toString();

// Built-in mixing
const mixed = color.parse('#ff0000')
  .mix('#0000ff', 0.5)
  .toString();
```

## Creating Color Schemes

### Old API
```javascript
// Manual calculation for complementary colors
const base = utils.color.hexToHsl('#3b82f6');
const complementaryH = (base.h + 0.5) % 1;
const complementary = utils.color.hslToHex(complementaryH, base.s, base.l);

// No built-in palette generation
```

### New API
```javascript
// Automatic palette generation
const palette = color.palette({
  base: '#3b82f6',
  scheme: 'triadic'
});
// Returns array of Color objects for base + 2 triadic colors
```

## Animation Helpers

### Old API
```javascript
// Manual easing calculation
function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
const progress = easeInOut(time / duration);
const value = startValue + (endValue - startValue) * progress;

// Manual wave calculation
const waveY = Math.sin(time * frequency * Math.PI * 2) * amplitude;
```

### New API
```javascript
// Built-in easing
const value = animation.oscillate(time, {
  from: startValue,
  to: endValue,
  duration: duration,
  easing: 'ease-in-out'
});

// Intuitive wave generation
const waveY = animation.wave(time, {
  frequency: 1,
  amplitude: 50,
  type: 'sine'
});
```

## Shape Generation

### Old API
```javascript
// Manual path building
ctx.beginPath();
ctx.moveTo(centerX + radius, centerY);
for (let i = 1; i <= sides; i++) {
  const angle = (i * 2 * Math.PI) / sides;
  const x = centerX + radius * Math.cos(angle);
  const y = centerY + radius * Math.sin(angle);
  ctx.lineTo(x, y);
}
ctx.closePath();
```

### New API
```javascript
// Declarative shape creation
const hexagon = geometry.polygon({ 
  sides: 6, 
  radius: 50,
  center: { x: centerX, y: centerY }
});

// Use with canvas
canvas.fill(ctx, hexagon);
```

## Text Layout

### Old API
```javascript
// Manual text measurement and splitting
const text = "HELLO WORLD";
const letters = text.split('');
ctx.font = '48px Arial';
let x = 0;
letters.forEach(letter => {
  const metrics = ctx.measureText(letter);
  ctx.fillText(letter, x, y);
  x += metrics.width + letterSpacing;
});
```

### New API
```javascript
// Automatic text handling
const letters = typography.splitLetters('HELLO WORLD');
letters.forEach(letter => {
  canvas.save(ctx)
    .translate(letter.x, letter.y)
    .fill(letter.path);
});
```

## Random with Control

### Old API
```javascript
// Basic random, no seeding
const randomColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;

// Manual distribution
const values = [];
for (let i = 0; i < count; i++) {
  values.push(Math.random() * (max - min) + min);
}
```

### New API
```javascript
// Seeded random for reproducibility
const rng = random.create('my-seed');
const randomColor = color.random({
  hue: [200, 250],  // Blue range
  saturation: [80, 100],
  lightness: [40, 60]
});

// Built-in distributions
const values = rng.gaussian(mean, stdDev)
  .sample(count);
```

## Complex Gradient Creation

### Old API
```javascript
// Manual gradient stops
const gradient = ctx.createLinearGradient(0, 0, width, 0);
const colors = ['#ff0000', '#00ff00', '#0000ff'];
colors.forEach((color, i) => {
  gradient.addColorStop(i / (colors.length - 1), color);
});
```

### New API
```javascript
// Rich gradient API
const gradient = color.gradient(['#ff0000', '#00ff00', '#0000ff'])
  .stops(10)  // Generate 10 smooth stops
  .curve('ease-in-out');  // Apply easing

// Get color at any position
const midColor = gradient.at(0.5);
```

## Benefits of the New API

1. **Intuitive** - Methods read like natural language
2. **Chainable** - Reduce intermediate variables
3. **Type-safe** - Full TypeScript support with proper types
4. **Discoverable** - IDE autocomplete shows available methods
5. **Consistent** - Similar patterns across all modules
6. **Powerful** - Complex operations made simple
7. **Extensible** - Easy to add new functionality

## Migration Strategy

Templates can gradually migrate to the new API while maintaining backward compatibility:

```javascript
// Compatibility layer
const utils = {
  color: {
    // Old methods still available
    hexToRgb: (hex) => color.parse(hex).toRgb(),
    rgbToHex: (r, g, b) => color.rgb(r, g, b).toHex(),
    // ... other legacy methods
  },
  // New modules available directly
  animation,
  geometry,
  typography
};
```