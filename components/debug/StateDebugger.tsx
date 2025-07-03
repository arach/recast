'use client';

import { useState, useEffect } from 'react';
import { useLogoStore } from '@/lib/stores/logoStore';
import { useUIStore } from '@/lib/stores/uiStore';
import { Maximize2, Minimize2, ChevronDown, ChevronUp, X, Copy, Check } from 'lucide-react';
import { useDebugActions } from '@/lib/debug/debugRegistry';
import { StateTreeView } from './StateTreeView';
import { copyExpandedState, formatForClipboard, copyToClipboard } from '@/lib/debug/copyExpandedState';

interface StateDebuggerProps {
  selectedLogo: any;
  selectedLogoId: string;
  onClearCanvasPosition?: () => void;
  canvasOffset?: { x: number, y: number };
  onClose?: () => void;
}

type DebugTab = 'dashboard' | 'details' | 'utilities' | 'state';

export function StateDebugger({ 
  selectedLogo, 
  selectedLogoId,
  onClearCanvasPosition,
  canvasOffset,
  onClose
}: StateDebuggerProps) {
  const [activeTab, setActiveTab] = useState<DebugTab>('dashboard');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // State for tracking expanded paths per section
  const [expandedPaths, setExpandedPaths] = useState<{
    react: Set<string>;
    logo: Set<string>;
    ui: Set<string>;
    localStorage: Set<string>;
  }>({
    react: new Set(['reactState', 'reactState.selectedLogo']),
    logo: new Set(['logoStore', 'logoStore.logos']),
    ui: new Set(['uiStore']),
    localStorage: new Set(['localStorage'])
  });
  
  // State for copy feedback
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  
  const zustandLogos = useLogoStore(state => state.logos);
  const zustandSelectedId = useLogoStore(state => state.selectedLogoId);
  const zoom = useUIStore(state => state.zoom);
  
  // Get full store states for state viewer
  const fullLogoStore = useLogoStore();
  const fullUIStore = useUIStore();
  
  // Get registered debug actions
  const { actions, categories } = useDebugActions();
  
  const reactLogo = selectedLogo; // React now only knows about selected logo
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

  // Calculate logo bounding box for selected logo
  const logoSize = 600;
  let logoBounds = null;
  if (selectedLogo) {
    const position = selectedLogo.position || { x: 0, y: 0 };
    logoBounds = {
      minX: position.x,
      maxX: position.x + logoSize,
      minY: position.y,
      maxY: position.y + logoSize,
      centerX: position.x + logoSize / 2,
      centerY: position.y + logoSize / 2,
      width: logoSize,
      height: logoSize
    };
  }
  
  return (
    <div className={`fixed bottom-4 right-4 rounded-xl text-xs font-sans z-50 
                bg-gray-900/95 dark:bg-black/95 
                backdrop-blur-sm
                border border-gray-700/50 dark:border-gray-800
                transition-all duration-700
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
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-gray-400 hover:text-white
                         hover:bg-white/10 transition-all duration-200
                         hover:scale-110 active:scale-95"
              title="Close debug toolbar"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
      
      {/* Collapsible Content */}
      <div className={`overflow-hidden transition-all duration-500
                      ${isMinimized ? 'max-h-0' : 'max-h-[800px]'}`}>
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700/50">
          {[
            { id: 'dashboard' as const, label: 'Dashboard', icon: '📊', title: 'Multi-state overview' },
            { id: 'details' as const, label: 'Details', icon: '🔍', title: 'Detailed state inspection' },
            { id: 'utilities' as const, label: 'Utils', icon: '🔧', title: 'Developer utilities' },
            { id: 'state' as const, label: 'State', icon: '🌳', title: 'Full state tree' }
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
                        transition-all duration-700
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
      case 'state':
        return renderFullState();
    }
  }
  
  function renderDashboard() {
    // Calculate sync status
    const canvasStateSynced = canvasOffset && savedOffset && 
      Math.abs(canvasOffset.x - savedOffset.x) < 10 && 
      Math.abs(canvasOffset.y - savedOffset.y) < 10;
    
    const idsSynced = selectedLogoId === zustandSelectedId;
    const templatesSynced = reactLogo?.templateId === zustandLogo?.templateId;
    const logoCountSynced = (selectedLogo ? 1 : 0) === zustandLogos.filter(l => l.id === selectedLogoId).length;
    
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
                <span className="text-gray-500">Has Logo:</span>
                <span className="ml-1 text-white font-medium">{selectedLogo ? 'Yes' : 'No'}</span>
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
        
        {/* Dynamic Actions from Registry */}
        {categories.length > 0 ? (
          categories.map(category => (
            <div key={category} className="space-y-2">
              <h5 className="text-xs font-medium text-gray-400 uppercase tracking-wider">{category}</h5>
              {actions
                .filter(action => action.category === category)
                .map(action => (
                  <button
                    key={action.id}
                    className={`w-full px-3 py-2.5 rounded-lg text-xs font-medium text-left
                               ${action.dangerous 
                                 ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30 hover:border-red-500/40' 
                                 : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border-blue-500/30 hover:border-blue-500/40'}
                               border transition-all duration-200
                               group flex items-center justify-between`}
                    onClick={action.handler}
                  >
                    <span className="flex items-center gap-2">
                      {action.icon && <span>{action.icon}</span>}
                      <span>{action.label}</span>
                    </span>
                    {action.description && (
                      <span className="text-[10px] opacity-60 group-hover:opacity-100">{action.description}</span>
                    )}
                  </button>
                ))}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No debug actions registered</p>
            <p className="text-xs mt-1">Components can register actions using useDebugAction</p>
          </div>
        )}
        
        {/* Built-in System Actions */}
        <div className="space-y-2 mt-4">
          <h5 className="text-xs font-medium text-gray-400 uppercase tracking-wider">System Actions</h5>
          
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
          
          {onClearCanvasPosition && (
            <button
              onClick={onClearCanvasPosition}
              className="w-full px-3 py-2.5 rounded-lg text-xs font-medium text-left
                         bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 
                         border border-orange-500/30 hover:border-orange-500/40 
                         transition-all duration-200"
              title="Clear saved canvas position and reset centering flag"
            >
              Clear Canvas Position
            </button>
          )}
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
                if (typeof window !== 'undefined' && (window as any).clearLogoIds) {
                  (window as any).clearLogoIds();
                }
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
            <div>React: {selectedLogo ? '1 selected' : 'none'}</div>
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
              <div>Has Logo: {selectedLogo ? 'Yes' : 'No'}</div>
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
  
  function renderFullState() {
    return (
      <div className="space-y-4">
        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <span className="text-base">🌳</span>
          Full State Tree
        </h4>
        
        {/* Logo Store State */}
        <div className="space-y-2">
          <h5 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Logo Store</h5>
          <div className="p-3 bg-white/5 rounded-lg border border-gray-700/50">
            <pre className="text-[10px] text-gray-300 font-mono whitespace-pre-wrap overflow-x-auto">
              {JSON.stringify({
                logos: fullLogoStore.logos,
                selectedLogoId: fullLogoStore.selectedLogoId,
                // Add other relevant logo store properties
              }, null, 2)}
            </pre>
          </div>
        </div>
        
        {/* UI Store State */}
        <div className="space-y-2">
          <h5 className="text-xs font-medium text-gray-400 uppercase tracking-wider">UI Store</h5>
          <div className="p-3 bg-white/5 rounded-lg border border-gray-700/50">
            <pre className="text-[10px] text-gray-300 font-mono whitespace-pre-wrap overflow-x-auto">
              {JSON.stringify({
                zoom: fullUIStore.zoom,
                // Add other relevant UI store properties
              }, null, 2)}
            </pre>
          </div>
        </div>
        
        {/* Component Props */}
        <div className="space-y-2">
          <h5 className="text-xs font-medium text-gray-400 uppercase tracking-wider">Component Props</h5>
          <div className="p-3 bg-white/5 rounded-lg border border-gray-700/50">
            <pre className="text-[10px] text-gray-300 font-mono whitespace-pre-wrap overflow-x-auto">
              {JSON.stringify({
                selectedLogo,
                selectedLogoId,
                canvasOffset,
              }, null, 2)}
            </pre>
          </div>
        </div>
        
        {/* localStorage State */}
        <div className="space-y-2">
          <h5 className="text-xs font-medium text-gray-400 uppercase tracking-wider">localStorage</h5>
          <div className="p-3 bg-white/5 rounded-lg border border-gray-700/50">
            <pre className="text-[10px] text-gray-300 font-mono whitespace-pre-wrap overflow-x-auto">
              {JSON.stringify({
                'recast-canvas-offset': savedOffset,
                'parse-error': localStorageParseError,
                'raw-value': savedCanvasOffset,
              }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  }
  
  function renderFullState() {
    // Get all zustand stores we can find
    const logoStoreState = fullLogoStore;
    const uiStoreState = fullUIStore;
    
    // React state from props - Now only has selected logo
    const reactState = {
      selectedLogo: selectedLogo,
      selectedLogoId,
      canvasOffset,
    };
    
    // Filter out functions from store states
    const cleanStoreState = (store: any) => {
      const cleaned: any = {};
      Object.keys(store).forEach(key => {
        if (typeof store[key] !== 'function') {
          cleaned[key] = store[key];
        }
      });
      return cleaned;
    };
    
    // Get localStorage data
    const localStorageData: Record<string, any> = {};
    if (typeof window !== 'undefined') {
      Object.keys(localStorage).forEach(key => {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            // Try to parse JSON values
            try {
              localStorageData[key] = JSON.parse(value);
            } catch {
              // If not JSON, store as string
              localStorageData[key] = value;
            }
          }
        } catch (e) {
          localStorageData[key] = '[Error reading value]';
        }
      });
    }
    
    // Handle expand/collapse for each section
    const handleExpandedChange = (section: keyof typeof expandedPaths) => (path: string, expanded: boolean) => {
      setExpandedPaths(prev => {
        const newPaths = new Set(prev[section]);
        if (expanded) {
          newPaths.add(path);
        } else {
          newPaths.delete(path);
        }
        return { ...prev, [section]: newPaths };
      });
    };
    
    // Copy only expanded state
    const handleCopy = async (section: keyof typeof expandedPaths, data: any) => {
      const expandedData = copyExpandedState(data, expandedPaths[section]);
      const formatted = formatForClipboard(expandedData);
      const success = await copyToClipboard(formatted);
      
      if (success) {
        setCopiedSection(section);
        setTimeout(() => setCopiedSection(null), 2000);
      }
    };
    
    // Copy all expanded state from all sections
    const handleCopyAll = async () => {
      const allState = {
        reactState: copyExpandedState({ reactState }, expandedPaths.react).reactState,
        logoStore: copyExpandedState({ logoStore: cleanStoreState(logoStoreState) }, expandedPaths.logo).logoStore,
        uiStore: copyExpandedState({ uiStore: cleanStoreState(uiStoreState) }, expandedPaths.ui).uiStore,
        localStorage: copyExpandedState({ localStorage: localStorageData }, expandedPaths.localStorage).localStorage,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : 'unknown'
      };
      
      const formatted = formatForClipboard(allState);
      const success = await copyToClipboard(formatted);
      
      if (success) {
        setCopiedSection('all');
        setTimeout(() => setCopiedSection(null), 2000);
      }
    };
    
    return (
      <div className="space-y-4 text-[11px] font-mono">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm flex items-center gap-2 font-sans">
            <span className="text-base">🌳</span>
            Full State Tree
          </h4>
          <button
            onClick={handleCopyAll}
            className="px-2 py-1 rounded text-xs font-medium bg-gray-700/50 hover:bg-gray-700 
                       text-gray-300 hover:text-white transition-all duration-200 
                       flex items-center gap-1"
            title="Copy all expanded state"
          >
            {copiedSection === 'all' ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy All</span>
              </>
            )}
          </button>
        </div>
        
        {/* React State */}
        <div className="bg-gradient-to-r from-green-500/10 to-transparent rounded-lg border border-green-500/20 p-3">
          <div className="flex items-center justify-between mb-2">
            <h5 className="font-medium text-xs text-green-400 flex items-center gap-2 font-sans">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
              React State (Props)
            </h5>
            <button
              onClick={() => handleCopy('react', { reactState })}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              title="Copy expanded state"
            >
              {copiedSection === 'react' ? (
                <Check className="w-3.5 h-3.5 text-green-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-gray-400" />
              )}
            </button>
          </div>
          <StateTreeView 
            name="reactState" 
            data={reactState}
            expandedPaths={expandedPaths.react}
            onExpandedChange={handleExpandedChange('react')}
          />
        </div>
        
        {/* Logo Store State */}
        <div className="bg-gradient-to-r from-blue-500/10 to-transparent rounded-lg border border-blue-500/20 p-3">
          <div className="flex items-center justify-between mb-2">
            <h5 className="font-medium text-xs text-blue-400 flex items-center gap-2 font-sans">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
              Zustand: Logo Store
            </h5>
            <button
              onClick={() => handleCopy('logo', { logoStore: cleanStoreState(logoStoreState) })}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              title="Copy expanded state"
            >
              {copiedSection === 'logo' ? (
                <Check className="w-3.5 h-3.5 text-green-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-gray-400" />
              )}
            </button>
          </div>
          <StateTreeView 
            name="logoStore" 
            data={cleanStoreState(logoStoreState)}
            hideKeys={['code']} // Hide code fields
            expandedPaths={expandedPaths.logo}
            onExpandedChange={handleExpandedChange('logo')}
          />
        </div>
        
        {/* UI Store State */}
        <div className="bg-gradient-to-r from-purple-500/10 to-transparent rounded-lg border border-purple-500/20 p-3">
          <div className="flex items-center justify-between mb-2">
            <h5 className="font-medium text-xs text-purple-400 flex items-center gap-2 font-sans">
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></div>
              Zustand: UI Store
            </h5>
            <button
              onClick={() => handleCopy('ui', { uiStore: cleanStoreState(uiStoreState) })}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              title="Copy expanded state"
            >
              {copiedSection === 'ui' ? (
                <Check className="w-3.5 h-3.5 text-green-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-gray-400" />
              )}
            </button>
          </div>
          <StateTreeView 
            name="uiStore" 
            data={cleanStoreState(uiStoreState)}
            expandedPaths={expandedPaths.ui}
            onExpandedChange={handleExpandedChange('ui')}
          />
        </div>
        
        {/* Browser State */}
        <div className="bg-gradient-to-r from-orange-500/10 to-transparent rounded-lg border border-orange-500/20 p-3">
          <div className="flex items-center justify-between mb-2">
            <h5 className="font-medium text-xs text-orange-400 flex items-center gap-2 font-sans">
              <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></div>
              Browser State
            </h5>
            <button
              onClick={() => handleCopy('localStorage', { localStorage: localStorageData })}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              title="Copy expanded state"
            >
              {copiedSection === 'localStorage' ? (
                <Check className="w-3.5 h-3.5 text-green-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-gray-400" />
              )}
            </button>
          </div>
          <StateTreeView 
            name="localStorage" 
            data={localStorageData}
            expandedPaths={expandedPaths.localStorage}
            onExpandedChange={handleExpandedChange('localStorage')}
          />
        </div>
        
        {/* Actions Reference */}
        <div className="bg-gradient-to-r from-gray-500/10 to-transparent rounded-lg border border-gray-500/20 p-3">
          <h5 className="font-medium text-xs text-gray-400 mb-2 flex items-center gap-2 font-sans">
            <div className="w-2 h-2 rounded-full bg-gray-400"></div>
            Available Store Actions
          </h5>
          <div className="text-gray-500 space-y-1">
            <div>
              <span className="text-cyan-400">logoStore:</span>
              <div className="ml-4 text-[10px]">
                {Object.keys(fullLogoStore).filter(key => typeof (fullLogoStore as any)[key] === 'function').join(', ')}
              </div>
            </div>
            <div>
              <span className="text-cyan-400">uiStore:</span>
              <div className="ml-4 text-[10px]">
                {Object.keys(fullUIStore).filter(key => typeof (fullUIStore as any)[key] === 'function').join(', ')}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}