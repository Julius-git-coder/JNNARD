import 'dotenv/config';
import mongoose from 'mongoose';

async function clearData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;
        console.log(`Connected to: ${mongoose.connection.name}`);

        const collections = await db.listCollections().toArray();
        for (const col of collections) {
            const result = await db.collection(col.name).deleteMany({});
            console.log(` - Cleared ${result.deletedCount} documents from ${col.name}`);
        }

        console.log('Database cleanup successful.');
        process.exit(0);
    } catch (err) {
        console.error('Cleanup failed:', err);
        process.exit(1);
    }
}

clearData();
