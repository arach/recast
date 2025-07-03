'use client';

import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo';
import { Slider } from '@/components/ui/slider';

export function BrandIdentityTool() {
  const {
    logo,
    styleParams,
    updateStyle,
  } = useSelectedLogo();

  if (!logo || !styleParams) {
    return (
      <div className="text-sm text-gray-500 text-center py-8">
        No logo selected
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Background */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-gray-700">Background</label>
          <div className="flex items-center gap-2">
            <select
              value={styleParams.backgroundType || 'transparent'}
              onChange={(e) => {
                console.log('BrandIdentity: Changing backgroundType to', e.target.value);
                updateStyle({ backgroundType: e.target.value as any });
              }}
              className="text-xs p-1 border rounded bg-white"
            >
              <option value="transparent">None</option>
              <option value="solid">Solid</option>
              <option value="gradient">Gradient</option>
            </select>
            {styleParams.backgroundType !== 'transparent' && (
              <input
                type="color"
                value={styleParams.backgroundColor}
                onChange={(e) => {
                  console.log('BrandIdentity: Changing backgroundColor to', e.target.value);
                  updateStyle({ backgroundColor: e.target.value });
                }}
                className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
              />
            )}
          </div>
        </div>
      </div>
      
      {/* Fill */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-gray-700">Fill</label>
          <div className="flex items-center gap-2">
            <select
              value={styleParams.fillType || 'solid'}
              onChange={(e) => updateStyle({ fillType: e.target.value as any })}
              className="text-xs p-1 border rounded bg-white"
            >
              <option value="none">None</option>
              <option value="solid">Solid</option>
              <option value="gradient">Gradient</option>
            </select>
            {styleParams.fillType !== 'none' && (
              <input
                type="color"
                value={styleParams.fillColor}
                onChange={(e) => updateStyle({ fillColor: e.target.value })}
                className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
              />
            )}
          </div>
        </div>
        {styleParams.fillType !== 'none' && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-600">Opacity</span>
            <Slider
              value={[styleParams.fillOpacity]}
              onValueChange={([value]) => updateStyle({ fillOpacity: value })}
              min={0}
              max={1}
              step={0.05}
              className="flex-1"
            />
            <span className="text-gray-500 w-8 text-right">
              {Math.round((styleParams.fillOpacity || 1) * 100)}%
            </span>
          </div>
        )}
      </div>
      
      {/* Stroke */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-gray-700">Stroke</label>
          <div className="flex items-center gap-2">
            <select
              value={styleParams.strokeType || 'solid'}
              onChange={(e) => updateStyle({ strokeType: e.target.value as any })}
              className="text-xs p-1 border rounded bg-white"
            >
              <option value="none">None</option>
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
            </select>
            {styleParams.strokeType !== 'none' && (
              <input
                type="color"
                value={styleParams.strokeColor}
                onChange={(e) => updateStyle({ strokeColor: e.target.value })}
                className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
              />
            )}
          </div>
        </div>
        {styleParams.strokeType !== 'none' && (
          <div className="grid grid-cols-2 gap-x-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Width</span>
                <span className="text-gray-500">{styleParams.strokeWidth}px</span>
              </div>
              <Slider
                value={[styleParams.strokeWidth]}
                onValueChange={([value]) => updateStyle({ strokeWidth: value })}
                min={0}
                max={10}
                step={0.5}
                className="w-full"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Opacity</span>
                <span className="text-gray-500">
                  {Math.round((styleParams.strokeOpacity || 1) * 100)}%
                </span>
              </div>
              <Slider
                value={[styleParams.strokeOpacity]}
                onValueChange={([value]) => updateStyle({ strokeOpacity: value })}
                min={0}
                max={1}
                step={0.05}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}