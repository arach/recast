'use client'

import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Clipboard, Download, CopyPlus, Trash2 } from 'lucide-react'
import { useLogoStore } from '@/lib/stores/logoStore'
import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo'
import { generateLogoCanvas } from '@/lib/canvas/logoGenerator'

interface LogoActionsProps {
  className?: string
}

export function LogoActions({ className }: LogoActionsProps) {
  const { logos, selectedLogoId, duplicateLogo, deleteLogo } = useLogoStore()
  const { logo: selectedLogo } = useSelectedLogo()
  const [showCopyFeedback, setShowCopyFeedback] = useState(false)
  
  if (!selectedLogoId || !selectedLogo) return null
  
  const handleCopyImage = useCallback(async () => {
    try {
      const canvas = generateLogoCanvas(selectedLogo, 0) // Static frame
      
      canvas.toBlob(async (blob) => {
        if (blob && navigator.clipboard && navigator.clipboard.write) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ])
            setShowCopyFeedback(true)
            setTimeout(() => setShowCopyFeedback(false), 2000)
          } catch (err) {
            console.error('Failed to copy to clipboard:', err)
            handleDownload() // Fallback
          }
        }
      }, 'image/png')
    } catch (error) {
      console.error('Failed to copy logo:', error)
    }
  }, [selectedLogo])
  
  const handleDownload = useCallback(() => {
    const canvas = generateLogoCanvas(selectedLogo, 0)
    
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${selectedLogo.templateName || 'logo'}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    }, 'image/png')
  }, [selectedLogo])
  
  return (
    <>
      <div className={className}>
        <div className="bg-white/95 backdrop-blur-sm rounded-lg border shadow-lg p-1 flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopyImage}
            className="h-8 w-8 p-0"
            title="Copy image to clipboard"
          >
            <Clipboard className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDownload}
            className="h-8 w-8 p-0"
            title="Download as PNG"
          >
            <Download className="w-4 h-4" />
          </Button>
          <div className="h-4 w-px bg-gray-200 mx-1" />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => duplicateLogo(selectedLogoId)}
            className="h-8 w-8 p-0"
            title="Duplicate this logo"
          >
            <CopyPlus className="w-4 h-4" />
          </Button>
          {logos.length > 1 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                if (confirm('Delete this logo?')) {
                  deleteLogo(selectedLogoId)
                }
              }}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              title="Delete this logo"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Copy Feedback */}
      {showCopyFeedback && (
        <div className="absolute top-20 right-6 z-30 animate-in fade-in-0 duration-200">
          <div className="bg-green-50 border border-green-200 text-green-800 px-3 py-2 rounded-lg shadow-lg text-sm font-medium">
            📋 Copied to clipboard!
          </div>
        </div>
      )}
    </>
  )
}