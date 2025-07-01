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
  'luxury-brand': () => import('@/templates/luxury-brand'),
  'premium-kinetic': () => import('@/templates/premium-kinetic'),
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
export async function loadTemplate(templateName: TemplateName): Promise<Template> {
  const loader = TEMPLATE_MODULES[templateName];
  if (!loader) {
    throw new Error(`Template "${templateName}" not found`);
  }
  
  const template = await loader();
  return template;
}

/**
 * Get all available template names
 */
export function getAvailableTemplates(): TemplateName[] {
  return Object.keys(TEMPLATE_MODULES) as TemplateName[];
}

/**
 * Get template metadata without loading the full template
 */
export async function getTemplateMetadata(templateName: TemplateName) {
  const template = await loadTemplate(templateName);
  return template.metadata;
}

/**
 * Get all template metadata for display in UI
 */
export async function getAllTemplateMetadata() {
  const templateNames = getAvailableTemplates();
  const metadata = await Promise.all(
    templateNames.map(async (name) => ({
      id: name,
      ...(await getTemplateMetadata(name)),
    }))
  );
  return metadata;
}