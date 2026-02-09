import 'dotenv/config';
import mongoose from 'mongoose';

const clusters = [
    'cluster0.anl4ogn.mongodb.net',
    'cluster0.wi0evjd.mongodb.net',
    'cluster0.kof779y.mongodb.net'
];

const passwords = [
    'S5Hkpt8ELu56zoMT',
    'yarndev',
    'Xpj6hMYEF0ATC6ze',
    'QYZwtdfTfp49f03a'
];

async function dumpData() {
    for (const cluster of clusters) {
        for (const pwd of passwords) {
            const uri = `mongodb+srv://daganajulius5_db_user:${pwd}@${cluster}/?appName=Cluster0`;
            try {
                const conn = await mongoose.createConnection(uri).asPromise();
                const admin = conn.db.admin();
                const dbs = await admin.listDatabases();

                for (const dbInfo of dbs.databases) {
                    const db = conn.useDb(dbInfo.name).db;
                    const collections = await db.listCollections().toArray();
                    for (const col of collections) {
                        const count = await db.collection(col.name).countDocuments();
                        if (count > 0) {
                            const oneDoc = await db.collection(col.name).findOne();
                            console.log(`CLUSTER: ${cluster} | DB: ${dbInfo.name} | COL: ${col.name} | COUNT: ${count}`);
                            console.log(`  SAMPLE: ${JSON.stringify(oneDoc).substring(0, 100)}`);
                        }
                    }
                }
                await conn.close();
            } catch (err) {
                // Ignore auth failures
            }
        }
    }
    process.exit(0);
}

dumpData();
