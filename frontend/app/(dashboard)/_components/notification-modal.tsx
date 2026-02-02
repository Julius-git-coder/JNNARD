'use client';

import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Notification } from '@/hooks/useNotifications';
import { cn } from '@/lib/utils';
import { Bell, Check, UserPlus, FileText, AlertCircle, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface NotificationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    notifications: Notification[];
    unreadCount: number;
    onMarkAsRead: (id: string) => void;
    onMarkAllAsRead: () => void;
}

export function NotificationModal({
    open,
    onOpenChange,
    notifications,
    unreadCount,
    onMarkAsRead,
    onMarkAllAsRead
}: NotificationModalProps) {
    const router = useRouter();

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.isRead) {
            onMarkAsRead(notification._id);
        }

        if (notification.link) {
            router.push(notification.link);
            onOpenChange(false);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'WORKER_SIGNUP':
                return <UserPlus className="h-4 w-4 text-blue-500" />;
            case 'TASK_ASSIGNED':
                return <FileText className="h-4 w-4 text-purple-500" />;
            case 'REPORT_SUBMITTED':
                return <Check className="h-4 w-4 text-green-500" />;
            default:
                return <Bell className="h-4 w-4 text-gray-500" />;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-2 border-b">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-xl flex items-center gap-2">
                            Notifications
                            {unreadCount > 0 && (
                                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">
                                    {unreadCount} New
                                </span>
                            )}
                        </DialogTitle>
                        {unreadCount > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onMarkAllAsRead}
                                className="text-xs h-8 text-blue-600 hover:text-blue-700"
                            >
                                Mark all as read
                            </Button>
                        )}
                    </div>
                </DialogHeader>

                <div className="max-h-[60vh] overflow-y-auto">
                    {notifications.length > 0 ? (
                        <div className="divide-y dark:divide-gray-800">
                            {notifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    className={cn(
                                        "p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer group relative",
                                        !notification.isRead && "bg-blue-50/50 dark:bg-blue-900/10"
                                    )}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="flex gap-3">
                                        <div className="mt-1 flex-shrink-0 p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-800">
                                            {getIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p className={cn(
                                                "text-sm leading-tight",
                                                !notification.isRead ? "font-bold text-gray-900 dark:text-gray-50" : "font-medium text-gray-600 dark:text-gray-400"
                                            )}>
                                                {notification.title}
                                            </p>
                                            <p className="text-xs text-gray-500 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <div className="flex items-center gap-1.5 pt-1">
                                                <Clock className="h-3 w-3 text-gray-400" />
                                                <span className="text-[10px] text-gray-400">
                                                    {new Date(notification.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                        {!notification.isRead && (
                                            <div className="h-2 w-2 rounded-full bg-blue-600 mt-2 shrink-0 shadow-[0_0_8px_rgba(37,99,235,0.5)]" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                            <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                                <Bell className="h-6 w-6 text-gray-400" />
                            </div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-50">All caught up!</p>
                            <p className="text-xs text-gray-500 mt-1">You don't have any new notifications at the moment.</p>
                        </div>
                    )}
                </div>

                <DialogFooter className="p-4 bg-gray-50 dark:bg-gray-900/50 border-t">
                    <Button
                        variant="secondary"
                        className="w-full text-xs h-9"
                        onClick={() => onOpenChange(false)}
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
