/**
 * Template Registry and Sandbox
 * 
 * Loads and executes JavaScript templates in a controlled environment
 */

// Import universal parameters
import universalParams from './universal-parameters.json';

// Template cache
const templateCache = new Map();
const parameterCache = new Map();

/**
 * Template Registry Class
 */
export class TemplateRegistry {
  constructor() {
    this.templates = new Map();
    this.parameters = new Map();
    this.utils = null; // Will be injected
  }
  
  /**
   * Set the utils object for templates
   */
  setUtils(utils) {
    this.utils = utils;
  }
  
  /**
   * Register a template
   */
  async register(templateId) {
    if (this.templates.has(templateId)) {
      return; // Already registered - skip fetching
    }
    
    try {
      // Load draw function
      const drawResponse = await fetch(`/api/templates-js/${templateId}.js`);
      if (!drawResponse.ok) {
        throw new Error(`Failed to load template: ${templateId}`);
      }
      const drawCode = await drawResponse.text();
      
      // Load parameters
      const paramsResponse = await fetch(`/api/templates-js/${templateId}.params.json`);
      if (!paramsResponse.ok) {
        throw new Error(`Failed to load parameters: ${templateId}`);
      }
      const templateParams = await paramsResponse.json();
      
      // Create sandboxed draw function
      const drawFunction = this.createSandboxedFunction(drawCode);
      
      // Merge with universal parameters
      const fullParams = this.mergeParameters(templateParams.parameters);
      
      // Store
      this.templates.set(templateId, drawFunction);
      this.parameters.set(templateId, {
        metadata: templateParams.metadata,
        parameters: fullParams,
        defaults: this.extractDefaults(fullParams)
      });
      
    } catch (error) {
      console.error(`Failed to register template ${templateId}:`, error);
      throw error;
    }
  }
  
  /**
   * Create a sandboxed function from code
   */
  createSandboxedFunction(code) {
    // Wrap the code to ensure it returns the draw function
    const wrappedCode = `
      'use strict';
      // Template code should define a draw function
      ${code}
      
      // Return the draw function
      if (typeof draw !== 'undefined') {
        return draw;
      } else {
        throw new Error('Template must define a draw function');
      }
    `;
    
    try {
      // Create the function in a limited scope
      const fn = new Function(wrappedCode);
      return fn();
    } catch (error) {
      console.error('Failed to create sandboxed function:', error);
      throw new Error(`Template compilation failed: ${error.message}`);
    }
  }
  
  /**
   * Merge template parameters with universal parameters
   */
  mergeParameters(templateParams) {
    return {
      ...universalParams.parameters,
      ...templateParams
    };
  }
  
  /**
   * Extract default values from parameters
   */
  extractDefaults(parameters) {
    const defaults = {};
    for (const [key, param] of Object.entries(parameters)) {
      defaults[key] = param.default;
    }
    return defaults;
  }
  
  /**
   * Get template metadata
   */
  getMetadata(templateId) {
    const data = this.parameters.get(templateId);
    return data ? data.metadata : null;
  }
  
  /**
   * Get template parameters
   */
  getParameters(templateId) {
    const data = this.parameters.get(templateId);
    return data ? data.parameters : null;
  }
  
  /**
   * Get default parameter values
   */
  getDefaults(templateId) {
    const data = this.parameters.get(templateId);
    return data ? data.defaults : null;
  }
  
  /**
   * Execute a template
   */
  execute(templateId, ctx, width, height, params, time = 0) {
    const draw = this.templates.get(templateId);
    if (!draw) {
      throw new Error(`Template not registered: ${templateId}`);
    }
    
    if (!this.utils) {
      throw new Error('Utils not set. Call setUtils() first.');
    }
    
    try {
      // Validate parameters
      const validated = this.validateParameters(templateId, params);
      
      // Execute in sandboxed environment
      this.executeSandboxed(draw, ctx, width, height, validated, time);
    } catch (error) {
      console.error(`Error executing template ${templateId}:`, error);
      this.renderError(ctx, width, height, error.message);
    }
  }
  
  /**
   * Execute template in sandbox
   */
  executeSandboxed(draw, ctx, width, height, params, time) {
    // Save canvas state
    ctx.save();
    
    try {
      // Reset canvas state to defaults
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
      ctx.imageSmoothingEnabled = true;
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.lineCap = 'butt';
      ctx.lineJoin = 'miter';
      ctx.miterLimit = 10;
      ctx.setLineDash([]);
      ctx.lineDashOffset = 0;
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'start';
      ctx.textBaseline = 'alphabetic';
      
      // Call the draw function
      draw(ctx, width, height, params, time, this.utils);
    } finally {
      // Always restore canvas state
      ctx.restore();
    }
  }
  
  /**
   * Validate parameters
   */
  validateParameters(templateId, params) {
    const paramDefs = this.getParameters(templateId);
    const defaults = this.getDefaults(templateId);
    
    if (!paramDefs) {
      return params; // No validation if no definitions
    }
    
    // Start with defaults
    const validated = { ...defaults };
    
    // Apply user parameters
    for (const [key, value] of Object.entries(params)) {
      if (paramDefs[key]) {
        // TODO: Add validation based on parameter type
        validated[key] = value;
      }
    }
    
    return validated;
  }
  
  /**
   * Render error state
   */
  renderError(ctx, width, height, message) {
    ctx.save();
    
    // Error background
    ctx.fillStyle = '#fee2e2';
    ctx.fillRect(0, 0, width, height);
    
    // Error icon and text
    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.fillText('⚠️ Template Error', width / 2, height / 2 - 20);
    
    ctx.font = '14px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#991b1b';
    
    // Word wrap the error message
    const maxWidth = width * 0.8;
    const words = message.split(' ');
    let line = '';
    let y = height / 2 + 10;
    
    for (const word of words) {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && line) {
        ctx.fillText(line, width / 2, y);
        line = word + ' ';
        y += 20;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, width / 2, y);
    
    ctx.restore();
  }
  
  /**
   * Get all registered template IDs
   */
  getTemplateIds() {
    return Array.from(this.templates.keys());
  }
  
  /**
   * Check if a template is registered
   */
  hasTemplate(templateId) {
    return this.templates.has(templateId);
  }
  
  /**
   * Clear cache for a specific template
   */
  clearCache(templateId) {
    this.templates.delete(templateId);
    this.parameters.delete(templateId);
  }
  
  /**
   * Clear all caches
   */
  clearAllCaches() {
    this.templates.clear();
    this.parameters.clear();
  }
}

// Create singleton instance
export const templateRegistry = new TemplateRegistry();

// Cache for loadTemplate results to prevent duplicate fetching
const loadTemplateCache = new Map();

// Helper to load and register a template
export async function loadTemplate(templateId) {
  // Return cached result if available
  if (loadTemplateCache.has(templateId)) {
    return loadTemplateCache.get(templateId);
  }
  
  await templateRegistry.register(templateId);
  const metadata = templateRegistry.getMetadata(templateId);
  const templateInfo = {
    id: templateId,
    name: metadata?.name || templateId,
    metadata: metadata,
    parameters: templateRegistry.getParameters(templateId),
    defaultParams: templateRegistry.getDefaults(templateId),
    defaults: templateRegistry.getDefaults(templateId),
    execute: (ctx, width, height, params, time) => 
      templateRegistry.execute(templateId, ctx, width, height, params, time),
    drawVisualization: (ctx, width, height, params, time) => 
      templateRegistry.execute(templateId, ctx, width, height, params, time)
  };
  
  // Cache the result
  loadTemplateCache.set(templateId, templateInfo);
  return templateInfo;
}

// Helper to check parameter visibility
export function isParameterVisible(paramKey, param, allValues) {
  if (param.hidden) return false;
  if (!param.when) return true;
  
  // Check all conditions
  for (const [conditionKey, conditionValue] of Object.entries(param.when)) {
    const currentValue = allValues[conditionKey];
    
    if (Array.isArray(conditionValue)) {
      if (!conditionValue.includes(currentValue)) return false;
    } else {
      if (currentValue !== conditionValue) return false;
    }
  }
  
  return true;
}