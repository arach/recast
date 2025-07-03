/**
 * Hook for accessing and updating the currently selected logo
 */

import { useLogoStore } from '@/lib/stores/logoStore';
import { useUIStore } from '@/lib/stores/uiStore';
import { Logo, Parameters } from '@/lib/types';

export function useSelectedLogo() {
  const selectedLogoId = useLogoStore((state) => state.selectedLogoId);
  const logos = useLogoStore((state) => state.logos);
  const updateLogoParameters = useLogoStore((state) => state.updateLogoParameters);
  const updateLogo = useLogoStore((state) => state.updateLogo);
  
  // Get the selected logo
  const selectedLogo = logos.find((logo) => logo.id === selectedLogoId) || null;
  
  // Convenience getters for parameters
  const parameters = selectedLogo?.parameters || null;
  const coreParams = parameters?.core || null;
  const styleParams = parameters?.style || null;
  const contentParams = parameters?.content || null;
  const customParams = parameters?.custom || null;
  
  // Convenience setters that update the selected logo
  const updateCore = (params: Partial<Parameters['core']>) => {
    if (selectedLogoId) {
      updateLogoParameters(selectedLogoId, { core: params });
      // Force a re-render
      const { setRenderTrigger } = useUIStore.getState();
      setRenderTrigger(Date.now());
    }
  };
  
  const updateStyle = (params: Partial<Parameters['style']>) => {
    if (selectedLogoId) {
      console.log('useSelectedLogo: Updating style params', params);
      updateLogoParameters(selectedLogoId, { style: params });
      // Force a re-render
      const { setRenderTrigger } = useUIStore.getState();
      setRenderTrigger(Date.now());
    }
  };
  
  const updateContent = (params: Partial<Parameters['content']>) => {
    if (selectedLogoId) {
      updateLogoParameters(selectedLogoId, { content: params });
    }
  };
  
  const updateCustom = (params: Record<string, any>) => {
    if (selectedLogoId) {
      console.log('useSelectedLogo: Updating custom params', params);
      updateLogoParameters(selectedLogoId, { custom: params });
      // Force a re-render
      const { setRenderTrigger } = useUIStore.getState();
      setRenderTrigger(Date.now());
    }
  };
  
  // Update the selected logo's code
  const updateSelectedLogoCode = (code: string) => {
    // Get the current selectedLogoId directly from the store to ensure it's fresh
    const currentSelectedLogoId = useLogoStore.getState().selectedLogoId;
    if (currentSelectedLogoId) {
      updateLogo(currentSelectedLogoId, { code });
    }
  };
  
  return {
    // Logo data
    logo: selectedLogo,
    selectedLogo, // Also expose as selectedLogo for compatibility
    parameters,
    coreParams,
    styleParams,
    contentParams,
    customParams,
    
    // Update functions
    updateCore,
    updateStyle,
    updateContent,
    updateCustom,
    updateSelectedLogoCode,
    
    // Direct parameter updates
    setFrequency: (frequency: number) => updateCore({ frequency }),
    setAmplitude: (amplitude: number) => updateCore({ amplitude }),
    setComplexity: (complexity: number) => updateCore({ complexity }),
    setChaos: (chaos: number) => updateCore({ chaos }),
    setDamping: (damping: number) => updateCore({ damping }),
    setLayers: (layers: number) => updateCore({ layers }),
    setRadius: (radius: number) => updateCore({ radius }),
    
    setFillColor: (fillColor: string) => updateStyle({ fillColor }),
    setStrokeColor: (strokeColor: string) => updateStyle({ strokeColor }),
    setBackgroundColor: (backgroundColor: string) => updateStyle({ backgroundColor }),
    
    setText: (text: string) => updateCustom({ text }),
    setLetter: (letter: string) => updateCustom({ letter }),
  };
}