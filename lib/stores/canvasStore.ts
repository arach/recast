import { createStore } from '@/lib/store-factory'

interface CanvasOffset {
  x: number
  y: number
}

interface CanvasState {
  // Canvas viewport state
  offset: CanvasOffset
  zoom: number
  isDragging: boolean
  
  // Tool mode
  toolMode: 'select' | 'pan'
  draggedLogoId: string | null
  dragOffset: CanvasOffset
  
  // Canvas dimensions
  dimensions: {
    width: number
    height: number
  }
  
  // Code editor state (affects canvas layout)
  codeEditor: {
    collapsed: boolean
    width: number
  }
  
  // Tools panel state (affects canvas layout)
  toolsPanel: {
    collapsed: boolean
    width: number
  }
  
  // Actions
  setOffset: (offset: CanvasOffset) => void
  setZoom: (zoom: number) => void
  setIsDragging: (isDragging: boolean) => void
  setToolMode: (mode: 'select' | 'pan') => void
  setDraggedLogoId: (id: string | null) => void
  setDragOffset: (offset: CanvasOffset) => void
  setDimensions: (width: number, height: number) => void
  setCodeEditorState: (collapsed: boolean, width: number) => void
  setToolsPanelState: (collapsed: boolean, width: number) => void
  
  // Computed actions
  centerView: (logoPositions: Array<{ x: number; y: number }>) => void
  fitToView: (logoPositions: Array<{ x: number; y: number }>) => void
  resetView: () => void
  
  // Mouse-centered zoom
  zoomAtPoint: (delta: number, mouseX: number, mouseY: number) => void
  
  // Standard actions
  reset: () => void
  hydrate: (state: Partial<CanvasState>) => void
}

// Initial state
const initialState = {
  offset: { x: 0, y: 0 },
  zoom: 1,
  isDragging: false,
  toolMode: 'pan' as const,
  draggedLogoId: null,
  dragOffset: { x: 0, y: 0 },
  dimensions: { width: 0, height: 0 },
  codeEditor: { collapsed: true, width: 500 },
  toolsPanel: { collapsed: false, width: 380 },
}

export const useCanvasStore = createStore<CanvasState>(
  (set, get) => ({
    // Initial state
    ...initialState,
        
    // Basic setters
    setOffset: (offset) => {
      set((state) => {
        state.offset = offset;
      });
    },
    
    setZoom: (zoom) => {
      set((state) => {
        state.zoom = Math.max(0.1, Math.min(5, zoom));
      });
    },
    
    setIsDragging: (isDragging) => {
      set((state) => {
        state.isDragging = isDragging;
      });
    },
    
    setToolMode: (mode) => {
      set((state) => {
        state.toolMode = mode;
      });
    },
    
    setDraggedLogoId: (id) => {
      set((state) => {
        state.draggedLogoId = id;
      });
    },
    
    setDragOffset: (offset) => {
      set((state) => {
        state.dragOffset = offset;
      });
    },
    
    setDimensions: (width, height) => {
      set((state) => {
        state.dimensions = { width, height };
      });
    },
    
    setCodeEditorState: (collapsed, width) => {
      set((state) => {
        state.codeEditor = { collapsed, width };
      });
    },
    
    setToolsPanelState: (collapsed, width) => {
      set((state) => {
        state.toolsPanel = { collapsed, width };
      });
    },
        
    // Center view on logos without changing zoom
    centerView: (logoPositions) => {
      const { zoom, dimensions, codeEditor } = get();
      if (logoPositions.length === 0) return;
      
      const logoSize = 600;
      
      // Calculate available canvas space
      const availableWidth = codeEditor.collapsed 
        ? dimensions.width 
        : dimensions.width - codeEditor.width;
      const availableHeight = dimensions.height;
      const effectiveCenterX = codeEditor.collapsed 
        ? availableWidth / 2 
        : codeEditor.width + availableWidth / 2;
      const effectiveCenterY = availableHeight / 2;
      
      // Calculate bounding box
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      logoPositions.forEach(pos => {
        minX = Math.min(minX, pos.x);
        maxX = Math.max(maxX, pos.x + logoSize);
        minY = Math.min(minY, pos.y);
        maxY = Math.max(maxY, pos.y + logoSize);
      });
      
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      
      set((state) => {
        state.offset = {
          x: effectiveCenterX / zoom - centerX,
          y: effectiveCenterY / zoom - centerY
        };
      });
    },
        
    // Fit all logos in view with appropriate zoom
    fitToView: (logoPositions) => {
      const { dimensions, codeEditor } = get();
      if (logoPositions.length === 0) return;
      
      const logoSize = 600;
      
      // Calculate available canvas space
      const availableWidth = codeEditor.collapsed 
        ? dimensions.width 
        : dimensions.width - codeEditor.width;
      const availableHeight = dimensions.height;
      const effectiveCenterX = codeEditor.collapsed 
        ? availableWidth / 2 
        : codeEditor.width + availableWidth / 2;
      const effectiveCenterY = availableHeight / 2;
      
      // Calculate bounding box
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      logoPositions.forEach(pos => {
        minX = Math.min(minX, pos.x);
        maxX = Math.max(maxX, pos.x + logoSize);
        minY = Math.min(minY, pos.y);
        maxY = Math.max(maxY, pos.y + logoSize);
      });
      
      const contentWidth = maxX - minX;
      const contentHeight = maxY - minY;
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      
      // Calculate zoom to fit at 70% coverage
      const targetCoverage = 0.7;
      const zoomX = (availableWidth * targetCoverage) / contentWidth;
      const zoomY = (availableHeight * targetCoverage) / contentHeight;
      const idealZoom = Math.min(zoomX, zoomY);
      const clampedZoom = Math.max(0.2, Math.min(idealZoom, 1.5));
      
      set((state) => {
        state.zoom = clampedZoom;
        state.offset = {
          x: effectiveCenterX / clampedZoom - centerX,
          y: effectiveCenterY / clampedZoom - centerY
        };
      });
    },
        
    // Reset to initial centered view
    resetView: () => {
      const { dimensions, codeEditor } = get();
      
      const availableWidth = codeEditor.collapsed 
        ? dimensions.width 
        : dimensions.width - codeEditor.width;
      const availableHeight = dimensions.height;
      const effectiveCenterX = codeEditor.collapsed 
        ? availableWidth / 2 
        : codeEditor.width + availableWidth / 2;
      const effectiveCenterY = availableHeight / 2;
      
      set((state) => {
        state.zoom = 1;
        state.offset = {
          x: effectiveCenterX,
          y: effectiveCenterY
        };
      });
    },
        
    // Zoom centered on mouse position
    zoomAtPoint: (delta, mouseX, mouseY) => {
      const { zoom, offset } = get();
      const newZoom = Math.max(0.1, Math.min(5, zoom * delta));
      const zoomRatio = newZoom / zoom;
      
      set((state) => {
        state.zoom = newZoom;
        state.offset = {
          x: offset.x + (mouseX / newZoom) - (mouseX / zoom),
          y: offset.y + (mouseY / newZoom) - (mouseY / zoom)
        };
      });
    },
    
    // Standard actions
    reset: () => {
      set(() => initialState);
    },
    
    hydrate: (newState) => {
      set((state) => {
        Object.assign(state, newState);
      });
    },
  }),
  {
    name: 'reflow-canvas',
    persist: true,
    persistOptions: {
      partialize: (state) => ({
        offset: state.offset,
        zoom: state.zoom,
        codeEditor: state.codeEditor
      }),
    },
    debug: process.env.NODE_ENV === 'development',
  }
)

// Selectors for common derived state
export const selectAvailableCanvasArea = (state: CanvasState) => {
  const { dimensions, codeEditor } = state;
  const availableWidth = codeEditor.collapsed 
    ? dimensions.width 
    : dimensions.width - codeEditor.width;
  return {
    width: availableWidth,
    height: dimensions.height,
    centerX: codeEditor.collapsed 
      ? availableWidth / 2 
      : codeEditor.width + availableWidth / 2,
    centerY: dimensions.height / 2
  };
};