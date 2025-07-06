import React from 'react';
import { Code2 } from 'lucide-react';

interface EditorModeButtonProps {
  onClick: () => void;
}

export function EditorModeButton({ onClick }: EditorModeButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-md transition-colors"
      title="Open Code Editor"
    >
      <Code2 className="w-4 h-4" />
      <span>Code</span>
    </button>
  );
}