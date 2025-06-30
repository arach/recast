'use client';

import { useEffect } from 'react';
import { useLogoStore, useUIStore, useTemplateStore } from '@/lib/stores';
import { URLService } from '@/lib/services/urlService';

interface MigrationWrapperProps {
  children: React.ReactNode;
}

/**
 * This wrapper helps us gradually migrate from the old prop-based system
 * to the new Zustand-based architecture
 */
export function MigrationWrapper({ children }: MigrationWrapperProps) {
  const loadTemplates = useTemplateStore((state) => state.loadTemplates);
  const applyTemplate = useTemplateStore((state) => state.applyTemplate);
  const selectedLogoId = useLogoStore((state) => state.selectedLogoId);
  const setDarkMode = useUIStore((state) => state.setDarkMode);
  
  // Initialize templates on mount
  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);
  
  // Handle URL parameters
  useEffect(() => {
    const urlParams = URLService.parseURLParams();
    
    if (urlParams.template && selectedLogoId) {
      // Load template from URL
      applyTemplate(selectedLogoId, urlParams.template).then(() => {
        // Apply any additional URL parameters
        if (urlParams.text || urlParams.letter || urlParams.fillColor) {
          const logoStore = useLogoStore.getState();
          logoStore.updateLogoParameters(selectedLogoId, {
            content: {
              ...(urlParams.text && { text: urlParams.text }),
              ...(urlParams.letter && { letter: urlParams.letter }),
            },
            style: {
              ...(urlParams.fillColor && { fillColor: urlParams.fillColor }),
              ...(urlParams.strokeColor && { strokeColor: urlParams.strokeColor }),
              ...(urlParams.backgroundColor && { backgroundColor: urlParams.backgroundColor }),
            },
          });
        }
      });
    }
  }, []); // Only run once on mount
  
  // Sync dark mode with system preference
  useEffect(() => {
    const checkTheme = () => {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(isDark);
    };
    
    checkTheme();
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkTheme);
    
    return () => mediaQuery.removeEventListener('change', checkTheme);
  }, [setDarkMode]);
  
  // Update URL when key parameters change
  useEffect(() => {
    const logo = useLogoStore.getState().getSelectedLogo();
    if (!logo) return;
    
    // Debounced URL update
    URLService.debouncedUpdateURL({
      templateId: logo.templateId,
      parameters: logo.parameters,
    });
  }, [
    // We'll need to subscribe to specific parameter changes
    // This is a simplified version
  ]);
  
  return <>{children}</>;
}