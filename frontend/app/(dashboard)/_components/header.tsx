'use client';

import { Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function Header() {
    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-6 dark:bg-gray-950 dark:border-gray-800">
            <div className="w-full max-w-md">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <Input
                        className="w-full pl-9 bg-gray-50/50 border-gray-200 focus-visible:bg-white transition-all"
                        placeholder="Search for anything..."
                        type="search"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-950"></span>
                    <span className="sr-only">Notifications</span>
                </Button>

                <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-800">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium leading-none text-gray-900 dark:text-gray-50">Ofosu Jamal</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Kumasi, Ghana</p>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-blue-100 border border-blue-200 overflow-hidden">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="h-full w-full object-cover" />
                    </div>
                </div>
            </div>
        </header>
    );
}
