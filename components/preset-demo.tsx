'use client';

import { useEffect, useRef, useState } from 'react';
import { usePreset, usePresetList } from '@/hooks/use-preset';
import { WaveGenerator } from '@/core/wave-generator';
import type { PresetName } from '@/lib/preset-loader';

export function PresetDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const generatorRef = useRef<WaveGenerator>();
  
  const { presets, loading: presetsLoading } = usePresetList();
  const { preset, loading: presetLoading, loadPresetByName } = usePreset();
  
  const [selectedPreset, setSelectedPreset] = useState<PresetName>('wave-bars');
  const [params, setParams] = useState<Record<string, any>>({});
  const [isAnimating, setIsAnimating] = useState(true);

  // Initialize wave generator
  useEffect(() => {
    if (preset) {
      const defaultParams = preset.metadata.defaultParams;
      setParams(defaultParams);
      
      generatorRef.current = new WaveGenerator({
        waveType: 'sine',
        frequency: defaultParams.frequency || 3,
        amplitude: defaultParams.amplitude || 50,
        complexity: defaultParams.complexity || 0.3,
        chaos: defaultParams.chaos || 0.1,
        damping: defaultParams.damping || 0.9,
        layers: defaultParams.layers || 2,
      }, defaultParams.seed || 'demo');
    }
  }, [preset]);

  // Handle preset selection
  const handlePresetChange = async (presetName: string) => {
    setSelectedPreset(presetName as PresetName);
    await loadPresetByName(presetName as PresetName);
  };

  // Update generator when params change
  useEffect(() => {
    if (generatorRef.current && params) {
      generatorRef.current.updateParams({
        frequency: params.frequency || 3,
        amplitude: params.amplitude || 50,
        complexity: params.complexity || 0.3,
        chaos: params.chaos || 0.1,
        damping: params.damping || 0.9,
        layers: params.layers || 2,
      });
    }
  }, [params]);

  // Animation loop
  useEffect(() => {
    if (!preset || !canvasRef.current || !generatorRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let startTime = Date.now();

    const animate = () => {
      if (!isAnimating) return;

      const currentTime = (Date.now() - startTime) / 1000;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Call the preset's draw function
      preset.draw(ctx, canvas.width, canvas.height, params, generatorRef.current, currentTime);
      
      animationRef.current = requestAnimationFrame(animate);
    };

    if (isAnimating) {
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [preset, params, isAnimating]);

  // Render parameter controls
  const renderParameterControl = (key: string, definition: any) => {
    const value = params[key] ?? definition.default;

    switch (definition.type) {
      case 'slider':
        return (
          <div key={key} className="mb-4">
            <label className="block text-sm font-medium mb-1">
              {definition.label}: {value}
            </label>
            <input
              type="range"
              min={definition.min}
              max={definition.max}
              step={definition.step}
              value={value}
              onChange={(e) => setParams({ ...params, [key]: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>
        );
      
      case 'select':
        return (
          <div key={key} className="mb-4">
            <label className="block text-sm font-medium mb-1">{definition.label}</label>
            <select
              value={value}
              onChange={(e) => setParams({ ...params, [key]: e.target.value })}
              className="w-full p-2 border rounded"
            >
              {definition.options.map((option: string) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        );
      
      case 'color':
        return (
          <div key={key} className="mb-4">
            <label className="block text-sm font-medium mb-1">{definition.label}</label>
            <input
              type="color"
              value={value}
              onChange={(e) => setParams({ ...params, [key]: e.target.value })}
              className="w-full h-10"
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  if (presetsLoading) {
    return <div>Loading presets...</div>;
  }

  return (
    <div className="flex gap-8">
      {/* Controls */}
      <div className="w-80 space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-4">Preset Demo</h2>
          
          {/* Preset selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Select Preset</label>
            <select
              value={selectedPreset}
              onChange={(e) => handlePresetChange(e.target.value)}
              className="w-full p-2 border rounded"
              disabled={presetLoading}
            >
              {presets.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Animation toggle */}
          <button
            onClick={() => setIsAnimating(!isAnimating)}
            className="mb-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isAnimating ? 'Pause' : 'Play'}
          </button>

          {/* Parameter controls */}
          {preset && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Parameters</h3>
              {Object.entries(preset.parameters).map(([key, definition]) =>
                renderParameterControl(key, definition)
              )}
            </div>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border border-gray-300 rounded"
        />
        {preset && (
          <p className="mt-2 text-sm text-gray-600">{preset.metadata.description}</p>
        )}
      </div>
    </div>
  );
}