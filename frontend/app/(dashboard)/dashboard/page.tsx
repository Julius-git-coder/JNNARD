'use client';

import React, { useState, useEffect } from 'react';
import { TasksChart } from '../_components/tasks-chart';
import { WorkLogChart } from '../_components/work-log-chart';
import { ProjectsCard } from '../_components/projects-card';
import { PerformanceChart } from '../_components/performance-chart';
import { TeamSection } from '../_components/team-section';
import { Card } from '@/components/ui/card';
import { useWorkers } from '@/hooks/useWorkers';

export default function DashboardPage() {
    const [isLoading, setIsLoading] = useState(true);
    const { workers, isLoading: isWorkersLoading } = useWorkers();

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            const parsedUser = JSON.parse(user);
            if (parsedUser.role === 'worker') {
                window.location.href = '/worker/dashboard';
            }
        }
    }, []);

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

            {/* Team Section */}
            <Card className="p-6 border-gray-200 dark:border-gray-800">
                <TeamSection
                    isLoading={isLoading || isWorkersLoading}
                    members={workers}
                />
            </Card>
        </div>
    );
}
