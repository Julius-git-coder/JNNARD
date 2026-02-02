'use client';

import React, { useState } from 'react';
import { useWorkerDashboard } from '@/hooks/useWorkerDashboard';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Send, FileText } from 'lucide-react';

export default function WorkerReportsPage() {
    const { projects, tasks, isLoading, submitReport } = useWorkerDashboard();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        projectId: '',
        taskId: '',
        summary: '',
        deliverableUrl: '',
        weekStartDate: '',
        weekEndDate: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.projectId || !formData.taskId || !formData.summary || !formData.weekStartDate || !formData.weekEndDate) {
            toast.error("Please fill in all required fields");
            return;
        }

        setIsSubmitting(true);
        const success = await submitReport(formData);
        setIsSubmitting(false);

        if (success) {
            toast.success("Progress report submitted successfully");
            setFormData({
                projectId: '',
                taskId: '',
                summary: '',
                deliverableUrl: '',
                weekStartDate: '',
                weekEndDate: ''
            });
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (isLoading) {
        return <div className="p-8"><p>Loading...</p></div>;
    }

    return (
        <div className="space-y-6 max-w-3xl">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">Submit Weekly Report</h1>

            <Card className="border-gray-200 dark:border-gray-800">
                <CardHeader>
                    <CardTitle>Report Details</CardTitle>
                    <CardDescription>Document your progress and deliverables for the week.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Project</Label>
                                <Select onValueChange={(val) => handleChange('projectId', val)} value={formData.projectId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select project" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {projects.map((p: any) => (
                                            <SelectItem key={p._id} value={p._id}>{p.title}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Related Task</Label>
                                <Select onValueChange={(val) => handleChange('taskId', val)} value={formData.taskId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select task" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {tasks.filter((t: any) => !formData.projectId || t.project?._id === formData.projectId).map((t: any) => (
                                            <SelectItem key={t._id} value={t._id}>{t.title}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Week Start Date</Label>
                                <Input
                                    type="date"
                                    value={formData.weekStartDate}
                                    onChange={(e) => handleChange('weekStartDate', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Week End Date</Label>
                                <Input
                                    type="date"
                                    value={formData.weekEndDate}
                                    onChange={(e) => handleChange('weekEndDate', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Progress Summary</Label>
                            <Textarea
                                placeholder="What did you accomplish this week?"
                                value={formData.summary}
                                onChange={(e) => handleChange('summary', e.target.value)}
                                className="min-h-[120px]"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Deliverable Link (Optional)</Label>
                            <Input
                                placeholder="https://github.com/... or Figma link"
                                value={formData.deliverableUrl}
                                onChange={(e) => handleChange('deliverableUrl', e.target.value)}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : (
                                <span className="flex items-center gap-2">
                                    <Send className="h-4 w-4" />
                                    Submit Report
                                </span>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
