"use client"

/**
 * Courses Listing Page
 * Browse all available courses with search and filters
 */

import React, { useEffect, useState } from 'react';
import { useCourses } from '@/contexts/CourseContext';
import CourseCard from '@/components/CourseCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, BookOpen } from 'lucide-react';
import type { CourseFilters } from '@/lib/types';

export default function CoursesPage() {
    const { courses, loading, totalPages, currentPage, fetchCourses } = useCourses();
    const [filters, setFilters] = useState<CourseFilters>({
        search: '',
        category: '',
        sort: 'newest',
        page: 1,
        limit: 12,
    });

    useEffect(() => {
        fetchCourses(filters);
    }, [filters.page, filters.sort]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchCourses(filters);
    };

    const handleFilterChange = (key: keyof CourseFilters, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
    };

    const handlePageChange = (newPage: number) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Browse Courses</h1>
                    <p className="text-muted-foreground">
                        Discover your next learning adventure
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="mb-8 space-y-4">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search courses..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button type="submit">Search</Button>
                    </form>

                    <div className="flex flex-wrap gap-4">
                        <select
                            value={filters.category}
                            onChange={(e) => {
                                handleFilterChange('category', e.target.value);
                                fetchCourses({ ...filters, category: e.target.value });
                            }}
                            className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            <option value="">All Categories</option>
                            <option value="programming">Programming</option>
                            <option value="web development">Web Development</option>
                            <option value="data science">Data Science</option>
                            <option value="design">Design</option>
                            <option value="business">Business</option>
                        </select>

                        <select
                            value={filters.sort}
                            onChange={(e) => {
                                handleFilterChange('sort', e.target.value);
                                fetchCourses({ ...filters, sort: e.target.value as any });
                            }}
                            className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            <option value="newest">Newest First</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {/* Course Grid */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <LoadingSpinner size="lg" text="Loading courses..." />
                    </div>
                ) : courses.length === 0 ? (
                    <EmptyState
                        icon={<BookOpen className="size-16" />}
                        title="No courses found"
                        description="Try adjusting your search or filters"
                    />
                ) : (
                    <>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                            {courses.map((course) => (
                                <CourseCard key={course._id} course={course} showEnrollButton />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </Button>
                                <div className="flex items-center gap-2 px-4">
                                    <span className="text-sm text-muted-foreground">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
