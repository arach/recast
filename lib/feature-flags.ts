/**
 * Feature flags for gradual migration to Zustand architecture
 */

// Environment variable or hardcoded for now
const FLAGS = {
  USE_ZUSTAND_CONTROLS: process.env.NEXT_PUBLIC_USE_ZUSTAND_CONTROLS === 'true' || false,
  USE_ZUSTAND_CANVAS: process.env.NEXT_PUBLIC_USE_ZUSTAND_CANVAS === 'true' || false,
  USE_ZUSTAND_TEMPLATES: process.env.NEXT_PUBLIC_USE_ZUSTAND_TEMPLATES === 'true' || false,
  USE_ZUSTAND_EXPORT: process.env.NEXT_PUBLIC_USE_ZUSTAND_EXPORT === 'true' || false,
  USE_FULL_ZUSTAND: process.env.NEXT_PUBLIC_USE_FULL_ZUSTAND === 'true' || false,
};

export const FeatureFlags = {
  isZustandControlsEnabled: () => FLAGS.USE_ZUSTAND_CONTROLS || FLAGS.USE_FULL_ZUSTAND,
  isZustandCanvasEnabled: () => FLAGS.USE_ZUSTAND_CANVAS || FLAGS.USE_FULL_ZUSTAND,
  isZustandTemplatesEnabled: () => FLAGS.USE_ZUSTAND_TEMPLATES || FLAGS.USE_FULL_ZUSTAND,
  isZustandExportEnabled: () => FLAGS.USE_ZUSTAND_EXPORT || FLAGS.USE_FULL_ZUSTAND,
  isFullZustandEnabled: () => FLAGS.USE_FULL_ZUSTAND,
};

// Helper to enable features programmatically (useful for testing)
export function enableFeature(feature: keyof typeof FLAGS) {
  FLAGS[feature] = true;
}

export function disableFeature(feature: keyof typeof FLAGS) {
  FLAGS[feature] = false;
}

// Log active features in development
if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🚀 Feature Flags (Server):', {
    zustandControls: FeatureFlags.isZustandControlsEnabled(),
    zustandCanvas: FeatureFlags.isZustandCanvasEnabled(),
    zustandTemplates: FeatureFlags.isZustandTemplatesEnabled(),
    zustandExport: FeatureFlags.isZustandExportEnabled(),
    fullZustand: FeatureFlags.isFullZustandEnabled(),
  });
}