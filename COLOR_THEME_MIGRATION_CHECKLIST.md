# Color Theme Migration Checklist

## Overview
Making all presets "color-theme aware" by implementing universal color parameters:
- `params.fillColor` - Primary/fill color
- `params.strokeColor` - Stroke/outline color  
- `params.backgroundColor` - Background color
- `params.textColor` - Text color (for presets with text)

## Status: 11/33 Complete ✅

### ✅ Already Color-Theme Aware (11)
- [x] simple-prism.ts
- [x] wave-bars.ts (with spectrum/theme/toneShift modes)
- [x] audio-bars.ts (with spectrum/theme/toneShift modes)
- [x] apex-vercel.ts
- [x] prism-google.ts (with theme/duotone/monochrome/layered modes)
- [x] pulse-spotify.ts (with theme/spotify modes)
- [x] golden-circle.ts (with theme/golden/custom modes)
- [x] clean-triangle.ts
- [x] letter-mark.ts (NEW - accessible brand template)
- [x] wordmark.ts (NEW - accessible brand template)
- [x] minimal-shape.ts (NEW - accessible brand template)

### 🔄 Need Updates (22)

#### High Priority - Popular/Core Presets
- [ ] network-constellation.ts

#### Shape-Based Presets
- [ ] dynamic-diamond.ts
- [ ] smart-hexagon.ts
- [ ] spinning-triangles.ts
- [ ] infinity-loops.ts
- [ ] architectural-grid.ts
- [ ] crystal-blocks.ts
- [ ] crystal-lattice.ts

#### Style/Effect Presets
- [ ] liquid-flow.ts
- [ ] neon-glow.ts
- [ ] hand-sketch.ts
- [ ] minimal-line.ts
- [ ] organic-bark.ts
- [ ] border-effects.ts
- [ ] sophisticated-strokes.ts

#### Brand-Specific Presets
- [ ] luxury-brand.ts
- [ ] brand-network.ts
- [ ] nexus-ai-brand.ts
- [ ] terra-eco-brand.ts
- [ ] volt-electric-brand.ts
- [ ] premium-kinetic.ts
- [ ] quantum-field.ts

## Migration Pattern

For each preset, replace hardcoded colors with:

```typescript
// Before:
ctx.fillStyle = '#3b82f6';
ctx.strokeStyle = '#1e40af';

// After:
const fillColor = params.fillColor || '#3b82f6';
const strokeColor = params.strokeColor || '#1e40af';
const backgroundColor = params.backgroundColor || '#ffffff';

ctx.fillStyle = fillColor;
ctx.strokeStyle = strokeColor;
```

Also update:
- Any gradient colors to use theme colors
- Text colors to use `params.textColor`
- Effect colors (glow, particles) to use accent colors or variations
- Background rendering to use `applyUniversalBackground(ctx, width, height, params)`

## Notes
- Keep original colors as fallback defaults
- Test each preset with multiple color themes
- Some presets may need special handling for effects/gradients
- Consider adding opacity/alpha support where appropriate