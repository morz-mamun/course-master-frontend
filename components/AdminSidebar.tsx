"use client"

/**
 * Admin Sidebar Navigation Component
 * Provides navigation for admin dashboard sections
 */

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    BookOpen,
    Users,
    ClipboardList,
    FileText,
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
    SidebarSeparator,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

const navigationItems = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Courses',
        href: '/admin/courses',
        icon: BookOpen,
    },
    {
        title: 'Materials',
        href: '/admin/materials',
        icon: FileText,
    },
    {
        title: 'Enrollments',
        href: '/admin/enrollments',
        icon: Users,
    },
    {
        title: 'Assignments',
        href: '/admin/assignments',
        icon: ClipboardList,
    },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        // Clear auth token
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Redirect to login
        router.push('/login');
    };

    // Get user info from localStorage
    const [user, setUser] = React.useState<{ name?: string; email?: string } | null>(null);

    React.useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                setUser(JSON.parse(userStr));
            } catch (e) {
                console.error('Failed to parse user data');
            }
        }
    }, []);

    return (
        <Sidebar>
            <SidebarHeader className="border-b border-sidebar-border">
                <div className="flex items-center gap-2 px-2 py-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <BookOpen className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-semibold">Course Master</span>
                        <span className="text-xs text-muted-foreground">Admin Panel</span>
                    </div>
                </div>
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

            <SidebarFooter className="border-t border-sidebar-border">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <div className="flex flex-col gap-2 p-2">
                            {user && (
                                <div className="flex items-center gap-2 rounded-md bg-sidebar-accent px-2 py-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <span className="text-sm font-medium truncate">
                                            {user.name || 'Admin User'}
                                        </span>
                                        <span className="text-xs text-muted-foreground truncate">
                                            {user.email || 'admin@example.com'}
                                        </span>
                                    </div>
                                </div>
                            )}
                            <SidebarSeparator />
                            <Button
                                variant="ghost"
                                className="w-full justify-start gap-2"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Logout</span>
                            </Button>
                        </div>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarFooter>
        </Sidebar>
    );
}
