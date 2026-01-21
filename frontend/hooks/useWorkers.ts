'use client';

import { useState, useEffect } from 'react';
import { workerApi } from '@/lib/api';

export interface Worker {
    _id: string;
    name: string;
    role: string;
    avatar?: string;
    status: 'Active' | 'Inactive' | 'Busy';
}

export function useWorkers() {
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchWorkers();
    }, []);

    const fetchWorkers = async () => {
        try {
            setIsLoading(true);
            const response = await workerApi.getAll();
            setWorkers(response.data);
        } catch (error) {
            console.error("Failed to fetch workers:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        workers,
        isLoading,
        refreshWorkers: fetchWorkers
    };
}
