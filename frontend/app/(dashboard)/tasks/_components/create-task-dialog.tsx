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
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{task ? 'Edit Task' : 'Assign New Task'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="task-title">Task Title</Label>
                        <Input
                            id="task-title"
                            placeholder="Deliverable name"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="task-description">Description</Label>
                        <Textarea
                            id="task-description"
                            placeholder="Describe the task details..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="h-20"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Project</Label>
                            <Select value={projectId} onValueChange={setProjectId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select project" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[200px]">
                                    {projects.map(p => (
                                        <SelectItem key={p._id} value={p._id}>{p.title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Assign To</Label>
                            <Select value={workerId} onValueChange={setWorkerId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select worker" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[200px]">
                                    {workers.map(w => (
                                        <SelectItem key={w._id} value={w._id}>
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-4 w-4">
                                                    <AvatarImage src={w.avatar} />
                                                    <AvatarFallback>{w.name[0]}</AvatarFallback>
                                                </Avatar>
                                                <span>{w.name} <span className="text-xs text-gray-500">({w.role})</span></span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Priority</Label>
                            <Select
                                value={priority}
                                onValueChange={(val: any) => setPriority(val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Low">Low</SelectItem>
                                    <SelectItem value="Medium">Medium</SelectItem>
                                    <SelectItem value="High">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Due Date</Label>
                            <Input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Expected Deliverables</Label>
                        <Textarea
                            placeholder="What is the expected outcome?"
                            className="h-20"
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
