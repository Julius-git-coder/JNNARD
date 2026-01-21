'use client';

import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const data = [
    { name: 'Completed', value: 32, color: '#14b8a6' }, // Teal
    { name: 'On Hold', value: 25, color: '#6366f1' },   // Indigo
    { name: 'On Progress', value: 25, color: '#3b82f6' }, // Blue
    { name: 'Pending', value: 18, color: '#ef4444' },     // Red
];

interface TasksChartProps {
    isLoading?: boolean;
}

export function TasksChart({ isLoading }: TasksChartProps) {
    if (isLoading) {
        return <Skeleton className="w-full h-[350px] rounded-xl" />;
    }

    return (
        <Card className="h-full border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-bold">Tasks</CardTitle>
                <Badge variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-100">This Week ▼</Badge>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-4">
                <div className="h-[250px] w-[250px] relative">
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
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center text-white font-bold">
                            {/* Labels are handled by legend/side list for cleaner look */}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {data.map((item) => (
                        <div key={item.name} className="flex items-center gap-3 text-sm">
                            <span className="block w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }}></span>
                            <span className="text-gray-600 dark:text-gray-400 font-medium w-24">{item.name}</span>
                            <span className="font-semibold">{item.value}%</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
