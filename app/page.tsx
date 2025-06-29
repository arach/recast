'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { WaveGenerator } from '@/core/wave-generator'
import { GenerativeEngine, GeneratorRegistry } from '@/core/generative-engine'
import '@/core/circle-generator' // Import to register
import '@/core/triangle-generator' // Import to register
import '@/core/infinity-generator' // Import to register
import { SavedShape, SavedPreset } from '@/lib/storage'
import { generateLogoPackage, generateReactComponent, ExportConfig } from '@/lib/svg-export'
import { SaveDialog } from '@/components/save-dialog'
import { SavedItemsDialog } from '@/components/saved-items-dialog'
import { StudioHeader } from '@/components/studio/StudioHeader'
import { CodeEditorPanel } from '@/components/studio/CodeEditorPanel'
import { CanvasArea } from '@/components/studio/CanvasArea'
import { ControlsPanel } from '@/components/studio/ControlsPanel'
import { BrandPresetsPanel } from '@/components/studio/BrandPresetsPanel'
import { IndustrySelector } from '@/components/studio/IndustrySelector'
import { ColorThemeSelector } from '@/components/studio/ColorThemeSelector'
import { AISuggestions } from '@/components/studio/AISuggestions'
import { BrandPersonality } from '@/components/studio/BrandPersonality'
import { VisualizationParams } from '@/lib/visualization-generators'
import { loadPresetAsLegacy, getAllPresetsAsLegacy } from '@/lib/preset-converter'
import type { LoadedPreset } from '@/lib/preset-loader'

const colorPalette = ['#0070f3', '#7c3aed', '#dc2626', '#059669', '#d97706', '#be185d', '#4338ca', '#0891b2']

interface LogoInstance {
  id: string
  x: number
  y: number
  params: {
    seed: string
    frequency: number
    amplitude: number
    complexity: number
    chaos: number
    damping: number
    layers: number
    barCount: number
    barSpacing: number
    radius: number
    color: string
    sides: number
    rotation: number
    scale: number
    customParameters: Record<string, any>
  }
  code: string
  presetId?: string // Track which preset this logo is using
  presetName?: string
}

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [availablePresets, setAvailablePresets] = useState<LoadedPreset[]>([])
  
  // Multi-logo state
  const [logos, setLogos] = useState<LogoInstance[]>([
    {
      id: 'main',
      x: -300,
      y: -300,
      params: {
        seed: 'recast-logo',
        frequency: 4,
        amplitude: 50,
        complexity: 0.5,
        chaos: 0.1,
        damping: 0.8,
        layers: 3,
        barCount: 60,
        barSpacing: 2,
        radius: 50,
        color: '#0070f3',
        sides: 3,
        rotation: 0,
        scale: 1.0,
        customParameters: {}
      },
      code: '// Default wave visualization\nfunction drawVisualization(ctx, width, height, params, generator, time) {\n  ctx.fillStyle = "#ffffff";\n  ctx.fillRect(0, 0, width, height);\n  \n  // Simple wave drawing\n  ctx.strokeStyle = "#0070f3";\n  ctx.lineWidth = 2;\n  ctx.beginPath();\n  \n  for (let x = 0; x < width; x++) {\n    const y = height/2 + Math.sin(x * 0.01 + time) * 50;\n    if (x === 0) ctx.moveTo(x, y);\n    else ctx.lineTo(x, y);\n  }\n  \n  ctx.stroke();\n}',
      presetName: 'Default Wave'
    }
  ])
  const [selectedLogoId, setSelectedLogoId] = useState('main')
  
  // UI state
  const [animating, setAnimating] = useState(false)
  const [codeError, setCodeError] = useState<string | null>(null)
  const [codeEditorCollapsed, setCodeEditorCollapsed] = useState(false)
  const [zoom, setZoom] = useState(1)
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
  const [showIndustrySelector, setShowIndustrySelector] = useState(false)
  const [currentIndustry, setCurrentIndustry] = useState<string | undefined>()
  const animationRef = useRef<number>()
  const timeRef = useRef(0)

  // Get currently selected logo
  const selectedLogo = logos.find(logo => logo.id === selectedLogoId) || logos[0]
  
  // Convenience getters for selected logo parameters
  const seed = selectedLogo.params.seed
  const frequency = selectedLogo.params.frequency
  const amplitude = selectedLogo.params.amplitude
  const complexity = selectedLogo.params.complexity
  const chaos = selectedLogo.params.chaos
  const damping = selectedLogo.params.damping
  const layers = selectedLogo.params.layers
  const barCount = selectedLogo.params.barCount
  const barSpacing = selectedLogo.params.barSpacing
  const radius = selectedLogo.params.radius
  const color = selectedLogo.params.color
  const customCode = selectedLogo.code
  const customParameters = selectedLogo.params.customParameters
  const currentPresetName = selectedLogo.presetName

  // Load presets on mount
  useEffect(() => {
    const loadPresets = async () => {
      try {
        const presets = await getAllPresetsAsLegacy()
        setAvailablePresets(presets)
        console.log('Loaded presets:', presets.map(p => p.name))
      } catch (error) {
        console.error('Failed to load presets:', error)
      }
    }
    
    if (mounted) {
      loadPresets()
    }
  }, [mounted])

  // Update functions for selected logo parameters
  const updateSelectedLogo = (updates: Partial<LogoInstance['params']>) => {
    setLogos(prev => prev.map(logo => 
      logo.id === selectedLogoId 
        ? { ...logo, params: { ...logo.params, ...updates } }
        : logo
    ))
  }

  const setSeed = (seed: string) => updateSelectedLogo({ seed })
  const setFrequency = (frequency: number) => updateSelectedLogo({ frequency })
  const setAmplitude = (amplitude: number) => updateSelectedLogo({ amplitude })
  const setComplexity = (complexity: number) => updateSelectedLogo({ complexity })
  const setChaos = (chaos: number) => updateSelectedLogo({ chaos })
  const setDamping = (damping: number) => updateSelectedLogo({ damping })
  const setLayers = (layers: number) => updateSelectedLogo({ layers })
  const setBarCount = (barCount: number) => updateSelectedLogo({ barCount })
  const setBarSpacing = (barSpacing: number) => updateSelectedLogo({ barSpacing })
  const setRadius = (radius: number) => updateSelectedLogo({ radius })
  const setColor = (color: string) => updateSelectedLogo({ color })
  const setCustomParameters = (customParameters: Record<string, any>) => updateSelectedLogo({ customParameters })
  
  // Update code for selected logo
  const setCustomCode = (code: string) => {
    setLogos(prev => prev.map(logo => 
      logo.id === selectedLogoId 
        ? { ...logo, code, presetId: undefined, presetName: 'Custom' }
        : logo
    ))
  }

  // Logo management functions
  const duplicateLogo = (logoId: string) => {
    const logoToDuplicate = logos.find(logo => logo.id === logoId)
    if (!logoToDuplicate) return
    
    const newId = `logo-${Date.now()}`
    const newLogo: LogoInstance = {
      id: newId,
      x: logoToDuplicate.x + 700, // Place to the right with some spacing
      y: logoToDuplicate.y,
      params: { ...logoToDuplicate.params },
      code: logoToDuplicate.code,
      presetId: logoToDuplicate.presetId,
      presetName: logoToDuplicate.presetName
    }
    setLogos(prev => [...prev, newLogo])
    setSelectedLogoId(newId) // Auto-select the new logo
  }

  const deleteLogo = (logoId: string) => {
    if (logos.length <= 1) return // Don't delete the last logo
    
    setLogos(prev => prev.filter(logo => logo.id !== logoId))
    
    // If we deleted the selected logo, select another one
    if (logoId === selectedLogoId) {
      const remainingLogos = logos.filter(logo => logo.id !== logoId)
      if (remainingLogos.length > 0) {
        setSelectedLogoId(remainingLogos[0].id)
      }
    }
  }

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
    const parsedParams = parseCustomParameters(customCode)
    if (parsedParams) {
      // Initialize custom parameter values with defaults
      const paramValues: Record<string, any> = {}
      Object.entries(parsedParams).forEach(([key, param]) => {
        paramValues[key] = customParameters[key] ?? param.default ?? 0
      })
      setCustomParameters(paramValues)
    }
  }, [customCode])

  // Get metadata for current generator (simplified - just use wave generator)
  const getCurrentGeneratorMetadata = () => {
    const generator = GeneratorRegistry.createGenerator('wave', {
      frequency, amplitude, complexity, chaos, damping, layers, radius
    }, seed)
    return generator?.getMetadata()
  }

  // Parse parameter definitions from custom code
  const parseCustomParameters = (code: string) => {
    try {
      // Look for PARAMETERS = { ... } definition - use a more robust approach
      const match = code.match(/const\s+PARAMETERS\s*=\s*({[\s\S]*?^});/m)
      if (!match) return null
      
      const fullParamsBlock = match[1]
      
      // Try to parse as actual JavaScript object (safer approach)
      try {
        // Replace the object with a safer evaluation
        const paramsCode = `(${fullParamsBlock})`
        const paramsObj = eval(paramsCode)
        
        // Convert to our expected format
        const parameters: Record<string, any> = {}
        for (const [paramName, paramDef] of Object.entries(paramsObj)) {
          parameters[paramName] = paramDef
        }
        
        return parameters
      } catch (evalError) {
        console.warn('Failed to eval parameters, falling back to regex:', evalError)
        
        // Fallback to improved regex parsing
        const paramsString = fullParamsBlock.slice(1, -1) // Remove outer braces
        
        // Find parameter blocks by looking for paramName: { ... } patterns
        // Use a more sophisticated approach to handle nested braces
        const parameters: Record<string, any> = {}
        
        // Split by commas at the top level only
        let currentPos = 0
        let braceDepth = 0
        let currentParam = ''
        let inString = false
        let stringChar = ''
        
        for (let i = 0; i < paramsString.length; i++) {
          const char = paramsString[i]
          const prevChar = i > 0 ? paramsString[i - 1] : ''
          
          if (!inString && (char === '"' || char === "'")) {
            inString = true
            stringChar = char
          } else if (inString && char === stringChar && prevChar !== '\\') {
            inString = false
          } else if (!inString) {
            if (char === '{') braceDepth++
            else if (char === '}') braceDepth--
            else if (char === ',' && braceDepth === 0) {
              // Found a top-level comma - process the parameter
              const paramBlock = paramsString.slice(currentPos, i).trim()
              if (paramBlock) {
                parseParameterBlock(paramBlock, parameters)
              }
              currentPos = i + 1
            }
          }
        }
        
        // Process the last parameter
        const lastParamBlock = paramsString.slice(currentPos).trim()
        if (lastParamBlock) {
          parseParameterBlock(lastParamBlock, parameters)
        }
        
        return parameters
      }
    } catch (error) {
      console.warn('Failed to parse custom parameters:', error)
      return null
    }
  }
  
  // Helper function to parse individual parameter blocks
  const parseParameterBlock = (block: string, parameters: Record<string, any>) => {
    const colonIndex = block.indexOf(':')
    if (colonIndex === -1) return
    
    const paramName = block.slice(0, colonIndex).trim()
    const paramDefString = block.slice(colonIndex + 1).trim()
    
    const param: any = { name: paramName }
    
    // Extract properties using regex
    const typeMatch = paramDefString.match(/type:\s*['"]([^'"]*)['"]/);
    const minMatch = paramDefString.match(/min:\s*([\d.]+)/);
    const maxMatch = paramDefString.match(/max:\s*([\d.]+)/);
    const stepMatch = paramDefString.match(/step:\s*([\d.]+)/);
    const defaultMatch = paramDefString.match(/default:\s*(['"]?)([^'",\s}]+)\1/);
    const labelMatch = paramDefString.match(/label:\s*['"]([^'"]*)['"]/);
    const optionsMatch = paramDefString.match(/options:\s*\[([^\]]*)\]/);
    
    if (typeMatch) param.type = typeMatch[1];
    if (minMatch) param.min = parseFloat(minMatch[1]);
    if (maxMatch) param.max = parseFloat(maxMatch[1]);
    if (stepMatch) param.step = parseFloat(stepMatch[1]);
    if (defaultMatch) {
      const defaultValue = defaultMatch[2];
      param.default = isNaN(Number(defaultValue)) ? defaultValue : parseFloat(defaultValue);
    }
    if (labelMatch) param.label = labelMatch[1];
    if (optionsMatch) {
      const optionsStr = optionsMatch[1];
      param.options = optionsStr.split(',').map(opt => opt.trim().replace(/['"]/g, ''));
    }
    
    parameters[paramName] = param;
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

  const handleCloneToCustom = () => {
    const currentCode = selectedLogo.code
    setCustomCode(currentCode)
    setCurrentShapeId(undefined)
    setCurrentShapeName((selectedLogo.presetName || 'Custom') + ' (Clone)')
  }

  const getShapeNameForMode = () => {
    return selectedLogo.presetName || 'Custom'
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
        setForceRender(prev => prev + 1) // We need this to trigger redraws
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

  // Load preset by ID
  const loadPresetById = async (presetId: string, customDefaults?: Record<string, any>) => {
    try {
      console.log('Loading preset by ID:', presetId)
      const preset = await loadPresetAsLegacy(presetId)
      
      if (!preset) {
        console.error('Preset not found:', presetId)
        return
      }
      
      console.log('Loaded preset:', preset.name, 'Code length:', preset.code.length)
      
      // Merge preset defaults with custom defaults (industry-specific or otherwise)
      const mergedParams = {
        ...preset.defaultParams,
        ...customDefaults
      }
      
      // Update the selected logo with preset data
      setLogos(prev => prev.map(logo => 
        logo.id === selectedLogoId 
          ? { 
              ...logo, 
              params: { 
                ...logo.params,
                ...mergedParams, // Apply merged parameters
                customParameters: mergedParams // Also update custom parameters
              },
              code: preset.code, // Set the preset code
              presetId: preset.id,
              presetName: preset.name
            }
          : logo
      ))
      
      // Force re-render
      setForceRender(prev => prev + 1)
      console.log('Preset loaded successfully:', preset.name)
      
    } catch (error) {
      console.error('Failed to load preset:', error)
    }
  }
  
  // Handle preset selection from industry selector
  const handleIndustryPresetSelect = async (presetId: string, industryDefaults?: Record<string, any>, industryId?: string) => {
    await loadPresetById(presetId, industryDefaults)
    setCurrentIndustry(industryId)
    setShowIndustrySelector(false)
  }

  // Handle color theme application
  const handleApplyColorTheme = (themedParams: Record<string, any>) => {
    setLogos(prev => prev.map(logo => 
      logo.id === selectedLogoId 
        ? { 
            ...logo, 
            params: themedParams 
          }
        : logo
    ))
    setCustomParameters(themedParams)
  }

  // Apply brand preset from AI or examples
  const handleApplyBrandPreset = async (brandPreset: any) => {
    try {
      console.log('Applying brand preset:', brandPreset.name)
      
      // First load the base preset if it's different from current
      if (brandPreset.preset !== selectedLogo.presetId) {
        await loadPresetById(brandPreset.preset)
      }
      
      // Then apply the custom parameters
      setLogos(prev => prev.map(logo => 
        logo.id === selectedLogoId 
          ? { 
              ...logo, 
              params: { 
                ...logo.params,
                customParameters: {
                  ...logo.params.customParameters,
                  ...brandPreset.params
                }
              }
            }
          : logo
      ))
      
      // Update custom parameters state for the controls panel
      setCustomParameters(prev => ({
        ...prev,
        ...brandPreset.params
      }))
      
      // Force re-render
      setForceRender(prev => prev + 1)
      console.log('Brand preset applied successfully:', brandPreset.name)
      
    } catch (error) {
      console.error('Failed to apply brand preset:', error)
    }
  }

  const exportAsPNG = async (size?: number, filename?: string) => {
    // Implementation would go here - simplified for brevity
    alert(`Exporting PNG ${size ? `at ${size}x${size}` : ''}...`)
  }

  const exportAllSizes = async () => {
    alert('Exporting all sizes...')
  }

  const exportAsSVG = () => {
    alert('SVG export coming soon!')
  }

  const shareLink = () => {
    const params = new URLSearchParams({
      seed,
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
    setCustomCode(shape.code)
    setCurrentShapeId(shape.id)
    setCurrentShapeName(shape.name)
    
    // Force re-render after all state updates
    setForceRender(prev => prev + 1)
  }

  const handleLoadPreset = (preset: SavedPreset) => {
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
        onOpenIndustrySelector={() => setShowIndustrySelector(true)}
        onShare={shareLink}
        onExportPNG={exportAsPNG}
        onExportAllSizes={exportAllSizes}
        onExportSVG={exportAsSVG}
        visualMode={selectedLogo.presetId ? 'preset' : 'custom'}
      />

      <div className="flex flex-1 overflow-hidden">
        <CodeEditorPanel
          collapsed={codeEditorCollapsed}
          onSetCollapsed={setCodeEditorCollapsed}
          presets={availablePresets}
          onLoadPreset={loadPresetById}
          currentShapeName={currentShapeName}
          onSetCurrentShapeName={setCurrentShapeName}
          currentShapeId={currentShapeId}
          currentPresetName={selectedLogo.presetName}
          codeError={codeError}
          code={customCode}
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
          logos={logos}
          selectedLogoId={selectedLogoId}
          onSelectLogo={setSelectedLogoId}
          onDuplicateLogo={duplicateLogo}
          onDeleteLogo={deleteLogo}
          animating={animating}
          zoom={zoom}
          previewMode={previewMode}
          isRendering={isRendering}
          currentTime={timeRef.current}
          onToggleAnimation={toggleAnimation}
          onSetZoom={setZoom}
          onTogglePreview={() => setPreviewMode(!previewMode)}
          onCodeError={setCodeError}
          forceRender={forceRender}
        />

        <div className="flex">
          <ControlsPanel
            currentPresetName={currentPresetName}
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
            onCustomParametersChange={setCustomParameters}
            getCurrentGeneratorMetadata={getCurrentGeneratorMetadata}
            parseCustomParameters={parseCustomParameters}
            forceRender={forceRender}
            onForceRender={() => setForceRender(prev => prev + 1)}
          />
          
          <div className="w-80 border-l bg-white/50 backdrop-blur-sm overflow-y-auto">
            <div className="p-4 space-y-4">
              <ColorThemeSelector
                currentIndustry={currentIndustry}
                currentParams={customParameters}
                onApplyTheme={handleApplyColorTheme}
              />
              <AISuggestions
                currentIndustry={currentIndustry}
                currentPreset={selectedLogo.presetId || 'custom'}
                currentParams={customParameters}
                onApplySuggestion={handleApplyColorTheme}
              />
              <BrandPersonality
                currentParams={customParameters}
                onApplyPersonality={handleApplyColorTheme}
              />
              <BrandPresetsPanel
                onApplyPreset={handleApplyBrandPreset}
                currentParams={customParameters}
                currentPreset={selectedLogo.presetId || 'custom'}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Industry Selector */}
      {showIndustrySelector && (
        <IndustrySelector 
          onSelectPreset={handleIndustryPresetSelect}
          onClose={() => setShowIndustrySelector(false)}
        />
      )}

      {/* Dialogs */}
      <SaveDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        mode={saveMode}
        shapeId={currentShapeId}
        shapeName={currentShapeName}
        code={customCode}
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