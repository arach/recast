'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo';
import { ParameterService } from '@/lib/services/parameterService';
import { Wand2, Sliders, Palette } from 'lucide-react';

// Import AI components
import { ColorThemeSelector } from './ColorThemeSelector';
import { AIBrandConsultant } from './AIBrandConsultant';
import { AISuggestions } from './AISuggestions';
import { BrandPersonality } from './BrandPersonality';
import { BrandPresetsPanel } from './BrandPresetsPanel';
import { TemplatePresetsPanel } from './TemplatePresetsPanel';

interface RightSidebarProps {
  currentIndustry?: string;
  customParameters: Record<string, any>;
  onApplyColorTheme: (themedParams: Record<string, any>) => void;
  onApplyTemplatePreset: (presetParams: Record<string, any>) => void;
  onApplyBrandPreset: (brandPreset: any) => void;
}

export function RightSidebar({
  currentIndustry,
  customParameters,
  onApplyColorTheme,
  onApplyTemplatePreset,
  onApplyBrandPreset,
}: RightSidebarProps) {
  const [activeTab, setActiveTab] = useState('controls');
  
  const {
    logo,
    coreParams,
    styleParams,
    contentParams,
    customParams,
    updateCore,
    updateStyle,
    updateContent,
    updateCustom,
    setFrequency,
    setAmplitude,
    setComplexity,
    setChaos,
    setDamping,
    setLayers,
    setRadius,
  } = useSelectedLogo();
  
  if (!logo) {
    return (
      <div className="w-96 border-l border-gray-200 bg-gray-50/30 overflow-hidden">
        <div className="p-6">
          <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-2 text-xs text-yellow-800">
            ⚠️ No logo selected
          </div>
        </div>
      </div>
    );
  }
  
  // Parse parameter definitions from code
  const parsedParams = ParameterService.parseParametersFromCode(logo.code);
  
  return (
    <div className="w-96 border-l border-gray-200 bg-white/50 backdrop-blur-sm overflow-hidden flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="w-full rounded-none border-b bg-white/80 p-0 h-12">
          <TabsTrigger value="controls" className="flex-1 rounded-none h-full data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
            <Sliders className="w-4 h-4 mr-2" />
            Controls
          </TabsTrigger>
          <TabsTrigger value="themes" className="flex-1 rounded-none h-full data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
            <Palette className="w-4 h-4 mr-2" />
            Themes
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex-1 rounded-none h-full data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
            <Wand2 className="w-4 h-4 mr-2" />
            AI Tools
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="controls" className="flex-1 m-0 overflow-y-auto">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
              {/* Core Wave Parameters */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Core Wave Parameters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium">Frequency</label>
                      <span className="text-xs text-gray-500 tabular-nums">{coreParams.frequency}</span>
                    </div>
                    <Slider
                      value={[coreParams.frequency]}
                      onValueChange={([value]) => setFrequency(value)}
                      min={1}
                      max={10}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium">Amplitude</label>
                      <span className="text-xs text-gray-500 tabular-nums">{coreParams.amplitude}</span>
                    </div>
                    <Slider
                      value={[coreParams.amplitude]}
                      onValueChange={([value]) => setAmplitude(value)}
                      min={0}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium">Complexity</label>
                      <span className="text-xs text-gray-500 tabular-nums">{coreParams.complexity.toFixed(2)}</span>
                    </div>
                    <Slider
                      value={[coreParams.complexity]}
                      onValueChange={([value]) => setComplexity(value)}
                      min={0}
                      max={1}
                      step={0.01}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium">Chaos</label>
                      <span className="text-xs text-gray-500 tabular-nums">{coreParams.chaos.toFixed(2)}</span>
                    </div>
                    <Slider
                      value={[coreParams.chaos]}
                      onValueChange={([value]) => setChaos(value)}
                      min={0}
                      max={1}
                      step={0.01}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Template-specific parameters */}
              {Object.keys(parsedParams).length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">
                      {logo.templateName || 'Template'} Parameters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(parsedParams).map(([paramName, param]) => {
                      const value = customParams?.[paramName] ?? param.default;
                      
                      return (
                        <div key={paramName} className="space-y-2">
                          {param.type === 'slider' && (
                            <>
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-medium">{param.label || paramName}</label>
                                <span className="text-xs text-gray-500 tabular-nums">{value}</span>
                              </div>
                              <Slider
                                value={[value]}
                                onValueChange={([v]) => updateCustom({ [paramName]: v })}
                                min={param.min || 0}
                                max={param.max || 100}
                                step={param.step || 1}
                                className="w-full"
                              />
                            </>
                          )}
                          
                          {param.type === 'text' && (
                            <>
                              <label className="text-xs font-medium">{param.label || paramName}</label>
                              <input
                                type="text"
                                value={customParams?.[paramName] || param.default || ''}
                                onChange={(e) => updateCustom({ [paramName]: e.target.value })}
                                className="w-full text-xs p-2 border rounded"
                                placeholder={param.placeholder}
                              />
                            </>
                          )}
                          
                          {param.type === 'select' && (
                            <>
                              <label className="text-xs font-medium">{param.label || paramName}</label>
                              <select
                                value={customParams?.[paramName] || param.default || ''}
                                onChange={(e) => updateCustom({ [paramName]: e.target.value })}
                                className="w-full text-xs p-2 border rounded bg-white"
                              >
                                {param.options?.map((opt: any) => (
                                  <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
                                    {typeof opt === 'string' ? opt : opt.label}
                                  </option>
                                ))}
                              </select>
                            </>
                          )}
                          
                          {param.type === 'toggle' && (
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-medium">{param.label || paramName}</label>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={customParams?.[paramName] || param.default || false}
                                  onChange={(e) => updateCustom({ [paramName]: e.target.checked })}
                                  className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                            </div>
                          )}
                          
                          {param.type === 'color' && (
                            <>
                              <label className="text-xs font-medium">{param.label || paramName}</label>
                              <input
                                type="color"
                                value={customParams?.[paramName] || param.default || '#000000'}
                                onChange={(e) => updateCustom({ [paramName]: e.target.value })}
                                className="w-full h-8 border rounded cursor-pointer"
                              />
                            </>
                          )}
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="themes" className="flex-1 m-0 overflow-y-auto">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              <ColorThemeSelector
                currentIndustry={currentIndustry}
                currentParams={customParameters}
                onApplyTheme={onApplyColorTheme}
              />
              <TemplatePresetsPanel
                currentTemplate={logo.templateId || 'custom'}
                currentParams={customParameters}
                onApplyPreset={onApplyTemplatePreset}
              />
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="ai" className="flex-1 m-0 overflow-y-auto">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              <AIBrandConsultant
                currentParams={customParameters}
                onApplyRecommendation={onApplyColorTheme}
              />
              <AISuggestions
                currentIndustry={currentIndustry}
                currentPreset={logo.templateId || 'custom'}
                currentParams={customParameters}
                onApplySuggestion={onApplyColorTheme}
              />
              <BrandPersonality
                currentParams={customParameters}
                onApplyPersonality={onApplyColorTheme}
              />
              <BrandPresetsPanel
                onApplyPreset={onApplyBrandPreset}
                currentParams={customParameters}
                currentPreset={logo.templateId || 'custom'}
              />
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}