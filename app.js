import express from "express";
import postRoute from "./routes/post.route.js";
import authRoute from "./routes/auth.route.js";
import testRouter from "./routes/tests.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.route.js";
import chatRouter from "./routes/chat.route.js";
import messageRouter from "./routes/message.route.js";

const PORT = process.env.PORT || 8800;

const app = express();
app.use(cookieParser());
app.use(cors({origin: process.env.CLIENT_URL,credentials:true}));
app.use(express.json());




app.use("/api/posts",postRoute);
app.use("/api/auth", authRoute);
app.use("/api/user",userRouter);
app.use("/api/test", testRouter);
app.use("/api/chats",chatRouter);
app.use("/api/messages",messageRouter);

app.listen(PORT,()=>{
    console.log(`Server Started at ${PORT}`);
})