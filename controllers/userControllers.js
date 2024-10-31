import path from "path";
import user from "../models/user.js";
import cloudinary from 'cloudinary'
import {getIo} from '../midilwares/IoInstance.js'
import notification from "../models/notificationSchema.js";
const cookieOptions={
    maxAge:new Date(Date.now()+24*60*60*1000),
    httpOnly:true,
    secure:false,
    sameSite:'None'
}
export const createUser=async(req,res)=>{
    try {       
        const {Email}=req.body
        const exist=await user.findOne({Email:Email})
        if(exist){
        return res.status(511).json({
            success:false,
            message:"Account allready exist"
        })}
        const userSave=await user.create(req.body) 
        if(req.file){
           const avatar= await cloudinary.v2.uploader.upload(req.file.path,{
                resource_type:'image',
                public_id:"avatar_"+Date.now()
            })
            userSave.avatar=avatar.secure_url  
            userSave.avatar_public_id=avatar.public_id
        } 
        userSave.save() 
        const token = await userSave.genJwtToken() 
       userSave.token=token
        user.Password=undefined
       res.cookie("token",token,cookieOptions)         
       return res.status(200).json({
            success:true,
            message:userSave
        })
    } catch (error) {
      return res.status(512).json({
            success:false,
            message:"Please Create Account Again"
        }) 
    }
 }
export const updateUser=async(req,res)=>{
    try { 
        const {_id,type}=req.body
        const cloudinary_res=await cloudinary.v2.uploader.upload(req.file.path,{
            resource_type:'image',
            public_id:"profileUpdate_"+Date.now()
        })
        let response;
        if(type=="profile"){  
         response=await user.findByIdAndUpdate(_id,{avatar:cloudinary_res.secure_url})
        }else{
            response=await user.findByIdAndUpdate(_id,{profileBanner:cloudinary_res.secure_url})
        }
        return res.status(200).json({
            success:true,
            message:response
        })
    } catch (error) {
        return res.status(500).json({
            success:true,
            message:error
        })
    }
 }
export const following=async(req,res)=>{
    try {
        let io=getIo()
        const{requester,reciever}=req.params          
         await user.findByIdAndUpdate(requester,{$push:{Following:reciever}})
         await user.findByIdAndUpdate(reciever,{
            $push:{Followers:requester},
            $inc:{unReadNotification:1}
        })
        const response=await notification.create({
            sender:requester,
            reciever:reciever,
            type:'following',
            message:`following you.`
        })
        io.to(reciever).emit("newNotification",response)
        io.to(reciever).emit("unReadNotification",response)
        io.emit("following",{reciever:reciever,requester:requester})
            return res.status(200).json({
                success:true,
                message:"Successfull"
            })
    } catch (error) {
       return res.status(500).json({
            success:false,
            message:error
        })
    }
 }
export const unfollowing=async(req,res)=>{
    try {
        let io=getIo()
        const{requester,reciever}=req.params          
         await user.updateOne({_id:requester},{$pull:{Following:reciever}})
         await user.updateOne({_id:reciever},{$pull:{Followers:requester}})
            io.emit("unfollowing",{reciever:reciever,requester:requester})
            return res.status(200).json({
                success:true,
                message:"Successfull"
            })
    } catch (error) {
       return res.status(500).json({
            success:false,
            message:error
        })
    }
 }
export const userFollowing=async(req,res)=>{
    try {
        const {user_id}=req.params;
        const response=await user.findById(user_id).select(["Following","Followers"])
        .populate({
            path:'Following',
            select:['UserName','avatar','Followers','Name']
        })
        .populate({
            path:'Followers',
            select:['UserName','avatar','Followers','Name']
        })
       return res.status(200).json({
            success:true,
            message:response
        })
    } catch (error) {
        return  res.status(500).json({
            success:false,
            message:error
        })
    }
 }
export const login=async(req,res)=>{
    try {
        const{UserName,Email,Phone,Password}=req.body
        const existUser=await user
        .findOne({Email:Email})
        .select("+Password")
        if(existUser==null || await existUser.validator(Password,existUser.Password)==false){
            return res.status(512).json({
                success:false,
                message:"Invalid Password"
            })}
            const token = await existUser.genJwtToken()        
            existUser.token=token
            user.password=undefined
           res.cookie("token",token,cookieOptions) 
          res.status(200).json({
                success:true,
                message:existUser
            })
    } catch (error) {
        return res.status(512).json({
            success:false,
            message:"Account not exist"
        })
    }
 }
export const logout=async(req,res)=>{
    try {
         res.cookie("token",null,{
            maxAge:null,
            httpOnly:true
         })
         res.status(200).json({
            success:true,
            message:"Logout Successfully"
        })
    } catch (error) {
       return res.status(500).json({
        success:false,
        message:error
       }) 
    }
 }
export const userWithAllPost=async(req,res)=>{
    try {
        const response=await user.find(req.params)
        .populate({
            path:"myPosts",
            populate:{
                path:"author",
                model:"user",
                select:["_id","Name","UserName","avatar",'Followers']
            }
        })
        .populate({
            path:"myReels",
            populate:{
                path:"author",
                model:"user",
                select:["_id","Name","UserName","avatar","Followers"]
            }
        })

        res.status(200).json({
            success:true,
            message:response
        })
    } catch (error) {
        res.status(512).json({
            success:false,
            message:"User does not exist"
        })
    }
 }
export const userInf=async(req,res)=>{
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
export const searchUsers=async(req,res)=>{
    try {
        const{UserName}=req.params
        if(UserName.length>2){
        const response=await user.find({UserName:{$regex:`^${UserName}`,$options:'i'}}).limit(11)
        res.status(200).json({
            success:true,
            message:response
        })
    }
    } catch (error) {
        return res.status(512).json({
            success:false,
            message:"User Not Found"
        })
    }
 }
