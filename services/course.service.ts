/**
 * Course service
 * Handles all course-related API calls
 */

import api from '@/lib/api';
import type {
    Course,
    CourseFilters,
    CourseFormData,
    PaginatedResponse
} from '@/lib/types';

/**
 * Get all courses with optional filters
 */
export const getAllCourses = async (
    filters?: CourseFilters
): Promise<PaginatedResponse<Course>> => {
    const params = new URLSearchParams();

    if (filters?.search) params.append('search', filters.search);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.tags) params.append('tags', filters.tags);
    if (filters?.sort) params.append('sort', filters.sort);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await api.get<PaginatedResponse<Course>>(
        `/api/courses?${params.toString()}`
    );
    return response.data;
};

/**
 * Get course by ID
 */
export const getCourseById = async (id: string): Promise<{ course: Course }> => {
    const response = await api.get<{ course: Course }>(`/api/courses/${id}`);
    return response.data;
};

/**
 * Create new course (Admin only)
 */
export const createCourse = async (
    data: CourseFormData
): Promise<{ message: string; course: Course }> => {
    const response = await api.post<{ message: string; course: Course }>(
        '/api/courses/admin/create',
        data
    );
    return response.data;
};

/**
 * Update course (Admin only)
 */
export const updateCourse = async (
    id: string,
    data: Partial<CourseFormData>
): Promise<{ message: string; course: Course }> => {
    const response = await api.put<{ message: string; course: Course }>(
        `/api/courses/admin/${id}`,
        data
    );
    return response.data;
};

/**
 * Delete course (Admin only)
 */
export const deleteCourse = async (id: string): Promise<{ message: string }> => {
    const response = await api.delete<{ message: string }>(
        `/api/courses/admin/${id}`
    );
    return response.data;
};
