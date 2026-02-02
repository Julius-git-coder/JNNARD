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

import { useProjects } from '@/app/(dashboard)/projects/useProjects';

export function ProjectStatsChart({ isLoading: parentLoading }: { isLoading?: boolean }) {
    const { allProjects, isLoading: projectsLoading } = useProjects();
    const isLoading = parentLoading || projectsLoading;

    if (isLoading) {
        return (
            <Card className="h-full border-none shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="flex justify-center py-8">
                    <Skeleton className="h-[200px] w-[200px] rounded-full" />
                </CardContent>
            </Card>
        );
    }

    const stats = {
        'Completed': allProjects.filter(p => p.status === 'Completed').length,
        'On Hold': allProjects.filter(p => p.status === 'On Hold').length,
        'Active': allProjects.filter(p => p.status === 'Active').length,
        'Pending': allProjects.filter(p => p.status === 'Pending').length,
        'Offtrack': allProjects.filter(p => p.status === 'Offtrack').length,
    };

    const total = allProjects.length || 1;
    const data = [
        { name: 'Completed', value: stats['Completed'], percentage: Math.round((stats['Completed'] / total) * 100), color: '#14b8a6' },
        { name: 'On Hold', value: stats['On Hold'], percentage: Math.round((stats['On Hold'] / total) * 100), color: '#6366f1' },
        { name: 'Active', value: stats['Active'], percentage: Math.round((stats['Active'] / total) * 100), color: '#3b82f6' },
        { name: 'Pending', value: stats['Pending'], percentage: Math.round((stats['Pending'] / total) * 100), color: '#ef4444' },
        { name: 'Offtrack', value: stats['Offtrack'], percentage: Math.round((stats['Offtrack'] / total) * 100), color: '#f97316' },
    ].filter(item => item.value > 0);

    return (
        <Card className="h-full border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-bold">Project Stats</CardTitle>
                <Badge variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-100">All Projects</Badge>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-8">
                <div className="h-[200px] w-[200px] shrink-0 relative flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data.length > 0 ? data : [{ name: 'None', value: 1, color: '#f3f4f6' }]}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={85}
                                paddingAngle={5}
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

                <div className="flex-1 w-full space-y-4">
                    {data.map((item) => (
                        <div key={item.name} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <span className="block w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }}></span>
                                <span className="text-gray-600 dark:text-gray-400 font-medium">{item.name}</span>
                            </div>
                            <span className="font-semibold">{item.percentage}%</span>
                        </div>
                    ))}
                    {data.length === 0 && (
                        <div className="text-center py-4">
                            <p className="text-xs text-gray-400 italic">No projects found</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
