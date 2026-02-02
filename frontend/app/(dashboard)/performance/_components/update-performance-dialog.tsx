'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { performanceApi } from '@/lib/api';
import { useWorkers } from '@/hooks/useWorkers';
import { useProjects } from '@/app/(dashboard)/projects/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { PerformanceRecord } from '@/hooks/usePerformance';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { handleError, handleSuccess } from '@/lib/error-handler';

interface UpdatePerformanceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    recordToEdit?: PerformanceRecord | null;
}

export function UpdatePerformanceDialog({ open, onOpenChange, onSuccess, recordToEdit }: UpdatePerformanceDialogProps) {
    const [workerId, setWorkerId] = useState('');
    const [projectId, setProjectId] = useState('');
    const [taskId, setTaskId] = useState('');
    const [metric, setMetric] = useState('Completion');
    const [target, setTarget] = useState(100);
    const [actual, setActual] = useState(0);
    const [status, setStatus] = useState('On Track');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    React.useEffect(() => {
        if (open) {
            if (recordToEdit) {
                setWorkerId(recordToEdit.worker?._id || '');
                setProjectId(recordToEdit.project?._id || '');
                setTaskId(recordToEdit.task?._id || '');
                setMetric(recordToEdit.metric);
                setTarget(recordToEdit.target);
                setActual(recordToEdit.actual);
                setStatus(recordToEdit.status);
                setNotes(recordToEdit.notes || '');
            } else {
                setWorkerId('');
                setProjectId('');
                setTaskId('');
                setMetric('Completion');
                setTarget(100);
                setActual(0);
                setStatus('On Track');
                setNotes('');
            }
        }
    }, [open, recordToEdit]);

    const { workers } = useWorkers();
    const { projects } = useProjects();
    const { tasks } = useTasks(projectId); // Fetch tasks for selected project

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const payload = {
                worker: workerId,
                project: projectId,
                task: taskId || undefined,
                metric,
                target,
                actual,
                status,
                notes,
            };

            if (recordToEdit) {
                await performanceApi.update(recordToEdit._id, payload);
                handleSuccess("Performance record has been updated successfully.");
            } else {
                await performanceApi.create(payload);
                handleSuccess("Performance record has been saved successfully.");
            }
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            handleError(error, "We couldn't save the performance record. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{recordToEdit ? 'Edit Performance Record' : 'Update Performance Record'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Worker</Label>
                            <Select value={workerId} onValueChange={setWorkerId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select worker" />
                                </SelectTrigger>
                                <SelectContent>
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
                        <div className="space-y-2">
                            <Label>Project</Label>
                            <Select value={projectId} onValueChange={setProjectId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select project" />
                                </SelectTrigger>
                                <SelectContent>
                                    {projects.map(p => (
                                        <SelectItem key={p._id} value={p._id}>{p.title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Specific Task (Optional)</Label>
                        <Select value={taskId} onValueChange={setTaskId} disabled={!projectId}>
                            <SelectTrigger>
                                <SelectValue placeholder={projectId ? "Select task" : "Select project first"} />
                            </SelectTrigger>
                            <SelectContent>
                                {tasks.map(t => (
                                    <SelectItem key={t._id} value={t._id}>{t.title}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Target (%)</Label>
                            <Input
                                type="number"
                                value={target}
                                onChange={(e) => setTarget(Number(e.target.value))}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Actual Progress (%)</Label>
                            <Input
                                type="number"
                                value={actual}
                                onChange={(e) => setActual(Number(e.target.value))}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Performance Status</Label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="On Track">On Track</SelectItem>
                                <SelectItem value="Off Track">Off Track</SelectItem>
                                <SelectItem value="Exceeded">Exceeded</SelectItem>
                                <SelectItem value="Needs Improvement">Needs Improvement</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Evaluation Notes</Label>
                        <Textarea
                            placeholder="Add any specific comments..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                            {isSubmitting ? 'Saving...' : recordToEdit ? 'Save Changes' : 'Record Performance'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
