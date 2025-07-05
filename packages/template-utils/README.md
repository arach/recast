# @reflow/template-utils

Utility functions for ReFlow visualization templates.

## Overview

This package provides a comprehensive set of utilities for creating dynamic visual templates in ReFlow. It includes modules for canvas manipulation, color handling, mathematical operations, shape drawing, and more.

## Installation

This is an internal package within the ReFlow monorepo. It's automatically available to templates and the main application.

## Modules

### Canvas
Canvas manipulation utilities including transformations, text rendering, and drawing helpers.

### Color
Color conversion and manipulation utilities supporting hex, RGB, HSL formats.

### Math
Mathematical utilities including interpolation, mapping, easing functions, and wave generation.

### Shape
Shape drawing utilities for common geometric shapes and patterns.

### Background
Background rendering utilities with support for gradients and patterns.

### Debug
Debugging utilities for development and testing.

## Usage

In templates:
```javascript
function drawVisualization(ctx, width, height, params, time, utils) {
  // Use utility functions
  utils.canvas.clear(ctx, width, height);
  utils.color.hexToRgb('#ff0000');
  utils.math.lerp(0, 100, 0.5);
  // etc...
}
```

## Development

```bash
# Build the package
pnpm build

# Watch mode for development
pnpm dev

# Run tests
pnpm test

# Type check
pnpm typecheck
```

## License

MIT