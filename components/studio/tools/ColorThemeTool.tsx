'use client';

import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { colorThemes, applyColorTheme, getThemesForIndustry, type ColorTheme } from '@/lib/color-themes';
import { useLogoStore } from '@/lib/stores/logoStore';
import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo';
import { useUIStore } from '@/lib/stores/uiStore';

export function ColorThemeTool() {
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);
  
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
        <div className="text-xs font-medium text-gray-500 mb-2">
          {title}
        </div>
      )}
      <div className="grid grid-cols-4 gap-1.5">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => handleThemeSelect(theme)}
            title={theme.name}
            className={`
              group relative p-1.5 rounded-lg border transition-all
              ${selectedThemeId === theme.id
                ? darkMode ? 'border-blue-500 bg-blue-500/10' : 'border-blue-500 bg-blue-50'
                : darkMode 
                  ? 'border-white/10 hover:border-white/20 bg-zinc-800/50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }
            `}
          >
            {/* Color swatches in 2x2 grid */}
            <div className="grid grid-cols-2 gap-0.5">
              {theme.preview.slice(0, 4).map((color, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-sm"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            
            {/* Theme name on hover */}
            <div className={`
              absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 
              bg-gray-900 text-white text-xs rounded whitespace-nowrap
              opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10
            `}>
              {theme.name}
            </div>
            
            {/* Selected indicator */}
            {selectedThemeId === theme.id && (
              <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-0.5">
                <Check className="w-2.5 h-2.5 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </>
  );

  return (
    <div className="space-y-3">
      {/* Recommended themes for current industry */}
      {currentIndustry && recommendedThemes.length > 0 && (
        <>
          {renderThemeGroup(recommendedThemes, `Recommended for ${currentIndustry}`)}
          
          {otherThemes.length > 0 && (
            <div className="border-t border-gray-200 pt-3">
              {renderThemeGroup(otherThemes, 'All Themes')}
            </div>
          )}
        </>
      )}
      
      {/* All themes if no industry */}
      {!currentIndustry && renderThemeGroup(displayThemes)}
    </div>
  );
}