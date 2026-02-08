'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { OTPInput } from '../_components/otp-input';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { handleError, handleSuccess } from '@/lib/error-handler';

function VerifyContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || 'your email';
    const mode = searchParams.get('mode') || 'signup'; // 'signup' or 'reset'

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleComplete = async (otp: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const endpoint = mode === 'reset' ? '/auth/validate-otp' : '/auth/verify-email';
            const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api';
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Verification failed');
            }

            // Save authentication data
            if (result.accessToken) {
                localStorage.setItem('accessToken', result.accessToken);
                if (result.refreshToken) localStorage.setItem('refreshToken', result.refreshToken);
                localStorage.setItem('user', JSON.stringify({
                    name: result.name,
                    email: result.email,
                    avatar: result.avatar,
                    role: result.role,
                    workerProfile: result.workerProfile
                }));
            }

            if (mode === 'reset') {
                window.location.href = `/reset-password?email=${encodeURIComponent(email)}&otp=${otp}`;
            } else {
                // Redirect based on role
                if (result.role === 'worker') {
                    window.location.href = '/worker/dashboard';
                } else {
                    window.location.href = '/dashboard';
                }
            }

        } catch (err: any) {
            handleError(err, 'Verification failed. Please try again.');
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md shadow-lg border-gray-200 dark:border-gray-800">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
                <CardDescription>
                    Enter the 4-digit code sent to <span className="font-medium text-gray-900 dark:text-gray-100">{email}</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex justify-center py-4">
                    <OTPInput length={4} onComplete={handleComplete} />
                </div>

                {isLoading && (
                    <div className="flex justify-center text-sm text-blue-600 animate-pulse">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...
                    </div>
                )}

                {error && (
                    <div className="text-center text-sm text-red-500 font-medium">
                        {error}
                    </div>
                )}

                <p className="text-center text-sm text-gray-500">
                    Didn&apos;t receive the code?{" "}
                    <button className="text-blue-600 font-semibold hover:underline">
                        Click to resend
                    </button>
                </p>
            </CardContent>
            <CardFooter className="justify-center border-t p-4">
                <Link href={mode === 'reset' ? "/forgot-password" : "/signup"} className="flex items-center text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Link>
            </CardFooter>
        </Card>
    );
}

export default function VerifyPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <Suspense fallback={<div>Loading...</div>}>
                <VerifyContent />
            </Suspense>
        </div>
    );
}
