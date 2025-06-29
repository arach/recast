'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Sparkles, Download, Clipboard } from 'lucide-react';

interface BrandPreset {
  name: string;
  description: string;
  preset: string;
  params: Record<string, any>;
  tags: string[];
}

interface BrandPresetsPanelProps {
  onApplyPreset: (preset: BrandPreset) => void;
  currentParams: Record<string, any>;
  currentPreset: string;
}

const EXAMPLE_BRAND_PRESETS: BrandPreset[] = [
  {
    name: "Fintech Triangle - Trustworthy Edge",
    description: "Sharp, professional, trustworthy with subtle sophistication",
    preset: "clean-triangle",
    params: {
      triangleType: 1,
      heightRatio: 1.15,
      baseWidth: 0.9,
      cornerRadius: 6,
      strokeWeight: 3,
      fillStyle: 2,
      brandHue: 210,
      brandSaturation: 0.85,
      brandLightness: 0.45,
      depth: 0.12,
      highlight: 0.18
    },
    tags: ["fintech", "professional", "trustworthy"]
  },
  {
    name: "Wellness Circle - Organic Calm",
    description: "Warm, breathing, natural with golden ratio harmony",
    preset: "golden-circle",
    params: {
      circleStyle: 1,
      goldenProportion: 1.618,
      organicVariation: 0.12,
      fillType: 3,
      brandHue: 95,
      warmth: 0.85,
      sophistication: 0.7,
      breathingMotion: 0.08,
      innerGlow: 0.25
    },
    tags: ["wellness", "organic", "calm"]
  },
  {
    name: "Gaming Hexagon - Neon Power",
    description: "Bold, energetic, modern with animated elements",
    preset: "smart-hexagon",
    params: {
      hexagonStyle: 2,
      cornerRadius: 15,
      aspectRatio: 1.1,
      strokeStyle: 4,
      strokeWeight: 4,
      fillStyle: 3,
      brandHue: 280,
      modernity: 0.95,
      surfaceSheen: 0.35
    },
    tags: ["gaming", "energetic", "modern"]
  },
  {
    name: "Luxury Diamond - Premium Elegance",
    description: "Sophisticated, exclusive with brilliant effects",
    preset: "dynamic-diamond",
    params: {
      diamondStyle: 2,
      carat: 1.3,
      cutPrecision: 0.98,
      facetStyle: 3,
      materialType: 1,
      brandHue: 45,
      luxury: 0.95,
      exclusivity: 0.9,
      brilliance: 0.85,
      scintillation: 0.4
    },
    tags: ["luxury", "premium", "exclusive"]
  },
  {
    name: "Startup Launch - Focused Ambition",
    description: "Clean, purposeful, ambitious with minimal distractions",
    preset: "minimal-line",
    params: {
      lineStyle: 0,
      precision: 0.98,
      simplicity: 0.95,
      refinement: 0.9,
      strokeWeight: 2,
      breathingSpace: 0.02,
      lineBreaks: 0.03,
      colorPhilosophy: 0,
      sophistication: 0.7,
      goldenRatio: 1.618,
      proportionalHarmony: 0.95
    },
    tags: ["startup", "focused", "minimal"]
  },
  {
    name: "Coffee Roastery - Artisan Craft",
    description: "Natural, handcrafted, authentic with organic character",
    preset: "organic-bark",
    params: {
      barkType: 1,
      growthComplexity: 0.8,
      naturalVariation: 0.9,
      organicFlow: 0.85,
      barkRoughness: 0.7,
      ridgeDepth: 0.5,
      growthRings: 0.6,
      branchMarks: 0.4,
      characterMarks: 0.5,
      treeAge: 0.7,
      woodHue: 30,
      weatheredTone: 0.7,
      naturalSaturation: 0.6
    },
    tags: ["artisan", "natural", "craft"]
  },
  {
    name: "AI Research Lab - Quantum Innovation",
    description: "Cutting-edge, scientific, mysterious with quantum effects",
    preset: "quantum-field",
    params: {
      quantumState: 2,
      fieldDensity: 0.8,
      waveFunction: 0.9,
      uncertainty: 0.3,
      superposition: 0.7,
      entanglement: 0.4,
      energyLevels: 9,
      probabilityCloud: 0.8,
      fieldLines: 0.9,
      particleTrails: 0.6,
      energySpectrum: 260,
      spectralWidth: 80,
      quantumGlow: 0.9
    },
    tags: ["research", "innovation", "scientific"]
  },
  {
    name: "Architecture Studio - Modernist Vision",
    description: "Structural, precise, professional with clean geometry",
    preset: "architectural-grid",
    params: {
      architecturalStyle: 1,
      gridDensity: 0.8,
      structuralOrder: 0.98,
      modularity: 0.9,
      lineWeight: 2,
      cornerSharpness: 3,
      fenestration: 0.5,
      curtainWall: 0.4,
      materialHonesty: 0.9,
      structuralExpression: 0.8,
      materialPalette: 1,
      materialHue: 220,
      industrialFinish: 0.7
    },
    tags: ["architecture", "modernist", "structural"]
  }
];

export function BrandPresetsPanel({ onApplyPreset, currentParams, currentPreset }: BrandPresetsPanelProps) {
  const [pasteValue, setPasteValue] = useState('');
  const [parseError, setParseError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [lastAppliedPreset, setLastAppliedPreset] = useState<any>(null);

  const handlePasteParams = () => {
    try {
      const parsed = JSON.parse(pasteValue);
      
      // Validate the structure
      if (!parsed.name || !parsed.preset || !parsed.params) {
        throw new Error('Invalid format. Must include name, preset, and params fields.');
      }

      onApplyPreset(parsed);
      setLastAppliedPreset(parsed);
      setParseError('');
      setSuccessMessage(`✅ Applied "${parsed.name}" successfully!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setParseError(error instanceof Error ? error.message : 'Invalid JSON format');
      setSuccessMessage('');
    }
  };

  const handleClearPaste = () => {
    setPasteValue('');
    setParseError('');
    setSuccessMessage('');
    setLastAppliedPreset(null);
  };

  const handleCopyCurrentParams = () => {
    const currentBrandPreset = {
      name: "Custom Brand Configuration",
      description: "Exported from current settings",
      preset: currentPreset,
      params: currentParams,
      tags: ["custom"]
    };

    navigator.clipboard.writeText(JSON.stringify(currentBrandPreset, null, 2));
  };

  const handleApplyExamplePreset = (preset: BrandPreset) => {
    onApplyPreset(preset);
  };

  const formatParamsForAI = () => {
    const presetName = currentPreset.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    const parameterGuide = getParameterGuide(currentPreset);
    
    const aiPrompt = `Generate ${presetName} brand parameters for a [BRAND_TYPE] that should feel [PERSONALITY].

${parameterGuide}

Format your response as valid JSON:
{
  "name": "Brand Name - Personality Description",
  "description": "Brief description of the brand feeling and ideal use cases",
  "preset": "${currentPreset}",
  "params": {
    // Use the parameters above to create the perfect brand personality
  },
  "tags": ["tag1", "tag2", "tag3"]
}

Generate a unique brand preset that captures the requested personality through mathematical precision.`;

    navigator.clipboard.writeText(aiPrompt);
  };

  const getParameterGuide = (preset: string) => {
    switch (preset) {
      case 'clean-triangle':
        return `Available parameters:
- triangleType: 0=Equilateral, 1=Isosceles, 2=Scalene, 3=Right, 4=Acute
- heightRatio: 0.6-1.8 (shape proportions)
- cornerRadius: 0-20 (0=sharp/precise, 20=soft/friendly)
- strokeWeight: 0-8 (border thickness)
- fillStyle: 0=None, 1=Solid, 2=Gradient, 3=Texture
- brandHue: 0-360 (color: 210=trust blue, 25=energy orange, 95=nature green)
- brandSaturation: 0.2-1 (color intensity)
- brandLightness: 0.3-0.7 (brightness)

Psychology: Sharp corners = tech/precise, Soft = friendly, Isosceles = stable`;

      case 'golden-circle':
        return `Available parameters:
- circleStyle: 0=Perfect, 1=Organic, 2=Spiral, 3=Segmented, 4=Breathing
- organicVariation: 0-0.3 (natural irregularity)
- fillType: 0=None, 1=Solid, 2=Radial, 3=Fibonacci Gradient
- brandHue: 0-360 (color hue)
- warmth: 0.3-1 (color warmth)
- sophistication: 0.4-0.9 (refinement level)
- breathingMotion: 0-0.2 (subtle life-like animation)

Psychology: Organic = wellness, Perfect = tech with warmth, High warmth = approachable`;

      case 'smart-hexagon':
        return `Available parameters:
- hexagonStyle: 0=Regular, 1=Stretched, 2=Rotated, 3=Beveled, 4=Nested
- cornerRadius: 0-30 (corner softness)
- strokeStyle: 0=None, 1=Clean, 2=Double, 3=Gradient, 4=Animated
- fillStyle: 0=None, 1=Solid, 2=Linear, 3=Radial, 4=Geometric
- brandHue: 0-360 (color hue)
- corporate: 0.4-1 (professional feel)
- modernity: 0.3-1 (modern edge)

Psychology: Regular = corporate, Rotated = dynamic, High corporate = enterprise`;

      case 'dynamic-diamond':
        return `Available parameters:
- diamondStyle: 0=Classic, 1=Elongated, 2=Brilliant, 3=Marquise, 4=Emerald
- carat: 0.5-2 (size/presence)
- cutPrecision: 0.7-1 (geometric perfection)
- facetStyle: 0=None, 1=Minimal, 2=Classic, 3=Brilliant
- materialType: 0=Crystal, 1=Platinum, 2=Gold, 3=Carbon, 4=Prismatic
- luxury: 0.6-1 (luxury factor)
- brilliance: 0.3-1 (shine intensity)

Psychology: Brilliant cut = max luxury, Crystal = high-tech, Gold = traditional luxury`;

      default:
        return `Available parameters: ${Object.keys(currentParams).join(', ')}`;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            AI Brand Presets
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Parameter Paste Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-600">
                Paste AI-Generated Parameters:
              </label>
              {pasteValue && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={handleClearPaste}
                  className="h-6 px-2 text-xs text-gray-500"
                >
                  Clear
                </Button>
              )}
            </div>
            
            <Textarea
              placeholder={`{
  "name": "Your Brand Name",
  "preset": "${currentPreset}",
  "params": {
    "brandHue": 210,
    "cornerRadius": 8,
    ...
  }
}`}
              value={pasteValue || (lastAppliedPreset ? JSON.stringify(lastAppliedPreset, null, 2) : '')}
              onChange={(e) => {
                setPasteValue(e.target.value);
                setParseError('');
                setSuccessMessage('');
                setLastAppliedPreset(null);
              }}
              className="text-xs font-mono"
              rows={8}
            />
            
            {/* Feedback Messages */}
            {successMessage && (
              <p className="text-xs text-green-600 bg-green-50 p-2 rounded border border-green-200">
                {successMessage}
              </p>
            )}
            
            {parseError && (
              <p className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                ❌ {parseError}
              </p>
            )}
            
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={handlePasteParams}
                disabled={!pasteValue.trim() || !!lastAppliedPreset}
                className="flex-1"
              >
                <Clipboard className="h-3 w-3 mr-1" />
                {lastAppliedPreset ? 'Applied' : 'Apply Parameters'}
              </Button>
              
              <Button 
                size="sm" 
                variant="outline"
                onClick={formatParamsForAI}
                title="Copy AI prompt to clipboard"
              >
                <Sparkles className="h-3 w-3" />
              </Button>
            </div>
            
            {lastAppliedPreset && (
              <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded border border-blue-200">
                💡 You can now edit these parameters directly in the JSON above, then click Apply to update.
              </p>
            )}
          </div>

          {/* Export Current */}
          <div className="pt-2 border-t">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleCopyCurrentParams}
              className="w-full"
            >
              <Copy className="h-3 w-3 mr-1" />
              Export Current Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Example Brand Presets */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">
            Example Brand Personalities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {EXAMPLE_BRAND_PRESETS.map((preset, index) => (
            <div 
              key={index}
              className="border rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => handleApplyExamplePreset(preset)}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-sm font-medium">{preset.name}</h4>
                  <p className="text-xs text-gray-600 mt-1">{preset.description}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {preset.preset.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {preset.tags.map((tag, tagIndex) => (
                  <Badge key={tagIndex} variant="secondary" className="text-xs px-1.5 py-0.5">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* AI Integration Guide */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">
            🤖 AI Integration Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-gray-600 space-y-2">
          <div>
            <strong>Step 1:</strong> Click the ✨ button to copy AI prompt
          </div>
          <div>
            <strong>Step 2:</strong> Paste prompt to your AI (Claude, GPT, etc.)
          </div>
          <div>
            <strong>Step 3:</strong> Copy AI's JSON response
          </div>
          <div>
            <strong>Step 4:</strong> Paste here and click "Apply Parameters"
          </div>
          <div className="pt-2 text-xs font-medium text-blue-600">
            Coming soon: Direct MCP integration for real-time AI collaboration!
          </div>
        </CardContent>
      </Card>
    </div>
  );
}