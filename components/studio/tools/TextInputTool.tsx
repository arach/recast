'use client';

import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Type, AtSign, Hash, Building2 } from 'lucide-react';

export function TextInputTool() {
  const { logo, updateCustom } = useSelectedLogo();

  if (!logo) {
    return (
      <div className="text-sm text-gray-500 text-center py-8">
        No logo selected
      </div>
    );
  }

  // Determine which text field to show based on template
  const isWordmark = logo.templateId === 'wordmark';
  const isLettermark = logo.templateId === 'letter-mark';
  const hasTextInput = isWordmark || isLettermark;

  if (!hasTextInput) {
    return (
      <div className="text-sm text-gray-500 text-center py-4">
        This template doesn't support text input
      </div>
    );
  }

  const textValue = isWordmark 
    ? (logo.parameters.custom?.text || 'BRAND')
    : (logo.parameters.custom?.letter || 'A');

  const handleTextChange = (value: string) => {
    if (isWordmark) {
      updateCustom({ text: value });
    } else if (isLettermark) {
      // For lettermark, limit to a few characters
      const trimmed = value.slice(0, 3);
      updateCustom({ letter: trimmed });
    }
  };

  return (
    <div className="space-y-4">
      {/* Brand Name Input */}
      <div className="space-y-2">
        <Label className="text-xs flex items-center gap-2">
          {isWordmark ? (
            <>
              <Type className="w-3 h-3" />
              Brand Name
            </>
          ) : (
            <>
              <AtSign className="w-3 h-3" />
              Letter Mark
            </>
          )}
        </Label>
        <Input
          type="text"
          value={textValue}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder={isWordmark ? "Enter brand name" : "Enter 1-3 letters"}
          maxLength={isWordmark ? 50 : 3}
          className="text-sm"
        />
        {isWordmark && (
          <p className="text-xs text-gray-500">
            Use line breaks with Enter for multi-line text
          </p>
        )}
      </div>

      {/* Quick Suggestions */}
      {isWordmark && (
        <div className="space-y-2">
          <Label className="text-xs text-gray-600">Quick Examples</Label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleTextChange('BRAND')}
              className="text-xs px-3 py-2 border rounded hover:bg-gray-50 text-left"
            >
              <Building2 className="w-3 h-3 inline mr-1" />
              BRAND
            </button>
            <button
              onClick={() => handleTextChange('COMPANY')}
              className="text-xs px-3 py-2 border rounded hover:bg-gray-50 text-left"
            >
              Company
            </button>
            <button
              onClick={() => handleTextChange('BRAND\nTAGLINE')}
              className="text-xs px-3 py-2 border rounded hover:bg-gray-50 text-left"
            >
              Multi-line
            </button>
            <button
              onClick={() => handleTextChange('YOUR BRAND')}
              className="text-xs px-3 py-2 border rounded hover:bg-gray-50 text-left"
            >
              Two Words
            </button>
          </div>
        </div>
      )}

      {/* Quick Letter Suggestions */}
      {isLettermark && (
        <div className="space-y-2">
          <Label className="text-xs text-gray-600">Quick Examples</Label>
          <div className="grid grid-cols-4 gap-2">
            {['A', 'B', 'M', 'X', 'AB', 'XY', 'ABC', '123'].map((letter) => (
              <button
                key={letter}
                onClick={() => handleTextChange(letter)}
                className="text-xs px-3 py-2 border rounded hover:bg-gray-50 font-semibold"
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}