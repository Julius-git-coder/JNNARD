'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { reportApi } from '@/lib/api';
import { History, Search, FileText, Sparkles, User as UserIcon, Calendar as CalendarIcon, ExternalLink, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export default function WorkerReportsPage() {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedReport, setSelectedReport] = useState<any>(null);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const res = await reportApi.getMyReports();
            setReports(res.data.data);
        } catch (error) {
            console.error("Failed to fetch reports", error);
        } finally {
            setLoading(false);
        }
    };

    const handleReportClick = (report: any) => {
        setSelectedReport(report);
    };

    const [isAcknowledging, setIsAcknowledging] = useState(false);
    const handleAcknowledge = async (id: string) => {
        setIsAcknowledging(true);
        try {
            await reportApi.acknowledge(id);
            // Update local state
            setReports((prev: any[]) => prev.map((r: any) => r._id === id ? { ...r, status: 'Acknowledged' } : r));
            setSelectedReport((prev: any) => prev?._id === id ? { ...prev, status: 'Acknowledged' } : prev);
        } catch (error) {
            console.error("Failed to acknowledge report", error);
        } finally {
            setIsAcknowledging(false);
        }
    };

    const filteredReports = reports.filter(r =>
        r.project?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.task?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.summary?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50/50 dark:bg-gray-950/50">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-medium text-gray-500">Loading your feedback journey...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 md:p-12 max-w-7xl mx-auto space-y-12">
            {/* Simple Clean Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 dark:border-gray-800 pb-8">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">My Reports</h1>
                    <p className="text-base text-gray-500 dark:text-gray-400">Track your professional growth and feedback from administration.</p>
                </div>
                <div className="flex gap-4">
                    <div className="px-5 py-2 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 text-center min-w-[120px]">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Reports</p>
                        <p className="text-2xl font-black text-gray-900 dark:text-gray-50">{reports.length}</p>
                    </div>
                </div>
            </div>

            {/* Content Section: History Table */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <History className="h-5 w-5 text-gray-400" />
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">Feedback History</h2>
                    </div>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Filter by project or task..."
                            className="h-10 pl-9 rounded-lg border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50 shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-950/50 shadow-sm">
                    {filteredReports.length === 0 ? (
                        <div className="p-32 text-center flex flex-col items-center gap-6">
                            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-full">
                                <Sparkles className="h-12 w-12 text-gray-300" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">No reports yet</p>
                                <p className="text-gray-500 text-sm max-w-[300px] mx-auto">Admin insights will appear here once they're submitted.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-gray-50/50 dark:bg-gray-900/50">
                                    <TableRow className="border-b border-gray-100 dark:border-gray-800 hover:bg-transparent">
                                        <TableHead className="py-6 pl-10 font-bold text-gray-400 uppercase tracking-widest text-[10px] border-r border-gray-200 dark:border-gray-700">Author</TableHead>
                                        <TableHead className="py-6 font-bold text-gray-400 uppercase tracking-widest text-[10px] border-r border-gray-200 dark:border-gray-700 px-6">Context</TableHead>
                                        <TableHead className="py-6 font-bold text-gray-400 uppercase tracking-widest text-[10px] border-r border-gray-200 dark:border-gray-700 px-6">Narrative</TableHead>
                                        <TableHead className="py-6 font-bold text-gray-400 uppercase tracking-widest text-[10px] border-r border-gray-200 dark:border-gray-700 px-6">Timeline</TableHead>
                                        <TableHead className="py-6 pr-10 text-right font-bold text-gray-400 uppercase tracking-widest text-[10px]">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredReports.map((report) => (
                                        <TableRow
                                            key={report._id}
                                            className="group hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors border-b border-gray-100 dark:border-gray-800 cursor-pointer"
                                            onClick={() => handleReportClick(report)}
                                        >
                                            <TableCell className="py-8 pl-10 border-r border-gray-200 dark:border-gray-700">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9 ring-2 ring-white dark:ring-gray-800 shadow-sm transition-transform group-hover:scale-105">
                                                        <AvatarImage src={report.author?.avatar} />
                                                        <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold text-xs">
                                                            {report.author?.name?.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col min-w-0 max-w-[150px]">
                                                        <span className="font-bold text-gray-900 dark:text-gray-100 text-sm truncate">{report.author?.name || 'Administrator'}</span>
                                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight truncate">Admin</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-8 border-r border-gray-200 dark:border-gray-700 px-6">
                                                <div className="flex flex-col max-w-[150px]">
                                                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{report.project?.title}</span>
                                                    <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold truncate">{report.task?.title}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-8 border-r border-gray-200 dark:border-gray-700 px-6 max-w-[420px]">
                                                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed font-medium italic">
                                                    "{report.summary}"
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
                                                <div className="flex items-center justify-end gap-3">
                                                    <Badge
                                                        variant={
                                                            report.status === 'Acknowledged' ? 'completed' :
                                                                report.status === 'Reviewed' ? 'completed' : 'onhold'
                                                        }
                                                        className={cn(
                                                            "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm",
                                                            report.status === 'Acknowledged' ? "bg-green-100 text-green-700 dark:bg-green-900/30" :
                                                                report.status === 'Reviewed' ? "bg-green-100 text-green-700 dark:bg-green-900/30" :
                                                                    "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30"
                                                        )}
                                                    >
                                                        {report.status}
                                                    </Badge>
                                                    <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-indigo-500 transition-colors" />
                                                </div>
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
                            <DialogHeader className="p-8 bg-indigo-50 dark:bg-indigo-950/30 border-b border-indigo-100 dark:border-indigo-900/50">
                                <div className="flex items-center justify-between mb-4">
                                    <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-none">
                                        Professional Chronicle
                                    </Badge>
                                    <span className="text-xs font-bold text-indigo-400">
                                        {format(new Date(selectedReport.createdAt), 'MMMM dd, yyyy')}
                                    </span>
                                </div>
                                <DialogTitle className="text-3xl font-black text-gray-900 dark:text-gray-50 leading-tight">
                                    {selectedReport.project?.title}
                                </DialogTitle>
                                <DialogDescription className="text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase tracking-widest mt-1">
                                    Context: {selectedReport.task?.title}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <FileText className="h-4 w-4" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Administrative Narrative</span>
                                    </div>
                                    <p className="text-xl text-gray-700 dark:text-gray-200 leading-relaxed font-medium bg-gray-50 dark:bg-gray-800/30 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 italic shadow-inner">
                                        "{selectedReport.summary}"
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
                                    <div className="space-y-3">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Authored By</span>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-12 w-12 ring-2 ring-indigo-50 dark:ring-indigo-900/50">
                                                <AvatarImage src={selectedReport.author?.avatar} />
                                                <AvatarFallback className="bg-indigo-100 text-indigo-700 font-black">
                                                    {selectedReport.author?.name?.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900 dark:text-gray-100 text-lg">{selectedReport.author?.name}</span>
                                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Administrator</span>
                                            </div>
                                        </div>
                                    </div>

                                    {selectedReport.deliverableUrl && (
                                        <Button
                                            variant="outline"
                                            className="h-14 rounded-2xl border-indigo-100 dark:border-indigo-900/50 font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 px-6"
                                            onClick={() => window.open(selectedReport.deliverableUrl, '_blank')}
                                        >
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            View Artifact
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <div className="p-6 bg-gray-50/50 dark:bg-gray-900/50 flex justify-center px-8 py-8 border-t border-gray-100 dark:border-gray-800">
                                {selectedReport.status === 'Acknowledged' ? (
                                    <Button
                                        disabled
                                        className="bg-green-600 text-white font-bold px-12 h-14 rounded-2xl w-full max-w-xs cursor-default"
                                    >
                                        <Check className="h-5 w-5 mr-2" />
                                        Acknowledged
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => handleAcknowledge(selectedReport._id)}
                                        disabled={isAcknowledging}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-12 h-14 rounded-2xl shadow-lg shadow-indigo-600/20 w-full max-w-xs"
                                    >
                                        {isAcknowledging ? "Acknowledging..." : "Acknowledge Feedback"}
                                    </Button>
                                )}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
