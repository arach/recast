// Core type definitions for ReFlow

// Shape: The visualization algorithm
export interface Shape {
  id: string
  name: string              // "Wave Lines", "Circular Burst"
  code: string              // The visualization algorithm
  supportedParams: string[] // Which params this shape responds to
  category: string          // "geometric", "organic", "dynamic"
  createdAt?: number
  updatedAt?: number
}

// Style: Visual appearance - portable across shapes
export interface Style {
  id: string
  name: string              // "Bold & Modern", "Soft & Elegant"
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
  }
  effects: {
    strokeWidth: number
    opacity: number
    blur: number
    glow: boolean
  }
  mood: {
    energy: number        // 0-1 (calm to energetic)
    formality: number     // 0-1 (playful to serious)
    complexity: number    // 0-1 (minimal to detailed)
  }
}

// Theme: Curated library combination of shape + style + params
export interface Theme {
  id: string
  name: string              // "Tech Startup", "Luxury Brand", "Creative Agency"
  shapeId: string          
  styleId: string
  params: {
    // Core parameters
    frequency: number
    amplitude: number
    complexity: number
    chaos: number
    damping: number
    layers: number
    radius: number
    // Shape-specific params
    [key: string]: any
  }
  tags: string[]           // For discovery
  thumbnail?: string       // Preview image
}

// SavedLogo: User's customized instance
export interface SavedLogo {
  id: string
  name: string              // User's custom name
  baseThemeId?: string      // Which theme they started from
  shape: {
    id: string
    code?: string           // Custom code overrides
  }
  style: Style              // Full style (could be customized)
  parameters: {
    core: {
      frequency: number
      amplitude: number
      complexity: number
      chaos: number
      damping: number
      layers: number
      radius: number
    }
    style: {
      fillColor: string
      strokeColor: string
      backgroundColor: string
    }
    custom: Record<string, any>
  }
  createdAt: number
  updatedAt: number
}

// Brand Profile: Guides AI suggestions
export interface BrandProfile {
  personality: {
    innovative: number      // 0-1 scale
    trustworthy: number
    approachable: number
    sophisticated: number
  }
  industry: string         // Just for context/suggestions
  preferences: {
    colorIntensity: number
    animationSpeed: number
    geometricVsOrganic: number
  }
}

// Logo Instance: What's on canvas
export interface LogoInstance {
  id: string
  position: { x: number, y: number }
  themeId?: string          // If using a library theme
  savedLogoId?: string      // If using a saved logo
  
  // Current state (potentially modified from theme/saved)
  shapeId: string
  code: string              // Current code (from shape or custom)
  style: Style              // Current style
  parameters: {
    core: {
      frequency: number
      amplitude: number
      complexity: number
      chaos: number
      damping: number
      layers: number
      radius: number
    }
    style: {
      fillColor: string
      strokeColor: string
      backgroundColor: string
    }
    content: {
      text: string
      fontSize: number
      fontFamily: string
    }
    custom: Record<string, any>
  }
  
  // Legacy fields for compatibility during migration
  templateId?: string
  templateName?: string
}