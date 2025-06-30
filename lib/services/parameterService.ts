/**
 * Service for handling parameter operations
 * Provides utilities for parsing, merging, and validating parameters
 */

import { Parameters, StyleParameters, ContentParameters, ParameterDefinition } from '@/lib/types';

export class ParameterService {
  /**
   * Parse parameter definitions from generated code
   */
  static parseParametersFromCode(code: string): Record<string, ParameterDefinition> | null {
    try {
      // Look for PARAMETERS = { ... } definition
      const match = code.match(/const\s+PARAMETERS\s*=\s*({[\s\S]*?^});/m) || 
                    code.match(/const\s+PARAMETERS\s*=\s*({[\s\S]*?});/);
      
      if (!match) {
        return null;
      }
      
      const paramsCode = `(${match[1]})`;
      const paramsObj = eval(paramsCode);
      
      // Convert to our expected format
      const parameters: Record<string, ParameterDefinition> = {};
      for (const [paramName, paramDef] of Object.entries(paramsObj)) {
        parameters[paramName] = {
          name: paramName,
          ...(paramDef as any),
        };
      }
      
      return parameters;
    } catch (error) {
      console.warn('Failed to parse parameters from code:', error);
      return null;
    }
  }
  
  /**
   * Merge parameters while preserving important values
   */
  static mergeParameters(
    current: Parameters,
    updates: Partial<Parameters>,
    options: {
      preserveContent?: boolean;
      preserveColors?: boolean;
    } = {}
  ): Parameters {
    const result: Parameters = {
      core: { ...current.core },
      style: { ...current.style },
      content: { ...current.content },
      custom: { ...current.custom },
    };
    
    // Apply updates
    if (updates.core) {
      result.core = { ...result.core, ...updates.core };
    }
    
    if (updates.style) {
      if (options.preserveColors) {
        // Only update non-color style parameters
        const { fillColor, strokeColor, backgroundColor, ...nonColorStyle } = updates.style;
        result.style = { ...result.style, ...nonColorStyle };
      } else {
        result.style = { ...result.style, ...updates.style };
      }
    }
    
    if (updates.content && !options.preserveContent) {
      result.content = { ...result.content, ...updates.content };
    }
    
    if (updates.custom) {
      result.custom = { ...result.custom, ...updates.custom };
    }
    
    return result;
  }
  
  /**
   * Extract color parameters from style
   */
  static extractColors(style: StyleParameters): Partial<StyleParameters> {
    return {
      fillColor: style.fillColor,
      strokeColor: style.strokeColor,
      backgroundColor: style.backgroundColor,
      fillOpacity: style.fillOpacity,
      strokeOpacity: style.strokeOpacity,
    };
  }
  
  /**
   * Extract content parameters
   */
  static extractContent(parameters: Parameters): ContentParameters {
    // Get from both content and custom (for legacy compatibility)
    return {
      text: parameters.content.text || parameters.custom.text,
      letter: parameters.content.letter || parameters.custom.letter,
    };
  }
  
  /**
   * Validate parameters against definitions
   */
  static validateParameters(
    params: Record<string, any>,
    definitions: Record<string, ParameterDefinition>
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    for (const [key, def] of Object.entries(definitions)) {
      const value = params[key];
      
      // Check required parameters
      if (value === undefined && def.default === undefined) {
        errors.push(`Missing required parameter: ${key}`);
        continue;
      }
      
      // Type validation
      if (value !== undefined) {
        switch (def.type) {
          case 'slider':
            if (typeof value !== 'number') {
              errors.push(`Parameter ${key} must be a number`);
            } else if (def.min !== undefined && value < def.min) {
              errors.push(`Parameter ${key} must be >= ${def.min}`);
            } else if (def.max !== undefined && value > def.max) {
              errors.push(`Parameter ${key} must be <= ${def.max}`);
            }
            break;
            
          case 'select':
            if (def.options) {
              const validOptions = def.options.map(opt => 
                typeof opt === 'string' ? opt : opt.value
              );
              if (!validOptions.includes(value)) {
                errors.push(`Parameter ${key} must be one of: ${validOptions.join(', ')}`);
              }
            }
            break;
            
          case 'color':
            if (typeof value !== 'string' || !value.match(/^#[0-9a-fA-F]{6}$/)) {
              errors.push(`Parameter ${key} must be a valid hex color`);
            }
            break;
            
          case 'text':
            if (typeof value !== 'string') {
              errors.push(`Parameter ${key} must be a string`);
            }
            break;
            
          case 'toggle':
            if (typeof value !== 'boolean') {
              errors.push(`Parameter ${key} must be a boolean`);
            }
            break;
        }
      }
    }
    
    return {
      valid: errors.length === 0,
      errors,
    };
  }
  
  /**
   * Apply defaults to parameters
   */
  static applyDefaults(
    params: Record<string, any>,
    definitions: Record<string, ParameterDefinition>
  ): Record<string, any> {
    const result = { ...params };
    
    for (const [key, def] of Object.entries(definitions)) {
      if (result[key] === undefined && def.default !== undefined) {
        result[key] = def.default;
      }
    }
    
    return result;
  }
  
  /**
   * Filter parameters by visibility conditions
   */
  static filterVisibleParameters(
    definitions: Record<string, ParameterDefinition>,
    currentParams: Record<string, any>
  ): Record<string, ParameterDefinition> {
    const visible: Record<string, ParameterDefinition> = {};
    
    for (const [key, def] of Object.entries(definitions)) {
      if (!def.showIf || def.showIf(currentParams)) {
        visible[key] = def;
      }
    }
    
    return visible;
  }
}