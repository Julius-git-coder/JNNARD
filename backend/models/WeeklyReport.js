import mongoose from 'mongoose';

const weeklyReportSchema = new mongoose.Schema(
    {
        worker: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Worker',
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
        weekStartDate: {
            type: Date,
            required: true,
        },
        weekEndDate: {
            type: Date,
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
            enum: ['Submitted', 'Reviewed'],
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
