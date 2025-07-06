/**
 * Template preset system for ReFlow
 * Provides curated parameter combinations for specific templates
 * These presets control shape, size, effects - NOT colors
 */

export interface TemplatePreset {
  id: string;
  name: string;
  description: string;
  templateId: string; // Which template this preset is for
  params: Record<string, any>; // Non-color parameters only
  tags: string[];
}

// Letter Mark presets
export const letterMarkPresets: TemplatePreset[] = [
  {
    id: 'minimal-sans',
    name: 'Minimal Sans',
    description: 'Clean, modern sans-serif with no container',
    templateId: 'letter-mark',
    params: {
      fontWeight: '500',
      style: 'modern',
      alignment: 'center',
      size: 0.8,
      letterSpacing: 0,
      container: 'none'
    },
    tags: ['minimal', 'clean', 'modern']
  },
  {
    id: 'bold-circle',
    name: 'Bold Circle',
    description: 'Heavy weight letter in a perfect circle',
    templateId: 'letter-mark',
    params: {
      fontWeight: '700',
      style: 'geometric',
      alignment: 'center',
      size: 0.6,
      letterSpacing: 0,
      container: 'circle',
      containerPadding: 0.25
    },
    tags: ['bold', 'contained', 'app-icon']
  },
  {
    id: 'rounded-square',
    name: 'Rounded Square',
    description: 'Medium weight in a rounded square container',
    templateId: 'letter-mark',
    params: {
      fontWeight: '600',
      style: 'rounded',
      alignment: 'center',
      size: 0.65,
      letterSpacing: 0,
      container: 'rounded',
      containerPadding: 0.2
    },
    tags: ['friendly', 'approachable', 'app-icon']
  }
];

// Wordmark presets
export const wordmarkPresets: TemplatePreset[] = [
  {
    id: 'tech-mono',
    name: 'Tech Mono',
    description: 'Monospace font with wide letter spacing',
    templateId: 'wordmark',
    params: {
      fontStyle: 'tech',
      fontWeight: '400',
      letterSpacing: 0.15,
      size: 0.5,
      lineHeight: 1.2,
      textTransform: 'uppercase',
      underline: false
    },
    tags: ['tech', 'developer', 'minimal']
  },
  {
    id: 'bold-statement',
    name: 'Bold Statement',
    description: 'Heavy weight with tight spacing',
    templateId: 'wordmark',
    params: {
      fontStyle: 'bold',
      fontWeight: '900',
      letterSpacing: -0.02,
      size: 0.7,
      lineHeight: 1.0,
      textTransform: 'uppercase',
      underline: false
    },
    tags: ['bold', 'impact', 'strong']
  },
  {
    id: 'elegant-serif',
    name: 'Elegant Serif',
    description: 'Light serif with generous spacing',
    templateId: 'wordmark',
    params: {
      fontStyle: 'elegant',
      fontWeight: '300',
      letterSpacing: 0.08,
      size: 0.6,
      lineHeight: 1.2,
      textTransform: 'capitalize',
      underline: false
    },
    tags: ['elegant', 'luxury', 'sophisticated']
  }
];

// Minimal Shape presets
export const minimalShapePresets: TemplatePreset[] = [
  {
    id: 'perfect-circle',
    name: 'Perfect Circle',
    description: 'Simple filled circle',
    templateId: 'minimal-shape',
    params: {
      shape: 'circle',
      size: 0.7,
      rotation: 0,
      cornerRadius: 0
    },
    tags: ['simple', 'geometric', 'pure']
  },
  {
    id: 'rotated-square',
    name: 'Diamond',
    description: 'Square rotated 45 degrees',
    templateId: 'minimal-shape',
    params: {
      shape: 'square',
      size: 0.6,
      rotation: 45,
      cornerRadius: 0
    },
    tags: ['dynamic', 'geometric', 'angular']
  },
  {
    id: 'microsoft-grid',
    name: 'Four Square Grid',
    description: 'Microsoft-style four color grid',
    templateId: 'minimal-shape',
    params: {
      shape: 'grid',
      size: 0.5,
      rotation: 0,
      gridColors: 'microsoft',
      gridGap: 4
    },
    tags: ['grid', 'tech', 'microsoft']
  }
];

// Prism presets (for the JS prism template)
export const prismPresets: TemplatePreset[] = [
  {
    id: 'classic-prism',
    name: 'Classic Prism',
    description: 'Traditional triangular prism with rainbow spectrum',
    templateId: 'prism',
    params: {
      prismSize: 0.5,
      lightBeamWidth: 2,
      lightAngle: -30,
      spectrumWidth: 0.4,
      dispersion: 0.8,
      style: 'classic'
    },
    tags: ['classic', 'physics', 'educational']
  },
  {
    id: 'wide-spectrum',
    name: 'Wide Spectrum',
    description: 'Wide prism with dramatic light spread',
    templateId: 'prism',
    params: {
      prismSize: 0.6,
      lightBeamWidth: 1.5,
      lightAngle: -45,
      spectrumWidth: 0.6,
      dispersion: 1.0,
      style: 'wide'
    },
    tags: ['dramatic', 'artistic', 'bold']
  }
];

// Collect all presets by template
export const templatePresets: Record<string, TemplatePreset[]> = {
  'letter-mark': letterMarkPresets,
  'wordmark': wordmarkPresets,
  'minimal-shape': minimalShapePresets,
  'prism': prismPresets,
  // Add more as templates are created
};

/**
 * Get presets for a specific template
 */
export function getPresetsForTemplate(templateId: string): TemplatePreset[] {
  return templatePresets[templateId] || [];
}

/**
 * Apply a template preset to current parameters
 * Only updates non-color parameters
 */
export function applyTemplatePreset(preset: TemplatePreset, currentParams: Record<string, any>): Record<string, any> {
  // List of parameters that should NOT be overridden by template presets
  const preservedParams = [
    // Color parameters
    'fillColor', 'strokeColor', 'backgroundColor',
    'fillType', 'strokeType', 'backgroundType',
    'fillGradientStart', 'fillGradientEnd', 'fillGradientDirection',
    'strokeGradientStart', 'strokeGradientEnd', 'strokeGradientDirection',
    'backgroundGradientStart', 'backgroundGradientEnd', 'backgroundGradientDirection',
    'fillOpacity', 'strokeOpacity',
    // Text content parameters
    'text', 'letter', 'letters', 'brandName', 'words', 'title', 'subtitle'
  ];
  
  // Start with current params
  const updatedParams = { ...currentParams };
  
  // Apply preset params, but skip preserved ones
  Object.entries(preset.params).forEach(([key, value]) => {
    if (!preservedParams.includes(key)) {
      updatedParams[key] = value;
    }
  });
  
  return updatedParams;
}