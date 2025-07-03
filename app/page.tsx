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
import { DebugOverlay } from '@/components/debug/DebugOverlay'
import { useDebugAction } from '@/lib/debug/useDebugAction'
import { useLogoStore } from '@/lib/stores/logoStore'
import { stateTracer } from '@/lib/debug/stateUpdateTracer'


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
  
  
  // Single selected logo state - React only tracks what it's editing
  const [selectedLogo, setSelectedLogo] = useState<LogoInstance>({
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
  })
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
  const animationRef = useRef<number>()
  const timeRef = useRef(0)

  // selectedLogo is now directly available from state
  
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
    stateTracer.trace({
      type: 'selectedLogo',
      trigger: 'updateSelectedLogo',
      oldValue: { selectedLogoId: selectedLogo.id },
      newValue: { selectedLogoId: selectedLogo.id },
      metadata: { updates }
    });
    
    setSelectedLogo(prev => ({
      ...prev,
      params: { ...prev.params, ...updates }
    }))
    // Also update in Zustand for persistence
    const params = { ...selectedLogo.params, ...updates }
    useLogoStore.getState().updateLogo(selectedLogoId, { 
      parameters: {
        core: {
          frequency: params.frequency,
          amplitude: params.amplitude,
          complexity: params.complexity,
          chaos: params.chaos,
          damping: params.damping,
          layers: params.layers,
          radius: params.radius
        },
        style: {
          fillColor: params.color,
          strokeColor: '#000000',
          backgroundColor: 'transparent',
          fillOpacity: 1,
          strokeOpacity: 0,
          strokeWidth: 2,
          fillType: 'solid',
          strokeType: 'none',
          backgroundType: 'transparent'
        },
        content: {
          text: params.customParameters?.text,
          letter: params.customParameters?.letter
        },
        custom: params.customParameters
      }
    })
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
    stateTracer.trace({
      type: 'selectedLogo',
      trigger: 'setCustomCode',
      oldValue: { selectedLogoId: selectedLogo.id },
      newValue: { selectedLogoId: selectedLogo.id },
      metadata: { codeLength: code.length }
    });
    
    setSelectedLogo(prev => ({
      ...prev,
      code,
      templateId: 'custom',
      templateName: 'Custom',
      themeId: 'custom',
      themeName: 'Custom'
    }))
    // Also update in Zustand
    useLogoStore.getState().updateLogo(selectedLogoId, { code })
  }


  // Set mounted flag after hydration
  useEffect(() => {
    setMounted(true)
    
    // Debug functions available in development
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      (window as any).testThemeLoad = (themeId: string) => loadThemeById(themeId);
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
    stateTracer.trace({
      type: 'both',
      trigger: `loadThemeById(${themeId})`,
      oldValue: { 
        selectedLogoId: selectedLogoId,
        selectedLogoId: selectedLogo.id 
      },
      newValue: { 
        selectedLogoId: selectedLogoId,
        selectedLogoId: selectedLogo.id 
      },
      metadata: { themeId, customDefaults }
    });
    
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
      
      // Get current text values to preserve
      const currentTextValues: Record<string, any> = {};
      textParams.forEach(param => {
        if (selectedLogo.params.customParameters?.[param] !== undefined) {
          currentTextValues[param] = selectedLogo.params.customParameters[param];
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
        ...selectedLogo, 
        params: { 
          ...selectedLogo.params,
          ...mergedParams, // Apply merged parameters
          // Preserve any existing color theme
          fillColor: selectedLogo.params.customParameters?.fillColor || mergedParams.fillColor,
          strokeColor: selectedLogo.params.customParameters?.strokeColor || mergedParams.strokeColor,
          backgroundColor: selectedLogo.params.customParameters?.backgroundColor || mergedParams.backgroundColor,
          customParameters: {
            ...completeParams, // First apply ALL parameter defaults from definitions
            ...mergedParams, // Then apply preset defaults
            ...selectedLogo.params.customParameters, // Then preserve existing parameters (including colors)
            ...currentTextValues // Ensure text values are preserved
          }
        },
        code: template.code, // Set the theme code
        templateId: template.id, // Primary template identifier
        templateName: template.name,
        themeId: template.id, // Legacy compatibility
        themeName: template.name // Legacy compatibility
      };
      
      // Update React state
      stateTracer.trace({
        type: 'selectedLogo',
        trigger: `loadThemeById -> setSelectedLogo(${themeId})`,
        oldValue: { selectedLogoId: selectedLogo.id },
        newValue: { selectedLogoId: updatedLogo.id },
        metadata: { templateId: template.id, templateName: template.name }
      });
      setSelectedLogo(updatedLogo);
      
      // Update in Zustand
      useLogoStore.getState().updateLogo(selectedLogoId, {
        code: template.code,
        templateId: template.id,
        templateName: template.name,
        parameters: {
          core: {
            frequency: updatedLogo.params.frequency,
            amplitude: updatedLogo.params.amplitude,
            complexity: updatedLogo.params.complexity,
            chaos: updatedLogo.params.chaos,
            damping: updatedLogo.params.damping,
            layers: updatedLogo.params.layers,
            radius: updatedLogo.params.radius
          },
          style: {
            fillColor: updatedLogo.params.fillColor || updatedLogo.params.color,
            strokeColor: updatedLogo.params.strokeColor || '#000000',
            backgroundColor: updatedLogo.params.backgroundColor || 'transparent',
            fillOpacity: 1,
            strokeOpacity: 0,
            strokeWidth: 2,
            fillType: 'solid',
            strokeType: 'none',
            backgroundType: 'transparent'
          },
          content: {
            text: updatedLogo.params.customParameters?.text,
            letter: updatedLogo.params.customParameters?.letter
          },
          custom: updatedLogo.params.customParameters
        }
      })
      
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
    // Update selected logo with personality parameters
    const updatedParams = {
      ...selectedLogo.params.customParameters,
      ...personalityParams
    };
    
    setSelectedLogo(prev => ({
      ...prev,
      params: {
        ...prev.params,
        customParameters: updatedParams
      }
    }));
    
    // Update in Zustand
    useLogoStore.getState().updateLogoParameters(selectedLogoId, {
      custom: updatedParams
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
    
    // Update the selected logo with new color parameters
    const updatedParams = {
      ...selectedLogo.params,
      fillColor: colorOnlyParams.fillColor || selectedLogo.params.fillColor,
      strokeColor: colorOnlyParams.strokeColor || selectedLogo.params.strokeColor,
      backgroundColor: colorOnlyParams.backgroundColor || selectedLogo.params.backgroundColor,
      customParameters: {
        ...selectedLogo.params.customParameters,
        ...colorOnlyParams
      }
    };
    
    setSelectedLogo(prev => ({
      ...prev,
      params: updatedParams
    }));
    
    // Update in Zustand
    useLogoStore.getState().updateLogoParameters(selectedLogoId, {
      style: {
        fillColor: colorOnlyParams.fillColor || selectedLogo.params.fillColor || selectedLogo.params.color,
        strokeColor: colorOnlyParams.strokeColor || selectedLogo.params.strokeColor || '#000000',
        backgroundColor: colorOnlyParams.backgroundColor || selectedLogo.params.backgroundColor || 'transparent',
        fillType: 'solid',
        fillOpacity: 1,
        strokeType: 'none',
        strokeWidth: 2,
        strokeOpacity: 0,
        backgroundType: 'transparent'
      },
      custom: colorOnlyParams
    });
    
    // Force re-render to apply the theme changes
    setForceRender(prev => prev + 1)
  }

  // Apply template preset (style parameters only, no colors)
  const handleApplyTemplatePreset = (presetParams: Record<string, any>) => {
    // Apply to selected logo
    const updatedParams = {
      ...selectedLogo.params.customParameters,
      ...presetParams
    };
    
    setSelectedLogo(prev => ({
      ...prev,
      params: {
        ...prev.params,
        customParameters: updatedParams
      }
    }));
    
    // Update in Zustand
    useLogoStore.getState().updateLogoParameters(selectedLogoId, {
      custom: updatedParams
    });
    
    // Force re-render
    setForceRender(prev => prev + 1);
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
      
      // Apply to selected logo
      const updatedParams = {
        ...selectedLogo.params.customParameters,
        ...filteredParams
      };
      
      setSelectedLogo(prev => ({
        ...prev,
        params: {
          ...prev.params,
          customParameters: updatedParams
        }
      }));
      
      // Update in Zustand
      useLogoStore.getState().updateLogoParameters(selectedLogoId, {
        custom: updatedParams
      })
      
      // Force re-render
      setForceRender(prev => prev + 1)
      
    } catch (error) {
      console.error('❌ Failed to apply brand preset:', error)
    }
  }
  // Register debug actions for this page
  useDebugAction([
    {
      id: 'toggle-state-tracer',
      label: 'Toggle State Tracer',
      description: 'Enable/disable state update tracing',
      category: 'State Management',
      icon: '🔍',
      handler: async () => {
        if ((window as any).stateTracer?.enabled) {
          stateTracer.disable();
          console.log('State tracer disabled');
        } else {
          stateTracer.enable();
          console.log('State tracer enabled - watch console for state updates');
        }
      }
    },
    {
      id: 'analyze-state-updates',
      label: 'Analyze State Updates',
      description: 'Show state update patterns',
      category: 'State Management',
      icon: '📊',
      handler: async () => {
        stateTracer.analyze();
      }
    },
    {
      id: 'export-state-table',
      label: 'Export State Table',
      description: 'Show all state updates in table',
      category: 'State Management',
      icon: '📋',
      handler: async () => {
        stateTracer.exportToTable();
      }
    },
    {
      id: 'sync-state',
      label: 'Sync React ↔ Zustand',
      description: 'Fix state mismatch',
      category: 'State Management',
      icon: '🔄',
      handler: async () => {
        const { useLogoStore } = await import('@/lib/stores/logoStore');
        const logoStore = useLogoStore.getState();
        
        // Update React state from Zustand - only the selected logo
        const selected = logoStore.logos.find(l => l.id === logoStore.selectedLogoId);
        if (selected) {
          setSelectedLogo({
            id: selected.id,
            x: selected.position.x,
            y: selected.position.y,
            params: {
              seed: selected.parameters.core.frequency.toString(),
              frequency: selected.parameters.core.frequency,
              amplitude: selected.parameters.core.amplitude,
              complexity: selected.parameters.core.complexity,
              chaos: selected.parameters.core.chaos,
              damping: selected.parameters.core.damping,
              layers: selected.parameters.core.layers,
              barCount: selected.parameters.custom?.barCount || 60,
              barSpacing: selected.parameters.custom?.barSpacing || 2,
              radius: selected.parameters.core.radius || 50,
              color: selected.parameters.style.fillColor,
            sides: 6,
            rotation: 0,
            scale: 1.0,
              customParameters: selected.parameters.custom || {}
            },
            code: selected.code,
            templateId: selected.templateId,
            templateName: selected.templateName,
            themeId: selected.templateId, // Legacy compatibility
            themeName: selected.templateName
          });
        }
        
        setSelectedLogoId(logoStore.selectedLogoId || 'main');
        console.log('✅ State synchronized!');
        console.log(`   React now has ${logoStore.logos.length} logos`);
        console.log(`   Selected: ${logoStore.selectedLogoId}`);
        
        // Force re-render
        setForceRender(prev => prev + 1);
      }
    },
    {
      id: 'load-4-logos',
      label: 'Load 4 Brand Options',
      description: '2x2 grid',
      category: 'Reflow Brand',
      icon: '🎨',
      handler: async () => {
        if (typeof window !== 'undefined' && (window as any).load4Logos) {
          await (window as any).load4Logos();
        }
      }
    },
    {
      id: 'init-reflow',
      label: 'Create Reflow Wordmark',
      description: 'Brand logo',
      category: 'Reflow Brand',
      icon: '✨',
      handler: async () => {
        if (typeof window !== 'undefined' && (window as any).initReflow) {
          await (window as any).initReflow();
        }
      }
    },
    {
      id: 'reflow-shapes',
      label: 'Show Reflow Shapes',
      description: '4 options',
      category: 'Reflow Brand',
      icon: '🔷',
      handler: async () => {
        if (typeof window !== 'undefined' && (window as any).reflowShapes) {
          await (window as any).reflowShapes();
        }
      }
    },
    {
      id: 'list-logo-ids',
      label: 'List Logo IDs',
      description: 'In console',
      category: 'Logo Management',
      icon: '📋',
      handler: async () => {
        if (typeof window !== 'undefined' && (window as any).listLogoIds) {
          const instances = await (window as any).listLogoIds();
          console.log(`📋 Found ${instances.length} tracked logos`);
        }
      }
    },
    {
      id: 'debug-logos',
      label: 'Debug Logo State',
      description: 'Console output',
      category: 'Logo Management',
      icon: '🔍',
      handler: async () => {
        if (typeof window !== 'undefined' && (window as any).debugLogos) {
          await (window as any).debugLogos();
        }
      }
    },
    {
      id: 'clear-logo-ids',
      label: 'Clear Logo IDs',
      description: 'Reset tracking',
      category: 'Logo Management',
      icon: '🗑️',
      handler: async () => {
        if (typeof window !== 'undefined' && (window as any).clearLogoIds) {
          await (window as any).clearLogoIds();
        }
      },
      dangerous: true
    },
    {
      id: 'clear-canvas-state',
      label: 'Clear Canvas State',
      description: 'Reset all logos',
      category: 'State Management',
      icon: '🧹',
      handler: async () => {
        const { useLogoStore } = await import('@/lib/stores/logoStore');
        useLogoStore.getState().clearPersistedState();
        console.log('✅ Canvas state cleared. Reload the page to start fresh.');
      },
      dangerous: true
    },
    {
      id: 'debug-all-logos',
      label: 'Debug All Logo IDs',
      description: 'Show all logo IDs',
      category: 'State Management',
      icon: '🆔',
      handler: async () => {
        const { useLogoStore } = await import('@/lib/stores/logoStore');
        const state = useLogoStore.getState();
        console.log('🆔 ALL LOGO IDs');
        console.log('════════════════');
        state.logos.forEach((logo, index) => {
          console.log(`Logo ${index + 1}:`);
          console.log(`  ID: ${logo.id}`);
          console.log(`  Position: (${logo.position.x}, ${logo.position.y})`);
          console.log(`  Template: ${logo.templateId}`);
          console.log(`  Selected: ${logo.id === state.selectedLogoId ? '✅ YES' : '❌ NO'}`);
        });
        console.log('');
        console.log(`Selected Logo ID: ${state.selectedLogoId}`);
        console.log('');
        console.log('React State:');
        console.log(`  selectedLogoId: ${selectedLogoId}`);
        console.log(`  selectedLogo.id: ${selectedLogo.id}`);
      }
    },
    {
      id: 'test-selection',
      label: 'Test Logo Selection',
      description: 'Debug selection flow',
      category: 'State Management', 
      icon: '🎯',
      handler: async () => {
        const { useLogoStore } = await import('@/lib/stores/logoStore');
        const logoStore = useLogoStore.getState();
        
        console.log('🎯 SELECTION TEST');
        console.log('════════════════');
        
        // Try selecting each logo
        for (const logo of logoStore.logos) {
          console.log(`\nSelecting logo: ${logo.id}`);
          
          // Update Zustand
          logoStore.selectLogo(logo.id);
          
          // Update React
          setSelectedLogoId(logo.id);
          
          // Wait a bit
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Check state
          const currentZustand = useLogoStore.getState().selectedLogoId;
          const currentReact = selectedLogoId;
          
          console.log(`  Zustand selected: ${currentZustand}`);
          console.log(`  React selected: ${currentReact}`);
          console.log(`  Match: ${currentZustand === logo.id ? '✅' : '❌'}`);
        }
      }
    },
    {
      id: 'diagnose-state',
      label: 'Diagnose State Issues',
      description: 'Check for problems',
      category: 'State Management',
      icon: '🔍',
      handler: async () => {
        const { useLogoStore } = await import('@/lib/stores/logoStore');
        const logoStore = useLogoStore.getState();
        
        console.log('🔍 STATE DIAGNOSIS');
        console.log('══════════════════');
        console.log('');
        console.log('React State:');
        console.log(`  Selected Logo: ${selectedLogo.id}`);
        console.log(`  Selected ID: ${selectedLogoId}`);
        console.log('');
        console.log('Zustand Store:');
        console.log(`  Logos: ${logoStore.logos.length}`);
        console.log(`  Selected: ${logoStore.selectedLogoId}`);
        console.log('');
        
        if (selectedLogoId !== logoStore.selectedLogoId) {
          console.log('❌ ISSUE: Selected logo mismatch!');
          console.log('   React selected:', selectedLogoId);
          console.log('   Zustand selected:', logoStore.selectedLogoId);
        }
        
        if (selectedLogo.id !== selectedLogoId) {
          console.log('❌ ISSUE: React selectedLogo.id does not match selectedLogoId!');
          console.log('   selectedLogo.id:', selectedLogo.id);
          console.log('   selectedLogoId:', selectedLogoId);
        }
        
        // Check if selected logo exists in Zustand
        const zustandHasSelected = logoStore.logos.some(l => l.id === logoStore.selectedLogoId);
        
        if (!zustandHasSelected) {
          console.log('❌ ISSUE: Zustand selected logo does not exist in Zustand logos array!');
        }
        
        console.log('');
        console.log('📝 Summary:');
        console.log('   React tracks only the selected logo for editing');
        console.log('   Zustand tracks all logos for canvas rendering');
        console.log('   Canvas reads from Zustand, UI controls read from React')
        
        console.log('');
        console.log('💡 To fix: Click "Sync React ↔ Zustand" in the Utils tab');
      }
    },
    {
      id: 'trace-parameter-update',
      label: 'Trace Parameter Update',
      description: 'Trace how parameter updates flow through the system',
      category: 'Testing',
      handler: async () => {
        const { useLogoStore } = await import('@/lib/stores/logoStore');
        const { useParameterStore } = await import('@/lib/stores/parameterStore');
        
        // Intercept parameterStore update
        const originalUpdate = useParameterStore.getState().updateCustomParameters;
        useParameterStore.getState().updateCustomParameters = (params) => {
          // Call original
          originalUpdate(params);
        };
        
        // Trigger a parameter update
        useParameterStore.getState().updateCustomParameters({ 
          testParam: Date.now() 
        });
        
        // Restore original function
        setTimeout(() => {
          useParameterStore.getState().updateCustomParameters = originalUpdate;
        }, 1000);
      }
    }
  ]);
  
  // Sync selected logo from Zustand to React
  useEffect(() => {
    if (!mounted) return;
    
    // Subscribe to Zustand store changes
    const unsubscribe = useLogoStore.subscribe((state, prevState) => {
      if (state.selectedLogoId !== prevState.selectedLogoId) {
        stateTracer.trace({
          type: 'both',
          trigger: 'Zustand->React sync (selectedLogoId changed)',
          oldValue: {
            selectedLogoId: selectedLogoId,
            selectedLogoId: selectedLogo.id
          },
          newValue: {
            selectedLogoId: state.selectedLogoId,
            selectedLogoId: state.selectedLogoId // Will be same after sync
          },
          metadata: {
            zustandPrev: prevState.selectedLogoId,
            zustandNew: state.selectedLogoId
          }
        });
        
        setSelectedLogoId(state.selectedLogoId);
        
        // Load the full logo data from Zustand into React
        const logo = state.logos.find(l => l.id === state.selectedLogoId);
        if (logo) {
          stateTracer.trace({
            type: 'selectedLogo',
            trigger: 'Zustand->React sync (loading logo data)',
            oldValue: { selectedLogoId: selectedLogo.id },
            newValue: { selectedLogoId: logo.id },
            metadata: { 
              templateId: logo.templateId,
              hasCode: !!logo.code 
            }
          });
          
          setSelectedLogo({
            id: logo.id,
            x: logo.position.x,
            y: logo.position.y,
            params: {
              seed: logo.parameters.core.frequency.toString(),
              frequency: logo.parameters.core.frequency,
              amplitude: logo.parameters.core.amplitude,
              complexity: logo.parameters.core.complexity,
              chaos: logo.parameters.core.chaos,
              damping: logo.parameters.core.damping,
              layers: logo.parameters.core.layers,
              barCount: logo.parameters.custom?.barCount || 60,
              barSpacing: logo.parameters.custom?.barSpacing || 2,
              radius: logo.parameters.core.radius || 50,
              color: logo.parameters.style.fillColor,
              sides: 6,
              rotation: 0,
              scale: 1.0,
              customParameters: logo.parameters.custom || {}
            },
            code: logo.code,
            templateId: logo.templateId,
            templateName: logo.templateName,
            themeId: logo.templateId, // Legacy compatibility
            themeName: logo.templateName
          });
        }
      }
    });
    
    return unsubscribe;
  }, [mounted]);

  // Initialize Reflow brand treatment functions
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    
    // Initialize Reflow brand - one excellent option
    (window as any).initReflow = async () => {
      console.log('✨ Creating Reflow brand identity...');
      
      // Let's do ONE thing really well - a sophisticated wordmark
      const templateId = 'wordmark';
      await loadThemeById(templateId);
      
      // Modern tech brand parameters
      const reflowParams = {
        // Typography - lowercase, tight, modern
        text: 'reflow',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        fontSize: 48,
        fontWeight: 600,  // Semibold for presence
        letterSpacing: -3,  // Tight spacing like Linear/Vercel
        textTransform: 'lowercase',
        textAlign: 'left',  // Not centered!
        
        // Remove ALL animation for a static logo
        frequency: 0,
        amplitude: 0,  // No wave at all
        complexity: 0,
        chaos: 0,
        damping: 1,
        layers: 1,
        
        // Start with black
        backgroundType: 'transparent',
        fillType: 'solid',
        fillColor: '#000000',
        fillOpacity: 1,
        strokeType: 'none',
        
        // No border/frame
        showFrame: false,
        framePadding: 0,
        
        // Consistent seed
        seed: 'reflow-2024'
      };
      
      // Apply the parameters to selected logo
      const updatedParams = {
        ...selectedLogo.params,
        ...reflowParams,
        customParameters: {
          ...selectedLogo.params.customParameters,
          ...reflowParams
        }
      };
      
      setSelectedLogo(prev => ({
        ...prev,
        params: updatedParams
      }));
      
      // Update in Zustand
      useLogoStore.getState().updateLogoParameters(selectedLogoId, {
        core: {
          frequency: reflowParams.frequency,
          amplitude: reflowParams.amplitude,
          complexity: reflowParams.complexity,
          chaos: reflowParams.chaos,
          damping: reflowParams.damping,
          layers: reflowParams.layers
        },
        custom: reflowParams
      });
      
      // Force re-render
      setForceRender(prev => prev + 1);
      
      console.log('✨ Reflow wordmark created');
      console.log('');
      console.log('Apply a color treatment:');
      console.log('• window.reflowColor("black") - Classic black (like Vercel)');
      console.log('• window.reflowColor("blue") - Tech blue (like Stripe)');
      console.log('• window.reflowColor("gradient") - Modern gradient');
    };
    
    // Simple, elegant color options
    (window as any).reflowColor = async (color: string) => {
      const colors: Record<string, any> = {
        black: {
          fillType: 'solid',
          fillColor: '#000000',
          backgroundType: 'transparent'
        },
        blue: {
          fillType: 'solid', 
          fillColor: '#0066FF',  // Bright tech blue
          backgroundType: 'transparent'
        },
        gradient: {
          fillType: 'gradient',
          fillGradientStart: '#7c3aed',  // Purple
          fillGradientEnd: '#06b6d4',    // Cyan
          fillGradientDirection: 135,
          backgroundType: 'transparent'
        }
      };
      
      const colorParams = colors[color];
      if (!colorParams) {
        console.error('Unknown color:', color);
        console.log('Available: black, blue, gradient');
        return;
      }
      
      // Apply color to selected logo
      setSelectedLogo(prev => ({
        ...prev,
        params: {
          ...prev.params,
          customParameters: {
            ...prev.params.customParameters,
            ...colorParams
          }
        }
      }));
      
      // Update in Zustand
      useLogoStore.getState().updateLogoParameters(selectedLogoId, {
        custom: colorParams
      });
      
      setForceRender(prev => prev + 1);
      console.log(`✅ Applied ${color} color`);
    };
    
    // Enhanced utility to load 4 logos with proper ID tracking
    (window as any).load4Logos = async () => {
      
      // Import required modules
      const { LogoIdManager } = await import('@/lib/utils/logoIdManager');
      const { useLogoStore } = await import('@/lib/stores/logoStore');
      const logoStore = useLogoStore.getState();
      
      // Clear localStorage tracking first
      LogoIdManager.clearInstances();
      
      // Handle the minimum logo requirement
      // The store won't delete the last logo, so we need to work around this
      const currentLogos = [...logoStore.logos];
      
      if (currentLogos.length === 1) {
        // We'll update the existing logo instead of trying to delete it
      } else {
        // Delete all but one logo
        currentLogos.slice(1).forEach(logo => logoStore.deleteLogo(logo.id));
      }
      
      // Wait for state to settle
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Import all templates
      const [wordmark, letterMark, waveBars, prismGoogle] = await Promise.all([
        import('@/templates/wordmark'),
        import('@/templates/letter-mark'),
        import('@/templates/wave-bars'),
        import('@/templates/prism-google')
      ]);
      
      // Create 4 logos with unique IDs
      const positions = [
        { x: 0, y: 0 },     // Top left
        { x: 700, y: 0 },   // Top right
        { x: 0, y: 700 },   // Bottom left
        { x: 700, y: 700 }  // Bottom right
      ];
      
      // Logo 1: Wordmark (update existing if present)
      let logo1Id: string;
      
      if (logoStore.logos.length > 0) {
        // Update the existing logo
        logo1Id = logoStore.logos[0].id;
        logoStore.updateLogoPosition(logo1Id, positions[0]);
        logoStore.updateLogo(logo1Id, {
          templateId: 'wordmark',
          templateName: 'Wordmark',
          code: wordmark.code
        });
      } else {
        // Create new logo
        logo1Id = logoStore.addLogo('wordmark');
        await new Promise(resolve => setTimeout(resolve, 50));
        logoStore.updateLogoPosition(logo1Id, positions[0]);
        logoStore.updateLogo(logo1Id, {
          templateId: 'wordmark',
          templateName: 'Wordmark',
          code: wordmark.code
        });
      }
      
      logoStore.updateLogoParameters(logo1Id, {
        custom: {
          text: 'reflow',
          fontFamily: 'Inter, -apple-system, sans-serif',
          fontSize: 56,
          fontWeight: 600,
          letterSpacing: -2,
          fillType: 'solid',
          fillColor: '#000000',
          strokeType: 'none',
          backgroundType: 'transparent',
          frequency: 0,
          amplitude: 0
        }
      });
      
      // Logo 2: Letter Mark
      const logo2Id = logoStore.addLogo('letter-mark');
      await new Promise(resolve => setTimeout(resolve, 50));
      
      logoStore.updateLogoPosition(logo2Id, positions[1]);
      logoStore.updateLogo(logo2Id, {
        templateId: 'letter-mark',
        templateName: 'Letter Mark',
        code: letterMark.code
      });
      logoStore.updateLogoParameters(logo2Id, {
        custom: {
          letter: 'R',
          fontFamily: 'Inter, -apple-system, sans-serif',
          fontSize: 120,
          fontWeight: 700,
          fillType: 'solid',
          fillColor: '#0066FF',
          strokeType: 'none',
          backgroundType: 'transparent'
        }
      });
      
      // Logo 3: Wave Bars
      const logo3Id = logoStore.addLogo('wave-bars');
      await new Promise(resolve => setTimeout(resolve, 50));
      
      logoStore.updateLogoPosition(logo3Id, positions[2]);
      logoStore.updateLogo(logo3Id, {
        templateId: 'wave-bars',
        templateName: 'Wave Bars',
        code: waveBars.code
      });
      logoStore.updateLogoParameters(logo3Id, {
        core: {
          frequency: 2,
          amplitude: 40,
          complexity: 0.2,
          chaos: 0
        },
        custom: {
          barCount: 7,
          barSpacing: 3,
          fillType: 'gradient',
          fillGradientStart: '#7c3aed',
          fillGradientEnd: '#06b6d4',
          fillGradientDirection: 45,
          strokeType: 'none',
          backgroundType: 'transparent'
        }
      });
      
      // Logo 4: Prism
      const logo4Id = logoStore.addLogo('prism-google');
      await new Promise(resolve => setTimeout(resolve, 50));
      
      logoStore.updateLogoPosition(logo4Id, positions[3]);
      logoStore.updateLogo(logo4Id, {
        templateId: 'prism-google',
        templateName: 'Prism',
        code: prismGoogle.code
      });
      logoStore.updateLogoParameters(logo4Id, {
        custom: {
          symmetry: 6,
          radius: 60,
          colorMode: 'monochrome',
          fillType: 'solid',
          fillColor: '#000000',
          strokeType: 'none',
          backgroundType: 'transparent',
          frequency: 0,
          amplitude: 0
        }
      });
      
      // Select the first logo
      logoStore.selectLogo(logo1Id);
      setSelectedLogoId(logo1Id);
      
      // Load the selected logo into React state
      const selectedLogo = logoStore.logos.find(l => l.id === logo1Id);
      if (selectedLogo) {
        setSelectedLogo({
          id: selectedLogo.id,
          x: selectedLogo.position.x,
          y: selectedLogo.position.y,
          params: {
            seed: selectedLogo.parameters.core.frequency.toString(),
            frequency: selectedLogo.parameters.core.frequency,
            amplitude: selectedLogo.parameters.core.amplitude,
            complexity: selectedLogo.parameters.core.complexity,
            chaos: selectedLogo.parameters.core.chaos,
            damping: selectedLogo.parameters.core.damping,
            layers: selectedLogo.parameters.core.layers,
            barCount: selectedLogo.parameters.custom?.barCount || 40,
            barSpacing: selectedLogo.parameters.custom?.barSpacing || 2,
            radius: selectedLogo.parameters.core.radius || 50,
            color: selectedLogo.parameters.style.fillColor,
            sides: 6,
            rotation: 0,
            scale: 1.0,
            customParameters: selectedLogo.parameters.custom || {}
          },
          code: selectedLogo.code,
          templateId: selectedLogo.templateId,
          templateName: selectedLogo.templateName,
          themeId: selectedLogo.templateId,
          themeName: selectedLogo.templateName
        });
      }
      
      // Force re-render
      setForceRender(prev => prev + 1);
      
      // Display results
      const savedInstances = LogoIdManager.loadInstances();
      console.log('');
      console.log('✅ 4 logos created with ID tracking!');
      console.log(`📍 Top left: ${logo1Id} - reflow wordmark (black)`);
      console.log(`📍 Top right: ${logo2Id} - R lettermark (blue)`);  
      console.log(`📍 Bottom left: ${logo3Id} - Wave bars (gradient)`);
      console.log(`📍 Bottom right: ${logo4Id} - Hexagon (black)`);
      console.log('');
      console.log('💾 Saved to localStorage:', savedInstances);
      console.log('');
      console.log('💡 Tips:');
      console.log('• Click on any logo to select it');
      console.log('• Drag logos to reposition them');
      console.log('• Use controls panel to modify parameters');
      console.log('• IDs are persisted in localStorage');
    };
    
    // Logo ID management utilities
    (window as any).listLogoIds = async () => {
      const { LogoIdManager } = await import('@/lib/utils/logoIdManager');
      const instances = LogoIdManager.loadInstances();
      console.log('📋 Tracked Logo Instances:');
      console.log('═══════════════════════════');
      if (instances.length === 0) {
        console.log('No logos tracked in localStorage');
      } else {
        instances.forEach((instance, index) => {
          console.log(`${index + 1}. ID: ${instance.id}`);
          console.log(`   Position: (${instance.position.x}, ${instance.position.y})`);
          console.log(`   Template: ${instance.templateId || 'unknown'}`);
        });
      }
      return instances;
    };
    
    (window as any).clearLogoIds = async () => {
      const { LogoIdManager } = await import('@/lib/utils/logoIdManager');
      LogoIdManager.clearInstances();
      console.log('✅ Cleared all tracked logo IDs from localStorage');
    };
    
    // Debug utility to check current logo state
    (window as any).debugLogos = async () => {
      const { useLogoStore } = await import('@/lib/stores/logoStore');
      const logoStore = useLogoStore.getState();
      
      console.log('🔍 Current Logo State:');
      console.log('════════════════════════');
      console.log(`Total logos: ${logoStore.logos.length}`);
      console.log(`Selected logo: ${logoStore.selectedLogoId}`);
      console.log('');
      
      logoStore.logos.forEach((logo, index) => {
        console.log(`Logo ${index + 1}:`);
        console.log(`  ID: ${logo.id}`);
        console.log(`  Template: ${logo.templateId} (${logo.templateName})`);
        console.log(`  Position: (${logo.position.x}, ${logo.position.y})`);
        console.log(`  Has code: ${logo.code ? 'Yes' : 'No'}`);
        console.log(`  Parameters:`, logo.parameters.custom);
        console.log('');
      });
    };
    
    // Simple startup message
    setTimeout(() => {
      console.log('');
      console.log('🚀 REFLOW BRAND SYSTEM');
      console.log('════════════════════════');
      console.log('');
      console.log('🐛 Debug Toolbar: Look for the bug icon button in the bottom-right corner!');
      console.log('');
      console.log('Console Commands:');
      console.log('• window.initReflow() - Create wordmark');
      console.log('• window.reflowShapes() - Show all 4 options side by side');
      console.log('• window.load4Logos() - Load 4 logos with ID tracking');
      console.log('• window.listLogoIds() - List tracked logo IDs');
      console.log('• window.clearLogoIds() - Clear ID tracking');
      console.log('• window.debugLogos() - Debug current logo state');
      console.log('');
      console.log('💡 Tip: Use the debug toolbar for quick access to all these features!');
    }, 1000);
    
    console.log('✅ Reflow functions attached to window');
  }, [mounted]); // Only depend on mounted to run once
  
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
        logos={[selectedLogo]} // Only pass the selected logo
        selectedLogoId={selectedLogoId}
        onLogosChange={(newLogos) => {
          // When Zustand updates, we don't need to update React's logos array
          // React only tracks the selected logo
        }}
        onSelectedLogoChange={setSelectedLogoId}
        // Removed onTemplateChange - templates are loaded explicitly, not automatically
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
      
      {/* Debug overlay - handles its own visibility and dev mode checking */}
      <DebugOverlay 
        reactLogos={[selectedLogo]} // Only the selected logo
        selectedLogoId={selectedLogoId}
        canvasOffset={
          typeof window !== 'undefined' && (window as any).getCanvasOffset
            ? (window as any).getCanvasOffset()
            : undefined
        }
        onClearCanvasPosition={() => {
          // Call the CanvasArea's reset function directly
          if (typeof window !== 'undefined' && (window as any).resetCanvasPosition) {
            (window as any).resetCanvasPosition();
          } else {
            console.warn('⚠️ resetCanvasPosition function not available');
          }
        }}
      />
    </div>
  )
}
