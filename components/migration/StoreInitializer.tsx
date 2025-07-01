'use client';

import { useEffect, useRef } from 'react';
import { useLogoStore, useUIStore, useParameterStore, useTemplateStore } from '@/lib/stores';
import { Logo, Parameters } from '@/lib/types';

interface StoreInitializerProps {
  // Props from the old system
  logos: any[];
  selectedLogoId: string;
  onLogosChange?: (logos: any[]) => void;
  onSelectedLogoChange?: (id: string) => void;
  
  // UI state
  zoom?: number;
  animating?: boolean;
  controlsPanelOpen?: boolean;
  darkMode?: boolean;
}

/**
 * Bridges the old prop-based system with the new Zustand stores
 * This allows us to gradually migrate while keeping everything working
 */
export function StoreInitializer({
  logos,
  selectedLogoId,
  onLogosChange,
  onSelectedLogoChange,
  zoom = 1,
  animating = false,
  controlsPanelOpen = true,
  darkMode = false,
}: StoreInitializerProps) {
  const isInitialized = useRef(false);
  
  // Get store actions
  const initializeLogos = useLogoStore((state) => state.initializeLogos);
  const setSelectedLogoId = useLogoStore((state) => state.setSelectedLogoId);
  const addLogo = useLogoStore((state) => state.addLogo);
  const updateLogo = useLogoStore((state) => state.updateLogo);
  const deleteLogo = useLogoStore((state) => state.deleteLogo);
  
  const setZoom = useUIStore((state) => state.setZoom);
  const setAnimating = useUIStore((state) => state.setAnimating);
  const setControlsPanelOpen = useUIStore((state) => state.setControlsPanelOpen);
  const setDarkMode = useUIStore((state) => state.setDarkMode);
  
  // Initialize stores on mount
  useEffect(() => {
    if (!isInitialized.current) {
      // Convert old logo format to new type-safe format
      const typedLogos: Logo[] = logos.map(logo => ({
        id: logo.id,
        templateId: logo.presetId || logo.templateId || 'wave-bars',
        templateName: logo.presetName || logo.templateName || 'Wave Bars',
        parameters: {
          core: {
            frequency: logo.params?.frequency || 4,
            amplitude: logo.params?.amplitude || 50,
            complexity: logo.params?.complexity || 0.5,
            chaos: logo.params?.chaos || 0,
            damping: logo.params?.damping || 0,
            layers: logo.params?.layers || 3,
            radius: logo.params?.radius || 100,
          },
          style: {
            backgroundColor: logo.params?.backgroundColor || 'transparent',
            backgroundType: logo.params?.backgroundType || 'transparent',
            fillColor: logo.params?.fillColor || '#3b82f6',
            fillType: logo.params?.fillType || 'solid',
            fillOpacity: logo.params?.fillOpacity || 1,
            strokeColor: logo.params?.strokeColor || '#1e40af',
            strokeType: logo.params?.strokeType || 'solid',
            strokeWidth: logo.params?.strokeWidth || 2,
            strokeOpacity: logo.params?.strokeOpacity || 1,
          },
          content: {
            text: logo.params?.customParameters?.text || logo.params?.text || '',
            letter: logo.params?.customParameters?.letter || logo.params?.letter || '',
          },
          custom: logo.params?.customParameters || {},
        },
        position: logo.position || { x: 400, y: 300 },
        code: logo.code || '',
      }));
      
      try {
        initializeLogos(typedLogos);
        setSelectedLogoId(selectedLogoId);
        
        // Initialize UI state
        setZoom(zoom);
        setAnimating(animating);
        setControlsPanelOpen(controlsPanelOpen);
        setDarkMode(darkMode);
        
        isInitialized.current = true;
        
        console.log('🔄 StoreInitializer: Zustand stores initialized', {
          logos: typedLogos.length,
          selectedId: selectedLogoId,
          uiState: { zoom, animating, controlsPanelOpen, darkMode }
        });
      } catch (error) {
        console.error('❌ StoreInitializer error:', error);
      }
    }
  }, []); // Only run once on mount
  
  // Sync prop changes to stores (including template, code, and color updates)
  useEffect(() => {
    if (!isInitialized.current) return;
    
    // Update each logo with latest props
    logos.forEach(propLogo => {
      const storeLogos = useLogoStore.getState().logos;
      const existingLogo = storeLogos.find(l => l.id === propLogo.id);
      
      if (existingLogo) {
        // Check if template/theme has changed
        const templateChanged = 
          (propLogo.themeId && propLogo.themeId !== existingLogo.templateId) ||
          (propLogo.themeName && propLogo.themeName !== existingLogo.templateName) ||
          (propLogo.templateId && propLogo.templateId !== existingLogo.templateId) ||
          (propLogo.templateName && propLogo.templateName !== existingLogo.templateName);
        
        // Check if code has changed
        const codeChanged = propLogo.code && propLogo.code !== existingLogo.code;
        
        // Check if colors have changed
        const colorChanged = 
          propLogo.params?.fillColor !== existingLogo.parameters.style.fillColor ||
          propLogo.params?.strokeColor !== existingLogo.parameters.style.strokeColor ||
          propLogo.params?.backgroundColor !== existingLogo.parameters.style.backgroundColor ||
          propLogo.params?.customParameters?.fillColor !== existingLogo.parameters.custom.fillColor ||
          propLogo.params?.customParameters?.strokeColor !== existingLogo.parameters.custom.strokeColor ||
          propLogo.params?.customParameters?.backgroundColor !== existingLogo.parameters.custom.backgroundColor;
        
        // Check if custom parameters have changed
        const customParamsChanged = 
          JSON.stringify(propLogo.params?.customParameters || {}) !== 
          JSON.stringify(existingLogo.parameters.custom || {});
        
        if (templateChanged || codeChanged || colorChanged || customParamsChanged) {
          console.log('🔄 StoreInitializer: Syncing changes for logo', propLogo.id, {
            templateChanged,
            codeChanged,
            colorChanged,
            customParamsChanged
          });
          
          // Update the entire logo in the store
          const updatedLogo: Logo = {
            ...existingLogo,
            templateId: propLogo.themeId || propLogo.templateId || existingLogo.templateId,
            templateName: propLogo.themeName || propLogo.templateName || existingLogo.templateName,
            code: propLogo.code || existingLogo.code,
            parameters: {
              ...existingLogo.parameters,
              style: {
                ...existingLogo.parameters.style,
                fillColor: propLogo.params?.fillColor || propLogo.params?.customParameters?.fillColor || existingLogo.parameters.style.fillColor,
                strokeColor: propLogo.params?.strokeColor || propLogo.params?.customParameters?.strokeColor || existingLogo.parameters.style.strokeColor,
                backgroundColor: propLogo.params?.backgroundColor || propLogo.params?.customParameters?.backgroundColor || existingLogo.parameters.style.backgroundColor,
              },
              custom: {
                ...existingLogo.parameters.custom,
                ...propLogo.params?.customParameters,
                fillColor: propLogo.params?.customParameters?.fillColor || propLogo.params?.fillColor,
                strokeColor: propLogo.params?.customParameters?.strokeColor || propLogo.params?.strokeColor,
                backgroundColor: propLogo.params?.customParameters?.backgroundColor || propLogo.params?.backgroundColor,
              }
            }
          };
          
          useLogoStore.getState().updateLogo(propLogo.id, updatedLogo);
        }
      }
    });
  }, [logos]);
  
  useEffect(() => {
    if (!isInitialized.current) return;
    setSelectedLogoId(selectedLogoId);
  }, [selectedLogoId, setSelectedLogoId]);
  
  useEffect(() => {
    if (!isInitialized.current) return;
    setZoom(zoom);
  }, [zoom, setZoom]);
  
  useEffect(() => {
    if (!isInitialized.current) return;
    setAnimating(animating);
  }, [animating, setAnimating]);
  
  // Subscribe to store changes and propagate back to parent
  useEffect(() => {
    if (!onLogosChange) return;
    
    const unsubscribe = useLogoStore.subscribe(
      (state) => state.logos,
      (logos) => {
        // Convert back to old format for compatibility
        const oldFormatLogos = logos.map(logo => ({
          id: logo.id,
          templateId: logo.templateId,
          templateName: logo.templateName,
          presetId: logo.templateId,  // For backward compatibility
          presetName: logo.templateName,  // For backward compatibility
          params: {
            // Flatten all parameters for old format
            ...logo.parameters.core,
            ...logo.parameters.style,
            // Include color params at root level for old system
            fillColor: logo.parameters.style.fillColor,
            strokeColor: logo.parameters.style.strokeColor,
            backgroundColor: logo.parameters.style.backgroundColor,
            customParameters: {
              ...logo.parameters.custom,
              ...logo.parameters.content,
              // Also include colors in customParameters for templates
              fillColor: logo.parameters.style.fillColor,
              strokeColor: logo.parameters.style.strokeColor,
              backgroundColor: logo.parameters.style.backgroundColor,
            },
          },
          position: logo.position,
          code: logo.code,
        }));
        onLogosChange(oldFormatLogos);
      }
    );
    
    return unsubscribe;
  }, [onLogosChange]);
  
  useEffect(() => {
    if (!onSelectedLogoChange) return;
    
    const unsubscribe = useLogoStore.subscribe(
      (state) => state.selectedLogoId,
      (id) => {
        if (id) onSelectedLogoChange(id);
      }
    );
    
    return unsubscribe;
  }, [onSelectedLogoChange]);
  
  return null; // This component doesn't render anything
}