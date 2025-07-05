import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params
    
    // Validate filename to prevent path traversal
    if (!filename || filename.includes('..') || filename.includes('/')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
    }
    
    // Read from templates-js directory in the project root
    const filePath = join(process.cwd(), 'templates-js', filename)
    const content = await readFile(filePath, 'utf-8')
    
    // Set appropriate content type
    const contentType = filename.endsWith('.json') 
      ? 'application/json' 
      : 'application/javascript'
    
    return new NextResponse(content, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    })
  } catch (error) {
    console.error('Error reading template file:', error)
    return NextResponse.json(
      { error: 'Template file not found' }, 
      { status: 404 }
    )
  }
}