'use client';

import { ThemeToggle } from '@/components/theme-toggle';

import { Bell, Search, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface HeaderProps {
    onMenuClick?: () => void;
    isMobileMenuOpen?: boolean;
}

export function Header({ onMenuClick, isMobileMenuOpen }: HeaderProps) {
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
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6 dark:bg-gray-950 dark:border-gray-800">
            <div className="flex items-center gap-4 w-full">
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-gray-500"
                    onClick={onMenuClick}
                    tooltip={isMobileMenuOpen ? "Close menu" : "Open menu"}
                >
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>

                <div className="w-full max-w-xs md:max-w-md hidden sm:block">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                <Input
                                    className="w-full pl-9 bg-gray-50/50 border-gray-200 focus-visible:bg-white transition-all h-9"
                                    placeholder="Search projects..."
                                    type="search"
                                />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Global Search</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>

            <div className="flex items-center gap-2 md:gap-4 shrink-0">
                <ThemeToggle />
                <Button variant="ghost" size="icon" className="relative text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 h-9 w-9" tooltip="Notifications">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-950"></span>
                </Button>

                <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-gray-200 dark:border-gray-800">
                    <div className="text-right hidden lg:block">
                        <p className="text-sm font-medium leading-none text-gray-900 dark:text-gray-50">{user?.name || 'Guest'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || 'Login'}</p>
                    </div>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="h-8 w-8 md:h-9 md:w-9 rounded-full bg-blue-600 border border-blue-200 overflow-hidden flex items-center justify-center text-white font-bold text-sm shadow-sm cursor-pointer">
                                {user?.avatar ? (
                                    <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover" />
                                ) : (
                                    user?.name?.charAt(0).toUpperCase() || 'G'
                                )}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>User Profile</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
        </header>
    );
}
