import { createStore } from '@/lib/store-factory';

interface UIStore {
  // Canvas state
  zoom: number;
  animating: boolean;
  previewMode: boolean;
  
  // Panel states
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  codeEditorCollapsed: boolean;
  savedItemsOpen: boolean;
  saveDialogOpen: boolean;
  saveDialogMode: 'shape' | 'logo' | null;
  industryModalOpen: boolean;
  debuggerOpen: boolean;
  
  // Editor state
  isRendering: boolean;
  renderSuccess: boolean;
  codeError: string | null;
  renderTrigger: number;
  
  // Theme
  darkMode: boolean;
  
  // Actions
  setZoom: (zoom: number) => void;
  setAnimating: (animating: boolean) => void;
  toggleAnimation: () => void;
  togglePreviewMode: () => void;
  toggleCodeEditor: () => void;
  setCodeEditorCollapsed: (collapsed: boolean) => void;
  togglePanel: (panel: 'left' | 'right' | 'debugger') => void;
  toggleSavedItems: () => void;
  toggleSaveDialog: () => void;
  toggleIndustryModal: () => void;
  setRendering: (isRendering: boolean) => void;
  setRenderSuccess: (success: boolean) => void;
  setCodeError: (error: string | null) => void;
  setDarkMode: (darkMode: boolean) => void;
  setRenderTrigger: (trigger: number) => void;
  
  // Complex UI actions
  showSaveDialog: (mode: 'shape' | 'logo') => void;
  hideSaveDialog: () => void;
  
  // Standard actions
  reset: () => void;
  hydrate: (state: Partial<UIStore>) => void;
}

// Initial state
const initialState = {
  // Canvas state
  zoom: 1,
  animating: false,
  previewMode: false,
  
  // Panel states
  leftPanelOpen: true,
  rightPanelOpen: true,
  codeEditorCollapsed: true,
  savedItemsOpen: false,
  saveDialogOpen: false,
  saveDialogMode: null as 'shape' | 'logo' | null,
  industryModalOpen: false,
  debuggerOpen: false,
  
  // Editor state
  isRendering: false,
  renderSuccess: false,
  codeError: null,
  renderTrigger: 0,
  
  // Theme
  darkMode: false,
};

export const useUIStore = createStore<UIStore>(
  (set, get) => ({
    // Initial state
    ...initialState,
      
    // Actions
    setZoom: (zoom) => {
      set((state) => {
        state.zoom = zoom;
      });
    },
    
    setAnimating: (animating) => {
      set((state) => {
        state.animating = animating;
      });
    },
    
    toggleAnimation: () => {
      set((state) => {
        state.animating = !state.animating;
      });
    },
    
    togglePreviewMode: () => {
      set((state) => {
        state.previewMode = !state.previewMode;
      });
    },
    
    toggleCodeEditor: () => {
      set((state) => {
        state.codeEditorCollapsed = !state.codeEditorCollapsed;
      });
    },
    
    setCodeEditorCollapsed: (collapsed) => {
      set((state) => {
        state.codeEditorCollapsed = collapsed;
      });
    },
    
    togglePanel: (panel) => {
      set((state) => {
        switch (panel) {
          case 'left':
            state.leftPanelOpen = !state.leftPanelOpen;
            break;
          case 'right':
            state.rightPanelOpen = !state.rightPanelOpen;
            break;
          case 'debugger':
            state.debuggerOpen = !state.debuggerOpen;
            break;
        }
      });
    },
    
    toggleSavedItems: () => {
      set((state) => {
        state.savedItemsOpen = !state.savedItemsOpen;
      });
    },
    
    toggleSaveDialog: () => {
      set((state) => {
        state.saveDialogOpen = !state.saveDialogOpen;
        if (!state.saveDialogOpen) {
          state.saveDialogMode = null;
        }
      });
    },
    
    toggleIndustryModal: () => {
      set((state) => {
        state.industryModalOpen = !state.industryModalOpen;
      });
    },
    
    setRendering: (isRendering) => {
      set((state) => {
        state.isRendering = isRendering;
      });
    },
    
    setRenderSuccess: (success) => {
      set((state) => {
        state.renderSuccess = success;
      });
    },
    
    setCodeError: (error) => {
      set((state) => {
        state.codeError = error;
      });
    },
    
    setDarkMode: (darkMode) => {
      set((state) => {
        state.darkMode = darkMode;
      });
    },
    
    setRenderTrigger: (trigger) => {
      set((state) => {
        state.renderTrigger = trigger;
      });
    },
    
    // Complex actions
    showSaveDialog: (mode) => {
      set((state) => {
        state.saveDialogOpen = true;
        state.saveDialogMode = mode;
      });
    },
    
    hideSaveDialog: () => {
      set((state) => {
        state.saveDialogOpen = false;
        state.saveDialogMode = null;
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
    name: 'reflow-ui',
    persist: true,
    persistOptions: {
      partialize: (state) => ({
        // Persist user preferences
        darkMode: state.darkMode,
        leftPanelOpen: state.leftPanelOpen,
        rightPanelOpen: state.rightPanelOpen,
        codeEditorCollapsed: state.codeEditorCollapsed,
        // Don't persist temporary UI states
        // animating, isRendering, renderSuccess, etc.
      }),
    },
    debug: process.env.NODE_ENV === 'development',
  }
);