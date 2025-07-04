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
// All templates with working exports
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
  // All templates now active with working exports
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
  
  // Debug incoming params
  console.log('Template Registry: Incoming params:', {
    hasStyle: !!params.style,
    backgroundColor: params.backgroundColor,
    backgroundType: params.backgroundType,
    styleBackgroundColor: params.style?.backgroundColor,
    styleBackgroundType: params.style?.backgroundType,
    customBackgroundType: params.customParameters?.backgroundType,
    customBackgroundColor: params.customParameters?.backgroundColor
  });
  
  // Merge all parameters to ensure they're available at root level
  // First spread custom parameters, then override with style parameters
  const mergedParams = {
    ...params,
    // Spread custom parameters first
    ...params.customParameters,
    // Then override with style parameters (these take precedence)
    fillColor: params.style?.fillColor || params.fillColor || params.customParameters?.fillColor,
    fillType: params.style?.fillType || params.fillType || params.customParameters?.fillType,
    fillOpacity: params.style?.fillOpacity ?? params.fillOpacity ?? params.customParameters?.fillOpacity ?? 1,
    strokeColor: params.style?.strokeColor || params.strokeColor || params.customParameters?.strokeColor,
    strokeType: params.style?.strokeType || params.strokeType || params.customParameters?.strokeType,
    strokeWidth: params.style?.strokeWidth ?? params.strokeWidth ?? params.customParameters?.strokeWidth ?? 0,
    strokeOpacity: params.style?.strokeOpacity ?? params.strokeOpacity ?? params.customParameters?.strokeOpacity ?? 1,
    backgroundColor: params.style?.backgroundColor || params.backgroundColor || params.customParameters?.backgroundColor,
    backgroundType: params.style?.backgroundType || params.backgroundType || params.customParameters?.backgroundType,
    backgroundOpacity: params.style?.backgroundOpacity ?? params.backgroundOpacity ?? params.customParameters?.backgroundOpacity ?? 1,
  }
  
  console.log('Template Registry: Merged params:', {
    backgroundColor: mergedParams.backgroundColor,
    backgroundType: mergedParams.backgroundType,
    fillColor: mergedParams.fillColor
  });
  
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