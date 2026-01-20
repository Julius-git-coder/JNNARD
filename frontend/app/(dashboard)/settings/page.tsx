'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Upload, User as UserIcon, Loader2, Save } from 'lucide-react';

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Load initial data
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
            setFormData({
                name: parsed.name || '',
                email: parsed.email || '',
                password: '',
            });
            setAvatarPreview(parsed.avatar || null);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const token = localStorage.getItem('accessToken');
            const data = new FormData();
            data.append('name', formData.name);
            data.append('email', formData.email);
            if (formData.password) data.append('password', formData.password);

            if (avatarFile) {
                data.append('avatar', avatarFile);
            }

            const response = await fetch('http://localhost:5000/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                    // Content-Type is auto-set by browser for FormData
                },
                body: data
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Update failed');
            }

            // Update local storage
            localStorage.setItem('user', JSON.stringify({
                name: result.name,
                email: result.email,
                avatar: result.avatar
            }));
            setUser(result);
            alert('Profile updated successfully!'); // Simple feedback for now

        } catch (error: any) {
            alert(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (!user) {
        return <div className="p-8">Loading settings...</div>;
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">Settings</h1>
                <Button variant="destructive" onClick={handleLogout} className="gap-2">
                    <LogOut className="h-4 w-4" /> Log out
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your account profile details and avatar.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Avatar Section */}
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <Avatar className="h-24 w-24 border-2 border-gray-100">
                                <AvatarImage src={avatarPreview || user.avatar} />
                                <AvatarFallback className="text-lg bg-blue-100 text-blue-600">
                                    {formData.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-center md:items-start gap-2">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload className="mr-2 h-4 w-4" /> Upload New Image
                                </Button>
                                <p className="text-sm text-gray-500 text-center md:text-left">
                                    Recommended: Square JPG, PNG. Max 5MB.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Your Name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">New Password (Optional)</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Leave blank to keep current password"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t">
                            <Button type="submit" disabled={isSaving} className="min-w-[120px]">
                                {isSaving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" /> Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
