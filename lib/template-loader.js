/**
 * Template loader for pure JavaScript templates
 */

import { applyUniversalBackground, adjustColor, hexToHsl } from './template-utils';

// Template utilities passed to every template
const templateUtils = {
  applyUniversalBackground,
  adjustColor,
  hexToHsl
};

// Cache for loaded templates
const templateCache = new Map();

/**
 * Load a template by ID
 */
export async function loadTemplate(templateId) {
  // Check cache first
  if (templateCache.has(templateId)) {
    return templateCache.get(templateId);
  }
  
  try {
    // Fetch the JavaScript template
    const response = await fetch(`/api/templates/${templateId}`);
    if (!response.ok) {
      throw new Error(`Failed to load template: ${templateId}`);
    }
    
    const code = await response.text();
    
    // Execute the template IIFE in a controlled environment
    // The template returns { metadata, parameters, draw }
    const templateFactory = new Function('utils', `return ${code}`);
    const template = templateFactory(templateUtils);
    
    // Validate template structure
    if (!template.metadata || !template.parameters || !template.draw) {
      throw new Error(`Invalid template structure: ${templateId}`);
    }
    
    // Cache the template
    templateCache.set(templateId, template);
    
    return template;
  } catch (error) {
    console.error(`Error loading template ${templateId}:`, error);
    throw error;
  }
}

/**
 * Execute a template's draw function
 */
export function executeTemplate(ctx, template, params, time, width, height) {
  if (!template || !template.draw) {
    throw new Error('Invalid template');
  }
  
  try {
    // Call the template's draw function
    template.draw(ctx, width, height, params, time, templateUtils);
  } catch (error) {
    console.error('Error executing template:', error);
    
    // Draw error state
    ctx.fillStyle = '#fee2e2';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#dc2626';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Template Error', width / 2, height / 2);
    ctx.font = '12px sans-serif';
    ctx.fillText(error.message, width / 2, height / 2 + 20);
  }
}

/**
 * Get template metadata without loading the full template
 */
export async function getTemplateMetadata(templateId) {
  const template = await loadTemplate(templateId);
  return template.metadata;
}

/**
 * Clear template cache
 */
export function clearTemplateCache() {
  templateCache.clear();
}