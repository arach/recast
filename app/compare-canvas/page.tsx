'use client'

import { useState } from 'react'
import { CanvasArea } from '@/components/studio/CanvasArea'
import { CanvasAreaRefactored } from '@/components/studio/CanvasAreaRefactored'
import { Button } from '@/components/ui/button'

export default function CompareCanvasPage() {
  const [showOld, setShowOld] = useState(true)
  
  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-white flex flex-col">
      <div className="p-4 border-b bg-white flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Canvas Architecture Comparison</h1>
          <p className="text-sm text-gray-600">
            {showOld ? 'Original 907-line monolith' : 'Refactored modular architecture'}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            {showOld ? (
              <span className="text-red-600 font-mono">CanvasArea.tsx (907 lines)</span>
            ) : (
              <span className="text-green-600 font-mono">CanvasAreaRefactored.tsx (~200 lines)</span>
            )}
          </div>
          <Button
            onClick={() => setShowOld(!showOld)}
            variant={showOld ? "destructive" : "default"}
            size="sm"
          >
            Switch to {showOld ? 'Refactored' : 'Original'}
          </Button>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {showOld ? <CanvasArea /> : <CanvasAreaRefactored />}
        
        <div className="w-96 border-l bg-gray-50/50 p-4 overflow-y-auto">
          <div className={`${showOld ? 'bg-red-50 border-red-300' : 'bg-green-50 border-green-300'} border rounded-lg p-4 mb-4`}>
            <h2 className="font-semibold mb-2">
              {showOld ? '❌ Original Architecture' : '✅ Refactored Architecture'}
            </h2>
            
            {showOld ? (
              <div className="space-y-2 text-sm">
                <h3 className="font-medium text-red-800">Problems:</h3>
                <ul className="text-xs space-y-1 text-red-700">
                  <li>• 907 lines in single file</li>
                  <li>• Mixed concerns (rendering, interaction, state)</li>
                  <li>• Direct localStorage manipulation</li>
                  <li>• Inline event handlers</li>
                  <li>• Tightly coupled components</li>
                  <li>• Hard to test individual pieces</li>
                  <li>• Animation logic mixed with UI</li>
                </ul>
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <h3 className="font-medium text-green-800">Improvements:</h3>
                <ul className="text-xs space-y-1 text-green-700">
                  <li>• ~200 lines main component</li>
                  <li>• Separated concerns via hooks</li>
                  <li>• Centralized canvasStore</li>
                  <li>• Reusable interaction hooks</li>
                  <li>• Modular control components</li>
                  <li>• Pure rendering component</li>
                  <li>• Isolated animation logic</li>
                </ul>
              </div>
            )}
          </div>
          
          <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
            <h3 className="font-semibold mb-2">📁 New File Structure</h3>
            <pre className="text-xs font-mono">
{`components/studio/
├── CanvasAreaRefactored.tsx (200)
├── canvas/
│   ├── CanvasRenderer.tsx (150)
│   ├── CanvasControls.tsx (80)
│   └── LogoActions.tsx (100)
│
lib/
├── stores/
│   └── canvasStore.ts (180)
├── hooks/
│   ├── useCanvas.ts (120)
│   └── useCanvasAnimation.ts (50)
└── canvas/
    └── logoGenerator.ts (60)`}
            </pre>
            <p className="text-xs text-gray-600 mt-2">
              Total: ~940 lines (but properly organized!)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}