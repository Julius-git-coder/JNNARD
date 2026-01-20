'use client';

import { EmptyState } from '@/components/ui/empty-state';
import { FileText } from 'lucide-react';

export default function WorkLogsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">Work Logs</h1>
            <EmptyState
                title="No work logs yet"
                description="Track time and activity here. Start by creating a task."
                icon={<FileText className="h-6 w-6 text-gray-600" />}
                actionLabel="View Tasks"
                onAction={() => window.location.href = '/tasks'}
            />
        </div>
    );
}
