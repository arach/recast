/**
 * Industry-specific preset packs for immediate brand connection
 * Each pack curates presets, themes, and defaults for specific industries
 */

export interface IndustryPack {
  id: string;
  name: string;
  icon: string;
  description: string;
  vibe: string[];
  presets: Array<{
    id: string;
    name: string;
    reason: string; // Why this preset works for this industry
  }>;
  defaultParams?: {
    // Universal control defaults for this industry
    backgroundColor?: string;
    backgroundType?: 'transparent' | 'solid' | 'gradient';
    fillColor?: string;
    strokeColor?: string;
    // Preset-specific overrides
    [preset: string]: any;
  };
  colorSuggestions?: string[]; // For future color theme integration
  seedSuggestions?: string[]; // Industry-relevant seed words
}

export const industryPacks: IndustryPack[] = [
  {
    id: 'tech-startup',
    name: 'Tech & Startup',
    icon: '🚀',
    description: 'Innovation, disruption, and future-forward thinking',
    vibe: ['innovative', 'dynamic', 'clean', 'forward-thinking'],
    presets: [
      {
        id: 'simple-prism',
        name: 'Isometric Prism',
        reason: 'Perfect for AI/ML companies - shows processing and transformation'
      },
      {
        id: 'quantum-field',
        name: 'Quantum Field',
        reason: 'Cutting-edge tech vibes - quantum computing, advanced algorithms'
      },
      {
        id: 'network-constellation',
        name: 'Network Constellation',
        reason: 'Great for platforms, APIs, and connected services'
      },
      {
        id: 'nexus-ai-brand',
        name: 'Nexus AI',
        reason: 'Purpose-built for AI/tech companies with node connections'
      }
    ],
    defaultParams: {
      backgroundType: 'transparent',
      fillColor: '#3b82f6', // Tech blue
      strokeColor: '#1e40af',
      // Preset-specific optimizations
      'simple-prism': {
        text: 'TECH',
        fontSize: 28,
        perspectiveAngle: 30,
        showInternalStructure: true
      },
      'quantum-field': {
        particleCount: 150,
        connectionDistance: 0.3
      }
    },
    colorSuggestions: ['#3b82f6', '#8b5cf6', '#10b981', '#06b6d4'],
    seedSuggestions: ['innovation', 'quantum', 'neural', 'digital', 'cyber', 'matrix']
  },
  
  {
    id: 'fashion-beauty',
    name: 'Fashion & Beauty',
    icon: '✨',
    description: 'Elegance, sophistication, and timeless luxury',
    vibe: ['elegant', 'sophisticated', 'luxurious', 'refined'],
    presets: [
      {
        id: 'liquid-flow',
        name: 'Liquid Flow',
        reason: 'Flowing, graceful movement perfect for beauty brands'
      },
      {
        id: 'luxury-brand',
        name: 'Luxury Brand',
        reason: 'Premium positioning with sophisticated geometry'
      },
      {
        id: 'golden-circle',
        name: 'Golden Circle',
        reason: 'Timeless elegance with perfect proportions'
      },
      {
        id: 'sophisticated-strokes',
        name: 'Sophisticated Strokes',
        reason: 'Artistic brushwork for creative fashion houses'
      }
    ],
    defaultParams: {
      backgroundType: 'solid',
      backgroundColor: '#fafafa',
      fillColor: '#000000',
      strokeColor: '#404040',
      'liquid-flow': {
        flowSpeed: 0.3,
        viscosity: 0.8,
        colorShift: 0.1
      },
      'luxury-brand': {
        geometryComplexity: 0.7,
        animationSubtlety: 0.8
      }
    },
    colorSuggestions: ['#000000', '#d4af37', '#fbbfbc', '#e8dfd6'],
    seedSuggestions: ['elegance', 'couture', 'atelier', 'luxury', 'refined', 'grace']
  },
  
  {
    id: 'finance-professional',
    name: 'Finance & Professional',
    icon: '📊',
    description: 'Trust, stability, and professional expertise',
    vibe: ['trustworthy', 'stable', 'professional', 'authoritative'],
    presets: [
      {
        id: 'architectural-grid',
        name: 'Architectural Grid',
        reason: 'Structure and stability - perfect for banks and institutions'
      },
      {
        id: 'clean-triangle',
        name: 'Clean Triangle',
        reason: 'Upward momentum and growth visualization'
      },
      {
        id: 'smart-hexagon',
        name: 'Smart Hexagon',
        reason: 'Efficiency and interconnected strength'
      },
      {
        id: 'minimal-line',
        name: 'Minimal Line',
        reason: 'Clean, professional, no-nonsense approach'
      }
    ],
    defaultParams: {
      backgroundType: 'solid',
      backgroundColor: '#ffffff',
      fillColor: '#1e3a8a', // Professional blue
      strokeColor: '#1e293b',
      'architectural-grid': {
        gridDensity: 0.4,
        lineWeight: 2,
        animationSpeed: 0.2
      },
      'clean-triangle': {
        sharpness: 0.9,
        stability: 0.8
      }
    },
    colorSuggestions: ['#1e3a8a', '#0f172a', '#16a34a', '#64748b'],
    seedSuggestions: ['trust', 'growth', 'stability', 'secure', 'premium', 'legacy']
  },
  
  {
    id: 'health-wellness',
    name: 'Health & Wellness',
    icon: '🌿',
    description: 'Balance, vitality, and natural harmony',
    vibe: ['calming', 'natural', 'balanced', 'healing'],
    presets: [
      {
        id: 'pulse-spotify',
        name: 'Pulse',
        reason: 'Rhythmic heartbeat patterns for health monitoring apps'
      },
      {
        id: 'wave-bars',
        name: 'Wave Bars', 
        reason: 'Breathing visualization and meditation apps'
      },
      {
        id: 'organic-bark',
        name: 'Organic Bark',
        reason: 'Natural, earthy feel for organic wellness brands'
      },
      {
        id: 'golden-circle',
        name: 'Golden Circle',
        reason: 'Harmony and balance with golden ratio proportions'
      }
    ],
    defaultParams: {
      backgroundType: 'solid',
      backgroundColor: '#f0fdf4',
      fillColor: '#22c55e',
      strokeColor: '#16a34a',
      'pulse-spotify': {
        pulseSpeed: 0.5,
        breathingDepth: 0.3
      },
      'wave-bars': {
        frequency: 0.3,
        amplitude: 60,
        barCount: 12
      }
    },
    colorSuggestions: ['#22c55e', '#10b981', '#3b82f6', '#8b5cf6'],
    seedSuggestions: ['wellness', 'harmony', 'vitality', 'balance', 'natural', 'healing']
  },
  
  {
    id: 'entertainment-gaming',
    name: 'Entertainment & Gaming',
    icon: '🎮',
    description: 'Energy, excitement, and immersive experiences',
    vibe: ['energetic', 'dynamic', 'bold', 'playful'],
    presets: [
      {
        id: 'neon-glow',
        name: 'Neon Glow',
        reason: 'Vibrant neon effects for gaming brands'
      },
      {
        id: 'spinning-triangles',
        name: 'Spinning Triangles',
        reason: 'Dynamic motion for action-packed brands'
      },
      {
        id: 'infinity-loops',
        name: 'Infinity Loops',
        reason: 'Endless gameplay and entertainment cycles'
      },
      {
        id: 'dynamic-diamond',
        name: 'Dynamic Diamond',
        reason: 'Premium gaming and achievement systems'
      }
    ],
    defaultParams: {
      backgroundType: 'solid',
      backgroundColor: '#0f0f23',
      fillColor: '#a855f7',
      strokeColor: '#e11d48',
      'neon-glow': {
        glowIntensity: 0.9,
        pulseSpeed: 0.8,
        colorShift: 0.3
      },
      'spinning-triangles': {
        rotationSpeed: 0.7,
        triangleCount: 6
      }
    },
    colorSuggestions: ['#a855f7', '#e11d48', '#06b6d4', '#f59e0b'],
    seedSuggestions: ['epic', 'power', 'adventure', 'quest', 'arcade', 'victory']
  },
  
  {
    id: 'food-beverage',
    name: 'Food & Beverage',
    icon: '🍽️',
    description: 'Appetite appeal, craft quality, and warmth',
    vibe: ['appetizing', 'warm', 'crafted', 'inviting'],
    presets: [
      {
        id: 'organic-bark',
        name: 'Organic Bark',
        reason: 'Perfect for craft breweries and artisanal brands'
      },
      {
        id: 'hand-sketch',
        name: 'Hand Sketch',
        reason: 'Handcrafted feel for restaurants and cafes'
      },
      {
        id: 'golden-circle',
        name: 'Golden Circle',
        reason: 'Premium dining and gourmet brands'
      },
      {
        id: 'wave-bars',
        name: 'Wave Bars',
        reason: 'Coffee steam or beverage flow visualization'
      }
    ],
    defaultParams: {
      backgroundType: 'solid',
      backgroundColor: '#fffbeb',
      fillColor: '#d97706',
      strokeColor: '#92400e',
      'organic-bark': {
        woodHue: 30,
        naturalVariation: 0.8
      },
      'hand-sketch': {
        sketchRoughness: 0.6,
        lineWeight: 3
      }
    },
    colorSuggestions: ['#d97706', '#dc2626', '#16a34a', '#7c2d12'],
    seedSuggestions: ['artisan', 'craft', 'fresh', 'organic', 'farm', 'harvest']
  }
];

/**
 * Get recommended presets for an industry
 */
export function getIndustryPresets(industryId: string) {
  const pack = industryPacks.find(p => p.id === industryId);
  return pack?.presets || [];
}

/**
 * Get default parameters for a preset within an industry context
 */
export function getIndustryDefaults(industryId: string, presetId?: string) {
  const pack = industryPacks.find(p => p.id === industryId);
  if (!pack) return {};
  
  const baseDefaults = {
    backgroundColor: pack.defaultParams?.backgroundColor,
    backgroundType: pack.defaultParams?.backgroundType,
    fillColor: pack.defaultParams?.fillColor,
    strokeColor: pack.defaultParams?.strokeColor,
  };
  
  if (presetId && pack.defaultParams?.[presetId]) {
    return { ...baseDefaults, ...pack.defaultParams[presetId] };
  }
  
  return baseDefaults;
}

/**
 * Get a random seed word suggestion for an industry
 */
export function getIndustrySeedSuggestion(industryId: string): string {
  const pack = industryPacks.find(p => p.id === industryId);
  if (!pack || !pack.seedSuggestions) return '';
  
  const randomIndex = Math.floor(Math.random() * pack.seedSuggestions.length);
  return pack.seedSuggestions[randomIndex];
}