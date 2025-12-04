/**
 * Student service
 * Handles all student-related API calls
 */

import api from '@/lib/api';
import type {
    Enrollment,
    EnrollmentFormData,
    ProgressUpdateData,
    Progress,
    AssignmentSubmissionData,
    QuizSubmissionData,
} from '@/lib/types';

/**
 * Enroll in a course
 */
export const enrollInCourse = async (
    data: EnrollmentFormData
): Promise<{ message: string; enrollment: Enrollment }> => {
    const response = await api.post<{ message: string; enrollment: Enrollment }>(
        '/enroll',
        data
    );
    return response.data;
};

/**
 * Get all enrolled courses for the current student
 */
export const getEnrolledCourses = async (): Promise<{ courses: Enrollment[] }> => {
    const response = await api.get<{ courses: Enrollment[] }>('/student/courses');
    return response.data;
};

/**
 * Update progress by marking a lesson as complete
 */
export const updateProgress = async (
    data: ProgressUpdateData
): Promise<{ message: string; progress: Progress }> => {
    const response = await api.post<{ message: string; progress: Progress }>(
        '/progress',
        data
    );
    return response.data;
};

/**
 * Submit an assignment
 */
export const submitAssignment = async (
    data: AssignmentSubmissionData
): Promise<{ message: string; submission: any }> => {
    const response = await api.post<{ message: string; submission: any }>(
        '/assignments',
        data
    );
    return response.data;
};

/**
 * Submit a quiz
 */
export const submitQuiz = async (
    data: QuizSubmissionData
): Promise<{
    message: string;
    attempt: any;
    passed: boolean;
    passingScore: number
}> => {
    const response = await api.post<{
        message: string;
        attempt: any;
        passed: boolean;
        passingScore: number;
    }>('/quiz/submit', data);
    return response.data;
};

/**
 * Get all enrollments (Admin only)
 */
export const getAllEnrollments = async (): Promise<{ enrollments: any[] }> => {
    const response = await api.get<{ enrollments: any[] }>('/admin/enrollments');
    return response.data;
};

/**
 * Get all submissions (Admin only)
 */
export const getAllSubmissions = async (): Promise<{ submissions: any[] }> => {
    const response = await api.get<{ submissions: any[] }>('/admin/submissions');
    return response.data;
};

/**
 * Get materials for a specific lesson
 */
export const getLessonMaterials = async (courseId: string, lessonId: string): Promise<{ assignments: any[], quizzes: any[] }> => {
    console.log(`🔍 Frontend calling: /materials with courseId=${courseId}, lessonId=${lessonId}`);
    console.log(`🔍 Base URL: ${api.defaults.baseURL}`);
    const response = await api.get<{ assignments: any[], quizzes: any[] }>(`/materials`, {
        params: { courseId, lessonId }
    });
    return response.data;
};
