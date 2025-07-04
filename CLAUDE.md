# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ReCast is a programmatic identity system that treats brand design as living code. It generates dynamic logos and brand elements using mathematical wave functions, enabling brands to have adaptive identities that respond to different contexts while maintaining consistency.

## Technology Stack

- **Framework**: Next.js 14.2.5 with React 18.3.1
- **Language**: TypeScript with strict mode enabled
- **Styling**: TailwindCSS (configuration pending)
- **State Management**: Zustand 4.5.4
- **Image Processing**: Canvas API (node-canvas), Sharp
- **Animation**: gifencoder for GIF generation
- **Testing**: Vitest
- **Build Tools**: tsup for library builds, Next.js for app builds
- **Package Manager**: pnpm (required)

## Common Commands

```bash
# Development
pnpm dev              # Start Next.js dev server (port 3000)
pnpm dev --port 3001  # Start on custom port

# Building
pnpm build            # Build both library and Next.js app
pnpm build:lib        # Build library only (outputs to dist/)

# Testing
pnpm test             # Run tests in watch mode
pnpm test run         # Run tests once and exit
pnpm test path/to/test.spec.ts  # Run specific test

# Code Quality
pnpm lint             # Run ESLint on .ts and .tsx files

# Production
pnpm start            # Start production server (requires build first)
```

## Architecture

### Core Concepts
1. **Identity as Code**: Brand parameters are defined programmatically, not as static assets
2. **Wave-Based Generation**: All visuals derive from mathematical wave functions
3. **Seeded Randomness**: Reproducible designs using string seeds
4. **Layer Composition**: Complex designs through multiple wave layers

### Project Structure
```
recast/
├── core/              # Mathematical wave generation engine ✓
│   └── wave-generator.ts  # Core WaveGenerator class
├── studio/            # Interactive design interface (planned)
├── presets/           # Built-in style presets (planned)
├── themes/            # Color systems (planned)
├── export/            # File generation utilities (planned)
├── api/               # Programmatic interface (planned)
└── examples/          # Sample implementations (planned)
```

### Library Exports
The project builds as both a Next.js application and a distributable npm package:
- CommonJS: `dist/index.js`
- ES Modules: `dist/index.mjs`
- TypeScript Definitions: `dist/index.d.ts`

## Development Guidelines

### TypeScript Patterns
- Always use strict mode TypeScript
- Define clear interfaces for all major types (e.g., `WaveParameters`, `GenerationOptions`)
- Avoid `any` types - use proper typing throughout
- Use the `@/*` path alias for imports from root

### Core Wave System
The `WaveGenerator` class in `core/wave-generator.ts` provides:
- Multiple wave types (sine, square, sawtooth, triangle, perlin)
- Configurable parameters (frequency, amplitude, phase, offset)
- Layer-based composition with blend modes
- Animation support with frame generation
- Seeded random generation for reproducibility

### State Management
- Use Zustand for UI state management
- Keep generation parameters separate from UI state
- Implement proper TypeScript typing for all stores

### Performance Considerations
- Optimize wave calculations for real-time preview
- Consider Web Workers for heavy computations
- Implement caching for repeated generations
- Use `sharp` for efficient image processing

## Testing Strategy

- Unit tests for mathematical functions using Vitest
- Test wave generation with various parameters
- Verify reproducibility with seed values
- Consider visual regression tests for generated outputs

## Export Formats (Planned)
- SVG for scalable graphics
- PNG for raster images
- GIF for animations
- MP4 for video exports
- JSON for parameter sharing

## Important Notes

1. **Early Development**: This project is in v0.1.0 with core engine implemented but UI and many features pending
2. **Dual Purpose**: Serves as both a web application (design studio) and npm library
3. **Mathematical Focus**: All visual generation is mathematically driven
4. **No Static Assets**: The goal is to eliminate traditional static brand assets

## Debug Toolbar Architecture

ReCast features a comprehensive debug toolbar designed to solve the core challenge of **state fragmentation** in complex React applications. Modern React apps scatter state across multiple systems, and when they get out of sync, debugging becomes a nightmare of console.log statements and page refreshes.

### The Problem: State Fragmentation
ReCast state is distributed across:
- **Component State**: `useState` for local UI state
- **Global Stores**: Zustand for shared application state  
- **Persistence Layers**: localStorage for user preferences and canvas position
- **External Systems**: Canvas coordinates, URL parameters, template loading
- **Derived State**: Computed values and cached calculations

### Debug Toolbar Solution

#### **1. Multi-State Dashboard**
Real-time observatory of all state systems:
```
🎯 Logo State Observer
├─ React State: selectedLogoId="main", logos.length=1
├─ Zustand Store: selectedLogoId="main", logos.length=1  
├─ Canvas State: offset=(362, 35), zoom=1.0
├─ LocalStorage: canvas-offset=(1068, 619) ❌ STALE
└─ Template State: templateId="wave-bars", loaded=true
```

#### **2. Developer Utilities Panel**
Quick actions for common development scenarios:
```
🔧 Quick Actions
├─ Load Test Scenario → "Multi-logo layout"
├─ Reset All State → Clear everything, center canvas
├─ Simulate User Flow → "First-time user experience" 
└─ Force Sync States → Align localStorage with current state
```

#### **3. Performance Insights** 
Development-time performance monitoring:
```
⚡ Metrics
├─ Canvas Render: 16ms (60fps)
├─ Logo Cache: 85% hit rate
└─ State Updates: 12/sec
```

### Key Features
- **Real-time Updates**: Live state inspection, not snapshots
- **localStorage Management**: View, edit, and clear browser storage
- **Canvas Utilities**: Positioning tools and viewport debugging  
- **Development-only**: Zero production impact
- **Keyboard Shortcuts**: `Cmd+Shift+D` to toggle (planned)

### Usage
```typescript
// Enable in development
if (process.env.NODE_ENV === 'development') {
  window.showDebugger()    // Show toolbar
  window.hideDebugger()    // Hide toolbar  
  window.toggleDebugger()  // Toggle visibility
}
```

The debug toolbar accelerates development by providing immediate visibility into state discrepancies and tools to fix them without page refreshes or complex setup scenarios.

## Template Development

ReCast uses a consistent template system for generating dynamic brand identities. All templates follow the NEW format pattern.

### Template Documentation
- **[TEMPLATE_DEVELOPMENT_GUIDE.md](./TEMPLATE_DEVELOPMENT_GUIDE.md)** - Complete guide for creating templates
- **[TEMPLATE_QUICK_REFERENCE.md](./TEMPLATE_QUICK_REFERENCE.md)** - Quick reference and boilerplate
- **[TEMPLATE_CONVERSION_PATTERN.md](./TEMPLATE_CONVERSION_PATTERN.md)** - Migration history (archived)

### Template Structure
```typescript
import type { TemplateUtils } from '@/lib/template-utils';

const parameters = {
  frequency: { default: 1.0, range: [0.1, 5.0, 0.1] }
  // Template-specific parameters only
};

function drawVisualization(ctx: CanvasRenderingContext2D, width: number, height: number, params: any, time: number, utils: TemplateUtils) {
  // Universal background/fill/stroke handled automatically
  utils.applyUniversalBackground(ctx, width, height, params);
  // Your template logic here
}

const metadata = {
  id: 'template-id',
  name: "🎨 Template Name",
  description: "What this template does",
  parameters,
  defaultParams: { frequency: 1.0 }
};

export { parameters, metadata, drawVisualization };
```

### Key Principles
1. **Universal Styling**: Background, fill, stroke handled by TemplateUtils
2. **Simplified Parameters**: No complex type definitions
3. **Animation Support**: Use `time` parameter for smooth animation
4. **Responsive Design**: Scale based on canvas dimensions
5. **TypeScript**: Proper typing throughout

## Development Process

- **Use dev:alt for all interaction with your dev process**