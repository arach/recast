// Preset type definitions for ReCast visualization presets

export interface ParameterDefinition {
  type: 'slider' | 'select' | 'color' | 'toggle';
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  default: any;
  label: string;
}

export interface PresetMetadata {
  name: string;
  description: string;
  defaultParams: Record<string, any>;
}

export interface Preset {
  parameters: Record<string, ParameterDefinition>;
  draw: (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    params: Record<string, any>,
    generator: any,
    time: number
  ) => void;
  metadata: PresetMetadata;
}