// Storage utilities for saving shapes and logos

import { Shape, SavedLogo, Style } from './types/core'

// Re-export Shape type for backward compatibility
export type SavedShape = Shape

// Legacy SavedTheme type - will be migrated to SavedLogo
export interface LegacySavedTheme {
  id: string
  name: string
  shapeId?: string
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
  LOGOS: 'recast_saved_logos',
  THEMES: 'recast_saved_themes', // Legacy key
  PRESETS: 'recast_saved_presets', // Legacy key
}

// Shape management
export const saveShape = (shape: Omit<Shape, 'id' | 'createdAt' | 'updatedAt'>): Shape => {
  const shapes = getSavedShapes()
  const newShape: Shape = {
    ...shape,
    id: `shape_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    supportedParams: shape.supportedParams || [],
    category: shape.category || 'custom'
  }
  
  shapes.push(newShape)
  localStorage.setItem(STORAGE_KEYS.SHAPES, JSON.stringify(shapes))
  return newShape
}

export const getSavedShapes = (): Shape[] => {
  try {
    const shapes = localStorage.getItem(STORAGE_KEYS.SHAPES)
    if (!shapes) return []
    
    // Migrate old format to new format if needed
    const parsed = JSON.parse(shapes)
    return parsed.map((shape: any) => ({
      ...shape,
      supportedParams: shape.supportedParams || [],
      category: shape.category || 'custom'
    }))
  } catch {
    return []
  }
}

export const updateShape = (id: string, updates: Partial<Shape>): Shape | null => {
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

// Logo management
export const saveLogo = (logo: Omit<SavedLogo, 'id' | 'createdAt' | 'updatedAt'>): SavedLogo => {
  const logos = getSavedLogos()
  const newLogo: SavedLogo = {
    ...logo,
    id: `logo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
  
  logos.push(newLogo)
  localStorage.setItem(STORAGE_KEYS.LOGOS, JSON.stringify(logos))
  return newLogo
}

export const getSavedLogos = (): SavedLogo[] => {
  try {
    // Check new key first
    const logos = localStorage.getItem(STORAGE_KEYS.LOGOS)
    if (logos) {
      return JSON.parse(logos)
    }
    
    // Try to migrate from old storage keys
    const legacyThemes = localStorage.getItem(STORAGE_KEYS.THEMES)
    const legacyPresets = localStorage.getItem(STORAGE_KEYS.PRESETS)
    
    if (legacyThemes || legacyPresets) {
      console.log('📦 Migrating legacy storage to new logo format')
      const migrated: SavedLogo[] = []
      
      // Migrate old themes/presets to new logo format
      try {
        if (legacyThemes) {
          const oldThemes = JSON.parse(legacyThemes)
          migrated.push(...oldThemes.map((theme: any) => ({
            id: theme.id || `migrated-${Date.now()}-${Math.random()}`,
            name: theme.name || 'Migrated Logo',
            description: theme.description || '',
            createdAt: theme.createdAt || new Date().toISOString(),
            shape: { id: 'custom', name: 'Custom Shape' },
            parameters: {
              core: theme.params || {},
              style: theme.style || {},
              content: theme.content || {},
              custom: theme.customParameters || {}
            }
          })))
        }
        
        if (legacyPresets) {
          const oldPresets = JSON.parse(legacyPresets)
          migrated.push(...oldPresets.map((preset: any) => ({
            id: preset.id || `migrated-${Date.now()}-${Math.random()}`,
            name: preset.name || 'Migrated Logo',
            description: preset.description || '',
            createdAt: preset.createdAt || new Date().toISOString(),
            shape: { id: 'custom', name: 'Custom Shape' },
            parameters: {
              core: preset.params || {},
              style: preset.style || {},
              content: preset.content || {},
              custom: preset.customParameters || {}
            }
          })))
        }
        
        // Save migrated data to new format
        if (migrated.length > 0) {
          localStorage.setItem(STORAGE_KEYS.LOGOS, JSON.stringify(migrated))
          console.log(`✅ Migrated ${migrated.length} items to new logo format`)
          
          // Clean up old storage
          localStorage.removeItem(STORAGE_KEYS.THEMES)
          localStorage.removeItem(STORAGE_KEYS.PRESETS)
        }
        
        return migrated
      } catch (error) {
        console.error('❌ Migration failed:', error)
        return []
      }
    }
    
    return []
  } catch {
    return []
  }
}

export const deleteLogo = (id: string): boolean => {
  const logos = getSavedLogos()
  const filtered = logos.filter(l => l.id !== id)
  
  if (filtered.length === logos.length) return false
  
  localStorage.setItem(STORAGE_KEYS.LOGOS, JSON.stringify(filtered))
  return true
}

// Export/Import functionality
export const exportData = () => {
  const shapes = getSavedShapes()
  const logos = getSavedLogos()
  
  const data = {
    version: 2,
    exportDate: new Date().toISOString(),
    shapes,
    logos,
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `recast-backup-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export const importData = async (file: File): Promise<{ shapes: number; logos: number }> => {
  const text = await file.text()
  const data = JSON.parse(text)
  
  if (data.version > 2) {
    throw new Error('Incompatible backup version')
  }
  
  const currentShapes = getSavedShapes()
  const currentLogos = getSavedLogos()
  
  // Handle different versions
  const importedLogos = data.logos || []
  // TODO: Convert old themes/presets to new logo format if needed
  
  // Merge imported data
  const mergedShapes = [...currentShapes, ...(data.shapes || [])]
  const mergedLogos = [...currentLogos, ...importedLogos]
  
  localStorage.setItem(STORAGE_KEYS.SHAPES, JSON.stringify(mergedShapes))
  localStorage.setItem(STORAGE_KEYS.LOGOS, JSON.stringify(mergedLogos))
  
  return {
    shapes: (data.shapes || []).length,
    logos: importedLogos.length,
  }
}

// Backward compatibility exports
export type SavedPreset = LegacySavedTheme
export type SavedTheme = SavedLogo
export const savePreset = saveLogo
export const saveTheme = saveLogo
export const getSavedPresets = getSavedLogos
export const getSavedThemes = getSavedLogos
export const deletePreset = deleteLogo
export const deleteTheme = deleteLogo