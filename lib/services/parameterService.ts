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
      // Look for PARAMETERS = { ... } or parameters = { ... } definition
      // First try to find the start (case insensitive)
      let startMatch = code.match(/const\s+PARAMETERS\s*=\s*{/);
      if (!startMatch) {
        // Try lowercase version
        startMatch = code.match(/const\s+parameters\s*=\s*{/);
      }
      if (!startMatch) {
        // Try to find export const PARAMETERS = metadata.parameters
        const exportMatch = code.match(/export\s+const\s+PARAMETERS\s*=\s*metadata\.parameters/);
        if (exportMatch) {
          // Look for metadata definition
          const metadataMatch = code.match(/const\s+metadata\s*=\s*{[\s\S]*?parameters\s*:\s*({[\s\S]*?})\s*,/);
          if (metadataMatch) {
            // Extract parameters from metadata
            const paramsCode = `(${metadataMatch[1]})`;
            try {
              const paramsObj = eval(paramsCode);
              const parameters: Record<string, ParameterDefinition> = {};
              for (const [paramName, paramDef] of Object.entries(paramsObj)) {
                parameters[paramName] = {
                  name: paramName,
                  ...(paramDef as any),
                };
              }
              return parameters;
            } catch (e) {
              console.error('Error parsing metadata parameters:', e);
            }
          }
        }
        // console.log('❌ No PARAMETERS or parameters start found');
        return null;
      }
      
      // Find the matching closing brace
      let braceCount = 0;
      let inString = false;
      let stringChar = '';
      let escaped = false;
      let endIndex = -1;
      
      for (let i = startMatch.index! + startMatch[0].length - 1; i < code.length; i++) {
        const char = code[i];
        
        if (escaped) {
          escaped = false;
          continue;
        }
        
        if (char === '\\') {
          escaped = true;
          continue;
        }
        
        if (inString) {
          if (char === stringChar) {
            inString = false;
          }
          continue;
        }
        
        if (char === '"' || char === "'" || char === '`') {
          inString = true;
          stringChar = char;
          continue;
        }
        
        if (char === '{') {
          braceCount++;
        } else if (char === '}') {
          braceCount--;
          if (braceCount === 0) {
            endIndex = i;
            break;
          }
        }
      }
      
      if (endIndex === -1) {
        console.log('❌ No matching closing brace found');
        return null;
      }
      
      const fullMatch = code.substring(startMatch.index!, endIndex + 1);
      const match = fullMatch.match(/const\s+(?:PARAMETERS|parameters)\s*=\s*({[\s\S]*})/);
      
      if (!match) {
        // console.log('❌ No PARAMETERS/parameters match found in code');
        return null;
      }
      
      // console.log('✅ Found PARAMETERS definition');
      const paramsCode = `(${match[1]})`;
      
      // Create a safe environment for eval with arrow function support
      const evalCode = `
        (function() {
          const params = ${paramsCode};
          return params;
        })()
      `;
      
      const paramsObj = eval(evalCode);
      // console.log('📦 Evaluated params object keys:', Object.keys(paramsObj));
      
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