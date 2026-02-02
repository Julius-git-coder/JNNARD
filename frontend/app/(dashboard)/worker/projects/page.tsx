'use client';

import React from 'react';
import { useWorkerDashboard } from '@/hooks/useWorkerDashboard';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, User } from 'lucide-react';

export default function WorkerProjectsPage() {
    const { projects, isLoading } = useWorkerDashboard();

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-48" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-48 w-full" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">My Projects</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.length > 0 ? (
                    projects.map((project: any) => (
                        <Card key={project._id} className="border-gray-200 dark:border-gray-800 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <CardTitle className="text-lg">{project.title}</CardTitle>
                                        <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                            {project.status}
                                        </div>
                                    </div>
                                </div>
                                <CardDescription className="line-clamp-2 mt-2">
                                    {project.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Calendar className="h-4 w-4" />
                                        <span>
                                            {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'} - {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <User className="h-4 w-4" />
                                        <span>Role: Contributor</span>
                                    </div>
                                    <div className="mt-4">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span>Team Members</span>
                                            <span>{project.members?.length || 0}</span>
                                        </div>
                                        <div className="flex -space-x-2 overflow-hidden">
                                            {project.members?.map((member: any) => (
                                                <img
                                                    key={member._id}
                                                    className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-gray-950"
                                                    src={member.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}`}
                                                    alt={member.name}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card className="col-span-full border-gray-200 dark:border-gray-800 p-12 text-center">
                        <p className="text-gray-500">You are not currently assigned to any projects.</p>
                    </Card>
                )}
            </div>
        </div>
    );
}
