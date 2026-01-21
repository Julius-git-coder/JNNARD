import mongoose from 'mongoose';

const performanceSchema = new mongoose.Schema(
    {
        worker: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Worker',
            required: true,
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: true,
        },
        task: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task',
        },
        metric: {
            type: String, // e.g., 'Tasks Completed', 'Efficiency', 'Quality'
            required: true,
        },
        target: {
            type: Number, // e.g., 100% or 10 tasks
            required: true,
        },
        actual: {
            type: Number, // e.g., 80% or 8 tasks
            required: true,
        },
        status: {
            type: String,
            enum: ['On Track', 'Off Track', 'Exceeded', 'Needs Improvement'],
            default: 'On Track',
        },
        notes: {
            type: String,
        },
        evaluationDate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const Performance = mongoose.model('Performance', performanceSchema);

export default Performance;
