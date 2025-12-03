/**
 * Empty State Component
 * Display when no data is available
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { FileQuestion } from 'lucide-react';

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}

export default function EmptyState({
    icon,
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    return (
        <div className={cn(
            'flex flex-col items-center justify-center py-12 px-4 text-center',
            className
        )}>
            <div className="mb-4 text-muted-foreground">
                {icon || <FileQuestion className="size-16" />}
            </div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            {description && (
                <p className="text-sm text-muted-foreground mb-6 max-w-md">
                    {description}
                </p>
            )}
            {action && <div>{action}</div>}
        </div>
    );
}
