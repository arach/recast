'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'

interface ControlsPanelProps {
  currentPresetName?: string | null
  seed: string
  frequency: number
  amplitude: number
  complexity: number
  chaos: number
  damping: number
  layers: number
  barCount: number
  barSpacing: number
  radius: number
  customCode: string
  customParameters: Record<string, any>
  onSeedChange: (seed: string) => void
  onFrequencyChange: (frequency: number) => void
  onAmplitudeChange: (amplitude: number) => void
  onComplexityChange: (complexity: number) => void
  onChaosChange: (chaos: number) => void
  onDampingChange: (damping: number) => void
  onLayersChange: (layers: number) => void
  onBarCountChange: (barCount: number) => void
  onBarSpacingChange: (barSpacing: number) => void
  onRadiusChange: (radius: number) => void
  onCustomParametersChange: (params: Record<string, any>) => void
  getCurrentGeneratorMetadata: () => any
  parseCustomParameters: (code: string) => Record<string, any> | null
  forceRender: number
  onForceRender: () => void
}

export function ControlsPanel({
  currentPresetName,
  seed,
  frequency,
  amplitude,
  complexity,
  chaos,
  damping,
  layers,
  barCount,
  barSpacing,
  radius,
  customCode,
  customParameters,
  onSeedChange,
  onFrequencyChange,
  onAmplitudeChange,
  onComplexityChange,
  onChaosChange,
  onDampingChange,
  onLayersChange,
  onBarCountChange,
  onBarSpacingChange,
  onRadiusChange,
  onCustomParametersChange,
  getCurrentGeneratorMetadata,
  parseCustomParameters,
  forceRender,
  onForceRender
}: ControlsPanelProps) {
  return (
    <div className="w-96 border-l border-gray-200 bg-gray-50/30 overflow-y-auto">
      <div className="p-6 space-y-4">
        {/* Current Preset - Enhanced with Clear Visual Indicator */}
        <Card className={`${currentPresetName ? 'ring-2 ring-blue-200 bg-blue-50/30' : 'bg-gray-50/30'}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              {currentPresetName ? (
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              ) : (
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              )}
              Active Style
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-sm font-medium p-3 rounded-lg border-2 ${
              currentPresetName 
                ? 'text-blue-900 bg-blue-100 border-blue-200' 
                : 'text-gray-900 bg-gray-100 border-gray-300'
            }`}>
              <div className="flex items-center justify-between">
                <span>{currentPresetName || 'Custom Code'}</span>
                {currentPresetName && (
                  <span className="text-xs px-2 py-1 bg-blue-200 text-blue-800 rounded-full">PRESET</span>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              {currentPresetName 
                ? `Using preset: ${currentPresetName}` 
                : 'Using custom visualization code'}
            </p>
          </CardContent>
        </Card>

        {/* Main Controls */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Core Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-medium">
                Seed (Your Signature)
              </label>
              <input
                type="text"
                value={seed}
                onChange={(e) => onSeedChange(e.target.value)}
                className="w-full mt-1 p-2 border rounded-lg text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Universal Controls - Compact Professional Layout */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Universal Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(() => {
              // Get universal controls from parsed parameters
              const parsedParams = parseCustomParameters(customCode) || {};
              const universalControlNames = [
                'backgroundColor', 'backgroundType', 'backgroundGradientStart', 'backgroundGradientEnd', 'backgroundGradientDirection',
                'fillType', 'fillColor', 'fillGradientStart', 'fillGradientEnd', 'fillGradientDirection', 'fillOpacity',
                'strokeType', 'strokeColor', 'strokeWidth', 'strokeOpacity'
              ];
              
              const universalParams = Object.fromEntries(
                Object.entries(parsedParams).filter(([key]) => universalControlNames.includes(key))
              );
              
              return (
                <div className="space-y-3">
                  {/* Background Section - Compact */}
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-700">Background</span>
                      <select
                        value={customParameters['backgroundType'] ?? 'transparent'}
                        onChange={(e) => onCustomParametersChange({ ...customParameters, backgroundType: e.target.value })}
                        className="text-xs p-1 border rounded bg-white min-w-0"
                      >
                        <option value="transparent">None</option>
                        <option value="solid">Solid</option>
                        <option value="gradient">Gradient</option>
                      </select>
                    </div>
                    {(customParameters['backgroundType'] === 'solid' || customParameters['backgroundType'] === 'gradient') && (
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={customParameters['backgroundColor'] ?? '#ffffff'}
                          onChange={(e) => onCustomParametersChange({ ...customParameters, backgroundColor: e.target.value })}
                          className="w-8 h-6 border border-gray-300 rounded cursor-pointer"
                        />
                        {customParameters['backgroundType'] === 'gradient' && (
                          <>
                            <input
                              type="color"
                              value={customParameters['backgroundGradientEnd'] ?? '#f0f0f0'}
                              onChange={(e) => onCustomParametersChange({ ...customParameters, backgroundGradientEnd: e.target.value })}
                              className="w-8 h-6 border border-gray-300 rounded cursor-pointer"
                            />
                            <span className="text-xs text-gray-500">{Math.round(customParameters['backgroundGradientDirection'] ?? 0)}°</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Fill Section - Compact */}
                  <div className="bg-blue-50 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-700">Fill</span>
                      <div className="flex items-center gap-2">
                        <select
                          value={customParameters['fillType'] ?? 'solid'}
                          onChange={(e) => onCustomParametersChange({ ...customParameters, fillType: e.target.value })}
                          className="text-xs p-1 border rounded bg-white min-w-0"
                        >
                          <option value="none">None</option>
                          <option value="solid">Solid</option>
                          <option value="gradient">Gradient</option>
                        </select>
                        {customParameters['fillType'] !== 'none' && (
                          <span className="text-xs text-gray-500">
                            {Math.round((customParameters['fillOpacity'] ?? 1) * 100)}%
                          </span>
                        )}
                      </div>
                    </div>
                    {customParameters['fillType'] !== 'none' && (
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={customParameters['fillColor'] ?? '#3b82f6'}
                          onChange={(e) => onCustomParametersChange({ ...customParameters, fillColor: e.target.value })}
                          className="w-8 h-6 border border-gray-300 rounded cursor-pointer"
                        />
                        {customParameters['fillType'] === 'gradient' && (
                          <input
                            type="color"
                            value={customParameters['fillGradientEnd'] ?? '#1d4ed8'}
                            onChange={(e) => onCustomParametersChange({ ...customParameters, fillGradientEnd: e.target.value })}
                            className="w-8 h-6 border border-gray-300 rounded cursor-pointer"
                          />
                        )}
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={customParameters['fillOpacity'] ?? 1}
                          onChange={(e) => onCustomParametersChange({ ...customParameters, fillOpacity: parseFloat(e.target.value) })}
                          className="flex-1 h-2"
                        />
                      </div>
                    )}
                  </div>

                  {/* Stroke Section - Compact */}
                  <div className="bg-purple-50 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-700">Stroke</span>
                      <div className="flex items-center gap-2">
                        <select
                          value={customParameters['strokeType'] ?? 'solid'}
                          onChange={(e) => onCustomParametersChange({ ...customParameters, strokeType: e.target.value })}
                          className="text-xs p-1 border rounded bg-white min-w-0"
                        >
                          <option value="none">None</option>
                          <option value="solid">Solid</option>
                          <option value="dashed">Dashed</option>
                          <option value="dotted">Dotted</option>
                        </select>
                        {customParameters['strokeType'] !== 'none' && (
                          <span className="text-xs text-gray-500">
                            {customParameters['strokeWidth'] ?? 2}px
                          </span>
                        )}
                      </div>
                    </div>
                    {customParameters['strokeType'] !== 'none' && (
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={customParameters['strokeColor'] ?? '#1e40af'}
                          onChange={(e) => onCustomParametersChange({ ...customParameters, strokeColor: e.target.value })}
                          className="w-8 h-6 border border-gray-300 rounded cursor-pointer"
                        />
                        <input
                          type="range"
                          min="0.5"
                          max="10"
                          step="0.5"
                          value={customParameters['strokeWidth'] ?? 2}
                          onChange={(e) => onCustomParametersChange({ ...customParameters, strokeWidth: parseFloat(e.target.value) })}
                          className="flex-1 h-2"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>

        {/* Template-Specific Parameters - Grouped by Category */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              {currentPresetName ? `${currentPresetName} Controls` : 'Template Parameters'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(() => {
              const parsedParams = parseCustomParameters(customCode)
              if (!parsedParams || Object.keys(parsedParams).length === 0) {
                return (
                  <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded border-l-4 border-blue-200">
                    Add a <code className="bg-gray-200 px-1 rounded">PARAMETERS</code> definition in your code to see controls here.
                  </div>
                )
              }
              
              // Filter out universal controls - only show template-specific ones
              const universalControlNames = [
                'backgroundColor', 'backgroundType', 'backgroundGradientStart', 'backgroundGradientEnd', 'backgroundGradientDirection',
                'fillType', 'fillColor', 'fillGradientStart', 'fillGradientEnd', 'fillGradientDirection', 'fillOpacity',
                'strokeType', 'strokeColor', 'strokeWidth', 'strokeOpacity'
              ];
              
              const templateParams = Object.fromEntries(
                Object.entries(parsedParams).filter(([key]) => !universalControlNames.includes(key))
              );
              
              if (Object.keys(templateParams).length === 0) {
                return (
                  <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded">
                    This template uses only universal controls.
                  </div>
                );
              }
              
              // Group by category for professional layout
              const categories = ['Shape', '3D', 'Typography', 'Effects'];
              const visibleParams = Object.entries(templateParams).filter(([paramName, param]) => {
                if (param.showIf && typeof param.showIf === 'function') {
                  return param.showIf(customParameters);
                }
                return true;
              });
              
              return categories.map(category => {
                const categoryParams = visibleParams.filter(([_, param]) => param.category === category);
                if (categoryParams.length === 0) return null;
                
                const categoryColor = {
                  'Shape': 'bg-green-50 border-green-200',
                  '3D': 'bg-purple-50 border-purple-200', 
                  'Typography': 'bg-orange-50 border-orange-200',
                  'Effects': 'bg-blue-50 border-blue-200'
                }[category] || 'bg-gray-50 border-gray-200';
                
                return (
                  <div key={category} className={`${categoryColor} rounded-lg p-3 space-y-2`}>
                    <div className="text-xs font-medium text-gray-700 border-b pb-1" style={{borderColor: 'inherit'}}>{category}</div>
                    <div className="grid gap-2">
                      {categoryParams.map(([paramName, param]) => (
                        <div key={paramName} className="flex items-center justify-between">
                          <label className="text-xs font-medium text-gray-600 flex-1">
                            {param.label || paramName}
                          </label>
                          <div className="flex items-center gap-2 min-w-0">
                            {param.type === 'color' ? (
                              <>
                                <input
                                  type="color"
                                  value={customParameters[paramName] ?? param.default ?? '#000000'}
                                  onChange={(e) => onCustomParametersChange({ ...customParameters, [paramName]: e.target.value })}
                                  className="w-8 h-6 border border-gray-300 rounded cursor-pointer"
                                />
                                <span className="text-xs text-gray-500 w-16 text-right">
                                  {(customParameters[paramName] ?? param.default ?? '#000000').slice(1)}
                                </span>
                              </>
                            ) : param.type === 'text' ? (
                              <input
                                type="text"
                                value={customParameters[paramName] !== undefined ? customParameters[paramName] : (param.default || '')}
                                onChange={(e) => onCustomParametersChange({ ...customParameters, [paramName]: e.target.value })}
                                className="text-xs p-1 border rounded bg-white min-w-0 w-20"
                                placeholder={param.default}
                              />
                            ) : param.type === 'select' ? (
                              <select
                                value={customParameters[paramName] ?? param.default}
                                onChange={(e) => onCustomParametersChange({ ...customParameters, [paramName]: e.target.value })}
                                className="text-xs p-1 border rounded bg-white min-w-0 max-w-20"
                              >
                                {param.options?.map((option: any) => {
                                  const value = typeof option === 'string' ? option : option.value;
                                  const label = typeof option === 'string' ? option : option.label;
                                  return (
                                    <option key={value} value={value}>
                                      {label}
                                    </option>
                                  );
                                })}
                              </select>
                            ) : param.type === 'toggle' ? (
                              <input
                                type="checkbox"
                                checked={customParameters[paramName] ?? param.default ?? false}
                                onChange={(e) => onCustomParametersChange({ ...customParameters, [paramName]: e.target.checked })}
                                className="w-4 h-4 rounded"
                              />
                            ) : (
                              <>
                                <input
                                  type="range"
                                  min={param.min ?? 0}
                                  max={param.max ?? 100}
                                  step={param.step ?? 1}
                                  value={customParameters[paramName] ?? param.default ?? 0}
                                  onChange={(e) => onCustomParametersChange({ ...customParameters, [paramName]: parseFloat(e.target.value) })}
                                  className="w-20 h-2"
                                />
                                <span className="text-xs text-gray-500 w-12 text-right">
                                  {(() => {
                                    const value = customParameters[paramName] ?? param.default ?? 0;
                                    return typeof value === 'number' ? value.toFixed(param.step < 1 ? 2 : 0) : value;
                                  })()}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }).filter(Boolean);
            })()
            }
          </CardContent>
        </Card>

        {/* Core Wave Parameters - Only show if not using preset with its own parameters */}
        {(!currentPresetName || (parseCustomParameters(customCode) && Object.keys(parseCustomParameters(customCode) || {}).length === 0)) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Core Wave Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Frequency */}
            <div>
              <label className="text-xs font-medium">Frequency: {frequency}</label>
              <Slider
                value={[frequency]}
                onValueChange={([v]) => onFrequencyChange(v)}
                max={20}
                min={0.1}
                step={0.1}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Wave cycles</p>
            </div>
            
            {/* Amplitude */}
            <div>
              <label className="text-xs font-medium">Amplitude: {amplitude}</label>
              <Slider
                value={[amplitude]}
                onValueChange={([v]) => onAmplitudeChange(v)}
                max={200}
                min={0}
                step={1}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Wave height</p>
            </div>
            
            {/* Complexity */}
            <div>
              <label className="text-xs font-medium">Complexity: {complexity.toFixed(2)}</label>
              <Slider
                value={[complexity]}
                onValueChange={([v]) => onComplexityChange(v)}
                max={1}
                min={0}
                step={0.01}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Wave harmonics</p>
            </div>
          </CardContent>
        </Card>
        )}

        {/* Advanced Controls - Only show if not using preset */}
        {(!currentPresetName || (parseCustomParameters(customCode) && Object.keys(parseCustomParameters(customCode) || {}).length === 0)) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Advanced Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Chaos */}
            <div>
              <label className="text-xs font-medium">Chaos: {chaos.toFixed(2)}</label>
              <Slider
                value={[chaos]}
                onValueChange={([v]) => onChaosChange(v)}
                max={1}
                min={0}
                step={0.01}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Randomness factor</p>
            </div>

            {/* Damping */}
            <div>
              <label className="text-xs font-medium">Damping: {damping.toFixed(2)}</label>
              <Slider
                value={[damping]}
                onValueChange={([v]) => onDampingChange(v)}
                max={1}
                min={0}
                step={0.01}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Layer decay</p>
            </div>

            {/* Layers */}
            <div>
              <label className="text-xs font-medium">Layers: {layers}</label>
              <Slider
                value={[layers]}
                onValueChange={([v]) => onLayersChange(v)}
                max={8}
                min={1}
                step={1}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Wave layers</p>
            </div>
          </CardContent>
        </Card>
        )}

        {/* Additional Parameters - Only show if not using preset */}
        {(!currentPresetName || (parseCustomParameters(customCode) && Object.keys(parseCustomParameters(customCode) || {}).length === 0)) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Additional Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs font-medium">Bar Count: {barCount}</label>
              <Slider
                value={[barCount]}
                onValueChange={([v]) => onBarCountChange(v)}
                max={100}
                min={20}
                step={5}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Number of elements</p>
            </div>
            <div>
              <label className="text-xs font-medium">Spacing: {barSpacing}px</label>
              <Slider
                value={[barSpacing]}
                onValueChange={([v]) => onBarSpacingChange(v)}
                max={5}
                min={0}
                step={1}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Element spacing</p>
            </div>
            <div>
              <label className="text-xs font-medium">Radius: {radius}</label>
              <Slider
                value={[radius]}
                onValueChange={([v]) => onRadiusChange(v)}
                max={200}
                min={10}
                step={1}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">Base size</p>
            </div>
          </CardContent>
        </Card>
        )}
      </div>
    </div>
  )
}