'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo';
import { ParameterService } from '@/lib/services/parameterService';

/**
 * ControlsPanel - Now only shows template-specific controls
 * Core parameters and brand identity moved to Tools panel
 */
export function ControlsPanel() {
  
  const {
    logo,
    contentParams,
    customParams,
    updateContent,
    updateCustom,
  } = useSelectedLogo();
  
  if (!logo) {
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
  
  // Universal control names to exclude from template params
  const universalControlNames = [
    'frequency', 'amplitude', 'complexity', 'chaos', 'damping', 'layers', 'radius',
    'fillColor', 'fillType', 'fillOpacity', 'strokeColor', 'strokeType', 
    'strokeWidth', 'strokeOpacity', 'backgroundColor', 'backgroundType',
    'colorMode', 'fillGradientStart', 'fillGradientEnd',
    'strokeGradientStart', 'strokeGradientEnd',
    'backgroundGradientStart', 'backgroundGradientEnd',
    'animation', 'animationSpeed'
  ];
  
  // Extract template-specific params only (excluding universal controls)
  const templateParams = parsedParams
    ? Object.fromEntries(
        Object.entries(parsedParams).filter(([key]) => !universalControlNames.includes(key))
      )
    : {};
  
  // Filter visible parameters based on showIf conditions
  const visibleTemplateParams = ParameterService.filterVisibleParameters(
    templateParams,
    { ...customParams, ...contentParams }
  );
  
  // If no template-specific parameters, show a minimal UI
  if (Object.keys(visibleTemplateParams).length === 0) {
    return (
      <div className="w-96 border-l border-gray-200 bg-gray-50/30 overflow-y-auto">
        <div className="p-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {logo.templateName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-500">
                All controls for this template are available in the Tools panel.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-96 border-l border-gray-200 bg-gray-50/30 overflow-y-auto">
      <div className="p-6 space-y-4">
        {/* Template-Specific Parameters */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {logo.templateName} Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(visibleTemplateParams).map(([key, param]) => {
              const value = customParams?.[key] ?? contentParams?.[key] ?? param.default;
              
              return (
                <div key={key} className="space-y-1">
                  {param.type === 'slider' && (
                    <>
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-gray-700">
                          {param.label}
                        </label>
                        <span className="text-xs text-gray-500">
                          {typeof value === 'number' ? value.toFixed(param.step < 1 ? 2 : 0) : value}
                        </span>
                      </div>
                      <Slider
                        value={[value]}
                        onValueChange={([v]) => updateCustom({ [key]: v })}
                        min={param.min}
                        max={param.max}
                        step={param.step}
                        className="w-full"
                      />
                    </>
                  )}
                  
                  {param.type === 'select' && (
                    <>
                      <label className="text-xs font-medium text-gray-700">
                        {param.label}
                      </label>
                      <select
                        value={value}
                        onChange={(e) => updateCustom({ [key]: e.target.value })}
                        className="w-full text-xs p-1.5 border rounded bg-white"
                      >
                        {param.options?.map((opt) => (
                          <option 
                            key={typeof opt === 'string' ? opt : opt.value} 
                            value={typeof opt === 'string' ? opt : opt.value}
                          >
                            {typeof opt === 'string' ? opt : opt.label}
                          </option>
                        ))}
                      </select>
                    </>
                  )}
                  
                  {param.type === 'text' && (
                    <>
                      <label className="text-xs font-medium text-gray-700">
                        {param.label}
                      </label>
                      <input
                        type="text"
                        value={value || ''}
                        onChange={(e) => {
                          if (key === 'text' || key === 'letter') {
                            updateContent({ [key]: e.target.value });
                          } else {
                            updateCustom({ [key]: e.target.value });
                          }
                        }}
                        className="w-full text-xs p-1.5 border rounded"
                        placeholder={`Enter ${param.label.toLowerCase()}`}
                      />
                    </>
                  )}
                  
                  {param.type === 'toggle' && (
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => updateCustom({ [key]: e.target.checked })}
                        className="rounded border-gray-300"
                      />
                      <span className="text-xs font-medium text-gray-700">
                        {param.label}
                      </span>
                    </label>
                  )}
                  
                  {param.type === 'color' && (
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-medium text-gray-700 flex-1">
                        {param.label}
                      </label>
                      <input
                        type="color"
                        value={value}
                        onChange={(e) => updateCustom({ [key]: e.target.value })}
                        className="w-8 h-6 border border-gray-300 rounded cursor-pointer"
                      />
                      <span className="text-xs text-gray-500 font-mono">
                        {value}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}