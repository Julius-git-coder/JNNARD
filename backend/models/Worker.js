import mongoose from 'mongoose';

const workerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        role: {
            type: String, // e.g., 'UI/UX Designer', 'Developer', 'Marketing Specialist'
            required: true,
        },
        avatar: {
            type: String,
            default: '',
        },
        email: {
            type: String,
            unique: true,
            sparse: true, // Allows null/undefined to be non-unique if we have workers without emails initially
        },
        status: {
            type: String,
            enum: ['Active', 'Inactive', 'Busy'],
            default: 'Active',
        },
    },
    {
        timestamps: true,
    }
);

const Worker = mongoose.model('Worker', workerSchema);

export default Worker;
