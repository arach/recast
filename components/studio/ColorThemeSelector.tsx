'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Palette, Sparkles, Check } from 'lucide-react';
import { colorThemes, applyColorTheme, getThemesForIndustry, type ColorTheme } from '@/lib/color-themes';

interface ColorThemeSelectorProps {
  currentIndustry?: string;
  currentParams: Record<string, any>;
  onApplyTheme: (params: Record<string, any>) => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}

export function ColorThemeSelector({ 
  currentIndustry, 
  currentParams, 
  onApplyTheme,
  collapsed = false,
  onToggleCollapsed
}: ColorThemeSelectorProps) {
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);
  
  // Get themes based on current industry
  const displayThemes = currentIndustry 
    ? getThemesForIndustry(currentIndustry)
    : colorThemes;
  
  // Separate recommended and other themes
  const recommendedThemes = displayThemes.filter(
    theme => theme.industries?.includes(currentIndustry || '')
  );
  const otherThemes = displayThemes.filter(
    theme => !theme.industries?.includes(currentIndustry || '')
  );

  const handleThemeSelect = (theme: ColorTheme) => {
    setSelectedThemeId(theme.id);
    const themedParams = applyColorTheme(theme, currentParams);
    onApplyTheme(themedParams);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader 
        className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggleCollapsed}
      >
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Color Themes
          {selectedThemeId && (
            <Badge variant="secondary" className="ml-auto text-xs">
              {colorThemes.find(t => t.id === selectedThemeId)?.name}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      {!collapsed && (
        <CardContent className="space-y-4 pt-0">
          {/* Quick color strip preview of all themes */}
          <div className="flex gap-1 overflow-x-auto pb-2">
            {displayThemes.map((theme) => (
              <button
                key={theme.id}
                className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedThemeId === theme.id 
                    ? 'border-blue-500 scale-110' 
                    : 'border-gray-200 hover:border-gray-400'
                }`}
                onClick={() => handleThemeSelect(theme)}
                onMouseEnter={() => setHoveredTheme(theme.id)}
                onMouseLeave={() => setHoveredTheme(null)}
                title={theme.name}
              >
                <div className="grid grid-cols-2 h-full">
                  {theme.preview.slice(0, 4).map((color, i) => (
                    <div 
                      key={i} 
                      className="w-full h-full"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>

          {/* Hovered theme details */}
          {hoveredTheme && (
            <div className="text-xs bg-gray-50 rounded-lg p-3">
              <div className="font-medium">
                {colorThemes.find(t => t.id === hoveredTheme)?.name}
              </div>
              <div className="text-gray-600 mt-1">
                {colorThemes.find(t => t.id === hoveredTheme)?.description}
              </div>
            </div>
          )}

          {/* Recommended themes section */}
          {currentIndustry && recommendedThemes.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-600 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Recommended for your industry
              </div>
              <div className="grid grid-cols-2 gap-2">
                {recommendedThemes.map((theme) => (
                  <button
                    key={theme.id}
                    className={`relative group text-left p-3 rounded-lg border transition-all ${
                      selectedThemeId === theme.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleThemeSelect(theme)}
                  >
                    {/* Color preview strip */}
                    <div className="flex gap-1 mb-2">
                      {theme.preview.map((color, i) => (
                        <div
                          key={i}
                          className="h-6 flex-1 rounded"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    
                    {/* Theme name and vibe */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs font-medium">{theme.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {theme.vibe.slice(0, 2).join(' • ')}
                        </div>
                      </div>
                      {selectedThemeId === theme.id && (
                        <Check className="h-3 w-3 text-blue-600 flex-shrink-0 mt-0.5" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* All themes grid */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-600">
              {currentIndustry && recommendedThemes.length > 0 ? 'All themes' : 'Choose a theme'}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(currentIndustry && recommendedThemes.length > 0 ? otherThemes : displayThemes).map((theme) => (
                <button
                  key={theme.id}
                  className={`relative group p-2 rounded-lg border transition-all ${
                    selectedThemeId === theme.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleThemeSelect(theme)}
                >
                  {/* Compact color dots */}
                  <div className="flex justify-center gap-1 mb-1">
                    {theme.preview.slice(0, 3).map((color, i) => (
                      <div
                        key={i}
                        className="h-4 w-4 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  
                  <div className="text-xs font-medium truncate">{theme.name}</div>
                  
                  {selectedThemeId === theme.id && (
                    <Check className="absolute top-1 right-1 h-3 w-3 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Currently applied colors */}
          {selectedThemeId && (
            <div className="text-xs bg-gray-50 rounded-lg p-3 space-y-2">
              <div className="font-medium text-gray-600">Applied colors:</div>
              <div className="grid grid-cols-4 gap-2">
                <div className="text-center">
                  <div 
                    className="h-8 w-full rounded mb-1 border border-gray-200"
                    style={{ backgroundColor: currentParams.fillColor }}
                  />
                  <div className="text-xs text-gray-500">Fill</div>
                </div>
                <div className="text-center">
                  <div 
                    className="h-8 w-full rounded mb-1 border border-gray-200"
                    style={{ backgroundColor: currentParams.strokeColor }}
                  />
                  <div className="text-xs text-gray-500">Stroke</div>
                </div>
                <div className="text-center">
                  <div 
                    className="h-8 w-full rounded mb-1 border border-gray-200"
                    style={{ backgroundColor: currentParams.backgroundColor }}
                  />
                  <div className="text-xs text-gray-500">Background</div>
                </div>
                <div className="text-center">
                  <div 
                    className="h-8 w-full rounded mb-1 border border-gray-200"
                    style={{ backgroundColor: currentParams.textColor || '#000000' }}
                  />
                  <div className="text-xs text-gray-500">Text</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}