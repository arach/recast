'use client';

import { ControlsPanelV2 } from '@/components/studio/ControlsPanelV2';
import { StoreInitializer } from '@/components/migration/StoreInitializer';
import { FeatureFlags } from '@/lib/feature-flags';

export default function TestZustandPage() {
  const isEnabled = FeatureFlags.isZustandControlsEnabled();
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">Zustand Migration Test</h1>
      
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h2 className="text-lg font-semibold mb-2">Feature Flags</h2>
        <p className="text-sm">Zustand Controls Enabled: {isEnabled ? '✅ Yes' : '❌ No'}</p>
        <p className="text-xs text-gray-500 mt-2">
          ENV: {process.env.NEXT_PUBLIC_USE_ZUSTAND_CONTROLS || 'undefined'}
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <h2 className="text-lg font-semibold p-4 border-b">ControlsPanelV2 Test</h2>
        <div className="flex">
          <StoreInitializer
            logos={[{
              id: 'test',
              templateId: 'wave-bars',
              templateName: 'Wave Bars',
              params: {
                seed: 'test',
                frequency: 4,
                amplitude: 50,
                complexity: 0.5,
                chaos: 0,
                damping: 0,
                layers: 3,
                radius: 100,
                customParameters: {},
              },
              position: { x: 0, y: 0 },
              code: '// Test code',
            }]}
            selectedLogoId="test"
            zoom={1}
            animating={false}
          />
          <ControlsPanelV2 />
        </div>
      </div>
    </div>
  );
}