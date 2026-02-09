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

async function findData() {
    for (const cluster of clusters) {
        for (const pwd of passwords) {
            const uri = `mongodb+srv://daganajulius5_db_user:${pwd}@${cluster}/?appName=Cluster0`;
            console.log(`Trying ${cluster} with password length ${pwd.length}...`);
            try {
                const conn = await mongoose.createConnection(uri).asPromise();
                console.log(`  CONNECTED to ${cluster}`);
                const admin = conn.db.admin();
                const dbs = await admin.listDatabases();

                for (const dbInfo of dbs.databases) {
                    const db = conn.useDb(dbInfo.name).db;
                    const collections = await db.listCollections().toArray();
                    for (const col of collections) {
                        const count = await db.collection(col.name).countDocuments({ name: /Julius/i });
                        if (count > 0) {
                            console.log(`  !!! FOUND 'Julius' in ${dbInfo.name}.${col.name} !!!`);
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

findData();
