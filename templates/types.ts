// Template type definitions for ReFlow visualization templates

export interface ParameterDefinition {
  type: 'slider' | 'select' | 'color' | 'toggle' | 'text';
  min?: number;
  max?: number;
  step?: number;
  options?: Array<{ value: string; label: string }> | string[];
  default: any;
  label: string;
  category?: string; // For grouping parameters in UI
  showIf?: (params: any) => boolean; // Conditional visibility
}

export interface TemplateMetadata {
  name: string;
  description: string;
  defaultParams: Record<string, any>;
}

export interface Template {
  parameters: Record<string, ParameterDefinition>;
  draw: (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    params: Record<string, any>,
    generator: any,
    time: number
  ) => void;
  metadata: TemplateMetadata;
}

// Keep Preset as an alias for backward compatibility during migration
export type PresetMetadata = TemplateMetadata;
export type Preset = Template;