'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sliders, Check } from 'lucide-react';
import { getPresetsForTemplate, applyTemplatePreset, type TemplatePreset } from '@/lib/template-presets';

interface TemplatePresetsPanelProps {
  currentTemplate: string;
  currentParams: Record<string, any>;
  onApplyPreset: (params: Record<string, any>) => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}

export function TemplatePresetsPanel({
  currentTemplate,
  currentParams,
  onApplyPreset,
  collapsed = false,
  onToggleCollapsed
}: TemplatePresetsPanelProps) {
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [hoveredPreset, setHoveredPreset] = useState<string | null>(null);
  
  // Get presets for current template
  const presets = getPresetsForTemplate(currentTemplate);
  
  // Don't show if no presets available for this template
  if (presets.length === 0) {
    return null;
  }
  
  const handlePresetSelect = (preset: TemplatePreset) => {
    setSelectedPresetId(preset.id);
    const updatedParams = applyTemplatePreset(preset, currentParams);
    onApplyPreset(updatedParams);
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader 
        className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggleCollapsed}
      >
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4" />
            Style Presets
          </div>
          {collapsed && (
            <span className="text-xs text-gray-500">
              {presets.length} styles
            </span>
          )}
        </CardTitle>
      </CardHeader>
      
      {!collapsed && (
        <CardContent className="space-y-3">
          <p className="text-xs text-gray-600">
            Pre-configured parameter combinations for this template
          </p>
          
          <div className="space-y-2">
            {presets.map((preset) => (
              <div
                key={preset.id}
                className={`
                  p-3 rounded-lg border-2 cursor-pointer transition-all
                  ${selectedPresetId === preset.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
                onClick={() => handlePresetSelect(preset)}
                onMouseEnter={() => setHoveredPreset(preset.id)}
                onMouseLeave={() => setHoveredPreset(null)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      {preset.name}
                      {selectedPresetId === preset.id && (
                        <Check className="h-3 w-3 text-blue-600" />
                      )}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {preset.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {preset.tags.map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="secondary" 
                          className="text-xs py-0 px-1.5"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Show parameter preview on hover */}
                {hoveredPreset === preset.id && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <div className="text-xs text-gray-500 space-y-0.5">
                      {Object.entries(preset.params).slice(0, 3).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span>{key}:</span>
                          <span className="font-mono">{String(value)}</span>
                        </div>
                      ))}
                      {Object.keys(preset.params).length > 3 && (
                        <div className="text-center">
                          ...and {Object.keys(preset.params).length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}