'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Copy, Sparkles, Download, Clipboard } from 'lucide-react';
import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo';
import { useLogoStore } from '@/lib/stores/logoStore';

interface BrandPreset {
  name: string;
  description: string;
  preset: string;
  params: Record<string, any>;
  tags: string[];
}

const EXAMPLE_BRAND_PRESETS: BrandPreset[] = [
  {
    name: "Fintech Triangle - Trustworthy Edge",
    description: "Sharp, professional, trustworthy with subtle sophistication",
    preset: "clean-triangle",
    params: {
      triangleType: 1,
      triangleRotation: 30,
      fillType: "solid",
      fillColor: "#1a365d",
      strokeType: "none",
      cornerRadius: 5,
      animation: false,
      frequency: 2.5,
      amplitude: 85,
      complexity: 0.15,
      chaos: 0.05,
      damping: 0.9,
      layers: 2
    },
    tags: ["finance", "professional", "trust", "stable"]
  },
  {
    name: "Natural Flow - Organic Beauty",
    description: "Smooth, flowing, natural movement like water or wind",
    preset: "liquid-flow",
    params: {
      flowType: "wave",
      flowThickness: 40,
      flowSmoothing: 0.85,
      fillType: "gradient",
      fillGradientStart: "#10b981",
      fillGradientEnd: "#06b6d4",
      frequency: 3.2,
      amplitude: 120,
      complexity: 0.6,
      chaos: 0.25,
      damping: 0.7,
      layers: 3,
      animation: true,
      animationSpeed: 0.3
    },
    tags: ["organic", "natural", "eco", "wellness"]
  },
  {
    name: "Tech Hexagon - Future Forward",
    description: "Precise, technical, innovative with geometric perfection",
    preset: "smart-hexagon",
    params: {
      hexagonRotation: 0,
      innerScale: 0.6,
      strokeType: "solid",
      strokeColor: "#8b5cf6",
      strokeWidth: 3,
      fillType: "none",
      frequency: 6,
      amplitude: 60,
      complexity: 0.8,
      chaos: 0.1,
      damping: 0.85,
      layers: 4
    },
    tags: ["tech", "innovation", "future", "ai"]
  },
  {
    name: "Luxury Minimalism - Timeless Elegance", 
    description: "Clean, sophisticated, premium with restraint",
    preset: "minimal-line",
    params: {
      lineThickness: 2,
      lineStyle: "smooth",
      fillType: "none",
      strokeType: "solid",
      strokeColor: "#000000",
      strokeWidth: 2,
      frequency: 1.5,
      amplitude: 40,
      complexity: 0.1,
      chaos: 0,
      damping: 1,
      layers: 1
    },
    tags: ["luxury", "minimal", "premium", "elegant"]
  },
  {
    name: "Playful Energy - Dynamic Joy",
    description: "Vibrant, energetic, fun with bold movement",
    preset: "pulse-spotify",
    params: {
      pulseType: "radial",
      pulseSpeed: 0.8,
      fillType: "solid",
      fillColor: "#f59e0b",
      strokeType: "none",
      frequency: 8,
      amplitude: 150,
      complexity: 0.4,
      chaos: 0.3,
      damping: 0.6,
      layers: 5,
      animation: true,
      animationSpeed: 0.6
    },
    tags: ["playful", "energetic", "youth", "dynamic"]
  },
  {
    name: "Corporate Heritage - Established Authority",
    description: "Traditional, stable, authoritative with gravitas",
    preset: "golden-circle",
    params: {
      innerRadius: 0.3,
      outerRadius: 0.7,
      strokeType: "solid",
      strokeColor: "#1e3a8a",
      strokeWidth: 4,
      fillType: "solid",
      fillColor: "#dbbf23",
      frequency: 1,
      amplitude: 50,
      complexity: 0,
      chaos: 0,
      damping: 1,
      layers: 1
    },
    tags: ["corporate", "traditional", "authority", "heritage"]
  }
];

export function BrandPresetsTool() {
  const [customPreset, setCustomPreset] = useState('');
  const [activeTab, setActiveTab] = useState<'examples' | 'custom'>('examples');
  
  const { logo: selectedLogo, updateCustom, updateCore, updateStyle } = useSelectedLogo();
  const { updateLogo } = useLogoStore();

  const handleApplyPreset = (preset: BrandPreset) => {
    if (!selectedLogo) return;

    // Update template if needed
    if (preset.preset !== selectedLogo.templateId) {
      updateLogo(selectedLogo.id, {
        templateId: preset.preset,
        templateName: preset.preset.split('-').map(w => 
          w.charAt(0).toUpperCase() + w.slice(1)
        ).join(' ')
      });
    }

    // Separate parameters by type
    const coreParams: any = {};
    const styleParams: any = {};
    const customParams: any = {};

    const coreKeys = ['frequency', 'amplitude', 'complexity', 'chaos', 'damping', 'layers', 'radius'];
    const styleKeys = ['fillColor', 'fillType', 'fillOpacity', 'strokeColor', 'strokeType', 'strokeWidth', 'strokeOpacity', 'backgroundColor', 'backgroundType'];

    Object.entries(preset.params).forEach(([key, value]) => {
      if (coreKeys.includes(key)) {
        coreParams[key] = value;
      } else if (styleKeys.includes(key)) {
        styleParams[key] = value;
      } else {
        customParams[key] = value;
      }
    });

    // Update all parameter types
    if (Object.keys(coreParams).length > 0) updateCore(coreParams);
    if (Object.keys(styleParams).length > 0) updateStyle(styleParams);
    if (Object.keys(customParams).length > 0) updateCustom(customParams);
  };

  const handleApplyCustomPreset = () => {
    try {
      const params = JSON.parse(customPreset);
      const preset: BrandPreset = {
        name: "Custom Preset",
        description: "User-defined preset",
        preset: selectedLogo?.templateId || 'wave-bars',
        params,
        tags: ["custom"]
      };
      handleApplyPreset(preset);
    } catch (error) {
      console.error('Invalid JSON preset:', error);
    }
  };

  const copyCurrentParams = () => {
    if (!selectedLogo) return;
    
    const allParams = {
      ...selectedLogo.parameters.core,
      ...selectedLogo.parameters.style,
      ...selectedLogo.parameters.custom
    };
    
    const json = JSON.stringify(allParams, null, 2);
    navigator.clipboard.writeText(json);
  };

  if (!selectedLogo) {
    return (
      <div className="text-sm text-gray-500 text-center py-8">
        No logo selected
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === 'examples' ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab('examples')}
          className="flex-1"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Examples
        </Button>
        <Button
          variant={activeTab === 'custom' ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTab('custom')}
          className="flex-1"
        >
          <Clipboard className="w-4 h-4 mr-2" />
          Custom
        </Button>
      </div>

      {/* Examples Tab */}
      {activeTab === 'examples' && (
        <div className="space-y-2">
          {EXAMPLE_BRAND_PRESETS.map((preset) => (
            <div
              key={preset.name}
              className="p-3 border rounded-lg hover:border-blue-300 cursor-pointer transition-colors"
              onClick={() => handleApplyPreset(preset)}
            >
              <div className="font-medium text-sm">{preset.name}</div>
              <div className="text-xs text-gray-600 mt-1">{preset.description}</div>
              <div className="flex flex-wrap gap-1 mt-2">
                {preset.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[10px]">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom Tab */}
      {activeTab === 'custom' && (
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-xs font-medium">Paste Preset JSON</label>
            <Textarea
              value={customPreset}
              onChange={(e) => setCustomPreset(e.target.value)}
              placeholder='{"frequency": 5, "amplitude": 100, ...}'
              className="h-32 font-mono text-xs"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleApplyCustomPreset}
              disabled={!customPreset}
              size="sm"
              className="flex-1"
            >
              Apply Custom
            </Button>
            <Button
              onClick={copyCurrentParams}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy Current
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}