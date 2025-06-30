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
  
  // Theme
  darkMode: boolean;
  
  // Actions
  setZoom: (zoom: number) => void;
  toggleAnimation: () => void;
  togglePreviewMode: () => void;
  toggleCodeEditor: () => void;
  toggleSavedItems: () => void;
  toggleSaveDialog: () => void;
  toggleIndustryModal: () => void;
  setRendering: (isRendering: boolean) => void;
  setRenderSuccess: (success: boolean) => void;
  setCodeError: (error: string | null) => void;
  setDarkMode: (darkMode: boolean) => void;
  
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
      codeEditorCollapsed: false,
      savedItemsOpen: false,
      saveDialogOpen: false,
      industryModalOpen: false,
      isRendering: false,
      renderSuccess: false,
      codeError: null,
      darkMode: false,
      
      // Actions
      setZoom: (zoom) => set({ zoom }),
      
      toggleAnimation: () => set((state) => ({ animating: !state.animating })),
      
      togglePreviewMode: () => set((state) => ({ previewMode: !state.previewMode })),
      
      toggleCodeEditor: () => set((state) => ({ 
        codeEditorCollapsed: !state.codeEditorCollapsed 
      })),
      
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