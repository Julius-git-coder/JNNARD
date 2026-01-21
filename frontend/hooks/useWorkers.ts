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
            handleError(error, "Failed to load team members.");
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
