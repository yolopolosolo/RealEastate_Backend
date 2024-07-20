import jwt from "jsonwebtoken";

export const ShouldBeLoggedIn = (req,res)=>{
   console.log(req.userId);
    return res.status(200).json({message:"You are authenticated"});
}
