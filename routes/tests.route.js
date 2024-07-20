import express from "express";
import { ShouldBeLoggedIn } from "../controllers/test.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";


const router= express.Router();

router.get("/should-be-logged-in",verifyToken,ShouldBeLoggedIn);

export default router;