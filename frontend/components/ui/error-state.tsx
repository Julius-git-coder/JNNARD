import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from './button';

interface ErrorStateProps {
    title?: string;
    message: string;
    onRetry?: () => void;
}

export function ErrorState({ title = "Something went wrong", message, onRetry }: ErrorStateProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-8 text-center text-red-900">
            <AlertCircle className="h-10 w-10 text-red-600 mb-4" />
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mb-6 mt-2 text-sm max-w-sm">{message}</p>
            {onRetry && (
                <Button onClick={onRetry} variant="destructive">
                    Try Again
                </Button>
            )}
        </div>
    );
}
