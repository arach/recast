'use client'

import React, { useState } from 'react'
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
  Plus,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  MoreVertical,
  Folder,
  FolderOpen
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface LogoTreeItemProps {
  logo: any
  isSelected: boolean
  onSelect: (id: string) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
  onToggleVisibility: (id: string) => void
}

function LogoTreeItem({ 
  logo, 
  isSelected, 
  onSelect, 
  onDuplicate, 
  onDelete,
  onToggleVisibility 
}: LogoTreeItemProps) {
  const { darkMode } = useUIStore()
  const [showActions, setShowActions] = useState(false)
  const isVisible = logo.visible !== false // Default to visible
  
  // Determine platform icon based on logo metadata
  const getPlatformIcon = () => {
    if (logo.platform === 'ios') return <Smartphone className="w-3 h-3" />
    if (logo.platform === 'macos') return <Monitor className="w-3 h-3" />
    return <Globe className="w-3 h-3" />
  }
  
  return (
    <div 
      className="select-none"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
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
              : "hover:bg-gray-50 text-gray-700",
          !isVisible && "opacity-50"
        )}
      >
        {/* Platform Icon */}
        <div className="opacity-60">
          {getPlatformIcon()}
        </div>
        
        {/* Logo Name */}
        <span className="text-xs font-medium flex-1 truncate">
          {logo.templateName || `Logo ${logo.id}`}
        </span>
        
        {/* Visibility Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleVisibility(logo.id)
          }}
          className={cn(
            "w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 transition-opacity",
            showActions ? "opacity-100" : "opacity-0"
          )}
        >
          {isVisible ? (
            <Eye className="w-3 h-3" />
          ) : (
            <EyeOff className="w-3 h-3" />
          )}
        </button>
        
        {/* More Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 transition-opacity",
                showActions || isSelected ? "opacity-100" : "opacity-0"
              )}
            >
              <MoreVertical className="w-3 h-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onDuplicate(logo.id)}>
              <Copy className="w-3 h-3 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete(logo.id)}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="w-3 h-3 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

interface LogoGroupProps {
  name: string
  logos: any[]
  selectedLogoId: string | null
  onSelectLogo: (id: string) => void
  onDuplicateLogo: (id: string) => void
  onDeleteLogo: (id: string) => void
  onToggleVisibility: (id: string) => void
}

function LogoGroup({ 
  name, 
  logos, 
  selectedLogoId, 
  onSelectLogo, 
  onDuplicateLogo, 
  onDeleteLogo,
  onToggleVisibility 
}: LogoGroupProps) {
  const { darkMode } = useUIStore()
  const [isExpanded, setIsExpanded] = useState(true)
  
  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full flex items-center gap-1 px-2 py-1 rounded text-xs font-medium",
          darkMode
            ? "hover:bg-white/5 text-gray-400"
            : "hover:bg-gray-50 text-gray-600"
        )}
      >
        {isExpanded ? (
          <FolderOpen className="w-3 h-3" />
        ) : (
          <Folder className="w-3 h-3" />
        )}
        <span className="flex-1 text-left">{name}</span>
        <span className="opacity-50">({logos.length})</span>
      </button>
      
      {isExpanded && (
        <div className="ml-2">
          {logos.map((logo) => (
            <LogoTreeItem
              key={logo.id}
              logo={logo}
              isSelected={logo.id === selectedLogoId}
              onSelect={onSelectLogo}
              onDuplicate={onDuplicateLogo}
              onDelete={onDeleteLogo}
              onToggleVisibility={onToggleVisibility}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function LogoTreeModule() {
  const { 
    logos, 
    selectedLogoId, 
    setSelectedLogoId, 
    addLogo, 
    duplicateLogo, 
    deleteLogo,
    updateLogo,
    getLogoCount
  } = useLogoStore()
  const { darkMode } = useUIStore()
  
  const handleToggleVisibility = (logoId: string) => {
    const logo = logos.find(l => l.id === logoId)
    if (logo) {
      updateLogo(logoId, { visible: logo.visible === false })
    }
  }
  
  const handleDelete = (logoId: string) => {
    if (getLogoCount() > 1) {
      deleteLogo(logoId)
    }
  }
  
  // Group logos by platform or other criteria
  const groupedLogos = React.useMemo(() => {
    // For now, just show all logos in one group
    // Later we can group by platform, project, etc.
    return {
      all: logos
    }
  }, [logos])
  
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
            {/* Single group for now */}
            {logos.map((logo) => (
              <LogoTreeItem
                key={logo.id}
                logo={logo}
                isSelected={logo.id === selectedLogoId}
                onSelect={setSelectedLogoId}
                onDuplicate={duplicateLogo}
                onDelete={handleDelete}
                onToggleVisibility={handleToggleVisibility}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Stats */}
      {logos.length > 0 && (
        <div className="text-xs text-gray-500 dark:text-gray-500 px-2 flex justify-between">
          <span>{logos.length} logo{logos.length !== 1 ? 's' : ''}</span>
          <span>{logos.filter(l => l.visible !== false).length} visible</span>
        </div>
      )}
    </div>
  )
}