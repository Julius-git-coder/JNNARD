'use client';

import { useState, useEffect } from 'react';
import { performanceApi } from '@/lib/api';
import { handleError } from '@/lib/error-handler';

export interface PerformanceRecord {
    _id: string;
    worker: { _id: string; name: string; role: string; avatar?: string };
    project: { _id: string; title: string };
    task?: { _id: string; title: string };
    metric: string;
    target: number;
    actual: number;
    status: 'On Track' | 'Off Track' | 'Exceeded' | 'Needs Improvement';
    notes?: string;
    evaluationDate: string;
    createdAt: string;
    updatedAt: string;
}

export function usePerformance() {
    const [records, setRecords] = useState<PerformanceRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            setIsLoading(true);
            const response = await performanceApi.getAll();
            setRecords(response.data);
        } catch (error) {
            handleError(error, "Failed to load performance records.");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        records,
        isLoading,
        refreshRecords: fetchRecords
    };
}
