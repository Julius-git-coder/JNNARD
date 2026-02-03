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
import { User, Briefcase, Target, PieChart, ClipboardCheck, Info, Search } from 'lucide-react';
import { toast } from 'sonner';

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
                task: taskId === 'none' || !taskId ? undefined : taskId,
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
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl">
                <DialogHeader className="px-6 pt-6 pb-4 bg-gray-50 dark:bg-gray-900/50 border-b">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <ClipboardCheck className="h-5 w-5 text-blue-600" />
                        {recordToEdit ? 'Edit Performance Review' : 'New Performance Review'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="space-y-4">
                        {/* Assignments Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                                    <User className="h-3 w-3" /> Worker
                                </Label>
                                <Select value={workerId} onValueChange={setWorkerId}>
                                    <SelectTrigger className="h-11 bg-white dark:bg-gray-950 border-gray-200">
                                        <SelectValue placeholder="Select worker" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[300px]">
                                        {workers.map(w => (
                                            <SelectItem key={w._id} value={w._id}>
                                                <div className="flex items-center gap-3 py-1">
                                                    <Avatar className="h-8 w-8 shrink-0 border-2 border-white shadow-sm">
                                                        <AvatarImage src={w.avatar} />
                                                        <AvatarFallback className="bg-blue-100 text-blue-700 font-bold text-xs">{w.name[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="font-semibold text-sm truncate">{w.name}</span>
                                                        <span className="text-[10px] text-gray-400 truncate">{w.role}</span>
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                                    <Briefcase className="h-3 w-3" /> Project
                                </Label>
                                <Select value={projectId} onValueChange={setProjectId}>
                                    <SelectTrigger className="h-11 bg-white dark:bg-gray-950 border-gray-200">
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

                        {/* Task Selection */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                                <Search className="h-3 w-3" /> Specific Task (Optional)
                            </Label>
                            <Select value={taskId} onValueChange={setTaskId} disabled={!projectId}>
                                <SelectTrigger className="h-11 bg-white dark:bg-gray-950 border-gray-200">
                                    <SelectValue placeholder={projectId ? "Link a specific task" : "Select a project first"} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none"><span className="text-gray-400 italic">No specific task</span></SelectItem>
                                    {tasks.map(t => (
                                        <SelectItem key={t._id} value={t._id}>{t.title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Metrics Grid */}
                        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase text-gray-400 flex items-center gap-1">
                                        <Target className="h-3 w-3" /> Target (%)
                                    </Label>
                                    <Input
                                        type="number"
                                        className="bg-white border-gray-200"
                                        value={target}
                                        onChange={(e) => setTarget(Number(e.target.value))}
                                        required
                                        min="0"
                                        max="100"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase text-gray-400 flex items-center gap-1">
                                        <PieChart className="h-3 w-3" /> Actual (%)
                                    </Label>
                                    <Input
                                        type="number"
                                        className="bg-white border-gray-200"
                                        value={actual}
                                        onChange={(e) => setActual(Number(e.target.value))}
                                        required
                                        min="0"
                                        max="100"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase text-gray-400 flex items-center gap-1">
                                    <Info className="h-3 w-3" /> Overall Status
                                </Label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className="bg-white border-gray-200 h-10">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="On Track">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-green-500" /> On Track
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="Off Track">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-red-500" /> Off Track
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="Exceeded">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-purple-500" /> Exceeded
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="Needs Improvement">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-orange-500" /> Needs Improvement
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Evaluation Notes</Label>
                            <Textarea
                                placeholder="Describe performance details or areas for improvement..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="min-h-[80px] bg-white resize-none"
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-2">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-gray-500">
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-none min-w-[140px]"
                        >
                            {isSubmitting ? (recordToEdit ? 'Updating...' : 'Saving...') : recordToEdit ? 'Update Record' : 'Save Evaluation'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
