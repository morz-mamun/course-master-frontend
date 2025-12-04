"use client"

/**
 * Admin Assignments Page
 * Review student assignment submissions
 */

import React, { useEffect, useState } from 'react';
import { getAllSubmissions } from '@/services/student.service';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { FileText, ExternalLink, Calendar } from 'lucide-react';

function AdminAssignmentsContent() {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSubmissions = async () => {
            try {
                const data = await getAllSubmissions();
                setSubmissions(data.submissions);
            } catch (error) {
                console.error('Failed to load submissions', error);
            } finally {
                setLoading(false);
            }
        };

        loadSubmissions();
    }, []);

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Assignment Review</h1>
                <p className="text-muted-foreground">
                    Review and grade student assignments
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" text="Loading submissions..." />
                </div>
            ) : submissions.length === 0 ? (
                <EmptyState
                    icon={<FileText className="size-16" />}
                    title="No submissions yet"
                    description="Student submissions will appear here"
                />
            ) : (
                <div className="grid gap-6">
                    {submissions.map((submission) => (
                        <Card key={submission._id}>
                            <CardHeader>
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-lg">{submission.assignmentTitle}</CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            Course: {submission.courseTitle}
                                        </p>
                                    </div>
                                    <Badge variant={submission.score ? "default" : "secondary"}>
                                        {submission.score ? `Score: ${submission.score}` : 'Pending Review'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <div className="text-sm font-medium text-muted-foreground">Student</div>
                                        <div>
                                            <div className="font-medium">{submission.studentName}</div>
                                            <div className="text-sm text-muted-foreground">{submission.studentEmail}</div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="text-sm font-medium text-muted-foreground">Submission</div>
                                        <div className="space-y-2">
                                            {submission.submissionText && (
                                                <div className="p-3 bg-muted rounded-md text-sm">
                                                    {submission.submissionText}
                                                </div>
                                            )}
                                            {submission.submissionLink && (
                                                <a
                                                    href={submission.submissionLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-primary hover:underline text-sm"
                                                >
                                                    <ExternalLink className="size-4" />
                                                    View Attachment
                                                </a>
                                            )}
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Calendar className="size-3" />
                                                Submitted on {new Date(submission.submittedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Grading actions could go here */}
                                {/* For now, just display */}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function AdminAssignmentsPage() {
    return (
        <ProtectedRoute requiredRole="admin">
            <AdminAssignmentsContent />
        </ProtectedRoute>
    );
}
