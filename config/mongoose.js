import mongoose from "mongoose";

const mongo_url = process.env.MONGO_URL;

const dbConnection = async () => {
  try {
    if (!mongo_url) {
      throw new Error("Invalid MongoDB URL");
    }

    const connection = await mongoose.connect(mongo_url, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

export default dbConnection;
