'use client'

import React from 'react'
import { SaveDialog } from './save-dialog'
import { SavedItemsDialog } from './saved-items-dialog'
import { SavedShape, SavedPreset } from '@/lib/storage'

interface MainLayoutProps {
  children: React.ReactNode
  saveDialogOpen: boolean
  setSaveDialogOpen: (open: boolean) => void
  saveMode: 'shape' | 'preset'
  visualMode: 'wave' | 'bars' | 'wavebars' | 'custom'
  customCode?: string
  currentShapeName?: string
  params: {
    seed: string
    frequency: number
    amplitude: number
    complexity: number
    chaos: number
    damping: number
    layers: number
    barCount?: number
    barSpacing?: number
    radius?: number
    color?: string
  }
  currentShapeId?: string
  savedItemsOpen: boolean
  setSavedItemsOpen: (open: boolean) => void
  onLoadShape: (shape: SavedShape) => void
  onLoadPreset: (preset: SavedPreset) => void
}

export function MainLayout({
  children,
  saveDialogOpen,
  setSaveDialogOpen,
  saveMode,
  visualMode,
  customCode,
  currentShapeName,
  params,
  currentShapeId,
  savedItemsOpen,
  setSavedItemsOpen,
  onLoadShape,
  onLoadPreset,
}: MainLayoutProps) {
  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-white flex flex-col">
      {children}
      
      <SaveDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        mode={saveMode}
        code={customCode}
        shapeName={currentShapeName}
        params={params}
        shapeId={currentShapeId}
      />

      <SavedItemsDialog
        open={savedItemsOpen}
        onOpenChange={setSavedItemsOpen}
        onLoadShape={onLoadShape}
        onLoadPreset={onLoadPreset}
      />
    </div>
  )
}