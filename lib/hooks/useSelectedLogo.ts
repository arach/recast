/**
 * Hook for accessing and updating the currently selected logo
 */

import { useLogoStore } from '@/lib/stores/logoStore';
import { useParameterStore } from '@/lib/stores/parameterStore';
import { Logo, Parameters } from '@/lib/types';

export function useSelectedLogo() {
  const selectedLogoId = useLogoStore((state) => state.selectedLogoId);
  const logos = useLogoStore((state) => state.logos);
  const updateLogoParameters = useLogoStore((state) => state.updateLogoParameters);
  const parameterStore = useParameterStore();
  
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
    parameterStore.updateCoreParameters(params);
  };
  
  const updateStyle = (params: Partial<Parameters['style']>) => {
    parameterStore.updateStyleParameters(params);
  };
  
  const updateContent = (params: Partial<Parameters['content']>) => {
    parameterStore.updateContentParameters(params);
  };
  
  const updateCustom = (params: Record<string, any>) => {
    parameterStore.updateCustomParameters(params);
  };
  
  return {
    // Logo data
    logo: selectedLogo,
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
    
    setText: (text: string) => updateContent({ text }),
    setLetter: (letter: string) => updateContent({ letter }),
  };
}