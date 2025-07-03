import { useEffect, useCallback } from 'react'
import { useUIStore } from '@/lib/stores/uiStore'
import { DevelopmentUtilities } from '@/lib/debug/developmentUtilities'

interface UsePageEffectsOptions {
  onRunCode?: () => void
  updateCore?: (params: any) => void
  updateCustom?: (params: any) => void
  loadThemeById?: (themeId: string) => Promise<void>
  forceRender?: () => void
}

export function usePageEffects(options: UsePageEffectsOptions = {}) {
  const { darkMode, setDarkMode } = useUIStore()
  
  // Initialize development utilities
  useEffect(() => {
    DevelopmentUtilities.initialize()
    
    // Initialize debug functions
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      (window as any).testThemeLoad = (themeId: string) => options.loadThemeById?.(themeId)
    }
  }, [options.loadThemeById])
  
  // Initialize brand presets
  useEffect(() => {
    if (options.updateCore && options.updateCustom && options.loadThemeById && options.forceRender) {
      import('@/lib/presets/brandPresets').then(({ BrandPresets }) => {
        BrandPresets.initializeReflowUtilities({
          updateCore: options.updateCore,
          updateCustom: options.updateCustom,
          loadTheme: options.loadThemeById,
          forceRender: options.forceRender
        })
        
        // Load 4 logos utility
        (window as any).load4Logos = () => BrandPresets.create4LogoGrid(options.forceRender)
      }).catch(err => {
        console.error('Failed to load BrandPresets:', err)
      })
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