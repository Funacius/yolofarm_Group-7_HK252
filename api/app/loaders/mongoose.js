const mongoose = require("mongoose");

async function mongooseLoader() {
  const url = process.env.DATABASE_URI;
  const dbName = process.env.DATABASE_NAME;
  //   console.log(url, dbName);
  try {
    const mongoConnection = await mongoose.connect(url, { dbName });
    return mongoConnection;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

module.exports = mongooseLoader;
