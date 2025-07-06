import { NextResponse } from 'next/server'
import { createLogoPresets } from '@/lib/shorturl-simple'

export async function GET() {
  try {
    const presetIds = createLogoPresets()
    
    return NextResponse.json({
      message: 'Logo presets created successfully',
      presets: presetIds.map(id => ({
        id,
        url: `/s/${id}`
      }))
    })
  } catch (error) {
    console.error('Error initializing presets:', error)
    return NextResponse.json(
      { error: 'Failed to initialize presets' },
      { status: 500 }
    )
  }
}