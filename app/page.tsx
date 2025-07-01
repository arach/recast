'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { SavedShape } from '@/lib/storage'
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
import { StateDebugger } from '@/components/debug/StateDebugger'


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
  templateId?: string // Standardized template identifier
  templateName?: string
  // Legacy fields for backward compatibility
  themeId?: string // Kept for legacy support
  themeName?: string
  presetId?: string
  presetName?: string
}

export default function Home() {
  const [mounted, setMounted] = useState(false)
  
  
  // Multi-logo state
  const [logos, setLogos] = useState<LogoInstance[]>([
    {
      id: 'main',
      x: 0,
      y: 0,
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
      code: '', // Will be loaded from template
      // Don't set template fields - they'll be set when template loads
      templateId: undefined,
      templateName: undefined,
      // Legacy fields for compatibility
      themeId: undefined,
      themeName: undefined
    }
  ])
  const [selectedLogoId, setSelectedLogoId] = useState('main')
  
  // UI state
  const [animating] = useState(false)
  const [zoom] = useState(1)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [saveMode, setSaveMode] = useState<'shape' | 'logo'>('logo')
  const [savedItemsOpen, setSavedItemsOpen] = useState(false)
  const [currentShapeId, setCurrentShapeId] = useState<string | undefined>()
  const [currentShapeName, setCurrentShapeName] = useState('Custom Shape')
  const [forceRender, setForceRender] = useState(0)
  const [showIndustrySelector, setShowIndustrySelector] = useState(false)
  const [currentIndustry, setCurrentIndustry] = useState<string | undefined>()
  const [showDebugger, setShowDebugger] = useState(false)
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
  // Use selectedLogo.params.customParameters directly - no separate state needed
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
        ? { ...logo, code, templateId: 'custom', templateName: 'Custom', themeId: 'custom', themeName: 'Custom' }
        : logo
    ))
  }


  // Set mounted flag after hydration
  useEffect(() => {
    setMounted(true)
    
    // Debug functions available in development
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      (window as any).testThemeLoad = (themeId: string) => loadThemeById(themeId);
      (window as any).showDebugger = () => {
        setShowDebugger(true);
        console.log('✅ State debugger enabled');
      };
      (window as any).hideDebugger = () => {
        setShowDebugger(false);
        console.log('❌ State debugger disabled');
      };
      (window as any).toggleDebugger = () => {
        setShowDebugger(prev => !prev);
        console.log(`🔄 State debugger ${!showDebugger ? 'enabled' : 'disabled'}`);
      };
      console.log('🐛 Debug functions available:');
      console.log('  - window.showDebugger() - Show state debugger');
      console.log('  - window.hideDebugger() - Hide state debugger');
      console.log('  - window.toggleDebugger() - Toggle state debugger');
      console.log('  - window.testThemeLoad(templateId) - Test loading a template');
    }
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
    
    // Load template if specified, or load a default template
    const templateToLoad = templateParam || 'wave-bars';
    loadThemeById(templateToLoad).then(() => {
        // After template loads, apply text and color params
        const updates: Record<string, any> = {};
        
        if (textParam) updates.text = textParam;
        if (letterParam) updates.letter = letterParam;
        if (fillColorParam) updates.fillColor = fillColorParam;
        if (strokeColorParam) updates.strokeColor = strokeColorParam;
        if (backgroundColorParam) updates.backgroundColor = backgroundColorParam;
        
        if (Object.keys(updates).length > 0) {
          // Update customParameters via the logo state, not separate state
          updateSelectedLogo({ 
            customParameters: {
              ...selectedLogo.params.customParameters,
              ...updates
            }
          });
        }
    });
  }, [mounted]); // Only run once after mount

  // Update URL when key parameters change
  useEffect(() => {
    if (!mounted) return;
    
    // Debounce URL updates to avoid too many history entries
    const timeoutId = setTimeout(() => {
      updateURLParams();
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [selectedLogo.themeId, customParameters.text, customParameters.letter, 
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
      // Try multiple patterns to catch different formatting
      const patterns = [
        /const\s+PARAMETERS\s*=\s*({[\s\S]*?}\s*});/m,  // Multi-line with nested objects
        /const\s+PARAMETERS\s*=\s*({[\s\S]*?});/m,      // Multi-line simple
        /const\s+PARAMETERS\s*=\s*({[^}]+});/,          // Single line
        /const\s+PARAMETERS\s*=\s*\{([\s\S]*?)\};/m     // Alternative syntax
      ];
      
      let match = null;
      for (const pattern of patterns) {
        match = code.match(pattern);
        if (match) break;
      }
      
      if (!match) return null
      
      const fullParamsBlock = match[1]
      
      // Try to parse as actual JavaScript object (safer approach)
      try {
        // Replace arrow functions with regular functions for safer evaluation
        const safeParamsBlock = fullParamsBlock.replace(
          /showIf:\s*\(([^)]*)\)\s*=>\s*([^,}]+)/g,
          'showIf: function($1) { return $2; }'
        );
        
        // Replace the object with a safer evaluation
        const paramsCode = `(${safeParamsBlock})`
        const paramsObj = eval(paramsCode)
        
        // Convert to our expected format
        const parameters: Record<string, any> = {}
        for (const [paramName, paramDef] of Object.entries(paramsObj)) {
          parameters[paramName] = paramDef
        }
        return parameters
      } catch (evalError) {
        console.error('Failed to evaluate PARAMETERS object:', evalError)
        console.error('Problematic code:', fullParamsBlock.substring(0, 500) + '...')
        
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


  // Load theme by ID
  const loadThemeById = async (themeId: string, customDefaults?: Record<string, any>) => {
    try {
      // Direct import of the template module
      const template = await import(`@/templates/${themeId}`);
      
      if (!template || !template.code) {
        console.error('❌ Theme not found:', themeId)
        return
      }
      
      // Parse the theme code to get ALL parameter definitions (not just defaults)
      const parsedParams = parseCustomParameters(template.code) || {};
      
      // Text parameters that should be preserved
      const textParams = ['text', 'letter', 'letters', 'brandName', 'words', 'title', 'subtitle'];
      
      // Build complete parameters from definitions and defaults
      const completeParams: Record<string, any> = {};
      Object.entries(parsedParams).forEach(([key, paramDef]) => {
        if (paramDef.default !== undefined) {
          completeParams[key] = paramDef.default;
        }
      });
      
      // Update the selected logo with theme data
      setLogos(prev => prev.map(logo => {
        if (logo.id !== selectedLogoId) {
          return logo;
        }
        
        // Get current text values to preserve
        const currentTextValues: Record<string, any> = {};
        textParams.forEach(param => {
          if (logo.params.customParameters?.[param] !== undefined) {
            currentTextValues[param] = logo.params.customParameters[param];
          }
        });
        
        // Merge theme defaults with custom defaults (industry-specific or otherwise)
        const mergedParams = {
          ...completeParams,
          ...template.defaultParams,
          ...customDefaults,
          ...currentTextValues // Preserve text values
        };
        
        const updatedLogo = { 
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
          code: template.code, // Set the theme code
          templateId: template.id, // Primary template identifier
          templateName: template.name,
          themeId: template.id, // Legacy compatibility
          themeName: template.name // Legacy compatibility
        };
        
        return updatedLogo;
      }))
      
      // Force re-render
      setForceRender(prev => prev + 1)
      
    } catch (error) {
      console.error('Failed to load theme:', error)
    }
  }
  
  // Handle theme selection from industry selector
  const handleIndustryThemeSelect = async (themeId: string, industryDefaults?: Record<string, any>, industryId?: string) => {
    await loadThemeById(themeId, industryDefaults)
    setCurrentIndustry(industryId)
    setShowIndustrySelector(false)
  }

  // Handle brand personality application (parameters only, no template change)
  const handleApplyBrandPersonality = (personalityParams: Record<string, any>) => {
    // Apply personality parameters while preserving all template context
    setLogos(prev => {
      // Get the current logo from the latest state, not from closure
      const currentLogo = prev.find(logo => logo.id === selectedLogoId);
      if (!currentLogo) return prev;
      
      return prev.map(logo => 
        logo.id === selectedLogoId 
          ? { 
              ...logo, // Preserve all existing logo properties including template identifiers
              params: { 
                ...logo.params,
                customParameters: {
                  ...logo.params.customParameters, // Preserve existing parameters
                  ...personalityParams // Apply personality parameters
                }
              }
              // Template context (themeId, themeName, templateId, templateName) preserved via spread
            }
          : logo
      )
    });
    
    // Force re-render
    setForceRender(prev => prev + 1)
  }

  // Handle color theme application - preserve template context
  const handleApplyColorTheme = (themedParams: Record<string, any>) => {
    // STRICT FILTER: Only allow specific color parameters to prevent template contamination
    const allowedColorParams = [
      'fillColor', 'strokeColor', 'backgroundColor', 'textColor',
      'backgroundGradientStart', 'backgroundGradientEnd',
      'fillGradientStart', 'fillGradientEnd',
      'strokeGradientStart', 'strokeGradientEnd'
    ];
    
    const colorOnlyParams = Object.entries(themedParams).reduce((acc, [key, value]) => {
      // ONLY include if it's in our allowed list - no other parameters
      if (allowedColorParams.includes(key)) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);
    
    // Update the logo with new color parameters while preserving all template context
    setLogos(prev => {
      // Get the current logo from the latest state, not from closure
      const currentLogo = prev.find(logo => logo.id === selectedLogoId);
      if (!currentLogo) {
        return prev;
      }
      
      const updatedLogos = prev.map(logo => 
        logo.id === selectedLogoId 
          ? { 
              ...logo, // Preserve all existing logo properties including template identifiers
              params: {
                ...logo.params,
                // Apply color params at the root level (for legacy compatibility)
                fillColor: colorOnlyParams.fillColor || logo.params.fillColor,
                strokeColor: colorOnlyParams.strokeColor || logo.params.strokeColor,
                backgroundColor: colorOnlyParams.backgroundColor || logo.params.backgroundColor,
                customParameters: {
                  ...logo.params.customParameters, // Preserve all existing custom parameters
                  // Apply only the filtered color parameters
                  ...colorOnlyParams
                }
              }
              // Template context (themeId, themeName, templateId, templateName) preserved via spread
            }
          : logo
      );
      
      return updatedLogos;
    });
    // Force re-render to apply the theme changes
    setForceRender(prev => prev + 1)
  }

  // Apply template preset (style parameters only, no colors)
  const handleApplyTemplatePreset = (presetParams: Record<string, any>) => {
    setLogos(prev => {
      // Get the current logo from the latest state, not from closure
      const currentLogo = prev.find(logo => logo.id === selectedLogoId);
      if (!currentLogo) return prev;
      
      return prev.map(logo => 
        logo.id === selectedLogoId 
          ? { 
              ...logo, // Preserve all existing logo properties including template identifiers
              params: { 
                ...logo.params,
                customParameters: {
                  ...logo.params.customParameters, // Preserve existing parameters
                  ...presetParams // Apply preset parameters
                }
              }
              // Template context (themeId, themeName, templateId, templateName) preserved via spread
            }
          : logo
      )
    });
    
    // Force re-render
    setForceRender(prev => prev + 1)
  }

  // Apply brand preset from AI or examples
  const handleApplyBrandPreset = async (brandPreset: any) => {
    try {
      // First load the base preset if it's different from current (check both templateId and themeId for compatibility)
      const currentTemplate = selectedLogo.templateId || selectedLogo.themeId;
      if (brandPreset.preset !== currentTemplate) {
        await loadThemeById(brandPreset.preset)
      }
      
      // Filter out text-based parameters that shouldn't be overridden
      const textParams = ['text', 'letter', 'letters', 'brandName', 'words', 'title', 'subtitle'];
      const filteredParams = Object.fromEntries(
        Object.entries(brandPreset.params).filter(([key]) => !textParams.includes(key))
      );
      
      // Then apply the custom parameters
      setLogos(prev => prev.map(logo => {
        if (logo.id === selectedLogoId) {
          return { 
            ...logo, 
            params: { 
              ...logo.params,
              customParameters: {
                ...logo.params.customParameters,
                ...filteredParams
              }
            }
          };
        }
        return logo;
      }))
      
      // Force re-render
      setForceRender(prev => prev + 1)
      
    } catch (error) {
      console.error('❌ Failed to apply brand preset:', error)
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

  const handleLoadLogo = (logo: SavedLogo) => {
    // Update parameters from saved logo
    setSeed(logo.parameters.core.frequency.toString()) // Convert to seed format
    setFrequency(logo.parameters.core.frequency)
    setAmplitude(logo.parameters.core.amplitude)
    setComplexity(logo.parameters.core.complexity)
    setChaos(logo.parameters.core.chaos)
    setDamping(logo.parameters.core.damping)
    setLayers(logo.parameters.core.layers)
    if (logo.parameters.core.radius) setRadius(logo.parameters.core.radius)
    
    // Update custom parameters
    if (logo.parameters.custom.barCount) setBarCount(logo.parameters.custom.barCount)
    if (logo.parameters.custom.barSpacing) setBarSpacing(logo.parameters.custom.barSpacing)
    
    // Update style
    if (logo.parameters.style.fillColor) setColor(logo.parameters.style.fillColor)
    
    // Update shape if custom
    if (logo.shape.id) setCurrentShapeId(logo.shape.id)
    
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
        onTemplateChange={(templateId: string) => {
          // When template changes in Zustand store, load it in React state
          loadThemeById(templateId);
        }}
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
                currentTemplate={selectedLogo.templateId || selectedLogo.themeId || 'custom'}
                currentParams={customParameters}
                onApplyPreset={handleApplyTemplatePreset}
              />
              <AISuggestions
                currentIndustry={currentIndustry}
                currentPreset={selectedLogo.templateId || selectedLogo.themeId || 'custom'}
                currentParams={customParameters}
                onApplySuggestion={handleApplyColorTheme}
              />
              <BrandPersonality
                currentParams={customParameters}
                onApplyPersonality={handleApplyBrandPersonality}
              />
              <BrandPresetsPanel
                onApplyPreset={handleApplyBrandPreset}
                currentParams={customParameters}
                currentPreset={selectedLogo.themeId || 'custom'}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Industry Selector */}
      {showIndustrySelector && (
        <IndustrySelector 
          onSelectTheme={handleIndustryThemeSelect}
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
        onLoadLogo={handleLoadLogo}
      />
      
      {/* Debug state viewer */}
      {process.env.NODE_ENV === 'development' && showDebugger && (
        <StateDebugger 
          reactLogos={logos}
          selectedLogoId={selectedLogoId}
        />
      )}
    </div>
  )
}
