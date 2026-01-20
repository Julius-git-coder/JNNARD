'use client';

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

const data = [
    { name: 'Completed', value: 32, color: '#14b8a6' }, // Teal
    { name: 'On Hold', value: 25, color: '#6366f1' },   // Indigo
    { name: 'On Progress', value: 25, color: '#3b82f6' }, // Blue
    { name: 'Pending', value: 18, color: '#ef4444' },     // Red
];

interface ProjectStatsChartProps {
    isLoading?: boolean;
}

export function ProjectStatsChart({ isLoading }: ProjectStatsChartProps) {
    if (isLoading) {
        return (
            <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-20" />
                </CardHeader>
                <CardContent className="flex justify-center">
                    <Skeleton className="h-[200px] w-[200px] rounded-full" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-8">
                <CardTitle className="text-lg font-bold text-gray-800 dark:text-gray-100">Projects Stats</CardTitle>
                <Badge variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-100">This Week ▼</Badge>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-8">
                <div className="h-[200px] w-[200px] shrink-0 relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={0}
                                outerRadius={100}
                                paddingAngle={0}
                                dataKey="value"
                                stroke="none"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Custom Labels on Chart like reference - Doing simple absolute position for now or relying on Recharts labels if needed. Reference has labels inside slices. */}
                    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-white font-bold text-xs">
                        {/* Manual overlaying labels is tricky without SVG coords. Recharts handles this but for speed I'll skip pixel perfect inner labels unless requested. */}
                    </div>
                </div>

                <div className="flex-1 w-full space-y-4">
                    {data.map((item) => (
                        <div key={item.name} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <span className="block w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }}></span>
                                <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                            </div>
                            <span className="font-semibold text-gray-900 dark:text-gray-100">{item.value}%</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
