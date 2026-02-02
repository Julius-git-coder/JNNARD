import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Worker from './models/Worker.js';

dotenv.config();

const checkFrank = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB\n');

        // Check User for frank
        const frankUser = await User.findOne({ email: 'frank@gmail.com' });
        if (frankUser) {
            console.log('✅ Frank User Found:');
            console.log('   Email:', frankUser.email);
            console.log('   Name:', frankUser.name);
            console.log('   Role:', frankUser.role);
            console.log('   JobType:', frankUser.jobType);
            console.log('   Worker Profile ID:', frankUser.workerProfile);
            console.log('   isVerified:', frankUser.isVerified);
            console.log('   Created:', frankUser.createdAt);
        } else {
            console.log('❌ Frank User NOT found');
        }

        console.log('');

        // Check Worker for frank
        const frankWorker = await Worker.findOne({ email: 'frank@gmail.com' });
        if (frankWorker) {
            console.log('✅ Frank Worker Found:');
            console.log('   Email:', frankWorker.email);
            console.log('   Name:', frankWorker.name);
            console.log('   Role:', frankWorker.role);
            console.log('   Avatar:', frankWorker.avatar);
            console.log('   Status:', frankWorker.status);
            console.log('   User ID:', frankWorker.userId);
            console.log('   Created:', frankWorker.createdAt);
        } else {
            console.log('❌ Frank Worker NOT found');
        }

        console.log('\n');
        console.log('=== ALL WORKERS ===');
        const allWorkers = await Worker.find({}).sort({ createdAt: 1 });
        allWorkers.forEach((w, i) => {
            console.log(`${i + 1}. ${w.name} (${w.role}) - ${w.email}`);
        });

        mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

checkFrank();
