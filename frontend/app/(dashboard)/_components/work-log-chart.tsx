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

const COLORS = ['#ef4444', '#3b82f6', '#fbbf24', '#84cc16', '#a855f7', '#06b6d4'];

export function WorkLogChart({ isLoading: parentLoading }: { isLoading?: boolean }) {
    const { tasks, isLoading: tasksLoading } = useTasks();
    const isLoading = parentLoading || tasksLoading;

    if (isLoading) {
        return <Skeleton className="w-full h-[350px] rounded-xl" />;
    }

    // Calculate task distribution per project
    const projectDistribution = tasks.reduce((acc: any, task) => {
        const projectName = task.project?.title || 'Unknown';
        acc[projectName] = (acc[projectName] || 0) + 1;
        return acc;
    }, {});

    const data = Object.keys(projectDistribution).map((name, index) => ({
        name,
        value: projectDistribution[name],
        color: COLORS[index % COLORS.length]
    }));

    return (
        <Card className="h-full border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-bold">Work Distribution</CardTitle>
                <Badge variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-100">By Project</Badge>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-4">
                <div className="h-[250px] w-[250px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data.length > 0 ? data : [{ name: 'No Tasks', value: 1, color: '#f3f4f6' }]}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={85}
                                paddingAngle={2}
                                dataKey="value"
                                stroke="none"
                            >
                                {(data.length > 0 ? data : [{ color: '#f3f4f6' }]).map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="space-y-3 max-h-[250px] overflow-y-auto">
                    {data.map((item) => (
                        <div key={item.name} className="flex items-center gap-3 text-sm">
                            <span className="block w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                            <span className="text-gray-600 dark:text-gray-400 font-medium truncate w-24" title={item.name}>{item.name}</span>
                            <span className="font-semibold">{item.value} tasks</span>
                        </div>
                    ))}
                    {data.length === 0 && <p className="text-xs text-gray-500 italic">Assign tasks to see distribution</p>}
                </div>
            </CardContent>
        </Card>
    );
}

