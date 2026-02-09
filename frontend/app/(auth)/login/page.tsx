'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { handleError, handleSuccess } from '@/lib/error-handler';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // DEBUG: Check environment variable in production
        console.log('Current Backend URL:', process.env.NEXT_PUBLIC_BACKEND_URL);

        try {
            const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Login failed');
            }

            // Save authentication data
            localStorage.setItem('accessToken', result.accessToken);
            if (result.refreshToken) localStorage.setItem('refreshToken', result.refreshToken);
            localStorage.setItem('user', JSON.stringify({
                name: result.name,
                email: result.email,
                avatar: result.avatar,
                role: result.role,
                workerProfile: result.workerProfile
            }));

            handleSuccess("Login successful");

            // Redirect based on role
            if (result.role === 'worker') {
                window.location.href = '/worker/dashboard';
            } else {
                window.location.href = '/dashboard';
            }

        } catch (err: any) {
            handleError(err, 'Login failed. Please check your credentials and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col lg:flex-row bg-white dark:bg-gray-950 relative">
            {/* Logo top-left of the screen */}
            <div className="absolute top-8 left-8 flex items-center gap-2 font-bold text-xl z-10">
                <img src="/Dot.png" alt="Logo" className="h-8 w-8" />
                <span>JNARD System</span>
            </div>

            {/* Left Section - Image */}
            <div className="hidden lg:flex flex-1 items-center justify-center p-12  dark:bg-gray-900">
                <img
                    src="/Login.png"
                    alt="Login Visual"
                    className="w-full max-w-md object-contain"
                />
            </div>

            {/* Right Section - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
                {/* Logo removed from here */}
                <div className="w-full max-w-md space-y-8">
                    <div className="text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 mt-8">Welcome back.</h2>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Welcome back! Please enter your details.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="h-11 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                                />
                                <label htmlFor="remember" className="text-sm font-medium leading-none text-gray-700">Remember me</label>
                            </div>
                            <Link href="/forgot-password" className="text-sm font-medium text-black hover:underline">
                                Forgot Password?
                            </Link>
                        </div>

                        <Button type="submit" className="w-full h-11 text-base bg-black hover:bg-gray-800 text-white" isLoading={isLoading}>
                            Log in
                        </Button>

                        <div className="text-center text-sm text-gray-500">
                            Don&apos;t have an account?{" "}
                            <Link href="/signup" className="font-semibold text-black hover:underline">
                                Sign up for free
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
