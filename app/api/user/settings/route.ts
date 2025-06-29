import { auth, currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  const { userId } = await auth();
  
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await request.json();
    const { openaiApiKey } = body;

    // Update user's public metadata with API key
    // Note: In production, you might want to encrypt this
    await clerkClient().users.updateUser(userId, {
      publicMetadata: {
        openaiApiKey: openaiApiKey || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating user settings:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function GET() {
  const { userId } = await auth();
  
  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const user = await currentUser();
    
    return NextResponse.json({
      openaiApiKey: user?.publicMetadata?.openaiApiKey || null,
    });
  } catch (error) {
    console.error('Error fetching user settings:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}