"use client"

/**
 * Student Dashboard
 * Display enrolled courses and progress
 */

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCourses } from '@/contexts/CourseContext';
import { useAuth } from '@/contexts/AuthContext';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProgressBar from '@/components/ProgressBar';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { BookOpen, ArrowRight } from 'lucide-react';
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

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        Welcome back, {user?.name}!
                    </h1>
                    <p className="text-muted-foreground">
                        Continue your learning journey
                    </p>
                </div>

                {/* Enrolled Courses */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <LoadingSpinner size="lg" text="Loading your courses..." />
                    </div>
                ) : enrolledCourses.length === 0 ? (
                    <EmptyState
                        icon={<BookOpen className="size-16" />}
                        title="No enrolled courses yet"
                        description="Start learning by enrolling in a course"
                        action={
                            <Button onClick={() => router.push('/courses')}>
                                Browse Courses
                            </Button>
                        }
                    />
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {enrolledCourses.map((enrollment) => {
                            const course = getCourse(enrollment);
                            if (!course) return null;

                            const progress = enrollment.progress;
                            const percentage = progress?.percentage || 0;

                            return (
                                <Card key={enrollment._id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <CardTitle className="line-clamp-2">{course?.title}</CardTitle>
                                        <CardDescription className="h-12">
                                            {`${course?.description?.length > 120 ? course?.description?.slice(0, 120) + '...' : course?.description}` || 'No description available'}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <ProgressBar percentage={percentage} />

                                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                                            <span>
                                                {progress?.lessonsCompleted || 0} / {progress?.totalLessons || course.syllabus.length} lessons
                                            </span>
                                            <span className="capitalize">{enrollment.status}</span>
                                        </div>

                                        <Button
                                            className="w-full gap-2 group"
                                            onClick={() => router.push(`/learn/${course._id}`)}
                                        >
                                            Continue Learning
                                            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {/* Quick Actions */}
                {enrolledCourses.length > 0 && (
                    <div className="mt-12 text-center">
                        <p className="text-muted-foreground mb-4">
                            Looking for more courses?
                        </p>
                        <Button variant="outline" onClick={() => router.push('/courses')}>
                            Browse All Courses
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return <DashboardContent />;
}
