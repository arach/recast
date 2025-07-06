'use client'

import React, { useState, useEffect } from 'react'
import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo'
import { useLogoStore } from '@/lib/stores/logoStore'
import { useUIStore } from '@/lib/stores/uiStore'
import { getAllJSTemplates, type JSTemplateInfo } from '@/lib/js-template-registry'
import { cn } from '@/lib/utils'
import { 
  Info, 
  Hash, 
  Palette, 
  Monitor,
  Smartphone,
  Globe,
  Package,
  Maximize2,
  ChevronDown,
  ChevronUp,
  Code
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export function LogoDetailsModule() {
  const { logo: selectedLogo } = useSelectedLogo()
  const updateLogo = useLogoStore(state => state.updateLogo)
  const { darkMode } = useUIStore()
  
  const [availableTemplates, setAvailableTemplates] = useState<JSTemplateInfo[]>([])
  const [loadingTemplates, setLoadingTemplates] = useState(true)
  const [showCode, setShowCode] = useState(false)

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
      <div className={cn(
        "text-center py-6 px-4 rounded-lg",
        darkMode ? "bg-zinc-800/50 text-gray-500" : "bg-gray-100 text-gray-500"
      )}>
        <Info className="w-6 h-6 mx-auto mb-2 opacity-50" />
        <p className="text-xs">No logo selected</p>
        <p className="text-xs mt-1 opacity-70">Select a logo to view details</p>
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

  // Determine platform/destination
  const getDestination = () => {
    const platform = selectedLogo.platform || 'web'
    const icons = {
      web: <Globe className="w-3 h-3" />,
      ios: <Smartphone className="w-3 h-3" />,
      macos: <Monitor className="w-3 h-3" />,
      android: <Smartphone className="w-3 h-3" />
    }
    return {
      icon: icons[platform] || icons.web,
      label: platform.charAt(0).toUpperCase() + platform.slice(1)
    }
  }

  const destination = getDestination()

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400">
        <Info className="w-3.5 h-3.5" />
        <span>Logo Details</span>
      </div>

      {/* Template Selection - Prominent */}
      <div className={cn(
        "rounded-lg border p-3",
        darkMode 
          ? "bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-zinc-700" 
          : "bg-gradient-to-r from-blue-50 to-purple-50 border-gray-200"
      )}>
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-2">
          <Palette className="w-3 h-3" />
          Visual Style
        </label>
        <select
          value={selectedLogo?.templateId || 'custom'}
          onChange={(e) => handleTemplateChange(e.target.value)}
          className={cn(
            "w-full px-2.5 py-1.5 text-sm rounded-md border",
            darkMode
              ? "bg-zinc-800 border-zinc-700 text-gray-100"
              : "bg-white border-gray-300",
            "focus:outline-none focus:ring-1 focus:ring-blue-500"
          )}
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

      {/* Metadata Grid */}
      <div className={cn(
        "rounded-lg border p-3 space-y-2.5",
        darkMode 
          ? "bg-zinc-800/50 border-zinc-700" 
          : "bg-white border-gray-200"
      )}>
        {/* ID */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Hash className="w-3 h-3" />
            <span>ID</span>
          </div>
          <span className="font-mono text-gray-700 dark:text-gray-300">
            {selectedLogo.id}
          </span>
        </div>

        {/* Destination/Platform */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            {destination.icon}
            <span>Destination</span>
          </div>
          <span className="text-gray-700 dark:text-gray-300">
            {destination.label}
          </span>
        </div>

        {/* Format/Export */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Package className="w-3 h-3" />
            <span>Format</span>
          </div>
          <span className="text-gray-700 dark:text-gray-300">
            {selectedLogo.exportFormat || 'SVG'}
          </span>
        </div>

        {/* Size */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Maximize2 className="w-3 h-3" />
            <span>Size</span>
          </div>
          <span className="font-mono text-gray-700 dark:text-gray-300">
            {selectedLogo.parameters?.core?.size || 200}px
          </span>
        </div>

        {/* Position */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <span>Position</span>
          </div>
          <span className="font-mono text-gray-700 dark:text-gray-300">
            {Math.round(selectedLogo.position?.x || 0)}, {Math.round(selectedLogo.position?.y || 0)}
          </span>
        </div>
      </div>

      {/* Code Viewer - Collapsible */}
      <div className={cn(
        "rounded-lg border overflow-hidden",
        darkMode ? "border-zinc-700" : "border-gray-200"
      )}>
        <button
          onClick={() => setShowCode(!showCode)}
          className={cn(
            "w-full px-3 py-2 flex items-center justify-between text-xs font-medium",
            darkMode 
              ? "bg-zinc-800 hover:bg-zinc-700 text-gray-300" 
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          )}
        >
          <div className="flex items-center gap-2">
            <Code className="w-3 h-3" />
            <span>Template Code</span>
          </div>
          {showCode ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
        </button>
        
        {showCode && (
          <div className={cn(
            "p-3 text-xs font-mono overflow-x-auto",
            darkMode ? "bg-zinc-900 text-gray-300" : "bg-gray-50 text-gray-700"
          )}>
            <pre className="whitespace-pre-wrap">
              {selectedLogo.code ? 
                selectedLogo.code.slice(0, 500) + (selectedLogo.code.length > 500 ? '...' : '') : 
                '// No custom code'}
            </pre>
            {selectedLogo.code && selectedLogo.code.length > 500 && (
              <Button
                size="sm"
                variant="ghost"
                className="mt-2 h-6 text-xs"
                onClick={() => {/* Could open full code editor */}}
              >
                View full code →
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}