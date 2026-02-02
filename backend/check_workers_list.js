
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Worker from './models/Worker.js';

dotenv.config();

const checkWorkers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const workers = await Worker.find({});
        console.log(`Found ${workers.length} workers:`);
        workers.forEach(w => {
            console.log(`Worker: ${w.name}, Email: ${w.email}, Role: ${w.role}`);
        });

        mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

checkWorkers();
