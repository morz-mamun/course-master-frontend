"use client"

/**
 * Admin Analytics Dashboard Page
 * Displays enrollment analytics and trends
 */

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingSpinner from '@/components/LoadingSpinner';
import AnalyticsChart from '@/components/AnalyticsChart';
import { adminService } from '@/services/admin.service';
import { TrendingUp, Users, Calendar, BarChart3 } from 'lucide-react';

interface AnalyticsData {
    date: string;
    count: number;
}

interface AnalyticsSummary {
    totalEnrollments: number;
    averagePerDay: number;
    dateRange: {
        start: string;
        end: string;
    };
}

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData[]>([]);
    const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await adminService.getEnrollmentAnalytics();
            setData(response.data);
            setSummary(response.summary);
        } catch (err) {
            console.error('Failed to fetch analytics:', err);
            setError('Failed to load analytics data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Total Enrollments',
            value: summary?.totalEnrollments || 0,
            description: `In the last 30 days`,
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
        },
        {
            title: 'Average Per Day',
            value: summary?.averagePerDay?.toFixed(2) || '0.00',
            description: 'Daily enrollment average',
            icon: TrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
        },
        {
            title: 'Date Range',
            value: summary ? `${new Date(summary.dateRange.start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(summary.dateRange.end).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : 'N/A',
            description: 'Analysis period',
            icon: Calendar,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
        },
    ];

    if (loading) {
        return (
            <div className="bg-background">
                <header className="container mx-auto bg-card mt-6">
                    <div className="px-3">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Analytics Dashboard</h1>
                        <p className="text-muted-foreground">
                            Track enrollment trends and insights
                        </p>
                    </div>
                </header>
                <main className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <LoadingSpinner size="lg" text="Loading analytics..." />
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-background">
                <header className="container mx-auto bg-card mt-6">
                    <div className="px-3">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Analytics Dashboard</h1>
                        <p className="text-muted-foreground">
                            Track enrollment trends and insights
                        </p>
                    </div>
                </header>
                <main className="container mx-auto px-4 py-8">
                    <Card>
                        <CardContent className="py-12">
                            <div className="text-center">
                                <p className="text-destructive mb-4">{error}</p>
                                <button
                                    onClick={fetchAnalytics}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                                >
                                    Retry
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </div>
        );
    }

    return (
        <div className="bg-background">
            <header className="container mx-auto bg-card mt-6">
                <div className="px-3">
                    <div className="flex items-center gap-3 mb-2">
                        <BarChart3 className="h-8 w-8 text-primary" />
                        <h1 className="text-3xl md:text-4xl font-bold">Analytics Dashboard</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Track enrollment trends and insights over time
                    </p>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 space-y-8">
                {/* Summary Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {statCards.map((stat) => (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent className="px-3">
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Enrollment Trends Chart */}
                <AnalyticsChart
                    data={data}
                    title="Enrollment Trends"
                    description="Daily enrollment statistics over the last 30 days"
                    chartType="area"
                />

                {/* Additional Insights */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Peak Enrollment Days</CardTitle>
                            <CardDescription>Days with highest enrollment activity</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {data.length > 0 ? (
                                <div className="space-y-2">
                                    {data
                                        .sort((a, b) => b.count - a.count)
                                        .slice(0, 5)
                                        .map((item, index) => (
                                            <div key={item.date} className="flex items-center justify-between py-2 border-b last:border-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                                                    <span className="text-sm">
                                                        {new Date(item.date).toLocaleDateString('en-US', {
                                                            weekday: 'short',
                                                            month: 'short',
                                                            day: 'numeric',
                                                        })}
                                                    </span>
                                                </div>
                                                <span className="text-sm font-semibold text-primary">{item.count} enrollments</span>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No data available</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Enrollment Distribution</CardTitle>
                            <CardDescription>Overview of enrollment patterns</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium">Days with Enrollments</span>
                                        <span className="text-sm font-semibold">
                                            {data.filter(d => d.count > 0).length} / {data.length}
                                        </span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2">
                                        <div
                                            className="bg-primary h-2 rounded-full"
                                            style={{
                                                width: `${(data.filter(d => d.count > 0).length / data.length) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium">Peak Day</span>
                                        <span className="text-sm font-semibold">
                                            {Math.max(...data.map(d => d.count))} enrollments
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium">Lowest Day</span>
                                        <span className="text-sm font-semibold">
                                            {Math.min(...data.map(d => d.count))} enrollments
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
