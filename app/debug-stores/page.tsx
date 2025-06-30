'use client';

import { useLogoStore, useUIStore, useParameterStore, useTemplateStore } from '@/lib/stores';
import { FeatureFlags } from '@/lib/feature-flags';

export default function DebugStoresPage() {
  const logos = useLogoStore((state) => state.logos);
  const selectedLogoId = useLogoStore((state) => state.selectedLogoId);
  const zoom = useUIStore((state) => state.zoom);
  const animating = useUIStore((state) => state.animating);
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Zustand Stores Debug</h1>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Feature Flags</h2>
          <div className="space-y-2 text-sm">
            <div>Zustand Controls: {FeatureFlags.isZustandControlsEnabled() ? '✅' : '❌'}</div>
            <div>ENV Value: {process.env.NEXT_PUBLIC_USE_ZUSTAND_CONTROLS}</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Logo Store</h2>
          <div className="space-y-2 text-sm">
            <div>Total Logos: {logos.length}</div>
            <div>Selected ID: {selectedLogoId || 'none'}</div>
            <div>IDs: {logos.map(l => l.id).join(', ')}</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">UI Store</h2>
          <div className="space-y-2 text-sm">
            <div>Zoom: {zoom.toFixed(2)}</div>
            <div>Animating: {animating ? 'Yes' : 'No'}</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Actions Test</h2>
          <div className="space-x-2">
            <button
              onClick={() => useUIStore.getState().setZoom(zoom + 0.1)}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
            >
              Zoom In
            </button>
            <button
              onClick={() => useUIStore.getState().toggleAnimation()}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm"
            >
              Toggle Animation
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          🔍 This page shows the current state of all Zustand stores. 
          If the main app is using Zustand controls, these values should update in real-time.
        </p>
      </div>
    </div>
  );
}