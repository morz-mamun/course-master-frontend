"use client"

/**
 * Admin Assignments Page
 * Review and grade student assignment submissions
 */

import React, { useEffect, useState } from 'react';
import { getAllSubmissions } from '@/services/student.service';
import { adminService } from '@/services/admin.service';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { FileText, ExternalLink, Calendar, CheckCircle } from 'lucide-react';
import Link from 'next/link';

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
        <div className="container mx-auto px-4 py-8">
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
                    action={
                        <Button
                            asChild
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <Link href="/admin/assignments">
                                Add Assignment
                            </Link>
                        </Button>
                    }
                />
            ) : (
                <div className="grid gap-6">
                    {submissions.map((submission) => (
                        <Card key={submission._id}>
                            <CardHeader className="px-3">
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
                            <CardContent className="px-3">
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

                                {/* Grading Section */}

                                <GradingForm

                                    submission={submission}

                                    onGraded={() => {

                                        // Reload submissions after grading

                                        getAllSubmissions().then(data => setSubmissions(data.submissions));

                                    }}

                                />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function AdminAssignmentsPage() {
    return <AdminAssignmentsContent />;
}

// Grading Form Component
function GradingForm({ submission, onGraded }: { submission: any; onGraded: () => void }) {
    const [score, setScore] = useState(submission.score || '');
    const [feedback, setFeedback] = useState(submission.feedback || '');
    const [grading, setGrading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleGrade = async () => {
        setGrading(true);
        try {
            await adminService.gradeAssignment({
                assignmentId: submission.assignmentId,
                submissionId: submission._id,
                score: Number(score),
                feedback,
            });
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                onGraded();
            }, 2000);
        } catch (error) {
            console.error('Failed to grade assignment', error);
        } finally {
            setGrading(false);
        }
    };

    if (success) {
        return (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md flex items-center gap-2 text-green-700">
                <CheckCircle className="size-5" />
                <span className="font-medium">Graded successfully!</span>
            </div>
        );
    }

    return (
        <div className="mt-4 p-4 border rounded-md space-y-4">
            <h4 className="font-medium">Grade Submission</h4>
            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor={`score-${submission._id}`}>Score (0-100)</Label>
                    <Input
                        id={`score-${submission._id}`}
                        type="number"
                        min="0"
                        max="100"
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        placeholder="Enter score"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`feedback-${submission._id}`}>Feedback (Optional)</Label>
                    <Textarea
                        id={`feedback-${submission._id}`}
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Provide feedback..."
                        rows={3}
                    />
                </div>
            </div>
            <Button onClick={handleGrade} disabled={grading || !score}>
                {grading ? 'Grading...' : submission.score ? 'Update Grade' : 'Submit Grade'}
            </Button>
        </div>
    );
}


