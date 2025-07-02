import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Parameters, CoreParameters, StyleParameters, ContentParameters } from '@/lib/types';
import { useLogoStore } from './logoStore';

interface ParameterStore {
  // Actions - these update the selected logo's parameters
  updateCoreParameters: (params: Partial<CoreParameters>) => void;
  updateStyleParameters: (params: Partial<StyleParameters>) => void;
  updateContentParameters: (params: Partial<ContentParameters>) => void;
  updateCustomParameters: (params: Record<string, any>) => void;
  updateAllParameters: (params: Partial<Parameters>) => void;
  
  // Batch updates
  applyColorTheme: (colors: Partial<StyleParameters>) => void;
  applyTemplatePreset: (params: Record<string, any>) => void;
  
  // Reset
  resetToDefaults: () => void;
}

export const useParameterStore = create<ParameterStore>()(
  devtools(
    (set, get) => ({
      // Update core parameters
      updateCoreParameters: (params) => {
        const selectedLogoId = useLogoStore.getState().selectedLogoId;
        if (!selectedLogoId) return;
        
        useLogoStore.getState().updateLogoParameters(selectedLogoId, {
          core: params,
        });
      },
      
      // Update style parameters
      updateStyleParameters: (params) => {
        const selectedLogoId = useLogoStore.getState().selectedLogoId;
        if (!selectedLogoId) return;
        
        useLogoStore.getState().updateLogoParameters(selectedLogoId, {
          style: params,
        });
      },
      
      // Update content parameters
      updateContentParameters: (params) => {
        const selectedLogoId = useLogoStore.getState().selectedLogoId;
        if (!selectedLogoId) return;
        
        useLogoStore.getState().updateLogoParameters(selectedLogoId, {
          content: params,
        });
      },
      
      // Update custom parameters
      updateCustomParameters: (params) => {
        const selectedLogoId = useLogoStore.getState().selectedLogoId;
        if (!selectedLogoId) return;
        
        useLogoStore.getState().updateLogoParameters(selectedLogoId, {
          custom: params,
        });
      },
      
      // Update all parameters at once
      updateAllParameters: (params) => {
        const selectedLogoId = useLogoStore.getState().selectedLogoId;
        if (!selectedLogoId) return;
        
        useLogoStore.getState().updateLogoParameters(selectedLogoId, params);
      },
      
      // Apply color theme (preserves non-color parameters)
      applyColorTheme: (colors) => {
        const selectedLogoId = useLogoStore.getState().selectedLogoId;
        if (!selectedLogoId) return;
        
        // Only update color-related style parameters
        const colorParams: Partial<StyleParameters> = {};
        if (colors.fillColor !== undefined) colorParams.fillColor = colors.fillColor;
        if (colors.strokeColor !== undefined) colorParams.strokeColor = colors.strokeColor;
        if (colors.backgroundColor !== undefined) colorParams.backgroundColor = colors.backgroundColor;
        if (colors.fillOpacity !== undefined) colorParams.fillOpacity = colors.fillOpacity;
        if (colors.strokeOpacity !== undefined) colorParams.strokeOpacity = colors.strokeOpacity;
        
        useLogoStore.getState().updateLogoParameters(selectedLogoId, {
          style: colorParams,
        });
      },
      
      // Apply template preset (preserves content and colors)
      applyTemplatePreset: (params) => {
        const selectedLogoId = useLogoStore.getState().selectedLogoId;
        if (!selectedLogoId) return;
        
        // Filter out content and color parameters
        const filteredParams = { ...params };
        const contentKeys = ['text', 'letter', 'letters', 'brandName', 'words', 'title', 'subtitle'];
        const colorKeys = ['fillColor', 'strokeColor', 'backgroundColor'];
        
        [...contentKeys, ...colorKeys].forEach(key => {
          delete filteredParams[key];
        });
        
        useLogoStore.getState().updateLogoParameters(selectedLogoId, {
          custom: filteredParams,
        });
      },
      
      // Reset to defaults
      resetToDefaults: () => {
        const selectedLogoId = useLogoStore.getState().selectedLogoId;
        if (!selectedLogoId) return;
        
        // This would reset to template defaults
        // Implementation depends on template system
        console.log('Reset to defaults not yet implemented');
      },
    }),
    {
      name: 'parameter-store',
    }
  )
);