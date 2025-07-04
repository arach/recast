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
  const [mounted, setMounted] = useState(false);
  const [debuggerRef, setDebuggerRef] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    
    // Add global functions for toggling
    (window as any).showDebugger = () => {
      if (debuggerRef?.setIsCollapsed) {
        debuggerRef.setIsCollapsed(false);
      }
    };
    (window as any).hideDebugger = () => {
      if (debuggerRef?.setIsCollapsed) {
        debuggerRef.setIsCollapsed(true);
      }
    };
    (window as any).toggleDebugger = () => {
      if (debuggerRef?.toggleCollapsed) {
        debuggerRef.toggleCollapsed();
      }
    };
    
    return () => {
      delete (window as any).showDebugger;
      delete (window as any).hideDebugger;
      delete (window as any).toggleDebugger;
    };
  }, [debuggerRef]);

  // Only show in development
  if (process.env.NODE_ENV !== 'development' || !mounted) {
    return null;
  }

  return (
    <StateDebugger
      ref={setDebuggerRef}
      selectedLogo={selectedLogo}
      selectedLogoId={selectedLogoId}
      onClearCanvasPosition={onClearCanvasPosition}
      canvasOffset={canvasOffset}
    />
  );
}