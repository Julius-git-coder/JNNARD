'use client';

import React from 'react';
import { useWorkerDashboard } from '@/hooks/useWorkerDashboard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, PlayCircle, AlertCircle } from 'lucide-react';
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

            <div className="grid gap-4">
                {tasks.length > 0 ? (
                    tasks.map((task: any) => (
                        <Card key={task._id} className="border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="flex flex-col md:flex-row md:items-center p-5 gap-4">
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-base">{task.title}</h3>
                                        <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                            {task.priority}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-gray-500 line-clamp-2">{task.description}</p>
                                    <div className="flex items-center gap-3 text-xs text-gray-400">
                                        <span className="font-medium text-blue-600 dark:text-blue-400">{task.project?.title}</span>
                                        <span>•</span>
                                        <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 shrink-0">
                                    <div className="flex flex-col gap-1.5 min-w-[140px]">
                                        <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Status</label>
                                        <Select
                                            value={task.status}
                                            onValueChange={(val) => handleStatusChange(task._id, val)}
                                        >
                                            <SelectTrigger>
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
                            </div>
                        </Card>
                    ))
                ) : (
                    <Card className="p-12 text-center border-gray-200 dark:border-gray-800">
                        <p className="text-gray-500">No tasks assigned to you yet.</p>
                    </Card>
                )}
            </div>
        </div>
    );
}
