'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { projectApi } from '@/lib/api';
import { useWorkers } from '@/hooks/useWorkers';
import { Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CreateProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    project?: {
        _id: string;
        title: string;
        description: string;
        status: string;
        endDate?: string;
        members: { _id: string }[];
    };
}

export function CreateProjectDialog({ open, onOpenChange, onSuccess, project }: CreateProjectDialogProps) {
    const isEdit = !!project;
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('Active');
    const [endDate, setEndDate] = useState('');
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const { workers } = useWorkers();

    React.useEffect(() => {
        if (open) {
            if (project) {
                setTitle(project.title || '');
                setDescription(project.description || '');
                setStatus(project.status || 'Active');
                setEndDate(project.endDate ? project.endDate.split('T')[0] : '');
                setSelectedMembers(project.members?.map(m => m._id) || []);
            } else {
                setTitle('');
                setDescription('');
                setStatus('Active');
                setEndDate('');
                setSelectedMembers([]);
            }
        }
    }, [open, project]);

    const filteredWorkers = workers.filter(worker =>
        worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const projectData = {
                title,
                description,
                status,
                endDate,
                members: selectedMembers,
            };

            if (isEdit && project) {
                await projectApi.update(project._id, projectData);
            } else {
                await projectApi.create(projectData);
            }
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error(isEdit ? "Failed to update project:" : "Failed to create project:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleMember = (memberId: string) => {
        setSelectedMembers(prev =>
            prev.includes(memberId)
                ? prev.filter(id => id !== memberId)
                : [...prev, memberId]
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Edit Project' : 'Create New Project'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Project Title</Label>
                        <Input
                            id="title"
                            placeholder="Enter project name"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Project details..."
                            className="h-24"
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="status">Initial Status</Label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Active">Active</SelectItem>
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="On Hold">On Hold</SelectItem>
                                    <SelectItem value="Offtrack">Offtrack</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="deadline">Deadline</Label>
                            <Input
                                id="deadline"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Team Members</Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {selectedMembers.map(id => {
                                const worker = workers.find(w => w._id === id);
                                return (
                                    <Badge key={id} variant="secondary" className="pl-1 pr-2 py-1 flex items-center gap-1">
                                        <Avatar className="h-5 w-5">
                                            <AvatarImage src={worker?.avatar} />
                                            <AvatarFallback>{worker?.name[0]}</AvatarFallback>
                                        </Avatar>
                                        {worker?.name}
                                        <X
                                            className="h-3 w-3 cursor-pointer hover:text-red-500"
                                            onClick={() => toggleMember(id)}
                                        />
                                    </Badge>
                                );
                            })}
                        </div>
                        <div className="space-y-2">
                            <Input
                                placeholder="Search by name or position..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="h-8 text-sm"
                            />
                        </div>
                        <div className="border rounded-md max-h-40 overflow-y-auto p-2">
                            {filteredWorkers.map(worker => (
                                <div
                                    key={worker._id}
                                    className={cn(
                                        "flex items-center justify-between p-2 rounded-sm cursor-pointer hover:bg-gray-100",
                                        selectedMembers.includes(worker._id) && "bg-blue-50"
                                    )}
                                    onClick={() => toggleMember(worker._id)}
                                >
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={worker.avatar} />
                                            <AvatarFallback>{worker.name[0]}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium">{worker.name}</p>
                                            <p className="text-xs text-gray-500">{worker.role}</p>
                                        </div>
                                    </div>
                                    {selectedMembers.includes(worker._id) && <Check className="h-4 w-4 text-blue-600" />}
                                </div>
                            ))}
                            {filteredWorkers.length === 0 && (
                                <p className="text-xs text-gray-500 text-center py-2">
                                    {searchTerm ? "No results found" : "No workers found"}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                            {isSubmitting ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Save Changes' : 'Create Project')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
