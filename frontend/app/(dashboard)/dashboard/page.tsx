'use client';

import React, { useState, useEffect } from 'react';
import { ProjectStatsChart } from '../_components/project-stats-chart';
import { PerformanceChart } from '../_components/performance-chart';
import { TeamSection } from '../_components/team-section';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

// Mock Data
const MOCK_TEAM = Array.from({ length: 14 }).map((_, i) => ({
    id: `user-${i}`,
    name: `User ${i}`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
}));

const MOCK_PROJECTS_PREVIEW = [
    { id: 1, name: 'Shop', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop' },
    { id: 2, name: 'Makola', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?w=300&h=300&fit=crop' },
    { id: 3, name: 'Ticketz', image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=300&h=300&fit=crop' },
    { id: 4, name: 'Ed-Tech', image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=300&h=300&fit=crop' },
    { id: 5, name: 'Ghana Pay', image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=300&fit=crop' },
    { id: 6, name: 'JNARD', image: 'https://images.unsplash.com/photo-1572177812156-58036aae439c?w=300&h=300&fit=crop' },
    { id: 7, name: 'Euro Tour', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=300&h=300&fit=crop' },
    { id: 8, name: 'Eatz', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=300&fit=crop' },
    { id: 9, name: 'Bill', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=300&h=300&fit=crop' },
];

export default function DashboardPage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate data fetching
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">Projects</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-1/3 min-h-[350px]">
                            <ProjectStatsChart isLoading={isLoading} />
                        </div>
                        <div className="w-full md:w-2/3 min-h-[350px]">
                            <PerformanceChart isLoading={isLoading} />
                        </div>
                    </div>

                    <div className="pt-4">
                        <TeamSection isLoading={isLoading} members={MOCK_TEAM} />
                    </div>
                </div>

                <div className="lg:col-span-4">
                    <Card className="h-full border-none shadow-none bg-transparent">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-lg text-gray-800">Projects</h3>
                            <Link href="/projects" className="text-sm font-medium text-blue-600 hover:text-blue-700">View all</Link>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {MOCK_PROJECTS_PREVIEW.map((project) => (
                                <div key={project.id} className="flex flex-col items-center gap-2">
                                    <div className="aspect-square w-full rounded-xl overflow-hidden bg-gray-100 relative group cursor-pointer">
                                        <img src={project.image} alt={project.name} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                    </div>
                                    <span className="text-xs font-medium text-gray-600">{project.name}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
