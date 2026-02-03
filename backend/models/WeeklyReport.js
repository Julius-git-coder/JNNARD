import mongoose from 'mongoose';

const weeklyReportSchema = new mongoose.Schema(
    {
        worker: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Worker',
            required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task',
            required: true,
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: true,
        },
        summary: {
            type: String,
            required: true,
        },
        deliverableUrl: {
            type: String, // URL or link to the work
        },
        status: {
            type: String,
            enum: ['Submitted', 'Reviewed', 'Acknowledged'],
            default: 'Submitted',
        },
        feedback: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const WeeklyReport = mongoose.model('WeeklyReport', weeklyReportSchema);

export default WeeklyReport;
