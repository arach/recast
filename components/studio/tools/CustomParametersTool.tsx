'use client';

import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo';
import { ParameterService } from '@/lib/services/parameterService';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Code2, Settings2 } from 'lucide-react';

export function CustomParametersTool() {
  const { logo, updateCustom } = useSelectedLogo();

  if (!logo) {
    return (
      <div className="text-sm text-gray-500 text-center py-8">
        No logo selected
      </div>
    );
  }

  // Parse parameters from template code
  const parsedParams = ParameterService.parseParametersFromCode(logo.code);
  
  // Core parameter names to exclude (handled by CoreParametersTool)
  const coreParameterNames = [
    'frequency', 'amplitude', 'complexity', 'chaos', 'damping', 'layers', 'radius'
  ];
  
  // Style parameter names to exclude (handled by BrandIdentityTool)
  const styleParameterNames = [
    'fillColor', 'fillType', 'fillOpacity', 'fillGradientStart', 'fillGradientEnd',
    'strokeColor', 'strokeType', 'strokeWidth', 'strokeOpacity',
    'backgroundColor', 'backgroundType', 'backgroundOpacity',
    'backgroundGradientStart', 'backgroundGradientEnd', 'backgroundGradientDirection'
  ];
  
  // Extract template-specific params only
  const templateParams = parsedParams
    ? Object.entries(parsedParams).filter(([key]) => 
        !coreParameterNames.includes(key) && 
        !styleParameterNames.includes(key)
      )
    : [];
  
  if (templateParams.length === 0) {
    return (
      <div className="text-sm text-gray-500 text-center py-4 space-y-2">
        <Code2 className="w-8 h-8 mx-auto text-gray-400" />
        <p>No custom parameters for this template</p>
      </div>
    );
  }

  const customParams = logo.parameters.custom || {};

  return (
    <div className="space-y-4">
      {templateParams.map(([key, param]) => {
        const value = customParams[key] ?? param.default;

        return (
          <div key={key} className="space-y-2">
            <Label className="text-xs font-medium flex items-center gap-2">
              <Settings2 className="w-3 h-3" />
              {param.label || key}
            </Label>

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
            
            {/* Handle our new format with range and options */}
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
  );
}