# ReFlow JS Templates: Refined Architecture

> Branch: `refactor/js-templates`  
> Status: In Development  
> Priority Templates: wave-bars, audio-bars, wordmark, letter-mark, prism

## Core Architecture Decisions

### 1. TypeScript Utils, JavaScript Templates

**Principle**: We own and control the utilities. Templates are external code.

```typescript
// lib/template-utils/index.ts - Strongly typed, we control this
export const utils = {
  canvas: { /* Canvas drawing utilities */ },
  color: { /* Color manipulation */ },
  math: { /* Mathematical helpers */ },
  debug: { /* Dev mode debugging */ }
};
```

Templates consume the transpiled JavaScript:
```javascript
// templates/wave-bars.js - Pure JS, external code mindset
function draw(ctx, width, height, params, time, utils) {
  utils.debug.log('Rendering wave bars', params);
  // Pure drawing logic
}
```

### 2. Developer Experience First

**Development Mode Features**:
- Rich console logging with context
- Performance profiling per template
- Visual debugging overlays
- Parameter change tracking
- Error boundaries with helpful messages

```javascript
// Development mode provides rich debugging
utils.debug.log('Bar height calculation', { i, phase, waveOffset });
utils.debug.time('expensive-operation');
utils.debug.trace('Render path', coordinates);
utils.debug.timeEnd('expensive-operation');
```

### 3. Simple Conditional Parameters

**Convention over Configuration**:
```json
{
  "fillType": {
    "type": "select",
    "options": ["none", "solid", "gradient"],
    "default": "solid"
  },
  "fillColor": {
    "type": "color",
    "default": "#3b82f6",
    "when": { "fillType": ["solid", "gradient"] }
  }
}
```

No complex logic trees, just simple visibility rules.

### 4. Focus on Core Templates

**Priority Templates** (Prove different capabilities):
1. **wave-bars** - Animation, array rendering, time-based
2. **audio-bars** - Variation, different visual style
3. **wordmark** - Text rendering, typography, static
4. **letter-mark** - Single character, geometric transforms
5. **prism** - Complex shapes, gradients, advanced effects

## Implementation Phases

### Phase 1: TypeScript Utils Library ✓
```bash
lib/
├── template-utils/
│   ├── index.ts          # Main utils export
│   ├── canvas.ts         # Canvas utilities
│   ├── color.ts          # Color manipulation
│   ├── math.ts           # Math helpers
│   ├── debug.ts          # Debug utilities
│   └── build.js          # TS → JS transpiler
└── template-utils.js     # Transpiled output
```

### Phase 2: Core Infrastructure
```bash
lib/
├── template-registry.js   # Template loading/caching
├── template-sandbox.js    # Secure execution
├── parameter-schema.json  # Parameter type definitions
└── universal-params.json  # Base parameters all templates get
```

### Phase 3: Template Migration
```bash
templates-js/
├── wave-bars.js          # Pure draw function
├── wave-bars.params.json # Parameter definitions
├── audio-bars.js
├── audio-bars.params.json
└── ... (5 core templates)
```

### Phase 4: Development Tools
```bash
tools/
├── template-debugger.js   # Visual debugging overlay
├── template-profiler.js   # Performance analysis
└── template-tester.js     # Visual regression testing
```

## Key Principles

1. **Separation of Concerns**
   - Utils: TypeScript, controlled, versioned
   - Templates: JavaScript, external code mindset
   - Parameters: JSON data, no logic

2. **Developer Experience**
   - Excellent debugging in development
   - Clear, actionable error messages
   - Visual feedback and profiling

3. **Gradual Migration**
   - Both systems run in parallel
   - No rush to migrate all templates
   - Quality over quantity

## File Naming Convention

All files related to this refactor follow the branch name pattern:
```
docs/refactor/js-templates/
├── refined-architecture.md      # This document
├── utils-api-reference.md       # Utils documentation
├── template-guide.md            # Template author guide
├── migration-checklist.md       # Migration tracking
└── debugging-guide.md           # Dev mode features
```

## Success Metrics

1. **5 Core Templates** fully migrated and polished
2. **Zero TypeScript** in template code
3. **Rich debugging** available in dev mode
4. **Clean separation** between utils and templates
5. **Excellent DX** for template authors

## Next Steps

1. Build TypeScript utils library with transpilation
2. Create parameter schema and validator
3. Migrate wave-bars as proof of concept
4. Add dev mode debugging features
5. Complete remaining 4 priority templates