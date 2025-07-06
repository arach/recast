import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    
    // Security: validate filename
    if (!filename.match(/^[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.(js|json)$/)) {
      return NextResponse.json(
        { error: 'Invalid filename' },
        { status: 400 }
      );
    }
    
    // Read file from templates-js directory
    const filePath = path.join(process.cwd(), 'templates-js', filename);
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Set appropriate content type
    const contentType = filename.endsWith('.json') 
      ? 'application/json' 
      : 'application/javascript';
    
    return new NextResponse(content, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error reading template file:', error);
    
    if (error.code === 'ENOENT') {
      const { filename } = await params;
      return NextResponse.json(
        { error: `File not found: ${filename}` },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}