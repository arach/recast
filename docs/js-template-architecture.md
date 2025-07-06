# ReFlow Pure JavaScript Template System Architecture

## Executive Summary

This document outlines the architecture for refactoring ReFlow's template system from TypeScript to pure JavaScript. The primary goals are:

1. **Simplicity**: Templates as pure drawing functions with no dependencies
2. **Sandboxability**: Templates can be executed in any sandboxing environment
3. **Data-driven**: Parameters defined separately from logic in JSON/YAML/DSL
4. **Deterministic**: Pure functions with predictable inputs/outputs
5. **Universal Controls**: Consistent base parameters across all templates

## Current System Analysis

### Existing Architecture
- **33 TypeScript templates** with complex type annotations
- **Runtime TypeScript removal** using regex patterns (fragile, error-prone)
- **Mixed concerns**: Parameters and logic intertwined in templates
- **Universal controls** injected via preset converter
- **Function constructor** execution (security concerns)

### Pain Points
1. Complex regex-based TypeScript stripping causing runtime errors
2. Templates contain both logic and parameter definitions
3. Difficult to sandbox due to imports and complex structure
4. No clear separation between data (parameters) and code (drawing)
5. Type information lost during runtime transformation

## Proposed Architecture

### Core Principles

1. **Pure JavaScript Functions**
   ```javascript
   function draw(ctx, width, height, params, time, utils) {
     // Pure drawing logic only
   }
   ```

2. **Separate Parameter Definitions**
   ```json
   {
     "id": "wave-bars",
     "name": "🌊 Wave Bars",
     "parameters": {
       "barCount": {
         "type": "slider",
         "default": 40,
         "min": 20,
         "max": 100,
         "step": 5
       }
     }
   }
   ```

3. **Rich Utility Library**
   - Canvas helpers (shapes, paths, transforms)
   - Color utilities (HSL conversion, interpolation)
   - Math utilities (easing, mapping, noise)
   - Text utilities (measurement, wrapping)

## System Components

### 1. Template Format

```javascript
// templates/wave-bars.js
function draw(ctx, width, height, params, time, utils) {
  // Apply universal background
  utils.background.apply(ctx, width, height, params);
  
  // Template-specific drawing logic
  const barCount = params.barCount;
  const barWidth = width / barCount;
  
  for (let i = 0; i < barCount; i++) {
    const phase = (i / barCount) * Math.PI * 2;
    const y = Math.sin(time + phase) * params.amplitude;
    
    utils.canvas.fillRect(ctx, i * barWidth, height/2 + y, barWidth - 2, 20);
  }
}
```

### 2. Parameter Schema

```yaml
# templates/wave-bars.params.yaml
id: wave-bars
name: "🌊 Wave Bars"
description: "Audio bars following wave patterns"
category: animated

parameters:
  # Template-specific parameters
  barCount:
    type: slider
    default: 40
    min: 20
    max: 100
    step: 5
    label: "Number of Bars"
    
  amplitude:
    type: slider
    default: 50
    min: 0
    max: 100
    unit: "px"
    
  colorMode:
    type: select
    default: spectrum
    options:
      - value: spectrum
        label: "🌈 Rainbow"
      - value: theme
        label: "🎨 Theme Colors"
      - value: mono
        label: "⚫ Monochrome"
```

### 3. Universal Parameters

```javascript
// Automatically included for all templates
const UNIVERSAL_PARAMETERS = {
  // Background
  backgroundType: {
    type: 'select',
    options: ['transparent', 'solid', 'gradient'],
    default: 'transparent'
  },
  backgroundColor: {
    type: 'color',
    default: '#ffffff',
    when: { backgroundType: ['solid', 'gradient'] }
  },
  
  // Fill
  fillType: {
    type: 'select',
    options: ['none', 'solid', 'gradient'],
    default: 'solid'
  },
  fillColor: {
    type: 'color',
    default: '#3b82f6',
    when: { fillType: ['solid', 'gradient'] }
  },
  fillOpacity: {
    type: 'slider',
    min: 0,
    max: 1,
    step: 0.1,
    default: 1
  },
  
  // Stroke
  strokeType: {
    type: 'select',
    options: ['none', 'solid', 'dashed', 'dotted'],
    default: 'none'
  },
  strokeColor: {
    type: 'color',
    default: '#1e40af',
    when: { strokeType: ['solid', 'dashed', 'dotted'] }
  },
  strokeWidth: {
    type: 'slider',
    min: 0,
    max: 20,
    step: 0.5,
    default: 2,
    unit: 'px'
  }
};
```

### 4. Utility Functions API

```javascript
const utils = {
  // Canvas utilities
  canvas: {
    clear: (ctx, width, height) => {},
    fillRect: (ctx, x, y, w, h, radius) => {},
    strokeRect: (ctx, x, y, w, h, radius) => {},
    circle: (ctx, x, y, radius) => {},
    path: (ctx, points) => {},
    text: (ctx, text, x, y, options) => {}
  },
  
  // Background utilities
  background: {
    apply: (ctx, width, height, params) => {},
    gradient: (ctx, width, height, colors, angle) => {}
  },
  
  // Color utilities
  color: {
    hexToHsl: (hex) => {},
    hslToHex: (h, s, l) => {},
    interpolate: (color1, color2, t) => {},
    adjustBrightness: (color, amount) => {},
    spectrum: (t) => {} // Rainbow color from 0-1
  },
  
  // Math utilities
  math: {
    map: (value, inMin, inMax, outMin, outMax) => {},
    clamp: (value, min, max) => {},
    lerp: (a, b, t) => {},
    ease: {
      inOut: (t) => {},
      elastic: (t) => {},
      bounce: (t) => {}
    },
    noise: (x, y, z) => {} // Simplex noise
  },
  
  // Shape utilities
  shape: {
    polygon: (ctx, x, y, radius, sides) => {},
    star: (ctx, x, y, outerRadius, innerRadius, points) => {},
    wave: (ctx, x, y, width, height, frequency, amplitude, phase) => {}
  }
};
```

### 5. Template Registry

```javascript
class TemplateRegistry {
  constructor() {
    this.templates = new Map();
    this.parameters = new Map();
  }
  
  async register(templateId) {
    // Load draw function
    const drawModule = await import(`/templates/${templateId}.js`);
    
    // Load parameters
    const paramsResponse = await fetch(`/templates/${templateId}.params.json`);
    const params = await paramsResponse.json();
    
    // Merge with universal parameters
    const fullParams = {
      ...UNIVERSAL_PARAMETERS,
      ...params.parameters
    };
    
    this.templates.set(templateId, drawModule.default);
    this.parameters.set(templateId, {
      metadata: params,
      parameters: fullParams
    });
  }
  
  execute(templateId, ctx, width, height, params, time) {
    const draw = this.templates.get(templateId);
    if (!draw) throw new Error(`Template ${templateId} not found`);
    
    // Execute in sandboxed environment
    draw(ctx, width, height, params, time, utils);
  }
}
```

## Migration Strategy

### Phase 1: Infrastructure (Week 1)
1. Create parameter schema and JSON format
2. Build utility function library
3. Implement template registry
4. Create sandbox execution environment
5. Build parameter UI generator

### Phase 2: Core Templates (Week 2)
1. Convert 5 simple templates as proof of concept
2. Test sandboxing and performance
3. Refine utility functions based on needs
4. Create migration guide

### Phase 3: Full Migration (Week 3-4)
1. Convert remaining 28 templates
2. Parallel system: both old and new work
3. Migrate UI to use new system
4. Remove TypeScript compilation code

### Phase 4: Enhancement (Week 5)
1. Add template validation
2. Create template playground
3. Build template documentation generator
4. Performance optimization

## Technical Decisions

### Why Pure JavaScript?
1. **No compilation step**: Direct execution
2. **Better sandboxing**: No imports or complex dependencies
3. **Simpler tooling**: Standard JS tools work
4. **Faster iteration**: Edit and see results immediately

### Why Separate Parameters?
1. **Data-driven UI**: Generate controls from schema
2. **Type safety**: Validate at the boundary
3. **Documentation**: Parameters are self-documenting
4. **Extensibility**: Easy to add new parameter types

### Why Rich Utils?
1. **Consistency**: Common operations standardized
2. **Performance**: Optimized implementations
3. **Accessibility**: Lower barrier for template creation
4. **Security**: Controlled API surface

## Security Considerations

1. **Sandbox Execution**
   - Templates run in isolated context
   - No access to globals or imports
   - Limited to canvas and utils API

2. **Parameter Validation**
   - Type checking at runtime
   - Range validation for numeric inputs
   - Sanitization of string inputs

3. **Resource Limits**
   - Maximum execution time
   - Memory usage monitoring
   - Canvas size restrictions

## Performance Optimization

1. **Caching**
   - Compiled draw functions cached
   - Parameter schemas cached
   - Utility functions pre-bound

2. **Lazy Loading**
   - Templates loaded on demand
   - Parameters loaded separately
   - Utils tree-shakeable

3. **Rendering**
   - RequestAnimationFrame for smooth animation
   - Dirty checking for static templates
   - WebGL option for complex visualizations

## Developer Experience

1. **Template Creation**
   ```bash
   # Create new template
   npm run create-template wave-spiral
   
   # Generates:
   # - templates/wave-spiral.js (draw function)
   # - templates/wave-spiral.params.yaml
   # - templates/wave-spiral.test.js
   ```

2. **Testing**
   ```javascript
   // templates/wave-bars.test.js
   import { createTestCanvas } from '@/test-utils';
   import draw from './wave-bars.js';
   
   test('renders bars', () => {
     const { ctx, canvas } = createTestCanvas(400, 300);
     draw(ctx, 400, 300, { barCount: 10 }, 0, utils);
     expect(canvas).toMatchSnapshot();
   });
   ```

3. **Documentation**
   - Auto-generated from parameter schema
   - Visual examples for each template
   - Interactive parameter playground

## Conclusion

This architecture provides:
- ✅ Simple, pure JavaScript templates
- ✅ Complete separation of data and logic
- ✅ Rich utility library for common operations
- ✅ Secure, sandboxable execution
- ✅ Excellent developer experience
- ✅ Smooth migration path

The system maintains ReFlow's core value of "programmatic identity" while dramatically simplifying the template development and execution model.