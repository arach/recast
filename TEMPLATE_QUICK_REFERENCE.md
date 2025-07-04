# Template Quick Reference

Quick reference for ReCast template development.

## Template Boilerplate

```typescript
import type { TemplateUtils } from '@/lib/template-utils';

const parameters = {
  // Define your parameters here
  myParam: {
    default: 1.0,
    range: [0.1, 5.0, 0.1]
  }
};

function drawVisualization(ctx: CanvasRenderingContext2D, width: number, height: number, params: any, time: number, utils: TemplateUtils) {
  // 1. Apply background
  utils.applyUniversalBackground(ctx, width, height, params);
  
  // 2. Get universal colors
  const fillColor = params.fillColor || '#3b82f6';
  const strokeColor = params.strokeColor || '#1e40af';
  
  // 3. Your drawing code here
  
  // 4. Apply fill if enabled
  if (params.fillOpacity > 0) {
    ctx.save();
    ctx.globalAlpha = params.fillOpacity;
    ctx.fillStyle = fillColor;
    // ... fill drawing
    ctx.restore();
  }
  
  // 5. Apply stroke if enabled
  if (params.strokeOpacity > 0) {
    ctx.save();
    ctx.globalAlpha = params.strokeOpacity;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = params.strokeWidth || 2;
    // ... stroke drawing
    ctx.restore();
  }
}

const metadata = {
  id: 'my-template',
  name: "🎨 My Template",
  description: "What this template does",
  parameters,
  defaultParams: {
    myParam: 1.0
  }
};

export { parameters, metadata, drawVisualization };
```

## Parameter Types

```typescript
// Slider (number)
frequency: {
  default: 1.0,
  range: [0.1, 5.0, 0.1]  // [min, max, step]
}

// Select (dropdown)
style: {
  default: 'modern',
  options: ['modern', 'classic', 'organic']
}

// Boolean (toggle)
animated: {
  default: true,
  options: [true, false]
}
```

## Universal Parameters (Automatic)

These are provided automatically - **don't define them:**

- `fillColor`, `fillOpacity`
- `strokeColor`, `strokeOpacity`, `strokeWidth`, `strokeType`  
- `backgroundColor`, `backgroundOpacity`, `backgroundType`

## Common Patterns

### Responsive Sizing
```typescript
const baseScale = Math.min(width, height) / 400;
const scaledSize = params.size * baseScale;
```

### Animation
```typescript
const pulse = 1 + Math.sin(time * params.frequency) * 0.1;
const rotation = time * 0.5;
```

### Multiple Elements
```typescript
for (let i = 0; i < params.count; i++) {
  const angle = (i / params.count) * Math.PI * 2;
  const x = centerX + Math.cos(angle) * radius;
  const y = centerY + Math.sin(angle) * radius;
  // ... draw element
}
```

### Canvas State Management
```typescript
ctx.save();
ctx.globalAlpha = 0.5;
ctx.translate(x, y);
ctx.rotate(angle);
// ... drawing
ctx.restore();
```

## Common Math

```typescript
// Convert degrees to radians
const radians = degrees * (Math.PI / 180);

// Oscillate between 0 and 1
const oscillate = (Math.sin(time) + 1) / 2;

// Distance between points
const distance = Math.sqrt((x2-x1)**2 + (y2-y1)**2);

// Angle between points
const angle = Math.atan2(y2-y1, x2-x1);

// Smooth step function
const smoothStep = (t) => t * t * (3 - 2 * t);
```

## Debugging

```typescript
// Log parameter values
console.log('params:', params);

// Draw debug info on canvas
ctx.fillStyle = '#000';
ctx.font = '12px monospace';
ctx.fillText(`time: ${time.toFixed(2)}`, 10, 20);

// Draw bounds
ctx.strokeStyle = '#ff0000';
ctx.strokeRect(0, 0, width, height);
```

## File Naming

- Use kebab-case: `my-awesome-template.ts`
- Be descriptive: `crystal-lattice.ts`, `neon-glow.ts`
- Group by category if many: `geometric/hexagon.ts`

## Metadata Guidelines

```typescript
const metadata = {
  id: 'kebab-case-id',           // Unique, URL-safe
  name: "🎨 Display Name",       // Emoji + title case
  description: "Clear description of what it does and what makes it unique",
  parameters,
  defaultParams: {
    // ALL parameters with defaults
  }
};
```

## Testing Checklist

- [ ] Works at different canvas sizes
- [ ] Animates smoothly
- [ ] All parameters function correctly
- [ ] Fill/stroke/background combinations work
- [ ] No console errors
- [ ] Reasonable performance with animation

## Common Mistakes

❌ **Don't define universal parameters:**
```typescript
// WRONG - these are automatic
fillColor: { default: '#ff0000' }
strokeWidth: { default: 2 }
```

❌ **Don't forget background:**
```typescript
// WRONG - missing background
function drawVisualization(ctx, width, height, params, time, utils) {
  // Missing: utils.applyUniversalBackground(ctx, width, height, params);
}
```

❌ **Don't ignore opacity:**
```typescript
// WRONG - ignoring fill opacity
ctx.fillStyle = fillColor;
ctx.fill();

// RIGHT - respect opacity
if (params.fillOpacity > 0) {
  ctx.save();
  ctx.globalAlpha = params.fillOpacity;
  ctx.fillStyle = fillColor;
  ctx.fill();
  ctx.restore();
}
```

## File Template

Copy this to start a new template:

```typescript
import type { TemplateUtils } from '@/lib/template-utils';

const parameters = {
  // Your parameters here
};

function drawVisualization(ctx: CanvasRenderingContext2D, width: number, height: number, params: any, time: number, utils: TemplateUtils) {
  utils.applyUniversalBackground(ctx, width, height, params);
  
  const fillColor = params.fillColor || '#3b82f6';
  const strokeColor = params.strokeColor || '#1e40af';
  
  // Your drawing code here
}

const metadata = {
  id: 'your-template-id',
  name: "🎨 Your Template Name",
  description: "Description of your template",
  parameters,
  defaultParams: {
    // All parameter defaults
  }
};

export { parameters, metadata, drawVisualization };
```