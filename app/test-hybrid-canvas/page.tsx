'use client'

import React, { useEffect, useState } from 'react'
import { HybridCanvas } from '@/components/studio/canvas/HybridCanvas'
import { useLogoStore } from '@/lib/stores/logoStore'
import { Button } from '@/components/ui/button'
import { Plus, Play, Pause } from 'lucide-react'

export default function TestHybridCanvas() {
  const { logos, addLogo } = useLogoStore()
  const [animating, setAnimating] = useState(false)
  
  // Add some test logos on mount
  useEffect(() => {
    if (logos.length === 0) {
      // Add a few test logos
      addLogo({
        id: 'test-1',
        name: 'Test Logo 1',
        templateId: 'wave-bars',
        templateName: 'Wave Bars',
        parameters: {
          core: {
            seed: 'test1',
            frequency: 3,
            amplitude: 0.8,
            offset: 0,
            phase: 0
          },
          colors: {
            primary: '#3b82f6',
            secondary: '#1e40af',
            background: 'transparent'
          }
        },
        position: { x: 100, y: 100 }
      })
      
      addLogo({
        id: 'test-2',
        name: 'Test Logo 2',
        templateId: 'audio-bars',
        templateName: 'Audio Bars',
        parameters: {
          core: {
            seed: 'test2',
            frequency: 5,
            amplitude: 0.6,
            offset: 0,
            phase: 0
          },
          colors: {
            primary: '#10b981',
            secondary: '#059669',
            background: 'transparent'
          }
        },
        position: { x: 800, y: 100 }
      })
      
      addLogo({
        id: 'test-3',
        name: 'Test Logo 3',
        templateId: 'spinning-triangles',
        templateName: 'Spinning Triangles',
        parameters: {
          core: {
            seed: 'test3',
            frequency: 2,
            amplitude: 0.5,
            offset: 0,
            phase: 0
          },
          colors: {
            primary: '#f59e0b',
            secondary: '#d97706',
            background: 'transparent'
          }
        },
        position: { x: 450, y: 400 }
      })
    }
  }, [])
  
  const handleAddLogo = () => {
    const id = `logo-${Date.now()}`
    const colors = [
      { primary: '#8b5cf6', secondary: '#7c3aed' },
      { primary: '#ef4444', secondary: '#dc2626' },
      { primary: '#06b6d4', secondary: '#0891b2' },
      { primary: '#84cc16', secondary: '#65a30d' }
    ]
    const randomColors = colors[Math.floor(Math.random() * colors.length)]
    
    addLogo({
      id,
      name: `Logo ${logos.length + 1}`,
      templateId: 'wave-bars',
      templateName: 'Wave Bars',
      parameters: {
        core: {
          seed: id,
          frequency: Math.random() * 5 + 1,
          amplitude: Math.random() * 0.5 + 0.5,
          offset: 0,
          phase: 0
        },
        colors: {
          ...randomColors,
          background: 'transparent'
        }
      },
      position: { 
        x: Math.random() * 1200, 
        y: Math.random() * 600 
      }
    })
  }
  
  return (
    <div className="w-screen h-screen relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm z-10 flex items-center px-4 gap-4 border-b">
        <h1 className="text-lg font-semibold">Hybrid Canvas Test</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {logos.length} logo{logos.length !== 1 ? 's' : ''}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddLogo}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Logo
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setAnimating(!animating)}
            className="gap-2"
          >
            {animating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {animating ? 'Pause' : 'Play'}
          </Button>
        </div>
        <div className="ml-auto text-sm text-gray-500">
          Click logos to select • Hover for preview
        </div>
      </div>
      
      {/* Canvas */}
      <div className="absolute inset-0 pt-16">
        <HybridCanvas animating={animating} />
      </div>
    </div>
  )
}