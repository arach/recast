# Phase 1: Migration Checklist - Hybrid Canvas

## Immediate Tasks (Can be done now)

### 1. Create Backup Components ✓
```bash
# Run these commands:
cp components/studio/CanvasArea.tsx components/studio/CanvasAreaLegacy.tsx
cp components/studio/canvas/CanvasRenderer.tsx components/studio/canvas/CanvasRendererLegacy.tsx
cp lib/hooks/useCanvas.ts lib/hooks/useCanvasLegacy.ts
```

### 2. Update HybridCanvas Features

#### Add Grid Pattern with Dot Sizing
```tsx
// In HybridCanvas.tsx, update the grid pattern:
const getDotSize = (zoom: number) => {
  if (zoom < 0.5) return 2.0
  if (zoom < 0.75) return 1.5
  if (zoom < 1.25) return 1.5
  if (zoom < 2) return 1.3
  return 1.2
}

// Update pattern in defs:
<pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
  <circle 
    cx="20" 
    cy="20" 
    r={getDotSize(zoom) * zoom} 
    fill={darkMode ? "#4b5563" : "#64748b"}
  />
</pattern>
```

#### Add Code Editor Space Calculation
```tsx
// Add to HybridCanvas props:
interface HybridCanvasProps {
  animating?: boolean
  codeEditorCollapsed?: boolean
  codeEditorWidth?: number
}

// Calculate effective canvas area:
const effectiveWidth = codeEditorCollapsed 
  ? viewport.width 
  : viewport.width - (codeEditorWidth || 500)
```

#### Add White Background for Logos
```tsx
// In logo rendering, add white background:
<g transform={`translate(${logo.position.x}, ${logo.position.y})`}>
  {/* White background with rounded corners */}
  <rect
    x="-10"
    y="-10"
    width="620"
    height="620"
    rx="12"
    fill="white"
  />
  {/* Border */}
  <rect
    x="-10"
    y="-10"
    width="620"
    height="620"
    rx="12"
    fill="none"
    stroke={selectedLogoId === logo.id ? '#3b82f6' : '#f3f4f6'}
    strokeWidth="1"
  />
  {/* Canvas content */}
  <foreignObject width="600" height="600">
    <LogoCanvas {...props} />
  </foreignObject>
</g>
```

### 3. Create Feature Flag System

```tsx
// lib/features.ts
export const Features = {
  useHybridCanvas: process.env.NEXT_PUBLIC_USE_HYBRID_CANVAS === 'true',
  
  // For runtime switching in development
  toggleHybridCanvas: () => {
    if (typeof window !== 'undefined') {
      const current = localStorage.getItem('useHybridCanvas') === 'true'
      localStorage.setItem('useHybridCanvas', (!current).toString())
      window.location.reload()
    }
  },
  
  isHybridCanvasEnabled: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('useHybridCanvas') === 'true' || 
             process.env.NEXT_PUBLIC_USE_HYBRID_CANVAS === 'true'
    }
    return false
  }
}
```

### 4. Create CanvasAreaNew Component

```tsx
// components/studio/CanvasAreaNew.tsx
'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Play, Pause, Eye, Grid3x3 } from 'lucide-react'
import { HybridCanvas } from './canvas/HybridCanvas'
import { CodeEditorPanel } from './CodeEditorPanel'
import { CanvasControls } from './canvas/CanvasControls'
import { CanvasToolbar } from './canvas/CanvasToolbar'
import { LogoActions } from './canvas/LogoActions'
import { useCanvasStore } from '@/lib/stores/canvasStore'
import { useUIStore } from '@/lib/stores/uiStore'
import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo'

export function CanvasAreaNew() {
  const [animating, setAnimating] = useState(false)
  const { codeEditor } = useCanvasStore()
  const { previewMode, togglePreviewMode, darkMode } = useUIStore()
  const { logo: selectedLogo } = useSelectedLogo()

  return (
    <div className="flex-1 relative overflow-hidden">
      {/* Code Editor Panel */}
      <CodeEditorPanel />
      
      {/* Preview Toggle */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
        <Button
          variant={previewMode ? "default" : "outline"}
          size="sm"
          onClick={togglePreviewMode}
          className={`gap-2 backdrop-blur-sm shadow-lg`}
        >
          {previewMode ? <Grid3x3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {previewMode ? "Back to Canvas" : "Preview Sizes"}
        </Button>
      </div>
      
      {/* Play/Pause Button */}
      {!previewMode && (
        <Button
          onClick={() => setAnimating(!animating)}
          className="absolute top-6 right-6 h-10 w-10 rounded-full shadow-lg z-20"
          size="sm"
          variant="outline"
        >
          {animating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
      )}
      
      {/* Canvas Toolbar */}
      {!previewMode && <CanvasToolbar />}
      
      {/* Logo Actions */}
      {!previewMode && selectedLogo && (
        <LogoActions className="absolute top-6 right-20 z-20" />
      )}
      
      {/* Main Canvas */}
      {!previewMode ? (
        <>
          <HybridCanvas 
            animating={animating}
            codeEditorCollapsed={codeEditor.collapsed}
            codeEditorWidth={codeEditor.width}
          />
          <CanvasControls className="absolute bottom-6 right-6 z-20" />
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-lg">Preview mode temporarily disabled</p>
        </div>
      )}
    </div>
  )
}
```

### 5. Add Debug Commands

```tsx
// In DebugOverlay or dev tools:
{
  id: 'toggle-hybrid-canvas',
  label: 'Toggle Hybrid Canvas',
  description: 'Switch between old and new canvas',
  handler: () => {
    Features.toggleHybridCanvas()
  }
}
```

## Testing Checklist

### Basic Functionality
- [ ] Canvas renders with correct background
- [ ] Grid dots appear at correct size/spacing
- [ ] Single logo renders correctly
- [ ] Logo has white background with rounded corners
- [ ] Selection border appears on click
- [ ] Dark mode switches properly

### Interactions
- [ ] Pan canvas with mouse drag
- [ ] Zoom with mouse wheel
- [ ] Select logo by clicking
- [ ] Drag logo to new position
- [ ] Canvas controls (zoom in/out, center, fit) work

### UI Integration
- [ ] Code editor panel affects canvas layout
- [ ] Toolbars appear in correct positions
- [ ] Animation play/pause works
- [ ] No visual differences from old system

### State Management
- [ ] Canvas position persists on refresh
- [ ] Zoom level persists
- [ ] Logo positions save correctly
- [ ] Store updates trigger re-renders

## Known Issues to Address

1. **Template Loading**: The `generateVisualization` function differs from `executeTemplate`
   - Need to ensure template registry integration works

2. **Error Handling**: Current system shows inline error messages
   - Need to port error display to HybridCanvas

3. **Performance**: With 180+ logos, watch for:
   - Initial render time
   - Animation smoothness
   - Memory usage

4. **Coordinate System**: Ensure logos appear in same positions
   - Test with multi-logo layouts
   - Verify pan/zoom calculations match

## Next Steps

Once Phase 1 is complete and tested:
1. Deploy behind feature flag to staging
2. Test with real-world scenarios
3. Gather performance metrics
4. Plan Phase 2 implementation