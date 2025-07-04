'use client'

import React from 'react'
import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo'
import { useUIStore } from '@/lib/stores/uiStore'
import { cn } from '@/lib/utils'
import { 
  Info, 
  Hash, 
  Palette, 
  Monitor,
  Smartphone,
  Globe,
  Package,
  Maximize2
} from 'lucide-react'

export function LogoMetadataModule() {
  const { logo: selectedLogo } = useSelectedLogo()
  const { darkMode } = useUIStore()

  if (!selectedLogo) {
    return (
      <div className={cn(
        "text-center py-6 px-4 rounded-lg",
        darkMode ? "bg-zinc-800/50 text-gray-500" : "bg-gray-100 text-gray-500"
      )}>
        <Info className="w-6 h-6 mx-auto mb-2 opacity-50" />
        <p className="text-xs">No logo selected</p>
        <p className="text-xs mt-1 opacity-70">Select a logo to view details</p>
      </div>
    )
  }

  // Determine platform/destination
  const getDestination = () => {
    // This could be extended based on logo metadata
    const platform = selectedLogo.platform || 'web'
    const icons = {
      web: <Globe className="w-3 h-3" />,
      ios: <Smartphone className="w-3 h-3" />,
      macos: <Monitor className="w-3 h-3" />,
      android: <Smartphone className="w-3 h-3" />
    }
    return {
      icon: icons[platform] || icons.web,
      label: platform.charAt(0).toUpperCase() + platform.slice(1)
    }
  }

  const destination = getDestination()

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400">
        <Info className="w-3.5 h-3.5" />
        <span>Logo Details</span>
      </div>

      {/* Metadata Card */}
      <div className={cn(
        "rounded-lg border p-3 space-y-2.5",
        darkMode 
          ? "bg-zinc-800/50 border-zinc-700" 
          : "bg-white border-gray-200"
      )}>
        {/* ID */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Hash className="w-3 h-3" />
            <span>ID</span>
          </div>
          <span className="font-mono text-gray-700 dark:text-gray-300">
            {selectedLogo.id}
          </span>
        </div>

        {/* Template */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Palette className="w-3 h-3" />
            <span>Template</span>
          </div>
          <span className="text-gray-700 dark:text-gray-300">
            {selectedLogo.templateName || 'Custom'}
          </span>
        </div>

        {/* Destination/Platform */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            {destination.icon}
            <span>Destination</span>
          </div>
          <span className="text-gray-700 dark:text-gray-300">
            {destination.label}
          </span>
        </div>

        {/* Format/Export */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Package className="w-3 h-3" />
            <span>Format</span>
          </div>
          <span className="text-gray-700 dark:text-gray-300">
            {selectedLogo.exportFormat || 'SVG'}
          </span>
        </div>

        {/* Size */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Maximize2 className="w-3 h-3" />
            <span>Size</span>
          </div>
          <span className="font-mono text-gray-700 dark:text-gray-300">
            {selectedLogo.parameters?.core?.size || 200}px
          </span>
        </div>
      </div>

      {/* Position Info */}
      <div className={cn(
        "text-xs rounded-lg border p-2.5",
        darkMode 
          ? "bg-zinc-900/30 border-zinc-800" 
          : "bg-gray-50 border-gray-200"
      )}>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 dark:text-gray-400">Canvas Position</span>
          <span className="font-mono text-gray-600 dark:text-gray-300">
            x: {Math.round(selectedLogo.position?.x || 0)}, 
            y: {Math.round(selectedLogo.position?.y || 0)}
          </span>
        </div>
      </div>

      {/* Additional Metadata (if any) */}
      {selectedLogo.metadata && Object.keys(selectedLogo.metadata).length > 0 && (
        <div className={cn(
          "text-xs rounded-lg border p-2.5 space-y-1.5",
          darkMode 
            ? "bg-zinc-900/30 border-zinc-800" 
            : "bg-gray-50 border-gray-200"
        )}>
          <div className="text-gray-500 dark:text-gray-400 mb-1">Additional Info</div>
          {Object.entries(selectedLogo.metadata).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <span className="text-gray-600 dark:text-gray-300">
                {String(value)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}