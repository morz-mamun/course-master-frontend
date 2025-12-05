"use client"

/**
 * My Courses Page
 * Display all enrolled courses with progress tracking
 */

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCourses } from '@/contexts/CourseContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProgressBar from '@/components/ProgressBar';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { BookOpen, ArrowRight, GraduationCap, CheckCircle2, User } from 'lucide-react';
import type { Course, Enrollment } from '@/lib/types';

export default function MyCoursesPage() {
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <LoadingSpinner size="lg" text="Loading your courses..." />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">My Courses</h1>
                    <p className="text-muted-foreground">
                        Track your learning progress and continue where you left off
                    </p>
                </div>
                <Button variant="outline" onClick={() => router.push('/courses')}>
                    <GraduationCap className="size-4 mr-2" />
                    Browse More
                </Button>
            </div>

            {/* Courses Grid */}
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
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {enrolledCourses.map((enrollment) => {
                        const course = getCourse(enrollment);
                        console.log(course);

                        if (!course) return null;

                        const progress = enrollment.progress;
                        const percentage = progress?.percentage || 0;
                        const isCompleted = percentage === 100;

                        return (
                            <Card
                                key={enrollment._id}
                                className="hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer group"
                                onClick={() => router.push(`/dashboard/learn/${course._id}`)}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <Badge variant="secondary" className="capitalize">
                                            {course.category}
                                        </Badge>
                                        {isCompleted && (
                                            <Badge className="bg-green-500 hover:bg-green-600">
                                                <CheckCircle2 className="size-3 mr-1" />
                                                Completed
                                            </Badge>
                                        )}
                                    </div>
                                    <CardTitle className="group-hover:text-primary transition-colors">
                                        {course.title.length > 50 ? course.title.slice(0, 50) + '...' : course.title}
                                    </CardTitle>
                                    <CardDescription className="h-12">
                                        {course.description.length > 120 ? course.description.slice(0, 120) + '...' : course.description || 'No description available'}
                                    </CardDescription>
                                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-2">
                                        <User className="size-4 text-black font-bold" />
                                        Instructor Name:
                                        <span>
                                            {typeof course.instructor === 'string'
                                                ? course.instructor
                                                : course.instructor?.name || 'Unknown Instructor'}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Progress</span>
                                            <span className="font-semibold">{percentage}%</span>
                                        </div>
                                        <ProgressBar percentage={percentage} />
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span>
                                                {progress?.lessonsCompleted || 0} / {progress?.totalLessons || course.syllabus?.length || 0} lessons
                                            </span>
                                            <span className="capitalize">{enrollment.status}</span>
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full gap-2 group/btn"
                                        variant={isCompleted ? "outline" : "default"}
                                    >
                                        {isCompleted ? 'Review Course' : 'Continue Learning'}
                                        <ArrowRight className="size-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
