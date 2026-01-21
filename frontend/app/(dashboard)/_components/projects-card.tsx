'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Folder } from 'lucide-react';

interface ProjectsCardProps {
    isLoading?: boolean;
}

export function ProjectsCard({ isLoading }: ProjectsCardProps) {
    if (isLoading) {
        return <Skeleton className="w-full h-[350px] rounded-xl" />;
    }

    return (
        <Card className="h-full border-none shadow-sm overflow-hidden relative">
            <CardHeader className="flex flex-row items-center justify-between pb-2 z-10 relative">
                <CardTitle className="text-lg font-bold">Projects</CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Folder className="w-4 h-4" />
                    <span>52 files</span>
                </div>
            </CardHeader>
            <CardContent className="p-0 relative h-[300px] bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
                {/* Visual Mockup - CSS implementation of the overlapping phone cards */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {/* Left Phone (Back) */}
                    <div className="absolute left-12 top-12 w-40 h-72 bg-white rounded-3xl shadow-lg transform -rotate-6 border border-gray-100 overflow-hidden opacity-80 scale-90">
                        <div className="h-full w-full bg-gray-50 p-2">
                            <div className="h-3 w-20 bg-gray-200 rounded mb-2 mx-auto"></div>
                            <div className="flex gap-1 mb-2">
                                <div className="h-2 w-8 bg-gray-200 rounded"></div>
                                <div className="h-2 w-8 bg-gray-200 rounded"></div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="h-20 bg-green-100 rounded-xl"></div>
                                <div className="h-20 bg-green-100 rounded-xl"></div>
                            </div>
                        </div>
                    </div>

                    {/* Right Phone (Back) */}
                    <div className="absolute right-12 top-12 w-40 h-72 bg-white rounded-3xl shadow-lg transform rotate-6 border border-gray-100 overflow-hidden opacity-80 scale-90">
                        <img src="https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=500&q=80" className="w-full h-full object-cover" alt="Plant" />
                    </div>

                    {/* Center Phone (Front) */}
                    <div className="absolute w-44 h-80 bg-white rounded-[2rem] shadow-2xl z-20 border-4 border-white overflow-hidden">
                        <div className="h-full w-full relative">
                            {/* Header image */}
                            <img src="https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=500&q=80" className="w-full h-32 object-cover" alt="Poppy" />
                            {/* App Content */}
                            <div className="p-4">
                                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Papaveraceae</span>
                                <h3 className="font-bold text-gray-800 text-lg leading-tight">Papaver Somniferum</h3>
                                <p className="text-[10px] text-gray-500 mt-1 line-clamp-3">
                                    Papaver somniferum, commonly known as the opium poppy or breadseed poppy, is a species of flowering plant...
                                </p>
                                <div className="mt-4 flex justify-between items-end">
                                    <div className="flex gap-2">
                                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs">💧</div>
                                        <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs">☀️</div>
                                    </div>
                                    <button className="bg-green-600 text-white text-xs px-3 py-1.5 rounded-full font-medium">Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
