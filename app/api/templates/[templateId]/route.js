import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request, { params }) {
  try {
    const { templateId } = await params;
    
    // Security: validate template ID to prevent directory traversal
    if (!templateId.match(/^[a-zA-Z0-9-]+$/)) {
      return NextResponse.json(
        { error: 'Invalid template ID' },
        { status: 400 }
      );
    }
    
    // Try JavaScript template first
    const jsPath = path.join(process.cwd(), 'templates-js', `${templateId}.js`);
    
    try {
      const content = await fs.readFile(jsPath, 'utf-8');
      return new NextResponse(content, {
        headers: {
          'Content-Type': 'application/javascript',
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        },
      });
    } catch (error) {
      // Fall back to TypeScript template for now (during migration)
      const tsPath = path.join(process.cwd(), 'templates', `${templateId}.ts`);
      const content = await fs.readFile(tsPath, 'utf-8');
      
      // Return raw TypeScript (will need compilation)
      return new NextResponse(content, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-Template-Type': 'typescript', // Indicate this needs compilation
        },
      });
    }
  } catch (error) {
    console.error('Error reading template file:', error);
    
    if (error.code === 'ENOENT') {
      return NextResponse.json(
        { error: `Template '${params.templateId}' not found` },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}