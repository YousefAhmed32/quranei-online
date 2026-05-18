const mongoose = require('mongoose');

let gfsBucket;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Initialize GridFS bucket after connection
    const db = mongoose.connection.db;
    gfsBucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'media' });
    console.log('✅ GridFS bucket initialized');

    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const getGfsBucket = () => {
  if (!gfsBucket) throw new Error('GridFS bucket not initialized');
  return gfsBucket;
};

module.exports = { connectDB, getGfsBucket };
