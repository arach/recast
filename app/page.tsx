'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { StudioHeader } from '@/components/studio/StudioHeader'
import { CanvasArea } from '@/components/studio/CanvasArea'
import { LeftSidebar } from '@/components/studio/LeftSidebar'
import { ToolsContainer } from '@/components/studio/tools/ToolsContainer'
import { Dialogs } from '@/components/studio/Dialogs'
import { DebugOverlay } from '@/components/debug/DebugOverlay'
import { CodeEditorPanel } from '@/components/studio/CodeEditorPanel'

// Hooks
import { useLogoStore } from '@/lib/stores/logoStore'
import { useUIStore } from '@/lib/stores/uiStore'
import { useTemplateStore } from '@/lib/stores/templateStore'
import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo'
import { useURLParameters } from '@/lib/hooks/useURLParameters'
import { usePageEffects } from '@/lib/hooks/usePageEffects'
import { useLogoHandlers } from '@/lib/hooks/useLogoHandlers'
import { useDialogState } from '@/lib/hooks/useDialogState'
import { useRunCodeShortcut } from '@/lib/hooks/useKeyboardShortcuts'
import { useDebugAction } from '@/lib/debug/useDebugAction'

// Services
import { stateTracer } from '@/lib/debug/stateUpdateTracer'
import { SavedShape, SavedLogo } from '@/lib/storage'
import { getCanvas } from '@/lib/api/canvas-api'
import type { Canvas } from '@/app/api/_lib/types'

interface PageProps {
  params?: Promise<{ canvasId: string }>
}

export default function Home({ params }: PageProps = {}) {
  const [mounted, setMounted] = useState(false)
  const [forceRender, setForceRender] = useState(0)
  const [showCodeEditor, setShowCodeEditor] = useState(false)
  const [canvasId, setCanvasId] = useState<string | null>(null)
  const [loadingCanvas, setLoadingCanvas] = useState(false)
  
  // Store state - only access what React needs
  const { selectedLogoId, initializeLogos } = useLogoStore()
  const { darkMode } = useUIStore()
  const { applyTemplate } = useTemplateStore()
  
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
    onTemplateLoad: async (templateId: string) => {
      if (selectedLogoId) {
        await applyTemplate(selectedLogoId, templateId)
      }
    }
  })
  
  // Page effects (theme detection, dev utilities)
  usePageEffects({
    onRunCode: () => setForceRender(prev => prev + 1),
    updateCore,
    updateCustom,
    loadThemeById: async (templateId: string) => {
      if (selectedLogoId) {
        await applyTemplate(selectedLogoId, templateId)
      }
    },
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
  
  // Load canvas if ID provided
  useEffect(() => {
    async function loadCanvas() {
      if (!params) return
      
      try {
        const { canvasId: id } = await params
        if (!id) return // No canvas ID provided
        
        setCanvasId(id)
        setLoadingCanvas(true)
        
        const canvas = await getCanvas(id)
        
        // Convert API logos to app format
        const appLogos = canvas.logos.map(logo => ({
          id: logo.id,
          templateId: logo.templateId,
          parameters: {
            core: logo.parameters.core || {},
            style: logo.parameters.style || {},
            custom: logo.parameters.custom || logo.parameters,
          },
          position: logo.position,
          name: logo.metadata?.name || `Logo ${logo.id}`,
          createdAt: Date.now(),
        }))
        
        initializeLogos(appLogos)
        setLoadingCanvas(false)
      } catch (err) {
        console.error('Failed to load canvas:', err)
        setLoadingCanvas(false)
      }
    }
    
    loadCanvas()
  }, [params, initializeLogos])

  // Mount effect
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) return null
  
  if (loadingCanvas) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-gray-600">Loading canvas...</div>
      </div>
    )
  }
  
  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-white flex flex-col">
      <StudioHeader onToggleCodeEditor={() => setShowCodeEditor(!showCodeEditor)} />

      <div className="relative flex-1 overflow-hidden">
        {/* Canvas takes full space */}
        <CanvasArea />
        
        {/* Left sidebar overlays on the left */}
        <LeftSidebar />
        
        {/* Tools panel overlays on the right */}
        <ToolsContainer />
        
        {/* Code editor panel slides in from the right */}
        <CodeEditorPanel 
          isOpen={showCodeEditor} 
          onClose={() => setShowCodeEditor(false)} 
        />
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
          if (selectedLogoId) {
          applyTemplate(selectedLogoId, themeId).then(() => {
            updateCustom(defaults)
          })
        }
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