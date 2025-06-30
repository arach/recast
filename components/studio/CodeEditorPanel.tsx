'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Code, Play, Copy, Check, ChevronLeft, ChevronRight, GripVertical, X } from 'lucide-react'
import { useLogoStore } from '@/lib/stores/logoStore'
import { useUIStore } from '@/lib/stores/uiStore'
import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo'

// Simple syntax highlighting for JavaScript
function highlightCode(code: string): string {
  // Keywords
  code = code.replace(
    /\b(function|const|let|var|if|else|for|while|return|new|this|true|false|null|undefined)\b/g,
    '<span class="text-purple-600 font-medium">$1</span>'
  )
  
  // Strings
  code = code.replace(
    /('([^'\\]|\\.)*'|"([^"\\]|\\.)*")/g,
    '<span class="text-green-600">$1</span>'
  )
  
  // Comments
  code = code.replace(
    /(\/\/[^\n]*)/g,
    '<span class="text-gray-500 italic">$1</span>'
  )
  
  // Numbers
  code = code.replace(
    /\b(\d+(\.\d+)?)\b/g,
    '<span class="text-blue-600">$1</span>'
  )
  
  // Function names
  code = code.replace(
    /\b([a-zA-Z_]\w*)\s*\(/g,
    '<span class="text-blue-700">$1</span>('
  )
  
  // Objects/properties
  code = code.replace(
    /\.([a-zA-Z_]\w*)/g,
    '.<span class="text-indigo-600">$1</span>'
  )
  
  return code
}

export function CodeEditorPanel() {
  const { updateLogo } = useLogoStore()
  const { codeEditorCollapsed, toggleCodeEditor, setRenderTrigger } = useUIStore()
  const { logo } = useSelectedLogo()
  
  const [localCode, setLocalCode] = useState('')
  const [isCodeDirty, setIsCodeDirty] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)
  const [renderSuccess, setRenderSuccess] = useState(false)
  const [panelWidth, setPanelWidth] = useState(600)
  const [isResizing, setIsResizing] = useState(false)
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const highlightRef = useRef<HTMLDivElement>(null)
  
  // Initialize code from selected logo
  useEffect(() => {
    if (logo && logo.code !== localCode) {
      setLocalCode(logo.code)
      setIsCodeDirty(false)
    }
  }, [logo?.id, logo?.code, logo?.templateId])
  
  // Handle code change
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalCode(e.target.value)
    setIsCodeDirty(true)
    setRenderSuccess(false)
    
    // Sync scroll position with highlight layer
    if (highlightRef.current && editorRef.current) {
      highlightRef.current.scrollTop = editorRef.current.scrollTop
      highlightRef.current.scrollLeft = editorRef.current.scrollLeft
    }
  }
  
  // Sync scroll between textarea and highlight div
  const handleScroll = () => {
    if (highlightRef.current && editorRef.current) {
      highlightRef.current.scrollTop = editorRef.current.scrollTop
      highlightRef.current.scrollLeft = editorRef.current.scrollLeft
    }
  }
  
  // Run code and update logo
  const handleRunCode = useCallback(() => {
    if (!logo) return
    
    // Update the logo's code
    updateLogo(logo.id, { code: localCode })
    setIsCodeDirty(false)
    
    // Trigger a re-render in the canvas
    setRenderTrigger(Date.now())
    
    // Show success feedback
    setRenderSuccess(true)
    setTimeout(() => {
      setRenderSuccess(false)
    }, 1500)
  }, [logo, localCode, updateLogo, setRenderTrigger])
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Enter to run code
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && isCodeDirty) {
        e.preventDefault()
        handleRunCode()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleRunCode, isCodeDirty])
  
  // Copy code to clipboard
  const copyCode = () => {
    navigator.clipboard.writeText(localCode)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }
  
  // Clone to custom
  const handleCloneToCustom = () => {
    if (!logo) return
    
    // Create a new logo with the current code as custom
    const newId = useLogoStore.getState().addLogo('custom')
    const newLogo = useLogoStore.getState().logos.find(l => l.id === newId)
    if (newLogo) {
      updateLogo(newId, { 
        code: localCode,
        templateName: `${logo.templateName} (Clone)`
      })
    }
  }
  
  // Handle resize
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      // Calculate width from left edge plus initial offset
      const rect = document.querySelector('.canvas-container')?.getBoundingClientRect()
      const containerLeft = rect?.left || 0
      const newWidth = e.clientX - containerLeft - 24 // Account for left margin
      setPanelWidth(Math.max(400, Math.min(800, newWidth)))
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'ew-resize'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'auto'
    }
  }, [isResizing])
  
  if (!logo) {
    return (
      <div className="absolute top-6 left-6 z-40">
        <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-2 text-xs text-yellow-800">
          ⚠️ No logo selected
        </div>
      </div>
    )
  }
  
  // Collapsed overlay view
  if (codeEditorCollapsed) {
    return (
      <div className="absolute top-6 left-6 z-40 animate-in fade-in slide-in-from-left-2 duration-300">
        <Button
          onClick={toggleCodeEditor}
          variant="default"
          size="lg"
          className="shadow-lg hover:shadow-xl transition-all duration-200 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200"
        >
          <Code className="w-5 h-5 mr-2" />
          <span className="font-medium">Make it your own</span>
          <ChevronRight className="w-4 h-4 ml-2 opacity-60" />
        </Button>
        {isCodeDirty && (
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
        )}
      </div>
    )
  }

  // Expanded panel view - now as a floating overlay
  return (
    <div 
      className="absolute top-0 left-0 bottom-0 z-40 flex animate-in fade-in slide-in-from-left duration-300"
      style={{ 
        width: `${panelWidth}px`,
        maxWidth: 'calc(50vw - 48px)',
        transition: isResizing ? 'none' : 'width 300ms cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <div className="flex-1 bg-white shadow-2xl border-r border-gray-200 overflow-hidden flex flex-col">
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-gray-600" />
              <h3 className="font-semibold text-sm">Code Editor</h3>
              {isCodeDirty && (
                <span className="text-xs text-orange-600 font-medium animate-pulse">• Unsaved</span>
              )}
              {renderSuccess && (
                <span className="text-xs text-green-600 font-medium flex items-center gap-1 animate-in fade-in">
                  <Check className="w-3 h-3" /> Applied
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCodeEditor}
              className="h-7 w-7 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <Card className="flex-1 flex flex-col overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">
                  {logo.templateName || 'Custom'} Code
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyCode}
                    className="h-7 px-2"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3 h-3 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                  {logo.templateId !== 'custom' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCloneToCustom}
                      className="h-7 px-2 text-xs"
                    >
                      Clone to Custom
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-3 overflow-hidden">
              <div className="flex-1 relative overflow-hidden rounded-md border border-gray-200 bg-white">
                {/* Syntax highlighted preview */}
                <div
                  ref={highlightRef}
                  className="absolute inset-0 p-3 font-mono text-xs leading-relaxed overflow-auto pointer-events-none whitespace-pre-wrap break-words select-none"
                  style={{ tabSize: 2 }}
                  dangerouslySetInnerHTML={{ __html: highlightCode(localCode) }}
                />
                {/* Actual textarea */}
                <textarea
                  ref={editorRef}
                  value={localCode}
                  onChange={handleCodeChange}
                  onScroll={handleScroll}
                  className="relative w-full h-full p-3 font-mono text-xs bg-transparent caret-black resize-none focus:outline-none leading-relaxed"
                  spellCheck={false}
                  placeholder="// Enter your visualization code here..."
                  style={{
                    tabSize: 2,
                    caretColor: '#000',
                    color: 'transparent',
                    WebkitTextFillColor: 'transparent'
                  }}
                />
              </div>
              
              <div className="mt-3 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Press <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Cmd+Enter</kbd> to run
                </div>
                <Button
                  size="sm"
                  onClick={handleRunCode}
                  disabled={!isCodeDirty}
                  className="h-8 transition-all"
                >
                  <Play className="w-3 h-3 mr-1" />
                  Run Code
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-4 space-y-2">
            <details className="text-xs">
              <summary className="cursor-pointer text-gray-600 hover:text-gray-800 transition-colors">
                Available Variables & Functions
              </summary>
              <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md space-y-2">
                <div>
                  <div className="font-semibold text-gray-900">Context:</div>
                  <code className="text-blue-600 bg-blue-50 px-1 rounded">ctx</code> - Canvas 2D context<br />
                  <code className="text-blue-600 bg-blue-50 px-1 rounded">width, height</code> - Canvas dimensions<br />
                  <code className="text-blue-600 bg-blue-50 px-1 rounded">params</code> - All parameters<br />
                  <code className="text-blue-600 bg-blue-50 px-1 rounded">generator</code> - Wave generator instance<br />
                  <code className="text-blue-600 bg-blue-50 px-1 rounded">time</code> - Animation time
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Parameters:</div>
                  <code className="text-blue-600 bg-blue-50 px-1 rounded">params.frequency</code><br />
                  <code className="text-blue-600 bg-blue-50 px-1 rounded">params.amplitude</code><br />
                  <code className="text-blue-600 bg-blue-50 px-1 rounded">params.complexity</code><br />
                  <code className="text-blue-600 bg-blue-50 px-1 rounded">params.customParameters</code>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Main Function:</div>
                  <code className="text-purple-600 bg-purple-50 px-1 rounded text-xs">drawVisualization(ctx, width, height, params, generator, time)</code>
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
      
      {/* Resize handle on the right */}
      <div
        onMouseDown={handleMouseDown}
        className="w-1 bg-gray-300 hover:bg-blue-500 cursor-ew-resize transition-colors flex items-center justify-center group relative"
      >
        <GripVertical className="absolute w-4 h-4 text-gray-500 group-hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  )
}