"use client"

/**
 * Course Details Page
 * Display detailed information about a specific course
 */

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCourses } from '@/contexts/CourseContext';
import { useAuth } from '@/contexts/AuthContext';
import { enrollInCourse } from '@/services/student.service';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Clock, Users, DollarSign, Calendar, CheckCircle2 } from 'lucide-react';
import type { Course } from '@/lib/types';

export default function CourseDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { fetchCourseById } = useCourses();
    const { isAuthenticated, isStudent } = useAuth();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        loadCourse();
    }, [params.id]);

    const loadCourse = async () => {
        try {
            const courseData = await fetchCourseById(params.id as string);
            setCourse(courseData);
            if (courseData.batches.length > 0) {
                setSelectedBatch(courseData.batches[0].batchId);
            }
        } catch (err) {
            setError('Failed to load course');
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async () => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (!selectedBatch) {
            setError('Please select a batch');
            return;
        }

        setEnrolling(true);
        setError('');

        try {
            await enrollInCourse({
                courseId: course!._id,
                batchId: selectedBatch,
            });
            setSuccess('Successfully enrolled! Redirecting to dashboard...');
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Enrollment failed');
        } finally {
            setEnrolling(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" text="Loading course..." />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
                    <Button onClick={() => router.push('/courses')}>
                        Browse Courses
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <Badge className="mb-4 capitalize">{course.category}</Badge>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
                            <p className="text-lg text-muted-foreground">{course.description}</p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 text-sm">
                                <Users className="size-4 text-muted-foreground" />
                                <span>{course.enrollmentCount} students enrolled</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="size-4 text-muted-foreground" />
                                <span>{course.syllabus.length} lessons</span>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                            {course.tags.map((tag) => (
                                <Badge key={tag} variant="outline">{tag}</Badge>
                            ))}
                        </div>

                        {/* Syllabus */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Course Syllabus</CardTitle>
                                <CardDescription>
                                    {course.syllabus.length} lessons in this course
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {course.syllabus.map((lesson, index) => (
                                        <div key={lesson.lessonId} className="flex items-start gap-3 p-3 rounded-lg border">
                                            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                <span className="text-sm font-semibold text-primary">{index + 1}</span>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium">{lesson.title}</h4>
                                                {lesson.description && (
                                                    <p className="text-sm text-muted-foreground mt-1">{lesson.description}</p>
                                                )}
                                                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                                    <Clock className="size-3" />
                                                    <span>{lesson.duration} minutes</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-20">
                            <CardHeader>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2 text-3xl font-bold">
                                        <DollarSign className="size-6" />
                                        {course.price.toFixed(2)}
                                    </div>
                                </div>
                                <CardTitle>Enroll in this course</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {error && (
                                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20">
                                        {error}
                                    </div>
                                )}

                                {success && (
                                    <div className="bg-green-500/10 text-green-600 dark:text-green-400 text-sm p-3 rounded-md border border-green-500/20 flex items-center gap-2">
                                        <CheckCircle2 className="size-4" />
                                        {success}
                                    </div>
                                )}

                                {course.batches.length > 0 ? (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Select Batch</label>
                                            <select
                                                value={selectedBatch}
                                                onChange={(e) => setSelectedBatch(e.target.value)}
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                            >
                                                {course.batches.map((batch) => (
                                                    <option key={batch.batchId} value={batch.batchId}>
                                                        {new Date(batch.startDate).toLocaleDateString()} - {new Date(batch.endDate).toLocaleDateString()}
                                                        {batch.enrolledCount !== undefined && ` (${batch.capacity - batch.enrolledCount} spots left)`}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <Button
                                            className="w-full"
                                            onClick={handleEnroll}
                                            disabled={enrolling || !isStudent}
                                        >
                                            {enrolling ? 'Enrolling...' : 'Enroll Now'}
                                        </Button>

                                        {!isAuthenticated && (
                                            <p className="text-xs text-center text-muted-foreground">
                                                Please login to enroll
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        No batches available at the moment
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
