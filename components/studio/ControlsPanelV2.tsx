'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo';
import { ParameterService } from '@/lib/services/parameterService';

/**
 * Refactored ControlsPanel using Zustand stores
 * No more prop drilling!
 */
export function ControlsPanelV2() {
  console.log('✨ ControlsPanelV2: Using Zustand-based controls');
  
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
    console.warn('ControlsPanelV2: No logo selected');
    return (
      <div className="w-96 border-l border-gray-200 bg-gray-50/30 overflow-y-auto">
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
  
  // Debug logging
  console.log('🔍 Parsing code for params. Code length:', logo.code?.length || 0);
  console.log('📄 Code preview:', logo.code?.substring(0, 200) + '...');
  if (parsedParams) {
    console.log('📊 Parsed params:', Object.keys(parsedParams));
  } else {
    console.log('❌ No parameters found in code');
  }
  
  // Universal control names to filter out
  const universalControlNames = [
    'backgroundColor', 'backgroundType', 'backgroundGradientStart', 'backgroundGradientEnd', 'backgroundGradientDirection',
    'fillType', 'fillColor', 'fillGradientStart', 'fillGradientEnd', 'fillGradientDirection', 'fillOpacity',
    'strokeType', 'strokeColor', 'strokeWidth', 'strokeOpacity'
  ];
  
  // Get template-specific parameters
  const templateParams = parsedParams 
    ? Object.fromEntries(
        Object.entries(parsedParams).filter(([key]) => !universalControlNames.includes(key))
      )
    : {};
  
  console.log('🎯 Template params:', Object.keys(templateParams));
  console.log('📝 Current values:', { customParams, contentParams });
  
  // Filter visible parameters based on showIf conditions
  const visibleTemplateParams = ParameterService.filterVisibleParameters(
    templateParams,
    { ...customParams, ...contentParams }
  );
  
  console.log('👁️ Visible params after filtering:', Object.keys(visibleTemplateParams));
  
  return (
    <div className="w-96 border-l border-gray-200 bg-gray-50/30 overflow-y-auto">
      <div className="p-6 space-y-4">
        {/* Migration indicator */}
        <div className="bg-green-100 border border-green-300 rounded-lg p-2 text-xs text-green-800">
          🚀 Using Zustand-based Controls (V2)
        </div>
        
        {/* Brand Controls - Universal */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">
              Brand Identity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Background Section */}
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700">Background</span>
                <select
                  value={styleParams?.backgroundType || 'transparent'}
                  onChange={(e) => updateStyle({ backgroundType: e.target.value as any })}
                  className="text-xs p-1 border rounded bg-white min-w-0"
                >
                  <option value="transparent">None</option>
                  <option value="solid">Solid</option>
                  <option value="gradient">Gradient</option>
                </select>
              </div>
              {styleParams?.backgroundType !== 'transparent' && (
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={styleParams.backgroundColor}
                    onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
                    className="w-8 h-6 border border-gray-300 rounded cursor-pointer"
                  />
                </div>
              )}
            </div>
            
            {/* Fill Section */}
            <div className="bg-blue-50 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700">Fill</span>
                <div className="flex items-center gap-2">
                  <select
                    value={styleParams?.fillType || 'solid'}
                    onChange={(e) => updateStyle({ fillType: e.target.value as any })}
                    className="text-xs p-1 border rounded bg-white min-w-0"
                  >
                    <option value="none">None</option>
                    <option value="solid">Solid</option>
                    <option value="gradient">Gradient</option>
                  </select>
                  {styleParams?.fillType !== 'none' && (
                    <span className="text-xs text-gray-500">
                      {Math.round((styleParams.fillOpacity || 1) * 100)}%
                    </span>
                  )}
                </div>
              </div>
              {styleParams?.fillType !== 'none' && (
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={styleParams.fillColor}
                    onChange={(e) => updateStyle({ fillColor: e.target.value })}
                    className="w-8 h-6 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={styleParams.fillOpacity}
                    onChange={(e) => updateStyle({ fillOpacity: parseFloat(e.target.value) })}
                    className="flex-1 h-2"
                  />
                </div>
              )}
            </div>
            
            {/* Stroke Section */}
            <div className="bg-purple-50 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700">Stroke</span>
                <div className="flex items-center gap-2">
                  <select
                    value={styleParams?.strokeType || 'solid'}
                    onChange={(e) => updateStyle({ strokeType: e.target.value as any })}
                    className="text-xs p-1 border rounded bg-white min-w-0"
                  >
                    <option value="none">None</option>
                    <option value="solid">Solid</option>
                    <option value="dashed">Dashed</option>
                    <option value="dotted">Dotted</option>
                  </select>
                  {styleParams?.strokeType !== 'none' && (
                    <span className="text-xs text-gray-500">
                      {styleParams.strokeWidth}px
                    </span>
                  )}
                </div>
              </div>
              {styleParams?.strokeType !== 'none' && (
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={styleParams.strokeColor}
                    onChange={(e) => updateStyle({ strokeColor: e.target.value })}
                    className="w-8 h-6 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="range"
                    min="0.5"
                    max="10"
                    step="0.5"
                    value={styleParams.strokeWidth}
                    onChange={(e) => updateStyle({ strokeWidth: parseFloat(e.target.value) })}
                    className="flex-1 h-2"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Template-Specific Parameters */}
        {Object.keys(visibleTemplateParams).length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {logo.templateName} Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(visibleTemplateParams).map(([paramName, param]) => (
                <div key={paramName} className="flex items-center justify-between">
                  <label className="text-xs font-medium text-gray-600 flex-1">
                    {param.label || paramName}
                  </label>
                  <div className="flex items-center gap-2 min-w-0">
                    {param.type === 'text' && (
                      <input
                        type="text"
                        value={contentParams?.[paramName] || customParams?.[paramName] || param.default || ''}
                        onChange={(e) => {
                          if (['text', 'letter'].includes(paramName)) {
                            updateContent({ [paramName]: e.target.value });
                          } else {
                            updateCustom({ [paramName]: e.target.value });
                          }
                        }}
                        className="text-xs p-1 border rounded bg-white min-w-0 w-20"
                      />
                    )}
                    {param.type === 'slider' && (
                      <>
                        <input
                          type="range"
                          min={param.min || 0}
                          max={param.max || 100}
                          step={param.step || 1}
                          value={customParams?.[paramName] || param.default || 0}
                          onChange={(e) => updateCustom({ [paramName]: parseFloat(e.target.value) })}
                          className="w-20 h-2"
                        />
                        <span className="text-xs text-gray-500 w-12 text-right">
                          {customParams?.[paramName] || param.default || 0}
                        </span>
                      </>
                    )}
                    {/* Add other control types as needed */}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
        
        {/* Core Wave Parameters */}
        {(!parsedParams || Object.keys(templateParams).length === 0) && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Core Wave Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs font-medium">Frequency: {coreParams?.frequency}</label>
                <Slider
                  value={[coreParams?.frequency || 4]}
                  onValueChange={([v]) => setFrequency(v)}
                  max={20}
                  min={0.1}
                  step={0.1}
                  className="mt-1"
                />
              </div>
              
              <div>
                <label className="text-xs font-medium">Amplitude: {coreParams?.amplitude}</label>
                <Slider
                  value={[coreParams?.amplitude || 50]}
                  onValueChange={([v]) => setAmplitude(v)}
                  max={200}
                  min={0}
                  step={1}
                  className="mt-1"
                />
              </div>
              
              <div>
                <label className="text-xs font-medium">Complexity: {coreParams?.complexity?.toFixed(2)}</label>
                <Slider
                  value={[coreParams?.complexity || 0.5]}
                  onValueChange={([v]) => setComplexity(v)}
                  max={1}
                  min={0}
                  step={0.01}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        )}
        
      </div>
    </div>
  );
}