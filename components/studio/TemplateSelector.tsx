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
import { loadPresetAsLegacy, getAllPresetsAsLegacy } from '@/lib/preset-converter'
import type { LoadedPreset } from '@/lib/preset-loader'

export function TemplateSelector() {
  const [availablePresets, setAvailablePresets] = useState<LoadedPreset[]>([])
  const { updateLogo } = useLogoStore()
  const logo = useSelectedLogo()
  
  // Load all available presets
  useEffect(() => {
    const loadPresets = async () => {
      try {
        const presets = await getAllPresetsAsLegacy()
        setAvailablePresets(presets)
      } catch (error) {
        console.error('Failed to load presets:', error)
      }
    }
    loadPresets()
  }, [])
  
  const handleTemplateChange = async (presetId: string) => {
    if (!logo) return
    
    try {
      if (presetId === 'custom') {
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
        // Load the selected preset
        const preset = availablePresets.find(p => p.id === presetId)
        if (!preset) {
          console.error('Preset not found:', presetId)
          return
        }
        
        console.log('Applying preset:', preset.name, preset)
        console.log('Preset code length:', preset.code?.length)
        console.log('Preset defaultParams:', preset.defaultParams)
        
        // Update the logo with the new preset
        const updatedLogo = {
          templateId: preset.id,
          templateName: preset.name,
          code: preset.code,
          parameters: {
            ...logo.parameters,
            custom: preset.defaultParams || {}
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
  const currentTemplate = availablePresets.find(p => p.id === logo.templateId)
  
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
      <DropdownMenuContent align="start" className="w-[200px]">
        <DropdownMenuLabel>Templates</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleTemplateChange('custom')}>
          <div className="flex items-center gap-2">
            Custom Code
            {!logo.templateId && <Badge variant="secondary" className="text-xs ml-auto">Current</Badge>}
          </div>
        </DropdownMenuItem>
        {availablePresets.map((preset) => (
          <DropdownMenuItem 
            key={preset.id} 
            onClick={() => handleTemplateChange(preset.id)}
          >
            <div className="flex items-center justify-between w-full">
              <span>{preset.name}</span>
              {logo.templateId === preset.id && (
                <Badge variant="secondary" className="text-xs">Current</Badge>
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}