/**
 * Admin Service
 * API service for admin-specific operations
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface DashboardStats {
    totalCourses: number;
    totalStudents: number;
    totalEnrollments: number;
    totalAssignments: number;
}

class AdminService {
    private getAuthHeader() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        };
    }

    async getDashboardStats(): Promise<DashboardStats> {
        try {
            const response = await fetch(`${API_URL}/admin/stats`, {
                headers: this.getAuthHeader(),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch dashboard stats');
            }

            const data = await response.json();
            return data;
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
}

export const adminService = new AdminService();
