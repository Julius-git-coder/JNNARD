'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { projectApi } from '@/lib/api';
import { MessageSquare, Plus, AlertCircle } from 'lucide-react';

interface Issue {
    _id?: string;
    title: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    status: 'Open' | 'In Progress' | 'Resolved';
    reportedAt?: string;
}

interface IssueManagerProps {
    projectId: string;
    initialIssues: Issue[];
    onUpdate: () => void;
}

export function IssueManager({ projectId, initialIssues, onUpdate }: IssueManagerProps) {
    const [issues, setIssues] = useState<Issue[]>(initialIssues);
    const [newIssue, setNewIssue] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Sync local state when props change (from parent refresh)
    React.useEffect(() => {
        setIssues(initialIssues);
    }, [initialIssues]);

    const handleAddIssue = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newIssue.trim()) return;

        try {
            setIsSubmitting(true);
            const issue: Issue = {
                title: newIssue,
                severity: 'Medium',
                status: 'Open',
                reportedAt: new Date().toISOString(),
            };

            const updatedIssues = [...issues, issue];
            const response = await projectApi.update(projectId, { issues: updatedIssues });

            // If backend returns updated issues (with MongoDB IDs), use those
            if (response.data && response.data.issues) {
                setIssues(response.data.issues);
            } else {
                setIssues(updatedIssues);
            }

            setNewIssue('');
            onUpdate();
        } catch (error) {
            console.error("Failed to add issue:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-4">
            <form onSubmit={handleAddIssue} className="flex gap-2">
                <Input
                    placeholder="Type a message or issue..."
                    value={newIssue}
                    onChange={(e) => setNewIssue(e.target.value)}
                    disabled={isSubmitting}
                />
                <Button type="submit" size="icon" disabled={isSubmitting}>
                    <Plus className="h-4 w-4" />
                </Button>
            </form>

            <div className="h-[300px] overflow-y-auto border rounded-md p-4 bg-white dark:bg-gray-950">
                {issues.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-2 py-10">
                        <MessageSquare className="h-8 w-8 opacity-20" />
                        <p className="text-sm">No messages or issues yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {[...issues]
                            .sort((a, b) => new Date(b.reportedAt || 0).getTime() - new Date(a.reportedAt || 0).getTime())
                            .map((issue, index) => (
                                <div key={issue._id || index} className="flex flex-col gap-1 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                                    <div className="flex items-center justify-between">
                                        <Badge variant={issue.status === 'Resolved' ? 'outline' : 'secondary'} className="text-[10px] px-1.5 py-0">
                                            {issue.status}
                                        </Badge>
                                        <span className="text-[10px] text-gray-400">
                                            {issue.reportedAt ? new Date(issue.reportedAt).toLocaleString() : 'Just now'}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium">{issue.title}</p>
                                    <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                        <AlertCircle className="h-3 w-3" />
                                        <span>{issue.severity} Severity</span>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}
