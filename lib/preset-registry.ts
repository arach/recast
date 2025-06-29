/**
 * Preset Function Registry
 * Maps preset IDs to their actual draw functions for direct execution
 */

import { WaveGenerator } from '@/core/wave-generator'

// Import all preset draw functions
import { draw as waveBarsDraw } from '@/presets/wave-bars'
import { draw as audioBarsDraw } from '@/presets/audio-bars'
import { draw as apexVercelDraw } from '@/presets/apex-vercel'
import { draw as prismGoogleDraw } from '@/presets/prism-google'
import { draw as pulseSpotifyDraw } from '@/presets/pulse-spotify'
import { draw as spinningTrianglesDraw } from '@/presets/spinning-triangles'
import { draw as infinityLoopsDraw } from '@/presets/infinity-loops'

export type PresetDrawFunction = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, any>,
  generator: any,
  time: number
) => void

// Registry of preset draw functions
export const presetDrawFunctions: Record<string, PresetDrawFunction> = {
  'wave-bars': waveBarsDraw,
  'audio-bars': audioBarsDraw,
  'apex-vercel': apexVercelDraw,
  'prism-google': prismGoogleDraw,
  'pulse-spotify': pulseSpotifyDraw,
  'spinning-triangles': spinningTrianglesDraw,
  'infinity-loops': infinityLoopsDraw
}

/**
 * Execute a preset by ID
 */
export function executePreset(
  presetId: string,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, any>,
  time: number
): boolean {
  const drawFunction = presetDrawFunctions[presetId]
  
  if (!drawFunction) {
    return false
  }

  // Create generator for the preset
  const waveParams = {
    amplitude: params.amplitude,
    frequency: params.frequency,
    phase: 0,
    complexity: params.complexity,
    chaos: params.chaos,
    damping: params.damping,
    layers: params.layers
  }
  
  const generator = new WaveGenerator(waveParams, params.seed)
  
  // Execute the preset function directly
  drawFunction(ctx, width, height, params, generator, time)
  
  return true
}

/**
 * Check if a preset ID exists in the registry
 */
export function isRegisteredPreset(presetId: string): boolean {
  return presetId in presetDrawFunctions
}

/**
 * Get all registered preset IDs
 */
export function getRegisteredPresetIds(): string[] {
  return Object.keys(presetDrawFunctions)
}