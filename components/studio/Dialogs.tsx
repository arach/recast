'use client'

import React from 'react'
import { SaveDialog } from '../save-dialog'
import { SavedItemsDialog } from '../saved-items-dialog'
import { IndustrySelector } from './IndustrySelector'
import { SavedShape, SavedLogo } from '@/lib/storage'

interface DialogsProps {
  // Save dialog
  saveDialogOpen: boolean
  setSaveDialogOpen: (open: boolean) => void
  saveMode: 'shape' | 'logo'
  currentShapeId?: string
  currentShapeName: string
  
  // Saved items dialog
  savedItemsOpen: boolean
  setSavedItemsOpen: (open: boolean) => void
  
  // Industry selector
  showIndustrySelector: boolean
  setShowIndustrySelector: (open: boolean) => void
  
  // Logo data
  selectedLogo?: any
  coreParams?: any
  styleParams?: any
  customParams?: any
  
  // Handlers
  onLoadShape: (shape: SavedShape) => void
  onLoadLogo: (logo: SavedLogo) => void
  onSelectTheme: (themeId: string, defaults?: any, industryId?: string) => void
}

export function Dialogs({
  saveDialogOpen,
  setSaveDialogOpen,
  saveMode,
  currentShapeId,
  currentShapeName,
  savedItemsOpen,
  setSavedItemsOpen,
  showIndustrySelector,
  setShowIndustrySelector,
  selectedLogo,
  coreParams,
  styleParams,
  customParams,
  onLoadShape,
  onLoadLogo,
  onSelectTheme
}: DialogsProps) {
  return (
    <>
      {/* Industry Selector */}
      {showIndustrySelector && (
        <IndustrySelector 
          onSelectTheme={onSelectTheme}
          onClose={() => setShowIndustrySelector(false)}
        />
      )}

      {/* Save Dialog */}
      <SaveDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        mode={saveMode}
        shapeId={currentShapeId}
        shapeName={currentShapeName}
        code={selectedLogo?.code || ''}
        params={{
          seed: coreParams?.frequency.toString() || '',
          frequency: coreParams?.frequency || 4,
          amplitude: coreParams?.amplitude || 50,
          complexity: coreParams?.complexity || 0.5,
          chaos: coreParams?.chaos || 0,
          damping: coreParams?.damping || 0,
          layers: coreParams?.layers || 3,
          barCount: customParams?.barCount || 40,
          barSpacing: customParams?.barSpacing || 2,
          radius: coreParams?.radius || 50,
          color: styleParams?.fillColor || '#3b82f6'
        }}
      />

      {/* Saved Items Dialog */}
      <SavedItemsDialog
        open={savedItemsOpen}
        onOpenChange={setSavedItemsOpen}
        onLoadShape={onLoadShape}
        onLoadLogo={onLoadLogo}
      />
    </>
  )
}