import type { Preset } from '@/presets/types';

// Map of available presets
export const PRESET_MODULES = {
  'wave-bars': () => import('@/presets/wave-bars'),
  'audio-bars': () => import('@/presets/audio-bars'),
  'apex-vercel': () => import('@/presets/apex-vercel'),
  'prism-google': () => import('@/presets/prism-google'),
  'pulse-spotify': () => import('@/presets/pulse-spotify'),
  'wordmark': () => import('@/presets/wordmark'),
  'letter-mark': () => import('@/presets/letter-mark'),
  'minimal-shape': () => import('@/presets/minimal-shape'),
  'clean-triangle': () => import('@/presets/clean-triangle'),
  'golden-circle': () => import('@/presets/golden-circle'),
  'simple-prism': () => import('@/presets/simple-prism'),
} as const;

export type PresetName = keyof typeof PRESET_MODULES;

// Legacy preset interface for backward compatibility
export interface LegacyPreset {
  name: string;
  description: string;
  defaultParams: Record<string, any>;
  code: string;
}

/**
 * Load a preset module dynamically
 */
export async function loadPreset(presetName: PresetName): Promise<Preset> {
  const loader = PRESET_MODULES[presetName];
  if (!loader) {
    throw new Error(`Preset "${presetName}" not found`);
  }
  
  const preset = await loader();
  return preset;
}

/**
 * Get all available preset names
 */
export function getAvailablePresets(): PresetName[] {
  return Object.keys(PRESET_MODULES) as PresetName[];
}

/**
 * Convert a legacy preset to the new format
 * This allows using old string-based presets with the new system
 */
export function convertLegacyPreset(legacy: LegacyPreset): Preset {
  // Extract parameters from the code string if possible
  const parametersMatch = legacy.code.match(/const PARAMETERS = ({[\s\S]*?});/);
  let parameters = {};
  
  if (parametersMatch) {
    try {
      // This is a bit hacky but allows us to extract the parameters
      // In production, you'd want to use a proper parser
      const paramsCode = parametersMatch[1];
      // Create a function that returns the parameters object
      const extractParams = new Function(`return ${paramsCode}`);
      parameters = extractParams();
    } catch (e) {
      console.warn('Could not extract parameters from legacy preset:', e);
    }
  }
  
  // Extract the draw function from the code string
  const drawMatch = legacy.code.match(/function drawVisualization\s*\(([^)]*)\)\s*{([\s\S]*)}/);
  let drawFunction: Preset['draw'];
  
  if (drawMatch) {
    const [, params, body] = drawMatch;
    // Create the draw function dynamically
    drawFunction = new Function(params, body) as Preset['draw'];
  } else {
    // Fallback draw function
    drawFunction = () => {
      console.warn('No draw function found in legacy preset');
    };
  }
  
  return {
    parameters,
    draw: drawFunction,
    metadata: {
      name: legacy.name,
      description: legacy.description,
      defaultParams: legacy.defaultParams,
    },
  };
}

/**
 * Load a preset by name, with support for both new modules and legacy presets
 */
export async function loadPresetFlexible(presetNameOrPath: string): Promise<Preset> {
  // First try to load as a module preset
  if (presetNameOrPath in PRESET_MODULES) {
    return loadPreset(presetNameOrPath as PresetName);
  }
  
  // If not found in modules, try to load as a legacy preset file
  try {
    const legacy = await import(presetNameOrPath);
    if (legacy.preset && typeof legacy.preset.code === 'string') {
      return convertLegacyPreset(legacy.preset);
    }
  } catch (e) {
    console.error('Failed to load preset:', e);
  }
  
  throw new Error(`Could not load preset: ${presetNameOrPath}`);
}

/**
 * Get preset metadata without loading the full preset
 */
export async function getPresetMetadata(presetName: PresetName) {
  const preset = await loadPreset(presetName);
  return preset.metadata;
}

/**
 * Get all preset metadata for display in UI
 */
export async function getAllPresetMetadata() {
  const presetNames = getAvailablePresets();
  const metadata = await Promise.all(
    presetNames.map(async (name) => ({
      id: name,
      ...(await getPresetMetadata(name)),
    }))
  );
  return metadata;
}