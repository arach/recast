'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { industryPacks, getIndustryDefaults, getIndustrySeedSuggestion, type IndustryPack } from '@/lib/industry-packs';
import { ArrowRight, Sparkles } from 'lucide-react';

interface IndustrySelectorProps {
  onSelectTheme: (themeId: string, defaultParams?: Record<string, any>, industryId?: string) => void;
  onClose?: () => void;
}

export function IndustrySelector({ onSelectTheme, onClose }: IndustrySelectorProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryPack | null>(null);
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);

  const handleThemeSelect = (themeId: string) => {
    if (!selectedIndustry) return;
    
    // Get industry-specific defaults for this theme
    const industryDefaults = getIndustryDefaults(selectedIndustry.id, themeId);
    
    // Add a suggested seed word
    const seedSuggestion = getIndustrySeedSuggestion(selectedIndustry.id);
    if (seedSuggestion) {
      industryDefaults.seed = seedSuggestion;
    }
    
    onSelectTheme(themeId, industryDefaults, selectedIndustry.id);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="border-b p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Choose Your Industry</h2>
              <p className="text-gray-600 mt-1">Get started with themes tailored to your field</p>
            </div>
            {onClose && (
              <Button variant="ghost" onClick={onClose} className="text-gray-500">
                Skip for now
              </Button>
            )}
          </div>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
          {!selectedIndustry ? (
            // Industry Grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {industryPacks.map((pack) => (
                <Card 
                  key={pack.id}
                  className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02] hover:border-blue-300"
                  onClick={() => setSelectedIndustry(pack)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">{pack.icon}</span>
                      <span className="text-lg">{pack.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">{pack.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {pack.vibe.map((trait) => (
                        <span 
                          key={trait}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // Preset Selection for Industry
            <div className="p-6">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedIndustry(null)}
                className="mb-4"
              >
                ← Back to industries
              </Button>
              
              <div className="mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <span className="text-2xl">{selectedIndustry.icon}</span>
                  {selectedIndustry.name} Presets
                </h3>
                <p className="text-gray-600 mt-1">
                  Handpicked designs that resonate with {selectedIndustry.name.toLowerCase()} brands
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedIndustry.themes.map((theme) => (
                  <Card
                    key={theme.id}
                    className={`cursor-pointer transition-all ${
                      hoveredTheme === theme.id 
                        ? 'shadow-lg scale-[1.02] border-blue-400' 
                        : 'hover:shadow-md hover:border-gray-300'
                    }`}
                    onMouseEnter={() => setHoveredTheme(theme.id)}
                    onMouseLeave={() => setHoveredTheme(null)}
                    onClick={() => handleThemeSelect(theme.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-lg">{theme.name}</h4>
                        <ArrowRight className={`w-5 h-5 transition-transform ${
                          hoveredTheme === theme.id ? 'translate-x-1' : ''
                        }`} />
                      </div>
                      <p className="text-sm text-gray-600">{theme.reason}</p>
                      
                      <div className={`mt-3 pt-3 border-t transition-opacity duration-200 ${
                        hoveredTheme === theme.id ? 'opacity-100' : 'opacity-0'
                      }`}>
                        <p className="text-xs text-blue-600 flex items-center gap-1 h-4">
                          <Sparkles className="w-3 h-3" />
                          Pre-configured with {selectedIndustry.name.toLowerCase()} aesthetics
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Color suggestions preview */}
              {selectedIndustry.colorSuggestions && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Recommended color palette:
                  </p>
                  <div className="flex gap-2">
                    {selectedIndustry.colorSuggestions.map((color) => (
                      <div
                        key={color}
                        className="w-8 h-8 rounded shadow-sm border border-gray-200"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}