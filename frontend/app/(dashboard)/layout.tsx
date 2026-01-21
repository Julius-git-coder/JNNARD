'use client';

import React, { useState } from 'react';
import { Sidebar } from './_components/sidebar';
import { Header } from './_components/header';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="md:pl-64 flex flex-col min-h-screen transition-all duration-300 ease-in-out">
                <Header
                    onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    isMobileMenuOpen={isSidebarOpen}
                />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
