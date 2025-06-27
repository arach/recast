// Storage utilities for saving shapes and presets

export interface SavedShape {
  id: string
  name: string
  code: string
  createdAt: number
  updatedAt: number
}

export interface SavedPreset {
  id: string
  name: string
  shapeId?: string // Optional reference to custom shape
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
  createdAt: number
}

const STORAGE_KEYS = {
  SHAPES: 'recast_saved_shapes',
  PRESETS: 'recast_saved_presets',
}

// Shape management
export const saveShape = (shape: Omit<SavedShape, 'id' | 'createdAt' | 'updatedAt'>): SavedShape => {
  const shapes = getSavedShapes()
  const newShape: SavedShape = {
    ...shape,
    id: `shape_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  
  shapes.push(newShape)
  localStorage.setItem(STORAGE_KEYS.SHAPES, JSON.stringify(shapes))
  return newShape
}

export const getSavedShapes = (): SavedShape[] => {
  try {
    const shapes = localStorage.getItem(STORAGE_KEYS.SHAPES)
    return shapes ? JSON.parse(shapes) : []
  } catch {
    return []
  }
}

export const updateShape = (id: string, updates: Partial<SavedShape>): SavedShape | null => {
  const shapes = getSavedShapes()
  const index = shapes.findIndex(s => s.id === id)
  
  if (index === -1) return null
  
  shapes[index] = {
    ...shapes[index],
    ...updates,
    updatedAt: Date.now(),
  }
  
  localStorage.setItem(STORAGE_KEYS.SHAPES, JSON.stringify(shapes))
  return shapes[index]
}

export const deleteShape = (id: string): boolean => {
  const shapes = getSavedShapes()
  const filtered = shapes.filter(s => s.id !== id)
  
  if (filtered.length === shapes.length) return false
  
  localStorage.setItem(STORAGE_KEYS.SHAPES, JSON.stringify(filtered))
  return true
}

// Preset management
export const savePreset = (preset: Omit<SavedPreset, 'id' | 'createdAt'>): SavedPreset => {
  const presets = getSavedPresets()
  const newPreset: SavedPreset = {
    ...preset,
    id: `preset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: Date.now(),
  }
  
  presets.push(newPreset)
  localStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(presets))
  return newPreset
}

export const getSavedPresets = (): SavedPreset[] => {
  try {
    const presets = localStorage.getItem(STORAGE_KEYS.PRESETS)
    return presets ? JSON.parse(presets) : []
  } catch {
    return []
  }
}

export const deletePreset = (id: string): boolean => {
  const presets = getSavedPresets()
  const filtered = presets.filter(p => p.id !== id)
  
  if (filtered.length === presets.length) return false
  
  localStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(filtered))
  return true
}

// Export/Import functionality
export const exportData = () => {
  const shapes = getSavedShapes()
  const presets = getSavedPresets()
  
  const data = {
    version: 1,
    exportDate: new Date().toISOString(),
    shapes,
    presets,
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `recast-backup-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export const importData = async (file: File): Promise<{ shapes: number; presets: number }> => {
  const text = await file.text()
  const data = JSON.parse(text)
  
  if (data.version !== 1) {
    throw new Error('Incompatible backup version')
  }
  
  const currentShapes = getSavedShapes()
  const currentPresets = getSavedPresets()
  
  // Merge imported data
  const mergedShapes = [...currentShapes, ...data.shapes]
  const mergedPresets = [...currentPresets, ...data.presets]
  
  localStorage.setItem(STORAGE_KEYS.SHAPES, JSON.stringify(mergedShapes))
  localStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(mergedPresets))
  
  return {
    shapes: data.shapes.length,
    presets: data.presets.length,
  }
}