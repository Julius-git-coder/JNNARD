import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Performance from './models/Performance.js';

dotenv.config();

const clearPerformance = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const result = await Performance.deleteMany({});
        console.log(`Deleted ${result.deletedCount} performance records.`);

        mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

clearPerformance();
