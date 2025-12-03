"use client"

/**
 * Course Context
 * Manages course state and provides course-related functions
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
    getAllCourses as getAllCoursesService,
    getCourseById as getCourseByIdService,
    createCourse as createCourseService,
    updateCourse as updateCourseService,
    deleteCourse as deleteCourseService,
} from '@/services/course.service';
import { getEnrolledCourses as getEnrolledCoursesService } from '@/services/student.service';
import type {
    Course,
    CourseFilters,
    CourseFormData,
    Enrollment
} from '@/lib/types';

interface CourseContextType {
    courses: Course[];
    enrolledCourses: Enrollment[];
    loading: boolean;
    totalPages: number;
    currentPage: number;
    fetchCourses: (filters?: CourseFilters) => Promise<void>;
    fetchCourseById: (id: string) => Promise<Course>;
    fetchEnrolledCourses: () => Promise<void>;
    createCourse: (data: CourseFormData) => Promise<Course>;
    updateCourse: (id: string, data: Partial<CourseFormData>) => Promise<Course>;
    deleteCourse: (id: string) => Promise<void>;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider = ({ children }: { children: ReactNode }) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [enrolledCourses, setEnrolledCourses] = useState<Enrollment[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchCourses = async (filters?: CourseFilters) => {
        setLoading(true);
        try {
            const response = await getAllCoursesService(filters);
            setCourses(response.data);
            setTotalPages(response.meta.totalPages);
            setCurrentPage(response.meta.page);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchCourseById = async (id: string): Promise<Course> => {
        setLoading(true);
        try {
            const response = await getCourseByIdService(id);
            return response.course;
        } finally {
            setLoading(false);
        }
    };

    const fetchEnrolledCourses = async () => {
        setLoading(true);
        try {
            const response = await getEnrolledCoursesService();
            setEnrolledCourses(response.courses);
        } catch (error) {
            console.error('Error fetching enrolled courses:', error);
            setEnrolledCourses([]);
        } finally {
            setLoading(false);
        }
    };

    const createCourse = async (data: CourseFormData): Promise<Course> => {
        const response = await createCourseService(data);
        // Refresh courses list
        await fetchCourses();
        return response.course;
    };

    const updateCourse = async (
        id: string,
        data: Partial<CourseFormData>
    ): Promise<Course> => {
        const response = await updateCourseService(id, data);
        // Refresh courses list
        await fetchCourses();
        return response.course;
    };

    const deleteCourse = async (id: string) => {
        await deleteCourseService(id);
        // Refresh courses list
        await fetchCourses();
    };

    const value: CourseContextType = {
        courses,
        enrolledCourses,
        loading,
        totalPages,
        currentPage,
        fetchCourses,
        fetchCourseById,
        fetchEnrolledCourses,
        createCourse,
        updateCourse,
        deleteCourse,
    };

    return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
};

export const useCourses = () => {
    const context = useContext(CourseContext);
    if (context === undefined) {
        throw new Error('useCourses must be used within a CourseProvider');
    }
    return context;
};
