'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Task } from '@/hooks/useTasks';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { taskApi } from '@/lib/api';
import { format } from 'date-fns';
import { handleError, handleSuccess } from '@/lib/error-handler';
import { Edit2, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { CreateTaskDialog } from './create-task-dialog';
import { useState, useEffect } from 'react';

interface TaskTableProps {
    tasks: Task[];
    onUpdate: () => void;
}

export function TaskTable({ tasks, onUpdate }: TaskTableProps) {
    const [user, setUser] = useState<any>(null);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
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
        <div className="border rounded-lg bg-white dark:bg-gray-950 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <Table className="min-w-[800px] md:min-w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Task</TableHead>
                            <TableHead>Project</TableHead>
                            <TableHead>Assigned To</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Status</TableHead>
                            {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tasks.map((task) => (
                            <TableRow key={task._id}>
                                <TableCell className="font-medium">
                                    <div>
                                        {task.title}
                                        {task.description && <p className="text-xs text-gray-500 font-normal">{task.description}</p>}
                                    </div>
                                </TableCell>
                                <TableCell>{task.project?.title || 'Unknown'}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={task.assignedTo?.avatar} />
                                            <AvatarFallback>{task.assignedTo?.name?.[0] || '?'}</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm">{task.assignedTo?.name || 'Unassigned'}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={task.priority === 'High' ? 'destructive' : task.priority === 'Medium' ? 'secondary' : 'outline'}>
                                        {task.priority}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-sm text-gray-500">
                                    {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No date'}
                                </TableCell>
                                <TableCell>
                                    <Select
                                        value={task.status}
                                        onValueChange={(val) => handleStatusChange(task._id, val)}
                                    >
                                        <SelectTrigger className="w-[130px] h-8 text-xs" tooltip="Change status">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="To Do">To Do</SelectItem>
                                            <SelectItem value="In Progress">In Progress</SelectItem>
                                            <SelectItem value="Done">Done</SelectItem>
                                            <SelectItem value="Blocked">Blocked</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                {isAdmin && (
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                onClick={() => setEditingTask(task)}
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
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                        {tasks.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                                    No tasks found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <CreateTaskDialog
                open={!!editingTask}
                onOpenChange={(open) => !open && setEditingTask(null)}
                onSuccess={() => {
                    onUpdate();
                    setEditingTask(null);
                }}
                task={editingTask || undefined}
            />

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
