'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { StudioHeader } from '@/components/studio/StudioHeader'
import { CanvasArea } from '@/components/studio/CanvasArea'
import { LeftSidebar } from '@/components/studio/LeftSidebar'
import { ToolsContainer } from '@/components/studio/tools/ToolsContainer'
import { Dialogs } from '@/components/studio/Dialogs'
import { DebugOverlay } from '@/components/debug/DebugOverlay'

// Hooks
import { useLogoStore } from '@/lib/stores/logoStore'
import { useUIStore } from '@/lib/stores/uiStore'
import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo'
import { useURLParameters } from '@/lib/hooks/useURLParameters'
import { usePageEffects } from '@/lib/hooks/usePageEffects'
import { useLogoHandlers } from '@/lib/hooks/useLogoHandlers'
import { useDialogState } from '@/lib/hooks/useDialogState'
import { useRunCodeShortcut } from '@/lib/hooks/useKeyboardShortcuts'
import { useDebugAction } from '@/lib/debug/useDebugAction'

// Services
import { ThemeLoader } from '@/lib/services/themeLoader'
import { stateTracer } from '@/lib/debug/stateUpdateTracer'
import { SavedShape, SavedLogo } from '@/lib/storage'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [forceRender, setForceRender] = useState(0)
  
  // Store state - only access what React needs
  const { selectedLogoId } = useLogoStore()
  const { darkMode } = useUIStore()
  
  // Selected logo utilities
  const selectedLogoUtils = useSelectedLogo()
  const { 
    logo: selectedLogo,
    coreParams,
    styleParams,
    customParams,
    updateCore,
    updateStyle,
    updateCustom,
    updateSelectedLogoCode
  } = selectedLogoUtils
  
  // Dialog state
  const dialogState = useDialogState()
  
  // Handlers
  const logoHandlers = useLogoHandlers({ 
    onForceRender: () => setForceRender(prev => prev + 1) 
  })
  
  // URL parameters
  useURLParameters({
    onTemplateLoad: logoHandlers.loadThemeById
  })
  
  // Page effects (theme detection, dev utilities)
  usePageEffects({
    onRunCode: () => setForceRender(prev => prev + 1),
    updateCore,
    updateCustom,
    loadThemeById: logoHandlers.loadThemeById,
    forceRender: () => setForceRender(prev => prev + 1)
  })
  
  // Keyboard shortcuts
  useRunCodeShortcut(() => setForceRender(prev => prev + 1), mounted)
  
  // Dialog handlers
  const handleLoadShape = useCallback((shape: SavedShape) => {
    updateSelectedLogoCode(shape.code)
    dialogState.setCurrentShapeId(shape.id)
    dialogState.setCurrentShapeName(shape.name)
    setForceRender(prev => prev + 1)
  }, [updateSelectedLogoCode, dialogState])
  
  const handleLoadLogo = useCallback((logo: SavedLogo) => {
    if (selectedLogoId) {
      updateCore({
        frequency: logo.parameters.core.frequency,
        amplitude: logo.parameters.core.amplitude,
        complexity: logo.parameters.core.complexity,
        chaos: logo.parameters.core.chaos,
        damping: logo.parameters.core.damping,
        layers: logo.parameters.core.layers,
        radius: logo.parameters.core.radius
      })
      
      updateStyle({
        fillColor: logo.parameters.style.fillColor,
        strokeColor: logo.parameters.style.strokeColor,
        backgroundColor: logo.parameters.style.backgroundColor
      })
      
      if (logo.parameters.custom.barCount || logo.parameters.custom.barSpacing) {
        updateCustom({
          barCount: logo.parameters.custom.barCount,
          barSpacing: logo.parameters.custom.barSpacing
        })
      }
      
      if (logo.shape.id) dialogState.setCurrentShapeId(logo.shape.id)
      
      setForceRender(prev => prev + 1)
    }
  }, [selectedLogoId, updateCore, updateStyle, updateCustom, dialogState])
  
  // Debug actions
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
      id: 'load-4-logos',
      label: 'Load 4 Brand Options',
      description: '2x2 grid',
      category: 'Reflow Brand',
      icon: '🎨',
      handler: async () => {
        const { BrandPresets } = await import('@/lib/presets/brandPresets')
        await BrandPresets.create4LogoGrid(() => setForceRender(prev => prev + 1))
      }
    },
    {
      id: 'init-reflow',
      label: 'Create Reflow Wordmark',
      description: 'Brand logo',
      category: 'Reflow Brand',
      icon: '✨',
      handler: async () => {
        if ((window as any).initReflow) {
          await (window as any).initReflow()
        }
      }
    }
  ])
  
  // Mount effect
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) return null
  
  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-white flex flex-col">
      <StudioHeader />

      <div className="relative flex-1 overflow-hidden">
        {/* Canvas takes full space */}
        <CanvasArea />
        
        {/* Left sidebar overlays on the left */}
        <LeftSidebar />
        
        {/* Tools panel overlays on the right */}
        <ToolsContainer />
      </div>
      
      <Dialogs
        {...dialogState}
        selectedLogo={selectedLogo}
        coreParams={coreParams}
        styleParams={styleParams}
        customParams={customParams}
        onLoadShape={handleLoadShape}
        onLoadLogo={handleLoadLogo}
        onSelectTheme={(themeId, defaults, industryId) => {
          logoHandlers.handleIndustryThemeSelect(themeId, defaults)
          dialogState.setCurrentIndustry(industryId)
          dialogState.setShowIndustrySelector(false)
        }}
      />
      
      <DebugOverlay 
        selectedLogo={selectedLogo}
        selectedLogoId={selectedLogoId}
        canvasOffset={(() => {
          if (typeof window !== 'undefined') {
            const canvasStore = (window as any).canvasStore
            if (canvasStore) {
              return canvasStore.getState().offset
            }
          }
          return undefined
        })()}
        onClearCanvasPosition={() => {
          if (typeof window !== 'undefined') {
            const canvasStore = (window as any).canvasStore
            if (canvasStore) {
              canvasStore.getState().resetView()
            }
          }
        }}
      />
    </div>
  )
}