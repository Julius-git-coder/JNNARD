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

interface TaskTableProps {
    tasks: Task[];
    onUpdate: () => void;
}

export function TaskTable({ tasks, onUpdate }: TaskTableProps) {
    const handleStatusChange = async (taskId: string, newStatus: string) => {
        try {
            await taskApi.update(taskId, { status: newStatus });
            handleSuccess(`Task status updated to ${newStatus}.`);
            onUpdate();
        } catch (error) {
            handleError(error, "Failed to update task status.");
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
                                        <SelectTrigger className="w-[130px] h-8 text-xs">
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
        </div>
    );
}
