'use client';

import { useState, useEffect } from 'react';
import { workerApi } from '@/lib/api';
import { handleError } from '@/lib/error-handler';

export interface Worker {
    _id: string;
    name: string;
    role: string;
    avatar?: string;
    status: 'Active' | 'Inactive' | 'Busy';
    createdAt?: string;
    updatedAt?: string;
}

export function useWorkers(autoRefresh: boolean = false) {
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchWorkers();

        // Auto-refresh every 30 seconds if enabled
        if (autoRefresh) {
            const interval = setInterval(() => {
                fetchWorkers(true); // Silent refresh
            }, 30000); // 30 seconds

            return () => clearInterval(interval);
        }
    }, [autoRefresh]);

    const fetchWorkers = async (silent: boolean = false) => {
        try {
            if (!silent) {
                setIsLoading(true);
            }
            const response = await workerApi.getAll();
            console.log('✅ Workers fetched:', response.data.length, 'workers');
            console.log('Workers:', response.data.map((w: any) => `${w.name} (${w.role})`));
            setWorkers(response.data);
        } catch (error) {
            console.error('❌ Failed to fetch workers:', error);
            if (!silent) {
                handleError(error, "Failed to load team members.");
            }
        } finally {
            if (!silent) {
                setIsLoading(false);
            }
        }
    };

    return {
        workers,
        isLoading,
        refreshWorkers: fetchWorkers
    };
}
