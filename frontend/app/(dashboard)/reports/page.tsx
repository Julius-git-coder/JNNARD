'use client';

import React, { useState, useEffect } from 'react';
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Avatar,
    AvatarImage,
    AvatarFallback,
} from "@/components/ui/avatar";
import { toast } from 'sonner';
import { Send, FileText, User as UserIcon, History, Search, Plus, ExternalLink, Calendar as CalendarIcon } from 'lucide-react';
import { reportApi, projectApi, taskApi } from '@/lib/api';
import { useWorkers } from '@/hooks/useWorkers';
import { useTasks } from '@/hooks/useTasks';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from '@/lib/utils';

export default function AdminReportsPage() {
    const { workers, isLoading: workersLoading } = useWorkers();
    const [projects, setProjects] = useState<any[]>([]);
    const [reports, setReports] = useState<any[]>([]);
    const [projectsLoading, setProjectsLoading] = useState(false);
    const [reportsLoading, setReportsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState<any>(null);

    const [formData, setFormData] = useState({
        workerId: '',
        projectId: '',
        taskId: '',
        summary: '',
        deliverableUrl: ''
    });

    const [editingReportId, setEditingReportId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const { tasks, isLoading: tasksLoading } = useTasks(formData.projectId);

    useEffect(() => {
        const fetchProjects = async () => {
            setProjectsLoading(true);
            try {
                const res = await projectApi.getAll();
                setProjects(res.data);
            } catch (error) {
                console.error("Failed to fetch projects", error);
            } finally {
                setProjectsLoading(false);
            }
        };
        fetchProjects();
        fetchReports();
    }, []);

    const fetchReports = async () => {
        setReportsLoading(true);
        try {
            const res = await reportApi.getAll();
            setReports(res.data.data);
        } catch (error) {
            console.error("Failed to fetch reports", error);
        } finally {
            setReportsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.workerId || !formData.projectId || !formData.taskId || !formData.summary) {
            toast.error("Please fill in all required fields");
            return;
        }

        setIsSubmitting(true);
        try {
            if (editingReportId) {
                await reportApi.update(editingReportId, formData);
                toast.success("Report updated successfully");
            } else {
                await reportApi.create(formData);
                toast.success("Report submitted successfully");
            }
            setFormData({
                workerId: '',
                projectId: '',
                taskId: '',
                summary: '',
                deliverableUrl: ''
            });
            setEditingReportId(null);
            fetchReports();
            setIsDialogOpen(false);
        } catch (error: any) {
            console.error("Failed to submit report", error);
            const errorMessage = error.response?.data?.message || "Failed to submit report";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleReportClick = (report: any) => {
        setSelectedReport(report);
    };

    const handleEditClick = (report: any) => {
        setEditingReportId(report._id);
        setFormData({
            workerId: report.worker?._id || '',
            projectId: report.project?._id || '',
            taskId: report.task?._id || '',
            summary: report.summary || '',
            deliverableUrl: report.deliverableUrl || ''
        });
        setSelectedReport(null);
        setIsDialogOpen(true);
    };

    const handleDeleteReport = async (id: string) => {
        if (!window.confirm("Are you sure you want to dissolve this chronicle? This action is permanent.")) return;

        setIsDeleting(true);
        try {
            await reportApi.delete(id);
            toast.success("Chronicle dissolved successfully");
            setSelectedReport(null);
            fetchReports();
        } catch (error) {
            console.error("Failed to delete report", error);
            toast.error("Failed to dissolve chronicle");
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredReports = reports.filter(r =>
        r.worker?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.project?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.summary?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isLoading = workersLoading || projectsLoading;

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50/50 dark:bg-gray-950/50">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-medium text-gray-500">Loading Report Management...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 md:p-12 max-w-7xl mx-auto space-y-12">
            {/* Simple Clean Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 dark:border-gray-800 pb-8">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">Performance Reports</h1>
                    <p className="text-base text-gray-500 dark:text-gray-400">Manage and track worker performance across all projects.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 text-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sent Reports</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-gray-50">{reports.length}</p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger>
                            <Button className="h-12 px-6 bg-blue-600 hover:bg-blue-700 font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all">
                                <Plus className="h-5 w-5 mr-2" />
                                New Report
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-xl p-0 overflow-hidden rounded-2xl shadow-2xl border-none">
                            <DialogHeader className="p-6 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                                <DialogTitle className="text-2xl font-bold">
                                    {editingReportId ? "Edit Performance Chronicle" : "Create Performance Report"}
                                </DialogTitle>
                                <DialogDescription>
                                    {editingReportId ? "Update the details of this existing chronicle." : "Fill in the details to document worker achievements."}
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold text-gray-700 dark:text-gray-300">Target Worker</Label>
                                        <Select onValueChange={(val) => handleChange('workerId', val)} value={formData.workerId}>
                                            <SelectTrigger className="h-12 px-4 rounded-xl border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/20">
                                                <SelectValue placeholder="Select a talent" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {workers.map((w: any) => (
                                                    <SelectItem key={w._id} value={w._id}>
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-7 w-7">
                                                                <AvatarImage src={w.avatar} />
                                                                <AvatarFallback className="text-[10px] bg-blue-100 text-blue-700 font-black">
                                                                    {w.name?.charAt(0)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="flex flex-col text-left">
                                                                <span className="font-bold text-sm text-gray-900 dark:text-gray-100">{w.name}</span>
                                                                <span className="text-[10px] text-gray-500 font-medium">{w.role}</span>
                                                            </div>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-bold text-gray-700 dark:text-gray-300">Project</Label>
                                            <Select onValueChange={(val) => handleChange('projectId', val)} value={formData.projectId}>
                                                <SelectTrigger className="h-12 px-4 rounded-xl border-gray-200 dark:border-gray-700">
                                                    <SelectValue placeholder="ProjectContext" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {projects.map((p: any) => (
                                                        <SelectItem key={p._id} value={p._id}>{p.title}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-bold text-gray-700 dark:text-gray-300">Target Task</Label>
                                            <Select onValueChange={(val) => handleChange('taskId', val)} value={formData.taskId} disabled={!formData.projectId || tasksLoading}>
                                                <SelectTrigger className="h-12 px-4 rounded-xl border-gray-200 dark:border-gray-700">
                                                    <SelectValue placeholder={tasksLoading ? "Loading..." : "Select task"} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {tasks.map((t: any) => (
                                                        <SelectItem key={t._id} value={t._id}>{t.title}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold text-gray-700 dark:text-gray-300">Summary & Milestones</Label>
                                        <Textarea
                                            placeholder="Document key deliverables, achievements, or blocks..."
                                            value={formData.summary}
                                            onChange={(e) => handleChange('summary', e.target.value)}
                                            className="min-h-[120px] rounded-xl border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/20 text-sm leading-relaxed"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold text-gray-700 dark:text-gray-300">Submission URL (Optional)</Label>
                                        <div className="relative group">
                                            <Input
                                                placeholder="https://..."
                                                value={formData.deliverableUrl}
                                                onChange={(e) => handleChange('deliverableUrl', e.target.value)}
                                                className="h-12 px-4 rounded-xl border-gray-200 dark:border-gray-700"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <Button type="button" variant="ghost" onClick={() => {
                                        setIsDialogOpen(false);
                                        setEditingReportId(null);
                                        setFormData({ workerId: '', projectId: '', taskId: '', summary: '', deliverableUrl: '' });
                                    }} className="rounded-xl font-bold h-12">Cancel</Button>
                                    <Button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-12 px-8 shadow-lg shadow-blue-600/20"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Processing..." : editingReportId ? "Update Chronicle" : "Send Report"}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Content Section: History Table */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <History className="h-5 w-5 text-gray-400" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">Report History</h2>
                    </div>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Filter by worker or project..."
                            className="h-10 pl-9 rounded-lg border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50 shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-950/50 shadow-sm">
                    {reportsLoading ? (
                        <div className="p-20 text-center flex flex-col items-center gap-4">
                            <div className="h-8 w-8 border-3 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
                            <p className="text-sm font-medium text-gray-500">Refreshing records...</p>
                        </div>
                    ) : filteredReports.length === 0 ? (
                        <div className="p-20 text-center flex flex-col items-center gap-4">
                            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-full">
                                <FileText className="h-10 w-10 text-gray-300" />
                            </div>
                            <p className="text-sm font-medium text-gray-500">No reports found.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-gray-50/50 dark:bg-gray-900/50">
                                    <TableRow className="border-b border-gray-100 dark:border-gray-800 hover:bg-transparent">
                                        <TableHead className="py-6 pl-10 font-bold text-gray-400 uppercase tracking-widest text-[10px] border-r border-gray-200 dark:border-gray-700">Recipient</TableHead>
                                        <TableHead className="py-6 font-bold text-gray-400 uppercase tracking-widest text-[10px] border-r border-gray-200 dark:border-gray-700 px-6">Context</TableHead>
                                        <TableHead className="py-6 font-bold text-gray-400 uppercase tracking-widest text-[10px] border-r border-gray-200 dark:border-gray-700 px-6">Summary</TableHead>
                                        <TableHead className="py-6 font-bold text-gray-400 uppercase tracking-widest text-[10px] border-r border-gray-200 dark:border-gray-700 px-6">Date</TableHead>
                                        <TableHead className="py-6 pr-10 font-bold text-gray-400 uppercase tracking-widest text-[10px] text-right">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredReports.map((report) => (
                                        <TableRow
                                            key={report._id}
                                            className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors border-b border-gray-100 dark:border-gray-800 cursor-pointer"
                                            onClick={() => handleReportClick(report)}
                                        >
                                            <TableCell className="py-8 pl-10 border-r border-gray-200 dark:border-gray-700">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9 ring-2 ring-white dark:ring-gray-800 shadow-sm transition-transform group-hover:scale-105">
                                                        <AvatarImage src={report.worker?.avatar} />
                                                        <AvatarFallback className="bg-blue-100 text-blue-700 font-bold text-xs uppercase">
                                                            {report.worker?.name?.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col min-w-0 max-w-[150px]">
                                                        <span className="font-bold text-gray-900 dark:text-gray-100 text-sm truncate">{report.worker?.name || 'Unknown'}</span>
                                                        <span className="text-[10px] text-gray-400 uppercase font-black tracking-tight truncate">{report.worker?.role}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-8 border-r border-gray-200 dark:border-gray-700 px-6">
                                                <div className="flex flex-col max-w-[150px]">
                                                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{report.project?.title}</span>
                                                    <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold truncate">{report.task?.title}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-8 border-r border-gray-200 dark:border-gray-700 px-6 max-w-[350px]">
                                                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed font-medium">
                                                    {report.summary}
                                                </p>
                                            </TableCell>
                                            <TableCell className="py-8 border-r border-gray-200 dark:border-gray-700 px-6 whitespace-nowrap">
                                                <div className="flex items-center gap-1.5 text-gray-900 dark:text-gray-100">
                                                    <CalendarIcon className="h-3.5 w-3.5 text-gray-400" />
                                                    <span className="text-sm font-bold">
                                                        {format(new Date(report.createdAt), 'MMM dd, yyyy')}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-8 pr-10 text-right">
                                                <Badge
                                                    variant={
                                                        report.status === 'Acknowledged' ? 'completed' :
                                                            report.status === 'Reviewed' ? 'completed' : 'onhold'
                                                    }
                                                    className={cn(
                                                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                        report.status === 'Acknowledged' ? "bg-green-100 text-green-700 dark:bg-green-900/30" :
                                                            report.status === 'Reviewed' ? "bg-green-100 text-green-700 dark:bg-green-900/30" :
                                                                "bg-blue-100 text-blue-700 dark:bg-blue-900/30 border-none"
                                                    )}
                                                >
                                                    {report.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </div>

            {/* Report Detail Dialog */}
            <Dialog open={!!selectedReport} onOpenChange={(open) => !open && setSelectedReport(null)}>
                <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-[2rem] border-none shadow-2xl">
                    {selectedReport && (
                        <>
                            <DialogHeader className="p-8 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                                <div className="flex items-center justify-between mb-4">
                                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-none">
                                        Performance Chronicle
                                    </Badge>
                                    <span className="text-xs font-bold text-gray-400">
                                        {format(new Date(selectedReport.createdAt), 'MMMM dd, yyyy')}
                                    </span>
                                </div>
                                <DialogTitle className="text-3xl font-black text-gray-900 dark:text-gray-50 leading-tight">
                                    {selectedReport.project?.title}
                                </DialogTitle>
                                <DialogDescription className="text-blue-600 dark:text-blue-400 font-bold text-sm uppercase tracking-widest mt-1">
                                    Task: {selectedReport.task?.title}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <FileText className="h-4 w-4" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Narrative & Milestones</span>
                                    </div>
                                    <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed font-medium bg-gray-50/50 dark:bg-gray-800/30 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 italic">
                                        "{selectedReport.summary}"
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                                    <div className="space-y-3">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recipient</span>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={selectedReport.worker?.avatar} />
                                                <AvatarFallback className="bg-blue-100 text-blue-700 font-black">
                                                    {selectedReport.worker?.name?.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900 dark:text-gray-100">{selectedReport.worker?.name}</span>
                                                <span className="text-[10px] text-gray-500 font-bold uppercase">{selectedReport.worker?.role}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {selectedReport.deliverableUrl && (
                                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <Button
                                            variant="outline"
                                            className="w-full h-14 rounded-2xl border-gray-200 dark:border-gray-700 font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                                            onClick={() => window.open(selectedReport.deliverableUrl, '_blank')}
                                        >
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            View Deliverable Artifact
                                        </Button>
                                    </div>
                                )}
                            </div>
                            <div className="p-6 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between px-8 py-6 border-t border-gray-100 dark:border-gray-800">
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => handleDeleteReport(selectedReport._id)}
                                        className="border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold px-6 h-12 rounded-xl"
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? "Dissolving..." : "Dissolve"}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleEditClick(selectedReport)}
                                        className="border-blue-100 text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-bold px-6 h-12 rounded-xl"
                                    >
                                        Edit
                                    </Button>
                                </div>
                                <Button
                                    onClick={() => setSelectedReport(null)}
                                    className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-bold px-8 h-12 rounded-xl"
                                >
                                    Close Chronicle
                                </Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
