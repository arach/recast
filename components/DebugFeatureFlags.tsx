'use client';

import { FeatureFlags } from '@/lib/feature-flags';
import { useEffect, useState } from 'react';

export function DebugFeatureFlags() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono z-50">
      <div className="mb-1 font-bold">🐛 Feature Flags Debug</div>
      <div>Zustand Controls: {FeatureFlags.isZustandControlsEnabled() ? '✅ ON' : '❌ OFF'}</div>
      <div className="text-gray-400">ENV: {process.env.NEXT_PUBLIC_USE_ZUSTAND_CONTROLS || 'undefined'}</div>
      <div className="mt-2 text-yellow-400">
        {FeatureFlags.isZustandControlsEnabled() ? 
          'Should see: "🚀 Using Zustand-based Controls (V2)"' : 
          'Using legacy controls'}
      </div>
    </div>
  );
}