import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/public(.*)',
  // For now, keep the main app public
  // Users can try it without signing up
]);

// Define API routes that should be protected
const isProtectedApiRoute = createRouteMatcher([
  '/api/ai-brand-consultant',
  '/api/ai-suggestions',
  '/api/user(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // Only protect specific API routes that need user context
  if (isProtectedApiRoute(req)) {
    await auth.protect();
  }
  
  // Protect user settings pages
  if (req.nextUrl.pathname.startsWith('/settings')) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};