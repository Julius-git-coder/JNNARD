'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Paperclip, X, Download, Loader2, Plus } from 'lucide-react';
import { uploadApi, projectApi } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

interface Attachment {
    name: string;
    url: string;
    fileType: string;
    uploadedBy: string;
    uploadedAt: string;
}

interface AttachmentManagerProps {
    projectId: string;
    initialAttachments: Attachment[];
    onUpdate: () => void;
}

export function AttachmentManager({ projectId, initialAttachments, onUpdate }: AttachmentManagerProps) {
    const [isUploading, setIsUploading] = useState(false);
    const { toast } = useToast();

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            // 1. Upload to Cloudinary via backend
            const uploadRes = await uploadApi.uploadFile(file);
            const { url, resource_type } = uploadRes.data;

            // 2. Update project attachments
            const newAttachment = {
                name: file.name,
                url: url,
                fileType: resource_type,
            };

            await projectApi.update(projectId, {
                attachments: [...initialAttachments, newAttachment]
            });

            toast({
                title: "File uploaded",
                description: `${file.name} has been attached to the project.`,
            });
            onUpdate();
        } catch (error) {
            console.error("Upload failed:", error);
            toast({
                title: "Upload failed",
                description: "There was an error uploading your file.",
                variant: "destructive"
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handleDownload = async (url: string, filename: string, idx: number) => {
        try {
            setDownloadingIdx(idx);
            const response = await fetch(url);
            if (!response.ok) throw new Error('Download failed');

            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Download failed:", error);
            toast({
                title: "Download failed",
                description: "Could not download the file. Please try again.",
                variant: "destructive"
            });
        } finally {
            setDownloadingIdx(null);
        }
    };

    const handleRemove = async (index: number) => {
        try {
            const updatedAttachments = [...initialAttachments];
            updatedAttachments.splice(index, 1);

            await projectApi.update(projectId, {
                attachments: updatedAttachments
            });

            onUpdate();
        } catch (error) {
            console.error("Failed to remove attachment:", error);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Attachments ({initialAttachments.length})</h3>
                <div className="relative">
                    <input
                        type="file"
                        id={`file-upload-${projectId}`}
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                    />
                    <label htmlFor={`file-upload-${projectId}`} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-gray-200 bg-white hover:bg-gray-100 h-8 px-2 cursor-pointer dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800">
                        {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                        Add File
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
                {initialAttachments.map((file, idx) => {
                    const isDownloading = downloadingIdx === idx;

                    return (
                        <div
                            key={idx}
                            className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-sm"
                        >
                            <div className="flex items-center gap-2 overflow-hidden">
                                <Paperclip className="h-4 w-4 text-gray-400 shrink-0" />
                                <span className="truncate" title={file.name}>{file.name}</span>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                                    onClick={() => handleDownload(file.url, file.name)}
                                >
                                    <Download className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleRemove(idx)}
                                >
                                    <X className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                    );
                })}
                {initialAttachments.length === 0 && (
                    <p className="text-xs text-center py-4 text-gray-500 italic">No attachments yet.</p>
                )}
            </div>
        </div>
    );
}
