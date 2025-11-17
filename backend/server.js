import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import cors from 'cors';


dotenv.config();
const app = express();

const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('Server is ready');
})

//auth routes
app.use('/api/auth',authRoutes);

console.log(process.env.MONGO_URI);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    });
