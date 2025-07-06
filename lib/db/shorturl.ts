import Database from 'better-sqlite3'
import { nanoid } from 'nanoid'
import path from 'path'

// Initialize database
const dbPath = path.join(process.cwd(), 'data', 'shorturl.db')
const db = new Database(dbPath)

// Create table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS urls (
    id TEXT PRIMARY KEY,
    full_url TEXT NOT NULL,
    template TEXT,
    params TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    clicks INTEGER DEFAULT 0
  )
`)

// Create index for faster lookups
db.exec(`CREATE INDEX IF NOT EXISTS idx_urls_id ON urls(id)`)

export interface ShortURL {
  id: string
  full_url: string
  template?: string
  params?: string
  created_at: string
  clicks: number
}

/**
 * Create a short URL
 */
export function createShortURL(fullUrl: string, template?: string, params?: any): string {
  // Generate a short ID (6 characters by default)
  const id = nanoid(6)
  
  const stmt = db.prepare(`
    INSERT INTO urls (id, full_url, template, params)
    VALUES (@id, @full_url, @template, @params)
  `)
  
  stmt.run({
    id,
    full_url: fullUrl,
    template: template || null,
    params: params ? JSON.stringify(params) : null
  })
  
  return id
}

/**
 * Get a URL by its short ID
 */
export function getURL(id: string): ShortURL | null {
  const stmt = db.prepare(`
    SELECT * FROM urls WHERE id = @id
  `)
  
  const row = stmt.get({ id }) as ShortURL | undefined
  
  if (row) {
    // Increment click counter
    db.prepare(`UPDATE urls SET clicks = clicks + 1 WHERE id = @id`).run({ id })
  }
  
  return row || null
}

/**
 * Get all URLs (for admin/debugging)
 */
export function getAllURLs(limit = 100): ShortURL[] {
  const stmt = db.prepare(`
    SELECT * FROM urls 
    ORDER BY created_at DESC 
    LIMIT @limit
  `)
  
  return stmt.all({ limit }) as ShortURL[]
}

/**
 * Create preset short URLs for logo concepts
 */
export function createLogoPresets() {
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
    }
  ]
  
  // Insert presets with custom IDs
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO urls (id, full_url, template, params, created_at)
    VALUES (@id, @full_url, @template, @params, CURRENT_TIMESTAMP)
  `)
  
  for (const preset of presets) {
    const params = new URLSearchParams()
    params.set('template', preset.template)
    
    // Add all parameters
    for (const [key, value] of Object.entries(preset.params)) {
      params.set(key, String(value))
    }
    
    const fullUrl = `/?${params.toString()}`
    
    stmt.run({
      id: preset.id,
      full_url: fullUrl,
      template: preset.template,
      params: JSON.stringify(preset.params)
    })
  }
  
  return presets.map(p => p.id)
}

// Close database on process exit
process.on('exit', () => db.close())
process.on('SIGINT', () => {
  db.close()
  process.exit(0)
})