'use client'

import React, { useRef, useEffect } from 'react'
import Editor, { Monaco } from '@monaco-editor/react'
import { editor } from 'monaco-editor'

interface MonacoCodeEditorProps {
  value: string
  onChange: (value: string) => void
  onRunCode?: () => void
  height?: string
  theme?: 'vs-dark' | 'vs' | 'hc-black'
}

export function MonacoCodeEditor({ 
  value, 
  onChange, 
  onRunCode,
  height = '100%',
  theme = 'vs'
}: MonacoCodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)

  // Handle editor mount
  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor

    // Add keyboard shortcut for running code
    if (onRunCode) {
      editor.addAction({
        id: 'run-code',
        label: 'Run Code',
        keybindings: [
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter
        ],
        run: () => {
          onRunCode()
        }
      })
    }

    // Configure editor options
    editor.updateOptions({
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      fontSize: 13,
      lineNumbers: 'on',
      renderWhitespace: 'selection',
      suggestOnTriggerCharacters: true,
      quickSuggestions: {
        other: true,
        comments: false,
        strings: true
      },
      parameterHints: {
        enabled: true
      },
      folding: true,
      foldingStrategy: 'indentation',
      showFoldingControls: 'mouseover',
      formatOnPaste: true,
      formatOnType: true,
      automaticLayout: true
    })

    // Focus the editor
    editor.focus()
  }

  // Configure Monaco before mount
  const handleBeforeMount = (monaco: Monaco) => {
    // Register custom theme if needed
    monaco.editor.defineTheme('recast-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6B7280', fontStyle: 'italic' },
        { token: 'keyword', foreground: '8B5CF6' },
        { token: 'string', foreground: '10B981' },
        { token: 'number', foreground: '3B82F6' },
        { token: 'function', foreground: '2563EB' },
        { token: 'variable', foreground: '1F2937' },
        { token: 'type', foreground: 'EC4899' }
      ],
      colors: {
        'editor.background': '#FFFFFF',
        'editor.foreground': '#1F2937',
        'editor.lineHighlightBackground': '#F3F4F6',
        'editorCursor.foreground': '#1F2937',
        'editor.selectionBackground': '#DBEAFE',
        'editor.inactiveSelectionBackground': '#E5E7EB'
      }
    })

    // Configure JavaScript language defaults
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false
    })

    // Add type definitions for the visualization API
    monaco.languages.typescript.javascriptDefaults.addExtraLib(
      `
      interface VisualizationParams {
        seed: string;
        frequency: number;
        amplitude: number;
        complexity: number;
        chaos: number;
        damping: number;
        layers: number;
        barCount?: number;
        barSpacing?: number;
        radius: number;
        fillColor: string;
        strokeColor: string;
        backgroundColor: string;
        customParameters: Record<string, any>;
        time: number;
        [key: string]: any;
      }

      interface WaveGenerator {
        generateWave(x: number, config: any): number;
        seed: string;
      }

      declare function drawVisualization(
        ctx: CanvasRenderingContext2D, 
        width: number, 
        height: number, 
        params: VisualizationParams, 
        generator: WaveGenerator, 
        time: number
      ): void;

      declare function applyUniversalBackground(
        ctx: CanvasRenderingContext2D, 
        width: number, 
        height: number, 
        controls: any
      ): void;

      declare function applyUniversalFill(
        ctx: CanvasRenderingContext2D, 
        bounds: any, 
        controls: any
      ): void;

      declare function applyUniversalStroke(
        ctx: CanvasRenderingContext2D, 
        controls: any
      ): void;

      declare function getBoundsFromPoints(points: Array<{x: number, y: number}>): {
        width: number;
        height: number;
        centerX: number;
        centerY: number;
        minX: number;
        maxX: number;
        minY: number;
        maxY: number;
      };

      declare const PARAMETERS: Record<string, any>;
      `,
      'ts:filename/visualization.d.ts'
    )

    // Configure compiler options
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      allowJs: true,
      typeRoots: ['node_modules/@types']
    })
  }

  return (
    <Editor
      height={height}
      defaultLanguage="javascript"
      value={value}
      onChange={(value) => onChange(value || '')}
      onMount={handleEditorDidMount}
      beforeMount={handleBeforeMount}
      theme={theme === 'vs' ? 'recast-light' : theme}
      options={{
        automaticLayout: true,
        minimap: { enabled: false }
      }}
    />
  )
}