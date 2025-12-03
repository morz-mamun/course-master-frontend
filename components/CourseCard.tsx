/**
 * Course Card Component
 * Displays course information in a card format
 */

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, DollarSign } from 'lucide-react';
import type { Course } from '@/lib/types';

interface CourseCardProps {
    course: Course;
    showEnrollButton?: boolean;
}

export default function CourseCard({ course, showEnrollButton = false }: CourseCardProps) {
    return (
        <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge variant="secondary" className="capitalize">
                        {course.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                        <DollarSign className="size-4" />
                        {course.price.toFixed(2)}
                    </div>
                </div>
                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                <CardDescription className="line-clamp-3">
                    {course.description}
                </CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
                <div className="flex flex-wrap gap-1">
                    {course.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                        </Badge>
                    ))}
                    {course.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                            +{course.tags.length - 3}
                        </Badge>
                    )}
                </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="size-4" />
                    <span>{course.enrollmentCount} enrolled</span>
                </div>
                <Link href={`/courses/${course._id}`}>
                    <Button size="sm" variant={showEnrollButton ? "default" : "outline"}>
                        View Details
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
