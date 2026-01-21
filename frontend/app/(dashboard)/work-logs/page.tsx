'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import { useWorkers, Worker } from '@/hooks/useWorkers';
import { WorkerTable } from './_components/worker-table';
import { CreateWorkerDialog } from './_components/create-worker-dialog';
import { Skeleton } from '@/components/ui/skeleton';

export default function WorkLogsPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
    const { workers, isLoading, refreshWorkers } = useWorkers();

    const handleAdd = () => {
        setEditingWorker(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (worker: Worker) => {
        setEditingWorker(worker);
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                        <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">Team Management</h1>
                        <p className="text-sm text-gray-500">Manage your workforce repository for project and task assignments.</p>
                    </div>
                </div>
                <Button
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 shadow-sm"
                    onClick={handleAdd}
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Member
                </Button>
            </div>

            <CreateWorkerDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSuccess={refreshWorkers}
                workerToEdit={editingWorker}
            />

            {isLoading ? (
                <div className="space-y-3">
                    <Skeleton className="h-[400px] w-full rounded-lg" />
                </div>
            ) : (
                <WorkerTable
                    workers={workers}
                    onUpdate={refreshWorkers}
                    onEdit={handleEdit}
                />
            )}
        </div>
    );
}

