'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MoreVertical, Paperclip, MessageSquare, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AttachmentManager } from './attachment-manager';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ProjectCardProps {
    id: string;
    title: string;
    status: string;
    description?: string;
    dueDate?: string;
    issueCount: number;
    members: {
        _id: string;
        name: string;
        avatar?: string;
    }[];
    attachments?: any[];
    onUpdate?: () => void;
}

export const ProjectCard = ({
    id,
    title,
    status,
    description,
    dueDate,
    issueCount,
    members,
    attachments = [],
    onUpdate = () => { },
}: ProjectCardProps) => {
    const [isManageOpen, setIsManageOpen] = useState(false);

    const statusVariant =
        status === 'Completed' ? 'default' :
            status === 'On Hold' ? 'secondary' :
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
                <Dialog open={isManageOpen} onOpenChange={setIsManageOpen}>
                    <DialogTrigger>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
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
            </CardHeader>
            <CardContent className="space-y-4 flex-1 flex flex-col pt-2">
                <div>
                    <CardTitle className="mb-2 text-xl font-bold">{title}</CardTitle>
                    <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">
                        {description || 'No description provided.'}
                    </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mt-auto uppercase tracking-wider">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{dueDate ? new Date(dueDate).toLocaleDateString() : 'No Deadline'}</span>
                </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-0 border-t dark:border-gray-800 mt-4">
                <div className="flex w-full items-center justify-between py-4">
                    <div className="flex -space-x-2">
                        {members.map((member) => (
                            <Avatar key={member._id} className="h-8 w-8 border-2 border-white dark:border-gray-900">
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback>{member.name[0]}</AvatarFallback>
                            </Avatar>
                        ))}
                    </div>
                    <div className="flex items-center gap-4 text-gray-400 text-sm font-medium">
                        <div className="flex items-center gap-1">
                            <Paperclip className="h-4 w-4" />
                            <span>{attachments.length}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{issueCount}</span>
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
};

