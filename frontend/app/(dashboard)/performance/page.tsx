'use client';

import React, { useState, useEffect } from 'react';
import { PerformanceChart } from '../_components/performance-chart';

export default function PerformancePage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setIsLoading(false), 800);
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">Performance Analytics</h1>
            <div className="h-[500px]">
                <PerformanceChart isLoading={isLoading} />
            </div>
        </div>
    );
}
