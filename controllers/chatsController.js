import conversation from '../models/conversation.js'
import user from "../models/user.js";
import path from "path";
import cloudinary from 'cloudinary'
const SaveTextCom=async(req,res)=>{
    try {            
        const{sender_id,message,time,type,msg_type}=req.body
        const {_id}=req.params        
        const existChat=await conversation.findOne({$or:[{$and:[{reciever_id:sender_id},{sender_id:_id}]},{$and:[{reciever_id:_id},{sender_id:sender_id}]}]}) 
        if(existChat){         
            const response=await conversation.updateOne({$or:[{$and:[{reciever_id:sender_id},{sender_id:_id}]},{$and:[{reciever_id:_id},{sender_id:sender_id}]}]},{$push:{chats:{
               reciever_id:_id,
               sender_id:sender_id,
               msg_type,
               time,
               message
              }}}) 
             return res.status(200).json({
               success:true,
               message:response
             })
      }
          else{   
       const response=await conversation.create({
         sender_id:sender_id,
         reciever_id:_id,
              chats:{ 
               reciever_id:_id,
               sender_id:sender_id,
               msg_type,
               time,
               message
            }
       })
      return res.status(200).json({
        success:true,
        message:response
       })
    
      }
      }catch (error) {
       return res.status(512).json({
        success:false,
        message:"Fail send message to user",error
       }) 
   }
}
const SaveSocialCom=async(req,res)=>{
   try {
      const{_id,sender_id}=req.params     
      const {time}=req.body
      if(req.file){
         const existChat=await conversation.findOne({$or:[{$and:[{reciever_id:sender_id},{sender_id:_id}]},{$and:[{reciever_id:_id},{sender_id:sender_id}]}]})   
         let imgResult;       
         if(req.file.mimetype=='video/mp4'){
         imgResult=await cloudinary.v2.uploader.upload(req.file.path, 
            { resource_type: "video", 
              quality:low,
              transformation:[
                { width:200, height:240, quality:low,crop: "fill",audio_codec: "none" }, 
               ],                                   
              eager_async: true,
              eager_notification_url: "http://localhost:3000/chats"
              })                 
        }else{
          imgResult=await cloudinary.v2.uploader.upload(req.file.path,{
            transformation:{
               width:200,height:240, crop:"scale",
            }
          }) 
        }
         if(existChat){                 
             const response=await conversation.updateOne({$or:[{$and:[{reciever_id:sender_id},{sender_id:_id}]},{$and:[{reciever_id:_id},{sender_id:sender_id}]}]},{$push:{chats:{
               reciever_id:_id,
               sender_id:sender_id,
               msg_type:"file",
               url_type:imgResult.format,
               time,
               secure_url:imgResult.secure_url,
               public_id:imgResult.public_id
             }}})       
             res.status(200).json({
                success:true,
                message:imgResult,response
               })
      }
          else{   
       const response=await conversation.create({
        sender_id:sender_id,
        reciever_id:_id,
        chats:{
               reciever_id:_id,
               sender_id:sender_id,
               msg_type:"file",
               url_type:imgResult.format,
               time,
               secure_url:imgResult.secure_url,
               public_id:imgResult.public_id
        }
       })
      res.status(200).json({
        success:true,
        message:response
       })
      }      
   }
   } catch (error) {
      res.status(512).json({
         success:false,
         message:error
      })
   }
}
const GetAllMessages=async(req,res)=>{
   // const {sender_id}=req.body
   const {_id,sender_id}=req.params
   try {
      const response=await conversation.find({$or:[{$and:[{reciever_id:sender_id},{sender_id:_id}]},{$and:[{reciever_id:_id},{sender_id:sender_id}]}]})
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
export {SaveTextCom,SaveSocialCom,GetAllMessages}