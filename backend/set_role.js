import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Worker from './models/Worker.js';

dotenv.config();

const assignRole = async (email, role, workerName = null) => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            return;
        }

        user.role = role;
        if (!user.jobType) {
            user.jobType = role;
        }

        if (role === 'worker' && !user.workerProfile) {
            // Create a worker profile if it doesn't exist
            let worker = await Worker.findOne({ email });
            if (!worker) {
                worker = await Worker.create({
                    name: workerName || user.name,
                    email: user.email,
                    role: user.jobType || 'Intern',
                    userId: user._id
                });
            }
            user.workerProfile = worker._id;
            worker.userId = user._id;
            await worker.save();
        } else if (user.workerProfile) {
            // Update existing worker profile role
            await Worker.findByIdAndUpdate(user.workerProfile, { role: user.jobType });
        }

        await user.save();
        console.log(`Successfully updated ${email} to ${role}`);

        mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

// USAGE: node set_role.js <email> <role: admin|worker> <optional_worker_name>
const args = process.argv.slice(2);
if (args.length < 2) {
    console.log('Usage: node set_role.js <email> <role>');
} else {
    assignRole(args[0], args[1], args[2]);
}
