'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Code, Play, Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLogoStore } from '@/lib/stores/logoStore'
import { useUIStore } from '@/lib/stores/uiStore'
import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo'

export function CodeEditorPanel() {
  const { updateLogo } = useLogoStore()
  const { codeEditorCollapsed, toggleCodeEditor, setRenderTrigger } = useUIStore()
  const logo = useSelectedLogo()
  
  const [localCode, setLocalCode] = useState('')
  const [isCodeDirty, setIsCodeDirty] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)
  const [renderSuccess, setRenderSuccess] = useState(false)
  
  // Initialize code from selected logo
  useEffect(() => {
    if (logo && logo.code !== localCode) {
      setLocalCode(logo.code)
      setIsCodeDirty(false)
    }
  }, [logo?.id, logo?.code])
  
  // Handle code change
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalCode(e.target.value)
    setIsCodeDirty(true)
    setRenderSuccess(false)
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
  
  if (!logo) {
    return (
      <div className={`${codeEditorCollapsed ? 'w-12' : 'w-[500px]'} border-l bg-gray-50/50 transition-all duration-300`}>
        <div className="p-4">
          <div className="text-sm text-gray-500">No logo selected</div>
        </div>
      </div>
    )
  }
  
  return (
    <div className={`${codeEditorCollapsed ? 'w-12' : 'w-[500px]'} border-l bg-gray-50/50 transition-all duration-300 flex flex-col`}>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-gray-600" />
            <h3 className="font-semibold text-sm">Code Editor</h3>
            {isCodeDirty && !codeEditorCollapsed && (
              <span className="text-xs text-orange-600 font-medium">• Unsaved</span>
            )}
            {renderSuccess && !codeEditorCollapsed && (
              <span className="text-xs text-green-600 font-medium flex items-center gap-1">
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
            {codeEditorCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
        
        {!codeEditorCollapsed && (
          <>
            <Card className="flex-1 flex flex-col">
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
              <CardContent className="flex-1 flex flex-col p-3">
                <div className="flex-1 relative">
                  <textarea
                    value={localCode}
                    onChange={handleCodeChange}
                    className="w-full h-full p-3 font-mono text-xs bg-gray-900 text-gray-100 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    spellCheck={false}
                    placeholder="// Enter your visualization code here..."
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
                    className="h-8"
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Run Code
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-4 space-y-2">
              <details className="text-xs">
                <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                  Available Variables & Functions
                </summary>
                <div className="mt-2 p-3 bg-gray-100 rounded-md space-y-2">
                  <div>
                    <div className="font-semibold">Context:</div>
                    <code className="text-gray-700">ctx</code> - Canvas 2D context<br />
                    <code className="text-gray-700">width, height</code> - Canvas dimensions<br />
                    <code className="text-gray-700">params</code> - All parameters<br />
                    <code className="text-gray-700">generator</code> - Wave generator instance<br />
                    <code className="text-gray-700">time</code> - Animation time
                  </div>
                  <div>
                    <div className="font-semibold">Parameters:</div>
                    <code className="text-gray-700">params.frequency</code><br />
                    <code className="text-gray-700">params.amplitude</code><br />
                    <code className="text-gray-700">params.complexity</code><br />
                    <code className="text-gray-700">params.customParameters</code>
                  </div>
                  <div>
                    <div className="font-semibold">Main Function:</div>
                    <code className="text-gray-700">drawVisualization(ctx, width, height, params, generator, time)</code>
                  </div>
                </div>
              </details>
            </div>
          </>
        )}
      </div>
    </div>
  )
}