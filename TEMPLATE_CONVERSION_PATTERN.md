# Template Conversion Pattern

This document outlines the pattern for converting templates from the OLD format to the NEW format for better consistency and maintainability.

## Overview

**Current Status:**
- ✅ **NEW format:** ALL templates converted! (32 templates total)
- ✅ **Conversion COMPLETE** - All templates now use the hybrid canvas/SVG approach

## Format Comparison

### OLD Format Structure

```typescript
import type { ParameterDefinition, PresetMetadata } from './types';

const PARAMETERS = {
  // Universal Background Controls
  backgroundColor: { 
    type: 'color', 
    default: "#f8f5f0", 
    label: 'Background Color', 
    category: 'Background' 
  },
  backgroundType: { 
    type: 'select', 
    options: [
      {"value":"transparent","label":"Transparent"},
      {"value":"solid","label":"Solid Color"},
      {"value":"gradient","label":"Gradient"}
    ], 
    default: "gradient", 
    label: 'Background Type', 
    category: 'Background' 
  },
  frequency: { 
    type: 'slider', 
    min: 0.2, 
    max: 1.5, 
    step: 0.05, 
    default: 0.6, 
    label: 'Growth Rhythm' 
  },
  amplitude: { 
    type: 'slider', 
    min: 80, 
    max: 200, 
    step: 5, 
    default: 140, 
    label: 'Tree Scale' 
  }
};

// Complex export structure
export default {
  parameters: PARAMETERS,
  metadata: {
    id: 'template-name',
    name: 'Display Name',
    // ... other metadata
  },
  // drawVisualization function without utils
  drawVisualization(ctx, width, height, params, time) {
    // Manual background handling
    // Template-specific rendering
  }
};
```

### NEW Format Structure

```typescript
import type { TemplateUtils } from '@/lib/template-utils';

const parameters = {
  frequency: {
    default: 3,
    range: [0.1, 20, 0.1]  // [min, max, step]
  },
  amplitude: {
    default: 50,
    range: [0, 100, 1]
  },
  barCount: {
    default: 40,
    range: [20, 100, 5]
  },
  colorMode: {
    default: 'spectrum',
    options: ['spectrum', 'theme', 'toneShift']
  }
};

const metadata = {
  id: 'template-name',
  name: "🎵 Display Name",
  description: "Clear description of what this template does",
  parameters,
  defaultParams: {
    frequency: 3,
    amplitude: 50,
    barCount: 40,
    colorMode: 'spectrum'
  }
};

function drawVisualization(ctx: CanvasRenderingContext2D, width: number, height: number, params: any, time: number, utils: TemplateUtils) {
  // Universal background handling
  utils.applyUniversalBackground(ctx, width, height, params);
  
  // Access universal properties via utils
  const fillColor = params.fillColor || '#3b82f6';
  const strokeColor = params.strokeColor || '#1e40af';
  const fillOpacity = params.fillOpacity ?? 1;
  const strokeOpacity = params.strokeOpacity ?? 1;
  
  // Template-specific rendering logic
}

// Clean exports
export { parameters, metadata, drawVisualization };
```

## Conversion Steps

### 1. **Update Imports**
```diff
- import type { ParameterDefinition, PresetMetadata } from './types';
+ import type { TemplateUtils } from '@/lib/template-utils';
```

### 2. **Convert Parameter Definitions**

**Sliders:**
```diff
- frequency: { type: 'slider', min: 0.1, max: 20, step: 0.1, default: 3, label: 'Frequency' }
+ frequency: { default: 3, range: [0.1, 20, 0.1] }
```

**Select Options:**
```diff
- colorMode: { type: 'select', options: [...], default: 'spectrum', label: 'Color Mode' }
+ colorMode: { default: 'spectrum', options: ['spectrum', 'theme', 'toneShift'] }
```

**Colors:** (Handled by universal system)
```diff
- fillColor: { type: 'color', default: "#3b82f6", label: 'Fill Color' }
+ // Remove - handled by universal fill controls
```

### 3. **Remove Universal Controls**
Remove these parameters (handled by TemplateUtils):
- `backgroundColor`, `backgroundType`, `backgroundGradient*`
- `fillColor`, `fillType`, `fillGradient*`, `fillOpacity`
- `strokeColor`, `strokeType`, `strokeWidth`, `strokeOpacity`

### 4. **Update Variable Names**
```diff
- const PARAMETERS = {
+ const parameters = {
```

### 5. **Create Metadata Object**
```typescript
const metadata = {
  id: 'template-name',
  name: "🎵 Display Name", // Add emoji
  description: "Clear description",
  parameters,
  defaultParams: {
    // Extract all default values
  }
};
```

### 6. **Update drawVisualization Function**
```diff
- function drawVisualization(ctx, width, height, params, time) {
+ function drawVisualization(ctx: CanvasRenderingContext2D, width: number, height: number, params: any, time: number, utils: TemplateUtils) {
```

Add background handling:
```diff
+ utils.applyUniversalBackground(ctx, width, height, params);
```

Access universal properties:
```typescript
const fillColor = params.fillColor || '#3b82f6';
const strokeColor = params.strokeColor || '#1e40af';
const fillOpacity = params.fillOpacity ?? 1;
const strokeOpacity = params.strokeOpacity ?? 1;
```

### 7. **Update Exports**
```diff
- export default { parameters: PARAMETERS, metadata: {...}, drawVisualization };
+ export { parameters, metadata, drawVisualization };
```

## Benefits of NEW Format

1. **Simplified Parameters**: No more complex type definitions
2. **Universal Styling**: Background, fill, stroke handled automatically
3. **Better TypeScript**: Proper typing with TemplateUtils
4. **Cleaner Code**: Less boilerplate, more focused on unique logic
5. **Consistent API**: All templates follow same pattern
6. **Better DX**: Easier to create and maintain templates

## Converted Templates ✅

**ALL templates have been successfully converted to NEW format:**

**Foundation Templates:**
- ✅ wave-bars.ts
- ✅ audio-bars.ts
- ✅ wordmark.ts
- ✅ wordmark-fixed.ts
- ✅ letter-mark.ts

**Geometric & Shape Templates:**
- ✅ infinity-loops.ts
- ✅ spinning-triangles.ts
- ✅ clean-triangle.ts
- ✅ golden-circle.ts
- ✅ minimal-line.ts
- ✅ minimal-shape.ts
- ✅ simple-prism.ts
- ✅ dynamic-diamond.ts

**Network & Tech Templates:**
- ✅ network-constellation.ts
- ✅ brand-network.ts
- ✅ smart-hexagon.ts
- ✅ nexus-ai-brand.ts

**Brand & Business Templates:**
- ✅ terra-eco-brand.ts
- ✅ volt-electric-brand.ts
- ✅ pulse-spotify.ts
- ✅ apex-vercel.ts
- ✅ prism-google.ts

**Advanced Effect Templates:**
- ✅ sophisticated-strokes.ts
- ✅ border-effects.ts
- ✅ liquid-flow.ts
- ✅ neon-glow.ts
- ✅ architectural-grid.ts

**Crystal & Organic Templates:**
- ✅ organic-bark.ts
- ✅ crystal-blocks.ts
- ✅ crystal-lattice.ts
- ✅ hand-sketch.ts
- ✅ quantum-field.ts

## Validation Checklist

After conversion, verify:
- [ ] Template loads without errors
- [ ] All parameters work in UI
- [ ] Universal backgrounds apply correctly
- [ ] Fill/stroke colors work properly
- [ ] Animation (time parameter) functions
- [ ] Template appears in template selector
- [ ] No console errors in browser

## Example Conversion

See `wave-bars.ts` and `audio-bars.ts` for examples of properly converted templates.