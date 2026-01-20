'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

const data = [
    { name: 'Oct 2021', achieved: 2.5, target: 4 },
    { name: 'Nov 2021', achieved: 4, target: 4 },
    { name: 'Dec 2021', achieved: 3, target: 4 },
    { name: 'Jan 2022', achieved: 4, target: 3 },
    { name: 'Feb 2022', achieved: 3.5, target: 4 },
];

interface PerformanceChartProps {
    isLoading?: boolean;
}

export function PerformanceChart({ isLoading }: PerformanceChartProps) {
    if (isLoading) {
        return (
            <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-20" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[250px] w-full" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-8">
                <CardTitle className="text-lg font-bold text-gray-800 dark:text-gray-100">Performance</CardTitle>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="block w-2.5 h-2.5 rounded-full bg-orange-400"></span> Achieved
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="block w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Target
                    </div>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-100">This Week ▼</Badge>
                </div>
            </CardHeader>
            <CardContent className="h-[300px] w-full pl-0">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#f0f0f0" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#9ca3af' }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#9ca3af' }}
                            domain={[0, 8]}
                            dx={-10}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="achieved"
                            stroke="#fb923c"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="target"
                            stroke="#6366f1"
                            strokeWidth={3}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
