'use client';

import { Button } from '@/components/ui/button';
import { ProjectCard } from './_components/project-card';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useProjects } from './useProjects';

import { CreateProjectDialog } from './_components/create-project-dialog';

export default function ProjectsPage() {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const {
        isLoading,
        projects,
        currentPage,
        setCurrentPage,
        totalPages,
        hasProjects,
        refreshProjects
    } = useProjects();

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50 self-start sm:self-center">Projects</h1>
                <Button
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                    onClick={() => setIsCreateDialogOpen(true)}
                    tooltip="Create new project"
                >
                    <Plus className="mr-2 h-4 w-4" /> Create
                </Button>
            </div>

            <CreateProjectDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                onSuccess={refreshProjects}
            />

            {/* LOADING STATE */}
            {isLoading && <ProjectsLoadingGrid />}

            {/* EMPTY STATE */}
            {!isLoading && !hasProjects && (
                <EmptyState
                    title="No projects found"
                    description="Get started by creating your first project."
                    actionLabel="Create Project"
                    onAction={() => setIsCreateDialogOpen(true)}
                />
            )}

            {/* PROJECTS LIST */}
            {!isLoading && hasProjects && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <ProjectCard
                                key={project._id}
                                id={project._id}
                                title={project.title}
                                status={project.status}
                                description={project.description}
                                endDate={project.endDate}
                                issues={project.issues}
                                members={project.members}
                                attachments={project.attachments}
                                onUpdate={refreshProjects}
                            />
                        ))}
                    </div>

                    {/* PAGINATION */}
                    <div className="flex items-center justify-center space-x-2 pt-6">
                        <Button
                            variant="ghost"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(c => c - 1)}
                            className="text-gray-500"
                            tooltip="Go to previous page"
                        >
                            Previous
                        </Button>
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <Button
                                key={i}
                                variant={currentPage === i + 1 ? 'default' : 'secondary'}
                                size="icon"
                                className={currentPage === i + 1 ? "bg-blue-900 text-white hover:bg-blue-800" : "bg-gray-200 text-gray-900 hover:bg-gray-300"}
                                onClick={() => setCurrentPage(i + 1)}
                                tooltip={`Go to page ${i + 1}`}
                            >
                                {i + 1}
                            </Button>
                        ))}
                        <Button
                            variant="ghost"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(c => c + 1)}
                            className="text-gray-500"
                            tooltip="Go to next page"
                        >
                            Next
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}

function ProjectsLoadingGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-[300px] border rounded-lg p-6 space-y-4">
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-24 w-full" />
                    <div className="flex justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-10" />
                    </div>
                </div>
            ))}
        </div>
    )
}
