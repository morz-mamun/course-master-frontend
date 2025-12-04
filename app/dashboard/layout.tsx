"use client"

/**
 * Dashboard Layout
 * Wraps dashboard pages with sidebar navigation
 */

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { StudentSidebar } from '@/components/StudentSidebar';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { GraduationCap, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import StudentDashboardHeader from '@/components/shared/StudentDashboardHeader';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logout();
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <SidebarProvider>
            <div className="w-[100%] border flex min-h-screen flex-col">
                <div className="flex flex-1">
                    <StudentSidebar />
                    <main className="flex-1">
                        <StudentDashboardHeader />
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider >
    );
}
