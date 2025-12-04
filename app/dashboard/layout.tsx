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
        <SidebarProvider defaultOpen={true}>
            <StudentSidebar />
            <SidebarInset>
                <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger />
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Browse Courses Link */}
                        <Link href="/courses">
                            <Button variant="ghost" size="sm" className="gap-2 hidden sm:flex">
                                <GraduationCap className="h-4 w-4" />
                                Browse Courses
                            </Button>
                        </Link>

                        {/* User Info */}
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{user?.name || 'Student'}</span>
                        </div>

                        {/* Logout Button */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLogout}
                            className="gap-2"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </Button>
                    </div>
                </header>
                <div className="flex flex-1 flex-col overflow-auto max-w-[calc(100%-var(--sidebar-width))] ml-[var(--sidebar-width)]">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
