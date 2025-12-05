"use client"

/**
 * Admin Enrollments Page
 * View and manage student enrollments
 */

import React, { useEffect, useState, useMemo } from 'react';
import { getAllEnrollments } from '@/services/student.service';
import { getAllCourses } from '@/services/course.service';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { Users, Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function AdminEnrollmentsContent() {
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState<string>('');
    const [selectedBatch, setSelectedBatch] = useState<string>('');

    useEffect(() => {
        const loadData = async () => {
            try {
                const [enrollmentsData, coursesData] = await Promise.all([
                    getAllEnrollments(),
                    getAllCourses({ page: 1, limit: 100 })
                ]);
                setEnrollments(enrollmentsData.enrollments);
                setCourses(coursesData.data);
            } catch (error) {
                console.error('Failed to load data', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // Get unique batches from all enrollments
    const availableBatches = useMemo(() => {
        const batches = new Set<string>();
        enrollments.forEach(e => batches.add(e.batchId));
        return Array.from(batches).sort();
    }, [enrollments]);

    // Filter enrollments based on selected course and batch
    const filteredEnrollments = useMemo(() => {
        return enrollments.filter(enrollment => {
            const matchesCourse = !selectedCourse ||
                (enrollment.courseId?._id === selectedCourse || enrollment.courseId === selectedCourse);
            const matchesBatch = !selectedBatch || enrollment.batchId === selectedBatch;
            return matchesCourse && matchesBatch;
        });
    }, [enrollments, selectedCourse, selectedBatch]);

    return (
        <div className="container mx-auto px-3 sm:px-4 py-6 md:py-8 max-w-6xl">
            <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Enrollment Management</h1>
                <p className="text-sm md:text-base text-muted-foreground">
                    View and filter student enrollments by course and batch
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" text="Loading enrollments..." />
                </div>
            ) : filteredEnrollments.length === 0 ? (
                <EmptyState
                    icon={<Users className="size-16" />}
                    title={enrollments.length === 0 ? "No enrollments yet" : "No matching enrollments"}
                    description={enrollments.length === 0
                        ? "Students will appear here once they enroll in courses"
                        : "Try adjusting your filters"}
                    action={
                        <Button
                            asChild
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <Link href="/admin/enrollments">
                                Add Enrollment
                            </Link>
                        </Button>
                    }
                />
            ) : (
                <Card>
                    <CardHeader className="px-3 md:px-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <CardTitle>Enrollments ({filteredEnrollments.length})</CardTitle>
                        </div>

                        {/* Filters */}
                        <div className="grid sm:grid-cols-2 gap-4 pt-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Filter className="size-4" />
                                    Filter by Course
                                </label>
                                <select
                                    value={selectedCourse}
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                >
                                    <option value="">All Courses</option>
                                    {courses.map((course) => (
                                        <option key={course._id} value={course._id}>
                                            {course.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Filter className="size-4" />
                                    Filter by Batch</label>
                                <select
                                    value={selectedBatch}
                                    onChange={(e) => setSelectedBatch(e.target.value)}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                >
                                    <option value="">All Batches</option>
                                    {availableBatches.map((batch) => (
                                        <option key={batch} value={batch}>
                                            {batch}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {(selectedCourse || selectedBatch) && (
                            <div className="text-sm text-muted-foreground">
                                Showing {filteredEnrollments.length} of {enrollments.length} enrollments
                            </div>
                        )}
                    </CardHeader>
                    <CardContent className="px-0 md:px-6">
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[200px]">Student</TableHead>
                                        <TableHead className="hidden md:table-cell">Course</TableHead>
                                        <TableHead className="hidden sm:table-cell">Batch</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="hidden lg:table-cell">Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredEnrollments.map((enrollment) => (
                                        <TableRow key={enrollment._id}>
                                            <TableCell>
                                                <div className="font-medium">{enrollment.studentId?.name || 'Unknown'}</div>
                                                <div className="text-sm text-muted-foreground md:hidden">
                                                    {enrollment.courseId?.title || 'Unknown Course'}
                                                </div>
                                                <div className="text-xs text-muted-foreground sm:hidden mt-1">
                                                    <Badge variant="outline" className="text-xs">{enrollment.batchId}</Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {enrollment.courseId?.title || 'Unknown Course'}
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <Badge variant="outline">{enrollment.batchId}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={
                                                    enrollment.status === 'active' ? 'bg-green-500' :
                                                        enrollment.status === 'completed' ? 'bg-blue-500' : 'bg-gray-500'
                                                }>
                                                    {enrollment.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="size-4" />
                                                    {new Date(enrollment.createdAt).toLocaleDateString()}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default function AdminEnrollmentsPage() {
    return <AdminEnrollmentsContent />;
}
