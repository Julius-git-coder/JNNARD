'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { handleError, handleSuccess } from '@/lib/error-handler';

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Request failed');
            }

            setIsSubmitted(true);
            handleSuccess("Reset code sent! Check your email.");

        } catch (err: any) {
            handleError(err, 'Failed to send reset code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="flex min-h-screen bg-white dark:bg-gray-950">
                {/* Image Section */}
                <div className="hidden lg:flex w-1/2 items-center justify-center p-12 dark:bg-gray-900">
                    <img
                        src="/Forget.jpeg"
                        alt="Forgot Password Visual"
                        className="w-full max-w-md object-contain"
                    />
                </div>

                <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                    <div className="w-full max-w-md space-y-6 text-center">
                        <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                            <Mail className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-2xl font-bold">Check your email</h2>
                        <p className="text-gray-500">
                            We sent a verification code to <span className="font-medium text-black">{email}</span>
                        </p>
                        <p className="text-sm text-gray-500">
                            Enter the 4-digit code sent to your email to reset your password.
                        </p>

                        <Button
                            className="w-full bg-black hover:bg-gray-800 h-11"
                            onClick={() => window.location.href = `/verify?email=${encodeURIComponent(email)}&mode=reset`}
                        >
                            Enter Code
                        </Button>

                        <button onClick={() => setIsSubmitted(false)} className="text-sm text-gray-500 hover:text-black flex items-center justify-center w-full gap-2">
                            <ArrowLeft className="w-4 h-4" /> Back to email
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-white dark:bg-gray-950 relative">
            {/* Logo top-left of the screen */}
            <div className="absolute top-8 left-8 flex items-center gap-2 font-bold text-xl z-10">
                <img src="/Dot.png" alt="Logo" className="h-8 w-8" />
                <span>JNARD System</span>
            </div>

            {/* Image Section */}
            <div className="hidden lg:flex w-1/2 items-center justify-center p-12  dark:bg-gray-900">
                <img
                    src="/Forget.jpeg"
                    alt="Forgot Password Visual"
                    className="w-full max-w-md object-contain"
                />
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-left">
                        {/* Logo removed from here */}
                        <h2 className="text-3xl font-bold tracking-tight mt-8">Forgot password?</h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Enter your email address and we'll send you a code to reset your password.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-11"
                            />
                        </div>
                        <Button type="submit" className="w-full bg-black hover:bg-gray-800 h-11" isLoading={isLoading}>
                            Send Code
                        </Button>
                    </form>

                    <div className="text-center border-t pt-6">
                        <Link href="/login" className="flex items-center justify-center text-sm text-gray-500 hover:text-black font-medium transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
