"use client"

/**
 * Admin Enrollments Page
 * View and manage student enrollments
 */

import React, { useEffect, useState } from 'react';
import { getAllEnrollments } from '@/services/student.service';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { Users, Calendar } from 'lucide-react';

function AdminEnrollmentsContent() {
    const [enrollments, setEnrollments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEnrollments = async () => {
            try {
                const data = await getAllEnrollments();
                setEnrollments(data.enrollments);
            } catch (error) {
                console.error('Failed to load enrollments', error);
            } finally {
                setLoading(false);
            }
        };

        loadEnrollments();
    }, []);

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Enrollment Management</h1>
                <p className="text-muted-foreground">
                    View all student enrollments
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" text="Loading enrollments..." />
                </div>
            ) : enrollments.length === 0 ? (
                <EmptyState
                    icon={<Users className="size-16" />}
                    title="No enrollments yet"
                    description="Students will appear here once they enroll in courses"
                />
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>All Enrollments ({enrollments.length})</CardTitle>
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
                                    {enrollments.map((enrollment) => (
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
    return (
        <ProtectedRoute requiredRole="admin">
            <AdminEnrollmentsContent />
        </ProtectedRoute>
    );
}
