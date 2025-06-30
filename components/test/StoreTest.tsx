'use client';

import { useLogoStore, useUIStore, useParameterStore } from '@/lib/stores';
import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo';

export function StoreTest() {
  // Test logo store
  const logos = useLogoStore((state) => state.logos);
  const selectedLogoId = useLogoStore((state) => state.selectedLogoId);
  const addLogo = useLogoStore((state) => state.addLogo);
  const deleteLogo = useLogoStore((state) => state.deleteLogo);
  
  // Test UI store
  const zoom = useUIStore((state) => state.zoom);
  const setZoom = useUIStore((state) => state.setZoom);
  const animating = useUIStore((state) => state.animating);
  const toggleAnimation = useUIStore((state) => state.toggleAnimation);
  
  // Test selected logo hook
  const {
    logo,
    coreParams,
    styleParams,
    contentParams,
    setFrequency,
    setFillColor,
    setText,
  } = useSelectedLogo();
  
  return (
    <div className="p-4 bg-gray-100 rounded-lg space-y-4">
      <h2 className="text-lg font-bold">Store Test Component</h2>
      
      {/* Logo Store Test */}
      <div className="bg-white p-3 rounded">
        <h3 className="font-semibold mb-2">Logo Store</h3>
        <p>Logos: {logos.length}</p>
        <p>Selected: {selectedLogoId}</p>
        <div className="space-x-2 mt-2">
          <button
            onClick={() => addLogo('test-template')}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
          >
            Add Logo
          </button>
          <button
            onClick={() => selectedLogoId && deleteLogo(selectedLogoId)}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm"
            disabled={logos.length <= 1}
          >
            Delete Selected
          </button>
        </div>
      </div>
      
      {/* UI Store Test */}
      <div className="bg-white p-3 rounded">
        <h3 className="font-semibold mb-2">UI Store</h3>
        <p>Zoom: {zoom.toFixed(2)}</p>
        <p>Animating: {animating ? 'Yes' : 'No'}</p>
        <div className="space-x-2 mt-2">
          <button
            onClick={() => setZoom(zoom + 0.1)}
            className="px-3 py-1 bg-green-500 text-white rounded text-sm"
          >
            Zoom In
          </button>
          <button
            onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
            className="px-3 py-1 bg-green-500 text-white rounded text-sm"
          >
            Zoom Out
          </button>
          <button
            onClick={toggleAnimation}
            className="px-3 py-1 bg-purple-500 text-white rounded text-sm"
          >
            Toggle Animation
          </button>
        </div>
      </div>
      
      {/* Selected Logo Test */}
      {logo && (
        <div className="bg-white p-3 rounded">
          <h3 className="font-semibold mb-2">Selected Logo Parameters</h3>
          <div className="space-y-1 text-sm">
            <p>Template: {logo.templateId}</p>
            <p>Frequency: {coreParams?.frequency}</p>
            <p>Fill Color: {styleParams?.fillColor}</p>
            <p>Text: {contentParams?.text || 'N/A'}</p>
          </div>
          <div className="space-x-2 mt-2">
            <button
              onClick={() => setFrequency((coreParams?.frequency || 4) + 1)}
              className="px-3 py-1 bg-indigo-500 text-white rounded text-sm"
            >
              Increase Frequency
            </button>
            <button
              onClick={() => setFillColor('#' + Math.floor(Math.random()*16777215).toString(16))}
              className="px-3 py-1 bg-pink-500 text-white rounded text-sm"
            >
              Random Color
            </button>
            <button
              onClick={() => setText('Reflow')}
              className="px-3 py-1 bg-yellow-600 text-white rounded text-sm"
            >
              Set Text
            </button>
          </div>
        </div>
      )}
    </div>
  );
}