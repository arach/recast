'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Palette, Sparkles, Check } from 'lucide-react';
import { colorThemes, applyColorTheme, getThemesForIndustry, type ColorTheme } from '@/lib/color-themes';
import { useLogoStore } from '@/lib/stores/logoStore';
import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo';
import { useUIStore } from '@/lib/stores/uiStore';

export function ColorThemeTool() {
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);
  
  const { selectedLogoId } = useLogoStore();
  const { logo: selectedLogo, customParams, updateCustom, updateStyle } = useSelectedLogo();
  const { darkMode } = useUIStore();
  
  // Get current industry from logo metadata
  const currentIndustry = selectedLogo?.metadata?.industry;
  
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
    if (!customParams) return;
    
    const updatedParams = applyColorTheme(theme, customParams);
    
    // Add backgroundType to updated params
    const paramsWithBackgroundType = {
      ...updatedParams,
      backgroundType: updatedParams.backgroundColor && updatedParams.backgroundColor !== '#ffffff' ? 'solid' : 'transparent'
    };
    
    // Update both custom params and style params to ensure colors work everywhere
    updateCustom(paramsWithBackgroundType);
    
    // Also update style parameters for templates that read from there
    if (updateStyle) {
      updateStyle({
        fillColor: updatedParams.fillColor,
        strokeColor: updatedParams.strokeColor,
        backgroundColor: updatedParams.backgroundColor,
        backgroundType: updatedParams.backgroundColor && updatedParams.backgroundColor !== '#ffffff' ? 'solid' : 'transparent'
      });
    }
    
    setSelectedThemeId(theme.id);
  };

  // Detect current theme based on params
  useEffect(() => {
    if (!customParams) return;
    
    for (const theme of colorThemes) {
      const themedParams = applyColorTheme(theme, {});
      // Check if fillColor and strokeColor match
      const isMatch = 
        customParams.fillColor === themedParams.fillColor &&
        customParams.strokeColor === themedParams.strokeColor;
      
      if (isMatch) {
        setSelectedThemeId(theme.id);
        break;
      }
    }
  }, [customParams]);

  if (!selectedLogo) {
    return (
      <div className="text-sm text-gray-500 text-center py-8">
        No logo selected
      </div>
    );
  }

  const renderThemeGroup = (themes: ColorTheme[], title?: string) => (
    <>
      {title && themes.length > 0 && (
        <div className="text-xs font-medium text-gray-400 mb-2 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          {title}
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => handleThemeSelect(theme)}
            onMouseEnter={() => setHoveredTheme(theme.id)}
            onMouseLeave={() => setHoveredTheme(null)}
            className={`
              group relative p-2 rounded-lg border transition-all
              ${selectedThemeId === theme.id
                ? darkMode ? 'border-blue-500 bg-blue-500/10' : 'border-blue-500 bg-blue-50'
                : darkMode 
                  ? 'border-white/10 hover:border-white/20 bg-zinc-800/50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }
            `}
          >
            {/* Color swatches */}
            <div className="flex gap-1 mb-2">
              {theme.preview.slice(0, 4).map((color, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            
            {/* Theme name */}
            <div className="text-xs font-medium text-left">
              {theme.name}
            </div>
            
            {/* Selected indicator */}
            {selectedThemeId === theme.id && (
              <div className="absolute top-1 right-1">
                <Check className="w-3 h-3 text-blue-500" />
              </div>
            )}
            
            {/* Industry badges */}
            {theme.industries && theme.industries.length > 0 && (
              <div className="mt-1 flex flex-wrap gap-1">
                {theme.industries.slice(0, 2).map((industry) => (
                  <Badge 
                    key={industry}
                    variant="secondary" 
                    className="text-[9px] px-1 py-0 h-3"
                  >
                    {industry}
                  </Badge>
                ))}
              </div>
            )}
          </button>
        ))}
      </div>
    </>
  );

  return (
    <div className="space-y-4">
      {/* Recommended themes for current industry */}
      {currentIndustry && recommendedThemes.length > 0 && (
        <>
          {renderThemeGroup(recommendedThemes, `Recommended for ${currentIndustry}`)}
          
          {otherThemes.length > 0 && (
            <div className="border-t border-white/10 pt-4">
              {renderThemeGroup(otherThemes, 'Other Themes')}
            </div>
          )}
        </>
      )}
      
      {/* All themes if no industry */}
      {!currentIndustry && renderThemeGroup(displayThemes)}
    </div>
  );
}