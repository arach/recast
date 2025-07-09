'use client';

import React, { useEffect, useState } from 'react';
import { getAllJSTemplates } from '@/lib/js-template-registry';
import { ChevronDown, ChevronRight, Palette, SlidersHorizontal, Type, ToggleLeft, ToggleRight } from 'lucide-react';

interface TemplateParameterControlsProps {
  templateId: string;
  parameters: any;
  onChange: (parameters: any) => void;
  className?: string;
}

export default function TemplateParameterControls({
  templateId,
  parameters,
  onChange,
  className = ''
}: TemplateParameterControlsProps) {
  const [templateDefinition, setTemplateDefinition] = useState<any>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['main']));
  const [loading, setLoading] = useState(true);

  // Load template definition to get parameter metadata
  useEffect(() => {
    async function loadTemplate() {
      setLoading(true);
      try {
        const templates = await getAllJSTemplates();
        const template = templates.find(t => t.id === templateId);
        if (template) {
          setTemplateDefinition(template);
        }
      } catch (error) {
        console.error('Failed to load template definition:', error);
      } finally {
        setLoading(false);
      }
    }
    loadTemplate();
  }, [templateId]);

  const handleParameterChange = (key: string, value: any) => {
    onChange({
      ...parameters,
      [key]: value
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const renderControl = (key: string, paramDef: any) => {
    const value = parameters[key] ?? paramDef.default;

    switch (paramDef.type) {
      case 'slider':
        return (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-white/70">{paramDef.label || key}</label>
              <span className="text-xs text-white/50 font-mono">
                {value}{paramDef.unit || ''}
              </span>
            </div>
            <input
              type="range"
              min={paramDef.min}
              max={paramDef.max}
              step={paramDef.step || 1}
              value={value}
              onChange={(e) => handleParameterChange(key, parseFloat(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        );

      case 'toggle':
        return (
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-white/70">{paramDef.label || key}</label>
            <button
              onClick={() => handleParameterChange(key, !value)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${
                value ? 'bg-blue-500/40' : 'bg-white/10'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
                  value ? 'translate-x-4' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        );

      case 'select':
        return (
          <div className="space-y-2">
            <label className="text-xs font-medium text-white/70">{paramDef.label || key}</label>
            <select
              value={value}
              onChange={(e) => handleParameterChange(key, e.target.value)}
              className="w-full px-2 py-1 text-xs bg-white/5 border border-white/10 rounded text-white/90 focus:outline-none focus:border-blue-400/50"
            >
              {paramDef.options.map((option: any) => (
                <option key={option.value} value={option.value} className="bg-gray-900">
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'color':
        return (
          <div className="space-y-2">
            <label className="text-xs font-medium text-white/70">{paramDef.label || key}</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={value}
                onChange={(e) => handleParameterChange(key, e.target.value)}
                className="w-8 h-8 rounded border border-white/20 cursor-pointer"
              />
              <input
                type="text"
                value={value}
                onChange={(e) => handleParameterChange(key, e.target.value)}
                className="flex-1 px-2 py-1 text-xs bg-white/5 border border-white/10 rounded text-white/90 font-mono focus:outline-none focus:border-blue-400/50"
              />
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-2">
            <label className="text-xs font-medium text-white/70">{paramDef.label || key}</label>
            <input
              type="text"
              value={value}
              onChange={(e) => handleParameterChange(key, e.target.value)}
              className="w-full px-2 py-1 text-xs bg-white/5 border border-white/10 rounded text-white/90 focus:outline-none focus:border-blue-400/50"
            />
          </div>
        );

      default:
        return null;
    }
  };

  // Group parameters by category
  const groupParameters = () => {
    if (!templateDefinition?.parameters) return {};
    
    const groups: Record<string, Array<[string, any]>> = {
      main: []
    };

    Object.entries(templateDefinition.parameters).forEach(([key, param]) => {
      const category = (param as any).category || 'main';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push([key, param]);
    });

    return groups;
  };

  if (loading) {
    return (
      <div className={`${className} animate-pulse`}>
        <div className="space-y-3">
          <div className="h-8 bg-white/5 rounded"></div>
          <div className="h-8 bg-white/5 rounded"></div>
          <div className="h-8 bg-white/5 rounded"></div>
        </div>
      </div>
    );
  }

  if (!templateDefinition?.parameters) {
    return (
      <div className={`${className} text-white/50 text-xs text-center py-4`}>
        No parameters available for this template
      </div>
    );
  }

  const parameterGroups = groupParameters();

  return (
    <div className={`${className} space-y-4`}>
      <h3 className="font-bold text-white/80 text-base mb-3 flex items-center gap-2">
        <SlidersHorizontal size={16} className="text-white/60" />
        Template Parameters
      </h3>
      
      <div className="space-y-3">
        {Object.entries(parameterGroups).map(([category, params]) => (
          <div key={category} className="bg-white/[0.015] border border-white/[0.04] rounded-lg overflow-hidden">
            <button
              onClick={() => toggleSection(category)}
              className="w-full px-3 py-2 flex items-center justify-between text-xs font-medium text-white/70 hover:bg-white/[0.02] transition-colors"
            >
              <span className="capitalize">{category === 'main' ? 'General' : category}</span>
              {expandedSections.has(category) ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
            </button>
            
            {expandedSections.has(category) && (
              <div className="px-3 py-3 space-y-4 border-t border-white/[0.04]">
                {params.map(([key, param]) => (
                  <div key={key}>
                    {renderControl(key, param)}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Add custom styles for the slider
const styles = `
  .slider::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    background: white;
    cursor: pointer;
    border-radius: 50%;
    box-shadow: 0 0 0 1px rgba(0,0,0,0.1);
  }
  
  .slider::-moz-range-thumb {
    width: 12px;
    height: 12px;
    background: white;
    cursor: pointer;
    border-radius: 50%;
    border: none;
    box-shadow: 0 0 0 1px rgba(0,0,0,0.1);
  }
`;

if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}