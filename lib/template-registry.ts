/**
 * Template Function Registry
 * Maps template IDs to their actual draw functions for direct execution
 */

import { WaveGenerator } from '@/core/wave-generator'

// Import all template draw functions
import { drawVisualization as waveBarsDraw } from '@/templates/wave-bars'
import { drawVisualization as audioBarsDraw } from '@/templates/audio-bars'
import { drawVisualization as apexVercelDraw } from '@/templates/apex-vercel'
import { drawVisualization as prismGoogleDraw } from '@/templates/prism-google'
import { drawVisualization as pulseSpotifyDraw } from '@/templates/pulse-spotify'
import { drawVisualization as spinningTrianglesDraw } from '@/templates/spinning-triangles'
import { drawVisualization as infinityLoopsDraw } from '@/templates/infinity-loops'
import { drawVisualization as wordmarkDraw } from '@/templates/wordmark'
import { drawVisualization as letterMarkDraw } from '@/templates/letter-mark'
import { drawVisualization as luxuryBrandDraw } from '@/templates/luxury-brand'
import { drawVisualization as premiumKineticDraw } from '@/templates/premium-kinetic'
import { drawVisualization as networkConstellationDraw } from '@/templates/network-constellation'
import { drawVisualization as brandNetworkDraw } from '@/templates/brand-network'
import { drawVisualization as sophisticatedStrokesDraw } from '@/templates/sophisticated-strokes'
import { drawVisualization as borderEffectsDraw } from '@/templates/border-effects'
import { drawVisualization as nexusAiBrandDraw } from '@/templates/nexus-ai-brand'
import { drawVisualization as terraEcoBrandDraw } from '@/templates/terra-eco-brand'
import { drawVisualization as voltElectricBrandDraw } from '@/templates/volt-electric-brand'
import { drawVisualization as cleanTriangleDraw } from '@/templates/clean-triangle'
import { drawVisualization as goldenCircleDraw } from '@/templates/golden-circle'
import { drawVisualization as smartHexagonDraw } from '@/templates/smart-hexagon'
import { drawVisualization as organicBarkDraw } from '@/templates/organic-bark'
import { drawVisualization as crystalBlocksDraw } from '@/templates/crystal-blocks'
import { drawVisualization as crystalLatticeDraw } from '@/templates/crystal-lattice'
import { drawVisualization as dynamicDiamondDraw } from '@/templates/dynamic-diamond'
import { drawVisualization as handSketchDraw } from '@/templates/hand-sketch'
import { drawVisualization as liquidFlowDraw } from '@/templates/liquid-flow'
import { drawVisualization as minimalLineDraw } from '@/templates/minimal-line'
import { drawVisualization as minimalShapeDraw } from '@/templates/minimal-shape'
import { drawVisualization as neonGlowDraw } from '@/templates/neon-glow'
import { drawVisualization as quantumFieldDraw } from '@/templates/quantum-field'
import { drawVisualization as simplePrismDraw } from '@/templates/simple-prism'
import { drawVisualization as architecturalGridDraw } from '@/templates/architectural-grid'

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
  'infinity-loops': infinityLoopsDraw,
  'wordmark': wordmarkDraw,
  'letter-mark': letterMarkDraw,
  'luxury-brand': luxuryBrandDraw,
  'premium-kinetic': premiumKineticDraw,
  'network-constellation': networkConstellationDraw,
  'brand-network': brandNetworkDraw,
  'sophisticated-strokes': sophisticatedStrokesDraw,
  'border-effects': borderEffectsDraw,
  'nexus-ai-brand': nexusAiBrandDraw,
  'terra-eco-brand': terraEcoBrandDraw,
  'volt-electric-brand': voltElectricBrandDraw,
  'clean-triangle': cleanTriangleDraw,
  'golden-circle': goldenCircleDraw,
  'smart-hexagon': smartHexagonDraw,
  'organic-bark': organicBarkDraw,
  'crystal-blocks': crystalBlocksDraw,
  'crystal-lattice': crystalLatticeDraw,
  'dynamic-diamond': dynamicDiamondDraw,
  'hand-sketch': handSketchDraw,
  'liquid-flow': liquidFlowDraw,
  'minimal-line': minimalLineDraw,
  'minimal-shape': minimalShapeDraw,
  'neon-glow': neonGlowDraw,
  'quantum-field': quantumFieldDraw,
  'simple-prism': simplePrismDraw,
  'architectural-grid': architecturalGridDraw
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