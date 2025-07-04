'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Code, Play, Copy, Check, ChevronLeft, ChevronRight, GripVertical, X, RotateCcw, PanelLeftClose, PanelLeft, Palette, Save, Sparkles } from 'lucide-react'
import { useLogoStore } from '@/lib/stores/logoStore'
import { useUIStore } from '@/lib/stores/uiStore'
import { useCanvasStore } from '@/lib/stores/canvasStore'
import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo'
import { visualizationTypes } from '@/lib/monaco-types'
import { loadTemplate, getAllTemplateInfo } from '@/lib/template-registry-direct'
import type { LoadedTemplate } from '@/lib/theme-loader'
import type { editor, languages } from 'monaco-editor'

// Dynamically import Monaco to avoid SSR issues
const MonacoEditor = dynamic(
  () => import('@monaco-editor/react').then((mod) => mod.default),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full text-gray-500">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
          <p>Loading editor...</p>
        </div>
      </div>
    )
  }
)

interface CodeEditorPanelProps {
  onClose?: () => void
}

export function CodeEditorPanel({ onClose }: CodeEditorPanelProps) {
  const [copied, setCopied] = useState(false)
  const [width, setWidth] = useState(500)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isCollapsed, setIsCollapsed] = useState(true) // Start collapsed
  const [availableTemplates, setAvailableTemplates] = useState<LoadedTemplate[]>([])
  const [loadingTemplates, setLoadingTemplates] = useState(true)
  
  // Add CSS animations
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes slideInLeft {
        from {
          transform: translateX(-100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      .animate-slideInLeft {
        animation: slideInLeft 200ms ease-out;
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])
  
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const startWidth = useRef(0)
  
  const { selectedLogo, updateSelectedLogoCode } = useSelectedLogo()
  const darkMode = useUIStore(state => state.darkMode)
  const updateLogo = useLogoStore(state => state.updateLogo)
  const logos = useLogoStore(state => state.logos)
  const selectedLogoId = useLogoStore(state => state.selectedLogoId)
  const { setCodeEditorState } = useCanvasStore()
  
  const [localCode, setLocalCode] = useState(selectedLogo?.code || '')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Load available templates
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoadingTemplates(true)
        const templates = await getAllTemplateInfo()
        setAvailableTemplates(templates)
      } catch (error) {
        console.error('Failed to load templates:', error)
      } finally {
        setLoadingTemplates(false)
      }
    }
    loadTemplates()
  }, [])
  
  // Update canvas store when state changes
  useEffect(() => {
    setCodeEditorState(isCollapsed, width)
  }, [isCollapsed, width, setCodeEditorState])

  // Debug log
  // useEffect(() => {
  //   console.log('🎨 CodeEditorPanel state:', {
  //     isCollapsed,
  //     selectedLogoId: selectedLogo?.id,
  //     selectedLogoIdFromStore: selectedLogoId,
  //     logoFromHook: selectedLogo,
  //     darkMode,
  //     localCodeLength: localCode?.length,
  //     hasUnsavedChanges,
  //     templatesLoaded: availableTemplates.length
  //   })
  // }, [isCollapsed, selectedLogo?.id, selectedLogoId, darkMode, localCode, hasUnsavedChanges, availableTemplates.length])

  // Update local code when selected logo changes
  useEffect(() => {
    if (selectedLogo) {
      setLocalCode(selectedLogo.code)
      setHasUnsavedChanges(false)
    }
  }, [selectedLogo?.id])

  const handleEditorMount = (editor: editor.IStandaloneCodeEditor, monaco: typeof import('monaco-editor')) => {
    editorRef.current = editor
    
    // Add type definitions for better IntelliSense
    monaco.languages.typescript.javascriptDefaults.addExtraLib(
      visualizationTypes,
      'visualization.d.ts'
    )
    
    // Configure JavaScript language features
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      allowJs: true,
      typeRoots: ["node_modules/@types"]
    })
    
    // Focus the editor
    editor.focus()
    
    // Set up keyboard shortcuts
    editor.addCommand(
      // Ctrl/Cmd + Enter to run code
      2051, // KeyMod.CtrlCmd | KeyCode.Enter
      () => handleRunCode()
    )
    
    editor.addCommand(
      // Ctrl/Cmd + S to save (just runs the code)
      2065, // KeyMod.CtrlCmd | KeyCode.KEY_S
      () => handleRunCode()
    )
  }

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setLocalCode(value)
      setHasUnsavedChanges(value !== selectedLogo?.code)
      setErrorMessage(null)
    }
  }

  const handleRunCode = useCallback(() => {
    if (!selectedLogo) return
    
    try {
      // Basic validation - check if drawVisualization function exists
      if (!localCode.includes('function drawVisualization')) {
        throw new Error('Code must contain a drawVisualization function')
      }
      
      // Update the logo code
      updateSelectedLogoCode(localCode)
      setHasUnsavedChanges(false)
      setErrorMessage(null)
      
      // Force canvas re-render
      window.dispatchEvent(new Event('logo-updated'))
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Invalid code')
    }
  }, [localCode, selectedLogo, updateSelectedLogoCode])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(localCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleReset = () => {
    if (selectedLogo && selectedLogo.code !== localCode) {
      setLocalCode(selectedLogo.code)
      setHasUnsavedChanges(false)
      setErrorMessage(null)
    }
  }

  // Mouse event handlers for resizing
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    startX.current = e.clientX
    startWidth.current = width
    document.body.style.cursor = 'col-resize'
    e.preventDefault()
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return
      
      const diff = e.clientX - startX.current
      const newWidth = Math.max(400, Math.min(1200, startWidth.current + diff))
      setWidth(newWidth)
    }

    const handleMouseUp = () => {
      isDragging.current = false
      document.body.style.cursor = ''
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  const handlePrevLogo = () => {
    const currentIndex = logos.findIndex(l => l.id === selectedLogoId)
    if (currentIndex > 0) {
      useLogoStore.getState().setSelectedLogoId(logos[currentIndex - 1].id)
    }
  }

  const handleNextLogo = () => {
    const currentIndex = logos.findIndex(l => l.id === selectedLogoId)
    if (currentIndex < logos.length - 1) {
      useLogoStore.getState().setSelectedLogoId(logos[currentIndex + 1].id)
    }
  }

  const currentIndex = logos.findIndex(l => l.id === selectedLogoId)

  // Collapsed state - show a narrow sidebar
  if (isCollapsed) {
    return (
      <div 
        className={`absolute top-0 left-0 h-full flex flex-col cursor-pointer shadow-2xl ${
          darkMode ? 'bg-gray-900/95 border-r border-gray-800 hover:bg-gray-800/95' : 'bg-white/95 border-r border-gray-200 hover:bg-gray-50/95'
        } z-30 backdrop-blur-sm`}
        style={{ width: '40px' }}
        onClick={() => setIsCollapsed(false)}
        title="Expand code editor"
      >
        {/* Expand chevron tab */}
        <button
          className={`absolute -right-5 top-1/2 -translate-y-1/2 w-5 h-12 rounded-r-lg flex items-center justify-center transition-all duration-200 hover:h-20 hover:translate-x-1 ${
            darkMode 
              ? 'bg-zinc-800 hover:bg-zinc-700 text-gray-400 hover:text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
          } shadow-md`}
          title="Expand code editor"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        
        {/* Minimal content */}
        <div className="flex flex-col items-center pt-6 pb-4">
          <div className={`p-2 rounded-lg transition-transform duration-200 hover:scale-110 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <Code className="w-5 h-5" />
          </div>
          
          {/* Minimal unsaved indicator */}
          {selectedLogo && hasUnsavedChanges && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            </div>
          )}
        </div>
      </div>
    )
  }

  // If no logo selected and expanded, show a message
  if (!selectedLogo && !isCollapsed) {
    return (
      <div 
        className={`absolute top-0 left-0 h-full shadow-lg flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-white'} z-30 transition-all duration-300`}
        style={{ width: `${width}px` }}
      >
        <Card className={`h-full flex flex-col border-0 rounded-none ${darkMode ? 'bg-gray-900 text-gray-100' : ''}`}>
          <CardHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                <CardTitle className="text-lg">Code Editor</CardTitle>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsCollapsed(true)}
                className="h-8 w-8 p-0"
                title="Collapse editor"
              >
                <PanelLeftClose className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-sm">No logo selected</p>
              <p className="text-xs mt-2">Select a logo from the canvas to edit its code</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Expanded state - full panel
  console.log('🎨 Rendering expanded panel, selectedLogo:', selectedLogo?.id, 'localCode length:', localCode?.length)
  
  return (
    <div 
        className={`absolute top-0 left-0 h-full shadow-2xl flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-white'} z-30 animate-slideInLeft`}
        style={{ 
          width: `${width}px`
        }}
      >
      
      {/* Resize Handle - on the right side for left panel */}
      <div
        className={`absolute right-0 top-0 bottom-0 w-3 -mr-1 cursor-col-resize z-50 group ${
          darkMode ? 'hover:bg-blue-600/20' : 'hover:bg-blue-500/20'
        }`}
        onMouseDown={handleMouseDown}
      >
        <div className={`absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 transition-all ${
          darkMode ? 'bg-gray-700 group-hover:bg-blue-600' : 'bg-gray-200 group-hover:bg-blue-500'
        }`} />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
        </div>
      </div>
      
      {/* Collapse chevron tab - protruding from expanded state */}
      <button
        onClick={() => setIsCollapsed(true)}
        className={`absolute -right-5 top-1/2 -translate-y-1/2 w-5 h-12 rounded-r-lg flex items-center justify-center transition-all duration-200 hover:h-20 hover:translate-x-1 z-50 ${
          darkMode 
            ? 'bg-zinc-800 hover:bg-zinc-700 text-gray-400 hover:text-white' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
        } shadow-md`}
        title="Collapse code editor"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <Card className={`h-full flex flex-col border-0 rounded-none ${darkMode ? 'bg-gray-900 text-gray-100' : ''}`}>
        <CardHeader className="flex-shrink-0">
          {/* Template Selector */}
          <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Visual Styles
              </h3>
              <span className="text-xs text-gray-500">Choose a starting point</span>
            </div>
            <select
              value={selectedLogo?.templateId || 'custom'}
              onChange={async (e) => {
                const templateId = e.target.value
                // Get the current selected logo ID directly from store to avoid stale closures
                const currentSelectedLogoId = useLogoStore.getState().selectedLogoId
                const currentLogo = useLogoStore.getState().logos.find(l => l.id === currentSelectedLogoId)
                
                if (templateId && currentLogo && currentSelectedLogoId) {
                  const template = availableTemplates.find(t => t.id === templateId)
                  if (template) {
                    updateLogo(currentSelectedLogoId, {
                      templateId: template.id,
                      templateName: template.name,
                      // Don't store code - let the renderer look it up from the registry
                      parameters: {
                        ...currentLogo.parameters,
                        custom: {
                          ...currentLogo.parameters.custom,
                          ...template.defaultParams
                        }
                      }
                    })
                    // Still update local code for editing
                    setLocalCode(template.code)
                    setHasUnsavedChanges(false)
                  }
                }
              }}
              className={`w-full px-3 py-2 text-sm rounded-lg border ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 text-gray-100'
                  : 'bg-white border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              disabled={loadingTemplates}
            >
              <option value="custom">🎨 Custom Code</option>
              {availableTemplates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              <CardTitle className="text-lg">Code Editor</CardTitle>
              {hasUnsavedChanges && (
                <span className="text-xs text-orange-500 font-medium">• Unsaved</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* Logo Navigation */}
              {logos.length > 1 && (
                <div className="flex items-center gap-1 mr-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handlePrevLogo}
                    disabled={currentIndex === 0}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-xs text-gray-500 min-w-[3rem] text-center">
                    {currentIndex + 1} / {logos.length}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleNextLogo}
                    disabled={currentIndex === logos.length - 1}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
              
              {/* Action Buttons */}
              <Button
                size="sm"
                variant="ghost"
                onClick={handleReset}
                disabled={!hasUnsavedChanges}
                className="h-8 w-8 p-0"
                title="Reset changes"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopy}
                className="h-8 w-8 p-0"
                title="Copy code"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </Button>
              <Button
                size="sm"
                onClick={handleRunCode}
                disabled={!hasUnsavedChanges}
                className="h-8"
                title="Run code (Ctrl+Enter)"
              >
                <Play className="w-3 h-3 mr-1" />
                Run
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsCollapsed(true)}
                className="h-8 w-8 p-0"
                title="Collapse editor"
              >
                <PanelLeftClose className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 p-0 overflow-hidden">
          <div className="h-full flex flex-col">
            {/* Error Message */}
            {errorMessage && (
              <div className={`px-4 py-2 border-b text-sm ${
                darkMode 
                  ? 'bg-red-900/20 border-red-800 text-red-400' 
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                {errorMessage}
              </div>
            )}
            
            {/* Monaco Editor */}
            <div className="flex-1" style={{ minHeight: '400px' }}>
              <MonacoEditor
                value={localCode}
                onChange={handleCodeChange}
                onMount={handleEditorMount}
                language="javascript"
                theme={darkMode ? "vs-dark" : "vs"}
                height="100%"
                options={{
                  minimap: { enabled: false },
                  fontSize: 12,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  wordWrap: 'off',
                  automaticLayout: true,
                  tabSize: 2,
                  insertSpaces: true,
                  folding: true,
                  suggestOnTriggerCharacters: true,
                  quickSuggestions: {
                    other: true,
                    comments: false,
                    strings: false
                  },
                  parameterHints: {
                    enabled: true
                  },
                  suggestSelection: 'first',
                  tabCompletion: 'on',
                  wordBasedSuggestions: true,
                  contextmenu: true,
                  mouseWheelZoom: true,
                  formatOnPaste: true,
                  formatOnType: true,
                  scrollbar: {
                    verticalScrollbarSize: 10,
                    horizontalScrollbarSize: 10
                  }
                }}
              />
            </div>
            
            {/* Status Bar */}
            <div className={`px-4 py-2 border-t text-xs flex items-center justify-between ${
              darkMode 
                ? 'bg-gray-800 text-gray-400 border-gray-700' 
                : 'bg-gray-100 text-gray-600 border-gray-200'
            }`}>
              <div>
                JavaScript • {localCode.split('\n').length} lines
              </div>
              <div className="flex items-center gap-4">
                {hasUnsavedChanges && (
                  <span className={darkMode ? 'text-orange-400' : 'text-orange-600'}>Modified</span>
                )}
                <kbd className={`px-2 py-1 rounded text-xs ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}>Ctrl+Enter</kbd> to run
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}