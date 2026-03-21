import AuditLog from '../models/AuditLog.js';

/**
 * Log a system action for security auditing.
 */
export const logAction = async ({ user, action, resource, resourceId, status, ipAddress, details }) => {
    try {
        await AuditLog.create({
            user,
            action,
            resource,
            resourceId,
            status,
            ipAddress,
            details,
        });
    } catch (error) {
        console.error('[Audit Log Error]:', error.message);
        // We don't throw here to avoid breaking the main request flow
    }
};

export default logAction;
