// Curated theme library - combinations of shapes, styles, and parameters
import { Theme, Style } from './types/core'

// Predefined styles that can be used across themes
export const styles: Record<string, Style> = {
  boldModern: {
    id: 'bold-modern',
    name: 'Bold & Modern',
    colors: {
      primary: '#000000',
      secondary: '#FF0066',
      accent: '#00FF88',
      background: '#FFFFFF'
    },
    effects: {
      strokeWidth: 3,
      opacity: 1,
      blur: 0,
      glow: false
    },
    mood: {
      energy: 0.8,
      formality: 0.6,
      complexity: 0.5
    }
  },
  softElegant: {
    id: 'soft-elegant',
    name: 'Soft & Elegant',
    colors: {
      primary: '#2C3E50',
      secondary: '#E74C3C',
      accent: '#F39C12',
      background: '#FAFAFA'
    },
    effects: {
      strokeWidth: 1.5,
      opacity: 0.9,
      blur: 0.5,
      glow: true
    },
    mood: {
      energy: 0.3,
      formality: 0.9,
      complexity: 0.3
    }
  },
  techMinimal: {
    id: 'tech-minimal',
    name: 'Tech Minimal',
    colors: {
      primary: '#0066FF',
      secondary: '#00CCFF',
      accent: '#FF6600',
      background: '#F5F5F5'
    },
    effects: {
      strokeWidth: 2,
      opacity: 0.95,
      blur: 0,
      glow: false
    },
    mood: {
      energy: 0.6,
      formality: 0.7,
      complexity: 0.2
    }
  },
  vibrantCreative: {
    id: 'vibrant-creative',
    name: 'Vibrant Creative',
    colors: {
      primary: '#FF00FF',
      secondary: '#00FFFF',
      accent: '#FFFF00',
      background: '#1A1A1A'
    },
    effects: {
      strokeWidth: 2.5,
      opacity: 1,
      blur: 1,
      glow: true
    },
    mood: {
      energy: 0.9,
      formality: 0.2,
      complexity: 0.7
    }
  }
}

// Curated themes combining shapes, styles, and optimized parameters
export const themes: Theme[] = [
  {
    id: 'tech-startup-wave',
    name: 'Tech Startup Wave',
    shapeId: 'wave-lines',
    styleId: 'tech-minimal',
    params: {
      frequency: 4,
      amplitude: 0.8,
      complexity: 0.6,
      chaos: 0.2,
      damping: 0.8,
      layers: 3,
      radius: 0.5
    },
    tags: ['tech', 'modern', 'clean', 'startup']
  },
  {
    id: 'creative-agency-burst',
    name: 'Creative Agency Burst',
    shapeId: 'circular-burst',
    styleId: 'vibrant-creative',
    params: {
      frequency: 6,
      amplitude: 1,
      complexity: 0.8,
      chaos: 0.4,
      damping: 0.6,
      layers: 5,
      radius: 0.7
    },
    tags: ['creative', 'energetic', 'bold', 'agency']
  },
  {
    id: 'luxury-brand-flow',
    name: 'Luxury Brand Flow',
    shapeId: 'wave-bars',
    styleId: 'soft-elegant',
    params: {
      frequency: 2,
      amplitude: 0.6,
      complexity: 0.3,
      chaos: 0.1,
      damping: 0.9,
      layers: 2,
      radius: 0.4,
      barCount: 40,
      barSpacing: 3
    },
    tags: ['luxury', 'elegant', 'minimal', 'premium']
  },
  {
    id: 'fintech-security',
    name: 'Fintech Security',
    shapeId: 'geometric-grid',
    styleId: 'bold-modern',
    params: {
      frequency: 3,
      amplitude: 0.7,
      complexity: 0.5,
      chaos: 0,
      damping: 1,
      layers: 4,
      radius: 0.6
    },
    tags: ['finance', 'secure', 'trust', 'professional']
  }
]

// Helper function to get theme by ID
export function getThemeById(id: string): Theme | undefined {
  return themes.find(theme => theme.id === id)
}

// Helper function to get style by ID
export function getStyleById(id: string): Style | undefined {
  return styles[id]
}

// Helper function to filter themes by tags
export function getThemesByTags(tags: string[]): Theme[] {
  return themes.filter(theme => 
    tags.some(tag => theme.tags.includes(tag))
  )
}

// Helper function to apply style to current parameters
export function applyStyleToParams(style: Style, currentParams: any): any {
  return {
    ...currentParams,
    style: {
      fillColor: style.colors.primary,
      strokeColor: style.colors.secondary,
      backgroundColor: style.colors.background,
      strokeWidth: style.effects.strokeWidth,
      opacity: style.effects.opacity
    }
  }
}