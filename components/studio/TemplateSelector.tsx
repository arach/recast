'use client'

import React, { useEffect, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Palette, ChevronDown } from 'lucide-react'
import { useLogoStore } from '@/lib/stores/logoStore'
import { useUIStore } from '@/lib/stores/uiStore'
import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo'
import { getAllJSTemplates, loadJSTemplate, type JSTemplateInfo } from '@/lib/js-template-registry'

export function TemplateSelector() {
  const [availableTemplates, setAvailableTemplates] = useState<JSTemplateInfo[]>([])
  const { updateLogo, selectedLogoId, getLogoById } = useLogoStore()
  const { darkMode } = useUIStore()
  const { logo } = useSelectedLogo()
  
  // Load all available JS templates
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const templates = await getAllJSTemplates()
        setAvailableTemplates(templates)
      } catch (error) {
        console.error('Failed to load templates:', error)
      }
    }
    loadTemplates()
  }, [])
  
  const handleTemplateChange = async (templateId: string) => {
    // Get the logo directly from the store to ensure we have the latest selection
    const currentSelectedLogoId = useLogoStore.getState().selectedLogoId
    const currentLogo = useLogoStore.getState().getLogoById(currentSelectedLogoId)
    
    if (!currentLogo || !currentSelectedLogoId) {
      console.error('No logo selected')
      return
    }
    
    // console.log('Applying template to logo:', currentSelectedLogoId, 'Template:', templateId)
    
    try {
      if (templateId === 'custom') {
        // Reset to custom code (empty template)
        // console.log('Switching to custom code for logo:', currentSelectedLogoId)
        updateLogo(currentSelectedLogoId, {
          templateId: null, // Clear templateId to indicate custom code
          templateName: 'Custom',
          code: currentLogo.code || '// Custom code\nfunction drawVisualization(ctx, width, height, params, generator, time) {\n  // Your custom code here\n}',
          parameters: {
            ...currentLogo.parameters,
            custom: {}
          }
        })
      } else {
        // Load the selected JS template
        const template = await loadJSTemplate(templateId)
        if (!template) {
          console.error('Template not found:', templateId)
          return
        }
        
        // Get template info for the name
        const templateInfo = availableTemplates.find(t => t.id === templateId)
        
        // Update the logo with the new template
        const updatedLogo = {
          templateId: templateId,
          templateName: templateInfo?.name || templateId,
          // Don't store code - let the renderer look it up from the registry
          parameters: {
            ...currentLogo.parameters,
            custom: template.defaultParams || {}
          }
        }
        updateLogo(currentSelectedLogoId, updatedLogo)
      }
    } catch (error) {
      console.error('Failed to apply template:', error)
    }
  }
  
  if (!logo) return null
  
  // console.log('Current logo state:', { templateId: logo.templateId, templateName: logo.templateName })
  const currentTemplate = availableTemplates.find(t => t.id === logo.templateId)
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 w-[200px] justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span>{currentTemplate?.name || 'Custom Code'}</span>
          </div>
          <ChevronDown className="w-4 h-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className={`w-[200px] backdrop-blur-sm ${
        darkMode
          ? 'bg-gray-900/95 border-gray-700'
          : 'bg-white/95 border-gray-200'
      }`}>
        <DropdownMenuLabel>Templates</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleTemplateChange('custom')}>
          <div className="flex items-center gap-2">
            Custom Code
            {!logo.templateId && <Badge variant="secondary" className="text-xs ml-auto">Current</Badge>}
          </div>
        </DropdownMenuItem>
        {availableTemplates.map((template) => (
          <DropdownMenuItem 
            key={template.id} 
            onClick={() => handleTemplateChange(template.id)}
          >
            <div className="flex items-center justify-between w-full">
              <span>{template.name}</span>
              {logo.templateId === template.id && (
                <Badge variant="secondary" className="text-xs">Current</Badge>
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}