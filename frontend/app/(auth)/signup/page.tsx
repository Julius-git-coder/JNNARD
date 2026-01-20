'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, UserPlus, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        terms: false
    });
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            setIsLoading(false);
            return;
        }

        if (!formData.terms) {
            setError("You must agree to the Terms and Conditions.");
            setIsLoading(false);
            return;
        }

        // Simulate API call
        setTimeout(() => {
            console.log("Signup successful");
            // Redirect to verify
            window.location.href = '/verify?email=' + encodeURIComponent(formData.email);
        }, 1500);
    };

    return (
        <div className="flex min-h-screen w-full flex-col lg:flex-row bg-white dark:bg-gray-950">
            {/* Left Section - Illustration (Same as Login for consistency) */}
            <div className="flex-1 hidden lg:flex flex-col items-center justify-center bg-blue-600 p-12 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute top-24 right-12 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-50"></div>

                <div className="relative z-10 text-center max-w-lg">
                    <div className="mb-10 relative mx-auto w-64 h-80 bg-blue-500/30 rounded-2xl border border-blue-400/30 flex items-center justify-center backdrop-blur-sm shadow-2xl">
                        <UserPlus className="w-24 h-24 text-blue-100 opacity-80" />
                        <div className="absolute bottom-4 left-0 w-full text-center text-blue-200 text-sm font-mono">JOIN TEAM</div>
                    </div>
                    <h1 className="text-4xl font-bold mb-6">Start your journey</h1>
                    <p className="text-lg text-blue-100">
                        Join thousands of teams using JNNARD to ship faster and collaborate better.
                    </p>
                </div>
            </div>

            {/* Right Section - Signup Form */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-left">
                        <div className="flex items-center gap-2 mb-2 text-blue-600 font-bold text-xl">
                            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">J</div>
                            JNARD System
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 mt-8">Create an account</h2>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Enter your details to get started.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md flex items-center gap-2 border border-red-100">
                                <AlertCircle className="w-4 h-4" /> {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="fullname">Full Name</Label>
                            <Input
                                id="fullname"
                                placeholder="John Doe"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                required
                                className="h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@company.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                className="h-11"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                        className="h-11 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                    className="h-11"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="terms"
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                                checked={formData.terms}
                                onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                            />
                            <label htmlFor="terms" className="text-sm text-gray-700">
                                I agree to the <Link href="#" className="text-blue-600 hover:underline">Terms of Service</Link> and <Link href="#" className="text-blue-600 hover:underline">Privacy Policy</Link>
                            </label>
                        </div>

                        <Button type="submit" className="w-full h-11 text-base bg-blue-600 hover:bg-blue-700 text-white" isLoading={isLoading}>
                            Create Account
                        </Button>

                        <div className="text-center text-sm text-gray-500">
                            Already have an account?{" "}
                            <Link href="/login" className="font-semibold text-blue-600 hover:underline">
                                Log in
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
