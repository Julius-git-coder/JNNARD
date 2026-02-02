'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { useTasks } from '@/hooks/useTasks';
import { TaskTable } from './_components/task-table';
import { CreateTaskDialog } from './_components/create-task-dialog';
import { Skeleton } from '@/components/ui/skeleton';

export default function TasksPage() {
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { tasks, isLoading, refreshTasks } = useTasks();

    const handleCreate = () => {
        setSelectedTask(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (task: Task) => {
        setSelectedTask(task);
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">Tasks</h1>
                <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleCreate}
                    tooltip="Create new task"
                >
                    <Plus className="mr-2 h-4 w-4" /> New Task
                </Button>
            </div>

            <CreateTaskDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSuccess={refreshTasks}
                task={selectedTask || undefined}
            />

            {isLoading ? (
                <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
            ) : tasks.length > 0 ? (
                <TaskTable tasks={tasks} onUpdate={refreshTasks} onEdit={handleEdit} />
            ) : (
                <EmptyState
                    title="No tasks found"
                    description="Get started by assigning your first task."
                    actionLabel="Create Task"
                    onAction={handleCreate}
                />
            )}
        </div>
    );
}

