import mongoose from "mongoose";
import { ENV } from "./env";

const uri = ENV.MONGODB_URI;

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};
