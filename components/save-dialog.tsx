'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Save, Package, Settings } from 'lucide-react'
import { saveShape, savePreset } from '@/lib/storage'

interface SaveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'shape' | 'preset'
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
    color?: string
  }
  currentShapeId?: string
  onSaved: () => void
}

export function SaveDialog({
  open,
  onOpenChange,
  mode,
  visualMode,
  customCode,
  currentShapeName,
  params,
  currentShapeId,
  onSaved,
}: SaveDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  // Set default name when dialog opens
  React.useEffect(() => {
    if (open && mode === 'shape' && currentShapeName) {
      setName(currentShapeName)
    }
  }, [open, mode, currentShapeName])

  const handleSave = async () => {
    if (!name.trim()) return

    setSaving(true)
    try {
      if (mode === 'shape' && customCode) {
        saveShape({
          name: name.trim(),
          code: customCode,
        })
      } else if (mode === 'preset') {
        savePreset({
          name: name.trim(),
          mode: visualMode,
          shapeId: visualMode === 'custom' ? currentShapeId : undefined,
          params,
        })
      }
      
      onSaved()
      onOpenChange(false)
      setName('')
      setDescription('')
    } catch (error) {
      console.error('Failed to save:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === 'shape' ? (
              <>
                <Package className="w-5 h-5" />
                Save Custom Shape
              </>
            ) : (
              <>
                <Settings className="w-5 h-5" />
                Save Parameter Preset
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {mode === 'shape'
              ? 'Save your custom visualization code as a reusable shape'
              : 'Save your current parameters as a preset for quick access'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={mode === 'shape' ? 'My Custom Wave' : 'My Preset'}
              className="w-full px-3 py-2 border rounded-md"
              autoFocus
            />
          </div>
          
          {mode === 'preset' && (
            <div className="text-sm text-gray-500 space-y-1">
              <p>This will save:</p>
              <ul className="list-disc list-inside space-y-0.5 text-xs">
                <li>Visualization mode: {visualMode}</li>
                <li>All parameter values</li>
                <li>Seed: {params.seed}</li>
                {visualMode === 'custom' && <li>Reference to custom shape</li>}
              </ul>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim() || saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}