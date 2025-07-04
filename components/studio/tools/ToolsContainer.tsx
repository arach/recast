'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ToolItem } from './ToolItem';
import { UnifiedParametersTool } from './UnifiedParametersTool';
import { BrandStyleTool } from './BrandStyleTool';
import { ColorThemeTool } from './ColorThemeTool';
import { TemplatePresetsTool } from './TemplatePresetsTool';
import { BrandPresetsTool } from './BrandPresetsTool';
import { BrandPersonality } from '../BrandPersonality';
import { AIBrandConsultant } from '../AIBrandConsultant';
import { AISuggestions } from '../AISuggestions';
import { Palette, Layers, Package, Sparkles, Brain, Lightbulb, Sliders, Paintbrush, Type, Settings2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUIStore } from '@/lib/stores/uiStore';
import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo';

interface Tool {
  id: string;
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  component: React.ComponentType;
  defaultExpanded?: boolean;
  enabled?: boolean;
}

const tools: Tool[] = [
  {
    id: 'brand-style',
    title: 'Brand & Style',
    icon: Paintbrush,
    component: BrandStyleTool,
    defaultExpanded: true,
    enabled: true,
  },
  {
    id: 'parameters',
    title: 'Parameters',
    icon: Sliders,
    component: UnifiedParametersTool,
    defaultExpanded: true,
    enabled: true,
  },
  {
    id: 'color-theme',
    title: 'Color Themes',
    icon: Palette,
    component: ColorThemeTool,
    defaultExpanded: false,
    enabled: true,
  },
  {
    id: 'template-presets',
    title: 'Template Variations',
    icon: Layers,
    component: TemplatePresetsTool,
    defaultExpanded: false,
    enabled: true,
  },
  {
    id: 'brand-presets',
    title: 'Brand Presets',
    icon: Package,
    component: BrandPresetsTool,
    defaultExpanded: false,
    enabled: false, // Can be enabled via settings
  },
  {
    id: 'brand-personality',
    title: 'Brand Personality',
    icon: Sparkles,
    component: BrandPersonality,
    defaultExpanded: false,
    enabled: false, // Can be enabled via settings
  },
  {
    id: 'ai-consultant',
    title: 'AI Brand Consultant',
    icon: Brain,
    component: AIBrandConsultant,
    defaultExpanded: false,
    enabled: false, // Minimized for now
  },
  {
    id: 'ai-suggestions',
    title: 'AI Suggestions',
    icon: Lightbulb,
    component: AISuggestions,
    defaultExpanded: false,
    enabled: false, // Minimized for now
  },
];

const STORAGE_KEY_WIDTH = 'recast-tools-width';
const STORAGE_KEY_EXPANDED = 'recast-tools-expanded';
const STORAGE_KEY_COLLAPSED = 'recast-tools-collapsed';

export function ToolsContainer() {
  const { darkMode } = useUIStore();
  const { logo: selectedLogo } = useSelectedLogo();
  
  // Add CSS animations
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      .animate-slideIn {
        animation: slideIn 200ms ease-out;
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])
  
  const [width, setWidth] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY_WIDTH);
      return stored ? parseInt(stored, 10) : 380;
    }
    return 380;
  });
  
  const [isResizing, setIsResizing] = useState(false);
  
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY_COLLAPSED);
      return stored === 'true';
    }
    return false;
  });
  
  const [expandedTools, setExpandedTools] = useState<Set<string>>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY_EXPANDED);
      if (stored) {
        return new Set(JSON.parse(stored));
      }
    }
    return new Set(tools.filter(t => t.defaultExpanded).map(t => t.id));
  });
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const newWidth = window.innerWidth - e.clientX;
      setWidth(Math.max(320, Math.min(600, newWidth)));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = '';
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Persist width changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_WIDTH, width.toString());
    }
  }, [width]);

  // Persist expanded tools changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_EXPANDED, JSON.stringify(Array.from(expandedTools)));
    }
  }, [expandedTools]);

  // Persist collapsed state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_COLLAPSED, String(isCollapsed));
    }
  }, [isCollapsed]);

  const toggleTool = (toolId: string) => {
    setExpandedTools(prev => {
      const next = new Set(prev);
      if (next.has(toolId)) {
        next.delete(toolId);
      } else {
        next.add(toolId);
      }
      return next;
    });
  };

  return (
    <div 
      ref={containerRef}
      className="absolute right-0 top-0 h-full flex transition-all duration-200 ease-out z-30"
      style={{ width: isCollapsed ? '48px' : `${width}px` }}
    >
      {/* Resize Handle - only show when not collapsed */}
      {!isCollapsed && (
        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 w-3 cursor-ew-resize z-10 group",
            "-translate-x-1/2"
          )}
          onMouseDown={() => setIsResizing(true)}
        >
          <div className={cn(
            "absolute inset-x-0 inset-y-0 bg-blue-500 opacity-0 transition-opacity",
            "group-hover:opacity-20",
            isResizing && "opacity-30"
          )} />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-1 rounded-full bg-gray-600 opacity-0 group-hover:opacity-50 transition-opacity" />
        </div>
      )}

      {/* Collapsed state - narrow sidebar */}
      {isCollapsed && (
        <div 
          className={cn(
            "flex-1 border-l flex flex-col cursor-pointer transition-all duration-300 shadow-2xl",
            darkMode 
              ? "bg-zinc-900/95 border-white/10 hover:bg-zinc-800/95" 
              : "bg-white/95 border-gray-200 hover:bg-gray-50/95",
            "backdrop-blur-sm"
          )}
          onClick={() => setIsCollapsed(false)}
          title="Expand tools panel"
        >
          {/* Expand chevron tab */}
          <button
            className={cn(
              "absolute -left-5 top-1/2 -translate-y-1/2 w-5 h-12 rounded-l-lg flex items-center justify-center transition-all duration-200 hover:h-20 hover:-translate-x-1 shadow-md",
              darkMode 
                ? "bg-zinc-800 hover:bg-zinc-700 text-gray-400 hover:text-white" 
                : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900"
            )}
            title="Expand tools panel"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          {/* Minimal content */}
          <div className="flex flex-col items-center pt-6 pb-4 gap-4">
            <div className={cn(
              "p-2 rounded-lg transition-transform duration-200 hover:scale-110",
              darkMode ? "text-gray-400" : "text-gray-600"
            )}>
              <Sliders className="w-5 h-5" />
            </div>
            
            {/* Show icons for active tools */}
            {tools.filter(t => t.enabled && expandedTools.has(t.id)).slice(0, 3).map(tool => (
              <div
                key={tool.id}
                className={cn(
                  "p-1.5 rounded transition-transform duration-200 hover:scale-110",
                  darkMode ? "text-gray-500" : "text-gray-400"
                )}
              >
                {tool.icon && <tool.icon className="w-4 h-4" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expanded state - full panel */}
      {!isCollapsed && (
      <div className={cn(
        "flex-1 border-l overflow-hidden shadow-2xl",
        darkMode 
          ? "bg-zinc-900 border-white/10" 
          : "bg-white border-gray-200",
        "animate-slideIn"
      )}>
        {/* Collapse chevron tab - protruding from expanded state */}
        <button
          onClick={() => setIsCollapsed(true)}
          className={cn(
            "absolute -left-5 top-1/2 -translate-y-1/2 w-5 h-12 rounded-l-lg flex items-center justify-center transition-all duration-200 hover:h-20 hover:-translate-x-1 z-50 shadow-md",
            darkMode 
              ? "bg-zinc-800 hover:bg-zinc-700 text-gray-400 hover:text-white" 
              : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900"
          )}
          title="Collapse tools panel"
        >
            <ChevronRight className="w-4 h-4" />
        </button>

        <div className="h-full flex flex-col">
          {/* Header */}
          <div className={cn(
            "px-4 py-3 border-b space-y-2",
            darkMode ? "border-white/10" : "border-gray-200"
          )}>
            <h2 className={cn(
              "text-sm font-medium",
              darkMode ? "text-gray-400" : "text-gray-600"
            )}>Tools</h2>
            
            {/* Template Info */}
            {selectedLogo && (
              <div className={cn(
                "flex items-center gap-2 text-xs",
                darkMode ? "text-gray-500" : "text-gray-600"
              )}>
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="font-medium">{selectedLogo.templateName}</span>
                <span className={darkMode ? "text-gray-600" : "text-gray-400"}>•</span>
                <span>{selectedLogo.id}</span>
              </div>
            )}
          </div>

          {/* Tools List */}
          <div className={cn(
            "flex-1 overflow-y-auto p-2 space-y-2",
            darkMode ? "" : "bg-gray-50"
          )}>
            {tools.filter(tool => tool.enabled !== false).map(tool => (
              <ToolItem
                key={tool.id}
                id={tool.id}
                title={tool.title}
                icon={tool.icon}
                expanded={expandedTools.has(tool.id)}
                onToggle={() => toggleTool(tool.id)}
                darkMode={darkMode}
              >
                <tool.component />
              </ToolItem>
            ))}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}