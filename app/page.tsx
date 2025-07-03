'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { SavedShape, SavedLogo } from '@/lib/storage'
import { exportCanvasAsPNG } from '@/lib/export-utils'
import { SaveDialog } from '@/components/save-dialog'
import { SavedItemsDialog } from '@/components/saved-items-dialog'
import { StudioHeader } from '@/components/studio/StudioHeader'
import { CanvasArea } from '@/components/studio/CanvasArea'
import { ControlsPanel } from '@/components/studio/ControlsPanel'
import { BrandPresetsPanel } from '@/components/studio/BrandPresetsPanel'
import { IndustrySelector } from '@/components/studio/IndustrySelector'
import { ColorThemeSelector } from '@/components/studio/ColorThemeSelector'
import { TemplatePresetsPanel } from '@/components/studio/TemplatePresetsPanel'
import { AISuggestions } from '@/components/studio/AISuggestions'
import { BrandPersonality } from '@/components/studio/BrandPersonality'
import { AIBrandConsultant } from '@/components/studio/AIBrandConsultant'
import { DebugOverlay } from '@/components/debug/DebugOverlay'
import { useDebugAction } from '@/lib/debug/useDebugAction'
import { useLogoStore } from '@/lib/stores/logoStore'
import { useUIStore } from '@/lib/stores/uiStore'
import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo'
import { stateTracer } from '@/lib/debug/stateUpdateTracer'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  
  // Get state from Zustand stores
  const { logos, selectedLogoId, selectLogo, updateLogo, updateLogoParameters } = useLogoStore()
  const { darkMode, setDarkMode } = useUIStore()
  const { 
    logo: selectedLogo,
    coreParams,
    styleParams,
    contentParams,
    customParams,
    updateCore,
    updateStyle,
    updateContent,
    updateCustom,
    updateSelectedLogoCode
  } = useSelectedLogo()
  
  // UI state
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [saveMode, setSaveMode] = useState<'shape' | 'logo'>('logo')
  const [savedItemsOpen, setSavedItemsOpen] = useState(false)
  const [currentShapeId, setCurrentShapeId] = useState<string | undefined>()
  const [currentShapeName, setCurrentShapeName] = useState('Custom Shape')
  const [forceRender, setForceRender] = useState(0)
  const [showIndustrySelector, setShowIndustrySelector] = useState(false)
  const [currentIndustry, setCurrentIndustry] = useState<string | undefined>()

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
        
        if (Object.keys(updates).length > 0 && selectedLogoId) {
          updateCustom(updates);
        }
    });
  }, [mounted]); // Only run once after mount

  // Update URL when key parameters change
  useEffect(() => {
    if (!mounted || !selectedLogo) return;
    
    // Debounce URL updates to avoid too many history entries
    const timeoutId = setTimeout(() => {
      updateURLParams();
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [selectedLogo?.templateId, customParams?.text, customParams?.letter, 
      customParams?.fillColor, customParams?.strokeColor, customParams?.backgroundColor]);

  // Theme detection
  useEffect(() => {
    if (!mounted) return
    
    const checkTheme = () => {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setDarkMode(isDark)
    }
    
    checkTheme()
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', checkTheme)
    
    return () => mediaQuery.removeEventListener('change', checkTheme)
  }, [mounted, setDarkMode])

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
      // Look for PARAMETERS = { ... } definition
      const patterns = [
        /const\s+PARAMETERS\s*=\s*({[\s\S]*?}\s*});/m,
        /const\s+PARAMETERS\s*=\s*({[\s\S]*?});/m,
        /const\s+PARAMETERS\s*=\s*({[^}]+});/,
        /const\s+PARAMETERS\s*=\s*\{([\s\S]*?)\};/m
      ];
      
      let match = null;
      for (const pattern of patterns) {
        match = code.match(pattern);
        if (match) break;
      }
      
      if (!match) return null
      
      const fullParamsBlock = match[1]
      
      // Try to parse as actual JavaScript object
      try {
        const safeParamsBlock = fullParamsBlock.replace(
          /showIf:\s*\(([^)]*)\)\s*=>\s*([^,}]+)/g,
          'showIf: function($1) { return $2; }'
        );
        
        const paramsCode = `(${safeParamsBlock})`
        const paramsObj = eval(paramsCode)
        
        const parameters: Record<string, any> = {}
        for (const [paramName, paramDef] of Object.entries(paramsObj)) {
          parameters[paramName] = paramDef
        }
        return parameters
      } catch (evalError) {
        console.error('Failed to evaluate PARAMETERS object:', evalError)
        return null
      }
    } catch (error) {
      console.warn('Failed to parse custom parameters:', error)
      return null
    }
  }

  // Manual refresh function
  const handleRunCode = useCallback(() => {
    setForceRender(prev => prev + 1)
  }, [])

  // Load theme by ID
  const loadThemeById = async (themeId: string, customDefaults?: Record<string, any>) => {
    if (!selectedLogoId) return;
    
    try {
      // Direct import of the template module
      const template = await import(`@/templates/${themeId}`);
      
      if (!template || !template.code) {
        console.error('Theme not found:', themeId)
        return
      }
      
      // Parse the theme code to get parameter definitions
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
        if (customParams?.[param] !== undefined) {
          currentTextValues[param] = customParams[param];
        }
      });
      
      // Merge theme defaults with custom defaults
      const mergedParams = {
        ...completeParams,
        ...template.defaultParams,
        ...customDefaults,
        ...currentTextValues // Preserve text values
      };
      
      // Update logo in Zustand
      updateLogo(selectedLogoId, {
        code: template.code,
        templateId: template.id,
        templateName: template.name,
      });
      
      // Update parameters
      updateLogoParameters(selectedLogoId, {
        custom: mergedParams
      });
      
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
    if (selectedLogoId) {
      updateCustom(personalityParams);
      setForceRender(prev => prev + 1)
    }
  }

  // Handle color theme application
  const handleApplyColorTheme = (themedParams: Record<string, any>) => {
    const allowedColorParams = [
      'fillColor', 'strokeColor', 'backgroundColor', 'textColor',
      'backgroundGradientStart', 'backgroundGradientEnd',
      'fillGradientStart', 'fillGradientEnd',
      'strokeGradientStart', 'strokeGradientEnd'
    ];
    
    const colorOnlyParams = Object.entries(themedParams).reduce((acc, [key, value]) => {
      if (allowedColorParams.includes(key)) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);
    
    if (selectedLogoId) {
      updateStyle({
        fillColor: colorOnlyParams.fillColor || styleParams?.fillColor,
        strokeColor: colorOnlyParams.strokeColor || styleParams?.strokeColor,
        backgroundColor: colorOnlyParams.backgroundColor || styleParams?.backgroundColor,
      });
      updateCustom(colorOnlyParams);
      setForceRender(prev => prev + 1)
    }
  }

  // Apply template preset
  const handleApplyTemplatePreset = (presetParams: Record<string, any>) => {
    if (selectedLogoId) {
      updateCustom(presetParams);
      setForceRender(prev => prev + 1);
    }
  }

  // Apply brand preset from AI or examples
  const handleApplyBrandPreset = async (brandPreset: any) => {
    try {
      // First load the base preset if it's different from current
      if (brandPreset.preset !== selectedLogo?.templateId) {
        await loadThemeById(brandPreset.preset)
      }
      
      // Filter out text-based parameters that shouldn't be overridden
      const textParams = ['text', 'letter', 'letters', 'brandName', 'words', 'title', 'subtitle'];
      const filteredParams = Object.fromEntries(
        Object.entries(brandPreset.params).filter(([key]) => !textParams.includes(key))
      );
      
      if (selectedLogoId) {
        updateCustom(filteredParams);
        setForceRender(prev => prev + 1)
      }
      
    } catch (error) {
      console.error('Failed to apply brand preset:', error)
    }
  }

  // Register debug actions
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
      }
    }
  ]);

  // Initialize Reflow brand treatment functions
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    
    // Initialize Reflow brand
    (window as any).initReflow = async () => {
      console.log('✨ Creating Reflow brand identity...');
      
      const templateId = 'wordmark';
      await loadThemeById(templateId);
      
      const reflowParams = {
        text: 'reflow',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        fontSize: 48,
        fontWeight: 600,
        letterSpacing: -3,
        textTransform: 'lowercase',
        textAlign: 'left',
        frequency: 0,
        amplitude: 0,
        complexity: 0,
        chaos: 0,
        damping: 1,
        layers: 1,
        backgroundType: 'transparent',
        fillType: 'solid',
        fillColor: '#000000',
        fillOpacity: 1,
        strokeType: 'none',
        showFrame: false,
        framePadding: 0,
        seed: 'reflow-2024'
      };
      
      if (selectedLogoId) {
        updateCore({
          frequency: reflowParams.frequency,
          amplitude: reflowParams.amplitude,
          complexity: reflowParams.complexity,
          chaos: reflowParams.chaos,
          damping: reflowParams.damping,
          layers: reflowParams.layers
        });
        updateCustom(reflowParams);
        setForceRender(prev => prev + 1);
      }
      
      console.log('✨ Reflow wordmark created');
    };
    
    // Simple color options
    (window as any).reflowColor = async (color: string) => {
      const colors: Record<string, any> = {
        black: {
          fillType: 'solid',
          fillColor: '#000000',
          backgroundType: 'transparent'
        },
        blue: {
          fillType: 'solid', 
          fillColor: '#0066FF',
          backgroundType: 'transparent'
        },
        gradient: {
          fillType: 'gradient',
          fillGradientStart: '#7c3aed',
          fillGradientEnd: '#06b6d4',
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
      
      if (selectedLogoId) {
        updateCustom(colorParams);
        setForceRender(prev => prev + 1);
        console.log(`✅ Applied ${color} color`);
      }
    };
    
    // Load 4 logos utility
    (window as any).load4Logos = async () => {
      const { LogoIdManager } = await import('@/lib/utils/logoIdManager');
      const { useLogoStore } = await import('@/lib/stores/logoStore');
      const logoStore = useLogoStore.getState();
      
      LogoIdManager.clearInstances();
      
      const currentLogos = [...logoStore.logos];
      if (currentLogos.length > 1) {
        currentLogos.slice(1).forEach(logo => logoStore.deleteLogo(logo.id));
      }
      
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const [wordmark, letterMark, waveBars, prismGoogle] = await Promise.all([
        import('@/templates/wordmark'),
        import('@/templates/letter-mark'),
        import('@/templates/wave-bars'),
        import('@/templates/prism-google')
      ]);
      
      const positions = [
        { x: 0, y: 0 },
        { x: 700, y: 0 },
        { x: 0, y: 700 },
        { x: 700, y: 700 }
      ];
      
      // Logo 1: Wordmark
      let logo1Id: string;
      if (logoStore.logos.length > 0) {
        logo1Id = logoStore.logos[0].id;
        logoStore.updateLogoPosition(logo1Id, positions[0]);
        logoStore.updateLogo(logo1Id, {
          templateId: 'wordmark',
          templateName: 'Wordmark',
          code: wordmark.code
        });
      } else {
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
      
      logoStore.selectLogo(logo1Id);
      setForceRender(prev => prev + 1);
      
      const savedInstances = LogoIdManager.loadInstances();
      console.log('');
      console.log('✅ 4 logos created with ID tracking!');
      console.log(`📍 Top left: ${logo1Id} - reflow wordmark (black)`);
      console.log(`📍 Top right: ${logo2Id} - R lettermark (blue)`);  
      console.log(`📍 Bottom left: ${logo3Id} - Wave bars (gradient)`);
      console.log(`📍 Bottom right: ${logo4Id} - Hexagon (black)`);
      console.log('');
      console.log('💾 Saved to localStorage:', savedInstances);
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
    
    // Debug utility
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
    
    // Startup message
    setTimeout(() => {
      console.log('');
      console.log('🚀 REFLOW BRAND SYSTEM');
      console.log('════════════════════════');
      console.log('');
      console.log('🐛 Debug Toolbar: Look for the bug icon button in the bottom-right corner!');
      console.log('');
      console.log('Console Commands:');
      console.log('• window.initReflow() - Create wordmark');
      console.log('• window.reflowColor("black"|"blue"|"gradient") - Apply color');
      console.log('• window.load4Logos() - Load 4 logos with ID tracking');
      console.log('• window.listLogoIds() - List tracked logo IDs');
      console.log('• window.clearLogoIds() - Clear ID tracking');
      console.log('• window.debugLogos() - Debug current logo state');
    }, 1000);
    
  }, [mounted, selectedLogoId, updateCore, updateCustom]); // Add dependencies

  // Update URL with current parameters
  const updateURLParams = () => {
    if (!selectedLogo) return;
    
    const params = new URLSearchParams();
    
    if (selectedLogo.templateId) {
      params.set('template', selectedLogo.templateId);
    }
    
    if (customParams?.text) params.set('text', customParams.text);
    if (customParams?.letter) params.set('letter', customParams.letter);
    
    if (customParams?.fillColor && customParams.fillColor !== '#3b82f6') {
      params.set('fillColor', customParams.fillColor);
    }
    if (customParams?.strokeColor && customParams.strokeColor !== '#1e40af') {
      params.set('strokeColor', customParams.strokeColor);
    }
    if (customParams?.backgroundColor && customParams.backgroundColor !== '#ffffff') {
      params.set('backgroundColor', customParams.backgroundColor);
    }
    
    const newURL = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newURL);
  };

  const handleLoadShape = (shape: SavedShape) => {
    if (selectedLogoId) {
      updateSelectedLogoCode(shape.code)
      setCurrentShapeId(shape.id)
      setCurrentShapeName(shape.name)
      setForceRender(prev => prev + 1)
    }
  }

  const handleLoadLogo = (logo: SavedLogo) => {
    if (selectedLogoId) {
      // Update parameters from saved logo
      updateCore({
        frequency: logo.parameters.core.frequency,
        amplitude: logo.parameters.core.amplitude,
        complexity: logo.parameters.core.complexity,
        chaos: logo.parameters.core.chaos,
        damping: logo.parameters.core.damping,
        layers: logo.parameters.core.layers,
        radius: logo.parameters.core.radius
      });
      
      updateStyle({
        fillColor: logo.parameters.style.fillColor,
        strokeColor: logo.parameters.style.strokeColor,
        backgroundColor: logo.parameters.style.backgroundColor
      });
      
      if (logo.parameters.custom.barCount || logo.parameters.custom.barSpacing) {
        updateCustom({
          barCount: logo.parameters.custom.barCount,
          barSpacing: logo.parameters.custom.barSpacing
        });
      }
      
      if (logo.shape.id) setCurrentShapeId(logo.shape.id)
      
      setForceRender(prev => prev + 1)
    }
  }

  // Show loading state during SSR and initial hydration
  if (!mounted) return null

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-white flex flex-col">
      <StudioHeader />

      <div className="flex flex-1 overflow-hidden">
        <CanvasArea />

        <div className="flex">
          <ControlsPanel />
          
          <div className="w-80 border-l bg-white/50 backdrop-blur-sm overflow-y-auto">
            <div className="p-4 space-y-4">
              <AIBrandConsultant
                currentParams={customParams}
                onApplyRecommendation={handleApplyColorTheme}
              />
              <ColorThemeSelector
                currentIndustry={currentIndustry}
                currentParams={customParams}
                onApplyTheme={handleApplyColorTheme}
              />
              <TemplatePresetsPanel
                currentTemplate={selectedLogo?.templateId || 'custom'}
                currentParams={customParams}
                onApplyPreset={handleApplyTemplatePreset}
              />
              <AISuggestions
                currentIndustry={currentIndustry}
                currentPreset={selectedLogo?.templateId || 'custom'}
                currentParams={customParams}
                onApplySuggestion={handleApplyColorTheme}
              />
              <BrandPersonality
                currentParams={customParams}
                onApplyPersonality={handleApplyBrandPersonality}
              />
              <BrandPresetsPanel
                onApplyPreset={handleApplyBrandPreset}
                currentParams={customParams}
                currentPreset={selectedLogo?.templateId || 'custom'}
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
        code={selectedLogo?.code || ''}
        params={{
          seed: coreParams?.frequency.toString() || '',
          frequency: coreParams?.frequency || 4,
          amplitude: coreParams?.amplitude || 50,
          complexity: coreParams?.complexity || 0.5,
          chaos: coreParams?.chaos || 0,
          damping: coreParams?.damping || 0,
          layers: coreParams?.layers || 3,
          barCount: customParams?.barCount || 40,
          barSpacing: customParams?.barSpacing || 2,
          radius: coreParams?.radius || 50,
          color: styleParams?.fillColor || '#3b82f6'
        }}
      />

      <SavedItemsDialog
        open={savedItemsOpen}
        onOpenChange={setSavedItemsOpen}
        onLoadShape={handleLoadShape}
        onLoadLogo={handleLoadLogo}
      />
      
      {/* Debug overlay */}
      <DebugOverlay 
        reactLogos={logos}
        selectedLogoId={selectedLogoId}
        canvasOffset={
          typeof window !== 'undefined' && (window as any).getCanvasOffset
            ? (window as any).getCanvasOffset()
            : undefined
        }
        onClearCanvasPosition={() => {
          if (typeof window !== 'undefined' && (window as any).resetCanvasPosition) {
            (window as any).resetCanvasPosition();
          } else {
            console.warn('resetCanvasPosition function not available');
          }
        }}
      />
    </div>
  )
}