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
    <div className="space-y-2">
      {/* Background - Compact Row */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-gray-700 w-12">BG</label>
        <select
          value={styleParams.backgroundType || 'transparent'}
          onChange={(e) => updateStyle({ backgroundType: e.target.value as any })}
          className="text-xs px-1 py-0.5 border rounded bg-white flex-1"
        >
          <option value="transparent">None</option>
          <option value="solid">Solid</option>
          <option value="gradient">Gradient</option>
        </select>
        {styleParams.backgroundType !== 'transparent' && (
          <input
            type="color"
            value={styleParams.backgroundColor}
            onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
            className="w-5 h-5 border border-gray-300 rounded cursor-pointer"
          />
        )}
      </div>
      
      {/* Fill - Compact Row */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-700 w-12">Fill</label>
          <select
            value={styleParams.fillType || 'solid'}
            onChange={(e) => updateStyle({ fillType: e.target.value as any })}
            className="text-xs px-1 py-0.5 border rounded bg-white flex-1"
          >
            <option value="none">None</option>
            <option value="solid">Solid</option>
            <option value="gradient">Gradient</option>
          </select>
          {styleParams.fillType !== 'none' && (
            <>
              <input
                type="color"
                value={styleParams.fillColor}
                onChange={(e) => updateStyle({ fillColor: e.target.value })}
                className="w-5 h-5 border border-gray-300 rounded cursor-pointer"
              />
              <div className="flex items-center gap-1 flex-1">
                <Slider
                  value={[styleParams.fillOpacity]}
                  onValueChange={([value]) => updateStyle({ fillOpacity: value })}
                  min={0}
                  max={1}
                  step={0.05}
                  className="flex-1 h-4"
                />
                <span className="text-xs text-gray-500 w-8 text-right">
                  {Math.round((styleParams.fillOpacity || 1) * 100)}%
                </span>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Stroke - Compact Row */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-700 w-12">Stroke</label>
          <select
            value={styleParams.strokeType || 'solid'}
            onChange={(e) => updateStyle({ strokeType: e.target.value as any })}
            className="text-xs px-1 py-0.5 border rounded bg-white flex-1"
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
              className="w-5 h-5 border border-gray-300 rounded cursor-pointer"
            />
          )}
        </div>
        {styleParams.strokeType !== 'none' && (
          <div className="flex items-center gap-2 pl-14">
            <div className="flex items-center gap-1 flex-1">
              <span className="text-xs text-gray-600">W</span>
              <Slider
                value={[styleParams.strokeWidth]}
                onValueChange={([value]) => updateStyle({ strokeWidth: value })}
                min={0}
                max={10}
                step={0.5}
                className="flex-1 h-4"
              />
              <span className="text-xs text-gray-500 w-6">{styleParams.strokeWidth}</span>
            </div>
            <div className="flex items-center gap-1 flex-1">
              <span className="text-xs text-gray-600">A</span>
              <Slider
                value={[styleParams.strokeOpacity]}
                onValueChange={([value]) => updateStyle({ strokeOpacity: value })}
                min={0}
                max={1}
                step={0.05}
                className="flex-1 h-4"
              />
              <span className="text-xs text-gray-500 w-8">
                {Math.round((styleParams.strokeOpacity || 1) * 100)}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}