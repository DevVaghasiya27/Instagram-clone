import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI

const client = new MongoClient(uri);

async function run() {
    try {
        console.log("👉 Attempting to connect...");
        await client.connect();
        console.log("✅ Connected to MongoDB Atlas");
    } catch (e) {
        console.error("❌ Connection failed:", e);
    } finally {
        await client.close();
        console.log("🔌 Connection closed");
    }
}

run();
