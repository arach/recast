'use client';

import { useLogoStore } from '@/lib/stores/logoStore';
import { useUIStore } from '@/lib/stores/uiStore';

interface StateDebuggerProps {
  reactLogos: any[];
  selectedLogoId: string;
  onClearCanvasPosition?: () => void;
  canvasOffset?: { x: number, y: number };
}

export function StateDebugger({ 
  reactLogos, 
  selectedLogoId,
  onClearCanvasPosition,
  canvasOffset
}: StateDebuggerProps) {
  const zustandLogos = useLogoStore(state => state.logos);
  const zustandSelectedId = useLogoStore(state => state.selectedLogoId);
  const zoom = useUIStore(state => state.zoom);
  
  const reactLogo = reactLogos.find(l => l.id === selectedLogoId);
  const zustandLogo = zustandLogos.find(l => l.id === zustandSelectedId);

  // Get saved offset from localStorage
  const savedCanvasOffset = typeof window !== 'undefined' ? localStorage.getItem('recast-canvas-offset') : null;
  let savedOffset = { x: 0, y: 0 };
  let localStorageParseError = false;
  try {
    savedOffset = savedCanvasOffset ? JSON.parse(savedCanvasOffset) : { x: 0, y: 0 };
  } catch (e) {
    localStorageParseError = true;
  }

  // Calculate what effective center should be
  const mockCanvasRect = { width: 1200, height: 800 }; // rough estimate
  const codeEditorCollapsed = true; // Assume collapsed for now
  const codeEditorWidth = 500;
  const availableWidth = codeEditorCollapsed ? mockCanvasRect.width : mockCanvasRect.width - codeEditorWidth;
  const availableHeight = mockCanvasRect.height;
  const effectiveCenterX = codeEditorCollapsed ? availableWidth / 2 : codeEditorWidth + availableWidth / 2;
  const effectiveCenterY = availableHeight / 2;
  const expectedCenterOffset = {
    x: effectiveCenterX / zoom,
    y: effectiveCenterY / zoom
  };

  // Calculate logo bounding box
  const logoSize = 600;
  let logoBounds = null;
  if (reactLogos.length > 0) {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    reactLogos.forEach(logo => {
      const position = logo.position || { x: 0, y: 0 };
      minX = Math.min(minX, position.x);
      maxX = Math.max(maxX, position.x + logoSize);
      minY = Math.min(minY, position.y);
      maxY = Math.max(maxY, position.y + logoSize);
    });
    logoBounds = {
      minX, maxX, minY, maxY,
      centerX: (minX + maxX) / 2,
      centerY: (minY + maxY) / 2,
      width: maxX - minX,
      height: maxY - minY
    };
  }
  
  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs font-mono max-w-md z-50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-yellow-400">🔍 State Debugger</h3>
        {onClearCanvasPosition && (
          <button
            onClick={onClearCanvasPosition}
            className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
            title="Clear saved canvas position and reset centering flag"
          >
            Clear Position
          </button>
        )}
      </div>
      
      <div className="mb-3">
        <h4 className="text-green-400 mb-1">React State:</h4>
        <div className="pl-2">
          <div>ID: {reactLogo?.id}</div>
          <div>Template ID: {reactLogo?.templateId || 'undefined'}</div>
          <div>Template Name: {reactLogo?.templateName || 'undefined'}</div>
          <div>Code Length: {reactLogo?.code?.length || 0}</div>
          <div>Code Preview: {reactLogo?.code?.substring(0, 50)}...</div>
        </div>
      </div>
      
      <div className="mb-3">
        <h4 className="text-blue-400 mb-1">Zustand Store:</h4>
        <div className="pl-2">
          <div>ID: {zustandLogo?.id}</div>
          <div>Template ID: {zustandLogo?.templateId || 'undefined'}</div>
          <div>Template Name: {zustandLogo?.templateName || 'undefined'}</div>
          <div>Code Length: {zustandLogo?.code?.length || 0}</div>
          <div>Code Preview: {zustandLogo?.code?.substring(0, 50)}...</div>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-white/20">
        <h4 className="text-blue-400 mb-1">📐 Viewport & Positioning:</h4>
        <div className="pl-2">
          <div>Zoom: {zoom?.toFixed(2) || 'undefined'}</div>
          <div>Canvas State: {canvasOffset ? `${canvasOffset.x.toFixed(1)}, ${canvasOffset.y.toFixed(1)}` : 'unknown'}</div>
          <div>LocalStorage: {savedOffset.x.toFixed(1)}, {savedOffset.y.toFixed(1)}</div>
          <div>Expected Center: {expectedCenterOffset.x.toFixed(1)}, {expectedCenterOffset.y.toFixed(1)}</div>
          <div>Code Editor: {codeEditorCollapsed ? 'collapsed' : `expanded (${codeEditorWidth}px)`}</div>
          <div>Available Space: {availableWidth}×{availableHeight}</div>
          <div>Effective Center: {effectiveCenterX}, {effectiveCenterY}</div>
          {canvasOffset && (
            <div className={Math.abs(canvasOffset.x - expectedCenterOffset.x) < 10 && Math.abs(canvasOffset.y - expectedCenterOffset.y) < 10 ? 'text-green-400' : 'text-red-400'}>
              Centering: {Math.abs(canvasOffset.x - expectedCenterOffset.x) < 10 && Math.abs(canvasOffset.y - expectedCenterOffset.y) < 10 ? '✓ Correct' : '✗ Off by ' + Math.round(Math.abs(canvasOffset.x - expectedCenterOffset.x) + Math.abs(canvasOffset.y - expectedCenterOffset.y))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-white/20">
        <h4 className="text-purple-400 mb-1">💾 LocalStorage:</h4>
        <div className="pl-2">
          <div className="text-xs">
            Key: <span className="text-gray-400">recast-canvas-offset</span>
          </div>
          {savedCanvasOffset ? (
            <>
              <div className="text-xs break-all">
                Raw: <span className="text-yellow-300">{savedCanvasOffset.substring(0, 50)}{savedCanvasOffset.length > 50 ? '...' : ''}</span>
              </div>
              {!localStorageParseError ? (
                <div className="text-xs">
                  Parsed: ({savedOffset.x.toFixed(1)}, {savedOffset.y.toFixed(1)})
                </div>
              ) : (
                <div className="text-red-400 text-xs">❌ Parse Error</div>
              )}
            </>
          ) : (
            <div className="text-gray-400 text-xs">No saved data</div>
          )}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-white/20">
        <h4 className="text-orange-400 mb-1">📦 Logo Bounds:</h4>
        <div className="pl-2">
          {logoBounds ? (
            <>
              <div>Count: {reactLogos.length}</div>
              <div>Min: ({logoBounds.minX}, {logoBounds.minY})</div>
              <div>Max: ({logoBounds.maxX}, {logoBounds.maxY})</div>
              <div>Center: ({logoBounds.centerX.toFixed(1)}, {logoBounds.centerY.toFixed(1)})</div>
              <div>Size: {logoBounds.width.toFixed(1)}×{logoBounds.height.toFixed(1)}</div>
            </>
          ) : (
            <div>No logos</div>
          )}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-white/20">
        <div className={reactLogo?.templateId === zustandLogo?.templateId ? 'text-green-400' : 'text-red-400'}>
          Templates Match: {reactLogo?.templateId === zustandLogo?.templateId ? '✓' : '✗'}
        </div>
        <div className={reactLogo?.code === zustandLogo?.code ? 'text-green-400' : 'text-red-400'}>
          Code Match: {reactLogo?.code === zustandLogo?.code ? '✓' : '✗'}
        </div>
      </div>
    </div>
  );
}