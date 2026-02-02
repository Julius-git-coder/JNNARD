import Notification from '../models/Notification.js';
import sendError from '../utils/errorResponse.js';

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .sort({ createdAt: -1 })
            .limit(20);

        const unreadCount = await Notification.countDocuments({
            recipient: req.user._id,
            isRead: false
        });

        res.json({
            success: true,
            notifications,
            unreadCount
        });
    } catch (error) {
        sendError(res, 500, 'Failed to fetch notifications', error);
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return sendError(res, 404, 'Notification not found');
        }

        if (notification.recipient.toString() !== req.user._id.toString()) {
            return sendError(res, 403, 'Unauthorized');
        }

        notification.isRead = true;
        await notification.save();

        res.json({
            success: true,
            message: 'Notification marked as read'
        });
    } catch (error) {
        sendError(res, 500, 'Failed to update notification', error);
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user._id, isRead: false },
            { isRead: true }
        );

        res.json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (error) {
        sendError(res, 500, 'Failed to update notifications', error);
    }
};

// Helper function to create notification (not an exported route)
export const createNotification = async ({ recipient, sender, type, title, message, link }) => {
    try {
        await Notification.create({
            recipient,
            sender,
            type,
            title,
            message,
            link
        });
    } catch (error) {
        console.error('Error creating notification:', error);
    }
};
