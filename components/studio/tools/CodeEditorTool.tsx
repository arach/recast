'use client';

import { useState, useEffect } from 'react';
import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo';
import { Button } from '@/components/ui/button';
import { Play, Save, AlertCircle, Code2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CodeEditorTool() {
  const { logo, updateSelectedLogoCode } = useSelectedLogo();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (logo?.code) {
      setCode(logo.code);
      setIsDirty(false);
    }
  }, [logo?.id, logo?.code]);

  if (!logo) {
    return (
      <div className="text-sm text-gray-500 text-center py-8">
        No logo selected
      </div>
    );
  }

  const handleSave = () => {
    try {
      // Basic validation - try to create the function
      new Function('ctx', 'width', 'height', 'params', 'time', 'utils', code);
      
      updateSelectedLogoCode(code);
      setIsDirty(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code');
    }
  };

  const handleRun = () => {
    handleSave();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-gray-500" />
          <h3 className="text-sm font-medium">Template Code</h3>
          {isDirty && (
            <span className="text-xs text-orange-500">• Modified</span>
          )}
        </div>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSave}
            disabled={!isDirty}
            className="h-7 px-2"
          >
            <Save className="h-3 w-3 mr-1" />
            Save
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRun}
            className="h-7 px-2"
          >
            <Play className="h-3 w-3 mr-1" />
            Run
          </Button>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="flex items-start gap-2 p-2 mb-2 bg-red-50 text-red-700 rounded text-xs">
          <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
          <span className="break-all">{error}</span>
        </div>
      )}

      {/* Code editor */}
      <div className="flex-1 relative">
        <textarea
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setIsDirty(true);
            setError(null);
          }}
          className={cn(
            "w-full h-full p-3 font-mono text-xs",
            "bg-gray-50 border border-gray-200 rounded",
            "focus:outline-none focus:ring-2 focus:ring-blue-500",
            "resize-none"
          )}
          placeholder="// Write your template code here...
// Available: ctx, width, height, params, time, utils"
          spellCheck={false}
        />
      </div>

      {/* Help text */}
      <div className="mt-2 pt-2 border-t border-gray-200">
        <p className="text-[10px] text-gray-500">
          Edit the template's draw function. Changes are sandboxed and won't affect other logos.
        </p>
      </div>
    </div>
  );
}