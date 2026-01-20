'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { UserSelectionList } from '../_components/user-selection-list';
import { Upload } from 'lucide-react';
import { useCreateTask } from './useCreateTask';

export default function CreateTaskPage() {
    const { isLoading, formData, setters, actions, users } = useCreateTask();

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>SubTask</span>
                <span>/</span>
                <span className="font-semibold text-gray-900 dark:text-gray-100">Create SubTask</span>
            </div>

            <Card>
                <CardContent className="p-8">
                    <form onSubmit={actions.handleSubmit} className="space-y-8">

                        {/* TOP ROW: Title, Status, Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="font-semibold">SubTask Title</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setters.setTitle(e.target.value)}
                                    className="bg-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status" className="font-semibold">SubTask Status</Label>
                                <Input
                                    id="status"
                                    value={formData.status}
                                    onChange={(e) => setters.setStatus(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="start-date" className="font-semibold">Start Date</Label>
                                <Input
                                    id="start-date"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setters.setStartDate(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="end-date" className="font-semibold">End Date</Label>
                                <Input
                                    id="end-date"
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setters.setEndDate(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* DESCRIPTION */}
                        <div className="space-y-2">
                            <Label htmlFor="description" className="font-semibold">SubTask Description</Label>
                            <Textarea
                                id="description"
                                className="min-h-[120px]"
                                value={formData.description}
                                onChange={(e) => setters.setDescription(e.target.value)}
                            />
                        </div>

                        {/* LISTS: Reporter & Assignee */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <UserSelectionList
                                label="Reporter"
                                users={users}
                                selectedIds={formData.reporters}
                                onToggle={actions.toggleReporter}
                            />
                            <div className="space-y-6">
                                <UserSelectionList
                                    label="Assignee"
                                    users={users}
                                    selectedIds={formData.assignees}
                                    onToggle={actions.toggleAssignee}
                                />

                                {/* ACTIONS */}
                                <div className="flex flex-col gap-4 items-end mt-auto pt-4">
                                    <Button type="button" variant="secondary" className="w-full bg-green-50 text-green-700 hover:bg-green-100 border-green-100 h-12">
                                        <Upload className="mr-2 h-4 w-4" /> Add Attachment
                                    </Button>
                                    <div className="flex gap-4 w-full">
                                        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 h-11" isLoading={isLoading}>
                                            Create
                                        </Button>
                                        <Button type="button" variant="secondary" className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 h-11">
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
