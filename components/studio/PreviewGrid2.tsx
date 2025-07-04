'use client'

import React from 'react'
import { useUIStore } from '@/lib/stores/uiStore'
import { useSelectedLogo } from '@/lib/hooks/useSelectedLogo'
import { generateVisualization } from '@/lib/visualization-utils'

export function PreviewGrid() {
  const { darkMode } = useUIStore()
  const { logo } = useSelectedLogo()
  
  if (!logo) {
    return (
      <div className={`w-full h-full flex items-center justify-center ${
        darkMode ? 'bg-gray-900 text-gray-400' : 'bg-gray-50 text-gray-500'
      }`}>
        <p>No logo selected</p>
      </div>
    )
  }

  const sizes = [512, 256, 128, 64, 32, 16]

  return (
    <div className={`w-full h-full p-8 overflow-y-auto ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <h3 className={`text-lg font-semibold mb-6 ${
        darkMode ? 'text-gray-100' : 'text-gray-800'
      }`}>Logo Preview at Different Sizes</h3>
      
      <div className="space-y-8">
        {/* Large sizes */}
        <div>
          <h4 className={`text-sm font-medium mb-3 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>Large Formats</h4>
          <div className="flex gap-4 items-end flex-wrap">
            {sizes.filter(size => size >= 128).map((size) => (
              <div key={size} className="text-center">
                <div className={`border rounded-lg p-4 ${
                  darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
                }`}>
                  <div className="text-2xl font-bold text-center" style={{ width: size, height: size }}>
                    {logo.templateName || 'Logo'}
                  </div>
                </div>
                <p className={`text-xs mt-2 ${
                  darkMode ? 'text-gray-500' : 'text-gray-500'
                }`}>{size}×{size}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Icon sizes with context */}
        <div>
          <h4 className={`text-sm font-medium mb-3 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>Icon Contexts</h4>
          <div className="space-y-4">
            {/* Browser Tab */}
            <div className="flex items-center gap-4">
              <div className={`w-48 rounded-t-lg p-2 flex items-center gap-2 ${
                darkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <div className="w-4 h-4 bg-blue-500 rounded-sm" />
                <span className={`text-xs ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>Your Site</span>
              </div>
              <span className={`text-xs ${
                darkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>Browser Tab (16×16)</span>
            </div>

            {/* macOS Dock */}
            <div className="flex items-center gap-4">
              <div className={`rounded-2xl p-2 ${
                darkMode ? 'bg-gray-800' : 'bg-gray-200'
              }`}>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl" />
              </div>
              <span className={`text-xs ${
                darkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>macOS Dock (64×64)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}