import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ templateId: string }> }
) {
  try {
    const { templateId } = await params;
    
    // Security: validate template ID to prevent directory traversal
    if (!templateId.match(/^[a-zA-Z0-9-]+$/)) {
      return NextResponse.json(
        { error: 'Invalid template ID' },
        { status: 400 }
      );
    }
    
    // Construct the file path
    const filePath = path.join(process.cwd(), 'templates', `${templateId}.ts`);
    
    // Read the file content
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Return the raw content
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache', // Don't cache in development
      },
    });
  } catch (error) {
    console.error('Error reading template file:', error);
    
    if ((error as any).code === 'ENOENT') {
      console.log(`Template not found: ${templateId}`);
      return NextResponse.json(
        { error: `Template '${templateId}' not found` },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}