# ReFlow Store Architecture

## Overview

ReFlow uses Zustand for state management with three primary stores that handle different aspects of the application. This document outlines the architecture, responsibilities, and usage patterns for each store.

## Store Overview

### 1. **Logo Store** (`useLogoStore`)
Manages the core business logic around logos - creation, modification, and persistence.

### 2. **UI Store** (`useUIStore`)
Handles all UI state including panel visibility, tool states, and user preferences.

### 3. **Canvas Store** (`useCanvasStore`)
Manages canvas-specific state like zoom, pan, and rendering settings.

## Store Factory Pattern

All stores are created using a standardized factory pattern that provides:
- Consistent API across stores
- Built-in persistence options
- DevTools integration
- Immer for immutable updates
- TypeScript safety

```typescript
// lib/store-factory.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { StateCreator } from 'zustand';

interface StoreOptions {
  name: string;
  persist?: boolean;
  persistOptions?: {
    storage?: 'localStorage' | 'sessionStorage';
    partialize?: (state: any) => any;
  };
  debug?: boolean;
}

export function createStore<T extends object>(
  stateCreator: StateCreator<T>,
  options: StoreOptions
) {
  return create<T>()(
    devtools(
      persist(
        immer(stateCreator),
        {
          name: options.name,
          enabled: options.persist ?? false,
          storage: options.persistOptions?.storage === 'sessionStorage' 
            ? sessionStorage 
            : localStorage,
          partialize: options.persistOptions?.partialize
        }
      ),
      {
        name: options.name,
        enabled: process.env.NODE_ENV === 'development'
      }
    )
  );
}
```

## Store Implementations

### Logo Store

**Purpose**: Manages all logo-related state and operations

```typescript
// stores/logo-store.ts
import { createStore } from '@/lib/store-factory';
import type { Logo, TemplateId } from '@/types';

interface LogoState {
  // State
  logos: Logo[];
  selectedLogoId: string | null;
  isGenerating: boolean;
  generationError: string | null;
  
  // Actions
  addLogo: (logo: Logo) => void;
  updateLogo: (id: string, updates: Partial<Logo>) => void;
  deleteLogo: (id: string) => void;
  selectLogo: (id: string | null) => void;
  duplicateLogo: (id: string) => void;
  
  // Template operations
  changeTemplate: (logoId: string, templateId: TemplateId) => void;
  updateParameters: (logoId: string, params: Record<string, any>) => void;
  
  // Generation
  generateVariation: (logoId: string) => Promise<void>;
  setGenerating: (generating: boolean) => void;
  setError: (error: string | null) => void;
  
  // Bulk operations
  clearAll: () => void;
  importLogos: (logos: Logo[]) => void;
  exportLogos: () => Logo[];
}

export const useLogoStore = createStore<LogoState>(
  (set, get) => ({
    // Initial state
    logos: [],
    selectedLogoId: null,
    isGenerating: false,
    generationError: null,
    
    // Actions
    addLogo: (logo) => set((state) => {
      state.logos.push(logo);
      state.selectedLogoId = logo.id;
    }),
    
    updateLogo: (id, updates) => set((state) => {
      const index = state.logos.findIndex(l => l.id === id);
      if (index !== -1) {
        Object.assign(state.logos[index], updates);
      }
    }),
    
    deleteLogo: (id) => set((state) => {
      state.logos = state.logos.filter(l => l.id !== id);
      if (state.selectedLogoId === id) {
        state.selectedLogoId = state.logos[0]?.id || null;
      }
    }),
    
    selectLogo: (id) => set((state) => {
      state.selectedLogoId = id;
    }),
    
    duplicateLogo: (id) => set((state) => {
      const logo = state.logos.find(l => l.id === id);
      if (logo) {
        const newLogo: Logo = {
          ...logo,
          id: `logo-${Date.now()}`,
          name: `${logo.name} (Copy)`,
          createdAt: new Date().toISOString()
        };
        state.logos.push(newLogo);
        state.selectedLogoId = newLogo.id;
      }
    }),
    
    changeTemplate: (logoId, templateId) => set((state) => {
      const logo = state.logos.find(l => l.id === logoId);
      if (logo) {
        logo.templateId = templateId;
        // Reset parameters to template defaults
        logo.parameters = getTemplateDefaults(templateId);
      }
    }),
    
    updateParameters: (logoId, params) => set((state) => {
      const logo = state.logos.find(l => l.id === logoId);
      if (logo) {
        logo.parameters = { ...logo.parameters, ...params };
      }
    }),
    
    generateVariation: async (logoId) => {
      set((state) => {
        state.isGenerating = true;
        state.generationError = null;
      });
      
      try {
        const logo = get().logos.find(l => l.id === logoId);
        if (!logo) throw new Error('Logo not found');
        
        // Generate variation logic here
        const variation = await generateLogoVariation(logo);
        
        set((state) => {
          state.logos.push(variation);
          state.selectedLogoId = variation.id;
          state.isGenerating = false;
        });
      } catch (error) {
        set((state) => {
          state.isGenerating = false;
          state.generationError = error.message;
        });
      }
    },
    
    setGenerating: (generating) => set((state) => {
      state.isGenerating = generating;
    }),
    
    setError: (error) => set((state) => {
      state.generationError = error;
    }),
    
    clearAll: () => set((state) => {
      state.logos = [];
      state.selectedLogoId = null;
    }),
    
    importLogos: (logos) => set((state) => {
      state.logos = [...state.logos, ...logos];
      if (logos.length > 0 && !state.selectedLogoId) {
        state.selectedLogoId = logos[0].id;
      }
    }),
    
    exportLogos: () => get().logos
  }),
  {
    name: 'reflow-logos',
    persist: true,
    persistOptions: {
      partialize: (state) => ({
        logos: state.logos,
        selectedLogoId: state.selectedLogoId
      })
    },
    debug: true
  }
);
```

### UI Store

**Purpose**: Manages UI state and user preferences

```typescript
// stores/ui-store.ts
import { createStore } from '@/lib/store-factory';

interface UIState {
  // Panel states
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  bottomPanelOpen: boolean;
  debuggerOpen: boolean;
  
  // Tool states
  activeTool: string | null;
  expandedTools: Set<string>;
  toolPanelWidth: number;
  
  // Preferences
  theme: 'light' | 'dark' | 'system';
  autoSave: boolean;
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;
  
  // Modals
  activeModal: string | null;
  modalData: any;
  
  // Actions
  togglePanel: (panel: 'left' | 'right' | 'bottom' | 'debugger') => void;
  setActiveTool: (tool: string | null) => void;
  toggleToolExpansion: (tool: string) => void;
  setToolPanelWidth: (width: number) => void;
  
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleAutoSave: () => void;
  toggleGrid: () => void;
  toggleSnapToGrid: () => void;
  setGridSize: (size: number) => void;
  
  openModal: (modalId: string, data?: any) => void;
  closeModal: () => void;
  
  resetUI: () => void;
}

export const useUIStore = createStore<UIState>(
  (set, get) => ({
    // Initial state
    leftPanelOpen: true,
    rightPanelOpen: true,
    bottomPanelOpen: false,
    debuggerOpen: false,
    
    activeTool: null,
    expandedTools: new Set(['brand-identity']),
    toolPanelWidth: 320,
    
    theme: 'system',
    autoSave: true,
    showGrid: false,
    snapToGrid: false,
    gridSize: 10,
    
    activeModal: null,
    modalData: null,
    
    // Actions
    togglePanel: (panel) => set((state) => {
      switch (panel) {
        case 'left':
          state.leftPanelOpen = !state.leftPanelOpen;
          break;
        case 'right':
          state.rightPanelOpen = !state.rightPanelOpen;
          break;
        case 'bottom':
          state.bottomPanelOpen = !state.bottomPanelOpen;
          break;
        case 'debugger':
          state.debuggerOpen = !state.debuggerOpen;
          break;
      }
    }),
    
    setActiveTool: (tool) => set((state) => {
      state.activeTool = tool;
      if (tool) {
        state.expandedTools.add(tool);
      }
    }),
    
    toggleToolExpansion: (tool) => set((state) => {
      if (state.expandedTools.has(tool)) {
        state.expandedTools.delete(tool);
      } else {
        state.expandedTools.add(tool);
      }
    }),
    
    setToolPanelWidth: (width) => set((state) => {
      state.toolPanelWidth = Math.max(280, Math.min(600, width));
    }),
    
    setTheme: (theme) => set((state) => {
      state.theme = theme;
    }),
    
    toggleAutoSave: () => set((state) => {
      state.autoSave = !state.autoSave;
    }),
    
    toggleGrid: () => set((state) => {
      state.showGrid = !state.showGrid;
    }),
    
    toggleSnapToGrid: () => set((state) => {
      state.snapToGrid = !state.snapToGrid;
    }),
    
    setGridSize: (size) => set((state) => {
      state.gridSize = size;
    }),
    
    openModal: (modalId, data) => set((state) => {
      state.activeModal = modalId;
      state.modalData = data;
    }),
    
    closeModal: () => set((state) => {
      state.activeModal = null;
      state.modalData = null;
    }),
    
    resetUI: () => set((state) => {
      state.leftPanelOpen = true;
      state.rightPanelOpen = true;
      state.bottomPanelOpen = false;
      state.debuggerOpen = false;
      state.activeTool = null;
      state.expandedTools = new Set(['brand-identity']);
    })
  }),
  {
    name: 'reflow-ui',
    persist: true,
    persistOptions: {
      partialize: (state) => ({
        theme: state.theme,
        autoSave: state.autoSave,
        showGrid: state.showGrid,
        snapToGrid: state.snapToGrid,
        gridSize: state.gridSize,
        toolPanelWidth: state.toolPanelWidth,
        expandedTools: Array.from(state.expandedTools)
      })
    }
  }
);
```

### Canvas Store

**Purpose**: Manages canvas viewport and rendering state

```typescript
// stores/canvas-store.ts
import { createStore } from '@/lib/store-factory';

interface CanvasState {
  // Viewport
  zoom: number;
  panX: number;
  panY: number;
  
  // Canvas settings
  backgroundColor: string;
  showRulers: boolean;
  showGuides: boolean;
  guides: Guide[];
  
  // Animation
  isPlaying: boolean;
  currentTime: number;
  animationSpeed: number;
  loop: boolean;
  
  // Export settings
  exportFormat: 'png' | 'svg' | 'gif' | 'mp4';
  exportScale: number;
  exportQuality: number;
  
  // Interaction
  isDragging: boolean;
  isSelecting: boolean;
  selectionBox: SelectionBox | null;
  
  // Actions
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  fitToScreen: () => void;
  
  setPan: (x: number, y: number) => void;
  panBy: (dx: number, dy: number) => void;
  centerCanvas: () => void;
  
  toggleRulers: () => void;
  toggleGuides: () => void;
  addGuide: (guide: Guide) => void;
  removeGuide: (id: string) => void;
  clearGuides: () => void;
  
  play: () => void;
  pause: () => void;
  togglePlayback: () => void;
  setCurrentTime: (time: number) => void;
  setAnimationSpeed: (speed: number) => void;
  toggleLoop: () => void;
  
  setExportFormat: (format: 'png' | 'svg' | 'gif' | 'mp4') => void;
  setExportScale: (scale: number) => void;
  setExportQuality: (quality: number) => void;
  
  startDragging: () => void;
  stopDragging: () => void;
  startSelection: (box: SelectionBox) => void;
  updateSelection: (box: SelectionBox) => void;
  endSelection: () => void;
}

export const useCanvasStore = createStore<CanvasState>(
  (set, get) => ({
    // Initial state
    zoom: 1,
    panX: 0,
    panY: 0,
    
    backgroundColor: '#ffffff',
    showRulers: false,
    showGuides: false,
    guides: [],
    
    isPlaying: false,
    currentTime: 0,
    animationSpeed: 1,
    loop: true,
    
    exportFormat: 'png',
    exportScale: 2,
    exportQuality: 0.95,
    
    isDragging: false,
    isSelecting: false,
    selectionBox: null,
    
    // Zoom actions
    setZoom: (zoom) => set((state) => {
      state.zoom = Math.max(0.1, Math.min(10, zoom));
    }),
    
    zoomIn: () => set((state) => {
      state.zoom = Math.min(10, state.zoom * 1.2);
    }),
    
    zoomOut: () => set((state) => {
      state.zoom = Math.max(0.1, state.zoom / 1.2);
    }),
    
    resetZoom: () => set((state) => {
      state.zoom = 1;
    }),
    
    fitToScreen: () => {
      // Calculate zoom to fit logo in viewport
      const viewport = getViewportSize();
      const logoSize = getSelectedLogoSize();
      
      set((state) => {
        state.zoom = Math.min(
          viewport.width / logoSize.width,
          viewport.height / logoSize.height
        ) * 0.9;
        state.panX = 0;
        state.panY = 0;
      });
    },
    
    // Pan actions
    setPan: (x, y) => set((state) => {
      state.panX = x;
      state.panY = y;
    }),
    
    panBy: (dx, dy) => set((state) => {
      state.panX += dx;
      state.panY += dy;
    }),
    
    centerCanvas: () => set((state) => {
      state.panX = 0;
      state.panY = 0;
    }),
    
    // Ruler/Guide actions
    toggleRulers: () => set((state) => {
      state.showRulers = !state.showRulers;
    }),
    
    toggleGuides: () => set((state) => {
      state.showGuides = !state.showGuides;
    }),
    
    addGuide: (guide) => set((state) => {
      state.guides.push(guide);
    }),
    
    removeGuide: (id) => set((state) => {
      state.guides = state.guides.filter(g => g.id !== id);
    }),
    
    clearGuides: () => set((state) => {
      state.guides = [];
    }),
    
    // Animation actions
    play: () => set((state) => {
      state.isPlaying = true;
    }),
    
    pause: () => set((state) => {
      state.isPlaying = false;
    }),
    
    togglePlayback: () => set((state) => {
      state.isPlaying = !state.isPlaying;
    }),
    
    setCurrentTime: (time) => set((state) => {
      state.currentTime = time;
    }),
    
    setAnimationSpeed: (speed) => set((state) => {
      state.animationSpeed = Math.max(0.1, Math.min(5, speed));
    }),
    
    toggleLoop: () => set((state) => {
      state.loop = !state.loop;
    }),
    
    // Export actions
    setExportFormat: (format) => set((state) => {
      state.exportFormat = format;
    }),
    
    setExportScale: (scale) => set((state) => {
      state.exportScale = Math.max(0.5, Math.min(8, scale));
    }),
    
    setExportQuality: (quality) => set((state) => {
      state.exportQuality = Math.max(0.1, Math.min(1, quality));
    }),
    
    // Interaction actions
    startDragging: () => set((state) => {
      state.isDragging = true;
    }),
    
    stopDragging: () => set((state) => {
      state.isDragging = false;
    }),
    
    startSelection: (box) => set((state) => {
      state.isSelecting = true;
      state.selectionBox = box;
    }),
    
    updateSelection: (box) => set((state) => {
      state.selectionBox = box;
    }),
    
    endSelection: () => set((state) => {
      state.isSelecting = false;
      state.selectionBox = null;
    })
  }),
  {
    name: 'reflow-canvas',
    persist: true,
    persistOptions: {
      partialize: (state) => ({
        zoom: state.zoom,
        panX: state.panX,
        panY: state.panY,
        backgroundColor: state.backgroundColor,
        showRulers: state.showRulers,
        showGuides: state.showGuides,
        animationSpeed: state.animationSpeed,
        loop: state.loop,
        exportFormat: state.exportFormat,
        exportScale: state.exportScale,
        exportQuality: state.exportQuality
      })
    }
  }
);
```

## Usage Examples

### Accessing Store State

```typescript
// In a React component
import { useLogoStore } from '@/stores/logo-store';

function LogoList() {
  const logos = useLogoStore((state) => state.logos);
  const selectedId = useLogoStore((state) => state.selectedLogoId);
  const selectLogo = useLogoStore((state) => state.selectLogo);
  
  return (
    <div>
      {logos.map(logo => (
        <div 
          key={logo.id}
          onClick={() => selectLogo(logo.id)}
          className={logo.id === selectedId ? 'selected' : ''}
        >
          {logo.name}
        </div>
      ))}
    </div>
  );
}
```

### Subscribing to Store Changes

```typescript
// Outside React components
import { useLogoStore } from '@/stores/logo-store';

// Subscribe to specific state changes
const unsubscribe = useLogoStore.subscribe(
  (state) => state.selectedLogoId,
  (selectedId) => {
    console.log('Selected logo changed:', selectedId);
  }
);

// Subscribe to entire store
const unsubscribeAll = useLogoStore.subscribe((state) => {
  console.log('Store updated:', state);
});

// Clean up
unsubscribe();
unsubscribeAll();
```

### Cross-Store Communication

```typescript
// In logo-store.ts
import { useCanvasStore } from './canvas-store';

// Inside an action
generateVariation: async (logoId) => {
  // ... generation logic
  
  // Reset canvas zoom when generating new variation
  useCanvasStore.getState().resetZoom();
  useCanvasStore.getState().centerCanvas();
}
```

### Testing Stores

```typescript
// __tests__/stores/logo-store.test.ts
import { useLogoStore } from '@/stores/logo-store';

describe('Logo Store', () => {
  beforeEach(() => {
    useLogoStore.setState({
      logos: [],
      selectedLogoId: null,
      isGenerating: false,
      generationError: null
    });
  });
  
  it('should add a logo', () => {
    const logo = {
      id: 'test-1',
      name: 'Test Logo',
      templateId: 'wave-bars',
      parameters: {}
    };
    
    useLogoStore.getState().addLogo(logo);
    
    expect(useLogoStore.getState().logos).toHaveLength(1);
    expect(useLogoStore.getState().selectedLogoId).toBe('test-1');
  });
  
  it('should delete a logo', () => {
    // Add logos first
    useLogoStore.setState({
      logos: [
        { id: '1', name: 'Logo 1' },
        { id: '2', name: 'Logo 2' }
      ],
      selectedLogoId: '1'
    });
    
    useLogoStore.getState().deleteLogo('1');
    
    expect(useLogoStore.getState().logos).toHaveLength(1);
    expect(useLogoStore.getState().selectedLogoId).toBe('2');
  });
});
```

## Best Practices

### 1. **Selector Optimization**
Use specific selectors to prevent unnecessary re-renders:

```typescript
// ❌ Bad - subscribes to entire store
const store = useLogoStore();

// ✅ Good - subscribes only to needed state
const logos = useLogoStore((state) => state.logos);
const addLogo = useLogoStore((state) => state.addLogo);
```

### 2. **Action Composition**
Keep actions focused and compose complex operations:

```typescript
// In the store
const complexOperation = async () => {
  const { startOperation, updateProgress, completeOperation } = get();
  
  startOperation();
  
  try {
    await step1();
    updateProgress(33);
    
    await step2();
    updateProgress(66);
    
    await step3();
    updateProgress(100);
    
    completeOperation();
  } catch (error) {
    handleError(error);
  }
};
```

### 3. **Type Safety**
Always define proper TypeScript interfaces:

```typescript
interface Logo {
  id: string;
  name: string;
  templateId: TemplateId;
  parameters: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Use branded types for IDs
type LogoId = string & { __brand: 'LogoId' };
type TemplateId = string & { __brand: 'TemplateId' };
```

### 4. **Persistence Strategy**
Only persist necessary state:

```typescript
persistOptions: {
  partialize: (state) => ({
    // Persist data
    logos: state.logos,
    selectedLogoId: state.selectedLogoId,
    
    // Don't persist temporary UI state
    // isGenerating: state.isGenerating, ❌
    // generationError: state.generationError, ❌
  })
}
```

### 5. **Error Handling**
Always handle errors gracefully:

```typescript
try {
  await riskyOperation();
  set((state) => { state.success = true; });
} catch (error) {
  set((state) => {
    state.error = error.message;
    state.success = false;
  });
  
  // Log to error tracking service
  trackError(error);
}
```

## Store Debugging

### DevTools Integration
All stores automatically integrate with Redux DevTools in development:

1. Install Redux DevTools Extension
2. Open DevTools and navigate to Redux tab
3. See all store actions and state changes

### Debug Helpers

```typescript
// In development, expose stores globally
if (process.env.NODE_ENV === 'development') {
  window.stores = {
    logo: useLogoStore,
    ui: useUIStore,
    canvas: useCanvasStore
  };
}

// In console:
// stores.logo.getState()
// stores.ui.getState().togglePanel('debugger')
```

### State Snapshots

```typescript
// Create snapshot
const snapshot = {
  logo: useLogoStore.getState(),
  ui: useUIStore.getState(),
  canvas: useCanvasStore.getState()
};

// Restore snapshot
useLogoStore.setState(snapshot.logo);
useUIStore.setState(snapshot.ui);
useCanvasStore.setState(snapshot.canvas);
```

## Migration Guide

### From Context API

```typescript
// Before (Context)
const LogoContext = createContext();

function LogoProvider({ children }) {
  const [logos, setLogos] = useState([]);
  
  const addLogo = (logo) => {
    setLogos([...logos, logo]);
  };
  
  return (
    <LogoContext.Provider value={{ logos, addLogo }}>
      {children}
    </LogoContext.Provider>
  );
}

// After (Zustand)
const useLogoStore = createStore((set) => ({
  logos: [],
  addLogo: (logo) => set((state) => {
    state.logos.push(logo);
  })
}));

// Usage remains similar
const logos = useLogoStore((state) => state.logos);
const addLogo = useLogoStore((state) => state.addLogo);
```

### From Redux

```typescript
// Before (Redux)
const logoSlice = createSlice({
  name: 'logos',
  initialState: { logos: [] },
  reducers: {
    addLogo: (state, action) => {
      state.logos.push(action.payload);
    }
  }
});

// After (Zustand)
const useLogoStore = createStore((set) => ({
  logos: [],
  addLogo: (logo) => set((state) => {
    state.logos.push(logo);
  })
}));
```

## Performance Considerations

### 1. **Shallow Comparisons**
Zustand uses shallow equality by default:

```typescript
// This will cause re-renders
set((state) => {
  state.deepObject.nested.value = 'new'; // ❌
});

// Do this instead
set((state) => {
  state.deepObject = {
    ...state.deepObject,
    nested: {
      ...state.deepObject.nested,
      value: 'new'
    }
  };
});

// Or use Immer (included in our factory)
set((state) => {
  state.deepObject.nested.value = 'new'; // ✅ With Immer
});
```

### 2. **Computed Values**
Use selectors for derived state:

```typescript
// Define selector
const selectFilteredLogos = (state) => 
  state.logos.filter(logo => logo.templateId === state.filterTemplate);

// Use in component
const filteredLogos = useLogoStore(selectFilteredLogos);
```

### 3. **Batching Updates**
Zustand batches updates automatically:

```typescript
// These will result in one re-render
set((state) => {
  state.value1 = 'new1';
  state.value2 = 'new2';
  state.value3 = 'new3';
});
```

## Conclusion

This architecture provides a robust, type-safe, and performant state management solution for ReFlow. The three stores clearly separate concerns while remaining flexible enough to communicate when needed. The standardized factory pattern ensures consistency and reduces boilerplate across all stores.