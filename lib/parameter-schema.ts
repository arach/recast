/**
 * Parameter Schema Definitions
 * 
 * Defines the structure for template parameters with support for:
 * - Multiple input types (slider, color, select, text, toggle)
 * - Conditional visibility rules
 * - Validation constraints
 * - UI hints and metadata
 */

// Base parameter definition
interface BaseParameter {
  label?: string;          // Display label (defaults to humanized key)
  description?: string;    // Help text
  category?: string;       // Group parameters in UI
  when?: {                 // Conditional visibility
    [paramKey: string]: any | any[];  // Show when other param matches value(s)
  };
  hidden?: boolean;        // Always hidden (for internal params)
}

// Slider parameter (numeric input with range)
export interface SliderParameter extends BaseParameter {
  type: 'slider';
  default: number;
  min: number;
  max: number;
  step?: number;           // Defaults to 1 for integers, 0.1 for decimals
  unit?: string;           // Display unit (px, %, deg, etc)
  displayValue?: (value: number) => string;  // Custom display formatter
}

// Color parameter
export interface ColorParameter extends BaseParameter {
  type: 'color';
  default: string;         // Hex color
  format?: 'hex' | 'rgb' | 'hsl';  // Output format
  showAlpha?: boolean;     // Allow alpha channel
}

// Select parameter (dropdown)
export interface SelectParameter extends BaseParameter {
  type: 'select';
  default: string;
  options: Array<{
    value: string;
    label: string;
    icon?: string;         // Optional icon identifier
  }> | string[];          // Simple string array or detailed options
}

// Text parameter
export interface TextParameter extends BaseParameter {
  type: 'text';
  default: string;
  placeholder?: string;
  maxLength?: number;
  multiline?: boolean;
  validation?: {
    pattern?: string;      // Regex pattern
    message?: string;      // Validation error message
  };
}

// Toggle parameter (boolean)
export interface ToggleParameter extends BaseParameter {
  type: 'toggle';
  default: boolean;
  onLabel?: string;        // Label when true
  offLabel?: string;       // Label when false
}

// Number input parameter (direct numeric input)
export interface NumberParameter extends BaseParameter {
  type: 'number';
  default: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

// Union of all parameter types
export type Parameter = 
  | SliderParameter 
  | ColorParameter 
  | SelectParameter 
  | TextParameter 
  | ToggleParameter
  | NumberParameter;

// Parameter collection
export type ParameterDefinitions = Record<string, Parameter>;

// Template metadata
export interface TemplateMetadata {
  id: string;              // Unique template identifier
  name: string;            // Display name with emoji
  description: string;     // What the template does
  category?: string;       // Template category (animated, geometric, text, etc)
  tags?: string[];         // Search tags
  author?: string;         // Template author
  version?: string;        // Template version
}

// Complete template parameter schema
export interface TemplateParameterSchema {
  metadata: TemplateMetadata;
  parameters: ParameterDefinitions;
}

// Parameter categories for organization
export const PARAMETER_CATEGORIES = {
  BACKGROUND: 'Background',
  FILL: 'Fill',
  STROKE: 'Stroke',
  ANIMATION: 'Animation',
  GEOMETRY: 'Geometry',
  TYPOGRAPHY: 'Typography',
  EFFECTS: 'Effects',
  ADVANCED: 'Advanced'
} as const;

// Common parameter presets
export const COMMON_PARAMETERS = {
  // Animation speed
  animationSpeed: {
    type: 'slider',
    default: 1,
    min: 0,
    max: 5,
    step: 0.1,
    label: 'Animation Speed',
    category: PARAMETER_CATEGORIES.ANIMATION,
    unit: 'x'
  } as SliderParameter,
  
  // Rotation
  rotation: {
    type: 'slider',
    default: 0,
    min: 0,
    max: 360,
    step: 1,
    label: 'Rotation',
    category: PARAMETER_CATEGORIES.GEOMETRY,
    unit: '°'
  } as SliderParameter,
  
  // Scale
  scale: {
    type: 'slider',
    default: 1,
    min: 0.1,
    max: 3,
    step: 0.1,
    label: 'Scale',
    category: PARAMETER_CATEGORIES.GEOMETRY,
    displayValue: (v) => `${(v * 100).toFixed(0)}%`
  } as SliderParameter,
  
  // Complexity
  complexity: {
    type: 'slider',
    default: 5,
    min: 1,
    max: 10,
    step: 1,
    label: 'Complexity',
    category: PARAMETER_CATEGORIES.ADVANCED
  } as SliderParameter
};

// Validation helpers
export function validateParameter(param: Parameter, value: any): { valid: boolean; error?: string } {
  switch (param.type) {
    case 'slider':
    case 'number':
      if (typeof value !== 'number') {
        return { valid: false, error: 'Value must be a number' };
      }
      if (param.min !== undefined && value < param.min) {
        return { valid: false, error: `Value must be at least ${param.min}` };
      }
      if (param.max !== undefined && value > param.max) {
        return { valid: false, error: `Value must be at most ${param.max}` };
      }
      break;
      
    case 'color':
      if (typeof value !== 'string' || !value.match(/^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/)) {
        return { valid: false, error: 'Invalid color format' };
      }
      break;
      
    case 'select':
      const validOptions = Array.isArray(param.options) && typeof param.options[0] === 'object'
        ? param.options.map(opt => opt.value)
        : param.options;
      if (!validOptions.includes(value)) {
        return { valid: false, error: 'Invalid option selected' };
      }
      break;
      
    case 'text':
      if (typeof value !== 'string') {
        return { valid: false, error: 'Value must be a string' };
      }
      if (param.maxLength && value.length > param.maxLength) {
        return { valid: false, error: `Maximum length is ${param.maxLength}` };
      }
      if (param.validation?.pattern && !value.match(new RegExp(param.validation.pattern))) {
        return { valid: false, error: param.validation.message || 'Invalid format' };
      }
      break;
      
    case 'toggle':
      if (typeof value !== 'boolean') {
        return { valid: false, error: 'Value must be true or false' };
      }
      break;
  }
  
  return { valid: true };
}

// Check if a parameter should be visible based on conditions
export function isParameterVisible(
  paramKey: string,
  param: Parameter,
  allValues: Record<string, any>
): boolean {
  if (param.hidden) return false;
  if (!param.when) return true;
  
  // Check all conditions
  for (const [conditionKey, conditionValue] of Object.entries(param.when)) {
    const currentValue = allValues[conditionKey];
    
    if (Array.isArray(conditionValue)) {
      // Value must be one of the array values
      if (!conditionValue.includes(currentValue)) return false;
    } else {
      // Value must match exactly
      if (currentValue !== conditionValue) return false;
    }
  }
  
  return true;
}

// Generate default values from parameter definitions
export function generateDefaultValues(params: ParameterDefinitions): Record<string, any> {
  const defaults: Record<string, any> = {};
  
  for (const [key, param] of Object.entries(params)) {
    defaults[key] = param.default;
  }
  
  return defaults;
}