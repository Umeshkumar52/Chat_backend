import { getIo } from '../midilwares/IoInstance.js'
import notification from '../models/notificationSchema.js'
import user from '../models/user.js'
const io=getIo()
export const userNotification=async(req,res)=>{
   try {
    const{reciever_id}=req.params
    const response=await notification.find({reciever:reciever_id})
    .populate({
        path:"sender",
        select:['avatar','UserName','_id']
    })
    res.status(200).json({
        success:true,
        message:response
    })
   } catch (error) {
    res.status(402).json({
        success:false,
        message:"Unable to find notifcation"
    })
   }

}
export const notificationSave=async(req,res)=>{
    try {
        const{sender_id,reciever_id}=req.params
        const{message,type}=req.body
        const response=await notification.create({
            sender:sender_id,
            reciever:reciever_id,
            type:type,
            message:message
        })
        user.findByIdAndUpdate(reciever_id,{$inc:{unReadNotification:1}})
        io.to(reciever_id).emit("newNotification",response)
        io.to(reciever_id).emit("unReadNotification",response)
        res.status(200).json({
            success:true,
            message:response
        })
       } catch (error) {
        res.status(402).json({
            success:false,
            message:error
        })}}
export const updateUnReadNotification=async(req,res)=>{
    try {
        const{reciever_id}=req.params;
        const response=await user.findByIdAndUpdate(reciever_id,{unReadNotification:0})
        io.to(reciever_id).emit("unReadNotification",response)
        res.status(200).json({
            success:true,
            message:response
        })
       } catch (error) {
        res.status(402).json({
            success:false,
            message:"Unable update notification"
        })
       }
}
export const unReadNotification=async(req,res)=>{
    try {   
        const{reciever_id}=req.params
       const unReadNotification=await user.findById(reciever_id).select("unReadNotification") 
       res.status(200).json({
        success:true,
        message:unReadNotification
       })     
    } catch (error) {
        res.status(402).json({
            success:false,
            message:"unable to find unReadNotification"
           }) 
    }
}
export const specificNotifUpdate=async(req,res)=>{
    try {
     const{user_id,_id}=req.params
     await notification.updateOne({_id:_id},{isRead:true})
     await user.updateOne({_id:user_id},{$inc:{unReadNotification:-1}})
     res.status(200).json({
         success:true,
         message:"Updated"
     })
    } catch (error) {
     res.status(402).json({
         success:false,
         message:"Unable to update notifcation"
     })
    }
 
 }