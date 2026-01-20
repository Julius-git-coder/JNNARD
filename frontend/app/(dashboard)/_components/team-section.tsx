'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';

// Using a simple img for now if Avatar component not created yet, 
// but I said I would create it. Let's create it inline or separate file?
// I'll assume I create Components/ui/avatar.tsx next.

interface TeamMember {
    id: string;
    name: string;
    avatar: string;
    role?: string;
}

interface TeamSectionProps {
    isLoading?: boolean;
    members: TeamMember[];
}

export function TeamSection({ isLoading, members }: TeamSectionProps) {
    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <div className="flex flex-wrap gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-16 w-16 rounded-full" />
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
                actionLabel="Invite Member"
                onAction={() => { }}
            />
        )
    }

    return (
        <div className="w-full space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-500">Ui Developers ({members.length})</h3>
                <div className="flex items-center gap-4">
                    <div className="relative w-64 hidden sm:block">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                        <Input className="pl-9 h-9 bg-gray-50 border-gray-200" placeholder="Search for anything..." />
                    </div>
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View all</button>
                </div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-6">
                {members.map((member) => (
                    <div key={member.id} className="flex flex-col items-center gap-2 group cursor-pointer">
                        <div className="relative h-14 w-14 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-blue-500 transition-all">
                            <img src={member.avatar} alt={member.name} className="h-full w-full object-cover" />
                        </div>
                        {/* Tooltip or name could go here, purely visual based on reference */}
                    </div>
                ))}
                <button className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors">
                    <span className="text-2xl font-light text-gray-400 hover:text-blue-500">+</span>
                </button>
            </div>
        </div>
    );
}
