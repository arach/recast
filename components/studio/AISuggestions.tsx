'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Brain, Loader2, ChevronRight, Check } from 'lucide-react';
import { useCompletion } from 'ai/react';

interface AISuggestionsProps {
  currentIndustry?: string;
  currentPreset?: string;
  currentParams: Record<string, any>;
  onApplySuggestion: (params: Record<string, any>) => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}

interface Suggestion {
  parameter: string;
  value: any;
  reason: string;
}

export function AISuggestions({ 
  currentIndustry, 
  currentPreset,
  currentParams, 
  onApplySuggestion,
  collapsed = false,
  onToggleCollapsed
}: AISuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());
  
  const { complete, completion, isLoading, error } = useCompletion({
    api: '/api/ai-suggestions',
    onFinish: (_prompt, completion) => {
      try {
        // Extract JSON from the completion - AI might include markdown formatting
        const jsonMatch = completion.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          setSuggestions(parsed);
        }
      } catch (e) {
        console.error('Failed to parse AI suggestions:', e);
      }
    },
  });

  const getSuggestions = async () => {
    // Clear previous suggestions when getting new ones
    setSuggestions([]);
    setAppliedSuggestions(new Set());
    
    await complete('', {
      body: {
        currentIndustry,
        currentPreset,
        currentParams,
        requestType: 'suggestions'
      }
    });
  };

  const applySuggestion = (suggestion: Suggestion) => {
    const newParams = {
      ...currentParams,
      [suggestion.parameter]: suggestion.value
    };
    onApplySuggestion(newParams);
    setAppliedSuggestions(prev => new Set(prev).add(suggestion.parameter));
  };

  const applyAllSuggestions = () => {
    const newParams = { ...currentParams };
    suggestions.forEach(suggestion => {
      newParams[suggestion.parameter] = suggestion.value;
    });
    onApplySuggestion(newParams);
    setAppliedSuggestions(new Set(suggestions.map(s => s.parameter)));
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader 
        className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggleCollapsed}
      >
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Brain className="h-4 w-4" />
          AI Suggestions
          {suggestions.length > 0 && (
            <Badge variant="secondary" className="ml-auto text-xs">
              {suggestions.length} suggestions
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      {!collapsed && (
        <CardContent className="space-y-4 pt-0">
          {/* Get suggestions button */}
          <Button
            onClick={getSuggestions}
            disabled={isLoading}
            size="sm"
            className="w-full"
            variant={suggestions.length > 0 ? "outline" : "default"}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing design...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                {suggestions.length > 0 ? 'Get New Suggestions' : 'Get AI Suggestions'}
              </>
            )}
          </Button>

          {/* Error state */}
          {error && (
            <div className="text-xs text-red-600 bg-red-50 rounded-lg p-3">
              {error.message?.includes('401') || error.message?.includes('API key') ? (
                <>
                  OpenAI API key required. Add <code className="font-mono bg-red-100 px-1">OPENAI_API_KEY</code> to your <code className="font-mono bg-red-100 px-1">.env.local</code> file.
                </>
              ) : (
                'Failed to get suggestions. Please try again.'
              )}
            </div>
          )}

          {/* Suggestions list */}
          {suggestions.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-gray-600">
                  AI-powered refinements
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs h-7"
                  onClick={applyAllSuggestions}
                >
                  Apply All
                </Button>
              </div>

              {suggestions.map((suggestion, index) => {
                const isApplied = appliedSuggestions.has(suggestion.parameter);
                
                return (
                  <div
                    key={index}
                    className={`group relative p-3 rounded-lg border transition-all ${
                      isApplied
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">
                            {suggestion.parameter}
                          </span>
                          <span className="text-xs text-gray-500">
                            → {typeof suggestion.value === 'string' ? suggestion.value : JSON.stringify(suggestion.value)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {suggestion.reason}
                        </p>
                      </div>
                      
                      <Button
                        size="sm"
                        variant={isApplied ? "ghost" : "default"}
                        className="h-7 px-2"
                        onClick={() => applySuggestion(suggestion)}
                        disabled={isApplied}
                      >
                        {isApplied ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <ChevronRight className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Context indicator */}
          {!isLoading && suggestions.length === 0 && (
            <div className="text-xs text-gray-500 text-center py-4">
              {currentIndustry ? (
                <>AI will analyze your {currentIndustry} design</>
              ) : (
                <>Select an industry for more targeted suggestions</>
              )}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}