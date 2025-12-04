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
            const response = await api.get<DashboardStats>('/admin/stats', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            console.log('admin stats', response.data);
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
}

export const adminService = new AdminService();
