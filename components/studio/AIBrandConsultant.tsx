'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, MessageSquare, Upload, Key, Loader2, Send, Image as ImageIcon, X } from 'lucide-react';
import { useCompletion } from 'ai/react';

interface AIBrandConsultantProps {
  currentParams: Record<string, any>;
  onApplyRecommendation: (params: Record<string, any>) => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}

interface BrandRecommendation {
  parameters: Record<string, any>;
  reasoning: string;
  confidence: number;
  suggestions: string[];
}

export function AIBrandConsultant({ 
  currentParams, 
  onApplyRecommendation,
  collapsed = false,
  onToggleCollapsed
}: AIBrandConsultantProps) {
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [brandDescription, setBrandDescription] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [recommendation, setRecommendation] = useState<BrandRecommendation | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Check if API key exists in localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('recast_openai_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);
  
  const { complete, isLoading, error } = useCompletion({
    api: '/api/ai-brand-consultant',
    headers: {
      'X-OpenAI-Key': apiKey // Send user's API key in header
    },
    onFinish: (_prompt, completion) => {
      try {
        let jsonStr = completion;
        const jsonMatch = completion.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          jsonStr = jsonMatch[0];
        }
        
        jsonStr = jsonStr
          .replace(/```json\s*/g, '')
          .replace(/```\s*/g, '')
          .replace(/[\u201C\u201D]/g, '"')
          .replace(/[\u2018\u2019]/g, "'")
          .trim();
        
        const parsed = JSON.parse(jsonStr);
        setRecommendation(parsed);
      } catch (e) {
        console.error('Failed to parse brand recommendation:', e);
      }
    },
  });

  const saveApiKey = () => {
    localStorage.setItem('recast_openai_key', apiKey);
    setShowApiKeyInput(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const analyzeBrand = async () => {
    if (!brandDescription.trim() && uploadedImages.length === 0) return;
    
    setRecommendation(null);
    
    await complete('', {
      body: {
        brandDescription,
        visualReferences: uploadedImages,
        currentParams,
        requestType: 'brand-analysis'
      }
    });
  };

  const hasApiKey = apiKey.length > 0;

  return (
    <Card className="overflow-hidden">
      <CardHeader 
        className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggleCollapsed}
      >
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          AI Brand Consultant
          {recommendation && (
            <Badge variant="secondary" className="ml-auto text-xs">
              Ready to apply
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      {!collapsed && (
        <CardContent className="space-y-4 pt-0">
          {/* API Key Setup */}
          {!hasApiKey ? (
            <div className="space-y-3 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm font-medium text-blue-900">
                <Key className="h-4 w-4" />
                OpenAI API Key Required
              </div>
              <p className="text-xs text-blue-700">
                To use AI features, you'll need your own OpenAI API key. Your key is stored locally and never sent to our servers.
              </p>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="flex-1 text-sm p-2 border rounded"
                />
                <Button size="sm" onClick={saveApiKey}>
                  Save
                </Button>
              </div>
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline"
              >
                Get an API key →
              </a>
            </div>
          ) : (
            <>
              {/* Brand Description Input */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700">
                  Describe your brand
                </label>
                <textarea
                  value={brandDescription}
                  onChange={(e) => setBrandDescription(e.target.value)}
                  placeholder="Tell me about your brand... What do you do? What are your values? Who is your audience? What feeling should your logo convey?"
                  className="w-full h-24 text-sm p-3 border rounded-lg resize-none"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700">
                  Visual references (optional)
                </label>
                <div className="space-y-2">
                  {uploadedImages.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {uploadedImages.map((img, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={img} 
                            alt={`Reference ${index + 1}`}
                            className="h-16 w-16 object-cover rounded border"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload reference images
                  </Button>
                </div>
              </div>

              {/* Analyze Button */}
              <Button
                onClick={analyzeBrand}
                disabled={isLoading || (!brandDescription.trim() && uploadedImages.length === 0)}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing brand...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Get Design Recommendation
                  </>
                )}
              </Button>

              {/* Error state */}
              {error && (
                <div className="text-xs text-red-600 bg-red-50 rounded-lg p-3">
                  {error.message?.includes('401') ? (
                    'Invalid API key. Please check your OpenAI API key.'
                  ) : (
                    'Failed to analyze brand. Please try again.'
                  )}
                </div>
              )}

              {/* Recommendation */}
              {recommendation && (
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium text-blue-900">
                        Brand Analysis
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {Math.round(recommendation.confidence * 100)}% confidence
                      </Badge>
                    </div>
                    <p className="text-xs text-blue-700">
                      {recommendation.reasoning}
                    </p>
                  </div>

                  {/* Suggestions */}
                  {recommendation.suggestions.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-600">
                        Additional suggestions:
                      </p>
                      {recommendation.suggestions.map((suggestion, i) => (
                        <p key={i} className="text-xs text-gray-600 pl-2">
                          • {suggestion}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Apply button */}
                  <Button
                    onClick={() => onApplyRecommendation(recommendation.parameters)}
                    className="w-full"
                  >
                    Apply Recommended Design
                  </Button>
                </div>
              )}

              {/* API Key Management */}
              <button
                onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                {showApiKeyInput ? 'Hide' : 'Change'} API key
              </button>
              
              {showApiKeyInput && (
                <div className="space-y-2 p-2 bg-gray-50 rounded">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full text-sm p-2 border rounded"
                  />
                  <Button size="sm" onClick={saveApiKey} className="w-full">
                    Update Key
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
}