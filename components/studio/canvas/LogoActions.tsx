'use client'

import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Clipboard, Download, CopyPlus, Trash2, AlertTriangle } from 'lucide-react'
import { useLogoStore } from '@/lib/stores/logoStore'
import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo'
import { generateLogoCanvas } from '@/lib/canvas/logoGenerator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface LogoActionsProps {
  className?: string
  style?: React.CSSProperties
}

export function LogoActions({ className, style }: LogoActionsProps) {
  const { selectedLogoId, duplicateLogo, deleteLogo, getLogoCount, logos } = useLogoStore()
  const { logo: selectedLogo } = useSelectedLogo()
  const [showCopyFeedback, setShowCopyFeedback] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const logoCount = getLogoCount()
  
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
      <div className={className} style={style}>
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
          {logoCount > 1 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowDeleteDialog(true)}
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
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Delete Logo
            </DialogTitle>
            <DialogDescription asChild>
              <div className="pt-3 space-y-2">
                <p>Are you sure you want to delete this logo?</p>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mt-3">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {selectedLogo.templateName || 'Untitled Logo'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {logos.length - 1} logo{logos.length - 1 !== 1 ? 's' : ''} will remain
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 pt-2">
                  This action cannot be undone.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                deleteLogo(selectedLogoId)
                setShowDeleteDialog(false)
              }}
            >
              Delete Logo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}