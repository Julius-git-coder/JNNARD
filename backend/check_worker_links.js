import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Worker from './models/Worker.js';

dotenv.config();

const checkWorkers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const total = await Worker.countDocuments({});
        const missing = await Worker.countDocuments({ userId: { $exists: false } });
        const missingNull = await Worker.countDocuments({ userId: null });

        console.log(`Total Workers: ${total}`);
        console.log(`Workers missing userId: ${missing + missingNull}`);

        mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

checkWorkers();
