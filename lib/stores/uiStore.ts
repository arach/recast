import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UIStore {
  // Canvas state
  zoom: number;
  animating: boolean;
  previewMode: boolean;
  
  // Panel states
  codeEditorCollapsed: boolean;
  savedItemsOpen: boolean;
  saveDialogOpen: boolean;
  industryModalOpen: boolean;
  
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
  setControlsPanelOpen: (open: boolean) => void;
  toggleSavedItems: () => void;
  toggleSaveDialog: () => void;
  toggleIndustryModal: () => void;
  setRendering: (isRendering: boolean) => void;
  setRenderSuccess: (success: boolean) => void;
  setCodeError: (error: string | null) => void;
  setDarkMode: (darkMode: boolean) => void;
  setRenderTrigger: (trigger: number) => void;
  
  // Complex UI actions
  showSaveDialog: (mode: 'shape' | 'preset') => void;
  hideSaveDialog: () => void;
}

export const useUIStore = create<UIStore>()(
  devtools(
    (set) => ({
      // Initial state
      zoom: 1,
      animating: false,
      previewMode: false,
      codeEditorCollapsed: true,
      savedItemsOpen: false,
      saveDialogOpen: false,
      industryModalOpen: false,
      isRendering: false,
      renderSuccess: false,
      codeError: null,
      darkMode: false,
      renderTrigger: 0,
      
      // Actions
      setZoom: (zoom) => set({ zoom }),
      
      setAnimating: (animating) => set({ animating }),
      
      toggleAnimation: () => set((state) => ({ animating: !state.animating })),
      
      togglePreviewMode: () => set((state) => ({ previewMode: !state.previewMode })),
      
      toggleCodeEditor: () => set((state) => ({ 
        codeEditorCollapsed: !state.codeEditorCollapsed 
      })),
      
      setCodeEditorCollapsed: (collapsed) => set({ codeEditorCollapsed: collapsed }),
      
      setControlsPanelOpen: (open) => set({ 
        // Since we don't have a specific controlsPanelOpen state, 
        // we can use this as a placeholder or add it to the state
      }),
      
      toggleSavedItems: () => set((state) => ({ 
        savedItemsOpen: !state.savedItemsOpen 
      })),
      
      toggleSaveDialog: () => set((state) => ({ 
        saveDialogOpen: !state.saveDialogOpen 
      })),
      
      toggleIndustryModal: () => set((state) => ({ 
        industryModalOpen: !state.industryModalOpen 
      })),
      
      setRendering: (isRendering) => set({ isRendering }),
      
      setRenderSuccess: (success) => set({ renderSuccess: success }),
      
      setCodeError: (error) => set({ codeError: error }),
      
      setDarkMode: (darkMode) => set({ darkMode }),
      
      setRenderTrigger: (trigger) => set({ renderTrigger: trigger }),
      
      // Complex actions
      showSaveDialog: (mode) => set({ 
        saveDialogOpen: true,
        // We'll handle mode in a separate store or component state
      }),
      
      hideSaveDialog: () => set({ 
        saveDialogOpen: false 
      }),
    }),
    {
      name: 'ui-store',
    }
  )
);