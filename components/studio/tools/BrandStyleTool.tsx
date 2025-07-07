'use client';

import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Type, Palette, Brush } from 'lucide-react';

export function BrandStyleTool() {
  const {
    logo,
    styleParams,
    updateStyle,
    updateCustom,
  } = useSelectedLogo();

  if (!logo || !styleParams) {
    return (
      <div className="text-sm text-gray-500 text-center py-8">
        No logo selected
      </div>
    );
  }

  // Determine if template supports text input
  const isWordmark = logo.templateId === 'wordmark' || logo.templateId === 'wordmark-fixed';
  const isLettermark = logo.templateId === 'letter-mark';
  const hasTextInput = isWordmark || isLettermark;

  const textValue = isWordmark 
    ? (logo.parameters.custom?.text || 'BRAND')
    : (logo.parameters.custom?.letter || 'A');

  const handleTextChange = (value: string) => {
    if (isWordmark) {
      updateCustom({ text: value });
    } else if (isLettermark) {
      const trimmed = value.slice(0, 3);
      updateCustom({ letter: trimmed });
    }
  };

  return (
    <div className="space-y-4">
      {/* Text Input Section */}
      {hasTextInput && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-1 border-b border-gray-200">
            <Type className="w-3 h-3 text-gray-500" />
            <h3 className="text-xs font-medium text-gray-700">Brand Text</h3>
          </div>
          
          <div className="space-y-2">
            <Input
              type="text"
              value={textValue}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder={isWordmark ? "Enter brand name" : "Enter 1-3 letters"}
              maxLength={isWordmark ? 50 : 3}
              className="text-sm"
            />
            {isWordmark && (
              <div className="grid grid-cols-2 gap-1.5">
                {['BRAND', 'COMPANY', 'BRAND\nTAGLINE', 'YOUR BRAND'].map((text) => (
                  <button
                    key={text}
                    onClick={() => handleTextChange(text)}
                    className="text-xs px-2 py-1.5 border rounded hover:bg-gray-50 text-left"
                  >
                    {text.includes('\n') ? 'Multi-line' : text}
                  </button>
                ))}
              </div>
            )}
            {isLettermark && (
              <div className="grid grid-cols-4 gap-1.5">
                {['A', 'B', 'M', 'X', 'AB', 'XY', 'ABC', '123'].map((letter) => (
                  <button
                    key={letter}
                    onClick={() => handleTextChange(letter)}
                    className="text-xs px-2 py-1.5 border rounded hover:bg-gray-50 font-semibold"
                  >
                    {letter}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Visual Style Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 pb-1 border-b border-gray-200">
          <Palette className="w-3 h-3 text-gray-500" />
          <h3 className="text-xs font-medium text-gray-700">Visual Style</h3>
        </div>

        <div className="space-y-2">
          {/* Fill */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-gray-600 w-12">Fill</label>
              <select
                value={styleParams.fillType || 'solid'}
                onChange={(e) => updateStyle({ fillType: e.target.value as any })}
                className="text-xs px-1.5 py-1 border rounded bg-white flex-1"
              >
                <option value="none">None</option>
                <option value="solid">Solid</option>
                <option value="gradient">Gradient</option>
              </select>
              {styleParams.fillType !== 'none' && (
                <>
                  <input
                    type="color"
                    value={styleParams.fillColor || '#3b82f6'}
                    onChange={(e) => updateStyle({ fillColor: e.target.value })}
                    className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
                  />
                  <div className="flex items-center gap-1 flex-1">
                    <Slider
                      value={[styleParams.fillOpacity ?? 1]}
                      onValueChange={([value]) => updateStyle({ fillOpacity: value })}
                      min={0}
                      max={1}
                      step={0.05}
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-500 w-10 text-right">
                      {Math.round((styleParams.fillOpacity ?? 1) * 100)}%
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Stroke */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-gray-600 w-12">Stroke</label>
              <select
                value={styleParams.strokeType || 'none'}
                onChange={(e) => updateStyle({ strokeType: e.target.value as any })}
                className="text-xs px-1.5 py-1 border rounded bg-white flex-1"
              >
                <option value="none">None</option>
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
              </select>
              {styleParams.strokeType !== 'none' && (
                <>
                  <input
                    type="color"
                    value={styleParams.strokeColor || '#1e40af'}
                    onChange={(e) => updateStyle({ strokeColor: e.target.value })}
                    className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
                  />
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">W:</span>
                    <Slider
                      value={[styleParams.strokeWidth ?? 2]}
                      onValueChange={([value]) => updateStyle({ strokeWidth: value })}
                      min={0}
                      max={10}
                      step={0.5}
                      className="w-16"
                    />
                    <span className="text-xs text-gray-500 w-6 text-right">
                      {styleParams.strokeWidth ?? 2}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Background */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-gray-600 w-12">BG</label>
              <select
                value={styleParams.backgroundType || 'transparent'}
                onChange={(e) => updateStyle({ backgroundType: e.target.value as any })}
                className="text-xs px-1.5 py-1 border rounded bg-white flex-1"
              >
                <option value="transparent">None</option>
                <option value="solid">Solid</option>
                <option value="gradient">Gradient</option>
              </select>
              {styleParams.backgroundType !== 'transparent' && (
                <>
                  <input
                    type="color"
                    value={styleParams.backgroundColor || '#ffffff'}
                    onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
                    className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
                  />
                  <div className="flex items-center gap-1 flex-1">
                    <Slider
                      value={[styleParams.backgroundOpacity ?? 1]}
                      onValueChange={([value]) => updateStyle({ backgroundOpacity: value })}
                      min={0}
                      max={1}
                      step={0.05}
                      className="flex-1"
                    />
                    <span className="text-xs text-gray-500 w-10 text-right">
                      {Math.round((styleParams.backgroundOpacity ?? 1) * 100)}%
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick Color Presets */}
        <div className="pt-2">
          <div className="grid grid-cols-4 gap-1">
            {[
              { fill: '#3b82f6', stroke: '#1e40af', bg: 'transparent' },
              { fill: '#ef4444', stroke: '#dc2626', bg: 'transparent' },
              { fill: '#10b981', stroke: '#059669', bg: 'transparent' },
              { fill: '#f59e0b', stroke: '#d97706', bg: 'transparent' },
              { fill: '#8b5cf6', stroke: '#7c3aed', bg: 'transparent' },
              { fill: '#000000', stroke: '#000000', bg: 'transparent' },
              { fill: '#ffffff', stroke: '#000000', bg: '#f3f4f6' },
              { fill: '#6366f1', stroke: '#4f46e5', bg: '#eef2ff' },
            ].map((preset, i) => (
              <button
                key={i}
                onClick={() => {
                  updateStyle({
                    fillColor: preset.fill,
                    strokeColor: preset.stroke,
                    backgroundColor: preset.bg === 'transparent' ? '#ffffff' : preset.bg,
                    backgroundType: preset.bg === 'transparent' ? 'transparent' : 'solid',
                  });
                }}
                className="relative h-8 rounded border hover:scale-105 transition-transform"
                style={{
                  background: preset.bg === 'transparent' 
                    ? `linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)`
                    : preset.bg,
                  backgroundSize: '8px 8px',
                  backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
                }}
              >
                <div 
                  className="absolute inset-1 rounded"
                  style={{ 
                    backgroundColor: preset.fill,
                    border: `2px solid ${preset.stroke}`
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}