/**
 * Color theme system for ReCast
 * Provides curated color palettes that override universal controls
 * Designed to give instant brand personality after industry selection
 */

export interface ColorTheme {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;      // Main fill color
    secondary: string;    // Stroke/accent color
    background: string;   // Background color
    accent?: string;      // Optional third color for effects
  };
  preview: string[];      // Array of colors for preview strip
  vibe: string[];        // Emotional descriptors
  industries?: string[]; // Recommended industries (optional)
}

export const colorThemes: ColorTheme[] = [
  {
    id: 'ocean-depth',
    name: 'Ocean Depth',
    description: 'Deep blues and teals for trust and stability',
    colors: {
      primary: '#0369a1',
      secondary: '#0e7490',
      background: '#f0f9ff',
      accent: '#06b6d4'
    },
    preview: ['#0369a1', '#0e7490', '#06b6d4', '#f0f9ff'],
    vibe: ['trustworthy', 'calm', 'professional'],
    industries: ['finance-professional', 'health-wellness', 'tech-startup']
  },
  
  {
    id: 'midnight-electric',
    name: 'Midnight Electric',
    description: 'Dark mode with electric accents',
    colors: {
      primary: '#8b5cf6',
      secondary: '#ec4899',
      background: '#0f0f23',
      accent: '#06b6d4'
    },
    preview: ['#8b5cf6', '#ec4899', '#06b6d4', '#0f0f23'],
    vibe: ['modern', 'bold', 'innovative'],
    industries: ['tech-startup', 'entertainment-gaming']
  },
  
  {
    id: 'sunset-warmth',
    name: 'Sunset Warmth',
    description: 'Warm oranges and reds for energy and appetite',
    colors: {
      primary: '#ea580c',
      secondary: '#dc2626',
      background: '#fff7ed',
      accent: '#f59e0b'
    },
    preview: ['#ea580c', '#dc2626', '#f59e0b', '#fff7ed'],
    vibe: ['energetic', 'warm', 'inviting'],
    industries: ['food-beverage', 'entertainment-gaming']
  },
  
  {
    id: 'forest-fresh',
    name: 'Forest Fresh',
    description: 'Natural greens for growth and wellness',
    colors: {
      primary: '#16a34a',
      secondary: '#15803d',
      background: '#f0fdf4',
      accent: '#22c55e'
    },
    preview: ['#16a34a', '#15803d', '#22c55e', '#f0fdf4'],
    vibe: ['natural', 'healthy', 'sustainable'],
    industries: ['health-wellness', 'food-beverage']
  },
  
  {
    id: 'noir-elegance',
    name: 'Noir Elegance',
    description: 'Sophisticated black and white with gold accents',
    colors: {
      primary: '#000000',
      secondary: '#404040',
      background: '#ffffff',
      accent: '#d4af37'
    },
    preview: ['#000000', '#404040', '#d4af37', '#ffffff'],
    vibe: ['luxury', 'sophisticated', 'timeless'],
    industries: ['fashion-beauty', 'finance-professional']
  },
  
  {
    id: 'rose-garden',
    name: 'Rose Garden',
    description: 'Soft pinks and purples for beauty and creativity',
    colors: {
      primary: '#ec4899',
      secondary: '#db2777',
      background: '#fdf2f8',
      accent: '#f9a8d4'
    },
    preview: ['#ec4899', '#db2777', '#f9a8d4', '#fdf2f8'],
    vibe: ['feminine', 'creative', 'gentle'],
    industries: ['fashion-beauty', 'health-wellness']
  },
  
  {
    id: 'cyber-neon',
    name: 'Cyber Neon',
    description: 'Bright neons on dark for maximum impact',
    colors: {
      primary: '#00ff88',
      secondary: '#ff0080',
      background: '#000000',
      accent: '#00ddff'
    },
    preview: ['#00ff88', '#ff0080', '#00ddff', '#000000'],
    vibe: ['futuristic', 'bold', 'electric'],
    industries: ['entertainment-gaming', 'tech-startup']
  },
  
  {
    id: 'earth-craft',
    name: 'Earth & Craft',
    description: 'Browns and warm neutrals for artisanal brands',
    colors: {
      primary: '#92400e',
      secondary: '#78350f',
      background: '#fef3c7',
      accent: '#d97706'
    },
    preview: ['#92400e', '#78350f', '#d97706', '#fef3c7'],
    vibe: ['artisanal', 'authentic', 'crafted'],
    industries: ['food-beverage', 'fashion-beauty']
  },
  
  {
    id: 'aurora-dream',
    name: 'Aurora Dream',
    description: 'Gradient-friendly purples and blues',
    colors: {
      primary: '#7c3aed',
      secondary: '#2563eb',
      background: '#faf5ff',
      accent: '#a78bfa'
    },
    preview: ['#7c3aed', '#2563eb', '#a78bfa', '#faf5ff'],
    vibe: ['dreamy', 'creative', 'inspirational'],
    industries: ['tech-startup', 'health-wellness', 'fashion-beauty']
  },
  
  {
    id: 'monochrome-pro',
    name: 'Monochrome Pro',
    description: 'Professional grayscale for any industry',
    colors: {
      primary: '#374151',
      secondary: '#111827',
      background: '#f9fafb',
      accent: '#6b7280'
    },
    preview: ['#374151', '#111827', '#6b7280', '#f9fafb'],
    vibe: ['professional', 'neutral', 'versatile'],
    industries: [] // Works for all
  }
];

/**
 * Apply a color theme to current parameters
 */
export function applyColorTheme(theme: ColorTheme, currentParams: Record<string, any>): Record<string, any> {
  // STRICT: Only return the exact color parameters allowed by handleApplyColorTheme
  // This prevents any template contamination or unexpected parameter changes
  const allowedColorParams = [
    'fillColor', 'strokeColor', 'backgroundColor', 'textColor',
    'backgroundGradientStart', 'backgroundGradientEnd',
    'fillGradientStart', 'fillGradientEnd',
    'strokeGradientStart', 'strokeGradientEnd',
    'colorMode' // Preserve Wave template color mode setting
  ];
  
  // Build the color parameters object with only allowed parameters
  const colorParams: Record<string, any> = {
    // Core colors
    fillColor: theme.colors.primary,
    strokeColor: theme.colors.secondary,
    backgroundColor: theme.colors.background,
    textColor: isLightColor(theme.colors.background) ? '#000000' : '#ffffff',
    
    // Gradient colors (if accent color is available)
    ...(theme.colors.accent && {
      fillGradientStart: theme.colors.primary,
      fillGradientEnd: theme.colors.accent,
      strokeGradientStart: theme.colors.secondary,
      strokeGradientEnd: theme.colors.accent,
      backgroundGradientStart: theme.colors.background,
      backgroundGradientEnd: adjustColorBrightness(theme.colors.background, 0.9)
    })
  };
  
  // Preserve colorMode from current parameters if it exists
  if (currentParams.colorMode) {
    colorParams.colorMode = currentParams.colorMode;
  }

  // Filter to only include allowed parameters
  const filteredParams: Record<string, any> = {};
  for (const [key, value] of Object.entries(colorParams)) {
    if (allowedColorParams.includes(key)) {
      filteredParams[key] = value;
    }
  }
  
  return filteredParams;
}

/**
 * Helper to adjust color brightness
 */
function adjustColorBrightness(hex: string, factor: number): string {
  const rgb = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.floor(((rgb >> 16) & 0xff) * factor));
  const g = Math.min(255, Math.floor(((rgb >> 8) & 0xff) * factor));
  const b = Math.min(255, Math.floor((rgb & 0xff) * factor));
  
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/**
 * Get themes recommended for a specific industry
 */
export function getThemesForIndustry(industryId: string): ColorTheme[] {
  // First, get themes specifically recommended for this industry
  const recommendedThemes = colorThemes.filter(
    theme => theme.industries?.includes(industryId)
  );
  
  // Then add universal themes that work for any industry
  const universalThemes = colorThemes.filter(
    theme => !theme.industries || theme.industries.length === 0
  );
  
  // Return recommended first, then universal
  return [...recommendedThemes, ...universalThemes];
}

/**
 * Helper to determine if a color is light or dark
 */
function isLightColor(hex: string): boolean {
  const rgb = parseInt(hex.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >>  8) & 0xff;
  const b = (rgb >>  0) & 0xff;
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}