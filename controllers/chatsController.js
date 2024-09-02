import Conversation from "../models/Conversation.js";
import user from "../models/user.js";
import path from "path";
import cloudinary from 'cloudinary'
const SaveMessage=async(req,res)=>{
    try {      
        const{sender_id,msg}=req.body
        const _id=req.params._id  
        const existChat=await Conversation.findOne({$or:[{$and:[{reciever_id:sender_id},{sender_id:_id}]},{$and:[{reciever_id:_id},{sender_id:sender_id}]}]})       
        if(existChat){         
         if(req.file){
           const extension=path.extname(req.file.path)
            const options={
              overwrite:true
            }
            const result=await cloudinary.v2.uploader.upload(req.file.path)           
            const response=await Conversation.updateOne({$or:[{$and:[{reciever_id:sender_id},{sender_id:_id}]},{$and:[{reciever_id:_id},{sender_id:sender_id}]}]},{$push:{chats:{
               _id,
               url_type:extension,
               secure_url:result.secure_url,
            }}})       
            res.status(200).json({
               success:true,
               message:response
              })
            }else{
            const response=await Conversation.updateOne({$or:[{$and:[{reciever_id:sender_id},{sender_id:_id}]},{$and:[{reciever_id:_id},{sender_id:sender_id}]}]},{$push:{chats:{
               _id:_id,
               url_type:"msg",
               msg
              }}}) 
             return res.status(200).json({
               success:true,
               message:response
             })
         }
      }
          else{
            if(req.file){
               const extension=path.extname(req.file.path)
                const options={
                  overwrite:true
                }
                const result=await cloudinary.v2.uploader.upload(req.file.path)           
                const response=await Conversation.updateOne({$or:[{$and:[{reciever_id:sender_id},{sender_id:_id}]},{$and:[{reciever_id:_id},{sender_id:sender_id}]}]},{$push:{chats:{
                   _id,
                   url_type:extension,
                   secure_url:result.secure_url,
                }}})       
                res.status(200).json({
                   success:true,
                   message:response
                  })
                }else{
       const response=await Conversation.create({
        sender_id:sender_id,
        reciever_id:_id,
        chats:{
         _id:_id,
         url_type:"msg",
         msg
        }
       })
      return res.status(200).json({
        success:true,
        message:response
       })
      }
      }
      }catch (error) {
       return res.status(512).json({
        success:false,
        message:error
       }) 
   }
}
const GetAllMessages=async(req,res)=>{
   // const {sender_id}=req.body
   const {_id,sender_id}=req.params
   try {
      const response=await Conversation.find({$or:[{$and:[{reciever_id:sender_id},{sender_id:_id}]},{$and:[{reciever_id:_id},{sender_id:sender_id}]}]})
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
export {SaveMessage,GetAllMessages}