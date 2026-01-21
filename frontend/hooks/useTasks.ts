'use client';

import { useState, useEffect } from 'react';
import { taskApi } from '@/lib/api';

export interface Task {
    _id: string;
    title: string;
    description?: string;
    status: 'To Do' | 'In Progress' | 'Done' | 'Blocked';
    priority: 'Low' | 'Medium' | 'High';
    dueDate?: string;
    project: { _id: string; title: string };
    assignedTo?: { _id: string; name: string; avatar?: string };
}

export function useTasks(projectId?: string) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, [projectId]);

    const fetchTasks = async () => {
        try {
            setIsLoading(true);
            const response = projectId
                ? await taskApi.getByProject(projectId)
                : await taskApi.getAll();
            setTasks(response.data);
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        tasks,
        isLoading,
        refreshTasks: fetchTasks
    };
}
