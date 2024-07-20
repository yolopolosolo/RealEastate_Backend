import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getAllChats, getChatById , addChat, readChat} from "../controllers/chat.controller.js";
const router =  express.Router();

router.get("/all", verifyToken ,getAllChats);

router.get("/:id",verifyToken,getChatById);

router.post("/", verifyToken ,addChat);

router.put("/read/:id", verifyToken ,readChat);

export default router;