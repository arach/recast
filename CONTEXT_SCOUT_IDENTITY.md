# Scout Identity Development Context

## Brand Overview
**Scout**: "Voice input with intelligence. Local-first dictation with workflow awareness — speak freely, act instantly."

## Visual Concept Evolution

### Initial Concept
- Started with Crystal Lattice template for prism metaphor
- "One voice becomes many actions" through light refraction
- Issue: Crystal Lattice was too sophisticated and hard to understand

### Solution: Isometric Prism
- Created new "🔮 Isometric Prism" template (formerly Simple Prism)
- Professional 3D isometric projection style
- Clean geometric form representing voice processing
- Internal structure shows "processing happening inside"

## Key Features Implemented

### 1. True 3D Isometric Rendering
- Front face, back face, and side faces with proper depth ordering
- Internal structure lines connecting vertices
- Face shading for realistic 3D appearance
- Configurable depth ratio and perspective angle (default 30°)

### 2. Shape Rotation Control
- Full 360° rotation of entire prism orientation
- 15° increments for precise positioning
- Allows finding perfect brand angle

### 3. Surface Text Projection
- "SCOUT" text projected onto front face like Unity/3D software
- Adjustable projection strength (0-100%)
- Mathematical skew and compression for realistic surface appearance
- Text appears carved/embossed into the surface
- Clipped to prism boundaries

### 4. Typography Controls
- Font size (12-60px)
- Font weight (300-800)
- Text color with high contrast
- Position (center/top/bottom)
- Surface projection amount

## Technical Implementation
```typescript
// Isometric prism generation with rotation
function generateIsometricPrism(..., shapeRotation) {
  const angle = (i / sides) * Math.PI * 2 - Math.PI / 2 + shapeRotation;
  // Generate 3D faces with proper depth
}

// Surface text projection
function renderTextOnSurface(..., projection) {
  const skewX = -0.2 * projection;  // Leftward skew
  const scaleY = 1 - 0.1 * projection;  // Vertical compression
  ctx.transform(1, 0, skewX, scaleY, 0, 0);
  // Render with embossed effects
}
```

## Design Decisions
- Blue color scheme (#3b82f6) represents trust and intelligence
- White text on blue for strong contrast and readability
- Hexagonal prism (6 sides) as default - balanced and tech-forward
- Subtle breathing animation for liveliness
- Light refraction rays represent voice→actions transformation

## Current State
The 🔮 Isometric Prism is now Scout's brand identity template with:
- Professional 3D appearance rivaling Unity-rendered logos
- Intuitive universal controls (no esoteric parameters)
- Perfect metaphor for voice processing technology
- Highly customizable while maintaining brand consistency

## Files
- `/presets/simple-prism.ts` - The isometric prism implementation
- Default parameters optimized for Scout brand
- Categories: Shape, 3D, Typography, Effects