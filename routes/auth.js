import express from 'express';
import User from '../models/User.js';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import 'dotenv/config.js';
import fetchUser from '../middleware/fetchUser.js';
const router = express.Router();

router.post('/signup', async (req, res) => {
   
    const {name,email,password}=req.body
    try {
        // validation

        if(!name || !email|| !password){
            return res.status(400).json({error:"ALL fields are requried"})
        }

        // email validation
        if(!email.includes('@')){
            return res.status(400).json({error:"please enter a valid email"})
        }

        // Find Unique User with email
        const user=await User.findOne({email})

        if(user){
            return res.status(400).json({error:"user already exists"})
        }

        // generate salt
        const salt= await bcrypt.genSalt(10);

        // hash password
        const hashedPassword=await bcrypt.hash(password,salt)



        // save data into database
        const newUser=await User({
            name,
            email,
            password:hashedPassword,
        })

        await newUser.save();
        console.log(newUser);

        res.status(200).json({success:"signup succesfull"})
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server ERROR");
    }
})

router.post('/login', async (req,res)=>{
    // data coming from body
    const {email,password}=req.body;
    try {
        // validation
        if(!email || !password){
            return res.status(400).send({error:"All fileds are required}"})
        }

        //* Email Validation 
        if (!email.includes("@")) {
            return res.status(400).json({ error: "Please enter a valid email" })
        }

         //* Find Unique User with email
         const user = await User.findOne({ email });

         console.log(user)
 
         //* if user not exists with that email
         if (!user) {
             res.status(400).json({ error: "User Not Found" })
         }

        //* matching user password to hash password with bcrypt.compare()
        const doMatch = await bcrypt.compare(password, user.password)
        console.log(doMatch)

        //* if match password then generate token 
        if (doMatch) {
            const token = jwt.sign({ userId: user.id },"" + process.env.JWT_SECRET, {
                expiresIn: '7d'
            })

            res.status(201).json({ token ,success:"Login successfull"})
        }
        else {
            res.status(404).json({ error: 'Email And Password Not Found' })
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error")
    }
})

router.get('/getuser',fetchUser,async (req,res) => {
  try {
    const userId = req.userId;
    console.log("getuser Id",userId)
    const user=await User.findById(userId).select("-password")
    res.send(user);
  } catch(error) {
    console.log(error);
    res.status(500).send("internal server error");
  }
})

export default router