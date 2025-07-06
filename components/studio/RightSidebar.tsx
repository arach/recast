'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo';
import { ParameterService } from '@/lib/services/parameterService';
import { loadJSTemplateParameters, type JSParameterDefinition } from '@/lib/js-parameter-loader';
import { Wand2, Sliders, Palette, Code2 } from 'lucide-react';

// Import tools and AI components
import { CodeEditorTool } from './tools/CodeEditorTool';
import { BrandStyleTool } from './tools/BrandStyleTool';
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
  const [jsParameters, setJsParameters] = useState<Record<string, JSParameterDefinition> | null>(null);
  
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
  
  // Load JS template parameters if using a JS template
  React.useEffect(() => {
    if (logo.templateId) {
      loadJSTemplateParameters(logo.templateId).then(params => {
        setJsParameters(params);
      });
    } else {
      // Parse parameter definitions from code for custom templates
      const parsedParams = ParameterService.parseParametersFromCode(logo.code);
      setJsParameters(parsedParams);
    }
  }, [logo.templateId, logo.code]);
  
  const parsedParams = jsParameters || {};
  
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
            AI
          </TabsTrigger>
          <TabsTrigger value="code" className="flex-1 rounded-none h-full data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500">
            <Code2 className="w-4 h-4 mr-2" />
            Code
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="controls" className="flex-1 m-0 overflow-y-auto">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
              
              {/* Template Parameters - Show template-specific parameters first */}
              {Object.keys(parsedParams).length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">
                      Template Parameters
                    </CardTitle>
                    <p className="text-[10px] text-gray-500 mt-1">
                      Customize {logo.templateName || 'template'}-specific settings
                    </p>
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
              
              {/* Brand & Style - Universal parameters */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    Brand & Style
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BrandStyleTool />
                </CardContent>
              </Card>
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
        
        <TabsContent value="code" className="flex-1 m-0 overflow-hidden">
          <CodeEditorTool />
        </TabsContent>
      </Tabs>
    </div>
  );
}