"use client"

/**
 * Edit Course Page
 * Form to edit an existing course
 */

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCourses } from '@/contexts/CourseContext';
import { getCourseById } from '@/services/course.service';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Loader2, ArrowLeft } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { Lesson, Batch } from '@/lib/types';

function EditCourseContent() {
    const router = useRouter();
    const params = useParams();
    const courseId = params.id as string;
    const { updateCourse } = useCourses();

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: 0,
        category: '',
        tags: '',
    });

    const [syllabus, setSyllabus] = useState<Lesson[]>([]);
    const [batches, setBatches] = useState<Batch[]>([]);

    useEffect(() => {
        const loadCourse = async () => {
            try {
                const { course } = await getCourseById(courseId);
                setFormData({
                    title: course.title,
                    description: course.description,
                    price: course.price,
                    category: course.category,
                    tags: course.tags.join(', '),
                });
                setSyllabus(course.syllabus || []);

                // Format dates for input type="date"
                const formattedBatches = (course.batches || []).map(batch => ({
                    ...batch,
                    startDate: new Date(batch.startDate).toISOString().split('T')[0],
                    endDate: new Date(batch.endDate).toISOString().split('T')[0],
                }));
                setBatches(formattedBatches);
            } catch (err) {
                setError('Failed to load course details');
                console.error(err);
            } finally {
                setFetching(false);
            }
        };

        if (courseId) {
            loadCourse();
        }
    }, [courseId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await updateCourse(courseId, {
                ...formData,
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
                syllabus: syllabus.filter(l => l.title),
                batches: batches.filter(b => b.startDate && b.endDate).map(b => ({
                    ...b,
                    startDate: new Date(b.startDate).toISOString(),
                    endDate: new Date(b.endDate).toISOString()
                })),
            });
            router.push('/admin/courses');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to update course');
        } finally {
            setLoading(false);
        }
    };

    const addLesson = () => {
        setSyllabus([...syllabus, {
            lessonId: `lesson-${syllabus.length + 1}`,
            title: '',
            duration: 30,
            description: '',
            videoUrl: ''
        }]);
    };

    const removeLesson = (index: number) => {
        setSyllabus(syllabus.filter((_, i) => i !== index));
    };

    const updateLesson = (index: number, field: keyof Lesson, value: any) => {
        const updated = [...syllabus];
        updated[index] = { ...updated[index], [field]: value };
        setSyllabus(updated);
    };

    const addBatch = () => {
        setBatches([...batches, {
            batchId: `batch-${batches.length + 1}`,
            startDate: '',
            endDate: '',
            capacity: 30
        }]);
    };

    const removeBatch = (index: number) => {
        setBatches(batches.filter((_, i) => i !== index));
    };

    const updateBatch = (index: number, field: keyof Batch, value: any) => {
        const updated = [...batches];
        updated[index] = { ...updated[index], [field]: value };
        setBatches(updated);
    };

    if (fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" text="Loading course details..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <Button
                    variant="default"
                    onClick={() => router.push('/admin/courses')}
                    className="mb-6"
                >
                    <ArrowLeft className="size-4" />
                    Back to Courses
                </Button>

                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Edit Course</h1>
                    <p className="text-muted-foreground">
                        Update course details, syllabus, and batches
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20">
                            {error}
                        </div>
                    )}

                    {/* Basic Information */}
                    <Card>
                        <CardHeader className='px-3'>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 p-3">
                            <div>
                                <label className="text-sm font-medium mb-2 block">Course Title</label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    placeholder="e.g., Advanced React Patterns"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-2 block">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                    placeholder="Describe what students will learn..."
                                    className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Price ($)</label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-2 block">Category</label>
                                    <Input
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        required
                                        placeholder="e.g., programming"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-2 block">Tags (comma-separated)</label>
                                <Input
                                    value={formData.tags}
                                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    placeholder="react, javascript, frontend"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Syllabus */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between px-3">
                            <CardTitle>Syllabus</CardTitle>
                            <Button type="button" onClick={addLesson} size="sm" variant="outline" className="gap-2">
                                <Plus className="size-4" />
                                Add Lesson
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4 px-3">
                            {syllabus.map((lesson, index) => (
                                <div key={index} className="p-4 border rounded-lg space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">Lesson {index + 1}</span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeLesson(index)}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>

                                    <Input
                                        placeholder="Lesson title"
                                        value={lesson.title}
                                        onChange={(e) => updateLesson(index, 'title', e.target.value)}
                                    />

                                    <Input
                                        placeholder="Description"
                                        value={lesson.description}
                                        onChange={(e) => updateLesson(index, 'description', e.target.value)}
                                    />

                                    <div className="grid sm:grid-cols-2 gap-3">
                                        <Input
                                            type="number"
                                            placeholder="Duration (minutes)"
                                            value={lesson.duration}
                                            onChange={(e) => updateLesson(index, 'duration', parseInt(e.target.value))}
                                        />
                                        <Input
                                            placeholder="Video URL (optional)"
                                            value={lesson.videoUrl}
                                            onChange={(e) => updateLesson(index, 'videoUrl', e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Batches */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between px-3">
                            <CardTitle>Batches</CardTitle>
                            <Button type="button" onClick={addBatch} size="sm" variant="outline" className="gap-2">
                                <Plus className="size-4" />
                                Add Batch
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4 px-3">
                            {batches.map((batch, index) => (
                                <div key={index} className="p-4 border rounded-lg space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">Batch {index + 1}</span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeBatch(index)}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>

                                    <div className="grid sm:grid-cols-3 gap-3">
                                        <div>
                                            <label className="text-xs text-muted-foreground mb-1 block">Start Date</label>
                                            <Input
                                                type="date"
                                                value={batch.startDate}
                                                onChange={(e) => updateBatch(index, 'startDate', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-muted-foreground mb-1 block">End Date</label>
                                            <Input
                                                type="date"
                                                value={batch.endDate}
                                                onChange={(e) => updateBatch(index, 'endDate', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-muted-foreground mb-1 block">Capacity</label>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={batch.capacity}
                                                onChange={(e) => updateBatch(index, 'capacity', parseInt(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <Button type="submit" disabled={loading} className="flex-1">
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 size-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                'Update Course'
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push('/admin/courses')}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function EditCoursePage() {
    return <EditCourseContent />;
}
