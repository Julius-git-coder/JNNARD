'use client';

import { useState, useEffect } from 'react';
import { projectApi } from '@/lib/api';

export interface Project {
    _id: string; // MongoDB ID
    title: string;
    status: "Active" | "Pending" | "On Hold" | "Completed" | "Offtrack";
    description: string;
    dueDate?: string; // Optional in DB schema, ensure mapped or handled
    endDate?: string; // Using endDate as dueDate usually
    issues?: any[]; // Adjust type as needed
    members: { _id: string; name: string; avatar: string }[];
    attachments?: { name: string; url: string; fileType: string }[];
}

export function useProjects() {
    const [isLoading, setIsLoading] = useState(true);
    const [projects, setProjects] = useState<Project[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setIsLoading(true);
            const response = await projectApi.getAll();
            setProjects(response.data);
        } catch (error) {
            console.error("Failed to fetch projects:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    const displayedProjects = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return {
        isLoading,
        projects: displayedProjects,
        searchQuery,
        setSearchQuery,
        currentPage,
        setCurrentPage,
        totalPages,
        hasProjects: projects.length > 0,
        refreshProjects: fetchProjects
    };
}
