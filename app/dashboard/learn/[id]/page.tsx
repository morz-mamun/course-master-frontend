"use client"

/**
 * Course Learning Page
 * Modern UI for watching videos, tracking progress, and completing assignments
 */

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCourses } from '@/contexts/CourseContext';
import { useAuth } from '@/contexts/AuthContext';
import { updateProgress, getLessonMaterials, submitAssignment, submitQuiz } from '@/services/student.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import LoadingSpinner from '@/components/LoadingSpinner';
import { CheckCircle, PlayCircle, Lock, FileText, HelpCircle, AlertCircle, Clock, Award, ChevronRight } from 'lucide-react';
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
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const courseData = await fetchCourseById(params.id as string);
                setCourse(courseData);

                if (enrolledCourses.length === 0) {
                    await fetchEnrolledCourses();
                }

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

    const handleMarkCompleted = async () => {
        if (!course || !currentLesson) return;

        setUpdating(true);
        try {
            await updateProgress({
                courseId: course._id,
                lessonId: currentLesson.lessonId
            });
            await fetchEnrolledCourses();
        } catch (error) {
            console.error('Failed to update progress', error);
        } finally {
            setUpdating(false);
        }
    };

    const goToNextLesson = () => {
        if (!course || !currentLesson) return;
        const currentIndex = course.syllabus.findIndex(l => l.lessonId === currentLesson.lessonId);
        if (currentIndex < course.syllabus.length - 1) {
            setCurrentLesson(course.syllabus[currentIndex + 1]);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <LoadingSpinner size="lg" text="Loading classroom..." />
            </div>
        );
    }

    if (!course) return null;

    const progress = enrollment?.progress;
    const progressPercentage = progress?.percentage || 0;
    const completedLessons = progress?.lessonsCompleted || 0;
    const totalLessons = progress?.totalLessons || course.syllabus?.length || 0;

    return (
        <div className="p-4 md:p-6 lg:p-8">
            <div className="max-w-screen-xl mx-auto space-y-6">
                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-10 gap-6">
                    {/* Left Sidebar - Syllabus & Materials - Sticky */}
                    <div className="lg:col-span-3">
                        <div className="sticky top-24 space-y-4">
                            {/* Course Header */}
                            <div className="space-y-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h1 className="text-2xl md:text-3xl font-bold mb-2">{course.title}</h1>
                                        <p className="text-muted-foreground">{course.description}</p>
                                    </div>
                                </div>
                            </div>
                            {/* Syllabus Card - Compact */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <CardTitle className="text-base">Syllabus</CardTitle>
                                        <Badge variant="secondary" className="text-xs">
                                            {completedLessons}/{totalLessons}
                                        </Badge>
                                    </div>
                                    <Progress value={progressPercentage} className="h-1.5" />
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="max-h-[300px] overflow-y-auto">
                                        {course?.syllabus?.map((lesson, index) => {
                                            const isCompleted = isLessonCompleted(lesson.lessonId);
                                            const isCurrent = currentLesson?.lessonId === lesson.lessonId;

                                            return (
                                                <button
                                                    key={lesson.lessonId}
                                                    onClick={() => setCurrentLesson(lesson)}
                                                    className={cn(
                                                        "w-full text-left px-4 py-2.5 transition-colors flex items-center gap-2 border-b last:border-b-0",
                                                        isCurrent
                                                            ? "bg-primary/10 border-l-2 border-l-primary"
                                                            : "hover:bg-muted"
                                                    )}
                                                >
                                                    <div className="shrink-0">
                                                        {isCompleted ? (
                                                            <CheckCircle className="size-4 text-green-500" />
                                                        ) : (
                                                            <div className="size-4 rounded-full border border-muted-foreground flex items-center justify-center">
                                                                <span className="text-[10px] font-medium">{index + 1}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className={cn(
                                                            "text-xs font-medium truncate",
                                                            isCurrent && "text-primary"
                                                        )}>
                                                            {lesson.title}
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Lesson Materials Card */}
                            {currentLesson && (
                                <Card className="border-primary/20">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <FileText className="size-4 text-primary" />
                                            Materials
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {isLessonCompleted(currentLesson.lessonId) ? (
                                            <>
                                                {materials?.assignments?.length > 0 && (
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                                            <FileText className="size-3" />
                                                            Assignments ({materials.assignments.length})
                                                        </div>
                                                        {materials.assignments.map((assignment) => (
                                                            <div
                                                                key={assignment._id}
                                                                className="p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors"
                                                            >
                                                                <div className="text-xs font-medium truncate">
                                                                    {assignment.title}
                                                                </div>
                                                                <div className="text-[10px] text-muted-foreground mt-0.5">
                                                                    {assignment.studentSubmission?.score !== undefined
                                                                        ? `Score: ${assignment.studentSubmission.score}/${assignment.maxScore}`
                                                                        : assignment.studentSubmission
                                                                            ? 'Pending Review'
                                                                            : 'Not Submitted'}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {materials?.quizzes?.length > 0 && (
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                                            <HelpCircle className="size-3" />
                                                            Quizzes ({materials.quizzes.length})
                                                        </div>
                                                        {materials.quizzes.map((quiz) => (
                                                            <div
                                                                key={quiz._id}
                                                                className="p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors"
                                                            >
                                                                <div className="text-xs font-medium truncate">
                                                                    {quiz.title}
                                                                </div>
                                                                <div className="text-[10px] text-muted-foreground mt-0.5">
                                                                    {quiz.questions?.length || 0} questions
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {!materials.assignments?.length && !materials.quizzes?.length && (
                                                    <div className="text-center py-4">
                                                        <AlertCircle className="size-8 mx-auto mb-2 text-muted-foreground" />
                                                        <p className="text-xs text-muted-foreground">
                                                            No materials available
                                                        </p>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="text-center py-4">
                                                <Lock className="size-8 mx-auto mb-2 text-muted-foreground" />
                                                <p className="text-xs text-muted-foreground">
                                                    Complete lesson to unlock
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                    </div>

                    {/* Video and Content - Right Side - Scrollable */}
                    <div className="lg:col-span-7 space-y-6">
                        {currentLesson ? (
                            <>
                                {/* Video Player */}
                                <Card className="overflow-hidden pt-0">
                                    <div className="aspect-video bg-black">
                                        <iframe
                                            src={currentLesson?.videoUrl?.replace('watch?v=', 'embed/')}
                                            className="w-full h-full"
                                            allowFullScreen
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        />
                                    </div>
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between gap-4 mb-4">
                                            <div className="flex-1">
                                                <h2 className="text-xl font-bold mb-2">{currentLesson.title}</h2>
                                                <p className="text-muted-foreground text-sm">{currentLesson.description}</p>
                                            </div>
                                            <Badge variant="secondary" className="flex items-center gap-1">
                                                <Clock className="size-3" />
                                                {currentLesson.duration} min
                                            </Badge>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <Button
                                                onClick={handleMarkCompleted}
                                                disabled={updating || isLessonCompleted(currentLesson.lessonId)}
                                                className={cn(
                                                    "flex-1",
                                                    isLessonCompleted(currentLesson.lessonId) && "bg-green-500 hover:bg-green-600"
                                                )}
                                            >
                                                {isLessonCompleted(currentLesson.lessonId) ? (
                                                    <>
                                                        <CheckCircle className="size-4 mr-2" />
                                                        Completed
                                                    </>
                                                ) : updating ? (
                                                    'Updating...'
                                                ) : (
                                                    'Mark as Completed'
                                                )}
                                            </Button>
                                            {course.syllabus.findIndex(l => l.lessonId === currentLesson.lessonId) < course.syllabus.length - 1 && (
                                                <Button variant="outline" onClick={goToNextLesson} className="flex-1">
                                                    Next Lesson
                                                    <ChevronRight className="size-4 ml-2" />
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Materials Section */}
                                {isLessonCompleted(currentLesson.lessonId) && (materials?.assignments?.length > 0 || materials?.quizzes?.length > 0) && (
                                    <div className="space-y-4">
                                        <h2 className="text-xl font-bold">Lesson Materials</h2>
                                        <div className="space-y-4">
                                            {materials?.assignments?.map((assignment) => (
                                                <AssignmentCard key={assignment._id} assignment={assignment} />
                                            ))}
                                            {materials.quizzes.map((quiz) => (
                                                <QuizCard key={quiz._id} quiz={quiz} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {!isLessonCompleted(currentLesson.lessonId) && (materials?.assignments?.length > 0 || materials?.quizzes?.length > 0) && (
                                    <Alert>
                                        <Lock className="size-4" />
                                        <AlertTitle>Materials Locked</AlertTitle>
                                        <AlertDescription>
                                            Complete the lesson video to unlock assignments and quizzes.
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {isLessonCompleted(currentLesson.lessonId) && !materials.assignments.length && !materials.quizzes.length && (
                                    <Alert>
                                        <AlertCircle className="size-4" />
                                        <AlertTitle>No Materials</AlertTitle>
                                        <AlertDescription>
                                            This lesson doesn't have any assignments or quizzes.
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </>
                        ) : (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <PlayCircle className="size-12 mx-auto mb-4 text-muted-foreground" />
                                    <p className="text-muted-foreground">Select a lesson to start learning</p>
                                </CardContent>
                            </Card>
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

    const studentSubmission = assignment.studentSubmission;
    const hasSubmitted = !!studentSubmission;
    const isGraded = hasSubmitted && studentSubmission.score !== undefined;

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

    if (isGraded) {
        return (
            <Card className="border-blue-200 bg-blue-50/50">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <FileText className="size-5 text-blue-600" />
                            {assignment.title}
                        </CardTitle>
                        <Badge className="bg-blue-600">Graded</Badge>
                    </div>
                    <CardDescription>{assignment.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 bg-white rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Your Score:</span>
                            <Badge className="text-lg bg-green-600">{studentSubmission.score}/{assignment.maxScore}</Badge>
                        </div>
                        {studentSubmission.feedback && (
                            <div className="mt-3 p-3 bg-muted rounded-md">
                                <span className="font-medium text-sm">Feedback:</span>
                                <p className="text-sm text-muted-foreground mt-1">{studentSubmission.feedback}</p>
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                            Graded on {new Date(studentSubmission.gradedAt).toLocaleDateString()}
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (hasSubmitted || submitted) {
        return (
            <Card className="border-yellow-200 bg-yellow-50/50">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <FileText className="size-5 text-yellow-600" />
                            {assignment.title}
                        </CardTitle>
                        <Badge variant="secondary">Pending Review</Badge>
                    </div>
                    <CardDescription>{assignment.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center py-8">
                    <CheckCircle className="size-16 mx-auto mb-3 text-yellow-600" />
                    <h3 className="font-semibold text-lg text-yellow-800 mb-1">Assignment Submitted!</h3>
                    <p className="text-sm text-yellow-700">Waiting for instructor to review and grade your work.</p>
                    {studentSubmission && (
                        <p className="text-xs text-muted-foreground mt-2">
                            Submitted on {new Date(studentSubmission.submittedAt).toLocaleDateString()}
                        </p>
                    )}
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <FileText className="size-5 text-primary" />
                        {assignment.title}
                    </CardTitle>
                    <Badge variant="secondary">Assignment</Badge>
                </div>
                <CardDescription>{assignment.description}</CardDescription>
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
                            rows={4}
                        />
                    </div>
                    <Button type="submit" disabled={submitting || (!link && !text)} className="w-full">
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
            const answersArray = quiz.questions.map((_: any, index: number) => answers[index] ?? -1);

            const response = await submitQuiz({
                quizId: quiz._id,
                answers: answersArray,
                timeTaken: 0
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
            <Card className={cn(
                "border-2",
                result.passed ? "border-green-200 bg-green-50/50" : "border-red-200 bg-red-50/50"
            )}>
                <CardContent className="pt-8 pb-6 text-center">
                    {result.passed ? (
                        <CheckCircle className="size-16 mx-auto mb-3 text-green-600" />
                    ) : (
                        <AlertCircle className="size-16 mx-auto mb-3 text-red-600" />
                    )}
                    <h3 className={cn(
                        "font-semibold text-xl mb-2",
                        result.passed ? "text-green-700" : "text-red-700"
                    )}>
                        {result.passed ? "Quiz Passed! 🎉" : "Quiz Failed"}
                    </h3>
                    <div className="text-3xl font-bold mb-2">
                        <span className={result.passed ? "text-green-700" : "text-red-700"}>
                            {result.score}%
                        </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                        Passing score: {result.passingScore}%
                    </p>
                    {!result.passed && (
                        <Button variant="outline" onClick={() => setResult(null)}>
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
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <HelpCircle className="size-5 text-primary" />
                        {quiz.title}
                    </CardTitle>
                    <Badge variant="secondary">Quiz</Badge>
                </div>
                <CardDescription>{quiz.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {quiz.questions.map((q: any, qIndex: number) => (
                    <div key={qIndex} className="space-y-3 p-4 bg-muted/50 rounded-lg">
                        <p className="font-medium">{qIndex + 1}. {q.questionText}</p>
                        <RadioGroup
                            onValueChange={(val) => setAnswers(prev => ({ ...prev, [qIndex]: parseInt(val) }))}
                            value={answers[qIndex]?.toString()}
                        >
                            {q.options.map((opt: any, optIndex: number) => (
                                <div key={optIndex} className="flex items-center space-x-2">
                                    <RadioGroupItem value={optIndex.toString()} id={`q${qIndex}-opt${optIndex}`} />
                                    <Label htmlFor={`q${qIndex}-opt${optIndex}`} className="cursor-pointer">
                                        {opt.text}
                                    </Label>
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
