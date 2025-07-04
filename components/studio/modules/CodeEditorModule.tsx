'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Play, Copy, Check, RotateCcw, Code } from 'lucide-react'
import { useLogoStore } from '@/lib/stores/logoStore'
import { useUIStore } from '@/lib/stores/uiStore'
import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo'
import { visualizationTypes } from '@/lib/monaco-types'
import type { editor } from 'monaco-editor'

// Dynamically import Monaco to avoid SSR issues
const MonacoEditor = dynamic(
  () => import('@monaco-editor/react').then((mod) => mod.default),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-32 text-gray-500">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mb-2"></div>
          <p className="text-xs">Loading editor...</p>
        </div>
      </div>
    )
  }
)

export function CodeEditorModule() {
  const [copied, setCopied] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  
  const { selectedLogo, updateSelectedLogoCode } = useSelectedLogo()
  const darkMode = useUIStore(state => state.darkMode)
  
  const [localCode, setLocalCode] = useState(selectedLogo?.code || '')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

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
    
    // Set up keyboard shortcuts
    editor.addCommand(
      2051, // KeyMod.CtrlCmd | KeyCode.Enter
      () => handleRunCode()
    )
    
    editor.addCommand(
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

  if (!selectedLogo) {
    return (
      <div className={`text-center py-8 px-4 rounded-lg ${
        darkMode ? 'bg-zinc-800/50 text-gray-500' : 'bg-gray-100 text-gray-500'
      }`}>
        <Code className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No logo selected</p>
        <p className="text-xs mt-1">Select a logo to edit its code</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <span className="text-xs text-orange-500 font-medium">• Unsaved</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleReset}
            disabled={!hasUnsavedChanges}
            className="h-7 px-2"
            title="Reset changes"
          >
            <RotateCcw className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="h-7 px-2"
            title="Copy code"
          >
            {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
          </Button>
          <Button
            size="sm"
            onClick={handleRunCode}
            disabled={!hasUnsavedChanges}
            className="h-7"
            title="Run code (Ctrl+Enter)"
          >
            <Play className="w-3 h-3 mr-1" />
            Run
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className={`px-3 py-2 rounded-lg text-xs ${
          darkMode 
            ? 'bg-red-900/20 border border-red-800 text-red-400' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {errorMessage}
        </div>
      )}
      
      {/* Monaco Editor */}
      <div className="rounded-lg overflow-hidden border" style={{ height: '400px' }}>
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
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8
            }
          }}
        />
      </div>
      
      {/* Status Bar */}
      <div className={`px-3 py-2 rounded-lg text-xs flex items-center justify-between ${
        darkMode 
          ? 'bg-gray-800 text-gray-400' 
          : 'bg-gray-100 text-gray-600'
      }`}>
        <div>
          JavaScript • {localCode.split('\n').length} lines
        </div>
        <div className="flex items-center gap-2">
          <kbd className={`px-1.5 py-0.5 rounded text-xs ${
            darkMode ? 'bg-gray-700' : 'bg-gray-200'
          }`}>⌘↵</kbd>
        </div>
      </div>
    </div>
  )
}