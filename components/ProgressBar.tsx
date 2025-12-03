/**
 * Progress Bar Component
 * Visual progress indicator with percentage
 */

import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
    percentage: number;
    className?: string;
    showLabel?: boolean;
}

export default function ProgressBar({
    percentage,
    className,
    showLabel = true
}: ProgressBarProps) {
    // Ensure percentage is between 0 and 100
    const normalizedPercentage = Math.min(Math.max(percentage, 0), 100);

    // Determine color based on percentage
    const getColor = () => {
        if (normalizedPercentage >= 75) return 'bg-green-500';
        if (normalizedPercentage >= 50) return 'bg-blue-500';
        if (normalizedPercentage >= 25) return 'bg-yellow-500';
        return 'bg-orange-500';
    };

    return (
        <div className={cn('w-full', className)}>
            <div className="flex items-center justify-between mb-1">
                {showLabel && (
                    <span className="text-sm font-medium text-muted-foreground">
                        Progress
                    </span>
                )}
                <span className="text-sm font-semibold">
                    {normalizedPercentage.toFixed(0)}%
                </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                    className={cn(
                        'h-full transition-all duration-500 ease-out rounded-full',
                        getColor()
                    )}
                    style={{ width: `${normalizedPercentage}%` }}
                />
            </div>
        </div>
    );
}
