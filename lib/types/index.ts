/**
 * Core type definitions for Reflow
 */

// Position in canvas space
export interface Position {
  x: number;
  y: number;
}

// Core wave generation parameters
export interface CoreParameters {
  frequency: number;
  amplitude: number;
  complexity: number;
  chaos: number;
  damping: number;
  layers: number;
  radius: number;
}

// Visual style parameters
export interface StyleParameters {
  fillColor: string;
  fillType: 'none' | 'solid' | 'gradient';
  fillOpacity: number;
  strokeColor: string;
  strokeType: 'none' | 'solid' | 'dashed' | 'dotted';
  strokeWidth: number;
  strokeOpacity: number;
  backgroundColor: string;
  backgroundType: 'transparent' | 'solid' | 'gradient';
}

// Content parameters (text, letters, etc)
export interface ContentParameters {
  text?: string;
  letter?: string;
  // Add other content params as needed
}

// Combined parameters for a logo
export interface Parameters {
  core: CoreParameters;
  style: StyleParameters;
  content: ContentParameters;
  custom: Record<string, any>; // Template-specific params
}

// A logo instance
export interface Logo {
  id: string;
  templateId: string;
  templateName: string;
  parameters: Parameters;
  position: Position;
  code: string; // Generated code for this logo
}

// Template/Preset definition
export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  defaultParameters: Partial<Parameters>;
  parameterDefinitions: ParameterDefinition[];
}

// Parameter definition for dynamic controls
export interface ParameterDefinition {
  name: string;
  type: 'slider' | 'select' | 'color' | 'text' | 'toggle';
  label: string;
  category?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: Array<{ value: string; label: string }> | string[];
  default: any;
  showIf?: (params: Record<string, any>) => boolean;
}

// UI State
export interface UIState {
  selectedLogoId: string | null;
  animating: boolean;
  zoom: number;
  previewMode: boolean;
  codeEditorCollapsed: boolean;
  darkMode: boolean;
  isRendering: boolean;
  renderSuccess: boolean;
}

// Export configuration
export interface ExportConfig {
  format: 'png' | 'svg' | 'gif' | 'mp4';
  size?: number;
  background?: boolean;
  animation?: boolean;
}