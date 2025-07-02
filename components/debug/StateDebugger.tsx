'use client';

import { useState, useEffect } from 'react';
import { useLogoStore } from '@/lib/stores/logoStore';
import { useUIStore } from '@/lib/stores/uiStore';
import { Maximize2, Minimize2, ChevronDown, ChevronUp } from 'lucide-react';

interface StateDebuggerProps {
  reactLogos: any[];
  selectedLogoId: string;
  onClearCanvasPosition?: () => void;
  canvasOffset?: { x: number, y: number };
}

type DebugTab = 'dashboard' | 'details' | 'utilities';

export function StateDebugger({ 
  reactLogos, 
  selectedLogoId,
  onClearCanvasPosition,
  canvasOffset
}: StateDebuggerProps) {
  const [activeTab, setActiveTab] = useState<DebugTab>('dashboard');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
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
    <div className={`fixed bottom-4 right-4 rounded-xl text-xs font-sans z-50 
                bg-gray-900/95 dark:bg-black/95 
                backdrop-blur-sm
                border border-gray-700/50 dark:border-gray-800
                transition-all duration-700 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]
                ${isExpanded ? 'w-[640px] shadow-[0_20px_50px_rgba(0,0,0,0.7)]' : 'w-[480px] shadow-2xl shadow-black/50'}
                ${isMinimized ? 'shadow-xl' : ''}`}>
      {/* Header with tabs */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700/50">
        <h3 className="font-semibold text-white">Debug Toolbar</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 rounded-md text-gray-400 hover:text-white
                       hover:bg-white/10 transition-all duration-200
                       hover:scale-110 active:scale-95"
            title={isMinimized ? "Show content" : "Hide content"}
          >
            {isMinimized ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-md text-gray-400 hover:text-white
                       hover:bg-white/10 transition-all duration-200
                       hover:scale-110 active:scale-95"
            title={isExpanded ? "Collapse width" : "Expand width"}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          {onClearCanvasPosition && (
            <button
              onClick={onClearCanvasPosition}
              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 
                         px-2 py-1 rounded-md text-xs font-medium
                         border border-red-500/30 hover:border-red-500/40 
                         transition-all duration-200"
              title="Clear saved canvas position and reset centering flag"
            >
              Clear Position
            </button>
          )}
        </div>
      </div>
      
      {/* Collapsible Content */}
      <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]
                      ${isMinimized ? 'max-h-0' : 'max-h-[800px]'}`}>
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700/50">
          {[
            { id: 'dashboard' as const, label: 'Dashboard', icon: '📊', title: 'Multi-state overview' },
            { id: 'details' as const, label: 'Details', icon: '🔍', title: 'Detailed state inspection' },
            { id: 'utilities' as const, label: 'Utils', icon: '🔧', title: 'Developer utilities' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-medium transition-all duration-200 relative
                ${activeTab === tab.id 
                  ? 'text-white bg-white/10' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              title={tab.title}
            >
              <span className="flex items-center gap-1.5">
                <span className="text-base">{tab.icon}</span>
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400" />
              )}
            </button>
          ))}
        </div>
        
        {/* Tab Content */}
        <div className={`p-4 overflow-y-auto text-gray-100 
                        transition-all duration-700 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]
                        ${isExpanded ? 'max-h-[600px]' : 'max-h-[400px]'}`}>
          <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
  
  function renderTabContent() {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'details':
        return renderDetails();
      case 'utilities':
        return renderUtilities();
    }
  }
  
  function renderDashboard() {
    // Calculate sync status
    const canvasStateSynced = canvasOffset && savedOffset && 
      Math.abs(canvasOffset.x - savedOffset.x) < 10 && 
      Math.abs(canvasOffset.y - savedOffset.y) < 10;
    
    const idsSynced = selectedLogoId === zustandSelectedId;
    const templatesSynced = reactLogo?.templateId === zustandLogo?.templateId;
    const logoCountSynced = reactLogos.length === zustandLogos.length;
    
    // Template loading status
    const templateLoaded = reactLogo?.templateId && reactLogo?.code;
    
    return (
      <div className="space-y-4">
        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <span className="text-base">🎯</span>
          Multi-State Observatory
        </h4>
        
        {/* Sync Status Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className={`p-3 rounded-lg border transition-all duration-200 ${
            idsSynced 
              ? 'bg-green-500/20 border-green-500/30' 
              : 'bg-red-500/20 border-red-500/30 animate-pulse'
          }`}>
            <div className="font-medium text-xs text-gray-300">Selection State</div>
            <div className={`text-sm font-semibold mt-1 ${
              idsSynced ? 'text-green-400' : 'text-red-400'
            }`}>
              {idsSynced ? '✓ Synced' : '✗ Out of sync'}
            </div>
            <div className="text-[10px] mt-1 text-gray-400">
              React: {selectedLogoId} | Zustand: {zustandSelectedId}
            </div>
          </div>
          
          <div className={`p-3 rounded-lg border transition-all duration-200 ${
            canvasStateSynced 
              ? 'bg-green-500/20 border-green-500/30' 
              : 'bg-yellow-500/20 border-yellow-500/30'
          }`}>
            <div className="font-medium text-xs text-gray-300">Canvas State</div>
            <div className={`text-sm font-semibold mt-1 ${
              canvasStateSynced ? 'text-green-400' : 'text-yellow-400'
            }`}>
              {canvasStateSynced ? '✓ Synced' : '⚠ Drift detected'}
            </div>
            <div className="text-[10px] mt-1 text-gray-400">
              {canvasOffset && savedOffset && 
                `Δ ${Math.abs(canvasOffset.x - savedOffset.x).toFixed(0)}, ${Math.abs(canvasOffset.y - savedOffset.y).toFixed(0)}`
              }
            </div>
          </div>
          
          <div className={`p-3 rounded-lg border transition-all duration-200 ${
            templatesSynced 
              ? 'bg-green-500/20 border-green-500/30' 
              : 'bg-red-500/20 border-red-500/30 animate-pulse'
          }`}>
            <div className="font-medium text-xs text-gray-300">Template State</div>
            <div className={`text-sm font-semibold mt-1 ${
              templatesSynced ? 'text-green-400' : 'text-red-400'
            }`}>
              {templatesSynced ? '✓ Synced' : '✗ Out of sync'}
            </div>
            <div className="text-[10px] mt-1 text-gray-400 truncate">
              {reactLogo?.templateId || 'none'} | {zustandLogo?.templateId || 'none'}
            </div>
          </div>
          
          <div className={`p-3 rounded-lg border transition-all duration-200 ${
            templateLoaded 
              ? 'bg-green-500/20 border-green-500/30' 
              : 'bg-orange-500/20 border-orange-500/30'
          }`}>
            <div className="font-medium text-xs text-gray-300">Template Loading</div>
            <div className={`text-sm font-semibold mt-1 ${
              templateLoaded ? 'text-green-400' : 'text-orange-400'
            }`}>
              {templateLoaded ? '✓ Loaded' : '⏳ Loading...'}
            </div>
            <div className="text-[10px] mt-1 text-gray-400">
              {reactLogo?.code ? `${reactLogo.code.length} chars` : 'No code'}
            </div>
          </div>
        </div>
        
        {/* State Details */}
        <div className="space-y-3">
          {/* React State */}
          <div className="p-3 bg-gradient-to-r from-green-500/10 to-transparent rounded-lg border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              <h5 className="font-medium text-xs text-green-400">React State</h5>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-gray-500">Selected:</span>
                <span className="ml-1 text-white font-medium">{selectedLogoId}</span>
              </div>
              <div>
                <span className="text-gray-500">Logos:</span>
                <span className="ml-1 text-white font-medium">{reactLogos.length}</span>
              </div>
              <div>
                <span className="text-gray-500">Template:</span>
                <span className="ml-1 text-white font-medium truncate">{reactLogo?.templateName || 'None'}</span>
              </div>
              <div>
                <span className="text-gray-500">Position:</span>
                <span className="ml-1 text-white font-medium font-mono">
                  {reactLogo?.position ? `(${reactLogo.position.x}, ${reactLogo.position.y})` : 'Default'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Zustand Store */}
          <div className="p-3 bg-gradient-to-r from-blue-500/10 to-transparent rounded-lg border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
              <h5 className="font-medium text-xs text-blue-400">Zustand Store</h5>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-gray-500">Selected:</span>
                <span className="ml-1 text-white font-medium">{zustandSelectedId}</span>
              </div>
              <div>
                <span className="text-gray-500">Logos:</span>
                <span className="ml-1 text-white font-medium">{zustandLogos.length}</span>
              </div>
              <div>
                <span className="text-gray-500">Template:</span>
                <span className="ml-1 text-white font-medium truncate">{zustandLogo?.templateName || 'None'}</span>
              </div>
              <div>
                <span className="text-gray-500">Zoom:</span>
                <span className="ml-1 text-white font-medium">{(zoom * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
          
          {/* Persistence Layer */}
          <div className="p-3 bg-gradient-to-r from-purple-500/10 to-transparent rounded-lg border border-purple-500/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-purple-400"></div>
              <h5 className="font-medium text-xs text-purple-400">Persistence Layer</h5>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-gray-500">Canvas Offset:</span>
                <span className="ml-1 text-white font-medium font-mono">
                  ({savedOffset.x.toFixed(0)}, {savedOffset.y.toFixed(0)})
                </span>
              </div>
              <div>
                <span className="text-gray-500">Parse Status:</span>
                <span className={`ml-1 font-medium ${localStorageParseError ? 'text-red-400' : 'text-green-400'}`}>
                  {localStorageParseError ? 'Error' : 'Valid'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Canvas State */}
          <div className="p-3 bg-gradient-to-r from-orange-500/10 to-transparent rounded-lg border border-orange-500/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-orange-400"></div>
              <h5 className="font-medium text-xs text-orange-400">Canvas State</h5>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-gray-500">Current Offset:</span>
                <span className="ml-1 text-white font-medium font-mono">
                  {canvasOffset ? `(${canvasOffset.x.toFixed(0)}, ${canvasOffset.y.toFixed(0)})` : 'Unknown'}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Center Status:</span>
                <span className={`ml-1 font-medium ${
                  canvasOffset && Math.abs(canvasOffset.x - expectedCenterOffset.x) < 10 && Math.abs(canvasOffset.y - expectedCenterOffset.y) < 10
                    ? 'text-green-400' : 'text-yellow-400'
                }`}>
                  {canvasOffset && Math.abs(canvasOffset.x - expectedCenterOffset.x) < 10 && Math.abs(canvasOffset.y - expectedCenterOffset.y) < 10
                    ? 'Centered' : 'Off-center'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  function renderDetails() {
    return (
      <div className="space-y-3">{renderOriginalContent()}</div>
    );
  }
  
  function renderUtilities() {
    return (
      <div className="space-y-3">
        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <span className="text-base">🔧</span>
          Developer Utilities
        </h4>
        
        {/* Quick Actions */}
        <div className="space-y-2">
          <h5 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Quick Actions</h5>
          
          <button 
            className="w-full px-3 py-2.5 rounded-lg text-xs font-medium text-left
                       bg-blue-500/20 hover:bg-blue-500/30 
                       text-blue-400
                       border border-blue-500/30 hover:border-blue-500/40
                       transition-all duration-200
                       group flex items-center justify-between"
            onClick={() => {
              // Create multi-logo test scenario
              const testLogos = [
                { id: 'logo-1', templateId: 'wave-bars', position: { x: 0, y: 0 } },
                { id: 'logo-2', templateId: 'circle-wave', position: { x: 700, y: 0 } },
                { id: 'logo-3', templateId: 'infinity-loop', position: { x: 0, y: 700 } }
              ];
              console.log('🚀 Loading test scenario:', testLogos);
              // Would need to call appropriate store actions here
            }}
          >
            <span>Load Multi-Logo Layout</span>
            <span className="text-[10px] opacity-60 group-hover:opacity-100">3 logos</span>
          </button>
          
          <button 
            className="w-full px-3 py-2.5 rounded-lg text-xs font-medium text-left
                       bg-purple-500/20 hover:bg-purple-500/30 
                       text-purple-400
                       border border-purple-500/30 hover:border-purple-500/40
                       transition-all duration-200
                       group flex items-center justify-between"
            onClick={() => {
              console.log('🎭 Simulating state mismatch scenario');
              // Would create intentional state mismatch for testing
            }}
          >
            <span>Simulate State Mismatch</span>
            <span className="text-[10px] opacity-60 group-hover:opacity-100">Debug test</span>
          </button>
          
          <button 
            className="w-full px-3 py-2.5 rounded-lg text-xs font-medium text-left
                       bg-green-500/20 hover:bg-green-500/30 
                       text-green-400
                       border border-green-500/30 hover:border-green-500/40
                       transition-all duration-200"
            onClick={() => {
              if (canvasOffset && typeof window !== 'undefined') {
                localStorage.setItem('recast-canvas-offset', JSON.stringify(canvasOffset));
                console.log('🔄 Synced canvas state to localStorage');
                // Trigger re-render to show sync status update
                window.dispatchEvent(new Event('storage'));
              }
            }}
          >
            <span>Force Sync All States</span>
          </button>
        </div>
        
        {/* Destructive Actions */}
        <div className="space-y-2 mt-4">
          <h5 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Reset Options</h5>
          
          <button 
            className="w-full px-3 py-2.5 rounded-lg text-xs font-medium text-left
                       bg-orange-500/20 hover:bg-orange-500/30 
                       text-orange-400
                       border border-orange-500/30 hover:border-orange-500/40
                       transition-all duration-200"
            onClick={() => {
              if (confirm('Clear localStorage and keep page state?')) {
                localStorage.removeItem('recast-canvas-offset');
                localStorage.removeItem('recast-logos');
                console.log('🧹 Cleared localStorage (no reload)');
              }
            }}
          >
            <span>Clear localStorage Only</span>
          </button>
          
          <button 
            className="w-full px-3 py-2.5 rounded-lg text-xs font-medium text-left
                       bg-red-500/20 hover:bg-red-500/30 
                       text-red-400
                       border border-red-500/30 hover:border-red-500/40
                       transition-all duration-200
                       group"
            onClick={() => {
              if (confirm('This will clear ALL data and reload. Are you sure?')) {
                localStorage.clear();
                sessionStorage.clear();
                window.location.reload();
              }
            }}
          >
            <span>Reset Everything</span>
            <span className="text-[10px] opacity-60 group-hover:opacity-100 block">
              Clears all storage & reloads
            </span>
          </button>
        </div>
        
        {/* Debug Info */}
        <div className="mt-4 p-3 bg-white/5 rounded-lg border border-gray-700/50">
          <h5 className="text-xs font-medium text-gray-400 mb-2">Debug Info</h5>
          <div className="space-y-1 text-[10px] text-gray-500 font-mono">
            <div>ENV: {process.env.NODE_ENV}</div>
            <div>localStorage keys: {Object.keys(localStorage).length}</div>
            <div>React: {reactLogos.length} logos</div>
            <div>Zustand: {zustandLogos.length} logos</div>
          </div>
        </div>
      </div>
    );
  }
  
  function renderOriginalContent() {
    return (
      <>
        <div className="mb-3">
          <h4 className="font-medium text-sm mb-2 text-green-400">React State</h4>
          <div className="pl-2">
            <div>ID: {reactLogo?.id}</div>
            <div>Template ID: {reactLogo?.templateId || 'undefined'}</div>
            <div>Template Name: {reactLogo?.templateName || 'undefined'}</div>
            <div>Code Length: {reactLogo?.code?.length || 0}</div>
            <div>Code Preview: {reactLogo?.code?.substring(0, 50)}...</div>
          </div>
        </div>
      
      <div className="mb-3">
        <h4 className="font-medium text-sm mb-2 text-blue-400">Zustand Store</h4>
        <div className="pl-2">
          <div>ID: {zustandLogo?.id}</div>
          <div>Template ID: {zustandLogo?.templateId || 'undefined'}</div>
          <div>Template Name: {zustandLogo?.templateName || 'undefined'}</div>
          <div>Code Length: {zustandLogo?.code?.length || 0}</div>
          <div>Code Preview: {zustandLogo?.code?.substring(0, 50)}...</div>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-white/20">
        <h4 className="font-medium text-sm mb-2 text-blue-400 flex items-center gap-2"><span className="text-base">📐</span>Viewport & Positioning</h4>
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
        <h4 className="font-medium text-sm mb-2 text-purple-400 flex items-center gap-2"><span className="text-base">💾</span>LocalStorage</h4>
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
        <h4 className="font-medium text-sm mb-2 text-orange-400 flex items-center gap-2"><span className="text-base">📦</span>Logo Bounds</h4>
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
      </>
    );
  }
}