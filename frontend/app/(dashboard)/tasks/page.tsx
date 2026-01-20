'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';

export default function TasksPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Tasks</h1>
                <Link href="/tasks/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> New Task
                    </Button>
                </Link>
            </div>
            <EmptyState
                title="No tasks found"
                description="You haven't created any tasks yet."
                actionLabel="Create Task"
                onAction={() => window.location.href = '/tasks/new'}
            />
        </div>
    )
}
