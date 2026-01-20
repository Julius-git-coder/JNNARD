'use client';

import { useState } from 'react';

const MOCK_USERS = [
    { id: '1', name: 'Yash', role: 'Team lead' },
    { id: '2', name: 'Ofosu', role: 'Developer' },
    { id: '3', name: 'Jamal', role: 'Designer' },
    { id: '4', name: 'Sarah', role: 'Manager' },
    { id: '5', name: 'John', role: 'Developer' },
    { id: '6', name: 'Mike', role: 'Tester' },
];

export function useCreateTask() {
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState('Addodle');
    const [status, setStatus] = useState('Type - I');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('2022-01-05');
    const [endDate, setEndDate] = useState('2022-12-01');
    const [reporters, setReporters] = useState<string[]>(['1']);
    const [assignees, setAssignees] = useState<string[]>(['1']);

    const toggleReporter = (id: string) => {
        setReporters(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
    };

    const toggleAssignee = (id: string) => {
        setAssignees(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            console.log("Task created");
        }, 1500);
    };

    return {
        isLoading,
        formData: { title, status, description, startDate, endDate, reporters, assignees },
        setters: { setTitle, setStatus, setDescription, setStartDate, setEndDate },
        actions: { toggleReporter, toggleAssignee, handleSubmit },
        users: MOCK_USERS
    };
}
