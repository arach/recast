# Template Utils API Design

## Design Principles

1. **Modern JavaScript Modules** - First-class modules, not flat functions
2. **Intuitive Naming** - Methods that read like natural language
3. **Chainable APIs** - Where it makes sense
4. **Sensible Defaults** - Common use cases should be simple
5. **Progressive Complexity** - Simple things simple, complex things possible

## Proposed Module Structure

### 🎨 `color` - Color manipulation and generation
```javascript
// Color creation and conversion
color.parse('#ff0000')              // Parse any color format
color.rgb(255, 0, 0)                // Create from RGB
color.hsl(0, 100, 50)               // Create from HSL
color.random()                       // Generate random color
color.random({ hue: 120 })          // Random with constraints

// Color manipulation (chainable)
color.parse('#ff0000')
  .lighten(0.2)                     // Lighten by 20%
  .saturate(0.5)                    // Increase saturation by 50%
  .rotate(180)                      // Rotate hue by 180°
  .alpha(0.8)                       // Set alpha
  .toString()                       // Output as string

// Color schemes
color.palette({
  base: '#ff0000',
  scheme: 'complementary'           // or 'triadic', 'analogous', etc.
})

// Gradients
color.gradient(['#ff0000', '#0000ff'])
  .stops(5)                         // Generate 5 color stops
  .curve('ease-in')                 // Apply easing to gradient
```

### 📐 `geometry` - Shape generation and manipulation
```javascript
// Shape creation
geometry.circle({ radius: 50 })
geometry.polygon({ sides: 6, radius: 50 })
geometry.star({ points: 5, outer: 50, inner: 25 })
geometry.spiral({ turns: 3, spacing: 10 })

// Path building (chainable)
geometry.path()
  .moveTo(0, 0)
  .lineTo(100, 0)
  .arc(100, 50, 50, -90, 90)
  .close()

// Shape operations
geometry.union(shape1, shape2)
geometry.intersect(shape1, shape2)
geometry.subtract(shape1, shape2)

// Transformations
geometry.transform(shape)
  .rotate(45)
  .scale(1.5)
  .translate(10, 20)
```

### 🎭 `animation` - Animation and easing utilities
```javascript
// Easing functions
animation.ease('cubic-in-out', 0.5)   // Get eased value
animation.ease('spring', progress, { tension: 0.5 })

// Animation helpers
animation.loop(time, duration)        // Get loop progress
animation.ping(time, duration)        // Ping-pong animation
animation.sequence(time, durations)   // Sequential animations

// Wave generation
animation.wave(time, {
  frequency: 1,
  amplitude: 50,
  phase: 0,
  type: 'sine'                       // or 'square', 'sawtooth', 'triangle'
})

// Oscillators
animation.oscillate(time, {
  from: 0,
  to: 100,
  duration: 2,
  easing: 'sine'
})
```

### 🔤 `typography` - Text rendering helpers
```javascript
// Text metrics
typography.measure(text, font)       // Get text dimensions
typography.fitToBox(text, width, height, font)  // Calculate font size

// Text effects
typography.path(text, font)          // Convert text to path
typography.outline(text, font, thickness)
typography.letterSpacing(text, spacing)

// Text animation
typography.splitLetters(text)        // Split for individual animation
typography.splitWords(text)
typography.splitLines(text)
```

### 🎲 `random` - Controlled randomness
```javascript
// Seeded random
const rng = random.create('my-seed')
rng.float(0, 1)                      // Random float
rng.int(0, 10)                       // Random integer
rng.boolean(0.7)                     // 70% chance of true
rng.pick(['a', 'b', 'c'])           // Random from array
rng.shuffle([1, 2, 3, 4])           // Shuffle array

// Noise functions
random.perlin(x, y)                  // Perlin noise
random.simplex(x, y, z)             // Simplex noise
random.cellular(x, y)               // Cellular/Voronoi noise

// Distributions
random.gaussian(mean, stdDev)        // Normal distribution
random.exponential(lambda)          // Exponential distribution
```

### 🖼️ `canvas` - Canvas rendering helpers
```javascript
// Context state management
canvas.save(ctx)
  .rotate(45)
  .scale(2)
  .translate(100, 50)
  .run(() => {
    // Draw operations with transformed context
  })

// Common patterns
canvas.grid(ctx, {
  width: 500,
  height: 500,
  cols: 10,
  rows: 10,
  draw: (x, y, index) => {
    // Draw each cell
  }
})

// Effects
canvas.shadow(ctx, {
  color: 'rgba(0,0,0,0.5)',
  blur: 10,
  x: 5,
  y: 5
})

// Clipping
canvas.clip(ctx, shape, () => {
  // Draw clipped content
})
```

### 📊 `layout` - Positioning and distribution
```javascript
// Distribution
layout.distribute(items, {
  bounds: { width: 500, height: 500 },
  method: 'grid'                     // or 'circle', 'spiral', 'random'
})

// Alignment
layout.align(items, {
  horizontal: 'center',              // or 'left', 'right', 'distribute'
  vertical: 'middle'                 // or 'top', 'bottom', 'distribute'
})

// Packing
layout.pack(items, {
  method: 'bin',                     // or 'circle', 'rectangle'
  bounds: { width: 500, height: 500 }
})
```

### 🌊 `pattern` - Pattern generation
```javascript
// Repeating patterns
pattern.dots({
  spacing: 20,
  radius: 3,
  offset: 'stagger'                  // or 'grid', 'random'
})

pattern.stripes({
  width: 10,
  spacing: 5,
  angle: 45
})

pattern.waves({
  frequency: 0.1,
  amplitude: 20,
  layers: 3
})

// Tessellations
pattern.tessellate({
  shape: 'hexagon',
  size: 30
})
```

### 🔧 `utils` - General utilities
```javascript
// Math helpers (for common operations)
utils.map(value, inMin, inMax, outMin, outMax)
utils.clamp(value, min, max)
utils.lerp(a, b, t)
utils.distance(x1, y1, x2, y2)
utils.angle(x1, y1, x2, y2)

// Array utilities
utils.chunk(array, size)
utils.zip(array1, array2)
utils.range(start, end, step)
```

## Usage Examples

### Creating a gradient-filled circle
```javascript
const gradient = color.gradient(['#ff0000', '#0000ff'])
  .stops(10)
  .curve('ease-out')

const circle = geometry.circle({ radius: 100 })

canvas.save(ctx)
  .fillGradient(gradient, circle.bounds)
  .fill(circle)
```

### Animating letters with wave motion
```javascript
const letters = typography.splitLetters('REFLOW')

letters.forEach((letter, i) => {
  const offset = animation.wave(time, {
    frequency: 0.5,
    amplitude: 20,
    phase: i * 0.2
  })
  
  canvas.save(ctx)
    .translate(letter.x, letter.y + offset)
    .fill(letter.path)
})
```

### Creating a color palette
```javascript
const palette = color.palette({
  base: '#3b82f6',
  scheme: 'triadic',
  variations: {
    lightness: [0.3, 0.5, 0.7],
    saturation: [0.8, 1.0]
  }
})
```

## Implementation Notes

1. Each module should be independently importable
2. Methods should return appropriate types for chaining where sensible
3. All functions should have sensible defaults
4. TypeScript types should be comprehensive
5. Performance should be considered for real-time rendering