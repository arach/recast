import { useState } from 'react'

export interface DialogState {
  // Save dialog
  saveDialogOpen: boolean
  setSaveDialogOpen: (open: boolean) => void
  saveMode: 'shape' | 'logo'
  setSaveMode: (mode: 'shape' | 'logo') => void
  
  // Saved items dialog
  savedItemsOpen: boolean
  setSavedItemsOpen: (open: boolean) => void
  
  // Industry selector
  showIndustrySelector: boolean
  setShowIndustrySelector: (open: boolean) => void
  currentIndustry?: string
  setCurrentIndustry: (industry?: string) => void
  
  // Current shape tracking
  currentShapeId?: string
  setCurrentShapeId: (id?: string) => void
  currentShapeName: string
  setCurrentShapeName: (name: string) => void
}

export function useDialogState(): DialogState {
  // Save dialog state
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [saveMode, setSaveMode] = useState<'shape' | 'logo'>('logo')
  
  // Saved items dialog
  const [savedItemsOpen, setSavedItemsOpen] = useState(false)
  
  // Industry selector
  const [showIndustrySelector, setShowIndustrySelector] = useState(false)
  const [currentIndustry, setCurrentIndustry] = useState<string | undefined>()
  
  // Shape tracking
  const [currentShapeId, setCurrentShapeId] = useState<string | undefined>()
  const [currentShapeName, setCurrentShapeName] = useState('Custom Shape')
  
  return {
    // Save dialog
    saveDialogOpen,
    setSaveDialogOpen,
    saveMode,
    setSaveMode,
    
    // Saved items dialog
    savedItemsOpen,
    setSavedItemsOpen,
    
    // Industry selector
    showIndustrySelector,
    setShowIndustrySelector,
    currentIndustry,
    setCurrentIndustry,
    
    // Shape tracking
    currentShapeId,
    setCurrentShapeId,
    currentShapeName,
    setCurrentShapeName
  }
}