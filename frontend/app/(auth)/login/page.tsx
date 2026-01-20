'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Card imports removed
import { AlertCircle, Eye, EyeOff, Lock } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Simulate API call
        setTimeout(() => {
            // Simple validation for demo
            if (email === 'demo@jnnard.com' && password === 'password') {
                console.log("Login successful");
                // In a real app, you'd redirect here, e.g., router.push('/dashboard')
            } else {
                // Show error state demo
                setIsLoading(false);
                // Uncomment to test success flow: 
                // window.location.href = '/dashboard'; 
                // For now, let's just finish the "loading" simulation:
                if (email && password) {
                    // Fake success for now to proceed to dashboard integration later
                    window.location.href = '/dashboard';
                } else {
                    setError("Please fill in all fields.");
                }
            }
            setIsLoading(false);
        }, 2000);
    };

    return (
        <div className="flex min-h-screen w-full flex-col lg:flex-row bg-white dark:bg-gray-950">
            {/* Left Section - Illustration */}
            <div className="flex-1 hidden lg:flex flex-col items-center justify-center bg-blue-600 p-12 text-white relative overflow-hidden">
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute top-24 right-12 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-50"></div>

                <div className="relative z-10 text-center max-w-lg">
                    {/* Placeholder for the illustration in the reference image */}
                    <div className="mb-10 relative mx-auto w-64 h-80 bg-blue-500/30 rounded-2xl border border-blue-400/30 flex items-center justify-center backdrop-blur-sm shadow-2xl">
                        <Lock className="w-24 h-24 text-blue-100 opacity-80" />
                        <div className="absolute bottom-4 left-0 w-full text-center text-blue-200 text-sm font-mono">SECURE ACCESS</div>
                    </div>
                    <h1 className="text-4xl font-bold mb-6">Welcome to JNNARD</h1>
                    <p className="text-lg text-blue-100">
                        Manage your projects, track tasks, and collaborate with your team in one unified platform.
                    </p>
                </div>
            </div>

            {/* Right Section - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-left">
                        <div className="flex items-center gap-2 mb-2 text-blue-600 font-bold text-xl">
                            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">J</div>
                            JNARD System
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 mt-8">Welcome back.</h2>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Welcome back! Please enter your details.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md flex items-center gap-2 border border-red-100">
                                <AlertCircle className="w-4 h-4" /> {error}
                            </div>
                        )}

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
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                                />
                                <label htmlFor="remember" className="text-sm font-medium leading-none text-gray-700">Remember me</label>
                            </div>
                            <Link href="/forgot-password" className="text-sm font-medium text-blue-600 hover:underline">
                                Forgot Password?
                            </Link>
// ...
                            <Link href="/signup" className="font-semibold text-blue-600 hover:underline">
                                Sign up for free
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
