import * as React from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface SelectProps {
    value: string;
    onValueChange: (value: string) => void;
    children: React.ReactNode;
    disabled?: boolean;
}

interface SelectContextType {
    value: string;
    onValueChange: (value: string) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
    disabled?: boolean;
    triggerRect: DOMRect | null;
    setTriggerRect: (rect: DOMRect | null) => void;
}

const SelectContext = React.createContext<SelectContextType | undefined>(undefined);

export function Select({ value, onValueChange, children, disabled }: SelectProps) {
    const [open, setOpen] = React.useState(false);
    const [triggerRect, setTriggerRect] = React.useState<DOMRect | null>(null);

    return (
        <SelectContext.Provider value={{ value, onValueChange, open, setOpen, disabled, triggerRect, setTriggerRect }}>
            <div className="relative">{children}</div>
        </SelectContext.Provider>
    );
}

export function SelectTrigger({ className, children }: { className?: string; children: React.ReactNode }) {
    const context = React.useContext(SelectContext);
    const triggerRef = React.useRef<HTMLButtonElement>(null);

    if (!context) return null;

    const handleToggle = () => {
        if (triggerRef.current) {
            context.setTriggerRect(triggerRef.current.getBoundingClientRect());
        }
        context.setOpen(!context.open);
    };

    return (
        <button
            ref={triggerRef}
            type="button"
            disabled={context.disabled}
            onClick={handleToggle}
            className={cn(
                "flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400",
                className
            )}
        >
            {children}
            <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
    );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
    const context = React.useContext(SelectContext);
    if (!context) return null;
    return <span>{context.value || placeholder}</span>;
}

export function SelectContent({ children }: { children: React.ReactNode }) {
    const context = React.useContext(SelectContext);
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!context || !context.open || !mounted) return null;

    const style: React.CSSProperties = context.triggerRect ? {
        position: 'fixed',
        top: context.triggerRect.bottom + 4,
        left: context.triggerRect.left,
        width: context.triggerRect.width,
        zIndex: 9999,
    } : {};

    return createPortal(
        <>
            <div className="fixed inset-0 z-[9998]" onClick={() => context.setOpen(false)} />
            <div
                style={style}
                className="overflow-hidden rounded-md border border-gray-200 bg-white p-1 text-gray-950 shadow-md animate-in fade-in-0 zoom-in-95 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
            >
                {children}
            </div>
        </>,
        document.body
    );
}

export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
    const context = React.useContext(SelectContext);
    if (!context) return null;

    const isSelected = context.value === value;

    return (
        <div
            onClick={() => {
                context.onValueChange(value);
                context.setOpen(false);
            }}
            className={cn(
                "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-800 dark:focus:bg-gray-800",
                isSelected && "font-semibold"
            )}
        >
            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                {isSelected && <Check className="h-4 w-4" />}
            </span>
            {children}
        </div>
    );
}
