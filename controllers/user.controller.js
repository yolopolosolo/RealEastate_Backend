import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getAllUsers = async (req,res)=>{
    try{
        const users =  await prisma.user.findMany();
        return res.status(200).json(users);
    }catch(err){
        return res.status(500).json({message:"Failed to get all users"})
    }

}

export const getUserById = async (req,res)=>{
    const id = req.params.id;
    try{
        const user =  await prisma.user.findUnique({
            where:{id}
        })
        return res.status(200).json(user);
    }catch(err){
        return res.status(500).json({message:"Failed to user by id"})
    }
}

export const updateUserById = async (req,res)=>{
    const id = req.params.id;
    const tokenUserId = req.userId;

    const {password, avatar, ...inputs} = req.body;

    if(id!== tokenUserId) return res.status(403).json({message:"Failed to update user"});

    let updatesPswd = null;

    try{
        if(password){
            updatesPswd = await bcrypt.hash(password,10);
        }


        const updatedUser =  await prisma.user.update({
            where:{id},
            data:{
                ...inputs,
                ...(updatesPswd && {password:updatesPswd}),
                ...(avatar && {avatar})
            }
        })

        const {password:userPassword, ...userData} = updatedUser

        return res.status(200).json(userData);
    }catch(err){
        return res.status(500).json({message:`Failed to update user`})
    }
}

export const deleteUser = async (req,res)=>{
    const id = req.params.id;
    const tokenUserId = req.userId;

    if(id!== tokenUserId) return res.status(403).json({message:"Failed to delete user"});
    try{
        await prisma.user.delete({
            where:{id}
        })
        return res.status(200).json({message:`User Deleted`});
    }catch(err){
        return res.status(500).json({message:"Failed to Delete user"})
    }
}

export const savePost = async (req,res)=>{
    const postId =  req.body.postId
    const tokenUserId =  req.userId;

    try{
        const savedPost = await prisma.savedPost.findUnique({
            where:{
                userId_postId:{
                    userId:tokenUserId,
                    postId
                }
            }
        });

        if(savedPost){
            await prisma.savedPost.delete({
                where:{
                    id:savedPost.id
                }
            })
            return res.status(200).json({message:"Post Removed from saved list"})
        }
        else{
            await prisma.savedPost.create({
                data:{
                    userId:tokenUserId,
                    postId
                }
            })
            return res.status(200).json({message:"Post Added to saved list"})
        }
    }catch(err){
        return res.status(500).json({message:"Failed to Save Post"})
    }
}

export const profilePosts = async(req,res)=>{
    const tokenUserId = req.userId
    try{
        const userPosts = await prisma.post.findMany({
            where:{
                userId:tokenUserId
            }
        })

        const savedUserPosts = await prisma.savedPost.findMany({
            where:{
                userId:tokenUserId
            },
            include:{post:true}
        })

        const savedPosts = savedUserPosts.map(item=> item.post);

        return res.status(200).json({userPosts,savedPosts})

    }
    catch(err){
        return res.status(500).json({message:"Failed to Get User Posts"})
    }
}

export const getNotificationNumber = async (req, res) => {
    const tokenUserId = req.userId;
    try {
      const number = await prisma.chat.count({
        where: {
          userIDs: {
            hasSome: [tokenUserId],
          },
          NOT: {
            seenBy: {
              hasSome: [tokenUserId],
            },
          },
        },
      });
      res.status(200).json(number);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to get profile posts!" });
    }
  };