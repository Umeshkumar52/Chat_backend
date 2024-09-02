import user from "../models/user.js";
const createUser=async(req,res)=>{
    try {
        const response=await user.create(req.body)
        res.status(200).json({
            success:true,
            message:response
        })
    } catch (error) {
      return res.status(512).json({
            success:false,
            message:"User Not Save, Try again"
        }) 
    }
 }
 const userInf=async(req,res)=>{
    try {
        const {Email_Phone,UserName}=req.body
        const response=await user.find({Email_Phone})
        res.status(200).json({
            success:true,
            message:response
        })
    } catch (error) {
        return res.status(512).json({
            success:false,
            message:error
        })
    }
 }
export {createUser,userInf}