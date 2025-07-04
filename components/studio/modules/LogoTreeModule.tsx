'use client'

import React from 'react'
import { useLogoStore } from '@/lib/stores/logoStore'
import { useUIStore } from '@/lib/stores/uiStore'
import { cn } from '@/lib/utils'
import { 
  Layers, 
  Hash, 
  Globe, 
  Smartphone, 
  Monitor,
  ChevronRight,
  ChevronDown,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LogoTreeItemProps {
  logo: any
  isSelected: boolean
  onSelect: (id: string) => void
}

function LogoTreeItem({ logo, isSelected, onSelect }: LogoTreeItemProps) {
  const { darkMode } = useUIStore()
  const [isExpanded, setIsExpanded] = React.useState(true)
  
  // Determine platform icon based on logo metadata
  const getPlatformIcon = () => {
    // This could be extended based on logo metadata
    if (logo.platform === 'ios') return <Smartphone className="w-3 h-3" />
    if (logo.platform === 'macos') return <Monitor className="w-3 h-3" />
    return <Globe className="w-3 h-3" />
  }
  
  return (
    <div className="select-none">
      <div
        onClick={() => onSelect(logo.id)}
        className={cn(
          "flex items-center gap-1 px-2 py-1.5 rounded cursor-pointer group transition-colors",
          isSelected
            ? darkMode 
              ? "bg-blue-600/20 text-blue-400"
              : "bg-blue-50 text-blue-600"
            : darkMode
              ? "hover:bg-white/5 text-gray-300"
              : "hover:bg-gray-50 text-gray-700"
        )}
      >
        {/* Expand/Collapse for future child items */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsExpanded(!isExpanded)
          }}
          className={cn(
            "w-4 h-4 flex items-center justify-center rounded hover:bg-white/10",
            "opacity-0" // Hidden for now since we don't have child items yet
          )}
        >
          {isExpanded ? (
            <ChevronDown className="w-3 h-3" />
          ) : (
            <ChevronRight className="w-3 h-3" />
          )}
        </button>
        
        {/* Platform Icon */}
        <div className="opacity-60">
          {getPlatformIcon()}
        </div>
        
        {/* Logo Name */}
        <span className="text-xs font-medium flex-1 truncate">
          {logo.templateName || `Logo ${logo.id}`}
        </span>
        
        {/* Selected Indicator */}
        {isSelected && (
          <div className={cn(
            "w-1.5 h-1.5 rounded-full",
            darkMode ? "bg-blue-400" : "bg-blue-600"
          )} />
        )}
      </div>
      
      {/* Future: Child items (variants, sizes, etc.) */}
      {isExpanded && logo.children && (
        <div className="ml-6">
          {/* Child items would go here */}
        </div>
      )}
    </div>
  )
}

export function LogoTreeModule() {
  const { logos, selectedLogoId, setSelectedLogoId, addLogo } = useLogoStore()
  const { darkMode } = useUIStore()
  
  return (
    <div className="space-y-2">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <Layers className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
            Logos
          </span>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => addLogo()}
          className="h-6 w-6 p-0"
          title="Add new logo"
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>
      
      {/* Logo Tree */}
      <div className={cn(
        "rounded-md border overflow-hidden",
        darkMode ? "border-zinc-800 bg-zinc-900/50" : "border-gray-200 bg-gray-50/50"
      )}>
        {logos.length === 0 ? (
          <div className="px-3 py-4 text-center">
            <p className="text-xs text-gray-500">No logos yet</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => addLogo()}
              className="mt-2 h-7 text-xs"
            >
              <Plus className="w-3 h-3 mr-1" />
              Create Logo
            </Button>
          </div>
        ) : (
          <div className="py-1">
            {logos.map((logo) => (
              <LogoTreeItem
                key={logo.id}
                logo={logo}
                isSelected={logo.id === selectedLogoId}
                onSelect={setSelectedLogoId}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Count */}
      {logos.length > 0 && (
        <div className="text-xs text-gray-500 dark:text-gray-500 text-center">
          {logos.length} logo{logos.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}