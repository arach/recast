'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { SavedShape, SavedPreset } from '@/lib/storage'
import { exportCanvasAsPNG } from '@/lib/export-utils'
import { SaveDialog } from '@/components/save-dialog'
import { SavedItemsDialog } from '@/components/saved-items-dialog'
import { StudioHeader } from '@/components/studio/StudioHeader'
import { CanvasArea } from '@/components/studio/CanvasArea'
import { ControlsPanel } from '@/components/studio/ControlsPanel'
import { BrandPresetsPanel } from '@/components/studio/BrandPresetsPanel'
import { StoreInitializer } from '@/components/migration/StoreInitializer'
import { IndustrySelector } from '@/components/studio/IndustrySelector'
import { ColorThemeSelector } from '@/components/studio/ColorThemeSelector'
import { TemplatePresetsPanel } from '@/components/studio/TemplatePresetsPanel'
import { AISuggestions } from '@/components/studio/AISuggestions'
import { BrandPersonality } from '@/components/studio/BrandPersonality'
import { AIBrandConsultant } from '@/components/studio/AIBrandConsultant'
import { generateWaveBars, executeCustomCode, type VisualizationParams } from '@/lib/visualization-generators'
import { loadTemplateAsLegacy } from '@/lib/template-converter'


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
  templateId?: string // For backward compatibility
  templateName?: string
}

export default function Home() {
  const [mounted, setMounted] = useState(false)
  
  
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
      templateId: 'custom',
      templateName: 'Custom'
    }
  ])
  const [selectedLogoId, setSelectedLogoId] = useState('main')
  
  // UI state
  const [animating] = useState(false)
  const [zoom] = useState(1)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [saveMode, setSaveMode] = useState<'shape' | 'preset'>('preset')
  const [savedItemsOpen, setSavedItemsOpen] = useState(false)
  const [currentShapeId, setCurrentShapeId] = useState<string | undefined>()
  const [currentShapeName, setCurrentShapeName] = useState('Custom Shape')
  const [forceRender, setForceRender] = useState(0)
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


  // Set mounted flag after hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle URL parameters on mount
  useEffect(() => {
    if (!mounted) return;
    
    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const templateParam = urlParams.get('template');
    const textParam = urlParams.get('text');
    const letterParam = urlParams.get('letter');
    const fillColorParam = urlParams.get('fillColor');
    const strokeColorParam = urlParams.get('strokeColor');
    const backgroundColorParam = urlParams.get('backgroundColor');
    
    // Load template if specified
    if (templateParam) {
      console.log('Loading template from URL:', templateParam);
      loadPresetById(templateParam).then(() => {
        // After template loads, apply text and color params
        const updates: Record<string, any> = {};
        
        if (textParam) updates.text = textParam;
        if (letterParam) updates.letter = letterParam;
        if (fillColorParam) updates.fillColor = fillColorParam;
        if (strokeColorParam) updates.strokeColor = strokeColorParam;
        if (backgroundColorParam) updates.backgroundColor = backgroundColorParam;
        
        if (Object.keys(updates).length > 0) {
          setCustomParameters((prev: Record<string, any>) => ({ ...prev, ...updates }));
          updateSelectedLogo({ customParameters: updates });
        }
      });
    } else {
      // If no template, still apply text/color params if present
      const updates: Record<string, any> = {};
      
      if (textParam) updates.text = textParam;
      if (letterParam) updates.letter = letterParam;
      if (fillColorParam) updates.fillColor = fillColorParam;
      if (strokeColorParam) updates.strokeColor = strokeColorParam;
      if (backgroundColorParam) updates.backgroundColor = backgroundColorParam;
      
      if (Object.keys(updates).length > 0) {
        setCustomParameters((prev: Record<string, any>) => ({ ...prev, ...updates }));
        updateSelectedLogo({ customParameters: updates });
      }
    }
  }, [mounted]); // Only run once after mount

  // Update URL when key parameters change
  useEffect(() => {
    if (!mounted) return;
    
    // Debounce URL updates to avoid too many history entries
    const timeoutId = setTimeout(() => {
      updateURLParams();
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [selectedLogo.presetId, customParameters.text, customParameters.letter, 
      customParameters.fillColor, customParameters.strokeColor, customParameters.backgroundColor]);

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

  // Parse parameter definitions from custom code
  const parseCustomParameters = (code: string) => {
    try {
      // Look for PARAMETERS = { ... } definition - use a more robust approach
      // Updated regex to handle multi-line objects better
      const match = code.match(/const\s+PARAMETERS\s*=\s*({[\s\S]*?^});/m) || 
                    code.match(/const\s+PARAMETERS\s*=\s*({[\s\S]*?});/);
      if (!match) {
        return null
      }
      
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
    const categoryMatch = paramDefString.match(/category:\s*['"]([^'"]*)['"]/);
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
    if (categoryMatch) param.category = categoryMatch[1];
    if (optionsMatch) {
      const optionsStr = optionsMatch[1];
      param.options = optionsStr.split(',').map(opt => opt.trim().replace(/['"]/g, ''));
    }
    
    parameters[paramName] = param;
  }

  // Manual refresh function
  const handleRunCode = useCallback(() => {
    setForceRender(prev => prev + 1)
    
    // Clear any animation state to force a clean render
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }, [])


  // Load preset by ID
  const loadPresetById = async (presetId: string, customDefaults?: Record<string, any>) => {
    try {
      console.log('Loading preset by ID:', presetId)
      const preset = await loadPresetAsLegacy(presetId)
      
      if (!preset) {
        console.error('Preset not found:', presetId)
        return
      }
      
      console.log('Loaded preset code preview:', preset.code.substring(0, 500) + '...')
      
      // Parse the preset code to get ALL parameter definitions (not just defaults)
      const parsedParams = parseCustomParameters(preset.code) || {};
      
      // Text parameters that should be preserved
      const textParams = ['text', 'letter', 'letters', 'brandName', 'words', 'title', 'subtitle'];
      
      // Build complete parameters from definitions and defaults
      const completeParams: Record<string, any> = {};
      Object.entries(parsedParams).forEach(([key, paramDef]) => {
        if (paramDef.default !== undefined) {
          completeParams[key] = paramDef.default;
        }
      });
      
      // Update the selected logo with preset data
      setLogos(prev => prev.map(logo => {
        if (logo.id !== selectedLogoId) return logo;
        
        // Get current text values to preserve
        const currentTextValues: Record<string, any> = {};
        textParams.forEach(param => {
          if (logo.params.customParameters?.[param] !== undefined) {
            currentTextValues[param] = logo.params.customParameters[param];
          }
        });
        
        // Merge preset defaults with custom defaults (industry-specific or otherwise)
        const mergedParams = {
          ...completeParams,
          ...preset.defaultParams,
          ...customDefaults,
          ...currentTextValues // Preserve text values
        };
        
        return { 
          ...logo, 
          params: { 
            ...logo.params,
            ...mergedParams, // Apply merged parameters
            // Preserve any existing color theme
            fillColor: logo.params.customParameters?.fillColor || mergedParams.fillColor,
            strokeColor: logo.params.customParameters?.strokeColor || mergedParams.strokeColor,
            backgroundColor: logo.params.customParameters?.backgroundColor || mergedParams.backgroundColor,
            customParameters: {
              ...completeParams, // First apply ALL parameter defaults from definitions
              ...mergedParams, // Then apply preset defaults
              ...logo.params.customParameters, // Then preserve existing parameters (including colors)
              ...currentTextValues // Ensure text values are preserved
            }
          },
          code: preset.code, // Set the preset code
          presetId: preset.id,
          presetName: preset.name
        }
      }))
      
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
    // Update the logo with new color parameters
    setLogos(prev => prev.map(logo => 
      logo.id === selectedLogoId 
        ? { 
            ...logo, 
            params: {
              ...logo.params,
              // Apply color params at the root level
              fillColor: themedParams.fillColor || logo.params.customParameters?.fillColor,
              strokeColor: themedParams.strokeColor || logo.params.customParameters?.strokeColor,
              backgroundColor: themedParams.backgroundColor || logo.params.customParameters?.backgroundColor,
              customParameters: {
                ...logo.params.customParameters,
                // Also apply to custom parameters for templates that look there
                fillColor: themedParams.fillColor || logo.params.customParameters?.fillColor,
                strokeColor: themedParams.strokeColor || logo.params.customParameters?.strokeColor,
                backgroundColor: themedParams.backgroundColor || logo.params.customParameters?.backgroundColor,
                textColor: themedParams.textColor || logo.params.customParameters?.textColor,
                // Include any other color-related params from the theme
                ...Object.entries(themedParams).reduce((acc, [key, value]) => {
                  if (key.includes('Color') || key.includes('color')) {
                    acc[key] = value;
                  }
                  return acc;
                }, {} as Record<string, any>)
              }
            }
          }
        : logo
    ))
    
    // Force re-render to apply the theme changes
    setForceRender(prev => prev + 1)
  }

  // Apply template preset (style parameters only, no colors)
  const handleApplyTemplatePreset = (presetParams: Record<string, any>) => {
    setLogos(prev => prev.map(logo => 
      logo.id === selectedLogoId 
        ? { 
            ...logo, 
            params: { 
              ...logo.params,
              customParameters: {
                ...logo.params.customParameters,
                ...presetParams
              }
            }
          }
        : logo
    ))
    setCustomParameters((prev: Record<string, any>) => ({
      ...prev,
      ...presetParams
    }))
    // Force re-render
    setForceRender(prev => prev + 1)
  }

  // Apply brand preset from AI or examples
  const handleApplyBrandPreset = async (brandPreset: any) => {
    try {
      console.log('Applying brand preset:', brandPreset.name)
      
      // First load the base preset if it's different from current
      if (brandPreset.preset !== selectedLogo.presetId) {
        await loadPresetById(brandPreset.preset)
      }
      
      // Filter out text-based parameters that shouldn't be overridden
      const textParams = ['text', 'letter', 'letters', 'brandName', 'words', 'title', 'subtitle'];
      const filteredParams = Object.fromEntries(
        Object.entries(brandPreset.params).filter(([key]) => !textParams.includes(key))
      );
      
      // Then apply the custom parameters
      setLogos(prev => prev.map(logo => 
        logo.id === selectedLogoId 
          ? { 
              ...logo, 
              params: { 
                ...logo.params,
                customParameters: {
                  ...logo.params.customParameters,
                  ...filteredParams
                }
              }
            }
          : logo
      ))
      
      // Update custom parameters state for the controls panel
      setCustomParameters((prev: Record<string, any>) => ({
        ...prev,
        ...filteredParams
      }))
      
      // Force re-render
      setForceRender(prev => prev + 1)
      console.log('Brand preset applied successfully:', brandPreset.name)
      
    } catch (error) {
      console.error('Failed to apply brand preset:', error)
    }
  }
  // Update URL with current parameters (without page reload)
  const updateURLParams = () => {
    const params = new URLSearchParams();
    
    // Add template if using a preset
    if (selectedLogo.presetId) {
      params.set('template', selectedLogo.presetId);
    }
    
    // Add text parameters if they exist
    if (customParameters.text) params.set('text', customParameters.text);
    if (customParameters.letter) params.set('letter', customParameters.letter);
    
    // Add color parameters if they differ from defaults
    if (customParameters.fillColor && customParameters.fillColor !== '#3b82f6') {
      params.set('fillColor', customParameters.fillColor);
    }
    if (customParameters.strokeColor && customParameters.strokeColor !== '#1e40af') {
      params.set('strokeColor', customParameters.strokeColor);
    }
    if (customParameters.backgroundColor && customParameters.backgroundColor !== '#ffffff') {
      params.set('backgroundColor', customParameters.backgroundColor);
    }
    
    // Update URL without reload
    const newURL = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newURL);
  };


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

  // Show loading state during SSR and initial hydration
  if (!mounted) return null

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-white flex flex-col">
      
      {/* Bridge to Zustand stores */}
      <StoreInitializer
        logos={logos}
        selectedLogoId={selectedLogoId}
        onLogosChange={setLogos}
        onSelectedLogoChange={setSelectedLogoId}
        zoom={zoom}
        animating={animating}
        controlsPanelOpen={true}
        darkMode={isDarkMode}
      />
      
      <StudioHeader />

      <div className="flex flex-1 overflow-hidden">
        <CanvasArea />

        <div className="flex">
          <ControlsPanel />
          
          <div className="w-80 border-l bg-white/50 backdrop-blur-sm overflow-y-auto">
            <div className="p-4 space-y-4">
              <AIBrandConsultant
                currentParams={customParameters}
                onApplyRecommendation={handleApplyColorTheme}
              />
              <ColorThemeSelector
                currentIndustry={currentIndustry}
                currentParams={customParameters}
                onApplyTheme={handleApplyColorTheme}
              />
              <TemplatePresetsPanel
                currentTemplate={selectedLogo.presetId || 'custom'}
                currentParams={customParameters}
                onApplyPreset={handleApplyTemplatePreset}
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
