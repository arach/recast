import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ExportStore {
  // Export state
  isExporting: boolean;
  exportProgress: number;
  exportError: string | null;
  
  // Actions
  setExporting: (isExporting: boolean) => void;
  setExportProgress: (progress: number) => void;
  setExportError: (error: string | null) => void;
  
  // Complex export actions
  startExport: () => void;
  completeExport: () => void;
  failExport: (error: string) => void;
}

export const useExportStore = create<ExportStore>()(
  devtools(
    (set) => ({
      // Initial state
      isExporting: false,
      exportProgress: 0,
      exportError: null,
      
      // Actions
      setExporting: (isExporting) => set({ isExporting }),
      
      setExportProgress: (progress) => set({ exportProgress: progress }),
      
      setExportError: (error) => set({ exportError: error }),
      
      startExport: () => set({
        isExporting: true,
        exportProgress: 0,
        exportError: null,
      }),
      
      completeExport: () => set({
        isExporting: false,
        exportProgress: 100,
        exportError: null,
      }),
      
      failExport: (error) => set({
        isExporting: false,
        exportProgress: 0,
        exportError: error,
      }),
    }),
    {
      name: 'export-store',
    }
  )
);