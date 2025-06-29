import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import Database from 'better-sqlite3';

// Initialize database connection
const db = new Database('./recast-auth.db');

export async function POST(request: Request) {
  // Get session from Better Auth
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await request.json();
    const { openaiApiKey } = body;

    // Update user's openaiApiKey in the database
    const stmt = db.prepare(`
      UPDATE user 
      SET openaiApiKey = ? 
      WHERE id = ?
    `);
    
    stmt.run(openaiApiKey || null, session.user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user settings:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET() {
  // Get session from Better Auth
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Get user's openaiApiKey from the database
    const stmt = db.prepare(`
      SELECT openaiApiKey 
      FROM user 
      WHERE id = ?
    `);
    
    const user = stmt.get(session.user.id) as { openaiApiKey: string | null } | undefined;
    
    return NextResponse.json({
      openaiApiKey: user?.openaiApiKey || null,
    });
  } catch (error) {
    console.error('Error fetching user settings:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}