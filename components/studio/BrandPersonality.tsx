'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Heart, Target, Zap, Shield, Smile, Star, Loader2 } from 'lucide-react';
import { useCompletion } from 'ai/react';

interface BrandPersonalityProps {
  currentParams: Record<string, any>;
  onApplyPersonality: (params: Record<string, any>) => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}

interface PersonalityTrait {
  id: string;
  name: string;
  icon: React.ReactNode;
  oppositeId: string;
  description: string;
}

interface PersonalityMapping {
  parameters: Record<string, any>;
  reasoning: string;
  alternativeOptions?: Array<{
    name: string;
    parameters: Record<string, any>;
  }>;
}

const personalityTraits: PersonalityTrait[] = [
  { id: 'playful', name: 'Playful', icon: <Smile className="h-3 w-3" />, oppositeId: 'serious', description: 'Fun, approachable, lighthearted' },
  { id: 'serious', name: 'Serious', icon: <Shield className="h-3 w-3" />, oppositeId: 'playful', description: 'Professional, trustworthy, stable' },
  { id: 'innovative', name: 'Innovative', icon: <Zap className="h-3 w-3" />, oppositeId: 'traditional', description: 'Cutting-edge, forward-thinking' },
  { id: 'traditional', name: 'Traditional', icon: <Star className="h-3 w-3" />, oppositeId: 'innovative', description: 'Classic, timeless, heritage' },
  { id: 'bold', name: 'Bold', icon: <Target className="h-3 w-3" />, oppositeId: 'subtle', description: 'Strong, confident, attention-grabbing' },
  { id: 'subtle', name: 'Subtle', icon: <Heart className="h-3 w-3" />, oppositeId: 'bold', description: 'Refined, understated, elegant' },
];

export function BrandPersonality({ 
  currentParams, 
  onApplyPersonality,
  collapsed = false,
  onToggleCollapsed
}: BrandPersonalityProps) {
  const [selectedTraits, setSelectedTraits] = useState<Set<string>>(new Set());
  const [mapping, setMapping] = useState<PersonalityMapping | null>(null);
  const [selectedOption, setSelectedOption] = useState<number>(-1);
  
  const { complete, isLoading, error } = useCompletion({
    api: '/api/ai-suggestions',
    onFinish: (_prompt, completion) => {
      try {
        // Extract JSON from the completion - handle various formats
        let jsonStr = completion;
        
        // Try to find JSON object in the response
        const jsonMatch = completion.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          jsonStr = jsonMatch[0];
        }
        
        // Clean up common formatting issues
        jsonStr = jsonStr
          .replace(/```json\s*/g, '') // Remove markdown code blocks
          .replace(/```\s*/g, '')
          .replace(/[\u201C\u201D]/g, '"') // Replace smart quotes
          .replace(/[\u2018\u2019]/g, "'") // Replace smart single quotes
          .trim();
        
        const parsed = JSON.parse(jsonStr);
        setMapping(parsed);
      } catch (e) {
        console.error('Failed to parse personality mapping:', e);
        console.error('Raw completion:', completion);
      }
    },
  });

  const toggleTrait = (traitId: string) => {
    const trait = personalityTraits.find(t => t.id === traitId);
    if (!trait) return;

    setSelectedTraits(prev => {
      const newSet = new Set(prev);
      
      // If selecting this trait, remove its opposite
      if (!newSet.has(traitId)) {
        newSet.add(traitId);
        newSet.delete(trait.oppositeId);
      } else {
        newSet.delete(traitId);
      }
      
      return newSet;
    });
  };

  const getPersonalityMapping = async () => {
    if (selectedTraits.size === 0) return;
    
    setMapping(null);
    setSelectedOption(-1);
    
    const traits = Array.from(selectedTraits).map(id => 
      personalityTraits.find(t => t.id === id)?.name
    ).filter(Boolean);
    
    await complete('', {
      body: {
        currentParams: {
          ...currentParams,
          personality: traits
        },
        requestType: 'personality'
      }
    });
  };

  const applyMapping = () => {
    if (!mapping) return;
    
    if (selectedOption >= 0 && mapping.alternativeOptions?.[selectedOption]) {
      onApplyPersonality(mapping.alternativeOptions[selectedOption].parameters);
    } else {
      onApplyPersonality(mapping.parameters);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader 
        className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggleCollapsed}
      >
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Brand Personality
          {selectedTraits.size > 0 && (
            <Badge variant="secondary" className="ml-auto text-xs">
              {selectedTraits.size} traits
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      {!collapsed && (
        <CardContent className="space-y-4 pt-0">
          {/* Trait selection */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-600">
              Select personality traits:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {personalityTraits.map((trait) => {
                const isSelected = selectedTraits.has(trait.id);
                const oppositeSelected = selectedTraits.has(trait.oppositeId);
                
                return (
                  <button
                    key={trait.id}
                    onClick={() => toggleTrait(trait.id)}
                    disabled={oppositeSelected}
                    className={`group relative p-3 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : oppositeSelected
                        ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
                        {trait.icon}
                      </div>
                      <span className={`text-xs font-medium ${
                        isSelected ? 'text-blue-900' : 'text-gray-700'
                      }`}>
                        {trait.name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {trait.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generate mapping button */}
          <Button
            onClick={getPersonalityMapping}
            disabled={isLoading || selectedTraits.size === 0}
            size="sm"
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Mapping personality...
              </>
            ) : (
              <>
                <Target className="h-4 w-4 mr-2" />
                Map to Design Parameters
              </>
            )}
          </Button>

          {/* Error state */}
          {error && (
            <div className="text-xs text-red-600 bg-red-50 rounded-lg p-3">
              Failed to map personality. Please try again.
            </div>
          )}

          {/* Mapping results */}
          {mapping && (
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs font-medium text-blue-900 mb-1">
                  Personality Analysis:
                </p>
                <p className="text-xs text-blue-700">
                  {mapping.reasoning}
                </p>
              </div>

              {/* Main suggestion */}
              <div className={`p-3 rounded-lg border transition-all cursor-pointer ${
                selectedOption === -1
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
                onClick={() => setSelectedOption(-1)}
              >
                <p className="text-xs font-medium mb-2">Recommended Design</p>
                <div className="space-y-1">
                  {Object.entries(mapping.parameters).slice(0, 5).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-gray-600">{key}:</span>
                      <span className="font-mono">{value}</span>
                    </div>
                  ))}
                  {Object.keys(mapping.parameters).length > 5 && (
                    <p className="text-xs text-gray-500">
                      +{Object.keys(mapping.parameters).length - 5} more parameters
                    </p>
                  )}
                </div>
              </div>

              {/* Alternative options */}
              {mapping.alternativeOptions && mapping.alternativeOptions.length > 0 && (
                <>
                  <p className="text-xs font-medium text-gray-600">
                    Alternative expressions:
                  </p>
                  {mapping.alternativeOptions.map((option, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        selectedOption === index
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedOption(index)}
                    >
                      <p className="text-xs font-medium mb-1">{option.name}</p>
                      <div className="space-y-1">
                        {Object.entries(option.parameters).slice(0, 3).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-xs">
                            <span className="text-gray-600">{key}:</span>
                            <span className="font-mono">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Apply button */}
              <Button
                onClick={applyMapping}
                size="sm"
                className="w-full"
              >
                Apply This Personality
              </Button>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}