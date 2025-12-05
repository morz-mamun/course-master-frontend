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
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { Users, Calendar, Filter } from 'lucide-react';

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
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Enrollment Management</h1>
                <p className="text-muted-foreground">
                    View and filter student enrollments by course and batch
                </p>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="size-5" />
                        Filters
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Filter by Course</label>
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
                            <label className="text-sm font-medium">Filter by Batch</label>
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
                        <div className="mt-4 text-sm text-muted-foreground">
                            Showing {filteredEnrollments.length} of {enrollments.length} enrollments
                        </div>
                    )}
                </CardContent>
            </Card>

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
                />
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Enrollments ({filteredEnrollments.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b text-left">
                                        <th className="p-4 font-medium">Student</th>
                                        <th className="p-4 font-medium">Course</th>
                                        <th className="p-4 font-medium">Batch</th>
                                        <th className="p-4 font-medium">Status</th>
                                        <th className="p-4 font-medium">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEnrollments.map((enrollment) => (
                                        <tr key={enrollment._id} className="border-b last:border-0 hover:bg-muted/50">
                                            <td className="p-4">
                                                <div className="font-medium">{enrollment.studentId?.name || 'Unknown'}</div>
                                                <div className="text-sm text-muted-foreground">{enrollment.studentId?.email}</div>
                                            </td>
                                            <td className="p-4">
                                                {enrollment.courseId?.title || 'Unknown Course'}
                                            </td>
                                            <td className="p-4">
                                                <Badge variant="outline">{enrollment.batchId}</Badge>
                                            </td>
                                            <td className="p-4">
                                                <Badge className={
                                                    enrollment.status === 'active' ? 'bg-green-500' :
                                                        enrollment.status === 'completed' ? 'bg-blue-500' : 'bg-gray-500'
                                                }>
                                                    {enrollment.status}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="size-4" />
                                                    {new Date(enrollment.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
