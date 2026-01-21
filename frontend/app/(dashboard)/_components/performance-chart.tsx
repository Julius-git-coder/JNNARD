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
import { usePerformance } from '@/hooks/usePerformance';
import { format } from 'date-fns';

export function PerformanceChart({ isLoading: parentLoading }: { isLoading?: boolean }) {
    const { records, isLoading: perfLoading } = usePerformance();
    const isLoading = parentLoading || perfLoading;

    if (isLoading) {
        return <Skeleton className="w-full h-[350px] rounded-xl" />;
    }

    // Group and average performance by date for the chart
    const chartData = records.reduce((acc: any[], curr) => {
        const date = format(new Date(curr.evaluationDate), 'MMM d');
        const existing = acc.find(item => item.name === date);
        if (existing) {
            existing.achieved = (existing.achieved + curr.actual) / 2;
            existing.target = (existing.target + curr.target) / 2;
        } else {
            acc.push({ name: date, achieved: curr.actual, target: curr.target });
        }
        return acc;
    }, []).sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime()).slice(-7);

    return (
        <Card className="h-full border-none shadow-sm flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-8">
                <CardTitle className="text-lg font-bold">Performance Trends</CardTitle>
                <Badge variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-100">Last 7 Records</Badge>
            </CardHeader>
            <CardContent className="flex-1 w-full pl-0 flex flex-col">
                <div className="flex items-center justify-end gap-4 mb-4 pr-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="block w-2.5 h-2.5 rounded-full bg-orange-400"></span> Actual %
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="block w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Target %
                    </div>
                </div>

                <div className="flex-1 w-full min-h-0">

                    <ResponsiveContainer width="100%" height="100%">
                        {chartData.length > 0 ? (
                            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                                    domain={[0, 100]}
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
                                    dot={{ r: 4, fill: '#fb923c', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="target"
                                    stroke="#6366f1"
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    dot={false}
                                />
                            </LineChart>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 italic">
                                No performance data recorded yet.
                            </div>
                        )}
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

