import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware for Basic Route Protection
 * Note: With localStorage-based auth, detailed auth checks happen client-side
 * This middleware provides basic route protection only
 */

// Public routes that don't require authentication
const publicRoutes = ['/', '/login', '/register', '/courses'];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if the route is public
    const isPublicRoute = publicRoutes.some(route =>
        pathname === route || pathname.startsWith(`${route}/`)
    );

    // Allow access to public routes
    if (isPublicRoute) {
        return NextResponse.next();
    }

    // For protected routes (/dashboard, /admin, etc.), allow through
    // Auth checks will happen client-side via AuthContext
    // The AuthContext will redirect to /login if not authenticated
    return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (images, etc.)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
    ],
};

