'use client'

import { CanvasArea } from '@/components/studio/CanvasArea'

export default function TestCanvasPage() {
  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-white flex flex-col">
      <div className="p-4 border-b bg-white">
        <h1 className="text-xl font-semibold">Canvas Refactor Test</h1>
        <p className="text-sm text-gray-600">Testing the decomposed canvas architecture</p>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        <CanvasArea />
        
        <div className="w-96 border-l bg-gray-50/50 p-4">
          <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
            <h2 className="font-semibold mb-2">Refactored Canvas</h2>
            <p className="text-sm">This uses the new architecture:</p>
            <ul className="text-xs mt-2 space-y-1">
              <li>✓ canvasStore for state</li>
              <li>✓ useCanvas hook for interactions</li>
              <li>✓ CanvasRenderer for rendering</li>
              <li>✓ Separate control components</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}