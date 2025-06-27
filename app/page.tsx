'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { WaveGenerator } from '@/core/wave-generator'
import { GenerativeEngine, GeneratorRegistry } from '@/core/generative-engine'
import '@/core/circle-generator' // Import to register
import { visualizationTemplates } from './visualization-templates'
import { SavedShape, SavedPreset } from '@/lib/storage'
import { generateLogoPackage, generateReactComponent, ExportConfig } from '@/lib/svg-export'
import { SaveDialog } from '@/components/save-dialog'
import { SavedItemsDialog } from '@/components/saved-items-dialog'
import { StudioHeader } from '@/components/studio/StudioHeader'
import { CodeEditorPanel } from '@/components/studio/CodeEditorPanel'
import { CanvasArea } from '@/components/studio/CanvasArea'
import { ControlsPanel } from '@/components/studio/ControlsPanel'
import { VisualizationParams } from '@/lib/visualization-generators'

interface Preset {
  name: string
  mode: 'wave' | 'bars' | 'wavebars' | 'circles'
  params: {
    seed: string
    frequency: number
    amplitude: number
    complexity: number
    chaos: number
    damping: number
    layers: number
    barCount?: number
    barSpacing?: number
    radius?: number
  }
}

const colorPalette = ['#0070f3', '#7c3aed', '#dc2626', '#059669', '#d97706', '#be185d', '#4338ca', '#0891b2']

const presets: Preset[] = [
  {
    name: '🎯 ReCast Logo',
    mode: 'wavebars',
    params: {
      seed: 'recast-identity',
      frequency: 5,
      amplitude: 80,
      complexity: 0.6,
      chaos: 0.15,
      damping: 0.85,
      layers: 1,
      barCount: 80,
      barSpacing: 2,
    },
  },
  {
    name: '⭕ Pulsing Circles',
    mode: 'circles',
    params: {
      seed: 'orbital-identity',
      frequency: 1.2,
      amplitude: 20,
      complexity: 0.2,
      chaos: 0.05,
      damping: 0.75,
      layers: 3,
      radius: 80,
    },
  },
  {
    name: 'Gentle Wave',
    mode: 'wave',
    params: {
      seed: 'gentle-wave',
      frequency: 3,
      amplitude: 40,
      complexity: 0.3,
      chaos: 0.05,
      damping: 0.9,
      layers: 2,
    },
  },
  {
    name: 'Audio Spectrum',
    mode: 'bars',
    params: {
      seed: 'audio-spec',
      frequency: 2,
      amplitude: 60,
      complexity: 0.7,
      chaos: 0.2,
      damping: 0.8,
      layers: 1,
      barCount: 80,
      barSpacing: 2,
    },
  },
  {
    name: 'Wave Flow',
    mode: 'wavebars',
    params: {
      seed: 'wave-flow',
      frequency: 4,
      amplitude: 50,
      complexity: 0.5,
      chaos: 0.1,
      damping: 0.85,
      layers: 1,
      barCount: 60,
      barSpacing: 3,
    },
  },
]

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [seed, setSeed] = useState('recast-logo')
  const [frequency, setFrequency] = useState(4)
  const [amplitude, setAmplitude] = useState(50)
  const [complexity, setComplexity] = useState(0.5)
  const [chaos, setChaos] = useState(0.1)
  const [damping, setDamping] = useState(0.8)
  const [layers, setLayers] = useState(3)
  const [visualMode, setVisualMode] = useState<'wave' | 'bars' | 'wavebars' | 'circles' | 'custom'>('wave')
  const [barCount, setBarCount] = useState(60)
  const [barSpacing, setBarSpacing] = useState(2)
  const [radius, setRadius] = useState(50)
  const [animating, setAnimating] = useState(false)
  const [customCode, setCustomCode] = useState(visualizationTemplates.custom)
  const [codeError, setCodeError] = useState<string | null>(null)
  const [codeEditorCollapsed, setCodeEditorCollapsed] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [color, setColor] = useState('#0070f3')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [saveMode, setSaveMode] = useState<'shape' | 'preset'>('preset')
  const [savedItemsOpen, setSavedItemsOpen] = useState(false)
  const [currentShapeId, setCurrentShapeId] = useState<string | undefined>()
  const [currentShapeName, setCurrentShapeName] = useState('Custom Shape')
  const [previewMode, setPreviewMode] = useState(false)
  const [forceRender, setForceRender] = useState(0)
  const [isRendering, setIsRendering] = useState(false)
  const [renderSuccess, setRenderSuccess] = useState(false)
  const [customParameters, setCustomParameters] = useState<Record<string, any>>({})
  const animationRef = useRef<number>()
  const timeRef = useRef(0)

  // Set mounted flag after hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Theme detection
  useEffect(() => {
    if (!mounted) return
    
    const checkTheme = () => {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDarkMode(isDark)
    }
    
    checkTheme()
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', checkTheme)
    
    return () => mediaQuery.removeEventListener('change', checkTheme)
  }, [mounted])

  // Keyboard shortcuts
  useEffect(() => {
    if (!mounted) return
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        handleRunCode()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mounted])

  // Parse custom parameters when code changes
  useEffect(() => {
    if (visualMode === 'custom') {
      const parsedParams = parseCustomParameters(customCode)
      if (parsedParams) {
        // Initialize custom parameter values with defaults
        const paramValues: Record<string, any> = {}
        Object.entries(parsedParams).forEach(([key, param]) => {
          paramValues[key] = customParameters[key] ?? param.default ?? 0
        })
        setCustomParameters(paramValues)
      }
    }
  }, [customCode, visualMode])

  // Get metadata for current generator
  const getCurrentGeneratorMetadata = () => {
    const generatorName = visualMode === 'wavebars' ? 'wave' : visualMode === 'circles' ? 'circle' : 'wave'
    const generator = GeneratorRegistry.createGenerator(generatorName, {
      frequency, amplitude, complexity, chaos, damping, layers, radius
    }, seed)
    return generator?.getMetadata()
  }

  // Parse parameter definitions from custom code
  const parseCustomParameters = (code: string) => {
    try {
      // Look for PARAMETERS = { ... } definition
      const match = code.match(/const\s+PARAMETERS\s*=\s*{([^}]*)}/s)
      if (!match) return null
      
      const paramsString = match[1]
      // Extract parameter definitions using regex
      const paramMatches = paramsString.matchAll(/(\w+):\s*{([^}]*)}/g)
      const parameters: Record<string, any> = {}
      
      for (const paramMatch of paramMatches) {
        const [, paramName, paramDef] = paramMatch
        const param: any = { name: paramName }
        
        // Extract properties
        const typeMatch = paramDef.match(/type:\s*'([^']*)'/)
        const minMatch = paramDef.match(/min:\s*([\d.]+)/)
        const maxMatch = paramDef.match(/max:\s*([\d.]+)/)
        const stepMatch = paramDef.match(/step:\s*([\d.]+)/)
        const defaultMatch = paramDef.match(/default:\s*([\d.]+)/)
        const labelMatch = paramDef.match(/label:\s*'([^']*)'/)
        
        if (typeMatch) param.type = typeMatch[1]
        if (minMatch) param.min = parseFloat(minMatch[1])
        if (maxMatch) param.max = parseFloat(maxMatch[1])
        if (stepMatch) param.step = parseFloat(stepMatch[1])
        if (defaultMatch) param.default = parseFloat(defaultMatch[1])
        if (labelMatch) param.label = labelMatch[1]
        
        parameters[paramName] = param
      }
      
      return parameters
    } catch (error) {
      console.warn('Failed to parse custom parameters:', error)
      return null
    }
  }

  // Manual refresh function
  const handleRunCode = useCallback(() => {
    setIsRendering(true)
    setRenderSuccess(false)
    setForceRender(prev => prev + 1)
    
    // Clear any animation state to force a clean render
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    
    // Give visual feedback
    setTimeout(() => {
      setIsRendering(false)
      setRenderSuccess(true)
      
      // Hide success after a moment
      setTimeout(() => {
        setRenderSuccess(false)
      }, 1500)
    }, 300)
  }, [])

  const getCodeForMode = () => {
    switch (visualMode) {
      case 'wave':
        return visualizationTemplates.wave
      case 'bars':
        return visualizationTemplates.bars
      case 'wavebars':
        return visualizationTemplates.wavebars
      case 'circles':
        return visualizationTemplates.circles
      case 'custom':
        return customCode
      default:
        return visualizationTemplates.wave
    }
  }

  const handleCloneToCustom = () => {
    const currentCode = getCodeForMode()
    setCustomCode(currentCode)
    setVisualMode('custom')
    setCurrentShapeId(undefined)
    setCurrentShapeName(getShapeNameForMode() + ' (Clone)')
  }

  const getShapeNameForMode = () => {
    switch (visualMode) {
      case 'wave':
        return 'Wave Lines'
      case 'bars':
        return 'Audio Bars'
      case 'wavebars':
        return 'Wave Bars'
      case 'circles':
        return 'Pulsing Circles'
      case 'custom':
        return currentShapeName
      default:
        return 'Custom Shape'
    }
  }

  const toggleAnimation = () => {
    if (animating) {
      setAnimating(false)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    } else {
      setAnimating(true)
      const animate = () => {
        timeRef.current += 0.05
        setForceRender(prev => prev + 1)
        animationRef.current = requestAnimationFrame(animate)
      }
      animate()
    }
  }

  const randomizeParams = () => {
    setSeed(Math.random().toString(36).substring(7))
    setFrequency(Math.floor(Math.random() * 8) + 1)
    setAmplitude(Math.floor(Math.random() * 80) + 20)
    setComplexity(Math.random())
    setChaos(Math.random() * 0.3)
    setDamping(0.5 + Math.random() * 0.5)
    setLayers(Math.floor(Math.random() * 5) + 1)
    setColor(colorPalette[Math.floor(Math.random() * colorPalette.length)])
  }

  const loadPreset = (preset: Preset) => {
    setVisualMode(preset.mode)
    setSeed(preset.params.seed)
    setFrequency(preset.params.frequency)
    setAmplitude(preset.params.amplitude)
    setComplexity(preset.params.complexity)
    setChaos(preset.params.chaos)
    setDamping(preset.params.damping)
    setLayers(preset.params.layers)
    if (preset.params.barCount) setBarCount(preset.params.barCount)
    if (preset.params.barSpacing) setBarSpacing(preset.params.barSpacing)
    if (preset.params.radius) setRadius(preset.params.radius)
    
    // Force re-render after all state updates
    setForceRender(prev => prev + 1)
  }

  const exportAsPNG = async (size?: number, filename?: string) => {
    // Implementation would go here - simplified for brevity
    alert(`Exporting PNG ${size ? `at ${size}x${size}` : ''}...`)
  }

  const exportAllSizes = async () => {
    alert('Exporting all sizes...')
  }

  const exportAsSVG = () => {
    if (visualMode === 'custom') {
      alert('Custom visualizations can only be exported as PNG')
      exportAsPNG()
      return
    }
    alert('SVG export coming soon!')
  }

  const shareLink = () => {
    const params = new URLSearchParams({
      seed,
      mode: visualMode,
      frequency: frequency.toString(),
      amplitude: amplitude.toString(),
      complexity: complexity.toString(),
      chaos: chaos.toString(),
      damping: damping.toString(),
      layers: layers.toString(),
      barCount: barCount.toString(),
      barSpacing: barSpacing.toString(),
    })
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`
    navigator.clipboard.writeText(url)
  }

  const handleLoadShape = (shape: SavedShape) => {
    // Check if this is a built-in shape
    if (shape.id.startsWith('builtin-')) {
      const mode = shape.id.replace('builtin-', '') as 'wave' | 'bars' | 'wavebars'
      setVisualMode(mode)
      setCurrentShapeId(undefined)
      setCurrentShapeName(shape.name)
    } else {
      setCustomCode(shape.code)
      setVisualMode('custom')
      setCurrentShapeId(shape.id)
      setCurrentShapeName(shape.name)
    }
    
    // Force re-render after all state updates
    setForceRender(prev => prev + 1)
  }

  const handleLoadPreset = (preset: SavedPreset) => {
    setVisualMode(preset.mode)
    setSeed(preset.params.seed)
    setFrequency(preset.params.frequency)
    setAmplitude(preset.params.amplitude)
    setComplexity(preset.params.complexity)
    setChaos(preset.params.chaos)
    setDamping(preset.params.damping)
    setLayers(preset.params.layers)
    if (preset.params.barCount) setBarCount(preset.params.barCount)
    if (preset.params.barSpacing) setBarSpacing(preset.params.barSpacing)
    if (preset.params.radius) setRadius(preset.params.radius)
    if (preset.params.color) setColor(preset.params.color)
    if (preset.shapeId) setCurrentShapeId(preset.shapeId)
    
    // Force re-render after all state updates
    setForceRender(prev => prev + 1)
  }

  const openSaveDialog = (mode: 'shape' | 'preset') => {
    setSaveMode(mode)
    setSaveDialogOpen(true)
  }

  // Show loading state during SSR and initial hydration
  if (!mounted) return null

  // Create visualization params
  const visualizationParams: VisualizationParams = {
    seed,
    frequency,
    amplitude,
    complexity,
    chaos,
    damping,
    layers,
    barCount,
    barSpacing,
    radius,
    color,
    customParameters,
    time: timeRef.current
  }

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-white flex flex-col">
      <StudioHeader
        onRandomize={randomizeParams}
        onSavePreset={() => openSaveDialog('preset')}
        onSaveShape={() => openSaveDialog('shape')}
        onOpenLibrary={() => setSavedItemsOpen(true)}
        onShare={shareLink}
        onExportPNG={exportAsPNG}
        onExportAllSizes={exportAllSizes}
        onExportSVG={exportAsSVG}
        visualMode={visualMode}
      />

      <div className="flex flex-1 overflow-hidden">
        <CodeEditorPanel
          collapsed={codeEditorCollapsed}
          onSetCollapsed={setCodeEditorCollapsed}
          presets={presets}
          onLoadPreset={loadPreset}
          visualMode={visualMode}
          currentShapeName={currentShapeName}
          onSetCurrentShapeName={setCurrentShapeName}
          currentShapeId={currentShapeId}
          codeError={codeError}
          code={getCodeForMode()}
          onCodeChange={setCustomCode}
          isDarkMode={isDarkMode}
          isRendering={isRendering}
          renderSuccess={renderSuccess}
          onRunCode={handleRunCode}
          onSaveShape={() => openSaveDialog('shape')}
          onCloneToCustom={handleCloneToCustom}
          getShapeNameForMode={getShapeNameForMode}
        />

        <CanvasArea
          visualMode={visualMode}
          params={visualizationParams}
          customCode={customCode}
          animating={animating}
          zoom={zoom}
          previewMode={previewMode}
          isRendering={isRendering}
          onToggleAnimation={toggleAnimation}
          onSetZoom={setZoom}
          onTogglePreview={() => setPreviewMode(!previewMode)}
          onCodeError={setCodeError}
          forceRender={forceRender}
        />

        <ControlsPanel
          visualMode={visualMode}
          seed={seed}
          frequency={frequency}
          amplitude={amplitude}
          complexity={complexity}
          chaos={chaos}
          damping={damping}
          layers={layers}
          barCount={barCount}
          barSpacing={barSpacing}
          radius={radius}
          customCode={customCode}
          customParameters={customParameters}
          onSeedChange={setSeed}
          onFrequencyChange={setFrequency}
          onAmplitudeChange={setAmplitude}
          onComplexityChange={setComplexity}
          onChaosChange={setChaos}
          onDampingChange={setDamping}
          onLayersChange={setLayers}
          onBarCountChange={setBarCount}
          onBarSpacingChange={setBarSpacing}
          onRadiusChange={setRadius}
          onVisualizationModeChange={setVisualMode}
          onCustomParametersChange={setCustomParameters}
          getCurrentGeneratorMetadata={getCurrentGeneratorMetadata}
          parseCustomParameters={parseCustomParameters}
          forceRender={forceRender}
          onForceRender={() => setForceRender(prev => prev + 1)}
        />
      </div>

      {/* Dialogs */}
      <SaveDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        mode={saveMode}
        visualMode={visualMode}
        shapeId={currentShapeId}
        shapeName={currentShapeName}
        code={visualMode === 'custom' ? customCode : getCodeForMode()}
        params={{
          seed,
          frequency,
          amplitude,
          complexity,
          chaos,
          damping,
          layers,
          barCount,
          barSpacing,
          radius,
          color
        }}
      />

      <SavedItemsDialog
        open={savedItemsOpen}
        onOpenChange={setSavedItemsOpen}
        onLoadShape={handleLoadShape}
        onLoadPreset={handleLoadPreset}
      />
    </div>
  )
}