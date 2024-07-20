import express from "express";
import { getAllUsers,getUserById,updateUserById,deleteUser, savePost,profilePosts,getNotificationNumber } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router =  express.Router();

router.get("/getAllUsers", getAllUsers);

router.get("/search/:id",verifyToken ,getUserById);

router.put("/:id",verifyToken, updateUserById);

router.delete("/:id",verifyToken ,deleteUser);

router.post("/save",verifyToken ,savePost);

router.get("/profilePosts",verifyToken ,profilePosts);

router.get("/notification", verifyToken, getNotificationNumber);

export default router;