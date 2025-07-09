'use client';

import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo';
import { ParameterService } from '@/lib/services/parameterService';
import { loadJSTemplateParameters, type JSParameterDefinition } from '@/lib/js-parameter-loader';
import { Info, Settings2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function UnifiedParametersTool() {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [jsParameters, setJsParameters] = useState<Record<string, JSParameterDefinition> | null>(null);
  
  const {
    logo,
    coreParams,
    customParams,
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

  // Load JS template parameters if using a JS template
  useEffect(() => {
    if (logo.templateId) {
      console.log('Loading parameters for template:', logo.templateId);
      loadJSTemplateParameters(logo.templateId).then(params => {
        console.log('Loaded parameters:', params);
        setJsParameters(params);
      }).catch(error => {
        console.error('Error loading parameters:', error);
      });
    } else {
      setJsParameters(null);
    }
  }, [logo.templateId]);

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

  // Use loaded JS parameters if available, otherwise parse from code
  const templateSpecificParams = jsParameters || {};
  
  // Style parameter names to exclude (handled by BrandIdentityTool)
  const styleParameterNames = [
    'fillColor', 'fillType', 'fillOpacity', 'fillGradientStart', 'fillGradientEnd',
    'strokeColor', 'strokeType', 'strokeWidth', 'strokeOpacity',
    'backgroundColor', 'backgroundType', 'backgroundOpacity',
    'backgroundGradientStart', 'backgroundGradientEnd', 'backgroundGradientDirection'
  ];
  
  // Extract template-specific params, filtering out style params
  const templateParams = Object.entries(templateSpecificParams).filter(([key]) => 
    !styleParameterNames.includes(key)
  );
  
  // Group parameters by their group property
  const groupedParams = templateParams.reduce((acc, [key, param]) => {
    const paramObj = param as any;
    
    // Safely extract group name, ensuring it's always a string
    let group = 'default';
    if (paramObj.group) {
      if (typeof paramObj.group === 'string') {
        group = paramObj.group;
      } else if (typeof paramObj.group === 'object' && paramObj.group.group) {
        group = String(paramObj.group.group);
      } else {
        group = 'default';
      }
    }
    
    if (!acc[group]) acc[group] = [];
    acc[group].push([key, param]);
    return acc;
  }, {} as Record<string, Array<[string, JSParameterDefinition]>>);

  // Check which core parameters are actually used by this template
  const usedCoreParams = coreParameters.filter(param => {
    // Check if the parameter is referenced in the template code
    const paramRegex = new RegExp(`params\\.${param.key}\\b`, 'g');
    return paramRegex.test(logo.code);
  });

  return (
    <div className="space-y-4">
      {/* Template Parameters Section */}
      {templateParams.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-1 border-b border-gray-200">
            <Settings2 className="w-3 h-3 text-gray-500" />
            <h3 className="text-xs font-medium text-gray-700">Template Parameters</h3>
          </div>
          
          {/* Render grouped parameters */}
          {Object.entries(groupedParams).map(([groupName, params]) => {
            // Ensure groupName is always a string
            const safeGroupName = String(groupName);
            
            // Special handling for specific groups
            if (safeGroupName === 'Platform Size') {
              return (
                <div key={groupName} className="space-y-1 pt-2">
                  <div className="flex items-center gap-3">
                    {params.map(([key, param]) => {
                      const value = customParams[key] ?? param.default ?? 0;
                      return (
                        <div key={key} className="flex-1 space-y-1">
                          <Label className="text-xs text-gray-600">
                            {param.label || key}
                          </Label>
                          <div className="flex items-center gap-2">
                            <Slider
                              value={[typeof value === 'number' ? value : 0]}
                              onValueChange={([v]) => updateCustom({ [key]: v })}
                              min={param.min || 0}
                              max={param.max || 100}
                              step={param.step || 1}
                              className="flex-1"
                            />
                            <input
                              type="number"
                              value={typeof value === 'number' ? value : 0}
                              onChange={(e) => {
                                const v = parseFloat(e.target.value);
                                if (!isNaN(v)) {
                                  updateCustom({ [key]: Math.max(param.min || 0, Math.min(param.max || 100, v)) });
                                }
                              }}
                              min={param.min || 0}
                              max={param.max || 100}
                              step={param.step || 1}
                              className="w-14 px-2 py-1.5 text-xs text-center border border-gray-200 rounded"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }
            
            // Special handling for Face & Text Orientation group
            if (safeGroupName === 'Face & Text Orientation') {
              return (
                <div key={groupName} className="space-y-2">
                  <div className="flex items-center gap-2 pt-2 pb-1">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <div className="text-xs font-medium text-gray-500">{safeGroupName}</div>
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>
                  <div className="space-y-3">
                    {params.map(([key, param]) => {
                      const value = customParams[key] ?? param.default ?? 0;
                      
                      // Render selects side by side
                      if (param.type === 'select' && (key === 'wordmarkFace' || key === 'textOrientation')) {
                        return null; // Will render these together below
                      }
                      
                      // Render corner radius normally
                      return (
                        <div key={key} className="space-y-1">
                          <Label className="text-xs font-medium text-gray-700">
                            {param.label || key}
                          </Label>
                          <div className="flex items-center gap-2">
                            <Slider
                              value={[typeof value === 'number' ? value : 0]}
                              onValueChange={([v]) => updateCustom({ [key]: v })}
                              min={param.min || 0}
                              max={param.max || 100}
                              step={param.step || 1}
                              className="flex-1"
                            />
                            <input
                              type="number"
                              value={typeof value === 'number' ? value : 0}
                              onChange={(e) => {
                                const v = parseFloat(e.target.value);
                                if (!isNaN(v)) {
                                  const min = param.min || 0;
                                  const max = param.max || 100;
                                  updateCustom({ [key]: Math.max(min, Math.min(max, v)) });
                                }
                              }}
                              min={param.min || 0}
                              max={param.max || 100}
                              step={param.step || 1}
                              className="w-14 px-2 py-1.5 text-xs text-center border border-gray-200 rounded"
                            />
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Render the two selects side by side */}
                    <div className="grid grid-cols-2 gap-3">
                      {params.filter(([key, param]) => 
                        param.type === 'select' && (key === 'wordmarkFace' || key === 'textOrientation')
                      ).map(([key, param]) => {
                        const value = customParams[key] ?? param.default ?? '';
                        return (
                          <div key={key} className="space-y-1">
                            <Label className="text-xs font-medium text-gray-700">
                              {param.label || key}
                            </Label>
                            <Select
                              value={String(value)}
                              onValueChange={(v) => updateCustom({ [key]: v })}
                            >
                              <SelectTrigger className="text-xs h-8">
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
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }
            
            // Regular groups - render in 2-column grid
            return (
              <div key={groupName} className="space-y-2">
                {safeGroupName !== 'default' && (
                  <div className="flex items-center gap-2 pt-2 pb-1">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <div className="text-xs font-medium text-gray-500">{safeGroupName}</div>
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-x-3 gap-y-3">
                  {params.map(([key, param]) => {
                    const value = customParams[key] ?? param.default ?? 0;

              return (
                <div key={key} className="space-y-1">
                  <Label className="text-xs font-medium text-gray-700">
                    {param.label || key}
                  </Label>

                  {/* Handle old format with type field */}
                  {param.type === 'slider' && (
                    <div className="flex items-center gap-2">
                      <Slider
                        value={[typeof value === 'number' ? value : 0]}
                        onValueChange={([v]) => updateCustom({ [key]: v })}
                        min={param.min || param.range?.[0] || 0}
                        max={param.max || param.range?.[1] || 100}
                        step={param.step || param.range?.[2] || 1}
                        className="flex-1"
                      />
                      <input
                        type="number"
                        value={typeof value === 'number' ? value : 0}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value);
                          if (!isNaN(v)) {
                            const min = param.min || param.range?.[0] || 0;
                            const max = param.max || param.range?.[1] || 100;
                            updateCustom({ [key]: Math.max(min, Math.min(max, v)) });
                          }
                        }}
                        min={param.min || param.range?.[0] || 0}
                        max={param.max || param.range?.[1] || 100}
                        step={param.step || param.range?.[2] || 1}
                        className="w-14 px-2 py-1.5 text-xs text-center border border-gray-200 rounded"
                      />
                    </div>
                  )}

                  {param.type === 'select' && (
                    <Select
                      value={String(value || '')}
                      onValueChange={(v) => updateCustom({ [key]: v })}
                    >
                      <SelectTrigger className="text-xs h-8">
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
                      checked={Boolean(value)}
                      onCheckedChange={(checked) => updateCustom({ [key]: checked })}
                    />
                  )}

                  {param.type === 'text' && (
                    <input
                      type="text"
                      value={String(value || '')}
                      onChange={(e) => updateCustom({ [key]: e.target.value })}
                      placeholder={param.placeholder}
                      className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  )}

                  {param.type === 'color' && (
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={String(value || '#000000')}
                        onChange={(e) => updateCustom({ [key]: e.target.value })}
                        className="w-8 h-8 rounded border border-gray-200 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={String(value || '#000000')}
                        onChange={(e) => updateCustom({ [key]: e.target.value })}
                        className="flex-1 px-2 py-1.5 text-xs font-mono border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  )}
                  
                  {/* Handle new format with range and options */}
                  {!param.type && param.range && (
                    <div className="flex items-center gap-2">
                      <Slider
                        value={[typeof value === 'number' ? value : param.range[0] || 0]}
                        onValueChange={([v]) => updateCustom({ [key]: v })}
                        min={param.range[0]}
                        max={param.range[1]}
                        step={param.range[2]}
                        className="flex-1"
                      />
                      <input
                        type="number"
                        value={typeof value === 'number' ? value : param.range[0] || 0}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value);
                          if (!isNaN(v)) {
                            updateCustom({ [key]: Math.max(param.range[0], Math.min(param.range[1], v)) });
                          }
                        }}
                        min={param.range[0]}
                        max={param.range[1]}
                        step={param.range[2]}
                        className="w-14 px-2 py-1.5 text-xs text-center border border-gray-200 rounded"
                      />
                    </div>
                  )}
                  
                  {!param.type && param.options && (
                    <Select
                      value={String(value || '')}
                      onValueChange={(v) => updateCustom({ [key]: v })}
                    >
                      <SelectTrigger className="text-xs h-8">
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
            );
          })}
        </div>
      )}

      {/* No parameters message */}
      {templateParams.length === 0 && logo.templateId && (
        <div className="text-sm text-gray-500 text-center py-4">
          {jsParameters === null ? 'Loading template parameters...' : 'No template-specific parameters'}
        </div>
      )}
    </div>
  );
}