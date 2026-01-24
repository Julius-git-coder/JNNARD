'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface OTPInputProps {
    length?: number;
    onComplete: (otp: string) => void;
}

export function OTPInput({ length = 4, onComplete }: OTPInputProps) {
    const [otp, setOTP] = useState<string[]>(new Array(length).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (index: number, value: string) => {
        if (isNaN(Number(value))) return;

        const newOTP = [...otp];
        // Allow only last entered character
        newOTP[index] = value.substring(value.length - 1);
        setOTP(newOTP);

        // Notify parent if complete
        const combinedOTP = newOTP.join('');
        if (combinedOTP.length === length) {
            onComplete(combinedOTP);
        }

        // Move to next input if value is entered
        if (value && index < length - 1 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
            // Move to previous input on backspace if current is empty
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <div className="flex gap-4 justify-center">
            {otp.map((digit, index) => (
                <Input
                    key={index}
                    ref={(el) => { if (el) inputRefs.current[index] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={cn(
                        "w-12 h-14 text-center text-2xl font-bold rounded-lg border-2 ring-offset-background",
                        "focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition-all duration-200",
                        digit ? "border-blue-600 bg-blue-50/10" : "border-gray-200 dark:border-gray-800 bg-transparent"
                    )}
                />
            ))}
        </div>
    );
}
