"use client"

/**
 * Student Dashboard
 * Display enrolled courses and progress with enhanced UI
 */

import React, { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCourses } from '@/contexts/CourseContext';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { BookOpen, ArrowRight, GraduationCap, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import type { Course, Enrollment } from '@/lib/types';

function DashboardContent() {
    const router = useRouter();
    const { user } = useAuth();
    const { enrolledCourses, loading, fetchEnrolledCourses } = useCourses();

    useEffect(() => {
        fetchEnrolledCourses();
    }, []);

    const getCourse = (enrollment: Enrollment): Course | null => {
        if (typeof enrollment.courseId === 'object') {
            return enrollment.courseId as Course;
        }
        return null;
    };

    // Calculate dashboard stats
    const stats = useMemo(() => {
        const totalEnrolled = enrolledCourses.length;
        const completed = enrolledCourses.filter(e => e.progress?.percentage === 100).length;
        const inProgress = enrolledCourses.filter(e => (e.progress?.percentage || 0) > 0 && (e.progress?.percentage || 0) < 100).length;
        const avgProgress = totalEnrolled > 0
            ? Math.round(enrolledCourses.reduce((sum, e) => sum + (e.progress?.percentage || 0), 0) / totalEnrolled)
            : 0;

        return { totalEnrolled, completed, inProgress, avgProgress };
    }, [enrolledCourses]);

    const statCards = [
        {
            title: 'Enrolled Courses',
            value: stats.totalEnrolled,
            description: 'Total courses enrolled',
            icon: BookOpen,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
        },
        {
            title: 'Completed',
            value: stats.completed,
            description: 'Courses completed',
            icon: CheckCircle2,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
        },
        {
            title: 'In Progress',
            value: stats.inProgress,
            description: 'Currently learning',
            icon: Clock,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100',
        },
        {
            title: 'Average Progress',
            value: `${stats.avgProgress}%`,
            description: 'Overall completion',
            icon: TrendingUp,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
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
            <header className="container mx-auto bg-card mt-6">
                <div className="px-3">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Student Dashboard</h1>
                    <p className="text-muted-foreground">
                        <span> Welcome back! {user?.name}! 👋</span>
                        <br />
                        <span>Track your progress and manage your courses from one place.</span>
                    </p>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 space-y-8">
                {enrolledCourses.length === 0 ? (
                    <EmptyState
                        icon={<BookOpen className="size-16" />}
                        title="No enrolled courses yet"
                        description="Start your learning journey by enrolling in a course"
                        action={
                            <Button onClick={() => router.push('/courses')} size="lg">
                                <GraduationCap className="size-4 mr-2" />
                                Browse Courses
                            </Button>
                        }
                    />
                ) : (
                    <>
                        {/* Stats Cards */}
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {statCards.map((stat) => (
                                <Card key={stat.title} className="hover:shadow-lg transition-all">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                        <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{stat.value}</div>
                                        <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Quick Actions */}
                        <div className="space-y-4">
                            <h2 className="text-xl md:text-2xl font-bold">Quick Actions</h2>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <Card
                                    className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]"
                                    onClick={() => router.push('/dashboard/courses')}
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-primary/10">
                                                <BookOpen className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <CardTitle className="text-base">My Courses</CardTitle>
                                                <CardDescription className="text-xs mt-1">
                                                    View all enrolled courses
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                </Card>
                                <Card
                                    className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]"
                                    onClick={() => {
                                        const inProgressCourse = enrolledCourses.find(e =>
                                            (e.progress?.percentage || 0) > 0 && (e.progress?.percentage || 0) < 100
                                        );
                                        if (inProgressCourse) {
                                            const course = getCourse(inProgressCourse);
                                            if (course) router.push(`/dashboard/learn/${course._id}`);
                                        }
                                    }}
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-orange-100">
                                                <Clock className="h-5 w-5 text-orange-600" />
                                            </div>
                                            <div className="flex-1">
                                                <CardTitle className="text-base">Continue Learning</CardTitle>
                                                <CardDescription className="text-xs mt-1">
                                                    Resume your in-progress courses
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                </Card>

                                <Card
                                    className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]"
                                    onClick={() => {
                                        const completedCourse = enrolledCourses.find(e => e.progress?.percentage === 100);
                                        if (completedCourse) {
                                            const course = getCourse(completedCourse);
                                            if (course) router.push(`/dashboard/learn/${course._id}`);
                                        }
                                    }}
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-green-100">
                                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                            </div>
                                            <div className="flex-1">
                                                <CardTitle className="text-base">Completed Courses</CardTitle>
                                                <CardDescription className="text-xs mt-1">
                                                    Review your completed courses
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                </Card>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default function DashboardPage() {
    return <DashboardContent />;
}
