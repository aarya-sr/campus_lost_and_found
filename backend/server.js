// import express from 'express';
// import dotenv from 'dotenv';
// import { connectDB } from './config/db.js';
// import authRoutes from './routes/authRoutes.js';
// import cors from 'cors';


// dotenv.config();
// const app = express();

// const PORT = process.env.PORT || 5001;

// app.use(cors());
// app.use(express.json());

// app.get('/',(req,res)=>{
//     res.send('Server is ready');
// })

// //auth routes
// app.use('/api/auth',authRoutes);

// console.log(process.env.MONGO_URI);

// connectDB().then(() => {
//     app.listen(PORT, () => {
//         console.log(`Server is running on port ${PORT}`);
//     });
// }).catch((err) => {
//     console.error("Failed to connect to MongoDB:", err);
//     });





// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./config/db");

// const authRoutes = require("./routes/authRoutes");     // already there
// const productRoutes = require("./routes/productRoutes");

// const app = express();

// app.use(cors({ origin: "http://localhost:3000", credentials: true }));
// app.use(express.json());

// connectDB();

// app.use("/api/auth", authRoutes);
// app.use("/api/products", productRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Backend running on ${PORT}`));






import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import claimRoutes from "./routes/claimRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
    exposedHeaders: ["Content-Length", "X-JSON"],
    optionsSuccessStatus: 200,
    preflightContinue: false,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/claims", claimRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
