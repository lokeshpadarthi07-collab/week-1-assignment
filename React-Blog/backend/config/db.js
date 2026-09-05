import mongoose from 'mongoose';

/**
 * Connects to MongoDB using Mongoose.
 * If local MongoDB is unavailable, falls back to in-memory MongoDB server in dev mode.
 */
export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/react_blog_week2_db';

    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000,
    });

    console.log(`🍃 MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.warn(`⚠️ Primary MongoDB connection failed (${error.message}). Attempting MongoDB Memory Server fallback...`);
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();

      const conn = await mongoose.connect(memoryUri);
      console.log(`🍃 MongoDB Connected (In-Memory Fallback): ${conn.connection.host}/${conn.connection.name}`);
    } catch (fallbackError) {
      console.error(`❌ Database Connection Error: ${fallbackError.message}`);
      process.exit(1);
    }
  }
};
