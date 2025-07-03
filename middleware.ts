import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes
const protectedRoutes = ['/settings'];
const protectedApiRoutes = ['/api/user'];

export function middleware(request: NextRequest) {
  // AUTH TEMPORARILY DISABLED
  return NextResponse.next();
  
  /* 
  const { pathname } = request.nextUrl;
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isProtectedApiRoute = protectedApiRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute || isProtectedApiRoute) {
    // Check for session cookie (Better Auth uses httpOnly cookies)
    const sessionCookie = request.cookies.get('better-auth.session');
    
    if (!sessionCookie) {
      // Redirect to sign-in page for protected routes
      if (isProtectedRoute) {
        const signInUrl = new URL('/sign-in', request.url);
        signInUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(signInUrl);
      }
      
      // Return 401 for protected API routes
      if (isProtectedApiRoute) {
        return new NextResponse('Unauthorized', { status: 401 });
      }
    }
  }
  
  return NextResponse.next();
  */
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};