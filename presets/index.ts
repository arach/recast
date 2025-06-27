// Export all presets for easy access
export * as waveBarPreset from './wave-bars';
export * as audioBarPreset from './audio-bars';
export * as apexVercelPreset from './apex-vercel';
export * as prismGooglePreset from './prism-google';
export * as pulseSpotifyPreset from './pulse-spotify';

// Re-export types
export type { Preset, PresetMetadata, ParameterDefinition } from './types';

// Export preset names for easy iteration
export const PRESET_NAMES = [
  'wave-bars',
  'audio-bars',
  'apex-vercel',
  'prism-google',
  'pulse-spotify',
] as const;

export type PresetName = typeof PRESET_NAMES[number];