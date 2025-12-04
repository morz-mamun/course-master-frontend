"use client"

/**
 * Student Sidebar Navigation Component
 * Provides navigation for student dashboard sections
 */

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    BookOpen,
    GraduationCap,
    LogOut,
    User,
} from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarSeparator,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const navigationItems = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        description: 'Overview & Stats',
    },
    {
        title: 'My Courses',
        href: '/dashboard/courses',
        icon: BookOpen,
        description: 'Enrolled Courses',
    }
];

export function StudentSidebar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const handleLogout = () => {
        // Clear auth token
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Redirect to login
        router.push('/login');
    };

    return (
        <Sidebar>
            <SidebarHeader className="border-b">
                <Link href="/">
                    <div className="flex items-center gap-2 px-4 py-1">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <BookOpen className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-semibold">Course Master</span>
                        </div>
                    </div>
                </Link>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigationItems.map((item) => {
                                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                                return (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                                            <Link href={item.href}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <div className="flex items-center justify-between px-4 py-2">
                    <div className="flex items-center gap-2">
                        <div className="relative h-8 w-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-700">
                            {user?.name?.charAt(0) || "F"}
                        </div>

                        <div className="flex flex-col">
                            <span className="text-sm font-medium">{user?.name}</span>
                            <span className="text-xs text-muted-foreground capitalize">
                                {user?.role}
                            </span>
                        </div>
                    </div>
                </div>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
