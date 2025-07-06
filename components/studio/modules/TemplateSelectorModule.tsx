'use client'

import React, { useState, useEffect } from 'react'
import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo'
import { useLogoStore } from '@/lib/stores/logoStore'
import { useUIStore } from '@/lib/stores/uiStore'
import { getAllJSTemplates, type JSTemplateInfo } from '@/lib/js-template-registry'
import { Sparkles, Layers } from 'lucide-react'

export function TemplateSelectorModule() {
  const { logo: selectedLogo } = useSelectedLogo()
  const updateLogo = useLogoStore(state => state.updateLogo)
  const { darkMode } = useUIStore()
  
  const [availableTemplates, setAvailableTemplates] = useState<JSTemplateInfo[]>([])
  const [loadingTemplates, setLoadingTemplates] = useState(true)

  // Load available templates
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoadingTemplates(true)
        const templates = await getAllJSTemplates()
        setAvailableTemplates(templates)
      } catch (error) {
        console.error('Failed to load templates:', error)
      } finally {
        setLoadingTemplates(false)
      }
    }
    loadTemplates()
  }, [])

  if (!selectedLogo) {
    return (
      <div className={`text-center py-8 px-4 rounded-lg ${
        darkMode ? 'bg-zinc-800/50 text-gray-500' : 'bg-gray-100 text-gray-500'
      }`}>
        <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No logo selected</p>
        <p className="text-xs mt-1">Select a logo from the canvas</p>
      </div>
    )
  }

  const handleTemplateChange = async (templateId: string) => {
    // Get the current selected logo ID directly from store to avoid stale closures
    const currentSelectedLogoId = useLogoStore.getState().selectedLogoId
    const currentLogo = useLogoStore.getState().logos.find(l => l.id === currentSelectedLogoId)
    
    if (templateId && currentLogo && currentSelectedLogoId) {
      const template = availableTemplates.find(t => t.id === templateId)
      if (template) {
        updateLogo(currentSelectedLogoId, {
          templateId: template.id,
          templateName: template.name,
          // Don't store code - let the renderer look it up from the registry
          parameters: {
            ...currentLogo.parameters,
            custom: {
              ...currentLogo.parameters.custom,
              ...template.defaultParams
            }
          }
        })
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* Current Template Info */}
      <div className={`p-3 rounded-lg ${
        darkMode ? 'bg-zinc-800/50 border border-zinc-700' : 'bg-gray-50 border border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Current Template</span>
          <Sparkles className="w-3 h-3 text-gray-400" />
        </div>
        <div className="font-medium text-sm">
          {selectedLogo.templateName || 'Custom Code'}
        </div>
        {selectedLogo.templateId && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            ID: {selectedLogo.templateId}
          </div>
        )}
      </div>

      {/* Template Selector */}
      <div>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
          Change Visual Style
        </label>
        <select
          value={selectedLogo?.templateId || 'custom'}
          onChange={(e) => handleTemplateChange(e.target.value)}
          className={`w-full px-3 py-2 text-sm rounded-lg border ${
            darkMode
              ? 'bg-gray-800 border-gray-700 text-gray-100'
              : 'bg-white border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          disabled={loadingTemplates}
        >
          <option value="custom">Custom Code</option>
          <optgroup label="Built-in Templates">
            {availableTemplates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      {/* Template Description */}
      {selectedLogo.templateId && (
        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {availableTemplates.find(t => t.id === selectedLogo.templateId)?.description || 
           'A unique visual style for your brand identity.'}
        </div>
      )}
    </div>
  )
}