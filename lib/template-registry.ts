/**
 * Template Function Registry
 * Maps template IDs to their actual draw functions for direct execution
 */

import { WaveGenerator } from '@/core/wave-generator'

// Import all template draw functions
import { draw as waveBarsDraw } from '@/templates/wave-bars'
import { draw as audioBarsDraw } from '@/templates/audio-bars'
import { draw as apexVercelDraw } from '@/templates/apex-vercel'
import { draw as prismGoogleDraw } from '@/templates/prism-google'
import { draw as pulseSpotifyDraw } from '@/templates/pulse-spotify'
import { draw as spinningTrianglesDraw } from '@/templates/spinning-triangles'
import { draw as infinityLoopsDraw } from '@/templates/infinity-loops'

export type TemplateDrawFunction = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, any>,
  generator: any,
  time: number
) => void

// Registry of template draw functions
export const templateDrawFunctions: Record<string, TemplateDrawFunction> = {
  'wave-bars': waveBarsDraw,
  'audio-bars': audioBarsDraw,
  'apex-vercel': apexVercelDraw,
  'prism-google': prismGoogleDraw,
  'pulse-spotify': pulseSpotifyDraw,
  'spinning-triangles': spinningTrianglesDraw,
  'infinity-loops': infinityLoopsDraw
}

/**
 * Execute a template by ID
 */
export function executeTemplate(
  templateId: string,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  params: Record<string, any>,
  time: number
): boolean {
  const drawFunction = templateDrawFunctions[templateId]
  
  if (!drawFunction) {
    return false
  }

  // Create generator for the template
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
  
  // Merge customParameters into params for universal controls
  const mergedParams = {
    ...params,
    ...params.customParameters // This ensures fillColor, strokeColor, etc. are at the root level
  }
  
  // Execute the template function directly
  drawFunction(ctx, width, height, mergedParams, generator, time)
  
  return true
}

/**
 * Check if a template ID exists in the registry
 */
export function isRegisteredTemplate(templateId: string): boolean {
  return templateId in templateDrawFunctions
}

/**
 * Get all registered template IDs
 */
export function getRegisteredTemplateIds(): string[] {
  return Object.keys(templateDrawFunctions)
}