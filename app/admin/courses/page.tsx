"use client"

/**
 * Admin Courses List Page
 * View and manage all courses
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCourses } from '@/contexts/CourseContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react';

function AdminCoursesContent() {
    const router = useRouter();
    const { courses, loading, fetchCourses, deleteCourse } = useCourses();
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        fetchCourses({ limit: 100 });
    }, []);

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
            return;
        }

        setDeleting(id);
        try {
            await deleteCourse(id);
        } catch (error) {
            alert('Failed to delete course');
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Manage Courses</h1>
                        <p className="text-muted-foreground">
                            View and manage all courses on the platform
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

                {/* Courses List */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <LoadingSpinner size="lg" text="Loading courses..." />
                    </div>
                ) : courses.length === 0 ? (
                    <EmptyState
                        icon={<BookOpen className="size-16" />}
                        title="No courses yet"
                        description="Create your first course to get started"
                        action={
                            <Button onClick={() => router.push('/admin/courses/create')} className="gap-2">
                                <Plus className="size-4" />
                                Create Course
                            </Button>
                        }
                    />
                ) : (
                    <div className="space-y-4">
                        {courses.map((course) => (
                            <Card key={course._id} className="p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                                        <p className="text-muted-foreground mb-4 line-clamp-2">
                                            {course.description}
                                        </p>
                                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                            <span className="capitalize">Category: {course.category}</span>
                                            <span>Price: ${course.price.toFixed(2)}</span>
                                            <span>{course.enrollmentCount} students</span>
                                            <span>{course.syllabus.length} lessons</span>
                                            <span>{course.batches.length} batches</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.push(`/admin/courses/edit/${course._id}`)}
                                            className="gap-2"
                                        >
                                            <Edit className="size-4" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(course._id, course.title)}
                                            disabled={deleting === course._id}
                                            className="gap-2"
                                        >
                                            <Trash2 className="size-4" />
                                            {deleting === course._id ? 'Deleting...' : 'Delete'}
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function AdminCoursesPage() {
    return (
        <ProtectedRoute requiredRole="admin">
            <AdminCoursesContent />
        </ProtectedRoute>
    );
}
