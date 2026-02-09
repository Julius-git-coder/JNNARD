import 'dotenv/config';
import mongoose from 'mongoose';

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Connected to DB: ${mongoose.connection.name}`);

        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));

        for (const col of collections) {
            const count = await db.collection(col.name).countDocuments();
            console.log(` - ${col.name}: ${count} docs`);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
