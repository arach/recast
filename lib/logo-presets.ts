/**
 * ReFlow Logo Presets
 * 
 * Curated logo configurations that embody the ReFlow brand identity
 */

export const logoPresets = {
  // Primary wordmark - minimal and versatile
  wordmarkMinimal: {
    template: 'wordmark',
    params: {
      text: 'reflow',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: 48,
      fontWeight: 600,
      letterSpacing: -2,
      textTransform: 'lowercase',
      fillType: 'solid',
      fillColor: '#000000',
      strokeType: 'none',
      backgroundType: 'transparent',
      frequency: 0,
      amplitude: 0,
      seed: 'reflow-minimal-2024'
    }
  },

  // Infinite wave - signature flowing pattern
  infiniteWave: {
    template: 'wave-bars',
    params: {
      barCount: 32,
      barSpacing: 1,
      frequency: 2.4,
      amplitude: 45,
      phaseShift: 90,
      waveType: 'sine',
      colorMode: 'mono',
      fillType: 'gradient',
      fillGradientStart: '#0066FF',
      fillGradientEnd: '#00FFFF',
      fillGradientDirection: 45,
      animationSpeed: 0.8,
      seed: 'reflow-infinity-2024'
    }
  },

  // Spectrum flow - full creative expression
  spectrumFlow: {
    template: 'wave-bars',
    params: {
      barCount: 60,
      barSpacing: 0,
      frequency: 3.5,
      amplitude: 40,
      waveType: 'sine',
      colorMode: 'spectrum',
      animationSpeed: 0.8,
      showWavePath: true,
      pathOpacity: 0.2,
      seed: 'reflow-spectrum-2024'
    }
  },

  // Liquid mercury - adaptive identity
  liquidMercury: {
    template: 'liquid-flow',
    params: {
      liquidType: 3, // Mercury
      frequency: 0.8,
      amplitude: 120,
      viscosity: 0.7,
      surfaceTension: 0.9,
      transparency: 0.8,
      fluidHue: 220,
      purity: 0.3,
      luminosity: 0.8,
      seed: 'reflow-mercury-2024'
    }
  },

  // Pulse mark - heartbeat of brands
  pulseMark: {
    template: 'pulse-spotify',
    params: {
      pulseCount: 5,
      pulseSpeed: 1.2,
      maxRadius: 100,
      colorMode: 'mono',
      fillType: 'solid',
      fillColor: '#000000',
      fillOpacity: 0.8,
      strokeType: 'solid',
      strokeColor: '#000000',
      strokeWidth: 2,
      seed: 'reflow-pulse-2024'
    }
  },

  // Letter mark - compact identity
  letterMark: {
    template: 'letter-mark',
    params: {
      letter: 'R',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: 120,
      fontWeight: 700,
      fillType: 'gradient',
      fillGradientStart: '#7C3AED',
      fillGradientEnd: '#06B6D4',
      fillGradientDirection: 135,
      strokeType: 'none',
      backgroundType: 'transparent',
      containerType: 'circle',
      containerPadding: 20,
      seed: 'reflow-letter-2024'
    }
  },

  // Quantum field - probability and potential
  quantumBrand: {
    template: 'quantum-field',
    params: {
      frequency: 3.0,
      amplitude: 80,
      quantumStrength: 0.7,
      fieldComplexity: 0.6,
      colorScheme: 2,
      glowIntensity: 0.8,
      fillType: 'gradient',
      fillGradientStart: '#7C3AED',
      fillGradientEnd: '#06B6D4',
      seed: 'reflow-quantum-2024'
    }
  },

  // Neon current - electric vitality
  neonCurrent: {
    template: 'neon-glow',
    params: {
      glowIntensity: 0.9,
      pulseSpeed: 1.5,
      colorShift: true,
      primaryHue: 280,
      secondaryHue: 180,
      fillType: 'gradient',
      fillGradientStart: '#FF00FF',
      fillGradientEnd: '#00FFFF',
      seed: 'reflow-neon-2024'
    }
  }
}

/**
 * Generate shareable URL for a logo preset
 */
export function getLogoURL(presetName: keyof typeof logoPresets, baseURL = 'http://localhost:3001'): string {
  const preset = logoPresets[presetName]
  if (!preset) return baseURL
  
  const params = encodeURIComponent(JSON.stringify(preset.params))
  return `${baseURL}/?template=${preset.template}&params=${params}`
}

/**
 * Get logo preset for different contexts
 */
export const contextualLogos = {
  // Main brand identity
  primary: 'wordmarkMinimal',
  
  // Marketing and hero sections
  hero: 'spectrumFlow',
  
  // App icon / favicon
  icon: 'letterMark',
  
  // Loading states
  loading: 'pulseMark',
  
  // Dark mode variants
  darkMode: 'neonCurrent',
  
  // Enterprise/professional
  enterprise: 'liquidMercury',
  
  // Developer tools
  developer: 'quantumBrand'
}