'use client';

import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo';
import { ParameterService } from '@/lib/services/parameterService';
import { Info, Settings2 } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function UnifiedParametersTool() {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  
  const {
    logo,
    coreParams,
    setFrequency,
    setAmplitude,
    setComplexity,
    setChaos,
    setDamping,
    setLayers,
    setRadius,
    updateCustom,
  } = useSelectedLogo();

  if (!logo || !coreParams) {
    return (
      <div className="text-sm text-gray-500 text-center py-8">
        No logo selected
      </div>
    );
  }

  // Core parameters that are always available
  const coreParameters = [
    {
      name: 'Frequency',
      key: 'frequency',
      value: coreParams.frequency,
      setter: setFrequency,
      min: 0.1,
      max: 20,
      step: 0.1,
      tooltip: 'Controls the number of wave cycles',
      isCore: true,
    },
    {
      name: 'Amplitude',
      key: 'amplitude',
      value: coreParams.amplitude,
      setter: setAmplitude,
      min: 0,
      max: 200,
      step: 1,
      tooltip: 'Controls visual intensity and movement',
      isCore: true,
    },
    {
      name: 'Complexity',
      key: 'complexity',
      value: coreParams.complexity,
      setter: setComplexity,
      min: 0,
      max: 1,
      step: 0.01,
      tooltip: 'Adds harmonics and detail',
      isCore: true,
    },
    {
      name: 'Chaos',
      key: 'chaos',
      value: coreParams.chaos,
      setter: setChaos,
      min: 0,
      max: 1,
      step: 0.01,
      tooltip: 'Adds controlled randomness',
      isCore: true,
    },
    {
      name: 'Damping',
      key: 'damping',
      value: coreParams.damping,
      setter: setDamping,
      min: 0,
      max: 1,
      step: 0.01,
      tooltip: 'Controls layer blending',
      isCore: true,
    },
    {
      name: 'Layers',
      key: 'layers',
      value: coreParams.layers,
      setter: setLayers,
      min: 1,
      max: 10,
      step: 1,
      tooltip: 'Number of overlapping elements',
      isCore: true,
    },
    {
      name: 'Radius',
      key: 'radius',
      value: coreParams.radius,
      setter: setRadius,
      min: 10,
      max: 200,
      step: 1,
      tooltip: 'Overall logo size',
      isCore: true,
    },
  ];

  // Parse template-specific parameters
  const parsedParams = ParameterService.parseParametersFromCode(logo.code);
  
  // Style parameter names to exclude (handled by BrandIdentityTool)
  const styleParameterNames = [
    'fillColor', 'fillType', 'fillOpacity', 'fillGradientStart', 'fillGradientEnd',
    'strokeColor', 'strokeType', 'strokeWidth', 'strokeOpacity',
    'backgroundColor', 'backgroundType', 'backgroundOpacity',
    'backgroundGradientStart', 'backgroundGradientEnd', 'backgroundGradientDirection'
  ];
  
  // Extract template-specific params, filtering out core and style params
  const coreParamNames = coreParameters.map(p => p.key);
  const templateParams = parsedParams
    ? Object.entries(parsedParams).filter(([key]) => 
        !coreParamNames.includes(key) && 
        !styleParameterNames.includes(key)
      )
    : [];

  const customParams = logo.parameters.custom || {};

  // Check which core parameters are actually used by this template
  const usedCoreParams = coreParameters.filter(param => {
    // Check if the parameter is referenced in the template code
    const paramRegex = new RegExp(`params\\.${param.key}\\b`, 'g');
    return paramRegex.test(logo.code);
  });

  return (
    <div className="space-y-4">
      {/* Core Parameters Section - only show if template uses them */}
      {usedCoreParams.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-1 border-b border-gray-200">
            <Settings2 className="w-3 h-3 text-gray-500" />
            <h3 className="text-xs font-medium text-gray-700">Core Parameters</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-x-3 gap-y-3">
            {usedCoreParams.map((param) => (
              <div key={param.key} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <label className="text-xs font-medium text-gray-700">
                      {param.name}
                    </label>
                    <button
                      onMouseEnter={() => setShowTooltip(param.key)}
                      onMouseLeave={() => setShowTooltip(null)}
                      className="text-gray-400 hover:text-gray-600 relative"
                    >
                      <Info className="h-3 w-3" />
                      {showTooltip === param.key && (
                        <div className="absolute left-6 top-0 z-10 w-48 p-2 text-xs bg-gray-900 text-gray-100 rounded shadow-lg">
                          {param.tooltip}
                        </div>
                      )}
                    </button>
                  </div>
                  <span className="text-xs font-mono text-gray-500">
                    {param.value.toFixed(param.step < 1 ? 2 : 0)}
                  </span>
                </div>
                
                <Slider
                  value={[param.value]}
                  onValueChange={([value]) => param.setter(value)}
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Template-Specific Parameters Section */}
      {templateParams.length > 0 && (
        <div className="space-y-3">
          {usedCoreParams.length > 0 && (
            <div className="flex items-center gap-2 pb-1 border-b border-gray-200">
              <Settings2 className="w-3 h-3 text-gray-500" />
              <h3 className="text-xs font-medium text-gray-700">Template Parameters</h3>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-x-3 gap-y-3">
            {templateParams.map(([key, param]) => {
              const value = customParams[key] ?? param.default;

              return (
                <div key={key} className="space-y-1">
                  <Label className="text-xs font-medium text-gray-700">
                    {param.label || key}
                  </Label>

                  {/* Handle old format with type field */}
                  {param.type === 'slider' && (
                    <div className="flex items-center gap-3">
                      <Slider
                        value={[value]}
                        onValueChange={([v]) => updateCustom({ [key]: v })}
                        min={param.min || param.range?.[0] || 0}
                        max={param.max || param.range?.[1] || 100}
                        step={param.step || param.range?.[2] || 1}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500 w-12 text-right">
                        {typeof value === 'number' ? value.toFixed(param.step < 1 ? 2 : 0) : value}
                      </span>
                    </div>
                  )}

                  {param.type === 'select' && (
                    <Select
                      value={String(value)}
                      onValueChange={(v) => updateCustom({ [key]: v })}
                    >
                      <SelectTrigger className="text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {param.options?.map((option: any) => (
                          <SelectItem 
                            key={typeof option === 'string' ? option : option.value} 
                            value={typeof option === 'string' ? option : option.value}
                          >
                            {typeof option === 'string' ? option : option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {param.type === 'toggle' && (
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => updateCustom({ [key]: checked })}
                    />
                  )}
                  
                  {/* Handle new format with range and options */}
                  {!param.type && param.range && (
                    <div className="flex items-center gap-3">
                      <Slider
                        value={[value]}
                        onValueChange={([v]) => updateCustom({ [key]: v })}
                        min={param.range[0]}
                        max={param.range[1]}
                        step={param.range[2]}
                        className="flex-1"
                      />
                      <span className="text-xs text-gray-500 w-12 text-right">
                        {typeof value === 'number' ? value.toFixed(param.range[2] < 1 ? 2 : 0) : value}
                      </span>
                    </div>
                  )}
                  
                  {!param.type && param.options && (
                    <Select
                      value={String(value)}
                      onValueChange={(v) => updateCustom({ [key]: v })}
                    >
                      <SelectTrigger className="text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {param.options.map((option: string) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No parameters message */}
      {usedCoreParams.length === 0 && templateParams.length === 0 && (
        <div className="text-sm text-gray-500 text-center py-4">
          This template has no adjustable parameters
        </div>
      )}

      {/* Quick presets for templates that use core params */}
      {usedCoreParams.length > 0 && (
        <div className="pt-3 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => {
                if (usedCoreParams.find(p => p.key === 'frequency')) setFrequency(2);
                if (usedCoreParams.find(p => p.key === 'amplitude')) setAmplitude(80);
                if (usedCoreParams.find(p => p.key === 'complexity')) setComplexity(0.2);
                if (usedCoreParams.find(p => p.key === 'chaos')) setChaos(0.1);
                if (usedCoreParams.find(p => p.key === 'damping')) setDamping(0.9);
                if (usedCoreParams.find(p => p.key === 'layers')) setLayers(2);
              }}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              Minimal
            </button>
            <button
              onClick={() => {
                if (usedCoreParams.find(p => p.key === 'frequency')) setFrequency(5);
                if (usedCoreParams.find(p => p.key === 'amplitude')) setAmplitude(100);
                if (usedCoreParams.find(p => p.key === 'complexity')) setComplexity(0.5);
                if (usedCoreParams.find(p => p.key === 'chaos')) setChaos(0.2);
                if (usedCoreParams.find(p => p.key === 'damping')) setDamping(0.7);
                if (usedCoreParams.find(p => p.key === 'layers')) setLayers(3);
              }}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              Balanced
            </button>
            <button
              onClick={() => {
                if (usedCoreParams.find(p => p.key === 'frequency')) setFrequency(10);
                if (usedCoreParams.find(p => p.key === 'amplitude')) setAmplitude(150);
                if (usedCoreParams.find(p => p.key === 'complexity')) setComplexity(0.8);
                if (usedCoreParams.find(p => p.key === 'chaos')) setChaos(0.3);
                if (usedCoreParams.find(p => p.key === 'damping')) setDamping(0.5);
                if (usedCoreParams.find(p => p.key === 'layers')) setLayers(5);
              }}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              Complex
            </button>
          </div>
        </div>
      )}
    </div>
  );
}