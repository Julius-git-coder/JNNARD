'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { AlertCircle, ArrowLeft, Mail } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

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

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
                <Card className="w-full max-w-md shadow-lg border-gray-200 dark:border-gray-800">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                            <Mail className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <CardTitle className="text-2xl">Check your email</CardTitle>
                        <CardDescription>
                            We sent a verification code to <span className="font-medium text-gray-900 dark:text-gray-100">{email}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-center text-gray-500">
                            Enter the 4-digit code sent to your email to reset your password.
                        </p>
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            onClick={() => window.location.href = `/verify?email=${encodeURIComponent(email)}&mode=reset`}
                        >
                            Enter Code
                        </Button>
                    </CardContent>
                    <CardFooter className="justify-center">
                        <Button variant="link" onClick={() => setIsSubmitted(false)} className="text-sm text-gray-500">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to email
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <Card className="w-full max-w-md shadow-lg border-gray-200 dark:border-gray-800">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Forgot password?</CardTitle>
                    <CardDescription>
                        Enter your email address and we'll send you a code to reset your password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" isLoading={isLoading}>
                            Send Code
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center border-t p-4 mt-2">
                    <Link href="/login" className="flex items-center text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 font-medium transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
