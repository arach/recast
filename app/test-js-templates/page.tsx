'use client';

import { useEffect, useRef, useState } from 'react';
import { templateRegistry } from '@/lib/template-registry';

// Import the compiled utils
const utilsScript = '/template-utils.js';

export default function TestJSTemplates() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [template, setTemplate] = useState<any>(null);
  const [params, setParams] = useState<any>({});
  const [selectedTemplate, setSelectedTemplate] = useState<string>('prism');
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>(Date.now());

  // Load utils and template
  useEffect(() => {
    async function init() {
      try {
        // Load utils
        const script = document.createElement('script');
        script.src = utilsScript;
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });

        // Get utils from window
        const utils = (window as any).templateUtils?.utils;
        if (!utils) {
          throw new Error('Failed to load template utils');
        }

        // Set utils in registry
        templateRegistry.setUtils(utils);

        // Register and load selected template
        await templateRegistry.register(selectedTemplate);
        
        // Get template data
        const metadata = templateRegistry.getMetadata(selectedTemplate);
        const parameters = templateRegistry.getParameters(selectedTemplate);
        const defaults = templateRegistry.getDefaults(selectedTemplate);

        setTemplate({ metadata, parameters });
        setParams(defaults);
        setLoading(false);
      } catch (err) {
        console.error('Init error:', err);
        setError(err.message);
        setLoading(false);
      }
    }

    init();
  }, [selectedTemplate]);

  // Animation loop
  useEffect(() => {
    if (!template || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      
      try {
        templateRegistry.execute(selectedTemplate, ctx, canvas.width, canvas.height, params, elapsed);
      } catch (err) {
        console.error('Render error:', err);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [template, params]);

  // Update parameter
  const updateParam = (key: string, value: any) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">JavaScript Template Test</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">JavaScript Template Test</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">JavaScript Template Test</h1>
        
        {/* Template selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Template
          </label>
          <select
            value={selectedTemplate}
            onChange={(e) => {
              setSelectedTemplate(e.target.value);
              setLoading(true);
              setError(null);
            }}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="wave-bars">🌊 Wave Bars</option>
            <option value="audio-bars">🎵 Audio Bars</option>
            <option value="wordmark">📝 Wordmark</option>
            <option value="letter-mark">🔤 Letter Mark</option>
            <option value="prism">🔮 Prism</option>
          </select>
        </div>
        
        {template && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold">
              {template.metadata.name}
            </h2>
            <p className="text-gray-600">{template.metadata.description}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Canvas */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              className="w-full h-auto border border-gray-200"
            />
          </div>

          {/* Controls */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Parameters</h3>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {template && Object.entries(template.parameters).map(([key, param]: [string, any]) => {
                // Check visibility
                const visible = !param.when || Object.entries(param.when).every(
                  ([condKey, condValue]) => {
                    const currentValue = params[condKey];
                    return Array.isArray(condValue) 
                      ? condValue.includes(currentValue)
                      : currentValue === condValue;
                  }
                );

                if (!visible) return null;

                return (
                  <div key={key} className="border-b border-gray-200 pb-4 last:border-0">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {param.label || key}
                      {param.unit && <span className="text-gray-500 ml-1">({param.unit})</span>}
                    </label>

                    {param.type === 'slider' && (
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min={param.min}
                          max={param.max}
                          step={param.step || 1}
                          value={params[key] || param.default}
                          onChange={(e) => updateParam(key, parseFloat(e.target.value))}
                          className="flex-1"
                        />
                        <span className="text-sm text-gray-600 w-12 text-right">
                          {params[key] || param.default}
                        </span>
                      </div>
                    )}

                    {param.type === 'select' && (
                      <select
                        value={params[key] || param.default}
                        onChange={(e) => updateParam(key, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        {param.options.map((opt: any) => {
                          const value = typeof opt === 'string' ? opt : opt.value;
                          const label = typeof opt === 'string' ? opt : opt.label;
                          return (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          );
                        })}
                      </select>
                    )}

                    {param.type === 'color' && (
                      <input
                        type="color"
                        value={params[key] || param.default}
                        onChange={(e) => updateParam(key, e.target.value)}
                        className="w-full h-10"
                      />
                    )}

                    {param.type === 'toggle' && (
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={params[key] || param.default}
                          onChange={(e) => updateParam(key, e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm">
                          {params[key] ? (param.onLabel || 'On') : (param.offLabel || 'Off')}
                        </span>
                      </label>
                    )}

                    {param.type === 'text' && (
                      <input
                        type="text"
                        value={params[key] || param.default}
                        onChange={(e) => updateParam(key, e.target.value)}
                        placeholder={param.placeholder}
                        maxLength={param.maxLength}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    )}

                    {param.type === 'number' && (
                      <input
                        type="number"
                        min={param.min}
                        max={param.max}
                        step={param.step}
                        value={params[key] || param.default}
                        onChange={(e) => updateParam(key, parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    )}

                    {param.description && (
                      <p className="text-xs text-gray-500 mt-1">{param.description}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-8 bg-gray-100 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Debug Info</h3>
          <pre className="text-xs overflow-x-auto">
            {JSON.stringify({ params }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}