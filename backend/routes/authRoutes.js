import express from 'express'; 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
    try{
    const{username,email,password} = req.body;
    if(!username || !email || !password){
        return res.status(400).json({message:'All fields are required'});
    }
    const userExists = await User.findOne({email});
    if(userExists){
        return res.status(400).json({message:'User already exists'});
    }
    const hashedPassword = await bcrypt.hash(password,10);
    const newUser = await User.create({username, email, password: hashedPassword});

    res.status(201).json({message: "User registered successfully", user: newUser});
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Server error"});
  }

});

//Login

router.post('/login', async (req, res) => {
    try{
    const{email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({message:'Please provide all fields'});
    }
    const user = await User.findOne({email});
    if(!user){
        return res.status(404).json({message:'User not found'});
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(400).json({message:'Invalid credentials'});
    }
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'6h'});

    res.status(200).json({message: "Login Successful", token});
  } catch (err) {
    console.log(err);
    res.status(500).json({message: "Server error"});
  }

});

export default router;