import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Worker from './models/Worker.js';

dotenv.config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const users = await User.find({}).populate('workerProfile');
        users.forEach(u => {
            console.log(`User: ${u.email}, Role: ${u.role}, Avatar: "${u.avatar}"`);
            if (u.workerProfile) {
                console.log(`  Worker Profile: ${u.workerProfile._id}, Avatar: "${u.workerProfile.avatar}"`);
            }
        });

        mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

checkUsers();
