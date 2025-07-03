import { useCallback } from 'react'
import { useLogoStore } from '@/lib/stores/logoStore'
import { useSelectedLogo } from './useSelectedLogo'
import { ThemeLoader } from '@/lib/services/themeLoader'
import { SavedShape, SavedLogo } from '@/lib/storage'

interface UseLogoHandlersOptions {
  onForceRender?: () => void
}

export function useLogoHandlers(options: UseLogoHandlersOptions = {}) {
  const { selectedLogoId, updateLogo, updateLogoParameters } = useLogoStore()
  const {
    logo: selectedLogo,
    customParams,
    styleParams,
    updateCore,
    updateStyle,
    updateCustom,
    updateSelectedLogoCode
  } = useSelectedLogo()
  
  // Load theme by ID
  const loadThemeById = useCallback(async (
    themeId: string,
    customDefaults?: Record<string, any>
  ) => {
    if (!selectedLogoId) return
    
    try {
      const theme = await ThemeLoader.loadThemePreservingText(
        themeId,
        customParams,
        customDefaults
      )
      
      // Update logo in store
      updateLogo(selectedLogoId, {
        code: theme.code,
        templateId: theme.id,
        templateName: theme.name,
      })
      
      // Update parameters
      updateLogoParameters(selectedLogoId, {
        custom: theme.parameters
      })
      
      options.onForceRender?.()
    } catch (error) {
      console.error('Failed to load theme:', error)
    }
  }, [selectedLogoId, customParams, updateLogo, updateLogoParameters, options])
  
  // Handle industry theme selection
  const handleIndustryThemeSelect = useCallback(async (
    themeId: string,
    industryDefaults?: Record<string, any>
  ) => {
    await loadThemeById(themeId, industryDefaults)
  }, [loadThemeById])
  
  // Handle brand personality (parameters only)
  const handleApplyBrandPersonality = useCallback((
    personalityParams: Record<string, any>
  ) => {
    if (selectedLogoId) {
      updateCustom(personalityParams)
      options.onForceRender?.()
    }
  }, [selectedLogoId, updateCustom, options])
  
  // Handle color theme application
  const handleApplyColorTheme = useCallback((
    themedParams: Record<string, any>
  ) => {
    const colorParams = ThemeLoader.filterColorParameters(themedParams)
    
    if (selectedLogoId) {
      updateStyle({
        fillColor: colorParams.fillColor || styleParams?.fillColor,
        strokeColor: colorParams.strokeColor || styleParams?.strokeColor,
        backgroundColor: colorParams.backgroundColor || styleParams?.backgroundColor,
      })
      updateCustom(colorParams)
      options.onForceRender?.()
    }
  }, [selectedLogoId, styleParams, updateStyle, updateCustom, options])
  
  // Handle template preset
  const handleApplyTemplatePreset = useCallback((
    presetParams: Record<string, any>
  ) => {
    if (selectedLogoId) {
      updateCustom(presetParams)
      options.onForceRender?.()
    }
  }, [selectedLogoId, updateCustom, options])
  
  // Handle brand preset
  const handleApplyBrandPreset = useCallback(async (
    brandPreset: any
  ) => {
    try {
      // Load base preset if different
      if (brandPreset.preset !== selectedLogo?.templateId) {
        await loadThemeById(brandPreset.preset)
      }
      
      // Filter out text parameters
      const filteredParams = ThemeLoader.filterNonTextParameters(brandPreset.params)
      
      if (selectedLogoId) {
        updateCustom(filteredParams)
        options.onForceRender?.()
      }
    } catch (error) {
      console.error('Failed to apply brand preset:', error)
    }
  }, [selectedLogoId, selectedLogo?.templateId, loadThemeById, updateCustom, options])
  
  // Handle shape loading
  const handleLoadShape = useCallback((shape: SavedShape) => {
    if (selectedLogoId) {
      updateSelectedLogoCode(shape.code)
      options.onForceRender?.()
    }
  }, [selectedLogoId, updateSelectedLogoCode, options])
  
  // Handle logo loading
  const handleLoadLogo = useCallback((logo: SavedLogo) => {
    if (selectedLogoId) {
      // Update all parameters from saved logo
      updateCore({
        frequency: logo.parameters.core.frequency,
        amplitude: logo.parameters.core.amplitude,
        complexity: logo.parameters.core.complexity,
        chaos: logo.parameters.core.chaos,
        damping: logo.parameters.core.damping,
        layers: logo.parameters.core.layers,
        radius: logo.parameters.core.radius
      })
      
      updateStyle({
        fillColor: logo.parameters.style.fillColor,
        strokeColor: logo.parameters.style.strokeColor,
        backgroundColor: logo.parameters.style.backgroundColor
      })
      
      if (logo.parameters.custom.barCount || logo.parameters.custom.barSpacing) {
        updateCustom({
          barCount: logo.parameters.custom.barCount,
          barSpacing: logo.parameters.custom.barSpacing
        })
      }
      
      options.onForceRender?.()
    }
  }, [selectedLogoId, updateCore, updateStyle, updateCustom, options])
  
  return {
    loadThemeById,
    handleIndustryThemeSelect,
    handleApplyBrandPersonality,
    handleApplyColorTheme,
    handleApplyTemplatePreset,
    handleApplyBrandPreset,
    handleLoadShape,
    handleLoadLogo
  }
}