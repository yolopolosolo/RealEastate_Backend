import prisma from "../lib/prisma.js"
import jwt from "jsonwebtoken";

export const allPosts = async (req, res) => {
    const query = req.query;
    try {
        const posts = await prisma.post.findMany({
            where:{
                city:query.city || undefined,
                type:query.type || undefined,
                property:query.property || undefined,
                bedroom: parseInt(query.bedroom) || undefined,
                price:{
                    gte:parseInt(query.minPrice) || undefined,
                    lte: parseInt(query.maxPrice) || undefined,
                }
            }
        });
        return res.status(200).json(posts);
    } catch (err) {
        return res.status(500).json({
            message: `Failed`
        })
    }
}

export const postById = async (req, res) => {
    const id = req.params.id;
    try {

        const token = req.cookies?.token;
        let isSaved;
        if (token) {
            
          jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
            if (!err) {
              const saved = await prisma.savedPost.findUnique({
                where: {
                  userId_postId: {
                    postId: id,
                    userId: payload.id,
                  },
                },
              });
              if(saved){
                isSaved = true;
              }
              else{
                isSaved =false;
              }
            }
          });
        }  

      const post = await prisma.post.findUnique({
        where: { id },
        include: {
          postDetail: true,
          user: {
            select: {
              username: true,
              avatar: true,
            },
          },
        },
      });
  
      
      return res.status(200).json({ ...post, isSaved: isSaved});
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to get post" });
    }
  };

export const addPost = async (req, res) => {
    const body = req.body;
    const userId = req.userId;
    try {
        const post =await prisma.post.create({
            data:{
                ...body.postData,
                userId,
                postDetail:{
                    create:body.postDetail
                }
            }
        }) 
        return res.status(200).json(post);
    } catch (err) {
        return res.status(500).json({
            message: `Failed to create post`
        })
    }
}

export const updatePost = async (req, res) => {
    try {
        return res.status(200).json();
    } catch (err) {
        return res.status(500).json({
            message: `Failed to update`
        })
    }
}

export const deletePost = async (req, res) => {
    const id = req.params.id;
    const tokenUserId = req.userId;
    try {
        const post =await prisma.post.findUnique({
            where:{id}
        });
        if(post.userId !== tokenUserId) return res.status(403).json({message: `Failed to delete`})


        await prisma.post.delete({
            where:{id}
        });
        return res.status(200).json({message:"Success"});
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: `Failed to delete`
        })
    }
}