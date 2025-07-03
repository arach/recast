'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Save, Package, Settings } from 'lucide-react'
import { saveShape, saveLogo, SavedLogo } from '@/lib/storage'

interface SaveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: 'shape' | 'logo'
  shapeId?: string
  shapeName?: string
  code?: string
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
}

export function SaveDialog({
  open,
  onOpenChange,
  mode,
  shapeId,
  shapeName,
  code,
  params,
}: SaveDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  // Set default name when dialog opens
  React.useEffect(() => {
    if (open && mode === 'shape' && shapeName) {
      setName(shapeName)
    }
  }, [open, mode, shapeName])

  const handleSave = async () => {
    if (!name.trim()) return

    setSaving(true)
    try {
      if (mode === 'shape' && code) {
        saveShape({
          name: name.trim(),
          code: code,
        })
      } else if (mode === 'logo') {
        // Convert old params format to new SavedLogo format
        saveLogo({
          name: name.trim(),
          shape: {
            id: shapeId || 'custom',
            code: code
          },
          style: {
            id: 'custom',
            name: 'Custom Style',
            colors: {
              primary: params.color || '#000000',
              secondary: '#FF0066',
              accent: '#00FF88',
              background: '#FFFFFF'
            },
            effects: {
              strokeWidth: 2,
              opacity: 1,
              blur: 0,
              glow: false
            },
            mood: {
              energy: 0.5,
              formality: 0.5,
              complexity: params.complexity || 0.5
            }
          },
          parameters: {
            core: {
              frequency: params.frequency,
              amplitude: params.amplitude,
              complexity: params.complexity,
              chaos: params.chaos,
              damping: params.damping,
              layers: params.layers,
              radius: params.radius || 0.5
            },
            style: {
              fillColor: params.color || '#000000',
              strokeColor: '#FF0066',
              backgroundColor: '#FFFFFF'
            },
            custom: {
              barCount: params.barCount,
              barSpacing: params.barSpacing,
              seed: params.seed
            }
          }
        })
      }
      
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
                Save Logo Configuration
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {mode === 'shape'
              ? 'Save your custom visualization code as a reusable shape'
              : 'Save your current logo configuration for quick access'}
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
              placeholder={mode === 'shape' ? 'My Custom Wave' : 'My Logo Design'}
              className="w-full px-3 py-2 border rounded-md"
              autoFocus
            />
          </div>
          
          {mode === 'logo' && (
            <div className="text-sm text-gray-500 space-y-1">
              <p>This will save:</p>
              <ul className="list-disc list-inside space-y-0.5 text-xs">
                <li>All parameter values</li>
                <li>Seed: {params.seed}</li>
                {shapeId && <li>Reference to custom shape</li>}
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