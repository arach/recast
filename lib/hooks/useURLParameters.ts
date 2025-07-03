import { useEffect, useCallback } from 'react'
import { useLogoStore } from '@/lib/stores/logoStore'
import { useSelectedLogo } from './useSelectedLogo'

interface URLParameterConfig {
  onTemplateLoad?: (templateId: string) => Promise<void>
}

export function useURLParameters(config: URLParameterConfig = {}) {
  const { selectedLogoId } = useLogoStore()
  const { logo: selectedLogo, customParams, updateCustom } = useSelectedLogo()
  
  // Parse URL parameters on mount
  useEffect(() => {
    if (!selectedLogoId) return
    
    const urlParams = new URLSearchParams(window.location.search)
    const templateParam = urlParams.get('template')
    const textParam = urlParams.get('text')
    const letterParam = urlParams.get('letter')
    const fillColorParam = urlParams.get('fillColor')
    const strokeColorParam = urlParams.get('strokeColor')
    const backgroundColorParam = urlParams.get('backgroundColor')
    
    // Load template if specified
    const templateToLoad = templateParam || 'wave-bars'
    
    if (config.onTemplateLoad) {
      config.onTemplateLoad(templateToLoad).then(() => {
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
    }
  }, [selectedLogoId]) // Only run on mount when we have a logo
  
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
  
  // Debounced URL update
  useEffect(() => {
    if (!selectedLogo) return
    
    const timeoutId = setTimeout(() => {
      updateURL()
    }, 1000)
    
    return () => clearTimeout(timeoutId)
  }, [
    selectedLogo?.templateId,
    customParams?.text,
    customParams?.letter,
    customParams?.fillColor,
    customParams?.strokeColor,
    customParams?.backgroundColor,
    updateURL
  ])
  
  return {
    updateURL
  }
}