'use client';

import { Bell, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function Header() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const loadUser = () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        };

        loadUser();

        window.addEventListener('user-updated', loadUser);
        return () => window.removeEventListener('user-updated', loadUser);
    }, []);

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
                        <p className="text-sm font-medium leading-none text-gray-900 dark:text-gray-50">{user?.name || 'Guest'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || 'Login to continue'}</p>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-blue-100 border border-blue-200 overflow-hidden">
                        {user?.avatar ? (
                            <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-blue-600 font-bold">
                                {user?.name?.charAt(0).toUpperCase() || 'G'}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
