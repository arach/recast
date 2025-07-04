'use client';

import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Code2, Settings2 } from 'lucide-react';

// Template-specific parameter definitions
const templateParameters: Record<string, Array<{
  key: string;
  label: string;
  type: 'slider' | 'select' | 'toggle';
  min?: number;
  max?: number;
  step?: number;
  options?: Array<{ value: string; label: string }>;
  default?: any;
}>> = {
  'wave-bars': [
    { key: 'barCount', label: 'Bar Count', type: 'slider', min: 10, max: 200, step: 5, default: 60 },
    { key: 'barSpacing', label: 'Bar Spacing', type: 'slider', min: 0, max: 10, step: 0.5, default: 2 },
    { key: 'waveType', label: 'Wave Type', type: 'select', options: [
      { value: 'sine', label: 'Sine' },
      { value: 'square', label: 'Square' },
      { value: 'triangle', label: 'Triangle' },
      { value: 'sawtooth', label: 'Sawtooth' }
    ], default: 'sine' }
  ],
  'audio-bars': [
    { key: 'barCount', label: 'Bar Count', type: 'slider', min: 10, max: 100, step: 5, default: 32 },
    { key: 'barWidth', label: 'Bar Width', type: 'slider', min: 0.1, max: 1, step: 0.1, default: 0.8 },
    { key: 'rounded', label: 'Rounded Bars', type: 'toggle', default: true }
  ],
  'pulse-spotify': [
    { key: 'pulseSpeed', label: 'Pulse Speed', type: 'slider', min: 0.1, max: 2, step: 0.1, default: 0.5 },
    { key: 'pulseIntensity', label: 'Pulse Intensity', type: 'slider', min: 0.1, max: 2, step: 0.1, default: 1 },
    { key: 'circles', label: 'Circle Count', type: 'slider', min: 1, max: 10, step: 1, default: 3 }
  ],
  'spinning-triangles': [
    { key: 'triangleCount', label: 'Triangle Count', type: 'slider', min: 1, max: 20, step: 1, default: 6 },
    { key: 'spinSpeed', label: 'Spin Speed', type: 'slider', min: 0, max: 2, step: 0.1, default: 0.5 },
    { key: 'triangleSize', label: 'Triangle Size', type: 'slider', min: 0.1, max: 1, step: 0.05, default: 0.3 }
  ],
  'clean-triangle': [
    { key: 'triangleType', label: 'Triangle Type', type: 'select', options: [
      { value: '0', label: 'Equilateral' },
      { value: '1', label: 'Isosceles' },
      { value: '2', label: 'Scalene' }
    ], default: '1' },
    { key: 'cornerRadius', label: 'Corner Radius', type: 'slider', min: 0, max: 50, step: 1, default: 5 }
  ],
  'golden-circle': [
    { key: 'innerRadius', label: 'Inner Radius', type: 'slider', min: 0, max: 0.8, step: 0.05, default: 0.3 },
    { key: 'segments', label: 'Segments', type: 'slider', min: 3, max: 24, step: 1, default: 8 },
    { key: 'rotation', label: 'Rotation', type: 'slider', min: 0, max: 360, step: 15, default: 0 }
  ]
};

export function CustomParametersTool() {
  const { logo, updateCustom } = useSelectedLogo();

  if (!logo) {
    return (
      <div className="text-sm text-gray-500 text-center py-8">
        No logo selected
      </div>
    );
  }

  const templateParams = templateParameters[logo.templateId] || [];
  
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
      {templateParams.map(param => {
        const value = customParams[param.key] ?? param.default;

        return (
          <div key={param.key} className="space-y-2">
            <Label className="text-xs font-medium flex items-center gap-2">
              <Settings2 className="w-3 h-3" />
              {param.label}
            </Label>

            {param.type === 'slider' && (
              <div className="flex items-center gap-3">
                <Slider
                  value={[value]}
                  onValueChange={([v]) => updateCustom({ [param.key]: v })}
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  className="flex-1"
                />
                <span className="text-xs text-gray-500 w-12 text-right">
                  {value}
                </span>
              </div>
            )}

            {param.type === 'select' && (
              <Select
                value={String(value)}
                onValueChange={(v) => updateCustom({ [param.key]: v })}
              >
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {param.options?.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {param.type === 'toggle' && (
              <Switch
                checked={value}
                onCheckedChange={(checked) => updateCustom({ [param.key]: checked })}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}