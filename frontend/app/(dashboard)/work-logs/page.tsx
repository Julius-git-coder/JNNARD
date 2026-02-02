'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Users, Search } from 'lucide-react';
import { useWorkers, Worker } from '@/hooks/useWorkers';
import { WorkerTable } from './_components/worker-table';
import { CreateWorkerDialog } from './_components/create-worker-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';

export default function WorkLogsPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
    const { workers, isLoading, refreshWorkers } = useWorkers(true); // Enable auto-refresh
    const [searchQuery, setSearchQuery] = useState('');

    console.log('🏢 WorkLogsPage - Workers count:', workers.length);
    console.log('🏢 WorkLogsPage - Workers data:', workers);

    const handleAdd = () => {
        setEditingWorker(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (worker: Worker) => {
        setEditingWorker(worker);
        setIsDialogOpen(true);
    };

    const filteredWorkers = workers.filter(worker =>
        worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (worker.role && worker.role.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    console.log('🔍 WorkLogsPage - Filtered workers count:', filteredWorkers.length);
    console.log('🔍 WorkLogsPage - Search query:', searchQuery);

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
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search by name or role..."
                            className="pl-10 h-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button
                        className="bg-blue-600 hover:bg-blue-700 shadow-sm whitespace-nowrap"
                        onClick={handleAdd}
                        tooltip="Add new team member"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add Member
                    </Button>
                </div>
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
                <>
                    <WorkerTable
                        workers={filteredWorkers}
                        onUpdate={refreshWorkers}
                        onEdit={handleEdit}
                    />
                    {filteredWorkers.length === 0 && searchQuery && (
                        <div className="text-center py-10 text-gray-500">
                            No team members found matching &quot;{searchQuery}&quot;
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

