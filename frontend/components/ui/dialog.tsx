'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface DialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
}

const DialogContext = React.createContext<{ open: boolean; onOpenChange: (open: boolean) => void }>({
    open: false,
    onOpenChange: () => { },
});

export function Dialog({ open = false, onOpenChange = () => { }, children }: DialogProps) {
    return (
        <DialogContext.Provider value={{ open, onOpenChange }}>
            {children}
        </DialogContext.Provider>
    );
}

export function DialogTrigger({ children }: { children: React.ReactNode }) {
    const { onOpenChange } = React.useContext(DialogContext);

    if (!React.isValidElement(children)) return <>{children}</>;

    const child = children as React.ReactElement<any>;

    return React.cloneElement(child, {
        onClick: (e: React.MouseEvent) => {
            if (child.props && typeof child.props.onClick === 'function') {
                child.props.onClick(e);
            }
            onOpenChange(true);
        }
    });
}

export function DialogContent({ children, className }: { children: React.ReactNode; className?: string }) {
    const { open, onOpenChange } = React.useContext(DialogContext);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => onOpenChange(false)}
            />
            <div className={cn(
                "relative bg-white dark:bg-gray-950 rounded-2xl shadow-2xl p-6 w-full max-w-lg animate-in zoom-in-95 duration-200",
                className
            )}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            onClick={() => onOpenChange(false)}
                            className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Close</p>
                    </TooltipContent>
                </Tooltip>
                {children}
            </div>
        </div>
    );
}

export function DialogHeader({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn("space-y-1.5 mb-4", className)}>{children}</div>;
}

export function DialogTitle({ children, className }: { children: React.ReactNode; className?: string }) {
    return <h2 className={cn("text-xl font-semibold", className)}>{children}</h2>;
}

export function DialogDescription({ children, className }: { children: React.ReactNode; className?: string }) {
    return <p className={cn("text-sm text-gray-500", className)}>{children}</p>;
}

export function DialogFooter({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn("mt-6 flex justify-end gap-3", className)}>{children}</div>;
}
