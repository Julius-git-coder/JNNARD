'use client';

import React, { useState } from 'react';
import { PerformanceChart } from '../_components/performance-chart';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { usePerformance } from '@/hooks/usePerformance';
import { UpdatePerformanceDialog } from './_components/update-performance-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function PerformancePage() {
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const { records, isLoading, refreshRecords } = usePerformance();

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">Performance Overview</h1>
                <Button
                    className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                    onClick={() => setIsUpdateDialogOpen(true)}
                >
                    <Plus className="mr-2 h-4 w-4" /> Record Performance
                </Button>
            </div>

            <UpdatePerformanceDialog
                open={isUpdateDialogOpen}
                onOpenChange={setIsUpdateDialogOpen}
                onSuccess={refreshRecords}
            />

            <div className="grid grid-cols-1 gap-6">
                <div className="h-[400px]">
                    <PerformanceChart isLoading={isLoading} />
                </div>

                <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-950">
                    <div className="overflow-x-auto">
                        <Table className="min-w-[700px] md:min-w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Worker</TableHead>
                                    <TableHead>Project</TableHead>
                                    <TableHead>Target</TableHead>
                                    <TableHead>Actual</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Last Updated</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {records.map((record) => (
                                    <TableRow key={record._id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{record.worker?.name}</p>
                                                <p className="text-xs text-gray-500">{record.worker?.role}</p>
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
                                    </TableRow>
                                ))}
                                {records.length === 0 && !isLoading && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                                            No performance records found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
}
