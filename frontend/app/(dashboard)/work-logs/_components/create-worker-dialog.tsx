'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { workerApi } from '@/lib/api';
import { Worker } from '@/hooks/useWorkers';
import { handleError, handleSuccess } from '@/lib/error-handler';

interface CreateWorkerDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    workerToEdit?: Worker | null;
}

export function CreateWorkerDialog({ open, onOpenChange, onSuccess, workerToEdit }: CreateWorkerDialogProps) {
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [status, setStatus] = useState('Active');
    const [avatar, setAvatar] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            if (workerToEdit) {
                setName(workerToEdit.name);
                setRole(workerToEdit.role);
                setStatus(workerToEdit.status);
                setAvatar(workerToEdit.avatar || '');
            } else {
                setName('');
                setRole('');
                setStatus('Active');
                setAvatar('');
            }
        }
    }, [open, workerToEdit]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const data = { name, role, status, avatar };

            if (workerToEdit) {
                await workerApi.update(workerToEdit._id, data);
                handleSuccess(`${name}'s profile has been updated successfully.`);
            } else {
                await workerApi.create(data);
                handleSuccess(`${name} has been added to the team.`);
            }

            onSuccess();
            onOpenChange(false);
        } catch (error) {
            handleError(error, "We couldn't save the team member's details. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{workerToEdit ? 'Edit Team Member' : 'Add New Team Member'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            placeholder="John Doe"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role">Position / Role</Label>
                        <Input
                            id="role"
                            placeholder="Senior Developer"
                            required
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="avatar">Avatar URL (Optional)</Label>
                        <Input
                            id="avatar"
                            placeholder="https://example.com/avatar.png"
                            value={avatar}
                            onChange={(e) => setAvatar(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">Availability</Label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Busy">Busy</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                            {isSubmitting ? 'Saving...' : workerToEdit ? 'Save Changes' : 'Add Member'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
