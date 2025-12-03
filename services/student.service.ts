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
        '/api/enroll',
        data
    );
    return response.data;
};

/**
 * Get all enrolled courses for the current student
 */
export const getEnrolledCourses = async (): Promise<{ courses: Enrollment[] }> => {
    const response = await api.get<{ courses: Enrollment[] }>('/api/student/courses');
    return response.data;
};

/**
 * Update progress by marking a lesson as complete
 */
export const updateProgress = async (
    data: ProgressUpdateData
): Promise<{ message: string; progress: Progress }> => {
    const response = await api.post<{ message: string; progress: Progress }>(
        '/api/progress',
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
        '/api/assignments',
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
    }>('/api/quiz/submit', data);
    return response.data;
};
