"use client"

/**
 * Course Consumption Page
 * Watch videos, track progress, and take quizzes
"use client"

/**
 * Course Consumption Page
 * Watch videos, track progress, and take quizzes
 */

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCourses } from '@/contexts/CourseContext';
import { useAuth } from '@/contexts/AuthContext';
import { updateProgress, getLessonMaterials, submitAssignment, submitQuiz } from '@/services/student.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import LoadingSpinner from '@/components/LoadingSpinner';
import { CheckCircle, PlayCircle, Lock, ChevronLeft, Menu, FileText, HelpCircle, AlertCircle } from 'lucide-react';
import type { Course, Lesson } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function LearnPage() {
    const params = useParams();
    const router = useRouter();
    const { fetchCourseById, fetchEnrolledCourses, enrolledCourses } = useCourses();
    const { user } = useAuth();

    const [course, setCourse] = useState<Course | null>(null);
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
    const [materials, setMaterials] = useState<{ assignments: any[], quizzes: any[] }>({ assignments: [], quizzes: [] });
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Fetch course details
                const courseData = await fetchCourseById(params.id as string);
                setCourse(courseData);

                // Fetch enrollment status to get progress
                if (enrolledCourses.length === 0) {
                    await fetchEnrolledCourses();
                }

                // Set initial lesson (first one)
                if (courseData.syllabus.length > 0) {
                    setCurrentLesson(courseData.syllabus[0]);
                }
            } catch (error) {
                console.error('Failed to load course', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [params.id]);

    useEffect(() => {
        const loadMaterials = async () => {
            if (course && currentLesson) {
                try {
                    const data = await getLessonMaterials(course._id, currentLesson.lessonId);
                    setMaterials(data);
                } catch (error) {
                    console.error('Failed to load materials', error);
                }
            }
        };
        loadMaterials();
    }, [course, currentLesson]);

    const enrollment = enrolledCourses.find(e => {
        const cId = typeof e.courseId === 'string' ? e.courseId : e.courseId._id;
        return cId === params.id;
    });

    const isLessonCompleted = (lessonId: string) => {
        if (!enrollment || !enrollment.progress) return false;
        return enrollment.progress.completedLessonIds.includes(lessonId);
    };

    const handleLessonSelect = (lesson: Lesson) => {
        setCurrentLesson(lesson);
        // On mobile, close sidebar after selection
        if (window.innerWidth < 1024) {
            setSidebarOpen(false);
        }
    };

    const handleMarkCompleted = async () => {
        if (!course || !currentLesson) return;

        setUpdating(true);
        try {
            await updateProgress({
                courseId: course._id,
                lessonId: currentLesson.lessonId
            });
            // Refresh enrollment data to update progress bar
            await fetchEnrolledCourses();
        } catch (error) {
            console.error('Failed to update progress', error);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" text="Loading classroom..." />
            </div>
        );
    }

    if (!course) return null;

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Sidebar - Syllabus */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-80 bg-card border-r transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full">
                    <div className="p-4 border-b flex items-center justify-between">
                        <h2 className="font-semibold truncate" title={course.title}>
                            {course.title}
                        </h2>
                        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="lg:hidden">
                            <ChevronLeft className="size-4" />
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {course.syllabus.map((lesson, index) => (
                            <button
                                key={lesson.lessonId}
                                onClick={() => handleLessonSelect(lesson)}
                                className={cn(
                                    "w-full text-left p-3 rounded-lg text-sm transition-colors flex items-start gap-3",
                                    currentLesson?.lessonId === lesson.lessonId
                                        ? "bg-primary/10 text-primary"
                                        : "hover:bg-muted"
                                )}
                            >
                                <div className="mt-0.5">
                                    {isLessonCompleted(lesson.lessonId) ? (
                                        <CheckCircle className="size-4 text-green-500" />
                                    ) : (
                                        <PlayCircle className="size-4" />
                                    )}
                                </div>
                                <div>
                                    <div className="font-medium">
                                        {index + 1}. {lesson.title}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {lesson.duration} min
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="p-4 border-t">
                        <Button variant="outline" className="w-full" onClick={() => router.push('/dashboard')}>
                            <ChevronLeft className="size-4 mr-2" />
                            Back to Dashboard
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <div className="lg:hidden p-4 border-b flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
                        <Menu className="size-5" />
                    </Button>
                    <h1 className="font-semibold truncate">{currentLesson?.title}</h1>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {currentLesson ? (
                            <>
                                {/* Video Player */}
                                <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
                                    <iframe
                                        src={currentLesson?.videoUrl?.replace('watch?v=', 'embed/')}
                                        className="w-full h-full"
                                        allowFullScreen
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    />
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h1 className="text-2xl font-bold mb-2">{currentLesson.title}</h1>
                                        <p className="text-muted-foreground">{currentLesson.description}</p>
                                    </div>
                                    <Button
                                        size="lg"
                                        onClick={handleMarkCompleted}
                                        disabled={updating}
                                        className={cn(
                                            isLessonCompleted(currentLesson.lessonId) && "bg-green-500 hover:bg-green-600"
                                        )}
                                    >
                                        {updating ? 'Updating...' : isLessonCompleted(currentLesson.lessonId) ? 'Completed' : 'Mark as Completed'}
                                    </Button>
                                </div>

                                {/* Assignments & Quizzes */}
                                {isLessonCompleted(currentLesson.lessonId) && (materials.assignments.length > 0 || materials.quizzes.length > 0) && (
                                    <div className="space-y-4">
                                        <h2 className="text-xl font-semibold">Lesson Materials</h2>
                                        <div className="grid gap-6">
                                            {materials.assignments.map((assignment) => (
                                                <AssignmentCard key={assignment._id} assignment={assignment} />
                                            ))}
                                            {materials.quizzes.map((quiz) => (
                                                <QuizCard key={quiz._id} quiz={quiz} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {!isLessonCompleted(currentLesson.lessonId) && (materials.assignments.length > 0 || materials.quizzes.length > 0) && (
                                    <Alert>
                                        <Lock className="size-4" />
                                        <AlertTitle>Materials Locked</AlertTitle>
                                        <AlertDescription>
                                            Complete the lesson video to unlock assignments and quizzes.
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground">Select a lesson to start watching</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function AssignmentCard({ assignment }: { assignment: any }) {
    const [link, setLink] = useState('');
    const [text, setText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await submitAssignment({
                assignmentId: assignment._id,
                submissionLink: link,
                submissionText: text
            });
            setSubmitted(true);
        } catch (error) {
            console.error('Failed to submit assignment', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <Card className="bg-green-50/50 border-green-200">
                <CardContent className="pt-6 text-center text-green-700">
                    <CheckCircle className="size-12 mx-auto mb-2" />
                    <h3 className="font-semibold text-lg">Assignment Submitted!</h3>
                    <p className="text-sm">Your work has been received.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="size-5 text-primary" />
                        {assignment.title}
                    </CardTitle>
                    <Badge variant="secondary">Assignment</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{assignment.description}</p>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor={`link-${assignment._id}`}>Google Drive Link (Optional)</Label>
                        <Input
                            id={`link-${assignment._id}`}
                            placeholder="https://drive.google.com/..."
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`text-${assignment._id}`}>Text Answer (Optional)</Label>
                        <Textarea
                            id={`text-${assignment._id}`}
                            placeholder="Type your answer here..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>
                    <Button type="submit" disabled={submitting || (!link && !text)}>
                        {submitting ? 'Submitting...' : 'Submit Assignment'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

function QuizCard({ quiz }: { quiz: any }) {
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<{ passed: boolean; score: number; passingScore: number } | null>(null);

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            // Convert answers object to array based on question index
            const answersArray = quiz.questions.map((_: any, index: number) => answers[index] ?? -1);

            const response = await submitQuiz({
                quizId: quiz._id,
                answers: answersArray,
                timeTaken: 0 // Not tracking time yet
            });

            setResult({
                passed: response.passed,
                score: response.attempt.score,
                passingScore: response.passingScore
            });
        } catch (error) {
            console.error('Failed to submit quiz', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (result) {
        return (
            <Card className={cn("border-2", result.passed ? "border-green-100 bg-green-50/30" : "border-red-100 bg-red-50/30")}>
                <CardContent className="pt-6 text-center">
                    {result.passed ? (
                        <CheckCircle className="size-12 mx-auto mb-2 text-green-600" />
                    ) : (
                        <AlertCircle className="size-12 mx-auto mb-2 text-red-600" />
                    )}
                    <h3 className={cn("font-semibold text-lg mb-1", result.passed ? "text-green-700" : "text-red-700")}>
                        {result.passed ? "Quiz Passed!" : "Quiz Failed"}
                    </h3>
                    <div className="text-2xl font-bold mb-2">
                        {result.score}%
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Passing score: {result.passingScore}%
                    </p>
                    {!result.passed && (
                        <Button variant="outline" className="mt-4" onClick={() => setResult(null)}>
                            Try Again
                        </Button>
                    )}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <HelpCircle className="size-5 text-primary" />
                        {quiz.title}
                    </CardTitle>
                    <Badge variant="secondary">Quiz</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{quiz.description}</p>
            </CardHeader>
            <CardContent className="space-y-6">
                {quiz.questions.map((q: any, qIndex: number) => (
                    <div key={qIndex} className="space-y-3">
                        <p className="font-medium">{qIndex + 1}. {q.questionText}</p>
                        <RadioGroup
                            onValueChange={(val) => setAnswers(prev => ({ ...prev, [qIndex]: parseInt(val) }))}
                            value={answers[qIndex]?.toString()}
                        >
                            {q.options.map((opt: any, optIndex: number) => (
                                <div key={optIndex} className="flex items-center space-x-2">
                                    <RadioGroupItem value={optIndex.toString()} id={`q${qIndex}-opt${optIndex}`} />
                                    <Label htmlFor={`q${qIndex}-opt${optIndex}`}>{opt.text}</Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                ))}
            </CardContent>
            <CardFooter>
                <Button
                    onClick={handleSubmit}
                    disabled={submitting || Object.keys(answers).length < quiz.questions.length}
                    className="w-full"
                >
                    {submitting ? 'Submitting...' : 'Submit Quiz'}
                </Button>
            </CardFooter>
        </Card>
    );
}
