"use client"

/**
 * Admin Material Management Page
 * Create and manage assignments and quizzes for lessons
 */

import React, { useEffect, useState } from 'react';
import { useCourses } from '@/contexts/CourseContext';
import { adminService } from '@/services/admin.service';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { FileText, HelpCircle, Plus, Trash2, Calendar } from 'lucide-react';
import type { Course, Lesson } from '@/lib/types';

export default function AdminMaterialsPage() {
    const { courses, fetchCourses, fetchCourseById } = useCourses();
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [assignments, setAssignments] = useState<any[]>([]);
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingCourse, setLoadingCourse] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (selectedCourse && selectedLesson) {
            loadMaterials();
        }
    }, [selectedCourse, selectedLesson]);

    const loadMaterials = async () => {
        if (!selectedCourse || !selectedLesson) return;

        setLoading(true);
        try {
            const [assignmentsData, quizzesData] = await Promise.all([
                adminService.getAssignmentsByLesson(selectedCourse._id, selectedLesson.lessonId),
                adminService.getQuizzesByLesson(selectedCourse._id, selectedLesson.lessonId),
            ]);
            setAssignments(assignmentsData.assignments);
            setQuizzes(quizzesData.quizzes);
        } catch (error) {
            console.error('Failed to load materials', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Manage Lesson Materials</h1>
                <p className="text-muted-foreground">
                    Create and manage assignments and quizzes for individual lessons
                </p>
            </div>

            {/* Course and Lesson Selection */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                    <Label>Select Course</Label>
                    <Select
                        value={selectedCourse?._id}
                        onValueChange={async (value: string) => {
                            setLoadingCourse(true);
                            try {
                                // Fetch full course details including syllabus
                                const fullCourse = await fetchCourseById(value);
                                setSelectedCourse(fullCourse);
                                setSelectedLesson(null);
                            } catch (error) {
                                console.error('Failed to fetch course details:', error);
                            } finally {
                                setLoadingCourse(false);
                            }
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Choose a course" />
                        </SelectTrigger>
                        <SelectContent>
                            {courses?.map((course) => (
                                <SelectItem key={course._id} value={course._id}>
                                    {course.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Select Lesson</Label>
                    <Select
                        value={selectedLesson?.lessonId}
                        onValueChange={(value: string) => {
                            const lesson = selectedCourse?.syllabus.find(l => l.lessonId === value);
                            setSelectedLesson(lesson || null);
                        }}
                        disabled={!selectedCourse || loadingCourse}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={loadingCourse ? "Loading lessons..." : "Choose a lesson"} />
                        </SelectTrigger>
                        <SelectContent>
                            {selectedCourse?.syllabus?.map((lesson, index) => (
                                <SelectItem key={lesson.lessonId} value={lesson.lessonId}>
                                    {index + 1}. {lesson.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Materials Display */}
            {selectedCourse && selectedLesson ? (
                loading ? (
                    <div className="flex justify-center py-12">
                        <LoadingSpinner size="lg" text="Loading materials..." />
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Assignments Section */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <FileText className="size-5" />
                                            Assignments
                                        </CardTitle>
                                        <CardDescription>
                                            {assignments.length} assignment(s) for this lesson
                                        </CardDescription>
                                    </div>
                                    <CreateAssignmentDialog
                                        courseId={selectedCourse._id}
                                        lessonId={selectedLesson.lessonId}
                                        onCreated={loadMaterials}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent>
                                {assignments.length === 0 ? (
                                    <EmptyState
                                        icon={<FileText className="size-12" />}
                                        title="No assignments"
                                        description="Create an assignment for this lesson"
                                    />
                                ) : (
                                    <div className="space-y-3">
                                        {assignments.map((assignment) => (
                                            <div key={assignment._id} className="p-3 border rounded-lg">
                                                <h4 className="font-medium">{assignment.title}</h4>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {assignment.description}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                                    <Calendar className="size-3" />
                                                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                                    <Badge variant="secondary" className="ml-auto">
                                                        Max: {assignment.maxScore}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Quizzes Section */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <HelpCircle className="size-5" />
                                            Quizzes
                                        </CardTitle>
                                        <CardDescription>
                                            {quizzes.length} quiz(zes) for this lesson
                                        </CardDescription>
                                    </div>
                                    <CreateQuizDialog
                                        courseId={selectedCourse._id}
                                        lessonId={selectedLesson.lessonId}
                                        onCreated={loadMaterials}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent>
                                {quizzes.length === 0 ? (
                                    <EmptyState
                                        icon={<HelpCircle className="size-12" />}
                                        title="No quizzes"
                                        description="Create a quiz for this lesson"
                                    />
                                ) : (
                                    <div className="space-y-3">
                                        {quizzes.map((quiz) => (
                                            <div key={quiz._id} className="p-3 border rounded-lg">
                                                <h4 className="font-medium">{quiz.title}</h4>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {quiz.description}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Badge variant="secondary">
                                                        {quiz.questions.length} questions
                                                    </Badge>
                                                    <Badge variant="secondary">
                                                        Passing: {quiz.passingScore}%
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )
            ) : (
                <EmptyState
                    icon={<FileText className="size-16" />}
                    title="Select a course and lesson"
                    description="Choose a course and lesson to manage materials"
                />
            )}
        </div>
    );
}

// Create Assignment Dialog Component
function CreateAssignmentDialog({ courseId, lessonId, onCreated }: { courseId: string; lessonId: string; onCreated: () => void }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        maxScore: 100,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await adminService.createAssignment({
                courseId,
                lessonId,
                ...formData,
            });
            setOpen(false);
            setFormData({ title: '', description: '', dueDate: '', maxScore: 100 });
            onCreated();
        } catch (error) {
            console.error('Failed to create assignment', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="size-4 mr-2" />
                    Add Assignment
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Create Assignment</DialogTitle>
                    <DialogDescription>
                        Add a new assignment for this lesson
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            required
                        />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="dueDate">Due Date *</Label>
                            <Input
                                id="dueDate"
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="maxScore">Max Score</Label>
                            <Input
                                id="maxScore"
                                type="number"
                                min="1"
                                max="1000"
                                value={formData.maxScore}
                                onChange={(e) => setFormData({ ...formData, maxScore: parseInt(e.target.value) })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Assignment'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// Create Quiz Dialog Component
function CreateQuizDialog({ courseId, lessonId, onCreated }: { courseId: string; lessonId: string; onCreated: () => void }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        passingScore: 70,
        questions: [
            {
                questionText: '',
                options: [
                    { text: '', isCorrect: false },
                    { text: '', isCorrect: false },
                    { text: '', isCorrect: false },
                    { text: '', isCorrect: false },
                ],
                explanation: '',
            },
        ],
    });

    const addQuestion = () => {
        setFormData({
            ...formData,
            questions: [
                ...formData.questions,
                {
                    questionText: '',
                    options: [
                        { text: '', isCorrect: false },
                        { text: '', isCorrect: false },
                        { text: '', isCorrect: false },
                        { text: '', isCorrect: false },
                    ],
                    explanation: '',
                },
            ],
        });
    };

    const removeQuestion = (index: number) => {
        setFormData({
            ...formData,
            questions: formData.questions.filter((_, i) => i !== index),
        });
    };

    const updateQuestion = (index: number, field: string, value: any) => {
        const newQuestions = [...formData.questions];
        newQuestions[index] = { ...newQuestions[index], [field]: value };
        setFormData({ ...formData, questions: newQuestions });
    };

    const updateOption = (qIndex: number, oIndex: number, field: string, value: any) => {
        const newQuestions = [...formData.questions];
        newQuestions[qIndex].options[oIndex] = {
            ...newQuestions[qIndex].options[oIndex],
            [field]: value,
        };
        setFormData({ ...formData, questions: newQuestions });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await adminService.createQuiz({
                courseId,
                lessonId,
                ...formData,
            });
            setOpen(false);
            setFormData({
                title: '',
                description: '',
                passingScore: 70,
                questions: [
                    {
                        questionText: '',
                        options: [
                            { text: '', isCorrect: false },
                            { text: '', isCorrect: false },
                            { text: '', isCorrect: false },
                            { text: '', isCorrect: false },
                        ],
                        explanation: '',
                    },
                ],
            });
            onCreated();
        } catch (error) {
            console.error('Failed to create quiz', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="size-4 mr-2" />
                    Add Quiz
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Quiz</DialogTitle>
                    <DialogDescription>
                        Add a new quiz for this lesson
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="quiz-title">Title *</Label>
                        <Input
                            id="quiz-title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="quiz-description">Description</Label>
                        <Textarea
                            id="quiz-description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={2}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="passingScore">Passing Score (%)</Label>
                        <Input
                            id="passingScore"
                            type="number"
                            min="0"
                            max="100"
                            value={formData.passingScore}
                            onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) })}
                        />
                    </div>

                    {/* Questions */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Questions</Label>
                            <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
                                <Plus className="size-4 mr-2" />
                                Add Question
                            </Button>
                        </div>

                        {formData.questions.map((question, qIndex) => (
                            <Card key={qIndex}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base">Question {qIndex + 1}</CardTitle>
                                        {formData.questions.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeQuestion(qIndex)}
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Question Text *</Label>
                                        <Input
                                            value={question.questionText}
                                            onChange={(e) => updateQuestion(qIndex, 'questionText', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Options (check the correct answer)</Label>
                                        {question.options.map((option, oIndex) => (
                                            <div key={oIndex} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={option.isCorrect}
                                                    onChange={(e) => updateOption(qIndex, oIndex, 'isCorrect', e.target.checked)}
                                                    className="size-4"
                                                />
                                                <Input
                                                    value={option.text}
                                                    onChange={(e) => updateOption(qIndex, oIndex, 'text', e.target.value)}
                                                    placeholder={`Option ${oIndex + 1}`}
                                                    required
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Explanation (Optional)</Label>
                                        <Textarea
                                            value={question.explanation}
                                            onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                                            rows={2}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Quiz'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
