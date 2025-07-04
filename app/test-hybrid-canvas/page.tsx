'use client'

import React, { useEffect, useState } from 'react'
import { HybridCanvas } from '@/components/studio/canvas/HybridCanvas'
import { useLogoStore } from '@/lib/stores/logoStore'
import { Button } from '@/components/ui/button'
import { Plus, Play, Pause } from 'lucide-react'

export default function TestHybridCanvas() {
  const { logos, addLogo, updateLogo, updateLogoPosition } = useLogoStore()
  const [animating, setAnimating] = useState(false)
  const [testLogosCreated, setTestLogosCreated] = useState(false)
  
  // Add some test logos on mount - only run once
  useEffect(() => {
    // Only create test logos if we haven't created them yet
    if (testLogosCreated) return
    
    // Only create test logos if we don't have any with our test names
    const hasTestLogos = logos.some(logo => 
      typeof logo.templateName === 'string' && logo.templateName.includes('Wave Bars -')
    )
    
    if (!hasTestLogos && logos.length >= 1) {
      // Get reference parameters from the first logo
      const referenceParams = logos[0]?.parameters || {}
      
      const logo1Id = addLogo('wave-bars')
      const logo2Id = addLogo('wave-bars')  
      const logo3Id = addLogo('wave-bars')
      
      // Use setTimeout to ensure logos are created before updating them
      setTimeout(() => {
        // Update first logo
        updateLogo(logo1Id, {
          templateName: 'Wave Bars - Spectrum',
          parameters: {
            ...referenceParams,
            frequency: 3,
            amplitude: 50,
            barCount: 40,
            barSpacing: 2,
            colorMode: 'spectrum',
            fillColor: '#3b82f6',
            strokeColor: '#1e40af',
            backgroundType: 'transparent'
          }
        })
        updateLogoPosition(logo1Id, { x: 100, y: 100 })
        
        // Update second logo
        updateLogo(logo2Id, {
          templateName: 'Wave Bars - Theme',
          parameters: {
            ...referenceParams,
            frequency: 5,
            amplitude: 30,
            barCount: 50,
            barSpacing: 1,
            colorMode: 'theme',
            fillColor: '#10b981',
            strokeColor: '#059669',
            backgroundType: 'transparent'
          }
        })
        updateLogoPosition(logo2Id, { x: 800, y: 100 })
        
        // Update third logo
        updateLogo(logo3Id, {
          templateName: 'Wave Bars - Tone Shift',
          parameters: {
            ...referenceParams,
            frequency: 2,
            amplitude: 60,
            barCount: 30,
            barSpacing: 3,
            colorMode: 'toneShift',
            fillColor: '#f59e0b',
            strokeColor: '#d97706',
            backgroundType: 'transparent'
          }
        })
        updateLogoPosition(logo3Id, { x: 450, y: 400 })
        
        // Mark that we've created test logos
        setTestLogosCreated(true)
      }, 100)
    }
  }, [logos.length, testLogosCreated, addLogo, updateLogo, updateLogoPosition])
  
  const handleAddLogo = () => {
    const colors = [
      { primary: '#8b5cf6', secondary: '#7c3aed' },
      { primary: '#ef4444', secondary: '#dc2626' },
      { primary: '#06b6d4', secondary: '#0891b2' },
      { primary: '#84cc16', secondary: '#65a30d' }
    ]
    const randomColors = colors[Math.floor(Math.random() * colors.length)]
    
    const newLogoId = addLogo('wave-bars')
    
    // Update with custom parameters
    updateLogo(newLogoId, {
      templateName: `Wave Bars ${logos.length}`,
      parameters: {
        ...logos[0]?.parameters || {},
        frequency: Math.random() * 5 + 1,
        amplitude: Math.random() * 50 + 20,
        barCount: Math.floor(Math.random() * 30) + 30,
        barSpacing: Math.floor(Math.random() * 3) + 1,
        colorMode: 'spectrum',
        fillColor: randomColors.primary,
        strokeColor: randomColors.secondary,
        backgroundType: 'transparent'
      }
    })
    
    // Update position
    updateLogoPosition(newLogoId, { 
      x: Math.random() * 1200, 
      y: Math.random() * 600 
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