'use client';

import { useState, useEffect } from 'react';
import { Bug } from 'lucide-react';
import { StateDebugger } from './StateDebugger';
import './debug-animations.css';

interface DebugOverlayProps {
  selectedLogo: any;
  selectedLogoId: string;
  onClearCanvasPosition?: () => void;
  canvasOffset?: { x: number, y: number };
}

export function DebugOverlay({
  selectedLogo,
  selectedLogoId,
  onClearCanvasPosition,
  canvasOffset
}: DebugOverlayProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Add global functions for toggling
    (window as any).showDebugger = () => setIsOpen(true);
    (window as any).hideDebugger = () => setIsOpen(false);
    (window as any).toggleDebugger = () => setIsOpen(prev => !prev);
    
    return () => {
      delete (window as any).showDebugger;
      delete (window as any).hideDebugger;
      delete (window as any).toggleDebugger;
    };
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development' || !mounted) {
    return null;
  }

  return (
    <>
      {/* Floating debug button - positioned near Next.js error overlay */}
      <div className="fixed bottom-8 right-8 z-[9999] flex items-center gap-2">
        <div className="bg-gray-900/90 text-white px-2 py-1 rounded text-[10px] font-mono backdrop-blur-sm">
          DEV
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-all duration-200 hover:scale-110 ${
            isOpen ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-900 hover:bg-gray-800'
          }`}
          title="Toggle Debug Toolbar"
        >
          <Bug className={`h-5 w-5 text-white transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Debug toolbar */}
      {isOpen && (
        <div className="fixed bottom-20 right-8 z-[9998]">
          <StateDebugger
            selectedLogo={selectedLogo}
            selectedLogoId={selectedLogoId}
            onClearCanvasPosition={onClearCanvasPosition}
            canvasOffset={canvasOffset}
          />
        </div>
      )}
    </>
  );
}