'use client';

import React from 'react';
import { useWorkerDashboard } from '@/hooks/useWorkerDashboard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LayoutDashboard, CheckSquare, Folder, BarChart2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function WorkerDashboardPage() {
    const { projects, tasks, performance, isLoading } = useWorkerDashboard();

    const isEdited = (item: any) => {
        if (!item.updatedAt || !item.createdAt) return false;
        const created = new Date(item.createdAt).getTime();
        const updated = new Date(item.updatedAt).getTime();
        return updated - created > 10000;
    };

    React.useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const parsedUser = JSON.parse(user);
            if (parsedUser.role === 'admin') {
                window.location.href = '/dashboard';
            }
        }
    }, []);

    const stats = [
        { title: 'Total Projects', value: projects.length, icon: Folder, color: 'text-blue-600' },
        { title: 'Active Tasks', value: tasks.filter(t => t.status !== 'Done').length, icon: CheckSquare, color: 'text-orange-600' },
        { title: 'Completed Tasks', value: tasks.filter(t => t.status === 'Done').length, icon: LayoutDashboard, color: 'text-green-600' },
        { title: 'Performance Reviews', value: performance.length, icon: BarChart2, color: 'text-purple-600' },
    ];

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-48" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full" />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Skeleton className="h-80 w-full" />
                    <Skeleton className="h-80 w-full" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">Welcome Back</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <Card key={index} className="border-gray-200 dark:border-gray-800 shadow-sm transition-all hover:shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-gray-200 dark:border-gray-800">
                    <CardHeader>
                        <CardTitle>Recent Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {projects.length > 0 ? (
                            <div className="space-y-4">
                                {projects.slice(0, 5).map((project: any) => (
                                    <div key={project._id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                                        <div>
                                            <p className="font-medium text-sm">{project.title}</p>
                                            <p className="text-xs text-gray-500 line-clamp-1">{project.description}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <div className="text-xs font-semibold px-2 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                                {project.status}
                                            </div>
                                            {isEdited(project) && (
                                                <span className="text-[9px] font-bold text-blue-600 uppercase">Updated</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 text-center py-8">No projects assigned yet.</p>
                        )}
                    </CardContent>
                </Card>

                <Card className="border-gray-200 dark:border-gray-800">
                    <CardHeader>
                        <CardTitle>Upcoming Deadlines</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {tasks.filter(t => t.status !== 'Done').length > 0 ? (
                            <div className="space-y-4">
                                {tasks.filter(t => t.status !== 'Done').slice(0, 5).map((task: any) => (
                                    <div key={task._id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                                        <div>
                                            <p className="font-medium text-sm">{task.title}</p>
                                            <p className="text-xs text-gray-500">{task.project?.title}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-medium text-orange-600">
                                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No deadline'}
                                            </p>
                                            <p className={`text-[10px] font-bold uppercase ${task.priority === 'High' ? 'text-red-500' : 'text-gray-400'}`}>
                                                {task.priority}
                                            </p>
                                            {isEdited(task) && (
                                                <p className="text-[9px] font-bold text-blue-600 uppercase">Updated</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 text-center py-8">No pending tasks.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
