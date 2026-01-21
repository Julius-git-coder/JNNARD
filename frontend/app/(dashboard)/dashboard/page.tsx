'use client';

import React, { useState, useEffect } from 'react';
import { TasksChart } from '../_components/tasks-chart';
import { WorkLogChart } from '../_components/work-log-chart';
import { ProjectsCard } from '../_components/projects-card';
import { PerformanceChart } from '../_components/performance-chart';
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">Dashboard</h1>
            </div>

            {/* 2x2 Grid for Main Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-[400px]">
                    <ProjectsCard isLoading={isLoading} />
                </div>
                <div className="h-[400px]">
                    <TasksChart isLoading={isLoading} />
                </div>
                <div className="h-[400px]">
                    <WorkLogChart isLoading={isLoading} />
                </div>
                <div className="h-[400px]">
                    <PerformanceChart isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
}
