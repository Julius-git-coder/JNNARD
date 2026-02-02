'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { taskApi } from '@/lib/api';
import { useProjects } from '@/app/(dashboard)/projects/useProjects';
import { useWorkers } from '@/hooks/useWorkers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { handleError, handleSuccess } from '@/lib/error-handler';

import { Task } from '@/hooks/useTasks';

interface CreateTaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    task?: Task;
}

export function CreateTaskDialog({ open, onOpenChange, onSuccess, task }: CreateTaskDialogProps) {
    const [title, setTitle] = useState(task?.title || '');
    const [description, setDescription] = useState(task?.description || '');
    const [projectId, setProjectId] = useState(task?.project?._id || '');
    const [workerId, setWorkerId] = useState(task?.assignedTo?._id || '');
    const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>(task?.priority || 'Medium');
    const [dueDate, setDueDate] = useState(task?.dueDate ? task.dueDate.split('T')[0] : '');
    const [deliverables, setDeliverables] = useState(task?.deliverables || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    React.useEffect(() => {
        if (open) {
            setTitle(task?.title || '');
            setDescription(task?.description || '');
            setProjectId(task?.project?._id || '');
            setWorkerId(task?.assignedTo?._id || '');
            setPriority(task?.priority || 'Medium');
            setDueDate(task?.dueDate ? task.dueDate.split('T')[0] : '');
            setDeliverables(task?.deliverables || '');
        }
    }, [open, task]);

    const { projects } = useProjects();
    const { workers } = useWorkers();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const taskData: any = {
                title,
                description,
                project: projectId,
                assignedTo: workerId || null,
                priority,
                dueDate: dueDate || null,
                deliverables,
            };

            if (task) {
                // Keep the current status when editing via this dialog
                taskData.status = task.status;
                await taskApi.update(task._id, taskData);
                handleSuccess('Task has been updated successfully.');
            } else {
                await taskApi.create(taskData);
                handleSuccess('Task has been assigned successfully.');
            }
            onSuccess();
            onOpenChange(false);
            if (!task) {
                // Reset only if creating
                setTitle('');
                setDescription('');
                setProjectId('');
                setWorkerId('');
                setPriority('Medium');
                setDueDate('');
                setDeliverables('');
            }
        } catch (error) {
            handleError(error, task ? "Failed to update task." : "Failed to create task.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
                <DialogHeader className="pb-2 border-b">
                    <DialogTitle className="text-xl font-bold">{task ? 'Edit Task' : 'Assign New Task'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-8 py-8">
                    <div className="space-y-3">
                        <Label htmlFor="task-title" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Task Title</Label>
                        <Input
                            id="task-title"
                            placeholder="e.g., Design System Update"
                            required
                            className="h-11 shadow-sm focus:ring-2 focus:ring-blue-500/20"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="space-y-3">
                        <Label htmlFor="task-description" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Description</Label>
                        <Textarea
                            id="task-description"
                            placeholder="Provide a detailed overview of the task requirements..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="h-28 shadow-sm focus:ring-2 focus:ring-blue-500/20 resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Project</Label>
                            <Select value={projectId} onValueChange={setProjectId}>
                                <SelectTrigger className="h-11 shadow-sm">
                                    <SelectValue placeholder="Select project" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[200px]">
                                    {projects.map(p => (
                                        <SelectItem key={p._id} value={p._id}>{p.title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-3">
                            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Assign To</Label>
                            <Select value={workerId} onValueChange={setWorkerId}>
                                <SelectTrigger className="h-11 shadow-sm">
                                    <SelectValue placeholder="Select worker" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[200px]">
                                    {workers.map(w => (
                                        <SelectItem key={w._id} value={w._id}>
                                            <div className="flex items-center gap-4 py-2 w-full">
                                                <Avatar className="h-10 w-10 shrink-0 border border-gray-100 dark:border-gray-800 shadow-sm">
                                                    <AvatarImage src={w.avatar} />
                                                    <AvatarFallback className="bg-blue-50 text-blue-600 font-bold">{w.name[0]}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col gap-0.5 overflow-hidden">
                                                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{w.name}</span>
                                                    <span className="text-[11px] font-medium text-gray-500 uppercase tracking-tight truncate">{w.role}</span>
                                                </div>
                                            </div>
                                        </SelectItem>))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Priority Level</Label>
                            <Select
                                value={priority}
                                onValueChange={(val: any) => setPriority(val)}
                            >
                                <SelectTrigger className="h-11 shadow-sm">
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-3">
                            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Target Due Date</Label>
                            <Input
                                type="date"
                                className="h-11 shadow-sm"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Expected Deliverables</Label>
                        <Textarea
                            placeholder="What specific artifacts or results are expected?"
                            className="h-28 shadow-sm focus:ring-2 focus:ring-blue-500/20 resize-none"
                            value={deliverables}
                            onChange={(e) => setDeliverables(e.target.value)}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                            {isSubmitting ? (task ? 'Updating...' : 'Assigning...') : (task ? 'Update Task' : 'Assign Task')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
