import { NextRequest, NextResponse } from 'next/server'
import { createShortURL, getAllURLs } from '@/lib/shorturl-simple'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, template, params } = body
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }
    
    const shortId = createShortURL(url, template, params)
    
    return NextResponse.json({
      id: shortId,
      shortUrl: `${request.nextUrl.origin}/s/${shortId}`,
      fullUrl: url
    })
  } catch (error) {
    console.error('Error creating short URL:', error)
    return NextResponse.json(
      { error: 'Failed to create short URL' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const urls = getAllURLs(50)
    return NextResponse.json({ urls })
  } catch (error) {
    console.error('Error fetching URLs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch URLs' },
      { status: 500 }
    )
  }
}