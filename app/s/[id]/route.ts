import { NextRequest, NextResponse } from 'next/server'
import { getURL } from '@/lib/shorturl-simple'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const url = getURL(id)
    
    if (!url) {
      // Redirect to home if URL not found
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    // Redirect to the full URL
    return NextResponse.redirect(new URL(url.full_url, request.url))
  } catch (error) {
    console.error('Error retrieving short URL:', error)
    return NextResponse.redirect(new URL('/', request.url))
  }
}