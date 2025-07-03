'use client';

import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolItemProps {
  id: string;
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  darkMode?: boolean;
}

export function ToolItem({ 
  id, 
  title, 
  icon, 
  expanded, 
  onToggle, 
  children,
  darkMode = false
}: ToolItemProps) {
  return (
    <div className={cn(
      "rounded-lg border overflow-hidden",
      darkMode 
        ? "bg-zinc-800 border-white/10" 
        : "bg-white border-gray-200 shadow-sm"
    )}>
      {/* Tool Header */}
      <button
        onClick={onToggle}
        className={cn(
          "w-full px-3 py-2 flex items-center gap-2 text-sm font-medium",
          "transition-colors text-left",
          darkMode 
            ? "hover:bg-zinc-700/50" 
            : "hover:bg-gray-50",
          darkMode
            ? "focus:ring-blue-500/50"
            : "focus:ring-blue-500/20",
          "focus:outline-none focus:ring-2 focus:ring-inset"
        )}
      >
        {expanded ? (
          <ChevronDown className={cn(
            "h-4 w-4",
            darkMode ? "text-gray-400" : "text-gray-500"
          )} />
        ) : (
          <ChevronRight className={cn(
            "h-4 w-4",
            darkMode ? "text-gray-400" : "text-gray-500"
          )} />
        )}
        
        {icon && (
          <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
            {React.createElement(icon, { className: "h-4 w-4" })}
          </span>
        )}
        
        <span className={cn(
          "flex-1",
          darkMode ? "text-gray-300" : "text-gray-700"
        )}>{title}</span>
      </button>

      {/* Tool Content */}
      {expanded && (
        <div className={cn(
          "border-t",
          darkMode ? "border-white/10" : "border-gray-200"
        )}>
          <div className={cn(
            "p-3",
            darkMode ? "" : "bg-gray-50"
          )}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}