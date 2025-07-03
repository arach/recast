'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface StateTreeProps {
  data: any;
  name: string;
  depth?: number;
  maxDepth?: number;
  collapseLargeArrays?: boolean;
  hideKeys?: string[];
  expandedPaths?: Set<string>;
  onExpandedChange?: (path: string, expanded: boolean) => void;
  path?: string;
}

export function StateTreeView({ 
  data, 
  name, 
  depth = 0, 
  maxDepth = 10,
  collapseLargeArrays = true,
  hideKeys = ['code', 'handler', 'ref', '_ref'],
  expandedPaths,
  onExpandedChange,
  path = ''
}: StateTreeProps) {
  const currentPath = path ? `${path}.${name}` : name;
  const isControlled = expandedPaths !== undefined;
  const [localExpanded, setLocalExpanded] = useState(depth < 2);
  const expanded = isControlled ? expandedPaths.has(currentPath) : localExpanded;
  
  const setExpanded = (value: boolean) => {
    if (isControlled && onExpandedChange) {
      onExpandedChange(currentPath, value);
    } else {
      setLocalExpanded(value);
    }
  };
  
  // Determine value type and color
  const getValueDisplay = (value: any): { display: JSX.Element; isExpandable: boolean } => {
    if (value === null) return { display: <span className="text-gray-500">null</span>, isExpandable: false };
    if (value === undefined) return { display: <span className="text-gray-500">undefined</span>, isExpandable: false };
    
    const type = typeof value;
    
    if (type === 'boolean') {
      return { display: <span className="text-blue-400">{value.toString()}</span>, isExpandable: false };
    }
    
    if (type === 'number') {
      return { display: <span className="text-green-400">{value}</span>, isExpandable: false };
    }
    
    if (type === 'string') {
      // Truncate long strings
      const displayStr = value.length > 100 ? value.substring(0, 100) + '...' : value;
      // Check if it might be code
      const looksLikeCode = value.includes('function') || value.includes('=>') || value.includes('const ');
      if (looksLikeCode && value.length > 50) {
        return { display: <span className="text-gray-500 italic">[Code: {value.length} chars]</span>, isExpandable: false };
      }
      return { display: <span className="text-yellow-400">"{displayStr}"</span>, isExpandable: false };
    }
    
    if (type === 'function') {
      const funcName = value.name || 'anonymous';
      return { display: <span className="text-purple-400 italic">[Function: {funcName}]</span>, isExpandable: false };
    }
    
    if (Array.isArray(value)) {
      const itemCount = value.length;
      const preview = itemCount === 0 ? '[]' : `[${itemCount} items]`;
      return { 
        display: <span className="text-gray-400">{preview}</span>, 
        isExpandable: itemCount > 0 && depth < maxDepth
      };
    }
    
    if (type === 'object') {
      const keys = Object.keys(value);
      const keyCount = keys.length;
      const preview = keyCount === 0 ? '{}' : `{${keyCount} keys}`;
      return { 
        display: <span className="text-gray-400">{preview}</span>, 
        isExpandable: keyCount > 0 && depth < maxDepth
      };
    }
    
    return { display: <span className="text-gray-400">{String(value)}</span>, isExpandable: false };
  };
  
  const { display, isExpandable } = getValueDisplay(data);
  
  // Skip hidden keys
  if (hideKeys.includes(name)) {
    return (
      <div className="ml-4 text-gray-500 italic text-[11px]">
        <span className="text-cyan-400">{name}:</span> [hidden]
      </div>
    );
  }
  
  // For large arrays, show a summary instead
  if (Array.isArray(data) && collapseLargeArrays && data.length > 10 && !expanded) {
    return (
      <div className="ml-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 hover:bg-white/5 rounded px-1 -ml-1"
        >
          <ChevronRight className="w-3 h-3 text-gray-500" />
          <span className="text-cyan-400">{name}:</span>
          <span className="text-orange-400">[Large Array: {data.length} items]</span>
        </button>
      </div>
    );
  }
  
  if (!isExpandable) {
    return (
      <div className="ml-4 text-[11px]">
        <span className="text-cyan-400">{name}:</span> {display}
      </div>
    );
  }
  
  return (
    <div className="ml-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 hover:bg-white/5 rounded px-1 -ml-1 text-[11px]"
      >
        {expanded ? (
          <ChevronDown className="w-3 h-3 text-gray-500" />
        ) : (
          <ChevronRight className="w-3 h-3 text-gray-500" />
        )}
        <span className="text-cyan-400">{name}:</span>
        {!expanded && display}
      </button>
      
      {expanded && (
        <div className="ml-2 border-l border-gray-700/50 pl-2">
          {Array.isArray(data) ? (
            data.map((item, index) => (
              <StateTreeView
                key={index}
                name={String(index)}
                data={item}
                depth={depth + 1}
                maxDepth={maxDepth}
                collapseLargeArrays={collapseLargeArrays}
                hideKeys={hideKeys}
                expandedPaths={expandedPaths}
                onExpandedChange={onExpandedChange}
                path={currentPath}
              />
            ))
          ) : (
            Object.entries(data).map(([key, value]) => (
              <StateTreeView
                key={key}
                name={key}
                data={value}
                depth={depth + 1}
                maxDepth={maxDepth}
                collapseLargeArrays={collapseLargeArrays}
                hideKeys={hideKeys}
                expandedPaths={expandedPaths}
                onExpandedChange={onExpandedChange}
                path={currentPath}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}