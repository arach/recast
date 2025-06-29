# 🤖 AI Brand Preset Generation Templates

## Quick Copy-Paste Prompts for AI Partners

### 1. **Generic Brand Preset Generator**
```
Generate brand parameters for ReCast's mathematical logo system. I need a JSON preset for a [BRAND_TYPE] brand that feels [PERSONALITY_TRAITS].

Available presets to choose from:
- clean-triangle: Perfect geometric triangles (tech, modern, forward-thinking)
- golden-circle: Fibonacci-based circles (warm, organic, approachable)  
- smart-hexagon: Modern structured hexagons (corporate, professional)
- dynamic-diamond: Luxury diamond cuts (premium, exclusive, sophisticated)

Format your response as valid JSON:
{
  "name": "Brand Name - Personality Description",
  "description": "Brief description of the brand feeling and ideal use cases",
  "preset": "clean-triangle|golden-circle|smart-hexagon|dynamic-diamond",
  "params": {
    // See parameter guides below for each preset type
  },
  "tags": ["tag1", "tag2", "tag3"]
}

Generate 3 different variations with distinct personalities.
```

### 2. **Clean Triangle Parameters**
```
Generate Clean Triangle brand parameters for a [BRAND_TYPE] that should feel [PERSONALITY].

Available parameters:
- triangleType: 0=Equilateral, 1=Isosceles, 2=Scalene, 3=Right, 4=Acute
- heightRatio: 0.6-1.8 (shape proportions)
- baseWidth: 0.7-1.5 (width scaling)
- cornerRadius: 0-20 (softness, 0=sharp, 20=very rounded)
- strokeWeight: 0-8 (border thickness, 0=no border)
- fillStyle: 0=None, 1=Solid, 2=Gradient, 3=Minimal Texture
- brandHue: 0-360 (color hue)
- brandSaturation: 0.2-1 (color intensity)
- brandLightness: 0.3-0.7 (brightness)
- depth: 0-0.5 (subtle shadow depth)
- highlight: 0-0.4 (brand highlight intensity)

Consider: 
- Sharp corners (radius 0-5) = tech/precise
- Soft corners (radius 10-20) = friendly/approachable
- Isosceles/Right triangles = stable/trustworthy
- Acute triangles = dynamic/cutting-edge
```

### 3. **Golden Circle Parameters**
```
Generate Golden Circle brand parameters for a [BRAND_TYPE] that should feel [PERSONALITY].

Available parameters:
- circleStyle: 0=Perfect, 1=Organic, 2=Spiral, 3=Segmented, 4=Breathing
- goldenProportion: 0.5-2 (usually 1.618 for golden ratio)
- fibonacciInfluence: 0-1 (spiral mathematics influence)
- organicVariation: 0-0.3 (natural irregularity)
- mathematicalPurity: 0.7-1 (geometric precision vs organic)
- fillType: 0=None, 1=Solid, 2=Radial, 3=Fibonacci Gradient
- brandHue: 0-360 (color hue)
- warmth: 0.3-1 (color warmth)
- sophistication: 0.4-0.9 (color complexity)
- breathingMotion: 0-0.2 (subtle animation)
- innerGlow: 0-0.4 (inner radiance)

Consider:
- Organic style = natural/wellness brands
- Perfect/Spiral = tech with warmth
- High warmth = friendly/approachable
- Low breathing motion = stable/reliable
```

### 4. **Smart Hexagon Parameters**
```
Generate Smart Hexagon brand parameters for a [BRAND_TYPE] that should feel [PERSONALITY].

Available parameters:
- hexagonStyle: 0=Regular, 1=Stretched, 2=Rotated, 3=Beveled, 4=Nested
- cornerRadius: 0-30 (corner softness)
- aspectRatio: 0.7-1.5 (width/height ratio)
- strokeStyle: 0=None, 1=Clean, 2=Double, 3=Gradient, 4=Animated
- strokeWeight: 1-10 (border thickness)
- fillStyle: 0=None, 1=Solid, 2=Linear, 3=Radial, 4=Geometric
- brandHue: 0-360 (color hue)
- corporate: 0.4-1 (professional feel)
- modernity: 0.3-1 (modern edge)
- surfaceSheen: 0-0.4 (surface highlight)

Consider:
- Regular hexagon = structured/corporate
- Rotated/Beveled = dynamic/modern
- High corporate value = professional/enterprise
- Animated stroke = gaming/tech
```

### 5. **Dynamic Diamond Parameters**
```
Generate Dynamic Diamond brand parameters for a [BRAND_TYPE] that should feel [PERSONALITY].

Available parameters:
- diamondStyle: 0=Classic, 1=Elongated, 2=Brilliant, 3=Marquise, 4=Emerald
- carat: 0.5-2 (size multiplier)
- cutPrecision: 0.7-1 (geometric precision)
- facetStyle: 0=None, 1=Minimal, 2=Classic, 3=Brilliant
- materialType: 0=Crystal, 1=Platinum, 2=Gold, 3=Carbon, 4=Prismatic
- brandHue: 0-360 (color hue)
- luxury: 0.6-1 (luxury factor)
- exclusivity: 0.5-1 (exclusivity level)
- brilliance: 0.3-1 (shine intensity)
- fireDispersion: 0-0.4 (rainbow effect)
- scintillation: 0-0.6 (sparkle intensity)

Consider:
- Brilliant cut + high facets = maximum luxury
- Crystal/Platinum = clean/high-tech luxury
- Gold = warm/traditional luxury
- High fire dispersion = creative/artistic
```

## Example AI Conversations

### Example 1: Fintech Startup
**User:** "Generate Clean Triangle parameters for a fintech startup that should feel trustworthy but innovative"

**Expected AI Response:**
```json
{
  "name": "Fintech Triangle - Trustworthy Innovation",
  "description": "Sharp precision meets reliable stability - perfect for next-gen financial platforms",
  "preset": "clean-triangle", 
  "params": {
    "triangleType": 1,
    "heightRatio": 1.15,
    "baseWidth": 0.9,
    "cornerRadius": 6,
    "strokeWeight": 3,
    "fillStyle": 2,
    "brandHue": 210,
    "brandSaturation": 0.85,
    "brandLightness": 0.45,
    "depth": 0.12,
    "highlight": 0.18
  },
  "tags": ["fintech", "trustworthy", "innovative", "professional"]
}
```

### Example 2: Wellness App
**User:** "Generate Golden Circle parameters for a meditation app that should feel calming and natural"

**Expected AI Response:**
```json
{
  "name": "Meditation Circle - Zen Flow",
  "description": "Gentle breathing rhythm with natural organic flow - perfect for mindfulness and wellness",
  "preset": "golden-circle",
  "params": {
    "circleStyle": 1,
    "goldenProportion": 1.618,
    "organicVariation": 0.15,
    "fillType": 3,
    "brandHue": 95,
    "warmth": 0.85,
    "sophistication": 0.7,
    "breathingMotion": 0.12,
    "innerGlow": 0.25
  },
  "tags": ["meditation", "calming", "natural", "wellness"]
}
```

## Parameter Psychology Guide

### Color Psychology (brandHue values):
- **0-30°** (Red-Orange): Energy, passion, urgency
- **30-60°** (Orange-Yellow): Warmth, creativity, optimism  
- **60-120°** (Yellow-Green): Growth, nature, freshness
- **120-180°** (Green-Cyan): Trust, health, stability
- **180-240°** (Cyan-Blue): Technology, professionalism, calm
- **240-300°** (Blue-Purple): Luxury, creativity, innovation
- **300-360°** (Purple-Red): Premium, artistic, mysterious

### Personality Mapping:
- **Sharp/Precise**: Low corner radius, high precision, geometric styles
- **Warm/Friendly**: High warmth, organic variations, soft corners
- **Luxury/Premium**: High luxury/exclusivity, brilliant effects, precious materials
- **Professional/Corporate**: High corporate values, structured styles, moderate effects
- **Creative/Artistic**: High fire dispersion, prismatic materials, unique cuts
- **Trustworthy/Stable**: Isosceles triangles, perfect circles, consistent parameters

## Tips for AI Prompting:
1. **Be Specific**: Mention exact personality traits you want
2. **Provide Context**: Industry, target audience, use cases
3. **Request Variations**: Ask for multiple options with different approaches
4. **Iterate**: Use AI feedback to refine and adjust parameters
5. **Test Psychology**: Ask AI to explain the psychology behind parameter choices