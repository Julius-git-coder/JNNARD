'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Worker } from '@/hooks/useWorkers';
import { Button } from '@/components/ui/button';
import { Edit2, Shield, UserMinus } from 'lucide-react';
import { workerApi } from '@/lib/api';

interface WorkerTableProps {
    workers: Worker[];
    onUpdate: () => void;
    onEdit: (worker: Worker) => void;
}

export function WorkerTable({ workers, onUpdate, onEdit }: WorkerTableProps) {
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to remove this worker?')) return;
        try {
            await workerApi.delete(id);
            onUpdate();
        } catch (error) {
            console.error("Failed to delete worker:", error);
        }
    };

    return (
        <div className="border rounded-lg bg-white dark:bg-gray-950 shadow-sm overflow-hidden">
            <div className="overflow-auto max-h-[320px]">
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
                                    <Badge variant={worker.status === 'Active' ? 'default' : worker.status === 'Busy' ? 'secondary' : 'outline'}>
                                        {worker.status}
                                    </Badge>
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
        </div>
    );
}
