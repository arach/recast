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
  
  // Sync prop changes to stores
  useEffect(() => {
    if (!isInitialized.current) return;
    
    const currentLogos = useLogoStore.getState().logos;
    if (logos.length !== currentLogos.length) {
      // Handle logo additions/deletions
      // This is a simplified version - in production we'd do a proper diff
      initializeLogos(logos.map(logo => ({
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
      })));
    }
  }, [logos, initializeLogos]);
  
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
            customParameters: {
              ...logo.parameters.custom,
              ...logo.parameters.content,
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