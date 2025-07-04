# Hybrid Canvas Migration Plan

## Overview
This document outlines the step-by-step migration from the current single-canvas architecture to the proven hybrid SVG+Canvas architecture. The new system has been battle-tested with 180+ logos and provides better performance and cleaner separation of concerns.

## Current Architecture Analysis

### Components to Replace
1. **CanvasArea.tsx** - Main canvas container with mixed concerns
2. **CanvasRenderer.tsx** - Monolithic renderer with manual caching
3. **useCanvas hook** - Complex interaction handling mixed with rendering

### Components to Preserve/Adapt
1. **CanvasControls.tsx** - Zoom controls (minimal changes)
2. **CanvasToolbar.tsx** - Tool selection (minimal changes)
3. **LogoActions.tsx** - Logo-specific actions toolbar
4. **canvasStore.ts** - State management (keep most functionality)
5. **CodeEditorPanel.tsx** - Side panel integration

### Key Functionality to Preserve
- Pan/zoom with mouse and keyboard
- Logo selection and dragging
- Grid background with proper scaling
- Code editor panel integration
- Animation support
- Preview mode toggle
- Canvas centering and fit-to-view
- Dark mode support
- Logo position persistence

## Migration Steps

### Phase 1: Preparation (Non-Breaking)
1. **Create backup components**
   - Copy CanvasArea.tsx → CanvasAreaLegacy.tsx
   - Copy CanvasRenderer.tsx → CanvasRendererLegacy.tsx
   - This allows easy rollback if needed

2. **Update HybridCanvas to match current features**
   - Add grid background matching current dot pattern
   - Add dark mode support matching current implementation
   - Add code editor panel space calculation
   - Add preview mode placeholder

3. **Create adapter hooks**
   - Create useHybridCanvas hook that wraps HybridCanvas logic
   - Map existing canvasStore actions to HybridCanvas methods

### Phase 2: Integration Setup

4. **Create new CanvasArea component**
   ```tsx
   // components/studio/CanvasAreaNew.tsx
   export function CanvasAreaNew() {
     // Combines HybridCanvas with existing UI elements
     // Preserves all toolbars, controls, and panels
   }
   ```

5. **Add feature flags**
   ```tsx
   // lib/features.ts
   export const useHybridCanvas = process.env.NEXT_PUBLIC_USE_HYBRID_CANVAS === 'true'
   ```

### Phase 3: Feature Parity Implementation

6. **Grid Background**
   - Current: CSS radial-gradient with dynamic dot sizing
   - Migrate to: SVG pattern with same visual appearance
   - Preserve: Dynamic dot size based on zoom level

7. **Animation System**
   - Current: Uses useCanvasAnimation hook
   - Already implemented in HybridCanvas with currentTime state

8. **Logo Interaction**
   - Current: Complex hit detection in useCanvas
   - Already cleaner in HybridCanvas with SVG event handling

9. **Canvas Controls Integration**
   - Wire up existing CanvasControls component
   - Connect to HybridCanvas zoom/pan methods

### Phase 4: State Management Updates

10. **Update canvasStore subscribers**
    - Ensure all offset/zoom updates work with HybridCanvas
    - Maintain localStorage persistence

11. **Update visualization generation**
    - Current: executeTemplate/executeCustomCode in CanvasRenderer
    - New: generateVisualization in LogoCanvas component
    - Ensure template registry works properly

### Phase 5: Testing & Validation

12. **Create test scenarios**
    - Multi-logo layouts (4+ logos)
    - Pan/zoom with different input methods
    - Logo selection and dragging
    - Animation performance
    - Code editor panel resizing
    - Dark mode switching
    - Browser refresh with persisted state

13. **Performance benchmarks**
    - Compare render times with 10, 50, 100+ logos
    - Measure animation frame rates
    - Check memory usage patterns

### Phase 6: Gradual Rollout

14. **Enable for development first**
    ```bash
    NEXT_PUBLIC_USE_HYBRID_CANVAS=true pnpm dev
    ```

15. **A/B testing approach**
    - Keep both implementations available
    - Use feature flag to switch between them
    - Gather performance metrics

16. **Final cutover**
    - Remove legacy components
    - Remove feature flags
    - Update all imports

## Breaking Changes to Watch For

### 1. Canvas Ref Usage
- **Current**: Direct canvas element manipulation
- **New**: SVG container with embedded canvases
- **Impact**: Any code directly accessing canvasRef needs updating

### 2. Mouse Coordinate Systems
- **Current**: Canvas coordinates with manual transformation
- **New**: SVG coordinates with built-in viewBox transformation
- **Migration**: Update coordinate conversion logic

### 3. Logo Rendering Cache
- **Current**: Manual canvas caching in CanvasRenderer
- **New**: React component memoization in LogoCanvas
- **Benefit**: Simpler, more reliable caching

### 4. Event Handling
- **Current**: Canvas mouse events with hit detection
- **New**: SVG element events with native hit detection
- **Benefit**: More accurate, less code

### 5. Background Rendering
- **Current**: CSS background with calculated position
- **New**: SVG pattern fill
- **Migration**: Ensure visual parity

## Code Mapping Guide

### Canvas Setup
```tsx
// OLD - CanvasArea.tsx
<canvas
  ref={canvasRef}
  className="absolute inset-0 w-full h-full"
  onMouseDown={handleMouseDown}
/>

// NEW - HybridCanvas.tsx
<svg 
  ref={svgRef}
  width="100%" 
  height="100%"
  viewBox={viewBox}
>
```

### Logo Rendering
```tsx
// OLD - CanvasRenderer.tsx
logos.forEach(logo => {
  ctx.save()
  ctx.translate(position.x, position.y)
  // Complex canvas operations
  ctx.restore()
})

// NEW - HybridCanvas.tsx
{logos.map(logo => (
  <g transform={`translate(${logo.position.x}, ${logo.position.y})`}>
    <foreignObject>
      <LogoCanvas {...props} />
    </foreignObject>
  </g>
))}
```

### Interaction Handling
```tsx
// OLD - useCanvas.ts
const isPointInLogo = (x, y, logo) => {
  // Manual bounds checking
}

// NEW - HybridCanvas.tsx
<rect
  onMouseDown={(e) => handleLogoMouseDown(e, logo.id)}
  // Native SVG hit detection
/>
```

## Success Criteria

1. **Feature Parity**
   - All current features work identically
   - No user-visible changes except performance

2. **Performance Improvements**
   - 180+ logos render smoothly
   - Reduced CPU usage during idle
   - Faster interaction response

3. **Code Quality**
   - Clearer separation of concerns
   - Reduced complexity in interaction handling
   - Better testability

4. **Zero Regressions**
   - All existing workflows function
   - No data loss or corruption
   - Smooth upgrade path

## Rollback Plan

If issues arise:
1. Change imports back to legacy components
2. Revert feature flag to false
3. Investigate issues in development
4. Fix and retry migration

## Timeline Estimate

- Phase 1-2: 1 day (preparation and setup)
- Phase 3-4: 2-3 days (feature implementation)
- Phase 5: 1-2 days (testing and validation)
- Phase 6: 1 week (gradual rollout and monitoring)

Total: ~2 weeks for complete migration with safety margins