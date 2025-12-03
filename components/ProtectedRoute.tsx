"use client"

/**
 * Protected Route Component
 * Wrapper for routes that require authentication
 */

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { UserRole } from '@/lib/types';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: UserRole;
}

export default function ProtectedRoute({
    children,
    requiredRole
}: ProtectedRouteProps) {
    const { user, loading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            // Not authenticated - redirect to login
            if (!isAuthenticated) {
                router.push('/login');
                return;
            }

            // Check role if required
            if (requiredRole && user?.role !== requiredRole) {
                // Redirect based on user role
                if (user?.role === 'admin') {
                    router.push('/admin/dashboard');
                } else {
                    router.push('/dashboard');
                }
            }
        }
    }, [loading, isAuthenticated, user, requiredRole, router]);

    // Show loading while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" text="Loading..." />
            </div>
        );
    }

    // Not authenticated
    if (!isAuthenticated) {
        return null;
    }

    // Wrong role
    if (requiredRole && user?.role !== requiredRole) {
        return null;
    }

    // Authenticated and authorized
    return <>{children}</>;
}
