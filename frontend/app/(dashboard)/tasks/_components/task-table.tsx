'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Task } from '@/hooks/useTasks';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { taskApi } from '@/lib/api';
import { format } from 'date-fns';
import { handleError, handleSuccess } from '@/lib/error-handler';
import { Edit2, Trash2, MoreHorizontal, Briefcase, Calendar, CheckCircle2, Clock, PlayCircle, AlertCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { CreateTaskDialog } from './create-task-dialog';
import { useState, useEffect } from 'react';

interface TaskTableProps {
    tasks: Task[];
    onUpdate: () => void;
    onEdit: (task: Task) => void;
}

export function TaskTable({ tasks, onUpdate, onEdit }: TaskTableProps) {
    const [user, setUser] = useState<any>(null);
    const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const isAdmin = user?.role === 'admin';

    const handleStatusChange = async (taskId: string, newStatus: string) => {
        try {
            await taskApi.update(taskId, { status: newStatus });
            handleSuccess(`Task status updated to ${newStatus}.`);
            onUpdate();
        } catch (error) {
            handleError(error, "Failed to update task status.");
        }
    };

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

    const handleDelete = async () => {
        if (!deletingTaskId) return;
        try {
            setIsDeleting(true);
            await taskApi.delete(deletingTaskId);
            handleSuccess('Task deleted successfully.');
            onUpdate();
        } catch (error) {
            handleError(error, "Failed to delete task.");
        } finally {
            setIsDeleting(false);
            setDeletingTaskId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <Card key={task._id} className="border-gray-200 dark:border-gray-800 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 mr-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <CardTitle className="text-lg font-bold leading-tight">{task.title}</CardTitle>
                                            <Badge variant="outline" className={`shrink-0 ${getPriorityColor(task.priority)}`}>
                                                {task.priority}
                                            </Badge>
                                        </div>
                                    </div>
                                    {isAdmin && (
                                        <div className="flex items-center gap-1 shrink-0 -mt-1 -mr-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                onClick={() => onEdit(task)}
                                                tooltip="Edit Task"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => setDeletingTaskId(task._id)}
                                                tooltip="Delete Task"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
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
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            <span>{task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No Date'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={task.assignedTo?.avatar} />
                                                <AvatarFallback className="text-xs">{task.assignedTo?.name?.[0] || '?'}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium leading-none">{task.assignedTo?.name || 'Unassigned'}</span>
                                                {task.assignedTo?.role && (
                                                    <span className="text-[10px] text-gray-500 capitalize">{task.assignedTo.role}</span>
                                                )}
                                            </div>
                                        </div>
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
                            <p className="text-gray-500 font-medium">No tasks found. Create one to get started.</p>
                        </div>
                    </Card>
                )}
            </div>

            <ConfirmationDialog
                open={!!deletingTaskId}
                onOpenChange={(open) => !open && setDeletingTaskId(null)}
                onConfirm={handleDelete}
                title="Delete Task"
                description="Are you sure you want to delete this task? This action cannot be undone."
                isLoading={isDeleting}
            />
        </div>
    );
}
