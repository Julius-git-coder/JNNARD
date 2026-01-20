import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from './button';

interface EmptyStateProps {
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    icon?: React.ReactNode;
}

export function EmptyState({ title, description, actionLabel, onAction, icon }: EmptyStateProps) {
    return (
        <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-8 text-center animate-in fade-in-50">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                {icon || <PackageOpen className="h-6 w-6 text-gray-600" />}
            </div>
            <h3 className="mt-4 text-lg font-semibold">{title}</h3>
            <p className="mb-4 mt-2 text-sm text-gray-500 max-w-sm">{description}</p>
            {actionLabel && onAction && (
                <Button onClick={onAction} variant="default">
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}
