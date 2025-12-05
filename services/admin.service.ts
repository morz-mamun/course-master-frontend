/**
 * Admin Service
 * API service for admin-specific operations
 */

import api from '@/lib/api';

interface DashboardStats {
    totalCourses: number;
    totalStudents: number;
    totalEnrollments: number;
    totalAssignments: number;
}

class AdminService {
    async getDashboardStats(): Promise<DashboardStats> {
        try {
            const response = await api.get<DashboardStats>('/admin/stats');
            return response.data;
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            // Return default values if API fails
            return {
                totalCourses: 0,
                totalStudents: 0,
                totalEnrollments: 0,
                totalAssignments: 0,
            };
        }
    }

    async gradeAssignment(data: {
        assignmentId: string;
        submissionId: string;
        score: number;
        feedback?: string;
    }): Promise<any> {
        const response = await api.post('/admin/grade', data);
        return response.data;
    }

    async createAssignment(data: {
        courseId: string;
        lessonId: string;
        title: string;
        description: string;
        dueDate: string;
        maxScore?: number;
    }): Promise<any> {
        const response = await api.post('/admin/assignments', data);
        return response.data;
    }

    async createQuiz(data: {
        courseId: string;
        lessonId: string;
        title: string;
        description?: string;
        questions: Array<{
            questionText: string;
            options: Array<{ text: string; isCorrect: boolean }>;
            explanation?: string;
        }>;
        passingScore?: number;
    }): Promise<any> {
        const response = await api.post('/admin/quizzes', data);
        return response.data;
    }

    async getAssignmentsByLesson(courseId: string, lessonId: string): Promise<{ assignments: any[] }> {
        const response = await api.get(`/admin/assignments/${courseId}/${lessonId}`);
        return response.data;
    }

    async getQuizzesByLesson(courseId: string, lessonId: string): Promise<{ quizzes: any[] }> {
        const response = await api.get(`/admin/quizzes/${courseId}/${lessonId}`);
        return response.data;
    }

    async getEnrollmentAnalytics(startDate?: string, endDate?: string): Promise<{
        data: Array<{ date: string; count: number }>;
        summary: {
            totalEnrollments: number;
            averagePerDay: number;
            dateRange: { start: string; end: string };
        };
    }> {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        const response = await api.get(`/admin/analytics/enrollments?${params.toString()}`);
        return response.data;
    }
}

export const adminService = new AdminService();
