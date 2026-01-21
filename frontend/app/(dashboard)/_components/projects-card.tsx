'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Folder, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { useProjects } from '../projects/useProjects';

export function ProjectsCard({ isLoading: parentLoading }: { isLoading?: boolean }) {
    const { projects, isLoading: projectsLoading } = useProjects();
    const isLoading = parentLoading || projectsLoading;

    if (isLoading) {
        return <Skeleton className="w-full h-[350px] rounded-xl" />;
    }

    const stats = {
        active: projects.filter(p => p.status === 'Active').length,
        offtrack: projects.filter(p => p.status === 'Offtrack').length,
        completed: projects.filter(p => p.status === 'Completed').length,
    };

    return (
        <Card className="h-full border-none shadow-sm overflow-hidden flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-bold">Projects Statistics</CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Folder className="w-4 h-4 text-blue-600" />
                    <span>{projects.length} Total</span>
                </div>
            </CardHeader>
            <CardContent className="p-6 flex-1 flex flex-col justify-around bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
                <div className="grid grid-cols-1 gap-4 w-full">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-blue-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg"><Clock className="w-5 h-5 text-blue-600" /></div>
                            <span className="font-medium">Active</span>
                        </div>
                        <span className="text-2xl font-bold">{stats.active}</span>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-red-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-lg"><AlertTriangle className="w-5 h-5 text-red-600" /></div>
                            <span className="font-medium">Off-track</span>
                        </div>
                        <span className="text-2xl font-bold text-red-600">{stats.offtrack}</span>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-green-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg"><CheckCircle className="w-5 h-5 text-green-600" /></div>
                            <span className="font-medium">Completed</span>
                        </div>
                        <span className="text-2xl font-bold text-green-600">{stats.completed}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

