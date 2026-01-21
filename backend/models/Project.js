import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['Active', 'Pending', 'On Hold', 'Completed', 'Offtrack'],
            default: 'Active',
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Worker',
            },
        ],
        attachments: [
            {
                name: String,
                url: String,
                uploadedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        issues: [
            {
                title: String,
                severity: {
                    type: String,
                    enum: ['Low', 'Medium', 'High', 'Critical'],
                    default: 'Low',
                },
                status: {
                    type: String,
                    enum: ['Open', 'In Progress', 'Resolved'],
                    default: 'Open',
                },
                reportedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Project = mongoose.model('Project', projectSchema);

export default Project;
