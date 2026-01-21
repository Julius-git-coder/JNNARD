'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    CheckSquare,
    FileText,
    BarChart2,
    Settings,
    Folder,
    LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Project', href: '/projects', icon: Folder },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Work Logs', href: '/work-logs', icon: FileText },
    { name: 'Performance', href: '/performance', icon: BarChart2 },
    { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800 hidden md:block">
            <div className="flex h-16 items-center px-6 border-b border-gray-100 dark:border-gray-800">
                <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-gray-50">
                    <img src="/Dot.png" alt="Logo" className="h-8 w-8" />
                    JNARD
                </Link>
            </div>

            <div className="py-6 px-3">
                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
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
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}
