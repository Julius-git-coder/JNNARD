import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Performance from './models/Performance.js';

dotenv.config();

const checkPerformance = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const count = await Performance.countDocuments({});
        console.log(`Total Performance Records: ${count}`);

        if (count > 0) {
            const records = await Performance.find({}).limit(5);
            console.log('Sample Records:', JSON.stringify(records, null, 2));
        }

        mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

checkPerformance();
