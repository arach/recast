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
    
    console.log('[useURLParameters] Parsing URL with template:', templateParam, 'logoId:', selectedLogoId)
    
    // Only load template if explicitly specified in URL
    if (templateParam && config.onTemplateLoad) {
      console.log('[useURLParameters] Loading template:', templateParam)
      
      config.onTemplateLoad(templateParam).then(() => {
        console.log('[useURLParameters] Template loaded, applying parameters')
        
        // Apply ALL URL parameters after template loads
        const updates: Record<string, any> = {}
        
        // Iterate through all URL parameters
        urlParams.forEach((value, key) => {
          if (key === 'template') return // Skip template parameter
          
          // Try to parse numeric values
          const numValue = Number(value)
          if (!isNaN(numValue) && value !== '') {
            updates[key] = numValue
          } else if (value === 'true') {
            updates[key] = true
          } else if (value === 'false') {
            updates[key] = false
          } else {
            updates[key] = value
          }
        })
        
        console.log('[useURLParameters] Applying updates:', updates)
        
        if (Object.keys(updates).length > 0) {
          // Use a timeout to ensure template is fully loaded
          setTimeout(() => {
            updateCustom(updates)
          }, 100)
        }
      })
    } else {
      // Just apply non-template URL parameters
      const updates: Record<string, any> = {}
      
      urlParams.forEach((value, key) => {
        if (key === 'template') return
        
        const numValue = Number(value)
        if (!isNaN(numValue) && value !== '') {
          updates[key] = numValue
        } else if (value === 'true') {
          updates[key] = true
        } else if (value === 'false') {
          updates[key] = false
        } else {
          updates[key] = value
        }
      })
      
      if (Object.keys(updates).length > 0) {
        updateCustom(updates)
      }
    }
  }, [selectedLogoId]) // Run when selectedLogoId changes
  
  // Update URL when parameters change
  const updateURL = useCallback(() => {
    if (!selectedLogo) return
    
    const params = new URLSearchParams()
    
    if (selectedLogo.templateId) {
      params.set('template', selectedLogo.templateId)
    }
    
    // Add all custom parameters to URL
    if (customParams) {
      Object.entries(customParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.set(key, String(value))
        }
      })
    }
    
    const newURL = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`
    window.history.replaceState({}, '', newURL)
  }, [selectedLogo, customParams])
  
  // Removed automatic URL updates - now it's manual only via updateURL()
  
  return {
    updateURL
  }
}