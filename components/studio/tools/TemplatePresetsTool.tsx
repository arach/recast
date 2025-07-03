'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Sliders, Check } from 'lucide-react';
import { getPresetsForTemplate, applyTemplatePreset, type TemplatePreset } from '@/lib/template-presets';
import { useLogoStore } from '@/lib/stores/logoStore';
import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo';

export function TemplatePresetsTool() {
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [hoveredPreset, setHoveredPreset] = useState<string | null>(null);
  
  const { selectedLogoId } = useLogoStore();
  const { logo: selectedLogo, customParams, updateCustom } = useSelectedLogo();
  
  // Get current template from selected logo
  const currentTemplate = selectedLogo?.templateId || '';
  
  // Get presets for current template
  const presets = getPresetsForTemplate(currentTemplate);
  
  const handlePresetSelect = (preset: TemplatePreset) => {
    if (!customParams) return;
    
    setSelectedPresetId(preset.id);
    const updatedParams = applyTemplatePreset(preset, customParams);
    updateCustom(updatedParams);
  };

  if (!selectedLogo) {
    return (
      <div className="text-sm text-gray-500 text-center py-8">
        No logo selected
      </div>
    );
  }
  
  // Don't show if no presets available for this template
  if (presets.length === 0) {
    return (
      <div className="text-sm text-gray-500 text-center py-8">
        No variations available for this template
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handlePresetSelect(preset)}
            onMouseEnter={() => setHoveredPreset(preset.id)}
            onMouseLeave={() => setHoveredPreset(null)}
            className={`
              group relative p-2 rounded-lg border transition-all text-left
              ${selectedPresetId === preset.id
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-white/10 hover:border-white/20 bg-zinc-800/50'
              }
            `}
          >
            {/* Preset name */}
            <div className="text-xs font-medium mb-1">
              {preset.name}
            </div>
            
            {/* Description */}
            {preset.description && (
              <div className="text-[10px] text-gray-400 line-clamp-2">
                {preset.description}
              </div>
            )}
            
            {/* Selected indicator */}
            {selectedPresetId === preset.id && (
              <div className="absolute top-2 right-2">
                <Check className="w-3 h-3 text-blue-500" />
              </div>
            )}
            
            {/* Parameter preview on hover */}
            {hoveredPreset === preset.id && (
              <div className="mt-2 pt-2 border-t border-white/10">
                <div className="space-y-1">
                  {Object.entries(preset.params).slice(0, 3).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-[9px]">
                      <span className="text-gray-500">{key}:</span>
                      <span className="text-gray-400 font-mono">
                        {typeof value === 'number' ? value.toFixed(2) : String(value)}
                      </span>
                    </div>
                  ))}
                  {Object.keys(preset.params).length > 3 && (
                    <div className="text-[9px] text-gray-500">
                      +{Object.keys(preset.params).length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
      
      {/* Template info */}
      <div className="text-[10px] text-gray-500 text-center pt-2 border-t border-white/10">
        {presets.length} variations for {selectedLogo.templateName || currentTemplate}
      </div>
    </div>
  );
}