import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Logo, Parameters, Position } from '@/lib/types';

interface LogoStore {
  // State
  logos: Logo[];
  selectedLogoId: string | null;
  
  // Actions
  initializeLogos: (logos: Logo[]) => void; // Set initial logos
  setSelectedLogoId: (id: string | null) => void; // Alias for selectLogo
  addLogo: (templateId: string) => string; // Returns new logo ID
  updateLogo: (id: string, updates: Partial<Logo>) => void;
  updateLogoParameters: (id: string, parameters: Partial<Parameters>) => void;
  updateLogoPosition: (id: string, position: Position) => void;
  deleteLogo: (id: string) => void;
  duplicateLogo: (id: string) => string | null; // Returns new logo ID or null
  selectLogo: (id: string | null) => void;
  
  // Computed getters
  getSelectedLogo: () => Logo | null;
  getLogoById: (id: string) => Logo | null;
}

// Default parameters for new logos
const defaultParameters: Parameters = {
  core: {
    frequency: 4,
    amplitude: 50,
    complexity: 0.5,
    chaos: 0.1,
    damping: 0.8,
    layers: 3,
    radius: 50,
  },
  style: {
    fillColor: '#3b82f6',
    fillType: 'solid',
    fillOpacity: 1,
    strokeColor: '#1e40af',
    strokeType: 'solid',
    strokeWidth: 2,
    strokeOpacity: 1,
    backgroundColor: '#ffffff',
    backgroundType: 'transparent',
  },
  content: {},
  custom: {},
};

export const useLogoStore = create<LogoStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      logos: [
        {
          id: 'main',
          templateId: 'wave-bars',
          templateName: 'Wave Bars',
          parameters: defaultParameters,
          position: { x: 0, y: 0 },
          code: '// Default wave visualization',
        },
      ],
      selectedLogoId: 'main',

      // Actions
      initializeLogos: (logos) => {
        set({ logos, selectedLogoId: logos[0]?.id || null });
      },
      
      setSelectedLogoId: (id) => {
        set({ selectedLogoId: id });
      },
      
      addLogo: (templateId: string) => {
        const id = `logo-${Date.now()}`;
        const newLogo: Logo = {
          id,
          templateId,
          templateName: templateId, // Will be updated when template loads
          parameters: { ...defaultParameters },
          position: { x: 100, y: 100 }, // Offset from origin
          code: '',
        };
        
        set((state) => ({
          logos: [...state.logos, newLogo],
          selectedLogoId: id,
        }));
        
        return id;
      },

      updateLogo: (id, updates) => {
        set((state) => ({
          logos: state.logos.map((logo) =>
            logo.id === id ? { ...logo, ...updates } : logo
          ),
        }));
      },

      updateLogoParameters: (id, parameters) => {
        set((state) => ({
          logos: state.logos.map((logo) =>
            logo.id === id
              ? {
                  ...logo,
                  parameters: {
                    core: { ...logo.parameters.core, ...parameters.core },
                    style: { ...logo.parameters.style, ...parameters.style },
                    content: { ...logo.parameters.content, ...parameters.content },
                    custom: { ...logo.parameters.custom, ...parameters.custom },
                  },
                }
              : logo
          ),
        }));
      },

      updateLogoPosition: (id, position) => {
        set((state) => ({
          logos: state.logos.map((logo) =>
            logo.id === id ? { ...logo, position } : logo
          ),
        }));
      },

      deleteLogo: (id) => {
        const state = get();
        if (state.logos.length <= 1) return; // Don't delete last logo
        
        set((state) => {
          const newLogos = state.logos.filter((logo) => logo.id !== id);
          const newSelectedId = state.selectedLogoId === id
            ? newLogos[0]?.id || null
            : state.selectedLogoId;
          
          return {
            logos: newLogos,
            selectedLogoId: newSelectedId,
          };
        });
      },

      duplicateLogo: (id) => {
        const logoToDuplicate = get().logos.find((logo) => logo.id === id);
        if (!logoToDuplicate) return null;
        
        const newId = `logo-${Date.now()}`;
        const newLogo: Logo = {
          ...logoToDuplicate,
          id: newId,
          position: {
            x: logoToDuplicate.position.x + 100,
            y: logoToDuplicate.position.y + 100,
          },
        };
        
        set((state) => ({
          logos: [...state.logos, newLogo],
          selectedLogoId: newId,
        }));
        
        return newId;
      },

      selectLogo: (id) => {
        set({ selectedLogoId: id });
      },

      // Computed getters
      getSelectedLogo: () => {
        const state = get();
        return state.logos.find((logo) => logo.id === state.selectedLogoId) || null;
      },

      getLogoById: (id) => {
        return get().logos.find((logo) => logo.id === id) || null;
      },
    }),
    {
      name: 'logo-store',
    }
  )
);