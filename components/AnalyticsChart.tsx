"use client"

/**
 * Analytics Chart Component
 * Displays enrollment trends over time using Recharts
 */

import React from 'react';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingSpinner from '@/components/LoadingSpinner';

interface AnalyticsData {
    date: string;
    count: number;
}

interface AnalyticsChartProps {
    data: AnalyticsData[];
    loading?: boolean;
    title?: string;
    description?: string;
    chartType?: 'line' | 'area';
}

export default function AnalyticsChart({
    data,
    loading = false,
    title = 'Enrollment Trends',
    description = 'Daily enrollment statistics',
    chartType = 'area',
}: AnalyticsChartProps) {
    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] flex items-center justify-center">
                    <LoadingSpinner size="lg" text="Loading chart data..." />
                </CardContent>
            </Card>
        );
    }

    if (!data || data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] flex items-center justify-center">
                    <p className="text-muted-foreground">No enrollment data available for the selected period</p>
                </CardContent>
            </Card>
        );
    }

    // Format date for display
    const formattedData = data.map(item => ({
        ...item,
        displayDate: new Date(item.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        }),
    }));

    // Custom tooltip
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background border border-border rounded-lg shadow-lg p-3">
                    <p className="text-sm font-medium">
                        {new Date(payload[0].payload.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </p>
                    <p className="text-sm text-primary font-semibold mt-1">
                        Enrollments: {payload[0].value}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    {chartType === 'area' ? (
                        <AreaChart data={formattedData}>
                            <defs>
                                <linearGradient id="colorEnrollments" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis
                                dataKey="displayDate"
                                className="text-xs"
                                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                            />
                            <YAxis
                                className="text-xs"
                                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                allowDecimals={false}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="count"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                                fill="url(#colorEnrollments)"
                                name="Enrollments"
                            />
                        </AreaChart>
                    ) : (
                        <LineChart data={formattedData}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis
                                dataKey="displayDate"
                                className="text-xs"
                                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                            />
                            <YAxis
                                className="text-xs"
                                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                allowDecimals={false}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="hsl(var(--primary))"
                                strokeWidth={2}
                                dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                                activeDot={{ r: 6 }}
                                name="Enrollments"
                            />
                        </LineChart>
                    )}
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
