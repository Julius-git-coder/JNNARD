'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Edit2, FileText } from 'lucide-react';
// Link import removed

interface ProjectMember {
    id: string;
    name: string;
    avatar: string;
}

interface ProjectCardProps {
    id: string;
    title: string;
    status: 'Completed' | 'On Hold' | 'Pending' | 'Offtrack' | 'Active'; // 'Offtrack' from reference
    description: string;
    dueDate: string;
    issueCount: number;
    members: ProjectMember[];
}

export const ProjectCard = ({
    title,
    status,
    description,
    dueDate,
    issueCount,
    members,
}: ProjectCardProps) => {

    const statusVariant =
        status === 'Completed' ? 'completed' :
            status === 'On Hold' ? 'onhold' :
                status === 'Offtrack' ? 'destructive' : // Red badge for Offtrack
                    'secondary';

    // Truncate description
    const truncatedDescription = description.length > 120 ? description.substring(0, 120) + '...' : description;

    return (
        <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg">{title}</h3>
                    <button className="text-gray-400 hover:text-gray-600">
                        <Edit2 className="h-4 w-4" />
                    </button>
                </div>
                <Badge variant={statusVariant} className={status === 'Offtrack' ? 'bg-red-100 text-red-600 hover:bg-red-200' : ''}>
                    {status}
                </Badge>
            </CardHeader>

            <CardContent className="flex-1 pb-4">
                <p className="text-sm text-gray-500 leading-relaxed dark:text-gray-400">
                    {truncatedDescription}
                </p>
            </CardContent>

            <CardFooter className="flex flex-col gap-4 pt-0">
                <div className="w-full h-px bg-gray-100 dark:bg-gray-800" />

                <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-red-500 uppercase tracking-wide">
                        <span className="text-lg">🏆</span> {dueDate}
                    </div>

                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <FileText className="h-4 w-4" />
                        <span>{issueCount} issues</span>
                    </div>
                </div>

                <div className="flex w-full items-center justify-start -space-x-2 overflow-hidden py-1">
                    {members.slice(0, 4).map((member) => (
                        <Avatar key={member.id} className="h-8 w-8 border-2 border-white dark:border-gray-900">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.name[0]}</AvatarFallback>
                        </Avatar>
                    ))}
                    {members.length > 4 && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-red-100 text-xs font-medium text-red-600 dark:border-gray-900">
                            +{members.length - 4}
                        </div>
                    )}
                </div>
            </CardFooter>
        </Card>
    );
}
