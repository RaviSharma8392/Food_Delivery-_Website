import mongoose from "mongoose";
import {URI} from "./server_Config.js";




 const connectDB = async () => {
  try {
    await mongoose.connect(URI)
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Error connecting to the database: " + error.message);
  }
};

export default connectDB;
