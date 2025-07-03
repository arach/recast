'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Package, 
  Settings, 
  Trash2, 
  Download, 
  Upload, 
  FileCode,
  Clock,
  Layers,
  Activity
} from 'lucide-react'
import { 
  getSavedShapes, 
  getSavedLogos, 
  deleteShape, 
  deleteLogo,
  exportData,
  importData,
  SavedShape,
  SavedLogo
} from '@/lib/storage'

interface SavedItemsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLoadShape: (shape: SavedShape) => void
  onLoadLogo: (logo: SavedLogo) => void
}

// Built-in shapes
const builtInShapes = [
  { id: 'builtin-wave', name: 'Wave Lines', type: 'wave' },
  { id: 'builtin-bars', name: 'Audio Bars', type: 'bars' },
  { id: 'builtin-wavebars', name: 'Wave Bars', type: 'wavebars' },
]

export function SavedItemsDialog({
  open,
  onOpenChange,
  onLoadShape,
  onLoadLogo,
}: SavedItemsDialogProps) {
  const [activeTab, setActiveTab] = useState<'shapes' | 'logos'>('shapes')
  const [shapes, setShapes] = useState<SavedShape[]>([])
  const [logos, setLogos] = useState<SavedLogo[]>([])
  const [showBuiltIn, setShowBuiltIn] = useState(true)

  useEffect(() => {
    if (open) {
      setShapes(getSavedShapes())
      setLogos(getSavedLogos())
    }
  }, [open])

  const handleDeleteShape = (id: string) => {
    if (confirm('Are you sure you want to delete this shape?')) {
      deleteShape(id)
      setShapes(getSavedShapes())
    }
  }

  const handleDeleteLogo = (id: string) => {
    if (confirm('Are you sure you want to delete this saved logo?')) {
      deleteLogo(id)
      setLogos(getSavedLogos())
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const result = await importData(file)
      alert(`Imported ${result.shapes} shapes and ${result.logos} logos`)
      setShapes(getSavedShapes())
      setLogos(getSavedLogos())
    } catch (error) {
      alert('Failed to import data: ' + error)
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Saved Items</DialogTitle>
          <DialogDescription>
            Manage your saved shapes and logos
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'shapes' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('shapes')}
            >
              <Package className="w-4 h-4 mr-2" />
              Shapes ({shapes.length})
            </Button>
            <Button
              variant={activeTab === 'logos' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('logos')}
            >
              <Settings className="w-4 h-4 mr-2" />
              Logos ({logos.length})
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportData}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <label>
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </span>
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[400px] space-y-4">
          {activeTab === 'shapes' ? (
            <>
              {/* Built-in Shapes */}
              <div>
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Built-in Shapes
                </h3>
                <div className="space-y-2">
                  {builtInShapes.map((shape) => (
                    <Card key={shape.id} className="cursor-pointer hover:bg-gray-50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium flex items-center gap-2">
                              <FileCode className="w-4 h-4" />
                              {shape.name}
                              <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                Built-in
                              </span>
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              Core visualization mode
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                // This will trigger the mode change in the parent
                                onLoadShape({
                                  id: shape.id,
                                  name: shape.name,
                                  code: '', // Not used for built-in shapes
                                  createdAt: 0,
                                  updatedAt: 0,
                                })
                                onOpenChange(false)
                              }}
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Saved Shapes */}
              {shapes.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    My Shapes
                  </h3>
                  <div className="space-y-2">
                    {shapes.map((shape) => (
                      <Card key={shape.id} className="cursor-pointer hover:bg-gray-50">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium flex items-center gap-2">
                                <FileCode className="w-4 h-4" />
                                {shape.name}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                <Clock className="w-3 h-3" />
                                {formatDate(shape.createdAt)}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => {
                                  onLoadShape(shape)
                                  onOpenChange(false)
                                }}
                              >
                                Load
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteShape(shape.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {shapes.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No custom shapes saved yet. Clone a built-in shape to get started!
                </p>
              )}
            </>
          ) : (
            logos.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No saved logos yet</p>
            ) : (
              logos.map((logo) => (
                <Card key={logo.id} className="cursor-pointer hover:bg-gray-50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{logo.name}</h4>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Layers className="w-3 h-3" />
                            {logo.style?.name || 'Custom'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            F:{logo.parameters.core.frequency} A:{logo.parameters.core.amplitude}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(logo.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            onLoadLogo(logo)
                            onOpenChange(false)
                          }}
                        >
                          Load
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteLogo(logo.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}