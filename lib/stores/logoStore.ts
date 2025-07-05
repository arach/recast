import { createStore, createStandardActions } from '@/lib/store-factory';
import { Logo, Parameters, Position } from '@/lib/types';
import { LogoIdManager } from '@/lib/utils/logoIdManager';

interface LogoStore {
  // State
  logos: Logo[];
  selectedLogoId: string | null;
  
  // Actions
  initializeLogos: (logos: Logo[]) => void;
  setSelectedLogoId: (id: string | null) => void;
  addLogo: (templateId: string) => string;
  updateLogo: (id: string, updates: Partial<Logo>) => void;
  updateLogoParameters: (id: string, parameters: Partial<Parameters>) => void;
  updateLogoPosition: (id: string, position: Position) => void;
  deleteLogo: (id: string) => void;
  duplicateLogo: (id: string) => string | null;
  selectLogo: (id: string | null) => void;
  randomizeLogo: (id: string) => void;
  clearPersistedState: () => void;
  
  // Computed getters
  getSelectedLogo: () => Logo | null;
  getLogoById: (id: string) => Logo | null;
  getLogoCount: () => number;
  
  // Standard actions
  reset: () => void;
  hydrate: (state: Partial<LogoStore>) => void;
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
    backgroundOpacity: 1,
  },
  content: {},
  custom: {
    barCount: 40,
    barSpacing: 2
  },
};

// Initial state
const initialState = {
  logos: [
    {
      id: 'main',
      templateId: 'wave-bars',
      templateName: 'Wave Bars',
      parameters: defaultParameters,
      position: { x: 0, y: 0 },
      code: `// Default ReFlow Logo
const PARAMETERS = {
  barCount: { type: 'slider', min: 20, max: 100, step: 5, default: 40, label: 'Number of Bars' },
  barSpacing: { type: 'slider', min: 0, max: 10, step: 1, default: 2, label: 'Bar Spacing' }
};

function drawVisualization(ctx, width, height, params, generator, time) {
  // Clear background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  
  // Draw wave bars
  const barWidth = (width - params.barSpacing * (params.barCount - 1)) / params.barCount;
  
  for (let i = 0; i < params.barCount; i++) {
    const x = i * (barWidth + params.barSpacing);
    const t = i / params.barCount;
    const waveY = height / 2 + Math.sin((t * params.frequency * Math.PI * 2) + time) * params.amplitude;
    
    // Calculate bar height with layering
    let barHeight = 0;
    for (let layer = 0; layer < params.layers; layer++) {
      const layerFreq = params.frequency * (layer + 1);
      const layerAmp = params.amplitude * Math.pow(params.damping, layer);
      barHeight += Math.sin((t * layerFreq * Math.PI * 2) + time) * layerAmp;
    }
    
    barHeight = Math.abs(barHeight) + 20;
    
    // Rainbow spectrum color
    const hue = (i / params.barCount) * 360;
    ctx.fillStyle = \`hsl(\${hue}, 70%, 50%)\`;
    
    // Draw bar
    ctx.fillRect(x, waveY - barHeight / 2, barWidth, barHeight);
  }
}`,
    },
  ],
  selectedLogoId: 'main',
};

export const useLogoStore = createStore<LogoStore>(
  (set, get) => ({
    // Initial state
    ...initialState,

    // Actions
    initializeLogos: (logos) => {
      set((state) => {
        state.logos = logos;
        state.selectedLogoId = logos[0]?.id || null;
      });
    },
    
    setSelectedLogoId: (id) => {
      set((state) => {
        state.selectedLogoId = id;
      });
    },
    
    addLogo: (templateId: string) => {
      const id = LogoIdManager.generateId();
      
      // Smart positioning: calculate position based on existing logos
      const existingLogos = get().logos;
      let position = { x: 100, y: 100 };
      
      if (existingLogos.length > 0) {
        // Try to place logos in a grid pattern
        const logoSize = 600;
        const spacing = 100;
        const gridSize = logoSize + spacing;
        const columns = 3;
        
        // Calculate next position in grid
        const index = existingLogos.length;
        const col = index % columns;
        const row = Math.floor(index / columns);
        
        position = {
          x: col * gridSize,
          y: row * gridSize
        };
      }
      
      const newLogo: Logo = {
        id,
        templateId,
        templateName: templateId,
        parameters: { ...defaultParameters },
        position,
        code: '',
      };
      
      // Track in localStorage
      LogoIdManager.upsertInstance({ id, position, templateId });
      
      set((state) => {
        state.logos.push(newLogo);
        state.selectedLogoId = id;
      });
      
      return id;
    },

    updateLogo: (id, updates) => {
      set((state) => {
        const logoIndex = state.logos.findIndex(logo => logo.id === id);
        if (logoIndex !== -1) {
          Object.assign(state.logos[logoIndex], updates);
        }
      });
    },

    updateLogoParameters: (id, parameters) => {
      console.log('LogoStore: Updating parameters for logo', id, parameters);
      set((state) => {
        const logo = state.logos.find(l => l.id === id);
        if (logo) {
          // Deep merge parameters
          if (parameters.core) {
            Object.assign(logo.parameters.core, parameters.core);
          }
          if (parameters.style) {
            Object.assign(logo.parameters.style, parameters.style);
          }
          if (parameters.content) {
            Object.assign(logo.parameters.content, parameters.content);
          }
          if (parameters.custom) {
            Object.assign(logo.parameters.custom, parameters.custom);
          }
        }
      });
    },

    updateLogoPosition: (id, position) => {
      // Update localStorage tracking
      const logo = get().getLogoById(id);
      if (logo) {
        LogoIdManager.upsertInstance({ id, position, templateId: logo.templateId });
      }
      
      set((state) => {
        const logo = state.logos.find(l => l.id === id);
        if (logo) {
          logo.position = position;
        }
      });
    },

    deleteLogo: (id) => {
      const state = get();
      if (state.logos.length <= 1) return; // Don't delete last logo
      
      // Remove from localStorage tracking
      LogoIdManager.removeInstance(id);
      
      set((state) => {
        const index = state.logos.findIndex(logo => logo.id === id);
        if (index !== -1) {
          state.logos.splice(index, 1);
          
          // Update selected logo if needed
          if (state.selectedLogoId === id) {
            state.selectedLogoId = state.logos[0]?.id || null;
          }
        }
      });
    },

    duplicateLogo: (id) => {
      const logoToDuplicate = get().logos.find(logo => logo.id === id);
      if (!logoToDuplicate) return null;
      
      const newId = LogoIdManager.generateId();
      const newPosition = {
        x: logoToDuplicate.position.x + 100,
        y: logoToDuplicate.position.y + 100,
      };
      
      const newLogo: Logo = {
        ...logoToDuplicate,
        id: newId,
        position: newPosition,
        // Deep clone parameters to avoid reference issues
        parameters: JSON.parse(JSON.stringify(logoToDuplicate.parameters))
      };
      
      // Track in localStorage
      LogoIdManager.upsertInstance({ 
        id: newId, 
        position: newPosition, 
        templateId: logoToDuplicate.templateId 
      });
      
      set((state) => {
        state.logos.push(newLogo);
        state.selectedLogoId = newId;
      });
      
      return newId;
    },

    selectLogo: (id) => {
      set((state) => {
        state.selectedLogoId = id;
      });
    },
    
    randomizeLogo: (id) => {
      const colorPalette = ['#0070f3', '#7c3aed', '#dc2626', '#059669', '#d97706', '#be185d', '#4338ca', '#0891b2'];
      
      const updates: Partial<Parameters> = {
        core: {
          frequency: Math.floor(Math.random() * 8) + 1,
          amplitude: Math.floor(Math.random() * 80) + 20,
          complexity: Math.random(),
          chaos: Math.random() * 0.3,
          damping: 0.5 + Math.random() * 0.5,
          layers: Math.floor(Math.random() * 5) + 1,
          radius: Math.floor(Math.random() * 100) + 50,
        },
        style: {
          fillColor: colorPalette[Math.floor(Math.random() * colorPalette.length)],
          strokeColor: colorPalette[Math.floor(Math.random() * colorPalette.length)],
          backgroundColor: 'transparent',
          backgroundType: 'transparent',
          fillType: 'solid',
          fillOpacity: 1,
          strokeType: 'solid',
          strokeWidth: 2,
          strokeOpacity: 1,
          backgroundOpacity: 1,
        },
        custom: {
          barCount: Math.floor(Math.random() * 40) + 20,
          barSpacing: Math.floor(Math.random() * 4) + 1,
        },
      };
      
      get().updateLogoParameters(id, updates);
    },
    
    clearPersistedState: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('reflow-logos');
        localStorage.removeItem('reflow-canvas-offset');
        console.log('🗑️ Cleared persisted logo state');
      }
    },

    // Computed getters
    getSelectedLogo: () => {
      const state = get();
      return state.logos.find(logo => logo.id === state.selectedLogoId) || null;
    },

    getLogoById: (id) => {
      return get().logos.find(logo => logo.id === id) || null;
    },
    
    getLogoCount: () => {
      return get().logos.length;
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
    name: 'reflow-logos',
    persist: true,
    persistOptions: {
      partialize: (state) => ({ 
        logos: state.logos,
        selectedLogoId: state.selectedLogoId 
      }),
    },
    debug: process.env.NODE_ENV === 'development',
  }
);