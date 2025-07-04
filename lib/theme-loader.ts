/**
 * Template loader module for dynamic template loading
 */

import type { Template } from '@/templates/types';

// Map of available templates
export const TEMPLATE_MODULES = {
  'wave-bars': () => import('@/templates/wave-bars'),
  'audio-bars': () => import('@/templates/audio-bars'),
  'apex-vercel': () => import('@/templates/apex-vercel'),
  'prism-google': () => import('@/templates/prism-google'),
  'pulse-spotify': () => import('@/templates/pulse-spotify'),
  'wordmark': () => import('@/templates/wordmark'),
  'letter-mark': () => import('@/templates/letter-mark'),
  'minimal-shape': () => import('@/templates/minimal-shape'),
  'clean-triangle': () => import('@/templates/clean-triangle'),
  'golden-circle': () => import('@/templates/golden-circle'),
  'simple-prism': () => import('@/templates/simple-prism'),
  'spinning-triangles': () => import('@/templates/spinning-triangles'),
  'infinity-loops': () => import('@/templates/infinity-loops'),
  'network-constellation': () => import('@/templates/network-constellation'),
  'brand-network': () => import('@/templates/brand-network'),
  'sophisticated-strokes': () => import('@/templates/sophisticated-strokes'),
  'border-effects': () => import('@/templates/border-effects'),
  'nexus-ai-brand': () => import('@/templates/nexus-ai-brand'),
  'terra-eco-brand': () => import('@/templates/terra-eco-brand'),
  'volt-electric-brand': () => import('@/templates/volt-electric-brand'),
  'smart-hexagon': () => import('@/templates/smart-hexagon'),
  'dynamic-diamond': () => import('@/templates/dynamic-diamond'),
  'neon-glow': () => import('@/templates/neon-glow'),
  'minimal-line': () => import('@/templates/minimal-line'),
  'hand-sketch': () => import('@/templates/hand-sketch'),
  'liquid-flow': () => import('@/templates/liquid-flow'),
  'crystal-blocks': () => import('@/templates/crystal-blocks'),
  'crystal-lattice': () => import('@/templates/crystal-lattice'),
  'organic-bark': () => import('@/templates/organic-bark'),
  'architectural-grid': () => import('@/templates/architectural-grid'),
  'quantum-field': () => import('@/templates/quantum-field'),
} as const;

export type TemplateName = keyof typeof TEMPLATE_MODULES;

// Loaded template interface for UI display
export interface LoadedTemplate {
  id: string;
  name: string;
  description: string;
  defaultParams: Record<string, any>;
  code: string;
}

/**
 * Load a template module dynamically
 */
export async function loadShapeModule(shapeName: ShapeName): Promise<Template> {
  const loader = SHAPE_MODULES[shapeName];
  if (!loader) {
    throw new Error(`Shape "${shapeName}" not found`);
  }
  
  const shapeModule = await loader();
  return shapeModule;
}

// Legacy function name for compatibility
export const loadTemplate = loadShapeModule;

/**
 * Get all available template names
 */
export function getAvailableShapes(): ShapeName[] {
  return Object.keys(SHAPE_MODULES) as ShapeName[];
}

// Legacy function name for compatibility  
export const getAvailableTemplates = getAvailableShapes;

/**
 * Get template metadata without loading the full template
 */
export async function getShapeMetadata(shapeName: ShapeName) {
  const shape = await loadShapeModule(shapeName);
  return shape.metadata;
}

// Legacy function name for compatibility
export const getTemplateMetadata = getShapeMetadata;

/**
 * Get all template metadata for display in UI
 */
export async function getAllShapeMetadata() {
  const shapeNames = getAvailableShapes();
  const metadata = await Promise.all(
    shapeNames.map(async (name) => ({
      id: name,
      ...(await getShapeMetadata(name)),
    }))
  );
  return metadata;
}

// Legacy function name for compatibility
export const getAllTemplateMetadata = getAllShapeMetadata;

/**
 * Get all curated themes from the theme library
 */
export function getAllThemes(): Theme[] {
  return curatedThemes;
}