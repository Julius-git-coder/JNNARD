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
import { useTasks } from '@/hooks/useTasks';

export function TasksChart({ isLoading: parentLoading }: { isLoading?: boolean }) {
    const { tasks, isLoading: tasksLoading } = useTasks();
    const isLoading = parentLoading || tasksLoading;

    if (isLoading) {
        return <Skeleton className="w-full h-[350px] rounded-xl" />;
    }

    const stats = {
        'Done': tasks.filter(t => t.status === 'Done').length,
        'In Progress': tasks.filter(t => t.status === 'In Progress').length,
        'To Do': tasks.filter(t => t.status === 'To Do').length,
        'Blocked': tasks.filter(t => t.status === 'Blocked').length,
    };

    const total = tasks.length || 1;
    const data = [
        { name: 'Completed', value: Math.round((stats['Done'] / total) * 100), color: '#14b8a6' },
        { name: 'In Progress', value: Math.round((stats['In Progress'] / total) * 100), color: '#3b82f6' },
        { name: 'To Do', value: Math.round((stats['To Do'] / total) * 100), color: '#6366f1' },
        { name: 'Blocked', value: Math.round((stats['Blocked'] / total) * 100), color: '#ef4444' },
    ].filter(item => item.value > 0);

    return (
        <Card className="h-full border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-bold">Tasks</CardTitle>
                <Badge variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-100">All Time</Badge>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4">
                <div className="h-[250px] w-[250px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data.length > 0 ? data : [{ name: 'None', value: 100, color: '#e5e7eb' }]}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {(data.length > 0 ? data : [{ color: '#e5e7eb' }]).map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-2xl font-bold">{tasks.length}</span>
                        <span className="text-[10px] text-gray-400 uppercase">Total</span>
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
                    {data.length === 0 && <p className="text-xs text-gray-500 italic">No tasks created</p>}
                </div>
            </CardContent>
        </Card>
    );
}

