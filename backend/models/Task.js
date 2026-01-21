import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: true,
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Worker',
        },
        status: {
            type: String,
            enum: ['To Do', 'In Progress', 'Done', 'Blocked'],
            default: 'To Do',
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            default: 'Medium',
        },
        dueDate: {
            type: Date,
        },
        deliverables: {
            type: String, // Description of what needs to be delivered
        },
    },
    {
        timestamps: true,
    }
);

const Task = mongoose.model('Task', taskSchema);

export default Task;
