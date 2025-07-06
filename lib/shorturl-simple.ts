import { nanoid } from 'nanoid'
import fs from 'fs'
import path from 'path'

const dataFile = path.join(process.cwd(), 'data', 'shorturl.json')

interface ShortURL {
  id: string
  full_url: string
  template?: string
  params?: any
  created_at: string
  clicks: number
}

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Load existing URLs
function loadURLs(): Record<string, ShortURL> {
  try {
    if (fs.existsSync(dataFile)) {
      return JSON.parse(fs.readFileSync(dataFile, 'utf-8'))
    }
  } catch (error) {
    console.error('Error loading URLs:', error)
  }
  return {}
}

// Save URLs
function saveURLs(urls: Record<string, ShortURL>) {
  fs.writeFileSync(dataFile, JSON.stringify(urls, null, 2))
}

export function createShortURL(fullUrl: string, template?: string, params?: any): string {
  const urls = loadURLs()
  const id = nanoid(6)
  
  urls[id] = {
    id,
    full_url: fullUrl,
    template,
    params,
    created_at: new Date().toISOString(),
    clicks: 0
  }
  
  saveURLs(urls)
  return id
}

export function getURL(id: string): ShortURL | null {
  const urls = loadURLs()
  const url = urls[id]
  
  if (url) {
    // Increment clicks
    url.clicks++
    saveURLs(urls)
    return url
  }
  
  return null
}

export function getAllURLs(limit = 100): ShortURL[] {
  const urls = loadURLs()
  return Object.values(urls)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit)
}

export function createLogoPresets() {
  const urls = loadURLs()
  
  const presets = [
    {
      id: 'spectrum',
      template: 'wave-bars',
      params: {
        barCount: 60,
        barSpacing: 0,
        frequency: 3.5,
        amplitude: 40,
        waveType: 'sine',
        colorMode: 'spectrum',
        animationSpeed: 0.8,
        showWavePath: true,
        pathOpacity: 0.2,
        seed: 'reflow-spectrum-2024'
      }
    },
    {
      id: 'infinity',
      template: 'wave-bars',
      params: {
        barCount: 32,
        barSpacing: 1,
        frequency: 2.4,
        amplitude: 45,
        phaseShift: 90,
        waveType: 'sine',
        colorMode: 'mono',
        fillType: 'gradient',
        fillGradientStart: '#0066FF',
        fillGradientEnd: '#00FFFF',
        fillGradientDirection: 45,
        seed: 'reflow-infinity-2024'
      }
    },
    {
      id: 'letterR',
      template: 'letter-mark',
      params: {
        letter: 'R',
        fontSize: 120,
        fontWeight: 700,
        fillType: 'gradient',
        fillGradientStart: '#7C3AED',
        fillGradientEnd: '#06B6D4',
        fillGradientDirection: 135,
        containerType: 'circle',
        seed: 'reflow-letter-2024'
      }
    },
    {
      id: 'minimal',
      template: 'wordmark',
      params: {
        text: 'reflow',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        fontSize: 48,
        fontWeight: 600,
        letterSpacing: -2,
        textTransform: 'lowercase',
        fillType: 'solid',
        fillColor: '#000000',
        strokeType: 'none',
        backgroundType: 'transparent',
        frequency: 0,
        amplitude: 0,
        seed: 'reflow-minimal-2024'
      }
    },
    {
      id: 'pulse',
      template: 'pulse-spotify',
      params: {
        pulseCount: 5,
        pulseSpeed: 1.2,
        maxRadius: 100,
        colorMode: 'mono',
        fillType: 'solid',
        fillColor: '#000000',
        fillOpacity: 0.8,
        strokeType: 'solid',
        strokeColor: '#000000',
        strokeWidth: 2,
        seed: 'reflow-pulse-2024'
      }
    }
  ]
  
  // Create short URLs for each preset
  for (const preset of presets) {
    const params = new URLSearchParams()
    params.set('template', preset.template)
    
    // Add all parameters
    for (const [key, value] of Object.entries(preset.params)) {
      // Don't URL encode color values - let URLSearchParams handle it
      params.set(key, String(value))
    }
    
    const fullUrl = `/?${params.toString()}`
    
    urls[preset.id] = {
      id: preset.id,
      full_url: fullUrl,
      template: preset.template,
      params: preset.params,
      created_at: new Date().toISOString(),
      clicks: 0
    }
  }
  
  saveURLs(urls)
  return presets.map(p => p.id)
}