import { useState, useEffect, useCallback } from 'react';
import { notificationApi } from '@/lib/api';
import { handleError } from '@/lib/error-handler';

export interface Notification {
    _id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
    link?: string;
}

export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const fetchNotifications = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await notificationApi.getAll();
            setNotifications(response.data.notifications);
            setUnreadCount(response.data.unreadCount);
        } catch (error: any) {
            // Silently ignore 401 errors (user not authenticated)
            // This is expected when session expires
            if (error?.response?.status !== 401) {
                console.error('Failed to fetch notifications:', error);
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await notificationApi.markAsRead(id);
            setNotifications(prev =>
                prev.map(n => n._id === id ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            handleError(error, 'Failed to mark notification as read');
        }
    };

    const markAllAsRead = async () => {
        try {
            await notificationApi.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            handleError(error, 'Failed to mark all notifications as read');
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll for new notifications every 15 seconds
        const interval = setInterval(fetchNotifications, 15000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    return {
        notifications,
        unreadCount,
        isLoading,
        fetchNotifications,
        markAsRead,
        markAllAsRead
    };
}
