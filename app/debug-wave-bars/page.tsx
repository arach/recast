'use client'

import React, { useRef, useEffect, useState } from 'react'
import { generateVisualization } from '@/lib/visualization-utils'
import { useTemplateCode } from '@/lib/hooks/useTemplateCode'

export default function DebugWaveBars() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { code, loading, error } = useTemplateCode('wave-bars')
  const [rendered, setRendered] = useState(false)
  
  const testParameters = {
    frequency: 3,
    amplitude: 50,
    barCount: 40,
    barSpacing: 2,
    colorMode: 'spectrum',
    fillColor: '#3b82f6',
    strokeColor: '#1e40af',
    backgroundType: 'transparent',
    fillOpacity: 1,
    strokeOpacity: 1
  }
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !code) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Clear canvas with white background for visibility
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, 600, 600)
    
    console.log('🔍 Debug: About to render wave-bars with parameters:', testParameters)
    console.log('🔍 Debug: Canvas context available:', !!ctx)
    console.log('🔍 Debug: Canvas dimensions:', canvas.width, 'x', canvas.height)
    
    // Add manual debug draw before template
    console.log('🔍 Debug: Drawing manual test rectangle...')
    ctx.fillStyle = '#ff0000'
    ctx.fillRect(10, 10, 50, 50)
    
    try {
      generateVisualization(ctx, code, testParameters, 0, 600, 600)
      setRendered(true)
      console.log('✅ Debug: Wave-bars rendered successfully')
      
      // Check if anything was actually drawn by getting image data
      const imageData = ctx.getImageData(0, 0, 600, 600)
      const data = imageData.data
      
      // Check for non-white pixels (indicating something was drawn)
      let hasNonWhitePixels = false
      let nonWhiteCount = 0
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const a = data[i + 3]
        
        if (r !== 255 || g !== 255 || b !== 255 || a !== 255) {
          hasNonWhitePixels = true
          nonWhiteCount++
        }
      }
      
      console.log('🔍 Debug: Canvas has non-white pixels:', hasNonWhitePixels)
      console.log('🔍 Debug: Non-white pixel count:', nonWhiteCount)
      
      // Add manual debug draw after template
      console.log('🔍 Debug: Drawing manual test rectangle AFTER template...')
      ctx.fillStyle = '#00ff00'
      ctx.fillRect(570, 10, 20, 20)
      
    } catch (error) {
      console.error('❌ Debug: Error rendering wave-bars:', error)
    }
  }, [code])
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Wave-Bars Debug</h1>
      
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-2">Canvas Output</h2>
          <div className="border-2 border-gray-300">
            <canvas 
              ref={canvasRef}
              width={600}
              height={600}
              style={{ display: 'block', background: 'white' }}
            />
          </div>
          <p className="mt-2 text-sm text-gray-600">
            {loading ? 'Loading template...' : rendered ? 'Rendered!' : 'Not rendered'}
          </p>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">Debug Info</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Template loaded:</strong> {code ? 'Yes' : 'No'}</p>
            <p><strong>Template size:</strong> {code?.length || 0} chars</p>
            <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
            <p><strong>Error:</strong> {error || 'None'}</p>
            <p><strong>Rendered:</strong> {rendered ? 'Yes' : 'No'}</p>
          </div>
          
          <h3 className="text-md font-semibold mt-4 mb-2">Test Parameters</h3>
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
{JSON.stringify(testParameters, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}