import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const users = await User.find({ email: /daganajulius/i });
        console.log('Found users:', users.map(u => ({ id: u._id, name: u.name, email: u.email })));

        mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

checkUsers();
