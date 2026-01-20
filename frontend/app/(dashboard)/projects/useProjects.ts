'use client';

import { useState, useEffect } from 'react';

interface Project {
    id: string;
    title: string;
    status: "Active" | "Pending" | "On Hold" | "Completed" | "Offtrack";
    description: string;
    dueDate: string;
    issueCount: number;
    members: { id: string; name: string; avatar: string }[];
}

// Move mock data here or keeping it simple
const generateProjects = (count: number): Project[] => {
    return Array.from({ length: count }).map((_, i) => ({
        id: `proj-${i}`,
        title: 'Adoddle',
        status: (i % 3 === 0 ? 'Offtrack' : 'Active') as "Active" | "Pending" | "On Hold" | "Completed" | "Offtrack",
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        dueDate: '05 APRIL 2023',
        issueCount: 14,
        members: [
            { id: '1', name: 'User 1', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1' },
            { id: '2', name: 'User 2', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2' },
            { id: '3', name: 'User 3', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3' },
            { id: '4', name: 'User 4', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4' },
            { id: '5', name: 'User 5', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5' },
        ]
    }));
};

const ALL_PROJECTS = generateProjects(12);

export function useProjects() {
    const [isLoading, setIsLoading] = useState(true);
    const [projects, setProjects] = useState<Project[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        // Simulate Fetch
        const timer = setTimeout(() => {
            setProjects(ALL_PROJECTS);
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const filteredProjects = projects.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
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
        hasProjects: projects.length > 0
    };
}
