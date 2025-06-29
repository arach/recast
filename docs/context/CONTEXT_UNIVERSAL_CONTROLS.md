# Universal Controls System Context

## Overview
We implemented a revolutionary universal controls system for ReCast that provides baseline parameters (Background, Fill, Stroke) automatically for ALL templates. This was born from user feedback that templates like Crystal Lattice were too esoteric with parameters like "crystalline order" and "facet precision" - users want familiar controls.

## Key Implementation Details

### 1. Built-in by Default
- Universal controls are automatically injected by the preset converter
- Templates don't need to import or define these controls
- Located in `/lib/preset-converter.ts` with the `getUniversalParameterDefinitions()` function

### 2. Universal Control Categories
- **Background**: Type (transparent/solid/gradient), colors, gradient direction
- **Fill**: Type (none/solid/gradient), colors, opacity, gradient direction  
- **Stroke**: Type (none/solid/dashed/dotted), color, width, opacity

### 3. UI Organization
- Compact professional layout inspired by Figma/Photoshop
- Color-coded sections: Gray (Background), Blue (Fill), Purple (Stroke)
- Smart conditional visibility - only shows relevant controls
- Inline design with real-time feedback (percentages, degrees, pixels)

### 4. Template Integration
- Templates only define their unique parameters
- Universal controls appear first in the UI, then template-specific
- Templates can override defaults but can't remove universal controls
- Example: Simple Prism only defines shape/3D/typography params

## Design Philosophy
"The sophistication is in the engine. The experience should feel like magic."
- Users shouldn't need to understand wave mathematics
- Familiar controls reduce cognitive load
- Professional tools use consistent patterns (Figma, Photoshop)
- Quality of life improvements lead to better finished products

## Technical Architecture
```typescript
// In preset-converter.ts
function getUniversalParameterDefinitions() {
  return {
    backgroundColor: { type: 'color', default: '#ffffff', label: 'Background Color', category: 'Background' },
    backgroundType: { type: 'select', options: [...], default: 'transparent', ... },
    // ... all universal params
  }
}

// Automatically injected into legacy code
const universalControlsCode = getUniversalControlsCode(); // Helper functions
const PARAMETERS = { ...universalParams, ...templateParams };
```

## Future Considerations
- Typography controls could become universal (discussed but not implemented)
- Templates could customize ranges/options for universal controls
- Professional tool groupings could be expanded (Layer panel, Transform panel, etc.)

## Key Files
- `/lib/preset-converter.ts` - Injects universal controls and helper functions
- `/lib/universal-controls.ts` - Helper functions (but not used directly by templates)
- `/components/studio/ControlsPanel.tsx` - Compact UI with smart grouping