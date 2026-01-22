'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MoreVertical, Paperclip, MessageSquare, Edit2, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AttachmentManager } from './attachment-manager';
import { IssueManager } from './issue-manager';
import { CreateProjectDialog } from './create-project-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ProjectCardProps {
    id: string;
    title: string;
    status: string;
    description?: string;
    endDate?: string;
    members: {
        _id: string;
        name: string;
        avatar?: string;
    }[];
    attachments?: any[];
    issues?: any[];
    onUpdate?: () => void;
}

export const ProjectCard = ({
    id,
    title,
    status,
    description,
    endDate,
    members,
    attachments = [],
    issues = [],
    onUpdate = () => { },
}: ProjectCardProps) => {
    const [isManageOpen, setIsManageOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isIssuesOpen, setIsIssuesOpen] = useState(false);

    const statusVariant =
        status === 'Completed' ? 'completed' :
            status === 'On Hold' ? 'onhold' :
                status === 'Offtrack' ? 'destructive' :
                    'secondary';

    return (
        <Card className="hover:shadow-md transition-shadow dark:bg-gray-900 border-none shadow-sm h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                    <Badge variant={statusVariant} className="rounded-full px-3">
                        {status}
                    </Badge>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => setIsEditOpen(true)}
                        tooltip="Edit Project"
                    >
                        <Edit2 className="h-4 w-4" />
                    </Button>
                    <Dialog open={isManageOpen} onOpenChange={setIsManageOpen}>
                        <DialogTrigger>
                            <Button variant="ghost" size="icon" className="h-8 w-8" tooltip="Project Assets">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Project Assets: {title}</DialogTitle>
                            </DialogHeader>
                            <div className="py-4 space-y-6">
                                <AttachmentManager
                                    projectId={id}
                                    initialAttachments={attachments}
                                    onUpdate={onUpdate}
                                />
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
                <CreateProjectDialog
                    open={isEditOpen}
                    onOpenChange={setIsEditOpen}
                    onSuccess={onUpdate}
                    project={{
                        _id: id,
                        title,
                        description: description || '',
                        status,
                        endDate,
                        members
                    }}
                />
            </CardHeader>
            <CardContent className="space-y-4 flex-1 flex flex-col pt-2">
                <div>
                    <CardTitle className="mb-2 text-xl font-bold">{title}</CardTitle>
                    <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">
                        {description || 'No description provided.'}
                    </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold mt-auto uppercase tracking-wider">
                    <Timer className="h-3.5 w-3.5 text-red-500" />
                    <span className="text-red-500">{endDate ? new Date(endDate).toLocaleDateString() : 'No Deadline'}</span>
                </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-0 border-t dark:border-gray-800 mt-4">
                <div className="flex w-full items-center justify-between py-4">
                    <div className="flex -space-x-2">
                        {members.map((member) => {
                            const isValidAvatar = member.avatar && (member.avatar.startsWith('http') || member.avatar.startsWith('/'));
                            return (
                                <Avatar key={member._id} className="h-8 w-8 border-2 border-white dark:border-gray-900">
                                    {isValidAvatar ? <AvatarImage src={member.avatar} /> : null}
                                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                                </Avatar>
                            );
                        })}
                    </div>
                    <div className="flex items-center gap-4 text-gray-400 text-sm font-medium">
                        <div className="flex items-center gap-1">
                            <Paperclip className="h-4 w-4" />
                            <span>{attachments.length}</span>
                        </div>
                        <Dialog open={isIssuesOpen} onOpenChange={setIsIssuesOpen}>
                            <DialogTrigger>
                                <Button
                                    variant="ghost"
                                    className="flex items-center gap-1 h-auto p-0 hover:bg-transparent text-gray-400 hover:text-blue-500 transition-colors"
                                    tooltip="View Messages & Issues"
                                >
                                    <MessageSquare className="h-4 w-4" />
                                    <span>{issues.length}</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Project Messages & Issues: {title}</DialogTitle>
                                </DialogHeader>
                                <div className="py-4">
                                    <IssueManager
                                        projectId={id}
                                        initialIssues={issues}
                                        onUpdate={onUpdate}
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};

