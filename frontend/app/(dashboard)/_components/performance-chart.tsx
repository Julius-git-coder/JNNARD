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
    { name: 'Oct 2021', achieved: 4.8, target: 2.8 },
    { name: 'Nov 2021', achieved: 6.2, target: 2.2 },
    { name: 'Dec 2021', achieved: 6.0, target: 4.8 },
    { name: 'Jan 2022', achieved: 4.2, target: 4.5 }, // Dip
    { name: 'Jan 2022', achieved: 6.8, target: 4.6 }, // Peak
    { name: 'Feb 2022', achieved: 5.0, target: 5.8 },
    { name: 'Mar 2022', achieved: 6.2, target: 4.0 },
    { name: 'Mar 2022', achieved: 5.2, target: 4.5 },
];

interface PerformanceChartProps {
    isLoading?: boolean;
}

export function PerformanceChart({ isLoading }: PerformanceChartProps) {
    if (isLoading) {
        return <Skeleton className="w-full h-[350px] rounded-xl" />;
    }

    return (
        <Card className="h-full border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-8">
                <CardTitle className="text-lg font-bold">Performance</CardTitle>
                <Badge variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-100">This Week ▼</Badge>
            </CardHeader>
            <CardContent className="h-[300px] w-full pl-0 relative">
                {/* Legend */}
                <div className="absolute right-0 top-[-60px] flex gap-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="block w-2.5 h-2.5 rounded-full bg-orange-400"></span> Achieved
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="block w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Target
                    </div>
                </div>

                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#9ca3af' }}
                            dy={10}
                            interval={1}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#9ca3af' }}
                            domain={[0, 12]}
                            ticks={[0, 2, 4, 6, 8, 10, 12]}
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
                            isAnimationActive={true}
                        />
                        <Line
                            type="monotone"
                            dataKey="target"
                            stroke="#6366f1"
                            strokeWidth={3}
                            dot={false}
                            isAnimationActive={true}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
