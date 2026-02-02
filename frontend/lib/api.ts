import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authApi = {
    updateProfile: (data: FormData) => api.put('/auth/profile', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    resetPassword: (data: any) => api.post('/auth/reset-password', data),
};

export const projectApi = {
    getAll: () => api.get('/projects'),
    getById: (id: string) => api.get(`/projects/${id}`),
    create: (data: any) => api.post('/projects', data),
    update: (id: string, data: any) => api.put(`/projects/${id}`, data),
    delete: (id: string) => api.delete(`/projects/${id}`),
};

export const workerApi = {
    getAll: () => api.get('/workers'),
    getById: (id: string) => api.get(`/workers/${id}`),
    create: (data: any) => api.post('/workers', data),
    update: (id: string, data: any) => api.put(`/workers/${id}`, data),
    delete: (id: string) => api.delete(`/workers/${id}`),
};

export const taskApi = {
    getAll: () => api.get('/tasks'),
    getByProject: (projectId: string) => api.get(`/tasks/project/${projectId}`),
    getById: (id: string) => api.get(`/tasks/${id}`),
    create: (data: any) => api.post('/tasks', data),
    update: (id: string, data: any) => api.put(`/tasks/${id}`, data),
    delete: (id: string) => api.delete(`/tasks/${id}`),
};

export const performanceApi = {
    getAll: () => api.get('/performance'),
    getByWorker: (workerId: string) => api.get(`/performance/worker/${workerId}`),
    create: (data: any) => api.post('/performance', data),
    update: (id: string, data: any) => api.put(`/performance/${id}`, data),
    delete: (id: string) => api.delete(`/performance/${id}`),
};

export const workerDashboardApi = {
    getProjects: () => api.get('/worker-dashboard/projects'),
    getTasks: () => api.get('/worker-dashboard/tasks'),
    updateTaskStatus: (taskId: string, status: string) => api.patch(`/worker-dashboard/tasks/${taskId}/status`, { status }),
    submitReport: (data: any) => api.post('/worker-dashboard/reports', data),
    getPerformance: () => api.get('/worker-dashboard/performance'),
};

export const uploadApi = {
    uploadFile: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
};

export default api;
