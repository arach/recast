'use client';

import { useEffect, useRef, useState } from 'react';
import { loadTemplate, executeTemplate } from '@/lib/template-loader';

export default function TestJSTemplate() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [template, setTemplate] = useState(null);
  const [error, setError] = useState(null);
  const [time, setTime] = useState(0);
  
  // Load the template
  useEffect(() => {
    loadTemplate('wave-bars')
      .then(setTemplate)
      .catch(setError);
  }, []);
  
  // Animation loop
  useEffect(() => {
    if (!template || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationId;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      setTime(elapsed);
      
      // Test parameters
      const params = {
        barCount: 40,
        barSpacing: 2,
        colorMode: 'spectrum',
        frequency: 3,
        amplitude: 50,
        backgroundColor: '#ffffff',
        fillColor: '#3b82f6',
        strokeColor: '#1e40af',
        fillOpacity: 1,
        strokeOpacity: 1
      };
      
      executeTemplate(ctx, template, params, elapsed, 600, 400);
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [template]);
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">JavaScript Template Test</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error.message}
        </div>
      )}
      
      {template && (
        <div className="space-y-4">
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="font-bold">Template Metadata:</h2>
            <pre className="text-sm">{JSON.stringify(template.metadata, null, 2)}</pre>
          </div>
          
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="font-bold">Parameters:</h2>
            <pre className="text-sm">{JSON.stringify(template.parameters, null, 2)}</pre>
          </div>
          
          <div>
            <h2 className="font-bold mb-2">Preview (time: {time.toFixed(2)}s):</h2>
            <canvas 
              ref={canvasRef} 
              width={600} 
              height={400}
              className="border border-gray-300"
            />
          </div>
        </div>
      )}
    </div>
  );
}