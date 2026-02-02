import { useState, useEffect } from 'react';
import { workerDashboardApi } from '@/lib/api';
import { handleError } from '@/lib/error-handler';

interface Project {
    _id: string;
    title: string;
    description: string;
    status: string;
}

interface Task {
    _id: string;
    title: string;
    status: string;
    dueDate?: string;
    priority: string;
    project?: {
        title: string;
    };
}

export function useWorkerDashboard() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [performance, setPerformance] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [projectsRes, tasksRes, perfRes] = await Promise.all([
                workerDashboardApi.getProjects(),
                workerDashboardApi.getTasks(),
                workerDashboardApi.getPerformance()
            ]);

            setProjects(projectsRes.data.data);
            setTasks(tasksRes.data.data);
            setPerformance(perfRes.data.data);
        } catch (error) {
            handleError(error, "Failed to load dashboard data");
        } finally {
            setIsLoading(false);
        }
    };

    const updateTaskStatus = async (taskId: string, status: string) => {
        try {
            await workerDashboardApi.updateTaskStatus(taskId, status);
            // Refresh tasks
            const tasksRes = await workerDashboardApi.getTasks();
            setTasks(tasksRes.data.data);
            return true;
        } catch (error) {
            handleError(error, "Failed to update task status");
            return false;
        }
    };

    const submitReport = async (reportData: any) => {
        try {
            await workerDashboardApi.submitReport(reportData);
            return true;
        } catch (error) {
            handleError(error, "Failed to submit report");
            return false;
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return {
        projects,
        tasks,
        performance,
        isLoading,
        refresh: fetchData,
        updateTaskStatus,
        submitReport
    };
}
