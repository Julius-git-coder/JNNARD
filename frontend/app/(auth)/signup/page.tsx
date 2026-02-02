'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { handleError, handleSuccess } from '@/lib/error-handler';

export default function SignupPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'worker', // Default role
        terms: false
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match.");
            setIsLoading(false);
            return;
        }

        if (!formData.terms) {
            toast.error("You must agree to the Terms and Conditions.");
            setIsLoading(false);
            return;
        }

        try {
            const data = new FormData();
            data.append('name', formData.fullName);
            data.append('email', formData.email);
            data.append('password', formData.password);
            data.append('role', formData.role);

            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                // Fetch automatically sets the correct Content-Type for FormData
                body: data,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Signup failed');
            }

            handleSuccess("Signup successful! Please verify your email.");
            // Redirect to verify with email param
            window.location.href = '/verify?email=' + encodeURIComponent(formData.email);

        } catch (err: any) {
            handleError(err, 'Signup failed. Please try again.');
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
                    src="/SignUp.jpeg"
                    alt="Signup Visual"
                    className="w-full max-w-xl object-contain"
                />
            </div>

            {/* Right Section - Signup Form */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-12 relative">
                {/* Logo removed from here */}

                <div className="w-full max-w-md space-y-8">
                    <div className="text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 mt-8">Create an account</h2>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Enter your details to get started.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 mt-8">

                        <div className="space-y-2">
                            <Label>I am signing up as a:</Label>
                            <div className="grid grid-cols-2 gap-4 pt-1">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'worker' })}
                                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${formData.role === 'worker'
                                            ? 'border-black bg-gray-50 dark:bg-gray-900 dark:border-white shadow-sm'
                                            : 'border-gray-100 hover:border-gray-200 text-gray-500'
                                        }`}
                                >
                                    <span className="font-bold text-sm">Intern / Worker</span>
                                    <span className="text-[10px] opacity-60">I'm here to work</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'admin' })}
                                    className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${formData.role === 'admin'
                                            ? 'border-black bg-gray-50 dark:bg-gray-900 dark:border-white shadow-sm'
                                            : 'border-gray-100 hover:border-gray-200 text-gray-500'
                                        }`}
                                >
                                    <span className="font-bold text-sm">Administrator</span>
                                    <span className="text-[10px] opacity-60">I manage projects</span>
                                </button>
                            </div>
                        </div>

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
                                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                                checked={formData.terms}
                                onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                            />
                            <label htmlFor="terms" className="text-sm text-gray-700">
                                I agree to the <Link href="#" className="text-black font-semibold hover:underline">Terms of Service</Link> and <Link href="#" className="text-black font-semibold hover:underline">Privacy Policy</Link>
                            </label>
                        </div>

                        <Button type="submit" className="w-full h-11 text-base bg-black hover:bg-gray-800 text-white" isLoading={isLoading}>
                            Create Account
                        </Button>

                        <div className="text-center text-sm text-gray-500">
                            Already have an account?{" "}
                            <Link href="/login" className="font-semibold text-black hover:underline">
                                Log in
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
