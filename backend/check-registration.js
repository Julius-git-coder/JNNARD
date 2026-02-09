import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const count = await User.countDocuments();
        console.log(`Total Users in DB: ${count}`);

        if (count > 0) {
            const users = await User.find().sort({ createdAt: -1 }).limit(3);
            console.log('Last 3 users:');
            users.forEach(u => console.log(`- ${u.name} (${u.email}) - Verified: ${u.isVerified}`));
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkUsers();
