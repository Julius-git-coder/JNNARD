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

    const isEdited = (record: PerformanceRecord) => {
        if (!record.updatedAt || !record.createdAt) return false;
        const created = new Date(record.createdAt).getTime();
        const updated = new Date(record.updatedAt).getTime();
        return updated - created > 10000;
    };

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

                {/* MOBILE VIEW (CARDS) */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                    {filteredRecords.map((record) => (
                        <div key={record._id} className="bg-white dark:bg-gray-950 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 border-2 border-white dark:border-gray-800 shadow-sm">
                                        <AvatarImage src={record.worker?.avatar} alt={record.worker?.name} />
                                        <AvatarFallback className="bg-blue-100 text-blue-700 font-bold uppercase">{record.worker?.name?.substring(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-gray-50">{record.worker?.name}</p>
                                        <p className="text-xs text-gray-400 font-medium">{record.worker?.role}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600" onClick={() => handleEdit(record)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600" onClick={() => handleDelete(record._id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-50 dark:border-gray-900">
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Project</p>
                                    <p className="text-sm font-medium truncate">{record.project?.title}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Status</p>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={record.status === 'Off Track' ? 'destructive' : 'secondary'} className="text-[10px] py-0">
                                            {record.status}
                                        </Badge>
                                        {isEdited(record) && (
                                            <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 text-[9px] py-0 h-4">
                                                Updated
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Target vs Actual</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-blue-600">{record.actual}%</span>
                                        <span className="text-xs text-gray-400">/ {record.target}%</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Evaluation Date</p>
                                    <p className="text-xs text-gray-500">{new Date(record.evaluationDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredRecords.length === 0 && !isLoading && (
                        <div className="p-12 text-center bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                            <p className="text-gray-500">No performance records found.</p>
                        </div>
                    )}
                </div>

                {/* DESKTOP VIEW (TABLE) */}
                <div className="hidden md:block border rounded-xl bg-white dark:bg-gray-950 shadow-sm overflow-hidden">
                    <div className="overflow-auto max-h-[500px]">
                        <Table className="relative">
                            <TableHeader className="sticky top-0 bg-white dark:bg-gray-950 z-10 shadow-sm border-b">
                                <TableRow>
                                    <TableHead className="bg-inherit font-bold py-4">Worker</TableHead>
                                    <TableHead className="bg-inherit font-bold">Project</TableHead>
                                    <TableHead className="bg-inherit font-bold">Target</TableHead>
                                    <TableHead className="bg-inherit font-bold">Actual</TableHead>
                                    <TableHead className="bg-inherit font-bold">Status</TableHead>
                                    <TableHead className="bg-inherit font-bold">Last Updated</TableHead>
                                    <TableHead className="bg-inherit text-right font-bold pr-6">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRecords.map((record) => (
                                    <TableRow key={record._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors">
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9 border border-gray-100">
                                                    <AvatarImage src={record.worker?.avatar} alt={record.worker?.name} />
                                                    <AvatarFallback className="bg-blue-50 text-blue-600 text-xs font-bold">{record.worker?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <p className="font-semibold text-gray-900 dark:text-gray-100">{record.worker?.name}</p>
                                                    <p className="text-[11px] text-gray-400 leading-tight">{record.worker?.role}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">{record.project?.title}</TableCell>
                                        <TableCell>
                                            <span className="text-sm text-gray-500">{record.target}%</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-bold text-blue-600">{record.actual}%</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1 items-start">
                                                <Badge variant={record.status === 'Off Track' ? 'destructive' : 'secondary'} className="rounded-full px-3">
                                                    {record.status}
                                                </Badge>
                                                {isEdited(record) && (
                                                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200 text-[9px] py-0 h-4">
                                                        Updated
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-500">
                                            {new Date(record.evaluationDate).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                    onClick={() => handleEdit(record)}
                                                    tooltip="Edit Record"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
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
                                        <TableCell colSpan={7} className="text-center py-20 bg-gray-50/30">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <p className="text-gray-500 font-medium">
                                                    {searchQuery ? `No results found for "${searchQuery}"` : "No performance records found."}
                                                </p>
                                                {searchQuery && (
                                                    <Button variant="link" size="sm" onClick={() => setSearchQuery('')} className="text-blue-600">
                                                        Clear search filters
                                                    </Button>
                                                )}
                                            </div>
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
