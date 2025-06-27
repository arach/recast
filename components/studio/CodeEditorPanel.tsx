'use client'

import React from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { Button } from '@/components/ui/button'
import {
  Play,
  Save,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Preset {
  name: string
  mode: 'wave' | 'bars' | 'wavebars' | 'circles'
  params: any
}

interface CodeEditorPanelProps {
  collapsed: boolean
  onSetCollapsed: (collapsed: boolean) => void
  presets: Preset[]
  onLoadPreset: (preset: Preset) => void
  visualMode: string
  currentShapeName: string
  onSetCurrentShapeName: (name: string) => void
  currentShapeId?: string
  codeError: string | null
  code: string
  onCodeChange: (code: string) => void
  isDarkMode: boolean
  isRendering: boolean
  renderSuccess: boolean
  onRunCode: () => void
  onSaveShape: () => void
  onCloneToCustom: () => void
  getShapeNameForMode: () => string
}

export function CodeEditorPanel({
  collapsed,
  onSetCollapsed,
  presets,
  onLoadPreset,
  visualMode,
  currentShapeName,
  onSetCurrentShapeName,
  currentShapeId,
  codeError,
  code,
  onCodeChange,
  isDarkMode,
  isRendering,
  renderSuccess,
  onRunCode,
  onSaveShape,
  onCloneToCustom,
  getShapeNameForMode
}: CodeEditorPanelProps) {
  if (collapsed) {
    return (
      <div className="w-12 border-r border-gray-200 bg-gray-50/30 transition-all duration-300 flex flex-col overflow-hidden">
        <div className="p-3 border-b border-gray-200 bg-white">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onSetCollapsed(false)}
            className="w-full h-8 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn(
      "w-1/4 border-r border-gray-200 bg-gray-50/30 transition-all duration-300 flex flex-col overflow-hidden"
    )}>
      {/* Quick Presets Dropdown - Above Code Editor */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-gray-600">Try a preset:</span>
            <select
              onChange={(e) => {
                const presetIndex = parseInt(e.target.value)
                if (presetIndex >= 0) {
                  onLoadPreset(presets[presetIndex])
                }
                e.target.value = '' // Reset dropdown
              }}
              className="text-xs px-2 py-1 border border-gray-300 rounded-md bg-white"
              defaultValue=""
            >
              <option value="" disabled>Choose preset...</option>
              {presets.map((preset, index) => (
                <option key={index} value={index}>
                  {preset.name}
                </option>
              ))}
            </select>
          </div>
          <span className="text-xs text-gray-400">or customize below</span>
        </div>
      </div>

      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              {visualMode === 'custom' ? (
                <input
                  type="text"
                  value={currentShapeName}
                  onChange={(e) => onSetCurrentShapeName(e.target.value)}
                  className="text-sm font-medium text-gray-900 bg-transparent border-b border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:outline-none px-1 py-0.5"
                  placeholder="Shape name..."
                />
              ) : (
                <h3 className="font-medium text-gray-900 text-sm flex items-center gap-2">
                  {getShapeNameForMode()}
                  <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    Built-in
                  </span>
                </h3>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {visualMode === 'custom' ? 
                currentShapeId ? 'Editing saved shape' : 'Edit your custom visualization' : 
                'View-only mode'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {/* Run Code Button - Always Visible */}
            <Button
              onClick={onRunCode}
              disabled={isRendering}
              size="sm"
              className={`h-8 text-xs font-medium transition-colors ${
                renderSuccess ? 'bg-green-600 hover:bg-green-700 text-white' : ''
              }`}
              title="Force refresh when changes don't apply automatically (Ctrl+Enter)"
            >
              {isRendering ? (
                <>
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-1" />
                  Rendering
                </>
              ) : renderSuccess ? (
                <>
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Rendered!
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 mr-1" />
                  Run Code
                </>
              )}
            </Button>
            
            {/* Save Button - Only in Custom Mode */}
            {visualMode === 'custom' && (
              <Button
                size="sm"
                onClick={onSaveShape}
                variant="outline"
                className="h-8 text-xs"
                title="Save your custom shape"
              >
                <Save className="w-3 h-3 mr-1" />
                Save
              </Button>
            )}
            
            {visualMode !== 'custom' && (
              <Button
                size="sm"
                onClick={onCloneToCustom}
                variant="outline"
                className="h-8 text-xs"
              >
                Clone & Edit
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => onSetCollapsed(true)}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {codeError && (
          <div className="mx-4 mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            Error: {codeError}
          </div>
        )}
        <CodeMirror
          value={code}
          height="100%"
          theme={isDarkMode ? oneDark : undefined}
          extensions={[javascript()]}
          onChange={(value) => {
            if (visualMode === 'custom') {
              onCodeChange(value)
            }
          }}
          editable={visualMode === 'custom'}
        />
      </div>
    </div>
  )
}