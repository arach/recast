import { useEffect, useCallback } from 'react'
import { useUIStore } from '@/lib/stores/uiStore'

interface UsePageEffectsOptions {
  onRunCode?: () => void
  updateCore?: (params: any) => void
  updateCustom?: (params: any) => void
  loadThemeById?: (themeId: string) => Promise<void>
  forceRender?: () => void
}

export function usePageEffects(options: UsePageEffectsOptions = {}) {
  const { darkMode, setDarkMode } = useUIStore()
  
  // Initialize debug functions
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      (window as any).testThemeLoad = (themeId: string) => options.loadThemeById?.(themeId)
    }
  }, [options.loadThemeById])
  
  // Initialize brand presets with lazy loading to avoid circular dependencies
  useEffect(() => {
    if (options.updateCore && options.updateCustom && options.loadThemeById && options.forceRender) {
      // Store the initialization in a flag to prevent re-initialization
      let initialized = false;
      
      const initializeBrandPresets = async () => {
        if (initialized || typeof window === 'undefined') return;
        
        try {
          // Delay import to ensure webpack is ready
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Use require for more reliable loading
          const BrandPresetsModule = require('@/lib/presets/brandPresets');
          const BrandPresetsClass = BrandPresetsModule.BrandPresets;
          
          if (!BrandPresetsClass || typeof BrandPresetsClass.initializeReflowUtilities !== 'function') {
            console.warn('BrandPresets not available yet');
            return;
          }
          
          initialized = true;
          
          BrandPresetsClass.initializeReflowUtilities({
            updateCore: options.updateCore,
            updateCustom: options.updateCustom,
            loadTheme: options.loadThemeById,
            forceRender: options.forceRender
          });
          
          // Load 4 logos utility
          (window as any).load4Logos = async () => {
            try {
              await BrandPresetsClass.create4LogoGrid(options.forceRender)
            } catch (err) {
              console.error('Failed to create 4 logo grid:', err)
            }
          }
        } catch (err) {
          // Silently fail - this is optional functionality
          console.debug('BrandPresets initialization skipped:', err.message);
        }
      };
      
      // Delay initialization to avoid early execution issues
      const timeoutId = setTimeout(initializeBrandPresets, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [options.updateCore, options.updateCustom, options.loadThemeById, options.forceRender])
  
  // Theme detection
  useEffect(() => {
    const checkTheme = () => {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setDarkMode(isDark)
    }
    
    checkTheme()
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', checkTheme)
    
    return () => mediaQuery.removeEventListener('change', checkTheme)
  }, [setDarkMode])
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        options.onRunCode?.()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [options.onRunCode])
  
  return {
    darkMode
  }
}