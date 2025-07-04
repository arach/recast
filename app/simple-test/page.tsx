'use client'

import React, { useEffect } from 'react'
import { HybridCanvas } from '@/components/studio/canvas/HybridCanvas'
import { useLogoStore } from '@/lib/stores/logoStore'
import { useCanvasStore } from '@/lib/stores/canvasStore'

export default function SimpleTest() {
  const { logos, addLogo, updateLogoPosition, clearPersistedState } = useLogoStore()
  const { setOffset, setZoom } = useCanvasStore()
  
  useEffect(() => {
    // FORCE clear localStorage completely
    if (typeof window !== 'undefined') {
      localStorage.removeItem('reflow-canvas-state')
      localStorage.removeItem('reflow-canvas-offset')
      localStorage.clear() // Nuclear option
      console.log('🧹 Cleared ALL localStorage')
      
      // Force page reload to start completely fresh
      if (logos.length > 1) {
        console.log(`🔄 Reloading page - found ${logos.length} logos`)
        window.location.reload()
        return
      }
    }
    
    // Reset canvas to origin
    setOffset({ x: 0, y: 0 })
    setZoom(1)
    
    // Only create one test logo if we don't have any
    if (logos.length === 0) {
      console.log('Creating simple test logo...')
      const logoId = addLogo('wave-bars')
      // Position it at origin (0,0) so it should be visible
      updateLogoPosition(logoId, { x: 0, y: 0 })
      console.log('Simple test logo created at (0,0)')
    }
  }, [logos.length])
  
  return (
    <div className="w-screen h-screen relative overflow-hidden bg-white">
      <div className="absolute top-4 left-4 z-10 bg-white/90 p-2 rounded shadow">
        <p className="text-sm">Simple Test: {logos.length} logo(s)</p>
        <p className="text-xs text-gray-500">Should see one wave-bars logo at origin</p>
      </div>
      <HybridCanvas />
    </div>
  )
}