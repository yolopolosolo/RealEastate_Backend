import express from "express";
import { allPosts,postById,addPost,updatePost,deletePost } from "../controllers/post.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router()

router.get("/all",allPosts);

router.get("/:id",postById);

router.post("/create",verifyToken,addPost);

router.put("/:id",verifyToken,updatePost);

router.delete("/:id",verifyToken,deletePost);



export default router;