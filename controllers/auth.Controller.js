import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const register = async (req,res)=>{
    const {username, email, password} = req.body;

    try{
    //Hash the pswd
    const hasedPwd = await bcrypt.hash(password,10);

    //store the user
    const newUser = await prisma.user.create({
        data:{
            username,
            email,
            password:hasedPwd
        }
    })
    res.status(201).json({message:"User Created"})
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"User Creation failed"});
    }

   
}

export const login = async (req,res)=>{
    const {username,password} = req.body;

    try{

        const user = await prisma.user.findUnique({
            where:{username}
        });

        if(!user) return res.status(401).json({message:"Invalid Credentials"});

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if(!isPasswordValid) return res.status(401).json({message:"Invalid Credentials"});
        
        const age =  1000*60*60*24*7;

        const token = jwt.sign({
            id:user.id,
            name:user.username,
            email:user.email
        },process.env.JWT_SECRET_KEY,{expiresIn:age})


        const {password:userPassword, ...userInfo} = user

        //cookie
        //res.setHeader("Set-Cookie","test="+"myValue").json({message:"Success"});
        res.cookie("token",token,{
        httpOnly:true,
        //secure:true,
        maxAge:age
        }).status(200).json(userInfo);
        return;


    }
    catch(err){
        res.status(500).json({message:"Failed to login"});
    }
}

export const logout = (req,res)=>{

    res.clearCookie("token").status(200).json({message:"Logged OUT"});
    return;
    
}