import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false, // System actions or pre-login attempts
        },
        action: {
            type: String,
            required: true,
        },
        resource: {
            type: String,
            required: true,
        },
        resourceId: {
            type: String,
        },
        status: {
            type: String,
            enum: ['success', 'failure'],
            default: 'success',
        },
        ipAddress: {
            type: String,
        },
        details: {
            type: Object,
        },
    },
    {
        timestamps: true,
    }
);

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;
