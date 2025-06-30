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
      const preset = availablePresets.find(p => p.id === presetId)
      if (!preset) return
      
      // Update the logo with the new preset
      updateLogo(logo.id, {
        templateId: preset.id,
        templateName: preset.name,
        code: preset.code,
        parameters: {
          ...logo.parameters,
          custom: preset.defaultParams || {}
        }
      })
    } catch (error) {
      console.error('Failed to apply template:', error)
    }
  }
  
  if (!logo) return null
  
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