import { useEffect, useCallback } from 'react'
import { useLogoStore } from '@/lib/stores/logoStore'
import { useSelectedLogo } from './useSelectedLogo'

interface URLParameterConfig {
  onTemplateLoad?: (templateId: string) => Promise<void>
}

export function useURLParameters(config: URLParameterConfig = {}) {
  const { selectedLogoId } = useLogoStore()
  const { logo: selectedLogo, customParams, updateCustom } = useSelectedLogo()
  
  // Parse URL parameters only on initial mount
  useEffect(() => {
    // Only run once on mount, not when selectedLogoId changes
    if (!selectedLogoId) return
    
    const urlParams = new URLSearchParams(window.location.search)
    const templateParam = urlParams.get('template')
    const textParam = urlParams.get('text')
    const letterParam = urlParams.get('letter')
    const fillColorParam = urlParams.get('fillColor')
    const strokeColorParam = urlParams.get('strokeColor')
    const backgroundColorParam = urlParams.get('backgroundColor')
    
    // Only load template if explicitly specified in URL
    if (templateParam && config.onTemplateLoad) {
      config.onTemplateLoad(templateParam).then(() => {
        // Apply URL parameters after template loads
        const updates: Record<string, any> = {}
        
        if (textParam) updates.text = textParam
        if (letterParam) updates.letter = letterParam
        if (fillColorParam) updates.fillColor = fillColorParam
        if (strokeColorParam) updates.strokeColor = strokeColorParam
        if (backgroundColorParam) updates.backgroundColor = backgroundColorParam
        
        if (Object.keys(updates).length > 0) {
          updateCustom(updates)
        }
      })
    } else {
      // Just apply non-template URL parameters
      const updates: Record<string, any> = {}
      
      if (textParam) updates.text = textParam
      if (letterParam) updates.letter = letterParam
      if (fillColorParam) updates.fillColor = fillColorParam
      if (strokeColorParam) updates.strokeColor = strokeColorParam
      if (backgroundColorParam) updates.backgroundColor = backgroundColorParam
      
      if (Object.keys(updates).length > 0) {
        updateCustom(updates)
      }
    }
  }, []) // Empty dependency array - only run once on mount
  
  // Update URL when parameters change
  const updateURL = useCallback(() => {
    if (!selectedLogo) return
    
    const params = new URLSearchParams()
    
    if (selectedLogo.templateId) {
      params.set('template', selectedLogo.templateId)
    }
    
    if (customParams?.text) params.set('text', customParams.text)
    if (customParams?.letter) params.set('letter', customParams.letter)
    
    // Only include colors if they differ from defaults
    if (customParams?.fillColor && customParams.fillColor !== '#3b82f6') {
      params.set('fillColor', customParams.fillColor)
    }
    if (customParams?.strokeColor && customParams.strokeColor !== '#1e40af') {
      params.set('strokeColor', customParams.strokeColor)
    }
    if (customParams?.backgroundColor && customParams.backgroundColor !== '#ffffff') {
      params.set('backgroundColor', customParams.backgroundColor)
    }
    
    const newURL = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`
    window.history.replaceState({}, '', newURL)
  }, [selectedLogo, customParams])
  
  // Removed automatic URL updates - now it's manual only via updateURL()
  
  return {
    updateURL
  }
}