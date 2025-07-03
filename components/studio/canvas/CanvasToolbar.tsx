'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Hand, MousePointer } from 'lucide-react';
import { useCanvasStore } from '@/lib/stores/canvasStore';

export function CanvasToolbar() {
  const { toolMode, setToolMode } = useCanvasStore();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'v':
          e.preventDefault();
          setToolMode('select');
          break;
        case 'h':
          e.preventDefault();
          setToolMode('pan');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setToolMode]);

  return (
    <div className="absolute top-6 left-14 z-20 flex gap-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-1">
      <Button
        variant={toolMode === 'select' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setToolMode('select')}
        className="w-8 h-8 p-0"
        title="Select and move logos (V)"
      >
        <MousePointer className="w-4 h-4" />
      </Button>
      <Button
        variant={toolMode === 'pan' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setToolMode('pan')}
        className="w-8 h-8 p-0"
        title="Pan canvas (H)"
      >
        <Hand className="w-4 h-4" />
      </Button>
    </div>
  );
}