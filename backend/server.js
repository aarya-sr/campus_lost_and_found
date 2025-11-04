import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';


dotenv.config();
const app = express();
app.get('/',(req,res)=>{
    res.send('Server is ready');
})

app.get('/products',(req,res)=>{
    
})

console.log(process.env.MONGO_URI);

app.listen(3000, () => {
    connectDB();
 
    console.log('Server is running on port 3000');
    });
