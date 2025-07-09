'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';

interface ParameterEditorProps {
  parameters: any;
  onChange: (parameters: any) => void;
  templateId?: string;
  className?: string;
}

export default function ParameterEditor({ 
  parameters, 
  onChange, 
  templateId,
  className = '' 
}: ParameterEditorProps) {
  const [editorValue, setEditorValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Convert parameters to formatted JSON string
  useEffect(() => {
    try {
      // Handle undefined or null parameters
      const safeParameters = parameters || {};
      const formatted = JSON.stringify(safeParameters, null, 2);
      setEditorValue(formatted);
      setError(null);
    } catch (err) {
      console.error('Parameter formatting error:', err);
      setError('Failed to format parameters');
      setEditorValue('{}');
    }
  }, [parameters]);

  // Handle editor changes with validation
  const handleEditorChange = useCallback((value: string | undefined) => {
    if (!value) return;
    
    setEditorValue(value);
    
    try {
      const parsed = JSON.parse(value);
      setError(null);
      onChange(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON');
    }
  }, [onChange]);

  // Configure Monaco editor
  const editorOptions = {
    minimap: { enabled: false },
    lineNumbers: 'on' as const,
    glyphMargin: false,
    folding: true,
    lineDecorationsWidth: 0,
    lineNumbersMinChars: 3,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: 2,
    insertSpaces: true,
    wordWrap: 'on' as const,
    wrappingIndent: 'indent' as const,
    fontSize: 13,
    fontFamily: "'Geist Mono', 'JetBrains Mono', 'IBM Plex Mono', 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace",
    theme: 'vs-dark',
    bracketPairColorization: { enabled: true },
    suggest: {
      showKeywords: false,
      showSnippets: false
    },
    quickSuggestions: false,
    parameterHints: { enabled: false },
    hover: { enabled: true },
    contextmenu: true,
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: 'line' as const,
    automaticLayout: true,
    scrollbar: {
      vertical: 'visible' as const,
      horizontal: 'visible' as const,
      verticalScrollbarSize: 10,
      horizontalScrollbarSize: 10,
      useShadows: false,
      handleMouseWheel: true,
      alwaysConsumeMouseWheel: false
    }
  };

  // Custom Monaco theme configuration
  const beforeMount = (monaco: any) => {
    monaco.editor.defineTheme('reflow-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'string.key.json', foreground: '9CDCFE' },
        { token: 'string.value.json', foreground: 'CE9178' },
        { token: 'number.json', foreground: 'B5CEA8' },
        { token: 'keyword.json', foreground: 'D4D4D4' },
        { token: 'delimiter.bracket.json', foreground: '569CD6' },
        { token: 'delimiter.colon.json', foreground: 'D4D4D4' },
        { token: 'delimiter.comma.json', foreground: 'D4D4D4' }
      ],
      colors: {
        'editor.background': '#0a0a0a',
        'editor.foreground': '#d4d4d4',
        'editor.lineHighlightBackground': '#ffffff08',
        'editor.selectionBackground': '#ffffff20',
        'editor.inactiveSelectionBackground': '#ffffff10',
        'editorLineNumber.foreground': '#ffffff30',
        'editorLineNumber.activeForeground': '#ffffff60',
        'editorCursor.foreground': '#ffffff',
        'editor.findMatchBackground': '#515c6a',
        'editor.findMatchHighlightBackground': '#ea5c0055',
        'editor.linkedEditingBackground': '#f00'
      }
    });
  };

  return (
    <div className={`bg-white/5 rounded border border-white/10 flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <span className="text-white/60 font-semibold font-mono text-xs">
            {templateId ? `${templateId} parameters` : 'Parameters'}
          </span>
          {error && (
            <span className="text-red-400 font-semibold font-mono text-xs">
              ⚠ {error}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-white font-mono text-[11px]">
            {editorValue.split('\n').length} lines
          </span>
        </div>
      </div>
      
      {/* Monaco Editor */}
      <div className="flex-1 w-full" style={{ minHeight: '400px' }}>
        <Editor
          height="100%"
          defaultLanguage="json"
          value={editorValue}
          options={editorOptions}
          onChange={handleEditorChange}
          beforeMount={beforeMount}
          theme="reflow-dark"
        />
      </div>
      
      {/* Footer with shortcuts */}
      <div className="px-4 py-2 border-t border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between">
          <span className="text-white/60 font-semibold font-mono text-[10px]">
            Ctrl+Z: Undo • Ctrl+Shift+F: Format • Ctrl+A: Select All
          </span>
          <div className="flex items-center space-x-2">
            {!error && (
              <span className="text-green-400 font-mono text-[11px]">
                ✓ Valid JSON
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}