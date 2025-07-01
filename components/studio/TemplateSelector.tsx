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
import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo'
import { loadTemplateAsLegacy, getAllTemplatesAsLegacy } from '@/lib/template-converter'
import type { LoadedTemplate } from '@/lib/template-loader'

export function TemplateSelector() {
  const [availableTemplates, setAvailableTemplates] = useState<LoadedTemplate[]>([])
  const { updateLogo } = useLogoStore()
  const { logo } = useSelectedLogo()
  
  // Load all available templates
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const templates = await getAllTemplatesAsLegacy()
        setAvailableTemplates(templates)
      } catch (error) {
        console.error('Failed to load templates:', error)
      }
    }
    loadTemplates()
  }, [])
  
  const handleTemplateChange = async (templateId: string) => {
    if (!logo) return
    
    try {
      if (templateId === 'custom') {
        // Reset to custom code (empty template)
        console.log('Switching to custom code')
        updateLogo(logo.id, {
          templateId: 'custom',
          templateName: 'Custom',
          code: logo.code || '// Custom code\nfunction drawVisualization(ctx, width, height, params, generator, time) {\n  // Your custom code here\n}',
          parameters: {
            ...logo.parameters,
            custom: {}
          }
        })
      } else {
        // Load the selected template
        const template = availableTemplates.find(t => t.id === templateId)
        if (!template) {
          console.error('Template not found:', templateId)
          return
        }
        
        console.log('Applying template:', template.name, template)
        console.log('Template code length:', template.code?.length)
        console.log('Template defaultParams:', template.defaultParams)
        
        // Update the logo with the new template
        const updatedLogo = {
          templateId: template.id,
          templateName: template.name,
          code: template.code,
          parameters: {
            ...logo.parameters,
            custom: template.defaultParams || {}
          }
        }
        console.log('Updating logo with:', updatedLogo)
        updateLogo(logo.id, updatedLogo)
      }
    } catch (error) {
      console.error('Failed to apply template:', error)
    }
  }
  
  if (!logo) return null
  
  console.log('Current logo state:', { templateId: logo.templateId, templateName: logo.templateName })
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
      <DropdownMenuContent align="start" className="w-[200px] bg-white/95 backdrop-blur-sm border-gray-200">
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