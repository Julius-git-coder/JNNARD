'use client';

import React from 'react';
import { useWorkerDashboard } from '@/hooks/useWorkerDashboard';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Star, MessageSquare, TrendingUp, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function WorkerPerformancePage() {
    const { performance, isLoading } = useWorkerDashboard();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'On Track': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
            case 'Off Track': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
            case 'Exceeded': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
            case 'Needs Improvement': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-24 w-full" />
                <div className="grid gap-6">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 w-full" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">Performance & Feedback</h1>
                    <p className="text-sm text-gray-500">Track your progress and read admin reviews.</p>
                </div>

                <Card className="px-4 py-3 border-blue-200 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <TrendingUp className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400">Average Rating</p>
                            <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-xl font-bold">4.8</span>
                                <span className="text-xs text-gray-400">/ 5.0</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid gap-6">
                {performance.length > 0 ? (
                    performance.map((item: any) => (
                        <Card key={item._id} className="border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                            <CardHeader className="pb-2">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            {item.metric}
                                            <Badge variant="outline" className={getStatusColor(item.status)}>
                                                {item.status}
                                            </Badge>
                                        </CardTitle>
                                        <CardDescription>
                                            Project: <span className="font-medium text-gray-900 dark:text-gray-100">{item.project?.title}</span>
                                            {item.task && <span> • Task: <span className="font-medium">{item.task?.title}</span></span>}
                                        </CardDescription>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400">{new Date(item.evaluationDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-2 space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <MessageSquare className="h-4 w-4 text-gray-400" />
                                                Admin Feedback
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 italic bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-800">
                                                "{item.notes || 'No specific comments provided.'}"
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm font-medium">
                                                <Award className="h-4 w-4 text-gray-400" />
                                                Achievement
                                            </div>
                                            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-center">
                                                <div className="text-3xl font-black text-blue-600">
                                                    {Math.round((item.actual / item.target) * 100)}%
                                                </div>
                                                <p className="text-[10px] text-gray-400 uppercase font-bold mt-1">Goal Reached</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card className="p-12 text-center border-gray-200 dark:border-gray-800">
                        <div className="inline-flex p-3 rounded-full bg-gray-50 dark:bg-gray-900 mb-4">
                            <Award className="h-8 w-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50">No evaluations yet</h3>
                        <p className="text-sm text-gray-500 max-w-xs mx-auto mt-1">Keep working on your tasks to receive performance feedback from the administrators.</p>
                    </Card>
                )}
            </div>
        </div>
    );
}
