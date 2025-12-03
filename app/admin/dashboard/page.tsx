"use client"

/**
 * Admin Dashboard
 * Overview and quick actions for administrators
 */

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCourses } from '@/contexts/CourseContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus, Users, TrendingUp } from 'lucide-react';

function AdminDashboardContent() {
    const router = useRouter();
    const { courses, fetchCourses } = useCourses();

    useEffect(() => {
        fetchCourses({ limit: 100 });
    }, []);

    const totalEnrollments = courses.reduce((sum, course) => sum + course.enrollmentCount, 0);
    const averagePrice = courses.length > 0
        ? courses.reduce((sum, course) => sum + course.price, 0) / courses.length
        : 0;

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
                        <p className="text-muted-foreground">
                            Manage your courses and track performance
                        </p>
                    </div>
                    <Button
                        onClick={() => router.push('/admin/courses/create')}
                        className="gap-2"
                    >
                        <Plus className="size-4" />
                        Create Course
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                            <BookOpen className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{courses.length}</div>
                            <p className="text-xs text-muted-foreground">
                                Active courses on platform
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
                            <Users className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalEnrollments}</div>
                            <p className="text-xs text-muted-foreground">
                                Students enrolled
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
                            <TrendingUp className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${averagePrice.toFixed(2)}</div>
                            <p className="text-xs text-muted-foreground">
                                Per course
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Categories</CardTitle>
                            <BookOpen className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {new Set(courses.map(c => c.category)).size}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Unique categories
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 gap-6">
                    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/admin/courses')}>
                        <CardHeader>
                            <CardTitle>Manage Courses</CardTitle>
                            <CardDescription>
                                View, edit, and delete existing courses
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full">
                                View All Courses
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/admin/courses/create')}>
                        <CardHeader>
                            <CardTitle>Create New Course</CardTitle>
                            <CardDescription>
                                Add a new course to the platform
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full gap-2">
                                <Plus className="size-4" />
                                Create Course
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default function AdminDashboardPage() {
    return (
        <ProtectedRoute requiredRole="admin">
            <AdminDashboardContent />
        </ProtectedRoute>
    );
}
