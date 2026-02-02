import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Worker from './models/Worker.js';

dotenv.config();

const clearUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const userCount = await User.countDocuments();
        const workerCount = await Worker.countDocuments();

        console.log(`Found ${userCount} users and ${workerCount} worker profiles.`);

        if (userCount === 0 && workerCount === 0) {
            console.log('Database is already clean.');
        } else {
            await User.deleteMany({});
            await Worker.deleteMany({});
            console.log('Successfully cleared all users and worker profiles.');
        }

        mongoose.disconnect();
    } catch (error) {
        console.error('Error clearing database:', error);
    }
};

clearUsers();
