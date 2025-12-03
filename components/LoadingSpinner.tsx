/**
 * Loading Spinner Component
 * Reusable loading indicator
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    text?: string;
}

export default function LoadingSpinner({
    size = 'md',
    className,
    text
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'size-4',
        md: 'size-8',
        lg: 'size-12',
    };

    return (
        <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
            <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
            {text && (
                <p className="text-sm text-muted-foreground">{text}</p>
            )}
        </div>
    );
}
