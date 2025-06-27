'use client'

import React, { useState, useEffect } from 'react'

interface PreviewGridProps {
  canvas: HTMLCanvasElement | null
  seed: string
}

export function PreviewGrid({ canvas, seed }: PreviewGridProps) {
  const [previews, setPreviews] = useState<{ size: number, url: string }[]>([])

  useEffect(() => {
    if (!canvas) return

    const generatePreviews = async () => {
      const newPreviews: { size: number, url: string }[] = []
      const sizes = [512, 256, 128, 64, 32, 16]
      
      const originalData = canvas.toDataURL()
      
      for (const size of sizes) {
        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = size
        tempCanvas.height = size
        const tempCtx = tempCanvas.getContext('2d')
        if (!tempCtx) continue

        const img = document.createElement('img')
        await new Promise<void>((resolve) => {
          img.onload = () => {
            tempCtx.drawImage(img, 0, 0, size, size)
            newPreviews.push({ size, url: tempCanvas.toDataURL() })
            resolve()
          }
          img.src = originalData
        })
      }
      
      setPreviews(newPreviews)
    }

    generatePreviews()
  }, [canvas])

  return (
    <div className="w-[600px] h-[600px] p-8 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-6 text-gray-800">Logo Preview at Different Sizes</h3>
      
      <div className="space-y-8">
        {/* Large sizes */}
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-3">Large Formats</h4>
          <div className="flex gap-4 items-end">
            {previews.filter(p => p.size >= 128).map(({ size, url }) => (
              <div key={size} className="text-center">
                <img 
                  src={url} 
                  width={size} 
                  height={size} 
                  alt={`${size}x${size}`}
                  className="border border-gray-200 rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-2">{size}×{size}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Icon sizes with context */}
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-3">Icon Contexts</h4>
          <div className="space-y-4">
            {/* Browser Tab */}
            <div className="flex items-center gap-4">
              <div className="w-48 bg-gray-100 rounded-t-lg p-2 flex items-center gap-2">
                {previews.find(p => p.size === 16) && (
                  <img src={previews.find(p => p.size === 16)?.url} width={16} height={16} alt="Favicon" />
                )}
                <span className="text-xs text-gray-700">Your Site</span>
              </div>
              <span className="text-xs text-gray-500">Browser Tab (16×16)</span>
            </div>

            {/* macOS Dock */}
            <div className="flex items-center gap-4">
              <div className="bg-gray-200 rounded-2xl p-2">
                {previews.find(p => p.size === 64) && (
                  <img 
                    src={previews.find(p => p.size === 64)?.url} 
                    width={64} 
                    height={64} 
                    alt="Dock icon"
                    className="rounded-xl"
                  />
                )}
              </div>
              <span className="text-xs text-gray-500">macOS Dock (64×64)</span>
            </div>

            {/* Mobile App Icon */}
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-b from-gray-100 to-gray-200 p-3 rounded-3xl">
                {previews.find(p => p.size === 128) && (
                  <img 
                    src={previews.find(p => p.size === 128)?.url} 
                    width={80} 
                    height={80} 
                    alt="App icon"
                    className="rounded-2xl shadow-lg"
                  />
                )}
              </div>
              <span className="text-xs text-gray-500">Mobile App Icon (128×128)</span>
            </div>

            {/* Social Media Avatar */}
            <div className="flex items-center gap-4">
              <div className="bg-white border border-gray-200 rounded-full p-1">
                {previews.find(p => p.size === 64) && (
                  <img 
                    src={previews.find(p => p.size === 64)?.url} 
                    width={48} 
                    height={48} 
                    alt="Avatar"
                    className="rounded-full"
                  />
                )}
              </div>
              <span className="text-xs text-gray-500">Social Media Avatar</span>
            </div>
          </div>
        </div>

        {/* All sizes grid */}
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-3">All Sizes</h4>
          <div className="grid grid-cols-6 gap-4">
            {previews.map(({ size, url }) => (
              <div key={size} className="text-center">
                <div className="bg-gray-50 p-2 rounded-lg">
                  <img 
                    src={url} 
                    width={size} 
                    height={size} 
                    alt={`${size}x${size}`}
                    className="mx-auto"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{size}px</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}