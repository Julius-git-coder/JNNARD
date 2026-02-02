'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TeamMember {
    _id: string;
    name: string;
    avatar?: string;
    role?: string;
}

interface TeamMembersDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    projectTitle: string;
    members: TeamMember[];
}

export function TeamMembersDialog({ open, onOpenChange, projectTitle, members }: TeamMembersDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Team Members - {projectTitle}</DialogTitle>
                </DialogHeader>
                <div className="max-h-[300px] overflow-y-auto space-y-4 py-4">
                    {members.length > 0 ? (
                        members.map((member) => (
                            <div key={member._id} className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border">
                                    <AvatarImage src={member.avatar} />
                                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-sm">{member.name}</span>
                                    <span className="text-xs text-gray-500 capitalize">{member.role || 'Member'}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-sm text-gray-500 py-4">No team members assigned.</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
