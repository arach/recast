'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Download,
  Copy,
  Shuffle,
  Settings,
  Package,
  FolderOpen,
  Sparkles
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import RecastLogo from '@/components/ReCast'

interface StudioHeaderProps {
  onRandomize: () => void
  onSavePreset: () => void
  onSaveShape: () => void
  onOpenLibrary: () => void
  onOpenIndustrySelector: () => void
  onShare: () => void
  onExportPNG: (size?: number) => void
  onExportAllSizes: () => void
  onExportSVG: () => void
  visualMode: string
}

export function StudioHeader({
  onRandomize,
  onSavePreset,
  onSaveShape,
  onOpenLibrary,
  onOpenIndustrySelector,
  onShare,
  onExportPNG,
  onExportAllSizes,
  onExportSVG,
  visualMode
}: StudioHeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur-xl flex-shrink-0">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <RecastLogo width={48} height={48} animated={false} />
            <div>
              <h1 className="text-xl font-semibold text-gray-900 tracking-tight">ReCast</h1>
              <p className="text-xs text-gray-500 -mt-0.5">
                Programmatic logo generation through mathematical waves
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onOpenLibrary}
            className="h-9"
          >
            <FolderOpen className="w-4 h-4 mr-2" />
            Library
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onOpenIndustrySelector}
            className="h-9 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-blue-200"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Industry Presets
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onRandomize}
            className="h-9"
          >
            <Shuffle className="w-4 h-4 mr-2" />
            Randomize
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onSavePreset}
            className="h-9"
          >
            <Settings className="w-4 h-4 mr-2" />
            Save Preset
          </Button>

          {visualMode === 'custom' && (
            <Button
              variant="outline"
              size="sm"
              onClick={onSaveShape}
              className="h-9"
            >
              <Package className="w-4 h-4 mr-2" />
              Save Shape
            </Button>
          )}

          <div className="h-6 w-px bg-gray-200" />

          <Button
            variant="outline"
            size="sm"
            onClick={onShare}
            className="h-9"
          >
            <Copy className="w-4 h-4 mr-2" />
            Share
          </Button>

          <div className="flex space-x-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  className="h-9"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export PNG
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onExportAllSizes} className="font-semibold">
                  <Download className="w-4 h-4 mr-2" />
                  Export All Sizes
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onExportPNG()}>
                  Original (600×600)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExportPNG(1024)}>
                  Large (1024×1024)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExportPNG(512)}>
                  Medium (512×512)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExportPNG(256)}>
                  Small (256×256)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExportPNG(128)}>
                  Icon (128×128)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onExportPNG(64)}>
                  Favicon (64×64)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              size="sm"
              variant="outline"
              onClick={onExportSVG}
              className="h-9"
            >
              SVG
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}