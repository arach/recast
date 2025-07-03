'use client'

import React from 'react'
import { AIBrandConsultant } from './AIBrandConsultant'
import { ColorThemeSelector } from './ColorThemeSelector'
import { TemplatePresetsPanel } from './TemplatePresetsPanel'
import { AISuggestions } from './AISuggestions'
import { BrandPersonality } from './BrandPersonality'
import { BrandPresetsPanel } from './BrandPresetsPanel'

interface RightPanelProps {
  currentIndustry?: string
  currentParams?: Record<string, any>
  selectedLogo?: any
  onApplyColorTheme: (params: Record<string, any>) => void
  onApplyTemplatePreset: (params: Record<string, any>) => void
  onApplyBrandPreset: (preset: any) => void
  onApplyPersonality: (params: Record<string, any>) => void
}

export function RightPanel({
  currentIndustry,
  currentParams,
  selectedLogo,
  onApplyColorTheme,
  onApplyTemplatePreset,
  onApplyBrandPreset,
  onApplyPersonality
}: RightPanelProps) {
  return (
    <div className="w-80 border-l bg-white/50 backdrop-blur-sm overflow-y-auto">
      <div className="p-4 space-y-4">
        <AIBrandConsultant
          currentParams={currentParams}
          onApplyRecommendation={onApplyColorTheme}
        />
        <ColorThemeSelector
          currentIndustry={currentIndustry}
          currentParams={currentParams}
          onApplyTheme={onApplyColorTheme}
        />
        <TemplatePresetsPanel
          currentTemplate={selectedLogo?.templateId || 'custom'}
          currentParams={currentParams}
          onApplyPreset={onApplyTemplatePreset}
        />
        <AISuggestions
          currentIndustry={currentIndustry}
          currentPreset={selectedLogo?.templateId || 'custom'}
          currentParams={currentParams}
          onApplySuggestion={onApplyColorTheme}
        />
        <BrandPersonality
          currentParams={currentParams}
          onApplyPersonality={onApplyPersonality}
        />
        <BrandPresetsPanel
          onApplyPreset={onApplyBrandPreset}
          currentParams={currentParams}
          currentPreset={selectedLogo?.templateId || 'custom'}
        />
      </div>
    </div>
  )
}