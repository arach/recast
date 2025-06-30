'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Download,
  FileText,
  Settings,
  Share,
  Shuffle,
  Copy,
  FolderOpen,
  Sparkles,
  Package,
} from 'lucide-react'
import RecastLogo from '@/components/ReCast'
import { useUIStore } from '@/lib/stores/uiStore'
import { useLogoStore } from '@/lib/stores/logoStore'
import { useExportStore } from '@/lib/stores/exportStore'
import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo'
import { exportCanvasAsPNG } from '@/lib/export-utils'
import { generateWaveBars, executeCustomCode, VisualizationParams } from '@/lib/visualization-generators'

export function StudioHeader() {
  const { toggleSavedItems, toggleSaveDialog, toggleIndustryModal } = useUIStore()
  const { logos, selectedLogoId, updateLogo, randomizeLogo } = useLogoStore()
  const logo = useSelectedLogo()
  
  // Export functions
  const exportAsPNG = async (size?: number, filename?: string) => {
    if (!logo) {
      console.error('No logo selected')
      alert('Please select a logo to export')
      return
    }
    
    try {
      // Create a canvas with the logo
      const logoCanvas = document.createElement('canvas')
      const targetSize = size || 600
      logoCanvas.width = targetSize
      logoCanvas.height = targetSize
      const ctx = logoCanvas.getContext('2d')
      
      if (!ctx) {
        throw new Error('Failed to get canvas context')
      }
      
      // Clear canvas with white background
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, targetSize, targetSize)
      
      // Execute the visualization code
      try {
        const execParams: VisualizationParams = {
          seed: logo.id,
          frequency: logo.parameters.core.frequency,
          amplitude: logo.parameters.core.amplitude,
          complexity: logo.parameters.core.complexity,
          chaos: logo.parameters.core.chaos,
          damping: logo.parameters.core.damping,
          layers: logo.parameters.core.layers,
          barCount: logo.parameters.custom.barCount || 60,
          barSpacing: logo.parameters.custom.barSpacing || 2,
          radius: logo.parameters.core.radius,
          color: logo.parameters.style.fillColor,
          fillColor: logo.parameters.style.fillColor,
          strokeColor: logo.parameters.style.strokeColor,
          backgroundColor: logo.parameters.style.backgroundColor,
          customParameters: logo.parameters.custom,
          time: 0 // Static frame for export
        }
        
        // Try custom code first
        if (logo.code && logo.code.trim()) {
          const result = executeCustomCode(ctx, targetSize, targetSize, execParams, logo.code)
          if (!result.success) {
            console.error('Custom code execution failed:', result.error)
            // Fall back to default visualization
            generateWaveBars(ctx, targetSize, targetSize, execParams)
          }
        } else {
          // No custom code, use default visualization
          generateWaveBars(ctx, targetSize, targetSize, execParams)
        }
      } catch (error) {
        console.error('Visualization generation failed:', error)
        // Fall back to default visualization
        const execParams: VisualizationParams = {
          seed: logo.id,
          frequency: logo.parameters.core.frequency,
          amplitude: logo.parameters.core.amplitude,
          complexity: logo.parameters.core.complexity,
          chaos: logo.parameters.core.chaos,
          damping: logo.parameters.core.damping,
          layers: logo.parameters.core.layers,
          barCount: logo.parameters.custom.barCount || 60,
          barSpacing: logo.parameters.custom.barSpacing || 2,
          radius: logo.parameters.core.radius,
          color: logo.parameters.style.fillColor,
          fillColor: logo.parameters.style.fillColor,
          strokeColor: logo.parameters.style.strokeColor,
          backgroundColor: logo.parameters.style.backgroundColor,
          customParameters: logo.parameters.custom,
          time: 0
        }
        generateWaveBars(ctx, targetSize, targetSize, execParams)
      }
      
      const defaultFilename = filename || `recast-${logo.templateName || 'logo'}${size ? `-${size}x${size}` : ''}.png`
      await exportCanvasAsPNG(logoCanvas, defaultFilename)
      console.log('PNG exported successfully')
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    }
  }
  
  const exportAllSizes = async () => {
    if (!logo) {
      console.error('No logo selected')
      alert('Please select a logo to export')
      return
    }
    
    try {
      console.log('Starting export of all sizes...')
      
      const sizes = [16, 32, 64, 128, 256, 512, 1024]
      const templateName = logo.templateName || 'logo'
      const baseFilename = `recast-${templateName.toLowerCase().replace(/\s+/g, '-')}`
      
      for (const size of sizes) {
        await exportAsPNG(size, `${baseFilename}-${size}x${size}.png`)
        // Small delay between exports
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      console.log('All sizes exported successfully')
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed. Please try again.')
    }
  }
  
  const exportAsSVG = () => {
    // TODO: Implement SVG export
    alert('SVG export coming soon!')
  }
  
  const shareLink = () => {
    // TODO: Implement share functionality
    const url = new URL(window.location.href)
    url.searchParams.set('template', logo?.templateId || '')
    // Add parameters to URL
    navigator.clipboard.writeText(url.toString())
    alert('Share link copied to clipboard!')
  }
  
  const randomizeParams = () => {
    if (selectedLogoId) {
      randomizeLogo(selectedLogoId)
    }
  }
  
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
            onClick={toggleSavedItems}
            className="h-9"
          >
            <FolderOpen className="w-4 h-4 mr-2" />
            Library
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleIndustryModal}
            className="h-9 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border-blue-200"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Industry Presets
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={randomizeParams}
            className="h-9"
          >
            <Shuffle className="w-4 h-4 mr-2" />
            Randomize
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => toggleSaveDialog()}
            className="h-9"
          >
            <Settings className="w-4 h-4 mr-2" />
            Save Preset
          </Button>

          {logo?.templateId === 'custom' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSaveDialog()}
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
            onClick={shareLink}
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
                <DropdownMenuItem onClick={exportAllSizes} className="font-semibold">
                  <Download className="w-4 h-4 mr-2" />
                  Export All Sizes
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => exportAsPNG()}>
                  Original (600×600)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportAsPNG(1024)}>
                  Large (1024×1024)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportAsPNG(512)}>
                  Medium (512×512)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportAsPNG(256)}>
                  Small (256×256)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportAsPNG(128)}>
                  Icon (128×128)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportAsPNG(64)}>
                  Tiny (64×64)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportAsPNG(32)}>
                  Favicon (32×32)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportAsPNG(16)}>
                  Micro (16×16)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="sm"
              onClick={exportAsSVG}
              className="h-9"
            >
              <FileText className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}