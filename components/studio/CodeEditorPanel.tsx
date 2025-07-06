'use client'

import React, { useState, useEffect } from 'react'
import { Editor } from '@monaco-editor/react'
import { X, Play, Pause, Maximize2, Minimize2 } from 'lucide-react'
import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo'
import { useLogoStore } from '@/lib/stores/logoStore'
import { useUIStore } from '@/lib/stores/uiStore'

interface CodeEditorPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function CodeEditorPanel({ isOpen, onClose }: CodeEditorPanelProps) {
  const { darkMode } = useUIStore()
  const selectedLogo = useSelectedLogo()
  const { updateLogo } = useLogoStore()
  
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  // Load template code when selected logo changes
  useEffect(() => {
    if (!selectedLogo || !isOpen) return
    
    setLoading(true)
    setError(null)
    
    // If logo has custom code, use that
    if (selectedLogo.code) {
      setCode(selectedLogo.code)
      setLoading(false)
      return
    }
    
    // Otherwise, load template code
    fetch(`/templates-js/${selectedLogo.templateId}.js`)
      .then(res => res.text())
      .then(jsCode => {
        // Extract the drawVisualization function
        const match = jsCode.match(/function drawVisualization[\s\S]*?(?=\n\nexport|$)/)
        if (match) {
          setCode(match[0])
        } else {
          setCode(`function drawVisualization(ctx, width, height, params, time, utils) {
  // Template code not found, starting with blank
  utils.applyUniversalBackground(ctx, width, height, params);
  
  // Your code here
}`)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load template:', err)
        setError('Failed to load template code')
        setLoading(false)
      })
  }, [selectedLogo, isOpen])
  
  const handleSaveCode = () => {
    if (!selectedLogo) return
    
    // Save custom code to the logo
    updateLogo(selectedLogo.id, { code })
  }
  
  if (!isOpen) return null
  
  return (
    <div className={`fixed inset-y-0 right-0 z-50 flex flex-col shadow-2xl transition-all duration-300 ${
      isFullscreen ? 'inset-x-0' : 'w-1/2 max-w-4xl'
    } ${darkMode ? 'bg-gray-900 border-l border-gray-800' : 'bg-white border-l border-gray-200'}`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${
        darkMode ? 'border-gray-800' : 'border-gray-200'
      }`}>
        <div className="flex items-center gap-3">
          <h2 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Code Editor
          </h2>
          {selectedLogo && (
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {selectedLogo.name || selectedLogo.templateId}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
              darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          
          <button
            onClick={onClose}
            className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
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
            onChange={(value) => setCode(value || '')}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              rulers: [],
              wordWrap: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        )}
      </div>
      
      {/* Footer */}
      <div className={`px-4 py-3 border-t flex items-center justify-between ${
        darkMode ? 'border-gray-800' : 'border-gray-200'
      }`}>
        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Press Cmd+S to save
        </div>
        
        <button
          onClick={handleSaveCode}
          className={`px-4 py-1.5 text-sm font-medium rounded transition-colors ${
            darkMode 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          Save Code
        </button>
      </div>
    </div>
  )
}