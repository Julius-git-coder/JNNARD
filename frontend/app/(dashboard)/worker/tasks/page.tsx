'use client';

import React from 'react';
import { useWorkerDashboard } from '@/hooks/useWorkerDashboard';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Calendar, CheckCircle2, Clock, PlayCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function WorkerTasksPage() {
    const { tasks, isLoading, updateTaskStatus } = useWorkerDashboard();

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'To Do': return <Clock className="h-4 w-4 text-gray-500" />;
            case 'In Progress': return <PlayCircle className="h-4 w-4 text-blue-500" />;
            case 'Done': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case 'Blocked': return <AlertCircle className="h-4 w-4 text-red-500" />;
            default: return null;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'High': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
            case 'Medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'Low': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    const handleStatusChange = async (taskId: string, newStatus: string) => {
        const success = await updateTaskStatus(taskId, newStatus);
        if (success) {
            toast.success("Task status updated");
        }
    };

    const isEdited = (task: any) => {
        if (!task.updatedAt || !task.createdAt) return false;
        const created = new Date(task.createdAt).getTime();
        const updated = new Date(task.updatedAt).getTime();
        return updated - created > 10000; // More than 10 seconds difference for workers to be safe
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-48" />
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-24 w-full" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">My Tasks</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tasks.length > 0 ? (
                    tasks.map((task: any) => (
                        <Card key={task._id} className="border-gray-200 dark:border-gray-800 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg font-bold leading-tight">{task.title}</CardTitle>
                                    <Badge variant="outline" className={`shrink-0 ml-2 ${getPriorityColor(task.priority)}`}>
                                        {task.priority}
                                    </Badge>
                                    {isEdited(task) && (
                                        <Badge variant="outline" className="shrink-0 ml-2 bg-blue-50 text-blue-600 border-blue-200 text-[10px] py-0 h-4">
                                            Updated
                                        </Badge>
                                    )}
                                </div>
                                <CardDescription className="line-clamp-2 mt-2 h-10" title={task.description}>
                                    {task.description || "No description provided."}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col justify-between pt-0">
                                <div className="space-y-3 mt-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <div className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                            <Briefcase className="h-4 w-4 text-gray-400" />
                                            {task.project?.title || 'No Project'}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Calendar className="h-4 w-4" />
                                        <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Due Date'}</span>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Status</span>
                                        </div>
                                        <Select
                                            value={task.status}
                                            onValueChange={(val) => handleStatusChange(task._id, val)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <div className="flex items-center gap-2">
                                                    {getStatusIcon(task.status)}
                                                    <SelectValue />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="To Do">To Do</SelectItem>
                                                <SelectItem value="In Progress">In Progress</SelectItem>
                                                <SelectItem value="Done">Done</SelectItem>
                                                <SelectItem value="Blocked">Blocked</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card className="col-span-full border-gray-200 dark:border-gray-800 p-12 text-center">
                        <div className="flex flex-col items-center justify-center space-y-3">
                            <Briefcase className="h-12 w-12 text-gray-300" />
                            <p className="text-gray-500 font-medium">No tasks assigned to you yet.</p>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
