"use client"

/**
 * Admin Layout
 * Wraps all admin pages with sidebar navigation
 */

import React from 'react'
import { SidebarProvider } from '@/components/ui/sidebar';
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
