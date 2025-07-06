'use client'

import React, { useState, useEffect } from 'react'
import { Editor } from '@monaco-editor/react'
import { Play, Pause, Save, X, Maximize2, Minimize2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function EditorMode() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const templateId = searchParams.get('template')
  const logoId = searchParams.get('logo')
  
  const [code, setCode] = useState(`function drawVisualization(ctx, width, height, params, time, utils) {
  // Your template code here
  utils.applyUniversalBackground(ctx, width, height, params);
  
  // Example: Draw animated circles
  const { frequency, amplitude } = params;
  const centerX = width / 2;
  const centerY = height / 2;
  
  for (let i = 0; i < 10; i++) {
    const phase = (time * frequency + i * 0.5) % (Math.PI * 2);
    const radius = 20 + Math.sin(phase) * amplitude;
    
    ctx.beginPath();
    ctx.arc(
      centerX + Math.cos(i) * 100,
      centerY + Math.sin(i) * 100,
      radius,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = utils.colors.spectrum(i / 10);
    ctx.fill();
  }
}`)

  const [parameters, setParameters] = useState({
    frequency: { default: 1, range: [0.1, 5, 0.1] },
    amplitude: { default: 20, range: [0, 50, 1] },
  })

  const [paramValues, setParamValues] = useState({
    frequency: 1,
    amplitude: 20,
  })

  const [isPlaying, setIsPlaying] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showParams, setShowParams] = useState(true)
  const [loading, setLoading] = useState(false)
  const [templateName, setTemplateName] = useState('Custom Template')

  // Load template if specified
  useEffect(() => {
    if (templateId) {
      setLoading(true)
      
      // Load template code
      fetch(`/templates-js/${templateId}.js`)
        .then(res => res.text())
        .then(jsCode => {
          // Extract the drawVisualization function
          const match = jsCode.match(/function drawVisualization[\s\S]*?(?=\n\nexport|$)/)
          if (match) {
            setCode(match[0])
          }
        })
        .catch(err => {
          console.error('Failed to load template:', err)
          setError('Failed to load template')
        })
      
      // Load template parameters
      fetch(`/templates-js/${templateId}.params.json`)
        .then(res => res.json())
        .then(data => {
          setTemplateName(data.metadata?.name || templateId)
          
          // Convert parameters to our format
          const params: any = {}
          const values: any = {}
          
          Object.entries(data.parameters || {}).forEach(([key, param]: [string, any]) => {
            if (param.type === 'slider') {
              params[key] = {
                default: param.default,
                range: [param.min || 0, param.max || 100, param.step || 1]
              }
              values[key] = param.default
            }
          })
          
          setParameters(params)
          setParamValues(values)
          setLoading(false)
        })
        .catch(err => {
          console.error('Failed to load parameters:', err)
          setLoading(false)
        })
    }
  }, [templateId])

  // Canvas rendering
  useEffect(() => {
    const canvas = document.getElementById('preview-canvas') as HTMLCanvasElement
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let startTime = Date.now()

    const render = () => {
      const time = (Date.now() - startTime) / 1000

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      try {
        // Create a function from the code
        const func = new Function(
          'ctx', 'width', 'height', 'params', 'time', 'utils',
          code
        )

        // Mock utils object with full template utilities
        const utils = {
          applyUniversalBackground: (ctx: any, width: number, height: number, params: any) => {
            ctx.fillStyle = params.backgroundColor || '#000000'
            ctx.fillRect(0, 0, width, height)
          },
          applyUniversalFillAndStroke: (ctx: any, params: any) => {
            ctx.fillStyle = params.fillColor || '#3b82f6'
            ctx.strokeStyle = params.strokeColor || '#1e40af'
            ctx.lineWidth = params.strokeWidth || 2
          },
          colors: {
            spectrum: (t: number) => `hsl(${t * 360}, 70%, 50%)`,
            rainbow: (t: number) => `hsl(${t * 360}, 70%, 50%)`,
            gradient: (ctx: any, x1: number, y1: number, x2: number, y2: number, colors: string[]) => {
              const gradient = ctx.createLinearGradient(x1, y1, x2, y2)
              colors.forEach((color, i) => {
                gradient.addColorStop(i / (colors.length - 1), color)
              })
              return gradient
            }
          },
          math: {
            lerp: (a: number, b: number, t: number) => a + (b - a) * t,
            clamp: (value: number, min: number, max: number) => Math.min(Math.max(value, min), max),
            mapRange: (value: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
              return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin)
            }
          },
          random: {
            seeded: (seed: string) => {
              let hash = 0
              for (let i = 0; i < seed.length; i++) {
                hash = ((hash << 5) - hash) + seed.charCodeAt(i)
                hash = hash & hash
              }
              return () => {
                hash = (hash * 1103515245 + 12345) & 0x7fffffff
                return hash / 0x7fffffff
              }
            },
            between: (min: number, max: number) => Math.random() * (max - min) + min,
            int: (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
          }
        }

        // Execute the function
        func(ctx, canvas.width, canvas.height, paramValues, time, utils)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      }

      if (isPlaying) {
        animationId = requestAnimationFrame(render)
      }
    }

    render()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [code, paramValues, isPlaying])

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="h-14 border-b border-gray-800 flex items-center px-4 justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
            Exit Editor
          </button>
          <h1 className="text-lg font-medium">
            {loading ? 'Loading...' : templateName}
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          
          <button
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded"
          >
            <Save className="w-4 h-4" />
            Save Template
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              rulers: [],
              wordWrap: 'on',
              scrollBeyondLastLine: false,
            }}
          />
        </div>

        {/* Preview */}
        <div className="flex-1 flex flex-col bg-black">
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="relative">
              <canvas
                id="preview-canvas"
                width={512}
                height={512}
                className="bg-gray-900 rounded-lg shadow-2xl"
              />
              {error && (
                <div className="absolute inset-0 bg-red-500/20 rounded-lg flex items-center justify-center p-4">
                  <div className="bg-red-900/90 text-red-200 p-4 rounded max-w-sm">
                    <p className="font-medium mb-1">Error:</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Parameters Panel */}
      {showParams && (
        <div className="h-48 border-t border-gray-800 p-4 bg-gray-950">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Parameters</h3>
            <button
              onClick={() => setShowParams(false)}
              className="text-gray-400 hover:text-white"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(parameters).map(([key, param]) => (
              <div key={key}>
                <label className="text-sm text-gray-400 mb-1 block">{key}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={param.range[0]}
                    max={param.range[1]}
                    step={param.range[2]}
                    value={paramValues[key as keyof typeof paramValues]}
                    onChange={(e) => setParamValues({
                      ...paramValues,
                      [key]: parseFloat(e.target.value)
                    })}
                    className="flex-1"
                  />
                  <span className="text-sm w-12 text-right">
                    {paramValues[key as keyof typeof paramValues]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Show params button when hidden */}
      {!showParams && (
        <button
          onClick={() => setShowParams(true)}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded flex items-center gap-2"
        >
          <Maximize2 className="w-4 h-4" />
          Parameters
        </button>
      )}
    </div>
  )
}