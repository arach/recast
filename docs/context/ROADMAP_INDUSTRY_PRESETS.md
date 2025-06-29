# Industry-Specific Preset Packs Roadmap

## Vision
Create curated preset collections that give users immediate emotional connection based on their industry. Users should feel "this was made for me" within seconds.

## Industry Categories

### 1. Tech/Startup
- **Vibe**: Innovation, disruption, future-forward
- **Characteristics**: 
  - Geometric shapes, clean lines
  - Blues, greens, purples
  - Dynamic, energetic animations
  - Examples: Isometric Prism, Quantum Field, Network Constellation

### 2. Fashion/Beauty
- **Vibe**: Elegance, sophistication, luxury
- **Characteristics**:
  - Flowing, organic forms
  - Blacks, golds, pastels
  - Smooth, graceful animations
  - Examples: Liquid Flow, Luxury Brand, Golden Circle

### 3. Food/Beverage
- **Vibe**: Warmth, appetite appeal, craft
- **Characteristics**:
  - Organic shapes, natural patterns
  - Warm colors, earth tones
  - Playful, appetizing motion
  - Examples: Organic Bark (craft beer?), Hand Sketch (artisanal)

### 4. Finance/Professional
- **Vibe**: Trust, stability, expertise
- **Characteristics**:
  - Strong geometrics, grids
  - Blues, grays, conservative palette
  - Subtle, confident animations
  - Examples: Architectural Grid, Clean Triangle

### 5. Health/Wellness
- **Vibe**: Vitality, balance, growth
- **Characteristics**:
  - Natural forms, breathing motion
  - Greens, blues, whites
  - Calming, rhythmic animations
  - Examples: Pulse (heartbeat), Wave Bars (breathing)

### 6. Entertainment/Gaming
- **Vibe**: Energy, excitement, immersion
- **Characteristics**:
  - Bold shapes, dynamic effects
  - Vibrant colors, neon accents
  - High-energy animations
  - Examples: Neon Glow, Spinning Triangles

## Implementation Plan

### Phase 1: Preset Curation
- Tag existing presets by industry
- Identify gaps where new presets are needed
- Create 3-5 signature presets per industry

### Phase 2: UI Integration
```typescript
// Industry selector in UI
interface IndustryPack {
  id: string;
  name: string;
  description: string;
  vibe: string[];
  presets: string[];
  colorThemes: string[]; // For future integration
  defaultParams?: Record<string, any>;
}
```

### Phase 3: Smart Defaults
- Each industry pack includes optimized parameter defaults
- Pre-configured universal controls (e.g., Tech = transparent bg, Finance = solid bg)
- Suggested seed words that resonate with the industry

## Success Metrics
- Time to first "wow" moment < 10 seconds
- Users finding relevant preset on first try
- Emotional connection reported in feedback

## Future Integration Points
- Color themes will layer on top of industry selection
- AI suggestions will learn from industry context
- Brand personality will refine within industry bounds