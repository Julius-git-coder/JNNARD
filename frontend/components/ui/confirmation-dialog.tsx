'use client';

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ConfirmationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void | Promise<void>;
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'default' | 'destructive';
    isLoading?: boolean;
}

export function ConfirmationDialog({
    open,
    onOpenChange,
    onConfirm,
    title,
    description,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    variant = "destructive",
    isLoading = false,
}: ConfirmationDialogProps) {
    const handleConfirm = async () => {
        await onConfirm();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="flex flex-col items-center sm:items-start gap-4">
                    <div className={`p-3 rounded-full ${variant === 'destructive' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                        <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div className="space-y-1 text-center sm:text-left">
                        <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
                        <DialogDescription className="text-gray-500 dark:text-gray-400">
                            {description}
                        </DialogDescription>
                    </div>
                </DialogHeader>
                <DialogFooter className="mt-4 gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                        className="w-full sm:w-auto"
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        type="button"
                        variant={variant === 'destructive' ? 'destructive' : 'default'}
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className={variant === 'default' ? "w-full sm:w-auto bg-blue-600 hover:bg-blue-700" : "w-full sm:w-auto"}
                    >
                        {isLoading ? "Processing..." : confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
