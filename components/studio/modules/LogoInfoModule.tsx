'use client'

import React, { useState, useEffect } from 'react'
import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo'
import { useLogoStore } from '@/lib/stores/logoStore'
import { useUIStore } from '@/lib/stores/uiStore'
import { getAllTemplateInfo } from '@/lib/template-registry-direct'
import type { LoadedTemplate } from '@/lib/template-registry-direct'
import { Palette } from 'lucide-react'

export function LogoInfoModule() {
  const { logo: selectedLogo } = useSelectedLogo()
  const updateLogo = useLogoStore(state => state.updateLogo)
  const { darkMode } = useUIStore()
  
  const [availableTemplates, setAvailableTemplates] = useState<LoadedTemplate[]>([])
  const [loadingTemplates, setLoadingTemplates] = useState(true)

  // Load available templates
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoadingTemplates(true)
        const templates = await getAllTemplateInfo()
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
      <div className={`text-center py-6 px-4 rounded-lg ${
        darkMode ? 'bg-zinc-800/50 text-gray-500' : 'bg-gray-100 text-gray-500'
      }`}>
        <Palette className="w-6 h-6 mx-auto mb-2 opacity-50" />
        <p className="text-xs">No logo selected</p>
      </div>
    )
  }

  const handleTemplateChange = async (templateId: string) => {
    const currentSelectedLogoId = useLogoStore.getState().selectedLogoId
    const currentLogo = useLogoStore.getState().logos.find(l => l.id === currentSelectedLogoId)
    
    if (templateId && currentLogo && currentSelectedLogoId) {
      const template = availableTemplates.find(t => t.id === templateId)
      if (template) {
        updateLogo(currentSelectedLogoId, {
          templateId: template.id,
          templateName: template.name,
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
    <div className="space-y-3">
      {/* Logo Identity */}
      <div className={`flex items-center justify-between text-xs ${
        darkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        <span>ID</span>
        <span className="font-mono">{selectedLogo.id}</span>
      </div>

      {/* Template Selector */}
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
          Template
        </label>
        <select
          value={selectedLogo?.templateId || 'custom'}
          onChange={(e) => handleTemplateChange(e.target.value)}
          className={`w-full px-2.5 py-1.5 text-sm rounded-md border ${
            darkMode
              ? 'bg-zinc-800 border-zinc-700 text-gray-100'
              : 'bg-white border-gray-200'
          } focus:outline-none focus:ring-1 focus:ring-blue-500`}
          disabled={loadingTemplates}
        >
          <option value="custom">Custom Code</option>
          {availableTemplates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
      </div>

      {/* Logo Metadata */}
      <div className={`text-xs space-y-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
        <div className="flex justify-between">
          <span>Position</span>
          <span className="font-mono">
            {Math.round(selectedLogo.position?.x || 0)}, {Math.round(selectedLogo.position?.y || 0)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Size</span>
          <span className="font-mono">
            {selectedLogo.parameters?.core?.size || 200}px
          </span>
        </div>
      </div>
    </div>
  )
}