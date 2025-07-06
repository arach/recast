'use client'

import React, { useState } from 'react'
import { Share2, Check, Copy } from 'lucide-react'

export function ShareButton() {
  const [isCreating, setIsCreating] = useState(false)
  const [shortUrl, setShortUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const createShortUrl = async () => {
    setIsCreating(true)
    
    try {
      // Get current URL parameters
      const currentUrl = window.location.search
      const params = new URLSearchParams(currentUrl)
      const template = params.get('template')
      
      // Create short URL
      const response = await fetch('/api/shorturl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: currentUrl,
          template,
          params: Object.fromEntries(params.entries())
        })
      })
      
      const data = await response.json()
      setShortUrl(data.shortUrl)
      
      // Auto-copy to clipboard
      await navigator.clipboard.writeText(data.shortUrl)
      setCopied(true)
      
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to create short URL:', error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={createShortUrl}
        disabled={isCreating}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
      >
        <Share2 size={16} />
        {isCreating ? 'Creating...' : 'Share'}
      </button>
      
      {shortUrl && (
        <div className="absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg p-3 min-w-[300px] z-50">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={shortUrl}
              readOnly
              className="flex-1 px-3 py-1 bg-gray-100 rounded text-sm"
              onClick={(e) => e.currentTarget.select()}
            />
            <button
              onClick={async () => {
                await navigator.clipboard.writeText(shortUrl)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              }}
              className="p-2 hover:bg-gray-100 rounded"
            >
              {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
            </button>
          </div>
          {copied && (
            <p className="text-xs text-green-600 mt-2">Copied to clipboard!</p>
          )}
        </div>
      )}
    </div>
  )
}