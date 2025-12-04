"use client"

/**
 * Admin Layout
 * Wraps all admin pages with sidebar navigation
 */

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { BookOpen, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AdminSidebar from '@/components/AdminSidebar';
import AdminDashboardHeader from '@/components/shared/AdminDashboardHeader';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <SidebarProvider>
            <div className="w-[100%] border flex min-h-screen flex-col">
                <div className="flex flex-1">
                    <AdminSidebar />
                    <main className="flex-1">
                        <AdminDashboardHeader />
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
