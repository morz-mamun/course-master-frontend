import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Proxy for Route Protection with Role-Based Access Control
 * Protects routes based on authentication cookie and user role
 */

// Define route patterns and their required roles
const routeConfig = {
    // Admin-only routes
    admin: ['/admin'],
    // Student-only routes
    student: ['/dashboard', '/learn'],
    // Any authenticated user
    authenticated: ['/dashboard', '/learn', '/admin'],
};

// Public routes that don't require authentication
const publicRoutes = ['/', '/login', '/register', '/courses'];

// API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Verify user authentication and role by calling the backend
 */
async function verifyUser(token: string): Promise<{ authenticated: boolean; role?: string }> {
    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: {
                'Cookie': `token=${token}`,
            },
            credentials: 'include',
        });

        if (!response.ok) {
            return { authenticated: false };
        }

        const data = await response.json();
        return {
            authenticated: true,
            role: data.user?.role,
        };
    } catch (error) {
        console.error('Error verifying user:', error);
        return { authenticated: false };
    }
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get the token from cookies
    const token = request.cookies.get('token')?.value;

    // Check if the route is public
    const isPublicRoute = publicRoutes.some(route =>
        pathname === route || pathname.startsWith(`${route}/`)
    );

    // If it's a public route, allow access
    if (isPublicRoute && pathname !== '/login' && pathname !== '/register') {
        return NextResponse.next();
    }

    // Check if the route requires authentication
    const isProtectedRoute = routeConfig.authenticated.some(route =>
        pathname.startsWith(route)
    );

    // If it's a protected route and user is not authenticated, redirect to login
    if (isProtectedRoute && !token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // If user is authenticated and tries to access login/register, redirect to dashboard
    if (token && (pathname === '/login' || pathname === '/register')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // For admin routes, verify the user's role
    const isAdminRoute = routeConfig.admin.some(route =>
        pathname.startsWith(route)
    );

    if (isAdminRoute && token) {
        // Verify user role by calling the backend
        const { authenticated, role } = await verifyUser(token);

        if (!authenticated) {
            // Token is invalid, redirect to login
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }

        if (role !== 'admin') {
            // User is not an admin, redirect to their dashboard
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

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
