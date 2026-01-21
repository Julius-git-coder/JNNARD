'use client';

import React, { useState, useEffect } from 'react';
import { TasksChart } from '../_components/tasks-chart';
import { WorkLogChart } from '../_components/work-log-chart';
import { ProjectsCard } from '../_components/projects-card';
import { PerformanceChart } from '../_components/performance-chart';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function DashboardPage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulating loading for the top-level
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">Dashboard</h1>
            </div>

            {/* Responsive Grid for Dashboard Cards */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                <div className="min-h-[350px] md:h-[400px]">
                    <ProjectsCard isLoading={isLoading} />
                </div>
                <div className="min-h-[350px] md:h-[400px]">
                    <TasksChart isLoading={isLoading} />
                </div>
                <div className="min-h-[350px] md:h-[400px]">
                    <WorkLogChart isLoading={isLoading} />
                </div>
                <div className="min-h-[350px] md:h-[400px]">
                    <PerformanceChart isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
}
