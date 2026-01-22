'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    CheckSquare,
    FileText,
    BarChart2,
    Settings,
    Folder,
    LayoutDashboard,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const mainNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Project', href: '/projects', icon: Folder },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Team', href: '/work-logs', icon: FileText },
    { name: 'Performance', href: '/performance', icon: BarChart2 },
];

const settingsItem = { name: 'Settings', href: '/settings', icon: Settings };

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();

    const renderNavItem = (item: typeof mainNavItems[0]) => {
        const isActive = pathname === item.href || (item.href !== '/ dashboard' && pathname.startsWith(item.href));
        return (
            <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                    <Link
                        href={item.href}
                        onClick={() => onClose?.()}
                        className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                            isActive
                                ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-200"
                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
                        )}
                    >
                        <item.icon className={cn("h-5 w-5", isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400")} />
                        {item.name}
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                    <p>{item.name}</p>
                </TooltipContent>
            </Tooltip>
        );
    };

    return (
        <>
            {/* MOBILE OVERLAY */}
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            <aside className={cn(
                "fixed left-0 top-0 z-50 h-screen w-64 border-r border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800 transition-transform duration-300 ease-in-out md:translate-x-0 md:block",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-full">
                    <div className="flex h-16 items-center justify-between px-6 border-b border-gray-100 dark:border-gray-800 shrink-0">
                        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-gray-50">
                            <img src="/Dot.png" alt="Logo" className="h-8 w-8" />
                            JNARD
                        </Link>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={onClose}
                                    className="md:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Close Sidebar</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>

                    <div className="flex-1 overflow-y-auto py-6 px-3">
                        <nav className="space-y-1">
                            {mainNavItems.map(renderNavItem)}
                        </nav>
                    </div>

                    <div className="px-3 py-6 border-t border-gray-100 dark:border-gray-800 shrink-0">
                        {renderNavItem(settingsItem)}
                    </div>
                </div>
            </aside>
        </>
    );
}
