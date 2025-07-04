# Template Development Guide

Complete guide for creating and editing ReCast templates using the NEW format.

## Quick Start

### Template Structure

Every ReCast template follows this structure:

```typescript
import type { TemplateUtils } from '@/lib/template-utils';

// 1. Parameters definition
const parameters = {
  // Your template-specific parameters
};

// 2. Main drawing function  
function drawVisualization(ctx: CanvasRenderingContext2D, width: number, height: number, params: any, time: number, utils: TemplateUtils) {
  // Your rendering logic
}

// 3. Metadata and exports
const metadata = {
  id: 'your-template-id',
  name: "🎨 Your Template Name", 
  description: "What your template does",
  parameters,
  defaultParams: {
    // Default values for all parameters
  }
};

export { parameters, metadata, drawVisualization };
```

### Minimal Working Example

```typescript
import type { TemplateUtils } from '@/lib/template-utils';

const parameters = {
  radius: {
    default: 100,
    range: [50, 200, 5]
  },
  speed: {
    default: 1,
    range: [0.1, 3, 0.1]
  }
};

function drawVisualization(ctx: CanvasRenderingContext2D, width: number, height: number, params: any, time: number, utils: TemplateUtils) {
  // Apply universal background
  utils.applyUniversalBackground(ctx, width, height, params);
  
  // Get universal colors
  const fillColor = params.fillColor || '#3b82f6';
  const strokeColor = params.strokeColor || '#1e40af';
  
  // Simple animated circle
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = params.radius * (1 + Math.sin(time * params.speed) * 0.1);
  
  if (params.fillOpacity > 0) {
    ctx.save();
    ctx.globalAlpha = params.fillOpacity;
    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  
  if (params.strokeOpacity > 0) {
    ctx.save();
    ctx.globalAlpha = params.strokeOpacity;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = params.strokeWidth || 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

const metadata = {
  id: 'simple-circle',
  name: "⭕ Simple Circle",
  description: "A simple animated circle for demonstration",
  parameters,
  defaultParams: {
    radius: 100,
    speed: 1
  }
};

export { parameters, metadata, drawVisualization };
```

## Parameter Types

### Sliders (Numbers)

```typescript
const parameters = {
  // Basic slider
  frequency: {
    default: 1.0,
    range: [0.1, 5.0, 0.1]  // [min, max, step]
  },
  
  // Integer slider  
  count: {
    default: 10,
    range: [1, 50, 1]
  }
};
```

### Select Options

```typescript
const parameters = {
  // String options
  style: {
    default: 'modern',
    options: ['modern', 'classic', 'organic']
  },
  
  // Number options
  complexity: {
    default: 2,
    options: [1, 2, 3, 4, 5]
  }
};
```

### Boolean Toggles

```typescript
const parameters = {
  showGrid: {
    default: true,
    options: [true, false]
  },
  
  // Alternative syntax
  animated: {
    default: false,
    options: [true, false]
  }
};
```

## Universal Styling System

ReCast automatically provides universal styling controls. **Never** define these parameters yourself:

### Automatic Parameters
- `fillColor` - Fill color picker
- `fillOpacity` - Fill transparency (0-1) 
- `strokeColor` - Stroke color picker
- `strokeOpacity` - Stroke transparency (0-1)
- `strokeWidth` - Stroke thickness
- `strokeType` - Stroke style (solid, dashed, dotted)
- `backgroundColor` - Background color
- `backgroundOpacity` - Background transparency
- `backgroundType` - Background style (solid, gradient, transparent)

### Using Universal Styles

```typescript
function drawVisualization(ctx: CanvasRenderingContext2D, width: number, height: number, params: any, time: number, utils: TemplateUtils) {
  // ALWAYS apply background first
  utils.applyUniversalBackground(ctx, width, height, params);
  
  // Access universal colors with fallbacks
  const fillColor = params.fillColor || '#3b82f6';
  const strokeColor = params.strokeColor || '#1e40af';
  const fillOpacity = params.fillOpacity ?? 1;
  const strokeOpacity = params.strokeOpacity ?? 1;
  
  // Apply fill with opacity
  if (params.fillOpacity > 0) {
    ctx.save();
    ctx.globalAlpha = fillOpacity;
    ctx.fillStyle = fillColor;
    // ... your fill drawing
    ctx.restore();
  }
  
  // Apply stroke with opacity  
  if (params.strokeOpacity > 0) {
    ctx.save();
    ctx.globalAlpha = strokeOpacity;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = params.strokeWidth || 2;
    
    // Handle stroke types
    if (params.strokeType === 'dashed') {
      ctx.setLineDash([5, 5]);
    } else if (params.strokeType === 'dotted') {
      ctx.setLineDash([2, 3]);
    }
    
    // ... your stroke drawing
    ctx.setLineDash([]); // Reset dash
    ctx.restore();
  }
}
```

## Animation & Time

The `time` parameter provides smooth animation:

```typescript
function drawVisualization(ctx: CanvasRenderingContext2D, width: number, height: number, params: any, time: number, utils: TemplateUtils) {
  // Basic pulsing effect
  const pulse = 1 + Math.sin(time * 2) * 0.1;
  
  // Rotation animation
  const rotation = time * 0.5; // radians per second
  
  // Wave effects
  const wave = Math.sin(time * params.frequency) * params.amplitude;
  
  // Smooth oscillation between values
  const oscillate = (Math.sin(time) + 1) / 2; // 0 to 1
  
  // Complex multi-frequency animation
  const complex = Math.sin(time * 2) * 0.5 + Math.cos(time * 3) * 0.3;
}
```

## Common Patterns

### Responsive Scaling

```typescript
// Scale relative to canvas size
const baseScale = Math.min(width, height) / 400;
const scaledSize = params.size * baseScale;

// Maintain aspect ratios
const aspectRatio = width / height;
if (aspectRatio > 1) {
  // Landscape - scale by height
  const scale = height / 600;
} else {
  // Portrait - scale by width  
  const scale = width / 600;
}
```

### Multiple Elements

```typescript
function drawVisualization(ctx: CanvasRenderingContext2D, width: number, height: number, params: any, time: number, utils: TemplateUtils) {
  utils.applyUniversalBackground(ctx, width, height, params);
  
  const count = params.count || 5;
  const centerX = width / 2;
  const centerY = height / 2;
  
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const radius = params.radius || 100;
    const offset = Math.sin(time + i) * 20;
    
    const x = centerX + Math.cos(angle) * (radius + offset);
    const y = centerY + Math.sin(angle) * (radius + offset);
    
    // Draw each element
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle + time);
    
    // ... drawing code for single element
    
    ctx.restore();
  }
}
```

### Complex Shapes

```typescript
function drawComplexShape(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  
  ctx.beginPath();
  ctx.moveTo(-size/2, -size/2);
  ctx.lineTo(size/2, -size/2);
  ctx.lineTo(size/3, size/2);
  ctx.lineTo(-size/3, size/2);
  ctx.closePath();
  
  ctx.restore();
}
```

## Best Practices

### 1. Parameter Naming
- Use descriptive names: `waveAmplitude` not `amp`
- Be consistent: `speed`, `frequency`, `amplitude`
- Group related parameters: `borderWidth`, `borderRadius`, `borderStyle`

### 2. Sensible Defaults
- Choose defaults that create an interesting visual immediately
- Use ranges that make sense for the parameter
- Test edge cases (min/max values)

### 3. Performance
- Use `Math.sin()` and `Math.cos()` for smooth animation
- Cache expensive calculations outside loops
- Consider viewport culling for many elements

### 4. Canvas Best Practices
```typescript
// Always save/restore when changing context
ctx.save();
ctx.globalAlpha = 0.5;
ctx.fillStyle = '#ff0000';
// ... drawing
ctx.restore();

// Use beginPath() for each shape
ctx.beginPath();
ctx.arc(x, y, radius, 0, Math.PI * 2);
ctx.fill();

// Reset line dash after use
ctx.setLineDash([5, 5]);
// ... dashed drawing
ctx.setLineDash([]);
```

### 5. Metadata Guidelines
- **ID**: Use kebab-case, descriptive: `crystal-lattice`, `neon-glow`
- **Name**: Include emoji, descriptive: `"💎 Crystal Lattice"`, `"🌊 Wave Bars"`
- **Description**: Explain what it does and what makes it unique
- **DefaultParams**: Include ALL parameters with their default values

## Template Categories

### Geometric Templates
Focus on mathematical shapes, patterns, and symmetry.
```typescript
// Examples: clean-triangle, golden-circle, smart-hexagon
parameters: {
  sides: { default: 6, range: [3, 12, 1] },
  symmetry: { default: 1, range: [1, 4, 1] },
  precision: { default: 0.95, range: [0.8, 1, 0.01] }
}
```

### Organic Templates  
Natural, flowing, imperfect forms.
```typescript
// Examples: organic-bark, liquid-flow, hand-sketch
parameters: {
  roughness: { default: 0.3, range: [0, 1, 0.05] },
  naturalVariation: { default: 0.4, range: [0, 1, 0.05] },
  flowDirection: { default: 0, range: [0, 360, 15] }
}
```

### Tech/Brand Templates
Modern, clean, corporate aesthetics.
```typescript
// Examples: nexus-ai-brand, apex-vercel, network-constellation
parameters: {
  gridSize: { default: 20, range: [10, 50, 2] },
  connectivity: { default: 0.7, range: [0, 1, 0.05] },
  techStyle: { default: 'modern', options: ['modern', 'futuristic', 'minimal'] }
}
```

### Effect Templates
Focus on visual effects, lighting, atmosphere.
```typescript
// Examples: neon-glow, border-effects, crystal-lattice
parameters: {
  glowIntensity: { default: 0.8, range: [0, 1, 0.05] },
  effectLayers: { default: 3, range: [1, 6, 1] },
  bloomRadius: { default: 15, range: [5, 30, 1] }
}
```

## Testing Your Template

### 1. Parameter Validation
- Test all parameter min/max values
- Verify default values create good visuals
- Check edge cases (count=1, opacity=0, etc.)

### 2. Animation Smoothness
- Ensure smooth transitions with `time` parameter
- Test at different speeds/frequencies
- Verify no jarring jumps or discontinuities

### 3. Responsive Behavior
- Test at different canvas sizes (square, landscape, portrait)
- Verify scaling works properly
- Check text remains readable at small sizes

### 4. Universal Controls
- Test all fill/stroke combinations
- Verify background types work correctly
- Check opacity controls function properly

### 5. Browser Compatibility
- Test in Chrome, Firefox, Safari
- Verify no canvas-specific browser quirks
- Check performance with many animated elements

## Debugging Tips

### Console Logging
```typescript
function drawVisualization(ctx: CanvasRenderingContext2D, width: number, height: number, params: any, time: number, utils: TemplateUtils) {
  // Debug parameter values
  console.log('Template params:', params);
  
  // Debug animation timing
  console.log('Animation time:', time);
  
  // Debug canvas state
  console.log('Canvas size:', width, 'x', height);
}
```

### Visual Debugging
```typescript
// Draw parameter values on canvas
ctx.fillStyle = '#000';
ctx.font = '12px monospace';
ctx.fillText(`time: ${time.toFixed(2)}`, 10, 20);
ctx.fillText(`freq: ${params.frequency}`, 10, 40);

// Draw debug shapes
ctx.strokeStyle = '#ff0000';
ctx.strokeRect(0, 0, width, height); // Canvas bounds
ctx.strokeRect(centerX-50, centerY-50, 100, 100); // Center area
```

## File Organization

```
templates/
├── wave-bars.ts           # Audio/spectrum templates
├── geometric/
│   ├── clean-triangle.ts  # Basic shapes
│   ├── golden-circle.ts
│   └── smart-hexagon.ts
├── organic/
│   ├── liquid-flow.ts     # Natural patterns
│   ├── organic-bark.ts
│   └── hand-sketch.ts
├── effects/
│   ├── neon-glow.ts       # Visual effects
│   ├── crystal-lattice.ts
│   └── border-effects.ts
└── brand/
    ├── nexus-ai-brand.ts  # Brand-specific
    ├── apex-vercel.ts
    └── terra-eco-brand.ts
```

## Getting Help

1. **Look at existing templates** - Find one similar to what you want to create
2. **Check the console** - Look for error messages and warnings  
3. **Test incrementally** - Start simple and add complexity gradually
4. **Use the debugger** - Browser dev tools are your friend
5. **Ask questions** - The team is here to help!

## Template Checklist

Before submitting a new template:

- [ ] Follows NEW format structure
- [ ] Uses `TemplateUtils` for universal styling
- [ ] Has descriptive parameter names and ranges
- [ ] Includes proper metadata with emoji and description
- [ ] Exports `{ parameters, metadata, drawVisualization }`
- [ ] Handles all universal style parameters correctly
- [ ] Animates smoothly with time parameter
- [ ] Scales properly at different canvas sizes
- [ ] Works with different fill/stroke/background combinations
- [ ] Has been tested in multiple browsers
- [ ] Includes sensible default values
- [ ] No console errors or warnings