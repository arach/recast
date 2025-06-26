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