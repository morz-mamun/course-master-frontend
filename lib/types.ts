/**
 * TypeScript type definitions for Course Master application
 */

// User Types
export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Course Types
export interface Lesson {
  lessonId: string;
  title: string;
  duration: number;
  videoUrl?: string;
  description?: string;
}

export interface Batch {
  batchId: string;
  startDate: string;
  endDate: string;
  capacity: number;
  enrolledCount?: number;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: string | User;
  price: number;
  category: string;
  tags: string[];
  syllabus: Lesson[];
  batches: Batch[];
  enrollmentCount: number;
  createdAt: string;
  updatedAt: string;
}

// Enrollment Types
export interface Enrollment {
  _id: string;
  courseId: string | Course;
  studentId: string;
  batchId: string;
  enrolledAt: string;
  status: 'active' | 'completed' | 'dropped';
  progress?: Progress;
}

// Progress Types
export interface Progress {
  _id: string;
  studentId: string;
  courseId: string;
  lessonsCompleted: number;
  totalLessons: number;
  percentage: number;
  completedLessonIds: string[];
  updatedAt?: string;
}

// Assignment Types
export interface Assignment {
  _id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate?: string;
  submissions?: AssignmentSubmission[];
}

export interface AssignmentSubmission {
  studentId: string;
  submissionText?: string;
  submissionLink?: string;
  submittedAt: string;
  grade?: number;
  feedback?: string;
}

// Quiz Types
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  _id: string;
  courseId: string;
  title: string;
  questions: QuizQuestion[];
  passingScore: number;
  timeLimit?: number;
  attempts?: QuizAttempt[];
}

export interface QuizAttempt {
  studentId: string;
  answers: number[];
  score: number;
  attemptedAt: string;
  timeTaken?: number;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  success?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface CourseFilters {
  search?: string;
  category?: string;
  tags?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest';
  page?: number;
  limit?: number;
}

// Form Data Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface CourseFormData {
  title: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  syllabus: Lesson[];
  batches: Batch[];
}

export interface EnrollmentFormData {
  courseId: string;
  batchId: string;
}

export interface ProgressUpdateData {
  courseId: string;
  lessonId: string;
}

export interface AssignmentSubmissionData {
  assignmentId: string;
  submissionText?: string;
  submissionLink?: string;
}

export interface QuizSubmissionData {
  quizId: string;
  answers: number[];
  timeTaken: number;
}
