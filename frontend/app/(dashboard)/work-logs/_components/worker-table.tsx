'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Worker } from '@/hooks/useWorkers';
import { Button } from '@/components/ui/button';
import { Edit2, Shield, UserMinus } from 'lucide-react';
import { workerApi } from '@/lib/api';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { handleError, handleSuccess } from '@/lib/error-handler';

interface WorkerTableProps {
    workers: Worker[];
    onUpdate: () => void;
    onEdit: (worker: Worker) => void;
}

export function WorkerTable({ workers, onUpdate, onEdit }: WorkerTableProps) {
    const [idToDelete, setIdToDelete] = React.useState<string | null>(null);

    const handleDelete = (id: string) => {
        setIdToDelete(id);
    };

    const confirmDelete = async () => {
        if (!idToDelete) return;
        try {
            const worker = workers.find(w => w._id === idToDelete);
            await workerApi.delete(idToDelete);
            handleSuccess(`${worker?.name || 'Worker'} has been removed from the team.`);
            onUpdate();
        } catch (error) {
            handleError(error, "Failed to remove team member.");
        } finally {
            setIdToDelete(null);
        }
    };

    const isEdited = (worker: Worker) => {
        if (!worker.updatedAt || !worker.createdAt) return false;
        const created = new Date(worker.createdAt).getTime();
        const updated = new Date(worker.updatedAt).getTime();
        return updated - created > 10000;
    };

    return (
        <div className="border rounded-lg bg-white dark:bg-gray-950 shadow-sm overflow-hidden">
            <div className="overflow-auto max-h-[600px]">
                <Table className="min-w-[600px] md:min-w-full">
                    <TableHeader className="sticky top-0 bg-white dark:bg-gray-950 z-10 shadow-sm">
                        <TableRow>
                            <TableHead className="bg-inherit">Member</TableHead>
                            <TableHead className="bg-inherit">Position / Role</TableHead>
                            <TableHead className="bg-inherit">Status</TableHead>
                            <TableHead className="bg-inherit text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {workers.map((worker) => (
                            <TableRow key={worker._id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9 border">
                                            <AvatarImage src={worker.avatar} />
                                            <AvatarFallback>{worker.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-sm">{worker.name}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-3.5 w-3.5 text-gray-400" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">{worker.role}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <Badge variant={worker.status === 'Active' ? 'default' : worker.status === 'Busy' ? 'secondary' : 'outline'}>
                                            {worker.status}
                                        </Badge>
                                        {isEdited(worker) && (
                                            <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 text-[10px] py-0 h-4 w-fit">
                                                Updated
                                            </Badge>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => onEdit(worker)} tooltip="Edit Member">
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(worker._id)} tooltip="Remove Member">
                                            <UserMinus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {workers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-10 text-gray-500 italic">
                                    No team members added yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <ConfirmationDialog
                open={!!idToDelete}
                onOpenChange={(open) => !open && setIdToDelete(null)}
                onConfirm={confirmDelete}
                title="Remove Team Member"
                description="Are you sure you want to remove this member from the team? This will not delete their historical work logs."
                confirmLabel="Remove Member"
            />
        </div>
    );
}
