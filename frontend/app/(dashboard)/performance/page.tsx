'use client';

import React, { useState } from 'react';
import { PerformanceChart } from '../_components/performance-chart';
import { Button } from '@/components/ui/button';
import { Plus, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { usePerformance, PerformanceRecord } from '@/hooks/usePerformance';
import { UpdatePerformanceDialog } from './_components/update-performance-dialog';
import { performanceApi } from '@/lib/api';
import { handleError, handleSuccess } from '@/lib/error-handler';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

export default function PerformancePage() {
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [recordToEdit, setRecordToEdit] = useState<PerformanceRecord | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [idToDelete, setIdToDelete] = useState<string | null>(null);
    const { records, isLoading, refreshRecords } = usePerformance();

    const handleEdit = (record: PerformanceRecord) => {
        setRecordToEdit(record);
        setIsUpdateDialogOpen(true);
    };

    const handleAdd = () => {
        setRecordToEdit(null);
        setIsUpdateDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        setIdToDelete(id);
    };

    const confirmDelete = async () => {
        if (!idToDelete) return;
        try {
            await performanceApi.delete(idToDelete);
            handleSuccess('Performance record deleted successfully.');
            refreshRecords();
        } catch (error) {
            handleError(error, 'Failed to delete performance record.');
        } finally {
            setIdToDelete(null);
        }
    };

    const filteredRecords = records.filter(record =>
        record.worker?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.worker?.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.project?.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">Performance Overview</h1>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    className="pl-9 h-10 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800"
                                    placeholder="Search by worker or role..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Filter performance records</p>
                        </TooltipContent>
                    </Tooltip>
                    <Button
                        className="bg-blue-600 hover:bg-blue-700 shrink-0"
                        onClick={handleAdd}
                        tooltip="Record new performance"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Record Performance
                    </Button>
                </div>
            </div>

            <UpdatePerformanceDialog
                open={isUpdateDialogOpen}
                onOpenChange={setIsUpdateDialogOpen}
                onSuccess={refreshRecords}
                recordToEdit={recordToEdit}
            />

            <div className="grid grid-cols-1 gap-6">
                <div className="h-[400px]">
                    <PerformanceChart isLoading={isLoading} />
                </div>

                <div className="border rounded-lg bg-white dark:bg-gray-950 shadow-sm overflow-hidden">
                    <div className="overflow-auto max-h-[320px]">
                        <Table className="min-w-[700px] md:min-w-full relative">
                            <TableHeader className="sticky top-0 bg-white dark:bg-gray-950 z-10 shadow-sm">
                                <TableRow>
                                    <TableHead className="bg-inherit">Worker</TableHead>
                                    <TableHead className="bg-inherit">Project</TableHead>
                                    <TableHead className="bg-inherit">Target</TableHead>
                                    <TableHead className="bg-inherit">Actual</TableHead>
                                    <TableHead className="bg-inherit">Status</TableHead>
                                    <TableHead className="bg-inherit">Last Updated</TableHead>
                                    <TableHead className="bg-inherit text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRecords.map((record) => (
                                    <TableRow key={record._id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={record.worker?.avatar} alt={record.worker?.name} />
                                                    <AvatarFallback>{record.worker?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{record.worker?.name}</p>
                                                    <p className="text-xs text-gray-500">{record.worker?.role}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{record.project?.title}</TableCell>
                                        <TableCell>{record.target}%</TableCell>
                                        <TableCell>{record.actual}%</TableCell>
                                        <TableCell>
                                            <Badge variant={record.status === 'Off Track' ? 'destructive' : 'secondary'}>
                                                {record.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-500">
                                            {new Date(record.evaluationDate).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                    onClick={() => handleEdit(record)}
                                                    tooltip="Edit Record"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleDelete(record._id)}
                                                    tooltip="Delete Record"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredRecords.length === 0 && !isLoading && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                                            {searchQuery ? `No results found for "${searchQuery}"` : "No performance records found."}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            <ConfirmationDialog
                open={!!idToDelete}
                onOpenChange={(open) => !open && setIdToDelete(null)}
                onConfirm={confirmDelete}
                title="Delete Performance Record"
                description="Are you sure you want to delete this performance record? This action cannot be undone."
                confirmLabel="Delete Record"
            />
        </div>
    );
}
