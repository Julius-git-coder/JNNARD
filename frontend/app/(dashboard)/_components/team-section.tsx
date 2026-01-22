'use client';

import React, { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface TeamMember {
    _id: string;
    name: string;
    avatar?: string;
    role?: string;
}

interface TeamSectionProps {
    isLoading?: boolean;
    members: TeamMember[];
}

export function TeamSection({ isLoading, members }: TeamSectionProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (member.role && member.role.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <div className="flex -space-x-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-14 w-14 rounded-full border-4 border-white dark:border-gray-950" />
                    ))}
                </div>
            </div>
        );
    }

    if (members.length === 0) {
        return (
            <EmptyState
                title="No developers found"
                description="There are no developers in your team yet."
                actionLabel="Add Member"
                onAction={() => { window.location.href = '/work-logs' }}
            />
        )
    }

    return (
        <div className="w-full space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Team Members ({members.length})</h3>
                <div className="flex items-center gap-4">
                    <div className="relative w-64 hidden sm:block">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                            className="pl-9 h-9 bg-gray-50 border-gray-200"
                            placeholder="Search by name or role..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Link href="/work-logs">
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 font-medium">
                            View all
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="flex flex-wrap -space-x-4">
                {filteredMembers.slice(0, 5).map((member) => (
                    <Tooltip key={member._id}>
                        <TooltipTrigger asChild>
                            <div className="group cursor-pointer relative z-0 hover:z-50 transition-all duration-200">
                                <Avatar className="h-14 w-14 border-4 border-white dark:border-gray-950 shadow-sm ring-2 ring-transparent group-hover:ring-blue-500">
                                    <AvatarImage src={member.avatar} alt={member.name} />
                                    <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <div className="text-center">
                                <p className="font-semibold">{member.name}</p>
                                {member.role && <p className="text-xs opacity-80">{member.role}</p>}
                            </div>
                        </TooltipContent>
                    </Tooltip>
                ))}

                {filteredMembers.length > 5 && (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="h-14 w-14 rounded-full border-4 border-white dark:border-gray-950 bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm shadow-sm z-10 cursor-help">
                                +{filteredMembers.length - 5}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <div className="text-left space-y-1">
                                <p className="font-semibold mb-1">More team members:</p>
                                {filteredMembers.slice(5, 12).map(m => (
                                    <p key={m._id} className="text-xs">• {m.name}</p>
                                ))}
                                {filteredMembers.length > 12 && <p className="text-xs opacity-50 italic">and {filteredMembers.length - 12} more...</p>}
                            </div>
                        </TooltipContent>
                    </Tooltip>
                )}

                <Link href="/work-logs" className="z-20 ml-6">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white dark:border-gray-950 bg-white border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors group">
                                <Plus className="h-6 w-6 text-gray-400 group-hover:text-blue-500" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Manage Team</p>
                        </TooltipContent>
                    </Tooltip>
                </Link>
            </div>
            {filteredMembers.length === 0 && searchQuery && (
                <div className="text-center py-4 text-gray-500 text-sm">
                    No members matching &quot;{searchQuery}&quot;
                </div>
            )}
        </div>
    );
}
