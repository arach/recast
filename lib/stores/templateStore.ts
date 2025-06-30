import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Template, Parameters } from '@/lib/types';
import { loadPresetAsLegacy, getAllPresetsAsLegacy } from '@/lib/preset-converter';
import { useLogoStore } from './logoStore';

interface TemplateStore {
  // State
  templates: Template[];
  loadingTemplates: boolean;
  currentIndustry: string | null;
  
  // Actions
  loadTemplates: () => Promise<void>;
  loadTemplate: (templateId: string) => Promise<void>;
  applyTemplate: (logoId: string, templateId: string) => Promise<void>;
  setCurrentIndustry: (industry: string | null) => void;
  
  // Getters
  getTemplate: (templateId: string) => Template | null;
  getTemplatesByCategory: (category: string) => Template[];
}

export const useTemplateStore = create<TemplateStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      templates: [],
      loadingTemplates: false,
      currentIndustry: null,
      
      // Load all templates
      loadTemplates: async () => {
        set({ loadingTemplates: true });
        
        try {
          const presets = await getAllPresetsAsLegacy();
          
          // Convert legacy presets to Template format
          const templates: Template[] = presets.map(preset => ({
            id: preset.id,
            name: preset.name,
            description: preset.description,
            category: 'general', // We'll need to add categories
            defaultParameters: {
              custom: preset.defaultParams,
            },
            parameterDefinitions: [], // Will be parsed from code
          }));
          
          set({ templates, loadingTemplates: false });
        } catch (error) {
          console.error('Failed to load templates:', error);
          set({ loadingTemplates: false });
        }
      },
      
      // Load a specific template
      loadTemplate: async (templateId: string) => {
        try {
          const preset = await loadPresetAsLegacy(templateId);
          
          if (!preset) {
            console.error('Template not found:', templateId);
            return;
          }
          
          // Update the template in our store if needed
          set((state) => {
            const existingIndex = state.templates.findIndex(t => t.id === templateId);
            if (existingIndex >= 0) {
              const updatedTemplates = [...state.templates];
              updatedTemplates[existingIndex] = {
                id: preset.id,
                name: preset.name,
                description: preset.description,
                category: 'general',
                defaultParameters: {
                  custom: preset.defaultParams,
                },
                parameterDefinitions: [],
              };
              return { templates: updatedTemplates };
            }
            return state;
          });
        } catch (error) {
          console.error('Failed to load template:', error);
        }
      },
      
      // Apply template to a logo
      applyTemplate: async (logoId: string, templateId: string) => {
        const logoStore = useLogoStore.getState();
        const logo = logoStore.getLogoById(logoId);
        if (!logo) return;
        
        try {
          const preset = await loadPresetAsLegacy(templateId);
          if (!preset) return;
          
          // Preserve content parameters
          const currentContent = logo.parameters.content;
          
          // Update logo with new template
          logoStore.updateLogo(logoId, {
            templateId: preset.id,
            templateName: preset.name,
            code: preset.code,
          });
          
          // Apply template parameters while preserving content
          logoStore.updateLogoParameters(logoId, {
            custom: preset.defaultParams,
            content: currentContent, // Preserve text/letter
          });
          
        } catch (error) {
          console.error('Failed to apply template:', error);
        }
      },
      
      // Set current industry
      setCurrentIndustry: (industry) => {
        set({ currentIndustry: industry });
      },
      
      // Get template by ID
      getTemplate: (templateId) => {
        return get().templates.find(t => t.id === templateId) || null;
      },
      
      // Get templates by category
      getTemplatesByCategory: (category) => {
        return get().templates.filter(t => t.category === category);
      },
    }),
    {
      name: 'template-store',
    }
  )
);