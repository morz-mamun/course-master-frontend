"use client"

/**
 * Admin Dashboard Home Page
 * Displays overview statistics and quick actions
 */

import React, { useEffect, useState } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingSpinner from '@/components/LoadingSpinner';
import { BookOpen, Users, ClipboardList, TrendingUp, Plus, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { adminService } from '@/services/admin.service';

interface DashboardStats {
    totalCourses: number;
    totalStudents: number;
    totalEnrollments: number;
    totalAssignments: number;
}

function AdminDashboardContent() {
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStats>({
        totalCourses: 0,
        totalStudents: 0,
        totalEnrollments: 0,
        totalAssignments: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            // Fetch stats from API
            const data = await adminService.getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch dashboard stats:', error);
            // Set default values on error
            setStats({
                totalCourses: 0,
                totalStudents: 0,
                totalEnrollments: 0,
                totalAssignments: 0,
            });
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Total Courses',
            value: stats.totalCourses,
            description: 'Active courses on platform',
            icon: BookOpen,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
            href: '/admin/courses',
        },
        {
            title: 'Total Students',
            value: stats.totalStudents,
            description: 'Registered students',
            icon: Users,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
            href: '/admin/enrollments',
        },
        {
            title: 'Total Enrollments',
            value: stats.totalEnrollments,
            description: 'Course enrollments',
            icon: TrendingUp,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
            href: '/admin/enrollments',
        },
        {
            title: 'Total Assignments',
            value: stats.totalAssignments,
            description: 'Assignments created',
            icon: ClipboardList,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
            href: '/admin/assignments',
        },
    ];

    const quickActions = [
        {
            title: 'Create Course',
            description: 'Add a new course to the platform',
            icon: BookOpen,
            href: '/admin/courses/create',
        },
        {
            title: 'View Enrollments',
            description: 'Manage student enrollments',
            icon: Users,
            href: '/admin/enrollments',
        },
        {
            title: 'Manage Assignments',
            description: 'Create and review assignments',
            icon: ClipboardList,
            href: '/admin/assignments',
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <LoadingSpinner size="lg" text="Loading dashboard..." />
            </div>
        );
    }

    return (
        <div className="bg-background">
            <header className="sticky top-0 z-50 w-full border-b border-border bg-card">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                            <h2 className="text-xl font-bold">Admin Dashboar</h2>
                            <p>
                                Welcome back!  Manage courses, students, and assignments from one place.
                            </p>
                        </div>
                    </div>
                </div>
            </header>
            <main className="container mx-auto px-4 py-8 space-y-8">
                {/* Stats Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((stat) => (
                        <Card
                            key={stat.title}
                            className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]"
                            onClick={() => router.push(stat.href)}
                        >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat?.title}</CardTitle>
                                <div className={`p-2 rounded-lg ${stat?.bgColor}`}>
                                    <stat.icon className={`h-4 w-4 ${stat?.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat?.value}</div>
                                <p className="text-xs text-muted-foreground mt-1">{stat?.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                {/* Quick Actions */}
                <div className="space-y-4">
                    <h2 className="text-xl md:text-2xl font-bold">Quick Actions</h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {quickActions.map((action) => (
                            <Card
                                key={action.title}
                                className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]"
                                onClick={() => router.push(action.href)}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                            <action.icon className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className="text-base">{action?.title}</CardTitle>
                                            <CardDescription className="text-xs mt-1">{action?.description}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </div>
                {/* Recent Activity Section - Placeholder */}
                <div className="space-y-4">
                    <h2 className="text-xl md:text-2xl font-bold">Recent Activity</h2>
                    <Card>
                        <CardContent className="py-12">
                            <p className="text-center text-muted-foreground">
                                No recent activity to display
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}

export default function AdminDashboardPage() {
    return <AdminDashboardContent />;
}
