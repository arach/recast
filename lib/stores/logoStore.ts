import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Logo, Parameters, Position } from '@/lib/types';
import { LogoIdManager } from '@/lib/utils/logoIdManager';

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
  randomizeLogo: (id: string) => void; // Randomize all parameters
  
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
  custom: {
    barCount: 40,
    barSpacing: 2
  },
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
          code: `// Default ReCast Logo
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

      // Actions
      initializeLogos: (logos) => {
        set({ logos, selectedLogoId: logos[0]?.id || null });
      },
      
      setSelectedLogoId: (id) => {
        set({ selectedLogoId: id });
      },
      
      addLogo: (templateId: string) => {
        const id = LogoIdManager.generateId();
        
        // Smart positioning: calculate position based on existing logos
        const existingLogos = get().logos;
        let position = { x: 100, y: 100 };
        
        if (existingLogos.length > 0) {
          // Try to place logos in a grid pattern
          const logoSize = 600; // Size of each logo
          const spacing = 100; // Space between logos
          const gridSize = logoSize + spacing; // Total space needed per logo
          const columns = 3; // Max columns before wrapping
          
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
          templateName: templateId, // Will be updated when template loads
          parameters: { ...defaultParameters },
          position,
          code: '',
        };
        
        // Track in localStorage
        LogoIdManager.upsertInstance({ id, position, templateId });
        
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
        // Update localStorage tracking
        const logo = get().getLogoById(id);
        if (logo) {
          LogoIdManager.upsertInstance({ id, position, templateId: logo.templateId });
        }
        
        set((state) => ({
          logos: state.logos.map((logo) =>
            logo.id === id ? { ...logo, position } : logo
          ),
        }));
      },

      deleteLogo: (id) => {
        const state = get();
        if (state.logos.length <= 1) return; // Don't delete last logo
        
        // Remove from localStorage tracking
        LogoIdManager.removeInstance(id);
        
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
        
        const newId = LogoIdManager.generateId();
        const newPosition = {
          x: logoToDuplicate.position.x + 100,
          y: logoToDuplicate.position.y + 100,
        };
        const newLogo: Logo = {
          ...logoToDuplicate,
          id: newId,
          position: newPosition,
        };
        
        // Track in localStorage
        LogoIdManager.upsertInstance({ 
          id: newId, 
          position: newPosition, 
          templateId: logoToDuplicate.templateId 
        });
        
        set((state) => ({
          logos: [...state.logos, newLogo],
          selectedLogoId: newId,
        }));
        
        return newId;
      },

      selectLogo: (id) => {
        set({ selectedLogoId: id });
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
          },
          custom: {
            barCount: Math.floor(Math.random() * 40) + 20,
            barSpacing: Math.floor(Math.random() * 4) + 1,
          },
        };
        
        get().updateLogoParameters(id, updates);
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