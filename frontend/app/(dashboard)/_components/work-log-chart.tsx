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
    { name: 'Product 1', value: 35, color: '#ef4444' }, // Red
    { name: 'Product 2', value: 25, color: '#3b82f6' }, // Blue
    { name: 'Product 4', value: 20, color: '#fbbf24' }, // Yellow
    { name: 'Product 5', value: 20, color: '#84cc16' }, // Green
];

interface WorkLogChartProps {
    isLoading?: boolean;
}

export function WorkLogChart({ isLoading }: WorkLogChartProps) {
    if (isLoading) {
        return <Skeleton className="w-full h-[350px] rounded-xl" />;
    }

    return (
        <Card className="h-full border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-bold">Work Log</CardTitle>
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
                                innerRadius={60}
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
                </div>

                <div className="space-y-3">
                    {data.map((item) => (
                        <div key={item.name} className="flex items-center gap-3 text-sm">
                            <span className="block w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                            <span className="text-gray-600 dark:text-gray-400 font-medium">{item.name}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
