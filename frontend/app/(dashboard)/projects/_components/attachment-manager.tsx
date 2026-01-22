'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Paperclip, X, Download, Loader2, Plus } from 'lucide-react';
import { uploadApi, projectApi } from '@/lib/api';
import { handleError, handleSuccess } from '@/lib/error-handler';
import { downloadFile } from '@/lib/utils';

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

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            // 1. Upload to Cloudinary via backend
            const uploadRes = await uploadApi.uploadFile(file);
            const { url, public_id, resource_type } = uploadRes.data;

            // 2. Update project attachments
            const newAttachment = {
                name: file.name,
                url: url,
                fileType: resource_type,
            };

            await projectApi.update(projectId, {
                attachments: [...initialAttachments, newAttachment]
            });

            handleSuccess(`${file.name} has been attached to the project.`);
            onUpdate();
        } catch (error) {
            handleError(error, "There was an error uploading your file.");
        } finally {
            setIsUploading(false);
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
            handleError(error, "Failed to remove attachment.");
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
                {initialAttachments.map((file, idx) => (
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
                                onClick={async () => {
                                    try {
                                        await downloadFile(file.url, file.name);
                                    } catch (error) {
                                        handleError(error, "Failed to start download.");
                                    }
                                }}
                                tooltip="Download"
                            >
                                <Download className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleRemove(idx)}
                                tooltip="Remove Attachment"
                            >
                                <X className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                    </div>
                ))}
                {initialAttachments.length === 0 && (
                    <p className="text-xs text-center py-4 text-gray-500 italic">No attachments yet.</p>
                )}
            </div>
        </div>
    );
}
