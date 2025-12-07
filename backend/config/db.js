// import mongoose from 'mongoose';
// import dotenv from 'dotenv';

// dotenv.config();

// export const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI);
    
//   } catch (error) {
//     console.error(`Error: ${error.message}`);
//     process.exit(1);  //1 means failure, 0 means succes
//   }
// }


import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default connectDB;
