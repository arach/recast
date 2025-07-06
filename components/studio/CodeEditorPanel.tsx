'use client'

import React, { useState, useEffect } from 'react'
import { Editor } from '@monaco-editor/react'
import { X, Play, Save, Maximize2, Minimize2, Code, RefreshCw } from 'lucide-react'
import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo'
import { useLogoStore } from '@/lib/stores/logoStore'
import { useUIStore } from '@/lib/stores/uiStore'
import { useTemplateStore } from '@/lib/stores/templateStore'

interface CodeEditorPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function CodeEditorPanel({ isOpen, onClose }: CodeEditorPanelProps) {
  const { darkMode } = useUIStore()
  const selectedLogoData = useSelectedLogo()
  const { updateLogo, selectedLogoId, logos } = useLogoStore()
  const { getTemplate } = useTemplateStore()
  
  const selectedLogo = selectedLogoData.selectedLogo
  
  const [code, setCode] = useState('')
  const [originalCode, setOriginalCode] = useState('') // Store original template code
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  
  // Load template code when selected logo changes
  useEffect(() => {
    console.log('CodeEditor: useEffect triggered:', {
      isOpen,
      selectedLogoId,
      selectedLogo: selectedLogo ? {
        id: selectedLogo.id,
        templateId: selectedLogo.templateId,
        hasCustomCode: !!selectedLogo.code
      } : null,
      totalLogos: logos.length
    })
    
    if (!selectedLogo || !isOpen) return
    
    setLoading(true)
    setError(null)
    
    // If logo has custom code, use that
    if (selectedLogo.code) {
      setCode(selectedLogo.code)
      setOriginalCode(selectedLogo.code) // Custom code becomes the "original"
      setHasUnsavedChanges(false)
      setLoading(false)
      return
    }
    
    // Load the template code for the current logo's template
    if (!selectedLogo.templateId) {
      // No template ID - this logo might be using custom code only
      const blankCode = `function drawVisualization(ctx, width, height, params, time, utils) {
  // Setup template with background and parameter extraction
  const p = utils.setupTemplate(ctx, width, height, params);
  
  // Your custom drawing code here
  // Access parameters via p.paramName or p.theme.fillColor
  
}`
      setCode(blankCode)
      setOriginalCode(blankCode)
      setHasUnsavedChanges(false)
      setLoading(false)
      return
    }
    
    // Load the actual template code that this logo is using
    const templateUrl = `/templates-js/${selectedLogo.templateId}.js`
    console.log('CodeEditor: Fetching template from:', templateUrl)
    
    fetch(templateUrl)
      .then(res => {
        console.log('CodeEditor: Template fetch response:', res.status, res.ok)
        if (!res.ok) {
          throw new Error(`Template not found: ${selectedLogo.templateId}`)
        }
        return res.text()
      })
      .then(jsCode => {
        // Extract the draw function and rename it to drawVisualization
        console.log('CodeEditor: Raw template JS code length:', jsCode.length)
        const match = jsCode.match(/function draw\s*\([^)]*\)\s*\{[\s\S]*\}/)
        console.log('CodeEditor: Regex match found:', !!match)
        
        let templateCode
        if (match) {
          // Rename the function from 'draw' to 'drawVisualization' for consistency
          templateCode = match[0].replace(/function draw\s*\(/, 'function drawVisualization(')
        } else {
          templateCode = `function drawVisualization(ctx, width, height, params, time, utils) {
  // Setup template with background and parameter extraction
  const p = utils.setupTemplate(ctx, width, height, params);
  
  // Your custom drawing code here
  // Access parameters via p.paramName or p.theme.fillColor
  
}`
        }
        
        console.log('CodeEditor: Final template code length:', templateCode.length)
        setOriginalCode(templateCode)
        setCode(templateCode)
        setHasUnsavedChanges(false)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load template:', err)
        setError(`Failed to load template code for "${selectedLogo.templateId}"`)
        setLoading(false)
      })
  }, [selectedLogo, isOpen])
  
  // Handle code changes
  const handleCodeChange = (newCode: string | undefined) => {
    const codeValue = newCode || ''
    setCode(codeValue)
    setHasUnsavedChanges(codeValue !== originalCode)
  }

  // Run code temporarily (preview changes without saving)
  const handleRunCode = async () => {
    if (!selectedLogo) return
    
    setIsRunning(true)
    try {
      // Temporarily apply the code to see changes
      updateLogo(selectedLogo.id, { code })
      
      // Force a re-render to show the changes
      const { setRenderTrigger } = useUIStore.getState()
      setRenderTrigger(Date.now())
      
      // Wait a bit for the render, then revert if not saved
      setTimeout(() => {
        setIsRunning(false)
      }, 100)
    } catch (err) {
      console.error('Failed to run code:', err)
      setIsRunning(false)
    }
  }

  // Save code permanently
  const handleSaveCode = () => {
    if (!selectedLogo) return
    
    // Save custom code to the logo permanently
    updateLogo(selectedLogo.id, { code })
    setOriginalCode(code)
    setHasUnsavedChanges(false)
  }

  // Reset to original template code
  const handleResetCode = () => {
    setCode(originalCode)
    setHasUnsavedChanges(false)
    // Apply original code back to logo
    if (selectedLogo) {
      updateLogo(selectedLogo.id, { code: originalCode })
    }
  }

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === 's') {
          e.preventDefault()
          if (hasUnsavedChanges) {
            handleSaveCode()
          }
        } else if (e.key === 'Enter') {
          e.preventDefault()
          handleRunCode()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, hasUnsavedChanges])
  
  if (!isOpen) return null
  
  return (
    <div className={`fixed inset-y-0 right-0 z-50 flex flex-col shadow-2xl transition-all duration-300 ${
      isFullscreen ? 'inset-x-0' : 'w-1/2 max-w-4xl'
    } ${darkMode ? 'bg-gray-900 border-l border-gray-800' : 'bg-white border-l border-gray-200'}`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-6 py-4 border-b ${
        darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Code className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Code Editor
            </h2>
          </div>
          {selectedLogo && (
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                darkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
              }`}>
                Copy of {selectedLogo.templateId || 'Custom'}
              </span>
              {hasUnsavedChanges && (
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  darkMode ? 'bg-amber-900 text-amber-200' : 'bg-amber-100 text-amber-800'
                }`}>
                  Modified
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
              darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          
          <button
            onClick={onClose}
            className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
              darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Editor */}
      <div className="flex-1 relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Loading template code...
            </div>
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-red-500">{error}</div>
          </div>
        ) : (
          <Editor
            height="100%"
            defaultLanguage="javascript"
            theme={darkMode ? 'vs-dark' : 'light'}
            value={code}
            onChange={handleCodeChange}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              rulers: [],
              wordWrap: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
              cursorBlinking: 'smooth',
              renderWhitespace: 'boundary',
              smoothScrolling: true,
            }}
          />
        )}
      </div>
      
      {/* Footer - Amazing Control Bar */}
      <div className={`px-6 py-4 border-t ${
        darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="flex items-center justify-between">
          {/* Left side - Status and info */}
          <div className="flex items-center gap-4">
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {hasUnsavedChanges ? (
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                  Unsaved changes
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Up to date
                </span>
              )}
            </div>
            
            {selectedLogo?.templateId && (
              <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Editing copy of <span className="font-mono">{selectedLogo.templateId}</span>
              </div>
            )}
          </div>

          {/* Right side - Action buttons */}
          <div className="flex items-center gap-3">
            {hasUnsavedChanges && (
              <button
                onClick={handleResetCode}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  darkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
                title="Reset to original template"
              >
                <RefreshCw className="w-4 h-4" />
                Reset
              </button>
            )}

            <button
              onClick={handleRunCode}
              disabled={isRunning}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                isRunning
                  ? darkMode
                    ? 'bg-green-700 text-green-100'
                    : 'bg-green-600 text-green-100'
                  : darkMode 
                    ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20' 
                    : 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20'
              }`}
              title="Run code to preview changes (Cmd+Enter)"
            >
              <Play className={`w-4 h-4 ${isRunning ? 'animate-pulse' : ''}`} />
              {isRunning ? 'Running...' : 'Run Code'}
            </button>

            <button
              onClick={handleSaveCode}
              disabled={!hasUnsavedChanges}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                hasUnsavedChanges
                  ? darkMode 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20'
                  : darkMode
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              title="Save changes permanently (Cmd+S)"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}