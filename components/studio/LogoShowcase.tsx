'use client'

import React from 'react'
import { logoPresets, getLogoURL } from '@/lib/logo-presets'

export function LogoShowcase() {
  const showcaseLogos = [
    {
      name: 'Spectrum Flow',
      key: 'spectrumFlow',
      description: 'Full creative spectrum in flowing motion',
      context: 'Hero sections, marketing materials'
    },
    {
      name: 'Infinite Wave',
      key: 'infiniteWave',
      description: 'Continuous flow forming infinity',
      context: 'Primary brand mark'
    },
    {
      name: 'Liquid Mercury',
      key: 'liquidMercury',
      description: 'Adaptive, morphing identity',
      context: 'Enterprise, professional'
    },
    {
      name: 'Pulse Mark',
      key: 'pulseMark',
      description: 'Heartbeat of digital brands',
      context: 'Loading states, animations'
    },
    {
      name: 'Quantum Brand',
      key: 'quantumBrand',
      description: 'Probability waves and potential',
      context: 'Technical documentation'
    },
    {
      name: 'Neon Current',
      key: 'neonCurrent',
      description: 'Electric energy and vitality',
      context: 'Dark mode, cyberpunk aesthetic'
    }
  ]

  const copyURL = (key: string) => {
    const url = getLogoURL(key as keyof typeof logoPresets, window.location.origin)
    navigator.clipboard.writeText(url)
    // Could add a toast notification here
  }

  return (
    <div className="p-8 bg-gray-50 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">ReFlow Logo Concepts</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {showcaseLogos.map((logo) => (
          <div key={logo.key} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="h-40 bg-gray-100 rounded mb-4 flex items-center justify-center">
              {/* Placeholder for logo visualization */}
              <span className="text-gray-400">Logo Preview</span>
            </div>
            
            <h3 className="font-semibold text-lg mb-1">{logo.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{logo.description}</p>
            <p className="text-xs text-gray-500 mb-4">Use: {logo.context}</p>
            
            <div className="flex gap-2">
              <button
                onClick={() => copyURL(logo.key)}
                className="flex-1 px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
              >
                Copy URL
              </button>
              <button
                onClick={() => {
                  // Load this preset in the current session
                  const preset = logoPresets[logo.key as keyof typeof logoPresets]
                  // Implementation would update the current logo with these params
                }}
                className="flex-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Load
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Design Philosophy</h3>
        <p className="text-sm text-gray-700">
          Each logo concept represents a different aspect of ReFlow's identity: 
          <strong> Flow</strong> (continuous movement), 
          <strong> Waves</strong> (mathematical beauty), 
          <strong> Iterations</strong> (endless variations), and 
          <strong> Infinity</strong> (perpetual transformation).
        </p>
      </div>
    </div>
  )
}