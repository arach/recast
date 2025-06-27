'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'

interface ControlsPanelProps {
  visualMode: 'wave' | 'bars' | 'wavebars' | 'circles' | 'custom'
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
  onVisualizationModeChange: (mode: 'wave' | 'bars' | 'wavebars' | 'circles' | 'custom') => void
  onCustomParametersChange: (params: Record<string, any>) => void
  getCurrentGeneratorMetadata: () => any
  parseCustomParameters: (code: string) => Record<string, any> | null
  forceRender: number
  onForceRender: () => void
}

export function ControlsPanel({
  visualMode,
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
  onVisualizationModeChange,
  onCustomParametersChange,
  getCurrentGeneratorMetadata,
  parseCustomParameters,
  forceRender,
  onForceRender
}: ControlsPanelProps) {
  return (
    <div className="w-96 border-l border-gray-200 bg-gray-50/30 overflow-y-auto">
      <div className="p-6 space-y-4">
        {/* Visualization Mode */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Visualization Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <select
              value={visualMode}
              onChange={(e) => {
                onVisualizationModeChange(e.target.value as any)
                // Auto-refresh when changing modes
                setTimeout(() => onForceRender(), 100)
              }}
              className="w-full p-2 border rounded-lg text-sm"
            >
              <option value="wave">Wave Lines</option>
              <option value="bars">Audio Bars</option>
              <option value="wavebars">Wave Bars</option>
              <option value="circles">Pulsing Circles</option>
              <option value="custom">Custom Code</option>
            </select>
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

        {/* Dynamic Parameters based on current mode */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">
              {visualMode === 'custom' ? 'Custom Parameters' : 'Generator Parameters'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {visualMode === 'custom' ? (
              // Custom mode - show parsed parameters
              (() => {
                const parsedParams = parseCustomParameters(customCode)
                if (!parsedParams || Object.keys(parsedParams).length === 0) {
                  return (
                    <div className="space-y-4">
                      <div className="text-xs font-medium text-gray-600 border-b pb-1">
                        Custom Parameters
                      </div>
                      <div className="text-xs text-gray-500 p-3 bg-gray-50 rounded border-l-4 border-blue-200">
                        Add a <code className="bg-gray-200 px-1 rounded">PARAMETERS</code> definition in your code to see controls here.
                        <br /><br />
                        Example:<br />
                        <code className="text-xs block mt-1 bg-gray-200 p-2 rounded">
                          {`const PARAMETERS = {
size: { type: 'slider', min: 1, max: 50, default: 10, label: 'Size' }
}`}
                        </code>
                      </div>
                    </div>
                  )
                }
                
                return (
                  <div className="space-y-4">
                    <div className="text-xs font-medium text-gray-600 border-b pb-1">
                      Custom Parameters
                    </div>
                    {Object.entries(parsedParams).map(([paramName, param]) => (
                      <div key={paramName}>
                        <label className="text-xs font-medium">
                          {param.label || paramName}: {(customParameters[paramName] ?? param.default ?? 0).toFixed(param.step < 1 ? 2 : 0)}
                        </label>
                        <Slider
                          value={[customParameters[paramName] ?? param.default ?? 0]}
                          onValueChange={([v]) => onCustomParametersChange({ ...customParameters, [paramName]: v })}
                          max={param.max ?? 100}
                          min={param.min ?? 0}
                          step={param.step ?? 1}
                          className="mt-1"
                        />
                        {param.label && (
                          <p className="text-xs text-gray-500 mt-1">{param.label}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )
              })()
            ) : (
              // Built-in modes - show generator metadata
              (() => {
                const metadata = getCurrentGeneratorMetadata()
                if (!metadata) return null
                
                return (
                  <div className="space-y-4">
                    <div className="text-xs font-medium text-gray-600 border-b pb-1">
                      {metadata.name} Parameters
                    </div>
                    
                    {/* Frequency */}
                    {metadata.parameterRanges.frequency && (
                      <div>
                        <label className="text-xs font-medium">Frequency: {frequency}</label>
                        <Slider
                          value={[frequency]}
                          onValueChange={([v]) => onFrequencyChange(v)}
                          max={metadata.parameterRanges.frequency.max}
                          min={metadata.parameterRanges.frequency.min}
                          step={metadata.parameterRanges.frequency.step || 0.1}
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {visualMode === 'circles' ? 'Pulsing speed' : 'Wave cycles'}
                        </p>
                      </div>
                    )}
                    
                    {/* Amplitude */}
                    {metadata.parameterRanges.amplitude && (
                      <div>
                        <label className="text-xs font-medium">Amplitude: {amplitude}</label>
                        <Slider
                          value={[amplitude]}
                          onValueChange={([v]) => onAmplitudeChange(v)}
                          max={metadata.parameterRanges.amplitude.max}
                          min={metadata.parameterRanges.amplitude.min}
                          step={metadata.parameterRanges.amplitude.step || 1}
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {visualMode === 'circles' ? 'Size variation' : 'Wave height'}
                        </p>
                      </div>
                    )}
                    
                    {/* Complexity */}
                    {metadata.parameterRanges.complexity && (
                      <div>
                        <label className="text-xs font-medium">Complexity: {complexity.toFixed(2)}</label>
                        <Slider
                          value={[complexity]}
                          onValueChange={([v]) => onComplexityChange(v)}
                          max={metadata.parameterRanges.complexity.max}
                          min={metadata.parameterRanges.complexity.min}
                          step={metadata.parameterRanges.complexity.step || 0.01}
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {visualMode === 'circles' ? 'Orbital elements' : 'Wave harmonics'}
                        </p>
                      </div>
                    )}
                    
                    {/* Radius - only for circles */}
                    {metadata.parameterRanges.radius && (
                      <div>
                        <label className="text-xs font-medium">Base Radius: {radius}</label>
                        <Slider
                          value={[radius]}
                          onValueChange={([v]) => onRadiusChange(v)}
                          max={metadata.parameterRanges.radius.max}
                          min={metadata.parameterRanges.radius.min}
                          step={metadata.parameterRanges.radius.step || 1}
                          className="mt-1"
                        />
                        <p className="text-xs text-gray-500 mt-1">Circle size</p>
                      </div>
                    )}
                  </div>
                )
              })()
            )}
          </CardContent>
        </Card>

        {/* Advanced Controls */}
        {getCurrentGeneratorMetadata() && (
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
                <p className="text-xs text-gray-500 mt-1">
                  {visualMode === 'circles' ? 'Concentric rings' : 'Wave layers'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Bar Controls */}
        {(visualMode === 'bars' || visualMode === 'wavebars') && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Bar Settings</CardTitle>
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
              </div>
            </CardContent>
          </Card>
        )}

        {visualMode === 'circles' && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Circle Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label className="text-xs font-medium">Base Radius: {radius}</label>
                <Slider
                  value={[radius]}
                  onValueChange={([v]) => onRadiusChange(v)}
                  max={200}
                  min={10}
                  step={1}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}