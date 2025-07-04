'use client';

import { Slider } from '@/components/ui/slider';
import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';
import { useState } from 'react';

export function CoreParametersTool() {
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
  } = useSelectedLogo();

  if (!logo || !coreParams) {
    return (
      <div className="text-sm text-gray-500 text-center py-8">
        No logo selected
      </div>
    );
  }

  const parameters = [
    {
      name: 'Pattern Density',
      key: 'frequency',
      value: coreParams.frequency,
      setter: setFrequency,
      min: 0.1,
      max: 20,
      step: 0.1,
      description: 'How many repeating elements in your design',
      tooltip: 'Controls the number of wave cycles. Lower values create simpler, bolder patterns. Higher values create more detailed, intricate patterns.',
    },
    {
      name: 'Energy',
      key: 'amplitude',
      value: coreParams.amplitude,
      setter: setAmplitude,
      min: 0,
      max: 200,
      step: 1,
      description: 'Visual intensity and movement',
      tooltip: 'Controls how dynamic and bold the logo appears. Higher values create more dramatic, energetic designs.',
    },
    {
      name: 'Detail Level',
      key: 'complexity',
      value: coreParams.complexity,
      setter: setComplexity,
      min: 0,
      max: 1,
      step: 0.01,
      description: 'From minimal to intricate',
      tooltip: 'Adds harmonics and detail to the base pattern. Use lower values for clean, minimal logos and higher values for detailed designs.',
    },
    {
      name: 'Organic Feel',
      key: 'chaos',
      value: coreParams.chaos,
      setter: setChaos,
      min: 0,
      max: 1,
      step: 0.01,
      description: 'Structured vs natural flow',
      tooltip: 'Adds controlled randomness. Use sparingly (0.1-0.3) for slight organic variations while maintaining brand consistency.',
    },
    {
      name: 'Layer Blend',
      key: 'damping',
      value: coreParams.damping,
      setter: setDamping,
      min: 0,
      max: 1,
      step: 0.01,
      description: 'How layers interact',
      tooltip: 'Controls how each layer fades relative to others. Lower values create stronger contrast between layers.',
    },
    {
      name: 'Depth',
      key: 'layers',
      value: coreParams.layers,
      setter: setLayers,
      min: 1,
      max: 10,
      step: 1,
      description: 'Number of overlapping elements',
      tooltip: 'Adds depth and richness to your logo. Each layer can have slightly different properties.',
    },
    {
      name: 'Scale',
      key: 'radius',
      value: coreParams.radius,
      setter: setRadius,
      min: 10,
      max: 200,
      step: 1,
      description: 'Overall logo size',
      tooltip: 'Controls the base size of your logo. This scales all elements proportionally.',
    },
  ];

  return (
    <div className="space-y-1">
      {/* Header with explanation */}
      <div className="mb-3 pb-2 border-b border-gray-200">
        <p className="text-[10px] text-gray-500">
          Shape your brand&apos;s mathematical DNA
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        {parameters.map((param) => (
          <div
            key={param.key}
            className="space-y-1"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <label className="text-xs font-medium text-gray-700">
                  {param.name}
                </label>
                <button
                  onMouseEnter={() => setShowTooltip(param.key)}
                  onMouseLeave={() => setShowTooltip(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Info className="h-3 w-3" />
                </button>
              </div>
              <span className="text-xs font-mono text-gray-500">
                {param.value.toFixed(param.step < 1 ? 2 : 0)}
              </span>
            </div>
            
            {/* Tooltip */}
            {showTooltip === param.key && (
              <div className="absolute z-10 w-48 p-2 mt-1 text-xs bg-gray-900 text-gray-100 rounded shadow-lg">
                {param.tooltip}
              </div>
            )}
            
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
      
      {/* Quick presets */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setFrequency(2);
              setAmplitude(80);
              setComplexity(0.2);
              setChaos(0.1);
              setDamping(0.9);
              setLayers(2);
            }}
            className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            Minimal
          </button>
          <button
            onClick={() => {
              setFrequency(5);
              setAmplitude(100);
              setComplexity(0.5);
              setChaos(0.2);
              setDamping(0.7);
              setLayers(3);
            }}
            className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            Balanced
          </button>
          <button
            onClick={() => {
              setFrequency(10);
              setAmplitude(150);
              setComplexity(0.8);
              setChaos(0.3);
              setDamping(0.5);
              setLayers(5);
            }}
            className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            Complex
          </button>
        </div>
      </div>
    </div>
  );
}